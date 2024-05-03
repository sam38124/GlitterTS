"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shopping = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const financial_service_js_1 = __importDefault(require("./financial-service.js"));
const private_config_js_1 = require("../../services/private_config.js");
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const user_js_1 = require("./user.js");
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const invoice_js_1 = require("./invoice.js");
class Shopping {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async deleteRebate(cf) {
        try {
            await database_js_1.default.query(`update \`${this.app}\`.t_rebate
                            set status= -2
                            where id in (?)`, [cf.id.split(',')]);
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }
    async getProduct(query) {
        try {
            let querySql = [`(content->>'$.type'='product')`];
            query.search &&
                querySql.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`);
            query.id && querySql.push(`(content->>'$.id' = ${query.id})`);
            query.collection &&
                querySql.push(`(${query.collection
                    .split(',')
                    .map((dd) => {
                    return `(JSON_EXTRACT(content, '$.collection') LIKE '%${dd}%')`;
                })
                    .join(' or ')})`);
            query.id_list && querySql.push(`(content->>'$.id' in (${query.id_list}))`);
            query.status && querySql.push(`(JSON_EXTRACT(content, '$.status') = '${query.status}')`);
            query.min_price &&
                querySql.push(`(CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.variants[0].sale_price')) AS SIGNED)>=${query.min_price}) `);
            query.max_price &&
                querySql.push(`(CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.variants[0].sale_price')) AS SIGNED)<=${query.max_price}) `);
            const data = await this.querySql(querySql, query);
            const productList = Array.isArray(data.data) ? data.data : [data.data];
            if (this.token && this.token.userID) {
                for (const b of productList) {
                    b.content.in_wish_list =
                        (await database_js_1.default.query(`select count(1)
                                                               FROM \`${this.app}\`.t_post
                                                               where (content ->>'$.type'='wishlist')
                                                                 and userID = ${this.token.userID}
                                                                 and (content ->>'$.product_id'=${b.id})
                    `, []))[0]['count(1)'] == '1';
                }
            }
            if (productList.length > 0) {
                const stockList = await database_js_1.default.query(`SELECT *, \`${this.app}\`.t_stock_recover.id as recoverID
                                                    FROM \`${this.app}\`.t_stock_recover,
                                                         \`${this.app}\`.t_checkout
                                                    where product_id in (${productList
                    .map((dd) => {
                    return dd.id;
                })
                    .join(',')})
                                                      and order_id = cart_token
                                                      and dead_line < ?;`, [new Date()]);
                const trans = await database_js_1.default.Transaction.build();
                for (const stock of stockList) {
                    const product = productList.find((dd) => {
                        return `${dd.id}` === `${stock.product_id}`;
                    });
                    const variant = product.content.variants.find((dd) => {
                        return dd.spec.join('-') === stock.spec;
                    });
                    variant.stock += stock.count;
                    if (stock.status != 1) {
                        await trans.execute(`update \`${this.app}\`.\`t_manager_post\`
                                             SET ?
                                             where 1 = 1
                                               and id = ${stock.product_id}`, [
                            {
                                content: JSON.stringify(product.content),
                            },
                        ]);
                    }
                    await trans.execute(`delete
                                         from \`${this.app}\`.t_stock_recover
                                         where id = ?`, [stock.recoverID]);
                }
                await trans.commit();
            }
            return data;
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }
    async querySql(querySql, query) {
        let sql = `SELECT *
                   FROM \`${this.app}\`.t_manager_post
                   where ${querySql.join(' & ')} ${query.order_by || `order by id desc`}
        `;
        if (query.id) {
            const data = (await database_js_1.default.query(`SELECT *
                                          FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, []))[0];
            return {
                data: data,
                result: !!data,
            };
        }
        else {
            return {
                data: await database_js_1.default.query(`SELECT *
                                       FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, []),
                total: (await database_js_1.default.query(`SELECT count(1)
                                        FROM (${sql}) as subqyery`, []))[0]['count(1)'],
            };
        }
    }
    async deleteProduct(query) {
        try {
            await database_js_1.default.query(`delete
                            FROM \`${this.app}\`.t_manager_post
                            where id in (?)`, [query.id.split(',')]);
            return {
                result: true,
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }
    async deleteVoucher(query) {
        try {
            await database_js_1.default.query(`delete
                            FROM \`${this.app}\`.t_manager_post
                            where id in (?)`, [query.id.split(',')]);
            return {
                result: true,
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }
    async toCheckout(data, type = 'add') {
        var _a, _b;
        try {
            if (!data.email && type !== 'preview') {
                if (data.user_info.email) {
                    data.email = data.user_info.email;
                }
                else {
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error:No email address.', null);
                }
            }
            if (data.use_rebate && data.use_rebate > 0) {
                const userData = await new user_js_1.User(this.app).getUserData(data.email || data.user_info.email, 'account');
                if (userData) {
                    const sum = (await database_js_1.default.query(`SELECT sum(money)
                                                 FROM \`${this.app}\`.t_rebate
                                                 where status in (1, 2)
                                                   and userID = ?`, [userData.userID]))[0]['sum(money)'] || 0;
                    if (sum < data.use_rebate) {
                        data.use_rebate = 0;
                    }
                }
                else {
                    data.use_rebate = 0;
                }
            }
            const shipment = ((_a = (await private_config_js_1.Private_config.getConfig({
                appName: this.app,
                key: 'glitter_shipment',
            }))) !== null && _a !== void 0 ? _a : [
                {
                    basic_fee: 0,
                    weight: 0,
                },
            ])[0].value;
            const shipment_setting = await new Promise(async (resolve, reject) => {
                var _a;
                try {
                    resolve(((_a = (await private_config_js_1.Private_config.getConfig({
                        appName: this.app,
                        key: 'logistics_setting',
                    }))) !== null && _a !== void 0 ? _a : [
                        {
                            value: {
                                support: [],
                            },
                        },
                    ])[0].value.support);
                }
                catch (e) {
                    resolve([]);
                }
            });
            const carData = {
                lineItems: [],
                total: 0,
                email: (_b = data.email) !== null && _b !== void 0 ? _b : ((data.user_info && data.user_info.email) || ''),
                user_info: data.user_info,
                shipment_fee: shipment.basic_fee,
                rebate: 0,
                use_rebate: data.use_rebate || 0,
                orderID: `${new Date().getTime()}`,
                shipment_support: shipment_setting,
                use_wallet: 0,
            };
            for (const b of data.lineItems) {
                try {
                    const pdDqlData = (await this.getProduct({
                        page: 0,
                        limit: 50,
                        id: b.id,
                        status: 'active',
                    })).data;
                    console.log('======================================');
                    if (pdDqlData) {
                        const pd = pdDqlData.content;
                        const variant = pd.variants.find((dd) => {
                            return dd.spec.join('-') === b.spec.join('-');
                        });
                        console.log(`pd: ${pd.title}`);
                        console.log(`b.count: ${b.count}`);
                        console.log(`variant.stock: ${variant.stock}`);
                        console.log(`variant.show_understocking: ${variant.show_understocking}`);
                        if ((Number.isInteger(variant.stock) || variant.show_understocking === 'false') &&
                            Number.isInteger(b.count)) {
                            if (variant.stock < b.count && variant.show_understocking !== 'false') {
                                b.count = variant.stock;
                            }
                            console.log(`after b.count: ${b.count}`);
                            if (variant && b.count > 0) {
                                b.preview_image = variant.preview_image || pd.preview_image[0];
                                b.title = pd.title;
                                b.sale_price = variant.sale_price;
                                b.collection = pd['collection'];
                                b.sku = variant.sku;
                                b.shipment_fee = variant.shipment_weight * shipment.weight * b.count || 0;
                                variant.shipment_weight = parseInt(variant.shipment_weight || 0);
                                carData.shipment_fee += b.shipment_fee;
                                carData.lineItems.push(b);
                                carData.total += variant.sale_price * b.count;
                            }
                            if (type !== 'preview') {
                                const countless = variant.stock - b.count;
                                variant.stock = countless > 0 ? countless : 0;
                                await database_js_1.default.query(`update \`${this.app}\`.\`t_manager_post\`
                                                SET ?
                                                where 1 = 1
                                                  and id = ${pdDqlData.id}`, [
                                    {
                                        content: JSON.stringify(pd),
                                    },
                                ]);
                                let deadTime = new Date();
                                deadTime.setMinutes(deadTime.getMinutes() + 15);
                                await database_js_1.default.query(`insert into \`${this.app}\`.\`t_stock_recover\` set ?`, [
                                    {
                                        product_id: pdDqlData.id,
                                        spec: variant.spec.join('-'),
                                        dead_line: deadTime,
                                        order_id: carData.orderID,
                                        count: b.count,
                                    },
                                ]);
                            }
                        }
                    }
                }
                catch (e) { }
            }
            carData.total += carData.shipment_fee;
            carData.total -= carData.use_rebate;
            carData.code = data.code;
            const voucherList = await this.checkVoucher(carData);
            if (type === 'preview') {
                return {
                    data: carData,
                };
            }
            const userData = await new user_js_1.User(this.app).getUserData(data.email || data.user_info.email, 'account');
            if (carData.use_rebate) {
                await database_js_1.default.query(`insert into \`${this.app}\`.t_rebate (orderID, userID, money, status, note)
                                values (?, ?, ?, ?, ?);`, [
                    carData.orderID,
                    userData.userID,
                    carData.use_rebate * -1,
                    1,
                    JSON.stringify({
                        note: '使用回饋金購物',
                    }),
                ]);
            }
            const sum = (await database_js_1.default.query(`SELECT sum(money)
                                         FROM \`${this.app}\`.t_wallet
                                         where status in (1, 2)
                                           and userID = ?`, [userData.userID]))[0]['sum(money)'] || 0;
            if (sum < carData.total) {
                carData.use_wallet = sum;
            }
            else {
                carData.use_wallet = carData.total;
            }
            carData.total -= carData.use_wallet;
            if (carData.total === 0) {
                await database_js_1.default.query(`insert into \`${this.app}\`.t_wallet (orderID, userID, money, status, note)
                                values (?, ?, ?, ?, ?);`, [
                    carData.orderID,
                    userData.userID,
                    carData.use_wallet * -1,
                    1,
                    JSON.stringify({
                        note: '使用錢包購物',
                    }),
                ]);
                await database_js_1.default.execute(`insert into \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                                  values (?, ?, ?, ?)`, [carData.orderID, 1, carData.email, carData]);
                if (carData.use_wallet > 0) {
                    new invoice_js_1.Invoice(this.app).postCheckoutInvoice(carData.orderID);
                }
                return {
                    is_free: true,
                };
            }
            else {
                const id = 'redirect_' + tool_js_1.default.randomString(6);
                await redis_js_1.default.setValue(id, data.return_url);
                const keyData = (await private_config_js_1.Private_config.getConfig({
                    appName: this.app,
                    key: 'glitter_finance',
                }))[0].value;
                const subMitData = await new financial_service_js_1.default(this.app, {
                    HASH_IV: keyData.HASH_IV,
                    HASH_KEY: keyData.HASH_KEY,
                    ActionURL: keyData.ActionURL,
                    NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}`,
                    ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                    MERCHANT_ID: keyData.MERCHANT_ID,
                    TYPE: keyData.TYPE,
                }).createOrderPage(carData);
                if (keyData.TYPE === 'off_line') {
                    return {
                        off_line: true,
                    };
                }
                return {
                    form: subMitData,
                };
            }
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error:' + e, null);
        }
    }
    async checkVoucher(cart) {
        var _a;
        const shipment = ((_a = (await private_config_js_1.Private_config.getConfig({
            appName: this.app,
            key: 'glitter_shipment',
        }))) !== null && _a !== void 0 ? _a : [
            {
                basic_fee: 0,
                weight: 0,
            },
        ])[0].value;
        cart.discount = 0;
        cart.lineItems.map((dd) => {
            dd.discount_price = 0;
            dd.rebate = 0;
        });
        let overlay = false;
        const code = cart.code;
        const voucherList = (await this.querySql([`(content->>'$.type'='voucher')`], {
            page: 0,
            limit: 10000,
        })).data
            .map((dd) => {
            return dd.content;
        })
            .filter((dd) => {
            return (new Date(dd.start_ISO_Date).getTime() < new Date().getTime() &&
                (!dd.end_ISO_Date || new Date(dd.end_ISO_Date).getTime() > new Date().getTime()));
        })
            .filter((dd) => {
            let item = [];
            switch (dd.for) {
                case 'collection':
                    item = cart.lineItems.filter((dp) => {
                        return dd.forKey.filter((d1) => {
                            return dp.collection.find((d2) => {
                                return d2 === d1;
                            });
                        });
                    });
                    dd.bind = item;
                    return item.length > 0;
                case 'product':
                    item = cart.lineItems.filter((dp) => {
                        return (dd.forKey
                            .map((dd) => {
                            return `${dd}`;
                        })
                            .indexOf(`${dp.id}`) !== -1);
                    });
                    dd.bind = item;
                    return item.length > 0;
                case 'all':
                    item = cart.lineItems.filter((dp) => {
                        return true;
                    });
                    dd.bind = item;
                    return item.length > 0;
            }
        })
            .filter((dd) => {
            return dd.trigger === 'auto' || dd.code === `${code}`;
        })
            .filter((dd) => {
            return dd.rule === 'min_count'
                ? cart.lineItems.length >= parseInt(`${dd.ruleValue}`, 10)
                : cart.total >= parseInt(`${dd.ruleValue}`, 10);
        })
            .sort(function (a, b) {
            let compareB = b
                .bind.map((dd) => {
                if (b.reBackType === 'shipment_free') {
                    return dd.shipment_fee;
                }
                else {
                    return b.method === 'percent'
                        ? (dd.sale_price * parseFloat(b.value)) / 100
                        : parseFloat(b.value);
                }
            })
                .reduce(function (accumulator, currentValue) {
                return accumulator + currentValue;
            }, 0);
            let compareA = a
                .bind.map((dd) => {
                if (a.reBackType === 'shipment_free') {
                    return dd.shipment_fee;
                }
                else {
                    return a.method === 'percent'
                        ? (dd.sale_price * parseFloat(a.value)) / 100
                        : parseFloat(a.value);
                }
            })
                .reduce(function (accumulator, currentValue) {
                return accumulator + currentValue;
            }, 0);
            return compareB - compareA;
        })
            .filter((dd) => {
            if (!overlay && !dd.overlay) {
                overlay = true;
                return true;
            }
            return dd.overlay;
        })
            .filter((dd) => {
            var _a, _b;
            dd.discount_total = (_a = dd.discount_total) !== null && _a !== void 0 ? _a : 0;
            dd.rebate_total = (_b = dd.rebate_total) !== null && _b !== void 0 ? _b : 0;
            dd.bind = dd.bind.filter((d2) => {
                if (dd.reBackType === 'shipment_free') {
                    cart.shipment_fee -= d2.shipment_fee;
                    cart.total -= d2.shipment_fee;
                    return true;
                }
                else {
                    let discount = dd.method === 'percent'
                        ? (d2.sale_price * parseFloat(dd.value)) / 100
                        : parseFloat(dd.value);
                    if (d2.discount_price + discount < d2.sale_price) {
                        if (dd.reBackType === 'rebate') {
                            d2.rebate += discount;
                            cart.rebate += discount * d2.count;
                            dd.rebate_total += discount * d2.count;
                        }
                        else {
                            d2.discount_price += discount;
                            cart.discount += discount * d2.count;
                            dd.discount_total += discount * d2.count;
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            });
            return dd.bind.length > 0;
        });
        if (!voucherList.find((d2) => {
            return d2.code === `${cart.code}`;
        })) {
            cart.code = undefined;
        }
        if (voucherList.find((d2) => {
            return d2.reBackType === 'shipment_free';
        })) {
            const basic = shipment.basic_fee;
            cart.shipment_fee = cart.shipment_fee - basic;
            cart.total -= basic;
        }
        cart.total = cart.total - cart.discount;
        cart.voucherList = voucherList;
    }
    async putOrder(data) {
        try {
            const update = {};
            data.orderData && (update.orderData = JSON.stringify(data.orderData));
            data.status && (update.status = data.status);
            await database_js_1.default.query(`update \`${this.app}\`.t_checkout
                            set ?
                            where id = ?`, [update, data.id]);
            return {
                result: 'success',
                orderData: data.orderData,
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'putOrder Error:' + e, null);
        }
    }
    async deleteOrder(req) {
        try {
            await database_js_1.default.query(`delete
                            FROM \`${this.app}\`.t_checkout
                            where id in (?)`, [req.id.split(',')]);
            return {
                result: true,
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'deleteOrder Error:' + e, null);
        }
    }
    async getCheckOut(query) {
        try {
            let querySql = ['1=1'];
            query.email && querySql.push(`(email=${database_js_1.default.escape(query.email)})`);
            query.search &&
                querySql.push([
                    `((UPPER(Cart_token) LIKE UPPER('%${query.search}%'))`,
                    `(UPPER(JSON_UNQUOTE(orderData->>'$.email')) LIKE UPPER('%${query.search}%')))`,
                    `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.user_info.name')) LIKE UPPER('%${query.search}%')))`,
                ].join('||'));
            query.status && querySql.push(`status=${query.status}`);
            query.id && querySql.push(`(content->>'$.id'=${query.id})`);
            let sql = `SELECT *
                       FROM \`${this.app}\`.t_checkout
                       where ${querySql.join(' & ')}
                       order by id desc`;
            if (query.id) {
                const data = (await database_js_1.default.query(`SELECT *
                                              FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, []))[0];
                return {
                    data: data,
                    result: !!data,
                };
            }
            else {
                return {
                    data: await database_js_1.default.query(`SELECT *
                                           FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, []),
                    total: (await database_js_1.default.query(`SELECT count(1)
                                            FROM (${sql}) as subqyery`, []))[0]['count(1)'],
                };
            }
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }
    async postVariantsAndPriceValue(content) {
        var _a, _b, _c;
        content.variants = (_a = content.variants) !== null && _a !== void 0 ? _a : [];
        content.id &&
            (await database_js_1.default.query(`delete
                                       from \`${this.app}\`.t_manager_post
                                       where (content ->>'$.product_id'=${content.id})`, []));
        for (const a of content.variants) {
            content.min_price = (_b = content.min_price) !== null && _b !== void 0 ? _b : a.sale_price;
            content.max_price = (_c = content.max_price) !== null && _c !== void 0 ? _c : a.sale_price;
            if (a.sale_price < content.min_price) {
                content.min_price = a.sale_price;
            }
            if (a.sale_price > content.max_price) {
                content.max_price = a.sale_price;
            }
            a.type = 'variants';
            a.product_id = content.id;
            await database_js_1.default.query(`insert into \`${this.app}\`.t_manager_post
                            SET ?`, [
                {
                    content: JSON.stringify(a),
                    userID: this.token.userID,
                },
            ]);
        }
    }
    async getDataAnalyze(tags) {
        try {
            if (tags.length > 0) {
                const result = {};
                for (const tag of tags) {
                    switch (tag) {
                        case 'recent_active_user':
                            result[tag] = await this.getRecentActiveUser();
                            break;
                        case 'recent_sales':
                            result[tag] = await this.getSalesInRecentMonth();
                            break;
                        case 'recent_orders':
                            result[tag] = await this.getOrdersInRecentMonth();
                            break;
                        case 'hot_products':
                            result[tag] = await this.getHotProducts();
                            break;
                        case 'order_avg_sale_price':
                            result[tag] = await this.getOrderAvgSalePrice();
                            break;
                        case 'orders_per_month_1_year':
                            result[tag] = await this.getOrdersPerMonth1Year();
                            break;
                        case 'sales_per_month_1_year':
                            result[tag] = await this.getSalesPerMonth1Year();
                            break;
                    }
                }
                return result;
            }
            return {};
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getDataAnalyze Error:' + e, null);
        }
    }
    async getRecentActiveUser() {
        try {
            const recentSQL = `
                SELECT * FROM \`${this.app}\`.t_user
                WHERE online_time BETWEEN DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND NOW();
            `;
            const recent_users = await database_js_1.default.query(recentSQL, []);
            const monthSQL = `
                SELECT * FROM \`${this.app}\`.t_user
                WHERE MONTH(online_time) = MONTH(NOW()) AND YEAR(online_time) = YEAR(NOW());
            `;
            const month_users = await database_js_1.default.query(monthSQL, []);
            return { recent: recent_users.length, months: month_users.length };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getSalesInRecentMonth() {
        try {
            const recentMonthSQL = `
                SELECT * FROM \`${this.app}\`.t_checkout
                WHERE MONTH(created_time) = MONTH(NOW()) AND YEAR(created_time) = YEAR(NOW()) AND status = 1;
            `;
            const recentMonthCheckouts = await database_js_1.default.query(recentMonthSQL, []);
            let recent_month_total = 0;
            recentMonthCheckouts.map((checkout) => {
                recent_month_total += parseInt(checkout.orderData.total, 10);
            });
            const previousMonthSQL = `
                SELECT * FROM \`${this.app}\`.t_checkout
                WHERE 
                    MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH)) 
                    AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH))
                    AND status = 1;
            `;
            const previousMonthCheckouts = await database_js_1.default.query(previousMonthSQL, []);
            let previous_month_total = 0;
            previousMonthCheckouts.map((checkout) => {
                previous_month_total += parseInt(checkout.orderData.total, 10);
            });
            let gap = 0;
            if (recent_month_total !== 0 && previous_month_total !== 0) {
                gap = Math.floor(((recent_month_total - previous_month_total) / previous_month_total) * 10000) / 10000;
            }
            return { recent_month_total, previous_month_total, gap };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getHotProducts() {
        try {
            const checkoutSQL = `
                SELECT JSON_EXTRACT(orderData, '$.lineItems') as lineItems FROM \`${this.app}\`.t_checkout
                WHERE created_time BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();
            `;
            const checkouts = await database_js_1.default.query(checkoutSQL, []);
            const series = [];
            const categories = [];
            const product_list = [];
            for (const checkout of checkouts) {
                for (const item1 of checkout.lineItems) {
                    const index = product_list.findIndex((item2) => item1.title === item2.title);
                    if (index === -1) {
                        product_list.push({ title: item1.title, count: item1.count });
                    }
                    else {
                        product_list[index].count += item1.count;
                    }
                }
            }
            const final_product_list = product_list.sort((a, b) => (a.count < b.count ? 1 : -1));
            for (let index = 0; index < 10; index++) {
                if (final_product_list[index]) {
                    const element = final_product_list[index];
                    series.push(element.count);
                    categories.push(element.title);
                }
            }
            return { series, categories };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrdersInRecentMonth() {
        try {
            const recentMonthSQL = `
                SELECT id FROM \`${this.app}\`.t_checkout
                WHERE MONTH(created_time) = MONTH(NOW()) AND YEAR(created_time) = YEAR(NOW()) AND status = 1;
            `;
            const recentMonthCheckouts = await database_js_1.default.query(recentMonthSQL, []);
            let recent_month_total = recentMonthCheckouts.length;
            const previousMonthSQL = `
                SELECT id FROM \`${this.app}\`.t_checkout
                WHERE 
                    MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH)) 
                    AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH))
                    AND status = 1;
            `;
            const previousMonthCheckouts = await database_js_1.default.query(previousMonthSQL, []);
            let previous_month_total = previousMonthCheckouts.length;
            let gap = 0;
            if (recent_month_total !== 0 && previous_month_total !== 0) {
                gap = Math.floor(((recent_month_total - previous_month_total) / previous_month_total) * 10000) / 10000;
            }
            return { recent_month_total, previous_month_total, gap };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrdersPerMonth1Year() {
        try {
            const countArray = [];
            for (let index = 0; index < 12; index++) {
                const orderCountSQL = `
                    SELECT count(id) as c FROM \`${this.app}\`.t_checkout
                    WHERE 
                        MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL ${index} MONTH)) 
                        AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL ${index} MONTH))
                        AND status = 1;
                `;
                const orders = await database_js_1.default.query(orderCountSQL, []);
                countArray.unshift(orders[0].c);
            }
            return { countArray };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getSalesPerMonth1Year() {
        try {
            const countArray = [];
            for (let index = 0; index < 12; index++) {
                const monthCheckoutSQL = `
                    SELECT orderData FROM \`${this.app}\`.t_checkout
                    WHERE 
                        MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL ${index} MONTH)) 
                        AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL ${index} MONTH))
                        AND status = 1;
                `;
                const monthCheckout = await database_js_1.default.query(monthCheckoutSQL, []);
                let total = 0;
                monthCheckout.map((checkout) => {
                    total += parseInt(checkout.orderData.total, 10);
                });
                countArray.unshift(total);
            }
            return { countArray };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrderAvgSalePrice() {
        try {
            const countArray = [];
            for (let index = 0; index < 14; index++) {
                const monthCheckoutSQL = `
                    SELECT orderData FROM \`${this.app}\`.t_checkout
                    WHERE 
                        DAY(created_time) = DAY(DATE_SUB(NOW(), INTERVAL ${index} DAY))
                        AND MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL ${index} DAY)) 
                        AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL ${index} DAY))
                        AND status = 1;
                `;
                const monthCheckout = await database_js_1.default.query(monthCheckoutSQL, []);
                let total = 0;
                monthCheckout.map((checkout) => {
                    total += parseInt(checkout.orderData.total, 10);
                });
                if (monthCheckout.length == 0) {
                    countArray.unshift(0);
                }
                else {
                    countArray.unshift(Math.floor((total / monthCheckout.length) * 100) / 100);
                }
            }
            return { countArray };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
}
exports.Shopping = Shopping;
//# sourceMappingURL=shopping.js.map
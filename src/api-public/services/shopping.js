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
const express_1 = __importDefault(require("express"));
const rebate_js_1 = require("./rebate.js");
const custom_code_js_1 = require("../services/custom-code.js");
const moment_1 = __importDefault(require("moment"));
const notify_js_1 = require("./notify.js");
class Shopping {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async getProduct(query) {
        try {
            let querySql = [`(content->>'$.type'='product')`];
            if (query.search) {
                switch (query.searchType) {
                    case 'sku':
                        querySql.push(`JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`);
                        break;
                    case 'barcode':
                        querySql.push(`JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`);
                        break;
                    case 'title':
                    default:
                        querySql.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`);
                        break;
                }
            }
            query.id && querySql.push(`(content->>'$.id' = ${query.id})`);
            query.collection &&
                querySql.push(`(${query.collection
                    .split(',')
                    .map((dd) => {
                    return `(JSON_EXTRACT(content, '$.collection') LIKE '%${dd}%')`;
                })
                    .join(' or ')})`);
            query.sku && querySql.push(`(id in ( select product_id from \`${this.app}\`.t_variants where content->>'$.sku'=${database_js_1.default.escape(query.sku)}))`);
            if (!query.id && query.status === 'active' && query.with_hide_index !== 'true') {
                querySql.push(`((content->>'$.hideIndex' is NULL) || (content->>'$.hideIndex'='false'))`);
            }
            query.id_list && querySql.push(`(content->>'$.id' in (${query.id_list}))`);
            query.status && querySql.push(`(JSON_EXTRACT(content, '$.status') = '${query.status}')`);
            query.min_price && querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price'>=${query.min_price})) `);
            query.max_price && querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price'<=${query.max_price})) `);
            const data = await this.querySql(querySql, query);
            const productList = Array.isArray(data.data) ? data.data : [data.data];
            if (this.token && this.token.userID) {
                for (const b of productList) {
                    b.content.in_wish_list =
                        (await database_js_1.default.query(`SELECT count(1)
                                 FROM \`${this.app}\`.t_post
                                 WHERE (content ->>'$.type'='wishlist')
                                   and userID = ${this.token.userID}
                                   and (content ->>'$.product_id'=${b.id})`, []))[0]['count(1)'] == '1';
                }
            }
            if (productList.length > 0) {
                const stockList = await database_js_1.default.query(`SELECT *, \`${this.app}\`.t_stock_recover.id as recoverID
                     FROM \`${this.app}\`.t_stock_recover,
                          \`${this.app}\`.t_checkout
                     WHERE product_id in (${productList
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
                    if (variant) {
                        variant.stock += stock.count;
                        if (stock.status != 1) {
                            await trans.execute(`UPDATE \`${this.app}\`.\`t_manager_post\`
                                 SET ?
                                 WHERE 1 = 1
                                   and id = ${stock.product_id}`, [{ content: JSON.stringify(product.content) }]);
                        }
                        await trans.execute(`DELETE
                             FROM \`${this.app}\`.t_stock_recover
                             WHERE id = ?`, [stock.recoverID]);
                    }
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
                   WHERE ${querySql.join(' and ')} ${query.order_by || `order by id desc`}
        `;
        if (query.id) {
            const data = (await database_js_1.default.query(`SELECT *
                     FROM (${sql}) as subqyery
                         limit ${query.page * query.limit}
                        , ${query.limit}`, []))[0];
            return { data: data, result: !!data };
        }
        else {
            return {
                data: await database_js_1.default.query(`SELECT *
                     FROM (${sql}) as subqyery
                         limit ${query.page * query.limit}
                        , ${query.limit}`, []),
                total: (await database_js_1.default.query(`SELECT count(1)
                                        FROM (${sql}) as subqyery`, []))[0]['count(1)'],
            };
        }
    }
    async deleteProduct(query) {
        try {
            await database_js_1.default.query(`DELETE
                 FROM \`${this.app}\`.t_manager_post
                 WHERE id in (?)`, [query.id.split(',')]);
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
            await database_js_1.default.query(`DELETE
                 FROM \`${this.app}\`.t_manager_post
                 WHERE id in (?)`, [query.id.split(',')]);
            return {
                result: true,
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }
    async toCheckout(data, type = 'add') {
        var _a, _b, _c, _d;
        try {
            const userClass = new user_js_1.User(this.app);
            const rebateClass = new rebate_js_1.Rebate(this.app);
            if (type !== 'preview' && !(this.token && this.token.userID) && !data.email && !(data.user_info && data.user_info.email)) {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error:No email address.', null);
            }
            const userData = await (async () => {
                if (type !== 'preview' || (this.token && this.token.userID)) {
                    return this.token && this.token.userID
                        ? await userClass.getUserData(this.token.userID, 'userID')
                        : await userClass.getUserData(data.email || data.user_info.email, 'account');
                }
                else {
                    return {};
                }
            })();
            if (!data.email && userData && userData.account) {
                data.email = userData.account;
            }
            if (!data.email && type !== 'preview') {
                if (data.user_info && data.user_info.email) {
                    data.email = data.user_info.email;
                }
                else {
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error:No email address.', null);
                }
            }
            if (!data.email && type !== 'preview') {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error:No email address.', null);
            }
            if (data.use_rebate && data.use_rebate > 0) {
                if (userData) {
                    const userRebate = await rebateClass.getOneRebate({ user_id: userData.userID });
                    const sum = userRebate ? userRebate.point : 0;
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
                    value: {
                        volume: [],
                        weight: [],
                        selectCalc: 'volume',
                    },
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
                customer_info: {},
                lineItems: [],
                total: 0,
                email: (_b = data.email) !== null && _b !== void 0 ? _b : ((data.user_info && data.user_info.email) || ''),
                user_info: data.user_info,
                shipment_fee: 0,
                rebate: 0,
                use_rebate: data.use_rebate || 0,
                orderID: `${new Date().getTime()}`,
                shipment_support: shipment_setting,
                use_wallet: 0,
                method: data.user_info && data.user_info.method,
                user_email: (userData && userData.account) || ((_c = data.email) !== null && _c !== void 0 ? _c : ((data.user_info && data.user_info.email) || '')),
                useRebateInfo: { point: 0 },
            };
            function calculateShipment(dataList, value) {
                const productValue = parseInt(`${value}`, 10);
                if (isNaN(productValue) || dataList.length === 0) {
                    return 0;
                }
                for (let i = 0; i < dataList.length; i++) {
                    const currentKey = parseInt(dataList[i].key);
                    const currentValue = parseInt(dataList[i].value);
                    if (productValue < currentKey) {
                        return i === 0 ? 0 : parseInt(dataList[i - 1].value);
                    }
                    else if (productValue === currentKey) {
                        return currentValue;
                    }
                }
                return parseInt(dataList[dataList.length - 1].value);
            }
            for (const b of data.lineItems) {
                try {
                    const pdDqlData = (await this.getProduct({
                        page: 0,
                        limit: 50,
                        id: b.id,
                        status: 'active',
                    })).data;
                    if (pdDqlData) {
                        const pd = pdDqlData.content;
                        const variant = pd.variants.find((dd) => {
                            return dd.spec.join('-') === b.spec.join('-');
                        });
                        if ((Number.isInteger(variant.stock) || variant.show_understocking === 'false') && Number.isInteger(b.count)) {
                            if (variant.stock < b.count && variant.show_understocking !== 'false' && type !== 'manual' && type !== 'manual-preview') {
                                b.count = variant.stock;
                            }
                            if (variant && b.count > 0) {
                                b.preview_image = variant.preview_image || pd.preview_image[0];
                                b.title = pd.title;
                                b.sale_price = variant.sale_price;
                                b.collection = pd['collection'];
                                b.sku = variant.sku;
                                b.shipment_fee =
                                    b.count *
                                        (() => {
                                            if (!variant.shipment_type || variant.shipment_type === 'none') {
                                                return 0;
                                            }
                                            if (variant.shipment_type === 'volume') {
                                                return calculateShipment(shipment.volume, variant.v_length * variant.v_width * variant.v_height);
                                            }
                                            if (variant.shipment_type === 'weight') {
                                                return calculateShipment(shipment.weight, variant.weight);
                                            }
                                            return 0;
                                        })();
                                variant.shipment_weight = parseInt(variant.shipment_weight || 0);
                                carData.shipment_fee += b.shipment_fee;
                                carData.lineItems.push(b);
                                if (type !== "manual") {
                                    carData.total += variant.sale_price * b.count;
                                }
                            }
                            if (type !== 'preview' && type !== 'manual' && type !== 'manual-preview') {
                                const countless = variant.stock - b.count;
                                variant.stock = countless > 0 ? countless : 0;
                                await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_manager_post\`
                                     SET ?
                                     WHERE 1 = 1
                                       and id = ${pdDqlData.id}`, [{ content: JSON.stringify(pd) }]);
                                let deadTime = new Date();
                                deadTime.setMinutes(deadTime.getMinutes() + 15);
                                await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_stock_recover\`
                                                set ?`, [
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
                catch (e) {
                }
            }
            carData.total += carData.shipment_fee;
            const f_rebate = await this.formatUseRebate(carData.total, carData.use_rebate);
            carData.useRebateInfo = f_rebate;
            carData.use_rebate = f_rebate.point;
            carData.total -= carData.use_rebate;
            carData.code = data.code;
            carData.voucherList = [];
            if (type !== 'manual' && type !== 'manual-preview') {
                await this.checkVoucher(carData);
            }
            if (type === 'preview' || type === 'manual-preview')
                return { data: carData };
            if (type !== 'manual') {
                await rebateClass.insertRebate(userData.userID, carData.use_rebate * -1, '使用折抵', {
                    order_id: carData.orderID,
                });
                if (carData.voucherList && carData.voucherList.length > 0) {
                    for (const voucher of carData.voucherList) {
                        await this.insertVoucherHistory(userData.userID, carData.orderID, voucher.id);
                    }
                }
                if (userData && userData.userID) {
                    const sum = (await database_js_1.default.query(`SELECT sum(money)
                             FROM \`${this.app}\`.t_wallet
                             WHERE status in (1, 2)
                               and userID = ?`, [userData.userID]))[0]['sum(money)'] || 0;
                    carData.use_wallet = sum < carData.total ? sum : carData.total;
                }
            }
            else {
                let tempVoucher = {
                    discount_total: data.voucher.discount_total,
                    end_ISO_Date: "",
                    for: 'all',
                    forKey: [],
                    method: data.voucher.method,
                    overlay: false,
                    reBackType: data.voucher.reBackType,
                    rebate_total: data.voucher.rebate_total,
                    rule: 'min_price',
                    ruleValue: 0,
                    startDate: "",
                    startTime: "",
                    start_ISO_Date: "",
                    status: 1,
                    target: "",
                    targetList: [],
                    title: data.voucher.title,
                    trigger: 'auto',
                    type: "voucher",
                    value: data.voucher.value,
                    id: data.voucher.id
                };
                carData.discount = data.discount;
                carData.voucherList = [tempVoucher];
                carData.customer_info = data.customer_info;
                carData.total = (_d = data.total) !== null && _d !== void 0 ? _d : 0;
                carData.rebate = tempVoucher.rebate_total;
                if (tempVoucher.reBackType == "shipment_free") {
                    carData.shipment_fee = 0;
                }
                if (tempVoucher.reBackType == "rebate") {
                    let customerData = await userClass.getUserData(data.email || data.user_info.email, 'account');
                    if (!customerData) {
                        await (new user_js_1.User(this.app)).createUser(data.email, tool_js_1.default.randomString(8), {
                            email: data.email,
                            name: data.customer_info.name,
                            phone: data.customer_info.phone
                        }, {}, true);
                        customerData = await userClass.getUserData(data.email || data.user_info.email, 'account');
                        ;
                    }
                    await rebateClass.insertRebate(customerData.userID, carData.rebate, `手動新增訂單 - 優惠券購物金：${tempVoucher.title}`);
                }
                await database_js_1.default.execute(`INSERT INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                     values (?, ?, ?, ?)`, [carData.orderID, 1, carData.email, carData]);
                return {
                    data: carData,
                };
            }
            if (carData.use_wallet === carData.total) {
                await database_js_1.default.query(`INSERT INTO \`${this.app}\`.t_wallet (orderID, userID, money, status, note)
                     values (?, ?, ?, ?, ?);`, [
                    carData.orderID,
                    userData.userID,
                    carData.use_wallet * -1,
                    1,
                    JSON.stringify({
                        note: '使用錢包購物',
                        orderData: carData,
                    }),
                ]);
                await database_js_1.default.execute(`INSERT INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
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
                    new notify_js_1.ManagerNotify(this.app).checkout({
                        orderData: carData,
                        status: 0,
                    });
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
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error:' + e, null);
        }
    }
    async formatUseRebate(total, useRebate) {
        try {
            const getRS = await new user_js_1.User(this.app).getConfig({ key: 'rebate_setting', user_id: 'manager' });
            if (getRS[0] && getRS[0].value) {
                const configData = getRS[0].value.config;
                if (configData.condition.type === 'total_price' && configData.condition.value > total) {
                    return {
                        point: 0,
                        condition: configData.condition.value - total,
                    };
                }
                if (configData.customize) {
                    return {
                        point: useRebate,
                    };
                }
                else {
                    if (configData.use_limit.type === 'price') {
                        const limit = configData.use_limit.value;
                        return {
                            point: useRebate > limit ? limit : useRebate,
                            limit,
                        };
                    }
                    if (configData.use_limit.type === 'percent') {
                        const limit = parseInt(`${(total * configData.use_limit.value) / 100}`, 10);
                        return {
                            point: useRebate > limit ? limit : useRebate,
                            limit,
                        };
                    }
                    if (configData.use_limit.type === 'none') {
                        return {
                            point: useRebate,
                        };
                    }
                }
            }
            return {
                point: useRebate,
            };
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'formatUseRebate Error:' + express_1.default, null);
        }
    }
    async checkVoucher(cart) {
        cart.discount = 0;
        cart.lineItems.map((dd) => {
            dd.discount_price = 0;
            dd.rebate = 0;
        });
        let overlay = false;
        const code = cart.code;
        const userData = await new user_js_1.User(this.app).getUserData(cart.email, 'account');
        const allVoucher = (await this.querySql([`(content->>'$.type'='voucher')`], {
            page: 0,
            limit: 10000,
        })).data;
        const pass_id = [];
        for (const voucher of allVoucher) {
            if (await this.checkVoucherLimited(userData.userID, voucher.id)) {
                pass_id.push(voucher.id);
            }
        }
        const voucherList = allVoucher
            .map((dd) => {
            return dd.content;
        })
            .filter((dd) => {
            return pass_id.includes(dd.id);
        })
            .filter((dd) => {
            return new Date(dd.start_ISO_Date).getTime() < new Date().getTime() && (!dd.end_ISO_Date || new Date(dd.end_ISO_Date).getTime() > new Date().getTime());
        })
            .filter((dd) => {
            let item = [];
            switch (dd.for) {
                case 'collection':
                    item = cart.lineItems.filter((dp) => {
                        return (dd.forKey.filter((d1) => {
                            return dp.collection.find((d2) => {
                                return d2 === d1;
                            });
                        }).length > 0);
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
                    item = cart.lineItems;
                    dd.bind = item;
                    return item.length > 0;
            }
        })
            .filter((dd) => {
            return dd.trigger === 'auto' || dd.code === `${code}`;
        })
            .filter((dd) => {
            return dd.rule === 'min_count' ? cart.lineItems.length >= parseInt(`${dd.ruleValue}`, 10) : cart.total >= parseInt(`${dd.ruleValue}`, 10);
        })
            .filter((dd) => {
            if (dd.target === 'customer') {
                return dd.targetList.includes(userData.userID);
            }
            if (dd.target === 'levels') {
                const level = userData.member.find((dd) => dd.trigger);
                return level && dd.targetList.includes(level.id);
            }
            return true;
        })
            .sort(function (a, b) {
            let compareB = b
                .bind.map((dd) => {
                if (b.reBackType === 'shipment_free') {
                    return dd.shipment_fee;
                }
                else {
                    return b.method === 'percent' ? (dd.sale_price * parseFloat(b.value)) / 100 : parseFloat(b.value);
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
                    return a.method === 'percent' ? (dd.sale_price * parseFloat(a.value)) / 100 : parseFloat(a.value);
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
                    let discount = dd.method === 'percent' ? (d2.sale_price * parseFloat(dd.value)) / 100 : parseFloat(dd.value);
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
            const basic = 0;
            cart.shipment_fee = cart.shipment_fee - basic;
            cart.total -= basic;
        }
        cart.total = cart.total - cart.discount;
        cart.voucherList = voucherList;
    }
    async putOrder(data) {
        try {
            const update = {
                status: data.status
            };
            data.orderData && (update.orderData = JSON.stringify(data.orderData));
            await database_js_1.default.query(`UPDATE \`${this.app}\`.t_checkout
                 set ?
                 WHERE id = ?`, [update, data.id]);
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
            await database_js_1.default.query(`DELETE
                 FROM \`${this.app}\`.t_checkout
                 WHERE id in (?)`, [req.id.split(',')]);
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
            let orderString = 'order by id desc';
            if (query.search && query.searchType) {
                switch (query.searchType) {
                    case 'cart_token':
                        querySql.push(`(cart_token like '%${query.search}%')`);
                        break;
                    case 'name':
                    case 'invoice_number':
                    case 'phone':
                        querySql.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.user_info.${query.searchType}')) LIKE ('%${query.search}%')))`);
                        break;
                    default: {
                        querySql.push(`JSON_CONTAINS_PATH(orderData, 'one', '$.lineItems[*].title') AND JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.lineItems[*].${query.searchType}')) REGEXP '${query.search}'`);
                    }
                }
            }
            if (query.orderStatus) {
                let orderArray = query.orderStatus.split(',');
                let temp = '';
                if (orderArray.includes('0')) {
                    temp += "JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.orderStatus')) IS NULL OR ";
                }
                temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.orderStatus')) IN (${query.orderStatus})`;
                querySql.push(`(${temp})`);
            }
            if (query.progress) {
                let newArray = query.progress.split(',');
                let temp = '';
                if (newArray.includes('wait')) {
                    temp += "JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.progress')) IS NULL OR ";
                }
                temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.progress')) IN (${newArray.map((status) => `"${status}"`).join(',')})`;
                querySql.push(`(${temp})`);
            }
            if (query.shipment) {
                let shipment = query.shipment.split(',');
                let temp = '';
                if (shipment.includes('normal')) {
                    temp += "JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.user_info.shipment')) IS NULL OR ";
                }
                temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.user_info.shipment')) IN (${shipment.map((status) => `"${status}"`).join(',')})`;
                querySql.push(`(${temp})`);
            }
            if (query.created_time) {
                const created_time = query.created_time.split(',');
                if (created_time.length > 1) {
                    querySql.push(`
                        (created_time BETWEEN ${database_js_1.default.escape(`${created_time[0]} 00:00:00`)} 
                        AND ${database_js_1.default.escape(`${created_time[1]} 23:59:59`)})
                    `);
                }
            }
            if (query.orderString) {
                switch (query.orderString) {
                    case 'created_time_desc':
                        orderString = 'order by created_time desc';
                        break;
                    case 'created_time_asc':
                        orderString = 'order by created_time asc';
                        break;
                    case 'order_total_desc':
                        orderString = "order by CAST(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.total')) AS SIGNED) desc";
                        break;
                    case 'order_total_asc':
                        orderString = "order by CAST(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.total')) AS SIGNED) asc";
                        break;
                }
            }
            query.status && querySql.push(`status IN (${query.status})`);
            query.email && querySql.push(`email=${database_js_1.default.escape(query.email)}`);
            query.id && querySql.push(`(content->>'$.id'=${query.id})`);
            if (query.archived === 'true') {
                querySql.push(`(orderData->>'$.archived'="${query.archived}")`);
            }
            else if (query.archived === 'false') {
                querySql.push(`((orderData->>'$.archived' is null) or (orderData->>'$.archived'!='true'))`);
            }
            let sql = `SELECT *
                       FROM \`${this.app}\`.t_checkout
                       WHERE ${querySql.join(' and ')} ${orderString}`;
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
    async releaseCheckout(status, order_id) {
        try {
            if (status === -1) {
                await database_js_1.default.execute(`UPDATE \`${this.app}\`.t_checkout
                     SET status = ?
                     WHERE cart_token = ?`, [-1, order_id]);
                await this.releaseVoucherHistory(order_id, 0);
            }
            if (status === 1) {
                const notProgress = (await database_js_1.default.query(`SELECT count(1)
                         FROM \`${this.app}\`.t_checkout
                         WHERE cart_token = ?
                           AND status = 0;`, [order_id]))[0]['count(1)'];
                if (!notProgress) {
                    return;
                }
                await database_js_1.default.execute(`UPDATE \`${this.app}\`.t_checkout
                     SET status = ?
                     WHERE cart_token = ?`, [1, order_id]);
                const cartData = (await database_js_1.default.query(`SELECT *
                         FROM \`${this.app}\`.t_checkout
                         WHERE cart_token = ?;`, [order_id]))[0];
                new notify_js_1.ManagerNotify(this.app).checkout({
                    orderData: cartData.orderData,
                    status: status,
                });
                const userData = await new user_js_1.User(this.app).getUserData(cartData.email, 'account');
                if (userData && cartData.orderData.rebate > 0) {
                    const rebateClass = new rebate_js_1.Rebate(this.app);
                    for (let i = 0; i < cartData.orderData.voucherList.length; i++) {
                        const orderVoucher = cartData.orderData.voucherList[i];
                        const voucherRow = await database_js_1.default.query(`SELECT *
                             FROM \`${this.app}\`.t_manager_post
                             WHERE JSON_EXTRACT(content, '$.type') = 'voucher'
                               AND id = ?;`, [orderVoucher.id]);
                        if (voucherRow[0]) {
                            for (const item of orderVoucher.bind) {
                                const useCheck = await rebateClass.canUseRebate(userData.userID, 'voucher', {
                                    voucher_id: orderVoucher.id,
                                    order_id: order_id,
                                    sku: item.sku,
                                    quantity: item.count,
                                });
                                if (item.rebate > 0 && (useCheck === null || useCheck === void 0 ? void 0 : useCheck.result)) {
                                    const content = voucherRow[0].content;
                                    await rebateClass.insertRebate(userData.userID, item.rebate * item.count, `優惠券購物金：${content.title}`, {
                                        voucher_id: orderVoucher.id,
                                        order_id: order_id,
                                        sku: item.sku,
                                        quantity: item.count,
                                        deadTime: content.rebateEndDay ? (0, moment_1.default)().add(content.rebateEndDay, 'd').format('YYYY-MM-DD HH:mm:ss') : undefined,
                                    });
                                }
                            }
                        }
                    }
                }
                if (cartData.orderData.voucherList && cartData.orderData.voucherList.length > 0) {
                    await this.releaseVoucherHistory(order_id, 1);
                }
                try {
                    await new custom_code_js_1.CustomCode(this.app).checkOutHook({ userData, cartData });
                }
                catch (e) {
                    console.error(e);
                }
                new invoice_js_1.Invoice(this.app).postCheckoutInvoice(order_id);
            }
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Release Checkout Error:' + express_1.default, null);
        }
    }
    async checkVoucherLimited(user_id, voucher_id) {
        try {
            const vouchers = await database_js_1.default.query(`SELECT id,
                        JSON_EXTRACT(content, '$.macroLimited') AS macroLimited,
                        JSON_EXTRACT(content, '$.microLimited') AS microLimited
                 FROM \`${this.app}\`.t_manager_post
                 WHERE id = ?;`, [voucher_id]);
            if (!vouchers[0]) {
                return false;
            }
            if (vouchers[0].macroLimited === 0 && vouchers[0].microLimited === 0) {
                return true;
            }
            const history = await database_js_1.default.query(`SELECT *
                 FROM \`${this.app}\`.t_voucher_history
                 WHERE voucher_id = ?
                   AND status in (1, 2);`, [voucher_id]);
            if (vouchers[0].macroLimited > 0 && history.length >= vouchers[0].macroLimited) {
                return false;
            }
            if (vouchers[0].microLimited > 0 &&
                history.filter((item) => {
                    return item.user_id === user_id;
                }).length >= vouchers[0].microLimited) {
                return false;
            }
            return true;
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'checkVoucherHistory Error:' + express_1.default, null);
        }
    }
    async insertVoucherHistory(user_id, order_id, voucher_id) {
        try {
            await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_voucher_history\`
                            set ?`, [
                {
                    user_id,
                    order_id,
                    voucher_id,
                    created_at: new Date(),
                    updated_at: new Date(),
                    status: 2,
                },
            ]);
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'insertVoucherHistory Error:' + express_1.default, null);
        }
    }
    async releaseVoucherHistory(order_id, status) {
        try {
            await database_js_1.default.query(`UPDATE \`${this.app}\`.t_voucher_history
                            SET status = ?
                            WHERE order_id = ?;`, [status, order_id]);
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'insertVoucherHistory Error:' + express_1.default, null);
        }
    }
    async resetVoucherHistory() {
        try {
            const now = (0, moment_1.default)().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
            await database_js_1.default.query(`
                    UPDATE \`${this.app}\`.t_voucher_history
                    SET status = 0
                    WHERE status = 2
                      AND updated_at < DATE_SUB('${now}', INTERVAL 2 MINUTE);`, []);
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'insertVoucherHistory Error:' + express_1.default, null);
        }
    }
    async postVariantsAndPriceValue(content) {
        var _a, _b, _c;
        content.variants = (_a = content.variants) !== null && _a !== void 0 ? _a : [];
        content.id &&
            (await database_js_1.default.query(`DELETE
             from \`${this.app}\`.t_variants
             WHERE (product_id=${content.id}) and id>0`, []));
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
            await database_js_1.default.query(`INSERT INTO \`${this.app}\`.t_variants
                 SET ?`, [
                {
                    content: JSON.stringify(a),
                    product_id: content.id,
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
                        case 'order_today':
                            result[tag] = await this.getOrderToDay();
                            break;
                    }
                }
                return result;
            }
            return { result: false };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getDataAnalyze Error:' + e, null);
        }
    }
    async getOrderToDay() {
        try {
            const order = await database_js_1.default.query(`SELECT *
                                          FROM \`${this.app}\`.t_checkout
                                          WHERE DATE (created_time) = CURDATE()`, []);
            return {
                total_count: order.filter((dd) => {
                    return dd.status === 1;
                }).length,
                un_shipment: (await database_js_1.default.query(`SELECT count(1)
                                              from \`${this.app}\`.t_checkout
                                              WHERE (orderData ->> '$.progress' is null || orderData ->> '$.progress' = 'wait')
                                                and status = 1`, []))[0]['count(1)'],
                un_pay: order.filter((dd) => {
                    return dd.status === 0;
                }).length,
                total_amount: (() => {
                    let amount = 0;
                    order
                        .filter((dd) => {
                        return dd.status === 1;
                    })
                        .map((dd) => {
                        amount += dd.orderData.total;
                    });
                    return amount;
                })(),
            };
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getRecentActiveUser() {
        try {
            const recentSQL = `
                SELECT *
                FROM \`${this.app}\`.t_user
                WHERE online_time BETWEEN DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND NOW();
            `;
            const recent_users = await database_js_1.default.query(recentSQL, []);
            const monthSQL = `
                SELECT *
                FROM \`${this.app}\`.t_user
                WHERE MONTH (online_time) = MONTH (NOW()) AND YEAR (online_time) = YEAR (NOW());
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
                SELECT *
                FROM \`${this.app}\`.t_checkout
                WHERE MONTH (created_time) = MONTH (NOW()) AND YEAR (created_time) = YEAR (NOW()) AND status = 1;
            `;
            const recentMonthCheckouts = await database_js_1.default.query(recentMonthSQL, []);
            let recent_month_total = 0;
            recentMonthCheckouts.map((checkout) => {
                recent_month_total += parseInt(checkout.orderData.total, 10);
            });
            const previousMonthSQL = `
                SELECT *
                FROM \`${this.app}\`.t_checkout
                WHERE
                    MONTH (created_time) = MONTH (DATE_SUB(NOW()
                    , INTERVAL 1 MONTH))
                  AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                    , INTERVAL 1 MONTH))
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
                SELECT JSON_EXTRACT(orderData, '$.lineItems') as lineItems
                FROM \`${this.app}\`.t_checkout
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
                SELECT id
                FROM \`${this.app}\`.t_checkout
                WHERE MONTH (created_time) = MONTH (NOW()) AND YEAR (created_time) = YEAR (NOW()) AND status = 1;
            `;
            const recentMonthCheckouts = await database_js_1.default.query(recentMonthSQL, []);
            let recent_month_total = recentMonthCheckouts.length;
            const previousMonthSQL = `
                SELECT id
                FROM \`${this.app}\`.t_checkout
                WHERE
                    MONTH (created_time) = MONTH (DATE_SUB(NOW()
                    , INTERVAL 1 MONTH))
                  AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                    , INTERVAL 1 MONTH))
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
                    SELECT count(id) as c
                    FROM \`${this.app}\`.t_checkout
                    WHERE
                        MONTH (created_time) = MONTH (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH))
                      AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH))
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
                    SELECT orderData
                    FROM \`${this.app}\`.t_checkout
                    WHERE
                        MONTH (created_time) = MONTH (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH))
                      AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH))
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
                    SELECT orderData
                    FROM \`${this.app}\`.t_checkout
                    WHERE
                        DAY (created_time) = DAY (DATE_SUB(NOW()
                        , INTERVAL ${index} DAY))
                      AND MONTH (created_time) = MONTH (DATE_SUB(NOW()
                        , INTERVAL ${index} DAY))
                      AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                        , INTERVAL ${index} DAY))
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
    async getCollectionProducts(tag) {
        try {
            const products_sql = `SELECT *
                                  FROM \`${this.app}\`.t_manager_post
                                  WHERE JSON_EXTRACT(content, '$.type') = 'product';`;
            const products = await database_js_1.default.query(products_sql, []);
            return products.filter((product) => product.content.collection.includes(tag));
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e, null);
        }
    }
    async putCollection(data) {
        var _a;
        try {
            let config = (_a = (await database_js_1.default.query(`SELECT *
                                          FROM \`${this.app}\`.public_config
                                          WHERE \`key\` = 'collection';`, []))[0]) !== null && _a !== void 0 ? _a : {};
            config.value = config.value || [];
            if (data.id == -1 || data.parent_name !== data.origin.parent_name || data.name !== data.origin.item_name) {
                if (data.parent_id === undefined && config.value.find((item) => item.title === data.name)) {
                    return { result: false, message: `上層分類已存在「${data.name}」類別名稱` };
                }
                if (data.parent_id !== undefined && config.value[data.parent_id].array.find((item) => item.title === data.name)) {
                    return {
                        result: false,
                        message: `上層分類「${config.value[data.parent_id].title}」已存在「${data.name}」類別名稱`
                    };
                }
            }
            if (data.id == -1) {
                if (data.parent_id === undefined) {
                    config.value.push({ array: [], title: data.name });
                }
                else {
                    config.value[data.parent_id].array.push({ array: [], title: data.name });
                }
            }
            else if (data.origin.parent_id === undefined) {
                config.value[data.origin.item_id] = {
                    array: data.children_collections.map((col) => ({ array: [], title: col.name })),
                    title: data.name,
                };
            }
            else {
                if (data.origin.parent_id === data.parent_id) {
                    config.value[data.origin.parent_id].array[data.origin.item_id] = { array: [], title: data.name };
                }
                else {
                    config.value[data.origin.parent_id].array.splice(data.origin.item_id, 1);
                    config.value[data.parent_id].array.push({ array: [], title: data.name });
                }
            }
            if (data.id != -1 && data.origin.children_collections) {
                const filter_childrens = data.origin.children_collections
                    .filter((child) => {
                    return data.children_collections.find((child2) => child2.id === child.id) === undefined;
                })
                    .map((child) => {
                    return child.name;
                });
                await this.deleteCollectionProduct(data.origin.item_name, filter_childrens);
            }
            const update_col_sql = `UPDATE \`${this.app}\`.public_config
                                    SET value = ?
                                    WHERE \`key\` = 'collection';`;
            await database_js_1.default.execute(update_col_sql, [config.value]);
            if (data.id != -1) {
                const delete_id_list = data.origin.product_list
                    .filter((o_prod) => {
                    return data.product_list.find((prod) => prod.id === o_prod.id) === undefined;
                })
                    .map((o_prod) => {
                    return o_prod.id;
                });
                if (delete_id_list.length > 0) {
                    const products_sql = `SELECT *
                                          FROM \`${this.app}\`.t_manager_post
                                          WHERE id in (${delete_id_list.join(',')});`;
                    const delete_product_list = await database_js_1.default.query(products_sql, []);
                    for (const product of delete_product_list) {
                        product.content.collection = product.content.collection.filter((str) => {
                            if (data.origin.parent_name) {
                                if (str.includes(data.origin.item_name) || str.includes(`${data.origin.item_name} /`)) {
                                    return false;
                                }
                            }
                            else {
                                if (str.includes(data.origin.item_name) || str.includes(`${data.origin.item_name} /`) || str.includes(data.origin.parent_name)) {
                                    return false;
                                }
                            }
                            return true;
                        });
                        await this.updateProductCollection(product.content, product.id);
                    }
                }
            }
            const get_product_sql = `SELECT *
                                     FROM \`${this.app}\`.t_manager_post
                                     WHERE id = ?`;
            for (const p of data.product_list) {
                const get_product = await database_js_1.default.query(get_product_sql, [p.id]);
                if (get_product[0]) {
                    const product = get_product[0];
                    if (data.id != -1) {
                        product.content.collection = product.content.collection
                            .filter((str) => {
                            if (data.origin.parent_name === data.parent_name) {
                                return true;
                            }
                            if (data.parent_name) {
                                if (str === data.origin.parent_name || str.includes(`${data.origin.parent_name} / ${data.origin.item_name}`)) {
                                    return false;
                                }
                            }
                            else {
                                if (str === data.origin.item_name || str.includes(`${data.origin.item_name} /`)) {
                                    return false;
                                }
                            }
                            return true;
                        })
                            .map((str) => {
                            if (data.parent_name) {
                                if (str.includes(`${data.origin.parent_name} / ${data.origin.item_name}`)) {
                                    return str.replace(data.origin.item_name, data.name);
                                }
                            }
                            else {
                                if (str === data.origin.item_name || str.includes(`${data.origin.item_name} /`)) {
                                    return str.replace(data.origin.item_name, data.name);
                                }
                            }
                            return str;
                        });
                    }
                    if (data.parent_id === undefined) {
                        product.content.collection.push(data.name);
                    }
                    else {
                        product.content.collection.push(data.parent_name);
                        product.content.collection.push(`${data.parent_name} / ${data.name}`);
                    }
                    product.content.collection = [...new Set(product.content.collection)];
                    await this.updateProductCollection(product.content, product.id);
                }
            }
            return { result: true };
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e, null);
        }
    }
    async postProduct(content) {
        var _a;
        try {
            content.type = 'product';
            const data = await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_manager_post\`
                 SET ?`, [{
                    userID: (_a = this.token) === null || _a === void 0 ? void 0 : _a.userID,
                    content: JSON.stringify(content)
                }]);
            content.id = data.insertId;
            await new Shopping(this.app, this.token).postVariantsAndPriceValue(content);
            return data.insertId;
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postProduct Error:' + e, null);
        }
    }
    async putProduct(content) {
        try {
            content.type = 'product';
            const data = await database_js_1.default.query(`update \`${this.app}\`.\`t_manager_post\`
                 SET ? where id=?`, [{
                    content: JSON.stringify(content)
                },
                content.id]);
            await new Shopping(this.app, this.token).postVariantsAndPriceValue(content);
            return content.insertId;
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postProduct Error:' + e, null);
        }
    }
    async deleteCollection(id_array) {
        try {
            const config = (await database_js_1.default.query(`SELECT *
                                            FROM \`${this.app}\`.public_config
                                            WHERE \`key\` = 'collection';`, []))[0];
            const delete_index_array = [];
            id_array.map((id) => {
                if (typeof id === 'number') {
                    delete_index_array.push({ parent: id, child: [-1] });
                }
                else {
                    const arr = id.split('_').map((str) => parseInt(str, 10));
                    const n = delete_index_array.findIndex((obj) => obj.parent === arr[0]);
                    if (n === -1) {
                        delete_index_array.push({ parent: arr[0], child: [arr[1]] });
                    }
                    else {
                        delete_index_array[n].child.push(arr[1]);
                    }
                }
            });
            for (const d of delete_index_array) {
                const collection = config.value[d.parent];
                for (const index of d.child) {
                    if (index !== -1) {
                        await this.deleteCollectionProduct(collection.title, [`${collection.array[index].title}`]);
                    }
                }
                if (d.child.length === collection.array.length || d.child[0] === -1) {
                    await this.deleteCollectionProduct(collection.title);
                }
            }
            delete_index_array.map((obj) => {
                config.value[obj.parent].array = config.value[obj.parent].array.filter((col, index) => {
                    return !obj.child.includes(index);
                });
            });
            config.value = config.value.filter((col, index) => {
                const find_collection = delete_index_array.find((obj) => obj.parent === index);
                if (find_collection) {
                    if (col.array.length === 0 || find_collection.child[0] === -1) {
                        return false;
                    }
                }
                return true;
            });
            const update_col_sql = `UPDATE \`${this.app}\`.public_config
                                    SET value = ?
                                    WHERE \`key\` = 'collection';`;
            await database_js_1.default.execute(update_col_sql, [config.value]);
            return { result: true };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e, null);
        }
    }
    async deleteCollectionProduct(parent_name, children_list) {
        try {
            if (children_list) {
                for (const children of children_list) {
                    const tag_name = `${parent_name} / ${children}`;
                    for (const product of await database_js_1.default.query(this.containsTagSQL(tag_name), [])) {
                        product.content.collection = product.content.collection.filter((str) => str != tag_name);
                        await this.updateProductCollection(product.content, product.id);
                    }
                }
            }
            else {
                for (const product of await database_js_1.default.query(this.containsTagSQL(parent_name), [])) {
                    product.content.collection = product.content.collection.filter((str) => !(str === parent_name));
                    await this.updateProductCollection(product.content, product.id);
                }
                for (const product of await database_js_1.default.query(this.containsTagSQL(`${parent_name} /`), [])) {
                    product.content.collection = product.content.collection.filter((str) => str.includes(`${parent_name} / `));
                    await this.updateProductCollection(product.content, product.id);
                }
            }
            return { result: true };
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'deleteCollectionProduct Error:' + express_1.default, null);
        }
    }
    containsTagSQL(name) {
        return `SELECT *
                FROM \`${this.app}\`.t_manager_post
                WHERE JSON_CONTAINS(content - > '$.collection', '"${name}"');`;
    }
    async updateProductCollection(content, id) {
        try {
            const updateProdSQL = `UPDATE \`${this.app}\`.t_manager_post
                                   SET content = ?
                                   WHERE \`id\` = ?;`;
            await database_js_1.default.execute(updateProdSQL, [content, id]);
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'updateProductCollection Error:' + express_1.default, null);
        }
    }
}
exports.Shopping = Shopping;
//# sourceMappingURL=shopping.js.map
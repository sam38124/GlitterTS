"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shopping = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const newebpay_js_1 = __importDefault(require("./newebpay.js"));
const private_config_js_1 = require("../../services/private_config.js");
const user_js_1 = require("./user.js");
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
            let querySql = [
                `(content->>'$.type'='product')`
            ];
            query.search && querySql.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`);
            query.id && querySql.push(`(content->>'$.id'=${query.id})`);
            query.collection && querySql.push(`(${query.collection.split(',').map((dd) => {
                return `(JSON_EXTRACT(content, '$.collection') LIKE '%${dd}%')`;
            }).join(' or ')})`);
            query.status && querySql.push(`(JSON_EXTRACT(content, '$.status') = '${query.status}')`);
            query.min_price && querySql.push(`(CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.variants[0].sale_price')) AS SIGNED)>=${query.min_price}) `);
            query.max_price && querySql.push(`(CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.variants[0].sale_price')) AS SIGNED)<=${query.max_price}) `);
            return await this.querySql(querySql, query);
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }
    async querySql(querySql, query) {
        let sql = `SELECT *
                   FROM \`${this.app}\`.t_manager_post
                   where ${querySql.join(' & ')}
                   ${query.order_by || `order by id desc`}
                   `;
        if (query.id) {
            const data = (await database_js_1.default.query(`SELECT *
                                          FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, []))[0];
            return {
                data: data,
                result: !!(data)
            };
        }
        else {
            return {
                data: (await database_js_1.default.query(`SELECT *
                                       FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, [])),
                total: (await database_js_1.default.query(`SELECT count(1)
                                        FROM (${sql}) as subqyery`, []))[0]['count(1)']
            };
        }
    }
    async deleteProduct(query) {
        try {
            await database_js_1.default.query(`delete
                            FROM \`${this.app}\`.t_manager_post
                            where id in (?)`, [query.id.split(',')]);
            return {
                result: true
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
                result: true
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
                const userData = await (new user_js_1.User(this.app).getUserData(data.email || data.user_info.email, 'account'));
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
                appName: this.app, key: 'glitter_shipment'
            }))) !== null && _a !== void 0 ? _a : [{
                    basic_fee: 0,
                    weight: 0
                }])[0].value;
            const carData = {
                lineItems: [],
                total: 0,
                email: (_b = data.email) !== null && _b !== void 0 ? _b : ((data.user_info && data.user_info.email) || ''),
                user_info: data.user_info,
                shipment_fee: shipment.basic_fee,
                rebate: 0,
                use_rebate: data.use_rebate || 0,
                orderID: `${new Date().getTime()}`
            };
            for (const b of data.lineItems) {
                const pd = (await this.getProduct({ page: 0, limit: 50, id: b.id })).data.content;
                const variant = pd.variants.find((dd) => {
                    return dd.spec.join('-') === b.spec.join('-');
                });
                b.preview_image = variant.preview_image || pd.preview_image[0];
                b.title = pd.title;
                b.sale_price = variant.sale_price;
                b.collection = pd['collection'];
                b.sku = variant.sku;
                variant.shipment_weight = parseInt(variant.shipment_weight || 0);
                carData.shipment_fee += (variant.shipment_weight * shipment.weight) * b.count;
                carData.lineItems.push(b);
                carData.total += variant.sale_price * b.count;
            }
            carData.total += carData.shipment_fee;
            carData.total -= carData.use_rebate;
            carData.code = data.code;
            const voucherList = await this.checkVoucher(carData);
            if (type === 'preview') {
                return {
                    data: carData
                };
            }
            console.log(`使用回饋金購物${carData.use_rebate}使用回饋金購物`);
            if (carData.use_rebate) {
                const userData = await (new user_js_1.User(this.app).getUserData(data.email || data.user_info.email, 'account'));
                await database_js_1.default.query(`insert into \`${this.app}\`.t_rebate (orderID, userID, money, status, note)
                                    values (?, ?, ?, ?, ?);`, [
                    carData.orderID,
                    userData.userID,
                    carData.use_rebate * -1,
                    1,
                    JSON.stringify({
                        note: '使用回饋金購物'
                    })
                ]);
            }
            const keyData = (await private_config_js_1.Private_config.getConfig({
                appName: this.app, key: 'glitter_finance'
            }))[0].value;
            const subMitData = await (new newebpay_js_1.default(this.app, {
                "HASH_IV": keyData.HASH_IV,
                "HASH_KEY": keyData.HASH_KEY,
                "ActionURL": keyData.ActionURL,
                "NotifyURL": `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}`,
                "ReturnURL": `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${data.return_url}`,
                "MERCHANT_ID": keyData.MERCHANT_ID,
            }).createNewebPage(carData));
            return {
                form: `<form name="Newebpay" action="${subMitData.actionURL}" method="POST" class="payment">
                            <input type="hidden" name="MerchantID" value="${subMitData.MerchantID}" />
                            <input type="hidden" name="TradeInfo" value="${subMitData.TradeInfo}" />
                            <input type="hidden" name="TradeSha" value="${subMitData.TradeSha}" />
                            <input type="hidden" name="Version" value="${subMitData.Version}" />
                            <input type="hidden" name="MerchantOrderNo" value="${subMitData.MerchantOrderNo}" />
                            <button
                                type="submit"
                                class="btn btn-secondary custom-btn beside-btn"
                                id="submit"
                                hidden
                            ></button>
                        </form>`
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error:' + e, null);
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
        const voucherList = (await this.querySql([
            `(content->>'$.type'='voucher')`
        ], {
            page: 0,
            limit: 10000
        })).data.map((dd) => {
            return dd.content;
        }).filter((dd) => {
            return (new Date(dd.start_ISO_Date).getTime() < new Date().getTime()) && (!dd.end_ISO_Date || ((new Date(dd.end_ISO_Date).getTime() > new Date().getTime())));
        }).filter((dd) => {
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
                    (dd).bind = item;
                    return item.length > 0;
                case 'product':
                    item = cart.lineItems.filter((dp) => {
                        return dd.forKey.map((dd) => {
                            return `${dd}`;
                        }).indexOf(`${dp.id}`) !== -1;
                    });
                    (dd).bind = item;
                    return item.length > 0;
                case "all":
                    item = cart.lineItems.filter((dp) => {
                        return true;
                    });
                    (dd).bind = item;
                    return item.length > 0;
            }
        }).filter((dd) => {
            return (dd.trigger === 'auto') || (dd.code === `${code}`);
        }).filter((dd) => {
            return (dd.rule === 'min_count') ? (cart.lineItems.length >= parseInt(`${dd.ruleValue}`, 10)) : (cart.total >= parseInt(`${dd.ruleValue}`, 10));
        }).sort(function (a, b) {
            let compareB = b.bind.map((dd) => {
                return (b.method === 'percent') ? (dd.sale_price * (parseFloat(b.value))) / 100 : parseFloat(b.value);
            }).reduce(function (accumulator, currentValue) {
                return accumulator + currentValue;
            }, 0);
            let compareA = a.bind.map((dd) => {
                return (a.method === 'percent') ? (dd.sale_price * (parseFloat(a.value))) / 100 : parseFloat(a.value);
            }).reduce(function (accumulator, currentValue) {
                return accumulator + currentValue;
            }, 0);
            return compareB - compareA;
        }).filter((dd) => {
            if (!overlay && (!dd.overlay)) {
                overlay = true;
                return true;
            }
            return (dd.overlay);
        }).filter((dd) => {
            var _a, _b;
            dd.discount_total = (_a = dd.discount_total) !== null && _a !== void 0 ? _a : 0;
            dd.rebate_total = (_b = dd.rebate_total) !== null && _b !== void 0 ? _b : 0;
            dd.bind = dd.bind.filter((d2) => {
                let discount = (dd.method === 'percent') ? (d2.sale_price * (parseFloat(dd.value))) / 100 : parseFloat(dd.value);
                if ((d2.discount_price + discount) < d2.sale_price) {
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
            });
            return dd.bind.length > 0;
        });
        if (!voucherList.find((d2) => {
            return d2.code === `${cart.code}`;
        })) {
            cart.code = undefined;
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
                            where id = ?`, [
                update,
                data.id
            ]);
            return {
                result: 'success',
                orderData: data.orderData
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
                result: true
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'deleteOrder Error:' + e, null);
        }
    }
    async getCheckOut(query) {
        try {
            let querySql = [
                '1=1'
            ];
            query.email && querySql.push(`(email=${database_js_1.default.escape(query.email)})`);
            query.search && querySql.push([
                `((UPPER(Cart_token) LIKE UPPER('%${query.search}%'))`,
                `(UPPER(JSON_UNQUOTE(orderData->>'$.email')) LIKE UPPER('%${query.search}%')))`,
                `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.user_info.name')) LIKE UPPER('%${query.search}%')))`
            ].join('||'));
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
                    result: !!(data)
                };
            }
            else {
                return {
                    data: (await database_js_1.default.query(`SELECT *
                                           FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, [])),
                    total: (await database_js_1.default.query(`SELECT count(1)
                                            FROM (${sql}) as subqyery`, []))[0]['count(1)']
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
        await database_js_1.default.query(`delete from \`${this.app}\`.t_manager_post  where (content->>'$.product_id'=${content.id})`, []);
        for (const a of content.variants) {
            content.min_price = (_b = content.min_price) !== null && _b !== void 0 ? _b : (a.sale_price);
            content.max_price = (_c = content.max_price) !== null && _c !== void 0 ? _c : (a.sale_price);
            if (a.sale_price < content.min_price) {
                content.min_price = a.sale_price;
            }
            if (a.sale_price > content.max_price) {
                content.max_price = a.sale_price;
            }
            a.type = 'variants';
            a.product_id = content.id;
            console.log(a);
            await database_js_1.default.query(`insert into \`${this.app}\`.t_manager_post  SET ?`, [
                {
                    content: JSON.stringify(a),
                    userID: this.token.userID
                }
            ]);
        }
    }
}
exports.Shopping = Shopping;
//# sourceMappingURL=shopping.js.map
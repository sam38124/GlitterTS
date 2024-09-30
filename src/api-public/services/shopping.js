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
const auto_send_email_js_1 = require("./auto-send-email.js");
const recommend_js_1 = require("./recommend.js");
const workers_js_1 = require("./workers.js");
const axios_1 = __importDefault(require("axios"));
const delivery_js_1 = require("./delivery.js");
const config_js_1 = require("../../config.js");
class Shopping {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async workerExample(data) {
        try {
            const jsonData = await database_js_1.default.query(`SELECT *
                 FROM \`${this.app}\`.t_voucher_history`, []);
            const t0 = performance.now();
            if (data.type === 0) {
                for (const record of jsonData) {
                    await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_voucher_history\`
                         SET ?
                         WHERE id = ?`, [record, record.id]);
                }
                return {
                    type: 'single',
                    divisor: 1,
                    executionTime: `${(performance.now() - t0).toFixed(3)} ms`,
                };
            }
            const formatJsonData = jsonData.map((record) => {
                return {
                    sql: `UPDATE \`${this.app}\`.\`t_voucher_history\`
                          SET ?
                          WHERE id = ?`,
                    data: [record, record.id],
                };
            });
            const result = workers_js_1.Workers.query({
                queryList: formatJsonData,
                divisor: data.divisor,
            });
            return result;
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'Worker example is Failed. ' + error, null);
        }
    }
    async getProduct(query) {
        var _a;
        try {
            query.show_hidden = (_a = query.show_hidden) !== null && _a !== void 0 ? _a : 'true';
            let querySql = [`(content->>'$.type'='product')`];
            if (query.search) {
                switch (query.searchType) {
                    case 'sku':
                        if (query.accurate_search_text) {
                            querySql.push(`JSON_EXTRACT(content, '$.variants[*].sku') = '${query.search}'`);
                        }
                        else {
                            querySql.push(`JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`);
                        }
                        break;
                    case 'barcode':
                        if (query.accurate_search_text) {
                            querySql.push(`JSON_EXTRACT(content, '$.variants[*].barcode') = '${query.search}'`);
                        }
                        else {
                            querySql.push(`JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`);
                        }
                        break;
                    case 'title':
                    default:
                        querySql.push(`(${[
                            `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`,
                            `JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`,
                            `JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`,
                        ].join(' or ')})`);
                        break;
                }
            }
            if (`${query.id || ''}`) {
                if (`${query.id}`.includes(',')) {
                    querySql.push(`id in (${query.id})`);
                }
                else {
                    querySql.push(`id = ${query.id}`);
                }
            }
            if (query.filter_visible) {
                if (query.filter_visible === 'true') {
                    querySql.push(`(content->>'$.visible' is null || content->>'$.visible' = 'true')`);
                }
                else {
                    querySql.push(`(content->>'$.visible' = 'false')`);
                }
            }
            else if (!query.is_manger && `${query.show_hidden}` !== 'true') {
                querySql.push(`(content->>'$.visible' is null || content->>'$.visible' = 'true')`);
            }
            if (query.productType) {
                query.productType.split(',').map((dd) => {
                    querySql.push(`(content->>'$.productType.${dd}' = "true")`);
                });
            }
            else if (!query.id) {
                querySql.push(`(content->>'$.productType.product' = "true")`);
            }
            if (query.collection) {
                const collection_cf = (await database_js_1.default.query(`SELECT *
                         FROM \`${this.app}\`.public_config
                         where \`key\` = 'collection';
                        `, []))[0]['value'];
                query.collection = decodeURI(query.collection);
                query.collection = query.collection
                    .split(',')
                    .map((dd) => {
                    function loop(array, prefix) {
                        const find = array.find((d1) => {
                            return d1.code === dd;
                        });
                        if (find) {
                            prefix.push(find.title);
                            dd = prefix.join(' / ');
                            query.accurate_search_collection = true;
                        }
                        else {
                            array.map((d1) => {
                                if (d1.array) {
                                    let prefix_i = JSON.parse(JSON.stringify(prefix));
                                    prefix_i.push(d1.title);
                                    loop(d1.array, prefix_i);
                                }
                            });
                        }
                    }
                    loop(collection_cf, []);
                    return dd;
                })
                    .join(',');
            }
            query.collection &&
                querySql.push(`(${query.collection
                    .split(',')
                    .map((dd) => {
                    return query.accurate_search_collection ? `(JSON_CONTAINS(content->'$.collection', '"${dd}"'))` : `(JSON_EXTRACT(content, '$.collection') LIKE '%${dd}%')`;
                })
                    .join(' or ')})`);
            query.sku && querySql.push(`(id in ( select product_id from \`${this.app}\`.t_variants where content->>'$.sku'=${database_js_1.default.escape(query.sku)}))`);
            if (!query.id && query.status === 'active' && query.with_hide_index !== 'true') {
                querySql.push(`((content->>'$.hideIndex' is NULL) || (content->>'$.hideIndex'='false'))`);
            }
            if (query.id_list) {
                query.order_by = ` order by id in (${query.id_list})`;
            }
            query.id_list && querySql.push(`(id in (${query.id_list}))`);
            query.status && querySql.push(`(JSON_EXTRACT(content, '$.status') = '${query.status}')`);
            query.min_price && querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price'>=${query.min_price})) `);
            query.max_price && querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price'<=${query.max_price})) `);
            const products = await this.querySql(querySql, query);
            const productList = Array.isArray(products.data) ? products.data : [products.data];
            if (this.token && this.token.userID) {
                for (const b of productList) {
                    b.content.in_wish_list =
                        (await database_js_1.default.query(`SELECT count(1)
                                 FROM \`${this.app}\`.t_post
                                 WHERE (content ->>'$.type'='wishlist')
                                   and userID = ${this.token.userID}
                                   and (content ->>'$.product_id'=${b.id})`, []))[0]['count(1)'] == '1';
                    b.content.id = b.id;
                }
            }
            const checkoutSQL = `
                SELECT JSON_EXTRACT(orderData, '$.lineItems') as lineItems
                FROM \`${this.app}\`.t_checkout
                WHERE status = 1;
            `;
            const checkouts = await database_js_1.default.query(checkoutSQL, []);
            const itemRecord = [];
            for (const checkout of checkouts) {
                if (Array.isArray(checkout.lineItems)) {
                    for (const item1 of checkout.lineItems) {
                        const index = itemRecord.findIndex((item2) => item1.id === item2.id);
                        if (index === -1) {
                            itemRecord.push({ id: parseInt(`${item1.id}`, 10), count: item1.count });
                        }
                        else {
                            itemRecord[index].count += item1.count;
                        }
                    }
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
            productList.map((product) => {
                const record = itemRecord.find((item) => item.id === product.id);
                product.total_sales = record ? record.count : 0;
                return product;
            });
            if (query.id_list && query.order_by === 'order by id desc') {
                products.data = query.id_list
                    .split(',')
                    .map((id) => {
                    return products.data.find((product) => {
                        return `${product.id}` === `${id}`;
                    });
                })
                    .filter((dd) => {
                    return dd;
                });
            }
            return products;
        }
        catch (e) {
            console.error(e);
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
                data: (await database_js_1.default.query(`SELECT *
                         FROM (${sql}) as subqyery
                             limit ${query.page * query.limit}
                            , ${query.limit}`, [])).map((dd) => {
                    dd.content.id = dd.id;
                    return dd;
                }),
                total: (await database_js_1.default.query(`SELECT count(1)
                         FROM (${sql}) as subqyery`, []))[0]['count(1)'],
            };
        }
    }
    async querySqlByVariants(querySql, query) {
        let sql = `SELECT v.id,
                          v.product_id,
                          v.content                                            as variant_content,
                          p.content                                            as product_content,
                          CAST(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) as stock
                   FROM \`${this.app}\`.t_variants AS v
                            JOIN
                        \`${this.app}\`.t_manager_post AS p ON v.product_id = p.id
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
    generateOrderID() {
        return `${new Date().getTime()}`;
    }
    async linePay(data) {
        return new Promise(async (resolve, reject) => {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://sandbox-api-pay.line.me/v2/payments/oneTimeKeys/pay',
                headers: {
                    'X-LINE-ChannelId': '2006263059',
                    'X-LINE-ChannelSecret': '9bcca1d8f66b9ec60cd1a3498be253e2',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(data),
            };
            axios_1.default
                .request(config)
                .then((response) => {
                resolve(response.data.returnCode === '0000');
            })
                .catch((error) => {
                resolve(false);
            });
        });
    }
    async toCheckout(data, type = 'add', replace_order_id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        try {
            if (replace_order_id) {
                const orderData = (await database_js_1.default.query(`SELECT *
                         FROM \`${this.app}\`.t_checkout
                         WHERE cart_token = ?
                           AND status = 0;`, [replace_order_id]))[0];
                if (orderData) {
                    await database_js_1.default.query(`DELETE
                         FROM \`${this.app}\`.t_checkout
                         WHERE cart_token = ?
                           AND status = 0;`, [replace_order_id]);
                    data.lineItems = orderData.orderData.lineItems;
                    data.email = orderData.email;
                    data.user_info = orderData.orderData.user_info;
                    data.code = orderData.orderData.code;
                    data.customer_info = orderData.orderData.customer_info;
                    data.use_rebate = orderData.orderData.use_rebate;
                }
                else {
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout 1 Error:Cant find this orderID.', null);
                }
            }
            const userClass = new user_js_1.User(this.app);
            const rebateClass = new rebate_js_1.Rebate(this.app);
            if (type !== 'preview' && !(this.token && this.token.userID) && !data.email && !(data.user_info && data.user_info.email)) {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout 2 Error:No email address.', null);
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
            if (userData && userData.account) {
                data.email = userData.account;
            }
            if (!data.email && type !== 'preview') {
                if (data.user_info && data.user_info.email) {
                    data.email = data.user_info.email;
                }
                else {
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout 3 Error:No email address.', null);
                }
            }
            if (!data.email && type !== 'preview') {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout 4 Error:No email address.', null);
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
            const shipment = await (async () => {
                var _a, _b;
                data.user_info = data.user_info || {};
                let def = ((_a = (await private_config_js_1.Private_config.getConfig({
                    appName: this.app,
                    key: 'glitter_shipment',
                }))[0]) !== null && _a !== void 0 ? _a : {
                    value: {
                        volume: [],
                        weight: [],
                        selectCalc: 'volume',
                    },
                }).value;
                const refer = ((_b = (await private_config_js_1.Private_config.getConfig({
                    appName: this.app,
                    key: 'glitter_shipment_' + data.user_info.shipment,
                }))[0]) !== null && _b !== void 0 ? _b : {
                    value: {
                        volume: [],
                        weight: [],
                        selectCalc: 'def',
                    },
                }).value;
                if (refer.selectCalc !== 'def') {
                    def = refer;
                }
                return def;
            })();
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
                    ])[0].value);
                }
                catch (e) {
                    resolve([]);
                }
            });
            shipment_setting.custom_delivery = (_a = shipment_setting.custom_delivery) !== null && _a !== void 0 ? _a : [];
            for (const form of shipment_setting.custom_delivery) {
                form.form = (await new user_js_1.User(this.app).getConfigV2({
                    user_id: 'manager',
                    key: `form_delivery_${form.id}`
                })).list || [];
            }
            shipment_setting.support = (_b = shipment_setting.support) !== null && _b !== void 0 ? _b : [];
            const carData = {
                customer_info: data.customer_info || {},
                lineItems: [],
                total: 0,
                email: (_c = data.email) !== null && _c !== void 0 ? _c : ((data.user_info && data.user_info.email) || ''),
                user_info: data.user_info,
                shipment_fee: 0,
                rebate: 0,
                use_rebate: data.use_rebate || 0,
                orderID: data.orderID || this.generateOrderID(),
                shipment_support: shipment_setting.support,
                shipment_info: shipment_setting.info,
                shipment_selector: [{
                        name: '一般宅配', value: 'normal'
                    },
                    {
                        name: '全家店到店', value: 'FAMIC2C'
                    },
                    {
                        name: '萊爾富店到店', value: 'HILIFEC2C'
                    },
                    {
                        name: 'OK超商店到店', value: 'OKMARTC2C'
                    },
                    {
                        name: '7-ELEVEN超商交貨便', value: 'UNIMARTC2C'
                    },
                    {
                        name: '實體門市取貨', value: 'shop'
                    }].concat(((_d = shipment_setting.custom_delivery) !== null && _d !== void 0 ? _d : []).map((dd) => {
                    return {
                        form: dd.form,
                        name: dd.name,
                        value: dd.id
                    };
                })).filter((d1) => {
                    return shipment_setting.support.find((d2) => {
                        return d2 === d1.value;
                    });
                }),
                use_wallet: 0,
                method: data.user_info && data.user_info.method,
                user_email: (userData && userData.account) || ((_e = data.email) !== null && _e !== void 0 ? _e : ((data.user_info && data.user_info.email) || '')),
                useRebateInfo: { point: 0 },
                custom_form_format: data.custom_form_format,
                custom_form_data: data.custom_form_data,
                orderSource: data.checkOutType === 'POS' ? `POS` : ``,
                code_array: data.code_array,
                give_away: data.give_away,
                user_rebate_sum: 0
            };
            function calculateShipment(dataList, value) {
                if (value === 0) {
                    return 0;
                }
                const productValue = parseFloat(`${value}`);
                if (isNaN(productValue) || dataList.length === 0) {
                    return 0;
                }
                for (let i = 0; i < dataList.length; i++) {
                    const currentKey = parseFloat(dataList[i].key);
                    const currentValue = parseFloat(dataList[i].value);
                    if (productValue < currentKey) {
                        return i === 0 ? 0 : parseFloat(dataList[i - 1].value);
                    }
                    else if (productValue === currentKey) {
                        return currentValue;
                    }
                }
                return parseInt(dataList[dataList.length - 1].value);
            }
            const add_on_items = [];
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
                                b.shipment_obj = {
                                    type: variant.shipment_type,
                                    value: (() => {
                                        if (!variant.shipment_type || variant.shipment_type === 'none') {
                                            return 0;
                                        }
                                        if (variant.shipment_type === 'volume') {
                                            return b.count * variant.v_length * variant.v_width * variant.v_height;
                                        }
                                        if (variant.shipment_type === 'weight') {
                                            return b.count * variant.weight;
                                        }
                                        return 0;
                                    })(),
                                };
                                variant.shipment_weight = parseInt(variant.shipment_weight || 0);
                                carData.lineItems.push(b);
                                if (type !== 'manual') {
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
                        if (!pd.productType.product && pd.productType.addProduct) {
                            b.is_add_on_items = true;
                            add_on_items.push(b);
                        }
                    }
                }
                catch (e) {
                }
            }
            carData.shipment_fee = (() => {
                let total_volume = 0;
                let total_weight = 0;
                carData.lineItems.map((item) => {
                    if (item.shipment_obj.type === 'volume') {
                        total_volume += item.shipment_obj.value;
                    }
                    if (item.shipment_obj.type === 'weight') {
                        total_weight += item.shipment_obj.value;
                    }
                });
                return calculateShipment(shipment.volume, total_volume) + calculateShipment(shipment.weight, total_weight);
            })();
            carData.total += carData.shipment_fee;
            const f_rebate = await this.formatUseRebate(carData.total, carData.use_rebate);
            carData.useRebateInfo = f_rebate;
            carData.use_rebate = f_rebate.point;
            carData.total -= carData.use_rebate;
            carData.code = data.code;
            carData.voucherList = [];
            if (userData && userData.account) {
                const data = await rebateClass.getOneRebate({ user_id: userData.userID });
                carData.user_rebate_sum = (data === null || data === void 0 ? void 0 : data.point) || 0;
            }
            function checkDuring(jsonData) {
                const now = new Date();
                const currentDateTime = now.getTime();
                const startDateTime = new Date(`${jsonData.startDate}T${jsonData.startTime}`).getTime();
                const endDateTime = jsonData.endDate === undefined ? true : new Date(`${jsonData.endDate}T${jsonData.endTime}`).getTime();
                return currentDateTime >= startDateTime && (endDateTime || currentDateTime <= endDateTime);
            }
            if (data.distribution_code) {
                const linkList = await new recommend_js_1.Recommend(this.app, this.token).getLinkList({
                    page: 0,
                    limit: 99999,
                    code: data.distribution_code,
                    status: true,
                });
                if (linkList.data.length > 0) {
                    const content = linkList.data[0].content;
                    if (checkDuring(content)) {
                        carData.distribution_info = content;
                    }
                }
            }
            if (type !== 'manual' && type !== 'manual-preview') {
                carData.lineItems = carData.lineItems.filter((dd) => {
                    return !add_on_items.includes(dd);
                });
                carData.lineItems = carData.lineItems.filter((dd) => {
                    return !add_on_items.includes(dd);
                });
                await this.checkVoucher(carData);
                add_on_items.map((dd) => {
                    var _a;
                    try {
                        if ((_a = carData.voucherList) === null || _a === void 0 ? void 0 : _a.find((d1) => {
                            return (d1.reBackType === 'add_on_items' &&
                                d1.add_on_products.find((d2) => {
                                    return `${dd.id}` === `${d2}`;
                                }));
                        })) {
                            carData.lineItems.push(dd);
                        }
                    }
                    catch (e) {
                    }
                });
                await this.checkVoucher(carData);
                const gift_product = [];
                for (const dd of carData.voucherList.filter((dd) => {
                    return dd.reBackType === 'giveaway';
                })) {
                    let index = -1;
                    for (const b of (_f = dd.add_on_products) !== null && _f !== void 0 ? _f : []) {
                        index++;
                        const pdDqlData = ((_g = (await this.getProduct({
                            page: 0,
                            limit: 50,
                            id: `${b}`,
                            status: 'active',
                        })).data) !== null && _g !== void 0 ? _g : { content: {} }).content;
                        pdDqlData.voucher_id = dd.id;
                        dd.add_on_products[index] = pdDqlData;
                    }
                    const addGift = (_h = data.give_away) === null || _h === void 0 ? void 0 : _h.find((d1) => {
                        var _a;
                        return ((_a = dd.add_on_products) !== null && _a !== void 0 ? _a : []).find((d2) => {
                            return (`${d1.id}` === `${d2.id}` &&
                                `${d1.voucher_id}` === `${dd.id}` &&
                                d2.variants.find((dd) => {
                                    return dd.spec.join('') === d1.spec.join('');
                                }));
                        });
                    });
                    if (addGift) {
                        const gift = {
                            spec: addGift.spec,
                            id: addGift.id,
                            count: 1,
                            voucher_id: dd.id,
                        };
                        const pd = ((_j = dd.add_on_products) !== null && _j !== void 0 ? _j : []).find((d2) => {
                            return `${gift.id}` === `${d2.id}` && `${gift.voucher_id}` === `${dd.id}`;
                        });
                        pd.selected = true;
                        gift_product.push(gift);
                        dd.select_gif = gift;
                        for (const b of (_k = dd.add_on_products) !== null && _k !== void 0 ? _k : []) {
                            b.have_select = true;
                        }
                        if (type !== 'preview') {
                            const variant = (_l = pd.variants.find((d1) => {
                                return d1.spec.join('-') === gift.spec.join('-');
                            })) !== null && _l !== void 0 ? _l : {};
                            carData.lineItems.push({
                                spec: gift.spec,
                                id: gift.id,
                                count: 1,
                                preview_image: pd.preview_image,
                                title: `《 贈品 》 ${pd.title}`,
                                sale_price: 0,
                                sku: variant.sku,
                            });
                        }
                    }
                    else {
                        dd.select_gif = {};
                    }
                }
                data.give_away = gift_product;
            }
            const keyData = (await private_config_js_1.Private_config.getConfig({
                appName: this.app,
                key: 'glitter_finance',
            }))[0].value;
            carData.payment_setting = {
                TYPE: keyData.TYPE,
            };
            carData.off_line_support = keyData.off_line_support;
            carData.payment_info_line_pay = keyData.payment_info_line_pay;
            carData.payment_info_atm = keyData.payment_info_atm;
            let subtotal = 0;
            carData.lineItems.map((item) => {
                var _a;
                subtotal += item.count * (item.sale_price - ((_a = item.discount_price) !== null && _a !== void 0 ? _a : 0));
            });
            if (carData.total < 0 || carData.use_rebate > subtotal) {
                carData.use_rebate = 0;
                carData.total = subtotal + carData.shipment_fee;
            }
            carData.code_array = (carData.code_array || []).filter((code) => {
                return (carData.voucherList || []).find((dd) => {
                    return dd.code === code;
                });
            });
            if (type === 'preview' || type === 'manual-preview')
                return { data: carData };
            if (type === 'manual') {
                carData.orderSource = 'manual';
                let tempVoucher = {
                    discount_total: data.voucher.discount_total,
                    end_ISO_Date: '',
                    for: 'all',
                    forKey: [],
                    method: data.voucher.method,
                    overlay: false,
                    rebate_total: data.voucher.rebate_total,
                    reBackType: data.voucher.reBackType,
                    rule: 'min_price',
                    ruleValue: 0,
                    startDate: '',
                    startTime: '',
                    start_ISO_Date: '',
                    status: 1,
                    target: '',
                    targetList: [],
                    title: data.voucher.title,
                    trigger: 'auto',
                    type: 'voucher',
                    value: data.voucher.value,
                    id: data.voucher.id,
                    bind: [],
                    bind_subtotal: 0,
                    times: 1,
                    counting: 'single',
                    conditionType: 'item',
                    device: ['normal'],
                };
                carData.discount = data.discount;
                carData.voucherList = [tempVoucher];
                carData.customer_info = data.customer_info;
                carData.total = (_m = data.total) !== null && _m !== void 0 ? _m : 0;
                carData.rebate = tempVoucher.rebate_total;
                if (tempVoucher.reBackType == 'shipment_free') {
                    carData.shipment_fee = 0;
                }
                if (tempVoucher.reBackType == 'rebate') {
                    let customerData = await userClass.getUserData(data.email || data.user_info.email, 'account');
                    if (!customerData) {
                        await new user_js_1.User(this.app).createUser(data.email, tool_js_1.default.randomString(8), {
                            email: data.email,
                            name: data.customer_info.name,
                            phone: data.customer_info.phone,
                        }, {}, true);
                        customerData = await userClass.getUserData(data.email || data.user_info.email, 'account');
                    }
                    if (carData.rebate !== 0) {
                        await rebateClass.insertRebate(customerData.userID, carData.rebate, `手動新增訂單 - 優惠券購物金：${tempVoucher.title}`);
                    }
                }
                await database_js_1.default.execute(`INSERT INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                     values (?, ?, ?, ?)`, [carData.orderID, data.pay_status, carData.email, carData]);
                return {
                    data: carData,
                };
            }
            else if (type === 'POS') {
                carData.orderSource = 'POS';
                const trans = await database_js_1.default.Transaction.build();
                if (carData.user_info.shipment === 'now') {
                    carData.progress = 'finish';
                }
                await trans.execute(`INSERT INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                     values (?, ?, ?, ?)`, [carData.orderID, data.pay_status, carData.email, JSON.stringify(carData)]);
                carData.invoice = await new invoice_js_1.Invoice(this.app).postCheckoutInvoice(carData, carData.user_info.send_type !== 'carrier');
                if (!carData.invoice) {
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', '發票開立失敗:', null);
                }
                await trans.commit();
                await trans.release();
                return { result: 'SUCCESS', message: 'POS訂單新增成功', data: carData };
            }
            else {
                if (userData && userData.userID) {
                    await rebateClass.insertRebate(userData.userID, carData.use_rebate * -1, '使用折抵', {
                        order_id: carData.orderID,
                    });
                    if (carData.voucherList && carData.voucherList.length > 0) {
                        for (const voucher of carData.voucherList) {
                            await this.insertVoucherHistory(userData.userID, carData.orderID, voucher.id);
                        }
                    }
                    const sum = (await database_js_1.default.query(`SELECT sum(money)
                                 FROM \`${this.app}\`.t_wallet
                                 WHERE status in (1, 2)
                                   and userID = ?`, [userData.userID]))[0]['sum(money)'] || 0;
                    carData.use_wallet = sum < carData.total ? sum : carData.total;
                }
            }
            const id = 'redirect_' + tool_js_1.default.randomString(6);
            const return_url = new URL(data.return_url);
            return_url.searchParams.set('cart_token', carData.orderID);
            await redis_js_1.default.setValue(id, return_url.href);
            const del_config = (await private_config_js_1.Private_config.getConfig({
                appName: this.app,
                key: 'glitter_delivery',
            }))[0];
            if (['FAMIC2C', 'UNIMARTC2C', 'HILIFEC2C', 'OKMARTC2C'].includes(carData.user_info.LogisticsSubType) && del_config && del_config.toggle === 'true') {
                const keyData = del_config.value;
                console.log(`超商物流單 開始建立（使用${keyData.Action === 'main' ? '正式' : '測試'}環境）`);
                const delivery = await new delivery_js_1.Delivery(this.app).postStoreOrder({
                    LogisticsSubType: carData.user_info.LogisticsSubType,
                    GoodsAmount: carData.total,
                    GoodsName: `訂單編號 ${carData.orderID}`,
                    ReceiverName: carData.user_info.name,
                    ReceiverCellPhone: carData.user_info.phone,
                    ReceiverStoreID: keyData.Action === 'main'
                        ? carData.user_info.CVSStoreID
                        : (() => {
                            if (carData.user_info.LogisticsSubType === 'OKMARTC2C') {
                                return '1328';
                            }
                            if (carData.user_info.LogisticsSubType === 'FAMIC2C') {
                                return '006598';
                            }
                            return '131386';
                        })(),
                });
                if (delivery.result) {
                    carData.deliveryData = delivery.data;
                    console.info('綠界物流訂單 建立成功');
                }
                else {
                    console.info(`綠界物流訂單 建立錯誤: ${delivery.message}`);
                }
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
                carData.method = 'off_line';
                await database_js_1.default.execute(`INSERT INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                     values (?, ?, ?, ?)`, [carData.orderID, 1, carData.email, carData]);
                if (carData.use_wallet > 0) {
                    new invoice_js_1.Invoice(this.app).postCheckoutInvoice(carData.orderID, false);
                }
                return {
                    is_free: true,
                    return_url: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                };
            }
            else {
                const keyData = (await private_config_js_1.Private_config.getConfig({
                    appName: this.app,
                    key: 'glitter_finance',
                }))[0].value;
                if (!['ecPay', 'newWebPay'].includes(carData.customer_info.payment_select)) {
                    carData.method = 'off_line';
                    new notify_js_1.ManagerNotify(this.app).checkout({
                        orderData: carData,
                        status: 0,
                    });
                    await auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData.orderID, carData.email);
                    await database_js_1.default.execute(`INSERT INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                         values (?, ?, ?, ?)`, [carData.orderID, 0, carData.email, carData]);
                    return {
                        off_line: true,
                        return_url: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                    };
                }
                else {
                    const subMitData = await new financial_service_js_1.default(this.app, {
                        HASH_IV: keyData.HASH_IV,
                        HASH_KEY: keyData.HASH_KEY,
                        ActionURL: keyData.ActionURL,
                        NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}`,
                        ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                        MERCHANT_ID: keyData.MERCHANT_ID,
                        TYPE: keyData.TYPE,
                    }).createOrderPage(carData);
                    return {
                        form: subMitData,
                    };
                }
            }
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout 5 Error:' + e, null);
        }
    }
    async getReturnOrder(query) {
        try {
            let querySql = ['1=1'];
            let orderString = 'order by id desc';
            if (query.search && query.searchType) {
                switch (query.searchType) {
                    case 'order_id':
                    case 'return_order_id':
                        querySql.push(`(${query.searchType} like '%${query.search}%')`);
                        break;
                    case 'name':
                    case 'phone':
                        querySql.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.customer_info.${query.searchType}')) LIKE ('%${query.search}%')))`);
                        break;
                    default: {
                        querySql.push(`JSON_CONTAINS_PATH(orderData, 'one', '$.lineItems[*].title') AND JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.lineItems[*].${query.searchType}')) REGEXP '${query.search}'`);
                    }
                }
            }
            if (query.progress) {
                let newArray = query.progress.split(',');
                let temp = '';
                temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.returnProgress')) IN (${newArray.map((status) => `"${status}"`).join(',')})`;
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
                }
            }
            if (query.archived === 'true') {
                querySql.push(`(orderData->>'$.archived'="${query.archived}")`);
            }
            else if (query.archived === 'false') {
                querySql.push(`((orderData->>'$.archived' is null) or (orderData->>'$.archived'!='true'))`);
            }
            query.status && querySql.push(`status IN (${query.status})`);
            query.email && querySql.push(`email=${database_js_1.default.escape(query.email)}`);
            query.id && querySql.push(`(content->>'$.id'=${query.id})`);
            let sql = `SELECT *
                       FROM \`${this.app}\`.t_return_order
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
    async createReturnOrder(data) {
        try {
            let returnOrderID = this.generateOrderID();
            let orderID = data.cart_token;
            let email = data.email;
            return await database_js_1.default.execute(`INSERT INTO \`${this.app}\`.t_return_order (order_id, return_order_id, email, orderData)
                 values (?, ?, ?, ?)`, [orderID, returnOrderID, email, data.orderData]);
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'createReturnOrder Error:' + e, null);
        }
    }
    async putReturnOrder(data) {
        try {
            const getData = await database_js_1.default.execute(`SELECT *
                 FROM \`${this.app}\`.t_return_order
                 WHERE id = ${data.id}
                `, []);
            if (getData[0]) {
                const origData = getData[0];
                if (origData.status != '1' && origData.orderData.returnProgress != '-1' && data.orderData.returnProgress == '-1' && data.status == '1') {
                    const userClass = new user_js_1.User(this.app);
                    const rebateClass = new rebate_js_1.Rebate(this.app);
                    const userData = await userClass.getUserData(data.orderData.customer_info.email, 'account');
                    await rebateClass.insertRebate(userData.userID, data.orderData.rebateChange, `退貨單調整-退貨單號${origData.return_order_id}`);
                }
                await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_return_order\`
                     SET ?
                     WHERE id = ?
                    `, [{ status: data.status, orderData: JSON.stringify(data.orderData) }, data.id]);
                return {
                    result: 'success',
                    orderData: data,
                };
            }
            return {
                result: 'failure',
                orderData: data,
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'putReturnOrder Error:' + e, null);
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
        var _a;
        const userClass = new user_js_1.User(this.app);
        cart.discount = 0;
        cart.lineItems.map((dd) => {
            dd.discount_price = 0;
            dd.rebate = 0;
        });
        function switchValidProduct(caseName, caseList) {
            switch (caseName) {
                case 'collection':
                    return cart.lineItems.filter((dp) => {
                        return (caseList.filter((d1) => {
                            return dp.collection.find((d2) => {
                                return d2 === d1;
                            });
                        }).length > 0);
                    });
                case 'product':
                    return cart.lineItems.filter((dp) => {
                        return (caseList
                            .map((d2) => {
                            return `${d2}`;
                        })
                            .indexOf(`${dp.id}`) !== -1);
                    });
                case 'all':
                    return cart.lineItems;
            }
            return [];
        }
        const userData = (_a = (await userClass.getUserData(cart.email, 'account'))) !== null && _a !== void 0 ? _a : { userID: -1 };
        const userLevels = await userClass.getUserLevel([{ email: cart.email }]);
        const allVoucher = (await this.querySql([`(content->>'$.type'='voucher')`], {
            page: 0,
            limit: 10000,
        })).data
            .map((dd) => {
            return dd.content;
        })
            .filter((dd) => {
            return new Date(dd.start_ISO_Date).getTime() < new Date().getTime() && (!dd.end_ISO_Date || new Date(dd.end_ISO_Date).getTime() > new Date().getTime());
        });
        const pass_ids = [];
        for (const voucher of allVoucher) {
            const checkLimited = await this.checkVoucherLimited(userData.userID, voucher.id);
            if (!checkLimited) {
                continue;
            }
            pass_ids.push(voucher.id);
        }
        let overlay = false;
        const groupList = await userClass.getUserGroups();
        const voucherList = allVoucher
            .filter((dd) => {
            return pass_ids.includes(dd.id) && dd.status === 1;
        })
            .filter((dd) => {
            if (!dd.device) {
                return true;
            }
            if (dd.device.length === 0) {
                return false;
            }
            switch (cart.orderSource) {
                case '':
                case 'manual':
                case 'normal':
                    return dd.device.includes('normal');
                case 'POS':
                    return dd.device.includes('pos');
            }
        })
            .filter((dd) => {
            if (dd.target === 'customer') {
                return dd.targetList.includes(userData.userID);
            }
            if (dd.target === 'levels') {
                if (userLevels[0]) {
                    return dd.targetList.includes(userLevels[0].data.id);
                }
                return false;
            }
            if (dd.target === 'group') {
                if (!groupList.result) {
                    return false;
                }
                let pass = false;
                for (const group of groupList.data.filter((item) => dd.targetList.includes(item.type))) {
                    if (!pass && group.users.some((item) => item.userID === userData.userID)) {
                        pass = true;
                    }
                }
                return pass;
            }
            return true;
        })
            .filter((dd) => {
            dd.bind = [];
            switch (dd.trigger) {
                case 'auto':
                    dd.bind = switchValidProduct(dd.for, dd.forKey);
                    break;
                case 'code':
                    if (dd.code === `${cart.code}` || (cart.code_array || []).includes(`${dd.code}`)) {
                        dd.bind = switchValidProduct(dd.for, dd.forKey);
                    }
                    break;
                case 'distribution':
                    if (cart.distribution_info && cart.distribution_info.voucher === dd.id) {
                        dd.bind = switchValidProduct(cart.distribution_info.relative, cart.distribution_info.relative_data);
                    }
                    break;
            }
            return dd.bind.length > 0;
        })
            .filter((dd) => {
            dd.times = 0;
            dd.bind_subtotal = 0;
            const ruleValue = parseInt(`${dd.ruleValue}`, 10);
            if (dd.conditionType === 'order') {
                let cartValue = 0;
                dd.bind.map((item) => {
                    dd.bind_subtotal += item.count * item.sale_price;
                });
                if (dd.rule === 'min_price') {
                    cartValue = dd.bind_subtotal;
                }
                if (dd.rule === 'min_count') {
                    dd.bind.map((item) => {
                        cartValue += item.count;
                    });
                }
                if (dd.reBackType === 'shipment_free') {
                    return cartValue >= ruleValue;
                }
                if (cartValue >= ruleValue) {
                    if (dd.counting === 'each') {
                        dd.times = Math.floor(cartValue / ruleValue);
                    }
                    if (dd.counting === 'single') {
                        dd.times = 1;
                    }
                }
                return dd.times > 0;
            }
            if (dd.conditionType === 'item') {
                if (dd.rule === 'min_price') {
                    dd.bind = dd.bind.filter((item) => {
                        item.times = 0;
                        if (item.count * item.sale_price >= ruleValue) {
                            if (dd.counting === 'each') {
                                item.times = Math.floor((item.count * item.sale_price) / ruleValue);
                            }
                            if (dd.counting === 'single') {
                                item.times = 1;
                            }
                        }
                        return item.times > 0;
                    });
                }
                if (dd.rule === 'min_count') {
                    dd.bind = dd.bind.filter((item) => {
                        item.times = 0;
                        if (item.count >= ruleValue) {
                            if (dd.counting === 'each') {
                                item.times = Math.floor(item.count / ruleValue);
                            }
                            if (dd.counting === 'single') {
                                item.times = 1;
                            }
                        }
                        return item.times > 0;
                    });
                }
                return dd.bind.reduce((acc, item) => acc + item.times, 0) > 0;
            }
            return false;
        })
            .sort(function (a, b) {
            let compareB = b.bind
                .map((dd) => {
                return b.method === 'percent' ? (dd.sale_price * parseFloat(b.value)) / 100 : parseFloat(b.value);
            })
                .reduce(function (accumulator, currentValue) {
                return accumulator + currentValue;
            }, 0);
            let compareA = a.bind
                .map((dd) => {
                return a.method === 'percent' ? (dd.sale_price * parseFloat(a.value)) / 100 : parseFloat(a.value);
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
            if (dd.reBackType === 'shipment_free') {
                return true;
            }
            const disValue = dd.method === 'percent' ? parseFloat(dd.value) / 100 : parseFloat(dd.value);
            if (dd.conditionType === 'order') {
                if (dd.method === 'fixed') {
                    dd.discount_total = disValue * dd.times;
                }
                if (dd.method === 'percent') {
                    dd.discount_total = dd.bind_subtotal * disValue;
                }
                if (dd.bind_subtotal >= dd.discount_total) {
                    let remain = parseInt(`${dd.discount_total}`, 10);
                    dd.bind.map((d2, index) => {
                        let discount = 0;
                        if (index === dd.bind.length - 1) {
                            discount = remain;
                        }
                        else {
                            discount = Math.floor(remain * ((d2.sale_price * d2.count) / dd.bind_subtotal));
                        }
                        if (discount > 0 && discount <= d2.sale_price * d2.count) {
                            if (dd.reBackType === 'rebate') {
                                d2.rebate += discount / d2.count;
                                cart.rebate += discount;
                                dd.rebate_total += discount;
                            }
                            else {
                                d2.discount_price += discount / d2.count;
                                cart.discount += discount;
                                dd.discount_total += discount;
                            }
                        }
                        if (remain - discount > 0) {
                            remain -= discount;
                        }
                        else {
                            remain = 0;
                        }
                    });
                    return true;
                }
                return false;
            }
            if (dd.conditionType === 'item') {
                if (dd.method === 'fixed') {
                    dd.bind = dd.bind.filter((d2) => {
                        const discount = disValue * d2.times;
                        if (discount <= d2.sale_price * d2.count) {
                            if (dd.reBackType === 'rebate') {
                                d2.rebate += discount / d2.count;
                                cart.rebate += discount;
                                dd.rebate_total += discount;
                            }
                            else {
                                d2.discount_price += discount / d2.count;
                                cart.discount += discount;
                                dd.discount_total += discount;
                            }
                            return true;
                        }
                        return false;
                    });
                }
                if (dd.method === 'percent') {
                    dd.bind = dd.bind.filter((d2) => {
                        const discount = Math.floor(d2.sale_price * d2.count * disValue);
                        if (discount <= d2.sale_price * d2.count) {
                            if (dd.reBackType === 'rebate') {
                                d2.rebate += discount / d2.count;
                                cart.rebate += discount;
                                dd.rebate_total += discount;
                            }
                            else {
                                d2.discount_price += discount / d2.count;
                                cart.discount += discount;
                                dd.discount_total += discount;
                            }
                            return true;
                        }
                        return false;
                    });
                }
            }
            return dd.bind.length > 0;
        });
        if (!voucherList.find((d2) => d2.code === `${cart.code}`)) {
            cart.code = undefined;
        }
        if (voucherList.find((d2) => d2.reBackType === 'shipment_free')) {
            cart.total -= cart.shipment_fee;
            cart.shipment_fee = 0;
        }
        cart.total -= cart.discount;
        cart.voucherList = voucherList;
    }
    async putOrder(data) {
        try {
            const update = {};
            if (data.status !== undefined) {
                update.status = data.status;
            }
            if (data.orderData) {
                update.orderData = JSON.stringify(data.orderData);
            }
            const origin = await database_js_1.default.query(`SELECT *
                 FROM \`${this.app}\`.t_checkout
                 WHERE id = ?;
                `, [data.id]);
            if (update.orderData && JSON.parse(update.orderData)) {
                const updateProgress = JSON.parse(update.orderData).progress;
                if (origin[0].orderData.progress !== 'shipping' && updateProgress === 'shipping') {
                    await auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-shipment', data.orderData.orderID, data.orderData.email);
                }
                if (origin[0].orderData.progress !== 'arrived' && updateProgress === 'arrived') {
                    await auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-shipment-arrival', data.orderData.orderID, data.orderData.email);
                }
                if (origin[0].status !== 1 && update.status === 1) {
                    await this.releaseCheckout(1, data.orderData.orderID);
                }
            }
            await database_js_1.default.query(`UPDATE \`${this.app}\`.t_checkout
                 SET ?
                 WHERE id = ?
                `, [update, data.id]);
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
    async proofPurchase(order_id, text) {
        try {
            const orderData = (await database_js_1.default.query(`select orderData
                     from \`${this.app}\`.t_checkout
                     where cart_token = ?`, [order_id]))[0]['orderData'];
            orderData.proof_purchase = text;
            new notify_js_1.ManagerNotify(this.app).uploadProof({ orderData: orderData });
            await auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'proof-purchase', order_id, orderData.email);
            await database_js_1.default.query(`update \`${this.app}\`.t_checkout
                 set orderData=?
                 where cart_token = ?`, [JSON.stringify(orderData), order_id]);
            return {
                result: true,
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ProofPurchase Error:' + e, null);
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
            if (query.is_pos === 'true') {
                querySql.push(`orderData->>'$.orderSource'='POS'`);
            }
            else if (query.is_pos === 'false') {
                querySql.push(`orderData->>'$.orderSource'<>'POS'`);
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
            if (query.filter_type === 'true' || query.archived) {
                if (query.archived === 'true') {
                    querySql.push(`(orderData->>'$.archived'="${query.archived}")`);
                }
                else {
                    querySql.push(`((orderData->>'$.archived'="${query.archived}") or (orderData->>'$.archived' is null))`);
                }
            }
            else if (query.filter_type === 'normal') {
                querySql.push(`((orderData->>'$.archived' is null) or (orderData->>'$.archived'!='true'))`);
            }
            let sql = `SELECT *
                       FROM \`${this.app}\`.t_checkout
                       WHERE ${querySql.join(' and ')} ${orderString}`;
            if (query.returnSearch == 'true') {
                const data = await database_js_1.default.query(`SELECT *
                     FROM \`${this.app}\`.t_checkout
                     WHERE cart_token = ${query.search}`, []);
                let returnSql = `SELECT *
                                 FROM \`${this.app}\`.t_return_order
                                 WHERE order_id = ${query.search}`;
                let returnData = await database_js_1.default.query(returnSql, []);
                if (returnData.length > 0) {
                    returnData.forEach((returnOrder) => {
                        var _a;
                        if (!((_a = data[0].orderData) === null || _a === void 0 ? void 0 : _a.discard)) {
                        }
                        data[0].orderData.lineItems.map((lineItem, index) => {
                            lineItem.count = lineItem.count - returnOrder.orderData.lineItems[index].return_count;
                        });
                        data[0].orderData.shipment_fee -= returnOrder.orderData.shipment_fee;
                    });
                    data[0].orderData.lineItems = data[0].orderData.lineItems.filter((dd) => {
                        return dd.count > 0;
                    });
                }
                return data[0];
            }
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
                await auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-payment-successful', order_id, cartData.email);
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
                                    if (item.rebate * item.count !== 0) {
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
                new invoice_js_1.Invoice(this.app).postCheckoutInvoice(order_id, false);
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
            const resetMins = 10;
            const now = (0, moment_1.default)().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
            await database_js_1.default.query(`
                    UPDATE \`${this.app}\`.t_voucher_history
                    SET status = 0
                    WHERE status = 2
                      AND updated_at < DATE_SUB('${now}', INTERVAL ${resetMins} MINUTE);`, []);
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'insertVoucherHistory Error:' + express_1.default, null);
        }
    }
    async postVariantsAndPriceValue(content) {
        var _a;
        try {
            content.variants = (_a = content.variants) !== null && _a !== void 0 ? _a : [];
            content.min_price = undefined;
            content.max_price = undefined;
            if (content.id) {
                await database_js_1.default.query(`DELETE
                     FROM \`${this.app}\`.t_variants
                     WHERE (product_id = ${content.id})
                       AND id > 0
                    `, []);
            }
            const formatJsonData = content.variants.map((a) => {
                var _a, _b;
                content.min_price = (_a = content.min_price) !== null && _a !== void 0 ? _a : a.sale_price;
                content.max_price = (_b = content.max_price) !== null && _b !== void 0 ? _b : a.sale_price;
                if (a.sale_price < content.min_price) {
                    content.min_price = a.sale_price;
                }
                if (a.sale_price > content.max_price) {
                    content.max_price = a.sale_price;
                }
                a.type = 'variants';
                a.product_id = content.id;
                return {
                    sql: `INSERT INTO \`${this.app}\`.t_variants
                          SET ?`,
                    data: [
                        {
                            content: JSON.stringify(a),
                            product_id: content.id,
                        },
                    ],
                };
            });
            await workers_js_1.Workers.query({
                queryList: formatJsonData,
                divisor: 8,
            });
            await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_manager_post\`
                 SET ?
                 WHERE id = ?
                `, [
                {
                    content: JSON.stringify(content),
                },
                content.id,
            ]);
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postVariantsAndPriceValue Error:' + express_1.default, null);
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
                            result[tag] = await this.getHotProducts('month');
                            break;
                        case 'hot_products_today':
                            result[tag] = await this.getHotProducts('day');
                            break;
                        case 'order_avg_sale_price':
                            result[tag] = await this.getOrderAvgSalePrice();
                            break;
                        case 'order_avg_sale_price_year':
                            result[tag] = await this.getOrderAvgSalePriceYear();
                            break;
                        case 'orders_per_month_1_year':
                            result[tag] = await this.getOrdersPerMonth1Year();
                            break;
                        case 'orders_per_month_2_weak':
                            result[tag] = await this.getOrdersPerMonth2Weak();
                            break;
                        case 'sales_per_month_2_weak':
                            result[tag] = await this.getSalesPerMonth2Weak();
                            break;
                        case 'sales_per_month_1_year':
                            result[tag] = await this.getSalesPerMonth1Year();
                            break;
                        case 'order_today':
                            result[tag] = await this.getOrderToDay();
                            break;
                        case 'recent_register':
                            result[tag] = await this.getRegisterRecent();
                            break;
                        case 'active_recent_year':
                            result[tag] = await this.getActiveRecentYear();
                            break;
                        case 'active_recent_2weak':
                            result[tag] = await this.getActiveRecent2Weak();
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
    async getActiveRecentYear() {
        try {
            const countArray = [];
            for (let index = 0; index < 12; index++) {
                const monthRegisterSQL = `
                  SELECT distinct mac_address from \`${config_js_1.saasConfig.SAAS_NAME}\`.t_monitor
                    WHERE app_name=${database_js_1.default.escape(this.app)} and  req_type='file' and (
                        MONTH (created_time) = MONTH (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH))
                        AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH))
                        );
                `;
                countArray.unshift((await database_js_1.default.query(monthRegisterSQL, [])).length);
            }
            return {
                count_array: countArray
            };
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getActiveRecentYear Error:' + e, null);
        }
    }
    async getActiveRecent2Weak() {
        try {
            const countArray = [];
            for (let index = 0; index < 14; index++) {
                const monthRegisterSQL = `
                  SELECT distinct mac_address from \`${config_js_1.saasConfig.SAAS_NAME}\`.t_monitor
                    WHERE app_name=${database_js_1.default.escape(this.app)} and
                        req_type='file' and 
                        (DAY (created_time) = DAY (DATE_SUB(NOW()
                        , INTERVAL ${index} DAY))
                      AND MONTH (created_time) = MONTH (DATE_SUB(NOW()
                        , INTERVAL ${index} DAY))
                      AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                        , INTERVAL ${index} DAY)));
                `;
                countArray.unshift((await database_js_1.default.query(monthRegisterSQL, [])).length);
            }
            return {
                count_array: countArray
            };
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getActiveRecent2Weak Error:' + e, null);
        }
    }
    async getRegister2weak() {
        try {
            const countArray = [];
            for (let index = 0; index < 14; index++) {
                const monthCheckoutSQL = `
                    SELECT count(1)
                    FROM \`${this.app}\`.t_user
                    WHERE
                        DAY (created_time) = DAY (DATE_SUB(NOW()
                        , INTERVAL ${index} DAY))
                      AND MONTH (created_time) = MONTH (DATE_SUB(NOW()
                        , INTERVAL ${index} DAY))
                      AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                        , INTERVAL ${index} DAY))
                      AND status = 1;
                `;
                countArray.unshift((await database_js_1.default.query(monthCheckoutSQL, []))[0]['count(1)']);
            }
            return { countArray };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getRegisterRecent() {
        try {
            const order = await database_js_1.default.query(`SELECT count(1)
                 FROM \`${this.app}\`.t_user
                 WHERE DATE (created_time) = CURDATE()`, []);
            const countArray = [];
            for (let index = 0; index < 12; index++) {
                const monthRegisterSQL = `
                    SELECT count(1)
                    FROM \`${this.app}\`.t_user
                    WHERE
                        MONTH (created_time) = MONTH (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH))
                      AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH));
                `;
                countArray.unshift((await database_js_1.default.query(monthRegisterSQL, []))[0]['count(1)']);
            }
            return {
                today: order[0]['count(1)'],
                count_register: countArray,
                count_2_weak_register: (await this.getRegister2weak()).countArray
            };
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getOrderToDay Error:' + e, null);
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
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getOrderToDay Error:' + e, null);
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
    async getHotProducts(duration) {
        try {
            const checkoutSQL = `
                SELECT JSON_EXTRACT(orderData, '$.lineItems') as lineItems
                FROM \`${this.app}\`.t_checkout
                WHERE status = 1
                  AND ${duration === 'day' ? `created_time BETWEEN  CURDATE() AND CURDATE() + INTERVAL 1 DAY - INTERVAL 1 SECOND` : `(created_time BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW())`};
            `;
            const checkouts = await database_js_1.default.query(checkoutSQL, []);
            const series = [];
            const categories = [];
            const product_list = [];
            for (const checkout of checkouts) {
                if (Array.isArray(checkout.lineItems)) {
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
    async getOrdersPerMonth2Weak() {
        try {
            const countArray = [];
            for (let index = 0; index < 14; index++) {
                const orderCountSQL = `
                    SELECT count(1) as c
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
                const orders = await database_js_1.default.query(orderCountSQL, []);
                countArray.unshift(orders[0].c);
            }
            return { countArray };
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
                    SELECT count(1) as c
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
    async getSalesPerMonth2Weak() {
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
                countArray.unshift(total);
            }
            return { countArray };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrderAvgSalePriceYear() {
        try {
            const countArray = [];
            for (let index = 0; index < 12; index++) {
                const orderCountSQL = `
                    SELECT orderData
                    FROM \`${this.app}\`.t_checkout
                    WHERE
                        MONTH (created_time) = MONTH (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH))
                      AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH))
                      AND status = 1;
                `;
                const monthCheckout = await database_js_1.default.query(orderCountSQL, []);
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
    async putCollection(replace, original) {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            const config = (_a = (await database_js_1.default.query(`SELECT *
                         FROM \`${this.app}\`.public_config
                         WHERE \`key\` = 'collection';`, []))[0]) !== null && _a !== void 0 ? _a : {};
            config.value = config.value || [];
            if (replace.parentTitles[0] === '(無)') {
                replace.parentTitles = [];
            }
            replace.title = replace.title.replace(/[\s,\/\\]+/g, '');
            if (replace.parentTitles.length > 0) {
                const oTitle = (_b = original.parentTitles[0]) !== null && _b !== void 0 ? _b : '';
                const rTitle = replace.parentTitles[0];
                if (!(replace.title === original.title && rTitle === oTitle)) {
                    const parent = config.value.find((col) => col.title === rTitle);
                    const children = parent.array.find((chi) => chi.title === replace.title);
                    if (children) {
                        return {
                            result: false,
                            message: `上層分類「${parent.title}」已存在「${children.title}」類別名稱`,
                        };
                    }
                }
            }
            else {
                if (replace.title !== original.title) {
                    const parent = config.value.find((col) => col.title === replace.title);
                    if (parent) {
                        return {
                            result: false,
                            message: `上層分類已存在「${parent.title}」類別名稱`,
                        };
                    }
                }
            }
            function findCodePath(items, inputCode, path = []) {
                for (const item of items) {
                    const currentPath = [...path, item];
                    if (item.code === inputCode) {
                        return currentPath;
                    }
                    if (item.array.length > 0) {
                        const result = findCodePath(item.array, inputCode, currentPath);
                        if (result.length > 0) {
                            return result;
                        }
                    }
                }
                return [];
            }
            let isUsedCode = false;
            const codeResult = findCodePath(config.value, replace.code);
            if (codeResult.length === 1) {
                isUsedCode = codeResult[0].title !== original.title;
            }
            if (codeResult.length === 2) {
                isUsedCode = codeResult[0].title !== original.parentTitles[0] || codeResult[1].title !== original.title;
            }
            if (isUsedCode) {
                return {
                    result: false,
                    message: `類別代號「${replace.code}」已被使用`,
                };
            }
            const formatData = {
                array: [],
                code: replace.code,
                title: replace.title,
                seo_title: replace.seo_title,
                seo_content: replace.seo_content,
                seo_image: replace.seo_image,
            };
            if (original.title.length === 0) {
                const parentIndex = config.value.findIndex((col) => {
                    return col.title === replace.parentTitles[0];
                });
                if (parentIndex === -1) {
                    config.value.push(formatData);
                }
                else {
                    config.value[parentIndex].array.push(formatData);
                }
            }
            else if (replace.parentTitles.length === 0) {
                const parentIndex = config.value.findIndex((col) => {
                    return col.title === original.title;
                });
                config.value[parentIndex] = Object.assign(Object.assign({}, formatData), { array: replace.subCollections.map((col) => {
                        const sub = config.value[parentIndex].array.find((item) => {
                            return item.title === col;
                        });
                        return { array: [], title: col, code: sub ? sub.code : '' };
                    }) });
            }
            else {
                const oTitle = (_c = original.parentTitles[0]) !== null && _c !== void 0 ? _c : '';
                const rTitle = replace.parentTitles[0];
                const originParentIndex = config.value.findIndex((col) => col.title === oTitle);
                const replaceParentIndex = config.value.findIndex((col) => col.title === rTitle);
                const childrenIndex = config.value[originParentIndex].array.findIndex((chi) => {
                    return chi.title === original.title;
                });
                if (originParentIndex === replaceParentIndex) {
                    config.value[originParentIndex].array[childrenIndex] = formatData;
                }
                else {
                    config.value[originParentIndex].array.splice(childrenIndex, 1);
                    config.value[replaceParentIndex].array.push(formatData);
                }
            }
            if (original.parentTitles[0]) {
                const filter_childrens = original.subCollections.filter((child) => {
                    return replace.subCollections.findIndex((child2) => child2 === child) === -1;
                });
                await this.deleteCollectionProduct(original.title, filter_childrens);
            }
            if (original.title.length > 0) {
                const delete_id_list = ((_d = original.product_id) !== null && _d !== void 0 ? _d : []).filter((oid) => {
                    var _a;
                    return ((_a = replace.product_id) !== null && _a !== void 0 ? _a : []).findIndex((rid) => rid === oid) === -1;
                });
                if (delete_id_list.length > 0) {
                    const products_sql = `SELECT *
                                          FROM \`${this.app}\`.t_manager_post
                                          WHERE id in (${delete_id_list.join(',')});`;
                    const delete_product_list = await database_js_1.default.query(products_sql, []);
                    for (const product of delete_product_list) {
                        product.content.collection = product.content.collection.filter((str) => {
                            if (original.parentTitles[0]) {
                                return str !== `${original.parentTitles[0]} / ${original.title}`;
                            }
                            else {
                                return !(str.includes(`${original.title} /`) || str === `${original.title}`);
                            }
                        });
                        await this.updateProductCollection(product.content, product.id);
                    }
                }
            }
            const get_product_sql = `SELECT *
                                     FROM \`${this.app}\`.t_manager_post
                                     WHERE id = ?`;
            for (const id of (_e = replace.product_id) !== null && _e !== void 0 ? _e : []) {
                const get_product = await database_js_1.default.query(get_product_sql, [id]);
                if (get_product[0]) {
                    const product = get_product[0];
                    const originalParentTitles = (_f = original.parentTitles[0]) !== null && _f !== void 0 ? _f : '';
                    const replaceParentTitles = (_g = replace.parentTitles[0]) !== null && _g !== void 0 ? _g : '';
                    if (original.title.length > 0) {
                        product.content.collection = product.content.collection
                            .filter((str) => {
                            if (originalParentTitles === replaceParentTitles) {
                                return true;
                            }
                            if (replaceParentTitles) {
                                if (str === originalParentTitles || str.includes(`${originalParentTitles} / ${original.title}`)) {
                                    return false;
                                }
                            }
                            else {
                                if (str === original.title || str.includes(`${original.title} /`)) {
                                    return false;
                                }
                            }
                            return true;
                        })
                            .map((str) => {
                            if (replaceParentTitles) {
                                if (str.includes(`${originalParentTitles} / ${original.title}`)) {
                                    return str.replace(original.title, replace.title);
                                }
                            }
                            else {
                                if (str === original.title || str.includes(`${original.title} /`)) {
                                    return str.replace(original.title, replace.title);
                                }
                            }
                            return str;
                        });
                    }
                    if (replaceParentTitles === '') {
                        product.content.collection.push(replace.title);
                    }
                    else {
                        product.content.collection.push(replaceParentTitles);
                        product.content.collection.push(`${replaceParentTitles} / ${replace.title}`);
                    }
                    product.content.collection = [...new Set(product.content.collection)];
                    await this.updateProductCollection(product.content, product.id);
                }
            }
            const update_col_sql = `UPDATE \`${this.app}\`.public_config
                                    SET value = ?
                                    WHERE \`key\` = 'collection';`;
            await database_js_1.default.execute(update_col_sql, [config.value]);
            return { result: true };
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'putCollection Error:' + e, null);
        }
    }
    async sortCollection(data) {
        var _a, _b;
        try {
            if (data && data[0]) {
                const parentTitle = (_a = data[0].parentTitles[0]) !== null && _a !== void 0 ? _a : '';
                const config = (_b = (await database_js_1.default.query(`SELECT *
                             FROM \`${this.app}\`.public_config
                             WHERE \`key\` = 'collection';`, []))[0]) !== null && _b !== void 0 ? _b : {};
                config.value = config.value || [];
                if (parentTitle === '') {
                    config.value = data.map((item) => {
                        return config.value.find((conf) => conf.title === item.title);
                    });
                }
                else {
                    const index = config.value.findIndex((conf) => conf.title === parentTitle);
                    const sortList = data.map((item) => {
                        if (index > -1) {
                            return config.value[index].array.find((conf) => conf.title === item.title);
                        }
                        return { title: '', array: [], code: '' };
                    });
                    config.value[index].array = sortList;
                }
                await database_js_1.default.execute(`UPDATE \`${this.app}\`.public_config
                     SET value = ?
                     WHERE \`key\` = 'collection';
                    `, [config.value]);
                return true;
            }
            return false;
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'sortCollection Error:' + e, null);
        }
    }
    checkVariantDataType(variants) {
        variants.map((dd) => {
            dd.stock && (dd.stock = parseInt(dd.stock, 10));
            dd.product_id && (dd.product_id = parseInt(dd.product_id, 10));
            dd.sale_price && (dd.sale_price = parseInt(dd.sale_price, 10));
            dd.compare_price && (dd.compare_price = parseInt(dd.compare_price, 10));
            dd.shipment_weight && (dd.shipment_weight = parseInt(dd.shipment_weight, 10));
        });
    }
    async postProduct(content) {
        var _a;
        try {
            content.type = 'product';
            this.checkVariantDataType(content.variants);
            const data = await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_manager_post\`
                 SET ?
                `, [
                {
                    userID: (_a = this.token) === null || _a === void 0 ? void 0 : _a.userID,
                    content: JSON.stringify(content),
                },
            ]);
            content.id = data.insertId;
            await database_js_1.default.query(`update \`${this.app}\`.\`t_manager_post\`
                 SET ?
                 where id = ?
                `, [
                {
                    content: JSON.stringify(content),
                },
                content.id,
            ]);
            await new Shopping(this.app, this.token).postVariantsAndPriceValue(content);
            return data.insertId;
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postProduct Error:' + e, null);
        }
    }
    async updateCollectionFromUpdateProduct(collection) {
        var _a;
        let config = (_a = (await database_js_1.default.query(`SELECT *
                     FROM \`${this.app}\`.public_config
                     WHERE \`key\` = 'collection';`, []))[0]) !== null && _a !== void 0 ? _a : {};
        config.value = config.value || [];
        function findRepeatCollection(data, fatherTitle = '') {
            let returnArray = [`${fatherTitle ? `${fatherTitle}/` : ``}${data.title}`];
            let t = [1, 2, 3];
            if (data.array && data.array.length > 0) {
                data.array.forEach((item) => {
                    returnArray.push(...findRepeatCollection(item, data.title));
                });
            }
            return returnArray;
        }
        let stillCollection = [];
        config.value.forEach((collection) => {
            stillCollection.push(...findRepeatCollection(collection));
        });
        const nonCommonElements = collection.filter((item) => !stillCollection.includes(item));
        function addCategory(nodes, levels) {
            if (levels.length === 0)
                return;
            const title = levels[0];
            let node = nodes.find((n) => n.title === title);
            if (!node) {
                node = { title, array: [] };
                nodes.push(node);
            }
            if (levels.length > 1) {
                addCategory(node.array, levels.slice(1));
            }
        }
        function buildCategoryTree(categories) {
            const root = [];
            categories.forEach((category) => {
                const levels = category.split('/');
                addCategory(root, levels);
            });
            return root;
        }
        const categoryTree = buildCategoryTree(nonCommonElements);
        config.value.push(...categoryTree);
        const update_col_sql = `UPDATE \`${this.app}\`.public_config
                                SET value = ?
                                WHERE \`key\` = 'collection';`;
        await database_js_1.default.execute(update_col_sql, [config.value]);
    }
    async postMulProduct(content) {
        try {
            if (content.collection.length > 0) {
                await this.updateCollectionFromUpdateProduct(content.collection);
            }
            let productArray = content.data;
            let passArray = [];
            productArray.forEach((product, index) => {
                product.type = 'product';
            });
            const data = await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_manager_post\` (userID, content)
                 VALUES ?`, [
                productArray.map((product) => {
                    var _a;
                    product.type = 'product';
                    this.checkVariantDataType(product.variants);
                    return [(_a = this.token) === null || _a === void 0 ? void 0 : _a.userID, JSON.stringify(product)];
                }),
            ]);
            let insertIDStart = data.insertId;
            await new Shopping(this.app, this.token).processProducts(productArray, insertIDStart);
            return insertIDStart;
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMulProduct Error:' + e, null);
        }
    }
    async processProducts(productArray, insertIDStart) {
        const promises = productArray.map((product) => {
            product.id = insertIDStart++;
            return new Shopping(this.app, this.token).postVariantsAndPriceValue(product);
        });
        await Promise.all(promises);
    }
    async putProduct(content) {
        try {
            content.type = 'product';
            this.checkVariantDataType(content.variants);
            const data = await database_js_1.default.query(`update \`${this.app}\`.\`t_manager_post\`
                 SET ?
                 where id = ?`, [
                {
                    content: JSON.stringify(content),
                },
                content.id,
            ]);
            await new Shopping(this.app, this.token).postVariantsAndPriceValue(content);
            return content.insertId;
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'putProduct Error:' + e, null);
        }
    }
    async deleteCollection(dataArray) {
        try {
            const config = (await database_js_1.default.query(`SELECT *
                     FROM \`${this.app}\`.public_config
                     WHERE \`key\` = 'collection';`, []))[0];
            const deleteList = [];
            dataArray.map((data) => {
                var _a;
                const parentTitles = (_a = data.parentTitles[0]) !== null && _a !== void 0 ? _a : '';
                if (parentTitles.length > 0) {
                    const parentIndex = config.value.findIndex((col) => col.title === parentTitles);
                    const childrenIndex = config.value[parentIndex].array.findIndex((col) => col.title === data.title);
                    const n = deleteList.findIndex((obj) => obj.parent === parentIndex);
                    if (n === -1) {
                        deleteList.push({ parent: parentIndex, child: [childrenIndex] });
                    }
                    else {
                        deleteList[n].child.push(childrenIndex);
                    }
                }
                else {
                    const parentIndex = config.value.findIndex((col) => col.title === data.title);
                    deleteList.push({ parent: parentIndex, child: [-1] });
                }
            });
            for (const d of deleteList) {
                const collection = config.value[d.parent];
                for (const index of d.child) {
                    if (index !== -1) {
                        await this.deleteCollectionProduct(collection.title, [`${collection.array[index].title}`]);
                    }
                }
                if (d.child[0] === -1) {
                    await this.deleteCollectionProduct(collection.title);
                }
            }
            deleteList.map((obj) => {
                config.value[obj.parent].array = config.value[obj.parent].array.filter((col, index) => {
                    return !obj.child.includes(index);
                });
            });
            config.value = config.value.filter((col, index) => {
                const find_collection = deleteList.find((obj) => obj.parent === index);
                return !(find_collection && find_collection.child[0] === -1);
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
                WHERE JSON_CONTAINS(content ->> '$.collection', '"${name}"');`;
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
    async getVariants(query) {
        var _a;
        try {
            let querySql = ['1=1'];
            if (query.search) {
                switch (query.searchType) {
                    case 'title':
                        querySql.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(p.content, '$.title'))) LIKE UPPER('%${query.search}%'))`);
                        break;
                    case 'sku':
                        querySql.push(`(UPPER(JSON_EXTRACT(v.content, '$.sku')) LIKE UPPER('%${query.search}%'))`);
                        break;
                }
            }
            query.id && querySql.push(`(v.id = ${query.id})`);
            query.id_list && querySql.push(`(v.id in (${query.id_list}))`);
            query.collection &&
                querySql.push(`(${query.collection
                    .split(',')
                    .map((dd) => {
                    return query.accurate_search_collection ? `(JSON_CONTAINS(p.content->'$.collection', '"${dd}"'))` : `(JSON_EXTRACT(p.content, '$.collection') LIKE '%${dd}%')`;
                })
                    .join(' or ')})`);
            query.status && querySql.push(`(JSON_EXTRACT(p.content, '$.status') = '${query.status}')`);
            query.min_price && querySql.push(`(v.content->>'$.sale_price' >= ${query.min_price})`);
            query.max_price && querySql.push(`(v.content->>'$.sale_price' <= ${query.min_price})`);
            if (query.stockCount) {
                const stockCount = (_a = query.stockCount) === null || _a === void 0 ? void 0 : _a.split(',');
                switch (stockCount[0]) {
                    case 'lessThan':
                        querySql.push(`(cast(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) < ${stockCount[1]})`);
                        break;
                    case 'moreThan':
                        querySql.push(`(cast(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) > ${stockCount[1]})`);
                        break;
                    case 'lessSafe':
                        querySql.push(`(
                            JSON_EXTRACT(v.content, '$.save_stock') is not null AND
                            (cast(JSON_EXTRACT(v.content, '$.stock') AS SIGNED) - cast(JSON_EXTRACT(v.content, '$.save_stock') AS SIGNED) < ${stockCount[1]})
                        )`);
                        break;
                }
            }
            query.order_by = (() => {
                switch (query.order_by) {
                    case 'title':
                        return `order by JSON_EXTRACT(p.content, '$.title')`;
                    case 'max_price':
                        return `order by (CAST(JSON_UNQUOTE(JSON_EXTRACT(p.content, '$.max_price')) AS SIGNED)) desc`;
                    case 'min_price':
                        return `order by (CAST(JSON_UNQUOTE(JSON_EXTRACT(p.content, '$.min_price')) AS SIGNED)) asc`;
                    case 'created_time_desc':
                        return `order by p.created_time desc`;
                    case 'created_time_asc':
                        return `order by p.created_time`;
                    case 'updated_time_desc':
                        return `order by p.updated_time desc`;
                    case 'updated_time_asc':
                        return `order by p.updated_time`;
                    case 'stock_desc':
                        return `order by stock desc`;
                    case 'stock_asc':
                        return `order by stock`;
                    case 'default':
                    default:
                        return `order by id desc`;
                }
            })();
            const data = await this.querySqlByVariants(querySql, query);
            return data;
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getVariants Error:' + e, null);
        }
    }
    async putVariants(query) {
        try {
            for (const data of query) {
                await database_js_1.default.query(`UPDATE \`${this.app}\`.t_variants
                     SET ?
                     WHERE id = ?`, [{ content: JSON.stringify(data.variant_content) }, data.id]);
                await database_js_1.default.query(`UPDATE \`${this.app}\`.t_manager_post
                     SET ?
                     WHERE id = ?`, [{ content: JSON.stringify(data.product_content) }, data.product_id]);
            }
            return {
                result: 'success',
                orderData: query,
            };
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'putVariants Error:' + express_1.default, null);
        }
    }
}
exports.Shopping = Shopping;
//# sourceMappingURL=shopping.js.map
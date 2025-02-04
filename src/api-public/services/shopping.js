"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shopping = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const financial_service_js_1 = __importStar(require("./financial-service.js"));
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
const config_js_1 = require("../../config.js");
const sms_js_1 = require("./sms.js");
const line_message_1 = require("./line-message");
const EcInvoice_1 = require("./EcInvoice");
const app_1 = __importDefault(require("../../app"));
const glitter_finance_js_1 = require("../models/glitter-finance.js");
const app_js_1 = require("../../services/app.js");
const stock_1 = require("./stock");
const seo_config_js_1 = require("../../seo-config.js");
const ses_js_1 = require("../../services/ses.js");
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
        var _a, _b;
        try {
            let store_info = await new user_js_1.User(this.app).getConfigV2({
                key: 'store-information',
                user_id: 'manager',
            });
            const store_config = await new user_js_1.User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' });
            query.language = (_a = query.language) !== null && _a !== void 0 ? _a : store_info.language_setting.def;
            query.show_hidden = (_b = query.show_hidden) !== null && _b !== void 0 ? _b : 'true';
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
                            `(UPPER(content->>'$.language_data."${query.language}".title') LIKE UPPER('%${query.search}%'))`,
                            `UPPER(content->>'$.product_tag.language."${query.language}"') like '%${query.search}%'`,
                            `JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`,
                            `JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`,
                        ].join(' or ')})`);
                        break;
                }
            }
            if (query.domain) {
                let sql_join_search = [];
                sql_join_search.push(`content->>'$.seo.domain'='${decodeURIComponent(query.domain)}'`);
                sql_join_search.push(`content->>'$.title'='${decodeURIComponent(query.domain)}'`);
                sql_join_search.push(`content->>'$.language_data."${query.language}".seo.domain'='${decodeURIComponent(query.domain)}'`);
                querySql.push(`(${sql_join_search
                    .map((dd) => {
                    return `(${dd})`;
                })
                    .join(' or ')})`);
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
                    if (dd === 'hidden') {
                        querySql.push(`(content->>'$.visible' = "false")`);
                    }
                    else if (dd !== 'all') {
                        querySql.push(`(content->>'$.productType.${dd}' = "true")`);
                    }
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
                            return (d1.language_data && d1.language_data[query.language].seo.domain === dd) || d1.code === dd;
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
            if (query.status) {
                const statusSplit = query.status.split(',').map((status) => status.trim());
                const statusJoin = statusSplit.map((status) => `"${status}"`).join(',');
                const statusCondition = `JSON_EXTRACT(content, '$.status') IN (${statusJoin})`;
                const scheduleConditions = statusSplit
                    .map((status) => {
                    switch (status) {
                        case 'inRange':
                            return `
                                OR (
                                    JSON_EXTRACT(content, '$.status') in ('active',1)
                                    AND (
                                        content->>'$.active_schedule' IS NULL OR (
                                            (
                                            CONCAT(content->>'$.active_schedule.start_ISO_Date') IS NULL OR
                                            CONCAT(content->>'$.active_schedule.start_ISO_Date') <= ${database_js_1.default.escape(new Date().toISOString())}
                                            )
                                            AND (
                                                CONCAT(content->>'$.active_schedule.end_ISO_Date') IS NULL
                                                OR CONCAT(content->>'$.active_schedule.end_ISO_Date') >= ${database_js_1.default.escape(new Date().toISOString())}
                                            )
                                        )
                                    )
                                )
                            `;
                        case 'beforeStart':
                            return `
                                OR (
                                    JSON_EXTRACT(content, '$.status') in ('active',1)
                                    AND CONCAT(content->>'$.active_schedule.start_ISO_Date') >${database_js_1.default.escape(new Date().toISOString())}
                                )
                            `;
                        case 'afterEnd':
                            return `
                                OR (
                                    JSON_EXTRACT(content, '$.status') in ('active',1)
                                    AND CONCAT(content->>'$.active_schedule.end_ISO_Date') < ${database_js_1.default.escape(new Date().toISOString())}
                                )
                            `;
                        default:
                            return '';
                    }
                })
                    .join('');
                querySql.push(`(${statusCondition} ${scheduleConditions})`);
            }
            if (query.channel) {
                const channelSplit = query.channel.split(',').map((channel) => channel.trim());
                const channelJoin = channelSplit.map((channel) => {
                    return `OR JSON_CONTAINS(content->>'$.channel', '"${channel}"')`;
                });
                querySql.push(`(content->>'$.channel' IS NULL ${channelJoin})`);
            }
            query.id_list && querySql.push(`(id in (${query.id_list}))`);
            query.min_price && querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price'>=${query.min_price})) `);
            query.max_price && querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price'<=${query.max_price})) `);
            const products = await this.querySql(querySql, query);
            const productList = (Array.isArray(products.data) ? products.data : [products.data]).filter((product) => product);
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
            if (query.id_list) {
                let tempData = [];
                query.id_list.split(',').map((id) => {
                    const find = products.data.find((product) => {
                        return `${product.id}` === `${id}`;
                    });
                    if (find) {
                        tempData.push(find);
                    }
                });
                products.data = tempData;
            }
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
            for (const dd of Array.isArray(products.data) ? products.data : [products.data]) {
                let total_sale = 0;
                if (query.language && dd.content.language_data && dd.content.language_data[`${query.language}`]) {
                    dd.content.seo = dd.content.language_data[`${query.language}`].seo;
                    dd.content.title = dd.content.language_data[`${query.language}`].title || dd.content.title;
                    dd.content.content = dd.content.language_data[`${query.language}`].content || dd.content.content;
                    dd.content.content_array = dd.content.language_data[`${query.language}`].content_array || dd.content.content_array;
                    dd.content.content_json = dd.content.language_data[`${query.language}`].content_json || dd.content.content_json;
                    dd.content.preview_image = dd.content.language_data[`${query.language}`].preview_image || dd.content.preview_image;
                    (dd.content.variants || []).map((variant) => {
                        variant.stock = 0;
                        variant.sold_out = variant.sold_out || 0;
                        variant.preview_image = variant[`preview_image_${query.language}`] || variant.preview_image;
                        if (variant.preview_image === 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg') {
                            variant.preview_image = dd.content.preview_image[0];
                        }
                        Object.keys(variant.stockList).map((dd) => {
                            if (!store_config.list.find((d1) => {
                                return d1.id === dd;
                            })) {
                                delete variant.stockList[dd];
                            }
                            else if (!variant.stockList[dd] || !variant.stockList[dd].count) {
                                delete variant.stockList[dd];
                            }
                            else {
                                variant.stockList[dd].count = parseInt(variant.stockList[dd].count, 10);
                                variant.stock += variant.stockList[dd].count;
                            }
                        });
                        store_config.list.map((d1) => {
                            if (!variant.stockList[d1.id]) {
                                variant.stockList[d1.id] = { count: 0 };
                            }
                        });
                        total_sale += variant.sold_out;
                    });
                }
                dd.total_sales = total_sale;
            }
            if (query.domain && products.data[0]) {
                products.data =
                    products.data.find((dd) => {
                        return ((dd.content.language_data &&
                            dd.content.language_data[`${query.language}`].seo &&
                            dd.content.language_data[`${query.language}`].seo.domain === decodeURIComponent(query.domain)) ||
                            (dd.content.seo && dd.content.seo.domain === decodeURIComponent(query.domain)));
                    }) || products.data[0];
            }
            if (query.domain || query.id) {
                products.data.json_ld = await seo_config_js_1.SeoConfig.getProductJsonLd(this.app, products.data.content);
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
    async querySqlBySEO(querySql, query) {
        let sql = `SELECT id, content ->>'$.title' as title, content->>'$.seo' as seo
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
    async querySqlByVariants(querySql, query) {
        let sql = `SELECT v.id,
                          v.product_id,
                          v.content                                            as variant_content,
                          p.content                                            as product_content,
                          CAST(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) as stock,
                          JSON_EXTRACT(v.content, '$.stockList')               as stockList
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
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'DeleteProduct Error:' + e, null);
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
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'DeleteVoucher Error:' + e, null);
        }
    }
    generateOrderID() {
        return `${new Date().getTime()}`;
    }
    async linePay(data) {
        return new Promise(async (resolve, reject) => {
            const keyData = (await private_config_js_1.Private_config.getConfig({
                appName: this.app,
                key: 'glitter_finance',
            }))[0].value.line_pay_scan;
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: keyData.BETA == 'true' ? 'https://sandbox-api-pay.line.me/v2/payments/oneTimeKeys/pay' : 'https://api-pay.line.me/v2/payments/oneTimeKeys/pay',
                headers: {
                    'X-LINE-ChannelId': keyData.CLIENT_ID,
                    'X-LINE-ChannelSecret': keyData.SECRET,
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
    async getShippingMethod() {
        var _a;
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
        return [
            {
                name: '中華郵政',
                value: 'normal',
            },
            {
                name: '黑貓到府',
                value: 'black_cat',
            },
            {
                name: '全家店到店',
                value: 'FAMIC2C',
            },
            {
                name: '萊爾富店到店',
                value: 'HILIFEC2C',
            },
            {
                name: 'OK超商店到店',
                value: 'OKMARTC2C',
            },
            {
                name: '7-ELEVEN超商交貨便',
                value: 'UNIMARTC2C',
            },
            {
                name: '實體門市取貨',
                value: 'shop',
            },
            {
                name: '國際快遞',
                value: 'global_express',
            },
        ]
            .concat(((_a = shipment_setting.custom_delivery) !== null && _a !== void 0 ? _a : []).map((dd) => {
            return {
                form: dd.form,
                name: dd.name,
                value: dd.id,
            };
        }))
            .filter((d1) => {
            return shipment_setting.support.find((d2) => {
                return d2 === d1.value;
            });
        });
    }
    async getPostAddressData(address) {
        try {
            const url = `http://zip5.5432.tw/zip5json.py?adrs=${encodeURIComponent(address)}`;
            const response = await axios_1.default.get(url);
            if (response && response.data) {
                return response.data;
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }
    async toCheckout(data, type = 'add', replace_order_id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        const check_time = new Date().getTime();
        try {
            data.line_items = (_a = (data.line_items || data.lineItems)) !== null && _a !== void 0 ? _a : [];
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
                    data.line_items = orderData.orderData.lineItems;
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
            if (data.order_id && type === 'POS') {
                const order = (await database_js_1.default.query(`SELECT * FROM \`${this.app}\`.t_checkout WHERE cart_token = ?`, [data.order_id]))[0];
                if (order) {
                    for (const b of order.orderData.lineItems) {
                        const pdDqlData = (await this.getProduct({
                            page: 0,
                            limit: 50,
                            id: b.id,
                            status: 'inRange',
                            channel: data.checkOutType === 'POS' ? 'pos' : undefined,
                        })).data;
                        const pd = pdDqlData.content;
                        const variant = pd.variants.find((dd) => dd.spec.join('-') === b.spec.join('-'));
                        updateStock(variant, b.deduction_log);
                        await this.updateVariantsWithSpec(variant, b.id, b.spec);
                        await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_manager_post\` SET content = ? WHERE id = ?
                            `, [JSON.stringify(pd), pdDqlData.id]);
                    }
                }
            }
            async function updateStock(variant, deductionLog) {
                Object.keys(deductionLog).forEach((key) => {
                    try {
                        variant.stockList[key].count += deductionLog[key];
                    }
                    catch (e) {
                        console.error(`Error updating stock for variant ${variant.id}:`, e);
                    }
                });
            }
            if (data.checkOutType === 'POS') {
                this.token = undefined;
            }
            console.log(`checkout-time-01=>`, new Date().getTime() - check_time);
            const userClass = new user_js_1.User(this.app);
            const rebateClass = new rebate_js_1.Rebate(this.app);
            if (type !== 'preview' && !(this.token && this.token.userID) && !data.email && !(data.user_info && data.user_info.email)) {
                if (data.user_info.phone) {
                    data.email = data.user_info.phone;
                }
                else {
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout 2 Error:No email address.', null);
                }
            }
            const getUserDataAsync = async (type, token, data) => {
                if (type === 'preview' && !((token === null || token === void 0 ? void 0 : token.userID) || data.user_info.email)) {
                    return {};
                }
                if (token === null || token === void 0 ? void 0 : token.userID) {
                    return await userClass.getUserData(`${token.userID}`, 'userID');
                }
                const email = data.email || data.user_info.email;
                const dataByAccount = await userClass.getUserData(email, 'account');
                if (dataByAccount && Object.keys(dataByAccount).length > 0) {
                    return dataByAccount;
                }
                return await userClass.getUserData(email, 'email_or_phone');
            };
            const userData = await getUserDataAsync(type, this.token, data);
            console.log(`checkout-time-02=>`, new Date().getTime() - check_time);
            if (userData && userData.account) {
                data.email = userData.account;
            }
            if (!data.email && type !== 'preview') {
                data.email = ((_b = data.user_info) === null || _b === void 0 ? void 0 : _b.email) || 'no-email';
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
            console.log(`checkout-time-03=>`, new Date().getTime() - check_time);
            const shipment = await (async () => {
                var _a, _b, _c;
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
                const refer = data.user_info.shipment === 'global_express'
                    ? ((_b = (await private_config_js_1.Private_config.getConfig({
                        appName: this.app,
                        key: 'glitter_shipment_global_' + data.user_info.country,
                    }))[0]) !== null && _b !== void 0 ? _b : {
                        value: {
                            volume: [],
                            weight: [],
                            selectCalc: 'volume',
                        },
                    }).value
                    : ((_c = (await private_config_js_1.Private_config.getConfig({
                        appName: this.app,
                        key: 'glitter_shipment_' + data.user_info.shipment,
                    }))[0]) !== null && _c !== void 0 ? _c : {
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
            console.log(`checkout-time-04=>`, new Date().getTime() - check_time);
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
            console.log(`checkout-time-05=>`, new Date().getTime() - check_time);
            shipment_setting.custom_delivery = (_c = shipment_setting.custom_delivery) !== null && _c !== void 0 ? _c : [];
            for (const form of shipment_setting.custom_delivery) {
                form.form =
                    (await new user_js_1.User(this.app).getConfigV2({
                        user_id: 'manager',
                        key: `form_delivery_${form.id}`,
                    })).list || [];
            }
            shipment_setting.support = (_d = shipment_setting.support) !== null && _d !== void 0 ? _d : [];
            shipment_setting.info =
                (_e = (shipment_setting.language_data && shipment_setting.language_data[data.language] && shipment_setting.language_data[data.language].info)) !== null && _e !== void 0 ? _e : shipment_setting.info;
            console.log(`checkout-time-06=>`, new Date().getTime() - check_time);
            const carData = {
                customer_info: data.customer_info || {},
                lineItems: [],
                total: 0,
                email: (_f = data.email) !== null && _f !== void 0 ? _f : ((data.user_info && data.user_info.email) || ''),
                user_info: data.user_info,
                shipment_fee: 0,
                rebate: 0,
                goodsWeight: 0,
                use_rebate: data.use_rebate || 0,
                orderID: data.order_id || this.generateOrderID(),
                shipment_support: shipment_setting.support,
                shipment_info: shipment_setting.info,
                shipment_selector: [
                    {
                        name: '中華郵政',
                        value: 'normal',
                    },
                    {
                        name: '黑貓到府',
                        value: 'black_cat',
                    },
                    {
                        name: '全家店到店',
                        value: 'FAMIC2C',
                    },
                    {
                        name: '萊爾富店到店',
                        value: 'HILIFEC2C',
                    },
                    {
                        name: 'OK超商店到店',
                        value: 'OKMARTC2C',
                    },
                    {
                        name: '7-ELEVEN超商交貨便',
                        value: 'UNIMARTC2C',
                    },
                    {
                        name: '實體門市取貨',
                        value: 'shop',
                    },
                    {
                        name: '國際快遞',
                        value: 'global_express',
                    },
                ]
                    .concat(((_g = shipment_setting.custom_delivery) !== null && _g !== void 0 ? _g : []).map((dd) => {
                    return {
                        form: dd.form,
                        name: dd.name,
                        value: dd.id,
                    };
                }))
                    .filter((d1) => {
                    return shipment_setting.support.find((d2) => {
                        return d2 === d1.value;
                    });
                }),
                use_wallet: 0,
                method: data.user_info && data.user_info.method,
                user_email: (userData && userData.account) || data.email || (data.user_info && data.user_info.email) || '',
                useRebateInfo: { point: 0 },
                custom_form_format: data.custom_form_format,
                custom_form_data: data.custom_form_data,
                custom_receipt_form: data.custom_receipt_form,
                orderSource: data.checkOutType === 'POS' ? `POS` : ``,
                code_array: data.code_array,
                give_away: data.give_away,
                user_rebate_sum: 0,
                language: data.language,
                pos_info: data.pos_info,
            };
            if (!data.user_info.name && userData && userData.userData) {
                carData.user_info.name = userData.userData.name;
                carData.user_info.phone = userData.userData.phone;
            }
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
            let gift_product = [];
            let saveStockArray = [];
            for (const b of data.line_items) {
                try {
                    const pdDqlData = (await this.getProduct({
                        page: 0,
                        limit: 50,
                        id: b.id,
                        status: 'inRange',
                        channel: data.checkOutType === 'POS' ? 'pos' : undefined,
                    })).data;
                    if (pdDqlData) {
                        const pd = pdDqlData.content;
                        const variant = pd.variants.find((dd) => {
                            return dd.spec.join('-') === b.spec.join('-');
                        });
                        if ((Number.isInteger(variant.stock) || variant.show_understocking === 'false') && Number.isInteger(b.count)) {
                            const isPOS = data.checkOutType === 'POS';
                            const isUnderstockingVisible = variant.show_understocking !== 'false';
                            const isManualType = type === 'manual' || type === 'manual-preview';
                            if (isPOS && isUnderstockingVisible) {
                                variant.stock = ((_j = (_h = variant.stockList) === null || _h === void 0 ? void 0 : _h[data.pos_store]) === null || _j === void 0 ? void 0 : _j.count) || 0;
                            }
                            if (variant.stock < b.count && isUnderstockingVisible && !isManualType) {
                                if (isPOS) {
                                    b.pre_order = true;
                                }
                                else {
                                    b.count = variant.stock;
                                }
                            }
                            if (variant && b.count > 0) {
                                Object.assign(b, {
                                    specs: pd.specs,
                                    language_data: pd.language_data,
                                    preview_image: variant.preview_image || pd.preview_image[0],
                                    title: pd.title,
                                    sale_price: variant.sale_price,
                                    collection: pd.collection,
                                    sku: variant.sku,
                                    stock: variant.stock,
                                    show_understocking: variant.show_understocking,
                                    stockList: variant.stockList,
                                    weight: parseInt(variant.weight || '0', 10),
                                    designated_logistics: (_k = pd.designated_logistics) !== null && _k !== void 0 ? _k : { type: 'all', list: [] },
                                });
                                const shipmentValue = (() => {
                                    if (!variant.shipment_type || variant.shipment_type === 'none')
                                        return 0;
                                    if (variant.shipment_type === 'volume') {
                                        return b.count * variant.v_length * variant.v_width * variant.v_height;
                                    }
                                    if (variant.shipment_type === 'weight') {
                                        return b.count * variant.weight;
                                    }
                                    return 0;
                                })();
                                b.shipment_obj = {
                                    type: variant.shipment_type,
                                    value: shipmentValue,
                                };
                                variant.shipment_weight = parseInt(variant.shipment_weight || '0', 10);
                                carData.lineItems.push(b);
                                if (type !== 'manual') {
                                    if (pd.productType.giveaway) {
                                        b.sale_price = 0;
                                    }
                                    else {
                                        carData.total += variant.sale_price * b.count;
                                    }
                                }
                            }
                            if (type !== 'preview' && type !== 'manual' && type !== 'manual-preview' && variant.show_understocking !== 'false') {
                                const remainingStock = Math.max(variant.stock - b.count, 0);
                                variant.stock = remainingStock;
                                if (type === 'POS') {
                                    variant.deduction_log = { [data.pos_store]: b.count };
                                    variant.stockList[data.pos_store].count -= b.count;
                                    b.deduction_log = variant.deduction_log;
                                }
                                else {
                                    const returnData = new stock_1.Stock(this.app, this.token).allocateStock(variant.stockList, b.count);
                                    variant.deduction_log = returnData.deductionLog;
                                    b.deduction_log = returnData.deductionLog;
                                }
                                saveStockArray.push(() => {
                                    return new Promise(async (resolve, reject) => {
                                        try {
                                            await this.updateVariantsWithSpec(variant, b.id, b.spec);
                                            await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_manager_post\` SET ? WHERE id = ${pdDqlData.id}
                                                `, [{ content: JSON.stringify(pd) }]);
                                            resolve(true);
                                        }
                                        catch (error) {
                                            reject(error);
                                        }
                                    });
                                });
                            }
                        }
                        if (!pd.productType.product && pd.productType.addProduct) {
                            b.is_add_on_items = true;
                            add_on_items.push(b);
                        }
                        if (pd.visible === 'false') {
                            b.is_hidden = true;
                        }
                        if (pd.productType.giveaway) {
                            b.is_gift = true;
                            b.sale_price = 0;
                            gift_product.push(b);
                        }
                        if (pd.min_qty) {
                            b.min_qty = pd.min_qty;
                        }
                        if (pd.max_qty) {
                            b.max_qty = pd.max_qty;
                        }
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
            console.log(`checkout-time-07=>`, new Date().getTime() - check_time);
            carData.shipment_fee = (() => {
                if (data.user_info.shipment === 'now') {
                    return 0;
                }
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
            console.log(`checkout-time-08=>`, new Date().getTime() - check_time);
            carData.useRebateInfo = f_rebate;
            carData.use_rebate = f_rebate.point;
            carData.total -= carData.use_rebate;
            carData.code = data.code;
            carData.voucherList = [];
            if (userData && userData.account) {
                const data = await rebateClass.getOneRebate({ user_id: userData.userID });
                carData.user_rebate_sum = (data === null || data === void 0 ? void 0 : data.point) || 0;
            }
            console.log(`checkout-time-09=>`, new Date().getTime() - check_time);
            if (data.distribution_code) {
                const linkList = await new recommend_js_1.Recommend(this.app, this.token).getLinkList({
                    page: 0,
                    limit: 99999,
                    code: data.distribution_code,
                    status: true,
                    no_detail: true,
                });
                if (linkList.data.length > 0) {
                    const content = linkList.data[0].content;
                    if (this.checkDuring(content)) {
                        carData.distribution_info = content;
                    }
                }
            }
            console.log(`checkout-time-10=>`, new Date().getTime() - check_time);
            if (type !== 'manual' && type !== 'manual-preview') {
                carData.lineItems = carData.lineItems.filter((dd) => {
                    return !add_on_items.includes(dd);
                });
                carData.lineItems = carData.lineItems.filter((dd) => {
                    return !gift_product.includes(dd);
                });
                const c_carData = await this.checkVoucher(JSON.parse(JSON.stringify(carData)));
                console.log(`checkout-time-check-voucher-1=>`, new Date().getTime() - check_time);
                add_on_items.map((dd) => {
                    var _a;
                    try {
                        if ((_a = c_carData.voucherList) === null || _a === void 0 ? void 0 : _a.find((d1) => {
                            return (d1.reBackType === 'add_on_items' &&
                                d1.add_on_products.find((d2) => {
                                    return `${dd.id}` === `${d2}`;
                                }));
                        })) {
                            carData.lineItems.push(dd);
                        }
                    }
                    catch (e) { }
                });
                await this.checkVoucher(carData);
                console.log(`checkout-time-check-voucher-2=>`, new Date().getTime() - check_time);
                let can_add_gift = [];
                (_l = carData.voucherList) === null || _l === void 0 ? void 0 : _l.filter((dd) => dd.reBackType === 'giveaway').forEach((dd) => can_add_gift.push(dd.add_on_products));
                gift_product.forEach((dd) => {
                    const max_count = can_add_gift.filter((d1) => d1.includes(dd.id)).length;
                    if (dd.count <= max_count) {
                        for (let a = 0; a < dd.count; a++) {
                            can_add_gift = can_add_gift.filter((d1) => !d1.includes(dd.id));
                        }
                        carData.lineItems.push(dd);
                    }
                });
                for (const dd of carData.voucherList.filter((dd) => dd.reBackType === 'giveaway')) {
                    let index = -1;
                    for (const b of (_m = dd.add_on_products) !== null && _m !== void 0 ? _m : []) {
                        index++;
                        const pdDqlData = ((_o = (await this.getProduct({
                            page: 0,
                            limit: 50,
                            id: `${b}`,
                            status: 'inRange',
                            channel: data.checkOutType === 'POS' ? 'pos' : undefined,
                        })).data) !== null && _o !== void 0 ? _o : { content: {} }).content;
                        pdDqlData.voucher_id = dd.id;
                        dd.add_on_products[index] = pdDqlData;
                    }
                }
            }
            console.log(`checkout-time-11=>`, new Date().getTime() - check_time);
            const keyData = (await private_config_js_1.Private_config.getConfig({
                appName: this.app,
                key: 'glitter_finance',
            }))[0].value;
            carData.payment_info_custom = keyData.payment_info_custom;
            await new Promise((resolve) => {
                var _a;
                let n = 0;
                carData.payment_customer_form = (_a = carData.payment_customer_form) !== null && _a !== void 0 ? _a : [];
                keyData.payment_info_custom.map((item, index) => {
                    new user_js_1.User(this.app)
                        .getConfigV2({
                        user_id: 'manager',
                        key: `form_finance_${item.id}`,
                    })
                        .then((data) => {
                        carData.payment_customer_form[index] = {
                            id: item.id,
                            list: data.list,
                        };
                        n++;
                        if (keyData.payment_info_custom.length === n) {
                            resolve();
                        }
                    });
                });
                if (n === 0) {
                    resolve();
                }
            });
            carData.payment_setting = glitter_finance_js_1.onlinePayArray
                .filter((dd) => {
                return keyData[dd.key] && keyData[dd.key].toggle;
            })
                .filter((dd) => {
                if (carData.orderSource === 'POS') {
                    if (dd.key === 'ut_credit_card') {
                        dd.pwd = keyData[dd.key]['pwd'];
                    }
                    return dd.type === 'pos';
                }
                else {
                    return dd.type !== 'pos';
                }
            });
            carData.off_line_support = keyData.off_line_support;
            carData.payment_info_line_pay = keyData.payment_info_line_pay;
            carData.payment_info_atm = keyData.payment_info_atm;
            let subtotal = 0;
            carData.lineItems.map((item) => {
                var _a;
                if (item.is_gift) {
                    item.sale_price = 0;
                }
                if (!item.is_gift) {
                    subtotal += item.count * (item.sale_price - ((_a = item.discount_price) !== null && _a !== void 0 ? _a : 0));
                }
            });
            if (carData.total < 0 || carData.use_rebate > subtotal) {
                carData.use_rebate = 0;
                carData.total = subtotal + carData.shipment_fee;
            }
            carData.lineItems.map((item) => {
                carData.goodsWeight += item.weight * item.count;
            });
            const excludedValuesByTotal = new Set(['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C']);
            const excludedValuesByWeight = new Set(['normal', 'black_cat']);
            const isExcludedByTotal = (dd) => {
                return carData.total > 20000 && excludedValuesByTotal.has(dd.value);
            };
            const isExcludedByWeight = (dd) => {
                return carData.goodsWeight > 20 && excludedValuesByWeight.has(dd.value);
            };
            const isIncludedInDesignatedLogistics = (dd) => {
                return carData.lineItems.every((item) => {
                    return item.designated_logistics === undefined || item.designated_logistics.type === 'all' || item.designated_logistics.list.includes(dd.value);
                });
            };
            carData.shipment_selector = carData.shipment_selector
                .filter((dd) => {
                return isIncludedInDesignatedLogistics(dd);
            })
                .map((dd) => {
                dd.isExcludedByTotal = isExcludedByTotal(dd);
                dd.isExcludedByWeight = isExcludedByWeight(dd);
                return dd;
            });
            carData.code_array = (carData.code_array || []).filter((code) => {
                return (carData.voucherList || []).find((dd) => {
                    return dd.code === code;
                });
            });
            if (type === 'preview' || type === 'manual-preview')
                return { data: carData };
            console.log(`checkout-time-12=>`, new Date().getTime() - check_time);
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
                carData.total = (_p = data.total) !== null && _p !== void 0 ? _p : 0;
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
                console.log(`checkout-time-13=>`, new Date().getTime() - check_time);
                return {
                    data: carData,
                };
            }
            else if (type === 'POS') {
                carData.orderSource = 'POS';
                if (data.checkOutType === 'POS' && Array.isArray(data.voucherList)) {
                    const manualVoucher = data.voucherList.find((item) => item.id === 0);
                    if (manualVoucher) {
                        manualVoucher.discount = manualVoucher.discount_total;
                        carData.total -= manualVoucher.discount;
                        carData.voucherList.push(manualVoucher);
                    }
                }
                const trans = await database_js_1.default.Transaction.build();
                if (data.pre_order) {
                    carData.progress = 'pre_order';
                    carData.orderStatus = '0';
                    const payTotal = data.pos_info.payment
                        .map((dd) => {
                        return dd.total;
                    })
                        .reduce((acc, val) => acc + val, 0);
                    if (carData.total <= payTotal) {
                        data.pay_status = 1;
                    }
                    else {
                        data.pay_status = 3;
                    }
                }
                else if (carData.user_info.shipment === 'now') {
                    carData.orderStatus = '1';
                    carData.progress = 'finish';
                }
                await trans.execute(`replace
                    INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                     values (?, ?, ?, ?)`, [carData.orderID, data.pay_status, carData.email, JSON.stringify(carData)]);
                if (data.invoice_select !== 'nouse') {
                    carData.invoice = await new invoice_js_1.Invoice(this.app).postCheckoutInvoice(carData, carData.user_info.send_type !== 'carrier');
                }
                await trans.commit();
                await trans.release();
                await Promise.all(saveStockArray.map((dd) => {
                    return dd();
                }));
                await new Shopping(this.app).releaseCheckout((_q = data.pay_status) !== null && _q !== void 0 ? _q : 0, carData.orderID);
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
            const redirect_url = new URL(data.return_url);
            redirect_url.searchParams.set('cart_token', carData.orderID);
            await redis_js_1.default.setValue(id, redirect_url.href);
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
                await Promise.all(saveStockArray.map((dd) => {
                    return dd();
                }));
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
                let kd = keyData[carData.customer_info.payment_select];
                switch (carData.customer_info.payment_select) {
                    case 'ecPay':
                    case 'newWebPay':
                        const subMitData = await new financial_service_js_1.default(this.app, {
                            HASH_IV: kd.HASH_IV,
                            HASH_KEY: kd.HASH_KEY,
                            ActionURL: kd.ActionURL,
                            NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`,
                            ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                            MERCHANT_ID: kd.MERCHANT_ID,
                            TYPE: carData.customer_info.payment_select,
                        }).createOrderPage(carData);
                        await Promise.all(saveStockArray.map((dd) => {
                            return dd();
                        }));
                        return {
                            form: subMitData,
                        };
                    case 'paypal':
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}`;
                        await Promise.all(saveStockArray.map((dd) => {
                            return dd();
                        }));
                        return await new financial_service_js_1.PayPal(this.app, kd).checkout(carData);
                    case 'line_pay':
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}`;
                        await Promise.all(saveStockArray.map((dd) => {
                            return dd();
                        }));
                        return await new financial_service_js_1.LinePay(this.app, kd).createOrder(carData);
                    case 'paynow':
                    default:
                        carData.method = 'off_line';
                        new notify_js_1.ManagerNotify(this.app).checkout({
                            orderData: carData,
                            status: 0,
                        });
                        if (carData.customer_info.phone) {
                            let sns = new sms_js_1.SMS(this.app);
                            await sns.sendCustomerSns('auto-sns-order-create', carData.orderID, carData.customer_info.phone);
                            console.log('訂單簡訊寄送成功');
                        }
                        if (carData.customer_info.lineID) {
                            let line = new line_message_1.LineMessage(this.app);
                            await line.sendCustomerLine('auto-line-order-create', carData.orderID, carData.customer_info.lineID);
                            console.log('訂單line訊息寄送成功');
                        }
                        auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData.orderID, carData.email, carData.language);
                        await database_js_1.default.execute(`INSERT INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                             values (?, ?, ?, ?)`, [carData.orderID, 0, carData.email, carData]);
                        await Promise.all(saveStockArray.map((dd) => {
                            return dd();
                        }));
                        return {
                            off_line: true,
                            return_url: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
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
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getReturnOrder Error:' + e, null);
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
        const userData = (_a = (await userClass.getUserData(cart.email, 'email_or_phone'))) !== null && _a !== void 0 ? _a : { userID: -1 };
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
                return userData && userData.id && dd.targetList.includes(userData.userID);
            }
            if (dd.target === 'levels') {
                if (userData && userData.member) {
                    const find = userData.member.find((dd) => {
                        return dd.trigger;
                    });
                    return find && dd.targetList.includes(find.id);
                }
                else {
                    return false;
                }
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
                            discount = Math.round(remain * ((d2.sale_price * d2.count) / dd.bind_subtotal));
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
        return cart;
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
            const store_config = await new user_js_1.User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' });
            const origin = await database_js_1.default.query(`SELECT *
                 FROM \`${this.app}\`.t_checkout
                 WHERE id = ?;
                `, [data.id]);
            if (update.orderData && JSON.parse(update.orderData)) {
                let sns = new sms_js_1.SMS(this.app);
                const updateProgress = JSON.parse(update.orderData).progress;
                function migrateOrder(lineItems) {
                    for (const lineItem of lineItems) {
                        lineItem.stockList = undefined;
                        lineItem.deduction_log = lineItem.deduction_log || {};
                        if (Object.keys(lineItem.deduction_log).length === 0) {
                            lineItem.deduction_log[store_config.list[0].id] = { count: lineItem.count };
                        }
                    }
                }
                migrateOrder(data.orderData.lineItems);
                migrateOrder(origin[0].orderData.lineItems);
                if (origin[0].orderData.orderStatus !== '-1' && data.orderData.orderStatus === '-1') {
                    for (const lineItem of origin[0].orderData.lineItems) {
                        for (const b of Object.keys(lineItem.deduction_log)) {
                            await new Shopping(this.app, this.token).calcVariantsStock(lineItem.deduction_log[b] || 0, b, lineItem.id, lineItem.spec);
                        }
                    }
                    await auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-cancel-success', data.orderData.orderID, data.orderData.email, data.orderData.language);
                }
                if (origin[0].orderData.progress !== 'shipping' && updateProgress === 'shipping') {
                    if (data.orderData.customer_info.phone) {
                        await sns.sendCustomerSns('auto-sns-shipment', data.orderData.orderID, data.orderData.customer_info.phone);
                        console.log('出貨簡訊寄送成功');
                    }
                    if (data.orderData.customer_info.lineID) {
                        let line = new line_message_1.LineMessage(this.app);
                        await line.sendCustomerLine('auto-line-shipment', data.orderData.orderID, data.orderData.customer_info.lineID);
                        console.log('出貨line訊息寄送成功');
                    }
                    await auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-shipment', data.orderData.orderID, data.orderData.email, data.orderData.language);
                }
                else if (origin[0].orderData.progress !== 'arrived' && updateProgress === 'arrived') {
                    if (data.orderData.customer_info.phone) {
                        await sns.sendCustomerSns('auto-sns-shipment-arrival', data.orderData.orderID, data.orderData.customer_info.phone);
                        console.log('到貨簡訊寄送成功');
                    }
                    if (data.orderData.customer_info.lineID) {
                        let line = new line_message_1.LineMessage(this.app);
                        await line.sendCustomerLine('auto-line-shipment-arrival', data.orderData.orderID, data.orderData.customer_info.lineID);
                        console.log('到貨line訊息寄送成功');
                    }
                    await auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-shipment-arrival', data.orderData.orderID, data.orderData.email, data.orderData.language);
                }
                else {
                    if (data.orderData.orderStatus !== '-1') {
                        for (const new_line_item of data.orderData.lineItems) {
                            const og_line_items = origin[0].orderData.lineItems.find((dd) => {
                                return dd.id === new_line_item.id && dd.spec.join('') === new_line_item.spec.join('');
                            });
                            for (const key of Object.keys(new_line_item.deduction_log)) {
                                const u_ = new_line_item.deduction_log[key];
                                const o_ = og_line_items.deduction_log[key];
                                await new Shopping(this.app, this.token).calcVariantsStock((u_ - o_) * -1, key, new_line_item.id, new_line_item.spec);
                            }
                        }
                    }
                }
                if (origin[0].status !== update.status) {
                    await this.releaseCheckout(update.status, data.orderData.orderID);
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
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'putOrder Error:' + e, null);
        }
    }
    async cancelOrder(order_id) {
        try {
            const orderList = await database_js_1.default.query(`SELECT *
                 FROM \`${this.app}\`.t_checkout
                 WHERE cart_token = ?;
                `, [order_id]);
            if (orderList.length !== 1) {
                return { data: false };
            }
            const origin = orderList[0];
            const orderData = origin.orderData;
            const proofPurchase = orderData.proof_purchase === undefined;
            const paymentStatus = origin.status === undefined || origin.status === 0 || origin.status === -1;
            const progressStatus = orderData.progress === undefined || orderData.progress === 'wait';
            const orderStatus = orderData.orderStatus === undefined || `${orderData.orderStatus}` === '0';
            if (proofPurchase && paymentStatus && progressStatus && orderStatus) {
                orderData.orderStatus = '-1';
                const record = { time: this.formatDateString(), record: '顧客手動取消訂單' };
                if (orderData.editRecord) {
                    orderData.editRecord.push(record);
                }
                else {
                    orderData.editRecord = [record];
                }
            }
            await database_js_1.default.query(`UPDATE \`${this.app}\`.t_checkout
                 SET orderData = ?
                 WHERE cart_token = ?;`, [JSON.stringify(orderData), order_id]);
            return { data: true };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'cancelOrder Error:' + e, null);
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
            await auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'proof-purchase', order_id, orderData.email, orderData.language);
            if (orderData.customer_info.phone) {
                let sns = new sms_js_1.SMS(this.app);
                await sns.sendCustomerSns('sns-proof-purchase', order_id, orderData.customer_info.phone);
                console.log('訂單待核款簡訊寄送成功');
            }
            if (orderData.customer_info.lineID) {
                let line = new line_message_1.LineMessage(this.app);
                await line.sendCustomerLine('line-proof-purchase', order_id, orderData.customer_info.lineID);
                console.log('付款成功line訊息寄送成功');
            }
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
            if (query.distribution_code) {
                let codes = query.distribution_code.split(',');
                let temp = '';
                temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.distribution_info.code')) IN (${codes.map((code) => `"${code}"`).join(',')})`;
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
                        (created_time BETWEEN ${database_js_1.default.escape(`${created_time[0]}`)} 
                        AND ${database_js_1.default.escape(`${created_time[1]}`)})
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
            const orderMath = [];
            query.email && orderMath.push(`(email=${database_js_1.default.escape(query.email)})`);
            query.phone && orderMath.push(`(email=${database_js_1.default.escape(query.phone)})`);
            if (orderMath.length) {
                querySql.push(`(${orderMath.join(' or ')})`);
            }
            query.id && querySql.push(`(content->>'$.id'=${query.id})`);
            if (query.filter_type === 'true' || query.archived) {
                if (query.archived === 'true') {
                    querySql.push(`(orderData->>'$.archived'="${query.archived}") AND (JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.orderStatus')) IS NULL 
OR JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.orderStatus')) NOT IN (-99)) `);
                }
                else {
                    querySql.push(`((orderData->>'$.archived'="${query.archived}") or (orderData->>'$.archived' is null))`);
                }
            }
            else if (query.filter_type === 'normal') {
                querySql.push(`((orderData->>'$.archived' is null) or (orderData->>'$.archived'!='true'))`);
            }
            if (!(query.filter_type === 'true' || query.archived)) {
                querySql.push(`((orderData->>'$.orderStatus' is null) or (orderData->>'$.orderStatus' NOT IN (-99)))`);
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
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getCheckOut Error:' + e, null);
        }
    }
    async releaseCheckout(status, order_id) {
        try {
            const order_data = (await database_js_1.default.query(`SELECT *
                     FROM \`${this.app}\`.t_checkout
                     WHERE cart_token = ?
                    `, [order_id]))[0];
            const original_status = order_data['status'];
            if (status === -1) {
                if (original_status === -1) {
                    return;
                }
                await database_js_1.default.execute(`UPDATE \`${this.app}\`.t_checkout
                     SET status = ?
                     WHERE cart_token = ?`, [-1, order_id]);
                await this.releaseVoucherHistory(order_id, 0);
            }
            if (original_status === 1 && status !== 1) {
                for (const b of order_data['orderData'].lineItems) {
                    await this.calcSoldOutStock(b.count * -1, b.id, b.spec);
                }
            }
            if (status === 1) {
                if (original_status === 1) {
                    return;
                }
                await database_js_1.default.execute(`UPDATE \`${this.app}\`.t_checkout
                     SET status = ?
                     WHERE cart_token = ?`, [1, order_id]);
                const cartData = (await database_js_1.default.query(`SELECT *
                         FROM \`${this.app}\`.t_checkout
                         WHERE cart_token = ?;`, [order_id]))[0];
                const brandAndMemberType = await app_js_1.App.checkBrandAndMemberType(this.app);
                const store_info = await new user_js_1.User(this.app).getConfigV2({ key: 'store-information', user_id: 'manager' });
                for (const b of order_data['orderData'].lineItems) {
                    this.calcSoldOutStock(b.count, b.id, b.spec);
                    this.soldMailNotice({
                        brand_domain: brandAndMemberType.domain,
                        shop_name: store_info.shop_name,
                        product_id: b.id,
                        order_data: cartData.orderData,
                    });
                }
                new notify_js_1.ManagerNotify(this.app).checkout({
                    orderData: cartData.orderData,
                    status: status,
                });
                await auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-payment-successful', order_id, cartData.email, cartData.orderData.language);
                if (cartData.orderData.customer_info.phone) {
                    let sns = new sms_js_1.SMS(this.app);
                    await sns.sendCustomerSns('auto-sns-payment-successful', order_id, cartData.orderData.customer_info.phone);
                    console.log('付款成功簡訊寄送成功');
                }
                if (cartData.orderData.customer_info.lineID) {
                    let line = new line_message_1.LineMessage(this.app);
                    await line.sendCustomerLine('auto-line-payment-successful', order_id, cartData.orderData.customer_info.lineID);
                    console.log('付款成功line訊息寄送成功');
                }
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
            const store_config = await new user_js_1.User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' });
            content.total_sales = 0;
            await Promise.all(content.variants.map((a) => {
                var _a, _b, _c;
                content.total_sales += (_a = a.sold_out) !== null && _a !== void 0 ? _a : 0;
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
                a.stockList = a.stockList || {};
                if (a.show_understocking === 'false') {
                    a.stock = 0;
                    a.stockList = {};
                }
                else if (Object.keys(a.stockList).length === 0) {
                    a.stockList[store_config.list[0].id] = { count: a.stock };
                }
                return new Promise(async (resolve, reject) => {
                    await database_js_1.default.query(`INSERT INTO \`${this.app}\`.t_variants
                             SET ?`, [
                        {
                            content: JSON.stringify(a),
                            product_id: content.id,
                        },
                    ]);
                    resolve(true);
                });
            }));
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
    async updateVariantsWithSpec(data, product_id, spec) {
        const sql = spec.length > 0
            ? `AND JSON_CONTAINS(content->'$.spec', JSON_ARRAY(${spec
                .map((data) => {
                return `\"${data}\"`;
            })
                .join(',')}));`
            : '';
        try {
            await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_variants\`
                 SET ?
                 WHERE product_id = ? ${sql}
                `, [
                {
                    content: JSON.stringify(data),
                },
                product_id,
            ]);
        }
        catch (e) {
            console.error('error -- ', e);
        }
    }
    async calcVariantsStock(calc, stock_id, product_id, spec) {
        try {
            const pd_data = (await database_js_1.default.query(`select *
                     from \`${this.app}\`.t_manager_post
                     where id = ?`, [product_id]))[0]['content'];
            const store_config = await new user_js_1.User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' });
            const variant_s = pd_data.variants.find((dd) => {
                return dd.spec.join('-') === spec.join('-');
            });
            if (Object.keys(variant_s.stockList).length === 0) {
                variant_s.stockList[store_config.list[0].id] = { count: variant_s.stock };
            }
            if (variant_s.stockList[stock_id]) {
                variant_s.stockList[stock_id].count = variant_s.stockList[stock_id].count || 0;
                variant_s.stockList[stock_id].count = variant_s.stockList[stock_id].count + calc;
                if (variant_s.stockList[stock_id].count < 0) {
                    variant_s.stockList[stock_id].count = 0;
                }
            }
            await this.postVariantsAndPriceValue(pd_data);
        }
        catch (e) {
            console.error('error -- can not find variants', e);
        }
    }
    async calcSoldOutStock(calc, product_id, spec) {
        var _a;
        try {
            const pd_data = (await database_js_1.default.query(`select *
                     from \`${this.app}\`.t_manager_post
                     where id = ?`, [product_id]))[0]['content'];
            const variant_s = pd_data.variants.find((dd) => {
                return dd.spec.join('-') === spec.join('-');
            });
            variant_s.sold_out = (_a = variant_s.sold_out) !== null && _a !== void 0 ? _a : 0;
            variant_s.sold_out += calc;
            if (variant_s.sold_out < 0) {
                variant_s.sold_out = 0;
            }
            await this.postVariantsAndPriceValue(pd_data);
        }
        catch (e) {
            console.error('calcSoldOutStock error', e);
        }
    }
    async soldMailNotice(json) {
        var _a, _b, _c, _d, _e;
        try {
            const order_data = json.order_data;
            const order_id = order_data.orderID;
            const pd_data = (await database_js_1.default.query(`select *
                     from \`${this.app}\`.t_manager_post
                     where id = ?`, [json.product_id]))[0]['content'];
            if (pd_data.email_notice && pd_data.email_notice.length > 0 && order_data.user_info.email) {
                const notice = pd_data.email_notice
                    .replace(/@\{\{訂單號碼\}\}/g, `<a href="https://${json.brand_domain}/order_detail?cart_token=${order_id}">${order_id}</a>`)
                    .replace(/@\{\{訂單金額\}\}/g, order_data.total)
                    .replace(/@\{\{app_name\}\}/g, json.shop_name)
                    .replace(/@\{\{user_name\}\}/g, (_a = order_data.user_info.name) !== null && _a !== void 0 ? _a : '')
                    .replace(/@\{\{姓名\}\}/g, (_b = order_data.customer_info.name) !== null && _b !== void 0 ? _b : '')
                    .replace(/@\{\{電話\}\}/g, (_c = order_data.user_info.phone) !== null && _c !== void 0 ? _c : '')
                    .replace(/@\{\{地址\}\}/g, (_d = order_data.user_info.address) !== null && _d !== void 0 ? _d : '')
                    .replace(/@\{\{信箱\}\}/g, (_e = order_data.user_info.email) !== null && _e !== void 0 ? _e : '');
                (0, ses_js_1.sendmail)(`${json.shop_name} <${process.env.smtp}>`, order_data.user_info.email, `${pd_data.title} 購買通知信`, notice, () => { });
            }
        }
        catch (e) {
            console.error('soldMailNotice error', e);
        }
    }
    async getDataAnalyze(tags, query) {
        try {
            console.log('AnalyzeTimer Start');
            const timer = {};
            query = query || '{}';
            if (tags.length > 0) {
                const result = {};
                let pass = 0;
                await new Promise(async (resolve, reject) => {
                    for (const tag of tags) {
                        console.log(`tag ===> ${tag}`);
                        new Promise(async (resolve, reject) => {
                            const start = new Date();
                            try {
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
                                    case 'hot_products_all':
                                        result[tag] = await this.getHotProducts('all', query);
                                        break;
                                    case 'hot_products_today':
                                        result[tag] = await this.getHotProducts('day');
                                        break;
                                    case 'order_avg_sale_price':
                                        result[tag] = await this.getOrderAvgSalePrice(query);
                                        break;
                                    case 'order_avg_sale_price_month':
                                        result[tag] = await this.getOrderAvgSalePriceMonth(query);
                                        break;
                                    case 'order_avg_sale_price_year':
                                        result[tag] = await this.getOrderAvgSalePriceYear(query);
                                        break;
                                    case 'order_avg_sale_price_custom':
                                        result[tag] = await this.getOrderAvgSalePriceCustomer(query);
                                        break;
                                    case 'orders_per_month_1_year':
                                        result[tag] = await this.getOrdersPerMonth1Year(query);
                                        break;
                                    case 'orders_per_month_2_week':
                                        result[tag] = await this.getOrdersPerMonth2week(query);
                                        break;
                                    case 'orders_per_month':
                                        result[tag] = await this.getOrdersPerMonth(query);
                                        break;
                                    case 'orders_per_month_custom':
                                        result[tag] = await this.getOrdersPerMonthCostom(query);
                                        break;
                                    case 'sales_per_month_2_week':
                                        result[tag] = await this.getSalesPerMonth2week(query);
                                        break;
                                    case 'sales_per_month_1_year':
                                        result[tag] = await this.getSalesPerMonth1Year(query);
                                        break;
                                    case 'sales_per_month_1_month':
                                        result[tag] = await this.getSalesPerMonth(query);
                                        break;
                                    case 'sales_per_month_custom':
                                        result[tag] = await this.getSalesPerMonthCustom(query);
                                        break;
                                    case 'order_today':
                                        result[tag] = await this.getOrderToDay();
                                        break;
                                    case 'recent_register_today':
                                        result[tag] = await this.getRegisterYear();
                                        break;
                                    case 'recent_register_week':
                                        result[tag] = await this.getRegisterYear();
                                        break;
                                    case 'recent_register_month':
                                        result[tag] = await this.getRegisterMonth();
                                        break;
                                    case 'recent_register_year':
                                        result[tag] = await this.getRegisterYear();
                                        break;
                                    case 'recent_register_custom':
                                        result[tag] = await this.getRegisterCustom(query);
                                        break;
                                    case 'active_recent_custom':
                                        result[tag] = await this.getActiveRecentCustom(query);
                                        break;
                                    case 'active_recent_month':
                                        result[tag] = await this.getActiveRecentMonth();
                                        break;
                                    case 'active_recent_year':
                                        result[tag] = await this.getActiveRecentYear();
                                        break;
                                    case 'active_recent_2week':
                                        result[tag] = await this.getActiveRecentWeek();
                                        break;
                                }
                                timer[tag] = (new Date().getTime() - start.getTime()) / 1000;
                                resolve(true);
                            }
                            catch (e) {
                                resolve(false);
                            }
                        }).then(() => {
                            pass++;
                            if (pass === tags.length) {
                                resolve(true);
                            }
                        });
                    }
                    if (pass === tags.length) {
                        resolve(true);
                    }
                });
                console.log('AnalyzeTimer ==>', timer);
                return result;
            }
            return { result: false };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getDataAnalyze Error:' + e, null);
        }
    }
    generateTimeRange(index) {
        const now = new Date();
        const ONE_DAY_TIME = 24 * 60 * 60 * 1000;
        const startDate = new Date(now.getTime() - (index + 1) * ONE_DAY_TIME);
        const endDate = new Date(startDate.getTime() + ONE_DAY_TIME);
        startDate.setUTCHours(16, 0, 0, 0);
        endDate.setUTCHours(16, 0, 0, 0);
        const startISO = startDate.toISOString();
        const endISO = endDate.toISOString();
        return { startISO, endISO };
    }
    formatDateString(isoDate) {
        const date = isoDate ? new Date(isoDate) : new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    async getActiveRecentYear() {
        const endDate = moment_1.default.tz('Asia/Taipei').toDate();
        endDate.setMonth(endDate.getMonth() + 1, 1);
        const startDate = moment_1.default.tz('Asia/Taipei').toDate();
        startDate.setMonth(endDate.getMonth() - 12);
        const sql = `
            SELECT mac_address, created_time
            FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${database_js_1.default.escape(this.app)}
              AND ip != 'ffff:127.0.0.1'
            AND req_type = 'file'
            AND created_time BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'
            GROUP BY id, mac_address
        `;
        const queryData = await database_js_1.default.query(sql, []);
        const now = moment_1.default.tz('Asia/Taipei').toDate();
        const dataList = Array.from({ length: 12 }, (_, index) => {
            const targetDate = new Date(now.getFullYear(), now.getMonth() - index, 1);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1;
            const filteredData = queryData.filter((item) => {
                const date = moment_1.default.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                return date.getFullYear() === year && date.getMonth() + 1 === month;
            });
            const uniqueMacAddresses = new Set(filteredData.map((item) => item.mac_address));
            return {
                year,
                month,
                total_count: filteredData.length,
                unique_count: uniqueMacAddresses.size,
            };
        });
        const result = dataList.map((data) => data.unique_count);
        return {
            count_array: result.reverse(),
        };
    }
    async getActiveRecentWeek() {
        const sql = `
            SELECT mac_address, ${convertTimeZone('created_time')} AS created_time
            FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${database_js_1.default.escape(this.app)}
              AND ip != 'ffff:127.0.0.1'
                AND req_type = 'file'
                AND ${convertTimeZone('created_time')} BETWEEN (DATE_SUB(${convertTimeZone('NOW()')}
                , INTERVAL 14 DAY))
              AND ${convertTimeZone('NOW()')}
            GROUP BY id, mac_address
        `;
        const queryData = await database_js_1.default.query(sql, []);
        const now = moment_1.default.tz('Asia/Taipei').toDate();
        const dataList = Array.from({ length: 14 }, (_, index) => {
            const targetDate = new Date(now.getTime());
            targetDate.setDate(new Date(now.getTime()).getDate() - index);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1;
            const day = targetDate.getDate();
            const filteredData = queryData.filter((item) => {
                const date = moment_1.default.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
            });
            const uniqueMacAddresses = new Set(filteredData.map((item) => item.mac_address));
            return {
                year,
                month,
                day,
                total_count: filteredData.length,
                unique_count: uniqueMacAddresses.size,
            };
        });
        const result = dataList.map((data) => data.unique_count);
        return {
            count_array: result.reverse(),
        };
    }
    async getActiveRecentMonth() {
        const sql = `
            SELECT mac_address, ${convertTimeZone('created_time')} AS created_time
            FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${database_js_1.default.escape(this.app)}
              AND ip != 'ffff:127.0.0.1'
                AND req_type = 'file'
                AND ${convertTimeZone('created_time')} BETWEEN (DATE_SUB(${convertTimeZone('NOW()')}
                , INTERVAL 30 DAY))
              AND ${convertTimeZone('NOW()')}
            GROUP BY id, mac_address
        `;
        const queryData = await database_js_1.default.query(sql, []);
        const now = moment_1.default.tz('Asia/Taipei').toDate();
        const dataList = Array.from({ length: 30 }, (_, index) => {
            const targetDate = new Date(now.getTime());
            targetDate.setDate(new Date(now.getTime()).getDate() - index);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1;
            const day = targetDate.getDate();
            const filteredData = queryData.filter((item) => {
                const date = moment_1.default.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
            });
            const uniqueMacAddresses = new Set(filteredData.map((item) => item.mac_address));
            return {
                year,
                month,
                day,
                total_count: filteredData.length,
                unique_count: uniqueMacAddresses.size,
            };
        });
        const result = dataList.map((data) => data.unique_count);
        return {
            count_array: result.reverse(),
        };
    }
    async getActiveRecentCustom(query) {
        const qData = JSON.parse(query);
        const formatStartDate = `"${tool_js_1.default.replaceDatetime(qData.start)}"`;
        const formatEndDate = `"${tool_js_1.default.replaceDatetime(qData.end)}"`;
        const days = this.diffDates(new Date(qData.start), new Date(qData.end));
        const sql = `
            SELECT mac_address, ${convertTimeZone('created_time')} AS created_time
            FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${database_js_1.default.escape(this.app)}
              AND ip != 'ffff:127.0.0.1'
                AND req_type = 'file'
                AND ${convertTimeZone('created_time')}
                BETWEEN ${convertTimeZone(formatStartDate)}
              AND ${convertTimeZone(formatEndDate)}
            GROUP BY id, mac_address
        `;
        const queryData = await database_js_1.default.query(sql, []);
        const now = (0, moment_1.default)(qData.end).tz('Asia/Taipei').clone().toDate();
        const dataList = Array.from({ length: days }, (_, index) => {
            const targetDate = new Date(now.getTime());
            targetDate.setDate(new Date(now.getTime()).getDate() - index);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1;
            const day = targetDate.getDate();
            const filteredData = queryData.filter((item) => {
                const date = moment_1.default.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
            });
            const uniqueMacAddresses = new Set(filteredData.map((item) => item.mac_address));
            return {
                year,
                month,
                day,
                total_count: filteredData.length,
                unique_count: uniqueMacAddresses.size,
            };
        });
        const result = dataList.map((data) => data.unique_count);
        return {
            count_array: result.reverse(),
        };
    }
    async getRegisterMonth() {
        try {
            const countArray = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 30; index++) {
                    const monthCheckoutSQL = `
                        SELECT count(1)
                        FROM \`${this.app}\`.t_user
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        countArray[index] = data[0]['count(1)'];
                        pass++;
                        if (pass === 30) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .map((dd) => {
                    return parseInt(dd);
                })
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                })
                    .reverse(),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getRegisterCustom(query) {
        try {
            const qData = JSON.parse(query);
            const days = this.diffDates(new Date(qData.start), new Date(qData.end));
            const formatEndDate = `"${tool_js_1.default.replaceDatetime(qData.end)}"`;
            const countArray = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < days; index++) {
                    const monthCheckoutSQL = `
                        SELECT count(1)
                        FROM \`${this.app}\`.t_user
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        countArray[index] = data[0]['count(1)'];
                        pass++;
                        if (pass === days) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .map((dd) => {
                    return parseInt(dd);
                })
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                })
                    .reverse(),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getRegister2week() {
        try {
            const countArray = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 14; index++) {
                    const monthCheckoutSQL = `
                        SELECT count(1)
                        FROM \`${this.app}\`.t_user
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        countArray[index] = data[0]['count(1)'];
                        pass++;
                        if (pass === 14) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .map((dd) => {
                    return parseInt(dd);
                })
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                })
                    .reverse(),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getRegisterYear() {
        try {
            const formatJsonData = [];
            const countArray = {};
            const order = await database_js_1.default.query(`SELECT count(1)
                 FROM \`${this.app}\`.t_user
                 WHERE DATE (created_time) = CURDATE()`, []);
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 12; index++) {
                    const monthRegisterSQL = `
                        SELECT count(1)
                        FROM \`${this.app}\`.t_user
                        WHERE MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                    `;
                    database_js_1.default.query(monthRegisterSQL, []).then((data) => {
                        pass++;
                        countArray[index] = data[0]['count(1)'];
                        if (pass === 12) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                today: order[0]['count(1)'],
                count_register: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                })
                    .reverse(),
                count_2_week_register: (await this.getRegister2week()).countArray,
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
    async getHotProducts(duration, query) {
        try {
            const qData = JSON.parse(query || '{}');
            const sqlArray = ['1=1'];
            if (qData.filter_date === 'custom' && qData.start && qData.end) {
                const formatStartDate = `"${tool_js_1.default.replaceDatetime(qData.start)}"`;
                const formatEndDate = `"${tool_js_1.default.replaceDatetime(qData.end)}"`;
                sqlArray.push(`
                    (${convertTimeZone('created_time')} 
                    BETWEEN ${convertTimeZone(formatStartDate)} 
                    AND ${convertTimeZone(formatEndDate)})
                `);
            }
            if (qData.come_from) {
                switch (qData.come_from) {
                    case 'all':
                        break;
                    case 'website':
                        sqlArray.push(`
                            (orderData->>'$.orderSource' <> 'POS')
                        `);
                        break;
                    case 'store':
                        sqlArray.push(`
                            (orderData->>'$.orderSource' = 'POS')
                        `);
                        break;
                    default:
                        sqlArray.push(`
                            (orderData->>'$.pos_info.where_store' = '${qData.come_from}')
                        `);
                        break;
                }
            }
            if (qData.filter_date) {
                const text = (() => {
                    switch (qData.filter_date) {
                        case 'today':
                            return '1 DAY';
                        case 'week':
                            return '7 DAY';
                        case '1m':
                            return '30 DAY';
                        case 'year':
                            return '1 YEAR';
                    }
                })();
                if (text) {
                    sqlArray.push(`
                        ${convertTimeZone('created_time')} 
                        BETWEEN (DATE_SUB(${convertTimeZone('CURDATE()')}, INTERVAL ${text})) 
                        AND ${convertTimeZone('CURDATE()')}
                    `);
                }
            }
            const checkoutSQL = `
                SELECT *
                FROM \`${this.app}\`.t_checkout
                WHERE status = 1
                  AND ${(() => {
                switch (duration) {
                    case 'day':
                        return `created_time BETWEEN  CURDATE() AND CURDATE() + INTERVAL 1 DAY - INTERVAL 1 SECOND`;
                    case 'month':
                        return `(created_time BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW())`;
                    case 'all':
                        return sqlArray.join(' AND ');
                }
            })()};
            `;
            const checkouts = await database_js_1.default.query(checkoutSQL, []);
            const series = [];
            const categories = [];
            const product_list = [];
            for (const checkout of checkouts) {
                if (Array.isArray(checkout.orderData.lineItems)) {
                    for (const item1 of checkout.orderData.lineItems) {
                        const index = product_list.findIndex((item2) => item1.title === item2.title);
                        if (index === -1) {
                            product_list.push({
                                title: item1.title,
                                count: item1.count,
                                preview_image: item1.preview_image,
                                sale_price: item1.sale_price,
                                pos_info: checkout.orderData.pos_info,
                            });
                        }
                        else {
                            product_list[index].count += item1.count;
                            product_list[index].sale_price += item1.sale_price;
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
            return { series, categories, product_list: final_product_list };
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
    async getOrdersPerMonth2week(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 14; index++) {
                    const monthCheckoutSQL = `
                        SELECT id, orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += 1;
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += 1;
                                }
                            }
                            else {
                                total_web += 1;
                            }
                            total += 1;
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === 14) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrdersPerMonth(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 30; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += 1;
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += 1;
                                }
                            }
                            else {
                                total_web += 1;
                            }
                            total += 1;
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === 30) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrdersPerMonthCostom(query) {
        try {
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            const qData = JSON.parse(query);
            const days = this.diffDates(new Date(qData.start), new Date(qData.end));
            const formatEndDate = `"${tool_js_1.default.replaceDatetime(qData.end)}"`;
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < days; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${formatEndDate}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${formatEndDate}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${formatEndDate}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += 1;
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += 1;
                                }
                            }
                            else {
                                total_web += 1;
                            }
                            total += 1;
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === days) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrdersPerMonth1Year(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 12; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += 1;
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += 1;
                                }
                            }
                            else {
                                total_web += 1;
                            }
                            total += 1;
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === 12) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    static isComeStore(checkout, qData) {
        try {
            return checkout.pos_info.where_store === qData.come_from;
        }
        catch (error) {
            return false;
        }
    }
    async getSalesPerMonth1Year(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 12; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === 12) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getSalesPerMonth2week(query) {
        try {
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            const qData = JSON.parse(query);
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 14; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === 14) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getSalesPerMonth(query) {
        try {
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            const qData = JSON.parse(query);
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 30; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from && qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === 30) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    diffDates(startDateObj, endDateObj) {
        var timeDiff = Math.abs(endDateObj.getTime() - startDateObj.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    }
    async getSalesPerMonthCustom(query) {
        try {
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            const qData = JSON.parse(query);
            const days = this.diffDates(new Date(qData.start), new Date(qData.end));
            const formatEndDate = `"${tool_js_1.default.replaceDatetime(qData.end)}"`;
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < days; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === days) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrderAvgSalePriceYear(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 12; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        let pos_count = 0;
                        let store_count = 0;
                        let web_count = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                pos_count++;
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    store_count++;
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
                                web_count++;
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = Math.floor(total_store / store_count);
                        countArrayPos[index] = Math.floor(total_pos / pos_count);
                        countArrayWeb[index] = Math.floor(total_web / web_count);
                        countArray[index] = Math.floor(total / data.length);
                        if (pass === 12) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrderAvgSalePrice(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 14; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        let pos_count = 0;
                        let store_count = 0;
                        let web_count = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                pos_count++;
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    store_count++;
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
                                web_count++;
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = Math.floor(total_store / store_count);
                        countArrayPos[index] = Math.floor(total_pos / pos_count);
                        countArrayWeb[index] = Math.floor(total_web / web_count);
                        countArray[index] = Math.floor(total / data.length);
                        if (pass === 14) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrderAvgSalePriceMonth(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 30; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        let pos_count = 0;
                        let store_count = 0;
                        let web_count = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                pos_count++;
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    store_count++;
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
                                web_count++;
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = Math.floor(total_store / store_count);
                        countArrayPos[index] = Math.floor(total_pos / pos_count);
                        countArrayWeb[index] = Math.floor(total_web / web_count);
                        countArray[index] = Math.floor(total / data.length);
                        if (pass === 30) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrderAvgSalePriceCustomer(query) {
        try {
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            const qData = JSON.parse(query);
            const days = this.diffDates(new Date(qData.start), new Date(qData.end));
            const formatEndDate = `"${tool_js_1.default.replaceDatetime(qData.end)}"`;
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < days; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        let pos_count = 0;
                        let web_count = 0;
                        let store_count = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                pos_count++;
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    store_count++;
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
                                web_count++;
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = Math.floor(total_store / store_count);
                        countArrayPos[index] = Math.floor(total_pos / pos_count);
                        countArrayWeb[index] = Math.floor(total_web / web_count);
                        countArray[index] = Math.floor(total / data.length);
                        if (pass === days) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                countArray: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getCollectionProducts(tags) {
        try {
            const products_sql = `SELECT *
                                  FROM \`${this.app}\`.t_manager_post
                                  WHERE JSON_EXTRACT(content, '$.type') = 'product';`;
            const products = await database_js_1.default.query(products_sql, []);
            const tagArray = tags.split(',');
            return products.filter((product) => {
                return tagArray.some((tag) => product.content.collection.includes(tag));
            });
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e, null);
        }
    }
    async getCollectionProductVariants(tags) {
        try {
            const products_sql = `SELECT *
                                  FROM \`${this.app}\`.t_manager_post
                                  WHERE JSON_EXTRACT(content, '$.type') = 'product';`;
            const products = await database_js_1.default.query(products_sql, []);
            const tagArray = tags.split(',');
            const filterProducts = products.filter((product) => {
                return tagArray.some((tag) => product.content.collection.includes(tag));
            });
            if (filterProducts.length === 0) {
                return [];
            }
            const sql = `
                SELECT v.id,
                       v.product_id,
                       v.content                                            as variant_content,
                       p.content                                            as product_content,
                       CAST(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) as stock
                FROM \`${this.app}\`.t_variants AS v
                         JOIN
                     \`${this.app}\`.t_manager_post AS p ON v.product_id = p.id
                WHERE product_id in (${filterProducts.map((item) => item.id).join(',')})
                ORDER BY id DESC
            `;
            const data = await database_js_1.default.query(sql, []);
            return data;
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
            const formatData = {
                array: [],
                code: replace.code,
                title: replace.title,
                seo_title: replace.seo_title,
                seo_content: replace.seo_content,
                seo_image: replace.seo_image,
                language_data: replace.language_data,
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
        var _a, _b;
        content.seo = (_a = content.seo) !== null && _a !== void 0 ? _a : {};
        content.seo.domain = content.seo.domain || content.title;
        const language = await app_js_1.App.getSupportLanguage(this.app);
        for (const b of language) {
            const find_conflict = await database_js_1.default.query(`select count(1)
                 from \`${this.app}\`.\`t_manager_post\`
                 where content ->>'$.language_data."${b}".seo.domain'='${decodeURIComponent(content.language_data[b].seo.domain)}'
                `, []);
            if (find_conflict[0]['count(1)'] > 0) {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'DOMAIN ALREADY EXISTS:', {
                    message: '網域已被使用',
                    code: '733',
                });
            }
        }
        try {
            content.type = 'product';
            this.checkVariantDataType(content.variants);
            const data = await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_manager_post\`
                 SET ?
                `, [
                {
                    userID: (_b = this.token) === null || _b === void 0 ? void 0 : _b.userID,
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
            const store_info = await new user_js_1.User(this.app).getConfigV2({
                key: 'store-information',
                user_id: 'manager',
            });
            if (content.collection.length > 0) {
                await this.updateCollectionFromUpdateProduct(content.collection);
            }
            let productArray = content.data;
            await Promise.all(productArray.map((product, index) => {
                return new Promise(async (resolve, reject) => {
                    product.type = 'product';
                    if (product.id) {
                        const og_data = (await database_js_1.default.query(`select *
                                     from \`${this.app}\`.\`t_manager_post\`
                                     where id = ?`, [product.id]))[0];
                        if (og_data) {
                            delete product['content'];
                            delete product['preview_image'];
                            const og_content = og_data['content'];
                            if (og_content.language_data && og_content.language_data[store_info.language_setting.def]) {
                                og_content.language_data[store_info.language_setting.def].seo = product.seo;
                                og_content.language_data[store_info.language_setting.def].title = product.title;
                            }
                            product = Object.assign(Object.assign({}, og_content), product);
                            product.preview_image = og_data['content'].preview_image || [];
                            productArray[index] = product;
                        }
                        else {
                            console.log(`product-not-in==>`, product);
                        }
                    }
                    else {
                        console.log(`no-product-id==>`, product);
                    }
                    resolve(true);
                });
            }));
            let max_id = (await database_js_1.default.query(`select max(id)
                         from \`${this.app}\`.t_manager_post`, []))[0]['max(id)'] || 0;
            productArray.map((product) => {
                var _a;
                if (!product.id) {
                    product.id = max_id++;
                }
                product.type = 'product';
                this.checkVariantDataType(product.variants);
                return [product.id || null, (_a = this.token) === null || _a === void 0 ? void 0 : _a.userID, JSON.stringify(product)];
            });
            const data = await database_js_1.default.query(`replace
                INTO \`${this.app}\`.\`t_manager_post\` (id,userID,content) values ?`, [
                productArray.map((product) => {
                    var _a;
                    if (!product.id) {
                        product.id = max_id++;
                    }
                    product.type = 'product';
                    this.checkVariantDataType(product.variants);
                    return [product.id || null, (_a = this.token) === null || _a === void 0 ? void 0 : _a.userID, JSON.stringify(product)];
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
            product.id = product.id || insertIDStart++;
            return new Shopping(this.app, this.token).postVariantsAndPriceValue(product);
        });
        await Promise.all(promises);
    }
    async putProduct(content) {
        if (content.language_data) {
            const language = await app_js_1.App.getSupportLanguage(this.app);
            for (const b of language) {
                const find_conflict = await database_js_1.default.query(`select count(1)
                     from \`${this.app}\`.\`t_manager_post\`
                     where content ->>'$.language_data."${b}".seo.domain'='${decodeURIComponent(content.language_data[b].seo.domain)}'
                       and id != ${content.id}`, []);
                if (find_conflict[0]['count(1)'] > 0) {
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'DOMAIN ALREADY EXISTS:', {
                        message: '網域已被使用',
                        code: '733',
                    });
                }
            }
        }
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
    checkDuring(jsonData) {
        const now = new Date().getTime();
        const startDateTime = new Date(moment_1.default.tz(`${jsonData.startDate} ${jsonData.startTime}:00`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Taipei').toISOString()).getTime();
        if (isNaN(startDateTime))
            return false;
        if (!jsonData.endDate || !jsonData.endTime)
            return true;
        const endDateTime = new Date(moment_1.default.tz(`${jsonData.endDate} ${jsonData.endTime}:00`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Taipei').toISOString()).getTime();
        if (isNaN(endDateTime))
            return false;
        return now >= startDateTime && now <= endDateTime;
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
            if (query.productType !== 'all') {
                const queryOR = [];
                if (query.productType) {
                    query.productType.split(',').map((dd) => {
                        if (dd === 'hidden') {
                            queryOR.push(`(p.content->>'$.visible' = "false")`);
                        }
                        else {
                            queryOR.push(`(p.content->>'$.productType.${dd}' = "true")`);
                        }
                    });
                }
                else if (!query.id) {
                    queryOR.push(`(p.content->>'$.productType.product' = "true")`);
                }
                querySql.push(`(${queryOR
                    .map((dd) => {
                    return ` ${dd} `;
                })
                    .join(' or ')})`);
            }
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
    async getDomain(query) {
        try {
            let querySql = [`(content->>'$.type'='product')`];
            if (query.search) {
                querySql.push(`(${[
                    `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`,
                    `JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`,
                    `JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`,
                ].join(' or ')})`);
            }
            if (query.domain) {
                querySql.push(`content->>'$.seo.domain'='${decodeURIComponent(query.domain)}'`);
            }
            if (`${query.id || ''}`) {
                if (`${query.id}`.includes(',')) {
                    querySql.push(`id in (${query.id})`);
                }
                else {
                    querySql.push(`id = ${query.id}`);
                }
            }
            const data = await this.querySqlBySEO(querySql, Object.assign({ limit: 10000, page: 0 }, query));
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
    async postCustomerInvoice(obj) {
        await this.putOrder({
            id: obj.orderData.id,
            orderData: obj.orderData.orderData,
            status: obj.orderData.status,
        });
        await new invoice_js_1.Invoice(this.app).postCheckoutInvoice(obj.orderID, obj.invoice_data.getPaper == 'Y');
        await new invoice_js_1.Invoice(this.app).updateInvoice({
            orderID: obj.orderData.cart_token,
            invoice_data: obj.invoice_data,
        });
    }
    async voidInvoice(obj) {
        var _a, _b;
        const config = await app_1.default.getAdConfig(this.app, 'invoice_setting');
        const passData = {
            MerchantID: config.merchNO,
            InvoiceNo: obj.invoice_no,
            InvoiceDate: obj.createDate,
            Reason: obj.reason,
        };
        let dbData = await database_js_1.default.query(`SELECT *
             FROM \`${this.app}\`.t_invoice_memory
             WHERE invoice_no = ?`, [obj.invoice_no]);
        dbData = dbData[0];
        dbData.invoice_data.remark = (_b = (_a = dbData.invoice_data) === null || _a === void 0 ? void 0 : _a.remark) !== null && _b !== void 0 ? _b : {};
        dbData.invoice_data.remark.voidReason = obj.reason;
        await EcInvoice_1.EcInvoice.voidInvoice({
            hashKey: config.hashkey,
            hash_IV: config.hashiv,
            merchNO: config.merchNO,
            app_name: this.app,
            invoice_data: passData,
            beta: config.point === 'beta',
        });
        await database_js_1.default.query(`UPDATE \`${this.app}\`.t_invoice_memory
             SET ?
             WHERE invoice_no = ?`, [{ status: 2, invoice_data: JSON.stringify(dbData.invoice_data) }, obj.invoice_no]);
    }
    async allowanceInvoice(obj) {
        const config = await app_1.default.getAdConfig(this.app, 'invoice_setting');
        let invoiceData = await database_js_1.default.query(`
                SELECT *
                FROM \`${this.app}\`.t_invoice_memory
                WHERE invoice_no = "${obj.invoiceID}"
            `, []);
        invoiceData = invoiceData[0];
        const passData = {
            MerchantID: config.merchNO,
            InvoiceNo: obj.invoiceID,
            InvoiceDate: invoiceData.invoice_data.response.InvoiceDate.split('+')[0],
            AllowanceNotify: 'E',
            CustomerName: invoiceData.invoice_data.original_data.CustomerName,
            NotifyPhone: invoiceData.invoice_data.original_data.CustomerPhone,
            NotifyMail: invoiceData.invoice_data.original_data.CustomerEmail,
            AllowanceAmount: obj.allowanceInvoiceTotalAmount,
            Items: obj.allowanceData.invoiceArray,
        };
        return await EcInvoice_1.EcInvoice.allowanceInvoice({
            hashKey: config.hashkey,
            hash_IV: config.hashiv,
            merchNO: config.merchNO,
            app_name: this.app,
            allowance_data: passData,
            beta: config.point === 'beta',
            db_data: obj.allowanceData,
            order_id: obj.orderID,
        });
    }
    async voidAllowance(obj) {
        const config = await app_1.default.getAdConfig(this.app, 'invoice_setting');
        const passData = {
            MerchantID: config.merchNO,
            InvoiceNo: obj.invoiceNo,
            AllowanceNo: obj.allowanceNo,
            Reason: obj.voidReason,
        };
        await EcInvoice_1.EcInvoice.voidAllowance({
            hashKey: config.hashkey,
            hash_IV: config.hashiv,
            merchNO: config.merchNO,
            app_name: this.app,
            allowance_data: passData,
            beta: config.point === 'beta',
        });
    }
    static async currencyCovert(base) {
        const data = (await database_js_1.default.query(`SELECT *
                 FROM ${config_js_1.saasConfig.SAAS_NAME}.currency_config
                 order by id desc limit 0,1;`, []))[0]['json']['rates'];
        const base_m = data[base];
        Object.keys(data).map((dd) => {
            data[dd] = data[dd] / base_m;
        });
        return data;
    }
}
exports.Shopping = Shopping;
function convertTimeZone(date) {
    return `CONVERT_TZ(${date}, '+00:00', '+08:00')`;
}
//# sourceMappingURL=shopping.js.map
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
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
const axios_1 = __importDefault(require("axios"));
const app_1 = __importDefault(require("../../app"));
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const financial_service_js_1 = __importStar(require("./financial-service.js"));
const private_config_js_1 = require("../../services/private_config.js");
const user_js_1 = require("./user.js");
const invoice_js_1 = require("./invoice.js");
const rebate_js_1 = require("./rebate.js");
const custom_code_js_1 = require("../services/custom-code.js");
const notify_js_1 = require("./notify.js");
const auto_send_email_js_1 = require("./auto-send-email.js");
const recommend_js_1 = require("./recommend.js");
const config_js_1 = require("../../config.js");
const sms_js_1 = require("./sms.js");
const line_message_1 = require("./line-message");
const EcInvoice_1 = require("./EcInvoice");
const glitter_finance_js_1 = require("../models/glitter-finance.js");
const app_js_1 = require("../../services/app.js");
const stock_1 = require("./stock");
const order_event_js_1 = require("./order-event.js");
const seo_config_js_1 = require("../../seo-config.js");
const ses_js_1 = require("../../services/ses.js");
const shopee_1 = require("./shopee");
const shipment_config_js_1 = require("../config/shipment-config.js");
const paynow_logistics_js_1 = require("./paynow-logistics.js");
const checkout_js_1 = require("./checkout.js");
const product_initial_js_1 = require("./product-initial.js");
const ut_timer_js_1 = require("../utils/ut-timer.js");
const auto_fcm_js_1 = require("../../public-config-initial/auto-fcm.js");
const handlePaymentTransaction_js_1 = __importDefault(require("./model/handlePaymentTransaction.js"));
const Language_js_1 = require("../../Language.js");
class OrderDetail {
    constructor(subtotal, shipment) {
        this.discount = 0;
        this.rebate = 0;
        this.cart_token = '';
        this.tag = 'manual';
        this.lineItems = [];
        this.subtotal = subtotal;
        this.shipment = shipment;
        this.customer_info = this.initCustomerInfo();
        this.user_info = this.initUserInfo();
        this.total = 0;
        this.pay_status = '0';
        this.voucher = this.initVoucher();
    }
    initCustomerInfo() {
        return {
            name: '',
            phone: '',
            email: '',
        };
    }
    initUserInfo() {
        return {
            CVSAddress: '',
            CVSStoreID: '',
            CVSStoreName: '',
            CVSTelephone: '',
            MerchantTradeNo: '',
            address: '',
            email: '',
            name: '',
            note: '',
            phone: '',
            shipment: 'normal',
        };
    }
    initVoucher() {
        return {
            id: 0,
            discount_total: 0,
            end_ISO_Date: '',
            for: 'product',
            forKey: [],
            method: 'fixed',
            overlay: false,
            reBackType: 'rebate',
            rebate_total: 0,
            rule: 'min_count',
            ruleValue: 0,
            startDate: '',
            startTime: '',
            start_ISO_Date: '',
            status: 1,
            target: '',
            targetList: [],
            title: '',
            trigger: 'auto',
            type: 'voucher',
            value: '0',
        };
    }
}
class Shopping {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async getProduct(query) {
        var _a, _b, _c, _d, _e, _f;
        try {
            const userClass = new user_js_1.User(this.app);
            const count_sql = await userClass.getCheckoutCountingModeSQL();
            const store_info = await userClass.getConfigV2({ key: 'store-information', user_id: 'manager' });
            const store_config = await userClass.getConfigV2({ key: 'store_manager', user_id: 'manager' });
            const exh_config = await userClass.getConfigV2({ key: 'exhibition_manager', user_id: 'manager' });
            const userID = (_a = query.setUserID) !== null && _a !== void 0 ? _a : (this.token ? `${this.token.userID}` : '');
            const querySql = [`(content->>'$.type'='product')`];
            const idStr = query.id_list ? query.id_list.split(',').filter(Boolean).join(',') : '';
            query.language = (_b = query.language) !== null && _b !== void 0 ? _b : store_info.language_setting.def;
            query.show_hidden = (_c = query.show_hidden) !== null && _c !== void 0 ? _c : 'true';
            await Promise.all([this.initProductCustomizeTagConifg(), this.initProductGeneralTagConifg()]);
            const orderMapping = {
                title: `ORDER BY JSON_EXTRACT(content, '$.title')`,
                max_price: `ORDER BY CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.max_price')) AS SIGNED) DESC , id DESC`,
                min_price: `ORDER BY CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.min_price')) AS SIGNED) ASC , id DESC`,
                created_time_desc: `ORDER BY created_time DESC`,
                created_time_asc: `ORDER BY created_time ASC`,
                updated_time_desc: `ORDER BY updated_time DESC`,
                updated_time_asc: `ORDER BY updated_time ASC`,
                sales_desc: `ORDER BY content->>'$.total_sales' DESC , id DESC`,
                default: `ORDER BY content->>'$.sort_weight' DESC , id DESC`,
                stock_desc: '',
                stock_asc: '',
            };
            query.order_by = orderMapping[query.order_by] || orderMapping.default;
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
                    case 'customize_tag':
                        querySql.push(`JSON_EXTRACT(content, '$.product_customize_tag') LIKE '%${query.search}%'`);
                        break;
                    case 'title':
                        querySql.push(`(${[
                            `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`,
                            `(UPPER(content->>'$.language_data."${query.language}".title') LIKE UPPER('%${query.search}%'))`,
                        ].join(' OR ')})`);
                        break;
                    default:
                        querySql.push(`(${[
                            `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`,
                            `(UPPER(content->>'$.language_data."${query.language}".title') LIKE UPPER('%${query.search}%'))`,
                            `UPPER(content->>'$.product_tag.language."${query.language}"') like '%${query.search}%'`,
                            `JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`,
                            `JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`,
                            `JSON_EXTRACT(content, '$.product_customize_tag') LIKE '%${query.search}%'`,
                        ].join(' OR ')})`);
                        break;
                }
            }
            if (query.product_category) {
                querySql.push(`JSON_EXTRACT(content, '$.product_category') = ${database_js_1.default.escape(query.product_category)}`);
            }
            if (query.domain) {
                const decodedDomain = decodeURIComponent(query.domain);
                const sqlJoinSearch = [
                    `content->>'$.seo.domain' = '${decodedDomain}'`,
                    `content->>'$.title' = '${decodedDomain}'`,
                    `content->>'$.language_data."${query.language}".seo.domain' = '${decodedDomain}'`,
                ];
                if (sqlJoinSearch.length) {
                    querySql.push(`(${sqlJoinSearch.map(condition => `(${condition})`).join(' OR ')})`);
                }
                query.order_by = `
          ORDER BY CASE 
          WHEN content->>'$.language_data."zh-TW".seo.domain' = '${decodedDomain}' THEN 1
              ELSE 2
          END
        `;
            }
            if (query.id) {
                const ids = `${query.id}`
                    .split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                if (ids.length > 1) {
                    querySql.push(`id IN (${ids.map(id => `'${id}'`).join(',')})`);
                }
                else {
                    querySql.push(`id = '${ids[0]}'`);
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
                query.productType.split(',').map(dd => {
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
             WHERE \`key\` = 'collection';
            `, []))[0]['value'];
                query.collection = decodeURI(query.collection);
                query.collection = query.collection
                    .split(',')
                    .map(dd => {
                    function loop(array, prefix) {
                        const find = array.find((d1) => {
                            return ((d1.language_data && d1.language_data[query.language].seo.domain === dd) || d1.code === dd);
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
                querySql.push(`(${query.collection
                    .split(',')
                    .map(dd => {
                    return query.accurate_search_collection
                        ? `(JSON_CONTAINS(content->'$.collection', '"${dd}"'))`
                        : `(JSON_EXTRACT(content, '$.collection') LIKE '%${dd}%')`;
                })
                    .join(' or ')})`);
            }
            if (query.sku) {
                querySql.push(`(id in ( select product_id from \`${this.app}\`.t_variants where content->>'$.sku'=${database_js_1.default.escape(query.sku)}))`);
            }
            if (!query.id && query.status === 'active' && query.with_hide_index !== 'true') {
                querySql.push(`(content->>'$.hideIndex' IS NULL OR content->>'$.hideIndex' = 'false')`);
            }
            if (query.id_list) {
                if (idStr.length > 0) {
                    query.order_by = ` ORDER BY FIELD (id, ${idStr})`;
                }
                else {
                    query.order_by = ' ORDER BY id';
                }
            }
            if (!query.is_manger && !query.status) {
                query.status = 'inRange';
            }
            if (query.status) {
                const statusSplit = query.status.split(',').map(status => status.trim());
                const statusJoin = statusSplit.map(status => `"${status}"`).join(',');
                const statusCondition = `JSON_EXTRACT(content, '$.status') IN (${statusJoin})`;
                const currentDate = database_js_1.default.escape(new Date().toISOString());
                const scheduleConditions = statusSplit
                    .map(status => {
                    switch (status) {
                        case 'inRange':
                            return `OR (
                      JSON_EXTRACT(content, '$.status') IN ('active', 1)
                      AND (
                          content->>'$.active_schedule' IS NULL OR 
                          (
                              (
                                  ((CONCAT(content->>'$.active_schedule.start_ISO_Date') IS NULL) and (CONCAT(content->>'$.active_schedule.startDate') IS NULL)) or
                                  ((CONCAT(content->>'$.active_schedule.start_ISO_Date') <= ${currentDate}) or (CONCAT(content->>'$.active_schedule.startDate') <= ${database_js_1.default.escape((0, moment_1.default)().format('YYYY-MM-DD'))}))
                              )
                              AND (
                                ((CONCAT(content->>'$.active_schedule.end_ISO_Date') IS NULL) and (CONCAT(content->>'$.active_schedule.endDate') IS NULL)) or
                                  (CONCAT(content->>'$.active_schedule.end_ISO_Date') >= ${currentDate}) or (CONCAT(content->>'$.active_schedule.endDate') >= ${database_js_1.default.escape((0, moment_1.default)().format('YYYY-MM-DD'))})
                              )
                          )
                      )
                  )`;
                        case 'beforeStart':
                            return `
                  OR (
                      JSON_EXTRACT(content, '$.status') IN ('active', 1)
                      AND CONCAT(content->>'$.active_schedule.start_ISO_Date') > ${currentDate}
                  )`;
                        case 'afterEnd':
                            return `
                  OR (
                      JSON_EXTRACT(content, '$.status') IN ('active', 1)
                      AND CONCAT(content->>'$.active_schedule.end_ISO_Date') < ${currentDate}
                  )`;
                        default:
                            return '';
                    }
                })
                    .join('');
                querySql.push(`(${statusCondition} ${scheduleConditions})`);
            }
            if (query.channel) {
                if (query.channel === 'exhibition') {
                    const exh = exh_config.list.find((item) => item.id === query.whereStore);
                    if (exh) {
                        querySql.push(`
              (id IN (SELECT product_id FROM \`${this.app}\`.t_variants 
              WHERE id IN (${exh.dataList.map((d) => d.variantID).join(',')})))`);
                    }
                }
                else {
                    const channelSplit = query.channel.split(',').map(channel => channel.trim());
                    const channelJoin = channelSplit.map(channel => {
                        return `OR JSON_CONTAINS(content->>'$.channel', '"${channel}"')`;
                    });
                    querySql.push(`(content->>'$.channel' IS NULL ${channelJoin})`);
                }
            }
            if (query.id_list && idStr) {
                querySql.push(`(id in (${idStr}))`);
            }
            if (query.min_price) {
                querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price' >= ${query.min_price}))`);
            }
            if (query.max_price) {
                querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price' <= ${query.max_price}))`);
            }
            const products = await this.querySql(querySql, query);
            products.data = (Array.isArray(products.data) ? products.data : [products.data]).filter(product => product);
            if (userID !== '' && products.data.length > 0) {
                const productIds = products.data.map((product) => product.id);
                const wishListData = await database_js_1.default.query(`SELECT content ->>'$.product_id' AS product_id
           FROM \`${this.app}\`.t_post
           WHERE userID = ?
             AND content->>'$.type' = 'wishlist'
             AND content->>'$.product_id' IN (${productIds.map(() => '?').join(',')})`, [userID, ...productIds]);
                const wishListSet = new Set(wishListData.map((row) => row.product_id));
                products.data = products.data.map((product) => {
                    if (product.content) {
                        product.content.in_wish_list = wishListSet.has(String(product.id));
                        product.content.id = product.id;
                    }
                    return product;
                });
            }
            if (query.id_list) {
                const idSet = new Set(query.id_list
                    .split(',')
                    .map(id => id.trim())
                    .filter(Boolean));
                products.data = products.data.filter((product) => idSet.has(`${product.id}`));
            }
            if (query.id_list) {
                products.data = query.id_list
                    .split(',')
                    .map(id => {
                    return products.data.find((product) => `${product.id}` === `${id}`);
                })
                    .filter(dd => dd);
            }
            await Promise.all(products.data
                .filter((dd) => {
                return dd.content;
            })
                .map((product) => {
                product.content.collection = Array.from(new Set((() => {
                    var _a;
                    return ((_a = product.content.collection) !== null && _a !== void 0 ? _a : []).map((dd) => {
                        return dd.replace(' / ', '/').replace(' /', '/').replace('/ ', '/').replace('/', ' / ');
                    });
                })()));
                return new Promise(async (resolve) => {
                    var _a, _b, _c;
                    if (product) {
                        let totalSale = 0;
                        const { language } = query;
                        const { content } = product;
                        content.preview_image = (_a = content.preview_image) !== null && _a !== void 0 ? _a : [];
                        product_initial_js_1.ProductInitial.initial(content);
                        if (language && ((_b = content === null || content === void 0 ? void 0 : content.language_data) === null || _b === void 0 ? void 0 : _b[language])) {
                            const langData = content.language_data[language];
                            if ((langData.preview_image && langData.preview_image.length === 0) || !langData.preview_image) {
                                if (content.preview_image.length) {
                                    langData.preview_image = content.preview_image;
                                }
                                else {
                                    langData.preview_image = [
                                        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg',
                                    ];
                                }
                            }
                            Object.assign(content, {
                                seo: langData.seo,
                                title: langData.title || content.title,
                                content: langData.content || content.content,
                                content_array: langData.content_array || content.content_array,
                                content_json: langData.content_json || content.content_json,
                                preview_image: langData.preview_image || content.preview_image,
                            });
                        }
                        if ((content.preview_image && content.preview_image.length === 0) || !content.preview_image) {
                            content.preview_image = [
                                'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg',
                            ];
                        }
                        if (content.product_category === 'kitchen') {
                            if (content.specs.length) {
                                content.min_price = content.specs
                                    .map((dd) => {
                                    return Math.min(...dd.option.map((d1) => {
                                        return d1.price;
                                    }));
                                })
                                    .reduce((a, b) => a + b, 0);
                                content.max_price = content.specs
                                    .map((dd) => {
                                    return Math.max(...dd.option.map((d1) => {
                                        return d1.price;
                                    }));
                                })
                                    .reduce((a, b) => a + b, 0);
                            }
                            else {
                                content.min_price = content.price || 0;
                                content.max_price = content.price || 0;
                            }
                            content.variants = [
                                {
                                    sku: '',
                                    spec: [],
                                    type: 'variants',
                                    v_width: 0,
                                    product_id: content.id,
                                    sale_price: content.min_price,
                                    compare_price: 0,
                                    shipment_type: 'none',
                                    show_understocking: ((_c = content.stocke) !== null && _c !== void 0 ? _c : '') === '' ? `false` : `true`,
                                },
                            ];
                        }
                        else {
                            const soldOldHistory = await database_js_1.default.query(`
                        SELECT *
                        FROM \`${this.app}\`.t_products_sold_history
                        WHERE product_id = ${database_js_1.default.escape(content.id)}
                          AND order_id IN (SELECT cart_token
                                           FROM \`${this.app}\`.t_checkout
                                           WHERE ${count_sql})
                    `, []);
                            (content.variants || []).forEach((variant) => {
                                var _a, _b, _c;
                                if (content.variants.length === 1) {
                                    variant.preview_image = undefined;
                                    variant[`preview_image_${language}`] = undefined;
                                }
                                variant.spec = variant.spec || [];
                                variant.stock = 0;
                                variant.sold_out =
                                    soldOldHistory
                                        .filter((dd) => {
                                        return dd.spec === variant.spec.join('-') && `${dd.product_id}` === `${content.id}`;
                                    })
                                        .map((dd) => {
                                        return dd.count;
                                    })
                                        .reduce((a, b) => {
                                        return tool_js_1.default.floatAdd(a, b);
                                    }, 0) || 0;
                                variant.preview_image = (_a = variant.preview_image) !== null && _a !== void 0 ? _a : '';
                                if (variant.preview_image) {
                                    const img = variant.preview_image;
                                    let temp = '';
                                    if (typeof img === 'object') {
                                        if (img.richText) {
                                            img.richText.map((item) => {
                                                temp += item.text;
                                            });
                                        }
                                        else if (img.hyperlink) {
                                            temp = (_b = img.text) !== null && _b !== void 0 ? _b : img.hyperlink;
                                        }
                                    }
                                    else if (!img.includes('https://')) {
                                        temp = '';
                                    }
                                    else {
                                        temp = img;
                                    }
                                    variant.preview_image = temp;
                                }
                                variant.preview_image =
                                    variant[`preview_image_${language}`] ||
                                        variant.preview_image ||
                                        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';
                                if (content.min_price > variant.sale_price) {
                                    content.min_price = variant.sale_price;
                                }
                                if (content.max_price < variant.sale_price) {
                                    content.max_price = variant.sale_price;
                                }
                                if (variant.preview_image ===
                                    'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg') {
                                    variant.preview_image = (_c = content.preview_image) === null || _c === void 0 ? void 0 : _c[0];
                                }
                                Object.entries(variant.stockList || {}).forEach(([storeId, stockData]) => {
                                    if (!store_config.list.some((store) => store.id === storeId) || !(stockData === null || stockData === void 0 ? void 0 : stockData.count)) {
                                        delete variant.stockList[storeId];
                                    }
                                    else {
                                        variant.stockList[storeId].count = parseInt(stockData.count, 10);
                                        variant.stock += variant.stockList[storeId].count;
                                    }
                                });
                                store_config.list.forEach((store) => {
                                    variant.stockList[store.id] = variant.stockList[store.id] || { count: 0 };
                                });
                                totalSale += variant.sold_out;
                            });
                        }
                        if (content.shopee_id && !query.skip_shopee_check) {
                            const shopee_data = await new shopee_1.Shopee(this.app, this.token).getProductDetail(content.shopee_id, {
                                skip_image_load: true,
                            });
                            if (shopee_data && shopee_data.variants) {
                                (content.variants || []).forEach((variant) => {
                                    const shopee_variants = shopee_data.variants.find(dd => {
                                        return dd.spec.join('') === variant.spec.join('');
                                    });
                                    if (shopee_variants) {
                                        variant.stock = shopee_variants.stock;
                                        variant.stockList = {};
                                        variant.stockList[store_config.list[0].id] = { count: variant.stock };
                                    }
                                });
                            }
                        }
                        product.total_sales = totalSale;
                    }
                    resolve(true);
                });
            }));
            if (query.domain && products.data.length > 0) {
                const decodedDomain = decodeURIComponent(query.domain);
                const foundProduct = products.data.find((dd) => {
                    var _a, _b;
                    if (!query.language)
                        return false;
                    const languageData = (_b = (_a = dd.content.language_data) === null || _a === void 0 ? void 0 : _a[query.language]) === null || _b === void 0 ? void 0 : _b.seo;
                    const seoData = dd.content.seo;
                    return ((languageData && languageData.domain === decodedDomain) || (seoData && seoData.domain === decodedDomain));
                });
                products.data = foundProduct || products.data[0];
            }
            if (query.id && products.data.length > 0) {
                products.data = products.data[0];
            }
            if ((query.domain || query.id) && products.data !== undefined) {
                products.data.json_ld = await seo_config_js_1.SeoConfig.getProductJsonLd(this.app, products.data.content);
            }
            const viewSource = (_d = query.view_source) !== null && _d !== void 0 ? _d : 'normal';
            const distributionCode = (_e = query.distribution_code) !== null && _e !== void 0 ? _e : '';
            const userData = (_f = (await userClass.getUserData(userID, 'userID'))) !== null && _f !== void 0 ? _f : { userID: -1 };
            const voucherObj = await Promise.all([
                this.getAllUseVoucher(userData.userID),
                this.getDistributionRecommend(distributionCode),
            ]).then(dataArray => {
                return {
                    allVoucher: dataArray[0],
                    recommendData: dataArray[1],
                };
            });
            const getPrice = (priceMap, key, specKey, priceList) => {
                var _a;
                const price = (_a = priceMap[key]) === null || _a === void 0 ? void 0 : _a.get(specKey);
                price && priceList.push(price);
            };
            const processProduct = async (product) => {
                if (!product || !product.content) {
                    return;
                }
                const createPriceMap = (type) => {
                    return Object.fromEntries(product.content.multi_sale_price
                        .filter((item) => item.type === type)
                        .map((item) => [item.key, new Map(item.variants.map((v) => [v.spec.join('-'), v.price]))]));
                };
                if (!product || !product.content) {
                    return product;
                }
                product.content.about_vouchers = await this.aboutProductVoucher({
                    product,
                    userID,
                    viewSource,
                    allVoucher: voucherObj.allVoucher,
                    recommendData: voucherObj.recommendData,
                    userData,
                });
                product.content.comments = [];
                if (products.total === 1) {
                    product.content.comments = await this.getProductComment(product.id);
                }
                if (query.channel && query.channel === 'exhibition') {
                    const exh = exh_config.list.find((item) => item.id === query.whereStore);
                    if (exh) {
                        const exh_variant_ids = exh.dataList.map((d) => d.variantID);
                        const variantsResult = await this.getProductVariants(exh_variant_ids.join(','));
                        if (variantsResult.total > 0) {
                            const variantsList = new Map(variantsResult.data
                                .filter((a) => a.product_id === product.id)
                                .map((a) => {
                                return [a.variant_content.spec.join(','), a.id];
                            }));
                            product.content.variants.forEach((pv) => {
                                var _a, _b;
                                const specString = pv.spec.join(',');
                                const variantID = variantsList.get(specString);
                                if (variantID) {
                                    const vData = exh.dataList.find((a) => a.variantID === variantID);
                                    pv.variant_id = variantID;
                                    pv.exhibition_type = true;
                                    pv.exhibition_active_stock = (_a = vData === null || vData === void 0 ? void 0 : vData.activeSaleStock) !== null && _a !== void 0 ? _a : 0;
                                    pv.sale_price = (_b = vData === null || vData === void 0 ? void 0 : vData.salePrice) !== null && _b !== void 0 ? _b : 0;
                                }
                                else {
                                    pv.exhibition_type = false;
                                }
                            });
                        }
                    }
                }
                product.content.variants.forEach((pv) => {
                    var _a, _b, _c;
                    const vPriceList = [];
                    if ((_a = product.content.multi_sale_price) === null || _a === void 0 ? void 0 : _a.length) {
                        const specKey = pv.spec.join('-');
                        if (query.whereStore) {
                            const storeMaps = createPriceMap('store');
                            getPrice(storeMaps, query.whereStore, specKey, vPriceList);
                        }
                        if ((_b = userData === null || userData === void 0 ? void 0 : userData.member_level) === null || _b === void 0 ? void 0 : _b.id) {
                            const levelMaps = createPriceMap('level');
                            getPrice(levelMaps, userData.member_level.id, specKey, vPriceList);
                        }
                        if (Array.isArray((_c = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _c === void 0 ? void 0 : _c.tags) && userData.userData.tags.length > 0) {
                            const tagsMaps = createPriceMap('tags');
                            userData.userData.tags.map((tag) => {
                                getPrice(tagsMaps, tag, specKey, vPriceList);
                            });
                        }
                    }
                    pv.origin_price = parseInt(`${pv.compare_price || pv.sale_price}`, 10);
                    pv.sale_price = vPriceList.length > 0 ? Math.min(...vPriceList) : pv.sale_price;
                });
                const priceArray = product.content.variants
                    .filter((item) => {
                    if (query.channel && query.channel === 'exhibition') {
                        return item.exhibition_type;
                    }
                    return true;
                })
                    .map((item) => {
                    return parseInt(`${item.sale_price}`, 10);
                });
                product.content.min_price = Math.min(...priceArray);
                if (product.content.product_category === 'kitchen' && product.content.variants.length > 1) {
                    let postMD = product.content;
                    product.content.variants.map((dd) => {
                        var _a, _b, _c, _d;
                        dd.compare_price = 0;
                        dd.sale_price = dd.spec.reduce((sum, specValue, index) => {
                            var _a, _b;
                            const spec = postMD.specs[index];
                            const option = (_a = spec === null || spec === void 0 ? void 0 : spec.option) === null || _a === void 0 ? void 0 : _a.find((opt) => opt.title === specValue);
                            const priceStr = (_b = option === null || option === void 0 ? void 0 : option.price) !== null && _b !== void 0 ? _b : '0';
                            const price = parseInt(priceStr, 10);
                            return isNaN(price) ? sum : sum + price;
                        }, 0);
                        dd.weight = parseFloat((_a = postMD.weight) !== null && _a !== void 0 ? _a : '0');
                        dd.v_height = parseFloat((_b = postMD.v_height) !== null && _b !== void 0 ? _b : '0');
                        dd.v_width = parseFloat((_c = postMD.v_width) !== null && _c !== void 0 ? _c : '0');
                        dd.v_length = parseFloat((_d = postMD.v_length) !== null && _d !== void 0 ? _d : '0');
                        dd.shipment_type = postMD.shipment_type;
                        dd.show_understocking = 'true';
                        dd.stock = Math.min(...dd.spec.map((specValue, index) => {
                            var _a;
                            const spec = postMD.specs[index];
                            const option = (_a = spec === null || spec === void 0 ? void 0 : spec.option) === null || _a === void 0 ? void 0 : _a.find((opt) => opt.title === specValue);
                            const stockStr = option === null || option === void 0 ? void 0 : option.stock;
                            if (!stockStr) {
                                return Infinity;
                            }
                            const stock = parseInt(stockStr, 10);
                            return isNaN(stock) ? Infinity : stock;
                        }));
                        if (dd.stock === Infinity) {
                            dd.show_understocking = 'false';
                        }
                    });
                }
            };
            if (Array.isArray(products.data)) {
                products.data = products.data.filter(dd => {
                    return dd && dd.content;
                });
                await Promise.all(products.data.map(processProduct));
            }
            else {
                if (products.data && !products.data.content) {
                    products.data = undefined;
                }
                await processProduct(products.data);
            }
            return products;
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }
    async initProductCustomizeTagConifg() {
        var _a, _b;
        try {
            const managerTags = await new user_js_1.User(this.app).getConfigV2({ key: 'product_manager_tags', user_id: 'manager' });
            if (managerTags && Array.isArray(managerTags.list)) {
                return managerTags;
            }
            const getData = await database_js_1.default.query(`
          SELECT 
            GROUP_CONCAT(DISTINCT JSON_UNQUOTE(JSON_EXTRACT(content, '$.product_customize_tag')) SEPARATOR ',') AS unique_tags
          FROM \`${this.app}\`.t_manager_post
          WHERE JSON_UNQUOTE(JSON_EXTRACT(content, '$.type')) = 'product'
        `, []);
            const unique_tags_string = (_b = (_a = getData[0]) === null || _a === void 0 ? void 0 : _a.unique_tags) !== null && _b !== void 0 ? _b : '';
            const unique_tags_array = JSON.parse(`[${unique_tags_string}]`);
            const unique_tags_flot = Array.isArray(unique_tags_array) ? unique_tags_array.flat() : [];
            const data = { list: [...new Set(unique_tags_flot)] };
            await new user_js_1.User(this.app).setConfig({
                key: 'product_manager_tags',
                user_id: 'manager',
                value: data,
            });
            return data;
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Set customize tag conifg Error:' + express_1.default, null);
        }
    }
    async setProductCustomizeTagConifg(add_tags) {
        var _a;
        const tagConfig = await new user_js_1.User(this.app).getConfigV2({ key: 'product_manager_tags', user_id: 'manager' });
        const tagList = (_a = tagConfig === null || tagConfig === void 0 ? void 0 : tagConfig.list) !== null && _a !== void 0 ? _a : [];
        const data = { list: [...new Set([...tagList, ...add_tags])] };
        await new user_js_1.User(this.app).setConfig({
            key: 'product_manager_tags',
            user_id: 'manager',
            value: data,
        });
        return data;
    }
    async initProductGeneralTagConifg() {
        var _a, _b;
        try {
            const generalTags = await new user_js_1.User(this.app).getConfigV2({ key: 'product_general_tags', user_id: 'manager' });
            if (generalTags && Array.isArray(generalTags.list)) {
                return generalTags;
            }
            const getData = await database_js_1.default.query(`
          SELECT 
            GROUP_CONCAT(DISTINCT JSON_UNQUOTE(JSON_EXTRACT(content, '$.product_tag.language')) SEPARATOR ',') AS unique_tags
          FROM \`${this.app}\`.t_manager_post
          WHERE JSON_UNQUOTE(JSON_EXTRACT(content, '$.type')) = 'product'
        `, []);
            const unique_tags_string = (_b = (_a = getData[0]) === null || _a === void 0 ? void 0 : _a.unique_tags) !== null && _b !== void 0 ? _b : '';
            const unique_tags_array = JSON.parse(`[${unique_tags_string}]`);
            const unique_tags_flot = Array.isArray(unique_tags_array) ? unique_tags_array.flat() : [];
            const list = {};
            unique_tags_flot.map(item => {
                Language_js_1.Language.locationList.map(lang => {
                    var _a;
                    list[lang] = [...((_a = list[lang]) !== null && _a !== void 0 ? _a : []), ...item[lang]];
                });
            });
            Language_js_1.Language.locationList.map(lang => {
                list[lang] = [...new Set(list[lang])];
            });
            const data = { list };
            await new user_js_1.User(this.app).setConfig({
                key: 'product_general_tags',
                user_id: 'manager',
                value: data,
            });
            return data;
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Set general tag conifg Error:' + express_1.default, null);
        }
    }
    async setProductGeneralTagConifg(add_tags) {
        var _a, _b;
        const tagConfig = (_a = (await new user_js_1.User(this.app).getConfigV2({ key: 'product_general_tags', user_id: 'manager' }))) !== null && _a !== void 0 ? _a : (await this.initProductGeneralTagConifg());
        (_b = tagConfig.list) !== null && _b !== void 0 ? _b : (tagConfig.list = {});
        Language_js_1.Language.locationList.map(lang => {
            var _a;
            const originList = (_a = tagConfig.list[lang]) !== null && _a !== void 0 ? _a : [];
            const updateList = add_tags[lang];
            tagConfig.list[lang] = [...new Set([...originList, ...updateList])];
        });
        await new user_js_1.User(this.app).setConfig({
            key: 'product_general_tags',
            user_id: 'manager',
            value: tagConfig,
        });
        return tagConfig;
    }
    async getAllUseVoucher(userID) {
        const now = Date.now();
        const allVoucher = (await this.querySql([`(content->>'$.type'='voucher')`], {
            page: 0,
            limit: 10000,
        })).data
            .map((dd) => dd.content)
            .filter((voucher) => {
            const startDate = new Date(voucher.start_ISO_Date).getTime();
            const endDate = voucher.end_ISO_Date ? new Date(voucher.end_ISO_Date).getTime() : Infinity;
            return startDate < now && now < endDate;
        });
        const validVouchers = await Promise.all(allVoucher.map(async (voucher) => {
            const isLimited = await this.checkVoucherLimited(userID, voucher.id);
            return isLimited && voucher.status === 1 ? voucher : null;
        }));
        return validVouchers.filter(Boolean);
    }
    async getDistributionRecommend(distribution_code) {
        const recommends = await database_js_1.default.query(`SELECT *
       FROM \`${this.app}\`.t_recommend_links`, []);
        const recommendData = recommends
            .map((dd) => dd.content)
            .filter((dd) => {
            const isCode = dd.code === distribution_code;
            const startDate = new Date(dd.start_ISO_Date || `${dd.startDate} ${dd.startTime}`);
            const endDate = dd.end_ISO_Date
                ? new Date(dd.end_ISO_Date)
                : dd.endDate
                    ? new Date(`${dd.endDate} ${dd.endTime}`)
                    : null;
            const isActive = startDate.getTime() < Date.now() && (!endDate || endDate.getTime() > Date.now());
            return isCode && isActive;
        });
        return recommendData;
    }
    async aboutProductVoucher(json) {
        if (!json.product.content) {
            return [];
        }
        const id = `${json.product.id}`;
        const collection = (() => {
            try {
                return json.product.content.collection || [];
            }
            catch (error) {
                return [];
            }
        })();
        const userData = json.userData;
        const recommendData = json.recommendData;
        function checkValidProduct(caseName, caseList) {
            switch (caseName) {
                case 'collection':
                    return caseList.some(d1 => collection.includes(d1));
                case 'product':
                    return caseList.some(item => `${item}` === `${id}`);
                case 'all':
                    return true;
                default:
                    return false;
            }
        }
        const voucherList = json.allVoucher
            .filter(dd => {
            if (!dd.device) {
                return true;
            }
            if (dd.device.length === 0) {
                return false;
            }
            if (json.viewSource === 'pos') {
                return dd.device.includes('pos');
            }
            return dd.device.includes('normal');
        })
            .filter(dd => {
            if (dd.target === 'customer') {
                return userData && userData.id && dd.targetList.includes(userData.userID);
            }
            if (dd.target === 'levels') {
                if (userData && userData.member) {
                    const find = userData.member.find((dd) => dd.trigger);
                    return find && dd.targetList.includes(find.id);
                }
                return false;
            }
            return true;
        })
            .filter(dd => {
            if (dd.trigger !== 'distribution') {
                return checkValidProduct(dd.for, dd.forKey);
            }
            if (recommendData.length === 0) {
                return false;
            }
            return checkValidProduct(recommendData[0].relative, recommendData[0].relative_data);
        });
        return voucherList;
    }
    async querySql(conditions, query) {
        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const orderClause = query.order_by || 'ORDER BY id DESC';
        const offset = query.page * query.limit;
        let sql = `SELECT *
               FROM \`${this.app}\`.t_manager_post ${whereClause} ${orderClause}`;
        const data = await database_js_1.default.query(`SELECT *
       FROM (${sql}) AS subquery LIMIT ?, ?
      `, [offset, Number(query.limit)]);
        if (query.id) {
            return {
                data: data[0] || {},
                result: !!data[0],
            };
        }
        else {
            const total = await database_js_1.default
                .query(`SELECT COUNT(*) as count
           FROM \`${this.app}\`.t_manager_post ${whereClause}
          `, [])
                .then((res) => { var _a; return ((_a = res[0]) === null || _a === void 0 ? void 0 : _a.count) || 0; });
            return {
                data: data.map((dd) => (Object.assign(Object.assign({}, dd), { content: Object.assign(Object.assign({}, dd.content), { id: dd.id }) }))),
                total,
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
        let sql = `
        SELECT v.id,
               v.product_id,
               v.content                                            AS variant_content,
               CAST(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) AS stock,
               JSON_EXTRACT(v.content, '$.stockList')               AS stockList
        FROM \`${this.app}\`.t_variants AS v
        WHERE product_id IN (SELECT id
                             FROM \`${this.app}\`.t_manager_post
                             WHERE (
                                       (content ->>'$.product_category' IS NULL) OR
                                       (content ->>'$.product_category' != 'kitchen')
                                       ))
          AND ${querySql.join(' AND ')} ${query.order_by || 'ORDER BY id DESC'}
    `;
        query.limit = query.limit && query.limit > 999 ? 999 : query.limit;
        const limitSQL = `limit ${query.page * query.limit} , ${query.limit}`;
        if (query.id) {
            const data = (await database_js_1.default.query(`SELECT *
           FROM (${sql}) as subqyery ${limitSQL}
          `, []))[0];
            data.product_content = (await database_js_1.default.query(`select *
           from \`${this.app}\`.t_manager_post
           where id = ${data.product_id}`, []))[0]['content'];
            return { data: data, result: !!data };
        }
        else {
            const vData = await database_js_1.default.query(`SELECT *
         FROM (${sql}) as subqyery ${limitSQL}
        `, []);
            await Promise.all(vData.map(async (data) => {
                data.product_content = (await database_js_1.default.query(`select *
               from \`${this.app}\`.t_manager_post
               where id = ${data.product_id}`, []))[0]['content'];
            }));
            return {
                data: vData,
                total: (await database_js_1.default.query(`SELECT count(1)
             FROM (${sql}) as subqyery
            `, []))[0]['count(1)'],
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
    async linePay(data) {
        return new Promise(async (resolve, reject) => {
            const keyData = (await private_config_js_1.Private_config.getConfig({
                appName: this.app,
                key: 'glitter_finance',
            }))[0].value.line_pay_scan;
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: keyData.BETA == 'true'
                    ? 'https://sandbox-api-pay.line.me/v2/payments/oneTimeKeys/pay'
                    : 'https://api-pay.line.me/v2/payments/oneTimeKeys/pay',
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
        const shipment_setting = await (async () => {
            try {
                const config = await private_config_js_1.Private_config.getConfig({
                    appName: this.app,
                    key: 'logistics_setting',
                });
                if (!config) {
                    return {
                        support: [],
                        shipmentSupport: [],
                    };
                }
                return config[0].value;
            }
            catch (e) {
                return [];
            }
        })();
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
            .filter(d1 => {
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
    async updateExhibitionActiveStock(exh_id, v_id, count) {
        try {
            const _user = new user_js_1.User(this.app);
            const exhibitionConfig = await _user.getConfigV2({ key: 'exhibition_manager', user_id: 'manager' });
            if (exhibitionConfig.list && exhibitionConfig.list.length > 0) {
                exhibitionConfig.list.forEach((exhibition) => {
                    if (exhibition.id === exh_id) {
                        exhibition.dataList.forEach((item) => {
                            if (item.variantID === v_id) {
                                if (item.activeSaleStock - count < 0) {
                                    item.activeSaleStock = 0;
                                }
                                else {
                                    item.activeSaleStock -= count;
                                }
                            }
                        });
                    }
                });
                await _user.setConfig({
                    key: 'exhibition_manager',
                    user_id: 'manager',
                    value: exhibitionConfig,
                });
            }
            return;
        }
        catch (error) {
            console.error('Error updateExhibitionActiveStock:', error);
        }
    }
    async getShipmentRefer(user_info) {
        var _a, _b, _c;
        user_info = user_info || {};
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
        const refer = user_info.shipment === 'global_express'
            ? ((_b = (await private_config_js_1.Private_config.getConfig({
                appName: this.app,
                key: 'glitter_shipment_global_' + user_info.country,
            }))[0]) !== null && _b !== void 0 ? _b : {
                value: {
                    volume: [],
                    weight: [],
                    selectCalc: 'volume',
                },
            }).value
            : ((_c = (await private_config_js_1.Private_config.getConfig({
                appName: this.app,
                key: 'glitter_shipment_' + user_info.shipment,
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
    }
    calculateShipment(dataList, value) {
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
    getShipmentFee(user_info, lineItems, shipment) {
        if ((user_info === null || user_info === void 0 ? void 0 : user_info.shipment) === 'now')
            return 0;
        let total_volume = 0;
        let total_weight = 0;
        lineItems.map(item => {
            if (item.shipment_obj.type === 'volume') {
                total_volume += item.shipment_obj.value;
            }
            if (item.shipment_obj.type === 'weight') {
                total_weight += item.shipment_obj.value;
            }
        });
        return (this.calculateShipment(shipment.volume, total_volume) + this.calculateShipment(shipment.weight, total_weight));
    }
    async toCheckout(data, type = 'add', replace_order_id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11;
        try {
            const utTimer = new ut_timer_js_1.UtTimer('TO-CHECKOUT');
            const checkPoint = utTimer.checkPoint;
            const userClass = new user_js_1.User(this.app);
            const rebateClass = new rebate_js_1.Rebate(this.app);
            const checkoutPayment = (_a = data.user_info) === null || _a === void 0 ? void 0 : _a.payment;
            let scheduledData;
            data.line_items = (_b = (data.line_items || data.lineItems)) !== null && _b !== void 0 ? _b : [];
            data.isExhibition = data.checkOutType === 'POS' && ((_d = (_c = data.pos_store) === null || _c === void 0 ? void 0 : _c.includes('exhibition_')) !== null && _d !== void 0 ? _d : false);
            if (replace_order_id) {
                const orderData = (await database_js_1.default.query(`SELECT *
             FROM \`${this.app}\`.t_checkout
             WHERE cart_token = ?
               AND status = 0;
            `, [replace_order_id]))[0];
                if (!orderData) {
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error: Cannot find this orderID', null);
                }
                await database_js_1.default.query(`DELETE
           FROM \`${this.app}\`.t_checkout
           WHERE cart_token = ?
             AND status = 0;
          `, [replace_order_id]);
                const { lineItems, user_info, code, customer_info, use_rebate } = orderData.orderData;
                data.line_items = lineItems;
                data.email = orderData.email;
                data.user_info = user_info;
                data.code = code;
                data.customer_info = customer_info;
                data.use_rebate = use_rebate;
            }
            if (data.order_id && type === 'POS') {
                const order = (await database_js_1.default.query(`SELECT *
             FROM \`${this.app}\`.t_checkout
             WHERE cart_token = ?
            `, [data.order_id]))[0];
                if (order) {
                    for (const b of order.orderData.lineItems) {
                        const pdDqlData = (await this.getProduct({
                            page: 0,
                            limit: 50,
                            id: b.id,
                            status: 'inRange',
                            channel: data.checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
                            whereStore: data.checkOutType === 'POS' ? data.pos_store : undefined,
                        })).data;
                        const pd = pdDqlData.content;
                        const variant = pd.variants.find((dd) => dd.spec.join('-') === b.spec.join('-'));
                        await updateStock(variant, b.deduction_log);
                        await this.updateVariantsWithSpec(variant, b.id, b.spec);
                        await database_js_1.default.query(`UPDATE \`${this.app}\`.t_manager_post
               SET content = ?
               WHERE id = ?
              `, [JSON.stringify(pd), pdDqlData.id]);
                    }
                }
            }
            async function updateStock(variant, deductionLog) {
                Object.keys(deductionLog).forEach(key => {
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
            const hasAuthentication = (data) => {
                return ((this.token && this.token.userID) ||
                    data.email ||
                    (data.user_info && data.user_info.email) ||
                    (data.user_info && data.user_info.phone));
            };
            if (type !== 'preview' && !hasAuthentication(data)) {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error: No email and phone', null);
            }
            const checkOutType = (_e = data.checkOutType) !== null && _e !== void 0 ? _e : 'manual';
            const getUserDataAsync = async (type, token, data) => {
                if (type === 'preview' &&
                    !((token === null || token === void 0 ? void 0 : token.userID) || (data.user_info && data.user_info.email) || (data.user_info && data.user_info.phone))) {
                    return {};
                }
                if ((token === null || token === void 0 ? void 0 : token.userID) && type !== 'POS' && checkOutType !== 'POS') {
                    return await userClass.getUserData(`${token.userID}`, 'userID');
                }
                return ((data.user_info.email && (await userClass.getUserData(data.user_info.email, 'email_or_phone'))) ||
                    (data.user_info.phone && (await userClass.getUserData(data.user_info.phone, 'email_or_phone'))) ||
                    {});
            };
            checkPoint('check user auth');
            const userData = await getUserDataAsync(type, this.token, data);
            data.email = ((_f = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _f === void 0 ? void 0 : _f.email) || ((_g = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _g === void 0 ? void 0 : _g.phone) || '';
            if (!data.email || data.email === 'no-email') {
                data.email =
                    ((_h = data.user_info) === null || _h === void 0 ? void 0 : _h.email) && data.user_info.email !== 'no-email'
                        ? data.user_info.email
                        : ((_j = data.user_info) === null || _j === void 0 ? void 0 : _j.phone) || '';
            }
            if (!data.email && type !== 'preview') {
                data.email = 'no-email';
            }
            const appStatus = await rebateClass.mainStatus();
            if (appStatus && userData && data.use_rebate && data.use_rebate > 0) {
                const userRebate = await rebateClass.getOneRebate({ user_id: userData.userID });
                const sum = userRebate ? userRebate.point : 0;
                if (sum < data.use_rebate) {
                    data.use_rebate = 0;
                }
            }
            else {
                data.use_rebate = 0;
            }
            checkPoint('check rebate');
            const shipment = await this.getShipmentRefer(data.user_info);
            const shipment_setting = await (async () => {
                try {
                    const config = await private_config_js_1.Private_config.getConfig({
                        appName: this.app,
                        key: 'logistics_setting',
                    });
                    if (!config) {
                        return {
                            support: [],
                            shipmentSupport: [],
                        };
                    }
                    return config[0].value;
                }
                catch (e) {
                    return [];
                }
            })();
            checkPoint('set shipment');
            shipment_setting.custom_delivery = shipment_setting.custom_delivery
                ? await Promise.all(shipment_setting.custom_delivery.map(async (form) => {
                    const config = await new user_js_1.User(this.app).getConfigV2({
                        user_id: 'manager',
                        key: `form_delivery_${form.id}`,
                    });
                    form.form = config.list || [];
                    return form;
                })).then(dataArray => dataArray)
                : [];
            shipment_setting.support = (_k = shipment_setting.support) !== null && _k !== void 0 ? _k : [];
            const languageInfo = (_m = (_l = shipment_setting.language_data) === null || _l === void 0 ? void 0 : _l[data.language]) === null || _m === void 0 ? void 0 : _m.info;
            shipment_setting.info = languageInfo !== null && languageInfo !== void 0 ? languageInfo : shipment_setting.info;
            const carData = {
                customer_info: data.customer_info || {},
                lineItems: [],
                total: 0,
                email: (_q = (_o = data.email) !== null && _o !== void 0 ? _o : (_p = data.user_info) === null || _p === void 0 ? void 0 : _p.email) !== null && _q !== void 0 ? _q : '',
                user_info: data.user_info,
                shipment_fee: 0,
                rebate: 0,
                goodsWeight: 0,
                use_rebate: data.use_rebate || 0,
                orderID: data.order_id || `${Date.now()}`,
                shipment_support: shipment_setting.support,
                shipment_info: shipment_setting.info,
                shipment_selector: [
                    ...shipment_config_js_1.ShipmentConfig.list.map(dd => ({
                        name: dd.title,
                        value: dd.value,
                    })),
                    ...((_r = shipment_setting.custom_delivery) !== null && _r !== void 0 ? _r : []).map((dd) => ({
                        form: dd.form,
                        name: dd.name,
                        value: dd.id,
                        system_form: dd.system_form,
                    })),
                ].filter(option => shipment_setting.support.includes(option.value)),
                use_wallet: 0,
                method: (_s = data.user_info) === null || _s === void 0 ? void 0 : _s.method,
                user_email: (_w = (_u = (_t = userData === null || userData === void 0 ? void 0 : userData.account) !== null && _t !== void 0 ? _t : data.email) !== null && _u !== void 0 ? _u : (_v = data.user_info) === null || _v === void 0 ? void 0 : _v.email) !== null && _w !== void 0 ? _w : '',
                useRebateInfo: { point: 0 },
                custom_form_format: data.custom_form_format,
                custom_form_data: data.custom_form_data,
                custom_receipt_form: data.custom_receipt_form,
                orderSource: checkOutType === 'POS' ? 'POS' : '',
                code_array: data.code_array,
                give_away: data.give_away,
                user_rebate_sum: 0,
                language: data.language,
                pos_info: data.pos_info,
                client_ip_address: data.client_ip_address,
                fbc: data.fbc,
                fbp: data.fbp,
                editRecord: [],
            };
            if (!((_x = data.user_info) === null || _x === void 0 ? void 0 : _x.name) && userData && userData.userData) {
                const { name, phone } = userData.userData;
                carData.user_info = Object.assign(Object.assign({}, carData.user_info), { name,
                    phone });
            }
            const add_on_items = [];
            const gift_product = [];
            const saveStockArray = [];
            function getVariant(prod, item) {
                var _a;
                if (prod.product_category === 'kitchen') {
                    let price = 0;
                    let show_understocking = false;
                    let stock = Infinity;
                    if (prod.specs.length) {
                        price = item.spec.reduce((total, spec, index) => {
                            const dpe = prod.specs[index].option.find((dd) => dd.title === spec);
                            if (dpe) {
                                const currentStock = Number(dpe.stock) || Infinity;
                                stock = Math.min(stock, currentStock);
                                if (dpe.stock !== undefined) {
                                    show_understocking = true;
                                }
                                return total + (Number(dpe.price) || 0);
                            }
                            return total;
                        }, 0);
                    }
                    else {
                        price = Number(prod.price) || 0;
                        show_understocking = Boolean((_a = prod.stock) !== null && _a !== void 0 ? _a : '');
                        stock = Number(prod.stock) || 0;
                    }
                    if (stock === Infinity) {
                        show_understocking = false;
                    }
                    return {
                        sku: '',
                        spec: [],
                        type: 'variants',
                        stock,
                        v_width: 0,
                        product_id: prod.id,
                        sale_price: price,
                        origin_price: 0,
                        compare_price: 0,
                        preview_image: prod.preview_image && prod.preview_image[0],
                        shipment_type: 'none',
                        show_understocking: String(show_understocking),
                    };
                }
                else {
                    return prod.variants.find((dd) => dd.spec.join('-') === item.spec.join('-'));
                }
            }
            data.line_items = await Promise.all(data.line_items.map(async (item) => {
                var _a, _b, _c, _d, _e;
                const getProductData = (await this.getProduct({
                    page: 0,
                    limit: 1,
                    id: `${item.id}`,
                    status: 'inRange',
                    channel: checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
                    whereStore: checkOutType === 'POS' ? data.pos_store : undefined,
                    setUserID: `${(userData === null || userData === void 0 ? void 0 : userData.userID) || ''}`,
                })).data;
                if (getProductData) {
                    const content = getProductData.content;
                    const variant = getVariant(content, item);
                    const count = Number(item.count);
                    if ((Number.isInteger(variant.stock) || variant.show_understocking === 'false') &&
                        !isNaN(count) &&
                        count > 0) {
                        const isPOS = checkOutType === 'POS';
                        const isUnderstockingVisible = variant.show_understocking !== 'false';
                        const isManualType = type === 'manual' || type === 'manual-preview';
                        if (isPOS && isUnderstockingVisible && !data.isExhibition) {
                            variant.stock = ((_b = (_a = variant.stockList) === null || _a === void 0 ? void 0 : _a[data.pos_store]) === null || _b === void 0 ? void 0 : _b.count) || 0;
                        }
                        if (variant.stock < item.count && isUnderstockingVisible && !isManualType) {
                            if (isPOS) {
                                item.pre_order = true;
                            }
                            else {
                                item.count = variant.stock;
                            }
                        }
                        if (variant && item.count > 0) {
                            Object.assign(item, {
                                specs: content.specs,
                                language_data: content.language_data,
                                product_category: content.product_category,
                                preview_image: variant.preview_image || content.preview_image[0],
                                title: content.title,
                                sale_price: variant.sale_price,
                                origin_price: variant.origin_price,
                                collection: content.collection,
                                sku: variant.sku,
                                stock: variant.stock,
                                show_understocking: variant.show_understocking,
                                stockList: variant.stockList,
                                weight: parseInt(variant.weight || '0', 10),
                                designated_logistics: (_c = content.designated_logistics) !== null && _c !== void 0 ? _c : { type: 'all', list: [] },
                            });
                            const shipmentValue = (() => {
                                if (!variant.shipment_type || variant.shipment_type === 'none')
                                    return 0;
                                if (variant.shipment_type === 'weight') {
                                    return item.count * variant.weight;
                                }
                                if (variant.shipment_type === 'volume') {
                                    return item.count * variant.v_length * variant.v_width * variant.v_height;
                                }
                                return 0;
                            })();
                            item.shipment_obj = {
                                type: variant.shipment_type,
                                value: shipmentValue,
                            };
                            variant.shipment_weight = parseInt(variant.shipment_weight || '0', 10);
                            carData.lineItems.push(item);
                            if (checkOutType == 'group_buy') {
                                if (!scheduledData) {
                                    const sql = `WHERE JSON_CONTAINS(content->'$.pending_order', '"${data.temp_cart_id}"'`;
                                    const scheduledDataQuery = `
                        SELECT *
                        FROM \`${this.app}\`.\`t_live_purchase_interactions\` ${sql});
                    `;
                                    scheduledData = (await database_js_1.default.query(scheduledDataQuery, []))[0];
                                    if (scheduledData) {
                                        const { content } = scheduledData;
                                        const productData = content.item_list.find((pb) => pb.id === item.id);
                                        if (productData) {
                                            const variantData = productData.content.variants.find((dd) => dd.spec.join('-') === item.spec.join('-'));
                                            if (variantData) {
                                                item.sale_price = variantData.live_model.live_price;
                                                carData.total += item.sale_price * item.count;
                                            }
                                        }
                                    }
                                }
                            }
                            else if (type !== 'manual') {
                                if (content.productType.giveaway) {
                                    variant.sale_price = 0;
                                }
                                else {
                                    carData.total += variant.sale_price * item.count;
                                }
                            }
                        }
                        if (!['preview', 'manual', 'manual-preview'].includes(type) && variant.show_understocking !== 'false') {
                            const remainingStock = Math.max(variant.stock - item.count, 0);
                            variant.stock = remainingStock;
                            if (type === 'POS') {
                                if (data.isExhibition) {
                                    if (data.pos_store) {
                                        await this.updateExhibitionActiveStock(data.pos_store, variant.variant_id, item.count);
                                    }
                                }
                                else {
                                    variant.deduction_log = { [data.pos_store]: item.count };
                                    variant.stockList[data.pos_store].count -= item.count;
                                    item.deduction_log = variant.deduction_log;
                                }
                            }
                            else {
                                const returnData = new stock_1.Stock(this.app, this.token).allocateStock(variant.stockList, item.count);
                                variant.deduction_log = returnData.deductionLog;
                                item.deduction_log = returnData.deductionLog;
                            }
                            saveStockArray.push(() => new Promise(async (resolve, reject) => {
                                var _a;
                                try {
                                    if (data.checkOutType == 'group_buy') {
                                        if (!scheduledData) {
                                            const sql = `WHERE JSON_CONTAINS(content->'$.pending_order', '"${data.temp_cart_id}"'`;
                                            const scheduledDataQuery = `
                                SELECT *
                                FROM \`${this.app}\`.\`t_live_purchase_interactions\` ${sql});
                            `;
                                            scheduledData = (await database_js_1.default.query(scheduledDataQuery, []))[0];
                                        }
                                        if (scheduledData) {
                                            const { content } = scheduledData;
                                            const productData = content.item_list.find((pb) => pb.id === item.id);
                                            if (productData) {
                                                const variantData = productData.content.variants.find((dd) => dd.spec.join('-') === item.spec.join('-'));
                                                if (variantData) {
                                                    const stockService = new stock_1.Stock(this.app, this.token);
                                                    const { stockList, deductionLog } = stockService.allocateStock(variantData.stockList, item.count);
                                                    variantData.stockList = stockList;
                                                    item.deduction_log = deductionLog;
                                                    carData.scheduled_id = scheduledData.id;
                                                    await this.updateVariantsForScheduled(content, scheduledData.id);
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        if (content.shopee_id) {
                                            await new shopee_1.Shopee(this.app, this.token).asyncStockToShopee({
                                                product: getProductData,
                                                callback: () => { },
                                            });
                                        }
                                        if (content.product_category === 'kitchen' && ((_a = variant.spec) === null || _a === void 0 ? void 0 : _a.length)) {
                                            variant.spec.forEach((d1, index) => {
                                                const option = content.specs[index].option.find((d2) => d2.title === d1);
                                                if ((option === null || option === void 0 ? void 0 : option.stock) !== undefined) {
                                                    option.stock = parseInt(option.stock, 10) - item.count;
                                                }
                                            });
                                            const store_config = await userClass.getConfigV2({
                                                key: 'store_manager',
                                                user_id: 'manager',
                                            });
                                            item.deduction_log = { [store_config.list[0].id]: item.count };
                                        }
                                        else {
                                            await this.updateVariantsWithSpec(variant, item.id, item.spec);
                                        }
                                        await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_manager_post\`
                             SET ?
                             WHERE id = ${getProductData.id}`, [{ content: JSON.stringify(content) }]);
                                    }
                                    resolve(true);
                                }
                                catch (error) {
                                    reject(error);
                                }
                            }));
                        }
                    }
                    Object.assign(item, {
                        is_add_on_items: content.productType.addProduct && !content.productType.product,
                        is_hidden: content.visible === 'false',
                        is_gift: content.productType.giveaway,
                        sale_price: content.productType.giveaway ? 0 : item.sale_price,
                        min_qty: (_d = content.min_qty) !== null && _d !== void 0 ? _d : item.min_qty,
                        max_qty: (_e = content.max_qty) !== null && _e !== void 0 ? _e : item.max_qty,
                    });
                    item.is_add_on_items && add_on_items.push(item);
                    item.is_gift && gift_product.push(item);
                }
                return item;
            })).then(dataArray => dataArray);
            checkPoint('get product info');
            const maxProductMap = new Map();
            let hasMaxProduct = false;
            for (const product of data.line_items) {
                if (product.max_qty && product.max_qty > 0) {
                    maxProductMap.set(product.id, true);
                    hasMaxProduct = true;
                }
            }
            if (hasMaxProduct && data.email !== 'no-email') {
                const cartTokenSQL = `
            SELECT cart_token
            FROM \`${this.app}\`.t_checkout
            WHERE email IN (${[-99, (_y = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _y === void 0 ? void 0 : _y.email, (_z = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _z === void 0 ? void 0 : _z.phone]
                    .filter(Boolean)
                    .map(item => database_js_1.default.escape(item))
                    .join(',')})
              AND order_status <> '-1'
        `;
                const soldHistory = await database_js_1.default.query(`
              SELECT *
              FROM \`${this.app}\`.t_products_sold_history
              WHERE product_id IN (${[...maxProductMap.keys()].join(',')})
                AND order_id IN (${cartTokenSQL})
          `, []);
                const purchaseHistory = new Map();
                for (const history of soldHistory) {
                    const pid = Number(history.product_id);
                    purchaseHistory.set(pid, ((_0 = purchaseHistory.get(pid)) !== null && _0 !== void 0 ? _0 : 0) + history.count);
                }
                for (const item of data.line_items) {
                    if (maxProductMap.has(item.id)) {
                        item.buy_history_count = purchaseHistory.get(item.id) || 0;
                    }
                }
            }
            checkPoint('set max product');
            carData.shipment_fee = this.getShipmentFee(data.user_info, carData.lineItems, shipment);
            carData.total += carData.shipment_fee;
            const f_rebate = await this.formatUseRebate(carData.total, carData.use_rebate);
            carData.useRebateInfo = f_rebate;
            carData.use_rebate = f_rebate.point;
            carData.total -= carData.use_rebate;
            carData.code = data.code;
            carData.voucherList = [];
            checkPoint('set carData');
            if (userData && userData.account) {
                const userRebate = await rebateClass.getOneRebate({ user_id: userData.userID });
                carData.user_rebate_sum = (userRebate === null || userRebate === void 0 ? void 0 : userRebate.point) || 0;
            }
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
            checkPoint('distribution code');
            if (type !== 'manual' && type !== 'manual-preview') {
                carData.lineItems = carData.lineItems.filter(dd => {
                    return !add_on_items.includes(dd) && !gift_product.includes(dd);
                });
                const c_carData = await this.checkVoucher(structuredClone(carData));
                add_on_items.forEach(dd => {
                    var _a;
                    try {
                        const isAddOnItem = (_a = c_carData.voucherList) === null || _a === void 0 ? void 0 : _a.some(voucher => {
                            return (voucher.reBackType === 'add_on_items' &&
                                voucher.add_on_products.find(d2 => {
                                    return `${dd.id}` === `${d2}`;
                                }));
                        });
                        if (isAddOnItem) {
                            carData.lineItems.push(dd);
                        }
                    }
                    catch (e) {
                        console.error('Error processing add-on items:', e);
                    }
                });
                await this.checkVoucher(carData);
                checkPoint('check voucher');
                let can_add_gift = [];
                (_1 = carData.voucherList) === null || _1 === void 0 ? void 0 : _1.filter(dd => dd.reBackType === 'giveaway').forEach(dd => can_add_gift.push(dd.add_on_products));
                gift_product.forEach(dd => {
                    const max_count = can_add_gift.filter(d1 => d1.includes(dd.id)).length;
                    if (dd.count <= max_count) {
                        for (let a = 0; a < dd.count; a++) {
                            can_add_gift = can_add_gift.filter(d1 => !d1.includes(dd.id));
                        }
                        carData.lineItems.push(dd);
                    }
                });
                for (const giveawayData of carData.voucherList.filter(dd => dd.reBackType === 'giveaway')) {
                    if (!((_2 = giveawayData.add_on_products) === null || _2 === void 0 ? void 0 : _2.length))
                        continue;
                    const productPromises = giveawayData.add_on_products.map(async (id) => {
                        const getGiveawayData = (await this.getProduct({
                            page: 0,
                            limit: 1,
                            id: `${id}`,
                            status: 'inRange',
                            channel: checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
                            whereStore: checkOutType === 'POS' ? data.pos_store : undefined,
                        })).data.content;
                        getGiveawayData.voucher_id = giveawayData.id;
                        return getGiveawayData;
                    });
                    giveawayData.add_on_products = await Promise.all(productPromises);
                }
            }
            const configData = await private_config_js_1.Private_config.getConfig({
                appName: this.app,
                key: 'glitter_finance',
            });
            const keyData = (_3 = configData[0]) === null || _3 === void 0 ? void 0 : _3.value;
            if (keyData) {
                carData.payment_info_custom = keyData.payment_info_custom;
            }
            await new Promise(resolve => {
                var _a;
                let n = 0;
                carData.payment_customer_form = (_a = carData.payment_customer_form) !== null && _a !== void 0 ? _a : [];
                keyData.payment_info_custom.map((item, index) => {
                    userClass
                        .getConfigV2({
                        user_id: 'manager',
                        key: `form_finance_${item.id}`,
                    })
                        .then(data => {
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
            checkPoint('set payment');
            keyData.cash_on_delivery = (_4 = keyData.cash_on_delivery) !== null && _4 !== void 0 ? _4 : { shipmentSupport: [] };
            carData.payment_info_line_pay = keyData.payment_info_line_pay;
            carData.payment_info_atm = keyData.payment_info_atm;
            const defaultPayArray = glitter_finance_js_1.onlinePayArray.map(item => item.key);
            keyData.cash_on_delivery.shipmentSupport = (_5 = keyData.cash_on_delivery.shipmentSupport) !== null && _5 !== void 0 ? _5 : [];
            carData.shipment_support = checkoutPayment
                ? ((_6 = (() => {
                    if (checkoutPayment === 'cash_on_delivery') {
                        return keyData.cash_on_delivery;
                    }
                    else if (defaultPayArray.includes(checkoutPayment)) {
                        return keyData[checkoutPayment];
                    }
                    else if (checkoutPayment === 'atm') {
                        return keyData.payment_info_atm;
                    }
                    else if (checkoutPayment === 'line') {
                        return keyData.payment_info_line_pay;
                    }
                    else {
                        const customPay = keyData.payment_info_custom.find((c) => c.id === checkoutPayment);
                        return customPay !== null && customPay !== void 0 ? customPay : {};
                    }
                })().shipmentSupport) !== null && _6 !== void 0 ? _6 : [])
                : [];
            let subtotal = 0;
            carData.lineItems.map(item => {
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
            carData.lineItems.map(item => {
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
                return carData.lineItems.every(item => {
                    return (item.designated_logistics === undefined ||
                        item.designated_logistics.type === 'all' ||
                        item.designated_logistics.list.includes(dd.value));
                });
            };
            carData.shipment_selector = carData.shipment_selector
                .filter((dd) => {
                return isIncludedInDesignatedLogistics(dd);
            })
                .map(dd => {
                dd.isExcludedByTotal = isExcludedByTotal(dd);
                dd.isExcludedByWeight = isExcludedByWeight(dd);
                return dd;
            });
            carData.code_array = (carData.code_array || []).filter(code => {
                return (carData.voucherList || []).find(dd => dd.code === code);
            });
            function getCartFormulaPass(keyData) {
                const data = keyData.cartSetting;
                if (!data || data.orderFormula === undefined)
                    return true;
                const formulaSet = new Set(data.orderFormula);
                const total = carData.total -
                    (formulaSet.has('shipment_fee') ? 0 : carData.shipment_fee) +
                    (formulaSet.has('discount') || !carData.discount ? 0 : carData.discount) +
                    (formulaSet.has('use_rebate') ? 0 : carData.use_rebate);
                return (!data.minimumTotal || total >= data.minimumTotal) && (!data.maximumTotal || total <= data.maximumTotal);
            }
            carData.payment_setting = glitter_finance_js_1.onlinePayArray.filter((dd) => {
                const k = keyData[dd.key];
                if (!k || !k.toggle || !getCartFormulaPass(k))
                    return false;
                dd.custome_name = k.custome_name;
                if (carData.orderSource === 'POS') {
                    if (dd.key === 'ut_credit_card') {
                        dd.pwd = k['pwd'];
                    }
                    return dd.type === 'pos';
                }
                return dd.type !== 'pos';
            });
            carData.off_line_support = (_7 = keyData.off_line_support) !== null && _7 !== void 0 ? _7 : {};
            Object.entries(carData.off_line_support).map(([key, value]) => {
                if (!value)
                    return;
                if (key === 'cash_on_delivery') {
                    carData.off_line_support[key] = getCartFormulaPass(keyData[key]);
                }
                else if (key === 'atm') {
                    carData.off_line_support[key] = getCartFormulaPass(keyData.payment_info_atm);
                }
                else if (key === 'line') {
                    carData.off_line_support[key] = getCartFormulaPass(keyData.payment_info_line_pay);
                }
                else {
                    const customPay = keyData.payment_info_custom.find((c) => c.id === key);
                    carData.off_line_support[key] = getCartFormulaPass(customPay !== null && customPay !== void 0 ? customPay : {});
                }
            });
            if (Array.isArray(carData.shipment_support)) {
                await Promise.all(carData.shipment_support.map(async (sup) => {
                    return await userClass
                        .getConfigV2({ key: 'shipment_config_' + sup, user_id: 'manager' })
                        .then(r => {
                        return getCartFormulaPass(r);
                    })
                        .catch(() => {
                        return true;
                    });
                })).then(dataArray => {
                    var _a;
                    carData.shipment_support = (_a = carData.shipment_support) === null || _a === void 0 ? void 0 : _a.filter((_, index) => dataArray[index]);
                });
            }
            checkPoint('return preview');
            if (type === 'preview' || type === 'manual-preview')
                return { data: carData };
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
            checkPoint('check user rebate');
            if (type === 'manual' || type === 'split') {
                carData.orderSource = type;
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
                    includeDiscount: 'before',
                    device: ['normal'],
                    productOffStart: 'price_all',
                };
                carData.discount = data.discount;
                carData.voucherList = [tempVoucher];
                carData.customer_info = data.customer_info;
                carData.total = (_8 = data.total) !== null && _8 !== void 0 ? _8 : 0;
                carData.rebate = tempVoucher.rebate_total;
                if (tempVoucher.reBackType == 'shipment_free' || type == 'split') {
                    carData.shipment_fee = 0;
                }
                if (tempVoucher.reBackType == 'rebate') {
                    let customerData = await userClass.getUserData(data.email || data.user_info.email, 'account');
                    if (!customerData) {
                        await userClass.createUser(data.email, tool_js_1.default.randomString(8), {
                            email: data.email,
                            name: data.customer_info.name,
                            phone: data.customer_info.phone,
                        }, {}, true);
                        customerData = await userClass.getUserData(data.email || data.user_info.email, 'account');
                    }
                }
                await order_event_js_1.OrderEvent.insertOrder({
                    cartData: carData,
                    status: data.pay_status,
                    app: this.app,
                });
                new notify_js_1.ManagerNotify(this.app).checkout({ orderData: carData, status: 0 });
                const emailList = new Set([carData.customer_info, carData.user_info].map(dd => dd && dd.email));
                for (const email of emailList) {
                    if (email) {
                        await auto_fcm_js_1.AutoFcm.orderChangeInfo({
                            app: this.app,
                            tag: 'order-create',
                            order_id: carData.orderID,
                            phone_email: email,
                        });
                        auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData.orderID, email, carData.language);
                    }
                }
                checkPoint('manual order done');
                return {
                    data: carData,
                };
            }
            else if (type === 'POS') {
                carData.orderSource = 'POS';
                if (checkOutType === 'POS' && Array.isArray(data.voucherList)) {
                    const manualVoucher = data.voucherList.find((item) => item.id === 0);
                    if (manualVoucher) {
                        manualVoucher.discount = (_9 = manualVoucher.discount_total) !== null && _9 !== void 0 ? _9 : 0;
                        carData.total -= manualVoucher.discount;
                        carData.discount += manualVoucher.discount;
                        carData.voucherList.push(manualVoucher);
                    }
                }
                const trans = await database_js_1.default.Transaction.build();
                if (data.pre_order) {
                    carData.progress = 'pre_order';
                    carData.orderStatus = '0';
                    const payTotal = data.pos_info.payment
                        .map((dd) => dd.total)
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
                await order_event_js_1.OrderEvent.insertOrder({
                    cartData: carData,
                    status: data.pay_status,
                    app: this.app,
                });
                if (data.invoice_select !== 'nouse') {
                    carData.invoice = await new invoice_js_1.Invoice(this.app).postCheckoutInvoice(carData, carData.user_info.send_type !== 'carrier');
                }
                await trans.commit();
                await trans.release();
                await Promise.all(saveStockArray.map(dd => dd()));
                await this.releaseCheckout((_10 = data.pay_status) !== null && _10 !== void 0 ? _10 : 0, carData.orderID);
                checkPoint('release pos checkout');
                for (const email of new Set([carData.customer_info, carData.user_info].map(dd => {
                    return dd && dd.email;
                }))) {
                    if (email) {
                        await auto_fcm_js_1.AutoFcm.orderChangeInfo({
                            app: this.app,
                            tag: 'order-create',
                            order_id: carData.orderID,
                            phone_email: email,
                        });
                        auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData.orderID, email, carData.language);
                    }
                }
                return { result: 'SUCCESS', message: 'POS訂單新增成功', data: carData };
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
                await order_event_js_1.OrderEvent.insertOrder({
                    cartData: carData,
                    status: 1,
                    app: this.app,
                });
                if (carData.use_wallet > 0) {
                    new invoice_js_1.Invoice(this.app).postCheckoutInvoice(carData.orderID, false);
                }
                await Promise.all(saveStockArray.map(dd => dd()));
                checkPoint('insert order & create invoice');
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
                let kd = (_11 = keyData[carData.customer_info.payment_select]) !== null && _11 !== void 0 ? _11 : {
                    ReturnURL: '',
                    NotifyURL: '',
                };
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
                        await Promise.all(saveStockArray.map(dd => {
                            return dd();
                        }));
                        checkPoint('select newWebPay');
                        return {
                            form: subMitData,
                        };
                    case 'paypal':
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`;
                        await Promise.all(saveStockArray.map(dd => {
                            return dd();
                        }));
                        checkPoint('select paypal');
                        return await new financial_service_js_1.PayPal(this.app, kd).checkout(carData);
                    case 'line_pay':
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}&type=${carData.customer_info.payment_select}`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`;
                        await Promise.all(saveStockArray.map(dd => {
                            return dd();
                        }));
                        checkPoint('select linepay');
                        return await new financial_service_js_1.LinePay(this.app, kd).createOrder(carData);
                    case 'paynow': {
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}&type=${carData.customer_info.payment_select}`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&paynow=true&type=${carData.customer_info.payment_select}`;
                        await Promise.all(saveStockArray.map(dd => {
                            return dd();
                        }));
                        checkPoint('select paynow');
                        return await new financial_service_js_1.PayNow(this.app, kd).createOrder(carData);
                    }
                    case 'jkopay': {
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&jkopay=true&return=${id}`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=jkopay&return=${id}`;
                        checkPoint('select jkopay');
                        return await new financial_service_js_1.JKO(this.app, kd).createOrder(carData);
                    }
                    default:
                        carData.method = 'off_line';
                        await order_event_js_1.OrderEvent.insertOrder({
                            cartData: carData,
                            status: 0,
                            app: this.app,
                        });
                        await Promise.all(saveStockArray.map(dd => {
                            return dd();
                        }));
                        new notify_js_1.ManagerNotify(this.app).checkout({
                            orderData: carData,
                            status: 0,
                        });
                        for (const phone of new Set([carData.customer_info, carData.user_info].map(dd => {
                            return dd && dd.phone;
                        }))) {
                            let sns = new sms_js_1.SMS(this.app);
                            await sns.sendCustomerSns('auto-sns-order-create', carData.orderID, phone);
                            console.info('訂單簡訊寄送成功');
                        }
                        if (carData.customer_info.lineID) {
                            let line = new line_message_1.LineMessage(this.app);
                            await line.sendCustomerLine('auto-line-order-create', carData.orderID, carData.customer_info.lineID);
                            console.info('訂單line訊息寄送成功');
                        }
                        for (const email of new Set([carData.customer_info, carData.user_info].map(dd => {
                            return dd && dd.email;
                        }))) {
                            if (email) {
                                await auto_fcm_js_1.AutoFcm.orderChangeInfo({
                                    app: this.app,
                                    tag: 'order-create',
                                    order_id: carData.orderID,
                                    phone_email: email,
                                });
                                auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData.orderID, email, carData.language);
                            }
                        }
                        await this.releaseVoucherHistory(carData.orderID, 1);
                        checkPoint('default release checkout');
                        return {
                            off_line: true,
                            return_url: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                        };
                }
            }
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Func Error:' + e, null);
        }
    }
    async repayOrder(orderID, return_url) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const app = this.app;
        async function getOrder(orderID) {
            try {
                const result = await database_js_1.default.query(`
            SELECT *
            FROM \`${app}\`.t_checkout
            WHERE cart_token = ?`, [orderID]);
                return result[0];
            }
            catch (e) {
                console.error(`查詢 orderID ${orderID} 的結帳資料時發生錯誤:`, e.message || e);
                return null;
            }
        }
        const sqlData = await getOrder(orderID);
        if (sqlData) {
            const orderData = sqlData.orderData;
            if (!orderData) {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error: Cannot find this orderID', null);
            }
            const keyData = (await private_config_js_1.Private_config.getConfig({
                appName: this.app,
                key: 'glitter_finance',
            }))[0].value;
            const shipment_setting = await (async () => {
                try {
                    const config = await private_config_js_1.Private_config.getConfig({
                        appName: this.app,
                        key: 'logistics_setting',
                    });
                    if (!config) {
                        return {
                            support: [],
                            shipmentSupport: [],
                        };
                    }
                    return config[0].value;
                }
                catch (e) {
                    return [];
                }
            })();
            let kd = (_a = keyData[orderData.customer_info.payment_select]) !== null && _a !== void 0 ? _a : {
                ReturnURL: '',
                NotifyURL: '',
            };
            const newOrderID = Date.now();
            const carData = {
                discount: (_b = orderData.discount) !== null && _b !== void 0 ? _b : 0,
                customer_info: orderData.customer_info || {},
                lineItems: (_c = orderData.lineItems) !== null && _c !== void 0 ? _c : [],
                total: (_d = orderData.total) !== null && _d !== void 0 ? _d : 0,
                email: (_g = (_e = sqlData.email) !== null && _e !== void 0 ? _e : (_f = orderData.user_info) === null || _f === void 0 ? void 0 : _f.email) !== null && _g !== void 0 ? _g : '',
                user_info: orderData.user_info,
                shipment_fee: (_h = orderData.shipment_fee) !== null && _h !== void 0 ? _h : 0,
                rebate: (_j = orderData.rebate) !== null && _j !== void 0 ? _j : 0,
                goodsWeight: 0,
                use_rebate: orderData.use_rebate || 0,
                orderID: `${newOrderID}`,
                shipment_support: shipment_setting.support,
                shipment_info: shipment_setting.info,
                shipment_selector: [
                    ...shipment_config_js_1.ShipmentConfig.list.map(dd => ({
                        name: dd.title,
                        value: dd.value,
                    })),
                    ...((_k = shipment_setting.custom_delivery) !== null && _k !== void 0 ? _k : []).map((dd) => ({
                        form: dd.form,
                        name: dd.name,
                        value: dd.id,
                        system_form: dd.system_form,
                    })),
                ].filter(option => shipment_setting.support.includes(option.value)),
                use_wallet: 0,
                method: (_l = sqlData.user_info) === null || _l === void 0 ? void 0 : _l.method,
                user_email: (_p = (_m = sqlData.email) !== null && _m !== void 0 ? _m : (_o = orderData.user_info) === null || _o === void 0 ? void 0 : _o.email) !== null && _p !== void 0 ? _p : '',
                useRebateInfo: sqlData.useRebateInfo,
                custom_form_format: sqlData.custom_form_format,
                custom_form_data: sqlData.custom_form_data,
                custom_receipt_form: sqlData.custom_receipt_form,
                orderSource: sqlData.orderSource === 'POS' ? 'POS' : '',
                code_array: sqlData.code_array,
                give_away: sqlData.give_away,
                user_rebate_sum: 0,
                language: sqlData.language,
                pos_info: sqlData.pos_info,
                client_ip_address: sqlData.client_ip_address,
                fbc: sqlData.fbc,
                fbp: sqlData.fbp,
                editRecord: [],
            };
            console.log('orderData.customer_info.payment_select -- ', orderData.customer_info.payment_select);
            const result = await new handlePaymentTransaction_js_1.default(this.app, orderData.customer_info.payment_select).processPayment(carData);
            return result;
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
                temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.returnProgress')) IN (${newArray.map(status => `"${status}"`).join(',')})`;
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
                querySql.push(`(archived="${query.archived}")`);
            }
            else if (query.archived === 'false') {
                querySql.push(`((archived is null) or (archived!='true'))`);
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
            let returnOrderID = `${new Date().getTime()}`;
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
                if (origData.status != '1' &&
                    origData.orderData.returnProgress != '-1' &&
                    data.orderData.returnProgress == '-1' &&
                    data.status == '1') {
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
    async combineOrder(dataMap) {
        try {
            delete dataMap.token;
            const currentTime = new Date().toISOString();
            for (const data of Object.values(dataMap)) {
                if (data.orders.length === 0)
                    continue;
                const cartTokens = data.orders.map(order => order.cart_token);
                const placeholders = cartTokens.map(() => '?').join(',');
                const orders = await database_js_1.default.query(`SELECT *
           FROM \`${this.app}\`.t_checkout
           WHERE cart_token IN (${placeholders});`, cartTokens);
                const targetOrder = orders.find(order => order.cart_token === data.targetID);
                const feedsOrder = orders.filter(order => order.cart_token !== data.targetID);
                if (!targetOrder)
                    continue;
                const formatTargetOrder = JSON.parse(JSON.stringify(targetOrder));
                const base = formatTargetOrder.orderData;
                base.orderSource = 'combine';
                base.editRecord = [
                    {
                        time: currentTime,
                        record: `合併自${data.orders.length}筆訂單\\n${cartTokens.map(token => `{{order=${token}}}`).join('\\n')}`,
                    },
                ];
                const accumulateValues = (feed, keys, operation) => {
                    keys.forEach(key => {
                        var _a, _b;
                        base[key] = operation((_a = base[key]) !== null && _a !== void 0 ? _a : (Array.isArray(feed[key]) ? [] : 0), (_b = feed[key]) !== null && _b !== void 0 ? _b : (Array.isArray(feed[key]) ? [] : 0));
                    });
                };
                const mergeOrders = (feed) => {
                    var _a, _b;
                    accumulateValues(feed, ['total', 'rebate', 'discount', 'use_rebate', 'use_wallet', 'goodsWeight'], (a, b) => a + b);
                    accumulateValues(feed, ['give_away', 'lineItems', 'code_array', 'voucherList'], (a, b) => a.concat(b));
                    if (((_a = base.useRebateInfo) === null || _a === void 0 ? void 0 : _a.point) !== undefined && ((_b = feed.useRebateInfo) === null || _b === void 0 ? void 0 : _b.point) !== undefined) {
                        base.useRebateInfo.point += feed.useRebateInfo.point;
                    }
                    if (formatTargetOrder.status === 0 &&
                        !base.proof_purchase &&
                        base.customer_info.payment_select !== 'cash_on_delivery') {
                        base.total -= feed.shipment_fee;
                    }
                    else {
                        base.shipment_fee += feed.shipment_fee;
                    }
                };
                feedsOrder.forEach(order => mergeOrders(order.orderData));
                base.orderID = `${Date.now()}`;
                await order_event_js_1.OrderEvent.insertOrder({
                    cartData: base,
                    status: targetOrder.status,
                    app: this.app,
                });
                const newRecord = {
                    time: currentTime,
                    record: `與其他訂單合併至\\n{{order=${base.orderID}}}`,
                };
                await Promise.all(orders.map(async (order) => {
                    var _a;
                    order.orderData = Object.assign(Object.assign({}, order.orderData), { orderStatus: '-1', archived: 'true', combineOrderID: base.orderID, editRecord: [...((_a = order.orderData.editRecord) !== null && _a !== void 0 ? _a : []), newRecord] });
                    await this.putOrder({
                        id: `${order.id}`,
                        orderData: order.orderData,
                        status: order.status,
                    });
                }));
            }
            return true;
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'combineOrder Error:' + e, null);
        }
    }
    async splitOrder(obj) {
        var _a, _b;
        try {
            const currentTime = new Date().toISOString();
            function generateOrderIds(orderId, arrayLength) {
                const orderIdArray = [];
                const startChar = 'A'.charCodeAt(0);
                for (let i = 0; i < arrayLength; i++) {
                    const charCode = startChar + i;
                    const nextChar = String.fromCharCode(charCode);
                    orderIdArray.push(orderId + nextChar);
                }
                return orderIdArray;
            }
            function refreshOrder(orderData, splitOrderArray) {
                var _a, _b;
                const { newTotal, newDiscount } = splitOrderArray.reduce((acc, order) => {
                    return {
                        newTotal: acc.newTotal + order.total,
                        newDiscount: acc.newDiscount + order.discount,
                    };
                }, { newTotal: 0, newDiscount: 0 });
                orderData.total = orderData.total - newTotal;
                orderData.discount = ((_a = orderData.discount) !== null && _a !== void 0 ? _a : 0) - newDiscount;
                orderData.splitOrders = (_b = generateOrderIds(orderData.orderID, splitOrderArray.length)) !== null && _b !== void 0 ? _b : [];
                orderData.editRecord.push({
                    time: currentTime,
                    record: `拆分成 ${splitOrderArray.length} 筆子訂單\\n${orderData.splitOrders.map(orderID => `{{order=${orderID}}}`).join('\\n')}`,
                });
            }
            const orderData = obj.orderData;
            const splitOrderArray = obj.splitOrderArray;
            refreshOrder(orderData, splitOrderArray);
            await this.putOrder({
                cart_token: orderData.orderID,
                orderData,
            });
            for (const [index, order] of splitOrderArray.entries()) {
                await this.toCheckout({
                    code_array: [],
                    order_id: (_b = (_a = orderData === null || orderData === void 0 ? void 0 : orderData.splitOrders) === null || _a === void 0 ? void 0 : _a[index]) !== null && _b !== void 0 ? _b : '',
                    line_items: order.lineItems,
                    customer_info: order.customer_info,
                    return_url: '',
                    user_info: order.user_info,
                    discount: order.discount,
                    voucher: order.voucher,
                    total: order.total,
                    pay_status: Number(order.pay_status),
                }, 'split');
            }
            return true;
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'splitOrder Error:' + e, null);
        }
    }
    async formatUseRebate(total, useRebate) {
        try {
            const rebateClass = new rebate_js_1.Rebate(this.app);
            const status = await rebateClass.mainStatus();
            const getRS = await new user_js_1.User(this.app).getConfig({ key: 'rebate_setting', user_id: 'manager' });
            if (getRS[0] && getRS[0].value) {
                const configData = getRS[0].value.config;
                if (configData.condition.type === 'total_price' && configData.condition.value > total) {
                    return {
                        status,
                        point: 0,
                        condition: configData.condition.value - total,
                    };
                }
                if (configData.customize) {
                    return {
                        status,
                        point: useRebate,
                    };
                }
                else {
                    if (configData.use_limit.type === 'price') {
                        const limit = configData.use_limit.value;
                        return {
                            status,
                            point: useRebate > limit ? limit : useRebate,
                            limit,
                        };
                    }
                    if (configData.use_limit.type === 'percent') {
                        const limit = parseInt(`${(total * configData.use_limit.value) / 100}`, 10);
                        return {
                            status,
                            point: useRebate > limit ? limit : useRebate,
                            limit,
                        };
                    }
                    if (configData.use_limit.type === 'none') {
                        return {
                            status,
                            point: useRebate,
                        };
                    }
                }
            }
            return {
                status,
                point: useRebate,
            };
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'formatUseRebate Error:' + express_1.default, null);
        }
    }
    async checkVoucher(cart) {
        var _a, _b;
        cart.discount = 0;
        cart.lineItems.map(item => {
            item.discount_price = 0;
            item.rebate = 0;
        });
        const userClass = new user_js_1.User(this.app);
        const userData = (_a = (await userClass.getUserData(cart.email, 'email_or_phone'))) !== null && _a !== void 0 ? _a : { userID: -1 };
        const loginConfig = await userClass.getConfigV2({ key: 'login_config', user_id: 'manager' });
        const sortedVoucher = (_b = loginConfig === null || loginConfig === void 0 ? void 0 : loginConfig.sorted_voucher) !== null && _b !== void 0 ? _b : { toggle: false };
        const allVoucher = await this.getAllUseVoucher(userData.userID);
        const reduceDiscount = {};
        let overlay = false;
        function switchValidProduct(caseName, caseList, caseOffStart) {
            const filterItems = cart.lineItems
                .filter(item => {
                switch (caseName) {
                    case 'collection':
                        return item.collection.some(col => caseList.includes(col));
                    case 'product':
                        return caseList.map(caseString => `${caseString}`).includes(`${item.id}`);
                    default:
                        return true;
                }
            })
                .sort((a, b) => {
                return caseOffStart === 'price_desc' ? b.sale_price - a.sale_price : a.sale_price - b.sale_price;
            });
            return filterItems;
        }
        function checkSource(voucher) {
            if (!voucher.device)
                return true;
            if (voucher.device.length === 0)
                return false;
            return voucher.device.includes(cart.orderSource === 'POS' ? 'pos' : 'normal');
        }
        function checkTarget(voucher) {
            if (voucher.target === 'customer') {
                return (userData === null || userData === void 0 ? void 0 : userData.id) && voucher.targetList.includes(userData.userID);
            }
            if (voucher.target === 'levels') {
                if (userData === null || userData === void 0 ? void 0 : userData.member) {
                    const trigger = userData.member.find((m) => m.trigger);
                    return trigger && voucher.targetList.includes(trigger.id);
                }
                return false;
            }
            return true;
        }
        function setBindProduct(voucher) {
            var _a;
            voucher.bind = [];
            voucher.productOffStart = (_a = voucher.productOffStart) !== null && _a !== void 0 ? _a : 'price_all';
            switch (voucher.trigger) {
                case 'auto':
                    voucher.bind = switchValidProduct(voucher.for, voucher.forKey, voucher.productOffStart);
                    break;
                case 'code':
                    if (voucher.code === `${cart.code}` || (cart.code_array || []).includes(`${voucher.code}`)) {
                        voucher.bind = switchValidProduct(voucher.for, voucher.forKey, voucher.productOffStart);
                    }
                    break;
                case 'distribution':
                    if (cart.distribution_info && cart.distribution_info.voucher === voucher.id) {
                        voucher.bind = switchValidProduct(cart.distribution_info.relative, cart.distribution_info.relative_data, voucher.productOffStart);
                    }
                    break;
            }
            if (voucher.method === 'percent' &&
                voucher.conditionType === 'order' &&
                voucher.rule === 'min_count' &&
                voucher.reBackType === 'discount' &&
                voucher.productOffStart !== 'price_all' &&
                voucher.ruleValue > 0) {
                voucher.bind = voucher.bind.slice(0, voucher.ruleValue);
            }
            return voucher.bind.length > 0;
        }
        function checkCartTotal(voucher) {
            voucher.times = 0;
            voucher.bind_subtotal = 0;
            const ruleValue = parseInt(`${voucher.ruleValue}`, 10);
            if (voucher.conditionType === 'order') {
                let cartValue = 0;
                voucher.bind.map(item => {
                    voucher.bind_subtotal += item.count * item.sale_price;
                });
                if (cart.discount && voucher.includeDiscount === 'after') {
                    voucher.bind_subtotal -= cart.discount;
                }
                if (voucher.rule === 'min_price') {
                    cartValue = voucher.bind_subtotal;
                }
                if (voucher.rule === 'min_count') {
                    voucher.bind.map(item => {
                        cartValue += item.count;
                    });
                }
                if (voucher.reBackType === 'shipment_free') {
                    return cartValue >= ruleValue;
                }
                if (cartValue >= ruleValue) {
                    if (voucher.counting === 'each') {
                        voucher.times = Math.floor(cartValue / ruleValue);
                    }
                    if (voucher.counting === 'single') {
                        voucher.times = 1;
                    }
                }
                return voucher.times > 0;
            }
            if (voucher.conditionType === 'item') {
                if (voucher.rule === 'min_price') {
                    voucher.bind = voucher.bind.filter(item => {
                        var _a;
                        item.times = 0;
                        let subtotal = item.count * item.sale_price;
                        if (cart.discount && voucher.includeDiscount === 'after') {
                            subtotal -= (_a = reduceDiscount[item.id]) !== null && _a !== void 0 ? _a : 0;
                        }
                        if (subtotal >= ruleValue) {
                            if (voucher.counting === 'each') {
                                item.times = Math.floor(subtotal / ruleValue);
                            }
                            if (voucher.counting === 'single') {
                                item.times = 1;
                            }
                        }
                        return item.times > 0;
                    });
                }
                if (voucher.rule === 'min_count') {
                    voucher.bind = voucher.bind.filter(item => {
                        item.times = 0;
                        if (item.count >= ruleValue) {
                            if (voucher.counting === 'each') {
                                item.times = Math.floor(item.count / ruleValue);
                            }
                            if (voucher.counting === 'single') {
                                item.times = 1;
                            }
                        }
                        return item.times > 0;
                    });
                }
                return voucher.bind.reduce((acc, item) => acc + item.times, 0) > 0;
            }
            return false;
        }
        function compare(voucher) {
            return voucher.bind
                .map(item => {
                const val = parseFloat(voucher.value);
                return voucher.method === 'percent' ? (item.sale_price * val) / 100 : val;
            })
                .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        }
        function manualSorted(a, b) {
            const aIndex = sortedVoucher.array.indexOf(a.id);
            const bIndex = sortedVoucher.array.indexOf(b.id);
            return aIndex > bIndex ? 1 : -1;
        }
        function checkOverlay(voucher) {
            if (overlay || voucher.overlay)
                return voucher.overlay;
            overlay = true;
            return true;
        }
        function checkCondition(voucher) {
            var _a, _b;
            voucher.discount_total = (_a = voucher.discount_total) !== null && _a !== void 0 ? _a : 0;
            voucher.rebate_total = (_b = voucher.rebate_total) !== null && _b !== void 0 ? _b : 0;
            if (voucher.reBackType === 'shipment_free')
                return true;
            const disValue = parseFloat(voucher.value) / (voucher.method === 'percent' ? 100 : 1);
            if (voucher.conditionType === 'order') {
                if (voucher.method === 'fixed') {
                    voucher.discount_total = disValue * voucher.times;
                }
                if (voucher.method === 'percent') {
                    voucher.discount_total = voucher.bind_subtotal * disValue;
                }
                if (voucher.bind_subtotal >= voucher.discount_total) {
                    let remain = parseInt(`${voucher.discount_total}`, 10);
                    voucher.bind.map((item, index) => {
                        let discount = 0;
                        if (index === voucher.bind.length - 1) {
                            discount = remain;
                        }
                        else {
                            discount = Math.round(remain * ((item.sale_price * item.count) / voucher.bind_subtotal));
                        }
                        if (discount > 0 && discount <= item.sale_price * item.count) {
                            if (voucher.reBackType === 'rebate') {
                                item.rebate += Math.round(discount / item.count);
                                cart.rebate += discount;
                                voucher.rebate_total += discount;
                            }
                            else {
                                item.discount_price += Math.round(discount / item.count);
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
            if (voucher.conditionType === 'item') {
                if (voucher.method === 'fixed') {
                    voucher.bind = voucher.bind.filter(item => {
                        const discount = disValue * item.times;
                        if (discount <= item.sale_price * item.count) {
                            if (voucher.reBackType === 'rebate') {
                                item.rebate += Math.round(discount / item.count);
                                cart.rebate += discount;
                                voucher.rebate_total += discount;
                            }
                            else {
                                item.discount_price += Math.round(discount / item.count);
                                cart.discount += discount;
                                voucher.discount_total += discount;
                            }
                            return true;
                        }
                        return false;
                    });
                }
                if (voucher.method === 'percent') {
                    voucher.bind = voucher.bind.filter(item => {
                        const discount = Math.floor(item.sale_price * item.count * disValue);
                        if (discount <= item.sale_price * item.count) {
                            if (voucher.reBackType === 'rebate') {
                                item.rebate += Math.round(discount / item.count);
                                cart.rebate += discount;
                                voucher.rebate_total += discount;
                            }
                            else {
                                item.discount_price += Math.round(discount / item.count);
                                cart.discount += discount;
                                voucher.discount_total += discount;
                            }
                            return true;
                        }
                        return false;
                    });
                }
            }
            return voucher.bind.length > 0;
        }
        function countingBindDiscount(voucher) {
            voucher.bind.map(item => {
                var _a;
                reduceDiscount[item.id] = ((_a = reduceDiscount[item.id]) !== null && _a !== void 0 ? _a : 0) + item.discount_price * item.count;
            });
        }
        function filterVoucherlist(vouchers) {
            return vouchers
                .filter(voucher => {
                return [checkSource, checkTarget, setBindProduct, checkCartTotal].every(fn => fn(voucher));
            })
                .sort((a, b) => {
                return sortedVoucher.toggle ? manualSorted(a, b) : compare(b) - compare(a);
            })
                .filter(voucher => {
                return [checkOverlay, checkCondition].every(fn => fn(voucher));
            })
                .map(voucher => {
                countingBindDiscount(voucher);
                return voucher;
            });
        }
        const includeDiscountVouchers = [];
        const withoutDiscountVouchers = [];
        allVoucher.map(voucher => {
            voucher.includeDiscount === 'after'
                ? includeDiscountVouchers.push(voucher)
                : withoutDiscountVouchers.push(voucher);
        });
        const voucherList = [...filterVoucherlist(withoutDiscountVouchers), ...filterVoucherlist(includeDiscountVouchers)];
        if (!voucherList.find((voucher) => voucher.code === `${cart.code}`)) {
            cart.code = undefined;
        }
        if (voucherList.find((voucher) => voucher.reBackType === 'shipment_free')) {
            cart.total -= cart.shipment_fee;
            cart.shipment_fee = 0;
        }
        cart.total -= cart.discount;
        cart.voucherList = voucherList;
        return cart;
    }
    async putOrder(data) {
        var _a;
        try {
            const update = {};
            const storeConfig = await new user_js_1.User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' });
            let origin;
            const whereClause = data.cart_token ? 'cart_token = ?' : data.id ? 'id = ?' : null;
            const value = (_a = data.cart_token) !== null && _a !== void 0 ? _a : data.id;
            if (whereClause && value) {
                const query = `SELECT *
                       FROM \`${this.app}\`.t_checkout
                       WHERE ${whereClause};`;
                const result = await database_js_1.default.query(query, [value]);
                origin = result[0];
            }
            if (!origin) {
                return {
                    result: 'error',
                    message: `訂單 id ${data.id} 不存在`,
                };
            }
            if (data.status !== undefined) {
                update.status = data.status;
            }
            else {
                data.status = update.status;
            }
            const resetLineItems = (lineItems) => {
                return lineItems.map(item => {
                    return Object.assign(Object.assign({}, item), { stockList: undefined, deduction_log: Object.keys(item.deduction_log || {}).length
                            ? item.deduction_log
                            : { [storeConfig.list[0].id]: item.count } });
                });
            };
            if (data.orderData) {
                const orderData = data.orderData;
                update.orderData = structuredClone(orderData);
                orderData.lineItems = resetLineItems(orderData.lineItems);
                origin.orderData.lineItems = resetLineItems(origin.orderData.lineItems);
                await this.releaseVoucherHistory(orderData.orderID, orderData.orderStatus === '-1' ? 0 : 1);
                const prevStatus = origin.orderData.orderStatus;
                const prevProgress = origin.orderData.progress || 'wait';
                if (prevStatus !== '-1' && orderData.orderStatus === '-1') {
                    await this.resetStore(origin.orderData.lineItems);
                    const emailList = new Set([origin.orderData.customer_info, origin.orderData.user_info].map(user => user === null || user === void 0 ? void 0 : user.email));
                    for (const email of emailList) {
                        if (email) {
                            await auto_fcm_js_1.AutoFcm.orderChangeInfo({
                                app: this.app,
                                tag: 'order-cancel-success',
                                order_id: orderData.orderID,
                                phone_email: email,
                            });
                            await auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-cancel-success', orderData.orderID, email, orderData.language);
                        }
                    }
                }
                else if (prevStatus === '-1' && orderData.orderStatus !== '-1') {
                    await this.resetStore(origin.orderData.lineItems, 'minus');
                }
                if (update.orderData.user_info.shipment_number && !update.orderData.user_info.shipment_date) {
                    update.orderData.user_info.shipment_date = new Date().toISOString();
                }
                else if (!update.orderData.user_info.shipment_number) {
                    delete update.orderData.user_info.shipment_date;
                }
                const updateProgress = update.orderData.progress;
                if (updateProgress === 'wait' &&
                    update.orderData.user_info.shipment_number &&
                    update.orderData.user_info.shipment_number !== origin.orderData.user_info.shipment_number) {
                    await this.sendNotifications(orderData, 'in_stock');
                }
                else if (prevProgress !== updateProgress) {
                    if (updateProgress === 'shipping') {
                        await this.sendNotifications(orderData, 'shipment');
                    }
                    else if (updateProgress === 'arrived') {
                        await this.sendNotifications(orderData, 'arrival');
                    }
                }
                else {
                    await this.adjustStock(origin.orderData, orderData);
                }
                if (origin.status !== update.status) {
                    await this.releaseCheckout(update.status, data.orderData.orderID);
                }
            }
            update.orderData.lineItems = update.orderData.lineItems.filter((item) => item.count > 0);
            this.writeRecord(origin, update);
            const updateData = Object.entries(update).reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [key]: typeof value === 'object' ? JSON.stringify(value) : value })), {});
            await database_js_1.default.query(`UPDATE \`${this.app}\`.t_checkout
         SET ?
         WHERE id = ?;
        `, [updateData, origin.id]);
            await Promise.all(origin.orderData.lineItems.map(async (lineItem) => {
                var _a;
                const shopping = new Shopping(this.app, this.token);
                const shopee = new shopee_1.Shopee(this.app, this.token);
                const pd = await shopping.getProduct({
                    id: lineItem.id,
                    page: 0,
                    limit: 10,
                    skip_shopee_check: true,
                });
                if ((_a = pd.data) === null || _a === void 0 ? void 0 : _a.shopee_id) {
                    await shopee.asyncStockToShopee({
                        product: pd.data,
                        callback: () => { },
                    });
                }
            }));
            await checkout_js_1.CheckoutService.updateAndMigrateToTableColumn({
                id: origin.id,
                orderData: update.orderData,
                app_name: this.app,
            });
            const orderCountingSQL = await new user_js_1.User(this.app).getCheckoutCountingModeSQL();
            const orderCount = await database_js_1.default.query(`SELECT *
         FROM \`${this.app}\`.t_checkout
         WHERE id = ?
           AND ${orderCountingSQL};
        `, [origin.id]);
            if (orderCount[0]) {
                await this.shareVoucherRebate(orderCount[0]);
            }
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
    writeRecord(origin, update) {
        var _a, _b;
        const editArray = [];
        const currentTime = new Date().toISOString();
        const { orderStatus, progress } = origin.orderData;
        origin.orderData = Object.assign(Object.assign({}, origin.orderData), { orderStatus: orderStatus !== null && orderStatus !== void 0 ? orderStatus : '0', progress: progress !== null && progress !== void 0 ? progress : 'wait' });
        if (update.status != origin.status) {
            const statusTexts = {
                '1': '付款成功',
                '-2': '退款成功',
                '0': '修改為未付款',
                '3': '修改為部分付款',
            };
            const statusText = statusTexts[update.status];
            if (statusText) {
                editArray.push({
                    time: currentTime,
                    record: statusText,
                });
            }
        }
        if (update.orderData.orderStatus != origin.orderData.orderStatus) {
            const orderStatusTexts = {
                '1': '訂單已完成',
                '0': '訂單改為處理中',
                '-1': '訂單已取消',
            };
            const orderStatusText = orderStatusTexts[update.orderData.orderStatus];
            if (orderStatusText) {
                editArray.push({
                    time: currentTime,
                    record: orderStatusText,
                });
            }
        }
        if (update.orderData.progress != origin.orderData.progress) {
            const progressTexts = {
                shipping: '商品已出貨',
                wait: '商品處理中',
                finish: '商品已取貨',
                returns: '商品已退貨',
                arrived: '商品已到貨',
            };
            const progressText = progressTexts[update.orderData.progress];
            if (progressText) {
                editArray.push({
                    time: currentTime,
                    record: progressText,
                });
            }
        }
        const updateNumber = (_a = update.orderData.user_info) === null || _a === void 0 ? void 0 : _a.shipment_number;
        if (updateNumber && updateNumber !== origin.orderData.user_info.shipment_number) {
            const type = origin.orderData.user_info.shipment_number ? '更新' : '建立';
            editArray.push({
                time: currentTime,
                record: `${type}出貨單號碼\\n{{shipment=${updateNumber}}}`,
            });
        }
        if (update.orderData.archived === 'true' && origin.orderData.archived !== 'true') {
            editArray.push({
                time: currentTime,
                record: '訂單已封存',
            });
        }
        if (editArray.length > 0) {
            update.orderData.editRecord = [...((_b = update.orderData.editRecord) !== null && _b !== void 0 ? _b : []), ...editArray];
        }
    }
    async resetStore(lineItems, plus_or_minus = 'plus') {
        const shoppingClass = new Shopping(this.app, this.token);
        const calcMap = new Map();
        function updateCalcData(calc, stock_id, product_id, spec) {
            const getCalc = calcMap.get(product_id);
            calcMap.set(product_id, [...(getCalc !== null && getCalc !== void 0 ? getCalc : []), { calc, stock_id, product_id, spec }]);
        }
        lineItems.map(item => {
            var _a;
            if (item.product_category === 'kitchen' && ((_a = item.spec) === null || _a === void 0 ? void 0 : _a.length)) {
                updateCalcData(item.count, '', item.id, item.spec);
                return;
            }
            Object.entries(item.deduction_log).map(([location, count]) => {
                let intCount = parseInt(`${count || 0}`, 10);
                if (plus_or_minus === 'minus') {
                    intCount = intCount * -1;
                }
                updateCalcData(intCount, location, item.id, item.spec);
            });
        });
        return await Promise.all([...calcMap.values()].map(async (dataArray) => {
            for (const data of dataArray) {
                const { calc, stock_id, product_id, spec } = data;
                await shoppingClass.calcVariantsStock(calc, stock_id, product_id, spec);
            }
        }));
    }
    async sendNotifications(orderData, type) {
        const { lineID } = orderData.customer_info;
        const messages = [];
        const typeMap = {
            shipment: 'shipment',
            arrival: 'shipment-arrival',
            in_stock: 'in-stock',
        };
        if (lineID) {
            const line = new line_message_1.LineMessage(this.app);
            messages.push(line.sendCustomerLine(`auto-line-${typeMap[type]}`, orderData.orderID, lineID));
        }
        for (const email of new Set([orderData.customer_info, orderData.user_info].map(dd => {
            return dd && dd.email;
        }))) {
            if (email) {
                await auto_fcm_js_1.AutoFcm.orderChangeInfo({
                    app: this.app,
                    tag: type,
                    order_id: orderData.orderID,
                    phone_email: email,
                });
                messages.push(auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, `auto-email-${typeMap[type]}`, orderData.orderID, email, orderData.language));
            }
        }
        for (const data of [orderData.customer_info, orderData.user_info]) {
            const sns = new sms_js_1.SMS(this.app);
            messages.push(sns.sendCustomerSns(`auto-sns-${typeMap[type]}`, orderData.orderID, data.phone));
        }
        await Promise.all(messages);
    }
    async adjustStock(origin, orderData) {
        try {
            if (orderData.orderStatus === '-1')
                return;
            const shoppingClass = new Shopping(this.app, this.token);
            const calcMap = new Map();
            function updateCalcData(calc, stock_id, product_id, spec) {
                const getCalc = calcMap.get(product_id);
                calcMap.set(product_id, [...(getCalc !== null && getCalc !== void 0 ? getCalc : []), { calc, stock_id, product_id, spec }]);
            }
            orderData.lineItems.map((newItem) => {
                var _a;
                if (newItem.product_category === 'kitchen' && ((_a = newItem.spec) === null || _a === void 0 ? void 0 : _a.length)) {
                    updateCalcData(newItem.count, '', newItem.id, newItem.spec);
                    return;
                }
                const originalItem = origin.lineItems.find((item) => item.id === newItem.id && item.spec.join('') === newItem.spec.join(''));
                Object.entries(newItem.deduction_log).map(([location, newCount]) => {
                    const parsedNewCount = Number(newCount || 0);
                    const formatNewCount = isNaN(parsedNewCount) ? 0 : parsedNewCount;
                    if (!originalItem) {
                        updateCalcData(formatNewCount * -1, location, newItem.id, newItem.spec);
                        return;
                    }
                    const originalCount = originalItem.deduction_log[location] || 0;
                    const delta = formatNewCount - originalCount;
                    updateCalcData(delta * -1, location, newItem.id, newItem.spec);
                });
            });
            return await Promise.all([...calcMap.values()].map(async (dataArray) => {
                for (const data of dataArray) {
                    const { calc, stock_id, product_id, spec } = data;
                    await shoppingClass.calcVariantsStock(calc, stock_id, product_id, spec);
                }
            }));
        }
        catch (error) {
            console.error(`adjustStock has error: ${error}`);
        }
    }
    async manualCancelOrder(order_id) {
        var _a;
        try {
            if (!this.token) {
                return { result: false, message: 'The token is undefined' };
            }
            const orderList = await database_js_1.default.query(`SELECT *
         FROM \`${this.app}\`.t_checkout
         WHERE cart_token = ?;
        `, [order_id]);
            if (orderList.length === 0) {
                return { result: false, message: `Order id #${order_id} is not exist` };
            }
            const userClass = new user_js_1.User(this.app);
            const user = await userClass.getUserData(`${this.token.userID}`, 'userID');
            const { email, phone } = user.userData;
            const origin = orderList[0];
            if (![email, phone].includes(origin.email)) {
                return { result: false, message: 'The order does not match the token' };
            }
            const orderData = origin.orderData;
            const proofPurchase = orderData.proof_purchase === undefined;
            const paymentStatus = origin.status === undefined || origin.status === 0 || origin.status === -1;
            const progressStatus = orderData.progress === undefined || orderData.progress === 'wait';
            const orderStatus = orderData.orderStatus === undefined || `${orderData.orderStatus}` === '0';
            if (proofPurchase && paymentStatus && progressStatus && orderStatus) {
                orderData.orderStatus = '-1';
                const newRecord = {
                    time: new Date().toISOString(),
                    record: '顧客手動取消訂單',
                };
                orderData.editRecord = [...((_a = orderData.editRecord) !== null && _a !== void 0 ? _a : []), newRecord];
            }
            await this.putOrder({
                cart_token: order_id,
                orderData: orderData,
                status: undefined,
            });
            return { result: true };
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
            for (const email of new Set([orderData.customer_info, orderData.user_info].map(dd => {
                return dd && dd.email;
            }))) {
                if (email) {
                    await auto_fcm_js_1.AutoFcm.orderChangeInfo({
                        app: this.app,
                        tag: 'proof-purchase',
                        order_id: order_id,
                        phone_email: email,
                    });
                    await auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'proof-purchase', order_id, email, orderData.language);
                }
            }
            for (const phone of new Set([orderData.customer_info, orderData.user_info].map(dd => {
                return dd && dd.phone;
            }))) {
                let sns = new sms_js_1.SMS(this.app);
                await sns.sendCustomerSns('sns-proof-purchase', order_id, phone);
                console.info('訂單待核款簡訊寄送成功');
            }
            if (orderData.customer_info.lineID) {
                let line = new line_message_1.LineMessage(this.app);
                await line.sendCustomerLine('line-proof-purchase', order_id, orderData.customer_info.lineID);
                console.info('付款成功line訊息寄送成功');
            }
            await this.putOrder({
                orderData: orderData,
                cart_token: order_id,
                status: undefined,
            });
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
            const timer = new ut_timer_js_1.UtTimer('get-checkout-info');
            timer.checkPoint('start');
            if (query.search && query.searchType) {
                switch (query.searchType) {
                    case 'cart_token':
                        querySql.push(`(cart_token like '%${query.search}%')`);
                        break;
                    case 'shipment_number':
                        querySql.push(`(shipment_number like '%${query.search}%')`);
                        break;
                    case 'name':
                    case 'phone':
                    case 'email':
                        querySql.push(`((UPPER(customer_${query.searchType}) LIKE '%${query.search.toUpperCase()}%') or (UPPER(shipment_${query.searchType}) LIKE '%${query.search.toUpperCase()}%'))`);
                        break;
                    case 'address':
                        querySql.push(`((UPPER(shipment_${query.searchType}) LIKE '%${query.search.toUpperCase()}%'))`);
                        break;
                    case 'invoice_number':
                        querySql.push(`(cart_token in (select order_id from \`${this.app}\`.t_invoice_memory where invoice_no like '%${query.search}%' ))`);
                        break;
                    case 'cart_token_exact':
                        querySql.push(`(cart_token = '${query.search}')`);
                        break;
                    default:
                        querySql.push(`JSON_CONTAINS_PATH(orderData, 'one', '$.lineItems[*].title') AND JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.lineItems[*].${query.searchType}')) REGEXP '${query.search}'`);
                        break;
                }
            }
            if (query.id_list) {
                const id_list = [-99, ...query.id_list.split(',')].join(',');
                switch (query.searchType) {
                    case 'cart_token':
                        querySql.push(`(cart_token IN (${id_list}))`);
                        break;
                    case 'shipment_number':
                        querySql.push(`(shipment_number IN (${id_list}))`);
                        break;
                    default:
                        querySql.push(`(o.id IN (${id_list}))`);
                        break;
                }
            }
            if (query.reconciliation_status) {
                let search = [];
                query.reconciliation_status.map(status => {
                    if (status === 'pending_entry') {
                        search.push(`total_received is NULL`);
                    }
                    else if (status === 'completed_entry') {
                        search.push(`total_received = total`);
                    }
                    else if (status === 'refunded') {
                        search.push(`(total_received > total) && ((total_received + offset_amount) = total)`);
                    }
                    else if (status === 'completed_offset') {
                        search.push(`(total_received < total) && ((total_received + offset_amount) = total)`);
                    }
                    else if (status === 'pending_offset') {
                        search.push(`(total_received < total)  &&  (offset_amount is null)`);
                    }
                    else if (status === 'pending_refund') {
                        search.push(`(total_received > total)   &&  (offset_amount is null)`);
                    }
                });
                querySql.push(`(${search
                    .map(dd => {
                    return `(${dd})`;
                })
                    .join(' or ')})`);
            }
            if (query.orderStatus) {
                let orderArray = query.orderStatus.split(',');
                let temp = '';
                if (orderArray.includes('0')) {
                    temp += 'order_status IS NULL OR ';
                }
                temp += `order_status IN (${query.orderStatus})`;
                querySql.push(`(${temp})`);
            }
            if (query.valid) {
                const countingSQL = await new user_js_1.User(this.app).getCheckoutCountingModeSQL('o');
                querySql.push(countingSQL);
            }
            if (query.is_shipment) {
                querySql.push(`(shipment_number IS NOT NULL) and (shipment_number != '')`);
            }
            if (query.is_reconciliation) {
                querySql.push(`((o.status in (1,-2)) or ((payment_method='cash_on_delivery' and progress='finish') ))`);
            }
            if (query.payment_select) {
                querySql.push(`payment_method in (${query.payment_select
                    .split(',')
                    .map(d => `'${d}'`)
                    .join(',')})`);
            }
            if (query.progress) {
                if (query.progress === 'in_stock') {
                    query.progress = 'wait';
                    querySql.push(`shipment_number is NOT null`);
                }
                else if (query.progress === 'wait') {
                    querySql.push(`shipment_number is null`);
                }
                let newArray = query.progress.split(',');
                let temp = '';
                if (newArray.includes('wait')) {
                    temp += 'progress IS NULL OR ';
                }
                temp += `progress IN (${newArray.map(status => `"${status}"`).join(',')})`;
                querySql.push(`(${temp})`);
            }
            if (query.distribution_code) {
                let codes = query.distribution_code.split(',');
                let temp = '';
                temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.distribution_info.code')) IN (${codes.map(code => `"${code}"`).join(',')})`;
                querySql.push(`(${temp})`);
            }
            if (query.is_pos === 'true') {
                querySql.push(`order_source='POS'`);
            }
            else if (query.is_pos === 'false') {
                querySql.push(`(order_source!='POS' or order_source is null)`);
            }
            if (query.shipment) {
                let shipment = query.shipment.split(',');
                let temp = '';
                if (shipment.includes('normal')) {
                    temp += '(shipment_method IS NULL) OR ';
                }
                temp += `(shipment_method IN (${shipment.map(status => `"${status}"`).join(',')}))`;
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
            if (query.shipment_time) {
                const shipment_time = query.shipment_time.split(',');
                if (shipment_time.length > 1) {
                    querySql.push(`
                       (shipment_date >= ${database_js_1.default.escape(`${shipment_time[0]}`)}) and
                        (shipment_date <= ${database_js_1.default.escape(`${shipment_time[1]}`)})
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
                        orderString = 'order by total desc';
                        break;
                    case 'order_total_asc':
                        orderString = 'order by total asc';
                        break;
                }
            }
            query.status && querySql.push(`o.status IN (${query.status})`);
            const orderMath = [];
            query.email && orderMath.push(`(email=${database_js_1.default.escape(query.email)})`);
            query.phone && orderMath.push(`(email=${database_js_1.default.escape(query.phone)})`);
            if (orderMath.length) {
                querySql.push(`(${orderMath.join(' or ')})`);
            }
            if (query.filter_type === 'true' || query.archived) {
                if (query.archived === 'true') {
                    querySql.push(`(archived="${query.archived}") 
                    AND (order_status IS NULL OR order_status NOT IN (-99))`);
                }
                else {
                    querySql.push(`((archived="${query.archived}") or (archived is null))`);
                }
            }
            else if (query.filter_type === 'normal') {
                querySql.push(`((archived is null) or (archived!='true'))`);
            }
            if (!(query.filter_type === 'true' || query.archived)) {
                querySql.push(`((order_status is null) or (order_status NOT IN (-99)))`);
            }
            let sql = `SELECT i.invoice_no,
                        i.invoice_data,
                        i.\`status\` as invoice_status,
                        o.*
                 FROM \`${this.app}\`.t_checkout o
                          LEFT JOIN \`${this.app}\`.t_invoice_memory i ON o.cart_token = i.order_id and i.status = 1
                 WHERE ${querySql.join(' and ')} ${orderString}`;
            timer.checkPoint('start-query-sql');
            if (query.returnSearch == 'true') {
                const data = await database_js_1.default.query(`SELECT *
           FROM \`${this.app}\`.t_checkout
           WHERE cart_token = ${database_js_1.default.escape(query.search)}`, []);
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
            const response_data = await new Promise(async (resolve, reject) => {
                timer.checkPoint('start-query-response_data');
                if (query.id) {
                    const data = (await database_js_1.default.query(`SELECT *
               FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}
              `, []))[0];
                    resolve({
                        data: data,
                        result: !!data,
                    });
                }
                else {
                    const data = await database_js_1.default.query(`SELECT *
             FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}
            `, []);
                    timer.checkPoint('finish-query-response_data');
                    resolve({
                        data: data,
                        total: (await database_js_1.default.query(`SELECT count(1)
                 FROM (${sql}) as subqyery
                `, []))[0]['count(1)'],
                    });
                }
            });
            const obMap = Array.isArray(response_data.data) ? response_data.data : [response_data.data];
            const keyData = (await private_config_js_1.Private_config.getConfig({
                appName: this.app,
                key: 'glitter_finance',
            }))[0].value;
            await Promise.all(obMap
                .map(async (order) => {
                try {
                    if (order.orderData.customer_info.payment_select === 'ecPay') {
                        order.orderData.cash_flow = await new financial_service_js_1.EcPay(this.app).checkPaymentStatus(order.cart_token);
                    }
                    if (order.orderData.customer_info.payment_select === 'paynow') {
                        order.orderData.cash_flow = (await new financial_service_js_1.PayNow(this.app, keyData['paynow']).confirmAndCaptureOrder(order.orderData.paynow_id)).result;
                    }
                    if (order.orderData.user_info.shipment_refer === 'paynow') {
                        const pay_now = new paynow_logistics_js_1.PayNowLogistics(this.app);
                        order.orderData.user_info.shipment_detail = await pay_now.getOrderInfo(order.cart_token);
                        const status = (() => {
                            switch (order.orderData.user_info.shipment_detail.PayNowLogisticCode) {
                                case '0000':
                                case '7101':
                                case '7201':
                                    return 'wait';
                                case '0101':
                                case '4000':
                                case '4019':
                                case '0102':
                                case '9411':
                                    return 'shipping';
                                case '0103':
                                case '4033':
                                case '4031':
                                case '4032':
                                case '4036':
                                case '4040':
                                case '5001':
                                case '8100':
                                case '8110':
                                case '8120':
                                    return 'returns';
                                case '5000':
                                    return 'arrived';
                                case '8000':
                                case '8010':
                                case '8020':
                                    return 'finish';
                            }
                        })();
                        if (status && order.orderData.progress !== status) {
                            order.orderData.progress = status;
                            await this.putOrder({
                                status: undefined,
                                orderData: order.orderData,
                                id: order.id,
                            });
                        }
                    }
                }
                catch (e) { }
            })
                .concat(obMap.map(async (order) => {
                const invoice = (await new invoice_js_1.Invoice(this.app).getInvoice({
                    page: 0,
                    limit: 1,
                    search: order.cart_token,
                    searchType: order.orderData.order_number,
                })).data[0];
                order.invoice_number = invoice && invoice.invoice_no;
            }))
                .concat(obMap.map(async (order) => {
                order.user_data = await new user_js_1.User(this.app).getUserData(order.email, 'email_or_phone');
            })));
            timer.checkPoint('finish-query-all');
            return response_data;
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
                const store_info = await new user_js_1.User(this.app).getConfigV2({
                    key: 'store-information',
                    user_id: 'manager',
                });
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
                for (const email of new Set([cartData.orderData.customer_info, cartData.orderData.user_info].map(dd => {
                    return dd && dd.email;
                }))) {
                    if (email) {
                        await auto_fcm_js_1.AutoFcm.orderChangeInfo({
                            app: this.app,
                            tag: 'payment-successful',
                            order_id: order_id,
                            phone_email: email,
                        });
                        await auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-payment-successful', order_id, email, cartData.orderData.language);
                    }
                }
                for (const phone of new Set([cartData.orderData.customer_info, cartData.orderData.user_info].map(dd => {
                    return dd && dd.phone;
                }))) {
                    let sns = new sms_js_1.SMS(this.app);
                    await sns.sendCustomerSns('auto-sns-payment-successful', order_id, phone);
                    console.info('付款成功簡訊寄送成功');
                }
                if (cartData.orderData.customer_info.lineID) {
                    let line = new line_message_1.LineMessage(this.app);
                    await line.sendCustomerLine('auto-line-payment-successful', order_id, cartData.orderData.customer_info.lineID);
                    console.info('付款成功line訊息寄送成功');
                }
                const userData = await new user_js_1.User(this.app).getUserData(cartData.email, 'account');
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
    async shareVoucherRebate(cartData) {
        const order_id = cartData.cart_token;
        const rebateClass = new rebate_js_1.Rebate(this.app);
        const userClass = new user_js_1.User(this.app);
        const userData = await userClass.getUserData(cartData.email, 'account');
        if (order_id && userData && cartData.orderData.rebate > 0) {
            for (let i = 0; i < cartData.orderData.voucherList.length; i++) {
                const orderVoucher = cartData.orderData.voucherList[i];
                const voucherRow = await database_js_1.default.query(`SELECT *
           FROM \`${this.app}\`.t_manager_post
           WHERE JSON_EXTRACT(content, '$.type') = 'voucher'
             AND id = ?;`, [orderVoucher.id]);
                if (orderVoucher.id === 0 || voucherRow[0]) {
                    const usedVoucher = await this.isUsedVoucher(userData.userID, orderVoucher.id, order_id);
                    const voucherTitle = orderVoucher.id === 0 ? orderVoucher.title : voucherRow[0].content.title;
                    const rebateEndDay = (() => {
                        try {
                            return `${voucherRow[0].content.rebateEndDay}`;
                        }
                        catch (error) {
                            return '0';
                        }
                    })();
                    if (orderVoucher.rebate_total && !usedVoucher) {
                        const cf = {
                            voucher_id: orderVoucher.id,
                            order_id: order_id,
                        };
                        if (parseInt(rebateEndDay, 10)) {
                            const date = new Date();
                            date.setDate(date.getDate() + parseInt(rebateEndDay, 10));
                            cf.deadTime = (0, moment_1.default)(date).format('YYYY-MM-DD HH:mm:ss');
                        }
                        await rebateClass.insertRebate(userData.userID, orderVoucher.rebate_total, `優惠券購物金：${voucherTitle}`, cf);
                    }
                }
            }
        }
        if (cartData.orderData.voucherList && cartData.orderData.voucherList.length > 0) {
            await this.releaseVoucherHistory(order_id, 1);
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
    async isUsedVoucher(user_id, voucher_id, order_id) {
        try {
            const history = await database_js_1.default.query(`SELECT *
         FROM \`${this.app}\`.t_rebate_point
         WHERE user_id = ?
           AND content ->>'$.order_id' = ?
           AND content->>'$.voucher_id' = ?;`, [user_id, order_id, voucher_id]);
            return history.length > 0;
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'checkOrderVoucher 錯誤: ' + error, null);
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
        var _a, _b;
        try {
            content.variants = (_a = content.variants) !== null && _a !== void 0 ? _a : [];
            content.min_price = undefined;
            content.max_price = undefined;
            content.total_sales = 0;
            if (!content.id) {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Missing product ID.', null);
            }
            const originVariants = await database_js_1.default.query(`SELECT id, product_id, content ->>'$.spec' as spec
         FROM \`${this.app}\`.t_variants
         WHERE product_id = ?`, [content.id]);
            await database_js_1.default.query(`DELETE
         FROM \`${this.app}\`.t_variants
         WHERE product_id = ?
           AND id > 0`, [content.id]);
            const _user = new user_js_1.User(this.app);
            const storeConfig = await _user.getConfigV2({ key: 'store_manager', user_id: 'manager' });
            const sourceMap = {};
            const insertPromises = content.variants.map(async (variant) => {
                var _a, _b, _c;
                content.total_sales += (_a = variant.sold_out) !== null && _a !== void 0 ? _a : 0;
                content.min_price = Math.min((_b = content.min_price) !== null && _b !== void 0 ? _b : variant.sale_price, variant.sale_price);
                content.max_price = Math.max((_c = content.max_price) !== null && _c !== void 0 ? _c : variant.sale_price, variant.sale_price);
                variant.type = 'variants';
                variant.product_id = content.id;
                variant.stockList = variant.stockList || {};
                if (variant.show_understocking === 'false') {
                    variant.stock = 0;
                    variant.stockList = {};
                }
                else if (Object.keys(variant.stockList).length === 0) {
                    variant.stockList[storeConfig.list[0].id] = { count: variant.stock };
                }
                const insertData = await database_js_1.default.query(`INSERT INTO \`${this.app}\`.t_variants
           SET ?
          `, [
                    {
                        content: JSON.stringify(variant),
                        product_id: content.id,
                    },
                ]);
                const originalVariant = originVariants.find((item) => JSON.parse(item.spec).join(',') === variant.spec.join(','));
                if (originalVariant) {
                    sourceMap[originalVariant.id] = insertData.insertId;
                }
                return insertData;
            });
            await Promise.all(insertPromises);
            const exhibitionConfig = await _user.getConfigV2({ key: 'exhibition_manager', user_id: 'manager' });
            exhibitionConfig.list = (_b = exhibitionConfig.list) !== null && _b !== void 0 ? _b : [];
            exhibitionConfig.list.forEach((exhibition) => {
                exhibition.dataList.forEach((item) => {
                    if (sourceMap[item.variantID]) {
                        item.variantID = sourceMap[item.variantID];
                    }
                });
            });
            await _user.setConfig({
                key: 'exhibition_manager',
                user_id: 'manager',
                value: exhibitionConfig,
            });
            await database_js_1.default.query(`UPDATE \`${this.app}\`.t_manager_post
         SET ?
         WHERE id = ?`, [{ content: JSON.stringify(content) }, content.id]);
        }
        catch (error) {
            console.error(error);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postVariantsAndPriceValue Error: ' + error, null);
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
    async updateVariantsForScheduled(data, scheduled_id) {
        try {
            await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_live_purchase_interactions\`
         SET ?
         WHERE id = ${scheduled_id}
        `, [
                {
                    content: JSON.stringify(data),
                },
            ]);
        }
        catch (e) {
            console.error('error -- ', e);
        }
    }
    async calcVariantsStock(calc, stock_id, product_id, spec) {
        try {
            const pd_data = (await this.getProduct({
                id: product_id,
                page: 0,
                limit: 1,
                is_manger: true,
            })).data.content;
            const variant_s = pd_data.variants.find((dd) => {
                return dd.spec.join('-') === spec.join('-');
            });
            if (pd_data.product_category === 'kitchen' && pd_data.specs && pd_data.specs.length) {
                variant_s.spec.map((d1, index) => {
                    var _a;
                    const count_s = `${(_a = pd_data.specs[index].option.find((d2) => {
                        return d2.title === d1;
                    }).stock) !== null && _a !== void 0 ? _a : ''}`;
                    if (count_s) {
                        pd_data.specs[index].option.find((d2) => {
                            return d2.title === d1;
                        }).stock = parseInt(count_s, 10) + calc;
                    }
                });
            }
            else {
                const store_config = await new user_js_1.User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' });
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
    formatDateString(isoDate) {
        const date = isoDate ? new Date(isoDate) : new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    async getCollectionProducts(tags) {
        try {
            const products_sql = `SELECT *
                            FROM \`${this.app}\`.t_manager_post
                            WHERE JSON_EXTRACT(content, '$.type') = 'product';`;
            const products = await database_js_1.default.query(products_sql, []);
            const tagArray = tags.split(',');
            return products.filter((product) => {
                return tagArray.some(tag => product.content.collection.includes(tag));
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
                return tagArray.some(tag => product.content.collection.includes(tag));
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
                hidden: Boolean(replace.hidden),
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
                const parentIndex = config.value.findIndex((col) => col.title === original.title);
                config.value[parentIndex] = Object.assign(Object.assign({}, formatData), { array: replace.subCollections.map(col => {
                        const sub = config.value[parentIndex].array.find((item) => item.title === col);
                        return Object.assign(Object.assign({}, sub), { array: [], title: col, code: sub ? sub.code : '', hidden: formatData.hidden ? true : Boolean(sub.hidden) });
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
                const filter_childrens = original.subCollections.filter(child => {
                    return replace.subCollections.findIndex(child2 => child2 === child) === -1;
                });
                await this.deleteCollectionProduct(original.title, filter_childrens);
            }
            if (original.title.length > 0) {
                const delete_id_list = ((_d = original.product_id) !== null && _d !== void 0 ? _d : []).filter(oid => {
                    var _a;
                    return ((_a = replace.product_id) !== null && _a !== void 0 ? _a : []).findIndex(rid => rid === oid) === -1;
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
            for (const id of (_e = replace.product_id) !== null && _e !== void 0 ? _e : []) {
                const get_product = await database_js_1.default.query(`SELECT *
           FROM \`${this.app}\`.t_manager_post
           WHERE id = ?
          `, [id]);
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
            await database_js_1.default.execute(`UPDATE \`${this.app}\`.public_config
         SET value = ?
         WHERE \`key\` = 'collection';
        `, [config.value]);
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
                    config.value = data.map(item => {
                        return config.value.find((conf) => conf.title === item.title);
                    });
                }
                else {
                    const index = config.value.findIndex((conf) => conf.title === parentTitle);
                    const sortList = data.map(item => {
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
        const propertiesToParse = ['stock', 'product_id', 'sale_price', 'compare_price', 'shipment_weight'];
        variants.forEach(variant => {
            propertiesToParse.forEach(prop => {
                if (variant[prop] != null) {
                    variant[prop] = parseInt(variant[prop], 10);
                }
            });
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
        collection = Array.from(new Set(collection.map(dd => {
            return dd.replace(/\s*\/\s*/g, '/');
        })));
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
            let node = nodes.find(n => n.title === title);
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
            categories.forEach(category => {
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
                return new Promise(async (resolve) => {
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
                                og_content.language_data[store_info.language_setting.def].sub_title = product.sub_title;
                            }
                            product = Object.assign(Object.assign({}, og_content), product);
                            product.preview_image = og_data['content'].preview_image || [];
                            productArray[index] = product;
                        }
                        else {
                            console.error('Product id not exist:', product);
                        }
                    }
                    else {
                        console.error('Product has not id:', product);
                    }
                    resolve(true);
                });
            }));
            async function getNextId(app) {
                var _a, _b;
                const query = `SELECT MAX(id) AS max_id
                       FROM \`${app}\`.t_manager_post`;
                try {
                    const result = await database_js_1.default.query(query, []);
                    const maxId = (_b = (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a.max_id) !== null && _b !== void 0 ? _b : 0;
                    return maxId + 1;
                }
                catch (error) {
                    console.error('取得最大 ID 時發生錯誤:', error);
                    return 1;
                }
            }
            let max_id = await getNextId(this.app);
            productArray.map((product) => {
                var _a;
                if (!product.id) {
                    product.id = max_id++;
                }
                product.type = 'product';
                this.checkVariantDataType(product.variants);
                return [product.id || null, (_a = this.token) === null || _a === void 0 ? void 0 : _a.userID, JSON.stringify(product)];
            });
            if (productArray.length) {
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
                await new Shopping(this.app, this.token).promisesProducts(productArray, insertIDStart);
                return insertIDStart;
            }
            else {
                return -1;
            }
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMulProduct Error:' + e, null);
        }
    }
    async promisesProducts(productArray, insertIDStart) {
        const promises = productArray.map((product) => {
            product.id = product.id || insertIDStart++;
            return new Shopping(this.app, this.token).postVariantsAndPriceValue(product);
        });
        await Promise.all(promises);
    }
    async putProduct(content) {
        var _a, _b, _c;
        try {
            content.type = 'product';
            if (content.language_data) {
                const language = await app_js_1.App.getSupportLanguage(this.app);
                for (const b of language) {
                    const find_conflict = await database_js_1.default.query(`SELECT count(1)
           FROM \`${this.app}\`.t_manager_post
           WHERE content ->>'$.language_data."${b}".seo.domain'='${decodeURIComponent(content.language_data[b].seo.domain)}'
             AND id != ${content.id}`, []);
                    if (find_conflict[0]['count(1)'] > 0) {
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'DOMAIN ALREADY EXISTS:', {
                            message: '網域已被使用',
                            code: '733',
                        });
                    }
                }
            }
            this.checkVariantDataType(content.variants);
            await Promise.all([
                this.setProductCustomizeTagConifg((_a = content.product_customize_tag) !== null && _a !== void 0 ? _a : []),
                this.setProductGeneralTagConifg((_c = (_b = content.product_tag) === null || _b === void 0 ? void 0 : _b.language) !== null && _c !== void 0 ? _c : []),
            ]);
            await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_manager_post\` SET ? WHERE id = ?
        `, [
                {
                    content: JSON.stringify(content),
                },
                content.id,
            ]);
            await new Shopping(this.app, this.token).postVariantsAndPriceValue(content);
            if (content.shopee_id) {
                await new shopee_1.Shopee(this.app, this.token).asyncStockToShopee({
                    product: {
                        content: content,
                    },
                    callback: () => { },
                });
            }
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
            dataArray.map(data => {
                var _a;
                const parentTitles = (_a = data.parentTitles[0]) !== null && _a !== void 0 ? _a : '';
                if (parentTitles.length > 0) {
                    const parentIndex = config.value.findIndex((col) => col.title === parentTitles);
                    const childrenIndex = config.value[parentIndex].array.findIndex((col) => col.title === data.title);
                    const n = deleteList.findIndex(obj => obj.parent === parentIndex);
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
            deleteList.map(obj => {
                config.value[obj.parent].array = config.value[obj.parent].array.filter((col, index) => {
                    return !obj.child.includes(index);
                });
            });
            config.value = config.value.filter((col, index) => {
                const find_collection = deleteList.find(obj => obj.parent === index);
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
    static isComeStore(checkout, qData) {
        try {
            return checkout.pos_info.where_store === qData.come_from;
        }
        catch (error) {
            return false;
        }
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
    async getProductVariants(id_list) {
        try {
            const data = await this.querySqlByVariants([`(v.id in (${id_list}))`], { page: 0, limit: 999 });
            return data;
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getProductVariants Error:' + express_1.default, null);
        }
    }
    async getVariants(query) {
        var _a, _b, _c;
        try {
            let querySql = ['1=1'];
            if (query.search) {
                switch (query.searchType) {
                    case 'title':
                        querySql.push(`v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(p.content, '$.title'))) LIKE UPPER('%${query.search}%')))`);
                        break;
                    case 'sku':
                        querySql.push(`(UPPER(JSON_EXTRACT(v.content, '$.sku')) LIKE UPPER('%${query.search}%'))`);
                        break;
                    case 'barcode':
                        querySql.push(`(UPPER(JSON_EXTRACT(v.content, '$.barcode')) LIKE UPPER('%${query.search}%'))`);
                        break;
                }
            }
            query.id && querySql.push(`(v.id = ${query.id})`);
            if (query.id_list) {
                if ((_a = query.id_list) === null || _a === void 0 ? void 0 : _a.includes('-')) {
                    querySql.push(`(v.product_id in (${query.id_list.split(',').map(dd => {
                        return dd.split('-')[0];
                    })}))`);
                }
                else {
                    querySql.push(`(v.id in (${query.id_list}))`);
                }
            }
            query.collection &&
                querySql.push(`(${query.collection
                    .split(',')
                    .map(dd => {
                    return query.accurate_search_collection
                        ? `
                        v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (JSON_CONTAINS(p.content->'$.collection', '"${dd}"')))
                        
                        `
                        : `
                         v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (JSON_EXTRACT(p.content, '$.collection') LIKE '%${dd}%'))
                        `;
                })
                    .join(' or ')})`);
            query.status &&
                querySql.push(`
             v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (JSON_EXTRACT(p.content, '$.status') = '${query.status}'))
            `);
            query.min_price && querySql.push(`(v.content->>'$.sale_price' >= ${query.min_price})`);
            query.max_price && querySql.push(`(v.content->>'$.sale_price' <= ${query.min_price})`);
            if (query.productType !== 'all') {
                const queryOR = [];
                if (query.productType) {
                    query.productType.split(',').map(dd => {
                        if (dd === 'hidden') {
                            queryOR.push(` v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (p.content->>'$.visible' = "false"))`);
                        }
                        else {
                            queryOR.push(`v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (p.content->>'$.productType.${dd}' = "true"))`);
                        }
                    });
                }
                else if (!query.id) {
                    queryOR.push(`v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (p.content->>'$.productType.product' = "true"))`);
                }
                querySql.push(`(${queryOR
                    .map(dd => {
                    return ` ${dd} `;
                })
                    .join(' or ')})`);
            }
            if (query.stockCount) {
                const stockCount = (_b = query.stockCount) === null || _b === void 0 ? void 0 : _b.split(',');
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
                    case 'max_price':
                        return `order by v->>'$.content.sale_price' desc`;
                    case 'min_price':
                        return `order by v->>'$.content.sale_price' asc`;
                    case 'stock_desc':
                        return `order by stock desc`;
                    case 'stock_asc':
                        return `order by stock`;
                    case 'default':
                    default:
                        return `order by id desc`;
                }
            })();
            const userClass = new user_js_1.User(this.app);
            const store_config = await userClass.getConfigV2({
                key: 'store_manager',
                user_id: 'manager',
            });
            const data = await this.querySqlByVariants(querySql, query);
            if (query.id_list) {
                if ((_c = query.id_list) === null || _c === void 0 ? void 0 : _c.includes('-')) {
                    data.data = data.data.filter((dd) => {
                        var _a;
                        return (_a = query.id_list) === null || _a === void 0 ? void 0 : _a.split(',').find(d1 => {
                            return d1 === [dd.product_id, ...dd.variant_content.spec].join('-');
                        });
                    });
                }
            }
            const shopee_data_list = [];
            await Promise.all(data.data.map((v_c) => {
                const product = v_c['product_content'];
                return new Promise(async (resolve, reject) => {
                    if (product) {
                        let totalSale = 0;
                        const content = product;
                        if (content.shopee_id) {
                            let shopee_dd = shopee_data_list.find(dd => {
                                return dd.id === content.shopee_id;
                            });
                            if (!shopee_dd) {
                                shopee_dd = {
                                    id: content.shopee_id,
                                    data: await new shopee_1.Shopee(this.app, this.token).getProductDetail(content.shopee_id, {
                                        skip_image_load: true,
                                    }),
                                };
                                shopee_data_list.push(shopee_dd);
                            }
                            const shopee_data = shopee_dd.data;
                            if (shopee_data && shopee_data.variants) {
                                const variant = v_c['variant_content'];
                                const shopee_variants = shopee_data.variants.find((dd) => {
                                    return dd.spec.join('') === variant.spec.join('');
                                });
                                if (shopee_variants) {
                                    variant.stock = shopee_variants.stock;
                                    variant.stockList = {};
                                    variant.stockList[store_config.list[0].id] = { count: variant.stock };
                                }
                                const p_ind = product.variants.findIndex((dd) => {
                                    return dd.spec.join('') === variant.spec.join('');
                                });
                                product.variants[p_ind] = variant;
                                v_c['stockList'] = v_c['variant_content']['stockList'];
                            }
                        }
                        product.total_sales = totalSale;
                    }
                    resolve(true);
                });
            }));
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
                    `JSON_EXTRACT(content, '$.product_customize_tag') LIKE '%${query.search}%'`,
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
                let variants = (await database_js_1.default.query(`SELECT *
           FROM \`${this.app}\`.t_variants
           WHERE product_id = ?`, [data.product_id])).map((dd) => {
                    return dd.content;
                });
                data.product_content.variants = variants;
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
        const invoice_response = await new invoice_js_1.Invoice(this.app).postCheckoutInvoice(obj.orderID, false);
        return {
            result: invoice_response,
        };
    }
    async batchPostCustomerInvoice(dataArray) {
        let result = [];
        const chunk = 10;
        const chunksCount = Math.ceil(dataArray.length / chunk);
        for (let i = 0; i < chunksCount; i++) {
            const arr = dataArray.slice(i * chunk, (i + 1) * chunk);
            const res = await Promise.all(arr.map(item => {
                return this.postCustomerInvoice(item);
            }));
            result = result.concat(res);
        }
        return result;
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
        Object.keys(data).map(dd => {
            data[dd] = data[dd] / base_m;
        });
        return data;
    }
    async getProductComment(product_id) {
        try {
            const comments = await database_js_1.default.query(`SELECT *
         FROM \`${this.app}\`.t_product_comment
         WHERE product_id = ?;
        `, [product_id]);
            if (comments.length === 0) {
                return [];
            }
            return comments.map((item) => item.content);
        }
        catch (error) {
            console.error(error);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getProductComment Error:' + error, null);
        }
    }
    async postProductComment(data) {
        try {
            if (!this.token) {
                throw new Error('User not authenticated.');
            }
            const { product_id, rate, title, comment } = data;
            const today = new Date().toISOString().split('T')[0];
            const userClass = new user_js_1.User(this.app);
            const userData = await userClass.getUserData(`${this.token.userID}`, 'userID');
            const content = {
                userID: this.token.userID,
                userName: userData.userData.name,
                date: today,
                rate,
                title,
                comment,
            };
            const updateResult = await database_js_1.default.query(`delete
         from \`${this.app}\`.t_product_comment
         WHERE product_id = ${product_id}
           AND content ->>'$.userID'=${this.token.userID}
           and id
             >0`, []);
            await database_js_1.default.execute(`INSERT INTO \`${this.app}\`.t_product_comment (product_id, content)
         VALUES (?, ?)`, [product_id, JSON.stringify(content)]);
            await this.updateProductAvgRate(product_id);
            return true;
        }
        catch (error) {
            console.error(`Error posting product comment:`, error);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', `postProductComment Error: ${error}`, null);
        }
    }
    async updateProductAvgRate(product_id) {
        var _a;
        try {
            const [result] = await database_js_1.default.query(`SELECT COALESCE(ROUND(AVG(JSON_EXTRACT(content, '$.rate')), 1), 0) AS avgRate
         FROM \`${this.app}\`.t_product_comment
         WHERE product_id = ?`, [product_id]);
            const avg_rate = (_a = result === null || result === void 0 ? void 0 : result.avgRate) !== null && _a !== void 0 ? _a : 0;
            const updateResult = await database_js_1.default.execute(`UPDATE \`${this.app}\`.t_manager_post
         SET content = JSON_SET(content, '$.avg_rate', ?)
         WHERE id = ?`, [avg_rate, product_id]);
            if (updateResult.affectedRows === 0) {
                throw new Error(`Product with ID ${product_id} not found.`);
            }
            return { product_id, avg_rate };
        }
        catch (error) {
            console.error(`Error updating average rate for product ID ${product_id}:`, error);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', `updateProductAvgRate Error: ${error}`, null);
        }
    }
}
exports.Shopping = Shopping;
//# sourceMappingURL=shopping.js.map
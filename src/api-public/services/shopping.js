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
class Shopping {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async getProduct(query) {
        var _a, _b, _c, _d, _e, _f;
        try {
            const start = new Date().getTime();
            const userClass = new user_js_1.User(this.app);
            const userID = (_a = query.setUserID) !== null && _a !== void 0 ? _a : (this.token ? `${this.token.userID}` : '');
            const store_info = await userClass.getConfigV2({
                key: 'store-information',
                user_id: 'manager',
            });
            const store_config = await userClass.getConfigV2({
                key: 'store_manager',
                user_id: 'manager',
            });
            const exh_config = await userClass.getConfigV2({
                key: 'exhibition_manager',
                user_id: 'manager',
            });
            const querySql = [`(content->>'$.type'='product')`];
            query.language = (_b = query.language) !== null && _b !== void 0 ? _b : store_info.language_setting.def;
            query.show_hidden = (_c = query.show_hidden) !== null && _c !== void 0 ? _c : 'true';
            const orderMapping = {
                title: `ORDER BY JSON_EXTRACT(content, '$.title')`,
                max_price: `ORDER BY CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.max_price')) AS SIGNED) DESC`,
                min_price: `ORDER BY CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.min_price')) AS SIGNED) ASC`,
                created_time_desc: `ORDER BY created_time DESC`,
                created_time_asc: `ORDER BY created_time ASC`,
                updated_time_desc: `ORDER BY updated_time DESC`,
                updated_time_asc: `ORDER BY updated_time ASC`,
                sales_desc: `ORDER BY content->>'$.total_sales' DESC`,
                default: `ORDER BY id DESC`,
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
                    querySql.push(`(${sqlJoinSearch.map((condition) => `(${condition})`).join(' OR ')})`);
                }
                query.order_by = `ORDER BY CASE 
    WHEN content->>'$.language_data."zh-TW".seo.domain' = '${decodedDomain}'  THEN 1
    ELSE 2
  END`;
            }
            if (query.id) {
                const ids = `${query.id}`
                    .split(',')
                    .map((id) => id.trim())
                    .filter((id) => id);
                if (ids.length > 1) {
                    querySql.push(`id IN (${ids.map((id) => `'${id}'`).join(',')})`);
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
            console.log(`is_manger=>`, query.is_manger);
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
                querySql.push(`(${query.collection
                    .split(',')
                    .map((dd) => {
                    return query.accurate_search_collection ? `(JSON_CONTAINS(content->'$.collection', '"${dd}"'))` : `(JSON_EXTRACT(content, '$.collection') LIKE '%${dd}%')`;
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
                query.order_by = ` order by id in (${query.id_list})`;
            }
            if (!query.is_manger && !query.status) {
                query.status = 'inRange';
            }
            if (query.status) {
                const statusSplit = query.status.split(',').map((status) => status.trim());
                const statusJoin = statusSplit.map((status) => `"${status}"`).join(',');
                const statusCondition = `JSON_EXTRACT(content, '$.status') IN (${statusJoin})`;
                const currentDate = database_js_1.default.escape(new Date().toISOString());
                const scheduleConditions = statusSplit
                    .map((status) => {
                    switch (status) {
                        case 'inRange':
                            return `
                                OR (
                                    JSON_EXTRACT(content, '$.status') IN ('active', 1)
                                    AND (
                                        content->>'$.active_schedule' IS NULL OR (
                                            (
                                                CONCAT(content->>'$.active_schedule.start_ISO_Date') IS NULL OR
                                                CONCAT(content->>'$.active_schedule.start_ISO_Date') <= ${currentDate}
                                            )
                                            AND (
                                                CONCAT(content->>'$.active_schedule.end_ISO_Date') IS NULL OR
                                                CONCAT(content->>'$.active_schedule.end_ISO_Date') >= ${currentDate}
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
                        querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants 
                        where id in (${exh.dataList.map((d) => d.variantID).join(',')})))`);
                    }
                }
                else {
                    const channelSplit = query.channel.split(',').map((channel) => channel.trim());
                    const channelJoin = channelSplit.map((channel) => {
                        return `OR JSON_CONTAINS(content->>'$.channel', '"${channel}"')`;
                    });
                    querySql.push(`(content->>'$.channel' IS NULL ${channelJoin})`);
                }
            }
            if (query.id_list) {
                querySql.push(`(id in (${query.id_list}))`);
            }
            if (query.min_price) {
                querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price' >= ${query.min_price}))`);
            }
            if (query.max_price) {
                querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price' <= ${query.max_price}))`);
            }
            const products = await this.querySql(querySql, query);
            const productList = (Array.isArray(products.data) ? products.data : [products.data]).filter((product) => product);
            if (userID !== '') {
                for (const b of productList) {
                    b.content.in_wish_list =
                        (await database_js_1.default.query(`SELECT count(1)
                                 FROM \`${this.app}\`.t_post
                                 WHERE (content ->>'$.type'='wishlist')
                                   and userID = ${userID}
                                   and (content ->>'$.product_id'=${b.id})`, []))[0]['count(1)'] == '1';
                    b.content.id = b.id;
                }
            }
            if (query.id_list) {
                const idSet = new Set(query.id_list
                    .split(',')
                    .map((id) => id.trim())
                    .filter(Boolean));
                products.data = products.data.filter((product) => idSet.has(`${product.id}`));
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
            console.log(`get-product-sql-finish`, (new Date().getTime() - start) / 1000);
            await Promise.all((Array.isArray(products.data) ? products.data : [products.data]).map((product) => {
                return new Promise(async (resolve, reject) => {
                    var _a, _b;
                    if (product) {
                        let totalSale = 0;
                        const { language } = query;
                        const { content } = product;
                        content.preview_image = (_a = content.preview_image) !== null && _a !== void 0 ? _a : [];
                        if (language && ((_b = content === null || content === void 0 ? void 0 : content.language_data) === null || _b === void 0 ? void 0 : _b[language])) {
                            const langData = content.language_data[language];
                            if ((langData.preview_image && langData.preview_image.length === 0) || (!langData.preview_image)) {
                                if (content.preview_image.length) {
                                    langData.preview_image = content.preview_image;
                                }
                                else {
                                    langData.preview_image = ['https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg'];
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
                        if ((content.preview_image && content.preview_image.length === 0) || (!content.preview_image)) {
                            content.preview_image = ['https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg'];
                        }
                        content.min_price = Infinity;
                        content.max_price = Number.MIN_VALUE;
                        (content.variants || []).forEach((variant) => {
                            var _a;
                            variant.stock = 0;
                            variant.sold_out = variant.sold_out || 0;
                            if (!variant.preview_image.includes('https://')) {
                                variant.preview_image = undefined;
                            }
                            variant.preview_image = variant[`preview_image_${language}`] || variant.preview_image || 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';
                            if (content.min_price > variant.sale_price) {
                                console.log(`content.min_price=>`, variant.sale_price);
                                content.min_price = variant.sale_price;
                            }
                            if (content.max_price < variant.sale_price) {
                                content.max_price = variant.sale_price;
                            }
                            if (variant.preview_image === 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg') {
                                variant.preview_image = (_a = content.preview_image) === null || _a === void 0 ? void 0 : _a[0];
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
                        if (content.shopee_id && !query.skip_shopee_check) {
                            const shopee_data = await new shopee_1.Shopee(this.app, this.token).getProductDetail(content.shopee_id, {
                                skip_image_load: true,
                            });
                            if (shopee_data && shopee_data.variants) {
                                console.log(`get-shopee_data-success`);
                                (content.variants || []).forEach((variant) => {
                                    const shopee_variants = shopee_data.variants.find((dd) => {
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
            console.log(`get-product-shopee-finish`, (new Date().getTime() - start) / 1000);
            if (query.domain && products.data.length > 0) {
                const decodedDomain = decodeURIComponent(query.domain);
                const foundProduct = products.data.find((dd) => {
                    var _a, _b;
                    if (!query.language) {
                        return false;
                    }
                    const languageData = (_b = (_a = dd.content.language_data) === null || _a === void 0 ? void 0 : _a[query.language]) === null || _b === void 0 ? void 0 : _b.seo;
                    const seoData = dd.content.seo;
                    return (languageData && languageData.domain === decodedDomain) || (seoData && seoData.domain === decodedDomain);
                });
                products.data = foundProduct || products.data[0];
            }
            if ((query.domain || query.id) && products.data !== undefined) {
                products.data.json_ld = await seo_config_js_1.SeoConfig.getProductJsonLd(this.app, products.data.content);
            }
            const viewSource = (_d = query.view_source) !== null && _d !== void 0 ? _d : 'normal';
            const distributionCode = (_e = query.distribution_code) !== null && _e !== void 0 ? _e : '';
            const userData = (_f = (await userClass.getUserData(userID, 'userID'))) !== null && _f !== void 0 ? _f : { userID: -1 };
            const allVoucher = await this.getAllUseVoucher(userData.userID);
            const recommendData = await this.getDistributionRecommend(distributionCode);
            console.log(`get-product-voucher-finish`, (new Date().getTime() - start) / 1000);
            const getPrice = (priceMap, key, specKey) => {
                var _a;
                return (_a = priceMap[key]) === null || _a === void 0 ? void 0 : _a.get(specKey);
            };
            const processProduct = async (product) => {
                const createPriceMap = (type) => {
                    return Object.fromEntries(product.content.multi_sale_price.filter((item) => item.type === type).map((item) => [item.key, new Map(item.variants.map((v) => [v.spec.join('-'), v.price]))]));
                };
                product.content.about_vouchers = await this.aboutProductVoucher({
                    product,
                    userID,
                    viewSource,
                    allVoucher,
                    recommendData,
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
                    var _a, _b;
                    const vPriceList = [pv.sale_price];
                    if ((_a = product.content.multi_sale_price) === null || _a === void 0 ? void 0 : _a.length) {
                        const storeMaps = createPriceMap('store');
                        const levelMaps = createPriceMap('level');
                        const specKey = pv.spec.join('-');
                        if (query.whereStore) {
                            const storePrice = getPrice(storeMaps, query.whereStore, specKey);
                            storePrice && vPriceList.push(storePrice);
                        }
                        if ((_b = userData === null || userData === void 0 ? void 0 : userData.member_level) === null || _b === void 0 ? void 0 : _b.id) {
                            const levelPrice = getPrice(levelMaps, userData.member_level.id, specKey);
                            levelPrice && vPriceList.push(levelPrice);
                        }
                    }
                    pv.origin_price = parseInt(`${pv.compare_price || pv.sale_price}`, 10);
                    pv.sale_price = Math.min(...vPriceList);
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
                if (product.content.product_category === 'kitchen' && (product.content.variants.length > 1)) {
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
            if (products.total && products.data) {
                if (!Array.isArray(products.data)) {
                    products.data.total = 1;
                    await processProduct(products.data);
                }
                else {
                    await Promise.all(products.data.map(processProduct));
                }
            }
            else if (typeof products.data === 'object' && products.data.id) {
                await processProduct(products.data);
            }
            return products;
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
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
            const endDate = dd.end_ISO_Date ? new Date(dd.end_ISO_Date) : dd.endDate ? new Date(`${dd.endDate} ${dd.endTime}`) : null;
            const isActive = startDate.getTime() < Date.now() && (!endDate || endDate.getTime() > Date.now());
            return isCode && isActive;
        });
        return recommendData;
    }
    async aboutProductVoucher(json) {
        const id = `${json.product.id}`;
        const collection = json.product.content.collection || [];
        const userData = json.userData;
        const recommendData = json.recommendData;
        function checkValidProduct(caseName, caseList) {
            switch (caseName) {
                case 'collection':
                    return caseList.some((d1) => collection.includes(d1));
                case 'product':
                    return caseList.some((item) => `${item}` === `${id}`);
                case 'all':
                    return true;
                default:
                    return false;
            }
        }
        const voucherList = json.allVoucher
            .filter((dd) => {
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
            .filter((dd) => {
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
            .filter((dd) => {
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
                          CAST(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) as stock,
                          JSON_EXTRACT(v.content, '$.stockList')               as stockList
                   from (\`${this.app}\`.t_variants as v)
                   where product_id  in (select id
                                            from \`${this.app}\`.t_manager_post
                                            where ((content ->>'$.product_category' is null) or
                                                   (content ->>'$.product_category' != 'kitchen'))) and ${querySql.join(' and ')} ${query.order_by || `order by id desc`}`;
        query.limit = query.limit && query.limit > 999 ? 999 : query.limit;
        const limitSQL = `limit ${query.page * query.limit} , ${query.limit}`;
        if (query.id) {
            const data = (await database_js_1.default.query(`SELECT *
                     FROM (${sql}) as subqyery ${limitSQL}
                    `, []))[0];
            data.product_content = (await database_js_1.default.query(`select * from \`${this.app}\`.t_manager_post where id = ${data.product_id}`, []))[0]['content'];
            return { data: data, result: !!data };
        }
        else {
            const vData = await database_js_1.default.query(`SELECT *
                     FROM (${sql}) as subqyery ${limitSQL}
                    `, []);
            await Promise.all(vData.map(async (data) => {
                data.product_content = (await database_js_1.default.query(`select * from \`${this.app}\`.t_manager_post where id = ${data.product_id}`, []))[0]['content'];
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
    async toCheckout(data, type = 'add', replace_order_id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const check_time = new Date().getTime();
        try {
            data.line_items = (_a = (data.line_items || data.lineItems)) !== null && _a !== void 0 ? _a : [];
            data.isExhibition = data.checkOutType === 'POS' && ((_b = data.pos_store) === null || _b === void 0 ? void 0 : _b.includes('exhibition_'));
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
                const order = (await database_js_1.default.query(`SELECT *
                         FROM \`${this.app}\`.t_checkout
                         WHERE cart_token = ?`, [data.order_id]))[0];
                if (order) {
                    for (const b of order.orderData.lineItems) {
                        console.log('1 getProduct');
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
                        await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_manager_post\`
                             SET content = ?
                             WHERE id = ?
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
                if (type === 'preview' && !((token === null || token === void 0 ? void 0 : token.userID) || (data.user_info && data.user_info.email))) {
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
                data.email = ((_c = data.user_info) === null || _c === void 0 ? void 0 : _c.email) || 'no-email';
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
            shipment_setting.custom_delivery = (_d = shipment_setting.custom_delivery) !== null && _d !== void 0 ? _d : [];
            for (const form of shipment_setting.custom_delivery) {
                form.form =
                    (await new user_js_1.User(this.app).getConfigV2({
                        user_id: 'manager',
                        key: `form_delivery_${form.id}`,
                    })).list || [];
            }
            shipment_setting.support = (_e = shipment_setting.support) !== null && _e !== void 0 ? _e : [];
            shipment_setting.info =
                (_f = (shipment_setting.language_data && shipment_setting.language_data[data.language] && shipment_setting.language_data[data.language].info)) !== null && _f !== void 0 ? _f : shipment_setting.info;
            console.log(`checkout-time-06=>`, new Date().getTime() - check_time);
            const carData = {
                customer_info: data.customer_info || {},
                lineItems: [],
                total: 0,
                email: (_g = data.email) !== null && _g !== void 0 ? _g : ((data.user_info && data.user_info.email) || ''),
                user_info: data.user_info,
                shipment_fee: 0,
                rebate: 0,
                goodsWeight: 0,
                use_rebate: data.use_rebate || 0,
                orderID: data.order_id || `${new Date().getTime()}`,
                shipment_support: shipment_setting.support,
                shipment_info: shipment_setting.info,
                shipment_selector: shipment_config_js_1.ShipmentConfig.list.map((dd) => {
                    return {
                        name: dd.title,
                        value: dd.value
                    };
                })
                    .concat(((_h = shipment_setting.custom_delivery) !== null && _h !== void 0 ? _h : []).map((dd) => {
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
                client_ip_address: data.client_ip_address,
                fbc: data.fbc,
                fbp: data.fbp
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
                        channel: data.checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
                        whereStore: data.checkOutType === 'POS' ? data.pos_store : undefined,
                        setUserID: `${(userData === null || userData === void 0 ? void 0 : userData.userID) || ''}`
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
                            if (isPOS && isUnderstockingVisible && !data.isExhibition) {
                                variant.stock = ((_k = (_j = variant.stockList) === null || _j === void 0 ? void 0 : _j[data.pos_store]) === null || _k === void 0 ? void 0 : _k.count) || 0;
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
                                    product_category: pd.product_category,
                                    preview_image: variant.preview_image || pd.preview_image[0],
                                    title: pd.title,
                                    sale_price: variant.sale_price,
                                    origin_price: variant.origin_price,
                                    collection: pd.collection,
                                    sku: variant.sku,
                                    stock: variant.stock,
                                    show_understocking: variant.show_understocking,
                                    stockList: variant.stockList,
                                    weight: parseInt(variant.weight || '0', 10),
                                    designated_logistics: (_l = pd.designated_logistics) !== null && _l !== void 0 ? _l : { type: 'all', list: [] },
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
                                    if (data.isExhibition) {
                                        if (data.pos_store) {
                                            await this.updateExhibitionActiveStock(data.pos_store, variant.variant_id, b.count);
                                        }
                                    }
                                    else {
                                        variant.deduction_log = { [data.pos_store]: b.count };
                                        variant.stockList[data.pos_store].count -= b.count;
                                        b.deduction_log = variant.deduction_log;
                                    }
                                }
                                else {
                                    const returnData = new stock_1.Stock(this.app, this.token).allocateStock(variant.stockList, b.count);
                                    variant.deduction_log = returnData.deductionLog;
                                    b.deduction_log = returnData.deductionLog;
                                }
                                saveStockArray.push(() => {
                                    return new Promise(async (resolve, reject) => {
                                        try {
                                            if (pd.shopee_id) {
                                                await new shopee_1.Shopee(this.app, this.token).asyncStockToShopee({
                                                    product: pdDqlData,
                                                    callback: () => {
                                                    },
                                                });
                                            }
                                            if (pd.product_category === 'kitchen' && (variant.spec && variant.spec.length)) {
                                                variant.spec.map((d1, index) => {
                                                    var _a;
                                                    const count_s = `${(_a = pd.specs[index].option.find((d2) => {
                                                        return d2.title === d1;
                                                    }).stock) !== null && _a !== void 0 ? _a : ''}`;
                                                    if (count_s) {
                                                        pd.specs[index].option.find((d2) => {
                                                            return d2.title === d1;
                                                        }).stock = parseInt(count_s, 10) - b.count;
                                                    }
                                                });
                                                const store_config = await userClass.getConfigV2({
                                                    key: 'store_manager',
                                                    user_id: 'manager',
                                                });
                                                b.deduction_log = {};
                                                b.deduction_log[store_config.list[0].id] = b.count;
                                                console.log(`b.deduction_log==>`, b.deduction_log);
                                            }
                                            else {
                                                await this.updateVariantsWithSpec(variant, b.id, b.spec);
                                            }
                                            await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_manager_post\`
                                                 SET ?
                                                 WHERE id = ${pdDqlData.id}
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
                    catch (e) {
                    }
                });
                await this.checkVoucher(carData);
                console.log(`checkout-time-check-voucher-2=>`, new Date().getTime() - check_time);
                let can_add_gift = [];
                (_m = carData.voucherList) === null || _m === void 0 ? void 0 : _m.filter((dd) => dd.reBackType === 'giveaway').forEach((dd) => can_add_gift.push(dd.add_on_products));
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
                    for (const b of (_o = dd.add_on_products) !== null && _o !== void 0 ? _o : []) {
                        index++;
                        console.log('3 getProduct');
                        const pdDqlData = ((_p = (await this.getProduct({
                            page: 0,
                            limit: 50,
                            id: `${b}`,
                            status: 'inRange',
                            channel: data.checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
                            whereStore: data.checkOutType === 'POS' ? data.pos_store : undefined,
                        })).data) !== null && _p !== void 0 ? _p : { content: {} }).content;
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
                    productOffStart: 'price_all'
                };
                carData.discount = data.discount;
                carData.voucherList = [tempVoucher];
                carData.customer_info = data.customer_info;
                carData.total = (_q = data.total) !== null && _q !== void 0 ? _q : 0;
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
                        manualVoucher.discount = (_r = manualVoucher.discount_total) !== null && _r !== void 0 ? _r : 0;
                        carData.total -= manualVoucher.discount;
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
                await new Shopping(this.app).releaseCheckout((_s = data.pay_status) !== null && _s !== void 0 ? _s : 0, carData.orderID);
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
                await order_event_js_1.OrderEvent.insertOrder({
                    cartData: carData,
                    status: 1,
                    app: this.app
                });
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
                let kd = (_t = keyData[carData.customer_info.payment_select]) !== null && _t !== void 0 ? _t : {
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
                    case 'paynow': {
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}&paynow=true`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&paynow=true&type=paynow`;
                        await Promise.all(saveStockArray.map((dd) => {
                            return dd();
                        }));
                        return await new financial_service_js_1.PayNow(this.app, kd).createOrder(carData);
                    }
                    case 'jkopay': {
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&jkopay=true&orderid=${carData.orderID}`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&jkopay=true`;
                        return await new financial_service_js_1.JKO(this.app, kd).createOrder(carData);
                        break;
                    }
                    default:
                        carData.method = 'off_line';
                        await order_event_js_1.OrderEvent.insertOrder({
                            cartData: carData,
                            status: 0,
                            app: this.app
                        });
                        await Promise.all(saveStockArray.map((dd) => {
                            return dd();
                        }));
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
                        await this.releaseVoucherHistory(carData.orderID, 1);
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
    async combineOrder(dataMap) {
        try {
            delete dataMap.token;
            for (const data of Object.values(dataMap)) {
                if (data.orders.length === 0)
                    continue;
                const cartTokens = data.orders.map((order) => order.cart_token);
                const placeholders = cartTokens.map(() => '?').join(',');
                const orders = await database_js_1.default.query(`SELECT *
                     FROM \`${this.app}\`.t_checkout
                     WHERE cart_token IN (${placeholders});`, cartTokens);
                const targetOrder = orders.find((order) => order.cart_token === data.targetID);
                const feedsOrder = orders.filter((order) => order.cart_token !== data.targetID);
                if (!targetOrder)
                    continue;
                const formatTargetOrder = JSON.parse(JSON.stringify(targetOrder));
                const base = formatTargetOrder.orderData;
                base.orderSource = 'combine';
                const accumulateValues = (feed, keys, operation) => {
                    keys.forEach((key) => {
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
                    if (formatTargetOrder.status === 0 && !base.proof_purchase && base.customer_info.payment_select !== 'cash_on_delivery') {
                        base.total -= feed.shipment_fee;
                    }
                    else {
                        base.shipment_fee += feed.shipment_fee;
                    }
                };
                feedsOrder.forEach((order) => mergeOrders(order.orderData));
                const newCartToken = `${Date.now()}`;
                await database_js_1.default.execute(`INSERT INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                     VALUES (?, ?, ?, ?)`, [newCartToken, targetOrder.status, targetOrder.email, JSON.stringify(base)]);
                await Promise.all(orders.map(async (order) => {
                    order.orderData.orderStatus = '-1';
                    order.orderData.archived = 'true';
                    return database_js_1.default.query(`UPDATE \`${this.app}\`.t_checkout
                             SET orderData = ?
                             WHERE cart_token = ?`, [JSON.stringify(order.orderData), order.cart_token]);
                }));
            }
            return true;
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'combineOrder Error:' + e, null);
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
        cart.discount = 0;
        cart.lineItems.map((dd) => {
            dd.discount_price = 0;
            dd.rebate = 0;
        });
        function switchValidProduct(caseName, caseList, caseOffStart) {
            const filterItems = cart.lineItems.filter((dp) => {
                switch (caseName) {
                    case 'collection':
                        return dp.collection.some((d2) => caseList.includes(d2));
                    case 'product':
                        return caseList.map((dd) => {
                            return `${dd}`;
                        }).includes(`${dp.id}`);
                    case 'all':
                        return true;
                }
            });
            return filterItems.sort((a, b) => (caseOffStart === 'price_desc' ? b.sale_price - a.sale_price : a.sale_price - b.sale_price));
        }
        const userClass = new user_js_1.User(this.app);
        const userData = (_a = (await userClass.getUserData(cart.email, 'email_or_phone'))) !== null && _a !== void 0 ? _a : { userID: -1 };
        const allVoucher = await this.getAllUseVoucher(userData.userID);
        let overlay = false;
        const voucherList = allVoucher
            .filter((dd) => {
            if (!dd.device) {
                return true;
            }
            if (dd.device.length === 0) {
                return false;
            }
            switch (cart.orderSource) {
                case 'POS':
                    return dd.device.includes('pos');
                default:
                    return dd.device.includes('normal');
            }
        })
            .filter((dd) => {
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
            .filter((dd) => {
            var _a;
            dd.bind = [];
            dd.productOffStart = (_a = dd.productOffStart) !== null && _a !== void 0 ? _a : 'price_all';
            switch (dd.trigger) {
                case 'auto':
                    dd.bind = switchValidProduct(dd.for, dd.forKey, dd.productOffStart);
                    break;
                case 'code':
                    if (dd.code === `${cart.code}` || (cart.code_array || []).includes(`${dd.code}`)) {
                        dd.bind = switchValidProduct(dd.for, dd.forKey, dd.productOffStart);
                    }
                    break;
                case 'distribution':
                    if (cart.distribution_info && cart.distribution_info.voucher === dd.id) {
                        dd.bind = switchValidProduct(cart.distribution_info.relative, cart.distribution_info.relative_data, dd.productOffStart);
                    }
                    break;
            }
            if (dd.method === 'percent' && dd.conditionType === 'order' && dd.rule === 'min_count' && dd.reBackType === 'discount' && dd.productOffStart !== 'price_all' && dd.ruleValue > 0) {
                dd.bind = dd.bind.slice(0, dd.ruleValue);
            }
            return dd.bind.length > 0;
        })
            .filter((dd) => {
            const pass = (() => {
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
            })();
            return pass !== null && pass !== void 0 ? pass : false;
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
                if (data.orderData.orderStatus === '-1') {
                    await this.releaseVoucherHistory(data.orderData.orderID, 0);
                }
                else {
                    await this.releaseVoucherHistory(data.orderData.orderID, 1);
                }
                if (origin[0].orderData.orderStatus !== '-1' && data.orderData.orderStatus === '-1') {
                    for (const lineItem of origin[0].orderData.lineItems) {
                        if (lineItem.product_category === 'kitchen' && (lineItem.spec && lineItem.spec.length)) {
                            await new Shopping(this.app, this.token).calcVariantsStock(lineItem.count, '', lineItem.id, lineItem.spec);
                        }
                        else {
                            for (const b of Object.keys(lineItem.deduction_log)) {
                                await new Shopping(this.app, this.token).calcVariantsStock(lineItem.deduction_log[b] || 0, b, lineItem.id, lineItem.spec);
                            }
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
                            if (new_line_item.product_category === 'kitchen' && (new_line_item.spec && new_line_item.spec.length)) {
                                await new Shopping(this.app, this.token).calcVariantsStock(new_line_item.count, '', new_line_item.id, new_line_item.spec);
                            }
                            else {
                                for (const key of Object.keys(new_line_item.deduction_log)) {
                                    const u_ = new_line_item.deduction_log[key];
                                    const o_ = og_line_items.deduction_log[key];
                                    await new Shopping(this.app, this.token).calcVariantsStock((u_ - o_) * -1, key, new_line_item.id, new_line_item.spec);
                                }
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
            await Promise.all(origin[0].orderData.lineItems.map((lineItem) => {
                return new Promise(async (resolve, reject) => {
                    const pd = await new Shopping(this.app, this.token).getProduct({
                        id: lineItem.id,
                        page: 0,
                        limit: 10,
                        skip_shopee_check: true,
                    });
                    if (pd.data && pd.data.shopee_id) {
                        console.log(`sync-pd.data`, pd.data.content.variants);
                        await new shopee_1.Shopee(this.app, this.token).asyncStockToShopee({
                            product: pd.data,
                            callback: () => {
                            },
                        });
                    }
                    resolve(true);
                });
            }));
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
            if (query.valid) {
                querySql.push(`(orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1')`);
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
                    querySql.push(`(orderData->>'$.archived'="${query.archived}") 
                    AND (JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.orderStatus')) IS NULL 
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
                                                   SET ?`, [{
                        content: JSON.stringify(variant),
                        product_id: content.id
                    }]);
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
    async calcVariantsStock(calc, stock_id, product_id, spec) {
        try {
            const pd_data = (await this.getProduct({
                id: product_id,
                page: 0,
                limit: 10,
            })).data.content;
            const variant_s = pd_data.variants.find((dd) => {
                return dd.spec.join('-') === spec.join('-');
            });
            if (pd_data.product_category === 'kitchen' && (pd_data.specs && pd_data.specs.length)) {
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
                (0, ses_js_1.sendmail)(`${json.shop_name} <${process.env.smtp}>`, order_data.user_info.email, `${pd_data.title} 購買通知信`, notice, () => {
                });
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
        const propertiesToParse = ['stock', 'product_id', 'sale_price', 'compare_price', 'shipment_weight'];
        variants.forEach((variant) => {
            propertiesToParse.forEach((prop) => {
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
            let max_id = ((await database_js_1.default.query(`select max(id)
                         from \`${this.app}\`.t_manager_post`, []))[0]['max(id)'] || 0) + 1;
            console.log(`max_id==>`, max_id);
            console.log(`productArrayOG==>`, productArray);
            productArray.map((product) => {
                var _a;
                if (!product.id) {
                    product.id = max_id++;
                }
                product.type = 'product';
                this.checkVariantDataType(product.variants);
                return [product.id || null, (_a = this.token) === null || _a === void 0 ? void 0 : _a.userID, JSON.stringify(product)];
            });
            console.log(`productArray==>`, productArray);
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
            if (content.shopee_id) {
                await new shopee_1.Shopee(this.app, this.token).asyncStockToShopee({
                    product: {
                        content: content
                    },
                    callback: () => {
                    }
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
        var _a;
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
                }
            }
            query.id && querySql.push(`(v.id = ${query.id})`);
            query.id_list && querySql.push(`(v.id in (${query.id_list}))`);
            query.collection &&
                querySql.push(`(${query.collection
                    .split(',')
                    .map((dd) => {
                    return query.accurate_search_collection ? `
                        v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (JSON_CONTAINS(p.content->'$.collection', '"${dd}"')))
                        
                        ` : `
                         v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (JSON_EXTRACT(p.content, '$.collection') LIKE '%${dd}%'))
                        `;
                })
                    .join(' or ')})`);
            query.status && querySql.push(`
             v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (JSON_EXTRACT(p.content, '$.status') = '${query.status}'))
            `);
            query.min_price && querySql.push(`(v.content->>'$.sale_price' >= ${query.min_price})`);
            query.max_price && querySql.push(`(v.content->>'$.sale_price' <= ${query.min_price})`);
            if (query.productType !== 'all') {
                const queryOR = [];
                if (query.productType) {
                    query.productType.split(',').map((dd) => {
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
            const shopee_data_list = [];
            await Promise.all(data.data.map((v_c) => {
                const product = v_c['product_content'];
                return new Promise(async (resolve, reject) => {
                    if (product) {
                        let totalSale = 0;
                        const content = product;
                        if (content.shopee_id) {
                            let shopee_dd = shopee_data_list.find((dd) => {
                                return dd.id === content.shopee_id;
                            });
                            if (!shopee_dd) {
                                shopee_dd = {
                                    id: content.shopee_id,
                                    data: await new shopee_1.Shopee(this.app, this.token).getProductDetail(content.shopee_id, { skip_image_load: true }),
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
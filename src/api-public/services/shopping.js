"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shopping = void 0;
var exception_js_1 = require("../../modules/exception.js");
var database_js_1 = require("../../modules/database.js");
var express_1 = require("express");
var moment_1 = require("moment");
var axios_1 = require("axios");
var app_1 = require("../../app");
var redis_js_1 = require("../../modules/redis.js");
var tool_js_1 = require("../../modules/tool.js");
var financial_service_js_1 = require("./financial-service.js");
var private_config_js_1 = require("../../services/private_config.js");
var user_js_1 = require("./user.js");
var invoice_js_1 = require("./invoice.js");
var rebate_js_1 = require("./rebate.js");
var custom_code_js_1 = require("../services/custom-code.js");
var notify_js_1 = require("./notify.js");
var auto_send_email_js_1 = require("./auto-send-email.js");
var recommend_js_1 = require("./recommend.js");
var config_js_1 = require("../../config.js");
var sms_js_1 = require("./sms.js");
var line_message_1 = require("./line-message");
var EcInvoice_1 = require("./EcInvoice");
var glitter_finance_js_1 = require("../models/glitter-finance.js");
var app_js_1 = require("../../services/app.js");
var stock_1 = require("./stock");
var order_event_js_1 = require("./order-event.js");
var seo_config_js_1 = require("../../seo-config.js");
var ses_js_1 = require("../../services/ses.js");
var shopee_1 = require("./shopee");
var shipment_config_js_1 = require("../config/shipment-config.js");
var paynow_logistics_js_1 = require("./paynow-logistics.js");
var checkout_js_1 = require("./checkout.js");
var product_initial_js_1 = require("./product-initial.js");
var ut_timer_js_1 = require("../utils/ut-timer.js");
var OrderDetail = /** @class */ (function () {
    function OrderDetail(subtotal, shipment) {
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
    OrderDetail.prototype.initCustomerInfo = function () {
        return {
            name: '',
            phone: '',
            email: '',
        };
    };
    OrderDetail.prototype.initUserInfo = function () {
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
    };
    OrderDetail.prototype.initVoucher = function () {
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
    };
    return OrderDetail;
}());
var Shopping = /** @class */ (function () {
    function Shopping(app, token) {
        this.app = app;
        this.token = token;
    }
    Shopping.prototype.getProduct = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var userClass, count_sql_1, store_info, store_config_1, exh_config_1, userID_1, querySql_1, orderMapping, decodedDomain, sqlJoinSearch, ids, collection_cf_1, statusSplit, statusJoin, statusCondition, currentDate_1, scheduleConditions, exh, channelSplit, channelJoin, products_1, productIds, wishListData, wishListSet_1, idSet_1, decodedDomain_1, foundProduct, _a, viewSource_1, distributionCode, userData_1, voucherObj_1, getPrice_1, processProduct, e_1;
            var _this = this;
            var _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 19, , 20]);
                        userClass = new user_js_1.User(this.app);
                        return [4 /*yield*/, userClass.getCheckoutCountingModeSQL()];
                    case 1:
                        count_sql_1 = _h.sent();
                        return [4 /*yield*/, userClass.getConfigV2({ key: 'store-information', user_id: 'manager' })];
                    case 2:
                        store_info = _h.sent();
                        return [4 /*yield*/, userClass.getConfigV2({ key: 'store_manager', user_id: 'manager' })];
                    case 3:
                        store_config_1 = _h.sent();
                        return [4 /*yield*/, userClass.getConfigV2({ key: 'exhibition_manager', user_id: 'manager' })];
                    case 4:
                        exh_config_1 = _h.sent();
                        userID_1 = (_b = query.setUserID) !== null && _b !== void 0 ? _b : (this.token ? "".concat(this.token.userID) : '');
                        querySql_1 = ["(content->>'$.type'='product')"];
                        query.language = (_c = query.language) !== null && _c !== void 0 ? _c : store_info.language_setting.def;
                        query.show_hidden = (_d = query.show_hidden) !== null && _d !== void 0 ? _d : 'true';
                        orderMapping = {
                            title: "ORDER BY JSON_EXTRACT(content, '$.title')",
                            max_price: "ORDER BY CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.max_price')) AS SIGNED) DESC",
                            min_price: "ORDER BY CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.min_price')) AS SIGNED) ASC",
                            created_time_desc: "ORDER BY created_time DESC",
                            created_time_asc: "ORDER BY created_time ASC",
                            updated_time_desc: "ORDER BY updated_time DESC",
                            updated_time_asc: "ORDER BY updated_time ASC",
                            sales_desc: "ORDER BY content->>'$.total_sales' DESC",
                            default: "ORDER BY content->>'$.sort_weight' DESC",
                            stock_desc: '',
                            stock_asc: '',
                        };
                        query.order_by = orderMapping[query.order_by] || orderMapping.default;
                        if (query.search) {
                            switch (query.searchType) {
                                case 'sku':
                                    if (query.accurate_search_text) {
                                        querySql_1.push("JSON_EXTRACT(content, '$.variants[*].sku') = '".concat(query.search, "'"));
                                    }
                                    else {
                                        querySql_1.push("JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%".concat(query.search, "%'"));
                                    }
                                    break;
                                case 'barcode':
                                    if (query.accurate_search_text) {
                                        querySql_1.push("JSON_EXTRACT(content, '$.variants[*].barcode') = '".concat(query.search, "'"));
                                    }
                                    else {
                                        querySql_1.push("JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%".concat(query.search, "%'"));
                                    }
                                    break;
                                case 'customize_tag':
                                    querySql_1.push("JSON_EXTRACT(content, '$.product_customize_tag') LIKE '%".concat(query.search, "%'"));
                                    break;
                                case 'title':
                                    querySql_1.push("(".concat([
                                        "(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%".concat(query.search, "%'))"),
                                        "(UPPER(content->>'$.language_data.\"".concat(query.language, "\".title') LIKE UPPER('%").concat(query.search, "%'))"),
                                    ].join(' OR '), ")"));
                                    break;
                                default:
                                    querySql_1.push("(".concat([
                                        "(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%".concat(query.search, "%'))"),
                                        "(UPPER(content->>'$.language_data.\"".concat(query.language, "\".title') LIKE UPPER('%").concat(query.search, "%'))"),
                                        "UPPER(content->>'$.product_tag.language.\"".concat(query.language, "\"') like '%").concat(query.search, "%'"),
                                        "JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%".concat(query.search, "%'"),
                                        "JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%".concat(query.search, "%'"),
                                        "JSON_EXTRACT(content, '$.product_customize_tag') LIKE '%".concat(query.search, "%'"),
                                    ].join(' OR '), ")"));
                                    break;
                            }
                        }
                        if (query.product_category) {
                            querySql_1.push("JSON_EXTRACT(content, '$.product_category') = ".concat(database_js_1.default.escape(query.product_category)));
                        }
                        if (query.domain) {
                            decodedDomain = decodeURIComponent(query.domain);
                            sqlJoinSearch = [
                                "content->>'$.seo.domain' = '".concat(decodedDomain, "'"),
                                "content->>'$.title' = '".concat(decodedDomain, "'"),
                                "content->>'$.language_data.\"".concat(query.language, "\".seo.domain' = '").concat(decodedDomain, "'"),
                            ];
                            if (sqlJoinSearch.length) {
                                querySql_1.push("(".concat(sqlJoinSearch.map(function (condition) { return "(".concat(condition, ")"); }).join(' OR '), ")"));
                            }
                            query.order_by = "\n          ORDER BY CASE \n          WHEN content->>'$.language_data.\"zh-TW\".seo.domain' = '".concat(decodedDomain, "' THEN 1\n              ELSE 2\n          END\n        ");
                        }
                        if (query.id) {
                            ids = "".concat(query.id)
                                .split(',')
                                .map(function (id) { return id.trim(); })
                                .filter(function (id) { return id; });
                            if (ids.length > 1) {
                                querySql_1.push("id IN (".concat(ids.map(function (id) { return "'".concat(id, "'"); }).join(','), ")"));
                            }
                            else {
                                querySql_1.push("id = '".concat(ids[0], "'"));
                            }
                        }
                        // 當非管理員時，檢查是否顯示隱形商品
                        if (query.filter_visible) {
                            if (query.filter_visible === 'true') {
                                querySql_1.push("(content->>'$.visible' is null || content->>'$.visible' = 'true')");
                            }
                            else {
                                querySql_1.push("(content->>'$.visible' = 'false')");
                            }
                        }
                        else if (!query.is_manger && "".concat(query.show_hidden) !== 'true') {
                            querySql_1.push("(content->>'$.visible' is null || content->>'$.visible' = 'true')");
                        }
                        // 判斷有帶入商品類型時，顯示商品類型，反之預設折是一班商品
                        if (query.productType) {
                            query.productType.split(',').map(function (dd) {
                                if (dd === 'hidden') {
                                    querySql_1.push("(content->>'$.visible' = \"false\")");
                                }
                                else if (dd !== 'all') {
                                    querySql_1.push("(content->>'$.productType.".concat(dd, "' = \"true\")"));
                                }
                            });
                        }
                        else if (!query.id) {
                            querySql_1.push("(content->>'$.productType.product' = \"true\")");
                        }
                        if (!query.collection) return [3 /*break*/, 6];
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n             FROM `".concat(this.app, "`.public_config\n             WHERE `key` = 'collection';\n            "), [])];
                    case 5:
                        collection_cf_1 = (_h.sent())[0]['value'];
                        query.collection = decodeURI(query.collection);
                        query.collection = query.collection
                            .split(',')
                            .map(function (dd) {
                            function loop(array, prefix) {
                                var find = array.find(function (d1) {
                                    return ((d1.language_data && d1.language_data[query.language].seo.domain === dd) || d1.code === dd);
                                });
                                if (find) {
                                    prefix.push(find.title);
                                    dd = prefix.join(' / ');
                                    query.accurate_search_collection = true;
                                }
                                else {
                                    array.map(function (d1) {
                                        if (d1.array) {
                                            var prefix_i = JSON.parse(JSON.stringify(prefix));
                                            prefix_i.push(d1.title);
                                            loop(d1.array, prefix_i);
                                        }
                                    });
                                }
                            }
                            loop(collection_cf_1, []);
                            return dd;
                        })
                            .join(',');
                        querySql_1.push("(".concat(query.collection
                            .split(',')
                            .map(function (dd) {
                            return query.accurate_search_collection
                                ? "(JSON_CONTAINS(content->'$.collection', '\"".concat(dd, "\"'))")
                                : "(JSON_EXTRACT(content, '$.collection') LIKE '%".concat(dd, "%')");
                        })
                            .join(' or '), ")"));
                        _h.label = 6;
                    case 6:
                        if (query.sku) {
                            querySql_1.push("(id in ( select product_id from `".concat(this.app, "`.t_variants where content->>'$.sku'=").concat(database_js_1.default.escape(query.sku), "))"));
                        }
                        if (!query.id && query.status === 'active' && query.with_hide_index !== 'true') {
                            querySql_1.push("(content->>'$.hideIndex' IS NULL OR content->>'$.hideIndex' = 'false')");
                        }
                        if (query.id_list) {
                            query.order_by = " ORDER BY FIELD (id,".concat(query.id_list, ")");
                        }
                        if (!query.is_manger && !query.status) {
                            query.status = 'inRange';
                        }
                        if (query.status) {
                            statusSplit = query.status.split(',').map(function (status) { return status.trim(); });
                            statusJoin = statusSplit.map(function (status) { return "\"".concat(status, "\""); }).join(',');
                            statusCondition = "JSON_EXTRACT(content, '$.status') IN (".concat(statusJoin, ")");
                            currentDate_1 = database_js_1.default.escape(new Date().toISOString());
                            scheduleConditions = statusSplit
                                .map(function (status) {
                                switch (status) {
                                    case 'inRange':
                                        return "OR (\n                      JSON_EXTRACT(content, '$.status') IN ('active', 1)\n                      AND (\n                          content->>'$.active_schedule' IS NULL OR \n                          (\n                              (\n                                  ((CONCAT(content->>'$.active_schedule.start_ISO_Date') IS NULL) and (CONCAT(content->>'$.active_schedule.startDate') IS NULL)) or\n                                  ((CONCAT(content->>'$.active_schedule.start_ISO_Date') <= ".concat(currentDate_1, ") or (CONCAT(content->>'$.active_schedule.startDate') <= ").concat(database_js_1.default.escape((0, moment_1.default)().format('YYYY-MM-DD')), "))\n                              )\n                              AND (\n                                ((CONCAT(content->>'$.active_schedule.end_ISO_Date') IS NULL) and (CONCAT(content->>'$.active_schedule.endDate') IS NULL)) or\n                                  (CONCAT(content->>'$.active_schedule.end_ISO_Date') >= ").concat(currentDate_1, ") or (CONCAT(content->>'$.active_schedule.endDate') >= ").concat(database_js_1.default.escape((0, moment_1.default)().format('YYYY-MM-DD')), ")\n                              )\n                          )\n                      )\n                  )");
                                    case 'beforeStart':
                                        return "\n                  OR (\n                      JSON_EXTRACT(content, '$.status') IN ('active', 1)\n                      AND CONCAT(content->>'$.active_schedule.start_ISO_Date') > ".concat(currentDate_1, "\n                  )");
                                    case 'afterEnd':
                                        return "\n                  OR (\n                      JSON_EXTRACT(content, '$.status') IN ('active', 1)\n                      AND CONCAT(content->>'$.active_schedule.end_ISO_Date') < ".concat(currentDate_1, "\n                  )");
                                    default:
                                        return '';
                                }
                            })
                                .join('');
                            // 組合 SQL 條件
                            querySql_1.push("(".concat(statusCondition, " ").concat(scheduleConditions, ")"));
                        }
                        if (query.channel) {
                            if (query.channel === 'exhibition') {
                                exh = exh_config_1.list.find(function (item) { return item.id === query.whereStore; });
                                if (exh) {
                                    querySql_1.push("\n              (id IN (SELECT product_id FROM `".concat(this.app, "`.t_variants \n              WHERE id IN (").concat(exh.dataList.map(function (d) { return d.variantID; }).join(','), ")))"));
                                }
                            }
                            else {
                                channelSplit = query.channel.split(',').map(function (channel) { return channel.trim(); });
                                channelJoin = channelSplit.map(function (channel) {
                                    return "OR JSON_CONTAINS(content->>'$.channel', '\"".concat(channel, "\"')");
                                });
                                querySql_1.push("(content->>'$.channel' IS NULL ".concat(channelJoin, ")"));
                            }
                        }
                        if (query.id_list) {
                            querySql_1.push("(id in (".concat(query.id_list, "))"));
                        }
                        if (query.min_price) {
                            querySql_1.push("(id in (select product_id from `".concat(this.app, "`.t_variants where content->>'$.sale_price' >= ").concat(query.min_price, "))"));
                        }
                        if (query.max_price) {
                            querySql_1.push("(id in (select product_id from `".concat(this.app, "`.t_variants where content->>'$.sale_price' <= ").concat(query.max_price, "))"));
                        }
                        return [4 /*yield*/, this.querySql(querySql_1, query)];
                    case 7:
                        products_1 = _h.sent();
                        // 產品清單
                        products_1.data = (Array.isArray(products_1.data) ? products_1.data : [products_1.data]).filter(function (product) { return product; });
                        if (!(userID_1 !== '' && products_1.data.length > 0)) return [3 /*break*/, 9];
                        productIds = products_1.data.map(function (product) { return product.id; });
                        return [4 /*yield*/, database_js_1.default.query("SELECT content ->>'$.product_id' AS product_id\n           FROM `".concat(this.app, "`.t_post\n           WHERE userID = ?\n             AND content->>'$.type' = 'wishlist'\n             AND content->>'$.product_id' IN (").concat(productIds.map(function () { return '?'; }).join(','), ")"), __spreadArray([userID_1], productIds, true))];
                    case 8:
                        wishListData = _h.sent();
                        wishListSet_1 = new Set(wishListData.map(function (row) { return row.product_id; }));
                        products_1.data = products_1.data.map(function (product) {
                            if (product.content) {
                                product.content.in_wish_list = wishListSet_1.has(String(product.id));
                                product.content.id = product.id;
                            }
                            return product;
                        });
                        _h.label = 9;
                    case 9:
                        if (query.id_list) {
                            idSet_1 = new Set(query.id_list
                                .split(',')
                                .map(function (id) { return id.trim(); })
                                .filter(Boolean));
                            products_1.data = products_1.data.filter(function (product) { return idSet_1.has("".concat(product.id)); });
                        }
                        if (query.id_list) {
                            products_1.data = query.id_list
                                .split(',')
                                .map(function (id) {
                                return products_1.data.find(function (product) { return "".concat(product.id) === "".concat(id); });
                            })
                                .filter(function (dd) { return dd; });
                        }
                        // 判斷需要多國語言，或者蝦皮庫存同步
                        return [4 /*yield*/, Promise.all(products_1.data
                                .filter(function (dd) {
                                return dd.content;
                            })
                                .map(function (product) {
                                product.content.collection = Array.from(new Set((function () {
                                    var _a;
                                    return ((_a = product.content.collection) !== null && _a !== void 0 ? _a : []).map(function (dd) {
                                        return dd.replace(' / ', '/').replace(' /', '/').replace('/ ', '/').replace('/', ' / ');
                                    });
                                })()));
                                return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                    var totalSale_1, language_1, content_1, langData, soldOldHistory_1, shopee_data_1;
                                    var _a, _b, _c;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                if (!product) return [3 /*break*/, 6];
                                                totalSale_1 = 0;
                                                language_1 = query.language;
                                                content_1 = product.content;
                                                content_1.preview_image = (_a = content_1.preview_image) !== null && _a !== void 0 ? _a : [];
                                                product_initial_js_1.ProductInitial.initial(content_1);
                                                if (language_1 && ((_b = content_1 === null || content_1 === void 0 ? void 0 : content_1.language_data) === null || _b === void 0 ? void 0 : _b[language_1])) {
                                                    langData = content_1.language_data[language_1];
                                                    if ((langData.preview_image && langData.preview_image.length === 0) || !langData.preview_image) {
                                                        if (content_1.preview_image.length) {
                                                            langData.preview_image = content_1.preview_image;
                                                        }
                                                        else {
                                                            langData.preview_image = [
                                                                'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg',
                                                            ];
                                                        }
                                                    }
                                                    Object.assign(content_1, {
                                                        seo: langData.seo,
                                                        title: langData.title || content_1.title,
                                                        content: langData.content || content_1.content,
                                                        content_array: langData.content_array || content_1.content_array,
                                                        content_json: langData.content_json || content_1.content_json,
                                                        preview_image: langData.preview_image || content_1.preview_image,
                                                    });
                                                }
                                                if ((content_1.preview_image && content_1.preview_image.length === 0) || !content_1.preview_image) {
                                                    content_1.preview_image = [
                                                        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg',
                                                    ];
                                                }
                                                if (!(content_1.product_category === 'kitchen')) return [3 /*break*/, 1];
                                                if (content_1.specs.length) {
                                                    content_1.min_price = content_1.specs
                                                        .map(function (dd) {
                                                        return Math.min.apply(Math, dd.option.map(function (d1) {
                                                            return d1.price;
                                                        }));
                                                    })
                                                        .reduce(function (a, b) { return a + b; }, 0);
                                                    content_1.max_price = content_1.specs
                                                        .map(function (dd) {
                                                        return Math.max.apply(Math, dd.option.map(function (d1) {
                                                            return d1.price;
                                                        }));
                                                    })
                                                        .reduce(function (a, b) { return a + b; }, 0);
                                                }
                                                else {
                                                    content_1.min_price = content_1.price || 0;
                                                    content_1.max_price = content_1.price || 0;
                                                }
                                                content_1.variants = [
                                                    {
                                                        sku: '',
                                                        spec: [],
                                                        type: 'variants',
                                                        v_width: 0,
                                                        product_id: content_1.id,
                                                        sale_price: content_1.min_price,
                                                        compare_price: 0,
                                                        shipment_type: 'none',
                                                        show_understocking: ((_c = content_1.stocke) !== null && _c !== void 0 ? _c : '') === '' ? "false" : "true",
                                                    },
                                                ];
                                                return [3 /*break*/, 3];
                                            case 1: return [4 /*yield*/, database_js_1.default.query("\n                        SELECT *\n                        FROM `".concat(this.app, "`.t_products_sold_history\n                        WHERE product_id = ").concat(database_js_1.default.escape(content_1.id), "\n                          AND order_id IN (SELECT cart_token\n                                           FROM `").concat(this.app, "`.t_checkout\n                                           WHERE ").concat(count_sql_1, ")\n                    "), [])];
                                            case 2:
                                                soldOldHistory_1 = _d.sent();
                                                (content_1.variants || []).forEach(function (variant) {
                                                    var _a, _b, _c;
                                                    //規格只有一組不用顯示規格圖片
                                                    if (content_1.variants.length === 1) {
                                                        variant.preview_image = undefined;
                                                        variant["preview_image_".concat(language_1)] = undefined;
                                                    }
                                                    variant.spec = variant.spec || [];
                                                    variant.stock = 0;
                                                    variant.sold_out =
                                                        soldOldHistory_1
                                                            .filter(function (dd) {
                                                            return dd.spec === variant.spec.join('-') && "".concat(dd.product_id) === "".concat(content_1.id);
                                                        })
                                                            .map(function (dd) {
                                                            return dd.count;
                                                        })
                                                            .reduce(function (a, b) {
                                                            return tool_js_1.default.floatAdd(a, b);
                                                        }, 0) || 0;
                                                    variant.preview_image = (_a = variant.preview_image) !== null && _a !== void 0 ? _a : '';
                                                    if (variant.preview_image) {
                                                        var img = variant.preview_image;
                                                        var temp_1 = '';
                                                        if (typeof img === 'object') {
                                                            if (img.richText) {
                                                                img.richText.map(function (item) {
                                                                    temp_1 += item.text;
                                                                });
                                                            }
                                                            else if (img.hyperlink) {
                                                                temp_1 = (_b = img.text) !== null && _b !== void 0 ? _b : img.hyperlink;
                                                            }
                                                        }
                                                        else if (!img.includes('https://')) {
                                                            temp_1 = '';
                                                        }
                                                        else {
                                                            temp_1 = img;
                                                        }
                                                        variant.preview_image = temp_1;
                                                    }
                                                    variant.preview_image =
                                                        variant["preview_image_".concat(language_1)] ||
                                                            variant.preview_image ||
                                                            'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';
                                                    if (content_1.min_price > variant.sale_price) {
                                                        content_1.min_price = variant.sale_price;
                                                    }
                                                    if (content_1.max_price < variant.sale_price) {
                                                        content_1.max_price = variant.sale_price;
                                                    }
                                                    if (variant.preview_image ===
                                                        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg') {
                                                        variant.preview_image = (_c = content_1.preview_image) === null || _c === void 0 ? void 0 : _c[0];
                                                    }
                                                    // 過濾並計算庫存
                                                    Object.entries(variant.stockList || {}).forEach(function (_a) {
                                                        var storeId = _a[0], stockData = _a[1];
                                                        if (!store_config_1.list.some(function (store) { return store.id === storeId; }) || !(stockData === null || stockData === void 0 ? void 0 : stockData.count)) {
                                                            delete variant.stockList[storeId];
                                                        }
                                                        else {
                                                            variant.stockList[storeId].count = parseInt(stockData.count, 10);
                                                            variant.stock += variant.stockList[storeId].count;
                                                        }
                                                    });
                                                    // 確保所有商店 ID 都存在
                                                    store_config_1.list.forEach(function (store) {
                                                        variant.stockList[store.id] = variant.stockList[store.id] || { count: 0 };
                                                    });
                                                    totalSale_1 += variant.sold_out;
                                                });
                                                _d.label = 3;
                                            case 3:
                                                if (!(content_1.shopee_id && !query.skip_shopee_check)) return [3 /*break*/, 5];
                                                return [4 /*yield*/, new shopee_1.Shopee(this.app, this.token).getProductDetail(content_1.shopee_id, {
                                                        skip_image_load: true,
                                                    })];
                                            case 4:
                                                shopee_data_1 = _d.sent();
                                                if (shopee_data_1 && shopee_data_1.variants) {
                                                    (content_1.variants || []).forEach(function (variant) {
                                                        var shopee_variants = shopee_data_1.variants.find(function (dd) {
                                                            return dd.spec.join('') === variant.spec.join('');
                                                        });
                                                        if (shopee_variants) {
                                                            variant.stock = shopee_variants.stock;
                                                            variant.stockList = {};
                                                            variant.stockList[store_config_1.list[0].id] = { count: variant.stock };
                                                        }
                                                    });
                                                }
                                                _d.label = 5;
                                            case 5:
                                                product.total_sales = totalSale_1;
                                                _d.label = 6;
                                            case 6:
                                                resolve(true);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }))];
                    case 10:
                        // 判斷需要多國語言，或者蝦皮庫存同步
                        _h.sent();
                        if (query.domain && products_1.data.length > 0) {
                            decodedDomain_1 = decodeURIComponent(query.domain);
                            foundProduct = products_1.data.find(function (dd) {
                                var _a, _b;
                                if (!query.language)
                                    return false;
                                var languageData = (_b = (_a = dd.content.language_data) === null || _a === void 0 ? void 0 : _a[query.language]) === null || _b === void 0 ? void 0 : _b.seo;
                                var seoData = dd.content.seo;
                                return ((languageData && languageData.domain === decodedDomain_1) || (seoData && seoData.domain === decodedDomain_1));
                            });
                            products_1.data = foundProduct || products_1.data[0];
                        }
                        if (query.id && products_1.data.length > 0) {
                            products_1.data = products_1.data[0];
                        }
                        if (!((query.domain || query.id) && products_1.data !== undefined)) return [3 /*break*/, 12];
                        _a = products_1.data;
                        return [4 /*yield*/, seo_config_js_1.SeoConfig.getProductJsonLd(this.app, products_1.data.content)];
                    case 11:
                        _a.json_ld = _h.sent();
                        _h.label = 12;
                    case 12:
                        viewSource_1 = (_e = query.view_source) !== null && _e !== void 0 ? _e : 'normal';
                        distributionCode = (_f = query.distribution_code) !== null && _f !== void 0 ? _f : '';
                        return [4 /*yield*/, userClass.getUserData(userID_1, 'userID')];
                    case 13:
                        userData_1 = (_g = (_h.sent())) !== null && _g !== void 0 ? _g : { userID: -1 };
                        return [4 /*yield*/, Promise.all([
                                this.getAllUseVoucher(userData_1.userID),
                                this.getDistributionRecommend(distributionCode),
                            ]).then(function (dataArray) {
                                return {
                                    allVoucher: dataArray[0],
                                    recommendData: dataArray[1],
                                };
                            })];
                    case 14:
                        voucherObj_1 = _h.sent();
                        getPrice_1 = function (priceMap, key, specKey, priceList) {
                            var _a;
                            var price = (_a = priceMap[key]) === null || _a === void 0 ? void 0 : _a.get(specKey);
                            price && priceList.push(price);
                        };
                        processProduct = function (product) { return __awaiter(_this, void 0, void 0, function () {
                            var createPriceMap, _a, _b, exh_1, exh_variant_ids, variantsResult, variantsList_1, priceArray, postMD_1;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!product || !product.content) {
                                            return [2 /*return*/];
                                        }
                                        createPriceMap = function (type) {
                                            return Object.fromEntries(product.content.multi_sale_price
                                                .filter(function (item) { return item.type === type; })
                                                .map(function (item) { return [item.key, new Map(item.variants.map(function (v) { return [v.spec.join('-'), v.price]; }))]; }));
                                        };
                                        if (!product || !product.content) {
                                            return [2 /*return*/, product];
                                        }
                                        _a = product.content;
                                        return [4 /*yield*/, this.aboutProductVoucher({
                                                product: product,
                                                userID: userID_1,
                                                viewSource: viewSource_1,
                                                allVoucher: voucherObj_1.allVoucher,
                                                recommendData: voucherObj_1.recommendData,
                                                userData: userData_1,
                                            })];
                                    case 1:
                                        _a.about_vouchers = _c.sent();
                                        product.content.comments = [];
                                        if (!(products_1.total === 1)) return [3 /*break*/, 3];
                                        _b = product.content;
                                        return [4 /*yield*/, this.getProductComment(product.id)];
                                    case 2:
                                        _b.comments = _c.sent();
                                        _c.label = 3;
                                    case 3:
                                        if (!(query.channel && query.channel === 'exhibition')) return [3 /*break*/, 5];
                                        exh_1 = exh_config_1.list.find(function (item) { return item.id === query.whereStore; });
                                        if (!exh_1) return [3 /*break*/, 5];
                                        exh_variant_ids = exh_1.dataList.map(function (d) { return d.variantID; });
                                        return [4 /*yield*/, this.getProductVariants(exh_variant_ids.join(','))];
                                    case 4:
                                        variantsResult = _c.sent();
                                        if (variantsResult.total > 0) {
                                            variantsList_1 = new Map(variantsResult.data
                                                .filter(function (a) { return a.product_id === product.id; })
                                                .map(function (a) {
                                                return [a.variant_content.spec.join(','), a.id];
                                            }));
                                            product.content.variants.forEach(function (pv) {
                                                var _a, _b;
                                                var specString = pv.spec.join(',');
                                                var variantID = variantsList_1.get(specString);
                                                if (variantID) {
                                                    var vData = exh_1.dataList.find(function (a) { return a.variantID === variantID; });
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
                                        _c.label = 5;
                                    case 5:
                                        product.content.variants.forEach(function (pv) {
                                            var _a, _b, _c;
                                            var vPriceList = [];
                                            // 取得門市與會員專屬價格
                                            if ((_a = product.content.multi_sale_price) === null || _a === void 0 ? void 0 : _a.length) {
                                                var specKey_1 = pv.spec.join('-');
                                                // 門市價格
                                                if (query.whereStore) {
                                                    var storeMaps = createPriceMap('store');
                                                    getPrice_1(storeMaps, query.whereStore, specKey_1, vPriceList);
                                                }
                                                // 會員等級價格
                                                if ((_b = userData_1 === null || userData_1 === void 0 ? void 0 : userData_1.member_level) === null || _b === void 0 ? void 0 : _b.id) {
                                                    var levelMaps = createPriceMap('level');
                                                    getPrice_1(levelMaps, userData_1.member_level.id, specKey_1, vPriceList);
                                                }
                                                // 顧客標籤價格
                                                if (Array.isArray((_c = userData_1 === null || userData_1 === void 0 ? void 0 : userData_1.userData) === null || _c === void 0 ? void 0 : _c.tags) && userData_1.userData.tags.length > 0) {
                                                    var tagsMaps_1 = createPriceMap('tags');
                                                    userData_1.userData.tags.map(function (tag) {
                                                        getPrice_1(tagsMaps_1, tag, specKey_1, vPriceList);
                                                    });
                                                }
                                            }
                                            pv.origin_price = parseInt("".concat(pv.compare_price || pv.sale_price), 10);
                                            pv.sale_price = vPriceList.length > 0 ? Math.min.apply(Math, vPriceList) : pv.sale_price;
                                        });
                                        priceArray = product.content.variants
                                            .filter(function (item) {
                                            if (query.channel && query.channel === 'exhibition') {
                                                return item.exhibition_type;
                                            }
                                            return true;
                                        })
                                            .map(function (item) {
                                            return parseInt("".concat(item.sale_price), 10);
                                        });
                                        product.content.min_price = Math.min.apply(Math, priceArray);
                                        if (product.content.product_category === 'kitchen' && product.content.variants.length > 1) {
                                            postMD_1 = product.content;
                                            product.content.variants.map(function (dd) {
                                                var _a, _b, _c, _d;
                                                dd.compare_price = 0;
                                                dd.sale_price = dd.spec.reduce(function (sum, specValue, index) {
                                                    var _a, _b;
                                                    var spec = postMD_1.specs[index];
                                                    var option = (_a = spec === null || spec === void 0 ? void 0 : spec.option) === null || _a === void 0 ? void 0 : _a.find(function (opt) { return opt.title === specValue; });
                                                    var priceStr = (_b = option === null || option === void 0 ? void 0 : option.price) !== null && _b !== void 0 ? _b : '0';
                                                    var price = parseInt(priceStr, 10);
                                                    return isNaN(price) ? sum : sum + price;
                                                }, 0);
                                                dd.weight = parseFloat((_a = postMD_1.weight) !== null && _a !== void 0 ? _a : '0');
                                                dd.v_height = parseFloat((_b = postMD_1.v_height) !== null && _b !== void 0 ? _b : '0');
                                                dd.v_width = parseFloat((_c = postMD_1.v_width) !== null && _c !== void 0 ? _c : '0');
                                                dd.v_length = parseFloat((_d = postMD_1.v_length) !== null && _d !== void 0 ? _d : '0');
                                                dd.shipment_type = postMD_1.shipment_type;
                                                dd.show_understocking = 'true';
                                                dd.stock = Math.min.apply(Math, dd.spec.map(function (specValue, index) {
                                                    var _a;
                                                    var spec = postMD_1.specs[index];
                                                    var option = (_a = spec === null || spec === void 0 ? void 0 : spec.option) === null || _a === void 0 ? void 0 : _a.find(function (opt) { return opt.title === specValue; });
                                                    var stockStr = option === null || option === void 0 ? void 0 : option.stock;
                                                    if (!stockStr) {
                                                        // 直接檢查 stockStr 是否為空或 undefined
                                                        return Infinity;
                                                    }
                                                    var stock = parseInt(stockStr, 10);
                                                    return isNaN(stock) ? Infinity : stock;
                                                }));
                                                if (dd.stock === Infinity) {
                                                    dd.show_understocking = 'false';
                                                }
                                            });
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        if (!Array.isArray(products_1.data)) return [3 /*break*/, 16];
                        products_1.data = products_1.data.filter(function (dd) {
                            return dd && dd.content;
                        });
                        return [4 /*yield*/, Promise.all(products_1.data.map(processProduct))];
                    case 15:
                        _h.sent();
                        return [3 /*break*/, 18];
                    case 16:
                        if (products_1.data && !products_1.data.content) {
                            products_1.data = undefined;
                        }
                        return [4 /*yield*/, processProduct(products_1.data)];
                    case 17:
                        _h.sent();
                        _h.label = 18;
                    case 18: return [2 /*return*/, products_1];
                    case 19:
                        e_1 = _h.sent();
                        console.error(e_1);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e_1, null);
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.getAllUseVoucher = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var now, allVoucher, validVouchers;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = Date.now();
                        return [4 /*yield*/, this.querySql(["(content->>'$.type'='voucher')"], {
                                page: 0,
                                limit: 10000,
                            })];
                    case 1:
                        allVoucher = (_a.sent()).data
                            .map(function (dd) { return dd.content; })
                            .filter(function (voucher) {
                            var startDate = new Date(voucher.start_ISO_Date).getTime();
                            var endDate = voucher.end_ISO_Date ? new Date(voucher.end_ISO_Date).getTime() : Infinity;
                            return startDate < now && now < endDate;
                        });
                        return [4 /*yield*/, Promise.all(allVoucher.map(function (voucher) { return __awaiter(_this, void 0, void 0, function () {
                                var isLimited;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.checkVoucherLimited(userID, voucher.id)];
                                        case 1:
                                            isLimited = _a.sent();
                                            return [2 /*return*/, isLimited && voucher.status === 1 ? voucher : null];
                                    }
                                });
                            }); }))];
                    case 2:
                        validVouchers = _a.sent();
                        // 過濾出有效的優惠券
                        return [2 /*return*/, validVouchers.filter(Boolean)];
                }
            });
        });
    };
    Shopping.prototype.getDistributionRecommend = function (distribution_code) {
        return __awaiter(this, void 0, void 0, function () {
            var recommends, recommendData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.default.query("SELECT *\n       FROM `".concat(this.app, "`.t_recommend_links"), [])];
                    case 1:
                        recommends = _a.sent();
                        recommendData = recommends
                            .map(function (dd) { return dd.content; }) // 解構獲取 content
                            .filter(function (dd) {
                            var isCode = dd.code === distribution_code;
                            var startDate = new Date(dd.start_ISO_Date || "".concat(dd.startDate, " ").concat(dd.startTime));
                            var endDate = dd.end_ISO_Date
                                ? new Date(dd.end_ISO_Date)
                                : dd.endDate
                                    ? new Date("".concat(dd.endDate, " ").concat(dd.endTime))
                                    : null;
                            var isActive = startDate.getTime() < Date.now() && (!endDate || endDate.getTime() > Date.now());
                            return isCode && isActive;
                        });
                        return [2 /*return*/, recommendData];
                }
            });
        });
    };
    Shopping.prototype.aboutProductVoucher = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            function checkValidProduct(caseName, caseList) {
                switch (caseName) {
                    case 'collection':
                        return caseList.some(function (d1) { return collection.includes(d1); });
                    case 'product':
                        return caseList.some(function (item) { return "".concat(item) === "".concat(id); }); // 確保 id 是字串
                    case 'all':
                        return true;
                    default:
                        return false; // 考慮到未處理的 caseName
                }
            }
            var id, collection, userData, recommendData, voucherList;
            return __generator(this, function (_a) {
                if (!json.product.content) {
                    return [2 /*return*/, []];
                }
                id = "".concat(json.product.id);
                collection = (function () {
                    try {
                        return json.product.content.collection || [];
                    }
                    catch (error) {
                        return [];
                    }
                })();
                userData = json.userData;
                recommendData = json.recommendData;
                voucherList = json.allVoucher
                    .filter(function (dd) {
                    // 訂單來源判斷
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
                    .filter(function (dd) {
                    // 判斷用戶是否為指定客群
                    if (dd.target === 'customer') {
                        return userData && userData.id && dd.targetList.includes(userData.userID);
                    }
                    if (dd.target === 'levels') {
                        if (userData && userData.member) {
                            var find = userData.member.find(function (dd) { return dd.trigger; });
                            return find && dd.targetList.includes(find.id);
                        }
                        return false;
                    }
                    return true; // 所有顧客皆可使用
                })
                    .filter(function (dd) {
                    if (dd.trigger !== 'distribution') {
                        return checkValidProduct(dd.for, dd.forKey);
                    }
                    if (recommendData.length === 0) {
                        return false;
                    }
                    return checkValidProduct(recommendData[0].relative, recommendData[0].relative_data);
                });
                return [2 /*return*/, voucherList];
            });
        });
    };
    Shopping.prototype.querySql = function (conditions, query) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, orderClause, offset, sql, data, total;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        whereClause = conditions.length ? "WHERE ".concat(conditions.join(' AND ')) : '';
                        orderClause = query.order_by || 'ORDER BY id DESC';
                        offset = query.page * query.limit;
                        sql = "\n        SELECT *\n        FROM `".concat(this.app, "`.t_manager_post ").concat(whereClause, " ").concat(orderClause, "\n    ");
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n       FROM (".concat(sql, ") AS subquery LIMIT ?, ?"), [offset, Number(query.limit)])];
                    case 1:
                        data = _a.sent();
                        if (!query.id) return [3 /*break*/, 2];
                        return [2 /*return*/, {
                                data: data[0] || {},
                                result: !!data[0],
                            }];
                    case 2: return [4 /*yield*/, database_js_1.default
                            .query("SELECT COUNT(*) as count\n                FROM `".concat(this.app, "`.t_manager_post ").concat(whereClause), [])
                            .then(function (res) { var _a; return ((_a = res[0]) === null || _a === void 0 ? void 0 : _a.count) || 0; })];
                    case 3:
                        total = _a.sent();
                        return [2 /*return*/, {
                                data: data.map(function (dd) { return (__assign(__assign({}, dd), { content: __assign(__assign({}, dd.content), { id: dd.id }) })); }),
                                total: total,
                            }];
                }
            });
        });
    };
    Shopping.prototype.querySqlBySEO = function (querySql, query) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, data;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sql = "SELECT id, content ->>'$.title' as title, content->>'$.seo' as seo\n               FROM `".concat(this.app, "`.t_manager_post\n               WHERE ").concat(querySql.join(' and '), " ").concat(query.order_by || "order by id desc", "\n    ");
                        if (!query.id) return [3 /*break*/, 2];
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n           FROM (".concat(sql, ") as subqyery\n               limit ").concat(query.page * query.limit, "\n              , ").concat(query.limit), [])];
                    case 1:
                        data = (_b.sent())[0];
                        return [2 /*return*/, { data: data, result: !!data }];
                    case 2:
                        _a = {};
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n           FROM (".concat(sql, ") as subqyery\n               limit ").concat(query.page * query.limit, "\n              , ").concat(query.limit), [])];
                    case 3:
                        _a.data = _b.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT count(1)\n             FROM (".concat(sql, ") as subqyery"), [])];
                    case 4: return [2 /*return*/, (_a.total = (_b.sent())[0]['count(1)'],
                            _a)];
                }
            });
        });
    };
    Shopping.prototype.querySqlByVariants = function (querySql, query) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, limitSQL, data, _a, vData;
            var _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        sql = "\n        SELECT v.id,\n               v.product_id,\n               v.content                                            AS variant_content,\n               CAST(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) AS stock,\n               JSON_EXTRACT(v.content, '$.stockList')               AS stockList\n        FROM `".concat(this.app, "`.t_variants AS v\n        WHERE product_id IN (SELECT id\n                             FROM `").concat(this.app, "`.t_manager_post\n                             WHERE (\n                                       (content ->>'$.product_category' IS NULL) OR\n                                       (content ->>'$.product_category' != 'kitchen')\n                                       ))\n          AND ").concat(querySql.join(' AND '), " ").concat(query.order_by || 'ORDER BY id DESC', "\n    ");
                        query.limit = query.limit && query.limit > 999 ? 999 : query.limit;
                        limitSQL = "limit ".concat(query.page * query.limit, " , ").concat(query.limit);
                        if (!query.id) return [3 /*break*/, 3];
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n           FROM (".concat(sql, ") as subqyery ").concat(limitSQL, "\n          "), [])];
                    case 1:
                        data = (_c.sent())[0];
                        _a = data;
                        return [4 /*yield*/, database_js_1.default.query("select *\n           from `".concat(this.app, "`.t_manager_post\n           where id = ").concat(data.product_id), [])];
                    case 2:
                        _a.product_content = (_c.sent())[0]['content'];
                        return [2 /*return*/, { data: data, result: !!data }];
                    case 3: return [4 /*yield*/, database_js_1.default.query("SELECT *\n         FROM (".concat(sql, ") as subqyery ").concat(limitSQL, "\n        "), [])];
                    case 4:
                        vData = _c.sent();
                        return [4 /*yield*/, Promise.all(vData.map(function (data) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = data;
                                            return [4 /*yield*/, database_js_1.default.query("select *\n               from `".concat(this.app, "`.t_manager_post\n               where id = ").concat(data.product_id), [])];
                                        case 1:
                                            _a.product_content = (_b.sent())[0]['content'];
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 5:
                        _c.sent();
                        _b = {
                            data: vData
                        };
                        return [4 /*yield*/, database_js_1.default.query("SELECT count(1)\n             FROM (".concat(sql, ") as subqyery\n            "), [])];
                    case 6: return [2 /*return*/, (_b.total = (_c.sent())[0]['count(1)'],
                            _b)];
                }
            });
        });
    };
    Shopping.prototype.deleteProduct = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("DELETE\n         FROM `".concat(this.app, "`.t_manager_post\n         WHERE id in (?)"), [query.id.split(',')])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                result: true,
                            }];
                    case 2:
                        e_2 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'DeleteProduct Error:' + e_2, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.deleteVoucher = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("DELETE\n         FROM `".concat(this.app, "`.t_manager_post\n         WHERE id in (?)"), [query.id.split(',')])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                result: true,
                            }];
                    case 2:
                        e_3 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'DeleteVoucher Error:' + e_3, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.linePay = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var keyData, config;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                        appName: this.app,
                                        key: 'glitter_finance',
                                    })];
                                case 1:
                                    keyData = (_a.sent())[0].value.line_pay_scan;
                                    config = {
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
                                        .then(function (response) {
                                        resolve(response.data.returnCode === '0000');
                                    })
                                        .catch(function (error) {
                                        resolve(false);
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Shopping.prototype.getShippingMethod = function () {
        return __awaiter(this, void 0, void 0, function () {
            var shipment_setting;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                            var config, e_4;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                                appName: this.app,
                                                key: 'logistics_setting',
                                            })];
                                    case 1:
                                        config = _a.sent();
                                        // 如果 config 為空，則返回預設值
                                        if (!config) {
                                            return [2 /*return*/, {
                                                    support: [],
                                                    shipmentSupport: [],
                                                }];
                                        }
                                        // 返回第一個元素的 value 屬性
                                        return [2 /*return*/, config[0].value];
                                    case 2:
                                        e_4 = _a.sent();
                                        // 發生錯誤時返回空陣列
                                        return [2 /*return*/, []];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })()];
                    case 1:
                        shipment_setting = _b.sent();
                        return [2 /*return*/, [
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
                                .concat(((_a = shipment_setting.custom_delivery) !== null && _a !== void 0 ? _a : []).map(function (dd) {
                                return {
                                    form: dd.form,
                                    name: dd.name,
                                    value: dd.id,
                                };
                            }))
                                .filter(function (d1) {
                                return shipment_setting.support.find(function (d2) {
                                    return d2 === d1.value;
                                });
                            })];
                }
            });
        });
    };
    Shopping.prototype.getPostAddressData = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        url = "http://zip5.5432.tw/zip5json.py?adrs=".concat(encodeURIComponent(address));
                        return [4 /*yield*/, axios_1.default.get(url)];
                    case 1:
                        response = _a.sent();
                        // 確保回應包含 JSON 資料
                        if (response && response.data) {
                            return [2 /*return*/, response.data]; // 返回 JSON 資料
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error fetching data:', error_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.updateExhibitionActiveStock = function (exh_id, v_id, count) {
        return __awaiter(this, void 0, void 0, function () {
            var _user, exhibitionConfig, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        _user = new user_js_1.User(this.app);
                        return [4 /*yield*/, _user.getConfigV2({ key: 'exhibition_manager', user_id: 'manager' })];
                    case 1:
                        exhibitionConfig = _a.sent();
                        if (!(exhibitionConfig.list && exhibitionConfig.list.length > 0)) return [3 /*break*/, 3];
                        exhibitionConfig.list.forEach(function (exhibition) {
                            if (exhibition.id === exh_id) {
                                exhibition.dataList.forEach(function (item) {
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
                        return [4 /*yield*/, _user.setConfig({
                                key: 'exhibition_manager',
                                user_id: 'manager',
                                value: exhibitionConfig,
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error updateExhibitionActiveStock:', error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.getShipmentRefer = function (user_info) {
        return __awaiter(this, void 0, void 0, function () {
            var def, refer, _a;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        user_info = user_info || {};
                        return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                appName: this.app,
                                key: 'glitter_shipment',
                            })];
                    case 1:
                        def = ((_b = (_e.sent())[0]) !== null && _b !== void 0 ? _b : {
                            value: {
                                volume: [],
                                weight: [],
                                selectCalc: 'volume',
                            },
                        }).value;
                        if (!(user_info.shipment === 'global_express')) return [3 /*break*/, 3];
                        return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                appName: this.app,
                                key: 'glitter_shipment_global_' + user_info.country,
                            })];
                    case 2:
                        _a = ((_c = (_e.sent())[0]) !== null && _c !== void 0 ? _c : {
                            value: {
                                volume: [],
                                weight: [],
                                selectCalc: 'volume',
                            },
                        }).value;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                            appName: this.app,
                            key: 'glitter_shipment_' + user_info.shipment,
                        })];
                    case 4:
                        _a = ((_d = (_e.sent())[0]) !== null && _d !== void 0 ? _d : {
                            value: {
                                volume: [],
                                weight: [],
                                selectCalc: 'def',
                            },
                        }).value;
                        _e.label = 5;
                    case 5:
                        refer = _a;
                        if (refer.selectCalc !== 'def') {
                            def = refer;
                        }
                        return [2 /*return*/, def];
                }
            });
        });
    };
    Shopping.prototype.calculateShipment = function (dataList, value) {
        if (value === 0) {
            return 0;
        }
        var productValue = parseFloat("".concat(value));
        if (isNaN(productValue) || dataList.length === 0) {
            return 0;
        }
        for (var i = 0; i < dataList.length; i++) {
            var currentKey = parseFloat(dataList[i].key);
            var currentValue = parseFloat(dataList[i].value);
            if (productValue < currentKey) {
                return i === 0 ? 0 : parseFloat(dataList[i - 1].value);
            }
            else if (productValue === currentKey) {
                return currentValue;
            }
        }
        // 如果商品值大於所有的key，返回最後一個value
        return parseInt(dataList[dataList.length - 1].value);
    };
    Shopping.prototype.getShipmentFee = function (user_info, lineItems, shipment) {
        if ((user_info === null || user_info === void 0 ? void 0 : user_info.shipment) === 'now')
            return 0;
        var total_volume = 0;
        var total_weight = 0;
        lineItems.map(function (item) {
            if (item.shipment_obj.type === 'volume') {
                total_volume += item.shipment_obj.value;
            }
            if (item.shipment_obj.type === 'weight') {
                total_weight += item.shipment_obj.value;
            }
        });
        return (this.calculateShipment(shipment.volume, total_volume) + this.calculateShipment(shipment.weight, total_weight));
    };
    Shopping.prototype.toCheckout = function (data_1) {
        return __awaiter(this, arguments, void 0, function (data, type, replace_order_id) {
            // 更新庫存的輔助函數
            function updateStock(variant, deductionLog) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        Object.keys(deductionLog).forEach(function (key) {
                            try {
                                variant.stockList[key].count += deductionLog[key];
                            }
                            catch (e) {
                                console.error("Error updating stock for variant ".concat(variant.id, ":"), e);
                            }
                        });
                        return [2 /*return*/];
                    });
                });
            }
            // 取得 Variant 物件
            function getVariant(prod, item) {
                var _a;
                if (prod.product_category === 'kitchen') {
                    var price = 0;
                    var show_understocking_1 = false;
                    var stock_2 = Infinity;
                    if (prod.specs.length) {
                        price = item.spec.reduce(function (total, spec, index) {
                            var dpe = prod.specs[index].option.find(function (dd) { return dd.title === spec; });
                            if (dpe) {
                                var currentStock = Number(dpe.stock) || Infinity;
                                stock_2 = Math.min(stock_2, currentStock);
                                if (dpe.stock !== undefined) {
                                    show_understocking_1 = true;
                                }
                                return total + (Number(dpe.price) || 0);
                            }
                            return total;
                        }, 0);
                    }
                    else {
                        price = Number(prod.price) || 0;
                        show_understocking_1 = Boolean((_a = prod.stock) !== null && _a !== void 0 ? _a : '');
                        stock_2 = Number(prod.stock) || 0;
                    }
                    if (stock_2 === Infinity) {
                        show_understocking_1 = false;
                    }
                    return {
                        sku: '',
                        spec: [],
                        type: 'variants',
                        stock: stock_2,
                        v_width: 0,
                        product_id: prod.id,
                        sale_price: price,
                        origin_price: 0,
                        compare_price: 0,
                        preview_image: prod.preview_image && prod.preview_image[0],
                        shipment_type: 'none',
                        show_understocking: String(show_understocking_1), // 保持原本的 string 格式
                    };
                }
                else {
                    return prod.variants.find(function (dd) { return dd.spec.join('-') === item.spec.join('-'); });
                }
            }
            // 驗證消費金額能否使用此金物流
            function getCartFormulaPass(keyData) {
                var data = keyData.cartSetting;
                if (!data || data.orderFormula === undefined)
                    return true;
                var formulaSet = new Set(data.orderFormula);
                var total = carData_1.total -
                    (formulaSet.has('shipment_fee') ? 0 : carData_1.shipment_fee) +
                    (formulaSet.has('discount') || !carData_1.discount ? 0 : carData_1.discount) +
                    (formulaSet.has('use_rebate') ? 0 : carData_1.use_rebate);
                return (!data.minimumTotal || total >= data.minimumTotal) && (!data.maximumTotal || total <= data.maximumTotal);
            }
            var utTimer, checkPoint, userClass_1, rebateClass, checkoutPayment_1, scheduledData_1, orderData, _a, lineItems, user_info, code, customer_info, use_rebate, order, _loop_1, this_1, _i, _b, b, hasAuthentication, checkOutType_1, getUserDataAsync, userData_2, appStatus, userRebate, sum, shipment, shipment_setting_1, _c, _d, languageInfo, carData_1, _e, name_1, phone, add_on_items_1, gift_product_1, saveStockArray_1, _f, maxProductMap, hasMaxProduct, _g, _h, product, cartTokenSQL, soldHistory, purchaseHistory, _j, soldHistory_1, history_1, pid, _k, _l, item, f_rebate, userRebate, linkList, content, c_carData_1, can_add_gift_1, _loop_2, _m, _o, giveawayData, configData, keyData_1, defaultPayArray_1, subtotal_1, excludedValuesByTotal_1, excludedValuesByWeight_1, isExcludedByTotal_1, isExcludedByWeight_1, isIncludedInDesignatedLogistics_1, _p, _q, voucher, sum, tempVoucher, customerData, emailList, _r, emailList_1, email, manualVoucher, trans, payTotal, _s, _t, _u, email, id, redirect_url, keyData_2, kd, _v, subMitData, _w, _x, phone, sns, line, _y, _z, email, e_5;
            var _this = this;
            var _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35;
            if (type === void 0) { type = 'add'; }
            return __generator(this, function (_36) {
                switch (_36.label) {
                    case 0:
                        _36.trys.push([0, 90, , 91]);
                        utTimer = new ut_timer_js_1.UtTimer('TO-CHECKOUT');
                        checkPoint = utTimer.checkPoint;
                        userClass_1 = new user_js_1.User(this.app);
                        rebateClass = new rebate_js_1.Rebate(this.app);
                        checkoutPayment_1 = (_0 = data.user_info) === null || _0 === void 0 ? void 0 : _0.payment;
                        // 確認預設值
                        data.line_items = (_1 = (data.line_items || data.lineItems)) !== null && _1 !== void 0 ? _1 : [];
                        data.isExhibition = data.checkOutType === 'POS' && ((_3 = (_2 = data.pos_store) === null || _2 === void 0 ? void 0 : _2.includes('exhibition_')) !== null && _3 !== void 0 ? _3 : false);
                        if (!replace_order_id) return [3 /*break*/, 3];
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n             FROM `".concat(this.app, "`.t_checkout\n             WHERE cart_token = ?\n               AND status = 0;\n            "), [replace_order_id])];
                    case 1:
                        orderData = (_36.sent())[0];
                        if (!orderData) {
                            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error: Cannot find this orderID', null);
                        }
                        // 刪除指定的訂單記錄
                        return [4 /*yield*/, database_js_1.default.query("DELETE\n           FROM `".concat(this.app, "`.t_checkout\n           WHERE cart_token = ?\n             AND status = 0;\n          "), [replace_order_id])];
                    case 2:
                        // 刪除指定的訂單記錄
                        _36.sent();
                        _a = orderData.orderData, lineItems = _a.lineItems, user_info = _a.user_info, code = _a.code, customer_info = _a.customer_info, use_rebate = _a.use_rebate;
                        data.line_items = lineItems;
                        data.email = orderData.email;
                        data.user_info = user_info;
                        data.code = code;
                        data.customer_info = customer_info;
                        data.use_rebate = use_rebate;
                        _36.label = 3;
                    case 3:
                        if (!(data.order_id && type === 'POS')) return [3 /*break*/, 8];
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n             FROM `".concat(this.app, "`.t_checkout\n             WHERE cart_token = ?\n            "), [data.order_id])];
                    case 4:
                        order = (_36.sent())[0];
                        if (!order) return [3 /*break*/, 8];
                        _loop_1 = function (b) {
                            var pdDqlData, pd, variant;
                            return __generator(this, function (_37) {
                                switch (_37.label) {
                                    case 0: return [4 /*yield*/, this_1.getProduct({
                                            page: 0,
                                            limit: 50,
                                            id: b.id,
                                            status: 'inRange',
                                            channel: data.checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
                                            whereStore: data.checkOutType === 'POS' ? data.pos_store : undefined,
                                        })];
                                    case 1:
                                        pdDqlData = (_37.sent()).data;
                                        pd = pdDqlData.content;
                                        variant = pd.variants.find(function (dd) { return dd.spec.join('-') === b.spec.join('-'); });
                                        // 更新庫存
                                        return [4 /*yield*/, updateStock(variant, b.deduction_log)];
                                    case 2:
                                        // 更新庫存
                                        _37.sent();
                                        // 更新變體資訊
                                        return [4 /*yield*/, this_1.updateVariantsWithSpec(variant, b.id, b.spec)];
                                    case 3:
                                        // 更新變體資訊
                                        _37.sent();
                                        // 更新資料庫中的商品內容
                                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this_1.app, "`.t_manager_post\n               SET content = ?\n               WHERE id = ?\n              "), [JSON.stringify(pd), pdDqlData.id])];
                                    case 4:
                                        // 更新資料庫中的商品內容
                                        _37.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _b = order.orderData.lineItems;
                        _36.label = 5;
                    case 5:
                        if (!(_i < _b.length)) return [3 /*break*/, 8];
                        b = _b[_i];
                        return [5 /*yield**/, _loop_1(b)];
                    case 6:
                        _36.sent();
                        _36.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8:
                        // 判斷是checkOutType 是POS則清空token，因為結帳對象不是結帳人
                        if (data.checkOutType === 'POS') {
                            this.token = undefined;
                        }
                        hasAuthentication = function (data) {
                            return ((_this.token && _this.token.userID) ||
                                data.email ||
                                (data.user_info && data.user_info.email) ||
                                (data.user_info && data.user_info.phone));
                        };
                        // 電話信箱擇一
                        if (type !== 'preview' && !hasAuthentication(data)) {
                            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error: No email and phone', null);
                        }
                        checkOutType_1 = (_4 = data.checkOutType) !== null && _4 !== void 0 ? _4 : 'manual';
                        getUserDataAsync = function (type, token, data) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        // 檢查預覽模式下的條件
                                        if (type === 'preview' &&
                                            !((token === null || token === void 0 ? void 0 : token.userID) || (data.user_info && data.user_info.email) || (data.user_info && data.user_info.phone))) {
                                            return [2 /*return*/, {}];
                                        }
                                        if (!((token === null || token === void 0 ? void 0 : token.userID) && type !== 'POS' && checkOutType_1 !== 'POS')) return [3 /*break*/, 2];
                                        return [4 /*yield*/, userClass_1.getUserData("".concat(token.userID), 'userID')];
                                    case 1: return [2 /*return*/, _d.sent()];
                                    case 2:
                                        _b = data.user_info.email;
                                        if (!_b) return [3 /*break*/, 4];
                                        return [4 /*yield*/, userClass_1.getUserData(data.user_info.email, 'email_or_phone')];
                                    case 3:
                                        _b = (_d.sent());
                                        _d.label = 4;
                                    case 4:
                                        _a = (_b);
                                        if (_a) return [3 /*break*/, 7];
                                        _c = data.user_info.phone;
                                        if (!_c) return [3 /*break*/, 6];
                                        return [4 /*yield*/, userClass_1.getUserData(data.user_info.phone, 'email_or_phone')];
                                    case 5:
                                        _c = (_d.sent());
                                        _d.label = 6;
                                    case 6:
                                        _a = (_c);
                                        _d.label = 7;
                                    case 7: 
                                    // 否則根據 email 或電話獲取數據
                                    return [2 /*return*/, (_a ||
                                            {})];
                                }
                            });
                        }); };
                        checkPoint('check user auth');
                        return [4 /*yield*/, getUserDataAsync(type, this.token, data)];
                    case 9:
                        userData_2 = _36.sent();
                        // 取得使用者 Email 或電話
                        data.email = ((_5 = userData_2 === null || userData_2 === void 0 ? void 0 : userData_2.userData) === null || _5 === void 0 ? void 0 : _5.email) || ((_6 = userData_2 === null || userData_2 === void 0 ? void 0 : userData_2.userData) === null || _6 === void 0 ? void 0 : _6.phone) || '';
                        // 如果 email 無效，嘗試從 user_info 取得
                        if (!data.email || data.email === 'no-email') {
                            data.email =
                                ((_7 = data.user_info) === null || _7 === void 0 ? void 0 : _7.email) && data.user_info.email !== 'no-email'
                                    ? data.user_info.email
                                    : ((_8 = data.user_info) === null || _8 === void 0 ? void 0 : _8.phone) || '';
                        }
                        // 若 email 仍無效，且非預覽模式，設置預設值
                        if (!data.email && type !== 'preview') {
                            data.email = 'no-email';
                        }
                        return [4 /*yield*/, rebateClass.mainStatus()];
                    case 10:
                        appStatus = _36.sent();
                        if (!(appStatus && userData_2 && data.use_rebate && data.use_rebate > 0)) return [3 /*break*/, 12];
                        return [4 /*yield*/, rebateClass.getOneRebate({ user_id: userData_2.userID })];
                    case 11:
                        userRebate = _36.sent();
                        sum = userRebate ? userRebate.point : 0;
                        if (sum < data.use_rebate) {
                            data.use_rebate = 0;
                        }
                        return [3 /*break*/, 13];
                    case 12:
                        data.use_rebate = 0;
                        _36.label = 13;
                    case 13:
                        checkPoint('check rebate');
                        return [4 /*yield*/, this.getShipmentRefer(data.user_info)];
                    case 14:
                        shipment = _36.sent();
                        return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                var config, e_6;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                                    appName: this.app,
                                                    key: 'logistics_setting',
                                                })];
                                        case 1:
                                            config = _a.sent();
                                            // 如果 config 為空，則返回預設值
                                            if (!config) {
                                                return [2 /*return*/, {
                                                        support: [],
                                                        shipmentSupport: [],
                                                    }];
                                            }
                                            // 返回第一個元素的 value 屬性
                                            return [2 /*return*/, config[0].value];
                                        case 2:
                                            e_6 = _a.sent();
                                            // 發生錯誤時返回空陣列
                                            return [2 /*return*/, []];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })()];
                    case 15:
                        shipment_setting_1 = _36.sent();
                        checkPoint('set shipment');
                        // 確保自訂配送表單的配置
                        _c = shipment_setting_1;
                        if (!shipment_setting_1.custom_delivery) return [3 /*break*/, 17];
                        return [4 /*yield*/, Promise.all(shipment_setting_1.custom_delivery.map(function (form) { return __awaiter(_this, void 0, void 0, function () {
                                var config;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, new user_js_1.User(this.app).getConfigV2({
                                                user_id: 'manager',
                                                key: "form_delivery_".concat(form.id),
                                            })];
                                        case 1:
                                            config = _a.sent();
                                            form.form = config.list || [];
                                            return [2 /*return*/, form];
                                    }
                                });
                            }); })).then(function (dataArray) { return dataArray; })];
                    case 16:
                        _d = _36.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        _d = [];
                        _36.label = 18;
                    case 18:
                        // 確保自訂配送表單的配置
                        _c.custom_delivery = _d;
                        // 確保 support 是一個陣列
                        shipment_setting_1.support = (_9 = shipment_setting_1.support) !== null && _9 !== void 0 ? _9 : [];
                        languageInfo = (_11 = (_10 = shipment_setting_1.language_data) === null || _10 === void 0 ? void 0 : _10[data.language]) === null || _11 === void 0 ? void 0 : _11.info;
                        shipment_setting_1.info = languageInfo !== null && languageInfo !== void 0 ? languageInfo : shipment_setting_1.info;
                        carData_1 = {
                            customer_info: data.customer_info || {},
                            lineItems: [],
                            total: 0,
                            email: (_14 = (_12 = data.email) !== null && _12 !== void 0 ? _12 : (_13 = data.user_info) === null || _13 === void 0 ? void 0 : _13.email) !== null && _14 !== void 0 ? _14 : '',
                            user_info: data.user_info,
                            shipment_fee: 0,
                            rebate: 0,
                            goodsWeight: 0,
                            use_rebate: data.use_rebate || 0,
                            orderID: data.order_id || "".concat(Date.now()),
                            shipment_support: shipment_setting_1.support,
                            shipment_info: shipment_setting_1.info,
                            shipment_selector: __spreadArray(__spreadArray([], shipment_config_js_1.ShipmentConfig.list.map(function (dd) { return ({
                                name: dd.title,
                                value: dd.value,
                            }); }), true), ((_15 = shipment_setting_1.custom_delivery) !== null && _15 !== void 0 ? _15 : []).map(function (dd) { return ({
                                form: dd.form,
                                name: dd.name,
                                value: dd.id,
                                system_form: dd.system_form,
                            }); }), true).filter(function (option) { return shipment_setting_1.support.includes(option.value); }),
                            use_wallet: 0,
                            method: (_16 = data.user_info) === null || _16 === void 0 ? void 0 : _16.method,
                            user_email: (_20 = (_18 = (_17 = userData_2 === null || userData_2 === void 0 ? void 0 : userData_2.account) !== null && _17 !== void 0 ? _17 : data.email) !== null && _18 !== void 0 ? _18 : (_19 = data.user_info) === null || _19 === void 0 ? void 0 : _19.email) !== null && _20 !== void 0 ? _20 : '',
                            useRebateInfo: { point: 0 },
                            custom_form_format: data.custom_form_format,
                            custom_form_data: data.custom_form_data,
                            custom_receipt_form: data.custom_receipt_form,
                            orderSource: checkOutType_1 === 'POS' ? 'POS' : '',
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
                        if (!((_21 = data.user_info) === null || _21 === void 0 ? void 0 : _21.name) && userData_2 && userData_2.userData) {
                            _e = userData_2.userData, name_1 = _e.name, phone = _e.phone;
                            carData_1.user_info = __assign(__assign({}, carData_1.user_info), { name: name_1, phone: phone });
                        }
                        add_on_items_1 = [];
                        gift_product_1 = [];
                        saveStockArray_1 = [];
                        _f = data;
                        return [4 /*yield*/, Promise.all(data.line_items.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var getProductData, content_2, variant_1, count, isPOS, isUnderstockingVisible, isManualType, shipmentValue, sql, scheduledDataQuery, content_3, productData, variantData, remainingStock, returnData;
                                var _a;
                                var _this = this;
                                var _b, _c, _d, _e, _f;
                                return __generator(this, function (_g) {
                                    switch (_g.label) {
                                        case 0: return [4 /*yield*/, this.getProduct({
                                                page: 0,
                                                limit: 1,
                                                id: "".concat(item.id),
                                                status: 'inRange',
                                                channel: checkOutType_1 === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
                                                whereStore: checkOutType_1 === 'POS' ? data.pos_store : undefined,
                                                setUserID: "".concat((userData_2 === null || userData_2 === void 0 ? void 0 : userData_2.userID) || ''),
                                            })];
                                        case 1:
                                            getProductData = (_g.sent()).data;
                                            if (!getProductData) return [3 /*break*/, 13];
                                            content_2 = getProductData.content;
                                            variant_1 = getVariant(content_2, item);
                                            count = Number(item.count);
                                            if (!((Number.isInteger(variant_1.stock) || variant_1.show_understocking === 'false') &&
                                                !isNaN(count) &&
                                                count > 0)) return [3 /*break*/, 12];
                                            isPOS = checkOutType_1 === 'POS';
                                            isUnderstockingVisible = variant_1.show_understocking !== 'false';
                                            isManualType = type === 'manual' || type === 'manual-preview';
                                            if (isPOS && isUnderstockingVisible && !data.isExhibition) {
                                                variant_1.stock = ((_c = (_b = variant_1.stockList) === null || _b === void 0 ? void 0 : _b[data.pos_store]) === null || _c === void 0 ? void 0 : _c.count) || 0;
                                            }
                                            if (variant_1.stock < item.count && isUnderstockingVisible && !isManualType) {
                                                if (isPOS) {
                                                    item.pre_order = true;
                                                }
                                                else {
                                                    item.count = variant_1.stock;
                                                }
                                            }
                                            if (!(variant_1 && item.count > 0)) return [3 /*break*/, 5];
                                            Object.assign(item, {
                                                specs: content_2.specs,
                                                language_data: content_2.language_data,
                                                product_category: content_2.product_category,
                                                preview_image: variant_1.preview_image || content_2.preview_image[0],
                                                title: content_2.title,
                                                sale_price: variant_1.sale_price,
                                                origin_price: variant_1.origin_price,
                                                collection: content_2.collection,
                                                sku: variant_1.sku,
                                                stock: variant_1.stock,
                                                show_understocking: variant_1.show_understocking,
                                                stockList: variant_1.stockList,
                                                weight: parseInt(variant_1.weight || '0', 10),
                                                designated_logistics: (_d = content_2.designated_logistics) !== null && _d !== void 0 ? _d : { type: 'all', list: [] },
                                            });
                                            shipmentValue = (function () {
                                                if (!variant_1.shipment_type || variant_1.shipment_type === 'none')
                                                    return 0;
                                                if (variant_1.shipment_type === 'weight') {
                                                    return item.count * variant_1.weight;
                                                }
                                                if (variant_1.shipment_type === 'volume') {
                                                    return item.count * variant_1.v_length * variant_1.v_width * variant_1.v_height;
                                                }
                                                return 0;
                                            })();
                                            item.shipment_obj = {
                                                type: variant_1.shipment_type,
                                                value: shipmentValue,
                                            };
                                            variant_1.shipment_weight = parseInt(variant_1.shipment_weight || '0', 10);
                                            carData_1.lineItems.push(item);
                                            if (!(checkOutType_1 == 'group_buy')) return [3 /*break*/, 4];
                                            if (!!scheduledData_1) return [3 /*break*/, 3];
                                            sql = "WHERE JSON_CONTAINS(content->'$.pending_order', '\"".concat(data.temp_cart_id, "\"'");
                                            scheduledDataQuery = "\n                        SELECT *\n                        FROM `".concat(this.app, "`.`t_live_purchase_interactions` ").concat(sql, ");\n                    ");
                                            return [4 /*yield*/, database_js_1.default.query(scheduledDataQuery, [])];
                                        case 2:
                                            scheduledData_1 = (_g.sent())[0];
                                            if (scheduledData_1) {
                                                content_3 = scheduledData_1.content;
                                                productData = content_3.item_list.find(function (pb) { return pb.id === item.id; });
                                                if (productData) {
                                                    variantData = productData.content.variants.find(function (dd) { return dd.spec.join('-') === item.spec.join('-'); });
                                                    if (variantData) {
                                                        item.sale_price = variantData.live_model.live_price;
                                                        carData_1.total += item.sale_price * item.count;
                                                    }
                                                }
                                            }
                                            _g.label = 3;
                                        case 3: return [3 /*break*/, 5];
                                        case 4:
                                            if (type !== 'manual') {
                                                if (content_2.productType.giveaway) {
                                                    variant_1.sale_price = 0;
                                                }
                                                else {
                                                    carData_1.total += variant_1.sale_price * item.count;
                                                }
                                            }
                                            _g.label = 5;
                                        case 5:
                                            if (!(!['preview', 'manual', 'manual-preview'].includes(type) && variant_1.show_understocking !== 'false')) return [3 /*break*/, 12];
                                            remainingStock = Math.max(variant_1.stock - item.count, 0);
                                            variant_1.stock = remainingStock;
                                            if (!(type === 'POS')) return [3 /*break*/, 10];
                                            if (!data.isExhibition) return [3 /*break*/, 8];
                                            if (!data.pos_store) return [3 /*break*/, 7];
                                            return [4 /*yield*/, this.updateExhibitionActiveStock(data.pos_store, variant_1.variant_id, item.count)];
                                        case 6:
                                            _g.sent();
                                            _g.label = 7;
                                        case 7: return [3 /*break*/, 9];
                                        case 8:
                                            variant_1.deduction_log = (_a = {}, _a[data.pos_store] = item.count, _a);
                                            variant_1.stockList[data.pos_store].count -= item.count;
                                            item.deduction_log = variant_1.deduction_log;
                                            _g.label = 9;
                                        case 9: return [3 /*break*/, 11];
                                        case 10:
                                            returnData = new stock_1.Stock(this.app, this.token).allocateStock(variant_1.stockList, item.count);
                                            variant_1.deduction_log = returnData.deductionLog;
                                            item.deduction_log = returnData.deductionLog;
                                            _g.label = 11;
                                        case 11:
                                            saveStockArray_1.push(function () {
                                                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                                    var sql, scheduledDataQuery, content_4, productData, variantData, stockService, _a, stockList, deductionLog, store_config, error_3;
                                                    var _b;
                                                    var _c;
                                                    return __generator(this, function (_d) {
                                                        switch (_d.label) {
                                                            case 0:
                                                                _d.trys.push([0, 14, , 15]);
                                                                if (!(data.checkOutType == 'group_buy')) return [3 /*break*/, 5];
                                                                if (!!scheduledData_1) return [3 /*break*/, 2];
                                                                sql = "WHERE JSON_CONTAINS(content->'$.pending_order', '\"".concat(data.temp_cart_id, "\"'");
                                                                scheduledDataQuery = "\n                                SELECT *\n                                FROM `".concat(this.app, "`.`t_live_purchase_interactions` ").concat(sql, ");\n                            ");
                                                                return [4 /*yield*/, database_js_1.default.query(scheduledDataQuery, [])];
                                                            case 1:
                                                                scheduledData_1 = (_d.sent())[0];
                                                                _d.label = 2;
                                                            case 2:
                                                                if (!scheduledData_1) return [3 /*break*/, 4];
                                                                content_4 = scheduledData_1.content;
                                                                productData = content_4.item_list.find(function (pb) { return pb.id === item.id; });
                                                                if (!productData) return [3 /*break*/, 4];
                                                                variantData = productData.content.variants.find(function (dd) { return dd.spec.join('-') === item.spec.join('-'); });
                                                                if (!variantData) return [3 /*break*/, 4];
                                                                stockService = new stock_1.Stock(this.app, this.token);
                                                                _a = stockService.allocateStock(variantData.stockList, item.count), stockList = _a.stockList, deductionLog = _a.deductionLog;
                                                                variantData.stockList = stockList;
                                                                item.deduction_log = deductionLog;
                                                                carData_1.scheduled_id = scheduledData_1.id;
                                                                // Update variants for scheduled data
                                                                return [4 /*yield*/, this.updateVariantsForScheduled(content_4, scheduledData_1.id)];
                                                            case 3:
                                                                // Update variants for scheduled data
                                                                _d.sent();
                                                                _d.label = 4;
                                                            case 4: return [3 /*break*/, 13];
                                                            case 5:
                                                                if (!content_2.shopee_id) return [3 /*break*/, 7];
                                                                return [4 /*yield*/, new shopee_1.Shopee(this.app, this.token).asyncStockToShopee({
                                                                        product: getProductData,
                                                                        callback: function () { },
                                                                    })];
                                                            case 6:
                                                                _d.sent();
                                                                _d.label = 7;
                                                            case 7:
                                                                if (!(content_2.product_category === 'kitchen' && ((_c = variant_1.spec) === null || _c === void 0 ? void 0 : _c.length))) return [3 /*break*/, 9];
                                                                // 餐廳類別的庫存處理方式
                                                                variant_1.spec.forEach(function (d1, index) {
                                                                    var option = content_2.specs[index].option.find(function (d2) { return d2.title === d1; });
                                                                    if ((option === null || option === void 0 ? void 0 : option.stock) !== undefined) {
                                                                        option.stock = parseInt(option.stock, 10) - item.count;
                                                                    }
                                                                });
                                                                return [4 /*yield*/, userClass_1.getConfigV2({
                                                                        key: 'store_manager',
                                                                        user_id: 'manager',
                                                                    })];
                                                            case 8:
                                                                store_config = _d.sent();
                                                                item.deduction_log = (_b = {}, _b[store_config.list[0].id] = item.count, _b);
                                                                return [3 /*break*/, 11];
                                                            case 9: return [4 /*yield*/, this.updateVariantsWithSpec(variant_1, item.id, item.spec)];
                                                            case 10:
                                                                _d.sent();
                                                                _d.label = 11;
                                                            case 11: 
                                                            // 更新資料庫
                                                            return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.`t_manager_post`\n                             SET ?\n                             WHERE id = ").concat(getProductData.id), [{ content: JSON.stringify(content_2) }])];
                                                            case 12:
                                                                // 更新資料庫
                                                                _d.sent();
                                                                _d.label = 13;
                                                            case 13:
                                                                // 如果有 shopee_id，則同步庫存至蝦皮（Todo: 需要新增是否同步的選項）
                                                                resolve(true);
                                                                return [3 /*break*/, 15];
                                                            case 14:
                                                                error_3 = _d.sent();
                                                                reject(error_3);
                                                                return [3 /*break*/, 15];
                                                            case 15: return [2 /*return*/];
                                                        }
                                                    });
                                                }); });
                                            });
                                            _g.label = 12;
                                        case 12:
                                            Object.assign(item, {
                                                is_add_on_items: content_2.productType.addProduct && !content_2.productType.product,
                                                is_hidden: content_2.visible === 'false',
                                                is_gift: content_2.productType.giveaway,
                                                sale_price: content_2.productType.giveaway ? 0 : item.sale_price,
                                                min_qty: (_e = content_2.min_qty) !== null && _e !== void 0 ? _e : item.min_qty,
                                                max_qty: (_f = content_2.max_qty) !== null && _f !== void 0 ? _f : item.max_qty,
                                            });
                                            // 推入對應的陣列
                                            item.is_add_on_items && add_on_items_1.push(item);
                                            item.is_gift && gift_product_1.push(item);
                                            _g.label = 13;
                                        case 13: return [2 /*return*/, item];
                                    }
                                });
                            }); })).then(function (dataArray) { return dataArray; })];
                    case 19:
                        _f.line_items = _36.sent();
                        checkPoint('get product info');
                        maxProductMap = new Map();
                        hasMaxProduct = false;
                        for (_g = 0, _h = data.line_items; _g < _h.length; _g++) {
                            product = _h[_g];
                            if (product.max_qty && product.max_qty > 0) {
                                maxProductMap.set(product.id, true);
                                hasMaxProduct = true;
                            }
                        }
                        if (!(hasMaxProduct && data.email !== 'no-email')) return [3 /*break*/, 21];
                        cartTokenSQL = "\n            SELECT cart_token\n            FROM `".concat(this.app, "`.t_checkout\n            WHERE email IN (").concat([-99, (_22 = userData_2 === null || userData_2 === void 0 ? void 0 : userData_2.userData) === null || _22 === void 0 ? void 0 : _22.email, (_23 = userData_2 === null || userData_2 === void 0 ? void 0 : userData_2.userData) === null || _23 === void 0 ? void 0 : _23.phone]
                            .filter(Boolean)
                            .map(function (item) { return database_js_1.default.escape(item); })
                            .join(','), ")\n              AND order_status <> '-1'\n        ");
                        return [4 /*yield*/, database_js_1.default.query("\n              SELECT *\n              FROM `".concat(this.app, "`.t_products_sold_history\n              WHERE product_id IN (").concat(__spreadArray([], maxProductMap.keys(), true).join(','), ")\n                AND order_id IN (").concat(cartTokenSQL, ")\n          "), [])];
                    case 20:
                        soldHistory = _36.sent();
                        purchaseHistory = new Map();
                        for (_j = 0, soldHistory_1 = soldHistory; _j < soldHistory_1.length; _j++) {
                            history_1 = soldHistory_1[_j];
                            pid = Number(history_1.product_id);
                            purchaseHistory.set(pid, ((_24 = purchaseHistory.get(pid)) !== null && _24 !== void 0 ? _24 : 0) + history_1.count);
                        }
                        // 更新當前訂單項目的歷史購買數量
                        for (_k = 0, _l = data.line_items; _k < _l.length; _k++) {
                            item = _l[_k];
                            if (maxProductMap.has(item.id)) {
                                item.buy_history_count = purchaseHistory.get(item.id) || 0;
                            }
                        }
                        _36.label = 21;
                    case 21:
                        checkPoint('set max product');
                        carData_1.shipment_fee = this.getShipmentFee(data.user_info, carData_1.lineItems, shipment);
                        carData_1.total += carData_1.shipment_fee;
                        return [4 /*yield*/, this.formatUseRebate(carData_1.total, carData_1.use_rebate)];
                    case 22:
                        f_rebate = _36.sent();
                        carData_1.useRebateInfo = f_rebate;
                        carData_1.use_rebate = f_rebate.point;
                        carData_1.total -= carData_1.use_rebate;
                        carData_1.code = data.code;
                        carData_1.voucherList = [];
                        checkPoint('set carData');
                        if (!(userData_2 && userData_2.account)) return [3 /*break*/, 24];
                        return [4 /*yield*/, rebateClass.getOneRebate({ user_id: userData_2.userID })];
                    case 23:
                        userRebate = _36.sent();
                        carData_1.user_rebate_sum = (userRebate === null || userRebate === void 0 ? void 0 : userRebate.point) || 0;
                        _36.label = 24;
                    case 24:
                        if (!data.distribution_code) return [3 /*break*/, 26];
                        return [4 /*yield*/, new recommend_js_1.Recommend(this.app, this.token).getLinkList({
                                page: 0,
                                limit: 99999,
                                code: data.distribution_code,
                                status: true,
                                no_detail: true,
                            })];
                    case 25:
                        linkList = _36.sent();
                        if (linkList.data.length > 0) {
                            content = linkList.data[0].content;
                            if (this.checkDuring(content)) {
                                carData_1.distribution_info = content;
                            }
                        }
                        _36.label = 26;
                    case 26:
                        checkPoint('distribution code');
                        if (!(type !== 'manual' && type !== 'manual-preview')) return [3 /*break*/, 32];
                        // 過濾加購品與贈品
                        carData_1.lineItems = carData_1.lineItems.filter(function (dd) {
                            return !add_on_items_1.includes(dd) && !gift_product_1.includes(dd);
                        });
                        return [4 /*yield*/, this.checkVoucher(structuredClone(carData_1))];
                    case 27:
                        c_carData_1 = _36.sent();
                        add_on_items_1.forEach(function (dd) {
                            var _a;
                            try {
                                var isAddOnItem = (_a = c_carData_1.voucherList) === null || _a === void 0 ? void 0 : _a.some(function (voucher) {
                                    return (voucher.reBackType === 'add_on_items' &&
                                        voucher.add_on_products.find(function (d2) {
                                            return "".concat(dd.id) === "".concat(d2);
                                        }));
                                });
                                // 如果是加購品，則將其加入購物車
                                if (isAddOnItem) {
                                    carData_1.lineItems.push(dd);
                                }
                            }
                            catch (e) {
                                console.error('Error processing add-on items:', e);
                            }
                        });
                        // 再次更新優惠內容
                        return [4 /*yield*/, this.checkVoucher(carData_1)];
                    case 28:
                        // 再次更新優惠內容
                        _36.sent();
                        checkPoint('check voucher');
                        can_add_gift_1 = [];
                        // 收集可添加的贈品
                        (_25 = carData_1.voucherList) === null || _25 === void 0 ? void 0 : _25.filter(function (dd) { return dd.reBackType === 'giveaway'; }).forEach(function (dd) { return can_add_gift_1.push(dd.add_on_products); });
                        // 處理每個贈品
                        gift_product_1.forEach(function (dd) {
                            var max_count = can_add_gift_1.filter(function (d1) { return d1.includes(dd.id); }).length;
                            if (dd.count <= max_count) {
                                for (var a = 0; a < dd.count; a++) {
                                    can_add_gift_1 = can_add_gift_1.filter(function (d1) { return !d1.includes(dd.id); }); // 移除已添加的贈品
                                }
                                carData_1.lineItems.push(dd);
                            }
                        });
                        _loop_2 = function (giveawayData) {
                            var productPromises, _38;
                            return __generator(this, function (_39) {
                                switch (_39.label) {
                                    case 0:
                                        if (!((_26 = giveawayData.add_on_products) === null || _26 === void 0 ? void 0 : _26.length))
                                            return [2 /*return*/, "continue"];
                                        productPromises = giveawayData.add_on_products.map(function (id) { return __awaiter(_this, void 0, void 0, function () {
                                            var getGiveawayData;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, this.getProduct({
                                                            page: 0,
                                                            limit: 1,
                                                            id: "".concat(id),
                                                            status: 'inRange',
                                                            channel: checkOutType_1 === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
                                                            whereStore: checkOutType_1 === 'POS' ? data.pos_store : undefined,
                                                        })];
                                                    case 1:
                                                        getGiveawayData = (_a.sent()).data.content;
                                                        getGiveawayData.voucher_id = giveawayData.id;
                                                        return [2 /*return*/, getGiveawayData];
                                                }
                                            });
                                        }); });
                                        // 等待所有 add_on_products 產品資料同時獲取
                                        _38 = giveawayData;
                                        return [4 /*yield*/, Promise.all(productPromises)];
                                    case 1:
                                        // 等待所有 add_on_products 產品資料同時獲取
                                        _38.add_on_products = _39.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _m = 0, _o = carData_1.voucherList.filter(function (dd) { return dd.reBackType === 'giveaway'; });
                        _36.label = 29;
                    case 29:
                        if (!(_m < _o.length)) return [3 /*break*/, 32];
                        giveawayData = _o[_m];
                        return [5 /*yield**/, _loop_2(giveawayData)];
                    case 30:
                        _36.sent();
                        _36.label = 31;
                    case 31:
                        _m++;
                        return [3 /*break*/, 29];
                    case 32: return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                            appName: this.app,
                            key: 'glitter_finance',
                        })];
                    case 33:
                        configData = _36.sent();
                        keyData_1 = (_27 = configData[0]) === null || _27 === void 0 ? void 0 : _27.value;
                        if (keyData_1) {
                            carData_1.payment_info_custom = keyData_1.payment_info_custom;
                        }
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _a;
                                var n = 0;
                                carData_1.payment_customer_form = (_a = carData_1.payment_customer_form) !== null && _a !== void 0 ? _a : [];
                                keyData_1.payment_info_custom.map(function (item, index) {
                                    userClass_1
                                        .getConfigV2({
                                        user_id: 'manager',
                                        key: "form_finance_".concat(item.id),
                                    })
                                        .then(function (data) {
                                        carData_1.payment_customer_form[index] = {
                                            id: item.id,
                                            list: data.list,
                                        };
                                        n++;
                                        if (keyData_1.payment_info_custom.length === n) {
                                            resolve();
                                        }
                                    });
                                });
                                if (n === 0) {
                                    resolve();
                                }
                            })];
                    case 34:
                        _36.sent();
                        checkPoint('set payment');
                        // 線下付款
                        keyData_1.cash_on_delivery = (_28 = keyData_1.cash_on_delivery) !== null && _28 !== void 0 ? _28 : { shipmentSupport: [] };
                        carData_1.payment_info_line_pay = keyData_1.payment_info_line_pay;
                        carData_1.payment_info_atm = keyData_1.payment_info_atm;
                        defaultPayArray_1 = glitter_finance_js_1.onlinePayArray.map(function (item) { return item.key; });
                        keyData_1.cash_on_delivery.shipmentSupport = (_29 = keyData_1.cash_on_delivery.shipmentSupport) !== null && _29 !== void 0 ? _29 : [];
                        // 透過特定金流，取得指定物流
                        carData_1.shipment_support = checkoutPayment_1
                            ? ((_30 = (function () {
                                if (checkoutPayment_1 === 'cash_on_delivery') {
                                    return keyData_1.cash_on_delivery;
                                }
                                else if (defaultPayArray_1.includes(checkoutPayment_1)) {
                                    return keyData_1[checkoutPayment_1];
                                }
                                else if (checkoutPayment_1 === 'atm') {
                                    return keyData_1.payment_info_atm;
                                }
                                else if (checkoutPayment_1 === 'line') {
                                    return keyData_1.payment_info_line_pay;
                                }
                                else {
                                    // 自訂線下付款
                                    var customPay = keyData_1.payment_info_custom.find(function (c) { return c.id === checkoutPayment_1; });
                                    return customPay !== null && customPay !== void 0 ? customPay : {};
                                }
                            })().shipmentSupport) !== null && _30 !== void 0 ? _30 : [])
                            : [];
                        subtotal_1 = 0;
                        carData_1.lineItems.map(function (item) {
                            var _a;
                            if (item.is_gift) {
                                item.sale_price = 0;
                            }
                            if (!item.is_gift) {
                                subtotal_1 += item.count * (item.sale_price - ((_a = item.discount_price) !== null && _a !== void 0 ? _a : 0));
                            }
                        });
                        if (carData_1.total < 0 || carData_1.use_rebate > subtotal_1) {
                            carData_1.use_rebate = 0;
                            carData_1.total = subtotal_1 + carData_1.shipment_fee;
                        }
                        // 商品材積重量與物流使用限制
                        carData_1.lineItems.map(function (item) {
                            carData_1.goodsWeight += item.weight * item.count;
                        });
                        excludedValuesByTotal_1 = new Set(['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C']);
                        excludedValuesByWeight_1 = new Set(['normal', 'black_cat']);
                        isExcludedByTotal_1 = function (dd) {
                            return carData_1.total > 20000 && excludedValuesByTotal_1.has(dd.value);
                        };
                        isExcludedByWeight_1 = function (dd) {
                            return carData_1.goodsWeight > 20 && excludedValuesByWeight_1.has(dd.value);
                        };
                        isIncludedInDesignatedLogistics_1 = function (dd) {
                            return carData_1.lineItems.every(function (item) {
                                return (item.designated_logistics === undefined ||
                                    item.designated_logistics.type === 'all' ||
                                    item.designated_logistics.list.includes(dd.value));
                            });
                        };
                        carData_1.shipment_selector = carData_1.shipment_selector
                            .filter(function (dd) {
                            return isIncludedInDesignatedLogistics_1(dd);
                        })
                            .map(function (dd) {
                            dd.isExcludedByTotal = isExcludedByTotal_1(dd);
                            dd.isExcludedByWeight = isExcludedByWeight_1(dd);
                            return dd;
                        });
                        carData_1.code_array = (carData_1.code_array || []).filter(function (code) {
                            return (carData_1.voucherList || []).find(function (dd) { return dd.code === code; });
                        });
                        // 線上金流是否可使用判斷，填入付款資訊與方式
                        carData_1.payment_setting = glitter_finance_js_1.onlinePayArray.filter(function (dd) {
                            var k = keyData_1[dd.key];
                            if (!k || !k.toggle || !getCartFormulaPass(k))
                                return false;
                            dd.custome_name = k.custome_name;
                            if (carData_1.orderSource === 'POS') {
                                if (dd.key === 'ut_credit_card') {
                                    dd.pwd = k['pwd'];
                                }
                                return dd.type === 'pos';
                            }
                            return dd.type !== 'pos';
                        });
                        // 線下金流是否可使用判斷
                        carData_1.off_line_support = (_31 = keyData_1.off_line_support) !== null && _31 !== void 0 ? _31 : {};
                        Object.entries(carData_1.off_line_support).map(function (_a) {
                            var key = _a[0], value = _a[1];
                            if (!value)
                                return;
                            if (key === 'cash_on_delivery') {
                                carData_1.off_line_support[key] = getCartFormulaPass(keyData_1[key]);
                            }
                            else if (key === 'atm') {
                                carData_1.off_line_support[key] = getCartFormulaPass(keyData_1.payment_info_atm);
                            }
                            else if (key === 'line') {
                                carData_1.off_line_support[key] = getCartFormulaPass(keyData_1.payment_info_line_pay);
                            }
                            else {
                                // 自訂線下付款
                                var customPay = keyData_1.payment_info_custom.find(function (c) { return c.id === key; });
                                carData_1.off_line_support[key] = getCartFormulaPass(customPay !== null && customPay !== void 0 ? customPay : {});
                            }
                        });
                        if (!Array.isArray(carData_1.shipment_support)) return [3 /*break*/, 36];
                        return [4 /*yield*/, Promise.all(carData_1.shipment_support.map(function (sup) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, userClass_1
                                                .getConfigV2({ key: 'shipment_config_' + sup, user_id: 'manager' })
                                                .then(function (r) {
                                                return getCartFormulaPass(r);
                                            })
                                                .catch(function () {
                                                return true;
                                            })];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })).then(function (dataArray) {
                                var _a;
                                carData_1.shipment_support = (_a = carData_1.shipment_support) === null || _a === void 0 ? void 0 : _a.filter(function (_, index) { return dataArray[index]; });
                            })];
                    case 35:
                        _36.sent();
                        _36.label = 36;
                    case 36:
                        // ================================ Preview UP ================================
                        checkPoint('return preview');
                        if (type === 'preview' || type === 'manual-preview')
                            return [2 /*return*/, { data: carData_1 }];
                        if (!(userData_2 && userData_2.userID)) return [3 /*break*/, 43];
                        return [4 /*yield*/, rebateClass.insertRebate(userData_2.userID, carData_1.use_rebate * -1, '使用折抵', {
                                order_id: carData_1.orderID,
                            })];
                    case 37:
                        _36.sent();
                        if (!(carData_1.voucherList && carData_1.voucherList.length > 0)) return [3 /*break*/, 41];
                        _p = 0, _q = carData_1.voucherList;
                        _36.label = 38;
                    case 38:
                        if (!(_p < _q.length)) return [3 /*break*/, 41];
                        voucher = _q[_p];
                        return [4 /*yield*/, this.insertVoucherHistory(userData_2.userID, carData_1.orderID, voucher.id)];
                    case 39:
                        _36.sent();
                        _36.label = 40;
                    case 40:
                        _p++;
                        return [3 /*break*/, 38];
                    case 41: return [4 /*yield*/, database_js_1.default.query("SELECT sum(money)\n               FROM `".concat(this.app, "`.t_wallet\n               WHERE status in (1, 2)\n                 and userID = ?"), [userData_2.userID])];
                    case 42:
                        sum = (_36.sent())[0]['sum(money)'] || 0;
                        carData_1.use_wallet = sum < carData_1.total ? sum : carData_1.total;
                        _36.label = 43;
                    case 43:
                        checkPoint('check user rebate');
                        if (!(type === 'manual' || type === 'split')) return [3 /*break*/, 49];
                        carData_1.orderSource = type;
                        tempVoucher = {
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
                        carData_1.discount = data.discount;
                        carData_1.voucherList = [tempVoucher];
                        carData_1.customer_info = data.customer_info;
                        carData_1.total = (_32 = data.total) !== null && _32 !== void 0 ? _32 : 0;
                        carData_1.rebate = tempVoucher.rebate_total;
                        if (tempVoucher.reBackType == 'shipment_free' || type == 'split') {
                            carData_1.shipment_fee = 0;
                        }
                        if (!(tempVoucher.reBackType == 'rebate')) return [3 /*break*/, 47];
                        return [4 /*yield*/, userClass_1.getUserData(data.email || data.user_info.email, 'account')];
                    case 44:
                        customerData = _36.sent();
                        if (!!customerData) return [3 /*break*/, 47];
                        return [4 /*yield*/, userClass_1.createUser(data.email, tool_js_1.default.randomString(8), {
                                email: data.email,
                                name: data.customer_info.name,
                                phone: data.customer_info.phone,
                            }, {}, true)];
                    case 45:
                        _36.sent();
                        return [4 /*yield*/, userClass_1.getUserData(data.email || data.user_info.email, 'account')];
                    case 46:
                        customerData = _36.sent();
                        _36.label = 47;
                    case 47: 
                    // 手動訂單新增
                    return [4 /*yield*/, order_event_js_1.OrderEvent.insertOrder({
                            cartData: carData_1,
                            status: data.pay_status,
                            app: this.app,
                        })];
                    case 48:
                        // 手動訂單新增
                        _36.sent();
                        new notify_js_1.ManagerNotify(this.app).checkout({ orderData: carData_1, status: 0 });
                        emailList = new Set([carData_1.customer_info, carData_1.user_info].map(function (dd) { return dd && dd.email; }));
                        for (_r = 0, emailList_1 = emailList; _r < emailList_1.length; _r++) {
                            email = emailList_1[_r];
                            if (email) {
                                auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData_1.orderID, email, carData_1.language);
                            }
                        }
                        checkPoint('manual order done');
                        return [2 /*return*/, {
                                data: carData_1,
                            }];
                    case 49:
                        if (!(type === 'POS')) return [3 /*break*/, 58];
                        carData_1.orderSource = 'POS';
                        if (checkOutType_1 === 'POS' && Array.isArray(data.voucherList)) {
                            manualVoucher = data.voucherList.find(function (item) { return item.id === 0; });
                            if (manualVoucher) {
                                manualVoucher.discount = (_33 = manualVoucher.discount_total) !== null && _33 !== void 0 ? _33 : 0;
                                carData_1.total -= manualVoucher.discount;
                                carData_1.discount += manualVoucher.discount;
                                carData_1.voucherList.push(manualVoucher);
                            }
                        }
                        return [4 /*yield*/, database_js_1.default.Transaction.build()];
                    case 50:
                        trans = _36.sent();
                        if (data.pre_order) {
                            carData_1.progress = 'pre_order';
                            carData_1.orderStatus = '0';
                            payTotal = data.pos_info.payment
                                .map(function (dd) { return dd.total; })
                                .reduce(function (acc, val) { return acc + val; }, 0);
                            if (carData_1.total <= payTotal) {
                                data.pay_status = 1;
                            }
                            else {
                                data.pay_status = 3;
                            }
                        }
                        else if (carData_1.user_info.shipment === 'now') {
                            carData_1.orderStatus = '1';
                            carData_1.progress = 'finish';
                        }
                        return [4 /*yield*/, order_event_js_1.OrderEvent.insertOrder({
                                cartData: carData_1,
                                status: data.pay_status,
                                app: this.app,
                            })];
                    case 51:
                        _36.sent();
                        if (!(data.invoice_select !== 'nouse')) return [3 /*break*/, 53];
                        _s = carData_1;
                        return [4 /*yield*/, new invoice_js_1.Invoice(this.app).postCheckoutInvoice(carData_1, carData_1.user_info.send_type !== 'carrier')];
                    case 52:
                        _s.invoice = _36.sent();
                        _36.label = 53;
                    case 53: return [4 /*yield*/, trans.commit()];
                    case 54:
                        _36.sent();
                        return [4 /*yield*/, trans.release()];
                    case 55:
                        _36.sent();
                        return [4 /*yield*/, Promise.all(saveStockArray_1.map(function (dd) { return dd(); }))];
                    case 56:
                        _36.sent();
                        return [4 /*yield*/, this.releaseCheckout((_34 = data.pay_status) !== null && _34 !== void 0 ? _34 : 0, carData_1.orderID)];
                    case 57:
                        _36.sent();
                        checkPoint('release pos checkout');
                        for (_t = 0, _u = new Set([carData_1.customer_info, carData_1.user_info].map(function (dd) {
                            return dd && dd.email;
                        })); _t < _u.length; _t++) {
                            email = _u[_t];
                            if (email) {
                                auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData_1.orderID, email, carData_1.language);
                            }
                        }
                        return [2 /*return*/, { result: 'SUCCESS', message: 'POS訂單新增成功', data: carData_1 }];
                    case 58:
                        id = 'redirect_' + tool_js_1.default.randomString(6);
                        redirect_url = new URL(data.return_url);
                        redirect_url.searchParams.set('cart_token', carData_1.orderID);
                        return [4 /*yield*/, redis_js_1.default.setValue(id, redirect_url.href)];
                    case 59:
                        _36.sent();
                        if (!(carData_1.use_wallet === carData_1.total)) return [3 /*break*/, 63];
                        return [4 /*yield*/, database_js_1.default.query("INSERT INTO `".concat(this.app, "`.t_wallet (orderID, userID, money, status, note)\n           values (?, ?, ?, ?, ?);"), [
                                carData_1.orderID,
                                userData_2.userID,
                                carData_1.use_wallet * -1,
                                1,
                                JSON.stringify({
                                    note: '使用錢包購物',
                                    orderData: carData_1,
                                }),
                            ])];
                    case 60:
                        _36.sent();
                        carData_1.method = 'off_line';
                        return [4 /*yield*/, order_event_js_1.OrderEvent.insertOrder({
                                cartData: carData_1,
                                status: 1,
                                app: this.app,
                            })];
                    case 61:
                        _36.sent();
                        if (carData_1.use_wallet > 0) {
                            new invoice_js_1.Invoice(this.app).postCheckoutInvoice(carData_1.orderID, false);
                        }
                        return [4 /*yield*/, Promise.all(saveStockArray_1.map(function (dd) { return dd(); }))];
                    case 62:
                        _36.sent();
                        checkPoint('insert order & create invoice');
                        return [2 /*return*/, {
                                is_free: true,
                                return_url: "".concat(process.env.DOMAIN, "/api-public/v1/ec/redirect?g-app=").concat(this.app, "&return=").concat(id),
                            }];
                    case 63: return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                            appName: this.app,
                            key: 'glitter_finance',
                        })];
                    case 64:
                        keyData_2 = (_36.sent())[0].value;
                        kd = (_35 = keyData_2[carData_1.customer_info.payment_select]) !== null && _35 !== void 0 ? _35 : {
                            ReturnURL: '',
                            NotifyURL: '',
                        };
                        _v = carData_1.customer_info.payment_select;
                        switch (_v) {
                            case 'ecPay': return [3 /*break*/, 65];
                            case 'newWebPay': return [3 /*break*/, 65];
                            case 'paypal': return [3 /*break*/, 68];
                            case 'line_pay': return [3 /*break*/, 71];
                            case 'paynow': return [3 /*break*/, 74];
                            case 'jkopay': return [3 /*break*/, 77];
                        }
                        return [3 /*break*/, 79];
                    case 65: return [4 /*yield*/, new financial_service_js_1.default(this.app, {
                            HASH_IV: kd.HASH_IV,
                            HASH_KEY: kd.HASH_KEY,
                            ActionURL: kd.ActionURL,
                            NotifyURL: "".concat(process.env.DOMAIN, "/api-public/v1/ec/notify?g-app=").concat(this.app, "&type=").concat(carData_1.customer_info.payment_select),
                            ReturnURL: "".concat(process.env.DOMAIN, "/api-public/v1/ec/redirect?g-app=").concat(this.app, "&return=").concat(id),
                            MERCHANT_ID: kd.MERCHANT_ID,
                            TYPE: carData_1.customer_info.payment_select,
                        }).createOrderPage(carData_1)];
                    case 66:
                        subMitData = _36.sent();
                        return [4 /*yield*/, Promise.all(saveStockArray_1.map(function (dd) {
                                return dd();
                            }))];
                    case 67:
                        _36.sent();
                        checkPoint('select newWebPay');
                        return [2 /*return*/, {
                                form: subMitData,
                            }];
                    case 68:
                        kd.ReturnURL = "".concat(process.env.DOMAIN, "/api-public/v1/ec/redirect?g-app=").concat(this.app, "&return=").concat(id);
                        kd.NotifyURL = "".concat(process.env.DOMAIN, "/api-public/v1/ec/notify?g-app=").concat(this.app, "&type=").concat(carData_1.customer_info.payment_select);
                        return [4 /*yield*/, Promise.all(saveStockArray_1.map(function (dd) {
                                return dd();
                            }))];
                    case 69:
                        _36.sent();
                        checkPoint('select paypal');
                        return [4 /*yield*/, new financial_service_js_1.PayPal(this.app, kd).checkout(carData_1)];
                    case 70: return [2 /*return*/, _36.sent()];
                    case 71:
                        kd.ReturnURL = "".concat(process.env.DOMAIN, "/api-public/v1/ec/redirect?g-app=").concat(this.app, "&return=").concat(id, "&type=").concat(carData_1.customer_info.payment_select);
                        kd.NotifyURL = "".concat(process.env.DOMAIN, "/api-public/v1/ec/notify?g-app=").concat(this.app, "&type=").concat(carData_1.customer_info.payment_select);
                        return [4 /*yield*/, Promise.all(saveStockArray_1.map(function (dd) {
                                return dd();
                            }))];
                    case 72:
                        _36.sent();
                        checkPoint('select linepay');
                        return [4 /*yield*/, new financial_service_js_1.LinePay(this.app, kd).createOrder(carData_1)];
                    case 73: return [2 /*return*/, _36.sent()];
                    case 74:
                        kd.ReturnURL = "".concat(process.env.DOMAIN, "/api-public/v1/ec/redirect?g-app=").concat(this.app, "&return=").concat(id, "&type=").concat(carData_1.customer_info.payment_select);
                        kd.NotifyURL = "".concat(process.env.DOMAIN, "/api-public/v1/ec/notify?g-app=").concat(this.app, "&paynow=true&type=").concat(carData_1.customer_info.payment_select);
                        return [4 /*yield*/, Promise.all(saveStockArray_1.map(function (dd) {
                                return dd();
                            }))];
                    case 75:
                        _36.sent();
                        checkPoint('select paynow');
                        return [4 /*yield*/, new financial_service_js_1.PayNow(this.app, kd).createOrder(carData_1)];
                    case 76: return [2 /*return*/, _36.sent()];
                    case 77:
                        kd.ReturnURL = "".concat(process.env.DOMAIN, "/api-public/v1/ec/redirect?g-app=").concat(this.app, "&jkopay=true&return=").concat(id);
                        kd.NotifyURL = "".concat(process.env.DOMAIN, "/api-public/v1/ec/notify?g-app=").concat(this.app, "&type=jkopay&return=").concat(id);
                        checkPoint('select jkopay');
                        return [4 /*yield*/, new financial_service_js_1.JKO(this.app, kd).createOrder(carData_1)];
                    case 78: return [2 /*return*/, _36.sent()];
                    case 79:
                        carData_1.method = 'off_line';
                        return [4 /*yield*/, order_event_js_1.OrderEvent.insertOrder({
                                cartData: carData_1,
                                status: 0,
                                app: this.app,
                            })];
                    case 80:
                        _36.sent();
                        return [4 /*yield*/, Promise.all(saveStockArray_1.map(function (dd) {
                                return dd();
                            }))];
                    case 81:
                        _36.sent();
                        // 訂單成立信件通知
                        new notify_js_1.ManagerNotify(this.app).checkout({
                            orderData: carData_1,
                            status: 0,
                        });
                        _w = 0, _x = new Set([carData_1.customer_info, carData_1.user_info].map(function (dd) {
                            return dd && dd.phone;
                        }));
                        _36.label = 82;
                    case 82:
                        if (!(_w < _x.length)) return [3 /*break*/, 85];
                        phone = _x[_w];
                        sns = new sms_js_1.SMS(this.app);
                        return [4 /*yield*/, sns.sendCustomerSns('auto-sns-order-create', carData_1.orderID, phone)];
                    case 83:
                        _36.sent();
                        console.info('訂單簡訊寄送成功');
                        _36.label = 84;
                    case 84:
                        _w++;
                        return [3 /*break*/, 82];
                    case 85:
                        if (!carData_1.customer_info.lineID) return [3 /*break*/, 87];
                        line = new line_message_1.LineMessage(this.app);
                        return [4 /*yield*/, line.sendCustomerLine('auto-line-order-create', carData_1.orderID, carData_1.customer_info.lineID)];
                    case 86:
                        _36.sent();
                        console.info('訂單line訊息寄送成功');
                        _36.label = 87;
                    case 87:
                        // if (carData.customer_info.fb_id) {
                        //     let fb = new FbMessage(this.app)
                        //     await fb.sendCustomerFB('auto-fb-order-create', carData.orderID, carData.customer_info.fb_id);
                        //     console.info('訂單FB訊息寄送成功');
                        // }
                        for (_y = 0, _z = new Set([carData_1.customer_info, carData_1.user_info].map(function (dd) {
                            return dd && dd.email;
                        })); _y < _z.length; _y++) {
                            email = _z[_y];
                            if (email) {
                                auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData_1.orderID, email, carData_1.language);
                            }
                        }
                        return [4 /*yield*/, this.releaseVoucherHistory(carData_1.orderID, 1)];
                    case 88:
                        _36.sent();
                        checkPoint('default release checkout');
                        return [2 /*return*/, {
                                off_line: true,
                                return_url: "".concat(process.env.DOMAIN, "/api-public/v1/ec/redirect?g-app=").concat(this.app, "&return=").concat(id),
                            }];
                    case 89: return [3 /*break*/, 91];
                    case 90:
                        e_5 = _36.sent();
                        console.error(e_5);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Func Error:' + e_5, null);
                    case 91: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.repayOrder = function (orderID, return_url) {
        return __awaiter(this, void 0, void 0, function () {
            var sqlData, orderData, keyData, shipment_setting, kd, carData;
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0: return [4 /*yield*/, database_js_1.default.query("SELECT *\n             FROM `".concat(this.app, "`.t_checkout\n             WHERE cart_token = ?\n               AND status = 0;"), [orderID])];
                    case 1:
                        sqlData = (_p.sent())[0];
                        orderData = sqlData.orderData;
                        if (!orderData) {
                            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error: Cannot find this orderID', null);
                        }
                        return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                appName: this.app,
                                key: 'glitter_finance',
                            })];
                    case 2:
                        keyData = (_p.sent())[0].value;
                        return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                var config, e_7;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                                    appName: this.app,
                                                    key: 'logistics_setting',
                                                })];
                                        case 1:
                                            config = _a.sent();
                                            // 如果 config 為空，則返回預設值
                                            if (!config) {
                                                return [2 /*return*/, {
                                                        support: [],
                                                        shipmentSupport: [],
                                                    }];
                                            }
                                            // 返回第一個元素的 value 屬性
                                            return [2 /*return*/, config[0].value];
                                        case 2:
                                            e_7 = _a.sent();
                                            // 發生錯誤時返回空陣列
                                            return [2 /*return*/, []];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })()];
                    case 3:
                        shipment_setting = _p.sent();
                        kd = (_a = keyData[orderData.customer_info.payment_select]) !== null && _a !== void 0 ? _a : {
                            ReturnURL: '',
                            NotifyURL: '',
                        };
                        carData = {
                            customer_info: orderData.customer_info || {},
                            lineItems: (_b = orderData.lineItems) !== null && _b !== void 0 ? _b : [],
                            total: (_c = orderData.total) !== null && _c !== void 0 ? _c : 0,
                            email: (_f = (_d = sqlData.email) !== null && _d !== void 0 ? _d : (_e = orderData.user_info) === null || _e === void 0 ? void 0 : _e.email) !== null && _f !== void 0 ? _f : '',
                            user_info: orderData.user_info,
                            shipment_fee: (_g = orderData.shipment_fee) !== null && _g !== void 0 ? _g : 0,
                            rebate: (_h = orderData.rebate) !== null && _h !== void 0 ? _h : 0,
                            goodsWeight: 0,
                            use_rebate: orderData.use_rebate || 0,
                            orderID: orderData.orderID || "".concat(Date.now()),
                            shipment_support: shipment_setting.support,
                            shipment_info: shipment_setting.info,
                            shipment_selector: __spreadArray(__spreadArray([], shipment_config_js_1.ShipmentConfig.list.map(function (dd) { return ({
                                name: dd.title,
                                value: dd.value,
                            }); }), true), ((_j = shipment_setting.custom_delivery) !== null && _j !== void 0 ? _j : []).map(function (dd) { return ({
                                form: dd.form,
                                name: dd.name,
                                value: dd.id,
                                system_form: dd.system_form,
                            }); }), true).filter(function (option) { return shipment_setting.support.includes(option.value); }),
                            use_wallet: 0,
                            method: (_k = sqlData.user_info) === null || _k === void 0 ? void 0 : _k.method,
                            user_email: (_o = (_l = sqlData.email) !== null && _l !== void 0 ? _l : (_m = orderData.user_info) === null || _m === void 0 ? void 0 : _m.email) !== null && _o !== void 0 ? _o : '',
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
                        console.log("kd -- ", kd);
                        return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.getReturnOrder = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var querySql, orderString, newArray, temp, created_time, sql, data, e_8;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        querySql = ['1=1'];
                        orderString = 'order by id desc';
                        if (query.search && query.searchType) {
                            switch (query.searchType) {
                                case 'order_id':
                                case 'return_order_id':
                                    querySql.push("(".concat(query.searchType, " like '%").concat(query.search, "%')"));
                                    break;
                                case 'name':
                                case 'phone':
                                    querySql.push("(UPPER(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.customer_info.".concat(query.searchType, "')) LIKE ('%").concat(query.search, "%')))"));
                                    break;
                                default: {
                                    querySql.push("JSON_CONTAINS_PATH(orderData, 'one', '$.lineItems[*].title') AND JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.lineItems[*].".concat(query.searchType, "')) REGEXP '").concat(query.search, "'"));
                                }
                            }
                        }
                        //退貨狀態 處理中:0 退貨中:-1 已退貨:1
                        if (query.progress) {
                            newArray = query.progress.split(',');
                            temp = '';
                            temp += "JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.returnProgress')) IN (".concat(newArray.map(function (status) { return "\"".concat(status, "\""); }).join(','), ")");
                            querySql.push("(".concat(temp, ")"));
                        }
                        if (query.created_time) {
                            created_time = query.created_time.split(',');
                            if (created_time.length > 1) {
                                querySql.push("\n                        (created_time BETWEEN ".concat(database_js_1.default.escape("".concat(created_time[0], " 00:00:00")), " \n                        AND ").concat(database_js_1.default.escape("".concat(created_time[1], " 23:59:59")), ")\n                    "));
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
                        //退貨單封存相關
                        if (query.archived === 'true') {
                            querySql.push("(archived=\"".concat(query.archived, "\")"));
                        }
                        else if (query.archived === 'false') {
                            querySql.push("((archived is null) or (archived!='true'))");
                        }
                        //退貨貨款狀態
                        query.status && querySql.push("status IN (".concat(query.status, ")"));
                        query.email && querySql.push("email=".concat(database_js_1.default.escape(query.email)));
                        query.id && querySql.push("(content->>'$.id'=".concat(query.id, ")"));
                        sql = "SELECT *\n                 FROM `".concat(this.app, "`.t_return_order\n                 WHERE ").concat(querySql.join(' and '), " ").concat(orderString);
                        if (!query.id) return [3 /*break*/, 2];
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n             FROM (".concat(sql, ") as subqyery limit ").concat(query.page * query.limit, ", ").concat(query.limit), [])];
                    case 1:
                        data = (_b.sent())[0];
                        return [2 /*return*/, {
                                data: data,
                                result: !!data,
                            }];
                    case 2:
                        _a = {};
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n             FROM (".concat(sql, ") as subqyery limit ").concat(query.page * query.limit, ", ").concat(query.limit), [])];
                    case 3:
                        _a.data = _b.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT count(1)\n               FROM (".concat(sql, ") as subqyery"), [])];
                    case 4: return [2 /*return*/, (_a.total = (_b.sent())[0]['count(1)'],
                            _a)];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_8 = _b.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getReturnOrder Error:' + e_8, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.createReturnOrder = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var returnOrderID, orderID, email, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        returnOrderID = "".concat(new Date().getTime());
                        orderID = data.cart_token;
                        email = data.email;
                        return [4 /*yield*/, database_js_1.default.execute("INSERT INTO `".concat(this.app, "`.t_return_order (order_id, return_order_id, email, orderData)\n         values (?, ?, ?, ?)"), [orderID, returnOrderID, email, data.orderData])];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_9 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'createReturnOrder Error:' + e_9, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.putReturnOrder = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var getData, origData, userClass, rebateClass, userData, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, database_js_1.default.execute("SELECT *\n         FROM `".concat(this.app, "`.t_return_order\n         WHERE id = ").concat(data.id, "\n        "), [])];
                    case 1:
                        getData = _a.sent();
                        if (!getData[0]) return [3 /*break*/, 6];
                        origData = getData[0];
                        if (!(origData.status != '1' &&
                            origData.orderData.returnProgress != '-1' &&
                            data.orderData.returnProgress == '-1' &&
                            data.status == '1')) return [3 /*break*/, 4];
                        userClass = new user_js_1.User(this.app);
                        rebateClass = new rebate_js_1.Rebate(this.app);
                        return [4 /*yield*/, userClass.getUserData(data.orderData.customer_info.email, 'account')];
                    case 2:
                        userData = _a.sent();
                        return [4 /*yield*/, rebateClass.insertRebate(userData.userID, data.orderData.rebateChange, "\u9000\u8CA8\u55AE\u8ABF\u6574-\u9000\u8CA8\u55AE\u865F".concat(origData.return_order_id))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.`t_return_order`\n           SET ?\n           WHERE id = ?\n          "), [{ status: data.status, orderData: JSON.stringify(data.orderData) }, data.id])];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, {
                                result: 'success',
                                orderData: data,
                            }];
                    case 6: return [2 /*return*/, {
                            result: 'failure',
                            orderData: data,
                        }];
                    case 7:
                        e_10 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'putReturnOrder Error:' + e_10, null);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.combineOrder = function (dataMap) {
        return __awaiter(this, void 0, void 0, function () {
            var currentTime, _loop_3, this_2, _i, _a, data, e_11;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        delete dataMap.token;
                        currentTime = new Date().toISOString();
                        _loop_3 = function (data) {
                            var cartTokens, placeholders, orders, targetOrder, feedsOrder, formatTargetOrder, base, accumulateValues, mergeOrders, newRecord;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (data.orders.length === 0)
                                            return [2 /*return*/, "continue"];
                                        cartTokens = data.orders.map(function (order) { return order.cart_token; });
                                        placeholders = cartTokens.map(function () { return '?'; }).join(',');
                                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n           FROM `".concat(this_2.app, "`.t_checkout\n           WHERE cart_token IN (").concat(placeholders, ");"), cartTokens)];
                                    case 1:
                                        orders = _c.sent();
                                        targetOrder = orders.find(function (order) { return order.cart_token === data.targetID; });
                                        feedsOrder = orders.filter(function (order) { return order.cart_token !== data.targetID; });
                                        if (!targetOrder)
                                            return [2 /*return*/, "continue"];
                                        formatTargetOrder = JSON.parse(JSON.stringify(targetOrder));
                                        base = formatTargetOrder.orderData;
                                        base.orderSource = 'combine';
                                        base.editRecord = [
                                            {
                                                time: currentTime,
                                                record: "\u5408\u4F75\u81EA".concat(data.orders.length, "\u7B46\u8A02\u55AE\\n").concat(cartTokens.map(function (token) { return "{{order=".concat(token, "}}"); }).join('\\n')),
                                            },
                                        ];
                                        accumulateValues = function (feed, keys, operation) {
                                            keys.forEach(function (key) {
                                                var _a, _b;
                                                base[key] = operation((_a = base[key]) !== null && _a !== void 0 ? _a : (Array.isArray(feed[key]) ? [] : 0), (_b = feed[key]) !== null && _b !== void 0 ? _b : (Array.isArray(feed[key]) ? [] : 0));
                                            });
                                        };
                                        mergeOrders = function (feed) {
                                            var _a, _b;
                                            accumulateValues(feed, ['total', 'rebate', 'discount', 'use_rebate', 'use_wallet', 'goodsWeight'], function (a, b) { return a + b; });
                                            accumulateValues(feed, ['give_away', 'lineItems', 'code_array', 'voucherList'], function (a, b) { return a.concat(b); });
                                            if (((_a = base.useRebateInfo) === null || _a === void 0 ? void 0 : _a.point) !== undefined && ((_b = feed.useRebateInfo) === null || _b === void 0 ? void 0 : _b.point) !== undefined) {
                                                base.useRebateInfo.point += feed.useRebateInfo.point;
                                            }
                                            // 若未付款，則總計扣除運費，反之補上運費
                                            if (formatTargetOrder.status === 0 &&
                                                !base.proof_purchase &&
                                                base.customer_info.payment_select !== 'cash_on_delivery') {
                                                base.total -= feed.shipment_fee;
                                            }
                                            else {
                                                base.shipment_fee += feed.shipment_fee;
                                            }
                                        };
                                        feedsOrder.forEach(function (order) { return mergeOrders(order.orderData); });
                                        base.orderID = "".concat(Date.now());
                                        // 新增合併後的訂單
                                        return [4 /*yield*/, order_event_js_1.OrderEvent.insertOrder({
                                                cartData: base,
                                                status: targetOrder.status,
                                                app: this_2.app,
                                            })];
                                    case 2:
                                        // 新增合併後的訂單
                                        _c.sent();
                                        newRecord = {
                                            time: currentTime,
                                            record: "\u8207\u5176\u4ED6\u8A02\u55AE\u5408\u4F75\u81F3\\n{{order=".concat(base.orderID, "}}"),
                                        };
                                        // 批次封存原始訂單
                                        return [4 /*yield*/, Promise.all(orders.map(function (order) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            order.orderData = __assign(__assign({}, order.orderData), { orderStatus: '-1', archived: 'true', combineOrderID: base.orderID, editRecord: __spreadArray(__spreadArray([], ((_a = order.orderData.editRecord) !== null && _a !== void 0 ? _a : []), true), [newRecord], false) });
                                                            return [4 /*yield*/, this.putOrder({
                                                                    id: "".concat(order.id),
                                                                    orderData: order.orderData,
                                                                    status: order.status,
                                                                })];
                                                        case 1:
                                                            _b.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); }))];
                                    case 3:
                                        // 批次封存原始訂單
                                        _c.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _i = 0, _a = Object.values(dataMap);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        data = _a[_i];
                        return [5 /*yield**/, _loop_3(data)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, true];
                    case 5:
                        e_11 = _b.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'combineOrder Error:' + e_11, null);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.splitOrder = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            //給定訂單編號 產生 編號A 編號B... 依此類推
            function generateOrderIds(orderId, arrayLength) {
                var orderIdArray = [];
                var startChar = 'A'.charCodeAt(0); // 取得 'A' 的 ASCII 碼
                for (var i = 0; i < arrayLength; i++) {
                    var charCode = startChar + i;
                    var nextChar = String.fromCharCode(charCode); // ASCII 碼轉換成字元
                    orderIdArray.push(orderId + nextChar);
                }
                return orderIdArray;
            }
            //整理原本訂單的總價 優惠卷
            function refreshOrder(orderData, splitOrderArray) {
                var _a, _b;
                var _c = splitOrderArray.reduce(function (acc, order) {
                    return {
                        newTotal: acc.newTotal + order.total,
                        newDiscount: acc.newDiscount + order.discount,
                    };
                }, { newTotal: 0, newDiscount: 0 }), newTotal = _c.newTotal, newDiscount = _c.newDiscount;
                orderData.total = orderData.total - newTotal;
                orderData.discount = ((_a = orderData.discount) !== null && _a !== void 0 ? _a : 0) - newDiscount;
                orderData.splitOrders = (_b = generateOrderIds(orderData.orderID, splitOrderArray.length)) !== null && _b !== void 0 ? _b : [];
                orderData.editRecord.push({
                    time: currentTime_1,
                    record: "\u62C6\u5206\u6210 ".concat(splitOrderArray.length, " \u7B46\u5B50\u8A02\u55AE\\n").concat(orderData.splitOrders.map(function (orderID) { return "{{order=".concat(orderID, "}}"); }).join('\\n')),
                });
            }
            var currentTime_1, orderData, splitOrderArray, _i, _a, _b, index, order, e_12;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 6, , 7]);
                        currentTime_1 = new Date().toISOString();
                        orderData = obj.orderData;
                        splitOrderArray = obj.splitOrderArray;
                        refreshOrder(orderData, splitOrderArray);
                        return [4 /*yield*/, this.putOrder({
                                cart_token: orderData.orderID,
                                orderData: orderData,
                            })];
                    case 1:
                        _e.sent();
                        _i = 0, _a = splitOrderArray.entries();
                        _e.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        _b = _a[_i], index = _b[0], order = _b[1];
                        return [4 /*yield*/, this.toCheckout({
                                code_array: [],
                                order_id: (_d = (_c = orderData === null || orderData === void 0 ? void 0 : orderData.splitOrders) === null || _c === void 0 ? void 0 : _c[index]) !== null && _d !== void 0 ? _d : '',
                                line_items: order.lineItems,
                                customer_info: order.customer_info,
                                return_url: "",
                                user_info: order.user_info,
                                discount: order.discount,
                                voucher: order.voucher,
                                total: order.total,
                                pay_status: Number(order.pay_status)
                            }, 'split')];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: 
                    // try {
                    //   await db.query(
                    //     `UPDATE \`${this.app}\`.t_checkout
                    //    SET orderData = ?
                    //    WHERE cart_token = ?;`,
                    //     [JSON.stringify(orderData), orderData.orderID]
                    //   );
                    // }catch (e:any){
                    //   console.error(e);
                    //   throw exception.BadRequestError('BAD_REQUEST', 'putOrder Error:' + e, null);
                    // }
                    return [2 /*return*/, true];
                    case 6:
                        e_12 = _e.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'splitOrder Error:' + e_12, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.formatUseRebate = function (total, useRebate) {
        return __awaiter(this, void 0, void 0, function () {
            var rebateClass, status_1, getRS, configData, limit, limit, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        rebateClass = new rebate_js_1.Rebate(this.app);
                        return [4 /*yield*/, rebateClass.mainStatus()];
                    case 1:
                        status_1 = _a.sent();
                        return [4 /*yield*/, new user_js_1.User(this.app).getConfig({ key: 'rebate_setting', user_id: 'manager' })];
                    case 2:
                        getRS = _a.sent();
                        if (getRS[0] && getRS[0].value) {
                            configData = getRS[0].value.config;
                            if (configData.condition.type === 'total_price' && configData.condition.value > total) {
                                return [2 /*return*/, {
                                        status: status_1,
                                        point: 0,
                                        condition: configData.condition.value - total,
                                    }];
                            }
                            if (configData.customize) {
                                return [2 /*return*/, {
                                        status: status_1,
                                        point: useRebate,
                                    }];
                            }
                            else {
                                if (configData.use_limit.type === 'price') {
                                    limit = configData.use_limit.value;
                                    return [2 /*return*/, {
                                            status: status_1,
                                            point: useRebate > limit ? limit : useRebate,
                                            limit: limit,
                                        }];
                                }
                                if (configData.use_limit.type === 'percent') {
                                    limit = parseInt("".concat((total * configData.use_limit.value) / 100), 10);
                                    return [2 /*return*/, {
                                            status: status_1,
                                            point: useRebate > limit ? limit : useRebate,
                                            limit: limit,
                                        }];
                                }
                                if (configData.use_limit.type === 'none') {
                                    return [2 /*return*/, {
                                            status: status_1,
                                            point: useRebate,
                                        }];
                                }
                            }
                        }
                        return [2 /*return*/, {
                                status: status_1,
                                point: useRebate,
                            }];
                    case 3:
                        error_4 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'formatUseRebate Error:' + express_1.default, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.checkVoucher = function (cart) {
        return __awaiter(this, void 0, void 0, function () {
            // 篩選符合商品判斷方法
            function switchValidProduct(caseName, caseList, caseOffStart) {
                var filterItems = cart.lineItems
                    .filter(function (item) {
                    switch (caseName) {
                        case 'collection':
                            return item.collection.some(function (col) { return caseList.includes(col); });
                        case 'product':
                            return caseList.map(function (caseString) { return "".concat(caseString); }).includes("".concat(item.id));
                        default:
                            return true;
                    }
                })
                    .sort(function (a, b) {
                    return caseOffStart === 'price_desc' ? b.sale_price - a.sale_price : a.sale_price - b.sale_price;
                });
                return filterItems;
            }
            // 訂單來源判斷
            function checkSource(voucher) {
                if (!voucher.device)
                    return true;
                if (voucher.device.length === 0)
                    return false;
                return voucher.device.includes(cart.orderSource === 'POS' ? 'pos' : 'normal');
            }
            // 判斷用戶是否為指定客群
            function checkTarget(voucher) {
                if (voucher.target === 'customer') {
                    return (userData === null || userData === void 0 ? void 0 : userData.id) && voucher.targetList.includes(userData.userID);
                }
                if (voucher.target === 'levels') {
                    if (userData === null || userData === void 0 ? void 0 : userData.member) {
                        var trigger = userData.member.find(function (m) { return m.trigger; });
                        return trigger && voucher.targetList.includes(trigger.id);
                    }
                    return false;
                }
                return true; // 所有顧客皆可使用
            }
            // 判斷符合商品類型
            function setBindProduct(voucher) {
                var _a;
                voucher.bind = [];
                voucher.productOffStart = (_a = voucher.productOffStart) !== null && _a !== void 0 ? _a : 'price_all';
                switch (voucher.trigger) {
                    case 'auto': // 自動填入
                        voucher.bind = switchValidProduct(voucher.for, voucher.forKey, voucher.productOffStart);
                        break;
                    case 'code': // 輸入代碼
                        if (voucher.code === "".concat(cart.code) || (cart.code_array || []).includes("".concat(voucher.code))) {
                            voucher.bind = switchValidProduct(voucher.for, voucher.forKey, voucher.productOffStart);
                        }
                        break;
                    case 'distribution': // 分銷優惠
                        if (cart.distribution_info && cart.distribution_info.voucher === voucher.id) {
                            voucher.bind = switchValidProduct(cart.distribution_info.relative, cart.distribution_info.relative_data, voucher.productOffStart);
                        }
                        break;
                }
                // 採用百分比打折, 整份訂單, 最少購買, 活動為現折, 價高者商品或價低商品打折的篩選
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
            // 購物車是否達到優惠條件，與計算優惠觸發次數
            function checkCartTotal(voucher) {
                voucher.times = 0;
                voucher.bind_subtotal = 0;
                var ruleValue = parseInt("".concat(voucher.ruleValue), 10);
                // 單位為訂單的優惠觸發
                if (voucher.conditionType === 'order') {
                    var cartValue_1 = 0;
                    voucher.bind.map(function (item) {
                        voucher.bind_subtotal += item.count * item.sale_price;
                    });
                    if (cart.discount && voucher.includeDiscount === 'after') {
                        voucher.bind_subtotal -= cart.discount;
                    }
                    if (voucher.rule === 'min_price') {
                        cartValue_1 = voucher.bind_subtotal;
                    }
                    if (voucher.rule === 'min_count') {
                        voucher.bind.map(function (item) {
                            cartValue_1 += item.count;
                        });
                    }
                    if (voucher.reBackType === 'shipment_free') {
                        return cartValue_1 >= ruleValue; // 回傳免運費判斷
                    }
                    if (cartValue_1 >= ruleValue) {
                        if (voucher.counting === 'each') {
                            voucher.times = Math.floor(cartValue_1 / ruleValue);
                        }
                        if (voucher.counting === 'single') {
                            voucher.times = 1;
                        }
                    }
                    return voucher.times > 0;
                }
                // 計算單位為商品的優惠觸發
                if (voucher.conditionType === 'item') {
                    if (voucher.rule === 'min_price') {
                        voucher.bind = voucher.bind.filter(function (item) {
                            var _a;
                            item.times = 0;
                            var subtotal = item.count * item.sale_price;
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
                        voucher.bind = voucher.bind.filter(function (item) {
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
                    return voucher.bind.reduce(function (acc, item) { return acc + item.times; }, 0) > 0;
                }
                return false;
            }
            // 計算優惠券的訂單折扣
            function compare(voucher) {
                return voucher.bind
                    .map(function (item) {
                    var val = parseFloat(voucher.value);
                    return voucher.method === 'percent' ? (item.sale_price * val) / 100 : val;
                })
                    .reduce(function (accumulator, currentValue) { return accumulator + currentValue; }, 0);
            }
            // 商家設定手動排序
            function manualSorted(a, b) {
                var aIndex = sortedVoucher.array.indexOf(a.id);
                var bIndex = sortedVoucher.array.indexOf(b.id);
                return aIndex > bIndex ? 1 : -1;
            }
            // 是否可疊加
            function checkOverlay(voucher) {
                if (overlay || voucher.overlay)
                    return voucher.overlay;
                overlay = true;
                return true;
            }
            // 決定折扣金額
            function checkCondition(voucher) {
                var _a, _b;
                voucher.discount_total = (_a = voucher.discount_total) !== null && _a !== void 0 ? _a : 0;
                voucher.rebate_total = (_b = voucher.rebate_total) !== null && _b !== void 0 ? _b : 0;
                if (voucher.reBackType === 'shipment_free')
                    return true;
                var disValue = parseFloat(voucher.value) / (voucher.method === 'percent' ? 100 : 1);
                if (voucher.conditionType === 'order') {
                    if (voucher.method === 'fixed') {
                        voucher.discount_total = disValue * voucher.times;
                    }
                    if (voucher.method === 'percent') {
                        voucher.discount_total = voucher.bind_subtotal * disValue;
                    }
                    if (voucher.bind_subtotal >= voucher.discount_total) {
                        var remain_1 = parseInt("".concat(voucher.discount_total), 10);
                        voucher.bind.map(function (item, index) {
                            var discount = 0;
                            if (index === voucher.bind.length - 1) {
                                discount = remain_1;
                            }
                            else {
                                discount = Math.round(remain_1 * ((item.sale_price * item.count) / voucher.bind_subtotal));
                            }
                            if (discount > 0 && discount <= item.sale_price * item.count) {
                                // 計算單位為訂單，優惠發放
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
                            if (remain_1 - discount > 0) {
                                remain_1 -= discount;
                            }
                            else {
                                remain_1 = 0;
                            }
                        });
                        return true;
                    }
                    return false;
                }
                if (voucher.conditionType === 'item') {
                    if (voucher.method === 'fixed') {
                        voucher.bind = voucher.bind.filter(function (item) {
                            var discount = disValue * item.times;
                            if (discount <= item.sale_price * item.count) {
                                // 計算單位為商品，固定折扣的優惠發放
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
                        voucher.bind = voucher.bind.filter(function (item) {
                            var discount = Math.floor(item.sale_price * item.count * disValue);
                            if (discount <= item.sale_price * item.count) {
                                // 計算單位為商品，百分比折扣的優惠發放
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
            // 計算有折扣綁定商品的折抵數值
            function countingBindDiscount(voucher) {
                voucher.bind.map(function (item) {
                    var _a;
                    reduceDiscount[item.id] = ((_a = reduceDiscount[item.id]) !== null && _a !== void 0 ? _a : 0) + item.discount_price * item.count;
                });
            }
            // ==== 篩選優惠券 =====
            function filterVoucherlist(vouchers) {
                return vouchers
                    .filter(function (voucher) {
                    return [checkSource, checkTarget, setBindProduct, checkCartTotal].every(function (fn) { return fn(voucher); });
                })
                    .sort(function (a, b) {
                    return sortedVoucher.toggle ? manualSorted(a, b) : compare(b) - compare(a);
                })
                    .filter(function (voucher) {
                    return [checkOverlay, checkCondition].every(function (fn) { return fn(voucher); });
                })
                    .map(function (voucher) {
                    countingBindDiscount(voucher);
                    return voucher;
                });
            }
            var userClass, userData, loginConfig, sortedVoucher, allVoucher, reduceDiscount, overlay, includeDiscountVouchers, withoutDiscountVouchers, voucherList;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        cart.discount = 0;
                        cart.lineItems.map(function (item) {
                            item.discount_price = 0;
                            item.rebate = 0;
                        });
                        userClass = new user_js_1.User(this.app);
                        return [4 /*yield*/, userClass.getUserData(cart.email, 'email_or_phone')];
                    case 1:
                        userData = (_a = (_c.sent())) !== null && _a !== void 0 ? _a : { userID: -1 };
                        return [4 /*yield*/, userClass.getConfigV2({ key: 'login_config', user_id: 'manager' })];
                    case 2:
                        loginConfig = _c.sent();
                        sortedVoucher = (_b = loginConfig === null || loginConfig === void 0 ? void 0 : loginConfig.sorted_voucher) !== null && _b !== void 0 ? _b : { toggle: false };
                        return [4 /*yield*/, this.getAllUseVoucher(userData.userID)];
                    case 3:
                        allVoucher = _c.sent();
                        reduceDiscount = {};
                        overlay = false;
                        includeDiscountVouchers = [];
                        withoutDiscountVouchers = [];
                        allVoucher.map(function (voucher) {
                            voucher.includeDiscount === 'after'
                                ? includeDiscountVouchers.push(voucher)
                                : withoutDiscountVouchers.push(voucher);
                        });
                        voucherList = __spreadArray(__spreadArray([], filterVoucherlist(withoutDiscountVouchers), true), filterVoucherlist(includeDiscountVouchers), true);
                        // 判斷優惠碼無效
                        if (!voucherList.find(function (voucher) { return voucher.code === "".concat(cart.code); })) {
                            cart.code = undefined;
                        }
                        // 如果有折扣運費，刪除基本運費
                        if (voucherList.find(function (voucher) { return voucher.reBackType === 'shipment_free'; })) {
                            cart.total -= cart.shipment_fee;
                            cart.shipment_fee = 0;
                        }
                        // 回傳折扣後總金額與優惠券陣列
                        cart.total -= cart.discount;
                        cart.voucherList = voucherList;
                        return [2 /*return*/, cart];
                }
            });
        });
    };
    Shopping.prototype.putOrder = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var update, storeConfig_1, origin_1, whereClause, value, query, result, resetLineItems, orderData, prevStatus, prevProgress, emailList, _i, emailList_2, email, updateProgress, updateData, orderCountingSQL, orderCount, e_13;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 29, , 30]);
                        update = {};
                        return [4 /*yield*/, new user_js_1.User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' })];
                    case 1:
                        storeConfig_1 = _b.sent();
                        whereClause = data.cart_token ? 'cart_token = ?' : data.id ? 'id = ?' : null;
                        value = (_a = data.cart_token) !== null && _a !== void 0 ? _a : data.id;
                        if (!(whereClause && value)) return [3 /*break*/, 3];
                        query = "SELECT * FROM `".concat(this.app, "`.t_checkout WHERE ").concat(whereClause, ";");
                        return [4 /*yield*/, database_js_1.default.query(query, [value])];
                    case 2:
                        result = _b.sent();
                        origin_1 = result[0];
                        _b.label = 3;
                    case 3:
                        if (!origin_1) {
                            return [2 /*return*/, {
                                    result: 'error',
                                    message: "\u8A02\u55AE id ".concat(data.id, " \u4E0D\u5B58\u5728"),
                                }];
                        }
                        if (data.status !== undefined) {
                            update.status = data.status;
                        }
                        else {
                            data.status = update.status;
                        }
                        resetLineItems = function (lineItems) {
                            return lineItems.map(function (item) {
                                var _a;
                                return __assign(__assign({}, item), { stockList: undefined, deduction_log: Object.keys(item.deduction_log || {}).length
                                        ? item.deduction_log
                                        : (_a = {}, _a[storeConfig_1.list[0].id] = item.count, _a) });
                            });
                        };
                        if (!data.orderData) return [3 /*break*/, 21];
                        orderData = data.orderData;
                        update.orderData = structuredClone(orderData);
                        // 恢復取消訂單的庫存
                        orderData.lineItems = resetLineItems(orderData.lineItems);
                        origin_1.orderData.lineItems = resetLineItems(origin_1.orderData.lineItems);
                        // 釋放優惠券
                        return [4 /*yield*/, this.releaseVoucherHistory(orderData.orderID, orderData.orderStatus === '-1' ? 0 : 1)];
                    case 4:
                        // 釋放優惠券
                        _b.sent();
                        prevStatus = origin_1.orderData.orderStatus;
                        prevProgress = origin_1.orderData.progress || 'wait';
                        if (!(prevStatus !== '-1' && orderData.orderStatus === '-1')) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.resetStore(origin_1.orderData.lineItems)];
                    case 5:
                        _b.sent();
                        emailList = new Set([origin_1.orderData.customer_info, origin_1.orderData.user_info].map(function (user) { return user === null || user === void 0 ? void 0 : user.email; }));
                        _i = 0, emailList_2 = emailList;
                        _b.label = 6;
                    case 6:
                        if (!(_i < emailList_2.length)) return [3 /*break*/, 9];
                        email = emailList_2[_i];
                        if (!email) return [3 /*break*/, 8];
                        return [4 /*yield*/, auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-cancel-success', orderData.orderID, email, orderData.language)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 6];
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        if (!(prevStatus === '-1' && orderData.orderStatus !== '-1')) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.resetStore(origin_1.orderData.lineItems, 'minus')];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12:
                        //當訂單多了出貨單號碼，新增出貨日期，反之清空出貨日期。
                        if (update.orderData.user_info.shipment_number && !update.orderData.user_info.shipment_date) {
                            update.orderData.user_info.shipment_date = new Date().toISOString();
                        }
                        else if (!update.orderData.user_info.shipment_number) {
                            delete update.orderData.user_info.shipment_date;
                        }
                        updateProgress = update.orderData.progress;
                        if (!(prevProgress !== updateProgress)) return [3 /*break*/, 17];
                        if (!(updateProgress === 'shipping')) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.sendNotifications(orderData, 'shipment')];
                    case 13:
                        _b.sent();
                        return [3 /*break*/, 16];
                    case 14:
                        if (!(updateProgress === 'arrived')) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.sendNotifications(orderData, 'arrival')];
                    case 15:
                        _b.sent();
                        _b.label = 16;
                    case 16: return [3 /*break*/, 19];
                    case 17: 
                    // 商品調整出貨倉庫的更新
                    return [4 /*yield*/, this.adjustStock(origin_1.orderData, orderData)];
                    case 18:
                        // 商品調整出貨倉庫的更新
                        _b.sent();
                        _b.label = 19;
                    case 19:
                        if (!(origin_1.status !== update.status)) return [3 /*break*/, 21];
                        return [4 /*yield*/, this.releaseCheckout(update.status, data.orderData.orderID)];
                    case 20:
                        _b.sent();
                        _b.label = 21;
                    case 21:
                        update.orderData.lineItems = update.orderData.lineItems.filter(function (item) { return item.count > 0; });
                        this.writeRecord(origin_1, update);
                        updateData = Object.entries(update).reduce(function (acc, _a) {
                            var _b;
                            var key = _a[0], value = _a[1];
                            return (__assign(__assign({}, acc), (_b = {}, _b[key] = typeof value === 'object' ? JSON.stringify(value) : value, _b)));
                        }, {});
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.t_checkout SET ? WHERE id = ?;\n        "), [updateData, origin_1.id])];
                    case 22:
                        _b.sent();
                        // 同步蝦皮商品
                        return [4 /*yield*/, Promise.all(origin_1.orderData.lineItems.map(function (lineItem) { return __awaiter(_this, void 0, void 0, function () {
                                var shopping, shopee, pd;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            shopping = new Shopping(this.app, this.token);
                                            shopee = new shopee_1.Shopee(this.app, this.token);
                                            return [4 /*yield*/, shopping.getProduct({
                                                    id: lineItem.id,
                                                    page: 0,
                                                    limit: 10,
                                                    skip_shopee_check: true,
                                                })];
                                        case 1:
                                            pd = _b.sent();
                                            if (!((_a = pd.data) === null || _a === void 0 ? void 0 : _a.shopee_id)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, shopee.asyncStockToShopee({
                                                    product: pd.data,
                                                    callback: function () { },
                                                })];
                                        case 2:
                                            _b.sent();
                                            _b.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 23:
                        // 同步蝦皮商品
                        _b.sent();
                        // 加入到索引欄位
                        return [4 /*yield*/, checkout_js_1.CheckoutService.updateAndMigrateToTableColumn({
                                id: origin_1.id,
                                orderData: update.orderData,
                                app_name: this.app,
                            })];
                    case 24:
                        // 加入到索引欄位
                        _b.sent();
                        return [4 /*yield*/, new user_js_1.User(this.app).getCheckoutCountingModeSQL()];
                    case 25:
                        orderCountingSQL = _b.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n         FROM `".concat(this.app, "`.t_checkout\n         WHERE id = ?\n           AND ").concat(orderCountingSQL, ";\n        "), [origin_1.id])];
                    case 26:
                        orderCount = _b.sent();
                        if (!orderCount[0]) return [3 /*break*/, 28];
                        return [4 /*yield*/, this.shareVoucherRebate(orderCount[0])];
                    case 27:
                        _b.sent();
                        _b.label = 28;
                    case 28: return [2 /*return*/, {
                            result: 'success',
                            orderData: data.orderData,
                        }];
                    case 29:
                        e_13 = _b.sent();
                        console.error(e_13);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'putOrder Error:' + e_13, null);
                    case 30: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.writeRecord = function (origin, update) {
        var _a, _b;
        var editArray = [];
        var currentTime = new Date().toISOString();
        var _c = origin.orderData, orderStatus = _c.orderStatus, progress = _c.progress;
        origin.orderData = __assign(__assign({}, origin.orderData), { orderStatus: orderStatus !== null && orderStatus !== void 0 ? orderStatus : '0', progress: progress !== null && progress !== void 0 ? progress : 'wait' });
        // 付款狀態變更記錄
        if (update.status != origin.status) {
            var statusTexts = {
                '1': '付款成功',
                '-2': '退款成功',
                '0': '修改為未付款',
                '3': '修改為部分付款',
            };
            var statusText = statusTexts[update.status];
            if (statusText) {
                editArray.push({
                    time: currentTime,
                    record: statusText,
                });
            }
        }
        // 訂單狀態變更記錄
        if (update.orderData.orderStatus != origin.orderData.orderStatus) {
            var orderStatusTexts = {
                '1': '訂單已完成',
                '0': '訂單改為處理中',
                '-1': '訂單已取消',
            };
            var orderStatusText = orderStatusTexts[update.orderData.orderStatus];
            if (orderStatusText) {
                editArray.push({
                    time: currentTime,
                    record: orderStatusText,
                });
            }
        }
        // 出貨狀態變更記錄
        if (update.orderData.progress != origin.orderData.progress) {
            var progressTexts = {
                shipping: '商品已出貨',
                wait: '商品處理中',
                finish: '商品已取貨',
                returns: '商品已退貨',
                arrived: '商品已到貨',
            };
            var progressText = progressTexts[update.orderData.progress];
            if (progressText) {
                editArray.push({
                    time: currentTime,
                    record: progressText,
                });
            }
        }
        // 新增出貨單號碼
        var updateNumber = (_a = update.orderData.user_info) === null || _a === void 0 ? void 0 : _a.shipment_number;
        if (updateNumber && updateNumber !== origin.orderData.user_info.shipment_number) {
            var type = origin.orderData.user_info.shipment_number ? '更新' : '建立';
            editArray.push({
                time: currentTime,
                record: "".concat(type, "\u51FA\u8CA8\u55AE\u865F\u78BC\\n{{shipment=").concat(updateNumber, "}}"),
            });
        }
        // 封存訂單
        if (update.orderData.archived === 'true' && origin.orderData.archived !== 'true') {
            editArray.push({
                time: currentTime,
                record: '訂單已封存',
            });
        }
        // 將新的變更記錄添加到現有記錄中
        if (editArray.length > 0) {
            update.orderData.editRecord = __spreadArray(__spreadArray([], ((_b = update.orderData.editRecord) !== null && _b !== void 0 ? _b : []), true), editArray, true);
        }
    };
    Shopping.prototype.resetStore = function (lineItems_1) {
        return __awaiter(this, arguments, void 0, function (lineItems, plus_or_minus) {
            function updateCalcData(calc, stock_id, product_id, spec) {
                var getCalc = calcMap.get(product_id);
                calcMap.set(product_id, __spreadArray(__spreadArray([], (getCalc !== null && getCalc !== void 0 ? getCalc : []), true), [{ calc: calc, stock_id: stock_id, product_id: product_id, spec: spec }], false));
            }
            var shoppingClass, calcMap;
            var _this = this;
            if (plus_or_minus === void 0) { plus_or_minus = 'plus'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shoppingClass = new Shopping(this.app, this.token);
                        calcMap = new Map();
                        lineItems.map(function (item) {
                            var _a;
                            if (item.product_category === 'kitchen' && ((_a = item.spec) === null || _a === void 0 ? void 0 : _a.length)) {
                                updateCalcData(item.count, '', item.id, item.spec);
                                return;
                            }
                            Object.entries(item.deduction_log).map(function (_a) {
                                var location = _a[0], count = _a[1];
                                var intCount = parseInt("".concat(count || 0), 10);
                                if (plus_or_minus === 'minus') {
                                    intCount = intCount * -1;
                                }
                                updateCalcData(intCount, location, item.id, item.spec);
                            });
                        });
                        return [4 /*yield*/, Promise.all(__spreadArray([], calcMap.values(), true).map(function (dataArray) { return __awaiter(_this, void 0, void 0, function () {
                                var _i, dataArray_1, data, calc, stock_id, product_id, spec;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _i = 0, dataArray_1 = dataArray;
                                            _a.label = 1;
                                        case 1:
                                            if (!(_i < dataArray_1.length)) return [3 /*break*/, 4];
                                            data = dataArray_1[_i];
                                            calc = data.calc, stock_id = data.stock_id, product_id = data.product_id, spec = data.spec;
                                            return [4 /*yield*/, shoppingClass.calcVariantsStock(calc, stock_id, product_id, spec)];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 寄送同時寄送購買人和寄件人
     * */
    Shopping.prototype.sendNotifications = function (orderData, type) {
        return __awaiter(this, void 0, void 0, function () {
            var lineID, messages, typeMap, line, _i, _a, email, _b, _c, data, sns;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        lineID = orderData.customer_info.lineID;
                        messages = [];
                        typeMap = {
                            shipment: 'shipment',
                            arrival: 'shipment-arrival',
                        };
                        if (lineID) {
                            line = new line_message_1.LineMessage(this.app);
                            messages.push(line.sendCustomerLine("auto-line-".concat(typeMap[type]), orderData.orderID, lineID));
                        }
                        for (_i = 0, _a = new Set([orderData.customer_info, orderData.user_info].map(function (dd) {
                            return dd && dd.email;
                        })); _i < _a.length; _i++) {
                            email = _a[_i];
                            if (email) {
                                messages.push(auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, "auto-email-".concat(typeMap[type]), orderData.orderID, email, orderData.language));
                            }
                        }
                        for (_b = 0, _c = [orderData.customer_info, orderData.user_info]; _b < _c.length; _b++) {
                            data = _c[_b];
                            sns = new sms_js_1.SMS(this.app);
                            messages.push(sns.sendCustomerSns("auto-sns-".concat(typeMap[type]), orderData.orderID, data.phone));
                        }
                        return [4 /*yield*/, Promise.all(messages)];
                    case 1:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.adjustStock = function (origin, orderData) {
        return __awaiter(this, void 0, void 0, function () {
            function updateCalcData(calc, stock_id, product_id, spec) {
                var getCalc = calcMap_1.get(product_id);
                calcMap_1.set(product_id, __spreadArray(__spreadArray([], (getCalc !== null && getCalc !== void 0 ? getCalc : []), true), [{ calc: calc, stock_id: stock_id, product_id: product_id, spec: spec }], false));
            }
            var shoppingClass_1, calcMap_1, error_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (orderData.orderStatus === '-1')
                            return [2 /*return*/];
                        shoppingClass_1 = new Shopping(this.app, this.token);
                        calcMap_1 = new Map();
                        orderData.lineItems.map(function (newItem) {
                            var _a;
                            if (newItem.product_category === 'kitchen' && ((_a = newItem.spec) === null || _a === void 0 ? void 0 : _a.length)) {
                                updateCalcData(newItem.count, '', newItem.id, newItem.spec);
                                return;
                            }
                            var originalItem = origin.lineItems.find(function (item) { return item.id === newItem.id && item.spec.join('') === newItem.spec.join(''); });
                            Object.entries(newItem.deduction_log).map(function (_a) {
                                var location = _a[0], newCount = _a[1];
                                var parsedNewCount = Number(newCount || 0);
                                var formatNewCount = isNaN(parsedNewCount) ? 0 : parsedNewCount;
                                if (!originalItem) {
                                    updateCalcData(formatNewCount * -1, location, newItem.id, newItem.spec);
                                    return;
                                }
                                var originalCount = originalItem.deduction_log[location] || 0;
                                var delta = formatNewCount - originalCount;
                                updateCalcData(delta * -1, location, newItem.id, newItem.spec);
                            });
                        });
                        return [4 /*yield*/, Promise.all(__spreadArray([], calcMap_1.values(), true).map(function (dataArray) { return __awaiter(_this, void 0, void 0, function () {
                                var _i, dataArray_2, data, calc, stock_id, product_id, spec;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _i = 0, dataArray_2 = dataArray;
                                            _a.label = 1;
                                        case 1:
                                            if (!(_i < dataArray_2.length)) return [3 /*break*/, 4];
                                            data = dataArray_2[_i];
                                            calc = data.calc, stock_id = data.stock_id, product_id = data.product_id, spec = data.spec;
                                            return [4 /*yield*/, shoppingClass_1.calcVariantsStock(calc, stock_id, product_id, spec)];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.error("adjustStock has error: ".concat(error_5));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.manualCancelOrder = function (order_id) {
        return __awaiter(this, void 0, void 0, function () {
            var orderList, userClass, user, _a, email, phone, origin_2, orderData, proofPurchase, paymentStatus, progressStatus, orderStatus, newRecord, e_14;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        if (!this.token) {
                            return [2 /*return*/, { result: false, message: 'The token is undefined' }];
                        }
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n         FROM `".concat(this.app, "`.t_checkout\n         WHERE cart_token = ?;\n        "), [order_id])];
                    case 1:
                        orderList = _c.sent();
                        if (orderList.length === 0) {
                            return [2 /*return*/, { result: false, message: "Order id #".concat(order_id, " is not exist") }];
                        }
                        userClass = new user_js_1.User(this.app);
                        return [4 /*yield*/, userClass.getUserData("".concat(this.token.userID), 'userID')];
                    case 2:
                        user = _c.sent();
                        _a = user.userData, email = _a.email, phone = _a.phone;
                        origin_2 = orderList[0];
                        if (![email, phone].includes(origin_2.email)) {
                            return [2 /*return*/, { result: false, message: 'The order does not match the token' }];
                        }
                        orderData = origin_2.orderData;
                        proofPurchase = orderData.proof_purchase === undefined;
                        paymentStatus = origin_2.status === undefined || origin_2.status === 0 || origin_2.status === -1;
                        progressStatus = orderData.progress === undefined || orderData.progress === 'wait';
                        orderStatus = orderData.orderStatus === undefined || "".concat(orderData.orderStatus) === '0';
                        if (proofPurchase && paymentStatus && progressStatus && orderStatus) {
                            orderData.orderStatus = '-1';
                            newRecord = {
                                time: new Date().toISOString(),
                                record: '顧客手動取消訂單',
                            };
                            orderData.editRecord = __spreadArray(__spreadArray([], ((_b = orderData.editRecord) !== null && _b !== void 0 ? _b : []), true), [newRecord], false);
                        }
                        return [4 /*yield*/, this.putOrder({
                                cart_token: order_id,
                                orderData: orderData,
                                status: undefined,
                            })];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, { result: true }];
                    case 4:
                        e_14 = _c.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'cancelOrder Error:' + e_14, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.deleteOrder = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var e_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("DELETE\n         FROM `".concat(this.app, "`.t_checkout\n         WHERE id in (?)"), [req.id.split(',')])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                result: true,
                            }];
                    case 2:
                        e_15 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'deleteOrder Error:' + e_15, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.proofPurchase = function (order_id, text) {
        return __awaiter(this, void 0, void 0, function () {
            var orderData, _i, _a, email, _b, _c, phone, sns, line, e_16;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 13, , 14]);
                        return [4 /*yield*/, database_js_1.default.query("select orderData\n           from `".concat(this.app, "`.t_checkout\n           where cart_token = ?"), [order_id])];
                    case 1:
                        orderData = (_d.sent())[0]['orderData'];
                        orderData.proof_purchase = text;
                        // 訂單待核款信件通知
                        new notify_js_1.ManagerNotify(this.app).uploadProof({ orderData: orderData });
                        _i = 0, _a = new Set([orderData.customer_info, orderData.user_info].map(function (dd) {
                            return dd && dd.email;
                        }));
                        _d.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        email = _a[_i];
                        if (!email) return [3 /*break*/, 4];
                        return [4 /*yield*/, auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'proof-purchase', order_id, email, orderData.language)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        _b = 0, _c = new Set([orderData.customer_info, orderData.user_info].map(function (dd) {
                            return dd && dd.phone;
                        }));
                        _d.label = 6;
                    case 6:
                        if (!(_b < _c.length)) return [3 /*break*/, 9];
                        phone = _c[_b];
                        sns = new sms_js_1.SMS(this.app);
                        return [4 /*yield*/, sns.sendCustomerSns('sns-proof-purchase', order_id, phone)];
                    case 7:
                        _d.sent();
                        console.info('訂單待核款簡訊寄送成功');
                        _d.label = 8;
                    case 8:
                        _b++;
                        return [3 /*break*/, 6];
                    case 9:
                        if (!orderData.customer_info.lineID) return [3 /*break*/, 11];
                        line = new line_message_1.LineMessage(this.app);
                        return [4 /*yield*/, line.sendCustomerLine('line-proof-purchase', order_id, orderData.customer_info.lineID)];
                    case 10:
                        _d.sent();
                        console.info('付款成功line訊息寄送成功');
                        _d.label = 11;
                    case 11: return [4 /*yield*/, this.putOrder({
                            orderData: orderData,
                            cart_token: order_id,
                            status: undefined,
                        })];
                    case 12:
                        _d.sent();
                        return [2 /*return*/, {
                                result: true,
                            }];
                    case 13:
                        e_16 = _d.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ProofPurchase Error:' + e_16, null);
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.getCheckOut = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var querySql, orderString, id_list, search_1, orderArray, temp, countingSQL, newArray, temp, codes, temp, shipment, temp, created_time, shipment_time, orderMath, sql_1, data_1, returnSql, returnData, response_data, obMap, keyData_3, e_17;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        querySql = ['1=1'];
                        orderString = 'order by id desc';
                        if (query.search && query.searchType) {
                            switch (query.searchType) {
                                case 'cart_token':
                                    querySql.push("(cart_token like '%".concat(query.search, "%')"));
                                    break;
                                case 'shipment_number':
                                    querySql.push("(shipment_number like '%".concat(query.search, "%')"));
                                    break;
                                case 'name':
                                case 'phone':
                                case 'email':
                                    querySql.push("((UPPER(customer_".concat(query.searchType, ") LIKE '%").concat(query.search.toUpperCase(), "%') or (UPPER(shipment_").concat(query.searchType, ") LIKE '%").concat(query.search.toUpperCase(), "%'))"));
                                    break;
                                case 'address':
                                    querySql.push("((UPPER(shipment_".concat(query.searchType, ") LIKE '%").concat(query.search.toUpperCase(), "%'))"));
                                    break;
                                case 'invoice_number':
                                    querySql.push("(cart_token in (select order_id from `".concat(this.app, "`.t_invoice_memory where invoice_no like '%").concat(query.search, "%' ))"));
                                    break;
                                case 'cart_token_exact':
                                    querySql.push("(cart_token = '".concat(query.search, "')"));
                                    break;
                                default:
                                    querySql.push("JSON_CONTAINS_PATH(orderData, 'one', '$.lineItems[*].title') AND JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.lineItems[*].".concat(query.searchType, "')) REGEXP '").concat(query.search, "'"));
                                    break;
                            }
                        }
                        if (query.id_list) {
                            id_list = __spreadArray([-99], query.id_list.split(','), true).join(',');
                            switch (query.searchType) {
                                case 'cart_token':
                                    querySql.push("(cart_token IN (".concat(id_list, "))"));
                                    break;
                                case 'shipment_number':
                                    querySql.push("(shipment_number IN (".concat(id_list, "))"));
                                    break;
                                default:
                                    querySql.push("(o.id IN (".concat(id_list, "))"));
                                    break;
                            }
                        }
                        if (query.reconciliation_status) {
                            search_1 = [];
                            query.reconciliation_status.map(function (status) {
                                if (status === 'pending_entry') {
                                    search_1.push("total_received is NULL");
                                }
                                else if (status === 'completed_entry') {
                                    search_1.push("total_received = total");
                                }
                                else if (status === 'refunded') {
                                    search_1.push("(total_received > total) && ((total_received + offset_amount) = total)");
                                }
                                else if (status === 'completed_offset') {
                                    search_1.push("(total_received < total) && ((total_received + offset_amount) = total)");
                                }
                                else if (status === 'pending_offset') {
                                    search_1.push("(total_received < total)  &&  (offset_amount is null)");
                                }
                                else if (status === 'pending_refund') {
                                    search_1.push("(total_received > total)   &&  (offset_amount is null)");
                                }
                            });
                            querySql.push("(".concat(search_1
                                .map(function (dd) {
                                return "(".concat(dd, ")");
                            })
                                .join(' or '), ")"));
                        }
                        if (query.orderStatus) {
                            orderArray = query.orderStatus.split(',');
                            temp = '';
                            if (orderArray.includes('0')) {
                                temp += 'order_status IS NULL OR ';
                            }
                            temp += "order_status IN (".concat(query.orderStatus, ")");
                            querySql.push("(".concat(temp, ")"));
                        }
                        if (!query.valid) return [3 /*break*/, 2];
                        return [4 /*yield*/, new user_js_1.User(this.app).getCheckoutCountingModeSQL('o')];
                    case 1:
                        countingSQL = _a.sent();
                        querySql.push(countingSQL);
                        _a.label = 2;
                    case 2:
                        if (query.is_shipment) {
                            querySql.push("(shipment_number IS NOT NULL) and (shipment_number != '')");
                        }
                        if (query.is_reconciliation) {
                            querySql.push("((o.status in (1,-2)) or ((payment_method='cash_on_delivery' and progress='finish') ))");
                        }
                        if (query.payment_select) {
                            querySql.push("payment_method in (".concat(query.payment_select
                                .split(',')
                                .map(function (d) { return "'".concat(d, "'"); })
                                .join(','), ")"));
                        }
                        if (query.progress) {
                            //備貨中
                            if (query.progress === 'in_stock') {
                                query.progress = 'wait';
                                querySql.push("shipment_number is NOT null");
                            }
                            else if (query.progress === 'wait') {
                                querySql.push("shipment_number is null");
                            }
                            newArray = query.progress.split(',');
                            temp = '';
                            if (newArray.includes('wait')) {
                                temp += 'progress IS NULL OR ';
                            }
                            temp += "progress IN (".concat(newArray.map(function (status) { return "\"".concat(status, "\""); }).join(','), ")");
                            querySql.push("(".concat(temp, ")"));
                        }
                        if (query.distribution_code) {
                            codes = query.distribution_code.split(',');
                            temp = '';
                            temp += "JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.distribution_info.code')) IN (".concat(codes.map(function (code) { return "\"".concat(code, "\""); }).join(','), ")");
                            querySql.push("(".concat(temp, ")"));
                        }
                        if (query.is_pos === 'true') {
                            querySql.push("order_source='POS'");
                        }
                        else if (query.is_pos === 'false') {
                            querySql.push("(order_source!='POS' or order_source is null)");
                        }
                        if (query.shipment) {
                            shipment = query.shipment.split(',');
                            temp = '';
                            if (shipment.includes('normal')) {
                                temp += '(shipment_method IS NULL) OR ';
                            }
                            temp += "(shipment_method IN (".concat(shipment.map(function (status) { return "\"".concat(status, "\""); }).join(','), "))");
                            querySql.push("(".concat(temp, ")"));
                        }
                        if (query.created_time) {
                            created_time = query.created_time.split(',');
                            if (created_time.length > 1) {
                                querySql.push("\n                        (created_time BETWEEN ".concat(database_js_1.default.escape("".concat(created_time[0])), " \n                        AND ").concat(database_js_1.default.escape("".concat(created_time[1])), ")\n                    "));
                            }
                        }
                        if (query.shipment_time) {
                            shipment_time = query.shipment_time.split(',');
                            if (shipment_time.length > 1) {
                                querySql.push("\n                       (shipment_date >= ".concat(database_js_1.default.escape("".concat(shipment_time[0])), ") and\n                        (shipment_date <= ").concat(database_js_1.default.escape("".concat(shipment_time[1])), ")\n                    "));
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
                        query.status && querySql.push("o.status IN (".concat(query.status, ")"));
                        orderMath = [];
                        // JSON_EXTRACT(orderData, '$.customer_info.phone')
                        query.email && orderMath.push("(email=".concat(database_js_1.default.escape(query.email), ")"));
                        query.phone && orderMath.push("(email=".concat(database_js_1.default.escape(query.phone), ")"));
                        if (orderMath.length) {
                            querySql.push("(".concat(orderMath.join(' or '), ")"));
                        }
                        if (query.filter_type === 'true' || query.archived) {
                            if (query.archived === 'true') {
                                querySql.push("(archived=\"".concat(query.archived, "\") \n                    AND (order_status IS NULL OR order_status NOT IN (-99))"));
                            }
                            else {
                                querySql.push("((archived=\"".concat(query.archived, "\") or (archived is null))"));
                            }
                        }
                        else if (query.filter_type === 'normal') {
                            querySql.push("((archived is null) or (archived!='true'))");
                        }
                        if (!(query.filter_type === 'true' || query.archived)) {
                            querySql.push("((order_status is null) or (order_status NOT IN (-99)))");
                        }
                        sql_1 = "SELECT i.invoice_no,\n                        i.invoice_data,\n                        i.`status` as invoice_status,\n                        o.*\n                 FROM `".concat(this.app, "`.t_checkout o\n                          LEFT JOIN `").concat(this.app, "`.t_invoice_memory i ON o.cart_token = i.order_id and i.status = 1\n                 WHERE ").concat(querySql.join(' and '), " ").concat(orderString);
                        if (!(query.returnSearch == 'true')) return [3 /*break*/, 5];
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n           FROM `".concat(this.app, "`.t_checkout\n           WHERE cart_token = ").concat(database_js_1.default.escape(query.search)), [])];
                    case 3:
                        data_1 = _a.sent();
                        returnSql = "SELECT *\n                         FROM `".concat(this.app, "`.t_return_order\n                         WHERE order_id = ").concat(query.search);
                        return [4 /*yield*/, database_js_1.default.query(returnSql, [])];
                    case 4:
                        returnData = _a.sent();
                        if (returnData.length > 0) {
                            returnData.forEach(function (returnOrder) {
                                var _a;
                                // todo 確認訂單是否被作廢
                                if (!((_a = data_1[0].orderData) === null || _a === void 0 ? void 0 : _a.discard)) {
                                }
                                data_1[0].orderData.lineItems.map(function (lineItem, index) {
                                    lineItem.count = lineItem.count - returnOrder.orderData.lineItems[index].return_count;
                                });
                                data_1[0].orderData.shipment_fee -= returnOrder.orderData.shipment_fee;
                            });
                            data_1[0].orderData.lineItems = data_1[0].orderData.lineItems.filter(function (dd) {
                                return dd.count > 0;
                            });
                        }
                        return [2 /*return*/, data_1[0]];
                    case 5: return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var data, _a;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!query.id) return [3 /*break*/, 2];
                                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n               FROM (".concat(sql_1, ") as subqyery limit ").concat(query.page * query.limit, ", ").concat(query.limit, "\n              "), [])];
                                    case 1:
                                        data = (_c.sent())[0];
                                        resolve({
                                            data: data,
                                            result: !!data,
                                        });
                                        return [3 /*break*/, 5];
                                    case 2:
                                        _a = resolve;
                                        _b = {};
                                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n               FROM (".concat(sql_1, ") as subqyery limit ").concat(query.page * query.limit, ", ").concat(query.limit, "\n              "), [])];
                                    case 3:
                                        _b.data = _c.sent();
                                        return [4 /*yield*/, database_js_1.default.query("SELECT count(1)\n                 FROM (".concat(sql_1, ") as subqyery\n                "), [])];
                                    case 4:
                                        _a.apply(void 0, [(_b.total = (_c.sent())[0]['count(1)'],
                                                _b)]);
                                        _c.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 6:
                        response_data = _a.sent();
                        obMap = Array.isArray(response_data.data) ? response_data.data : [response_data.data];
                        return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                appName: this.app,
                                key: 'glitter_finance',
                            })];
                    case 7:
                        keyData_3 = (_a.sent())[0].value;
                        return [4 /*yield*/, Promise.all(obMap
                                .map(function (order) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b, pay_now, _c, status_2, e_18;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _d.trys.push([0, 8, , 9]);
                                            if (!(order.orderData.customer_info.payment_select === 'ecPay')) return [3 /*break*/, 2];
                                            _a = order.orderData;
                                            return [4 /*yield*/, new financial_service_js_1.EcPay(this.app).checkPaymentStatus(order.cart_token)];
                                        case 1:
                                            _a.cash_flow = _d.sent();
                                            _d.label = 2;
                                        case 2:
                                            if (!(order.orderData.customer_info.payment_select === 'paynow')) return [3 /*break*/, 4];
                                            _b = order.orderData;
                                            return [4 /*yield*/, new financial_service_js_1.PayNow(this.app, keyData_3['paynow']).confirmAndCaptureOrder(order.orderData.paynow_id)];
                                        case 3:
                                            _b.cash_flow = (_d.sent()).result;
                                            _d.label = 4;
                                        case 4:
                                            if (!(order.orderData.user_info.shipment_refer === 'paynow')) return [3 /*break*/, 7];
                                            pay_now = new paynow_logistics_js_1.PayNowLogistics(this.app);
                                            _c = order.orderData.user_info;
                                            return [4 /*yield*/, pay_now.getOrderInfo(order.cart_token)];
                                        case 5:
                                            _c.shipment_detail = _d.sent();
                                            status_2 = (function () {
                                                switch (order.orderData.user_info.shipment_detail.PayNowLogisticCode) {
                                                    case '0000':
                                                    case '7101':
                                                    case '7201':
                                                        return 'wait';
                                                    case '0101':
                                                    case '4000':
                                                    case '0102':
                                                    case '9411':
                                                        return 'shipping';
                                                    case '0103':
                                                    case '4019':
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
                                            if (!(status_2 && order.orderData.progress !== status_2)) return [3 /*break*/, 7];
                                            order.orderData.progress = status_2;
                                            return [4 /*yield*/, this.putOrder({
                                                    status: undefined,
                                                    orderData: order.orderData,
                                                    id: order.id,
                                                })];
                                        case 6:
                                            _d.sent();
                                            _d.label = 7;
                                        case 7: return [3 /*break*/, 9];
                                        case 8:
                                            e_18 = _d.sent();
                                            return [3 /*break*/, 9];
                                        case 9: return [2 /*return*/];
                                    }
                                });
                            }); })
                                //補上發票號碼資訊
                                .concat(obMap.map(function (order) { return __awaiter(_this, void 0, void 0, function () {
                                var invoice;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, new invoice_js_1.Invoice(this.app).getInvoice({
                                                page: 0,
                                                limit: 1,
                                                search: order.cart_token,
                                                searchType: order.orderData.order_number,
                                            })];
                                        case 1:
                                            invoice = (_a.sent()).data[0];
                                            order.invoice_number = invoice && invoice.invoice_no;
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))
                                //補上用戶資訊
                                .concat(obMap.map(function (order) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = order;
                                            return [4 /*yield*/, new user_js_1.User(this.app).getUserData(order.email, 'email_or_phone')];
                                        case 1:
                                            _a.user_data = _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })))];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, response_data];
                    case 9:
                        e_17 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getCheckOut Error:' + e_17, null);
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.releaseCheckout = function (status, order_id) {
        return __awaiter(this, void 0, void 0, function () {
            var order_data, original_status, _i, _a, b, cartData, brandAndMemberType, store_info, _b, _c, b, _d, _e, email, _f, _g, phone, sns, line, userData, e_19, error_6;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 28, , 29]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n           FROM `".concat(this.app, "`.t_checkout\n           WHERE cart_token = ?\n          "), [order_id])];
                    case 1:
                        order_data = (_h.sent())[0];
                        original_status = order_data['status'];
                        if (!(status === -1)) return [3 /*break*/, 3];
                        if (original_status === -1) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, database_js_1.default.execute("UPDATE `".concat(this.app, "`.t_checkout\n           SET status = ?\n           WHERE cart_token = ?"), [-1, order_id])];
                    case 2:
                        _h.sent();
                        _h.label = 3;
                    case 3:
                        if (!(original_status === 1 && status !== 1)) return [3 /*break*/, 7];
                        _i = 0, _a = order_data['orderData'].lineItems;
                        _h.label = 4;
                    case 4:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        b = _a[_i];
                        return [4 /*yield*/, this.calcSoldOutStock(b.count * -1, b.id, b.spec)];
                    case 5:
                        _h.sent();
                        _h.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        if (!(status === 1)) return [3 /*break*/, 27];
                        if (original_status === 1) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, database_js_1.default.execute("UPDATE `".concat(this.app, "`.t_checkout\n           SET status = ?\n           WHERE cart_token = ?"), [1, order_id])];
                    case 8:
                        _h.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n             FROM `".concat(this.app, "`.t_checkout\n             WHERE cart_token = ?;"), [order_id])];
                    case 9:
                        cartData = (_h.sent())[0];
                        return [4 /*yield*/, app_js_1.App.checkBrandAndMemberType(this.app)];
                    case 10:
                        brandAndMemberType = _h.sent();
                        return [4 /*yield*/, new user_js_1.User(this.app).getConfigV2({
                                key: 'store-information',
                                user_id: 'manager',
                            })];
                    case 11:
                        store_info = _h.sent();
                        for (_b = 0, _c = order_data['orderData'].lineItems; _b < _c.length; _b++) {
                            b = _c[_b];
                            // 更改為已付款
                            this.calcSoldOutStock(b.count, b.id, b.spec);
                            // 確認是否有商品信件通知
                            this.soldMailNotice({
                                brand_domain: brandAndMemberType.domain,
                                shop_name: store_info.shop_name,
                                product_id: b.id,
                                order_data: cartData.orderData,
                            });
                        }
                        // 訂單已付款信件通知（管理員, 消費者）
                        new notify_js_1.ManagerNotify(this.app).checkout({
                            orderData: cartData.orderData,
                            status: status,
                        });
                        _d = 0, _e = new Set([cartData.orderData.customer_info, cartData.orderData.user_info].map(function (dd) {
                            return dd && dd.email;
                        }));
                        _h.label = 12;
                    case 12:
                        if (!(_d < _e.length)) return [3 /*break*/, 15];
                        email = _e[_d];
                        if (!email) return [3 /*break*/, 14];
                        return [4 /*yield*/, auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-payment-successful', order_id, email, cartData.orderData.language)];
                    case 13:
                        _h.sent();
                        _h.label = 14;
                    case 14:
                        _d++;
                        return [3 /*break*/, 12];
                    case 15:
                        _f = 0, _g = new Set([cartData.orderData.customer_info, cartData.orderData.user_info].map(function (dd) {
                            return dd && dd.phone;
                        }));
                        _h.label = 16;
                    case 16:
                        if (!(_f < _g.length)) return [3 /*break*/, 19];
                        phone = _g[_f];
                        sns = new sms_js_1.SMS(this.app);
                        return [4 /*yield*/, sns.sendCustomerSns('auto-sns-payment-successful', order_id, phone)];
                    case 17:
                        _h.sent();
                        console.info('付款成功簡訊寄送成功');
                        _h.label = 18;
                    case 18:
                        _f++;
                        return [3 /*break*/, 16];
                    case 19:
                        if (!cartData.orderData.customer_info.lineID) return [3 /*break*/, 21];
                        line = new line_message_1.LineMessage(this.app);
                        return [4 /*yield*/, line.sendCustomerLine('auto-line-payment-successful', order_id, cartData.orderData.customer_info.lineID)];
                    case 20:
                        _h.sent();
                        console.info('付款成功line訊息寄送成功');
                        _h.label = 21;
                    case 21: return [4 /*yield*/, new user_js_1.User(this.app).getUserData(cartData.email, 'account')];
                    case 22:
                        userData = _h.sent();
                        _h.label = 23;
                    case 23:
                        _h.trys.push([23, 25, , 26]);
                        return [4 /*yield*/, new custom_code_js_1.CustomCode(this.app).checkOutHook({ userData: userData, cartData: cartData })];
                    case 24:
                        _h.sent();
                        return [3 /*break*/, 26];
                    case 25:
                        e_19 = _h.sent();
                        console.error(e_19);
                        return [3 /*break*/, 26];
                    case 26:
                        new invoice_js_1.Invoice(this.app).postCheckoutInvoice(order_id, false);
                        _h.label = 27;
                    case 27: return [3 /*break*/, 29];
                    case 28:
                        error_6 = _h.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Release Checkout Error:' + express_1.default, null);
                    case 29: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.shareVoucherRebate = function (cartData) {
        return __awaiter(this, void 0, void 0, function () {
            var order_id, rebateClass, userClass, userData, _loop_4, this_3, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order_id = cartData.cart_token;
                        rebateClass = new rebate_js_1.Rebate(this.app);
                        userClass = new user_js_1.User(this.app);
                        return [4 /*yield*/, userClass.getUserData(cartData.email, 'account')];
                    case 1:
                        userData = _a.sent();
                        if (!(order_id && userData && cartData.orderData.rebate > 0)) return [3 /*break*/, 5];
                        _loop_4 = function (i) {
                            var orderVoucher, voucherRow, usedVoucher, voucherTitle, rebateEndDay, cf, date;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        orderVoucher = cartData.orderData.voucherList[i];
                                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n           FROM `".concat(this_3.app, "`.t_manager_post\n           WHERE JSON_EXTRACT(content, '$.type') = 'voucher'\n             AND id = ?;"), [orderVoucher.id])];
                                    case 1:
                                        voucherRow = _b.sent();
                                        if (!(orderVoucher.id === 0 || voucherRow[0])) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this_3.isUsedVoucher(userData.userID, orderVoucher.id, order_id)];
                                    case 2:
                                        usedVoucher = _b.sent();
                                        voucherTitle = orderVoucher.id === 0 ? orderVoucher.title : voucherRow[0].content.title;
                                        rebateEndDay = (function () {
                                            try {
                                                return "".concat(voucherRow[0].content.rebateEndDay);
                                            }
                                            catch (error) {
                                                return '0';
                                            }
                                        })();
                                        if (!(orderVoucher.rebate_total && !usedVoucher)) return [3 /*break*/, 4];
                                        cf = {
                                            voucher_id: orderVoucher.id,
                                            order_id: order_id,
                                        };
                                        if (parseInt(rebateEndDay, 10)) {
                                            date = new Date();
                                            date.setDate(date.getDate() + parseInt(rebateEndDay, 10));
                                            cf.deadTime = (0, moment_1.default)(date).format('YYYY-MM-DD HH:mm:ss');
                                        }
                                        return [4 /*yield*/, rebateClass.insertRebate(userData.userID, orderVoucher.rebate_total, "\u512A\u60E0\u5238\u8CFC\u7269\u91D1\uFF1A".concat(voucherTitle), cf)];
                                    case 3:
                                        _b.sent();
                                        _b.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        this_3 = this;
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < cartData.orderData.voucherList.length)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_4(i)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (!(cartData.orderData.voucherList && cartData.orderData.voucherList.length > 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.releaseVoucherHistory(order_id, 1)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.checkVoucherLimited = function (user_id, voucher_id) {
        return __awaiter(this, void 0, void 0, function () {
            var vouchers, history_2, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT id,\n                JSON_EXTRACT(content, '$.macroLimited') AS macroLimited,\n                JSON_EXTRACT(content, '$.microLimited') AS microLimited\n         FROM `".concat(this.app, "`.t_manager_post\n         WHERE id = ?;"), [voucher_id])];
                    case 1:
                        vouchers = _a.sent();
                        if (!vouchers[0]) {
                            return [2 /*return*/, false];
                        }
                        if (vouchers[0].macroLimited === 0 && vouchers[0].microLimited === 0) {
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n         FROM `".concat(this.app, "`.t_voucher_history\n         WHERE voucher_id = ?\n           AND status in (1, 2);"), [voucher_id])];
                    case 2:
                        history_2 = _a.sent();
                        if (vouchers[0].macroLimited > 0 && history_2.length >= vouchers[0].macroLimited) {
                            return [2 /*return*/, false];
                        }
                        if (vouchers[0].microLimited > 0 &&
                            history_2.filter(function (item) {
                                return item.user_id === user_id;
                            }).length >= vouchers[0].microLimited) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                    case 3:
                        error_7 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'checkVoucherHistory Error:' + express_1.default, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.isUsedVoucher = function (user_id, voucher_id, order_id) {
        return __awaiter(this, void 0, void 0, function () {
            var history_3, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n         FROM `".concat(this.app, "`.t_rebate_point\n         WHERE user_id = ?\n           AND content ->>'$.order_id' = ?\n           AND content->>'$.voucher_id' = ?;"), [user_id, order_id, voucher_id])];
                    case 1:
                        history_3 = _a.sent();
                        return [2 /*return*/, history_3.length > 0];
                    case 2:
                        error_8 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'checkOrderVoucher 錯誤: ' + error_8, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.insertVoucherHistory = function (user_id, order_id, voucher_id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("INSERT INTO `".concat(this.app, "`.`t_voucher_history`\n         set ?"), [
                                {
                                    user_id: user_id,
                                    order_id: order_id,
                                    voucher_id: voucher_id,
                                    created_at: new Date(),
                                    updated_at: new Date(),
                                    status: 2,
                                },
                            ])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'insertVoucherHistory Error:' + express_1.default, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.releaseVoucherHistory = function (order_id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.t_voucher_history\n         SET status = ?\n         WHERE order_id = ?;"), [status, order_id])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'insertVoucherHistory Error:' + express_1.default, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.resetVoucherHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resetMins, now, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        resetMins = 10;
                        now = (0, moment_1.default)().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
                        return [4 /*yield*/, database_js_1.default.query("\n            UPDATE `".concat(this.app, "`.t_voucher_history\n            SET status = 0\n            WHERE status = 2\n              AND updated_at < DATE_SUB('").concat(now, "', INTERVAL ").concat(resetMins, " MINUTE);"), [])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'insertVoucherHistory Error:' + express_1.default, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.postVariantsAndPriceValue = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var originVariants_1, _user, storeConfig_2, sourceMap_1, insertPromises, exhibitionConfig, error_12;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 8, , 9]);
                        content.variants = (_a = content.variants) !== null && _a !== void 0 ? _a : [];
                        content.min_price = undefined;
                        content.max_price = undefined;
                        content.total_sales = 0;
                        if (!content.id) {
                            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Missing product ID.', null);
                        }
                        return [4 /*yield*/, database_js_1.default.query("SELECT id, product_id, content ->>'$.spec' as spec\n         FROM `".concat(this.app, "`.t_variants\n         WHERE product_id = ?"), [content.id])];
                    case 1:
                        originVariants_1 = _c.sent();
                        return [4 /*yield*/, database_js_1.default.query("DELETE\n         FROM `".concat(this.app, "`.t_variants\n         WHERE product_id = ?\n           AND id > 0"), [content.id])];
                    case 2:
                        _c.sent();
                        _user = new user_js_1.User(this.app);
                        return [4 /*yield*/, _user.getConfigV2({ key: 'store_manager', user_id: 'manager' })];
                    case 3:
                        storeConfig_2 = _c.sent();
                        sourceMap_1 = {};
                        insertPromises = content.variants.map(function (variant) { return __awaiter(_this, void 0, void 0, function () {
                            var insertData, originalVariant;
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
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
                                            variant.stockList[storeConfig_2.list[0].id] = { count: variant.stock };
                                        }
                                        return [4 /*yield*/, database_js_1.default.query("INSERT INTO `".concat(this.app, "`.t_variants SET ?\n          "), [
                                                {
                                                    content: JSON.stringify(variant),
                                                    product_id: content.id,
                                                },
                                            ])];
                                    case 1:
                                        insertData = _d.sent();
                                        originalVariant = originVariants_1.find(function (item) { return JSON.parse(item.spec).join(',') === variant.spec.join(','); });
                                        if (originalVariant) {
                                            sourceMap_1[originalVariant.id] = insertData.insertId;
                                        }
                                        return [2 /*return*/, insertData];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(insertPromises)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, _user.getConfigV2({ key: 'exhibition_manager', user_id: 'manager' })];
                    case 5:
                        exhibitionConfig = _c.sent();
                        exhibitionConfig.list = (_b = exhibitionConfig.list) !== null && _b !== void 0 ? _b : [];
                        exhibitionConfig.list.forEach(function (exhibition) {
                            exhibition.dataList.forEach(function (item) {
                                if (sourceMap_1[item.variantID]) {
                                    item.variantID = sourceMap_1[item.variantID];
                                }
                            });
                        });
                        return [4 /*yield*/, _user.setConfig({
                                key: 'exhibition_manager',
                                user_id: 'manager',
                                value: exhibitionConfig,
                            })];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.t_manager_post\n         SET ?\n         WHERE id = ?"), [{ content: JSON.stringify(content) }, content.id])];
                    case 7:
                        _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_12 = _c.sent();
                        console.error(error_12);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postVariantsAndPriceValue Error: ' + error_12, null);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.updateVariantsWithSpec = function (data, product_id, spec) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, e_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = spec.length > 0
                            ? "AND JSON_CONTAINS(content->'$.spec', JSON_ARRAY(".concat(spec
                                .map(function (data) {
                                return "\"".concat(data, "\"");
                            })
                                .join(','), "));")
                            : '';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.`t_variants`\n         SET ?\n         WHERE product_id = ? ").concat(sql, "\n        "), [
                                {
                                    content: JSON.stringify(data),
                                },
                                product_id,
                            ])];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_20 = _a.sent();
                        console.error('error -- ', e_20);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.updateVariantsForScheduled = function (data, scheduled_id) {
        return __awaiter(this, void 0, void 0, function () {
            var e_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.`t_live_purchase_interactions`\n         SET ?\n         WHERE id = ").concat(scheduled_id, "\n        "), [
                                {
                                    content: JSON.stringify(data),
                                },
                            ])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_21 = _a.sent();
                        console.error('error -- ', e_21);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //更新庫存數量
    Shopping.prototype.calcVariantsStock = function (calc, stock_id, product_id, spec) {
        return __awaiter(this, void 0, void 0, function () {
            var pd_data_1, variant_s, store_config, e_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getProduct({
                                id: product_id,
                                page: 0,
                                limit: 1,
                                is_manger: true,
                            })];
                    case 1:
                        pd_data_1 = (_a.sent()).data.content;
                        variant_s = pd_data_1.variants.find(function (dd) {
                            return dd.spec.join('-') === spec.join('-');
                        });
                        if (!(pd_data_1.product_category === 'kitchen' && pd_data_1.specs && pd_data_1.specs.length)) return [3 /*break*/, 2];
                        variant_s.spec.map(function (d1, index) {
                            var _a;
                            var count_s = "".concat((_a = pd_data_1.specs[index].option.find(function (d2) {
                                return d2.title === d1;
                            }).stock) !== null && _a !== void 0 ? _a : '');
                            if (count_s) {
                                pd_data_1.specs[index].option.find(function (d2) {
                                    return d2.title === d1;
                                }).stock = parseInt(count_s, 10) + calc;
                            }
                        });
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, new user_js_1.User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' })];
                    case 3:
                        store_config = _a.sent();
                        if (Object.keys(variant_s.stockList).length === 0) {
                            //適應舊版庫存更新
                            variant_s.stockList[store_config.list[0].id] = { count: variant_s.stock };
                        }
                        if (variant_s.stockList[stock_id]) {
                            variant_s.stockList[stock_id].count = variant_s.stockList[stock_id].count || 0;
                            variant_s.stockList[stock_id].count = variant_s.stockList[stock_id].count + calc;
                            if (variant_s.stockList[stock_id].count < 0) {
                                variant_s.stockList[stock_id].count = 0;
                            }
                        }
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.postVariantsAndPriceValue(pd_data_1)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_22 = _a.sent();
                        console.error('error -- can not find variants', e_22);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    //更新販售數量
    Shopping.prototype.calcSoldOutStock = function (calc, product_id, spec) {
        return __awaiter(this, void 0, void 0, function () {
            var pd_data, variant_s, e_23;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_js_1.default.query("select *\n           from `".concat(this.app, "`.t_manager_post\n           where id = ?"), [product_id])];
                    case 1:
                        pd_data = (_b.sent())[0]['content'];
                        variant_s = pd_data.variants.find(function (dd) {
                            return dd.spec.join('-') === spec.join('-');
                        });
                        variant_s.sold_out = (_a = variant_s.sold_out) !== null && _a !== void 0 ? _a : 0;
                        variant_s.sold_out += calc;
                        if (variant_s.sold_out < 0) {
                            variant_s.sold_out = 0;
                        }
                        return [4 /*yield*/, this.postVariantsAndPriceValue(pd_data)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_23 = _b.sent();
                        console.error('calcSoldOutStock error', e_23);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //商品完成購買寄送信件
    Shopping.prototype.soldMailNotice = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var order_data, order_id, pd_data, notice, e_24;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 2, , 3]);
                        order_data = json.order_data;
                        order_id = order_data.orderID;
                        return [4 /*yield*/, database_js_1.default.query("select *\n           from `".concat(this.app, "`.t_manager_post\n           where id = ?"), [json.product_id])];
                    case 1:
                        pd_data = (_f.sent())[0]['content'];
                        if (pd_data.email_notice && pd_data.email_notice.length > 0 && order_data.user_info.email) {
                            notice = pd_data.email_notice
                                .replace(/@\{\{訂單號碼\}\}/g, "<a href=\"https://".concat(json.brand_domain, "/order_detail?cart_token=").concat(order_id, "\">").concat(order_id, "</a>"))
                                .replace(/@\{\{訂單金額\}\}/g, order_data.total)
                                .replace(/@\{\{app_name\}\}/g, json.shop_name)
                                .replace(/@\{\{user_name\}\}/g, (_a = order_data.user_info.name) !== null && _a !== void 0 ? _a : '')
                                .replace(/@\{\{姓名\}\}/g, (_b = order_data.customer_info.name) !== null && _b !== void 0 ? _b : '')
                                .replace(/@\{\{電話\}\}/g, (_c = order_data.user_info.phone) !== null && _c !== void 0 ? _c : '')
                                .replace(/@\{\{地址\}\}/g, (_d = order_data.user_info.address) !== null && _d !== void 0 ? _d : '')
                                .replace(/@\{\{信箱\}\}/g, (_e = order_data.user_info.email) !== null && _e !== void 0 ? _e : '');
                            (0, ses_js_1.sendmail)("".concat(json.shop_name, " <").concat(process.env.smtp, ">"), order_data.user_info.email, "".concat(pd_data.title, " \u8CFC\u8CB7\u901A\u77E5\u4FE1"), notice, function () { });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_24 = _f.sent();
                        console.error('soldMailNotice error', e_24);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.formatDateString = function (isoDate) {
        // 使用給定的 ISO 8601 日期字符串，或建立一個當前時間的 Date 對象
        var date = isoDate ? new Date(isoDate) : new Date();
        // 提取年、月、日、時、分
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        var hours = String(date.getHours()).padStart(2, '0');
        var minutes = String(date.getMinutes()).padStart(2, '0');
        // 格式化為所需的字符串
        return "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes);
    };
    Shopping.prototype.getCollectionProducts = function (tags) {
        return __awaiter(this, void 0, void 0, function () {
            var products_sql, products, tagArray_1, e_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        products_sql = "SELECT *\n                            FROM `".concat(this.app, "`.t_manager_post\n                            WHERE JSON_EXTRACT(content, '$.type') = 'product';");
                        return [4 /*yield*/, database_js_1.default.query(products_sql, [])];
                    case 1:
                        products = _a.sent();
                        tagArray_1 = tags.split(',');
                        return [2 /*return*/, products.filter(function (product) {
                                return tagArray_1.some(function (tag) { return product.content.collection.includes(tag); });
                            })];
                    case 2:
                        e_25 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e_25, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.getCollectionProductVariants = function (tags) {
        return __awaiter(this, void 0, void 0, function () {
            var products_sql, products, tagArray_2, filterProducts, sql, data, e_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        products_sql = "SELECT *\n                            FROM `".concat(this.app, "`.t_manager_post\n                            WHERE JSON_EXTRACT(content, '$.type') = 'product';");
                        return [4 /*yield*/, database_js_1.default.query(products_sql, [])];
                    case 1:
                        products = _a.sent();
                        tagArray_2 = tags.split(',');
                        filterProducts = products.filter(function (product) {
                            return tagArray_2.some(function (tag) { return product.content.collection.includes(tag); });
                        });
                        if (filterProducts.length === 0) {
                            return [2 /*return*/, []];
                        }
                        sql = "\n          SELECT v.id,\n                 v.product_id,\n                 v.content                                            as variant_content,\n                 p.content                                            as product_content,\n                 CAST(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) as stock\n          FROM `".concat(this.app, "`.t_variants AS v\n                   JOIN\n               `").concat(this.app, "`.t_manager_post AS p ON v.product_id = p.id\n          WHERE product_id in (").concat(filterProducts.map(function (item) { return item.id; }).join(','), ")\n          ORDER BY id DESC\n      ");
                        return [4 /*yield*/, database_js_1.default.query(sql, [])];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        e_26 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e_26, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.putCollection = function (replace, original) {
        return __awaiter(this, void 0, void 0, function () {
            var config_1, oTitle, rTitle_1, parent_1, children, parent_2, formatData_1, parentIndex, parentIndex_1, oTitle_1, rTitle_2, originParentIndex, replaceParentIndex, childrenIndex, filter_childrens, delete_id_list, products_sql, delete_product_list, _i, delete_product_list_1, product, _loop_5, this_4, _a, _b, id, e_27;
            var _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        _k.trys.push([0, 14, , 15]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n             FROM `".concat(this.app, "`.public_config\n             WHERE `key` = 'collection';"), [])];
                    case 1:
                        config_1 = (_c = (_k.sent())[0]) !== null && _c !== void 0 ? _c : {};
                        config_1.value = config_1.value || [];
                        if (replace.parentTitles[0] === '(無)') {
                            replace.parentTitles = [];
                        }
                        // 標題禁止空白格與指定符號
                        replace.title = replace.title.replace(/[\s,\/\\]+/g, '');
                        if (replace.parentTitles.length > 0) {
                            oTitle = (_d = original.parentTitles[0]) !== null && _d !== void 0 ? _d : '';
                            rTitle_1 = replace.parentTitles[0];
                            if (!(replace.title === original.title && rTitle_1 === oTitle)) {
                                parent_1 = config_1.value.find(function (col) { return col.title === rTitle_1; });
                                children = parent_1.array.find(function (chi) { return chi.title === replace.title; });
                                if (children) {
                                    return [2 /*return*/, {
                                            result: false,
                                            message: "\u4E0A\u5C64\u5206\u985E\u300C".concat(parent_1.title, "\u300D\u5DF2\u5B58\u5728\u300C").concat(children.title, "\u300D\u985E\u5225\u540D\u7A31"),
                                        }];
                                }
                            }
                        }
                        else {
                            // 父類別驗證
                            if (replace.title !== original.title) {
                                parent_2 = config_1.value.find(function (col) { return col.title === replace.title; });
                                if (parent_2) {
                                    return [2 /*return*/, {
                                            result: false,
                                            message: "\u4E0A\u5C64\u5206\u985E\u5DF2\u5B58\u5728\u300C".concat(parent_2.title, "\u300D\u985E\u5225\u540D\u7A31"),
                                        }];
                                }
                            }
                        }
                        formatData_1 = {
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
                            parentIndex = config_1.value.findIndex(function (col) {
                                return col.title === replace.parentTitles[0];
                            });
                            if (parentIndex === -1) {
                                // 新增父層類別
                                config_1.value.push(formatData_1);
                            }
                            else {
                                // 新增子層類別
                                config_1.value[parentIndex].array.push(formatData_1);
                            }
                        }
                        else if (replace.parentTitles.length === 0) {
                            parentIndex_1 = config_1.value.findIndex(function (col) { return col.title === original.title; });
                            config_1.value[parentIndex_1] = __assign(__assign({}, formatData_1), { array: replace.subCollections.map(function (col) {
                                    var sub = config_1.value[parentIndex_1].array.find(function (item) { return item.title === col; });
                                    return __assign(__assign({}, sub), { array: [], title: col, code: sub ? sub.code : '', hidden: formatData_1.hidden ? true : Boolean(sub.hidden) });
                                }) });
                        }
                        else {
                            oTitle_1 = (_e = original.parentTitles[0]) !== null && _e !== void 0 ? _e : '';
                            rTitle_2 = replace.parentTitles[0];
                            originParentIndex = config_1.value.findIndex(function (col) { return col.title === oTitle_1; });
                            replaceParentIndex = config_1.value.findIndex(function (col) { return col.title === rTitle_2; });
                            childrenIndex = config_1.value[originParentIndex].array.findIndex(function (chi) {
                                return chi.title === original.title;
                            });
                            if (originParentIndex === replaceParentIndex) {
                                // 編輯子層類別，沒有調整父層
                                config_1.value[originParentIndex].array[childrenIndex] = formatData_1;
                            }
                            else {
                                // 編輯子層類別，有調整父層
                                config_1.value[originParentIndex].array.splice(childrenIndex, 1);
                                config_1.value[replaceParentIndex].array.push(formatData_1);
                            }
                        }
                        if (!original.parentTitles[0]) return [3 /*break*/, 3];
                        filter_childrens = original.subCollections.filter(function (child) {
                            return replace.subCollections.findIndex(function (child2) { return child2 === child; }) === -1;
                        });
                        return [4 /*yield*/, this.deleteCollectionProduct(original.title, filter_childrens)];
                    case 2:
                        _k.sent();
                        _k.label = 3;
                    case 3:
                        if (!(original.title.length > 0)) return [3 /*break*/, 8];
                        delete_id_list = ((_f = original.product_id) !== null && _f !== void 0 ? _f : []).filter(function (oid) {
                            var _a;
                            return ((_a = replace.product_id) !== null && _a !== void 0 ? _a : []).findIndex(function (rid) { return rid === oid; }) === -1;
                        });
                        if (!(delete_id_list.length > 0)) return [3 /*break*/, 8];
                        products_sql = "SELECT *\n                                FROM `".concat(this.app, "`.t_manager_post\n                                WHERE id in (").concat(delete_id_list.join(','), ");");
                        return [4 /*yield*/, database_js_1.default.query(products_sql, [])];
                    case 4:
                        delete_product_list = _k.sent();
                        _i = 0, delete_product_list_1 = delete_product_list;
                        _k.label = 5;
                    case 5:
                        if (!(_i < delete_product_list_1.length)) return [3 /*break*/, 8];
                        product = delete_product_list_1[_i];
                        product.content.collection = product.content.collection.filter(function (str) {
                            if (original.parentTitles[0]) {
                                return str !== "".concat(original.parentTitles[0], " / ").concat(original.title);
                            }
                            else {
                                return !(str.includes("".concat(original.title, " /")) || str === "".concat(original.title));
                            }
                        });
                        return [4 /*yield*/, this.updateProductCollection(product.content, product.id)];
                    case 6:
                        _k.sent();
                        _k.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8:
                        _loop_5 = function (id) {
                            var get_product, product, originalParentTitles_1, replaceParentTitles_1;
                            return __generator(this, function (_l) {
                                switch (_l.label) {
                                    case 0: return [4 /*yield*/, database_js_1.default.query("SELECT *\n           FROM `".concat(this_4.app, "`.t_manager_post\n           WHERE id = ?\n          "), [id])];
                                    case 1:
                                        get_product = _l.sent();
                                        if (!get_product[0]) return [3 /*break*/, 3];
                                        product = get_product[0];
                                        originalParentTitles_1 = (_h = original.parentTitles[0]) !== null && _h !== void 0 ? _h : '';
                                        replaceParentTitles_1 = (_j = replace.parentTitles[0]) !== null && _j !== void 0 ? _j : '';
                                        if (original.title.length > 0) {
                                            product.content.collection = product.content.collection
                                                .filter(function (str) {
                                                if (originalParentTitles_1 === replaceParentTitles_1) {
                                                    return true;
                                                }
                                                if (replaceParentTitles_1) {
                                                    if (str === originalParentTitles_1 || str.includes("".concat(originalParentTitles_1, " / ").concat(original.title))) {
                                                        return false;
                                                    }
                                                }
                                                else {
                                                    if (str === original.title || str.includes("".concat(original.title, " /"))) {
                                                        return false;
                                                    }
                                                }
                                                return true;
                                            })
                                                .map(function (str) {
                                                if (replaceParentTitles_1) {
                                                    if (str.includes("".concat(originalParentTitles_1, " / ").concat(original.title))) {
                                                        return str.replace(original.title, replace.title);
                                                    }
                                                }
                                                else {
                                                    if (str === original.title || str.includes("".concat(original.title, " /"))) {
                                                        return str.replace(original.title, replace.title);
                                                    }
                                                }
                                                return str;
                                            });
                                        }
                                        if (replaceParentTitles_1 === '') {
                                            product.content.collection.push(replace.title);
                                        }
                                        else {
                                            product.content.collection.push(replaceParentTitles_1);
                                            product.content.collection.push("".concat(replaceParentTitles_1, " / ").concat(replace.title));
                                        }
                                        product.content.collection = __spreadArray([], new Set(product.content.collection), true);
                                        return [4 /*yield*/, this_4.updateProductCollection(product.content, product.id)];
                                    case 2:
                                        _l.sent();
                                        _l.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_4 = this;
                        _a = 0, _b = (_g = replace.product_id) !== null && _g !== void 0 ? _g : [];
                        _k.label = 9;
                    case 9:
                        if (!(_a < _b.length)) return [3 /*break*/, 12];
                        id = _b[_a];
                        return [5 /*yield**/, _loop_5(id)];
                    case 10:
                        _k.sent();
                        _k.label = 11;
                    case 11:
                        _a++;
                        return [3 /*break*/, 9];
                    case 12: 
                    // 更新商品類別 config
                    return [4 /*yield*/, database_js_1.default.execute("UPDATE `".concat(this.app, "`.public_config\n         SET value = ?\n         WHERE `key` = 'collection';\n        "), [config_1.value])];
                    case 13:
                        // 更新商品類別 config
                        _k.sent();
                        return [2 /*return*/, { result: true }];
                    case 14:
                        e_27 = _k.sent();
                        console.error(e_27);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'putCollection Error:' + e_27, null);
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.sortCollection = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var parentTitle_1, config_2, index_1, sortList, e_28;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        if (!(data && data[0])) return [3 /*break*/, 3];
                        parentTitle_1 = (_a = data[0].parentTitles[0]) !== null && _a !== void 0 ? _a : '';
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n               FROM `".concat(this.app, "`.public_config\n               WHERE `key` = 'collection';"), [])];
                    case 1:
                        config_2 = (_b = (_c.sent())[0]) !== null && _b !== void 0 ? _b : {};
                        config_2.value = config_2.value || [];
                        if (parentTitle_1 === '') {
                            config_2.value = data.map(function (item) {
                                return config_2.value.find(function (conf) { return conf.title === item.title; });
                            });
                        }
                        else {
                            index_1 = config_2.value.findIndex(function (conf) { return conf.title === parentTitle_1; });
                            sortList = data.map(function (item) {
                                if (index_1 > -1) {
                                    return config_2.value[index_1].array.find(function (conf) { return conf.title === item.title; });
                                }
                                return { title: '', array: [], code: '' };
                            });
                            config_2.value[index_1].array = sortList;
                        }
                        return [4 /*yield*/, database_js_1.default.execute("UPDATE `".concat(this.app, "`.public_config\n           SET value = ?\n           WHERE `key` = 'collection';\n          "), [config_2.value])];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/, false];
                    case 4:
                        e_28 = _c.sent();
                        console.error(e_28);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'sortCollection Error:' + e_28, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.checkVariantDataType = function (variants) {
        var propertiesToParse = ['stock', 'product_id', 'sale_price', 'compare_price', 'shipment_weight'];
        variants.forEach(function (variant) {
            propertiesToParse.forEach(function (prop) {
                if (variant[prop] != null) {
                    // 檢查屬性是否存在且不為 null 或 undefined
                    variant[prop] = parseInt(variant[prop], 10);
                }
            });
        });
    };
    Shopping.prototype.postProduct = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var language, _i, language_2, b, find_conflict, data, e_29;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        content.seo = (_a = content.seo) !== null && _a !== void 0 ? _a : {};
                        content.seo.domain = content.seo.domain || content.title;
                        return [4 /*yield*/, app_js_1.App.getSupportLanguage(this.app)];
                    case 1:
                        language = _c.sent();
                        _i = 0, language_2 = language;
                        _c.label = 2;
                    case 2:
                        if (!(_i < language_2.length)) return [3 /*break*/, 5];
                        b = language_2[_i];
                        return [4 /*yield*/, database_js_1.default.query("select count(1)\n         from `".concat(this.app, "`.`t_manager_post`\n         where content ->>'$.language_data.\"").concat(b, "\".seo.domain'='").concat(decodeURIComponent(content.language_data[b].seo.domain), "'\n        "), [])];
                    case 3:
                        find_conflict = _c.sent();
                        if (find_conflict[0]['count(1)'] > 0) {
                            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'DOMAIN ALREADY EXISTS:', {
                                message: '網域已被使用',
                                code: '733',
                            });
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        _c.trys.push([5, 9, , 10]);
                        content.type = 'product';
                        this.checkVariantDataType(content.variants);
                        return [4 /*yield*/, database_js_1.default.query("INSERT INTO `".concat(this.app, "`.`t_manager_post`\n         SET ?\n        "), [
                                {
                                    userID: (_b = this.token) === null || _b === void 0 ? void 0 : _b.userID,
                                    content: JSON.stringify(content),
                                },
                            ])];
                    case 6:
                        data = _c.sent();
                        content.id = data.insertId;
                        return [4 /*yield*/, database_js_1.default.query("update `".concat(this.app, "`.`t_manager_post`\n         SET ?\n         where id = ?\n        "), [
                                {
                                    content: JSON.stringify(content),
                                },
                                content.id,
                            ])];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, new Shopping(this.app, this.token).postVariantsAndPriceValue(content)];
                    case 8:
                        _c.sent();
                        return [2 /*return*/, data.insertId];
                    case 9:
                        e_29 = _c.sent();
                        console.error(e_29);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postProduct Error:' + e_29, null);
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.updateCollectionFromUpdateProduct = function (collection) {
        return __awaiter(this, void 0, void 0, function () {
            function findRepeatCollection(data, fatherTitle) {
                if (fatherTitle === void 0) { fatherTitle = ''; }
                var returnArray = ["".concat(fatherTitle ? "".concat(fatherTitle, "/") : "").concat(data.title)];
                var t = [1, 2, 3];
                if (data.array && data.array.length > 0) {
                    data.array.forEach(function (item) {
                        returnArray.push.apply(returnArray, findRepeatCollection(item, data.title));
                    });
                }
                return returnArray;
            }
            function addCategory(nodes, levels) {
                if (levels.length === 0)
                    return;
                var title = levels[0];
                var node = nodes.find(function (n) { return n.title === title; });
                if (!node) {
                    node = { title: title, array: [] };
                    nodes.push(node);
                }
                if (levels.length > 1) {
                    addCategory(node.array, levels.slice(1));
                }
            }
            function buildCategoryTree(categories) {
                var root = [];
                categories.forEach(function (category) {
                    var levels = category.split('/');
                    addCategory(root, levels);
                });
                return root;
            }
            var config, stillCollection, nonCommonElements, categoryTree, update_col_sql;
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        collection = Array.from(new Set(collection.map(function (dd) {
                            return dd.replace(/\s*\/\s*/g, '/');
                        })));
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n           FROM `".concat(this.app, "`.public_config\n           WHERE `key` = 'collection';"), [])];
                    case 1:
                        config = (_b = (_c.sent())[0]) !== null && _b !== void 0 ? _b : {};
                        config.value = config.value || [];
                        stillCollection = [];
                        config.value.forEach(function (collection) {
                            stillCollection.push.apply(stillCollection, findRepeatCollection(collection));
                        });
                        nonCommonElements = collection.filter(function (item) { return !stillCollection.includes(item); });
                        categoryTree = buildCategoryTree(nonCommonElements);
                        (_a = config.value).push.apply(_a, categoryTree);
                        update_col_sql = "UPDATE `".concat(this.app, "`.public_config\n                            SET value = ?\n                            WHERE `key` = 'collection';");
                        return [4 /*yield*/, database_js_1.default.execute(update_col_sql, [config.value])];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.postMulProduct = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            function getNextId(app) {
                return __awaiter(this, void 0, void 0, function () {
                    var query, result, maxId, error_13;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                query = "SELECT MAX(id) AS max_id\n                       FROM `".concat(app, "`.t_manager_post");
                                _c.label = 1;
                            case 1:
                                _c.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, database_js_1.default.query(query, [])];
                            case 2:
                                result = _c.sent();
                                maxId = (_b = (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a.max_id) !== null && _b !== void 0 ? _b : 0;
                                return [2 /*return*/, maxId + 1];
                            case 3:
                                error_13 = _c.sent();
                                console.error('取得最大 ID 時發生錯誤:', error_13);
                                return [2 /*return*/, 1]; // 若發生錯誤，回傳預設 ID = 1
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            var store_info_1, productArray_1, max_id_1, data, insertIDStart, e_30;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, new user_js_1.User(this.app).getConfigV2({
                                key: 'store-information',
                                user_id: 'manager',
                            })];
                    case 1:
                        store_info_1 = _a.sent();
                        if (!(content.collection.length > 0)) return [3 /*break*/, 3];
                        //有新類別要處理
                        return [4 /*yield*/, this.updateCollectionFromUpdateProduct(content.collection)];
                    case 2:
                        //有新類別要處理
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        productArray_1 = content.data;
                        return [4 /*yield*/, Promise.all(productArray_1.map(function (product, index) {
                                return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                    var og_data, og_content;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                product.type = 'product';
                                                if (!product.id) return [3 /*break*/, 2];
                                                return [4 /*yield*/, database_js_1.default.query("select *\n                   from `".concat(this.app, "`.`t_manager_post`\n                   where id = ?"), [product.id])];
                                            case 1:
                                                og_data = (_a.sent())[0];
                                                if (og_data) {
                                                    delete product['content'];
                                                    delete product['preview_image'];
                                                    og_content = og_data['content'];
                                                    if (og_content.language_data && og_content.language_data[store_info_1.language_setting.def]) {
                                                        og_content.language_data[store_info_1.language_setting.def].seo = product.seo;
                                                        og_content.language_data[store_info_1.language_setting.def].title = product.title;
                                                        og_content.language_data[store_info_1.language_setting.def].sub_title = product.sub_title;
                                                    }
                                                    product = __assign(__assign({}, og_content), product);
                                                    product.preview_image = og_data['content'].preview_image || [];
                                                    productArray_1[index] = product;
                                                }
                                                else {
                                                    console.error('Product id not exist:', product);
                                                }
                                                return [3 /*break*/, 3];
                                            case 2:
                                                console.error('Product has not id:', product);
                                                _a.label = 3;
                                            case 3:
                                                resolve(true);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, getNextId(this.app)];
                    case 5:
                        max_id_1 = _a.sent();
                        productArray_1.map(function (product) {
                            var _a;
                            if (!product.id) {
                                product.id = max_id_1++;
                            }
                            product.type = 'product';
                            _this.checkVariantDataType(product.variants);
                            return [product.id || null, (_a = _this.token) === null || _a === void 0 ? void 0 : _a.userID, JSON.stringify(product)];
                        });
                        if (!productArray_1.length) return [3 /*break*/, 8];
                        return [4 /*yield*/, database_js_1.default.query("replace\n          INTO `".concat(this.app, "`.`t_manager_post` (id,userID,content) values ?"), [
                                productArray_1.map(function (product) {
                                    var _a;
                                    if (!product.id) {
                                        product.id = max_id_1++;
                                    }
                                    product.type = 'product';
                                    _this.checkVariantDataType(product.variants);
                                    return [product.id || null, (_a = _this.token) === null || _a === void 0 ? void 0 : _a.userID, JSON.stringify(product)];
                                }),
                            ])];
                    case 6:
                        data = _a.sent();
                        insertIDStart = data.insertId;
                        return [4 /*yield*/, new Shopping(this.app, this.token).promisesProducts(productArray_1, insertIDStart)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, insertIDStart];
                    case 8: return [2 /*return*/, -1];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        e_30 = _a.sent();
                        console.error(e_30);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMulProduct Error:' + e_30, null);
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.promisesProducts = function (productArray, insertIDStart) {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = productArray.map(function (product) {
                            product.id = product.id || insertIDStart++;
                            return new Shopping(_this.app, _this.token).postVariantsAndPriceValue(product);
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.putProduct = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var language, _i, language_3, b, find_conflict, data, e_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!content.language_data) return [3 /*break*/, 5];
                        return [4 /*yield*/, app_js_1.App.getSupportLanguage(this.app)];
                    case 1:
                        language = _a.sent();
                        _i = 0, language_3 = language;
                        _a.label = 2;
                    case 2:
                        if (!(_i < language_3.length)) return [3 /*break*/, 5];
                        b = language_3[_i];
                        return [4 /*yield*/, database_js_1.default.query("select count(1)\n           from `".concat(this.app, "`.`t_manager_post`\n           where content ->>'$.language_data.\"").concat(b, "\".seo.domain'='").concat(decodeURIComponent(content.language_data[b].seo.domain), "'\n             and id != ").concat(content.id), [])];
                    case 3:
                        find_conflict = _a.sent();
                        if (find_conflict[0]['count(1)'] > 0) {
                            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'DOMAIN ALREADY EXISTS:', {
                                message: '網域已被使用',
                                code: '733',
                            });
                        }
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        _a.trys.push([5, 10, , 11]);
                        content.type = 'product';
                        this.checkVariantDataType(content.variants);
                        return [4 /*yield*/, database_js_1.default.query("update `".concat(this.app, "`.`t_manager_post`\n         SET ?\n         where id = ?"), [
                                {
                                    content: JSON.stringify(content),
                                },
                                content.id,
                            ])];
                    case 6:
                        data = _a.sent();
                        return [4 /*yield*/, new Shopping(this.app, this.token).postVariantsAndPriceValue(content)];
                    case 7:
                        _a.sent();
                        if (!content.shopee_id) return [3 /*break*/, 9];
                        return [4 /*yield*/, new shopee_1.Shopee(this.app, this.token).asyncStockToShopee({
                                product: {
                                    content: content,
                                },
                                callback: function () { },
                            })];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, content.insertId];
                    case 10:
                        e_31 = _a.sent();
                        console.error(e_31);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'putProduct Error:' + e_31, null);
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.deleteCollection = function (dataArray) {
        return __awaiter(this, void 0, void 0, function () {
            var config_3, deleteList_2, _i, deleteList_1, d, collection, _a, _b, index, update_col_sql, e_32;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 11, , 12]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n           FROM `".concat(this.app, "`.public_config\n           WHERE `key` = 'collection';"), [])];
                    case 1:
                        config_3 = (_c.sent())[0];
                        deleteList_2 = [];
                        // format 刪除類別 index
                        dataArray.map(function (data) {
                            var _a;
                            var parentTitles = (_a = data.parentTitles[0]) !== null && _a !== void 0 ? _a : '';
                            if (parentTitles.length > 0) {
                                // data 為子層
                                var parentIndex_2 = config_3.value.findIndex(function (col) { return col.title === parentTitles; });
                                var childrenIndex = config_3.value[parentIndex_2].array.findIndex(function (col) { return col.title === data.title; });
                                var n = deleteList_2.findIndex(function (obj) { return obj.parent === parentIndex_2; });
                                if (n === -1) {
                                    deleteList_2.push({ parent: parentIndex_2, child: [childrenIndex] });
                                }
                                else {
                                    deleteList_2[n].child.push(childrenIndex);
                                }
                            }
                            else {
                                // data 為父層
                                var parentIndex = config_3.value.findIndex(function (col) { return col.title === data.title; });
                                deleteList_2.push({ parent: parentIndex, child: [-1] });
                            }
                        });
                        _i = 0, deleteList_1 = deleteList_2;
                        _c.label = 2;
                    case 2:
                        if (!(_i < deleteList_1.length)) return [3 /*break*/, 9];
                        d = deleteList_1[_i];
                        collection = config_3.value[d.parent];
                        _a = 0, _b = d.child;
                        _c.label = 3;
                    case 3:
                        if (!(_a < _b.length)) return [3 /*break*/, 6];
                        index = _b[_a];
                        if (!(index !== -1)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.deleteCollectionProduct(collection.title, ["".concat(collection.array[index].title)])];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _a++;
                        return [3 /*break*/, 3];
                    case 6:
                        if (!(d.child[0] === -1)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.deleteCollectionProduct(collection.title)];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 2];
                    case 9:
                        // 取得新的類別 config 陣列
                        deleteList_2.map(function (obj) {
                            config_3.value[obj.parent].array = config_3.value[obj.parent].array.filter(function (col, index) {
                                return !obj.child.includes(index);
                            });
                        });
                        config_3.value = config_3.value.filter(function (col, index) {
                            var find_collection = deleteList_2.find(function (obj) { return obj.parent === index; });
                            return !(find_collection && find_collection.child[0] === -1);
                        });
                        update_col_sql = "UPDATE `".concat(this.app, "`.public_config\n                              SET value = ?\n                              WHERE `key` = 'collection';");
                        return [4 /*yield*/, database_js_1.default.execute(update_col_sql, [config_3.value])];
                    case 10:
                        _c.sent();
                        return [2 /*return*/, { result: true }];
                    case 11:
                        e_32 = _c.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e_32, null);
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.deleteCollectionProduct = function (parent_name, children_list) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_6, this_5, _i, children_list_1, children, _a, _b, product, _c, _d, product, error_14;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 16, , 17]);
                        if (!children_list) return [3 /*break*/, 5];
                        _loop_6 = function (children) {
                            var tag_name, _f, _g, product;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0:
                                        tag_name = "".concat(parent_name, " / ").concat(children);
                                        _f = 0;
                                        return [4 /*yield*/, database_js_1.default.query(this_5.containsTagSQL(tag_name), [])];
                                    case 1:
                                        _g = _h.sent();
                                        _h.label = 2;
                                    case 2:
                                        if (!(_f < _g.length)) return [3 /*break*/, 5];
                                        product = _g[_f];
                                        product.content.collection = product.content.collection.filter(function (str) { return str != tag_name; });
                                        return [4 /*yield*/, this_5.updateProductCollection(product.content, product.id)];
                                    case 3:
                                        _h.sent();
                                        _h.label = 4;
                                    case 4:
                                        _f++;
                                        return [3 /*break*/, 2];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        };
                        this_5 = this;
                        _i = 0, children_list_1 = children_list;
                        _e.label = 1;
                    case 1:
                        if (!(_i < children_list_1.length)) return [3 /*break*/, 4];
                        children = children_list_1[_i];
                        return [5 /*yield**/, _loop_6(children)];
                    case 2:
                        _e.sent();
                        _e.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 15];
                    case 5:
                        _a = 0;
                        return [4 /*yield*/, database_js_1.default.query(this.containsTagSQL(parent_name), [])];
                    case 6:
                        _b = _e.sent();
                        _e.label = 7;
                    case 7:
                        if (!(_a < _b.length)) return [3 /*break*/, 10];
                        product = _b[_a];
                        product.content.collection = product.content.collection.filter(function (str) { return !(str === parent_name); });
                        return [4 /*yield*/, this.updateProductCollection(product.content, product.id)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9:
                        _a++;
                        return [3 /*break*/, 7];
                    case 10:
                        _c = 0;
                        return [4 /*yield*/, database_js_1.default.query(this.containsTagSQL("".concat(parent_name, " /")), [])];
                    case 11:
                        _d = _e.sent();
                        _e.label = 12;
                    case 12:
                        if (!(_c < _d.length)) return [3 /*break*/, 15];
                        product = _d[_c];
                        product.content.collection = product.content.collection.filter(function (str) {
                            return str.includes("".concat(parent_name, " / "));
                        });
                        return [4 /*yield*/, this.updateProductCollection(product.content, product.id)];
                    case 13:
                        _e.sent();
                        _e.label = 14;
                    case 14:
                        _c++;
                        return [3 /*break*/, 12];
                    case 15: return [2 /*return*/, { result: true }];
                    case 16:
                        error_14 = _e.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'deleteCollectionProduct Error:' + express_1.default, null);
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.containsTagSQL = function (name) {
        return "SELECT *\n            FROM `".concat(this.app, "`.t_manager_post\n            WHERE JSON_CONTAINS(content ->> '$.collection', '\"").concat(name, "\"');");
    };
    Shopping.prototype.checkDuring = function (jsonData) {
        var now = new Date().getTime();
        var startDateTime = new Date(moment_1.default.tz("".concat(jsonData.startDate, " ").concat(jsonData.startTime, ":00"), 'YYYY-MM-DD HH:mm:ss', 'Asia/Taipei').toISOString()).getTime();
        if (isNaN(startDateTime))
            return false;
        if (!jsonData.endDate || !jsonData.endTime)
            return true;
        var endDateTime = new Date(moment_1.default.tz("".concat(jsonData.endDate, " ").concat(jsonData.endTime, ":00"), 'YYYY-MM-DD HH:mm:ss', 'Asia/Taipei').toISOString()).getTime();
        if (isNaN(endDateTime))
            return false;
        return now >= startDateTime && now <= endDateTime;
    };
    Shopping.isComeStore = function (checkout, qData) {
        try {
            return checkout.pos_info.where_store === qData.come_from;
        }
        catch (error) {
            return false;
        }
    };
    Shopping.prototype.updateProductCollection = function (content, id) {
        return __awaiter(this, void 0, void 0, function () {
            var updateProdSQL, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        updateProdSQL = "UPDATE `".concat(this.app, "`.t_manager_post\n                             SET content = ?\n                             WHERE `id` = ?;");
                        return [4 /*yield*/, database_js_1.default.execute(updateProdSQL, [content, id])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'updateProductCollection Error:' + express_1.default, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.getProductVariants = function (id_list) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.querySqlByVariants(["(v.id in (".concat(id_list, "))")], { page: 0, limit: 999 })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_16 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getProductVariants Error:' + express_1.default, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.getVariants = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var querySql, queryOR_1, stockCount, userClass, store_config_2, data, shopee_data_list_1, e_33;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        querySql = ['1=1'];
                        if (query.search) {
                            switch (query.searchType) {
                                case 'title':
                                    querySql.push("v.product_id in (select p.id\n                                            from `".concat(this.app, "`.t_manager_post as p where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(p.content, '$.title'))) LIKE UPPER('%").concat(query.search, "%')))"));
                                    break;
                                case 'sku':
                                    querySql.push("(UPPER(JSON_EXTRACT(v.content, '$.sku')) LIKE UPPER('%".concat(query.search, "%'))"));
                                    break;
                            }
                        }
                        query.id && querySql.push("(v.id = ".concat(query.id, ")"));
                        query.id_list && querySql.push("(v.id in (".concat(query.id_list, "))"));
                        query.collection &&
                            querySql.push("(".concat(query.collection
                                .split(',')
                                .map(function (dd) {
                                return query.accurate_search_collection
                                    ? "\n                        v.product_id in (select p.id\n                                            from `".concat(_this.app, "`.t_manager_post as p where (JSON_CONTAINS(p.content->'$.collection', '\"").concat(dd, "\"')))\n                        \n                        ")
                                    : "\n                         v.product_id in (select p.id\n                                            from `".concat(_this.app, "`.t_manager_post as p where (JSON_EXTRACT(p.content, '$.collection') LIKE '%").concat(dd, "%'))\n                        ");
                            })
                                .join(' or '), ")"));
                        query.status &&
                            querySql.push("\n             v.product_id in (select p.id\n                                            from `".concat(this.app, "`.t_manager_post as p where (JSON_EXTRACT(p.content, '$.status') = '").concat(query.status, "'))\n            "));
                        query.min_price && querySql.push("(v.content->>'$.sale_price' >= ".concat(query.min_price, ")"));
                        query.max_price && querySql.push("(v.content->>'$.sale_price' <= ".concat(query.min_price, ")"));
                        //判斷有帶入商品類型時，顯示商品類型，反之預設折是一班商品
                        if (query.productType !== 'all') {
                            queryOR_1 = [];
                            if (query.productType) {
                                query.productType.split(',').map(function (dd) {
                                    if (dd === 'hidden') {
                                        queryOR_1.push(" v.product_id in (select p.id\n                                            from `".concat(_this.app, "`.t_manager_post as p where (p.content->>'$.visible' = \"false\"))"));
                                    }
                                    else {
                                        queryOR_1.push("v.product_id in (select p.id\n                                            from `".concat(_this.app, "`.t_manager_post as p where (p.content->>'$.productType.").concat(dd, "' = \"true\"))"));
                                    }
                                });
                            }
                            else if (!query.id) {
                                queryOR_1.push("v.product_id in (select p.id\n                                            from `".concat(this.app, "`.t_manager_post as p where (p.content->>'$.productType.product' = \"true\"))"));
                            }
                            querySql.push("(".concat(queryOR_1
                                .map(function (dd) {
                                return " ".concat(dd, " ");
                            })
                                .join(' or '), ")"));
                        }
                        if (query.stockCount) {
                            stockCount = (_a = query.stockCount) === null || _a === void 0 ? void 0 : _a.split(',');
                            switch (stockCount[0]) {
                                case 'lessThan':
                                    querySql.push("(cast(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) < ".concat(stockCount[1], ")"));
                                    break;
                                case 'moreThan':
                                    querySql.push("(cast(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) > ".concat(stockCount[1], ")"));
                                    break;
                                case 'lessSafe':
                                    querySql.push("(\n              JSON_EXTRACT(v.content, '$.save_stock') is not null AND\n              (cast(JSON_EXTRACT(v.content, '$.stock') AS SIGNED) - cast(JSON_EXTRACT(v.content, '$.save_stock') AS SIGNED) < ".concat(stockCount[1], ")\n            )"));
                                    break;
                            }
                        }
                        query.order_by = (function () {
                            switch (query.order_by) {
                                case 'max_price':
                                    return "order by v->>'$.content.sale_price' desc";
                                case 'min_price':
                                    return "order by v->>'$.content.sale_price' asc";
                                case 'stock_desc':
                                    return "order by stock desc";
                                case 'stock_asc':
                                    return "order by stock";
                                case 'default':
                                default:
                                    return "order by id desc";
                            }
                        })();
                        userClass = new user_js_1.User(this.app);
                        return [4 /*yield*/, userClass.getConfigV2({
                                key: 'store_manager',
                                user_id: 'manager',
                            })];
                    case 1:
                        store_config_2 = _b.sent();
                        return [4 /*yield*/, this.querySqlByVariants(querySql, query)];
                    case 2:
                        data = _b.sent();
                        shopee_data_list_1 = [];
                        return [4 /*yield*/, Promise.all(data.data.map(function (v_c) {
                                var product = v_c['product_content'];
                                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                    var totalSale, content_5, shopee_dd, shopee_data, variant_2, shopee_variants, p_ind;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (!product) return [3 /*break*/, 4];
                                                totalSale = 0;
                                                content_5 = product;
                                                if (!content_5.shopee_id) return [3 /*break*/, 3];
                                                shopee_dd = shopee_data_list_1.find(function (dd) {
                                                    return dd.id === content_5.shopee_id;
                                                });
                                                if (!!shopee_dd) return [3 /*break*/, 2];
                                                _a = {
                                                    id: content_5.shopee_id
                                                };
                                                return [4 /*yield*/, new shopee_1.Shopee(this.app, this.token).getProductDetail(content_5.shopee_id, {
                                                        skip_image_load: true,
                                                    })];
                                            case 1:
                                                shopee_dd = (_a.data = _b.sent(),
                                                    _a);
                                                shopee_data_list_1.push(shopee_dd);
                                                _b.label = 2;
                                            case 2:
                                                shopee_data = shopee_dd.data;
                                                if (shopee_data && shopee_data.variants) {
                                                    variant_2 = v_c['variant_content'];
                                                    shopee_variants = shopee_data.variants.find(function (dd) {
                                                        return dd.spec.join('') === variant_2.spec.join('');
                                                    });
                                                    if (shopee_variants) {
                                                        variant_2.stock = shopee_variants.stock;
                                                        variant_2.stockList = {};
                                                        variant_2.stockList[store_config_2.list[0].id] = { count: variant_2.stock };
                                                    }
                                                    p_ind = product.variants.findIndex(function (dd) {
                                                        return dd.spec.join('') === variant_2.spec.join('');
                                                    });
                                                    product.variants[p_ind] = variant_2;
                                                    v_c['stockList'] = v_c['variant_content']['stockList'];
                                                }
                                                _b.label = 3;
                                            case 3:
                                                product.total_sales = totalSale;
                                                _b.label = 4;
                                            case 4:
                                                resolve(true);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }))];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, data];
                    case 4:
                        e_33 = _b.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getVariants Error:' + e_33, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.getDomain = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var querySql, data, e_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        querySql = ["(content->>'$.type'='product')"];
                        if (query.search) {
                            querySql.push("(".concat([
                                "(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%".concat(query.search, "%'))"),
                                "JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%".concat(query.search, "%'"),
                                "JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%".concat(query.search, "%'"),
                                "JSON_EXTRACT(content, '$.product_customize_tag') LIKE '%".concat(query.search, "%'"),
                            ].join(' or '), ")"));
                        }
                        if (query.domain) {
                            querySql.push("content->>'$.seo.domain'='".concat(decodeURIComponent(query.domain), "'"));
                        }
                        if ("".concat(query.id || '')) {
                            if ("".concat(query.id).includes(',')) {
                                querySql.push("id in (".concat(query.id, ")"));
                            }
                            else {
                                querySql.push("id = ".concat(query.id));
                            }
                        }
                        return [4 /*yield*/, this.querySqlBySEO(querySql, __assign({ limit: 10000, page: 0 }, query))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        e_34 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getVariants Error:' + e_34, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.putVariants = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, query_1, data, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        _i = 0, query_1 = query;
                        _a.label = 1;
                    case 1:
                        if (!(_i < query_1.length)) return [3 /*break*/, 5];
                        data = query_1[_i];
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.t_variants\n           SET ?\n           WHERE id = ?"), [{ content: JSON.stringify(data.variant_content) }, data.id])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.t_manager_post\n           SET ?\n           WHERE id = ?"), [{ content: JSON.stringify(data.product_content) }, data.product_id])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, {
                            result: 'success',
                            orderData: query,
                        }];
                    case 6:
                        error_17 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'putVariants Error:' + express_1.default, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.postCustomerInvoice = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.putOrder({
                            id: obj.orderData.id,
                            orderData: obj.orderData.orderData,
                            status: obj.orderData.status,
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, new invoice_js_1.Invoice(this.app).postCheckoutInvoice(obj.orderID, false)];
                    case 2:
                        invoice_response = _a.sent();
                        return [2 /*return*/, {
                                result: invoice_response,
                            }];
                }
            });
        });
    };
    Shopping.prototype.batchPostCustomerInvoice = function (dataArray) {
        return __awaiter(this, void 0, void 0, function () {
            var result, chunk, chunksCount, i, arr, res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        chunk = 10;
                        chunksCount = Math.ceil(dataArray.length / chunk);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < chunksCount)) return [3 /*break*/, 4];
                        arr = dataArray.slice(i * chunk, (i + 1) * chunk);
                        return [4 /*yield*/, Promise.all(arr.map(function (item) {
                                return _this.postCustomerInvoice(item);
                            }))];
                    case 2:
                        res = _a.sent();
                        result = result.concat(res);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    Shopping.prototype.voidInvoice = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var config, passData, dbData;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, app_1.default.getAdConfig(this.app, 'invoice_setting')];
                    case 1:
                        config = _c.sent();
                        passData = {
                            MerchantID: config.merchNO,
                            InvoiceNo: obj.invoice_no,
                            InvoiceDate: obj.createDate,
                            Reason: obj.reason,
                        };
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n       FROM `".concat(this.app, "`.t_invoice_memory\n       WHERE invoice_no = ?"), [obj.invoice_no])];
                    case 2:
                        dbData = _c.sent();
                        dbData = dbData[0];
                        dbData.invoice_data.remark = (_b = (_a = dbData.invoice_data) === null || _a === void 0 ? void 0 : _a.remark) !== null && _b !== void 0 ? _b : {};
                        dbData.invoice_data.remark.voidReason = obj.reason;
                        return [4 /*yield*/, EcInvoice_1.EcInvoice.voidInvoice({
                                hashKey: config.hashkey,
                                hash_IV: config.hashiv,
                                merchNO: config.merchNO,
                                app_name: this.app,
                                invoice_data: passData,
                                beta: config.point === 'beta',
                            })];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.t_invoice_memory\n       SET ?\n       WHERE invoice_no = ?"), [{ status: 2, invoice_data: JSON.stringify(dbData.invoice_data) }, obj.invoice_no])];
                    case 4:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.allowanceInvoice = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var config, invoiceData, passData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.default.getAdConfig(this.app, 'invoice_setting')];
                    case 1:
                        config = _a.sent();
                        return [4 /*yield*/, database_js_1.default.query("\n          SELECT *\n          FROM `".concat(this.app, "`.t_invoice_memory\n          WHERE invoice_no = \"").concat(obj.invoiceID, "\"\n      "), [])];
                    case 2:
                        invoiceData = _a.sent();
                        invoiceData = invoiceData[0];
                        passData = {
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
                        return [4 /*yield*/, EcInvoice_1.EcInvoice.allowanceInvoice({
                                hashKey: config.hashkey,
                                hash_IV: config.hashiv,
                                merchNO: config.merchNO,
                                app_name: this.app,
                                allowance_data: passData,
                                beta: config.point === 'beta',
                                db_data: obj.allowanceData,
                                order_id: obj.orderID,
                            })];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Shopping.prototype.voidAllowance = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var config, passData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.default.getAdConfig(this.app, 'invoice_setting')];
                    case 1:
                        config = _a.sent();
                        passData = {
                            MerchantID: config.merchNO,
                            InvoiceNo: obj.invoiceNo,
                            AllowanceNo: obj.allowanceNo,
                            Reason: obj.voidReason,
                        };
                        return [4 /*yield*/, EcInvoice_1.EcInvoice.voidAllowance({
                                hashKey: config.hashkey,
                                hash_IV: config.hashiv,
                                merchNO: config.merchNO,
                                app_name: this.app,
                                allowance_data: passData,
                                beta: config.point === 'beta',
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Shopping.currencyCovert = function (base) {
        return __awaiter(this, void 0, void 0, function () {
            var data, base_m;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.default.query("SELECT *\n         FROM ".concat(config_js_1.saasConfig.SAAS_NAME, ".currency_config\n         order by id desc limit 0,1;"), [])];
                    case 1:
                        data = (_a.sent())[0]['json']['rates'];
                        base_m = data[base];
                        Object.keys(data).map(function (dd) {
                            data[dd] = data[dd] / base_m;
                        });
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Shopping.prototype.getProductComment = function (product_id) {
        return __awaiter(this, void 0, void 0, function () {
            var comments, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n         FROM `".concat(this.app, "`.t_product_comment\n         WHERE product_id = ?;\n        "), [product_id])];
                    case 1:
                        comments = _a.sent();
                        if (comments.length === 0) {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, comments.map(function (item) { return item.content; })];
                    case 2:
                        error_18 = _a.sent();
                        console.error(error_18);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getProductComment Error:' + error_18, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.postProductComment = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var product_id, rate, title, comment, today, userClass, userData, content, updateResult, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!this.token) {
                            throw new Error('User not authenticated.');
                        }
                        product_id = data.product_id, rate = data.rate, title = data.title, comment = data.comment;
                        today = new Date().toISOString().split('T')[0];
                        userClass = new user_js_1.User(this.app);
                        return [4 /*yield*/, userClass.getUserData("".concat(this.token.userID), 'userID')];
                    case 1:
                        userData = _a.sent();
                        content = {
                            userID: this.token.userID,
                            userName: userData.userData.name,
                            date: today,
                            rate: rate,
                            title: title,
                            comment: comment,
                        };
                        return [4 /*yield*/, database_js_1.default.query("delete\n         from `".concat(this.app, "`.t_product_comment\n         WHERE product_id = ").concat(product_id, "\n           AND content ->>'$.userID'=").concat(this.token.userID, "\n           and id\n             >0"), [])];
                    case 2:
                        updateResult = _a.sent();
                        return [4 /*yield*/, database_js_1.default.execute("INSERT INTO `".concat(this.app, "`.t_product_comment (product_id, content)\n         VALUES (?, ?)"), [product_id, JSON.stringify(content)])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.updateProductAvgRate(product_id)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 5:
                        error_19 = _a.sent();
                        console.error("Error posting product comment:", error_19);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', "postProductComment Error: ".concat(error_19), null);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Shopping.prototype.updateProductAvgRate = function (product_id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, avg_rate, updateResult, error_20;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT COALESCE(ROUND(AVG(JSON_EXTRACT(content, '$.rate')), 1), 0) AS avgRate\n         FROM `".concat(this.app, "`.t_product_comment\n         WHERE product_id = ?"), [product_id])];
                    case 1:
                        result = (_b.sent())[0];
                        avg_rate = (_a = result === null || result === void 0 ? void 0 : result.avgRate) !== null && _a !== void 0 ? _a : 0;
                        return [4 /*yield*/, database_js_1.default.execute("UPDATE `".concat(this.app, "`.t_manager_post\n         SET content = JSON_SET(content, '$.avg_rate', ?)\n         WHERE id = ?"), [avg_rate, product_id])];
                    case 2:
                        updateResult = _b.sent();
                        if (updateResult.affectedRows === 0) {
                            throw new Error("Product with ID ".concat(product_id, " not found."));
                        }
                        return [2 /*return*/, { product_id: product_id, avg_rate: avg_rate }];
                    case 3:
                        error_20 = _b.sent();
                        console.error("Error updating average rate for product ID ".concat(product_id, ":"), error_20);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', "updateProductAvgRate Error: ".concat(error_20), null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Shopping;
}());
exports.Shopping = Shopping;

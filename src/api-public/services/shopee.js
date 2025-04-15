"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shopee = void 0;
var database_js_1 = require("../../modules/database.js");
var config_js_1 = require("../../config.js");
var axios_1 = require("axios");
var logger_js_1 = require("../../modules/logger.js");
var AWSLib_js_1 = require("../../modules/AWSLib.js");
var crypto_1 = require("crypto");
var process_1 = require("process");
var qs_1 = require("qs");
var shopping_js_1 = require("./shopping.js");
var mime = require('mime');
var Shopee = /** @class */ (function () {
    function Shopee(app, token) {
        this.getDateTime = function (n) {
            if (n === void 0) { n = 0; }
            var now = new Date();
            now.setDate(now.getDate() + n);
            var year = now.getFullYear();
            var month = (now.getMonth() + 1).toString().padStart(2, '0');
            var day = now.getDate().toString().padStart(2, '0');
            var hours = now.getHours().toString().padStart(2, '0');
            var dateStr = "".concat(year, "-").concat(month, "-").concat(day);
            var timeStr = "".concat(hours, ":00");
            return { date: dateStr, time: timeStr };
        };
        this.app = app;
        this.token = token;
    }
    Object.defineProperty(Shopee, "path", {
        get: function () {
            if (process_1.default.env.shopee_beta === 'true') {
                return "https://partner.test-stable.shopeemobile.com";
            }
            else {
                return "https://partner.shopeemobile.com";
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shopee, "partner_id", {
        get: function () {
            if (process_1.default.env.shopee_beta === 'true') {
                return process_1.default.env.shopee_test_partner_id;
            }
            else {
                return process_1.default.env.shopee_partner_id;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shopee, "partner_key", {
        get: function () {
            if (process_1.default.env.shopee_beta === 'true') {
                return process_1.default.env.shopee_test_partner_key;
            }
            else {
                return process_1.default.env.shopee_partner_key;
            }
        },
        enumerable: false,
        configurable: true
    });
    Shopee.prototype.generateUrl = function (partner_id, api_path, timestamp) {
        var sign = this.cryptoSign(partner_id, api_path, timestamp);
        return "".concat(Shopee.path).concat(api_path, "?partner_id=").concat(partner_id, "&timestamp=").concat(timestamp, "&sign=").concat(sign);
    };
    Shopee.prototype.generateShopUrl = function (partner_id, api_path, timestamp, access_token, shop_id) {
        var sign = this.cryptoSign(partner_id, api_path, timestamp, access_token, shop_id);
        return "".concat(Shopee.path).concat(api_path, "?partner_id=").concat(partner_id, "&timestamp=").concat(timestamp, "&sign=").concat(sign);
        // ?partner_id=1249034&sign=528d448cde17720098c8886aafc973c093af54a489ff4ef80198b39de958d484&timestamp=1736322488
    };
    Shopee.prototype.cryptoSign = function (partner_id, api_path, timestamp, access_token, shop_id) {
        var baseString = "".concat(partner_id).concat(api_path).concat(timestamp).concat(access_token !== null && access_token !== void 0 ? access_token : "").concat(shop_id !== null && shop_id !== void 0 ? shop_id : "");
        var partner_key = Shopee.partner_key;
        return crypto_1.default.createHmac('sha256', partner_key !== null && partner_key !== void 0 ? partner_key : "").update(baseString).digest('hex');
    };
    Shopee.prototype.generateAuth = function (redirectUrl) {
        var partner_id = Shopee.partner_id;
        var api_path = "/api/v2/shop/auth_partner";
        var timestamp = Math.floor(Date.now() / 1000);
        var baseString = "".concat(partner_id).concat(api_path).concat(timestamp);
        var signature = this.cryptoSign(partner_id !== null && partner_id !== void 0 ? partner_id : "", api_path, timestamp);
        return "".concat(Shopee.path).concat(api_path, "?partner_id=").concat(partner_id, "&timestamp=").concat(timestamp, "&redirect=").concat(redirectUrl, "&sign=").concat(signature);
    };
    Shopee.prototype.getToken = function (code, shop_id) {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, partner_id, api_path, config, response, data, passData, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        timestamp = Math.floor(Date.now() / 1000);
                        partner_id = (_a = Shopee.partner_id) !== null && _a !== void 0 ? _a : "";
                        api_path = "/api/v2/auth/token/get";
                        config = {
                            method: 'post',
                            url: this.generateUrl(partner_id, api_path, timestamp),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: JSON.stringify({
                                code: code,
                                partner_id: parseInt(partner_id, 10),
                                shop_id: parseInt(shop_id),
                            })
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, (0, axios_1.default)(config)];
                    case 2:
                        response = _b.sent();
                        return [4 /*yield*/, database_js_1.default.execute("select *\n                 from `".concat(config_js_1.saasConfig.SAAS_NAME, "`.private_config\n                 where `app_name` = '").concat(this.app, "'\n                   and `key` = 'shopee_access_token'\n                "), [])];
                    case 3:
                        data = (_b.sent());
                        passData = __assign(__assign({}, response.data), { expires_at: new Date(Date.now() + 14373 * 1000).toISOString(), created_at: new Date().toISOString(), shop_id: shop_id });
                        if (!(data.length == 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, database_js_1.default.execute("\n                            INSERT INTO `".concat(config_js_1.saasConfig.SAAS_NAME, "`.private_config (`app_name`, `key`, `value`, `updated_at`)\n                            VALUES (?, ?, ?, ?);\n                    "), [this.app, "shopee_access_token", passData, new Date()])];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, database_js_1.default.execute("\n                            UPDATE `".concat(config_js_1.saasConfig.SAAS_NAME, "`.`private_config`\n                            SET `value` = ? , updated_at=?\n                            where `app_name` = '").concat(this.app, "'\n                              and `key` = 'shopee_access_token'\n                    "), [passData, new Date()])];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_1 = _b.sent();
                        if (axios_1.default.isAxiosError(error_1) && error_1.response) {
                            console.error('Error Response:', error_1.response.data);
                        }
                        else {
                            console.error('Unexpected Error:', error_1.message);
                        }
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Shopee.prototype.getItemList = function (start_1, end_1) {
        return __awaiter(this, arguments, void 0, function (start, end, index) {
            var timestamp, partner_id, api_path, data, config, response, itemList, productData, temp, error_2, error_3;
            var _this = this;
            var _a;
            if (index === void 0) { index = 0; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        timestamp = Math.floor(Date.now() / 1000);
                        partner_id = (_a = Shopee.partner_id) !== null && _a !== void 0 ? _a : "";
                        api_path = "/api/v2/product/get_item_list";
                        return [4 /*yield*/, this.fetchShopeeAccessToken()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, database_js_1.default.execute("select *\n             from `".concat(config_js_1.saasConfig.SAAS_NAME, "`.private_config\n             where `app_name` = '").concat(this.app, "'\n               and `key` = 'shopee_access_token'\n            "), [])];
                    case 2:
                        data = (_b.sent());
                        config = {
                            method: 'get',
                            url: this.generateShopUrl(partner_id, api_path, timestamp, data[0].value.access_token, parseInt(data[0].value.shop_id)),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            params: {
                                shop_id: parseInt(data[0].value.shop_id),
                                access_token: data[0].value.access_token,
                                offset: index || 0,
                                page_size: 10,
                                update_time_from: start,
                                update_time_to: Math.floor(Date.now() / 1000),
                                item_status: ['NORMAL', 'BANNED', 'UNLIST'],
                            },
                            paramsSerializer: function (params) { return qs_1.default.stringify(params, { arrayFormat: 'repeat' }); },
                        };
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 12, , 13]);
                        return [4 /*yield*/, (0, axios_1.default)(config)];
                    case 4:
                        response = _b.sent();
                        if (response.data.error.length > 0) {
                            return [2 /*return*/, {
                                    type: "error",
                                    message: response.data.error
                                }];
                        }
                        itemList = response.data.response.item;
                        return [4 /*yield*/, Promise.all(itemList.map(function (item, index) { return __awaiter(_this, void 0, void 0, function () {
                                var pd_data, error_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 5, , 6]);
                                            return [4 /*yield*/, database_js_1.default.query("SELECT count(1)\n                                                            FROM ".concat(this.app, ".t_manager_post\n                                                            WHERE (content ->>'$.type'='product')\n                                                              AND (content ->>'$.shopee_id' = ").concat(item.item_id, ");"), [])];
                                        case 1:
                                            pd_data = (_a.sent());
                                            if (!(pd_data[0]['count(1)'] > 0)) return [3 /*break*/, 2];
                                            return [2 /*return*/, null];
                                        case 2: return [4 /*yield*/, this.getProductDetail(item.item_id)];
                                        case 3: return [2 /*return*/, _a.sent()]; // 返回上傳後的資料
                                        case 4: return [3 /*break*/, 6];
                                        case 5:
                                            error_4 = _a.sent();
                                            return [2 /*return*/, null]; // 返回 null 以處理失敗的情況
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 5:
                        productData = _b.sent();
                        temp = {};
                        temp.data = productData.reverse().filter(function (dd) {
                            return dd;
                        });
                        temp.collection = [];
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 10, , 11]);
                        return [4 /*yield*/, new shopping_js_1.Shopping(this.app, this.token).postMulProduct(temp)];
                    case 7:
                        _b.sent();
                        if (!response.data.response.has_next_page) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.getItemList(start, end, response.data.response.next_offset)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [2 /*return*/, {
                            data: temp.data,
                            message: '匯入OK'
                        }];
                    case 10:
                        error_2 = _b.sent();
                        console.error(error_2);
                        //失敗繼續跑匯入
                        // if (response.data.response.has_next_page) {
                        //     await this.getItemList(start, end, response.data.response.next_offset)
                        // }
                        return [2 /*return*/, {
                                type: "error",
                                data: temp.data,
                                message: '產品匯入資料庫失敗'
                            }];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_3 = _b.sent();
                        if (axios_1.default.isAxiosError(error_3) && error_3.response) {
                            console.log("Try get_item_list error");
                            console.error('Error Response:', error_3.response.data);
                            return [2 /*return*/, {
                                    type: "error",
                                    error: error_3.response.data.error,
                                    message: error_3.response.data.message,
                                }];
                        }
                        else {
                            console.error('Unexpected Error:', error_3.message);
                        }
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Shopee.prototype.getProductDetail = function (id, option) {
        return __awaiter(this, void 0, void 0, function () {
            function getModel(postMD) {
                return __awaiter(this, void 0, void 0, function () {
                    var timestamp, partner_id, api_path, config, response, tempVariants_1, tier_variation, model, specs, error_6;
                    var _this = this;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                timestamp = Math.floor(Date.now() / 1000);
                                partner_id = (_a = Shopee.partner_id) !== null && _a !== void 0 ? _a : "";
                                api_path = "/api/v2/product/get_model_list";
                                config = {
                                    method: 'get',
                                    url: that.generateShopUrl(partner_id, api_path, timestamp, token.access_token, parseInt(token.shop_id)),
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    params: {
                                        shop_id: parseInt(token.shop_id),
                                        access_token: token.access_token,
                                        item_id: id
                                    },
                                };
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, (0, axios_1.default)(config)];
                            case 2:
                                response = _b.sent();
                                tempVariants_1 = [];
                                tier_variation = response.data.response.tier_variation;
                                model = response.data.response.model;
                                specs = tier_variation.map(function (dd) {
                                    var temp = {
                                        title: dd.name,
                                        option: [],
                                        language_title: {}
                                    };
                                    dd.option_list.map(function (option) {
                                        temp.option.push({
                                            title: option.option,
                                            expand: false,
                                            language_title: {}
                                        });
                                    });
                                    return temp;
                                });
                                postMD.specs = specs;
                                model.map(function (data) { return __awaiter(_this, void 0, void 0, function () {
                                    var newVariants, imageUrl, buffer, fileExtension, fileName, _a, error_7;
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                newVariants = {
                                                    sale_price: data.price_info[0].current_price,
                                                    compare_price: data.price_info[0].original_price,
                                                    cost: 0,
                                                    spec: data.model_name.split(','),
                                                    profit: 0,
                                                    v_length: 0,
                                                    v_width: 0,
                                                    v_height: 0,
                                                    weight: 0,
                                                    shipment_type: 'none',
                                                    sku: data.model_sku,
                                                    barcode: "",
                                                    stock: data.stock_info_v2.summary_info.total_available_stock,
                                                    stockList: {},
                                                    preview_image: "",
                                                    show_understocking: "true",
                                                    type: "product",
                                                };
                                                if (!(!(option && option.skip_image_load) && (((_b = data === null || data === void 0 ? void 0 : data.image) === null || _b === void 0 ? void 0 : _b.image_url_list.length) > 0))) return [3 /*break*/, 7];
                                                _c.label = 1;
                                            case 1:
                                                _c.trys.push([1, 6, , 7]);
                                                imageUrl = data.image.image_url_list[0];
                                                if (!imageUrl) return [3 /*break*/, 4];
                                                return [4 /*yield*/, that.downloadImage(imageUrl)];
                                            case 2:
                                                buffer = _c.sent();
                                                fileExtension = "jpg";
                                                fileName = "shopee/".concat(postMD.title, "/").concat(new Date().getTime(), "_0.").concat(fileExtension);
                                                _a = newVariants;
                                                return [4 /*yield*/, that.uploadFile(fileName, buffer)];
                                            case 3:
                                                _a.preview_image = _c.sent(); // 只賦值第一個圖片的上傳結果
                                                return [3 /*break*/, 5];
                                            case 4:
                                                console.warn('圖片 URL 列表為空，無法處理');
                                                newVariants.preview_image = "";
                                                _c.label = 5;
                                            case 5: return [3 /*break*/, 7];
                                            case 6:
                                                error_7 = _c.sent();
                                                console.error('下載或上傳失敗:', error_7);
                                                newVariants.preview_image = ""; // 若發生錯誤，設為 null
                                                return [3 /*break*/, 7];
                                            case 7:
                                                newVariants.shopee_model_id = data.model_id;
                                                tempVariants_1.push(newVariants);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                postMD.variants = tempVariants_1;
                                return [3 /*break*/, 4];
                            case 3:
                                error_6 = _b.sent();
                                if (axios_1.default.isAxiosError(error_6) && error_6.response) {
                                    console.error('Error Response:', error_6.response.data);
                                }
                                else {
                                    console.error('Unexpected Error:', error_6.message);
                                }
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            var that, token, timestamp, partner_id, api_path, config, response, item, origData, e_1, postMD_1, temp_1, promises, html_1, newVariants, _a, error_5;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        that = this;
                        return [4 /*yield*/, this.fetchShopeeAccessToken()];
                    case 1:
                        token = _c.sent();
                        if (!token) {
                            return [2 /*return*/, false];
                        }
                        timestamp = Math.floor(Date.now() / 1000);
                        partner_id = (_b = Shopee.partner_id) !== null && _b !== void 0 ? _b : "";
                        api_path = "/api/v2/product/get_item_base_info";
                        config = {
                            method: 'get',
                            url: this.generateShopUrl(partner_id, api_path, timestamp, token.access_token, parseInt(token.shop_id)),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            params: {
                                shop_id: parseInt(token.shop_id),
                                access_token: token.access_token,
                                item_id_list: id
                            },
                        };
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 15, , 16]);
                        return [4 /*yield*/, (0, axios_1.default)(config)];
                    case 3:
                        response = _c.sent();
                        item = response.data.response.item_list[0];
                        origData = {};
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n                                           FROM `".concat(this.app, "`.t_manager_post\n                                           WHERE (content ->>'$.type'='product')\n                                             AND (content ->>'$.shopee_id' = ?);"), [id])];
                    case 5:
                        origData = _c.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _c.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        postMD_1 = this.getInitial({});
                        if (origData.length > 0) {
                            postMD_1 = __assign(__assign({}, postMD_1), origData[0]);
                        }
                        postMD_1.title = item.item_name;
                        if (!(item.description_info && item.description_info.extended_description.field_list.length > 0)) return [3 /*break*/, 9];
                        temp_1 = "";
                        promises = item.description_info.extended_description.field_list.map(function (item1) { return __awaiter(_this, void 0, void 0, function () {
                            var buffer, fileExtension, fileName, _a, error_8;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!(item1.field_type == 'image' && !(option && option.skip_image_load))) return [3 /*break*/, 5];
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, this.downloadImage(item1.image_info.image_url)];
                                    case 2:
                                        buffer = _b.sent();
                                        fileExtension = "jpg";
                                        fileName = "shopee/".concat(postMD_1.title, "/").concat(new Date().getTime(), "_").concat(item1.image_info.image_id, ".").concat(fileExtension);
                                        _a = item1.image_info;
                                        return [4 /*yield*/, this.uploadFile(fileName, buffer)];
                                    case 3:
                                        _a.s3 = _b.sent();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        error_8 = _b.sent();
                                        console.error('下載或上傳失敗:', error_8);
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); });
                        html_1 = String.raw;
                        return [4 /*yield*/, Promise.all(promises)];
                    case 8:
                        _c.sent();
                        if (item.description_info && item.description_info.extended_description) {
                            item.description_info.extended_description.field_list.map(function (item) {
                                if (item.field_type == 'image' && !(option && option.skip_image_load)) {
                                    temp_1 += html_1(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n                            <div style=\"white-space: pre-wrap;\"><img src=\"", "\"\n                                                                     alt='", "'></div>"], ["\n                            <div style=\"white-space: pre-wrap;\"><img src=\"", "\"\n                                                                     alt='", "'></div>"])), item.image_info.s3, item.image_info.image_id);
                                }
                                else if (item.field_type == 'text') {
                                    temp_1 += html_1(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n                            <div style=\"white-space: pre-wrap;\">", "</div>"], ["\n                            <div style=\"white-space: pre-wrap;\">", "</div>"])), item.text);
                                }
                            });
                        }
                        postMD_1.content = temp_1;
                        _c.label = 9;
                    case 9:
                        if (!item.price_info) return [3 /*break*/, 10];
                        newVariants = {
                            sale_price: item.price_info[0].current_price,
                            compare_price: item.price_info[0].original_price,
                            cost: 0,
                            spec: [],
                            profit: 0,
                            v_length: item.dimension.package_length,
                            v_width: item.dimension.package_width,
                            v_height: item.dimension.package_height,
                            weight: item.weight,
                            shipment_type: 'none',
                            sku: "",
                            barcode: "",
                            stock: item.stock_info_v2.summary_info.total_available_stock,
                            stockList: {},
                            preview_image: "",
                            show_understocking: "true",
                            type: "product",
                        };
                        postMD_1.variants = [];
                        postMD_1.variants.push(newVariants);
                        return [3 /*break*/, 12];
                    case 10: 
                    //多規格
                    return [4 /*yield*/, getModel(postMD_1)];
                    case 11:
                        //多規格
                        _c.sent();
                        _c.label = 12;
                    case 12:
                        if (!(item.image.image_url_list.length > 0 && !(option && option.skip_image_load))) return [3 /*break*/, 14];
                        _a = postMD_1;
                        return [4 /*yield*/, Promise.all(item.image.image_url_list.map(function (imageUrl, index) { return __awaiter(_this, void 0, void 0, function () {
                                var buffer, fileExtension, fileName, uploadedData, error_9;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 3, , 4]);
                                            return [4 /*yield*/, this.downloadImage(imageUrl)];
                                        case 1:
                                            buffer = _a.sent();
                                            fileExtension = "jpg";
                                            fileName = "shopee/".concat(postMD_1.title, "/").concat(new Date().getTime(), "_").concat(index, ".").concat(fileExtension);
                                            return [4 /*yield*/, this.uploadFile(fileName, buffer)];
                                        case 2:
                                            uploadedData = _a.sent();
                                            return [2 /*return*/, uploadedData]; // 返回上傳後的資料
                                        case 3:
                                            error_9 = _a.sent();
                                            console.error('下載或上傳失敗:', error_9);
                                            return [2 /*return*/, null]; // 返回 null 以處理失敗的情況
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 13:
                        _a.preview_image = _c.sent();
                        _c.label = 14;
                    case 14:
                        //把蝦皮的商品id寫回
                        postMD_1.shopee_id = id;
                        return [2 /*return*/, postMD_1];
                    case 15:
                        error_5 = _c.sent();
                        if (axios_1.default.isAxiosError(error_5) && error_5.response) {
                            console.error('Error Response:', error_5.response.data);
                        }
                        else {
                            console.error('Unexpected Error:', error_5.message);
                        }
                        return [3 /*break*/, 16];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    Shopee.prototype.asyncStockToShopee = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var access, basicData, partner_id, api_path, timestamp, config, response_1, updateConfig, response_2, error_10, error_11;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log("asyncStockToShopee===>");
                        if (!(!obj.access_token || !obj.shop_id)) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Shopee(this.app, this.token).fetchShopeeAccessToken()];
                    case 1:
                        access = _d.sent();
                        obj.access_token = access.access_token;
                        obj.shop_id = access.shop_id;
                        _d.label = 2;
                    case 2:
                        if (!obj.product.content.shopee_id) {
                            //沒有shopee_id的話直接回去
                            obj.callback();
                            return [2 /*return*/];
                        }
                        basicData = {
                            "item_id": obj.product.content.shopee_id,
                            "stock_list": []
                        };
                        partner_id = (_a = Shopee.partner_id) !== null && _a !== void 0 ? _a : "";
                        api_path = "/api/v2/product/get_model_list";
                        timestamp = Math.floor(Date.now() / 1000);
                        config = {
                            method: 'get',
                            url: this.generateShopUrl(partner_id, api_path, timestamp, obj.access_token, parseInt(obj.shop_id)),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            params: {
                                shop_id: parseInt(obj.shop_id),
                                access_token: obj.access_token,
                                item_id: obj.product.content.shopee_id
                            },
                        };
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 9, , 10]);
                        return [4 /*yield*/, (0, axios_1.default)(config)];
                    case 4:
                        response_1 = _d.sent();
                        if (!((_c = (_b = response_1.data) === null || _b === void 0 ? void 0 : _b.response) === null || _c === void 0 ? void 0 : _c.model)) {
                            obj.callback(response_1.data);
                        }
                        //找到兩個名字相同的 把儲存model_id 還有庫存
                        obj.product.content.variants.map(function (variant) {
                            var basicStock = {
                                "model_id": 0,
                                "seller_stock": [
                                    {
                                        "stock": 0
                                    }
                                ]
                            };
                            var findModel = response_1.data.response.model.find(function (item) { return item.model_name == variant.spec.join(','); });
                            console.log("findModel===>", findModel);
                            if (findModel || response_1.data.response.model.length == 0) {
                                basicStock.model_id = (findModel && findModel.model_id) || 0;
                                //shopee 單倉儲的情形
                                basicStock.seller_stock[0].stock = variant.stock;
                                basicData.stock_list.push(basicStock);
                            }
                        });
                        updateConfig = {
                            method: 'post',
                            url: this.generateShopUrl(partner_id, "/api/v2/product/update_stock", timestamp, obj.access_token, parseInt(obj.shop_id)),
                            params: {
                                shop_id: parseInt(obj.shop_id),
                                access_token: obj.access_token,
                            },
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: JSON.stringify(basicData)
                        };
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, (0, axios_1.default)(updateConfig)];
                    case 6:
                        response_2 = _d.sent();
                        console.log("update_stock", JSON.stringify(basicData));
                        console.log("update_stock", response_2.data);
                        obj.callback(response_2.data);
                        return [3 /*break*/, 8];
                    case 7:
                        error_10 = _d.sent();
                        if (axios_1.default.isAxiosError(error_10) && error_10.response) {
                            console.error('Error Response:', error_10.response.data);
                        }
                        else {
                            console.error('Unexpected Error:', error_10.message);
                        }
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_11 = _d.sent();
                        if (axios_1.default.isAxiosError(error_11) && error_11.response) {
                            console.error('Error get_model_list Response:', error_11.response.data);
                        }
                        else {
                            console.error('Unexpected Error:', error_11.message);
                        }
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Shopee.prototype.asyncStockFromShopnex = function () {
        return __awaiter(this, void 0, void 0, function () {
            var origData, temp_2, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        origData = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n                                           FROM `".concat(this.app, "`.t_manager_post\n                                           WHERE (content ->>'$.type'='product')\n                                             AND (content ->>'$.shopee_id' IS NOT NULL AND content ->>'$.shopee_id' <> '')"), [])];
                    case 2:
                        origData = _a.sent();
                        return [4 /*yield*/, this.fetchShopeeAccessToken()];
                    case 3:
                        temp_2 = _a.sent();
                        return [2 /*return*/, Promise.all(origData.map(function (product) {
                                return new Promise(function (resolve, reject) {
                                    try {
                                        _this.asyncStockToShopee({
                                            product: product,
                                            callback: function () {
                                                resolve(); // 當 `asyncStockToShopee` 執行完畢後標記為完成
                                            },
                                            access_token: temp_2.access_token,
                                            shop_id: temp_2.shop_id
                                        });
                                    }
                                    catch (e) {
                                        reject(e); // 捕獲錯誤並拒絕該 Promise
                                    }
                                });
                            })).then(function () {
                                console.log("所有產品的庫存同步完成！");
                                return {
                                    result: "OK",
                                };
                            }).catch(function (error) {
                                console.error("同步庫存時發生錯誤:", error);
                            })];
                    case 4:
                        e_2 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Shopee.prototype.fetchShopeeAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sqlData, obj, partner_id, api_path, timestamp, config_1, response, e_3, e_4, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        return [4 /*yield*/, database_js_1.default.execute("SELECT * \n             FROM `".concat(config_js_1.saasConfig.SAAS_NAME, "`.private_config\n             WHERE `app_name` = '").concat(this.app, "'\n               AND `key` = 'shopee_access_token'"), [])];
                    case 1:
                        sqlData = _a.sent();
                        obj = {};
                        obj.accessToken = sqlData;
                        if (!(new Date().getTime() >= (new Date(sqlData[0].updated_at).getTime() + (3.9 * 3600 * 1000)))) return [3 /*break*/, 10];
                        console.log("\u78BA\u8A8D\u8981\u5237\u65B0token");
                        partner_id = Shopee.partner_id;
                        api_path = "/api/v2/auth/access_token/get";
                        timestamp = Math.floor(Date.now() / 1000);
                        config_1 = {
                            method: 'post',
                            url: this.generateUrl(partner_id, api_path, timestamp),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: JSON.stringify({
                                shop_id: parseInt(obj.accessToken[0].value.shop_id),
                                refresh_token: obj.accessToken[0].value.refresh_token,
                                partner_id: parseInt(partner_id)
                            }),
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, (0, axios_1.default)(config_1)];
                    case 3:
                        response = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, database_js_1.default.execute("\n                        UPDATE `".concat(config_js_1.saasConfig.SAAS_NAME, "`.`private_config`\n                        SET `value` = ? , updated_at = ?\n                        where `app_name` = '").concat(this.app, "'\n                          and `key` = 'shopee_access_token'\n                    "), [response.data, new Date()])];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, response.data];
                    case 6:
                        e_3 = _a.sent();
                        console.error("refresh private_config shopee_access_token error : ", e_3.data);
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        e_4 = _a.sent();
                        console.error("Shopee access token API request failed:", e_4);
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 11];
                    case 10: return [2 /*return*/, sqlData[0].value];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        e_5 = _a.sent();
                        console.error("Database query for Shopee access token failed:", e_5);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Shopee.prototype.getInitial = function (obj) {
        function getEmptyLanguageData() {
            return {
                title: '',
                seo: {
                    domain: '',
                    title: '',
                    content: '',
                    keywords: '',
                },
                content: '',
                content_array: [],
            };
        }
        return {
            type: 'product',
            title: '',
            ai_description: '',
            language_data: {
                'en-US': getEmptyLanguageData(),
                'zh-CN': getEmptyLanguageData(),
                'zh-TW': {
                    title: (obj.defData && obj.defData.title) || '',
                    seo: (obj.defData && obj.defData.seo) || {},
                },
            },
            productType: {
                product: true,
                addProduct: false,
                giveaway: false,
            },
            content: '',
            visible: 'true',
            status: 'active',
            collection: [],
            hideIndex: 'false',
            preview_image: [],
            specs: [],
            variants: [],
            seo: {
                title: '',
                content: '',
                keywords: '',
                domain: '',
            },
            relative_product: [],
            template: '',
            content_array: [],
            content_json: [],
            active_schedule: {
                startDate: this.getDateTime().date,
                startTime: this.getDateTime().time,
                endDate: undefined,
                endTime: undefined,
            },
            channel: ['normal', 'pos'],
        };
    };
    Shopee.prototype.uploadFile = function (file_name, fileData) {
        return __awaiter(this, void 0, void 0, function () {
            var TAG, logger, s3bucketName, s3path, fullUrl, params;
            var _this = this;
            return __generator(this, function (_a) {
                TAG = "[AWS-S3][Upload]";
                logger = new logger_js_1.default();
                s3bucketName = config_js_1.default.AWS_S3_NAME;
                s3path = file_name;
                fullUrl = config_js_1.default.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
                params = {
                    Bucket: s3bucketName,
                    Key: s3path,
                    Expires: 300,
                    //If you use other contentType will response 403 error
                    ContentType: (function () {
                        if (config_js_1.default.SINGLE_TYPE) {
                            return "application/x-www-form-urlencoded; charset=UTF-8";
                        }
                        else {
                            return mime.getType(fullUrl.split('.').pop());
                        }
                    })(),
                };
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        AWSLib_js_1.default.getSignedUrl('putObject', params, function (err, url) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (err) {
                                    logger.error(TAG, String(err));
                                    // use console.log here because logger.info cannot log err.stack correctly
                                    console.log(err, err.stack);
                                    reject(false);
                                }
                                else {
                                    (0, axios_1.default)({
                                        method: 'PUT',
                                        url: url,
                                        data: fileData,
                                        headers: {
                                            'Content-Type': params.ContentType,
                                        },
                                    })
                                        .then(function () {
                                        resolve(fullUrl);
                                    })
                                        .catch(function () {
                                        console.log("convertError:".concat(fullUrl));
                                    });
                                }
                                return [2 /*return*/];
                            });
                        }); });
                    })];
            });
        });
    };
    Shopee.prototype.downloadImage = function (imageUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(imageUrl, {
                                headers: {},
                                responseType: 'arraybuffer', // 下載二進制資料
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, Buffer.from(response.data)];
                    case 2:
                        error_12 = _a.sent();
                        console.error('下載圖片時出錯:', error_12);
                        throw error_12;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Shopee.getItemProgress = [];
    return Shopee;
}());
exports.Shopee = Shopee;
var templateObject_1, templateObject_2;

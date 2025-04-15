"use strict";
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
exports.Private_config = void 0;
var exception_js_1 = require("../modules/exception.js");
var database_js_1 = require("../modules/database.js");
var moment_js_1 = require("moment/moment.js");
var config_js_1 = require("../config.js");
var post_1 = require("../api-public/services/post");
var glitter_finance_js_1 = require("../api-public/models/glitter-finance.js");
var shipment_config_js_1 = require("../api-public/config/shipment-config.js");
var Private_config = /** @class */ (function () {
    // public async verifyPermission(appName: string) {
    //
    //   const result = await db.query(
    //     `SELECT count(1)
    //            FROM ${saasConfig.SAAS_NAME}.app_config
    //            WHERE (user = ? and appName = ?)
    //               OR appName in (
    //                (SELECT appName
    //                 FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config
    //                 WHERE user = ?
    //                   AND status = 1
    //                   AND invited = 1
    //                   AND appName = ?));
    //           `,
    //     [this.token.userID, appName, this.token.userID, appName]
    //   );
    //   return result[0]['count(1)'] === 1;
    // }
    function Private_config(token) {
        this.token = token;
    }
    Private_config.prototype.setConfig = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (config.key === 'sql_api_config_post') {
                            post_1.Post.lambda_function[config.appName] = undefined;
                        }
                        return [4 /*yield*/, database_js_1.default.execute("replace\n                into `".concat(config_js_1.saasConfig.SAAS_NAME, "`.private_config (app_name,`key`,`value`,updated_at)\n            values (?,?,?,?)\n                "), [config.appName, config.key, config.value, (0, moment_js_1.default)(new Date()).format('YYYY-MM-DD HH:mm:ss')])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        throw exception_js_1.default.BadRequestError('ERROR', 'ERROR.' + e_1, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Private_config.prototype.getConfig = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_js_1.default.execute("select *\n                 from `".concat(config_js_1.saasConfig.SAAS_NAME, "`.private_config\n                 where app_name = ").concat(database_js_1.default.escape(config.appName), "\n                   and `key` = ").concat(database_js_1.default.escape(config.key), "\n                "), [])];
                    case 1:
                        data = _a.sent();
                        if (!(data[0] && data[0].value)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Private_config.checkConfigUpdate(config.appName, data[0].value, config.key)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, data];
                    case 4:
                        e_2 = _a.sent();
                        console.error(e_2);
                        throw exception_js_1.default.BadRequestError('ERROR', 'ERROR.' + e_2, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Private_config.getConfig = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_js_1.default.execute("select *\n                 from `".concat(config_js_1.saasConfig.SAAS_NAME, "`.private_config\n                 where app_name = ").concat(database_js_1.default.escape(config.appName), "\n                   and `key` = ").concat(database_js_1.default.escape(config.key), "\n                "), [])];
                    case 1:
                        data = _a.sent();
                        if (!(data[0] && data[0].value)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.checkConfigUpdate(config.appName, data[0].value, config.key)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, data];
                    case 4:
                        e_3 = _a.sent();
                        console.error(e_3);
                        throw exception_js_1.default.BadRequestError('ERROR', 'ERROR.' + e_3, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // 判斷是否要更新配置檔案資料結構
    Private_config.checkConfigUpdate = function (appName, keyData, key) {
        return __awaiter(this, void 0, void 0, function () {
            var og, _i, _a, b, shipment_setting, onlinePayKeys, defShipment_1, customDelivery_1, og;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(key === 'glitter_finance')) return [3 /*break*/, 2];
                        // 轉換成V2版本
                        if (!keyData.ecPay) {
                            og = keyData;
                            for (_i = 0, _a = ['newWebPay', 'ecPay']; _i < _a.length; _i++) {
                                b = _a[_i];
                                if (keyData.TYPE === b) {
                                    keyData[b] = {
                                        MERCHANT_ID: og.MERCHANT_ID,
                                        HASH_IV: og.HASH_IV,
                                        HASH_KEY: og.HASH_KEY,
                                        ActionURL: og.ActionURL,
                                        atm: og.atm,
                                        c_bar_code: og.c_bar_code,
                                        c_code: og.c_code,
                                        credit: og.credit,
                                        web_atm: og.web_atm,
                                        toggle: true,
                                    };
                                }
                                else {
                                    keyData[b] = {
                                        MERCHANT_ID: '',
                                        HASH_IV: '',
                                        HASH_KEY: '',
                                        ActionURL: '',
                                        atm: true,
                                        c_bar_code: true,
                                        c_code: true,
                                        credit: true,
                                        web_atm: true,
                                        toggle: false,
                                    };
                                }
                            }
                        }
                        // PayPal
                        if (!keyData.paypal) {
                            keyData.paypal = {
                                PAYPAL_CLIENT_ID: '',
                                PAYPAL_SECRET: '',
                                BETA: false,
                                toggle: false,
                            };
                        }
                        // LinePay
                        if (!keyData.line_pay) {
                            keyData.line_pay = {
                                CLIENT_ID: '',
                                SECRET: '',
                                BETA: false,
                                toggle: false,
                            };
                        }
                        // LinePay POS
                        if (!keyData.line_pay_scan) {
                            keyData.line_pay_scan = {
                                CLIENT_ID: '',
                                SECRET: '',
                                BETA: false,
                                toggle: false,
                            };
                        }
                        // POS 實體信用卡
                        if (!keyData.ut_credit_card) {
                            keyData.ut_credit_card = {
                                pwd: '',
                                toggle: false,
                            };
                        }
                        // POS 實體信用卡
                        if (!keyData.paynow) {
                            keyData.paynow = {
                                BETA: 'false',
                                public_key: '',
                                private_key: '',
                            };
                        }
                        // 街口支付
                        if (!keyData.jkopay) {
                            keyData.jkopay = {
                                STORE_ID: '',
                                API_KEY: '',
                                SECRET_KEY: '',
                            };
                        }
                        ['paypal', 'newWebPay', 'ecPay'].map(function (dd) {
                            if (keyData[dd].toggle) {
                                keyData.TYPE = dd;
                            }
                        });
                        ['MERCHANT_ID', 'HASH_IV', 'HASH_KEY', 'ActionURL', 'atm', 'c_bar_code', 'c_code', 'credit', 'web_atm'].map(function (dd) {
                            keyData[dd] = undefined;
                        });
                        keyData.payment_info_custom = keyData.payment_info_custom || [];
                        return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                var config, e_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, Private_config.getConfig({
                                                    appName: appName,
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
                        shipment_setting = _c.sent();
                        onlinePayKeys = glitter_finance_js_1.onlinePayArray.map(function (item) { return item.key; });
                        defShipment_1 = shipment_config_js_1.ShipmentConfig.list.map(function (item) { return item.value; });
                        customDelivery_1 = ((_b = shipment_setting.custom_delivery) !== null && _b !== void 0 ? _b : []).map(function (item) { return item.id; });
                        __spreadArray(__spreadArray([], onlinePayKeys, true), ['payment_info_line_pay', 'payment_info_atm', 'cash_on_delivery'], false).forEach(function (type) {
                            if (keyData[type] && keyData[type].shipmentSupport === undefined) {
                                keyData[type].shipmentSupport = __spreadArray(__spreadArray([], defShipment_1, true), customDelivery_1, true);
                            }
                        });
                        if (Array.isArray(keyData.payment_info_custom)) {
                            keyData.payment_info_custom.forEach(function (item) {
                                if (item.shipmentSupport === undefined) {
                                    item.shipmentSupport = __spreadArray(__spreadArray([], defShipment_1, true), customDelivery_1, true);
                                }
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        if (key === 'glitter_delivery') {
                            // 轉換成V2版本
                            if (!keyData.ec_pay) {
                                og = JSON.parse(JSON.stringify(keyData));
                                Object.keys(keyData).map(function (dd) {
                                    delete keyData[dd];
                                });
                                keyData.ec_pay = og;
                            }
                            if (!keyData.pay_now) {
                                keyData.pay_now = {
                                    Action: 'test',
                                    toggle: false,
                                    account: '',
                                    pwd: '',
                                };
                            }
                            if (typeof keyData.pay_now.toggle === 'string') {
                                keyData.pay_now.toggle = false;
                            }
                            if (typeof keyData.ec_pay.toggle === 'string') {
                                keyData.ec_pay.toggle = false;
                            }
                        }
                        _c.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Private_config;
}());
exports.Private_config = Private_config;

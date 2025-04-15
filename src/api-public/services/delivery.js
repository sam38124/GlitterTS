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
exports.Delivery = exports.EcPay = void 0;
var tool_js_1 = require("../../modules/tool.js");
var redis_js_1 = require("../../modules/redis.js");
var exception_js_1 = require("../../modules/exception.js");
var database_js_1 = require("../../modules/database.js");
var private_config_js_1 = require("../../services/private_config.js");
var crypto_1 = require("crypto");
var axios_1 = require("axios");
var moment_timezone_1 = require("moment-timezone");
var shopping_js_1 = require("./shopping.js");
var paynow_logistics_js_1 = require("./paynow-logistics.js");
var user_js_1 = require("./user.js");
var process_1 = require("process");
var html = String.raw;
var EcPay = /** @class */ (function () {
    function EcPay(appName) {
        this.appName = appName;
    }
    EcPay.generateCheckMacValue = function (params, HashKey, HashIV) {
        // 將傳遞參數依字母順序排序
        var sortedKeys = Object.keys(params).sort();
        var sortedParams = sortedKeys.map(function (key) { return "".concat(key, "=").concat(params[key]); }).join('&');
        // 在最前面加上 HashKey，最後加上 HashIV
        var stringToEncode = "HashKey=".concat(HashKey, "&").concat(sortedParams, "&HashIV=").concat(HashIV);
        // 進行 URL encode，並轉成小寫
        var urlEncodedString = encodeURIComponent(stringToEncode)
            .replace(/%2d/g, '-')
            .replace(/%5f/g, '_')
            .replace(/%2e/g, '.')
            .replace(/%21/g, '!')
            .replace(/%2a/g, '*')
            .replace(/%28/g, '(')
            .replace(/%29/g, ')')
            .replace(/%20/g, '+')
            .toLowerCase();
        // 用 MD5 加密
        var md5Hash = crypto_1.default.createHash('md5').update(urlEncodedString).digest('hex');
        // 轉大寫並返回結果
        return md5Hash.toUpperCase();
    };
    EcPay.generateForm = function (json) {
        var formId = "form_ecpay_".concat(tool_js_1.default.randomString(10));
        var inputHTML = Object.entries(json.params)
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<input type=\"hidden\" name=\"", "\" id=\"", "\" value=\"", "\" />"], ["<input type=\"hidden\" name=\"", "\" id=\"", "\" value=\"", "\" />"])), key, key, value);
        })
            .join('\n');
        return html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      <form\n        id=\"", "\"\n        action=\"", "\"\n        method=\"post\"\n        enctype=\"application/x-www-form-urlencoded\"\n        accept=\"text/html\"\n      >\n        ", "\n        ", "\n        <button type=\"submit\" class=\"btn btn-secondary custom-btn beside-btn d-none\" id=\"submit\" hidden></button>\n      </form>\n    "], ["\n      <form\n        id=\"", "\"\n        action=\"", "\"\n        method=\"post\"\n        enctype=\"application/x-www-form-urlencoded\"\n        accept=\"text/html\"\n      >\n        ", "\n        ", "\n        <button type=\"submit\" class=\"btn btn-secondary custom-btn beside-btn d-none\" id=\"submit\" hidden></button>\n      </form>\n    "])), formId, json.actionURL, inputHTML, json.checkMacValue
            ? html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<input type=\"hidden\" name=\"CheckMacValue\" id=\"CheckMacValue\" value=\"", "\" />"], ["<input type=\"hidden\" name=\"CheckMacValue\" id=\"CheckMacValue\" value=\"", "\" />"])), json.checkMacValue) : '');
    };
    EcPay.axiosRequest = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, new Promise(function (resolve) {
                            axios_1.default
                                .request({
                                method: 'post',
                                url: json.actionURL,
                                data: __assign(__assign({}, json.params), { checkMacValue: json.checkMacValue }),
                                headers: {
                                    Accept: 'text/html',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                            })
                                .then(function (response) {
                                resolve(response.data);
                            });
                        })
                            .then(function (response) {
                            return {
                                result: true,
                                data: response,
                            };
                        })
                            .catch(function (error) {
                            return {
                                result: false,
                                data: error.message,
                            };
                        })];
                }
                catch (error) {
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'EcPay axiosRequest error', null);
                }
                return [2 /*return*/];
            });
        });
    };
    EcPay.prototype.notifyOrder = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var checkouts, checkout, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n         FROM `".concat(this.appName, "`.t_checkout\n         WHERE JSON_EXTRACT(orderData, '$.deliveryData.AllPayLogisticsID') = ?\n           AND JSON_EXTRACT(orderData, '$.deliveryData.MerchantTradeNo') = ?;"), [json.AllPayLogisticsID, json.MerchantTradeNo])];
                    case 1:
                        checkouts = _a.sent();
                        if (!checkouts[0]) return [3 /*break*/, 3];
                        checkout = checkouts[0];
                        if (checkout.orderData.deliveryNotifyList && checkout.orderData.deliveryNotifyList.length > 0) {
                            checkout.orderData.deliveryNotifyList.push(json);
                        }
                        else {
                            checkout.orderData.deliveryNotifyList = [json];
                        }
                        return [4 /*yield*/, new shopping_js_1.Shopping(this.appName).putOrder({
                                id: checkout.id,
                                orderData: checkout.orderData,
                                status: undefined,
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, '1|OK'];
                    case 4:
                        error_1 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'EcPay notifyOrder error:' + error_1, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return EcPay;
}());
exports.EcPay = EcPay;
var Delivery = /** @class */ (function () {
    function Delivery(appName) {
        this.appName = appName;
    }
    Delivery.prototype.getC2CMap = function (returnURL, logistics) {
        return __awaiter(this, void 0, void 0, function () {
            var id, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = 'redirect_' + tool_js_1.default.randomString(10);
                        return [4 /*yield*/, redis_js_1.default.setValue(id, returnURL)];
                    case 1:
                        _a.sent();
                        console.log("process.env.EC_SHIPMENT_ID=>", process_1.default.env.EC_SHIPMENT_ID);
                        if (logistics === 'UNIMARTFREEZE') {
                            logistics = 'UNIMARTC2C';
                        }
                        console.log("logistics=>", logistics);
                        params = {
                            MerchantID: process_1.default.env.EC_SHIPMENT_ID,
                            MerchantTradeNo: new Date().getTime(),
                            LogisticsType: 'CVS',
                            LogisticsSubType: logistics,
                            IsCollection: 'N',
                            ServerReplyURL: "".concat(process_1.default.env.DOMAIN, "/api-public/v1/delivery/c2cRedirect?g-app=").concat(this.appName, "&return=").concat(encodeURIComponent(id)),
                        };
                        return [2 /*return*/, EcPay.generateForm({
                                actionURL: 'https://logistics.ecpay.com.tw/Express/map',
                                params: params,
                            })];
                }
            });
        });
    };
    Delivery.prototype.postStoreOrder = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var keyData, actionURL, originParams, params, checkMacValue, response, cleanedString, getJSON;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                            appName: this.appName,
                            key: 'glitter_delivery',
                        })];
                    case 1:
                        keyData = (_a.sent())[0].value.ec_pay;
                        actionURL = keyData.Action === 'main'
                            ? 'https://logistics.ecpay.com.tw/Express/Create'
                            : 'https://logistics-stage.ecpay.com.tw/Express/Create';
                        originParams = __assign({ MerchantID: keyData.MERCHANT_ID, MerchantTradeDate: (0, moment_timezone_1.default)().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'), ServerReplyURL: "".concat(process_1.default.env.DOMAIN, "/api-public/v1/delivery/c2cNotify?g-app=").concat(this.appName), SenderName: keyData.SenderName, SenderCellPhone: keyData.SenderCellPhone }, json);
                        params = Delivery.removeUndefined(originParams);
                        checkMacValue = EcPay.generateCheckMacValue(params, keyData.HASH_KEY, keyData.HASH_IV);
                        return [4 /*yield*/, EcPay.axiosRequest({
                                actionURL: actionURL,
                                params: params,
                                checkMacValue: checkMacValue,
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.result) {
                            return [2 /*return*/, {
                                    result: false,
                                    message: response.data,
                                }];
                        }
                        if (response.data.substring(0, 1) === '0' || response.data.substring(0, 3) === '105') {
                            return [2 /*return*/, {
                                    result: false,
                                    message: response.data,
                                }];
                        }
                        cleanedString = response.data.slice(2);
                        getJSON = Object.fromEntries(cleanedString.split('&').map(function (pair) {
                            var _a = pair.split('='), key = _a[0], value = _a[1];
                            return [key, decodeURIComponent(value)];
                        }));
                        return [2 /*return*/, {
                                result: true,
                                data: getJSON,
                            }];
                }
            });
        });
    };
    Delivery.prototype.generatorDeliveryId = function (id, carData, keyData) {
        return __awaiter(this, void 0, void 0, function () {
            var deliveryData, originParams, params, storePath, actionURL, checkMacValue, random_id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deliveryData = carData.deliveryData[keyData.Action];
                        originParams = {
                            MerchantID: keyData.MERCHANT_ID,
                            AllPayLogisticsID: deliveryData.AllPayLogisticsID,
                            CVSPaymentNo: deliveryData.CVSPaymentNo,
                            CVSValidationNo: deliveryData.CVSValidationNo,
                        };
                        params = Delivery.removeUndefined(originParams);
                        storePath = {
                            FAMIC2C: 'Express/PrintFAMIC2COrderInfo',
                            UNIMARTC2C: 'Express/PrintUniMartC2COrderInfo',
                            HILIFEC2C: 'Express/PrintHILIFEC2COrderInfo',
                            OKMARTC2C: 'Express/PrintOKMARTC2COrderInfo',
                            TCAT: 'helper/printTradeDocument',
                            POST: 'helper/printTradeDocument',
                        };
                        actionURL = keyData.Action === 'main'
                            ? "https://logistics.ecpay.com.tw/".concat(storePath[deliveryData.LogisticsSubType])
                            : "https://logistics-stage.ecpay.com.tw/".concat(storePath[deliveryData.LogisticsSubType]);
                        checkMacValue = EcPay.generateCheckMacValue(params, keyData.HASH_KEY, keyData.HASH_IV);
                        random_id = tool_js_1.default.randomString(6);
                        return [4 /*yield*/, new shopping_js_1.Shopping(this.appName).putOrder({
                                id: id,
                                orderData: carData,
                                status: undefined,
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, redis_js_1.default.setValue('delivery_' + random_id, JSON.stringify({
                                actionURL: actionURL,
                                params: params,
                                checkMacValue: checkMacValue,
                            }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, random_id];
                }
            });
        });
    };
    Delivery.prototype.getOrderInfo = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var deliveryConfig, keyData_1, shoppingClass_1, cart, pay_now_1, error_text_1, log_number, carData_1, shipment_config_1, conf, request_, _a, _b, _c, _d, link_response_1, payNowAccount_1, config, _e, link_response, link, key_1, id, carData_2, random_id, delivery_cf, delivery, receiverPostData, senderPostData, goodsWeight_1, delivery_cf, delivery, e_1;
            var _f, _g, _h, _j;
            var _this = this;
            var _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        _l.trys.push([0, 23, , 24]);
                        return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                appName: this.appName,
                                key: 'glitter_delivery',
                            })];
                    case 1:
                        deliveryConfig = (_l.sent())[0];
                        console.log("deliveryConfig=>", deliveryConfig);
                        //預設走綠界
                        if (!(deliveryConfig &&
                            ("".concat(deliveryConfig.value.ec_pay.toggle) === 'true' || "".concat(deliveryConfig.value.pay_now.toggle) === 'true'))) {
                            console.error('deliveryConfig 不存在 / 未開啟');
                            return [2 /*return*/, {
                                    result: false,
                                    message: '尚未開啟物流追蹤設定',
                                }];
                        }
                        keyData_1 = deliveryConfig.value.ec_pay;
                        shoppingClass_1 = new shopping_js_1.Shopping(this.appName);
                        return [4 /*yield*/, Promise.all(obj.cart_token.split(',').map(function (dd) {
                                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                    var data;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, shoppingClass_1.getCheckOut({
                                                    page: 0,
                                                    limit: 1,
                                                    search: dd,
                                                    searchType: 'cart_token',
                                                })];
                                            case 1:
                                                data = _a.sent();
                                                resolve(data.data);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }))];
                    case 2:
                        cart = (_l.sent()).filter(function (dd) {
                            return dd[0];
                        });
                        if (!cart.length) {
                            console.error('orderData 不存在');
                            return [2 /*return*/, {
                                    result: false,
                                    message: '此訂單不存在',
                                }];
                        }
                        if (!("".concat(deliveryConfig.value.pay_now.toggle) === 'true')) return [3 /*break*/, 14];
                        pay_now_1 = new paynow_logistics_js_1.PayNowLogistics(this.appName);
                        error_text_1 = '';
                        return [4 /*yield*/, Promise.all(cart.map(function (dd) {
                                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                    var data, e_2;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                if (obj.shipment_date) {
                                                    dd[0].orderData.user_info.shipment_date = obj.shipment_date;
                                                }
                                                return [4 /*yield*/, pay_now_1.printLogisticsOrder(dd[0].orderData)];
                                            case 1:
                                                data = _a.sent();
                                                if (data.ErrorMsg && data.ErrorMsg !== '訂單已成立') {
                                                    error_text_1 = data.ErrorMsg;
                                                }
                                                resolve(true);
                                                return [3 /*break*/, 3];
                                            case 2:
                                                e_2 = _a.sent();
                                                resolve(true);
                                                return [3 /*break*/, 3];
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }))];
                    case 3:
                        _l.sent();
                        return [4 /*yield*/, Promise.all(cart.map(function (dd) { return __awaiter(_this, void 0, void 0, function () {
                                function updateShipmentNumber(numb) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    carData.user_info.shipment_number = numb;
                                                    carData.user_info.shipment_refer = 'paynow';
                                                    if (obj.shipment_date) {
                                                        carData.user_info.shipment_date = obj.shipment_date;
                                                    }
                                                    return [4 /*yield*/, new shopping_js_1.Shopping(that.appName).putOrder({
                                                            cart_token: dd[0].cart_token,
                                                            orderData: carData,
                                                            status: undefined,
                                                        })];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    });
                                }
                                var that, carData, config, _a, _b, _c, link_response;
                                var _d;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            that = this;
                                            carData = dd[0].orderData;
                                            _d = {
                                                method: 'get',
                                                maxBodyLength: Infinity
                                            };
                                            _b = "".concat;
                                            return [4 /*yield*/, pay_now_1.config()];
                                        case 1:
                                            _c = (_a = _b.apply("", [(_e.sent()).link, "/api/Orderapi/Get_Order_Info_orderno?orderno="]).concat(dd[0].cart_token, "&user_account=")).concat;
                                            return [4 /*yield*/, pay_now_1.config()];
                                        case 2:
                                            config = (_d.url = _c.apply(_a, [(_e.sent()).account, "&sno=1"]),
                                                _d.headers = { 'Content-Type': 'application/json' },
                                                _d);
                                            return [4 /*yield*/, (0, axios_1.default)(config)];
                                        case 3:
                                            link_response = _e.sent();
                                            return [4 /*yield*/, updateShipmentNumber(link_response.data.LogisticNumber)];
                                        case 4:
                                            _e.sent();
                                            return [2 /*return*/, link_response.data.LogisticNumber];
                                    }
                                });
                            }); }))];
                    case 4:
                        log_number = _l.sent();
                        carData_1 = cart[0][0].orderData;
                        return [4 /*yield*/, new user_js_1.User(this.appName).getConfigV2({
                                key: "shipment_config_".concat(carData_1.user_info.shipment),
                                user_id: 'manager',
                            })];
                    case 5:
                        shipment_config_1 = _l.sent();
                        if (!shipment_config_1.bulk) return [3 /*break*/, 10];
                        return [4 /*yield*/, pay_now_1.config()];
                    case 6:
                        conf = _l.sent();
                        _f = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: "".concat(conf.link, "/api/").concat((function () {
                                switch (carData_1.user_info.shipment) {
                                    case 'UNIMARTC2C':
                                        return 'Bulk711Order/ShipBulk711paymentno';
                                    case 'FAMIC2C':
                                        return "FamiB2COrder/ShipFamiB2Cpaymentno";
                                    case 'UNIMARTFREEZE':
                                        return '711FreezingB2C/Ship711B2Cpaymentno';
                                    case 'FAMIC2CFREEZE':
                                        return '711FreezingB2C/Ship711B2Cpaymentno';
                                }
                                return "";
                            })()),
                            headers: { 'Content-Type': 'application/json' }
                        };
                        _g = {};
                        _b = (_a = pay_now_1).encrypt;
                        _d = (_c = JSON).stringify;
                        _h = {
                            user_account: conf.account,
                            apicode: conf.pwd
                        };
                        return [4 /*yield*/, pay_now_1.sha1Encrypt([conf.account, conf.pwd].join(''))];
                    case 7: return [4 /*yield*/, _b.apply(_a, [_d.apply(_c, [(_h.PassCode = _l.sent(),
                                    _h.ShipList = log_number.map(function (dd) {
                                        return {
                                            LogisticNumber: dd,
                                            sno: '1',
                                        };
                                    }),
                                    _h)])])];
                    case 8:
                        request_ = (_f.data = (_g.JsonOrder = _l.sent(),
                            _g),
                            _f);
                        return [4 /*yield*/, (0, axios_1.default)(request_)];
                    case 9:
                        link_response_1 = _l.sent();
                        console.log("request.url_=>", request_.url);
                        console.log("link_response_=>", link_response_1);
                        _l.label = 10;
                    case 10: return [4 /*yield*/, pay_now_1.config()];
                    case 11:
                        payNowAccount_1 = (_l.sent()).account;
                        _j = {
                            method: shipment_config_1.bulk ? 'post' : 'get',
                            maxBodyLength: Infinity
                        };
                        _e = "".concat;
                        return [4 /*yield*/, pay_now_1.config()];
                    case 12:
                        config = (_j.url = _e.apply("", [(_l.sent()).link, "/"]).concat((function () {
                            switch (carData_1.user_info.shipment) {
                                case 'UNIMARTC2C':
                                    if (shipment_config_1.bulk) {
                                        return "Member/Order/Print711bulkLabel";
                                    }
                                    return 'api/Order711';
                                case 'FAMIC2C':
                                    if (shipment_config_1.bulk) {
                                        return "Member/Order/PrintFamiB2CLabel";
                                    }
                                    return 'api/OrderFamiC2C';
                                case 'HILIFEC2C':
                                    return 'api/OrderHiLife';
                                case 'OKMARTC2C':
                                    return 'api/OKC2C';
                                case 'UNIMARTFREEZE':
                                    if (shipment_config_1.bulk) {
                                        return "Member/Order/Print711FreezingB2CLabel";
                                    }
                                    return 'Member/OrderEvent/Print711FreezingC2CLabel';
                                case 'FAMIC2CFREEZE':
                                    if (shipment_config_1.bulk) {
                                        return "Member/Order/PrintFamiFreezingB2CLabel";
                                    }
                                    return 'Member/Order/PrintFamiFreezingC2CLabel';
                            }
                            return "";
                        })()).concat((function () {
                            if (shipment_config_1.bulk) {
                                return "";
                            }
                            else {
                                return "?orderNumberStr=".concat(obj.cart_token, "&user_account=").concat(payNowAccount_1);
                            }
                        })()),
                            _j.headers = { 'Content-Type': 'application/json' },
                            _j);
                        if (shipment_config_1.bulk) {
                            config.data = {
                                LogisticNumbers: log_number
                                    .map(function (dd) {
                                    return "".concat(dd, "_1");
                                })
                                    .join(','),
                            };
                        }
                        return [4 /*yield*/, (0, axios_1.default)(config)];
                    case 13:
                        link_response = _l.sent();
                        link = link_response.data;
                        if (error_text_1) {
                            return [2 /*return*/, {
                                    result: false,
                                    message: error_text_1,
                                }];
                        }
                        if (shipment_config_1.bulk) {
                            key_1 = tool_js_1.default.randomString(10);
                            paynow_logistics_js_1.PayNowLogistics.printStack.push({
                                code: key_1,
                                html: link,
                            });
                            //5分鐘連結失效
                            setTimeout(function () {
                                paynow_logistics_js_1.PayNowLogistics.printStack = paynow_logistics_js_1.PayNowLogistics.printStack.filter(function (dd) { return dd.code !== key_1; });
                            }, 60 * 1000 * 5);
                            return [2 /*return*/, {
                                    result: true,
                                    link: "".concat(process_1.default.env.DOMAIN, "/api-public/v1/delivery/print-delivery?code=").concat(key_1, "&g-app=").concat(this.appName),
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    result: true,
                                    link: link.replace('S,', ''),
                                }];
                        }
                        return [3 /*break*/, 22];
                    case 14:
                        if (!("".concat(deliveryConfig.value.ec_pay.toggle) === 'true')) return [3 /*break*/, 22];
                        id = cart[0][0].id;
                        carData_2 = cart[0][0].orderData;
                        carData_2.deliveryData = (_k = carData_2.deliveryData) !== null && _k !== void 0 ? _k : {};
                        random_id = '';
                        if (!(carData_2.deliveryData[keyData_1.Action] === undefined)) return [3 /*break*/, 20];
                        console.log("\u7DA0\u754C\u7269\u6D41\u55AE \u958B\u59CB\u5EFA\u7ACB\uFF08\u4F7F\u7528".concat(keyData_1.Action === 'main' ? '正式' : '測試', "\u74B0\u5883\uFF09"));
                        console.log("carData.user_info.LogisticsSubType==>", carData_2.user_info.shipment);
                        if (!['FAMIC2C', 'UNIMARTC2C', 'HILIFEC2C', 'OKMARTC2C', 'UNIMARTFREEZE'].includes(carData_2.user_info.shipment)) return [3 /*break*/, 16];
                        delivery_cf = {
                            LogisticsType: 'CVS',
                            LogisticsSubType: carData_2.user_info.shipment,
                            GoodsAmount: carData_2.total,
                            CollectionAmount: carData_2.user_info.shipment === 'UNIMARTC2C' ? carData_2.total : undefined,
                            IsCollection: carData_2.customer_info.payment_select === 'cash_on_delivery' ? 'Y' : 'N',
                            GoodsName: "\u8A02\u55AE\u7DE8\u865F ".concat(carData_2.orderID),
                            ReceiverName: carData_2.user_info.name,
                            ReceiverCellPhone: carData_2.user_info.phone,
                            ReceiverStoreID: keyData_1.Action === 'main'
                                ? carData_2.user_info.CVSStoreID // 正式門市
                                : (function () {
                                    // 測試門市（萊爾富不開放測試）
                                    if (carData_2.user_info.shipment === 'OKMARTC2C') {
                                        return '1328'; // OK超商
                                    }
                                    if (carData_2.user_info.shipment === 'FAMIC2C') {
                                        return '006598'; // 全家
                                    }
                                    if (carData_2.user_info.shipment === 'UNIMARTFREEZE') {
                                        return "896539";
                                    }
                                    return '131386'; // 7-11
                                })(),
                        };
                        return [4 /*yield*/, this.postStoreOrder(delivery_cf)];
                    case 15:
                        delivery = _l.sent();
                        if (delivery.result) {
                            carData_2.deliveryData[keyData_1.Action] = delivery.data;
                        }
                        else {
                            return [2 /*return*/, {
                                    result: false,
                                    message: "\u5EFA\u7ACB\u932F\u8AA4: ".concat(delivery.message),
                                }];
                        }
                        _l.label = 16;
                    case 16:
                        if (!['normal', 'black_cat', 'black_cat_ice', 'black_cat_freezing'].includes(carData_2.user_info.shipment)) return [3 /*break*/, 20];
                        return [4 /*yield*/, shoppingClass_1.getPostAddressData(carData_2.user_info.address)];
                    case 17:
                        receiverPostData = _l.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                setTimeout(function () {
                                    resolve(shoppingClass_1.getPostAddressData(keyData_1.SenderAddress));
                                }, 2000);
                            })];
                    case 18:
                        senderPostData = _l.sent();
                        goodsWeight_1 = 0;
                        carData_2.lineItems.map(function (item) {
                            if (item.shipment_obj.type === 'weight') {
                                goodsWeight_1 += item.shipment_obj.value;
                            }
                        });
                        delivery_cf = {
                            LogisticsType: 'HOME',
                            LogisticsSubType: carData_2.user_info.shipment === 'normal' ? 'POST' : 'TCAT',
                            GoodsAmount: carData_2.total,
                            GoodsName: "\u8A02\u55AE\u7DE8\u865F ".concat(carData_2.orderID),
                            GoodsWeight: carData_2.user_info.shipment === 'normal' ? goodsWeight_1 : undefined,
                            ReceiverName: carData_2.user_info.name,
                            ReceiverCellPhone: carData_2.user_info.phone,
                            ReceiverZipCode: receiverPostData.zipcode6 || receiverPostData.zipcode,
                            ReceiverAddress: carData_2.user_info.address,
                            SenderZipCode: senderPostData.zipcode6 || senderPostData.zipcode,
                            SenderAddress: keyData_1.SenderAddress,
                            Temperature: (function () {
                                switch (carData_2.user_info.shipment) {
                                    case 'black_cat_ice':
                                        return '0002';
                                    case 'black_cat_freezing':
                                        return '0003';
                                    default:
                                        return '0001';
                                }
                            })(),
                        };
                        return [4 /*yield*/, this.postStoreOrder(delivery_cf)];
                    case 19:
                        delivery = _l.sent();
                        if (delivery.result) {
                            carData_2.deliveryData[keyData_1.Action] = delivery.data;
                            console.info('綠界物流單 郵政/黑貓 建立成功');
                        }
                        else {
                            console.error("\u7DA0\u754C\u7269\u6D41\u55AE \u90F5\u653F/\u9ED1\u8C93 \u5EFA\u7ACB\u932F\u8AA4: ".concat(delivery.message));
                            return [2 /*return*/, {
                                    result: false,
                                    message: "\u5EFA\u7ACB\u932F\u8AA4: ".concat(delivery.message),
                                }];
                        }
                        _l.label = 20;
                    case 20: return [4 /*yield*/, this.generatorDeliveryId(id, carData_2, keyData_1)];
                    case 21:
                        random_id = _l.sent();
                        if (!random_id) {
                            return [2 /*return*/, {
                                    result: false,
                                    message: '尚未啟用物流追蹤功能',
                                }];
                        }
                        _l.label = 22;
                    case 22: return [2 /*return*/, {
                            result: false,
                            message: '尚未啟用物流追蹤功能',
                        }];
                    case 23:
                        e_1 = _l.sent();
                        console.error("error-", e_1);
                        return [2 /*return*/, {
                                result: false,
                                message: '尚未開啟物流追蹤設定',
                            }];
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    Delivery.removeUndefined = function (originParams) {
        var params = Object.fromEntries(Object.entries(originParams).filter(function (_a) {
            var _ = _a[0], value = _a[1];
            return value !== undefined;
        }));
        return params;
    };
    Delivery.prototype.notify = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var getNotification, notification, ecpayResult, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n         FROM `".concat(this.appName, "`.public_config\n         WHERE `key` = \"ecpay_delivery_notify\";\n        "), [])];
                    case 1:
                        getNotification = _a.sent();
                        json.token && delete json.token;
                        notification = getNotification[0];
                        if (!notification) return [3 /*break*/, 3];
                        notification.value.push(json);
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.appName, "`.public_config\n           SET ?\n           WHERE `key` = \"ecpay_delivery_notify\";\n          "), [
                                {
                                    value: JSON.stringify(notification.value),
                                    updated_at: new Date(),
                                },
                            ])];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, database_js_1.default.query("INSERT INTO `".concat(this.appName, "`.public_config\n           SET ?;\n          "), [
                            {
                                key: 'ecpay_delivery_notify',
                                value: JSON.stringify([json]),
                                updated_at: new Date(),
                            },
                        ])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        ecpayResult = new EcPay(this.appName).notifyOrder(json);
                        return [2 /*return*/, ecpayResult];
                    case 6:
                        error_2 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Delivery notify error:' + error_2, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return Delivery;
}());
exports.Delivery = Delivery;
var templateObject_1, templateObject_2, templateObject_3;

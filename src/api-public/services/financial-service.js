"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.JKO = exports.PayNow = exports.LinePay = exports.PayPal = exports.EcPay = exports.EzPay = void 0;
var crypto_1 = require("crypto");
var database_js_1 = require("../../modules/database.js");
var moment_timezone_1 = require("moment-timezone");
var axios_1 = require("axios");
var redis_1 = require("../../modules/redis");
var process_1 = require("process");
var order_event_js_1 = require("./order-event.js");
var private_config_js_1 = require("../../services/private_config.js");
var html = String.raw;
var FinancialService = /** @class */ (function () {
    function FinancialService(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
    }
    FinancialService.aesEncrypt = function (data, key, iv, input, output, method) {
        if (input === void 0) { input = 'utf-8'; }
        if (output === void 0) { output = 'hex'; }
        if (method === void 0) { method = 'aes-256-cbc'; }
        while (key.length % 32 !== 0) {
            key += '\0';
        }
        while (iv.length % 16 !== 0) {
            iv += '\0';
        }
        var cipher = crypto_1.default.createCipheriv(method, key, iv);
        var encrypted = cipher.update(data, input, output);
        encrypted += cipher.final(output);
        return encrypted;
    };
    FinancialService.JsonToQueryString = function (data) {
        var queryString = Object.keys(data)
            .map(function (key) {
            var value = data[key];
            if (Array.isArray(value)) {
                return value.map(function (v) { return "".concat(encodeURIComponent(key), "[]=").concat(encodeURIComponent(v)); }).join('&');
            }
            return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value));
        })
            .join('&');
        return queryString;
    };
    FinancialService.prototype.createOrderPage = function (orderData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.log("orderData -- " , orderData);
                        orderData.method = orderData.method || 'ALL';
                        if (!(this.keyData.TYPE === 'newWebPay')) return [3 /*break*/, 2];
                        return [4 /*yield*/, new EzPay(this.appName, this.keyData).createOrderPage(orderData)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!(this.keyData.TYPE === 'ecPay')) return [3 /*break*/, 4];
                        return [4 /*yield*/, new EcPay(this.appName, this.keyData).createOrderPage(orderData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FinancialService.prototype.saveWallet = function (orderData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.keyData.TYPE === 'newWebPay')) return [3 /*break*/, 2];
                        return [4 /*yield*/, new EzPay(this.appName, this.keyData).saveMoney(orderData)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!(this.keyData.TYPE === 'ecPay')) return [3 /*break*/, 4];
                        return [4 /*yield*/, new EcPay(this.appName).saveMoney(orderData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/, ''];
                }
            });
        });
    };
    return FinancialService;
}());
exports.default = FinancialService;
// 藍新金流
var EzPay = /** @class */ (function () {
    function EzPay(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
    }
    EzPay.prototype.decode = function (data) {
        return EzPay.aesDecrypt(data, this.keyData.HASH_KEY, this.keyData.HASH_IV);
    };
    EzPay.prototype.createOrderPage = function (orderData) {
        return __awaiter(this, void 0, void 0, function () {
            var params, qs, tradeInfo, tradeSha;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            MerchantID: this.keyData.MERCHANT_ID,
                            RespondType: 'JSON',
                            TimeStamp: Math.floor(Date.now() / 1000),
                            Version: '2.0',
                            MerchantOrderNo: orderData.orderID,
                            Amt: orderData.total - orderData.use_wallet,
                            ItemDesc: '商品資訊',
                            NotifyURL: this.keyData.NotifyURL,
                            ReturnURL: this.keyData.ReturnURL,
                            TradeLimit: 600,
                        };
                        if (orderData.method && orderData.method !== 'ALL') {
                            [
                                {
                                    value: 'credit',
                                    title: '信用卡',
                                    realKey: 'CREDIT',
                                },
                                {
                                    value: 'atm',
                                    title: 'ATM',
                                    realKey: 'VACC',
                                },
                                {
                                    value: 'web_atm',
                                    title: '網路ATM',
                                    realKey: 'WEBATM',
                                },
                                {
                                    value: 'c_code',
                                    title: '超商代碼',
                                    realKey: 'CVS',
                                },
                                {
                                    value: 'c_bar_code',
                                    title: '超商條碼',
                                    realKey: 'BARCODE',
                                },
                            ].map(function (dd) {
                                if (dd.value === orderData.method) {
                                    params[dd.realKey] = 1;
                                }
                                else {
                                    params[dd.realKey] = 0;
                                }
                            });
                        }
                        return [4 /*yield*/, order_event_js_1.OrderEvent.insertOrder({
                                cartData: orderData,
                                status: 0,
                                app: this.appName,
                            })];
                    case 1:
                        _a.sent();
                        qs = FinancialService.JsonToQueryString(params);
                        tradeInfo = FinancialService.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);
                        tradeSha = crypto_1.default
                            .createHash('sha256')
                            .update("HashKey=".concat(this.keyData.HASH_KEY, "&").concat(tradeInfo, "&HashIV=").concat(this.keyData.HASH_IV))
                            .digest('hex')
                            .toUpperCase();
                        // 5. 回傳物件
                        return [2 /*return*/, html(templateObject_1 || (templateObject_1 = __makeTemplateObject([" <form name=\"Newebpay\" action=\"", "\" method=\"POST\" class=\"payment\">\n      <input type=\"hidden\" name=\"MerchantID\" value=\"", "\" />\n      <input type=\"hidden\" name=\"TradeInfo\" value=\"", "\" />\n      <input type=\"hidden\" name=\"TradeSha\" value=\"", "\" />\n      <input type=\"hidden\" name=\"Version\" value=\"", "\" />\n      <input type=\"hidden\" name=\"MerchantOrderNo\" value=\"", "\" />\n      <button type=\"submit\" class=\"btn btn-secondary custom-btn beside-btn\" id=\"submit\" hidden></button>\n    </form>"], [" <form name=\"Newebpay\" action=\"", "\" method=\"POST\" class=\"payment\">\n      <input type=\"hidden\" name=\"MerchantID\" value=\"", "\" />\n      <input type=\"hidden\" name=\"TradeInfo\" value=\"", "\" />\n      <input type=\"hidden\" name=\"TradeSha\" value=\"", "\" />\n      <input type=\"hidden\" name=\"Version\" value=\"", "\" />\n      <input type=\"hidden\" name=\"MerchantOrderNo\" value=\"", "\" />\n      <button type=\"submit\" class=\"btn btn-secondary custom-btn beside-btn\" id=\"submit\" hidden></button>\n    </form>"])), this.keyData.ActionURL, this.keyData.MERCHANT_ID, tradeInfo, tradeSha, params.Version, params.MerchantOrderNo)];
                }
            });
        });
    };
    EzPay.prototype.saveMoney = function (orderData) {
        return __awaiter(this, void 0, void 0, function () {
            var params, appName, qs, tradeInfo, tradeSha, subMitData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            MerchantID: this.keyData.MERCHANT_ID,
                            RespondType: 'JSON',
                            TimeStamp: Math.floor(Date.now() / 1000),
                            Version: '2.0',
                            MerchantOrderNo: new Date().getTime(),
                            Amt: orderData.total,
                            ItemDesc: orderData.title,
                            NotifyURL: this.keyData.NotifyURL,
                            ReturnURL: this.keyData.ReturnURL,
                        };
                        appName = this.appName;
                        return [4 /*yield*/, database_js_1.default.execute("INSERT INTO `".concat(appName, "`.").concat(orderData.table, " (orderID, userID, money, status, note)\n       VALUES (?, ?, ?, ?, ?)\n      "), [params.MerchantOrderNo, orderData.userID, orderData.total * orderData.ratio, 0, orderData.note])];
                    case 1:
                        _a.sent();
                        qs = FinancialService.JsonToQueryString(params);
                        tradeInfo = FinancialService.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);
                        tradeSha = crypto_1.default
                            .createHash('sha256')
                            .update("HashKey=".concat(this.keyData.HASH_KEY, "&").concat(tradeInfo, "&HashIV=").concat(this.keyData.HASH_IV))
                            .digest('hex')
                            .toUpperCase();
                        subMitData = {
                            actionURL: this.keyData.ActionURL,
                            MerchantOrderNo: params.MerchantOrderNo,
                            MerchantID: this.keyData.MERCHANT_ID,
                            TradeInfo: tradeInfo,
                            TradeSha: tradeSha,
                            Version: params.Version,
                        };
                        // 5. 回傳物件
                        return [2 /*return*/, html(templateObject_2 || (templateObject_2 = __makeTemplateObject([" <form name=\"Newebpay\" action=\"", "\" method=\"POST\" class=\"payment\">\n      <input type=\"hidden\" name=\"MerchantID\" value=\"", "\" />\n      <input type=\"hidden\" name=\"TradeInfo\" value=\"", "\" />\n      <input type=\"hidden\" name=\"TradeSha\" value=\"", "\" />\n      <input type=\"hidden\" name=\"Version\" value=\"", "\" />\n      <input type=\"hidden\" name=\"MerchantOrderNo\" value=\"", "\" />\n      <button type=\"submit\" class=\"btn btn-secondary custom-btn beside-btn\" id=\"submit\" hidden></button>\n    </form>"], [" <form name=\"Newebpay\" action=\"", "\" method=\"POST\" class=\"payment\">\n      <input type=\"hidden\" name=\"MerchantID\" value=\"", "\" />\n      <input type=\"hidden\" name=\"TradeInfo\" value=\"", "\" />\n      <input type=\"hidden\" name=\"TradeSha\" value=\"", "\" />\n      <input type=\"hidden\" name=\"Version\" value=\"", "\" />\n      <input type=\"hidden\" name=\"MerchantOrderNo\" value=\"", "\" />\n      <button type=\"submit\" class=\"btn btn-secondary custom-btn beside-btn\" id=\"submit\" hidden></button>\n    </form>"])), subMitData.actionURL, subMitData.MerchantID, subMitData.TradeInfo, subMitData.TradeSha, subMitData.Version, subMitData.MerchantOrderNo)];
                }
            });
        });
    };
    EzPay.aesDecrypt = function (data, key, iv, input, output, method) {
        if (input === void 0) { input = 'hex'; }
        if (output === void 0) { output = 'utf-8'; }
        if (method === void 0) { method = 'aes-256-cbc'; }
        while (key.length % 32 !== 0) {
            key += '\0';
        }
        while (iv.length % 16 !== 0) {
            iv += '\0';
        }
        var decipher = crypto_1.default.createDecipheriv(method, key, iv);
        var decrypted = decipher.update(data, input, output);
        try {
            decrypted += decipher.final(output);
        }
        catch (e) {
            e instanceof Error && console.error(e.message);
        }
        return decrypted;
    };
    return EzPay;
}());
exports.EzPay = EzPay;
// 綠界金流
var EcPay = /** @class */ (function () {
    function EcPay(appName, keyData) {
        this.appName = appName;
        this.keyData = keyData;
    }
    EcPay.prototype.key_initial = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keyData, kd;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                            appName: this.appName,
                            key: 'glitter_finance',
                        })];
                    case 1:
                        keyData = (_b.sent())[0].value;
                        kd = (_a = keyData['ecPay']) !== null && _a !== void 0 ? _a : {
                            ReturnURL: '',
                            NotifyURL: '',
                        };
                        this.keyData = kd;
                        return [2 /*return*/];
                }
            });
        });
    };
    EcPay.generateCheckMacValue = function (params, HashKey, HashIV) {
        // 步驟 1：依參數名稱排序並串接
        var sortedQueryString = Object.keys(params)
            .sort() // 按英文字母順序排序
            .map(function (key) { return "".concat(key, "=").concat(params[key]); }) // 串接成 key=value 形式
            .join('&');
        // 步驟 2：加上 HashKey 和 HashIV
        var rawString = "HashKey=".concat(HashKey, "&").concat(sortedQueryString, "&HashIV=").concat(HashIV);
        // 步驟 3：URL Encode (RFC 1866)
        var encodedString = encodeURIComponent(rawString)
            .replace(/%2d/g, '-')
            .replace(/%5f/g, '_')
            .replace(/%2e/g, '.')
            .replace(/%21/g, '!')
            .replace(/%2a/g, '*')
            .replace(/%28/g, '(')
            .replace(/%29/g, ')')
            .replace(/%20/g, '+');
        // 步驟 4：轉為小寫
        var lowerCaseString = encodedString.toLowerCase();
        // 步驟 5：使用 SHA256 進行雜湊
        var sha256Hash = crypto_1.default.createHash('sha256').update(lowerCaseString).digest('hex');
        // 步驟 6：轉大寫產生 CheckMacValue
        return sha256Hash.toUpperCase();
    };
    EcPay.prototype.createOrderPage = function (orderData) {
        return __awaiter(this, void 0, void 0, function () {
            var params, chkSum;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            MerchantTradeNo: orderData.orderID,
                            MerchantTradeDate: (0, moment_timezone_1.default)().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
                            TotalAmount: orderData.total - orderData.use_wallet,
                            TradeDesc: '商品資訊',
                            ItemName: orderData.lineItems
                                .map(function (dd) {
                                return dd.title + (dd.spec.join('-') && '-' + dd.spec.join('-'));
                            })
                                .join('#'),
                            ReturnURL: this.keyData.NotifyURL,
                            ChoosePayment: orderData.method && orderData.method !== 'ALL'
                                ? (function () {
                                    var find = [
                                        {
                                            value: 'credit',
                                            title: '信用卡',
                                            realKey: 'Credit',
                                        },
                                        {
                                            value: 'atm',
                                            title: 'ATM',
                                            realKey: 'ATM',
                                        },
                                        {
                                            value: 'web_atm',
                                            title: '網路ATM',
                                            realKey: 'WebATM',
                                        },
                                        {
                                            value: 'c_code',
                                            title: '超商代碼',
                                            realKey: 'CVS',
                                        },
                                        {
                                            value: 'c_bar_code',
                                            title: '超商條碼',
                                            realKey: 'BARCODE',
                                        },
                                    ].find(function (dd) {
                                        return dd.value === orderData.method;
                                    });
                                    return find && find.realKey;
                                })()
                                : 'ALL',
                            PlatformID: '',
                            MerchantID: this.keyData.MERCHANT_ID,
                            InvoiceMark: 'N',
                            IgnorePayment: '',
                            DeviceSource: '',
                            EncryptType: '1',
                            PaymentType: 'aio',
                            OrderResultURL: this.keyData.ReturnURL,
                            NeedExtraPaidInfo: 'Y',
                        };
                        chkSum = EcPay.generateCheckMacValue(params, this.keyData.HASH_KEY, this.keyData.HASH_IV);
                        orderData.CheckMacValue = chkSum;
                        return [4 /*yield*/, order_event_js_1.OrderEvent.insertOrder({
                                cartData: orderData,
                                status: 0,
                                app: this.appName,
                            })];
                    case 1:
                        _a.sent();
                        console.log("params-is=>", params);
                        // 5. 回傳物件
                        return [2 /*return*/, html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      <form id=\"_form_aiochk\" action=\"", "\" method=\"post\">\n        <input type=\"hidden\" name=\"MerchantTradeNo\" id=\"MerchantTradeNo\" value=\"", "\" />\n        <input type=\"hidden\" name=\"MerchantTradeDate\" id=\"MerchantTradeDate\" value=\"", "\" />\n        <input type=\"hidden\" name=\"TotalAmount\" id=\"TotalAmount\" value=\"", "\" />\n        <input type=\"hidden\" name=\"TradeDesc\" id=\"TradeDesc\" value=\"", "\" />\n        <input type=\"hidden\" name=\"ItemName\" id=\"ItemName\" value=\"", "\" />\n        <input type=\"hidden\" name=\"ReturnURL\" id=\"ReturnURL\" value=\"", "\" />\n        <input type=\"hidden\" name=\"ChoosePayment\" id=\"ChoosePayment\" value=\"", "\" />\n        <input type=\"hidden\" name=\"PlatformID\" id=\"PlatformID\" value=\"", "\" />\n        <input type=\"hidden\" name=\"MerchantID\" id=\"MerchantID\" value=\"", "\" />\n        <input type=\"hidden\" name=\"InvoiceMark\" id=\"InvoiceMark\" value=\"", "\" />\n        <input type=\"hidden\" name=\"IgnorePayment\" id=\"IgnorePayment\" value=\"", "\" />\n        <input type=\"hidden\" name=\"DeviceSource\" id=\"DeviceSource\" value=\"", "\" />\n        <input type=\"hidden\" name=\"EncryptType\" id=\"EncryptType\" value=\"", "\" />\n        <input type=\"hidden\" name=\"PaymentType\" id=\"PaymentType\" value=\"", "\" />\n        <input type=\"hidden\" name=\"OrderResultURL\" id=\"OrderResultURL\" value=\"", "\" />\n        <input type=\"hidden\" name=\"NeedExtraPaidInfo\" id=\"NeedExtraPaidInfo\" value=\"", "\" />\n        <input type=\"hidden\" name=\"CheckMacValue\" id=\"CheckMacValue\" value=\"", "\" />\n        <button type=\"submit\" class=\"btn btn-secondary custom-btn beside-btn d-none\" id=\"submit\" hidden></button>\n      </form>\n    "], ["\n      <form id=\"_form_aiochk\" action=\"", "\" method=\"post\">\n        <input type=\"hidden\" name=\"MerchantTradeNo\" id=\"MerchantTradeNo\" value=\"", "\" />\n        <input type=\"hidden\" name=\"MerchantTradeDate\" id=\"MerchantTradeDate\" value=\"", "\" />\n        <input type=\"hidden\" name=\"TotalAmount\" id=\"TotalAmount\" value=\"", "\" />\n        <input type=\"hidden\" name=\"TradeDesc\" id=\"TradeDesc\" value=\"", "\" />\n        <input type=\"hidden\" name=\"ItemName\" id=\"ItemName\" value=\"", "\" />\n        <input type=\"hidden\" name=\"ReturnURL\" id=\"ReturnURL\" value=\"", "\" />\n        <input type=\"hidden\" name=\"ChoosePayment\" id=\"ChoosePayment\" value=\"", "\" />\n        <input type=\"hidden\" name=\"PlatformID\" id=\"PlatformID\" value=\"", "\" />\n        <input type=\"hidden\" name=\"MerchantID\" id=\"MerchantID\" value=\"", "\" />\n        <input type=\"hidden\" name=\"InvoiceMark\" id=\"InvoiceMark\" value=\"", "\" />\n        <input type=\"hidden\" name=\"IgnorePayment\" id=\"IgnorePayment\" value=\"", "\" />\n        <input type=\"hidden\" name=\"DeviceSource\" id=\"DeviceSource\" value=\"", "\" />\n        <input type=\"hidden\" name=\"EncryptType\" id=\"EncryptType\" value=\"", "\" />\n        <input type=\"hidden\" name=\"PaymentType\" id=\"PaymentType\" value=\"", "\" />\n        <input type=\"hidden\" name=\"OrderResultURL\" id=\"OrderResultURL\" value=\"", "\" />\n        <input type=\"hidden\" name=\"NeedExtraPaidInfo\" id=\"NeedExtraPaidInfo\" value=\"", "\" />\n        <input type=\"hidden\" name=\"CheckMacValue\" id=\"CheckMacValue\" value=\"", "\" />\n        <button type=\"submit\" class=\"btn btn-secondary custom-btn beside-btn d-none\" id=\"submit\" hidden></button>\n      </form>\n    "])), this.keyData.ActionURL, params.MerchantTradeNo, params.MerchantTradeDate, params.TotalAmount, params.TradeDesc, params.ItemName, params.ReturnURL, params.ChoosePayment, params.PlatformID, params.MerchantID, params.InvoiceMark, params.IgnorePayment, params.DeviceSource, params.EncryptType, params.PaymentType, params.OrderResultURL, params.NeedExtraPaidInfo, chkSum)];
                }
            });
        });
    };
    EcPay.prototype.checkCreditInfo = function (CreditRefundId, CreditAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var params, chkSum, config;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.key_initial()];
                    case 1:
                        _a.sent();
                        params = {
                            CreditRefundId: "".concat(CreditRefundId),
                            CreditAmount: CreditAmount,
                            MerchantID: this.keyData.MERCHANT_ID,
                            CreditCheckCode: this.keyData.CreditCheckCode,
                        };
                        chkSum = EcPay.generateCheckMacValue(params, this.keyData.HASH_KEY, this.keyData.HASH_IV);
                        params.CheckMacValue = chkSum;
                        config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: "https://payment.ecpay.com.tw/CreditDetail/QueryTrade/V2",
                            headers: {},
                            'Content-Type': 'application/x-www-form-urlencoded',
                            data: new URLSearchParams(params).toString(),
                        };
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                axios_1.default
                                    .request(config)
                                    .then(function (response) {
                                    resolve(response.data.RtnValue);
                                })
                                    .catch(function (error) {
                                    console.log(error);
                                    resolve({});
                                });
                            })];
                    case 2: 
                    //發送通知
                    //PlatformID
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EcPay.prototype.checkPaymentStatus = function (orderID) {
        return __awaiter(this, void 0, void 0, function () {
            var params, chkSum, config;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.key_initial()];
                    case 1:
                        _a.sent();
                        params = {
                            MerchantTradeNo: "".concat(orderID),
                            TimeStamp: Math.floor(Date.now() / 1000),
                            MerchantID: this.keyData.MERCHANT_ID,
                        };
                        chkSum = EcPay.generateCheckMacValue(params, this.keyData.HASH_KEY, this.keyData.HASH_IV);
                        params.CheckMacValue = chkSum;
                        config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: EcPay.beta === this.keyData.ActionURL
                                ? 'https://payment-stage.ecpay.com.tw/Cashier/QueryTradeInfo/V5'
                                : 'https://payment.ecpay.com.tw/Cashier/QueryTradeInfo/V5',
                            headers: {},
                            'Content-Type': 'application/x-www-form-urlencoded',
                            data: new URLSearchParams(params).toString(),
                        };
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                axios_1.default
                                    .request(config)
                                    .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                    var params, paramsObject, _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                params = new URLSearchParams(response.data);
                                                paramsObject = {};
                                                params.forEach(function (value, key) {
                                                    // 將每組 key 和 value 加入對象中
                                                    paramsObject[key] = value;
                                                });
                                                if (!(paramsObject.gwsr && this.keyData.CreditCheckCode && EcPay.beta !== this.keyData.ActionURL)) return [3 /*break*/, 2];
                                                _a = paramsObject;
                                                return [4 /*yield*/, this.checkCreditInfo(paramsObject.gwsr, paramsObject.TradeAmt)];
                                            case 1:
                                                _a.credit_receipt = _b.sent();
                                                if (paramsObject.credit_receipt.status !== '已授權') {
                                                    paramsObject.TradeStatus = '10200095';
                                                }
                                                _b.label = 2;
                                            case 2:
                                                resolve(paramsObject);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })
                                    .catch(function (error) {
                                    console.log(error);
                                    resolve({
                                        TradeStatus: '10200095',
                                    });
                                });
                            })];
                    case 2: 
                    //發送通知
                    //PlatformID
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EcPay.prototype.brushBack = function (orderID, tradNo, total) {
        return __awaiter(this, void 0, void 0, function () {
            var params, chkSum, config;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.key_initial()];
                    case 1:
                        _a.sent();
                        params = {
                            MerchantTradeNo: "".concat(orderID),
                            TradeNo: tradNo,
                            Action: 'N',
                            TotalAmount: parseInt(total, 10),
                            MerchantID: this.keyData.MERCHANT_ID,
                        };
                        chkSum = EcPay.generateCheckMacValue(params, this.keyData.HASH_KEY, this.keyData.HASH_IV);
                        params.CheckMacValue = chkSum;
                        config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: "https://payment.ecpay.com.tw/CreditDetail/DoAction",
                            headers: {},
                            'Content-Type': 'application/x-www-form-urlencoded',
                            data: new URLSearchParams(params).toString(),
                        };
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                axios_1.default
                                    .request(config)
                                    .then(function (response) {
                                    var params = new URLSearchParams(response.data);
                                    // 將 URLSearchParams 轉換成對象
                                    var paramsObject = {};
                                    params.forEach(function (value, key) {
                                        // 將每組 key 和 value 加入對象中
                                        paramsObject[key] = value;
                                    });
                                    // 將對象轉換為 JSON
                                    resolve(paramsObject);
                                })
                                    .catch(function (error) {
                                    console.log(error);
                                    resolve({
                                        RtnCode: "-1",
                                    });
                                });
                            })];
                    case 2: 
                    //發送通知
                    //PlatformID
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EcPay.prototype.saveMoney = function (orderData) {
        return __awaiter(this, void 0, void 0, function () {
            var params, chkSum;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.key_initial()];
                    case 1:
                        _a.sent();
                        params = {
                            MerchantTradeNo: new Date().getTime(),
                            MerchantTradeDate: (0, moment_timezone_1.default)().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
                            TotalAmount: orderData.total,
                            TradeDesc: '商品資訊',
                            ItemName: orderData.title,
                            ReturnURL: this.keyData.NotifyURL,
                            ChoosePayment: orderData.method && orderData.method !== 'ALL'
                                ? (function () {
                                    var find = [
                                        {
                                            value: 'credit',
                                            title: '信用卡',
                                            realKey: 'Credit',
                                        },
                                        {
                                            value: 'atm',
                                            title: 'ATM',
                                            realKey: 'ATM',
                                        },
                                        {
                                            value: 'web_atm',
                                            title: '網路ATM',
                                            realKey: 'WebATM',
                                        },
                                        {
                                            value: 'c_code',
                                            title: '超商代碼',
                                            realKey: 'CVS',
                                        },
                                        {
                                            value: 'c_bar_code',
                                            title: '超商條碼',
                                            realKey: 'BARCODE',
                                        },
                                    ].find(function (dd) {
                                        return dd.value === orderData.method;
                                    });
                                    return find && find.realKey;
                                })()
                                : 'ALL',
                            PlatformID: '',
                            MerchantID: this.keyData.MERCHANT_ID,
                            InvoiceMark: 'N',
                            IgnorePayment: '',
                            DeviceSource: '',
                            EncryptType: '1',
                            PaymentType: 'aio',
                            OrderResultURL: this.keyData.ReturnURL,
                        };
                        chkSum = EcPay.generateCheckMacValue(params, this.keyData.HASH_KEY, this.keyData.HASH_IV);
                        orderData.CheckMacValue = chkSum;
                        return [4 /*yield*/, database_js_1.default.execute("INSERT INTO `".concat(this.appName, "`.").concat(orderData.table, " (orderID, userID, money, status, note)\n       VALUES (?, ?, ?, ?, ?)\n      "), [params.MerchantTradeNo, orderData.userID, orderData.total * orderData.ratio, 0, orderData.note])];
                    case 2:
                        _a.sent();
                        // 5. 回傳物件
                        return [2 /*return*/, html(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      <form id=\"_form_aiochk\" action=\"", "\" method=\"post\">\n        <input type=\"hidden\" name=\"MerchantTradeNo\" id=\"MerchantTradeNo\" value=\"", "\" />\n        <input type=\"hidden\" name=\"MerchantTradeDate\" id=\"MerchantTradeDate\" value=\"", "\" />\n        <input type=\"hidden\" name=\"TotalAmount\" id=\"TotalAmount\" value=\"", "\" />\n        <input type=\"hidden\" name=\"TradeDesc\" id=\"TradeDesc\" value=\"", "\" />\n        <input type=\"hidden\" name=\"ItemName\" id=\"ItemName\" value=\"", "\" />\n        <input type=\"hidden\" name=\"ReturnURL\" id=\"ReturnURL\" value=\"", "\" />\n        <input type=\"hidden\" name=\"ChoosePayment\" id=\"ChoosePayment\" value=\"", "\" />\n        <input type=\"hidden\" name=\"PlatformID\" id=\"PlatformID\" value=\"", "\" />\n        <input type=\"hidden\" name=\"MerchantID\" id=\"MerchantID\" value=\"", "\" />\n        <input type=\"hidden\" name=\"InvoiceMark\" id=\"InvoiceMark\" value=\"", "\" />\n        <input type=\"hidden\" name=\"IgnorePayment\" id=\"IgnorePayment\" value=\"", "\" />\n        <input type=\"hidden\" name=\"DeviceSource\" id=\"DeviceSource\" value=\"", "\" />\n        <input type=\"hidden\" name=\"EncryptType\" id=\"EncryptType\" value=\"", "\" />\n        <input type=\"hidden\" name=\"PaymentType\" id=\"PaymentType\" value=\"", "\" />\n        <input type=\"hidden\" name=\"OrderResultURL\" id=\"OrderResultURL\" value=\"", "\" />\n        <input type=\"hidden\" name=\"CheckMacValue\" id=\"CheckMacValue\" value=\"", "\" />\n        <button type=\"submit\" class=\"btn btn-secondary custom-btn beside-btn d-none\" id=\"submit\" hidden></button>\n      </form>\n    "], ["\n      <form id=\"_form_aiochk\" action=\"", "\" method=\"post\">\n        <input type=\"hidden\" name=\"MerchantTradeNo\" id=\"MerchantTradeNo\" value=\"", "\" />\n        <input type=\"hidden\" name=\"MerchantTradeDate\" id=\"MerchantTradeDate\" value=\"", "\" />\n        <input type=\"hidden\" name=\"TotalAmount\" id=\"TotalAmount\" value=\"", "\" />\n        <input type=\"hidden\" name=\"TradeDesc\" id=\"TradeDesc\" value=\"", "\" />\n        <input type=\"hidden\" name=\"ItemName\" id=\"ItemName\" value=\"", "\" />\n        <input type=\"hidden\" name=\"ReturnURL\" id=\"ReturnURL\" value=\"", "\" />\n        <input type=\"hidden\" name=\"ChoosePayment\" id=\"ChoosePayment\" value=\"", "\" />\n        <input type=\"hidden\" name=\"PlatformID\" id=\"PlatformID\" value=\"", "\" />\n        <input type=\"hidden\" name=\"MerchantID\" id=\"MerchantID\" value=\"", "\" />\n        <input type=\"hidden\" name=\"InvoiceMark\" id=\"InvoiceMark\" value=\"", "\" />\n        <input type=\"hidden\" name=\"IgnorePayment\" id=\"IgnorePayment\" value=\"", "\" />\n        <input type=\"hidden\" name=\"DeviceSource\" id=\"DeviceSource\" value=\"", "\" />\n        <input type=\"hidden\" name=\"EncryptType\" id=\"EncryptType\" value=\"", "\" />\n        <input type=\"hidden\" name=\"PaymentType\" id=\"PaymentType\" value=\"", "\" />\n        <input type=\"hidden\" name=\"OrderResultURL\" id=\"OrderResultURL\" value=\"", "\" />\n        <input type=\"hidden\" name=\"CheckMacValue\" id=\"CheckMacValue\" value=\"", "\" />\n        <button type=\"submit\" class=\"btn btn-secondary custom-btn beside-btn d-none\" id=\"submit\" hidden></button>\n      </form>\n    "])), this.keyData.ActionURL, params.MerchantTradeNo, params.MerchantTradeDate, params.TotalAmount, params.TradeDesc, params.ItemName, params.ReturnURL, params.ChoosePayment, params.PlatformID, params.MerchantID, params.InvoiceMark, params.IgnorePayment, params.DeviceSource, params.EncryptType, params.PaymentType, params.OrderResultURL, chkSum)];
                }
            });
        });
    };
    EcPay.beta = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';
    return EcPay;
}());
exports.EcPay = EcPay;
// PayPal金流
var PayPal = /** @class */ (function () {
    function PayPal(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
        this.PAYPAL_CLIENT_ID = keyData.PAYPAL_CLIENT_ID; // 替換為您的 Client ID
        this.PAYPAL_SECRET = keyData.PAYPAL_SECRET; // 替換為您的 Secret Key
        this.PAYPAL_BASE_URL = keyData.BETA == 'true' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com'; // 沙箱環境
        // const PAYPAL_BASE_URL = "https://api-m.paypal.com"; // 正式環境
    }
    PayPal.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokenUrl, config, response, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        tokenUrl = "".concat(this.PAYPAL_BASE_URL, "/v1/oauth2/token");
                        config = {
                            method: 'POST',
                            url: tokenUrl,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            auth: {
                                username: this.PAYPAL_CLIENT_ID,
                                password: this.PAYPAL_SECRET,
                            },
                            data: new URLSearchParams({
                                grant_type: 'client_credentials',
                            }).toString(),
                        };
                        return [4 /*yield*/, axios_1.default.request(config)];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, response.data.access_token];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Error fetching access token:', ((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) || error_1.message);
                        throw new Error('Failed to retrieve PayPal access token.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PayPal.prototype.checkout = function (orderData) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, order;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getAccessToken()];
                    case 1:
                        accessToken = _b.sent();
                        return [4 /*yield*/, this.createOrderPage(accessToken, orderData)];
                    case 2:
                        order = _b.sent();
                        return [2 /*return*/, {
                                orderId: order.id,
                                approveLink: (_a = order.links.find(function (link) { return link.rel === 'approve'; })) === null || _a === void 0 ? void 0 : _a.href,
                            }];
                }
            });
        });
    };
    PayPal.prototype.createOrderPage = function (accessToken, orderData) {
        return __awaiter(this, void 0, void 0, function () {
            var createOrderUrl, itemPrice_1, config, response, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        createOrderUrl = "".concat(this.PAYPAL_BASE_URL, "/v2/checkout/orders");
                        itemPrice_1 = 0;
                        orderData.lineItems.forEach(function (item) {
                            itemPrice_1 += item.sale_price;
                        });
                        config = {
                            method: 'POST',
                            url: createOrderUrl,
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: "Bearer ".concat(accessToken),
                            },
                            data: {
                                intent: 'CAPTURE', // 訂單目標: CAPTURE (立即支付) 或 AUTHORIZE (授權後支付)
                                purchase_units: [
                                    {
                                        reference_id: orderData.orderID, // 訂單參考 ID，可自定義
                                        amount: {
                                            currency_code: 'TWD', // 貨幣
                                            value: itemPrice_1, // 總金額
                                            breakdown: {
                                                item_total: {
                                                    currency_code: 'TWD',
                                                    value: itemPrice_1,
                                                },
                                            },
                                        },
                                        items: orderData.lineItems.map(function (item) {
                                            var _a;
                                            return {
                                                name: item.title, // 商品名稱
                                                unit_amount: {
                                                    currency_code: 'TWD',
                                                    value: item.sale_price,
                                                },
                                                quantity: item.count, // 商品數量
                                                description: (_a = item.spec.join(',')) !== null && _a !== void 0 ? _a : '',
                                            };
                                        }),
                                    },
                                ],
                                application_context: {
                                    brand_name: this.appName, // 商店名稱
                                    landing_page: 'NO_PREFERENCE', // 登陸頁面類型
                                    user_action: 'PAY_NOW', // 用戶操作: PAY_NOW (立即支付)
                                    return_url: "".concat(this.keyData.ReturnURL, "&payment=true&appName=").concat(this.appName, "&orderID=").concat(orderData.orderID), // 成功返回 URL
                                    cancel_url: "".concat(this.keyData.ReturnURL, "&payment=false"), // 取消返回 URL
                                },
                            },
                        };
                        return [4 /*yield*/, axios_1.default.request(config)];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, order_event_js_1.OrderEvent.insertOrder({
                                cartData: orderData,
                                status: 0,
                                app: this.appName,
                            })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, redis_1.default.setValue('paypal' + orderData.orderID, response.data.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, response.data];
                    case 4:
                        error_2 = _b.sent();
                        console.error('Error creating order:', ((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) || error_2.message);
                        throw new Error('Failed to create PayPal order.');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PayPal.prototype.getOrderDetails = function (orderId, accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var url, axiosInstance, config, response, order, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = "/v2/checkout/orders/".concat(orderId);
                        axiosInstance = axios_1.default.create({
                            baseURL: this.PAYPAL_BASE_URL,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        config = {
                            method: 'GET',
                            url: url,
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                            },
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axiosInstance.request(config)];
                    case 2:
                        response = _b.sent();
                        order = response.data;
                        // 檢查訂單狀態是否為 APPROVED
                        if (order.status === 'APPROVED') {
                            return [2 /*return*/, order];
                        }
                        else {
                            throw new Error("Order status is not APPROVED. Current status: ".concat(order.status));
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        console.error('Error fetching order details:', ((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) || error_3.message);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PayPal.prototype.capturePayment = function (orderId, accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var url, axiosInstance, config, response, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = "/v2/checkout/orders/".concat(orderId, "/capture");
                        axiosInstance = axios_1.default.create({
                            baseURL: this.PAYPAL_BASE_URL,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        config = {
                            method: 'POST',
                            url: url,
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                            },
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axiosInstance.request(config)];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, response.data];
                    case 3:
                        error_4 = _b.sent();
                        console.error('Error capturing payment:', ((_a = error_4.response) === null || _a === void 0 ? void 0 : _a.data) || error_4.message);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PayPal.prototype.confirmAndCaptureOrder = function (orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, order, captureResult, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getAccessToken()];
                    case 1:
                        accessToken = _a.sent();
                        return [4 /*yield*/, this.getOrderDetails(orderId, accessToken)];
                    case 2:
                        order = _a.sent();
                        return [4 /*yield*/, this.capturePayment(order.id, accessToken)];
                    case 3:
                        captureResult = _a.sent();
                        console.log('Payment process completed successfully.');
                        return [2 /*return*/, captureResult];
                    case 4:
                        error_5 = _a.sent();
                        console.error('Error during order confirmation or payment capture:', error_5.message);
                        throw error_5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return PayPal;
}());
exports.PayPal = PayPal;
// LinePay金流
var LinePay = /** @class */ (function () {
    function LinePay(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
        this.LinePay_CLIENT_ID = keyData.CLIENT_ID; // 替換為您的 Client ID
        this.LinePay_SECRET = keyData.SECRET; // 替換為您的 Secret Key
        this.LinePay_BASE_URL = keyData.BETA == 'true' ? 'https://sandbox-api-pay.line.me' : 'https://api-pay.line.me'; // 沙箱環境
        // this.LinePay_RETURN_HOST = '';
        // this.LinePay_CLIENT_ID = "2006615995"; // 替換為您的 Client ID
        // this.LinePay_CLIENT_ID = this.keyData.LinePay_CLIENT_ID;
        // this.LinePay_SECRET = "05231f46428525ee68c2816f16635145"; // 替換為您的 Secret Key
        // this.LinePay_SECRET = keyData.LinePay_SECRET;
        // this.LinePay_BASE_URL = "https://sandbox-api-pay.line.me"; // 沙箱環境
        // const PAYPAL_BASE_URL = "https://api-pay.line.me"; // 正式環境
    }
    LinePay.prototype.confirmAndCaptureOrder = function (transactionId, total) {
        return __awaiter(this, void 0, void 0, function () {
            var body, uri, nonce, url, head, signature, config, response, error_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        body = {
                            amount: parseInt("".concat(total), 10),
                            currency: 'TWD',
                        };
                        uri = "/payments/".concat(transactionId, "/confirm");
                        nonce = new Date().getTime().toString();
                        url = "".concat(this.LinePay_BASE_URL, "/v3").concat(uri);
                        head = [this.LinePay_SECRET, "/v3".concat(uri), JSON.stringify(body), nonce].join('');
                        signature = crypto_1.default.createHmac('sha256', this.LinePay_SECRET).update(head).digest('base64');
                        config = {
                            method: 'POST',
                            url: url,
                            headers: {
                                'Content-Type': 'application/json',
                                'X-LINE-ChannelId': this.LinePay_CLIENT_ID,
                                'X-LINE-Authorization-Nonce': nonce,
                                'X-LINE-Authorization': signature,
                            },
                            data: body,
                        };
                        console.log("line-conform->\n        URL:".concat(url, "\n        X-LINE-ChannelId:").concat(this.LinePay_CLIENT_ID, "\n        LinePay_SECRET:").concat(this.LinePay_SECRET, "\n        "));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.request(config)];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, response];
                    case 3:
                        error_6 = _b.sent();
                        console.error('Error linePay:', ((_a = error_6.response) === null || _a === void 0 ? void 0 : _a.data.data) || error_6.message);
                        throw error_6;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LinePay.prototype.createOrder = function (orderData) {
        return __awaiter(this, void 0, void 0, function () {
            var confirm_url, cancel_url, body, uri, nonce, url, head, signature, config, response, error_7;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        confirm_url = "".concat(this.keyData.ReturnURL, "&LinePay=true&appName=").concat(this.appName, "&orderID=").concat(orderData.orderID);
                        cancel_url = "".concat(this.keyData.ReturnURL, "&payment=false");
                        orderData.discount = parseInt((_a = orderData.discount) !== null && _a !== void 0 ? _a : 0, 10);
                        body = {
                            amount: orderData.total,
                            currency: 'TWD',
                            orderId: orderData.orderID,
                            shippingFee: orderData.shipment_fee,
                            packages: [
                                {
                                    id: 'product_list',
                                    amount: orderData.lineItems
                                        .map(function (data) {
                                        return data.count * data.sale_price;
                                    })
                                        .reduce(function (a, b) { return a + b; }, 0) - orderData.discount,
                                    products: orderData.lineItems
                                        .map(function (data) {
                                        return {
                                            id: data.spec.join(','),
                                            name: data.title,
                                            imageUrl: '',
                                            quantity: data.count,
                                            price: data.sale_price,
                                        };
                                    })
                                        .concat([
                                        {
                                            id: 'discount',
                                            name: '折扣',
                                            imageUrl: '',
                                            quantity: 1,
                                            price: orderData.discount * -1,
                                        },
                                    ]),
                                },
                            ],
                            redirectUrls: {
                                confirmUrl: confirm_url,
                                cancelUrl: cancel_url,
                            },
                        };
                        body.packages.push({
                            id: 'shipping',
                            amount: orderData.shipment_fee,
                            products: [
                                {
                                    id: 'shipping',
                                    name: 'shipping',
                                    imageUrl: '',
                                    quantity: 1,
                                    price: orderData.shipment_fee,
                                },
                            ],
                        });
                        uri = '/payments/request';
                        nonce = new Date().getTime().toString();
                        url = "".concat(this.LinePay_BASE_URL, "/v3").concat(uri);
                        head = [this.LinePay_SECRET, "/v3".concat(uri), JSON.stringify(body), nonce].join('');
                        signature = crypto_1.default.createHmac('sha256', this.LinePay_SECRET).update(head).digest('base64');
                        config = {
                            method: 'POST',
                            url: url,
                            headers: {
                                'Content-Type': 'application/json',
                                'X-LINE-ChannelId': this.LinePay_CLIENT_ID,
                                'X-LINE-Authorization-Nonce': nonce,
                                'X-LINE-Authorization': signature,
                            },
                            data: body,
                        };
                        console.log("line-request->\n        URL:".concat(url, "\n        X-LINE-ChannelId:").concat(this.LinePay_CLIENT_ID, "\n        LinePay_SECRET:").concat(this.LinePay_SECRET, "\n        "));
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, axios_1.default.request(config)];
                    case 2:
                        response = _c.sent();
                        return [4 /*yield*/, order_event_js_1.OrderEvent.insertOrder({
                                cartData: orderData,
                                status: 0,
                                app: this.appName,
                            })];
                    case 3:
                        _c.sent();
                        console.log("response.data===>", response.data);
                        return [4 /*yield*/, redis_1.default.setValue('linepay' + orderData.orderID, response.data.info.transactionId)];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, response.data];
                    case 5:
                        error_7 = _c.sent();
                        console.error('Error linePay:', ((_b = error_7.response) === null || _b === void 0 ? void 0 : _b.data) || error_7.message);
                        throw error_7;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return LinePay;
}());
exports.LinePay = LinePay;
// paynow金流
var PayNow = /** @class */ (function () {
    function PayNow(appName, keyData) {
        var _a, _b;
        this.keyData = keyData;
        this.appName = appName;
        this.PublicKey = (_a = keyData.public_key) !== null && _a !== void 0 ? _a : '';
        this.PrivateKey = (_b = keyData.private_key) !== null && _b !== void 0 ? _b : '';
        this.BASE_URL = keyData.BETA == 'true' ? 'https://sandboxapi.paynow.com.tw' : 'https://api.paynow.com.tw'; // 沙箱環境
    }
    PayNow.prototype.executePaymentIntent = function (transactionId, secret, paymentNo) {
        return __awaiter(this, void 0, void 0, function () {
            var config, response, error_8;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        config = {
                            method: 'POST',
                            maxBodyLength: Infinity,
                            url: "".concat(this.BASE_URL, "/api/v1/payment-intents/").concat(transactionId, "/checkout"),
                            headers: {
                                Accept: 'application/json',
                                Authorization: "Bearer " + this.PrivateKey,
                            },
                            data: JSON.stringify({
                                paymentNo: paymentNo,
                                usePayNowSdk: true,
                                key: this.PublicKey,
                                secret: secret,
                                paymentMethodType: 'CreditCard',
                                paymentMethodData: {},
                                otpFlag: false,
                                meta: {
                                    client: {
                                        height: 0,
                                        width: 0,
                                    },
                                    iframe: {
                                        height: 0,
                                        width: 0,
                                    },
                                },
                            }),
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.request(config)];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, response.data];
                    case 3:
                        error_8 = _b.sent();
                        console.error('Error paynow:', ((_a = error_8.response) === null || _a === void 0 ? void 0 : _a.data.data) || error_8.message);
                        throw error_8;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //取得並綁定商戶金鑰匙
    PayNow.prototype.bindKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keyData, kd, config;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                            appName: this.appName,
                            key: 'glitter_finance',
                        })];
                    case 1:
                        keyData = (_b.sent())[0].value;
                        kd = (_a = keyData['paynow']) !== null && _a !== void 0 ? _a : {
                            ReturnURL: '',
                            NotifyURL: '',
                        };
                        config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'https://api.paynow.com.tw/api/v1/partner/merchants/binding',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: "Bearer " + process_1.default.env.paynow_partner,
                            },
                            data: {
                                merchant_no: kd.account,
                                api_key: kd.pwd,
                            },
                        };
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                axios_1.default
                                    .request(config)
                                    .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        if (response.data.result.length) {
                                            keyData.public_key = response.data.result[0].public_key;
                                            keyData.private_key = response.data.result[0].private_key;
                                        }
                                        resolve({
                                            public_key: keyData.public_key,
                                            private_key: keyData.private_key,
                                        });
                                        return [2 /*return*/];
                                    });
                                }); })
                                    .catch(function (error) {
                                    resolve({
                                        public_key: '',
                                        private_key: '',
                                    });
                                });
                            })];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    //
    //確認付款資訊
    PayNow.prototype.confirmAndCaptureOrder = function (transactionId) {
        return __awaiter(this, void 0, void 0, function () {
            var config, _a, response, error_9;
            var _b, _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _b = {
                            method: 'get',
                            maxBodyLength: Infinity,
                            url: "".concat(this.BASE_URL, "/api/v1/payment-intents/").concat(transactionId)
                        };
                        _c = {
                            Accept: 'application/json'
                        };
                        _a = "Bearer ";
                        return [4 /*yield*/, this.bindKey()];
                    case 1:
                        config = (_b.headers = (_c.Authorization = _a + (_e.sent()).private_key,
                            _c),
                            _b);
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.request(config)];
                    case 3:
                        response = _e.sent();
                        return [2 /*return*/, response.data];
                    case 4:
                        error_9 = _e.sent();
                        console.error('Error paynow:', ((_d = error_9.response) === null || _d === void 0 ? void 0 : _d.data.data) || error_9.message);
                        throw error_9;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PayNow.prototype.createOrder = function (orderData) {
        return __awaiter(this, void 0, void 0, function () {
            var data, url, key_, config, response, error_10;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data = JSON.stringify({
                            amount: orderData.total,
                            currency: 'TWD',
                            description: orderData.orderID,
                            resultUrl: this.keyData.ReturnURL + "&orderID=".concat(orderData.orderID),
                            webhookUrl: this.keyData.NotifyURL + "&orderID=".concat(orderData.orderID),
                            allowedPaymentMethods: ['CreditCard'],
                            expireDays: 3,
                        });
                        console.log("webhook=>", this.keyData.NotifyURL + "&orderID=".concat(orderData.orderID));
                        url = "".concat(this.BASE_URL, "/api/v1/payment-intents");
                        return [4 /*yield*/, this.bindKey()];
                    case 1:
                        key_ = _b.sent();
                        config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: url,
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: "Bearer " + key_.private_key,
                            },
                            data: data,
                        };
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, axios_1.default.request(config)];
                    case 3:
                        response = _b.sent();
                        orderData.paynow_id = response.data.result.id;
                        return [4 /*yield*/, order_event_js_1.OrderEvent.insertOrder({
                                cartData: orderData,
                                status: 0,
                                app: this.appName,
                            })];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, redis_1.default.setValue('paynow' + orderData.orderID, response.data.result.id)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                publicKey: key_.public_key,
                                BETA: this.keyData.BETA,
                            }];
                    case 6:
                        error_10 = _b.sent();
                        console.error('Error payNow:', ((_a = error_10.response) === null || _a === void 0 ? void 0 : _a.data) || error_10.message);
                        throw error_10;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return PayNow;
}());
exports.PayNow = PayNow;
// 街口
var JKO = /** @class */ (function () {
    function JKO(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
        this.BASE_URL = 'https://onlinepay.jkopay.com/';
    }
    JKO.prototype.confirmAndCaptureOrder = function (transactionId) {
        return __awaiter(this, void 0, void 0, function () {
            var apiKey, secretKey, digest, config, response, error_11;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        apiKey = process_1.default.env.jko_api_key || '';
                        secretKey = process_1.default.env.jko_api_secret || '';
                        digest = this.generateDigest("platform_order_ids=".concat(transactionId), secretKey);
                        config = {
                            method: 'get',
                            url: "".concat(this.BASE_URL, "platform/inquiry?platform_order_ids=").concat(transactionId),
                            headers: {
                                'api-key': apiKey,
                                digest: digest,
                                'Content-Type': 'application/json',
                            },
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.request(config)];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, response.data.result_object];
                    case 3:
                        error_11 = _b.sent();
                        console.error('Error paynow:', ((_a = error_11.response) === null || _a === void 0 ? void 0 : _a.data.data) || error_11.message);
                        throw error_11;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    JKO.prototype.createOrder = function (orderData) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, apiKey, secretKey, digest, headers, url, config, response, error_12;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        payload = {
                            currency: 'TWD',
                            total_price: orderData.total,
                            final_price: orderData.total,
                            platform_order_id: orderData.orderID,
                            store_id: this.keyData.STORE_ID,
                            result_url: this.keyData.NotifyURL + "&orderID=".concat(orderData.orderID),
                            result_display_url: this.keyData.ReturnURL + "&orderID=".concat(orderData.orderID),
                            unredeem: 0
                        };
                        //resul_url
                        //result_url
                        console.log("payload=>", payload);
                        apiKey = process_1.default.env.jko_api_key || '';
                        secretKey = process_1.default.env.jko_api_secret || '';
                        digest = crypto_1.default.createHmac('sha256', secretKey).update(JSON.stringify(payload), 'utf8').digest('hex');
                        headers = {
                            'api-key': apiKey,
                            digest: digest,
                            'Content-Type': 'application/json',
                        };
                        url = "".concat(this.BASE_URL, "platform/entry");
                        config = {
                            method: 'post',
                            url: url,
                            headers: headers,
                            data: payload,
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.request(config)];
                    case 2:
                        response = _b.sent();
                        return [4 /*yield*/, order_event_js_1.OrderEvent.insertOrder({
                                cartData: orderData,
                                status: 0,
                                app: this.appName,
                            })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, response.data];
                    case 4:
                        error_12 = _b.sent();
                        console.error('Error jkoPay:', ((_a = error_12.response) === null || _a === void 0 ? void 0 : _a.data) || error_12.message);
                        throw error_12;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    JKO.prototype.refundOrder = function (platform_order_id, refund_amount) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, apiKey, secretKey, digest, headers;
            return __generator(this, function (_a) {
                payload = JSON.stringify({
                    platform_order_id: '1740299355493',
                    refund_amount: 10000,
                });
                apiKey = '689c57cd9d5b5ec80f5d5451d18fe24cfe855d21b25c7ff30bcd07829a902f7a';
                secretKey = '8ec78345a13e3d376452d9c89c66b543ef1516c0ef1a05f0adf654c37ac8edac';
                console.log('payload -- ', payload);
                digest = crypto_1.default.createHmac('sha256', secretKey).update(payload, 'utf8').digest('hex');
                headers = {
                    'api-key': apiKey,
                    digest: digest,
                    'Content-Type': 'application/json',
                };
                // 顯示結果
                console.log('API Key:', apiKey);
                console.log('Digest:', digest);
                console.log('Headers:', headers);
                return [2 /*return*/];
            });
        });
    };
    JKO.prototype.generateDigest = function (data, apiSecret) {
        // 轉換 data 和 apiSecret 為 UTF-8 Byte Array
        console.log('data --', data);
        console.log('apiSecret -- ', apiSecret);
        // 使用 HMAC-SHA256 進行雜湊
        var hmac = crypto_1.default.createHmac('sha256', apiSecret);
        hmac.update(data);
        // 轉換為 16 進位字串 (與 C# 的 Convert.ToHexString(hash).ToLower() 等效)
        return hmac.digest('hex');
    };
    return JKO;
}());
exports.JKO = JKO;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
// 8057a6ef-b2ba-11ef-94d5-005056b665e9
// const payload = {
//     "platform_order_id": "demo-order-001",
//     "store_id": this.keyData.STORE_ID,
//     "currency": "TWD",
//     "total_price": 10,
//     "final_price": 10,
//     "unredeem": 0,
//     "result_display_url": "https://shopnex.tw/",
//     "confirm_url" : "https://shopnex.tw/",
//     "result_url": "https://shopnex.tw/",
// }
//法1 什麼都不做處理 但把payload的前後{}拿掉 或是不拿
// const secret = "8ec78345a13e3d376452d9c89c66b543ef1516c0ef1a05f0adf654c37ac8edac";
// const digest = this.generateDigest(JSON.stringify(payload) , secret);
//法2 payload做字節處理 只做payload
// function jsonToHex(jsonData: object): string {
//     // 1️⃣ 轉成 JSON 字串
//     const jsonString = JSON.stringify(jsonData);
//
//     // 2️⃣ 轉換為 UTF-8 編碼的 Buffer
//     const utf8Bytes = Buffer.from(jsonString, 'utf8');
//
//     // 3️⃣ 轉換為 16 進位字串
//     const hexString = utf8Bytes.toString('hex');
//
//     return hexString;
// }
// const secret = "8ec78345a13e3d376452d9c89c66b543ef1516c0ef1a05f0adf654c37ac8edac";
// const digest = this.generateDigest( jsonToHex(payload) , secret);
//法3 payload和secret做字節處理

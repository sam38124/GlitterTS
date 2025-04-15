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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcInvoice = void 0;
var crypto_1 = require("crypto");
var axios_1 = require("axios");
var form_data_1 = require("form-data");
var tool_js_1 = require("./ezpay/tool.js");
var database_1 = require("../../modules/database");
var jsdom_1 = require("jsdom");
var app_js_1 = require("../../app.js");
var EcInvoice = /** @class */ (function () {
    function EcInvoice() {
    }
    //取得公司名稱
    EcInvoice.getCompanyName = function (obj) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var cf_, send_invoice, timeStamp, cipher, encryptedData, config;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_js_1.default.getAdConfig(obj.app_name, 'invoice_setting')];
                    case 1:
                        cf_ = _a.sent();
                        send_invoice = {
                            MerchantID: cf_.merchNO,
                            UnifiedBusinessNo: obj.company_id,
                        };
                        timeStamp = "".concat(new Date().valueOf());
                        cipher = crypto_1.default.createCipheriv('aes-128-cbc', cf_.hashkey, cf_.hashiv);
                        encryptedData = cipher.update(encodeURIComponent(JSON.stringify(send_invoice)), 'utf-8', 'base64');
                        encryptedData += cipher.final('base64');
                        config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: cf_.point === 'beta'
                                ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/GetCompanyNameByTaxID'
                                : 'https://einvoice.ecpay.com.tw/B2CInvoice/GetCompanyNameByTaxID',
                            headers: {},
                            'Content-Type': 'application/json',
                            data: {
                                MerchantID: cf_.merchNO,
                                RqHeader: {
                                    Timestamp: parseInt("".concat(timeStamp.substring(0, 10)), 10),
                                },
                                Data: encryptedData,
                            },
                        };
                        axios_1.default
                            .request(config)
                            .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                            var decipher, decrypted, resp;
                            return __generator(this, function (_a) {
                                decipher = crypto_1.default.createDecipheriv('aes-128-cbc', cf_.hashkey, cf_.hashiv);
                                decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                                try {
                                    decrypted += decipher.final('utf-8');
                                }
                                catch (e) {
                                    e instanceof Error && console.log(e.message);
                                }
                                resp = JSON.parse(decodeURIComponent(decrypted));
                                console.log("resp--->", resp);
                                resolve(resp.CompanyName);
                                return [2 /*return*/];
                            });
                        }); })
                            .catch(function (error) {
                            console.log(error);
                            resolve(false);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    EcInvoice.postInvoice = function (obj) {
        var _this = this;
        var timeStamp = "".concat(new Date().valueOf());
        var cipher = crypto_1.default.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
        console.log("obj.invoice_data--->", obj.invoice_data);
        var encryptedData = cipher.update(encodeURIComponent(JSON.stringify(obj.invoice_data)), 'utf-8', 'base64');
        encryptedData += cipher.final('base64');
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: obj.beta
                ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/Issue'
                : 'https://einvoice.ecpay.com.tw/B2CInvoice/Issue',
            headers: {},
            'Content-Type': 'application/json',
            data: {
                MerchantID: obj.merchNO,
                RqHeader: {
                    Timestamp: parseInt("".concat(timeStamp.substring(0, 10)), 10),
                },
                Data: encryptedData,
            },
        };
        //發送通知
        //PlatformID
        return new Promise(function (resolve, reject) {
            axios_1.default
                .request(config)
                .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                var decipher, decrypted, resp, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            decipher = crypto_1.default.createDecipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
                            decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                            try {
                                decrypted += decipher.final('utf-8');
                            }
                            catch (e) {
                                e instanceof Error && console.log(e.message);
                            }
                            resp = JSON.parse(decodeURIComponent(decrypted));
                            console.log("resp--->", resp);
                            return [4 /*yield*/, database_1.default.query("insert into `".concat(obj.app_name, "`.t_invoice_memory\n                          set ?"), [
                                    {
                                        order_id: obj.order_id,
                                        invoice_no: resp.InvoiceNo,
                                        invoice_data: JSON.stringify({
                                            original_data: obj.invoice_data,
                                            response: resp,
                                            orderData: obj.orderData
                                        }),
                                        create_date: resp.InvoiceDate,
                                    },
                                ])];
                        case 1:
                            _b.sent();
                            if (!obj.print) return [3 /*break*/, 3];
                            _a = resolve;
                            return [4 /*yield*/, this.printInvoice({
                                    hashKey: obj.hashKey,
                                    hash_IV: obj.hash_IV,
                                    merchNO: obj.merchNO,
                                    app_name: obj.app_name,
                                    order_id: obj.order_id,
                                    beta: obj.beta,
                                })];
                        case 2:
                            _a.apply(void 0, [_b.sent()]);
                            return [3 /*break*/, 4];
                        case 3:
                            resolve(response.data);
                            _b.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); })
                .catch(function (error) {
                console.log(error);
                resolve(false);
            });
        });
    };
    //發票作廢
    EcInvoice.voidInvoice = function (obj) {
        var _this = this;
        var timeStamp = "".concat(new Date().valueOf());
        var cipher = crypto_1.default.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
        var encryptedData = cipher.update(encodeURIComponent(JSON.stringify(obj.invoice_data)), 'utf-8', 'base64');
        encryptedData += cipher.final('base64');
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: obj.beta
                ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/Invalid'
                : 'https://einvoice.ecpay.com.tw/B2CInvoice/Invalid',
            headers: {},
            'Content-Type': 'application/json',
            data: {
                MerchantID: obj.merchNO,
                RqHeader: {
                    Timestamp: parseInt("".concat(timeStamp.substring(0, 10)), 10),
                },
                Data: encryptedData,
            },
        };
        //發送通知
        //PlatformID
        return new Promise(function (resolve, reject) {
            axios_1.default
                .request(config)
                .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                var decipher, decrypted, resp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            decipher = crypto_1.default.createDecipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
                            decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                            try {
                                decrypted += decipher.final('utf-8');
                            }
                            catch (e) {
                                e instanceof Error && console.log(e.message);
                            }
                            resp = JSON.parse(decodeURIComponent(decrypted));
                            console.log("resp--->", resp);
                            return [4 /*yield*/, database_1.default.query("UPDATE `".concat(obj.app_name, "`.t_invoice_memory\n                          set status = 2\n                          WHERE invoice_no = '").concat(obj.invoice_data.InvoiceNo, "'"), [])];
                        case 1:
                            _a.sent();
                            resolve(response.data);
                            return [2 /*return*/];
                    }
                });
            }); })
                .catch(function (error) {
                console.log(error);
                resolve(false);
            });
        });
    };
    //發票折讓
    EcInvoice.allowanceInvoice = function (obj) {
        var _this = this;
        var timeStamp = "".concat(new Date().valueOf());
        var cipher = crypto_1.default.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
        var encryptedData = cipher.update(encodeURIComponent(JSON.stringify(obj.allowance_data)), 'utf-8', 'base64');
        encryptedData += cipher.final('base64');
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: obj.beta
                ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/Allowance'
                : 'https://einvoice.ecpay.com.tw/B2CInvoice/Allowance',
            headers: {},
            'Content-Type': 'application/json',
            data: {
                MerchantID: obj.merchNO,
                RqHeader: {
                    Timestamp: parseInt("".concat(timeStamp.substring(0, 10)), 10),
                },
                Data: encryptedData,
            },
        };
        //發送通知
        //PlatformID
        return new Promise(function (resolve, reject) {
            axios_1.default
                .request(config)
                .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                var decipher, decrypted, resp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            decipher = crypto_1.default.createDecipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
                            decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                            try {
                                decrypted += decipher.final('utf-8');
                            }
                            catch (e) {
                                e instanceof Error && console.log(e.message);
                            }
                            resp = JSON.parse(decodeURIComponent(decrypted));
                            if (!(resp.RtnCode != 1)) return [3 /*break*/, 1];
                            resolve(resp);
                            return [2 /*return*/, resp];
                        case 1: return [4 /*yield*/, database_1.default.query("insert into `".concat(obj.app_name, "`.t_allowance_memory\n                            set ?"), [
                                {
                                    status: '1',
                                    order_id: obj.order_id,
                                    invoice_no: obj.allowance_data.InvoiceNo,
                                    allowance_no: resp.IA_Allow_No,
                                    allowance_data: JSON.stringify(obj.db_data),
                                    create_date: resp.IA_Date,
                                },
                            ])];
                        case 2:
                            _a.sent();
                            resolve(resp);
                            return [2 /*return*/, resp];
                    }
                });
            }); })
                .catch(function (error) {
                console.log(error);
                resolve(false);
            });
        });
    };
    //廢棄發票折讓
    EcInvoice.voidAllowance = function (obj) {
        var _this = this;
        var timeStamp = "".concat(new Date().valueOf());
        var cipher = crypto_1.default.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
        var encryptedData = cipher.update(encodeURIComponent(JSON.stringify(obj.allowance_data)), 'utf-8', 'base64');
        encryptedData += cipher.final('base64');
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: obj.beta
                ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/AllowanceInvalid'
                : 'https://einvoice.ecpay.com.tw/B2CInvoice/AllowanceInvalid',
            headers: {},
            'Content-Type': 'application/json',
            data: {
                MerchantID: obj.merchNO,
                RqHeader: {
                    Timestamp: parseInt("".concat(timeStamp.substring(0, 10)), 10),
                },
                Data: encryptedData,
            },
        };
        //發送通知
        //PlatformID
        return new Promise(function (resolve, reject) {
            axios_1.default
                .request(config)
                .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                var decipher, decrypted, resp, allowanceData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            decipher = crypto_1.default.createDecipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
                            decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                            try {
                                decrypted += decipher.final('utf-8');
                            }
                            catch (e) {
                                e instanceof Error && console.log(e.message);
                            }
                            resp = JSON.parse(decodeURIComponent(decrypted));
                            console.log("resp--->", resp);
                            return [4 /*yield*/, database_1.default.query("SELECT *\n             FROM `".concat(obj.app_name, "`.t_allowance_memory\n             WHERE allowance_no = ?"), [obj.allowance_data.AllowanceNo])];
                        case 1:
                            allowanceData = _a.sent();
                            allowanceData[0].allowance_data.voidReason = obj.allowance_data.Reason;
                            return [4 /*yield*/, database_1.default.query("UPDATE `".concat(obj.app_name, "`.t_allowance_memory\n             SET ?\n             WHERE allowance_no = ?"), [
                                    {
                                        status: 2,
                                        allowance_data: JSON.stringify(allowanceData[0].allowance_data),
                                    },
                                    obj.allowance_data.AllowanceNo,
                                ])];
                        case 2:
                            _a.sent();
                            resolve(response.data);
                            return [2 /*return*/];
                    }
                });
            }); })
                .catch(function (error) {
                console.log(error);
                resolve(false);
            });
        });
    };
    //發票列印
    EcInvoice.printInvoice = function (obj) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var invoice_data, send_invoice, timeStamp, cipher, encryptedData, config;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT *\n                                            FROM `".concat(obj.app_name, "`.t_invoice_memory\n                                            where order_id = ?;"), [obj.order_id])];
                    case 1:
                        invoice_data = (_a.sent())[0];
                        send_invoice = {
                            MerchantID: obj.merchNO,
                            InvoiceNo: invoice_data.invoice_data.response.InvoiceNo,
                            InvoiceDate: "".concat(invoice_data.invoice_data.response.InvoiceDate).substring(0, 10),
                            PrintStyle: 3,
                            IsShowingDetail: 1,
                        };
                        timeStamp = "".concat(new Date().valueOf());
                        cipher = crypto_1.default.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
                        encryptedData = cipher.update(encodeURIComponent(JSON.stringify(send_invoice)), 'utf-8', 'base64');
                        encryptedData += cipher.final('base64');
                        config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: obj.beta
                                ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/InvoicePrint'
                                : 'https://einvoice.ecpay.com.tw/B2CInvoice/InvoicePrint',
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                            },
                            'Content-Type': 'application/json',
                            data: {
                                MerchantID: obj.merchNO,
                                RqHeader: {
                                    Timestamp: parseInt("".concat(timeStamp.substring(0, 10)), 10),
                                },
                                Data: encryptedData,
                            },
                        };
                        axios_1.default
                            .request(config)
                            .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                            var decipher, decrypted, resp, htmlData, dom, document, inputs, qrcode, bigTitles, bigTitle, resolve_data;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        decipher = crypto_1.default.createDecipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
                                        decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                                        try {
                                            decrypted += decipher.final('utf-8');
                                        }
                                        catch (e) {
                                            e instanceof Error && console.log(e.message);
                                        }
                                        resp = JSON.parse(decodeURIComponent(decrypted));
                                        return [4 /*yield*/, axios_1.default.request({
                                                method: 'get',
                                                maxBodyLength: Infinity,
                                                url: resp.InvoiceHtml,
                                            })];
                                    case 1:
                                        htmlData = _a.sent();
                                        console.log("resp.InvoiceHtml=>", resp.InvoiceHtml);
                                        dom = new jsdom_1.default.JSDOM(htmlData.data);
                                        document = dom.window.document;
                                        inputs = document.querySelectorAll('input');
                                        qrcode = [];
                                        inputs.forEach(function (input) {
                                            qrcode.push(input.value);
                                        });
                                        bigTitles = document.querySelectorAll('.data_big');
                                        bigTitle = [];
                                        bigTitles.forEach(function (input) {
                                            bigTitle.push(input.innerHTML);
                                        });
                                        resolve_data = {
                                            //開立日期
                                            create_date: document.querySelector('font').innerHTML,
                                            //發票區間
                                            date: bigTitle[0].replace(/\n/g, '').trim(),
                                            //發票號碼
                                            invoice_code: bigTitle[1].replace(/\n/g, '').trim(),
                                            //Qrcode_0
                                            qrcode_0: qrcode[0],
                                            //Qrcode_1
                                            qrcode_1: qrcode[1],
                                            //開立連結
                                            link: resp.InvoiceHtml,
                                            //隨機碼
                                            random_code: document.querySelectorAll('.fl font')[1].innerHTML,
                                            //總計
                                            total: document.querySelectorAll('.fr font')[1].innerHTML,
                                            //賣方
                                            sale_gui: document.querySelectorAll('.fl font')[2].innerHTML,
                                            //買方
                                            buy_gui: (document.querySelectorAll('.fr font')[2] || { innerHTML: '' }).innerHTML,
                                            //交易明細
                                            pay_detail: document.querySelectorAll('table')[2].outerHTML,
                                            //底部付款資訊
                                            pay_detail_footer: document.querySelector('.invoice-detail-sum').outerHTML,
                                            bar_code: qrcode[0].substring(10, 15) +
                                                invoice_data.invoice_data.response.InvoiceNo +
                                                invoice_data.invoice_data.response.RandomNumber,
                                        };
                                        console.log("invoice_data==>", resolve_data);
                                        resolve(resolve_data);
                                        return [2 /*return*/];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            console.error("\u53D6\u5F97\u5931\u6557::", error);
                            resolve(false);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    EcInvoice.allowance = function (obj) {
        console.log("invoice_data:".concat(JSON.stringify(obj.invoice_data)));
        var tool = new tool_js_1.default();
        var salesMoney = 1000;
        var timeStamp = "".concat(new Date().valueOf());
        // 1. 建立請求的參數
        var params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log("dateFormat--".concat(dateFormat));
        // 2. 產生 Query String
        var qs = tool.JsonToQueryString(params);
        console.log(qs);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        var tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log("tradeInfo--".concat(params.TimeStamp));
        var data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: obj.beta ? 'https://cinv.ezpay.com.tw/Api/allowance_issue' : 'https://inv.ezpay.com.tw/Api/allowance_issue',
            headers: {},
            data: data,
        };
        return new Promise(function (resolve, reject) {
            axios_1.default
                .request(config)
                .then(function (response) {
                console.log(JSON.stringify(response.data));
                resolve(response.data);
            })
                .catch(function (error) {
                resolve(false);
            });
        });
    };
    EcInvoice.allowanceInvalid = function (obj) {
        console.log("invoice_data:".concat(JSON.stringify(obj.invoice_data)));
        var tool = new tool_js_1.default();
        var salesMoney = 1000;
        var timeStamp = "".concat(new Date().valueOf());
        // 1. 建立請求的參數
        var params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log("dateFormat--".concat(dateFormat));
        // 2. 產生 Query String
        var qs = tool.JsonToQueryString(params);
        console.log(qs);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        var tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log("tradeInfo--".concat(params.TimeStamp));
        var data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: obj.beta
                ? 'https://cinv.ezpay.com.tw/Api/allowanceInvalid'
                : 'https://inv.ezpay.com.tw/Api/allowanceInvalid',
            headers: {},
            data: data,
        };
        return new Promise(function (resolve, reject) {
            axios_1.default
                .request(config)
                .then(function (response) {
                console.log(JSON.stringify(response.data));
                resolve(response.data);
            })
                .catch(function (error) {
                resolve(false);
            });
        });
    };
    EcInvoice.deleteInvoice = function (obj) {
        var tool = new tool_js_1.default();
        var salesMoney = 1000;
        var timeStamp = "".concat(new Date().valueOf());
        // 1. 建立請求的參數
        var params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        // 2. 產生 Query String
        var qs = tool.JsonToQueryString(params);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        var tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        var data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: obj.beta ? 'https://cinv.ezpay.com.tw/Api/invoice_invalid' : 'https://inv.ezpay.com.tw/Api/invoice_invalid',
            headers: {},
            data: data,
        };
        return new Promise(function (resolve, reject) {
            axios_1.default
                .request(config)
                .then(function (response) {
                resolve(response.data);
            })
                .catch(function (error) {
                resolve(false);
            });
        });
    };
    EcInvoice.getInvoice = function (obj) {
        var tool = new tool_js_1.default();
        var salesMoney = 1000;
        var timeStamp = "".concat(new Date().valueOf());
        // 1. 建立請求的參數
        var params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log("dateFormat--".concat(dateFormat));
        // 2. 產生 Query String
        var qs = tool.JsonToQueryString(params);
        console.log(qs);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        var tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log("tradeInfo--".concat(params.TimeStamp));
        var data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: obj.beta ? 'https://cinv.ezpay.com.tw/Api/invoice_search' : 'https://inv.ezpay.com.tw/Api/invoice_search',
            headers: {},
            data: data,
        };
        return new Promise(function (resolve, reject) {
            axios_1.default
                .request(config)
                .then(function (response) {
                resolve(response.data.Status === 'SUCCESS');
            })
                .catch(function (error) {
                resolve(false);
            });
        });
    };
    return EcInvoice;
}());
exports.EcInvoice = EcInvoice;

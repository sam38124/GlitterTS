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
exports.PayNowLogistics = void 0;
var tool_js_1 = require("../../modules/tool.js");
var redis_js_1 = require("../../modules/redis.js");
var process_1 = require("process");
var crypto_js_1 = require("crypto-js");
var crypto_1 = require("crypto");
var private_config_js_1 = require("../../services/private_config.js");
var shipment_config_js_1 = require("../config/shipment-config.js");
var axios_1 = require("axios");
var database_js_1 = require("../../modules/database.js");
var shopping_js_1 = require("./shopping.js");
var user_js_1 = require("./user.js");
var html = String.raw;
var PayNowLogistics = /** @class */ (function () {
    function PayNowLogistics(app_name) {
        this.app_name = app_name;
    }
    PayNowLogistics.prototype.config = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deliveryConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                            appName: this.app_name,
                            key: 'glitter_delivery',
                        })];
                    case 1:
                        deliveryConfig = (_a.sent())[0];
                        return [2 /*return*/, {
                                pwd: deliveryConfig.value.pay_now.pwd,
                                link: deliveryConfig.value.pay_now.Action === 'test'
                                    ? "https://testlogistic.paynow.com.tw"
                                    : "https://logistic.paynow.com.tw",
                                toggle: deliveryConfig.value.pay_now.toggle,
                                account: deliveryConfig.value.pay_now.account,
                                sender_name: deliveryConfig.value.pay_now.SenderName,
                                sender_phone: deliveryConfig.value.pay_now.SenderCellPhone,
                                sender_address: deliveryConfig.value.pay_now.SenderAddress,
                                sender_email: deliveryConfig.value.pay_now.SenderEmail,
                            }];
                }
            });
        });
    };
    //超商選擇門市
    PayNowLogistics.prototype.choseLogistics = function (type, return_url) {
        return __awaiter(this, void 0, void 0, function () {
            var key, shipment_config, deliveryConfig, code, cf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = tool_js_1.default.randomString(6);
                        return [4 /*yield*/, redis_js_1.default.setValue('redirect_' + key, return_url)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, new user_js_1.User(this.app_name).getConfigV2({
                                key: "shipment_config_".concat(type),
                                user_id: 'manager',
                            })];
                    case 2:
                        shipment_config = _a.sent();
                        return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                appName: this.app_name,
                                key: 'glitter_delivery',
                            })];
                    case 3:
                        deliveryConfig = (_a.sent())[0];
                        deliveryConfig = (deliveryConfig && deliveryConfig.value && deliveryConfig.value.pay_now) || {};
                        return [4 /*yield*/, this.encrypt(deliveryConfig.pwd || process_1.default.env.logistic_apicode)];
                    case 4:
                        code = _a.sent();
                        cf = {
                            user_account: deliveryConfig.account || process_1.default.env.logistic_account,
                            apicode: encodeURIComponent(code),
                            Logistic_serviceID: (function () {
                                var paynow_id = shipment_config_js_1.ShipmentConfig.list.find(function (dd) {
                                    return dd.value === type;
                                }).paynow_id;
                                if (shipment_config.bulk) {
                                    if (paynow_id === '01') {
                                        return '02';
                                    }
                                    else if (paynow_id === '21') {
                                        return '22';
                                    }
                                    else if (paynow_id === '03') {
                                        return '04';
                                    }
                                    else if (paynow_id === '23') {
                                        return '24';
                                    }
                                    else {
                                        return "-1";
                                    }
                                }
                                else {
                                    return paynow_id;
                                }
                            })(),
                            returnUrl: "".concat(process_1.default.env.DOMAIN, "/api-public/v1/ec/logistics/redirect?g-app=").concat(this.app_name, "&return=").concat(key),
                        };
                        // console.log(`Logistic_serviceID`,cf.Logistic_serviceID)
                        return [2 /*return*/, html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <form\n        action=\"https://logistic.paynow.com.tw/Member/Order/Choselogistics\"\n        method=\"post\"\n        enctype=\"application/x-www-form-urlencoded\"\n        accept=\"text/html\"\n      >\n        ", "\n        <button type=\"submit\" class=\"btn btn-secondary custom-btn beside-btn d-none\" id=\"submit\" hidden></button>\n      </form>\n    "], ["\n      <form\n        action=\"https://logistic.paynow.com.tw/Member/Order/Choselogistics\"\n        method=\"post\"\n        enctype=\"application/x-www-form-urlencoded\"\n        accept=\"text/html\"\n      >\n        ", "\n        <button type=\"submit\" class=\"btn btn-secondary custom-btn beside-btn d-none\" id=\"submit\" hidden></button>\n      </form>\n    "])), Object.keys(cf)
                                .map(function (dd) {
                                return "<input type=\"hidden\" name=\"".concat(dd, "\" id=\"").concat(dd, "\" value=\"").concat(cf[dd], "\"/>");
                            })
                                .join('\n'))];
                }
            });
        });
    };
    //取消托運單
    PayNowLogistics.prototype.deleteLogOrder = function (orderNO, logisticNumber, totalAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var l_config, url, data, config, response, order;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.config()];
                    case 1:
                        l_config = _b.sent();
                        url = "".concat(l_config.link, "/api/Orderapi/CancelOrder");
                        _a = {
                            LogisticNumber: logisticNumber,
                            sno: 1
                        };
                        return [4 /*yield*/, this.sha1Encrypt([l_config.account, orderNO, totalAmount, l_config.pwd].join(''))];
                    case 2:
                        data = (_a.PassCode = _b.sent(),
                            _a);
                        //轉成純字串
                        Object.keys(data).map(function (dd) {
                            data[dd] = "".concat(data[dd]);
                        });
                        config = {
                            method: 'delete',
                            maxBodyLength: Infinity,
                            url: url,
                            headers: {
                                'Content-Type': 'application/JSON',
                            },
                            data: data,
                        };
                        return [4 /*yield*/, (0, axios_1.default)(config)];
                    case 3:
                        response = _b.sent();
                        console.log("response_data==>", response.data);
                        if (!(response.data && !response.data.includes('已繳費') && !response.data.includes('已寄件') && !response.data.includes('出貨中'))) return [3 /*break*/, 6];
                        return [4 /*yield*/, database_js_1.default.query("select *\n           from `".concat(this.app_name, "`.t_checkout\n           where cart_token = ?"), [orderNO])];
                    case 4:
                        order = (_b.sent())[0];
                        delete order.orderData.user_info.shipment_number;
                        delete order.orderData.user_info.shipment_refer;
                        return [4 /*yield*/, new shopping_js_1.Shopping(this.app_name).putOrder({
                                cart_token: orderNO,
                                orderData: order.orderData,
                                status: undefined,
                            })];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/, response.data];
                }
            });
        });
    };
    //查詢物流單
    PayNowLogistics.prototype.getOrderInfo = function (orderNO) {
        return __awaiter(this, void 0, void 0, function () {
            var l_config, url, config, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.config()];
                    case 1:
                        l_config = _a.sent();
                        url = "".concat(l_config.link, "/api/Orderapi/Get_Order_Info_orderno?orderno=").concat(orderNO, "&user_account=").concat(l_config.account, "&sno=1");
                        config = {
                            method: 'get',
                            maxBodyLength: Infinity,
                            url: url,
                            headers: {
                                'Content-Type': 'application/JSON',
                            },
                        };
                        return [4 /*yield*/, (0, axios_1.default)(config)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, {
                                status: e_1.status,
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //列印托運單
    PayNowLogistics.prototype.printLogisticsOrder = function (carData) {
        return __awaiter(this, void 0, void 0, function () {
            function getDaysDifference(date1, date2) {
                // 獲取毫秒時間戳，使用 Math.abs() 確保不受前後順序影響
                var timeDifference = Math.abs(date2.getTime() - date1.getTime());
                // 將毫秒轉換為天數 (1 天 = 1000 毫秒 * 60 秒 * 60 分鐘 * 24 小時)
                var daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                return daysDifference;
            }
            var l_config, url, shipment_config, service, data, config, response;
            var _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.config()];
                    case 1:
                        l_config = _c.sent();
                        url = "".concat(l_config.link, "/api/Orderapi/Add_Order");
                        return [4 /*yield*/, new user_js_1.User(this.app_name).getConfigV2({
                                key: "shipment_config_".concat(carData.user_info.shipment),
                                user_id: 'manager',
                            })];
                    case 2:
                        shipment_config = _c.sent();
                        service = (function () {
                            var paynow_id = shipment_config_js_1.ShipmentConfig.list.find(function (dd) {
                                return dd.value === carData.user_info.shipment;
                            }).paynow_id;
                            if (shipment_config.bulk) {
                                if (paynow_id === '01') {
                                    return '02';
                                }
                                else if (paynow_id === '21') {
                                    return '22';
                                }
                                else if (paynow_id === '03') {
                                    return '04';
                                }
                                else if (paynow_id === '23') {
                                    return '24';
                                }
                                else {
                                    return "-1";
                                }
                            }
                            else {
                                return paynow_id;
                            }
                        })();
                        return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            if (!(service === '36')) return [3 /*break*/, 2];
                                            _a = {
                                                user_account: l_config.account,
                                                apicode: l_config.pwd,
                                                Logistic_service: service,
                                                OrderNo: carData.orderID,
                                                DeliverMode: carData.customer_info.payment_select == 'cash_on_delivery' ? '01' : '02',
                                                TotalAmount: carData.total,
                                                receiver_storeid: carData.user_info.CVSStoreID,
                                                receiver_storename: carData.user_info.CVSStoreName,
                                                return_storeid: '',
                                                Receiver_Name: carData.user_info.name,
                                                Receiver_Phone: carData.user_info.phone,
                                                Receiver_Email: carData.user_info.email,
                                                Receiver_address: carData.user_info.address,
                                                Sender_Name: l_config.sender_name,
                                                Sender_Phone: l_config.sender_phone,
                                                Sender_Email: l_config.sender_email,
                                                Sender_address: l_config.sender_address,
                                                Length: carData.user_info.length,
                                                Wide: carData.user_info.wide,
                                                High: carData.user_info.high,
                                                Weight: carData.user_info.weight,
                                                DeliveryType: (function () {
                                                    switch (carData.user_info.shipment) {
                                                        case 'black_cat':
                                                            return '0001';
                                                        case 'black_cat_ice':
                                                            return '0002';
                                                        case 'black_cat_freezing':
                                                            return '0003';
                                                    }
                                                })(),
                                                Remark: '',
                                                Description: ''
                                            };
                                            return [4 /*yield*/, this.sha1Encrypt([l_config.account, carData.orderID, carData.total, l_config.pwd].join(''))];
                                        case 1: return [2 /*return*/, (_a.PassCode = _c.sent(),
                                                _a)];
                                        case 2:
                                            _b = {
                                                user_account: l_config.account,
                                                apicode: l_config.pwd,
                                                Logistic_service: service,
                                                OrderNo: carData.orderID,
                                                DeliverMode: carData.customer_info.payment_select == 'cash_on_delivery' ? '01' : '02',
                                                TotalAmount: carData.total,
                                                receiver_storeid: carData.user_info.CVSStoreID,
                                                receiver_storename: carData.user_info.CVSStoreName,
                                                return_storeid: '',
                                                Receiver_Name: carData.user_info.name,
                                                Receiver_Phone: carData.user_info.phone,
                                                Receiver_Email: carData.user_info.email,
                                                Receiver_address: carData.user_info.CVSAddress,
                                                Sender_Name: l_config.sender_name,
                                                Sender_Phone: l_config.sender_phone,
                                                Sender_Email: l_config.sender_email,
                                                Sender_address: l_config.sender_address,
                                                Remark: '',
                                                Description: ''
                                            };
                                            return [4 /*yield*/, this.sha1Encrypt([l_config.account, carData.orderID, carData.total, l_config.pwd].join(''))];
                                        case 3: return [2 /*return*/, (_b.PassCode = _c.sent(),
                                                _b)];
                                    }
                                });
                            }); })()];
                    case 3:
                        data = _c.sent();
                        console.log("add-order-data==>", data);
                        if (service === '36') {
                            data.Deadline = '0';
                        }
                        else if (['02', '22', '04', '24'].includes(service)) {
                            data.Deadline = getDaysDifference(new Date(), new Date(carData.user_info.shipment_date));
                        }
                        //轉成純字串
                        Object.keys(data).map(function (dd) {
                            data[dd] = "".concat(data[dd]);
                        });
                        _a = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: url,
                            headers: {
                                'Content-Type': 'application/JSON',
                            }
                        };
                        _b = {};
                        return [4 /*yield*/, this.encrypt(JSON.stringify(data))];
                    case 4:
                        config = (_a.data = (_b.JsonOrder = _c.sent(),
                            _b),
                            _a);
                        return [4 /*yield*/, (0, axios_1.default)(config)];
                    case 5:
                        response = _c.sent();
                        console.log("response_data==>", response.data);
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    PayNowLogistics.prototype.encrypt = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var ivbyte, encrypted;
            return __generator(this, function (_a) {
                try {
                    ivbyte = crypto_js_1.default.enc.Utf8.parse('12345678');
                    console.log("ivbyte=>", ivbyte);
                    encrypted = crypto_js_1.default.TripleDES.encrypt(crypto_js_1.default.enc.Utf8.parse(content), crypto_js_1.default.enc.Utf8.parse('123456789070828783123456'), {
                        iv: ivbyte, // 当 mode 为 CBC 时，偏移量必传
                        mode: crypto_js_1.default.mode.ECB,
                        padding: crypto_js_1.default.pad.ZeroPadding,
                    });
                    // mBcTYds3zPQ=
                    // tB5BKj5AMGw=
                    // W1BhPWN3FAI= 這是對的
                    return [2 /*return*/, encrypted.toString()];
                }
                catch (e) {
                    console.error(e);
                }
                return [2 /*return*/];
            });
        });
    };
    PayNowLogistics.prototype.sha1Encrypt = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_a) {
                hash = (0, crypto_1.createHash)('sha1').update(data, 'utf8').digest('hex');
                return [2 /*return*/, hash.toUpperCase()];
            });
        });
    };
    PayNowLogistics.printStack = [];
    return PayNowLogistics;
}());
exports.PayNowLogistics = PayNowLogistics;
var templateObject_1;

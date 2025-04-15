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
var process_1 = require("process");
var financial_service_js_1 = require("../financial-service.js");
var private_config_js_1 = require("../../../services/private_config.js");
var tool_js_1 = require("../../../modules/tool.js");
var mime = require('mime');
var PaymentTransaction = /** @class */ (function () {
    function PaymentTransaction(app, payment_select) {
        this.app = app;
        this.payment_select = payment_select;
    }
    PaymentTransaction.prototype.createInstance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keyData, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                appName: this.app,
                                key: 'glitter_finance',
                            })];
                    case 1:
                        keyData = (_b.sent())[0].value;
                        this.kd = (_a = keyData[this.payment_select]) !== null && _a !== void 0 ? _a : {
                            ReturnURL: '',
                            NotifyURL: '',
                        };
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        // 處理非同步操作中的錯誤，例如拋出更明確的例外
                        throw new Error("Failed to create MyClass instance: ".concat(error_1));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PaymentTransaction.prototype.processPayment = function (carData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, subMitData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.kd) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createInstance()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _a = this.payment_select;
                        switch (_a) {
                            case 'ecPay': return [3 /*break*/, 3];
                            case 'newWebPay': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        id = 'redirect_' + tool_js_1.default.randomString(6);
                        return [4 /*yield*/, new financial_service_js_1.default(this.app, {
                                HASH_IV: this.kd.HASH_IV,
                                HASH_KEY: this.kd.HASH_KEY,
                                ActionURL: this.kd.ActionURL,
                                NotifyURL: "".concat(process_1.default.env.DOMAIN, "/api-public/v1/ec/notify?g-app=").concat(this.app, "&type=").concat(carData.customer_info.payment_select),
                                ReturnURL: "".concat(process_1.default.env.DOMAIN, "/api-public/v1/ec/redirect?g-app=").concat(this.app, "&return=").concat(id),
                                MERCHANT_ID: this.kd.MERCHANT_ID,
                                TYPE: this.payment_select,
                            }).createOrderPage(carData)];
                    case 4:
                        subMitData = _b.sent();
                        return [2 /*return*/, { form: subMitData }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return PaymentTransaction;
}());
exports.default = PaymentTransaction;

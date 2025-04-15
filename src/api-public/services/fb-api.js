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
exports.FbApi = void 0;
var user_js_1 = require("./user.js");
var axios_1 = require("axios");
var tool_js_1 = require("../../services/tool.js");
var exception_js_1 = require("../../modules/exception.js");
var FbApi = /** @class */ (function () {
    function FbApi(app_name, token) {
        this.app_name = app_name;
        this.token = token;
    }
    FbApi.prototype.config = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new user_js_1.User(this.app_name).getConfigV2({
                            key: 'login_fb_setting',
                            user_id: 'manager'
                        })];
                    case 1:
                        cf = _a.sent();
                        return [2 /*return*/, {
                                link: "https://graph.facebook.com/v22.0/".concat(cf.pixel, "/events").trim(),
                                api_token: cf.api_token
                            }];
                }
            });
        });
    };
    //結帳
    FbApi.prototype.checkOut = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var cf;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.config()];
                    case 1:
                        cf = _a.sent();
                        if (!(cf.link && cf.api_token)) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    try {
                                        axios_1.default
                                            .post(cf.link, JSON.stringify({
                                            data: [{
                                                    "event_name": "Purchase",
                                                    "event_time": (new Date().getTime() / 1000).toFixed(0),
                                                    "action_source": "website",
                                                    "user_data": {
                                                        "em": [
                                                            tool_js_1.default.hashSHA256(data.customer_info.email)
                                                        ],
                                                        "ph": [
                                                            tool_js_1.default.hashSHA256(data.customer_info.phone)
                                                        ],
                                                        "client_ip_address": data.client_ip_address,
                                                        "fbc": data.fbc,
                                                        "fbp": data.fbp
                                                    },
                                                    "custom_data": {
                                                        "currency": "TWD",
                                                        "value": data.total
                                                    }
                                                }],
                                            access_token: cf.api_token
                                        }), {
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                        })
                                            .then(function (response) {
                                            console.log('FB APIC已成功發送:', response.data);
                                            resolve(response.data);
                                        })
                                            .catch(function (error) {
                                            console.error('發送FB APIC發生錯誤:', error.response ? error.response.data : error.message);
                                            resolve(false);
                                        });
                                    }
                                    catch (e) {
                                        console.error(e);
                                        resolve(false);
                                    }
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //
    FbApi.prototype.post = function (data, req) {
        return __awaiter(this, void 0, void 0, function () {
            var cf_1, dd, email, phone, e_1;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.config()];
                    case 1:
                        cf_1 = _b.sent();
                        console.log("cf.link=>", this.app_name);
                        console.log("cf.link=>", cf_1.link);
                        console.log("cf.api_token=>", cf_1.api_token);
                        if (!(cf_1.link && cf_1.api_token)) return [3 /*break*/, 5];
                        data.user_data = {
                            "client_ip_address": (req.query.ip || req.headers['x-real-ip'] || req.ip),
                            "fbc": req.cookies._fbc,
                            "fbp": req.cookies._fbp
                        };
                        if (!this.token) return [3 /*break*/, 3];
                        return [4 /*yield*/, new user_js_1.User(this.app_name).getUserData(this.token.userID, 'userID')];
                    case 2:
                        dd = (_b.sent());
                        if (dd && dd.userData) {
                            email = dd.userData.email;
                            phone = dd.userData.phone;
                            email && (data.user_data.email = [tool_js_1.default.hashSHA256(email)]);
                            phone && (data.user_data.ph = [tool_js_1.default.hashSHA256(phone)]);
                        }
                        _b.label = 3;
                    case 3:
                        data.event_time = (new Date().getTime() / 1000).toFixed(0);
                        return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    try {
                                        axios_1.default
                                            .post(cf_1.link, JSON.stringify({
                                            data: [data],
                                            access_token: cf_1.api_token,
                                        }), {
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                        })
                                            .then(function (response) {
                                            console.log('FB APIC已成功發送:', response.data);
                                            resolve(response.data);
                                        })
                                            .catch(function (error) {
                                            console.error('發送FB APIC發生錯誤:', error.response ? error.response.data : error.message);
                                            resolve(false);
                                        });
                                    }
                                    catch (e) {
                                        console.error(e);
                                        resolve(false);
                                    }
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 4: 
                    // data.action_source='website'
                    // data.test_event_code='TEST82445'
                    // console.log(data)
                    return [2 /*return*/, _b.sent()];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _b.sent();
                        console.error(e_1);
                        throw exception_js_1.default.BadRequestError((_a = e_1.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e_1, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    FbApi.prototype.OAuth = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return FbApi;
}());
exports.FbApi = FbApi;

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
exports.SharePermission = void 0;
var database_1 = require("../../modules/database");
var exception_js_1 = require("../../modules/exception.js");
var config_1 = require("../../config");
var redis_js_1 = require("../../modules/redis.js");
var jsonwebtoken_1 = require("jsonwebtoken");
var config_js_1 = require("../../config.js");
var user_1 = require("./user");
var ses_js_1 = require("../../services/ses.js");
var SharePermission = /** @class */ (function () {
    function SharePermission(appName, token) {
        this.appName = appName;
        this.token = token;
    }
    SharePermission.prototype.getBaseData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var appData, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.query("SELECT domain, brand,user FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config WHERE  (user = ? and appName = ?)\n                                                                                         OR appName in (\n                                                                                          (SELECT appName FROM `").concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config\n                        WHERE user = ? AND status = 1 AND invited = 1 AND appName = ?)\n                        );\n                "), [this.token.userID, this.appName, this.token.userID, this.appName])];
                    case 1:
                        appData = (_a.sent())[0];
                        return [2 /*return*/, appData === undefined
                                ? undefined
                                : {
                                    saas: config_1.saasConfig.SAAS_NAME, // glitter
                                    brand: appData.brand, // shopnex
                                    domain: appData.domain, // domain
                                    app: this.appName, // app name
                                    user: appData.user
                                }];
                    case 2:
                        e_1 = _a.sent();
                        throw exception_js_1.default.BadRequestError('ERROR', 'getBaseData ERROR: ' + e_1, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePermission.prototype.getStoreAuth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var appData, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config WHERE appName = ? AND user = ?;\n                "), [this.appName, this.token.userID])];
                    case 1:
                        appData = (_a.sent())[0];
                        return [2 /*return*/, appData];
                    case 2:
                        e_2 = _a.sent();
                        throw exception_js_1.default.BadRequestError('ERROR', 'getBaseData ERROR: ' + e_2, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePermission.prototype.getPermission = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            function statusFilter(data, query) {
                return data.filter(function (item) {
                    if (query === 'yes') {
                        return item.status === 1;
                    }
                    if (query === 'no') {
                        return item.status === 0;
                    }
                    return true;
                });
            }
            function searchFilter(data, field, query) {
                return data.filter(function (item) {
                    if (field === 'name') {
                        return item.config.name.toLowerCase().includes(query.toLowerCase());
                    }
                    if (field === 'email') {
                        return item.email.toLowerCase().includes(query.toLowerCase());
                    }
                    if (field === 'phone') {
                        return item.config.phone.includes(query);
                    }
                    return true;
                });
            }
            function sortByName(data) {
                data.sort(function (a, b) { return a.config.name.localeCompare(b.config.name); });
            }
            function sortByOnlineTime(data, order) {
                data.sort(function (a, b) {
                    if (order === 'asc') {
                        return new Date(a.online_time).getTime() - new Date(b.online_time).getTime();
                    }
                    else if (order === 'desc') {
                        return new Date(b.online_time).getTime() - new Date(a.online_time).getTime();
                    }
                    return 0;
                });
            }
            var base, authConfig, page, limit, start, end, querySQL, selectEmails, auths, user_data, users_1, authDataList, user_data, e_3;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 12, , 13]);
                        return [4 /*yield*/, this.getBaseData()];
                    case 1:
                        base = _c.sent();
                        if (!!base) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getStoreAuth()];
                    case 2:
                        authConfig = _c.sent();
                        if (authConfig) {
                            return [2 /*return*/, {
                                    result: true,
                                    store_permission_title: 'employee',
                                    data: [authConfig],
                                }];
                        }
                        return [2 /*return*/, []];
                    case 3:
                        page = (_a = json.page) !== null && _a !== void 0 ? _a : 0;
                        limit = (_b = json.limit) !== null && _b !== void 0 ? _b : 20;
                        start = page * limit;
                        end = page * limit + limit;
                        querySQL = ['1=1'];
                        if (!json.email) return [3 /*break*/, 5];
                        return [4 /*yield*/, database_1.default.query("SELECT userID FROM `".concat(base.brand, "`.t_user WHERE account in (").concat(json.email
                                .split(',')
                                .map(function (email) { return "\"".concat(email, "\""); })
                                .join(','), ");\n                    "), [])];
                    case 4:
                        selectEmails = _c.sent();
                        if (selectEmails.length === 0)
                            return [2 /*return*/, []];
                        querySQL.push("user in (".concat(selectEmails.map(function (user) { return user.userID; }).join(','), ")"));
                        _c.label = 5;
                    case 5: return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config\n                    WHERE appName = ? AND ").concat(querySQL.join(' AND '), ";\n                "), [base.app])];
                    case 6:
                        auths = _c.sent();
                        if (!(auths.length === 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, new user_1.User(base.brand).getUserData("".concat(base.user), 'userID')];
                    case 7:
                        user_data = _c.sent();
                        user_data.userData.auth_config = user_data.userData.auth_config || {
                            pin: user_data.userData.pin,
                            auth: [],
                            name: user_data.userData.name,
                            phone: user_data.userData.phone,
                            title: '管理員',
                            member_id: ''
                        };
                        return [2 /*return*/, {
                                data: [{
                                        id: -1,
                                        user: "".concat(base.user),
                                        appName: this.appName,
                                        config: user_data.userData.auth_config,
                                        email: user_data.account,
                                        invited: 1,
                                        status: 1,
                                        online_time: new Date()
                                    }],
                                total: 0,
                                store_permission_title: 'owner',
                            }];
                    case 8: return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(base.brand, "`.t_user WHERE userID in (").concat(auths
                            .map(function (item) {
                            return item.user;
                        })
                            .join(','), ");\n                "), [])];
                    case 9:
                        users_1 = _c.sent();
                        authDataList = auths.map(function (item) {
                            var data = users_1.find(function (u) { return u.userID == item.user; });
                            if (data) {
                                item.email = data.account;
                                item.online_time = data.online_time;
                            }
                            return item;
                        });
                        if (json.status === 'yes' || json.status === 'no') {
                            authDataList = statusFilter(authDataList, json.status);
                        }
                        if (json.queryType && json.query) {
                            authDataList = searchFilter(authDataList, json.queryType, json.query);
                        }
                        switch (json.orderBy) {
                            case 'name':
                                sortByName(authDataList);
                                break;
                            case 'online_time_asc':
                                sortByOnlineTime(authDataList, 'asc');
                                break;
                            case 'online_time_desc':
                                sortByOnlineTime(authDataList, 'desc');
                                break;
                            default:
                                break;
                        }
                        if (!base) return [3 /*break*/, 11];
                        return [4 /*yield*/, new user_1.User(base.brand).getUserData("".concat(base.user), 'userID')];
                    case 10:
                        user_data = _c.sent();
                        user_data.userData.auth_config = user_data.userData.auth_config || {
                            pin: user_data.userData.pin,
                            auth: [],
                            name: user_data.userData.name,
                            phone: user_data.userData.phone,
                            title: '管理員',
                            member_id: ''
                        };
                        authDataList.unshift({
                            id: -1,
                            user: "".concat(base.user),
                            appName: this.appName,
                            config: user_data.userData.auth_config,
                            email: user_data.account,
                            invited: 1,
                            status: 1,
                            online_time: new Date()
                        });
                        _c.label = 11;
                    case 11: return [2 /*return*/, {
                            data: authDataList.slice(start, end),
                            total: authDataList.length,
                            store_permission_title: 'owner',
                        }];
                    case 12:
                        e_3 = _c.sent();
                        throw exception_js_1.default.BadRequestError('ERROR', 'getPermission ERROR: ' + e_3, null);
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    SharePermission.prototype.setPermission = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var base, userData, findAuth, authData, redirect_url, storeData, keyValue, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 15, , 16]);
                        return [4 /*yield*/, this.getBaseData()];
                    case 1:
                        base = _a.sent();
                        if (!base) {
                            return [2 /*return*/, { result: false }];
                        }
                        return [4 /*yield*/, database_1.default.query("SELECT userID,userData FROM `".concat(base.brand, "`.t_user WHERE account = ?;\n                "), [data.email])];
                    case 2:
                        userData = (_a.sent())[0];
                        if (!(userData === undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config \n                        WHERE JSON_EXTRACT(config, '$.verifyEmail') = ? ;\n                        "), [data.email, base.app])];
                    case 3:
                        findAuth = (_a.sent())[0];
                        if (findAuth) {
                            userData = { userID: findAuth.user };
                        }
                        else {
                            userData = { userID: user_1.User.generateUserID() };
                        }
                        data.config.verifyEmail = data.email;
                        _a.label = 4;
                    case 4:
                        if (!(userData.userID === this.token.userID)) return [3 /*break*/, 6];
                        userData.userData.auth_config = data.config;
                        return [4 /*yield*/, database_1.default.query("update `".concat(base.brand, "`.t_user set userData=? where account = ?"), [JSON.stringify(userData.userData), data.email])];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, { result: true }];
                    case 6: return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config WHERE user = ? AND appName = ?;\n                "), [userData.userID, base.app])];
                    case 7:
                        authData = (_a.sent())[0];
                        redirect_url = undefined;
                        if (!authData) return [3 /*break*/, 9];
                        return [4 /*yield*/, database_1.default.query("UPDATE `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config\n                        SET ?\n                        WHERE id = ?"), [
                                {
                                    config: JSON.stringify(data.config),
                                    updated_time: new Date(),
                                    status: data.status === 1 ? 1 : 0,
                                },
                                authData.id,
                            ])];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 14];
                    case 9: return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(base.app, "`.t_user_public_config WHERE `key` = 'store-information' AND user_id = 'manager';\n                        "), [])];
                    case 10:
                        storeData = (_a.sent())[0];
                        if (!storeData || !storeData.value.shop_name) {
                            return [2 /*return*/, { result: false, message: '請先至「商店訊息」<br />新增你的商店名稱' }];
                        }
                        return [4 /*yield*/, database_1.default.query("INSERT INTO `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config SET ?"), [
                                {
                                    user: userData.userID,
                                    appName: base.app,
                                    config: JSON.stringify(data.config),
                                    status: 1,
                                    invited: 0
                                },
                            ])];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, SharePermission.generateToken({
                                userId: userData.userID,
                                appName: base.app,
                            })];
                    case 12:
                        keyValue = _a.sent();
                        redirect_url = new URL("".concat(process.env.DOMAIN, "/api-public/v1/user/permission/redirect"));
                        redirect_url.searchParams.set('key', keyValue);
                        redirect_url.searchParams.set('g-app', base.app);
                        if (!(data.config.come_from !== 'pos')) return [3 /*break*/, 14];
                        return [4 /*yield*/, (0, ses_js_1.sendmail)('service@ncdesign.info', data.email, '商店權限分享邀請信', "\u300C".concat(storeData.value.shop_name, "\u300D\u9080\u8ACB\u4F60\u52A0\u5165\u4ED6\u7684\u5546\u5E97\uFF0C\u9EDE\u64CA\u6B64\u9023\u7D50\u5373\u53EF\u958B\u555F\u6B0A\u9650\uFF1A").concat(redirect_url))];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14: return [2 /*return*/, __assign(__assign(__assign({ result: true }, base), data), { redirect_url: redirect_url })];
                    case 15:
                        e_4 = _a.sent();
                        throw exception_js_1.default.BadRequestError('ERROR', 'setPermission ERROR: ' + e_4, null);
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    SharePermission.prototype.deletePermission = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var base, userData, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getBaseData()];
                    case 1:
                        base = _a.sent();
                        if (!base) {
                            return [2 /*return*/, { result: false }];
                        }
                        return [4 /*yield*/, database_1.default.query("SELECT userID FROM `".concat(base.brand, "`.t_user WHERE account = ?;\n                "), [email])];
                    case 2:
                        userData = (_a.sent())[0] || { userID: -999 };
                        return [4 /*yield*/, database_1.default.query("DELETE FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config WHERE  appName = ? and (user = ? or config->>'$.verifyEmail' = ? or user = ?);\n                "), [base.app, userData.userID, email, email])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, __assign(__assign({ result: true }, base), { email: email })];
                    case 4:
                        e_5 = _a.sent();
                        throw exception_js_1.default.BadRequestError('ERROR', 'setPermission ERROR: ' + e_5, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SharePermission.prototype.toggleStatus = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var base, userData, authData, bool, e_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getBaseData()];
                    case 1:
                        base = _b.sent();
                        if (!base) {
                            return [2 /*return*/, { result: false }];
                        }
                        return [4 /*yield*/, database_1.default.query("SELECT userID FROM `".concat(base.brand, "`.t_user WHERE account = ?;\n                    "), [email])];
                    case 2:
                        userData = (_a = (_b.sent())[0]) !== null && _a !== void 0 ? _a : { userID: -99 };
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config WHERE (user = ? or config->>'$.verifyEmail' = ?) AND appName = ?;\n                    "), [userData.userID, email, base.app])];
                    case 3:
                        authData = (_b.sent())[0];
                        if (!authData) return [3 /*break*/, 5];
                        bool = (authData.status - 1) * -1;
                        return [4 /*yield*/, database_1.default.query("UPDATE `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config\n                        SET ?\n                        WHERE id = ?"), [
                                {
                                    status: bool,
                                    updated_time: new Date(),
                                },
                                authData.id,
                            ])];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, __assign(__assign({ result: true }, base), { email: email, status: bool })];
                    case 5: return [2 /*return*/, { result: false }];
                    case 6:
                        e_6 = _b.sent();
                        throw exception_js_1.default.BadRequestError('ERROR', 'toggleStatus ERROR: ' + e_6, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SharePermission.prototype.triggerInvited = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var base, userData, authData, bool, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getBaseData()];
                    case 1:
                        base = _a.sent();
                        if (!base) {
                            return [2 /*return*/, { result: false }];
                        }
                        return [4 /*yield*/, database_1.default.query("SELECT userID FROM `".concat(base.brand, "`.t_user WHERE account = ?;\n                    "), [email])];
                    case 2:
                        userData = (_a.sent())[0];
                        if (userData === undefined) {
                            return [2 /*return*/, { result: false }];
                        }
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config WHERE user = ? AND appName = ?;\n                    "), [userData.userID, base.app])];
                    case 3:
                        authData = (_a.sent())[0];
                        if (!authData) return [3 /*break*/, 5];
                        bool = 1;
                        return [4 /*yield*/, database_1.default.query("UPDATE `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config\n                        SET ?\n                        WHERE id = ?"), [
                                {
                                    invited: bool,
                                    updated_time: new Date(),
                                },
                                authData.id,
                            ])];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, __assign(__assign({ result: true }, base), { email: email, invited: bool })];
                    case 5: return [2 /*return*/, { result: false }];
                    case 6:
                        e_7 = _a.sent();
                        throw exception_js_1.default.BadRequestError('ERROR', 'triggerInvited ERROR: ' + e_7, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SharePermission.generateToken = function (userObj) {
        return __awaiter(this, void 0, void 0, function () {
            var iat, expTime, payload, signedToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iat = Math.floor(Date.now() / 1000);
                        expTime = 3 * 24 * 60 * 60;
                        payload = {
                            userId: userObj.userId,
                            appName: userObj.appName,
                            iat: iat,
                            exp: iat + expTime,
                        };
                        signedToken = jsonwebtoken_1.default.sign(payload, config_js_1.default.SECRET_KEY);
                        return [4 /*yield*/, redis_js_1.default.setValue(signedToken, String(iat))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, signedToken];
                }
            });
        });
    };
    SharePermission.redirectHTML = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var appPermission, authData, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appPermission = jsonwebtoken_1.default.verify(token, config_js_1.default.SECRET_KEY);
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config WHERE user = ? AND appName = ?;\n                "), [appPermission.userId, appPermission.appName])];
                    case 1:
                        authData = (_a.sent())[0];
                        if (!authData) return [3 /*break*/, 3];
                        return [4 /*yield*/, database_1.default.query("UPDATE `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config\n                    SET ?\n                    WHERE id = ?"), [
                                {
                                    invited: 1,
                                    updated_time: new Date(),
                                },
                                authData.id,
                            ])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        html = String.raw;
                        return [2 /*return*/, html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<!DOCTYPE html>\n            <html lang=\"en\">\n                <head>\n                    <meta charset=\"UTF-8\" />\n                    <title>Title</title>\n                </head>\n                <body>\n                    <script>\n                        try {\n                            window.webkit.messageHandlers.addJsInterFace.postMessage(\n                                JSON.stringify({\n                                    functionName: 'closeWebView',\n                                    callBackId: 0,\n                                    data: {\n                                        redirect: 'https://shopnex.tw/login',\n                                    },\n                                })\n                            );\n                        } catch (e) {}\n                        location.href = 'https://shopnex.tw/login';\n                    </script>\n                </body>\n            </html> "], ["<!DOCTYPE html>\n            <html lang=\"en\">\n                <head>\n                    <meta charset=\"UTF-8\" />\n                    <title>Title</title>\n                </head>\n                <body>\n                    <script>\n                        try {\n                            window.webkit.messageHandlers.addJsInterFace.postMessage(\n                                JSON.stringify({\n                                    functionName: 'closeWebView',\n                                    callBackId: 0,\n                                    data: {\n                                        redirect: 'https://shopnex.tw/login',\n                                    },\n                                })\n                            );\n                        } catch (e) {}\n                        location.href = 'https://shopnex.tw/login';\n                    </script>\n                </body>\n            </html> "])))];
                }
            });
        });
    };
    return SharePermission;
}());
exports.SharePermission = SharePermission;
var templateObject_1;

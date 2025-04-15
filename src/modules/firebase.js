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
exports.Firebase = void 0;
var path_1 = require("path");
var firebase_admin_1 = require("firebase-admin");
var config_1 = require("../config");
var database_1 = require("../modules/database");
var web_socket_js_1 = require("../services/web-socket.js");
var caught_error_js_1 = require("./caught-error.js");
var Firebase = /** @class */ (function () {
    function Firebase(app) {
        this.app = '';
        this.app = app;
    }
    Firebase.initial = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("fireBaseInitial:".concat(firebase_admin_1.default.credential.cert(path_1.default.resolve(config_1.ConfigSetting.config_path, "../".concat(process.env.firebase)))));
                firebase_admin_1.default.initializeApp({
                    credential: firebase_admin_1.default.credential.cert(path_1.default.resolve(config_1.ConfigSetting.config_path, "../".concat(process.env.firebase)))
                }, 'glitter');
                firebase_admin_1.default.initializeApp({
                    credential: firebase_admin_1.default.credential.cert(path_1.default.resolve(config_1.ConfigSetting.config_path, "../".concat(process.env.firebase)))
                });
                return [2 /*return*/];
            });
        });
    };
    Firebase.appRegister = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(cf.type === 'ios')) return [3 /*break*/, 2];
                        // 註冊 iOS 應用
                        return [4 /*yield*/, firebase_admin_1.default
                                .projectManagement().createIosApp(cf.appID, cf.appName)];
                    case 1:
                        // 註冊 iOS 應用
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: 
                    // 註冊 Android 應用
                    return [4 /*yield*/, firebase_admin_1.default
                            .projectManagement().createAndroidApp(cf.appID, cf.appName)];
                    case 3:
                        // 註冊 Android 應用
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Firebase.getConfig = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, b, _b, _c, b, e_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 16, , 17]);
                        if (!(cf.type === 'ios')) return [3 /*break*/, 8];
                        _i = 0;
                        return [4 /*yield*/, (firebase_admin_1.default
                                .projectManagement().listIosApps())];
                    case 1:
                        _a = (_d.sent());
                        _d.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        b = _a[_i];
                        return [4 /*yield*/, b.getMetadata()];
                    case 3:
                        if (!((_d.sent()).bundleId === cf.appID)) return [3 /*break*/, 6];
                        return [4 /*yield*/, b.setDisplayName(cf.appDomain)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, b.getConfig()];
                    case 5: return [2 /*return*/, (_d.sent())];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 15];
                    case 8:
                        _b = 0;
                        return [4 /*yield*/, (firebase_admin_1.default
                                .projectManagement().listAndroidApps())];
                    case 9:
                        _c = (_d.sent());
                        _d.label = 10;
                    case 10:
                        if (!(_b < _c.length)) return [3 /*break*/, 15];
                        b = _c[_b];
                        return [4 /*yield*/, b.getMetadata()];
                    case 11:
                        if (!((_d.sent()).packageName === cf.appID)) return [3 /*break*/, 14];
                        return [4 /*yield*/, b.setDisplayName(cf.appDomain)];
                    case 12:
                        _d.sent();
                        return [4 /*yield*/, b.getConfig()];
                    case 13: return [2 /*return*/, (_d.sent())];
                    case 14:
                        _b++;
                        return [3 /*break*/, 10];
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        e_2 = _d.sent();
                        console.log(e_2);
                        return [2 /*return*/, ''];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    Firebase.prototype.sendMessage = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                cf.body = cf.body.replace(/<br\s*\/?>/gi, '\n');
                if (cf.userID) {
                    web_socket_js_1.WebSocket.noticeChangeMem[cf.userID] && web_socket_js_1.WebSocket.noticeChangeMem[cf.userID].map(function (d2) {
                        d2.callback({
                            type: 'notice_count_change',
                        });
                    });
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, user_cf, _i, _b, token;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (!cf.userID) return [3 /*break*/, 6];
                                    _a = cf;
                                    return [4 /*yield*/, database_1.default.query("SELECT deviceToken\n                                            FROM `".concat(cf.app || this.app, "`.t_fcm\n                                            where userID = ?;"), [cf.userID])];
                                case 1:
                                    _a.token = (_d.sent()).map(function (dd) {
                                        return dd.deviceToken;
                                    });
                                    return [4 /*yield*/, database_1.default.query("select `value`\n                                                   from `".concat(cf.app || this.app, "`.t_user_public_config\n                                                   where `key` ='notify_setting' and user_id=?"), [cf.userID])];
                                case 2:
                                    user_cf = ((_c = ((_d.sent())[0])) !== null && _c !== void 0 ? _c : { value: {} }).value;
                                    if (!("".concat(user_cf[cf.tag]) !== 'false')) return [3 /*break*/, 5];
                                    if (!(cf.userID && cf.tag && cf.title && cf.body && cf.link && !cf.pass_store)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, database_1.default.query("insert into `".concat(cf.app || this.app, "`.t_notice (user_id, tag, title, content, link)\n                                        values (?, ?, ?, ?, ?)"), [
                                            cf.userID,
                                            cf.tag,
                                            cf.title,
                                            cf.body,
                                            cf.link
                                        ])];
                                case 3:
                                    _d.sent();
                                    _d.label = 4;
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    resolve(true);
                                    return [2 /*return*/];
                                case 6:
                                    if (typeof cf.token === 'string') {
                                        cf.token = [cf.token];
                                    }
                                    if (Array.isArray(cf.token)) {
                                        for (_i = 0, _b = cf.token; _i < _b.length; _i++) {
                                            token = _b[_i];
                                            try {
                                                firebase_admin_1.default.apps.find(function (dd) {
                                                    return (dd === null || dd === void 0 ? void 0 : dd.name) === 'glitter';
                                                }).messaging().send({
                                                    notification: {
                                                        title: cf.title,
                                                        body: cf.body.replace(/<br>/g, ''),
                                                    },
                                                    android: {
                                                        notification: {
                                                            sound: 'default'
                                                        },
                                                    },
                                                    apns: {
                                                        payload: {
                                                            aps: {
                                                                sound: 'default'
                                                            },
                                                        },
                                                    },
                                                    data: {
                                                        link: "".concat(cf.link || '')
                                                    },
                                                    "token": token
                                                }).then(function (response) {
                                                    console.log('成功發送推播：', response);
                                                }).catch(function (error) {
                                                    console.error('發送推播時發生錯誤：', error);
                                                });
                                            }
                                            catch (e) {
                                                caught_error_js_1.CaughtError.warning('fcm', "firebase->74", "".concat(e));
                                            }
                                        }
                                    }
                                    resolve(true);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return Firebase;
}());
exports.Firebase = Firebase;

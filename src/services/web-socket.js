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
exports.PosCallback = exports.WebSocket = void 0;
var ws_1 = require("ws");
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("../config");
var redis_js_1 = require("../modules/redis.js");
var ut_permission_js_1 = require("../api-public/utils/ut-permission.js");
var WebSocket = /** @class */ (function () {
    function WebSocket() {
    }
    WebSocket.start = function () {
        WebSocket.userMessage();
    };
    WebSocket.userMessage = function () {
        var wss = new ws_1.WebSocket.Server({ port: 9003 });
        wss.on('connection', function connection(ws) {
            var event = {
                close: []
            };
            var id = new Date().getTime();
            console.log('Client connected');
            ws.on('message', function incoming(message) {
                return __awaiter(this, void 0, void 0, function () {
                    var json, chat_key, cf_1, token, redisToken, _a, da_1, e_1, cf_2, token, redisToken, _b, pa_1, e_2, cf, token, redisToken, _c, e_3, cf, token, redisToken, _d, e_4, cf, token, redisToken, _e, e_5;
                    var _f, _g, _h, _j, _k, _l;
                    return __generator(this, function (_m) {
                        switch (_m.label) {
                            case 0:
                                console.log('received: %s', message);
                                json = JSON.parse(message);
                                chat_key = json.app_name + json.chatID;
                                if (!(json.type === 'message')) return [3 /*break*/, 1];
                                WebSocket.chatMemory[chat_key] = (_f = WebSocket.chatMemory[chat_key]) !== null && _f !== void 0 ? _f : [];
                                WebSocket.chatMemory[chat_key].push({
                                    id: id,
                                    user_id: json.user_id,
                                    callback: function (data) {
                                        ws.send(JSON.stringify(data));
                                    }
                                });
                                event.close.push(function () {
                                    WebSocket.chatMemory[chat_key] = WebSocket.chatMemory[chat_key].filter(function (dd) {
                                        return dd.id !== id;
                                    });
                                });
                                return [3 /*break*/, 37];
                            case 1:
                                if (!(json.type === 'message-count-change')) return [3 /*break*/, 2];
                                json.user_id = "".concat(json.user_id);
                                WebSocket.messageChangeMem[json.user_id] = (_g = WebSocket.messageChangeMem[json.user_id]) !== null && _g !== void 0 ? _g : [];
                                WebSocket.messageChangeMem[json.user_id].push({
                                    id: id,
                                    callback: function (data) {
                                        ws.send(JSON.stringify(data));
                                    }
                                });
                                event.close.push(function () {
                                    WebSocket.messageChangeMem[json.user_id] = WebSocket.messageChangeMem[json.user_id].filter(function (dd) {
                                        return dd.id !== id;
                                    });
                                });
                                return [3 /*break*/, 37];
                            case 2:
                                if (!(json.type === 'notice_count_change')) return [3 /*break*/, 3];
                                json.user_id = "".concat(json.user_id);
                                WebSocket.noticeChangeMem[json.user_id] = (_h = WebSocket.noticeChangeMem[json.user_id]) !== null && _h !== void 0 ? _h : [];
                                WebSocket.noticeChangeMem[json.user_id].push({
                                    id: id,
                                    callback: function (data) {
                                        ws.send(JSON.stringify(data));
                                    }
                                });
                                event.close.push(function () {
                                    WebSocket.noticeChangeMem[json.user_id] = WebSocket.noticeChangeMem[json.user_id].filter(function (dd) {
                                        return dd.id !== id;
                                    });
                                });
                                return [3 /*break*/, 37];
                            case 3:
                                if (!(json.type === 'add_post_device')) return [3 /*break*/, 10];
                                cf_1 = json;
                                _m.label = 4;
                            case 4:
                                _m.trys.push([4, 8, , 9]);
                                token = jsonwebtoken_1.default.verify(cf_1.token, config_1.config.SECRET_KEY);
                                return [4 /*yield*/, redis_js_1.default.getValue(cf_1.token)];
                            case 5:
                                redisToken = _m.sent();
                                _a = redisToken;
                                if (!_a) return [3 /*break*/, 7];
                                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManagerTokenCheck(cf_1.app_name, "".concat(token.userID))];
                            case 6:
                                _a = (_m.sent());
                                _m.label = 7;
                            case 7:
                                if (_a) {
                                    console.log("\u6210\u529F\u52A0\u5165\u88DD\u7F6E\u81F3".concat(cf_1.app_name, ":").concat(cf_1.device_id));
                                    WebSocket.posDeviceList[cf_1.app_name] = (_j = WebSocket.posDeviceList[cf_1.app_name]) !== null && _j !== void 0 ? _j : [];
                                    da_1 = {
                                        device_id: cf_1.device_id,
                                        callback: function (json) {
                                            ws.send(JSON.stringify(json));
                                        },
                                        connect_device: ''
                                    };
                                    WebSocket.posDeviceList[cf_1.app_name].push(da_1);
                                    PosCallback.updateDevice(cf_1.app_name);
                                    event.close.push(function () {
                                        console.log("\u6210\u529F\u79FB\u9664\u88DD\u7F6E\u81F3".concat(cf_1.app_name, ":").concat(cf_1.device_id));
                                        WebSocket.posDeviceList[cf_1.app_name] = WebSocket.posDeviceList[cf_1.app_name].filter(function (dd) {
                                            return dd.device_id !== cf_1.device_id;
                                        });
                                        //通知斷線
                                        if (da_1.connect_device) {
                                            PosCallback.disconnect_paired(da_1.device_id, da_1.connect_device, cf_1.app_name);
                                        }
                                        PosCallback.updateDevice(cf_1.app_name);
                                    });
                                }
                                return [3 /*break*/, 9];
                            case 8:
                                e_1 = _m.sent();
                                console.log(e_1);
                                return [3 /*break*/, 9];
                            case 9: return [3 /*break*/, 37];
                            case 10:
                                if (!(json.type === 'get_post_device')) return [3 /*break*/, 17];
                                cf_2 = json;
                                _m.label = 11;
                            case 11:
                                _m.trys.push([11, 15, , 16]);
                                token = jsonwebtoken_1.default.verify(cf_2.token, config_1.config.SECRET_KEY);
                                return [4 /*yield*/, redis_js_1.default.getValue(cf_2.token)];
                            case 12:
                                redisToken = _m.sent();
                                _b = redisToken;
                                if (!_b) return [3 /*break*/, 14];
                                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManagerTokenCheck(cf_2.app_name, "".concat(token.userID))];
                            case 13:
                                _b = (_m.sent());
                                _m.label = 14;
                            case 14:
                                if (_b) {
                                    WebSocket.posDeviceList[cf_2.app_name] = (_k = WebSocket.posDeviceList[cf_2.app_name]) !== null && _k !== void 0 ? _k : [];
                                    WebSocket.getDeviceList[cf_2.app_name] = (_l = WebSocket.getDeviceList[cf_2.app_name]) !== null && _l !== void 0 ? _l : [];
                                    pa_1 = {
                                        callback: function (data) {
                                            ws.send(JSON.stringify(data));
                                        },
                                        device_id: cf_2.device_id,
                                        connect_device: ''
                                    };
                                    WebSocket.getDeviceList[cf_2.app_name].push(pa_1);
                                    PosCallback.updateDevice(cf_2.app_name);
                                    event.close.push(function () {
                                        console.log("\u6210\u529F\u79FB\u9664\u88DD\u7F6E".concat(cf_2.app_name, ":").concat(cf_2.device_id));
                                        WebSocket.getDeviceList[cf_2.app_name] = WebSocket.getDeviceList[cf_2.app_name].filter(function (dd) {
                                            return dd.device_id !== cf_2.device_id;
                                        });
                                        //通知斷線
                                        if (pa_1.connect_device) {
                                            PosCallback.disconnect_device(pa_1.device_id, pa_1.connect_device, cf_2.app_name);
                                        }
                                    });
                                }
                                return [3 /*break*/, 16];
                            case 15:
                                e_2 = _m.sent();
                                return [3 /*break*/, 16];
                            case 16: return [3 /*break*/, 37];
                            case 17:
                                if (!(json.type === 'connect')) return [3 /*break*/, 24];
                                cf = json;
                                _m.label = 18;
                            case 18:
                                _m.trys.push([18, 22, , 23]);
                                token = jsonwebtoken_1.default.verify(cf.token, config_1.config.SECRET_KEY);
                                return [4 /*yield*/, redis_js_1.default.getValue(cf.token)];
                            case 19:
                                redisToken = _m.sent();
                                _c = redisToken;
                                if (!_c) return [3 /*break*/, 21];
                                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManagerTokenCheck(cf.app_name, "".concat(token.userID))];
                            case 20:
                                _c = (_m.sent());
                                _m.label = 21;
                            case 21:
                                if (_c) {
                                    //連線至裝置
                                    PosCallback.connect(cf.device_id, cf.connect, cf.app_name);
                                }
                                return [3 /*break*/, 23];
                            case 22:
                                e_3 = _m.sent();
                                console.log(e_3);
                                return [3 /*break*/, 23];
                            case 23: return [3 /*break*/, 37];
                            case 24:
                                if (!(json.type === 'send_to_pos')) return [3 /*break*/, 31];
                                cf = json;
                                _m.label = 25;
                            case 25:
                                _m.trys.push([25, 29, , 30]);
                                token = jsonwebtoken_1.default.verify(cf.token, config_1.config.SECRET_KEY);
                                return [4 /*yield*/, redis_js_1.default.getValue(cf.token)];
                            case 26:
                                redisToken = _m.sent();
                                _d = redisToken;
                                if (!_d) return [3 /*break*/, 28];
                                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManagerTokenCheck(cf.app_name, "".concat(token.userID))];
                            case 27:
                                _d = (_m.sent());
                                _m.label = 28;
                            case 28:
                                if (_d) {
                                    //連線至裝置
                                    PosCallback.sendToPos(cf.connect, cf.app_name, cf.data);
                                }
                                return [3 /*break*/, 30];
                            case 29:
                                e_4 = _m.sent();
                                console.log(e_4);
                                return [3 /*break*/, 30];
                            case 30: return [3 /*break*/, 37];
                            case 31:
                                if (!(json.type === 'send_to_paired')) return [3 /*break*/, 37];
                                cf = json;
                                _m.label = 32;
                            case 32:
                                _m.trys.push([32, 36, , 37]);
                                token = jsonwebtoken_1.default.verify(cf.token, config_1.config.SECRET_KEY);
                                return [4 /*yield*/, redis_js_1.default.getValue(cf.token)];
                            case 33:
                                redisToken = _m.sent();
                                _e = redisToken;
                                if (!_e) return [3 /*break*/, 35];
                                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManagerTokenCheck(cf.app_name, "".concat(token.userID))];
                            case 34:
                                _e = (_m.sent());
                                _m.label = 35;
                            case 35:
                                if (_e) {
                                    //連線至裝置
                                    PosCallback.sendToPosReal(cf.connect, cf.app_name, cf.data);
                                }
                                return [3 /*break*/, 37];
                            case 36:
                                e_5 = _m.sent();
                                console.log(e_5);
                                return [3 /*break*/, 37];
                            case 37: return [2 /*return*/];
                        }
                    });
                });
            });
            ws.on('close', function close() {
                console.log('Client disconnected');
                event.close.map(function (dd) {
                    dd();
                });
            });
        });
    };
    WebSocket.chatMemory = {};
    WebSocket.messageChangeMem = {};
    WebSocket.noticeChangeMem = {};
    WebSocket.posDeviceList = {};
    WebSocket.getDeviceList = {};
    return WebSocket;
}());
exports.WebSocket = WebSocket;
var PosCallback = /** @class */ (function () {
    function PosCallback() {
    }
    //更新裝置
    PosCallback.updateDevice = function (app_name) {
        //通知裝置列表更新
        WebSocket.getDeviceList[app_name].map(function (dd) {
            dd.callback({
                type: 'device_list_updated',
                device_list: WebSocket.posDeviceList[app_name].filter(function (dd) {
                    return !dd.connect_device;
                }).map(function (dd) { return ({
                    device_id: dd.device_id
                }); })
            });
        });
    };
    //連線裝置
    PosCallback.connect = function (connect_id, device_id, app_name) {
        //Pos連線裝置
        var device = WebSocket.posDeviceList[app_name].find(function (dd) { return (dd.device_id === device_id) && !dd.connect_device; });
        //請求連線的裝置
        var req_paired = WebSocket.getDeviceList[app_name].find(function (dd) {
            return dd.device_id === connect_id;
        });
        console.log("\u914D\u5C0D\u88DD\u7F6E1", device);
        console.log("\u914D\u5C0D\u88DD\u7F6E2", req_paired);
        if (device && req_paired) {
            console.log("\u914D\u5C0D\u88DD\u7F6E\u6210\u529F");
            device.connect_device = req_paired.device_id;
            req_paired.connect_device = device.device_id;
            //通知連線
            req_paired.callback({ type: 'on_connected', connect_id: device.device_id });
            device.callback({ type: 'on_connected', connect_id: req_paired.device_id });
            //更新可連線列表
            PosCallback.updateDevice(app_name);
            console.log("\u5DF2\u6210\u529F\u9023\u7DDA\u81F3:".concat(device.device_id));
        }
        else if (req_paired) {
            //連線失敗通知
            req_paired.callback({ type: 'connected_false', connect_id: device_id });
        }
    };
    //解除裝置連線
    PosCallback.disconnect_device = function (connect_id, device_id, app_name) {
        //Pos連線裝置
        var device = WebSocket.posDeviceList[app_name].find(function (dd) { return (dd.device_id === device_id) && dd.connect_device === connect_id; });
        if (device) {
            device.connect_device = '';
            //連線失敗通知
            device.callback({ type: 'disconnect', connect_id: connect_id });
        }
    };
    //解除配對連線
    PosCallback.disconnect_paired = function (local, who, app_name) {
        //Pos連線裝置
        var device = WebSocket.getDeviceList[app_name].find(function (dd) { return (dd.device_id === who) && dd.connect_device === local; });
        if (device) {
            device.connect_device = '';
            //連線失敗通知
            device.callback({ type: 'disconnect', connect_id: who });
        }
    };
    //傳送訊息至Imin裝置
    PosCallback.sendToPos = function (device_id, app_name, data) {
        //Pos連線裝置
        var device = WebSocket.posDeviceList[app_name].find(function (dd) { return (dd.device_id === device_id); });
        if (device) {
            device.callback({
                type: "function",
                function: data
            });
        }
    };
    //傳送訊息至POS虛擬機
    PosCallback.sendToPosReal = function (device_id, app_name, data) {
        //Pos連線裝置
        var device = WebSocket.getDeviceList[app_name].find(function (dd) { return (dd.device_id === device_id); });
        if (device) {
            device.callback({
                type: "function",
                function: data
            });
        }
    };
    return PosCallback;
}());
exports.PosCallback = PosCallback;

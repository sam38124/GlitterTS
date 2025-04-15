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
exports.Chat = void 0;
var database_1 = require("../../modules/database");
var exception_1 = require("../../modules/exception");
var ut_database_js_1 = require("../utils/ut-database.js");
var user_js_1 = require("./user.js");
var ses_js_1 = require("../../services/ses.js");
var app_js_1 = require("../../services/app.js");
var web_socket_js_1 = require("../../services/web-socket.js");
var firebase_js_1 = require("../../modules/firebase.js");
var auto_send_email_js_1 = require("./auto-send-email.js");
var ai_robot_js_1 = require("./ai-robot.js");
var fb_message_js_1 = require("./fb-message.js");
var line_message_js_1 = require("./line-message.js");
var notify_js_1 = require("./notify.js");
var Jimp = require('jimp');
var Chat = /** @class */ (function () {
    function Chat(app, token) {
        this.app = app;
        if (token) {
            this.token = token;
        }
    }
    Chat.prototype.addChatRoom = function (room) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, b, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 11, , 12]);
                        if (room.type === 'user') {
                            room.chat_id = room.participant.sort().join('-');
                        }
                        else {
                            room.chat_id = generateChatID();
                        }
                        return [4 /*yield*/, database_1.default.query("select count(1)\n                         from `".concat(this.app, "`.t_chat_list\n                         where chat_id = ?"), [room.chat_id])];
                    case 1:
                        if (!((_b.sent())[0]['count(1)'] === 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, database_1.default.query("INSERT INTO `".concat(this.app, "`.`t_chat_list`\n                     SET ?"), [
                                {
                                    chat_id: room.chat_id,
                                    type: room.type,
                                    info: room.info,
                                },
                            ])];
                    case 2:
                        _b.sent();
                        _i = 0, _a = room.participant;
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        b = _a[_i];
                        return [4 /*yield*/, database_1.default.query("\n                            insert into `".concat(this.app, "`.`t_chat_participants`\n                            set ?\n                        "), [
                                {
                                    chat_id: room.chat_id,
                                    user_id: b,
                                },
                            ])];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, database_1.default.query("delete\n                         from `".concat(this.app, "`.`t_chat_last_read`\n                         where user_id = ?\n                           and chat_id = ?"), [b, room.chat_id])];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, database_1.default.query("\n                            insert into `".concat(this.app, "`.`t_chat_last_read`\n                            set ?\n                        "), [
                                {
                                    chat_id: room.chat_id,
                                    user_id: b,
                                    last_read: (function () {
                                        var today = new Date();
                                        // 设置昨天的日期
                                        today.setDate(today.getDate() - 2);
                                        return today;
                                    })(),
                                },
                            ])];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8: return [2 /*return*/, {
                            result: 'OK',
                            create: true,
                        }];
                    case 9: return [2 /*return*/, {
                            result: 'OK',
                            create: false,
                        }];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        e_1 = _b.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'AddChatRoom Error:' + e_1, null);
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Chat.prototype.getChatRoom = function (qu, userID) {
        return __awaiter(this, void 0, void 0, function () {
            var start, query, data_1, e_2;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        start = new Date().getTime();
                        query = [];
                        qu.befor_id && query.push("id<".concat(qu.befor_id));
                        qu.after_id && query.push("id>".concat(qu.after_id));
                        qu.chat_id && query.push("chat_id=".concat(database_1.default.escape(qu.chat_id)));
                        query.push("chat_id in (SELECT chat_id FROM `".concat(this.app, "`.t_chat_participants where user_id=").concat(database_1.default.escape(userID), ")"));
                        qu.order_string = "order by updated_time desc";
                        return [4 /*yield*/, new ut_database_js_1.UtDatabase(this.app, "t_chat_list").querySql(query, qu)];
                    case 1:
                        data_1 = _b.sent();
                        // console.log(`查詢Chat-list:${((new Date().getTime()) - start) / 1000}`)
                        return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var pass, _loop_1, _i, _a, b;
                                var _this = this;
                                return __generator(this, function (_b) {
                                    pass = 0;
                                    _loop_1 = function (b) {
                                        new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                            var user, _a, _b, _c, e_3, e_4;
                                            var _d, _e;
                                            return __generator(this, function (_f) {
                                                switch (_f.label) {
                                                    case 0:
                                                        _f.trys.push([0, 7, , 8]);
                                                        if (!(b.type === 'user')) return [3 /*break*/, 6];
                                                        user = b.chat_id.split('-').find(function (dd) {
                                                            return dd !== userID;
                                                        });
                                                        _a = b;
                                                        return [4 /*yield*/, database_1.default.query("SELECT message, created_time\n                                         FROM `".concat(this.app, "`.t_chat_detail\n                                         where chat_id = ").concat(database_1.default.escape(b.chat_id), "\n                                         order by id desc limit 0,1;"), [])];
                                                    case 1:
                                                        _a.topMessage = (_f.sent())[0];
                                                        // console.log(`查詢topMessage:${((new Date().getTime()) - start) / 1000}`)
                                                        _b = b;
                                                        return [4 /*yield*/, database_1.default.query("SELECT count(1)\n                                         FROM `".concat(this.app, "`.t_chat_detail,\n                                              `").concat(this.app, "`.t_chat_last_read\n                                         where t_chat_detail.chat_id in (SELECT chat_id\n                                                                         FROM `").concat(this.app, "`.t_chat_participants\n                                                                         where user_id = ").concat(database_1.default.escape(userID), ")\n                                           and (t_chat_detail.chat_id != 'manager-preview')\n                                           and t_chat_detail.user_id!=").concat(database_1.default.escape(userID), "\n                                           and t_chat_detail.chat_id=").concat(database_1.default.escape(b.chat_id), "\n                                           and t_chat_detail.chat_id=t_chat_last_read.chat_id\n                                           and t_chat_last_read.last_read\n                                             < created_time "), [])];
                                                    case 2:
                                                        // console.log(`查詢topMessage:${((new Date().getTime()) - start) / 1000}`)
                                                        _b.unread = (_f.sent())[0]['count(1)'];
                                                        // console.log(`查詢unread:${((new Date().getTime()) - start) / 1000}`)
                                                        if (b.topMessage) {
                                                            b.topMessage.message.created_time = b.topMessage.created_time;
                                                            b.topMessage = b.topMessage && b.topMessage.message;
                                                        }
                                                        b.who = user;
                                                        if (!user) return [3 /*break*/, 6];
                                                        _f.label = 3;
                                                    case 3:
                                                        _f.trys.push([3, 5, , 6]);
                                                        _c = b;
                                                        return [4 /*yield*/, new user_js_1.User(this.app).getUserData(user, 'userID')];
                                                    case 4:
                                                        _c.user_data = (_e = ((_d = (_f.sent())) !== null && _d !== void 0 ? _d : {}).userData) !== null && _e !== void 0 ? _e : {};
                                                        return [3 /*break*/, 6];
                                                    case 5:
                                                        e_3 = _f.sent();
                                                        return [3 /*break*/, 6];
                                                    case 6:
                                                        resolve(true);
                                                        return [3 /*break*/, 8];
                                                    case 7:
                                                        e_4 = _f.sent();
                                                        resolve(false);
                                                        return [3 /*break*/, 8];
                                                    case 8: return [2 /*return*/];
                                                }
                                            });
                                        }); }).then(function () {
                                            pass++;
                                            if (pass === data_1.data.length) {
                                                resolve(true);
                                            }
                                        });
                                    };
                                    for (_i = 0, _a = data_1.data; _i < _a.length; _i++) {
                                        b = _a[_i];
                                        _loop_1(b);
                                    }
                                    if (pass === data_1.data.length) {
                                        resolve(true);
                                    }
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        // console.log(`查詢Chat-list:${((new Date().getTime()) - start) / 1000}`)
                        _b.sent();
                        // console.log(`查詢Chat-DATA:${((new Date().getTime()) - start) / 1000}`)
                        return [2 /*return*/, data_1];
                    case 3:
                        e_2 = _b.sent();
                        throw exception_1.default.BadRequestError((_a = e_2.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', 'GetChatRoom Error:' + e_2.message, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Chat.prototype.addMessage = function (room) {
        return __awaiter(this, void 0, void 0, function () {
            var chatRoom, newChatId, newChatId, user, particpant, insert, _i, _a, dd, userData_2, lastRead, _b, _c, dd, _loop_2, this_1, _d, particpant_1, b, notifyUser_1, userData, managerUser, _loop_3, this_2, _e, userData_1, dd, message_setting, ai_response_toggle, template, e_5;
            var _f, _g;
            var _this = this;
            var _h, _j, _k, _l, _m, _o, _p, _q, _r;
            return __generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        _s.trys.push([0, 34, , 35]);
                        return [4 /*yield*/, database_1.default.query("select *\n                     from `".concat(this.app, "`.t_chat_list\n                     where chat_id = ?"), [room.chat_id])];
                    case 1:
                        chatRoom = (_s.sent())[0];
                        if (!chatRoom) {
                            throw exception_1.default.BadRequestError('NO_CHATROOM', 'THIS CHATROOM DOES NOT EXISTS.', null);
                        }
                        if (!(room.chat_id.startsWith('line') && room.user_id == 'manager')) return [3 /*break*/, 3];
                        newChatId = room.chat_id.slice(5).split('-')[0];
                        return [4 /*yield*/, new line_message_js_1.LineMessage(this.app).sendLine({
                                data: room.message,
                                lineID: newChatId,
                            }, function () {
                            })];
                    case 2:
                        _s.sent();
                        _s.label = 3;
                    case 3:
                        if (!(room.chat_id.startsWith('fb') && room.user_id == 'manager')) return [3 /*break*/, 5];
                        newChatId = room.chat_id.slice(3).split('-')[0];
                        return [4 /*yield*/, new fb_message_js_1.FbMessage(this.app).sendMessage({
                                data: room.message,
                                fbID: newChatId,
                            }, function () {
                            })];
                    case 4:
                        _s.sent();
                        _s.label = 5;
                    case 5: return [4 /*yield*/, database_1.default.query("SELECT userID, userData\n                     FROM `".concat(this.app, "`.t_user\n                     where userID = ?"), [room.user_id])];
                    case 6:
                        user = (_s.sent())[0];
                        if (!room.user_id.startsWith('line')) return [3 /*break*/, 8];
                        _f = {};
                        return [4 /*yield*/, database_1.default.query("select info\n                                               from `".concat(this.app, "`.t_chat_list\n                                               where chat_id = ?"), [[room.user_id, 'manager'].sort().join('-')])];
                    case 7:
                        user = (_f.userData = (_s.sent())[0]['info']['line'],
                            _f.userID = -1,
                            _f);
                        return [3 /*break*/, 10];
                    case 8:
                        if (!room.user_id.startsWith('fb')) return [3 /*break*/, 10];
                        _g = {};
                        return [4 /*yield*/, database_1.default.query("select info\n                                               from `".concat(this.app, "`.t_chat_list\n                                               where chat_id = ?"), [[room.user_id, 'manager'].sort().join('-')])];
                    case 9:
                        user = (_g.userData = (_s.sent())[0]['info']['fb'],
                            _g.userID = -1,
                            _g);
                        _s.label = 10;
                    case 10: return [4 /*yield*/, database_1.default.query("SELECT *\n                 FROM `".concat(this.app, "`.t_chat_participants\n                 where chat_id = ?"), [room.chat_id])];
                    case 11:
                        particpant = _s.sent();
                        //更新聊天內容的時間點
                        return [4 /*yield*/, database_1.default.query("update `".concat(this.app, "`.t_chat_list\n                 set updated_time=NOW()\n                 where chat_id = ?"), [room.chat_id])];
                    case 12:
                        //更新聊天內容的時間點
                        _s.sent();
                        return [4 /*yield*/, database_1.default.query("\n                    insert into `".concat(this.app, "`.`t_chat_detail`\n                        (chat_id, user_id, message, created_time)\n                    values (?, ?, ?, NOW())\n                "), [room.chat_id, room.user_id, JSON.stringify(room.message)])];
                    case 13:
                        insert = _s.sent();
                        _i = 0, _a = (_h = web_socket_js_1.WebSocket.chatMemory[this.app + room.chat_id]) !== null && _h !== void 0 ? _h : [];
                        _s.label = 14;
                    case 14:
                        if (!(_i < _a.length)) return [3 /*break*/, 18];
                        dd = _a[_i];
                        return [4 /*yield*/, this.updateLastRead(dd.user_id, room.chat_id)];
                    case 15:
                        _s.sent();
                        return [4 /*yield*/, database_1.default.query("select userData\n                         from `".concat(this.app, "`.t_user\n                         where userID = ?"), [room.user_id])];
                    case 16:
                        userData_2 = (_s.sent())[0];
                        dd.callback({
                            id: insert.insertId,
                            chat_id: room.chat_id,
                            user_id: room.user_id,
                            message: room.message,
                            created_time: new Date(),
                            user_data: (userData_2 && userData_2.userData) || {},
                            type: 'message',
                        });
                        _s.label = 17;
                    case 17:
                        _i++;
                        return [3 /*break*/, 14];
                    case 18: return [4 /*yield*/, this.getLastRead(room.chat_id)];
                    case 19:
                        lastRead = _s.sent();
                        //manager-robot
                        for (_b = 0, _c = (_j = web_socket_js_1.WebSocket.chatMemory[this.app + room.chat_id]) !== null && _j !== void 0 ? _j : []; _b < _c.length; _b++) {
                            dd = _c[_b];
                            dd.callback({
                                type: 'update_read_count',
                                data: lastRead,
                            });
                        }
                        _loop_2 = function (b) {
                            var response, insert_1, _t, _u, dd, userData_3, lastRead_1, _v, _w, dd, post, robot, _x, _y, d, insert_2, _z, _0, dd, userData_4, lastRead_2, _1, _2, dd;
                            return __generator(this, function (_3) {
                                switch (_3.label) {
                                    case 0:
                                        if (!(b.user_id !== room.user_id)) return [3 /*break*/, 20];
                                        if (!['writer', 'order_analysis', 'operation_guide', 'design'].includes(b.user_id)) return [3 /*break*/, 9];
                                        return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a, _b, _c, _d, _e;
                                                var _f, _g, _h, _j;
                                                return __generator(this, function (_k) {
                                                    switch (_k.label) {
                                                        case 0:
                                                            _a = b.user_id;
                                                            switch (_a) {
                                                                case 'writer': return [3 /*break*/, 1];
                                                                case 'order_analysis': return [3 /*break*/, 3];
                                                                case 'operation_guide': return [3 /*break*/, 5];
                                                                case 'design': return [3 /*break*/, 7];
                                                            }
                                                            return [3 /*break*/, 9];
                                                        case 1:
                                                            _b = resolve;
                                                            return [4 /*yield*/, ai_robot_js_1.AiRobot.writer(this.app, (_f = room.message.text) !== null && _f !== void 0 ? _f : '')];
                                                        case 2:
                                                            _b.apply(void 0, [_k.sent()]);
                                                            return [2 /*return*/];
                                                        case 3:
                                                            _c = resolve;
                                                            return [4 /*yield*/, ai_robot_js_1.AiRobot.orderAnalysis(this.app, (_g = room.message.text) !== null && _g !== void 0 ? _g : '')];
                                                        case 4:
                                                            _c.apply(void 0, [_k.sent()]);
                                                            return [2 /*return*/];
                                                        case 5:
                                                            _d = resolve;
                                                            return [4 /*yield*/, ai_robot_js_1.AiRobot.guide(this.app, (_h = room.message.text) !== null && _h !== void 0 ? _h : '')];
                                                        case 6:
                                                            _d.apply(void 0, [_k.sent()]);
                                                            return [2 /*return*/];
                                                        case 7:
                                                            _e = resolve;
                                                            return [4 /*yield*/, ai_robot_js_1.AiRobot.design(this.app, (_j = room.message.text) !== null && _j !== void 0 ? _j : '')];
                                                        case 8:
                                                            _e.apply(void 0, [_k.sent()]);
                                                            return [2 /*return*/];
                                                        case 9: return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                    case 1:
                                        response = _3.sent();
                                        return [4 /*yield*/, database_1.default.query("\n                                insert into `".concat(this_1.app, "`.`t_chat_detail`\n                                    (chat_id, user_id, message, created_time)\n                                values (?, ?, ?, NOW())\n                            "), [room.chat_id, b.user_id, JSON.stringify(response)])];
                                    case 2:
                                        insert_1 = _3.sent();
                                        _t = 0, _u = (_k = web_socket_js_1.WebSocket.chatMemory[this_1.app + room.chat_id]) !== null && _k !== void 0 ? _k : [];
                                        _3.label = 3;
                                    case 3:
                                        if (!(_t < _u.length)) return [3 /*break*/, 7];
                                        dd = _u[_t];
                                        return [4 /*yield*/, database_1.default.query("select userData\n                                     from `".concat(this_1.app, "`.t_user\n                                     where userID = ?"), [b.user_id])];
                                    case 4:
                                        userData_3 = (_3.sent())[0];
                                        return [4 /*yield*/, this_1.updateLastRead(dd.user_id, room.chat_id)];
                                    case 5:
                                        _3.sent();
                                        dd.callback({
                                            id: insert_1.insertId,
                                            chat_id: room.chat_id,
                                            user_id: b.user_id,
                                            message: response,
                                            created_time: new Date(),
                                            user_data: (userData_3 && userData_3.userData) || {},
                                            type: 'message',
                                        });
                                        _3.label = 6;
                                    case 6:
                                        _t++;
                                        return [3 /*break*/, 3];
                                    case 7: return [4 /*yield*/, this_1.getLastRead(room.chat_id)];
                                    case 8:
                                        lastRead_1 = _3.sent();
                                        for (_v = 0, _w = (_l = web_socket_js_1.WebSocket.chatMemory[this_1.app + room.chat_id]) !== null && _l !== void 0 ? _l : []; _v < _w.length; _v++) {
                                            dd = _w[_v];
                                            dd.callback({
                                                type: 'update_read_count',
                                                data: lastRead_1,
                                            });
                                        }
                                        return [3 /*break*/, 20];
                                    case 9:
                                        post = new user_js_1.User(this_1.app, this_1.token);
                                        return [4 /*yield*/, post.getConfig({
                                                key: 'robot_auto_reply',
                                                user_id: b.user_id,
                                            })];
                                    case 10:
                                        robot = (_o = ((_m = (_3.sent())[0]) !== null && _m !== void 0 ? _m : {})['value']) !== null && _o !== void 0 ? _o : {};
                                        if (!robot.question) return [3 /*break*/, 20];
                                        _x = 0, _y = robot.question;
                                        _3.label = 11;
                                    case 11:
                                        if (!(_x < _y.length)) return [3 /*break*/, 20];
                                        d = _y[_x];
                                        if (!(d.ask === room.message.text)) return [3 /*break*/, 19];
                                        return [4 /*yield*/, database_1.default.query("\n                                            insert into `".concat(this_1.app, "`.`t_chat_detail`\n                                                (chat_id, user_id, message, created_time)\n                                            values (?, ?, ?, NOW())\n                                        "), [
                                                room.chat_id,
                                                b.user_id,
                                                JSON.stringify({
                                                    text: d.response,
                                                }),
                                            ])];
                                    case 12:
                                        insert_2 = _3.sent();
                                        _z = 0, _0 = (_p = web_socket_js_1.WebSocket.chatMemory[this_1.app + room.chat_id]) !== null && _p !== void 0 ? _p : [];
                                        _3.label = 13;
                                    case 13:
                                        if (!(_z < _0.length)) return [3 /*break*/, 17];
                                        dd = _0[_z];
                                        return [4 /*yield*/, database_1.default.query("select userData\n                                                 from `".concat(this_1.app, "`.t_user\n                                                 where userID = ?"), [b.user_id])];
                                    case 14:
                                        userData_4 = (_3.sent())[0];
                                        return [4 /*yield*/, this_1.updateLastRead(dd.user_id, room.chat_id)];
                                    case 15:
                                        _3.sent();
                                        dd.callback({
                                            id: insert_2.insertId,
                                            chat_id: room.chat_id,
                                            user_id: b.user_id,
                                            message: {
                                                text: d.response,
                                            },
                                            created_time: new Date(),
                                            user_data: (userData_4 && userData_4.userData) || {},
                                            type: 'message',
                                        });
                                        _3.label = 16;
                                    case 16:
                                        _z++;
                                        return [3 /*break*/, 13];
                                    case 17: return [4 /*yield*/, this_1.getLastRead(room.chat_id)];
                                    case 18:
                                        lastRead_2 = _3.sent();
                                        for (_1 = 0, _2 = (_q = web_socket_js_1.WebSocket.chatMemory[this_1.app + room.chat_id]) !== null && _q !== void 0 ? _q : []; _1 < _2.length; _1++) {
                                            dd = _2[_1];
                                            dd.callback({
                                                type: 'update_read_count',
                                                data: lastRead_2,
                                            });
                                        }
                                        return [3 /*break*/, 20];
                                    case 19:
                                        _x++;
                                        return [3 /*break*/, 11];
                                    case 20: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _d = 0, particpant_1 = particpant;
                        _s.label = 20;
                    case 20:
                        if (!(_d < particpant_1.length)) return [3 /*break*/, 23];
                        b = particpant_1[_d];
                        return [5 /*yield**/, _loop_2(b)];
                    case 21:
                        _s.sent();
                        _s.label = 22;
                    case 22:
                        _d++;
                        return [3 /*break*/, 20];
                    case 23:
                        notifyUser_1 = particpant
                            .filter(function (dd) {
                            return dd.user_id && !isNaN(dd.user_id) && !isNaN(parseFloat(dd.user_id)) && "".concat(dd.user_id) !== "".concat(room.user_id);
                        })
                            .map(function (dd) {
                            return dd.user_id;
                        });
                        return [4 /*yield*/, database_1.default.query("SELECT userData, userID\n                 FROM `".concat(this.app, "`.t_user\n                 where userID in (").concat((function () {
                                var id = ['0'].concat(notifyUser_1);
                                return id.join(',');
                            })(), ");"), [])];
                    case 24:
                        userData = _s.sent();
                        //通知更新訊息紅點
                        particpant.map(function (dd) {
                            var _a;
                            if ("".concat(dd.user_id) !== "".concat(room.user_id)) {
                                ((_a = web_socket_js_1.WebSocket.messageChangeMem["".concat(dd.user_id)]) !== null && _a !== void 0 ? _a : []).map(function (d2) {
                                    d2.callback({
                                        type: 'update_message_count',
                                    });
                                });
                            }
                        });
                        return [4 /*yield*/, app_js_1.App.checkBrandAndMemberType(this.app)];
                    case 25:
                        managerUser = _s.sent();
                        _loop_3 = function (dd) {
                            var template;
                            return __generator(this, function (_4) {
                                switch (_4.label) {
                                    case 0:
                                        if (!dd.userData.email) return [3 /*break*/, 9];
                                        if (!(chatRoom.type === 'user')) return [3 /*break*/, 9];
                                        if (!room.message.text) return [3 /*break*/, 9];
                                        if (!user) return [3 /*break*/, 4];
                                        if (!!web_socket_js_1.WebSocket.chatMemory[this_2.app + room.chat_id].find(function (d1) {
                                            return "".concat(d1.user_id) === "".concat(dd.userID);
                                        })) return [3 /*break*/, 3];
                                        return [4 /*yield*/, (0, ses_js_1.sendmail)("service@ncdesign.info", dd.userData.email, "".concat(user.userData.name, ":\u50B3\u9001\u8A0A\u606F\u7D66\u60A8"), this_2.templateWithCustomerMessage("\u6536\u5230\u8A0A\u606F", "".concat(user.userData.name, "\u50B3\u9001\u8A0A\u606F\u7D66\u60A8:"), room.message.text))];
                                    case 1:
                                        _4.sent();
                                        console.log("\u6536\u5230\u8A0A\u606F->".concat(user.userID));
                                        return [4 /*yield*/, new firebase_js_1.Firebase(this_2.app).sendMessage({
                                                title: "\u6536\u5230\u8A0A\u606F",
                                                userID: dd.userID,
                                                tag: 'message',
                                                link: "./message?userID=".concat(user.userID),
                                                body: "".concat(user.userData.name, "\u50B3\u9001\u8A0A\u606F\u7D66\u60A8:").concat(room.message.text),
                                            })];
                                    case 2:
                                        _4.sent();
                                        _4.label = 3;
                                    case 3: return [3 /*break*/, 9];
                                    case 4:
                                        if (!(room.user_id === 'manager')) return [3 /*break*/, 7];
                                        return [4 /*yield*/, auto_send_email_js_1.AutoSendEmail.getDefCompare(this_2.app, 'get-customer-message', 'zh-TW')];
                                    case 5:
                                        template = _4.sent();
                                        return [4 /*yield*/, (0, ses_js_1.sendmail)("service@ncdesign.info", dd.userData.email, template.title, template.content.replace(/@{{text}}/g, room.message.text).replace(/@{{link}}/g, managerUser.domain))];
                                    case 6:
                                        _4.sent();
                                        return [3 /*break*/, 9];
                                    case 7: return [4 /*yield*/, (0, ses_js_1.sendmail)("service@ncdesign.info", dd.userData.email, '有人傳送訊息給您', this_2.templateWithCustomerMessage('收到匿名訊息', "\u6709\u4E00\u5247\u533F\u540D\u8A0A\u606F:", room.message.text))];
                                    case 8:
                                        _4.sent();
                                        _4.label = 9;
                                    case 9: return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _e = 0, userData_1 = userData;
                        _s.label = 26;
                    case 26:
                        if (!(_e < userData_1.length)) return [3 /*break*/, 29];
                        dd = userData_1[_e];
                        return [5 /*yield**/, _loop_3(dd)];
                    case 27:
                        _s.sent();
                        _s.label = 28;
                    case 28:
                        _e++;
                        return [3 /*break*/, 26];
                    case 29:
                        if (!(particpant.find(function (dd) {
                            return dd.user_id === 'manager';
                        }) &&
                            room.user_id !== 'manager')) return [3 /*break*/, 33];
                        return [4 /*yield*/, (new user_js_1.User(this.app)).getConfigV2({
                                key: 'message_setting',
                                user_id: 'manager'
                            })
                            //判斷是否由機器人回答
                        ];
                    case 30:
                        message_setting = _s.sent();
                        ai_response_toggle = message_setting.ai_toggle;
                        if (ai_response_toggle) {
                            if (room.message.text) {
                                new Promise(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var aiResponse;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, ai_robot_js_1.AiRobot.aiResponse(this.app, room.message.text)];
                                            case 1:
                                                aiResponse = _a.sent();
                                                if (!aiResponse) return [3 /*break*/, 3];
                                                if (!(aiResponse === null || aiResponse === void 0 ? void 0 : aiResponse.text)) return [3 /*break*/, 3];
                                                if (!((aiResponse === null || aiResponse === void 0 ? void 0 : aiResponse.text) !== 'no-data')) return [3 /*break*/, 3];
                                                return [4 /*yield*/, this.addMessage({
                                                        "chat_id": room.chat_id,
                                                        "user_id": "manager",
                                                        "message": { "text": aiResponse === null || aiResponse === void 0 ? void 0 : aiResponse.text, "attachment": "", ai_usage: aiResponse.usage, "type": "robot" }
                                                    })];
                                            case 2:
                                                _a.sent();
                                                _a.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }
                        }
                        return [4 /*yield*/, auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, 'get-customer-message', 'zh-TW')];
                    case 31:
                        template = _s.sent();
                        return [4 /*yield*/, new notify_js_1.ManagerNotify(this.app).customerMessager({
                                title: template.title,
                                content: template.content.replace(/@{{text}}/g, room.message.text).replace(/@{{link}}/g, managerUser.domain),
                                user_name: (user) ? user.userData.name : '訪客',
                                room_image: room.message.image,
                                room_text: room.message.text,
                            })];
                    case 32:
                        _s.sent();
                        _s.label = 33;
                    case 33: return [3 /*break*/, 35];
                    case 34:
                        e_5 = _s.sent();
                        console.log(e_5);
                        throw exception_1.default.BadRequestError((_r = e_5.code) !== null && _r !== void 0 ? _r : 'BAD_REQUEST', 'AddMessage Error:' + e_5.message, null);
                    case 35: return [2 /*return*/];
                }
            });
        });
    };
    Chat.prototype.updateLastRead = function (userID, chat_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("replace\n            into  `".concat(this.app, "`.t_chat_last_read (user_id,chat_id,last_read) values (?,?,NOW());"), [userID, chat_id])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Chat.prototype.getLastRead = function (chat_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("select *\n             from `".concat(this.app, "`.t_chat_last_read\n             where chat_id = ?;"), [chat_id])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Chat.prototype.templateWithCustomerMessage = function (subject, title, message) {
        return "<div id=\":14y\" class=\"ii gt adO\" jslog=\"20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTcyNTcxNjU2NTQ4OTk2MTY3OSJd; 4:WyIjbXNnLWY6MTcyNTcxNjY3NDU2Njc0OTY2MyJd\"><div id=\":14x\" class=\"a3s aiL \"><div id=\"m_-852875620297719051MailSample1\"><div class=\"adM\">\n            </div><div style=\"clear:left;float:left;width:500px;background-color:#999999;border:10px solid #999999;margin-bottom:5px;font-size:1.2em;text-align:center;color:#ffffff\">".concat(subject, "</div>\n            <div style=\"clear:left;float:left;width:500px;border:10px solid #999999;padding-bottom:30px\">\n                <div style=\"float:left;margin:10px;font-size:.95em;line-height:25px\">\n                     ").concat(title, "\n                     <br>\n                     ").concat(message, "\n                    </div></div><div class=\"adL\">\n            </div></div><div class=\"HOEnZb adL\"><div class=\"adm\"><div id=\"q_0\" class=\"ajR h4\"><div class=\"ajT\"></div></div></div><div class=\"h5\">\n            <div style=\"clear:both;float:right;font-size:.85em;margin-top:5px;color:red;width:100%;text-align:right;margin-right:10px\">\n                Note: This letter is automatically sent by the system. Please don't reply directly\n            </div>\n        \n</div></div></div></div>");
    };
    Chat.prototype.getMessage = function (qu) {
        return __awaiter(this, void 0, void 0, function () {
            var query, lastRead, _i, _a, dd, res, userID_2, userDataStorage_1, _b, userID_1, b, _c, _d, _e, e_6;
            var _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 10, , 11]);
                        query = ["chat_id=".concat(database_1.default.escape(qu.chat_id))];
                        qu.befor_id && query.push("id<".concat(qu.befor_id));
                        qu.after_id && query.push("id>".concat(qu.after_id));
                        return [4 /*yield*/, database_1.default.query("replace\n                into  `".concat(this.app, "`.t_chat_last_read (user_id,chat_id,last_read) values (?,?,NOW());"), [qu.user_id, qu.chat_id])];
                    case 1:
                        _h.sent();
                        if (!!qu.befor_id) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getLastRead(qu.chat_id)];
                    case 2:
                        lastRead = _h.sent();
                        for (_i = 0, _a = (_f = web_socket_js_1.WebSocket.chatMemory[this.app + qu.chat_id]) !== null && _f !== void 0 ? _f : []; _i < _a.length; _i++) {
                            dd = _a[_i];
                            dd.callback({
                                type: 'update_read_count',
                                data: lastRead,
                            });
                        }
                        _h.label = 3;
                    case 3: return [4 /*yield*/, new ut_database_js_1.UtDatabase(this.app, "t_chat_detail").querySql(query, qu)];
                    case 4:
                        res = _h.sent();
                        userID_2 = [];
                        res.data.map(function (dd) {
                            if (userID_2.indexOf(dd.user_id) === -1) {
                                userID_2.push(dd.user_id);
                            }
                        });
                        userDataStorage_1 = {};
                        _b = 0, userID_1 = userID_2;
                        _h.label = 5;
                    case 5:
                        if (!(_b < userID_1.length)) return [3 /*break*/, 8];
                        b = userID_1[_b];
                        _c = userDataStorage_1;
                        _d = b;
                        return [4 /*yield*/, database_1.default.query("select userData\n                         from `".concat(this.app, "`.t_user\n                         where userID = ?"), [b])];
                    case 6:
                        _c[_d] = (_h.sent())[0];
                        userDataStorage_1[b] = userDataStorage_1[b] && userDataStorage_1[b].userData;
                        _h.label = 7;
                    case 7:
                        _b++;
                        return [3 /*break*/, 5];
                    case 8:
                        res.data.map(function (dd) {
                            var _a;
                            dd.user_data = (_a = userDataStorage_1[dd.user_id]) !== null && _a !== void 0 ? _a : {};
                        });
                        _e = res;
                        return [4 /*yield*/, this.getLastRead(qu.chat_id)];
                    case 9:
                        _e.lastRead = _h.sent();
                        (web_socket_js_1.WebSocket.messageChangeMem[qu.user_id] || []).map(function (dd) {
                            dd.callback({
                                type: 'update_message_count',
                            });
                        });
                        return [2 /*return*/, res];
                    case 10:
                        e_6 = _h.sent();
                        throw exception_1.default.BadRequestError((_g = e_6.code) !== null && _g !== void 0 ? _g : 'BAD_REQUEST', 'GetMessage Error:' + e_6.message, null);
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    Chat.prototype.unReadMessage = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT `".concat(this.app, "`.t_chat_detail.*\n             FROM `").concat(this.app, "`.t_chat_detail,\n                  `").concat(this.app, "`.t_chat_last_read\n             where t_chat_detail.chat_id in\n                   (SELECT chat_id FROM `").concat(this.app, "`.t_chat_participants where user_id = ").concat(database_1.default.escape(user_id), ")\n               and (t_chat_detail.chat_id != 'manager-preview')\n               and t_chat_detail.user_id!=").concat(database_1.default.escape(user_id), "\n               and t_chat_last_read.user_id= ").concat(database_1.default.escape(user_id), "\n               and t_chat_detail.chat_id=t_chat_last_read.chat_id\n               and t_chat_last_read.last_read\n                 < created_time\n             order by id desc"), [])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Chat.prototype.unReadMessageCount = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT `".concat(this.app, "`.t_chat_detail.*\n             FROM `").concat(this.app, "`.t_chat_detail,\n                  `").concat(this.app, "`.t_chat_last_read\n             where t_chat_detail.chat_id in\n                   (SELECT chat_id FROM `").concat(this.app, "`.t_chat_participants where user_id = ").concat(database_1.default.escape(user_id), ")\n               and (t_chat_detail.chat_id != 'manager-preview')\n               and t_chat_detail.user_id!=").concat(database_1.default.escape(user_id), "\n               and t_chat_detail.chat_id=t_chat_last_read.chat_id\n               and t_chat_last_read.last_read\n                 < created_time\n             order by id desc"), [])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Chat;
}());
exports.Chat = Chat;
function generateChatID() {
    var userID = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 8; i++) {
        userID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    userID = "".concat('123456789'.charAt(Math.floor(Math.random() * charactersLength))).concat(userID);
    return userID;
}

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
exports.FbMessage = void 0;
var exception_js_1 = require("../../modules/exception.js");
var database_js_1 = require("../../modules/database.js");
var auto_send_email_js_1 = require("./auto-send-email.js");
var config_1 = require("../../config");
var axios_1 = require("axios");
var chat_1 = require("./chat");
var user_1 = require("./user");
var logger_1 = require("../../modules/logger");
var AWSLib_1 = require("../../modules/AWSLib");
var mime = require('mime');
var FbMessage = /** @class */ (function () {
    function FbMessage(app, token) {
        this.app = app;
        this.token = token;
    }
    FbMessage.prototype.chunkSendMessage = function (userList, content, id, date) {
        return __awaiter(this, void 0, void 0, function () {
            var check_1, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        check_1 = userList.length;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                for (var _i = 0, userList_1 = userList; _i < userList_1.length; _i++) {
                                    var d = userList_1[_i];
                                    _this.sendMessage({ data: content, fbID: d.lineID }, function (res) {
                                        check_1--;
                                        if (check_1 === 0) {
                                            database_js_1.default.query("UPDATE `".concat(_this.app, "`.t_triggers\n                                      SET status = ").concat(date ? 0 : 1, ",\n                                          content = JSON_SET(content, '$.name', '").concat(res.msgid, "')\n                                      WHERE id = ?;"), [id]);
                                            resolve(true);
                                        }
                                    });
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'chunkSendSns Error:' + e_1, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FbMessage.prototype.sendMessage = function (obj, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, post, tokenData, token, urlConfig_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        payload = {
                            recipient: { id: obj.fbID },
                            message: {},
                            tag: "POST_PURCHASE_UPDATE"
                        };
                        if (obj.data.image) {
                            payload.message = {
                                attachment: {
                                    type: 'image',
                                    payload: {
                                        url: obj.data.image,
                                        is_reusable: true
                                    }
                                }
                            };
                        }
                        else {
                            payload.message = {
                                text: obj.data.text
                            };
                        }
                        if (obj.data.tag) {
                            payload.tag = obj.data.tag;
                        }
                        post = new user_1.User(this.app, this.token);
                        return [4 /*yield*/, post.getConfig({
                                key: "login_fb_setting",
                                user_id: "manager",
                            })];
                    case 1:
                        tokenData = _a.sent();
                        token = "".concat(tokenData[0].value.fans_token);
                        urlConfig_1 = {
                            method: 'post',
                            url: "https://graph.facebook.com/v12.0/me/messages",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer ".concat(token)
                            },
                            data: JSON.stringify(payload)
                        };
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                axios_1.default.request(urlConfig_1)
                                    .then(function (response) {
                                    // let result = response.data.split('\r\n')
                                    callback(response);
                                    resolve(response.data);
                                })
                                    .catch(function (error) {
                                    console.log("error -- ", error.response.data.error);
                                    resolve(false);
                                });
                            })];
                    case 2:
                        e_2 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'send line Error:' + e_2.data, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FbMessage.prototype.sendUserInf = function (fbID, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var token, urlConfig_2;
            return __generator(this, function (_a) {
                try {
                    token = "Bearer EAAjqQPeQMmUBO0Xwr3p0BVWtkhm5RlWDZC9GleHtSaUZCAbjxsw3plF5lkn8XEpurozNeamiqSOUgnDeZCFVf2fnnMXSluos0gnnLK3pMTi7JYP44KulLIocGwxvlxFGVOW2dZB1xWS2oWerE2cc13ANqjcaGumZBl6PSVUKOOZByjVu31oD42zOB3DHbXbLoKZAGhZAFRxZCmDEy6ZC1dyQZDZD";
                    urlConfig_2 = {
                        method: 'post',
                        url: "https://graph.facebook.com/v12.0/".concat(fbID, "?fields=first_name,last_name,profile_pic"),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token
                        },
                        data: JSON.stringify({})
                    };
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            axios_1.default.request(urlConfig_2)
                                .then(function (response) {
                                // let result = response.data.split('\r\n')
                                callback(response);
                                resolve(response.data);
                            })
                                .catch(function (error) {
                                console.log("error -- ", error.data);
                                resolve(false);
                            });
                        })];
                }
                catch (e) {
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'send line Error:' + e.data, null);
                }
                return [2 /*return*/];
            });
        });
    };
    FbMessage.prototype.deleteSNS = function (obj, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var urlConfig_3;
            return __generator(this, function (_a) {
                try {
                    urlConfig_3 = {
                        method: 'post',
                        url: config_1.default.SNS_URL + "/api/mtk/SmCancel?username=".concat(config_1.default.SNSAccount, "&password=").concat(config_1.default.SNSPWD, "&msgid=").concat(obj.id),
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: []
                    };
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            axios_1.default.request(urlConfig_3)
                                .then(function (response) {
                                callback(response.data);
                                resolve(response.data);
                            })
                                .catch(function (error) {
                                console.log("error -- ", error);
                                resolve(false);
                            });
                        })
                        //
                        // var settings = {
                        //     "url": "https://smsapi.mitake.com.tw/api/mtk/SmSend",
                        //     "method": "POST",
                        //     "timeout": 0,
                        //     "headers": {
                        //         "Content-Type": "application/x-www-form-urlencoded"
                        //     },
                        //     "data": {
                        //         "username": `${config.SNSAccount}`,
                        //         "password": `${config.SNSPWD}`,
                        //         "dstaddr": `${phone}`,
                        //         "smbody": `${data}`
                        //     }
                        // };
                        //
                        // $.ajax(settings).done(function (response:any) {
                        //     console.log(response);
                        // });
                    ];
                    //
                    // var settings = {
                    //     "url": "https://smsapi.mitake.com.tw/api/mtk/SmSend",
                    //     "method": "POST",
                    //     "timeout": 0,
                    //     "headers": {
                    //         "Content-Type": "application/x-www-form-urlencoded"
                    //     },
                    //     "data": {
                    //         "username": `${config.SNSAccount}`,
                    //         "password": `${config.SNSPWD}`,
                    //         "dstaddr": `${phone}`,
                    //         "smbody": `${data}`
                    //     }
                    // };
                    //
                    // $.ajax(settings).done(function (response:any) {
                    //     console.log(response);
                    // });
                }
                catch (e) {
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'send SNS Error:' + e, null);
                }
                return [2 /*return*/];
            });
        });
    };
    FbMessage.prototype.parseResponse = function (response) {
        var regex = /\[([0-9]+)\]\r\nmsgid=([^\r\n]+)\r\nstatuscode=([0-9]+)\r\nAccountPoint=([0-9]+)\r\n/;
        var match = response.match(regex);
    };
    FbMessage.prototype.getLine = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var whereList, maiTypeString, whereSQL, emails_1, total, n_1, e_3;
            var _this = this;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        whereList = ['1 = 1'];
                        switch (query.searchType) {
                            case 'phone':
                                whereList.push("(JSON_SEARCH(content->'$.phone', 'one', '%".concat((_a = query.search) !== null && _a !== void 0 ? _a : '', "%', NULL, '$[*]') IS NOT NULL)"));
                                break;
                            case 'name':
                                whereList.push("(UPPER(JSON_EXTRACT(content, '$.name')) LIKE UPPER('%".concat((_b = query.search) !== null && _b !== void 0 ? _b : '', "%'))"));
                                break;
                            case 'title':
                                whereList.push("(UPPER(JSON_EXTRACT(content, '$.title')) LIKE UPPER('%".concat((_c = query.search) !== null && _c !== void 0 ? _c : '', "%'))"));
                                break;
                        }
                        if (query.status) {
                            whereList.push("(status in (".concat(query.status, "))"));
                        }
                        if (query.mailType) {
                            maiTypeString = query.mailType.replace(/[^,]+/g, "'$&'");
                            whereList.push("(JSON_EXTRACT(content, '$.type') in (".concat(maiTypeString, "))"));
                        }
                        whereSQL = "(tag = 'sendLine' OR tag = 'sendLineBySchedule') AND ".concat(whereList.join(' AND '));
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n                 FROM `".concat(this.app, "`.t_triggers\n                 WHERE ").concat(whereSQL, "\n                 ORDER BY id DESC\n                     ").concat(query.type === 'download' ? '' : "LIMIT ".concat(query.page * query.limit, ", ").concat(query.limit), ";"), [])];
                    case 1:
                        emails_1 = _d.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT count(id) as c\n                 FROM `".concat(this.app, "`.t_triggers\n                 WHERE ").concat(whereSQL, ";"), [])];
                    case 2:
                        total = _d.sent();
                        n_1 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_1 = function (email) {
                                    auto_send_email_js_1.AutoSendEmail.getDefCompare(_this.app, email.content.type, 'zh-TW').then(function (dd) {
                                        email.content.typeName = dd && dd.tag_name ? dd.tag_name : '手動發送';
                                        n_1++;
                                    });
                                };
                                for (var _i = 0, emails_2 = emails_1; _i < emails_2.length; _i++) {
                                    var email = emails_2[_i];
                                    _loop_1(email);
                                }
                                var si = setInterval(function () {
                                    if (n_1 === emails_1.length) {
                                        resolve();
                                        clearInterval(si);
                                    }
                                }, 300);
                            })];
                    case 3:
                        _d.sent();
                        return [2 /*return*/, { data: emails_1, total: total[0].c }];
                    case 4:
                        e_3 = _d.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getMail Error:' + e_3, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FbMessage.prototype.postLine = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var insertData, insertData, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data.msgid = "";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!Boolean(data.sendTime)) return [3 /*break*/, 3];
                        if (isLater(data.sendTime)) {
                            return [2 /*return*/, { result: false, message: '排定發送的時間需大於現在時間' }];
                        }
                        return [4 /*yield*/, database_js_1.default.query("INSERT INTO `".concat(this.app, "`.`t_triggers`\n                                                   SET ?;"), [
                                {
                                    tag: 'sendLineBySchedule',
                                    content: JSON.stringify(data),
                                    trigger_time: formatDateTime(data.sendTime),
                                    status: 0,
                                },
                            ])];
                    case 2:
                        insertData = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, database_js_1.default.query("INSERT INTO `".concat(this.app, "`.`t_triggers`\n                                                   SET ?;"), [
                            {
                                tag: 'sendLine',
                                content: JSON.stringify(data),
                                trigger_time: formatDateTime(),
                                status: 0,
                            },
                        ])];
                    case 4:
                        insertData = _a.sent();
                        this.chunkSendMessage(data.userList, data.content, insertData.insertId);
                        _a.label = 5;
                    case 5: return [2 /*return*/, { result: true, message: '寄送成功' }];
                    case 6:
                        e_4 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMail Error:' + e_4, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    FbMessage.prototype.deleteSns = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var emails, e_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n                 FROM `".concat(this.app, "`.t_triggers\n                 WHERE JSON_EXTRACT(content, '$.name') = '").concat(data.id, "';"), [])];
                    case 1:
                        emails = _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                _this.deleteSNS({ id: data.id }, function (res) {
                                    resolve(true);
                                });
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.t_triggers\n                            SET status = 2\n                            WHERE JSON_EXTRACT(content, '$.name') = '").concat(data.id, "';"), [])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { result: true, message: '取消預約成功' }];
                    case 4:
                        e_5 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMail Error:' + e_5, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FbMessage.prototype.listenMessage = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            function downloadImageFromFacebook(imageUrl) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, axios_1.default.get(imageUrl, {
                                        headers: {},
                                        responseType: 'arraybuffer', // 下載二進制資料
                                    })];
                            case 1:
                                response = _a.sent();
                                return [2 /*return*/, Buffer.from(response.data)];
                            case 2:
                                error_1 = _a.sent();
                                console.error('下載圖片時出錯:', error_1);
                                throw error_1;
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            function getFileExtension(url) {
                // 使用正規表達式匹配文件副檔名
                var matches = url.match(/\.(jpg|jpeg|png|gif|bmp|webp)(?=[\?&]|$)/i);
                return matches ? matches[1].toLowerCase() : null;
            }
            var that, post, tokenData, _i, _a, entry, messagingEvents, _loop_2, this_1, _b, messagingEvents_1, event_1, e_6;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        that = this;
                        post = new user_1.User(this.app, this.token);
                        return [4 /*yield*/, post.getConfig({
                                key: "login_fb_setting",
                                user_id: "manager",
                            })];
                    case 1:
                        tokenData = _c.sent();
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 11, , 12]);
                        if (!(body.object === 'page')) return [3 /*break*/, 9];
                        _i = 0, _a = body.entry;
                        _c.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        entry = _a[_i];
                        messagingEvents = entry.messaging;
                        _loop_2 = function (event_1) {
                            var recipient, chatData_1, DBdata, now, senderId, chatData_2, result, messageText, attachments;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        if (!event_1.message) return [3 /*break*/, 13];
                                        if (!(("".concat(event_1.sender.id)) == tokenData[0].value.fans_id)) return [3 /*break*/, 6];
                                        recipient = "fb_" + event_1.recipient.id;
                                        chatData_1 = {
                                            chat_id: [recipient, "manager"].sort().join('-'),
                                            type: "user",
                                            user_id: recipient,
                                            info: {},
                                            participant: [recipient, "manager"]
                                        };
                                        return [4 /*yield*/, this_1.getFBInf({ fbID: event_1.recipient.id }, function (data) {
                                                chatData_1.info = {
                                                    fb: {
                                                        name: data.last_name + data.first_name,
                                                        head: data.profile_pic,
                                                        update: new Date().getTime(),
                                                    }
                                                };
                                            })];
                                    case 1:
                                        _d.sent();
                                        chatData_1.info = JSON.stringify(chatData_1.info);
                                        return [4 /*yield*/, database_js_1.default.query("\n                                        SELECT *\n                                        FROM `".concat(this_1.app, "`.`t_chat_list`\n                                        WHERE chat_id = ?\n                                    "), [
                                                chatData_1.chat_id
                                            ])];
                                    case 2:
                                        DBdata = _d.sent();
                                        DBdata = DBdata[0];
                                        now = new Date();
                                        if (!(!DBdata.info.fb.update || new Date().getTime() - DBdata.info.fb.update > (1000 * 60 * 60 * 24))) return [3 /*break*/, 5];
                                        return [4 /*yield*/, this_1.getFBInf({ fbID: event_1.recipient.id }, function (data) {
                                                chatData_1.info = {
                                                    fb: {
                                                        name: data.last_name + data.first_name,
                                                        head: data.profile_pic,
                                                        update: new Date().getTime()
                                                    }
                                                };
                                            })
                                            // chatData.info = JSON.stringify(chatData.info);
                                        ];
                                    case 3:
                                        _d.sent();
                                        // chatData.info = JSON.stringify(chatData.info);
                                        DBdata.info.fb.update = new Date().getTime();
                                        chatData_1.info = JSON.stringify(chatData_1.info);
                                        return [4 /*yield*/, database_js_1.default.query("\n                                            UPDATE `".concat(this_1.app, "`.`t_chat_list`\n                                            SET ?\n                                            WHERE chat_id = ?\n                                        "), [
                                                {
                                                    info: chatData_1.info,
                                                },
                                                chatData_1.chat_id
                                            ])];
                                    case 4:
                                        _d.sent();
                                        _d.label = 5;
                                    case 5: return [3 /*break*/, 13];
                                    case 6:
                                        senderId = "fb_" + event_1.sender.id;
                                        chatData_2 = {
                                            chat_id: [senderId, "manager"].sort().join('-'),
                                            type: "user",
                                            user_id: senderId,
                                            info: {},
                                            participant: [senderId, "manager"]
                                        };
                                        return [4 /*yield*/, this_1.getFBInf({ fbID: event_1.sender.id }, function (data) {
                                                chatData_2.info = {
                                                    fb: {
                                                        name: data.last_name + data.first_name,
                                                        head: data.profile_pic
                                                    }
                                                };
                                            })];
                                    case 7:
                                        _d.sent();
                                        chatData_2.info = JSON.stringify(chatData_2.info);
                                        return [4 /*yield*/, new chat_1.Chat(this_1.app).addChatRoom(chatData_2)];
                                    case 8:
                                        result = _d.sent();
                                        if (!!result.create) return [3 /*break*/, 10];
                                        return [4 /*yield*/, database_js_1.default.query("\n                                            UPDATE `".concat(this_1.app, "`.`t_chat_list`\n                                            SET ?\n                                            WHERE chat_id = ?\n                                        "), [
                                                {
                                                    info: chatData_2.info,
                                                },
                                                chatData_2.chat_id
                                            ])];
                                    case 9:
                                        _d.sent();
                                        _d.label = 10;
                                    case 10:
                                        if (!event_1.message.text) return [3 /*break*/, 12];
                                        messageText = event_1.message.text;
                                        chatData_2.message = {
                                            "text": messageText
                                        };
                                        return [4 /*yield*/, new chat_1.Chat(this_1.app).addMessage(chatData_2)];
                                    case 11:
                                        _d.sent();
                                        _d.label = 12;
                                    case 12:
                                        if (event_1.message.attachments) {
                                            attachments = event_1.message.attachments;
                                            attachments.forEach(function (attachment) {
                                                if (attachment.type === 'image' && attachment.payload) {
                                                    var imageUrl_1 = attachment.payload.url;
                                                    downloadImageFromFacebook(imageUrl_1)
                                                        .then(function (buffer) {
                                                        var fileExtension = getFileExtension(imageUrl_1);
                                                        _this.uploadFile("line/".concat(new Date().getTime(), ".").concat(fileExtension), buffer)
                                                            .then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                                                            var senderId;
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0:
                                                                        senderId = "fb_" + event_1.sender.id;
                                                                        chatData_2.message = {
                                                                            "image": data
                                                                        };
                                                                        return [4 /*yield*/, new chat_1.Chat(this.app).addMessage(chatData_2)];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); });
                                                    })
                                                        .catch(function (error) {
                                                        console.error('下載失敗:', error);
                                                    });
                                                }
                                            });
                                        }
                                        _d.label = 13;
                                    case 13: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _b = 0, messagingEvents_1 = messagingEvents;
                        _c.label = 4;
                    case 4:
                        if (!(_b < messagingEvents_1.length)) return [3 /*break*/, 7];
                        event_1 = messagingEvents_1[_b];
                        return [5 /*yield**/, _loop_2(event_1)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        _b++;
                        return [3 /*break*/, 4];
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8: return [3 /*break*/, 10];
                    case 9: return [2 /*return*/, { result: true, message: 'body error' }];
                    case 10: return [2 /*return*/, { result: true, message: 'accept message' }];
                    case 11:
                        e_6 = _c.sent();
                        console.log(e_6);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Error:' + e_6, null);
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    FbMessage.prototype.sendCustomerFB = function (tag, order_id, fb_id) {
        return __awaiter(this, void 0, void 0, function () {
            var customerMail;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, tag, 'zh-TW')];
                    case 1:
                        customerMail = _a.sent();
                        customerMail.tag = "POST_PURCHASE_UPDATE";
                        if (!customerMail.toggle) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = resolve;
                                            return [4 /*yield*/, this.sendMessage({
                                                    data: {
                                                        text: "出貨訊息",
                                                        attachment: [],
                                                        tag: 'POST_PURCHASE_UPDATE'
                                                    },
                                                    fbID: fb_id,
                                                }, function (res) {
                                                })];
                                        case 1:
                                            _a.apply(void 0, [_b.sent()]);
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FbMessage.prototype.uploadFile = function (file_name, fileData) {
        return __awaiter(this, void 0, void 0, function () {
            var TAG, logger, s3bucketName, s3path, fullUrl, params;
            var _this = this;
            return __generator(this, function (_a) {
                TAG = "[AWS-S3][Upload]";
                logger = new logger_1.default();
                s3bucketName = config_1.default.AWS_S3_NAME;
                s3path = file_name;
                fullUrl = config_1.default.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
                params = {
                    Bucket: s3bucketName,
                    Key: s3path,
                    Expires: 300,
                    //If you use other contentType will response 403 error
                    ContentType: (function () {
                        if (config_1.default.SINGLE_TYPE) {
                            return "application/x-www-form-urlencoded; charset=UTF-8";
                        }
                        else {
                            return mime.getType(fullUrl.split('.').pop());
                        }
                    })()
                };
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        AWSLib_1.default.getSignedUrl('putObject', params, function (err, url) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (err) {
                                    logger.error(TAG, String(err));
                                    // use console.log here because logger.info cannot log err.stack correctly
                                    console.log(err, err.stack);
                                    reject(false);
                                }
                                else {
                                    (0, axios_1.default)({
                                        method: 'PUT',
                                        url: url,
                                        data: fileData,
                                        headers: {
                                            "Content-Type": params.ContentType
                                        }
                                    }).then(function () {
                                        console.log(fullUrl);
                                        resolve(fullUrl);
                                    }).catch(function () {
                                        console.log("convertError:".concat(fullUrl));
                                    });
                                }
                                return [2 /*return*/];
                            });
                        }); });
                    })];
            });
        });
    };
    FbMessage.prototype.getFBInf = function (obj, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var post, tokenData, token, urlConfig_4, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        post = new user_1.User(this.app, this.token);
                        return [4 /*yield*/, post.getConfig({
                                key: "login_fb_setting",
                                user_id: "manager",
                            })];
                    case 1:
                        tokenData = _a.sent();
                        token = "Bearer ".concat(tokenData[0].value.fans_token);
                        urlConfig_4 = {
                            method: 'get',
                            url: "https://graph.facebook.com/v16.0/".concat(obj.fbID, "?fields=first_name,last_name,profile_pic"),
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": token
                            },
                            data: {}
                        };
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                axios_1.default.request(urlConfig_4)
                                    .then(function (response) {
                                    callback(response.data);
                                    resolve(response.data);
                                })
                                    .catch(function (error) {
                                    console.log("error -- ", error);
                                    resolve(false);
                                });
                            })];
                    case 2:
                        e_7 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'send line Error:' + e_7.data, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return FbMessage;
}());
exports.FbMessage = FbMessage;
function formatDate(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    var seconds = String(date.getSeconds()).padStart(2, '0');
    return "".concat(year).concat(month).concat(day).concat(hours).concat(minutes).concat(seconds);
}
function formatDateTime(sendTime) {
    var dateTimeString = sendTime ? sendTime.date + ' ' + sendTime.time : undefined;
    var dateObject = dateTimeString ? new Date(dateTimeString) : new Date();
    return formatDate(dateObject);
}
function chunkArray(array, groupSize) {
    var result = [];
    for (var i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}
function isLater(dateTimeObj) {
    var currentDateTime = new Date();
    var date = dateTimeObj.date, time = dateTimeObj.time;
    var dateTimeString = "".concat(date, "T").concat(time, ":00");
    var providedDateTime = new Date(dateTimeString);
    return currentDateTime > providedDateTime;
}

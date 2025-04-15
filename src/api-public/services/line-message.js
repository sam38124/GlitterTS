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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineMessage = void 0;
var exception_js_1 = require("../../modules/exception.js");
var database_js_1 = require("../../modules/database.js");
var auto_send_email_js_1 = require("./auto-send-email.js");
var config_js_1 = require("../../config.js");
var axios_1 = require("axios");
var app_js_1 = require("../../services/app.js");
var tool_js_1 = require("../../modules/tool.js");
var chat_js_1 = require("./chat.js");
var user_js_1 = require("./user.js");
var logger_js_1 = require("../../modules/logger.js");
var AWSLib_js_1 = require("../../modules/AWSLib.js");
var jimp_1 = require("jimp");
var redis_js_1 = require("../../modules/redis.js");
var process_1 = require("process");
var shopnex_line_message_1 = require("./model/shopnex-line-message");
var mime = require('mime');
var LineMessage = /** @class */ (function () {
    function LineMessage(app, token) {
        this.app = app;
        this.token = token !== null && token !== void 0 ? token : undefined;
    }
    LineMessage.prototype.chunkSendLine = function (userList, content, id, date) {
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
                                    _this.sendLine({ data: content, lineID: d.lineID }, function (res) {
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
    LineMessage.prototype.getLineInf = function (obj, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var post, tokenData, token, urlConfig_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        post = new user_js_1.User(this.app, this.token);
                        return [4 /*yield*/, post.getConfig({
                                key: 'login_line_setting',
                                user_id: 'manager',
                            })];
                    case 1:
                        tokenData = _a.sent();
                        token = "Bearer ".concat(tokenData[0].value.message_token);
                        urlConfig_1 = {
                            method: 'get',
                            url: "https://api.line.me/v2/bot/profile/".concat(obj.lineID),
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: token,
                            },
                            data: {},
                        };
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                axios_1.default
                                    .request(urlConfig_1)
                                    .then(function (response) {
                                    // let result = response.data.split('\r\n')
                                    callback(response.data);
                                    resolve(response.data);
                                })
                                    .catch(function (error) {
                                    console.log('error -- ', error.data);
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
    LineMessage.prototype.sendLine = function (obj, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var post, tokenData, token_1, imageUrl, outputFilePath, postData, urlConfig_2, e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        obj.data.attachment = obj.data.attachment || '';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        obj.data.text = obj.data.text ? obj.data.text.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '') : undefined;
                        post = new user_js_1.User(this.app, this.token);
                        return [4 /*yield*/, post.getConfig({
                                key: 'login_line_setting',
                                user_id: 'manager',
                            })];
                    case 2:
                        tokenData = _a.sent();
                        token_1 = "".concat(tokenData[0].value.message_token);
                        if (obj.data.image) {
                            imageUrl = obj.data.image;
                            outputFilePath = 'image_cropped.jpeg';
                            // 下載圖片並讀取
                            axios_1.default
                                .get(imageUrl, { responseType: 'arraybuffer' })
                                .then(function (response) { return jimp_1.Jimp.read(Buffer.from(response.data)); })
                                .then(function (image) { return __awaiter(_this, void 0, void 0, function () {
                                var small, large;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, image.clone().scaleToFit({ w: 240, h: 240 }).getBuffer('image/jpeg')];
                                        case 1:
                                            small = _a.sent();
                                            return [4 /*yield*/, image.clone().scaleToFit({ w: 1024, h: 1024 }).getBuffer('image/jpeg')];
                                        case 2:
                                            large = _a.sent();
                                            return [2 /*return*/, [small, large]];
                                    }
                                });
                            }); })
                                .then(function (base64) {
                                // const base64Data = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
                                _this.uploadFile("line/".concat(new Date().getTime(), ".jpeg"), base64[0]).then(function (smallUrl) {
                                    _this.uploadFile("line/".concat(new Date().getTime(), ".jpeg"), base64[1]).then(function (largeUrl) {
                                        var message = {
                                            to: obj.lineID,
                                            messages: [
                                                {
                                                    type: 'image',
                                                    originalContentUrl: largeUrl, // 原圖的 URL，必須是 HTTPS
                                                    previewImageUrl: smallUrl, // 縮略圖的 URL，必須是 HTTPS
                                                },
                                            ],
                                        };
                                        return new Promise(function (resolve, reject) {
                                            axios_1.default
                                                .post('https://api.line.me/v2/bot/message/push', message, {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    Authorization: "Bearer ".concat(token_1),
                                                },
                                            })
                                                .then(function (response) {
                                                console.log('圖片消息已成功發送:', response.data);
                                                callback(response);
                                                resolve(response.data);
                                            })
                                                .catch(function (error) {
                                                console.error('發送圖片消息時發生錯誤:', error.response ? error.response.data : error.message);
                                            });
                                        });
                                    });
                                });
                            })
                                .catch(function (err) {
                                console.error('處理圖片時發生錯誤:', err);
                            });
                        }
                        else {
                            postData = {
                                to: obj.lineID,
                                messages: [
                                    {
                                        type: 'text',
                                        text: obj.data.text,
                                    },
                                ],
                            };
                            urlConfig_2 = {
                                method: 'post',
                                url: 'https://api.line.me/v2/bot/message/push',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: "Bearer ".concat(token_1),
                                },
                                data: JSON.stringify(postData),
                            };
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    axios_1.default
                                        .request(urlConfig_2)
                                        .then(function (response) {
                                        callback(response);
                                        resolve(response.data);
                                    })
                                        .catch(function (error) {
                                        console.log(error);
                                        console.log('error -- ', error.data);
                                        resolve(false);
                                    });
                                })];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'send line Error:' + e_3.data, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LineMessage.prototype.deleteSNS = function (obj, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var urlConfig_3;
            return __generator(this, function (_a) {
                try {
                    urlConfig_3 = {
                        method: 'post',
                        url: config_js_1.default.SNS_URL + "/api/mtk/SmCancel?username=".concat(config_js_1.default.SNSAccount, "&password=").concat(config_js_1.default.SNSPWD, "&msgid=").concat(obj.id),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        data: [],
                    };
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            axios_1.default
                                .request(urlConfig_3)
                                .then(function (response) {
                                callback(response.data);
                                resolve(response.data);
                            })
                                .catch(function (error) {
                                console.log('error -- ', error);
                                resolve(false);
                            });
                        })];
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
    LineMessage.prototype.parseResponse = function (response) {
        var regex = /\[([0-9]+)\]\r\nmsgid=([^\r\n]+)\r\nstatuscode=([0-9]+)\r\nAccountPoint=([0-9]+)\r\n/;
        var match = response.match(regex);
    };
    LineMessage.prototype.getLine = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var whereList, maiTypeString, whereSQL, emails_1, total, n_1, e_4;
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
                        e_4 = _d.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getMail Error:' + e_4, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LineMessage.prototype.postLine = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var insertData, insertData, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data.msgid = '';
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
                        this.chunkSendLine(data.userList, {
                            text: data.content
                        }, insertData.insertId);
                        _a.label = 5;
                    case 5: return [2 /*return*/, { result: true, message: '寄送成功' }];
                    case 6:
                        e_5 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMail Error:' + e_5, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    LineMessage.prototype.deleteSns = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var emails, e_6;
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
                        e_6 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMail Error:' + e_6, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LineMessage.prototype.listenMessage = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var events, _i, events_1, event_1, _a, data_1, message, userID, chatData_1, post, tokenData, token, _b, events_2, event_2, replyToken, replyToken, multiPageMessage, e_7, result, post_1, tokenData_1, token_2, imageUrl, e_8;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 35, , 36]);
                        events = data.events;
                        if (!(data.destination == process_1.default.env.line_destination)) return [3 /*break*/, 12];
                        console.log("處理shopnex官方機器人事件");
                        _i = 0, events_1 = events;
                        _e.label = 1;
                    case 1:
                        if (!(_i < events_1.length)) return [3 /*break*/, 11];
                        event_1 = events_1[_i];
                        _a = event_1.type;
                        switch (_a) {
                            case "message": return [3 /*break*/, 2];
                            case "postback": return [3 /*break*/, 4];
                            case "join": return [3 /*break*/, 6];
                            case "leave": return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 9];
                    case 2: return [4 /*yield*/, this.getUserProfile("U152cb05f49499386f506867cb6adff96")];
                    case 3:
                        data_1 = _e.sent();
                        return [3 /*break*/, 10];
                    case 4:
                        console.log("收到 Postback 事件");
                        return [4 /*yield*/, shopnex_line_message_1.ShopnexLineMessage.handlePostbackEvent(event_1, this.app)
                            // let data = await this.getUserProfile("U152cb05f49499386f506867cb6adff96")
                        ];
                    case 5:
                        _e.sent();
                        // let data = await this.getUserProfile("U152cb05f49499386f506867cb6adff96")
                        return [3 /*break*/, 10];
                    case 6:
                        console.log("機器人被加入群組/聊天室");
                        return [4 /*yield*/, shopnex_line_message_1.ShopnexLineMessage.handleJoinEvent(event_1, this.app)];
                    case 7:
                        _e.sent();
                        return [3 /*break*/, 10];
                    case 8:
                        console.log("機器人被移出群組/聊天室");
                        return [3 /*break*/, 10];
                    case 9:
                        console.log("未知事件類型:", event_1.type);
                        return [3 /*break*/, 10];
                    case 10:
                        _i++;
                        return [3 /*break*/, 1];
                    case 11: return [2 /*return*/, { result: true, message: 'accept message' }];
                    case 12:
                        message = data.events[0].message;
                        userID = 'line_' + data.events[0].source.userId;
                        chatData_1 = {
                            chat_id: [userID, 'manager'].sort().join(''),
                            type: 'user',
                            info: {},
                            user_id: userID,
                            participant: [userID, 'manager'],
                        };
                        post = new user_js_1.User(this.app, this.token);
                        return [4 /*yield*/, post.getConfig({
                                key: 'login_line_setting',
                                user_id: 'manager',
                            })];
                    case 13:
                        tokenData = _e.sent();
                        token = "".concat(tokenData[0].value.message_token);
                        _b = 0, events_2 = events;
                        _e.label = 14;
                    case 14:
                        if (!(_b < events_2.length)) return [3 /*break*/, 34];
                        event_2 = events_2[_b];
                        if (!(event_2.source.type == 'group')) return [3 /*break*/, 22];
                        return [4 /*yield*/, this.getGroupInf(data.events[0].source.groupId)
                            //圖文輪播按鍵事件處理，這裡預設是點擊我要購買 或是有人喊商品+1
                        ];
                    case 15:
                        _e.sent();
                        if (!((_d = (_c = data.events[0]) === null || _c === void 0 ? void 0 : _c.postback) === null || _d === void 0 ? void 0 : _d.data)) return [3 /*break*/, 17];
                        console.log("data.events[0] -- ", JSON.stringify(data.events[0]));
                        replyToken = data.events[0].replyToken;
                        return [4 /*yield*/, this.createOrderWithLineFlexMessage(data.events[0], "您已經購買了商品")];
                    case 16:
                        _e.sent();
                        return [2 /*return*/, { result: true, message: 'accept message' }];
                    case 17:
                        //
                        if (message.text == "product + 1") {
                        }
                        if (!(message.text == "test")) return [3 /*break*/, 21];
                        replyToken = data.events[0].replyToken;
                        multiPageMessage = {
                            type: 'flex',
                            altText: '這是多頁圖文訊息',
                            contents: {
                                type: 'carousel',
                                contents: [
                                    {
                                        type: 'bubble',
                                        hero: {
                                            type: 'image',
                                            url: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.18.59-AnelegantElizabethsolidwoodwardrobewithaclassic,timelessdesign.Thewardrobefeatureshigh-qualitywoodconstructionwithapolishedfinis.webp',
                                            size: 'full',
                                            aspectRatio: '20:13',
                                            aspectMode: 'cover',
                                        },
                                        body: {
                                            type: 'box',
                                            layout: 'vertical',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    text: '伊麗莎白 實木衣櫃',
                                                    weight: 'bold',
                                                    size: 'xl',
                                                },
                                                {
                                                    type: 'text',
                                                    text: '伊麗莎白 實木衣櫃完美結合了實用與美觀，適合多種室內風格，提供黑色、白色及胡桃木色供您選擇。',
                                                    size: 'sm',
                                                    wrap: true,
                                                },
                                                {
                                                    type: "text",
                                                    text: "NT 3500",
                                                    size: "sm",
                                                    color: "#111111",
                                                    align: "end"
                                                }
                                            ],
                                        },
                                        footer: {
                                            type: 'box',
                                            layout: 'vertical',
                                            spacing: 'sm',
                                            contents: [
                                                {
                                                    type: 'button',
                                                    style: 'primary',
                                                    action: {
                                                        type: 'postback',
                                                        label: '我要購買商品一',
                                                        data: JSON.stringify({
                                                            "id": 709,
                                                            "spec": [
                                                                "深棕",
                                                                "100cm"
                                                            ],
                                                            "title": "伊麗莎白 實木衣櫃"
                                                        }), // 自定義的 Postback 資料
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        type: 'bubble',
                                        hero: {
                                            type: 'image',
                                            url: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.20.13-AsophisticatedWindermerecoffeetablewithamodernyetclassicdesign.Thetablefeaturesasolidwoodconstructionwithasmooth,polishedsurfa.webp',
                                            size: 'full',
                                            aspectRatio: '20:13',
                                            aspectMode: 'cover',
                                        },
                                        body: {
                                            type: 'box',
                                            layout: 'vertical',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    text: '溫德米爾 茶几"',
                                                    weight: 'bold',
                                                    size: 'xl',
                                                },
                                                {
                                                    type: 'text',
                                                    text: '選擇溫德米爾茶几，讓您的居家生活更具格調。擁有多種顏色和尺寸，適合各種家庭裝飾需求。',
                                                    size: 'sm',
                                                    wrap: true,
                                                },
                                                {
                                                    type: "text",
                                                    text: "NT 5200",
                                                    size: "sm",
                                                    color: "#111111",
                                                    align: "end"
                                                }
                                            ],
                                        },
                                        footer: {
                                            type: 'box',
                                            layout: 'vertical',
                                            spacing: 'sm',
                                            contents: [
                                                {
                                                    type: 'button',
                                                    style: 'primary',
                                                    action: {
                                                        type: 'postback',
                                                        label: '我要購買商品二',
                                                        data: JSON.stringify({
                                                            "id": 710,
                                                            "sku": "",
                                                            "count": 1,
                                                            "spec": [
                                                                "黑色",
                                                                "小號"
                                                            ],
                                                            "title": "溫德米爾 茶几",
                                                            "sale_price": 5200,
                                                        }), // 自定義的 Postback 資料
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        type: 'bubble',
                                        hero: {
                                            type: 'image',
                                            url: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.20.13-AsophisticatedWindermerecoffeetablewithamodernyetclassicdesign.Thetablefeaturesasolidwoodconstructionwithasmooth,polishedsurfa.webp',
                                            size: 'full',
                                            aspectRatio: '20:13',
                                            aspectMode: 'cover',
                                        },
                                        body: {
                                            type: 'box',
                                            layout: 'vertical',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    text: '溫德米爾 茶几2"',
                                                    weight: 'bold',
                                                    size: 'xl',
                                                },
                                                {
                                                    type: 'text',
                                                    text: '選擇溫德米爾茶几，讓您的居家生活更具格調。擁有多種顏色和尺寸，適合各種家庭裝飾需求。',
                                                    size: 'sm',
                                                    wrap: true,
                                                },
                                                {
                                                    type: "text",
                                                    text: "NT 5200",
                                                    size: "sm",
                                                    color: "#111111",
                                                    align: "end"
                                                }
                                            ],
                                        },
                                        footer: {
                                            type: 'box',
                                            layout: 'vertical',
                                            spacing: 'sm',
                                            contents: [
                                                {
                                                    type: 'button',
                                                    style: 'primary',
                                                    action: {
                                                        type: 'postback',
                                                        label: '我要購買商品二',
                                                        data: JSON.stringify({
                                                            "id": 710,
                                                            "sku": "",
                                                            "count": 1,
                                                            "spec": [
                                                                "黑色",
                                                                "小號"
                                                            ],
                                                            "title": "溫德米爾 茶几",
                                                            "sale_price": 5200,
                                                        }), // 自定義的 Postback 資料
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        type: 'bubble',
                                        hero: {
                                            type: 'image',
                                            url: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.20.13-AsophisticatedWindermerecoffeetablewithamodernyetclassicdesign.Thetablefeaturesasolidwoodconstructionwithasmooth,polishedsurfa.webp',
                                            size: 'full',
                                            aspectRatio: '20:13',
                                            aspectMode: 'cover',
                                        },
                                        body: {
                                            type: 'box',
                                            layout: 'vertical',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    text: '溫德米爾 茶几"',
                                                    weight: 'bold',
                                                    size: 'xl',
                                                },
                                                {
                                                    type: 'text',
                                                    text: '選擇溫德米爾茶几，讓您的居家生活更具格調。擁有多種顏色和尺寸，適合各種家庭裝飾需求。',
                                                    size: 'sm',
                                                    wrap: true,
                                                },
                                                {
                                                    type: "text",
                                                    text: "NT 5200",
                                                    size: "sm",
                                                    color: "#111111",
                                                    align: "end"
                                                }
                                            ],
                                        },
                                        footer: {
                                            type: 'box',
                                            layout: 'vertical',
                                            spacing: 'sm',
                                            contents: [
                                                {
                                                    type: 'button',
                                                    style: 'primary',
                                                    action: {
                                                        type: 'postback',
                                                        label: '我要購買商品二',
                                                        data: JSON.stringify({
                                                            "id": 710,
                                                            "sku": "",
                                                            "count": 1,
                                                            "spec": [
                                                                "黑色",
                                                                "小號"
                                                            ],
                                                            "title": "溫德米爾 茶几",
                                                            "sale_price": 5200,
                                                        }), // 自定義的 Postback 資料
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        };
                        _e.label = 18;
                    case 18:
                        _e.trys.push([18, 20, , 21]);
                        return [4 /*yield*/, axios_1.default.post('https://api.line.me/v2/bot/message/reply', {
                                replyToken: replyToken,
                                messages: [
                                    multiPageMessage
                                ]
                            }, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': "Bearer ".concat(token)
                                }
                            })];
                    case 19:
                        _e.sent();
                        return [3 /*break*/, 21];
                    case 20:
                        e_7 = _e.sent();
                        console.log("e -- ", e_7.response.data);
                        return [3 /*break*/, 21];
                    case 21: return [2 /*return*/, { result: true, message: 'accept message' }];
                    case 22:
                        if (!(event_2.source.type == 'user')) return [3 /*break*/, 32];
                        //取得用戶資訊
                        return [4 /*yield*/, this.getLineInf({ lineID: data.events[0].source.userId }, function (data) {
                                chatData_1.info = {
                                    line: {
                                        name: data.displayName,
                                        head: data.pictureUrl,
                                    },
                                };
                                chatData_1.info = JSON.stringify(chatData_1.info);
                            })];
                    case 23:
                        //取得用戶資訊
                        _e.sent();
                        return [4 /*yield*/, new chat_js_1.Chat(this.app).addChatRoom(chatData_1)];
                    case 24:
                        result = _e.sent();
                        if (!!result.create) return [3 /*break*/, 26];
                        return [4 /*yield*/, database_js_1.default.query("\n                        UPDATE `".concat(this.app, "`.`t_chat_list`\n                        SET ?\n                        WHERE ?\n                    "), [
                                {
                                    info: chatData_1.info,
                                },
                                {
                                    chat_id: chatData_1.chat_id,
                                },
                            ])];
                    case 25:
                        _e.sent();
                        _e.label = 26;
                    case 26:
                        if (!(message.type == 'image')) return [3 /*break*/, 29];
                        post_1 = new user_js_1.User(this.app, this.token);
                        return [4 /*yield*/, post_1.getConfig({
                                key: 'login_line_setting',
                                user_id: 'manager',
                            })];
                    case 27:
                        tokenData_1 = _e.sent();
                        token_2 = "".concat(tokenData_1[0].value.message_token);
                        return [4 /*yield*/, this.getImageContent(message.id, token_2)];
                    case 28:
                        imageUrl = _e.sent();
                        chatData_1.message = {
                            image: imageUrl,
                        };
                        return [3 /*break*/, 30];
                    case 29:
                        chatData_1.message = {
                            text: message.text,
                        };
                        _e.label = 30;
                    case 30: return [4 /*yield*/, new chat_js_1.Chat(this.app).addMessage(chatData_1)];
                    case 31:
                        _e.sent();
                        _e.label = 32;
                    case 32:
                        switch (event_2.type) {
                            case "message":
                                console.log("收到訊息事件");
                                console.log("event -- ", event_2);
                                break;
                            case "postback":
                                console.log("收到 Postback 事件");
                                break;
                            case "follow":
                                console.log("用戶開始追蹤機器人");
                                break;
                            case "unfollow":
                                console.log("用戶取消追蹤機器人");
                                break;
                            case "join":
                                console.log("機器人被加入群組/聊天室");
                                break;
                            case "leave":
                                console.log("機器人被移出群組/聊天室");
                                break;
                            case "memberJoined":
                                console.log("新成員加入群組/聊天室");
                                break;
                            case "memberLeft":
                                console.log("成員離開群組/聊天室");
                                break;
                            case "reaction":
                                console.log("收到 Reaction 事件");
                                break;
                            case "videoPlayComplete":
                                console.log("影片播放完畢");
                                break;
                            case "unsend":
                                console.log("用戶撤回訊息");
                                break;
                            case "things":
                                console.log("收到 LINE Things 物聯網事件");
                                break;
                            default:
                                console.log("未知事件類型:", event_2.type);
                                break;
                        }
                        _e.label = 33;
                    case 33:
                        _b++;
                        return [3 /*break*/, 14];
                    case 34: return [2 /*return*/, { result: true, message: 'accept message' }];
                    case 35:
                        e_8 = _e.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Error:' + e_8, null);
                    case 36: return [2 /*return*/];
                }
            });
        });
    };
    LineMessage.prototype.createOrderWithLineFlexMessage = function (messageData, message) {
        return __awaiter(this, void 0, void 0, function () {
            function areSpecsEqual(spec1, spec2) {
                if (spec1.length !== spec2.length) {
                    return false;
                }
                // 比較排序後的內容
                var sortedSpec1 = __spreadArray([], spec1, true).sort();
                var sortedSpec2 = __spreadArray([], spec2, true).sort();
                return sortedSpec1.every(function (value, index) { return value === sortedSpec2[index]; });
            }
            var replyToken, post, groupId, userId, dataKey, cart, newData, productData, lineItems, tokenData, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("message -- ", messageData);
                        replyToken = messageData.replyToken;
                        post = new user_js_1.User(this.app, this.token);
                        groupId = messageData.source.groupId;
                        userId = messageData.source.userId || '未知使用者';
                        dataKey = groupId + "-" + userId;
                        return [4 /*yield*/, redis_js_1.default.getValue(dataKey)];
                    case 1:
                        cart = _a.sent();
                        newData = JSON.parse(messageData.postback.data);
                        productData = [];
                        return [4 /*yield*/, post.getConfig({
                                key: 'login_line_setting',
                                user_id: 'manager',
                            })];
                    case 2:
                        tokenData = _a.sent();
                        if (cart) {
                            if (typeof cart === "string") {
                                productData = JSON.parse(cart);
                            }
                        }
                        productData.forEach(function (data) {
                            var _a;
                            console.log(data.id, newData.id);
                            console.log(data.spec, newData.spec);
                            if (data.id == newData.id && areSpecsEqual(data.spec, newData.spec)) {
                                data.count = (_a = data.count) !== null && _a !== void 0 ? _a : 1;
                                data.count++;
                            }
                        });
                        productData.push(JSON.parse(messageData.postback.data));
                        return [4 /*yield*/, redis_js_1.default.setValue(dataKey, JSON.stringify(productData))];
                    case 3:
                        _a.sent();
                        token = "".concat(tokenData[0].value.message_token);
                        return [2 /*return*/];
                }
            });
        });
    };
    LineMessage.prototype.sendCustomerLine = function (tag, order_id, lineID) {
        return __awaiter(this, void 0, void 0, function () {
            var customerMail;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, tag, 'zh-TW')];
                    case 1:
                        customerMail = _a.sent();
                        if (!customerMail.toggle) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = resolve;
                                            return [4 /*yield*/, this.sendLine({
                                                    data: {
                                                        text: customerMail.content.replace(/@\{\{訂單號碼\}\}/g, order_id)
                                                    },
                                                    lineID: lineID
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
    LineMessage.prototype.sendMessage = function (token, userId, message) {
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, body, response, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = 'https://api.line.me/v2/bot/message/push';
                        headers = {
                            'Content-Type': 'application/json',
                            Authorization: "Bearer ".concat(token),
                        };
                        body = {
                            to: userId,
                            messages: [
                                {
                                    type: 'text',
                                    text: message,
                                },
                            ],
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.post(url, body, { headers: headers })];
                    case 2:
                        response = _b.sent();
                        console.log('訊息發送成功:', response.data);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.error('發送訊息時出錯:', ((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) || error_1.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LineMessage.prototype.getImageContent = function (messageId, accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get("https://api-data.line.me/v2/bot/message/".concat(messageId, "/content"), {
                                headers: {
                                    Authorization: "Bearer ".concat(accessToken),
                                },
                                responseType: 'arraybuffer', // 指定回應的資料格式為二進位 (Buffer)
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, this.uploadFile("line/".concat(messageId, "/").concat(new Date().getTime(), ".png"), response.data)];
                    case 2: return [2 /*return*/, _a.sent()]; // 回傳圖片的 Buffer
                    case 3:
                        error_2 = _a.sent();
                        console.error('Failed to get image content:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LineMessage.prototype.uploadFile = function (file_name, fileData) {
        return __awaiter(this, void 0, void 0, function () {
            var TAG, logger, s3bucketName, s3path, fullUrl, params;
            var _this = this;
            return __generator(this, function (_a) {
                TAG = "[AWS-S3][Upload]";
                logger = new logger_js_1.default();
                s3bucketName = config_js_1.default.AWS_S3_NAME;
                s3path = file_name;
                fullUrl = config_js_1.default.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
                params = {
                    Bucket: s3bucketName,
                    Key: s3path,
                    Expires: 300,
                    //If you use other contentType will response 403 error
                    ContentType: (function () {
                        if (config_js_1.default.SINGLE_TYPE) {
                            return "application/x-www-form-urlencoded; charset=UTF-8";
                        }
                        else {
                            return mime.getType(fullUrl.split('.').pop());
                        }
                    })(),
                };
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        AWSLib_js_1.default.getSignedUrl('putObject', params, function (err, url) { return __awaiter(_this, void 0, void 0, function () {
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
                                            'Content-Type': params.ContentType,
                                        },
                                    })
                                        .then(function () {
                                        console.log(fullUrl);
                                        resolve(fullUrl);
                                    })
                                        .catch(function () {
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
    LineMessage.prototype.getGroupInf = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var post, tokenData, token, url, headers, response, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        post = new user_js_1.User(this.app, this.token);
                        return [4 /*yield*/, post.getConfig({
                                key: 'login_line_setting',
                                user_id: 'manager',
                            })];
                    case 1:
                        tokenData = _b.sent();
                        token = "".concat(tokenData[0].value.message_token);
                        url = "https://api.line.me/v2/bot/group/".concat(groupId, "/summary");
                        headers = {
                            'Content-Type': 'application/json',
                            Authorization: "Bearer ".concat(token),
                        };
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.get(url, { headers: headers })];
                    case 3:
                        response = _b.sent();
                        console.log('取得群組資訊:', response.data);
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _b.sent();
                        console.error('取得群組資訊錯誤:', ((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) || error_3.message);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LineMessage.prototype.handleJoinEvent = function (event, token) {
        return __awaiter(this, void 0, void 0, function () {
            var replyToken, groupId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        replyToken = event.replyToken;
                        groupId = event.source.groupId;
                        console.log("\u6A5F\u5668\u4EBA\u52A0\u5165\u7FA4\u7D44: ".concat(groupId));
                        // 透過 Reply API 送出歡迎訊息
                        return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/reply", {
                                replyToken: replyToken,
                                messages: [
                                    {
                                        type: "text",
                                        text: "👋 大家好，我是你的 LINE 機器人！請讓管理員點擊驗證按鈕以啟用機器人功能。"
                                    },
                                    {
                                        type: "template",
                                        altText: "請點擊驗證按鈕來完成綁定",
                                        template: {
                                            type: "buttons",
                                            text: "請點擊驗證按鈕",
                                            actions: [
                                                {
                                                    type: "postback",
                                                    label: "驗證群組",
                                                    data: "action=verify"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }, {
                                headers: { Authorization: "Bearer ".concat(process_1.default.env.LINE_CHANNEL_ACCESS_TOKEN) }
                            })];
                    case 1:
                        // 透過 Reply API 送出歡迎訊息
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //判斷餘額是否足夠
    LineMessage.prototype.checkPoints = function (message, user_count) {
        return __awaiter(this, void 0, void 0, function () {
            var brandAndMemberType, sum;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_js_1.App.checkBrandAndMemberType(this.app)];
                    case 1:
                        brandAndMemberType = _a.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT sum(money)\n                     FROM `".concat(brandAndMemberType.brand, "`.t_sms_points\n                     WHERE status in (1, 2)\n                       and userID = ?"), [brandAndMemberType.user_id])];
                    case 2:
                        sum = (_a.sent())[0]['sum(money)'] || 0;
                        return [2 /*return*/, sum > this.getUsePoints(message, user_count)];
                }
            });
        });
    };
    //點數扣除
    LineMessage.prototype.usePoints = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var total, brandAndMemberType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!obj.phone) {
                            return [2 /*return*/, 0];
                        }
                        total = this.getUsePoints(obj.message, obj.user_count);
                        return [4 /*yield*/, app_js_1.App.checkBrandAndMemberType(this.app)];
                    case 1:
                        brandAndMemberType = _a.sent();
                        return [4 /*yield*/, database_js_1.default.query("insert into `".concat(brandAndMemberType.brand, "`.t_sms_points\n                        set ?"), [
                                {
                                    orderID: obj.order_id || tool_js_1.default.randomNumber(8),
                                    money: total * -1,
                                    userID: brandAndMemberType.user_id,
                                    status: 1,
                                    note: JSON.stringify({
                                        message: obj.message,
                                        phone: obj.phone,
                                    }),
                                },
                            ])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, total * -1];
                }
            });
        });
    };
    LineMessage.prototype.getUsePoints = function (text, user_count) {
        var pointCount = 0;
        var maxSize = 160;
        var longSMS = 153;
        var totalSize = 0;
        for (var i = 0; i < text.length; i++) {
            var char = text[i];
            if (/[\u4e00-\u9fa5\uFF00-\uFFEF]/.test(char)) {
                totalSize += 2;
            }
            else {
                totalSize += 1;
            }
        }
        if (totalSize < maxSize) {
            pointCount = 1;
        }
        else {
            pointCount = Math.ceil(totalSize / longSMS);
        }
        return pointCount * 15 * user_count;
    };
    LineMessage.prototype.getUserProfile = function (userId, token) {
        return __awaiter(this, void 0, void 0, function () {
            var post, tokenData, url, headers, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!token) return [3 /*break*/, 2];
                        post = new user_js_1.User(this.app, this.token);
                        return [4 /*yield*/, post.getConfig({
                                key: 'login_line_setting',
                                user_id: 'manager',
                            })];
                    case 1:
                        tokenData = _a.sent();
                        token = "".concat(tokenData[0].value.message_token);
                        _a.label = 2;
                    case 2:
                        url = "https://api.line.me/v2/bot/profile/".concat(userId);
                        headers = {
                            "Authorization": "Bearer ".concat(token)
                        };
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, axios_1.default.get(url, { headers: headers })];
                    case 4:
                        response = _a.sent();
                        return [2 /*return*/, response.data]; // 返回使用者資訊
                    case 5:
                        error_4 = _a.sent();
                        console.error("無法獲取使用者資訊:", error_4);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return LineMessage;
}());
exports.LineMessage = LineMessage;
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

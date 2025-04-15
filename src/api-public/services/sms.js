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
exports.SMS = void 0;
var exception_js_1 = require("../../modules/exception.js");
var database_js_1 = require("../../modules/database.js");
var auto_send_email_js_1 = require("./auto-send-email.js");
var config_1 = require("../../config");
var axios_1 = require("axios");
var app_js_1 = require("../../services/app.js");
var tool_js_1 = require("../../modules/tool.js");
var SMS = /** @class */ (function () {
    function SMS(app, token) {
        this.app = app;
    }
    SMS.prototype.chunkSendSNS = function (data, id, date) {
        return __awaiter(this, void 0, void 0, function () {
            var msgid, _loop_1, _i, _a, b, e_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        msgid = '';
                        _loop_1 = function (b) {
                            var check;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        check = b.length;
                                        return [4 /*yield*/, new Promise(function (resolve) {
                                                for (var _i = 0, b_1 = b; _i < b_1.length; _i++) {
                                                    var d = b_1[_i];
                                                    _this.sendSNS({ data: data.content, phone: d, date: date }, function (res) {
                                                        check--;
                                                        console.log(' res -- ', res);
                                                        if (check === 0) {
                                                            database_js_1.default.query("UPDATE `".concat(_this.app, "`.t_triggers\n                          SET status = ").concat(date ? 0 : 1, ",\n                              content = JSON_SET(content, '$.name', '").concat(res.msgid, "')\n                          WHERE id = ?;"), [id]);
                                                            resolve(true);
                                                        }
                                                    });
                                                }
                                            })];
                                    case 1:
                                        _c.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, _a = chunkArray(Array.from(new Set(data.phone)), 10);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        b = _a[_i];
                        return [5 /*yield**/, _loop_1(b)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _b.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'chunkSendSns Error:' + e_1, null);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SMS.prototype.sendSNS = function (obj, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var snsData, urlConfig_1, _a, _b, _c, e_2;
            var _d;
            var _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 8, , 9]);
                        console.log('obj.phone -- ', obj.phone);
                        return [4 /*yield*/, this.checkPoints(obj.data, 1)];
                    case 1:
                        if (!_g.sent()) return [3 /*break*/, 6];
                        snsData = {
                            username: (_e = config_1.default.SNSAccount) !== null && _e !== void 0 ? _e : '',
                            password: (_f = config_1.default.SNSPWD) !== null && _f !== void 0 ? _f : '',
                            dstaddr: obj.phone,
                            smsPointFlag: 1,
                            smbody: obj.data.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, ''),
                        };
                        if (obj.date) {
                            snsData.dlvtime = obj.date;
                        }
                        urlConfig_1 = {
                            method: 'post',
                            url: config_1.default.SNS_URL + '/api/mtk/SmSend?CharsetURL=UTF8',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            data: snsData,
                        };
                        _a = this.usePoints;
                        _d = {
                            message: obj.data,
                            user_count: 1
                        };
                        _b = obj.order_id;
                        if (_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, tool_js_1.default.randomNumber(10)];
                    case 2:
                        _b = (_g.sent());
                        _g.label = 3;
                    case 3:
                        _c = (_b) + '_';
                        return [4 /*yield*/, tool_js_1.default.randomNumber(5)];
                    case 4: 
                    //扣除點數
                    return [4 /*yield*/, _a.apply(this, [(_d.order_id = _c + (_g.sent()),
                                _d.phone = obj.phone,
                                _d)])];
                    case 5:
                        //扣除點數
                        _g.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                axios_1.default
                                    .request(urlConfig_1)
                                    .then(function (response) {
                                    var result = response.data.split('\r\n');
                                    var snsResponse = {
                                        clientid: result[0],
                                        msgid: result[1].split('=')[1],
                                        statuscode: result[2].split('=')[1],
                                        smsPoint: result[3].split('=')[1],
                                        accountPoint: result[4].split('=')[1],
                                    };
                                    console.log('snsResponse -- ', snsResponse);
                                    callback(snsResponse);
                                    resolve(response.data);
                                })
                                    .catch(function (error) {
                                    console.error('error -- ', error);
                                    resolve(false);
                                });
                            })];
                    case 6: return [2 /*return*/, false];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        e_2 = _g.sent();
                        console.log("error", e_2);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'send SNS Error:' + e_2, null);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    SMS.prototype.deleteSNS = function (obj, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var urlConfig_2;
            return __generator(this, function (_a) {
                try {
                    urlConfig_2 = {
                        method: 'post',
                        url: config_1.default.SNS_URL + "/api/mtk/SmCancel?username=".concat(config_1.default.SNSAccount, "&password=").concat(config_1.default.SNSPWD, "&msgid=").concat(obj.id),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        data: [],
                    };
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            axios_1.default
                                .request(urlConfig_2)
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
    SMS.prototype.parseResponse = function (response) {
        var regex = /\[([0-9]+)\]\r\nmsgid=([^\r\n]+)\r\nstatuscode=([0-9]+)\r\nAccountPoint=([0-9]+)\r\n/;
        var match = response.match(regex);
    };
    SMS.prototype.getSns = function (query) {
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
                        whereSQL = "(tag = 'sendSNS' OR tag = 'sendSNSBySchedule') AND ".concat(whereList.join(' AND '));
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n         FROM `".concat(this.app, "`.t_triggers\n         WHERE ").concat(whereSQL, "\n         ORDER BY id DESC\n             ").concat(query.type === 'download' ? '' : "LIMIT ".concat(query.page * query.limit, ", ").concat(query.limit), ";"), [])];
                    case 1:
                        emails_1 = _d.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT count(id) as c\n         FROM `".concat(this.app, "`.t_triggers\n         WHERE ").concat(whereSQL, ";"), [])];
                    case 2:
                        total = _d.sent();
                        n_1 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_2 = function (email) {
                                    auto_send_email_js_1.AutoSendEmail.getDefCompare(_this.app, email.content.type, 'zh-TW').then(function (dd) {
                                        email.content.typeName = dd && dd.tag_name ? dd.tag_name : '手動發送';
                                        n_1++;
                                    });
                                };
                                for (var _i = 0, emails_2 = emails_1; _i < emails_2.length; _i++) {
                                    var email = emails_2[_i];
                                    _loop_2(email);
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
    SMS.prototype.postSns = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var insertData, insertData, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkPoints(data.content, data.phone.length)];
                    case 1:
                        if (!(_a.sent())) {
                            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'No_Points', {
                                message: '餘額不足',
                            });
                        }
                        data.msgid = '';
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        if (!Boolean(data.sendTime)) return [3 /*break*/, 4];
                        if (isLater(data.sendTime)) {
                            return [2 /*return*/, { result: false, message: '排定發送的時間需大於現在時間' }];
                        }
                        return [4 /*yield*/, database_js_1.default.query("INSERT INTO `".concat(this.app, "`.`t_triggers`\n                                           SET ?;"), [
                                {
                                    tag: 'sendSNS',
                                    content: JSON.stringify(data),
                                    trigger_time: formatDateTime(data.sendTime),
                                    status: 0,
                                },
                            ])];
                    case 3:
                        insertData = _a.sent();
                        this.chunkSendSNS(data, insertData.insertId, formatDateTime(data.sendTime));
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, database_js_1.default.query("INSERT INTO `".concat(this.app, "`.`t_triggers`\n                                           SET ?;"), [
                            {
                                tag: 'sendSNS',
                                content: JSON.stringify(data),
                                trigger_time: formatDateTime(),
                                status: 0,
                            },
                        ])];
                    case 5:
                        insertData = _a.sent();
                        this.chunkSendSNS(data, insertData.insertId);
                        _a.label = 6;
                    case 6: return [2 /*return*/, { result: true, message: '寄送成功' }];
                    case 7:
                        e_4 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMail Error:' + e_4, null);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SMS.prototype.deleteSns = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var emails, e_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n         FROM `".concat(this.app, "`.t_triggers\n         WHERE JSON_EXTRACT(content, '$.name') = '").concat(data.id, "';"), [])];
                    case 1:
                        emails = _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                _this.deleteSNS({ id: data.id }, function (res) {
                                    resolve(true);
                                });
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.t_triggers\n                      SET status = 2\n                      WHERE JSON_EXTRACT(content, '$.name') = '").concat(data.id, "';"), [])];
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
    SMS.prototype.sendCustomerSns = function (tag, order_id, phone) {
        return __awaiter(this, void 0, void 0, function () {
            var customerMail;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, tag, 'zh-TW')];
                    case 1:
                        customerMail = _a.sent();
                        if (!(customerMail.toggle && phone)) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = resolve;
                                            return [4 /*yield*/, this.sendSNS({
                                                    data: customerMail.content.replace(/@\{\{訂單號碼\}\}/g, order_id),
                                                    phone: phone,
                                                    order_id: order_id,
                                                }, function (res) { })];
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
    //判斷餘額是否足夠
    SMS.prototype.checkPoints = function (message, user_count) {
        return __awaiter(this, void 0, void 0, function () {
            var brandAndMemberType, sum;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_js_1.App.checkBrandAndMemberType(this.app)];
                    case 1:
                        brandAndMemberType = _a.sent();
                        console.log('brandAndMemberType-app -- ', this.app);
                        console.log('message -- ', "SELECT sum(money)\n           FROM `".concat(brandAndMemberType.brand, "`.t_sms_points\n           WHERE status in (1, 2)\n             and userID = ").concat(brandAndMemberType.user_id));
                        return [4 /*yield*/, database_js_1.default.query("SELECT sum(money)\n           FROM `".concat(brandAndMemberType.brand, "`.t_sms_points\n           WHERE status in (1, 2)\n             and userID = ?"), [brandAndMemberType.user_id])];
                    case 2:
                        sum = (_a.sent())[0]['sum(money)'] || 0;
                        return [2 /*return*/, sum > this.getUsePoints(message, user_count)];
                }
            });
        });
    };
    //點數扣除
    SMS.prototype.usePoints = function (obj) {
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
                        return [4 /*yield*/, database_js_1.default.query("insert into `".concat(brandAndMemberType.brand, "`.t_sms_points\n       set ?"), [
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
    SMS.prototype.getUsePoints = function (text, user_count) {
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
    return SMS;
}());
exports.SMS = SMS;
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

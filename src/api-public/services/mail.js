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
exports.Mail = void 0;
var exception_js_1 = require("../../modules/exception.js");
var database_js_1 = require("../../modules/database.js");
var ses_js_1 = require("../../services/ses.js");
var auto_send_email_js_1 = require("./auto-send-email.js");
var Mail = /** @class */ (function () {
    function Mail(app, token) {
        this.app = app;
        this.token = token;
    }
    Mail.prototype.chunkSendMail = function (data, id) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, _i, _a, b, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        _loop_1 = function (b) {
                            var check;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        check = b.length;
                                        return [4 /*yield*/, new Promise(function (resolve) {
                                                for (var _i = 0, b_1 = b; _i < b_1.length; _i++) {
                                                    var d = b_1[_i];
                                                    (0, ses_js_1.sendmail)("".concat(data.name, " <").concat(process.env.smtp, ">"), d, data.title, data.content, function () {
                                                        check--;
                                                        if (check === 0) {
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
                        _i = 0, _a = chunkArray(Array.from(new Set(data.email)), 10);
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
                    case 4: return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.t_triggers SET ? WHERE id = ?;"), [{ status: 1 }, id])];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _b.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'chunkSendMail Error:' + e_1, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Mail.prototype.getMail = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var whereList, maiTypeString, whereSQL, emails_1, total, n_1, e_2;
            var _this = this;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        whereList = ['1 = 1'];
                        switch (query.searchType) {
                            case 'email':
                                whereList.push("(JSON_SEARCH(content->'$.email', 'one', '%".concat((_a = query.search) !== null && _a !== void 0 ? _a : '', "%', NULL, '$[*]') IS NOT NULL)"));
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
                        whereSQL = "(tag = 'sendMail' OR tag = 'sendMailBySchedule') AND ".concat(whereList.join(' AND '));
                        return [4 /*yield*/, database_js_1.default.query("SELECT * FROM `".concat(this.app, "`.t_triggers\n                 WHERE ").concat(whereSQL, "\n                 ORDER BY id DESC\n                 ").concat(query.type === 'download' ? '' : "LIMIT ".concat(query.page * query.limit, ", ").concat(query.limit), ";"), [])];
                    case 1:
                        emails_1 = _d.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT count(id) as c FROM `".concat(this.app, "`.t_triggers\n                 WHERE ").concat(whereSQL, ";"), [])];
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
                        e_2 = _d.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getMail Error:' + e_2, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Mail.prototype.postMail = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var insertData, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data.token && delete data.token;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!Boolean(data.sendTime)) return [3 /*break*/, 3];
                        if (isLater(data.sendTime)) {
                            return [2 /*return*/, { result: false, message: '排定發送的時間需大於現在時間' }];
                        }
                        return [4 /*yield*/, database_js_1.default.query("INSERT INTO `".concat(this.app, "`.`t_triggers` SET ? ;"), [
                                {
                                    tag: 'sendMailBySchedule',
                                    content: JSON.stringify(data),
                                    trigger_time: formatDateTime(data.sendTime),
                                    status: 0,
                                },
                            ])];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, database_js_1.default.query("INSERT INTO `".concat(this.app, "`.`t_triggers` SET ? ;"), [
                            {
                                tag: 'sendMail',
                                content: JSON.stringify(data),
                                trigger_time: formatDateTime(),
                                status: 0,
                            },
                        ])];
                    case 4:
                        insertData = _a.sent();
                        this.chunkSendMail(data, insertData.insertId);
                        _a.label = 5;
                    case 5: return [2 /*return*/, { result: true, message: '寄送成功' }];
                    case 6:
                        e_3 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMail Error:' + e_3, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Mail.prototype.cancelSendMail = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.t_triggers SET ? WHERE id = ?;"), [{ status: 2 }, id])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { result: true, message: '取消排定發送成功' }];
                    case 2:
                        e_4 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMail Error:' + e_4, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Mail;
}());
exports.Mail = Mail;
function formatDateTime(sendTime) {
    var dateTimeString = sendTime ? sendTime.date + ' ' + sendTime.time : undefined;
    var dateObject = dateTimeString ? new Date(dateTimeString) : new Date();
    var formattedDateTime = dateObject.toISOString().slice(0, 19).replace('T', ' ');
    return formattedDateTime;
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

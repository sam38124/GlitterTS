"use strict";
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
exports.Rebate = void 0;
var moment_timezone_1 = require("moment-timezone");
var database_1 = require("../../modules/database");
var exception_1 = require("../../modules/exception");
var user_js_1 = require("./user.js");
var app_js_1 = require("../../services/app.js");
var Rebate = /** @class */ (function () {
    function Rebate(app, token) {
        this.app = app;
        this.token = token;
    }
    Rebate.isValidDateTimeString = function (dateTimeString) {
        // 使用正規表達式驗證格式 YYYY-MM-DD 或 YYYY-MM-DD HH:mm:ss
        var dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        var dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        var formattedDateTimeString = dateTimeString;
        if (dateRegex.test(dateTimeString)) {
            // 如果是 YYYY-MM-DD 格式，補上 00:00:00
            formattedDateTimeString = "".concat(dateTimeString, " 00:00:00");
        }
        else if (!dateTimeRegex.test(dateTimeString)) {
            // 如果既不是 YYYY-MM-DD 也不是 YYYY-MM-DD HH:mm:ss 格式，直接返回 false
            return false;
        }
        // 嘗試解析日期
        var date = new Date(formattedDateTimeString.replace(' ', 'T'));
        // 檢查解析後的日期是否有效
        if (isNaN(date.getTime())) {
            return false;
        }
        // 檢查月份和日期是否正確（避免如2023-02-30這種不合法日期）
        var _a = formattedDateTimeString.split(/[- :]/).map(Number), year = _a[0], month = _a[1], day = _a[2], hour = _a[3], minute = _a[4], second = _a[5];
        return (date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day &&
            date.getHours() === hour &&
            date.getMinutes() === minute &&
            date.getSeconds() === second);
    };
    // 取得購物金基本設置
    Rebate.prototype.getConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var getRS, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new user_js_1.User(this.app).getConfig({ key: 'rebate_setting', user_id: 'manager' })];
                    case 1:
                        getRS = _a.sent();
                        if (getRS[0] && getRS[0].value) {
                            return [2 /*return*/, getRS[0].value];
                        }
                        return [2 /*return*/, {}];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        if (error_1 instanceof Error) {
                            throw exception_1.default.BadRequestError('Insert Rebate Error: ', error_1.message, null);
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 確認購物金功能是否啟用
    Rebate.prototype.mainStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, rs, error_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, app_js_1.App.checkBrandAndMemberType(this.app)];
                    case 1:
                        config = _c.sent();
                        if (config.plan === 'light-year')
                            return [2 /*return*/, false]; // 如果是輕量方案，直接回傳 false
                        return [4 /*yield*/, new user_js_1.User(this.app).getConfig({ key: 'rebate_setting', user_id: 'manager' })];
                    case 2:
                        rs = _c.sent();
                        return [2 /*return*/, Boolean((_b = (_a = rs[0]) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.main)];
                    case 3:
                        error_2 = _c.sent();
                        console.error('mainStatus error: ' + error_2);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 單一會員購物金
    Rebate.prototype.getOneRebate = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var nowTime, user_id, point, recycle, pending, user, cbList, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nowTime = Rebate.nowTime();
                        user_id = 0;
                        point = 0;
                        recycle = 0;
                        pending = 0;
                        if (!(obj.user_id && !isNaN(obj.user_id))) return [3 /*break*/, 1];
                        user_id = obj.user_id;
                        return [3 /*break*/, 3];
                    case 1:
                        if (!obj.email) return [3 /*break*/, 3];
                        return [4 /*yield*/, database_1.default.query("SELECT userID FROM `".concat(this.app, "`.t_user \n                    WHERE account = '").concat(obj.email, "' OR JSON_EXTRACT(userData, '$.email') = '").concat(obj.email, "'"), [])];
                    case 2:
                        user = _a.sent();
                        if (user[0]) {
                            user_id = user[0].userID;
                        }
                        _a.label = 3;
                    case 3:
                        if (user_id === 0) {
                            return [2 /*return*/, undefined];
                        }
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, database_1.default.query("SELECT remain, created_at, deadline FROM `".concat(this.app, "`.t_rebate_point \n                    WHERE user_id = ? AND remain > 0"), [user_id, nowTime])];
                    case 5:
                        cbList = _a.sent();
                        cbList.map(function (data) {
                            var remain = data.remain, created_at = data.created_at, deadline = data.deadline;
                            if ((0, moment_timezone_1.default)(created_at).isAfter(nowTime)) {
                                pending += remain;
                            }
                            else if ((0, moment_timezone_1.default)(nowTime).isAfter(deadline)) {
                                recycle += remain;
                            }
                            else {
                                point += remain;
                            }
                        });
                        return [2 /*return*/, { user_id: user_id, point: point, recycle: recycle, pending: pending }];
                    case 6:
                        error_3 = _a.sent();
                        console.error(error_3);
                        if (error_3 instanceof Error) {
                            throw exception_1.default.BadRequestError('Get One Rebate Error: ', error_3.message, null);
                        }
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // 取得購物金列表
    Rebate.prototype.getRebateList = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, start, end, search, low, high, dataArray, searchSQL, getUsersSQL, sum, users, _i, users_1, user, getOne, data, total, error_4;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        limit = (_a = query.limit) !== null && _a !== void 0 ? _a : 20;
                        start = ((query.page || 1) - 1) * limit;
                        end = start + limit;
                        search = (_b = query.search) !== null && _b !== void 0 ? _b : '';
                        low = (_c = query.low) !== null && _c !== void 0 ? _c : 0;
                        high = (_d = query.high) !== null && _d !== void 0 ? _d : 10000000000;
                        dataArray = [];
                        searchSQL = search
                            ? " AND (JSON_EXTRACT(userData, '$.name') LIKE '%".concat(search !== null && search !== void 0 ? search : '', "%'\n                OR JSON_EXTRACT(userData, '$.email') LIKE '%").concat(search !== null && search !== void 0 ? search : '', "%')")
                            : '';
                        getUsersSQL = "SELECT * FROM `".concat(this.app, "`.t_user WHERE 1 = 1 ") + searchSQL;
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, this.totalRebateValue()];
                    case 2:
                        sum = _e.sent();
                        return [4 /*yield*/, database_1.default.query(getUsersSQL, [])];
                    case 3:
                        users = _e.sent();
                        _i = 0, users_1 = users;
                        _e.label = 4;
                    case 4:
                        if (!(_i < users_1.length)) return [3 /*break*/, 7];
                        user = users_1[_i];
                        delete user.pwd;
                        return [4 /*yield*/, this.getOneRebate({ user_id: user.userID })];
                    case 5:
                        getOne = _e.sent();
                        if (getOne && getOne.point >= low && getOne.point <= high) {
                            dataArray.push(__assign(__assign({}, user), getOne));
                        }
                        _e.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        data = query.type === 'download' ? dataArray : dataArray.slice(start, end);
                        total = dataArray.length;
                        return [2 /*return*/, { total: total, data: data, sum: sum }];
                    case 8:
                        error_4 = _e.sent();
                        console.error(error_4);
                        if (error_4 instanceof Error) {
                            throw exception_1.default.BadRequestError('Get Rebate List Error: ', error_4.message, null);
                        }
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    // 取得購物金列表 (逐筆)
    Rebate.prototype.getRebateListByRow = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, low, high, rebateSearchSQL, getUsersSQL, users, rebateCountSQL, rebateSQL, data, total, error_5;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
                        limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 20;
                        low = (_c = query.low) !== null && _c !== void 0 ? _c : 0;
                        high = (_d = query.high) !== null && _d !== void 0 ? _d : 10000000000;
                        rebateSearchSQL = '';
                        getUsersSQL = (query.email_or_phone) ? "\n        SELECT userID, JSON_EXTRACT(userData, '$.name') as name\n        FROM `".concat(this.app, "`.t_user\n        WHERE\n            (JSON_EXTRACT(userData, '$.phone') = ").concat(database_1.default.escape(query.email_or_phone), "\n            OR JSON_EXTRACT(userData, '$.email') = ").concat(database_1.default.escape(query.email_or_phone), ");\n    ") : "\n            SELECT userID, JSON_EXTRACT(userData, '$.name') as name \n            FROM `".concat(this.app, "`.t_user \n            WHERE \n                (JSON_EXTRACT(userData, '$.name') LIKE '%").concat((_e = query.search) !== null && _e !== void 0 ? _e : '', "%'\n                OR JSON_EXTRACT(userData, '$.email') LIKE '%").concat((_f = query.search) !== null && _f !== void 0 ? _f : '', "%');\n        ");
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 6, , 7]);
                        if (!(query.search || query.email_or_phone)) return [3 /*break*/, 3];
                        return [4 /*yield*/, database_1.default.query(getUsersSQL, [])];
                    case 2:
                        users = (_g.sent()).map(function (user) { return user.userID; });
                        rebateSearchSQL = "AND r.user_id in (".concat(users.join(','), ")");
                        _g.label = 3;
                    case 3:
                        rebateCountSQL = "SELECT count(r.id) as c FROM `".concat(this.app, "`.t_rebate_point as r\n                                    WHERE 1 = 1 ").concat(rebateSearchSQL, ";");
                        rebateSQL = "\n                SELECT r.*, JSON_EXTRACT(u.userData, '$.name') as name\n                FROM `".concat(this.app, "`.t_rebate_point as r \n                JOIN `").concat(this.app, "`.t_user as u \n                ON r.user_id = u.userID\n                WHERE 1 = 1 ").concat(rebateSearchSQL, " \n                ORDER BY created_at DESC\n                LIMIT ").concat(page * limit, ", ").concat(limit, ";\n            ");
                        return [4 /*yield*/, database_1.default.query(rebateSQL, [])];
                    case 4:
                        data = _g.sent();
                        return [4 /*yield*/, database_1.default.query(rebateCountSQL, [])];
                    case 5:
                        total = (_g.sent())[0].c;
                        return [2 /*return*/, { total: total, data: data }];
                    case 6:
                        error_5 = _g.sent();
                        console.error(error_5);
                        if (error_5 instanceof Error) {
                            throw exception_1.default.BadRequestError('Get Rebate List Error: ', error_5.message, null);
                        }
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // 取得總計項目
    Rebate.prototype.totalRebateValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nowTime, remainsSQL, point, recycle, pending, remains, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nowTime = Rebate.nowTime();
                        remainsSQL = "SELECT remain, created_at, deadline FROM `".concat(this.app, "`.t_rebate_point WHERE remain > 0;");
                        point = 0;
                        recycle = 0;
                        pending = 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query(remainsSQL, [])];
                    case 2:
                        remains = _a.sent();
                        remains.map(function (data) {
                            var remain = data.remain, created_at = data.created_at, deadline = data.deadline;
                            var n = parseInt(remain + '', 10);
                            if ((0, moment_timezone_1.default)(created_at).isAfter(nowTime)) {
                                pending += n;
                            }
                            else if ((0, moment_timezone_1.default)(nowTime).isAfter(deadline)) {
                                recycle += n;
                            }
                            else {
                                point += n;
                            }
                        });
                        return [2 /*return*/, { point: point, recycle: recycle, pending: pending }];
                    case 3:
                        error_6 = _a.sent();
                        console.error(error_6);
                        if (error_6 instanceof Error) {
                            throw exception_1.default.BadRequestError('Total Rebate Value Error: ', error_6.message, null);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 單一會員購物金歷史紀錄
    Rebate.prototype.getCustomerRebateHistory = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var searchSQL, rebateSQL, search, data, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchSQL = "SELECT userID FROM `".concat(this.app, "`.t_user \n                            WHERE JSON_EXTRACT(userData, '$.email') = ? OR userID = ?");
                        rebateSQL = "SELECT * FROM `".concat(this.app, "`.t_rebate_point where user_id = ? order by id desc");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, database_1.default.query(searchSQL, [obj.email, obj.user_id])];
                    case 2:
                        search = _a.sent();
                        if (!(search.length == 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, database_1.default.query(rebateSQL, [search[0].userID])];
                    case 3:
                        data = (_a.sent()).map(function (x) {
                            x.created_at = (0, moment_timezone_1.default)(x.created_at).format('YYYY-MM-DD HH:mm:ss');
                            x.updated_at = (0, moment_timezone_1.default)(x.updated_at).format('YYYY-MM-DD HH:mm:ss');
                            x.deadline = x.deadline ? (0, moment_timezone_1.default)(x.deadline).format('YYYY-MM-DD HH:mm:ss') : null;
                            return x;
                        });
                        return [2 /*return*/, { result: true, data: data }];
                    case 4: return [2 /*return*/, { result: false, message: '此信箱尚未建立' }];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_7 = _a.sent();
                        console.error(error_7);
                        if (error_7 instanceof Error) {
                            throw exception_1.default.BadRequestError('Get Customer Rebate History Error: ', error_7.message, null);
                        }
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // 取得最舊一筆的餘額並更新
    Rebate.prototype.getOldestRebate = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var nowTime, getSQL, get, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user_id = parseInt("".concat(user_id), 10);
                        nowTime = Rebate.nowTime();
                        getSQL = "SELECT * FROM `".concat(this.app, "`.t_rebate_point WHERE user_id = ? AND deadline > ? AND remain > 0 ORDER BY deadline");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query(getSQL, [user_id, nowTime])];
                    case 2:
                        get = _a.sent();
                        return [2 /*return*/, { data: get.length > 0 ? get[0] : {} }];
                    case 3:
                        error_8 = _a.sent();
                        console.error(error_8);
                        if (error_8 instanceof Error) {
                            throw exception_1.default.BadRequestError('Update Oldest Rebate Error: ', error_8.message, null);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 減少最舊一筆的餘額並更新
    Rebate.prototype.updateOldestRebate = function (user_id, originMinus) {
        return __awaiter(this, void 0, void 0, function () {
            var nowTime, updateSQL, minus, oldest, _a, id, remain, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user_id = parseInt("".concat(user_id), 10);
                        nowTime = Rebate.nowTime();
                        updateSQL = "UPDATE `".concat(this.app, "`.t_rebate_point SET remain = ?, updated_at = ? WHERE id = ?");
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 11, , 12]);
                        minus = -originMinus;
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.getOldestRebate(user_id)];
                    case 3:
                        oldest = _b.sent();
                        if (!(oldest === null || oldest === void 0 ? void 0 : oldest.data)) return [3 /*break*/, 8];
                        _a = oldest === null || oldest === void 0 ? void 0 : oldest.data, id = _a.id, remain = _a.remain;
                        if (!(id && remain !== undefined)) return [3 /*break*/, 7];
                        if (!(remain - minus > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, database_1.default.execute(updateSQL, [remain - minus, nowTime, id])];
                    case 4:
                        _b.sent();
                        minus = 0;
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, database_1.default.execute(updateSQL, [0, nowTime, id])];
                    case 6:
                        _b.sent();
                        minus = minus - remain;
                        _b.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, false];
                    case 9:
                        if (minus > 0) return [3 /*break*/, 2];
                        _b.label = 10;
                    case 10: return [2 /*return*/, true];
                    case 11:
                        error_9 = _b.sent();
                        console.error(error_9);
                        if (error_9 instanceof Error) {
                            throw exception_1.default.BadRequestError('Update Oldest Rebate Error: ', error_9.message, null);
                        }
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    // 確認是否可減少會員購物金
    Rebate.prototype.minusCheck = function (user_id, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var getUserRebate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user_id = parseInt("".concat(user_id), 10);
                        return [4 /*yield*/, this.getOneRebate({ user_id: user_id })];
                    case 1:
                        getUserRebate = _a.sent();
                        return [2 /*return*/, getUserRebate && getUserRebate.point + amount > 0];
                }
            });
        });
    };
    // 增加或減少會員購物金
    Rebate.prototype.insertRebate = function (user_id, amount, note, proof) {
        return __awaiter(this, void 0, void 0, function () {
            var nowTime, deadTime, insertSQL, getUserRebate, recentRebate, errorObj, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user_id = parseInt("".concat(user_id), 10);
                        nowTime = (proof === null || proof === void 0 ? void 0 : proof.setCreatedAt) ? proof.setCreatedAt : Rebate.nowTime();
                        deadTime = (proof === null || proof === void 0 ? void 0 : proof.deadTime) && Rebate.isValidDateTimeString(proof === null || proof === void 0 ? void 0 : proof.deadTime)
                            ? (0, moment_timezone_1.default)(proof === null || proof === void 0 ? void 0 : proof.deadTime).format('YYYY-MM-DD HH:mm:ss')
                            : '2999-12-31 00:00:00';
                        insertSQL = "\n            insert into `".concat(this.app, "`.t_rebate_point\n            (user_id, origin, remain, note, content, created_at, updated_at, deadline)\n            values (?, ?, ?, ?, ?, ?, ?, ?)\n        ");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, this.getOneRebate({ user_id: user_id })];
                    case 2:
                        getUserRebate = _a.sent();
                        recentRebate = getUserRebate ? getUserRebate.point : 0;
                        errorObj = {
                            result: false,
                            user_id: user_id,
                            before_point: recentRebate,
                            amount: amount,
                            msg: '',
                        };
                        return [4 /*yield*/, this.mainStatus()];
                    case 3:
                        if (!(_a.sent())) {
                            errorObj.msg = '購物金功能關閉中';
                            return [2 /*return*/, errorObj];
                        }
                        if (recentRebate + amount < 0) {
                            errorObj.msg = (proof === null || proof === void 0 ? void 0 : proof.order_id) ? '購物金餘額不足' : '扣除金額請勿大於餘額';
                            return [2 /*return*/, errorObj];
                        }
                        if (!(amount > 0)) return [3 /*break*/, 5];
                        if (proof) {
                            delete proof.deadTime;
                            delete proof.setCreatedAt;
                        }
                        return [4 /*yield*/, database_1.default.execute(insertSQL, [user_id, amount, amount, note, proof !== null && proof !== void 0 ? proof : {}, nowTime, nowTime, deadTime])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!(amount < 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.updateOldestRebate(user_id, amount)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, database_1.default.execute(insertSQL, [
                                user_id,
                                amount,
                                0,
                                note,
                                proof && proof.type ? { type: proof.type } : {},
                                nowTime,
                                nowTime,
                                null,
                            ])];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/, {
                            result: true,
                            user_id: user_id,
                            before_point: recentRebate,
                            amount: amount,
                            after_point: recentRebate + amount,
                            deadTime: amount > 0 ? deadTime : undefined,
                            msg: "".concat(amount > 0 ? '增加' : '扣除', "\u8CFC\u7269\u91D1\u6210\u529F"),
                        }];
                    case 9:
                        error_10 = _a.sent();
                        console.error(error_10);
                        if (error_10 instanceof Error) {
                            throw exception_1.default.BadRequestError('Insert Rebate Error: ', error_10.message, null);
                        }
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    // 確認是否增加過購物金
    Rebate.prototype.canUseRebate = function (user_id, type, search) {
        return __awaiter(this, void 0, void 0, function () {
            var userExist, SQL, voucher_id, order_id, sku, quantity, data, data, data, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, new user_js_1.User(this.app).checkUserIdExists(user_id)];
                    case 1:
                        userExist = _a.sent();
                        if (!userExist) {
                            return [2 /*return*/, { result: false, msg: '此使用者不存在' }];
                        }
                        SQL = "SELECT * FROM `".concat(this.app, "`.t_rebate_point WHERE user_id = ").concat(user_id, " AND origin > 0");
                        if (!(type === 'voucher' && search)) return [3 /*break*/, 3];
                        voucher_id = search.voucher_id, order_id = search.order_id, sku = search.sku, quantity = search.quantity;
                        return [4 /*yield*/, database_1.default.query("".concat(SQL, " \n                        AND JSON_EXTRACT(content, '$.voucher_id') = ?\n                        AND JSON_EXTRACT(content, '$.order_id') = ?\n                        AND JSON_EXTRACT(content, '$.sku') = ?\n                        AND JSON_EXTRACT(content, '$.quantity') = ?;"), [voucher_id, order_id, sku, quantity])];
                    case 2:
                        data = _a.sent();
                        if (data.length > 0)
                            return [2 /*return*/, { result: false, msg: '此優惠券已使用過' }];
                        _a.label = 3;
                    case 3:
                        if (!(type === 'birth')) return [3 /*break*/, 5];
                        return [4 /*yield*/, database_1.default.query("".concat(SQL, " \n                            AND JSON_EXTRACT(content, '$.type') = 'birth'\n                            AND YEAR(created_at) = YEAR(CURDATE());"), [])];
                    case 4:
                        data = _a.sent();
                        if (data.length > 0)
                            return [2 /*return*/, { result: false, msg: '生日購物金已發放過' }];
                        _a.label = 5;
                    case 5:
                        if (!(type === 'first_regiser')) return [3 /*break*/, 7];
                        return [4 /*yield*/, database_1.default.query("".concat(SQL, " AND JSON_EXTRACT(content, '$.type') = 'first_regiser';"), [])];
                    case 6:
                        data = _a.sent();
                        if (data.length > 0)
                            return [2 /*return*/, { result: false, msg: '首次註冊購物金已發放過' }];
                        _a.label = 7;
                    case 7: return [2 /*return*/, { result: true, msg: '此優惠券可使用' }];
                    case 8:
                        error_11 = _a.sent();
                        console.error(error_11);
                        if (error_11 instanceof Error) {
                            throw exception_1.default.BadRequestError('Check Rebate Error: ', error_11.message, null);
                        }
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Rebate.nowTime = function (timeZone) {
        return (0, moment_timezone_1.default)(new Date()).format('YYYY-MM-DD HH:mm:ss');
    };
    return Rebate;
}());
exports.Rebate = Rebate;

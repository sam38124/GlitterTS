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
exports.Schedule = void 0;
var moment_1 = require("moment");
var database_1 = require("../../modules/database");
var exception_1 = require("../../modules/exception");
var axios_1 = require("axios");
var rebate_1 = require("./rebate");
var user_1 = require("./user");
var shopping_1 = require("./shopping");
var mail_js_1 = require("../services/mail.js");
var auto_send_email_js_1 = require("./auto-send-email.js");
var config_1 = require("../../config");
var initial_fake_data_js_1 = require("./initial-fake-data.js");
var line_message_1 = require("./line-message");
var public_table_check_js_1 = require("./public-table-check.js");
var app_js_1 = require("../../services/app.js");
var user_update_js_1 = require("./user-update.js");
var Schedule = /** @class */ (function () {
    function Schedule() {
    }
    Schedule.prototype.perload = function (app) {
        return __awaiter(this, void 0, void 0, function () {
            var brand_type;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_js_1.App.checkBrandAndMemberType(app)];
                    case 1:
                        brand_type = _a.sent();
                        if (!(brand_type.brand === 'shopnex' && brand_type.domain)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.isDatabasePass(app)];
                    case 2:
                        if (!(_a.sent()))
                            return [2 /*return*/, false];
                        return [4 /*yield*/, public_table_check_js_1.ApiPublic.createScheme(app)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    Schedule.prototype.isDatabaseExists = function (app) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SHOW DATABASES LIKE '".concat(app, "';"), [])];
                    case 1: return [2 /*return*/, (_a.sent()).length > 0];
                }
            });
        });
    };
    Schedule.prototype.isDatabasePass = function (app) {
        return __awaiter(this, void 0, void 0, function () {
            var SQL;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        SQL = "\n            SELECT *\n            FROM ".concat(config_1.saasConfig.SAAS_NAME, ".app_config\n            WHERE appName = '").concat(app, "'\n              AND (refer_app is null OR refer_app = appName);\n        ");
                        return [4 /*yield*/, database_1.default.query(SQL, [])];
                    case 1: return [2 /*return*/, (_a.sent()).length > 0];
                }
            });
        });
    };
    Schedule.prototype.isTableExists = function (table, app) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SHOW TABLES IN `".concat(app, "` LIKE '").concat(table, "';"), [])];
                    case 1: return [2 /*return*/, (_a.sent()).length > 0];
                }
            });
        });
    };
    Schedule.prototype.example = function (sec) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, app, e_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _i = 0, _a = Schedule.app;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        app = _a[_i];
                        return [4 /*yield*/, this.perload(app)];
                    case 2:
                        if (_b.sent()) {
                            // 排程範例
                            // await
                        }
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _b.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'Example Error: ' + e_1, null);
                    case 6:
                        setTimeout(function () { return _this.example(sec); }, sec * 1000);
                        return [2 /*return*/];
                }
            });
        });
    };
    Schedule.prototype.autoCancelOrder = function (sec) {
        return __awaiter(this, void 0, void 0, function () {
            var clock, _loop_1, this_1, _i, _a, app;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        clock = new Date();
                        console.log("autoCancelOrder");
                        _loop_1 = function (app) {
                            var config, orders, e_2;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 6, , 7]);
                                        return [4 /*yield*/, this_1.perload(app)];
                                    case 1:
                                        if (!_c.sent()) return [3 /*break*/, 5];
                                        return [4 /*yield*/, new user_1.User(app).getConfigV2({ key: 'login_config', user_id: 'manager' })];
                                    case 2:
                                        config = _c.sent();
                                        if (!((config === null || config === void 0 ? void 0 : config.auto_cancel_order_timer) && config.auto_cancel_order_timer > 0)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(app, "`.t_checkout\n                                WHERE \n                                    status = 0 \n                                    AND created_time < NOW() - INTERVAL ").concat(config.auto_cancel_order_timer, " HOUR\n                                    AND (orderData->>'$.proof_purchase' IS NULL)\n                                    AND order_status='0'\n                                    AND progress='wait'\n                                    AND payment_method != 'cash_on_delivery'\n                                ORDER BY id DESC;"), [])];
                                    case 3:
                                        orders = _c.sent();
                                        return [4 /*yield*/, Promise.all(orders.map(function (order) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    order.orderData.orderStatus = '-1';
                                                    order.orderData.archived = 'true';
                                                    return [2 /*return*/, new shopping_1.Shopping(app).putOrder({
                                                            id: order.id,
                                                            orderData: order.orderData,
                                                            status: '0',
                                                        })];
                                                });
                                            }); }))];
                                    case 4:
                                        _c.sent();
                                        _c.label = 5;
                                    case 5: return [3 /*break*/, 7];
                                    case 6:
                                        e_2 = _c.sent();
                                        console.error("autoCancelOrder-Error", e_2);
                                        return [3 /*break*/, 7];
                                    case 7: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = Schedule.app;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        app = _a[_i];
                        return [5 /*yield**/, _loop_1(app)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        setTimeout(function () { return _this.autoCancelOrder(sec); }, sec * 1000);
                        console.log("autoCancelOrder-Stop", (new Date().getTime() - clock.getTime()) / 1000);
                        return [2 /*return*/];
                }
            });
        });
    };
    Schedule.prototype.renewMemberLevel = function (sec) {
        return __awaiter(this, void 0, void 0, function () {
            var clock, _i, _a, app, users, _b, users_1, user, e_3, e_4;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        clock = new Date();
                        console.log("renewMemberLevel");
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 14, , 15]);
                        _i = 0, _a = Schedule.app;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 13];
                        app = _a[_i];
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 11, , 12]);
                        return [4 /*yield*/, this.perload(app)];
                    case 4:
                        if (!_c.sent()) return [3 /*break*/, 10];
                        return [4 /*yield*/, database_1.default.query("select * from `".concat(app, "`.t_user  "), [])];
                    case 5:
                        users = _c.sent();
                        _b = 0, users_1 = users;
                        _c.label = 6;
                    case 6:
                        if (!(_b < users_1.length)) return [3 /*break*/, 10];
                        user = users_1[_b];
                        return [4 /*yield*/, new user_1.User(app).checkMember(user, true)];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, user_update_js_1.UserUpdate.update(app, user.userID)];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9:
                        _b++;
                        return [3 /*break*/, 6];
                    case 10:
                        console.log("renewMemberLevel-finish->", app);
                        return [3 /*break*/, 12];
                    case 11:
                        e_3 = _c.sent();
                        console.log("renewMemberLevel-error-continue");
                        return [3 /*break*/, 12];
                    case 12:
                        _i++;
                        return [3 /*break*/, 2];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        e_4 = _c.sent();
                        console.error('BAD_REQUEST', 'renewMemberLevel Error: ' + e_4, null);
                        return [3 /*break*/, 15];
                    case 15:
                        setTimeout(function () { return _this.renewMemberLevel(sec); }, sec * 1000);
                        console.log("renewMemberLevel-Stop", (new Date().getTime() - clock.getTime()) / 1000);
                        return [2 /*return*/];
                }
            });
        });
    };
    Schedule.prototype.birthRebate = function (sec) {
        return __awaiter(this, void 0, void 0, function () {
            var clock, _loop_2, this_2, _i, _a, app;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        clock = new Date();
                        console.log("resetVoucherHistory");
                        _loop_2 = function (app) {
                            function postUserRebate(id, value) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var used;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, rebateClass_1.canUseRebate(id, 'birth')];
                                            case 1:
                                                used = _a.sent();
                                                if (!(used === null || used === void 0 ? void 0 : used.result)) return [3 /*break*/, 3];
                                                if (!(value !== 0)) return [3 /*break*/, 3];
                                                return [4 /*yield*/, rebateClass_1.insertRebate(id, value, '生日禮', {
                                                        type: 'birth',
                                                        deadTime: rgs_1.unlimited ? undefined : (0, moment_1.default)().add(rgs_1.date, 'd').format('YYYY-MM-DD HH:mm:ss'),
                                                    })];
                                            case 2:
                                                _a.sent();
                                                _a.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                });
                            }
                            var rebateClass_1, userClass, getRS, rgs_1, users, _c, users_2, user, levelData, usersLevel, _loop_3, _d, users_3, user, e_5;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        _e.trys.push([0, 15, , 16]);
                                        return [4 /*yield*/, this_2.perload(app)];
                                    case 1:
                                        if (!_e.sent()) return [3 /*break*/, 14];
                                        rebateClass_1 = new rebate_1.Rebate(app);
                                        userClass = new user_1.User(app);
                                        return [4 /*yield*/, rebateClass_1.mainStatus()];
                                    case 2:
                                        if (!_e.sent()) return [3 /*break*/, 14];
                                        return [4 /*yield*/, userClass.getConfig({ key: 'rebate_setting', user_id: 'manager' })];
                                    case 3:
                                        getRS = _e.sent();
                                        rgs_1 = getRS[0] && getRS[0].value.birth ? getRS[0].value.birth : {};
                                        if (!(rgs_1 && rgs_1.switch)) return [3 /*break*/, 14];
                                        return [4 /*yield*/, database_1.default.query("SELECT *\n                             FROM `".concat(app, "`.t_user\n                             WHERE MONTH (JSON_EXTRACT(userData, '$.birth')) = MONTH (CURDATE());"), [])];
                                    case 4:
                                        users = _e.sent();
                                        if (!(rgs_1.type === 'base')) return [3 /*break*/, 8];
                                        _c = 0, users_2 = users;
                                        _e.label = 5;
                                    case 5:
                                        if (!(_c < users_2.length)) return [3 /*break*/, 8];
                                        user = users_2[_c];
                                        return [4 /*yield*/, postUserRebate(user.userID, rgs_1.value)];
                                    case 6:
                                        _e.sent();
                                        _e.label = 7;
                                    case 7:
                                        _c++;
                                        return [3 /*break*/, 5];
                                    case 8: return [4 /*yield*/, userClass.getConfigV2({ key: 'member_level_config', user_id: 'manager' })];
                                    case 9:
                                        levelData = _e.sent();
                                        levelData.levels = levelData.levels || [];
                                        if (!(rgs_1.type === 'levels')) return [3 /*break*/, 14];
                                        return [4 /*yield*/, userClass.getUserLevel(users.map(function (item) {
                                                return { userId: item.userID };
                                            }))];
                                    case 10:
                                        usersLevel = _e.sent();
                                        _loop_3 = function (user) {
                                            var member, data;
                                            return __generator(this, function (_f) {
                                                switch (_f.label) {
                                                    case 0:
                                                        member = usersLevel.find(function (item) { return item.id == user.userID; });
                                                        if (member && member.data.id === '') {
                                                            return [2 /*return*/, "continue"];
                                                        }
                                                        data = rgs_1.level.find(function (item) { return item.id == (member === null || member === void 0 ? void 0 : member.data.id); });
                                                        if (!data) {
                                                            return [2 /*return*/, "continue"];
                                                        }
                                                        return [4 /*yield*/, postUserRebate(user.userID, data.value)];
                                                    case 1:
                                                        _f.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _d = 0, users_3 = users;
                                        _e.label = 11;
                                    case 11:
                                        if (!(_d < users_3.length)) return [3 /*break*/, 14];
                                        user = users_3[_d];
                                        return [5 /*yield**/, _loop_3(user)];
                                    case 12:
                                        _e.sent();
                                        _e.label = 13;
                                    case 13:
                                        _d++;
                                        return [3 /*break*/, 11];
                                    case 14: return [3 /*break*/, 16];
                                    case 15:
                                        e_5 = _e.sent();
                                        console.error('BAD_REQUEST', 'birthRebate Error: ' + e_5, null);
                                        return [3 /*break*/, 16];
                                    case 16: return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _i = 0, _a = Schedule.app;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        app = _a[_i];
                        return [5 /*yield**/, _loop_2(app)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        setTimeout(function () { return _this.birthRebate(sec); }, sec * 1000);
                        console.log("birthRebate-Stop", (new Date().getTime() - clock.getTime()) / 1000);
                        return [2 /*return*/];
                }
            });
        });
    };
    Schedule.prototype.birthBlessMail = function (sec) {
        return __awaiter(this, void 0, void 0, function () {
            var clock, _loop_4, this_3, _i, _a, app;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        clock = new Date();
                        console.log("resetVoucherHistory");
                        _loop_4 = function (app) {
                            var mailType, customerMail, mailClass, sendRecords, users, now, oneYearAgo_1, filteredData, hasBless_1, _c, users_4, user, e_6;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _d.trys.push([0, 9, , 10]);
                                        return [4 /*yield*/, this_3.perload(app)];
                                    case 1:
                                        if (!_d.sent()) return [3 /*break*/, 8];
                                        mailType = 'auto-email-birthday';
                                        return [4 /*yield*/, auto_send_email_js_1.AutoSendEmail.getDefCompare(app, mailType, 'zh-TW')];
                                    case 2:
                                        customerMail = _d.sent();
                                        if (!customerMail.toggle) return [3 /*break*/, 8];
                                        mailClass = new mail_js_1.Mail(app);
                                        return [4 /*yield*/, mailClass.getMail({
                                                type: 'download',
                                                page: 0,
                                                limit: 0,
                                                mailType: mailType,
                                            })];
                                    case 3:
                                        sendRecords = _d.sent();
                                        return [4 /*yield*/, database_1.default.query("SELECT *\n                            FROM `".concat(app, "`.t_user\n                            WHERE MONTH (JSON_EXTRACT(userData, '$.birth')) = MONTH (CURDATE());"), [])];
                                    case 4:
                                        users = _d.sent();
                                        now = new Date();
                                        oneYearAgo_1 = new Date(now);
                                        oneYearAgo_1.setFullYear(now.getFullYear() - 1);
                                        filteredData = sendRecords.data.filter(function (item) {
                                            var triggerTime = new Date(item.trigger_time);
                                            return triggerTime > oneYearAgo_1;
                                        });
                                        hasBless_1 = [];
                                        filteredData.map(function (item) {
                                            hasBless_1 = hasBless_1.concat(item.content.email);
                                        });
                                        hasBless_1 = __spreadArray([], new Set(hasBless_1), true);
                                        _c = 0, users_4 = users;
                                        _d.label = 5;
                                    case 5:
                                        if (!(_c < users_4.length)) return [3 /*break*/, 8];
                                        user = users_4[_c];
                                        if (!!hasBless_1.includes(user.userData.email)) return [3 /*break*/, 7];
                                        return [4 /*yield*/, mailClass.postMail({
                                                name: customerMail.name,
                                                title: customerMail.title.replace(/@\{\{user_name\}\}/g, user.userData.name),
                                                content: customerMail.content.replace(/@\{\{user_name\}\}/g, user.userData.name),
                                                email: [user.userData.email],
                                                type: mailType,
                                            })];
                                    case 6:
                                        _d.sent();
                                        _d.label = 7;
                                    case 7:
                                        _c++;
                                        return [3 /*break*/, 5];
                                    case 8: return [3 /*break*/, 10];
                                    case 9:
                                        e_6 = _d.sent();
                                        console.error('BAD_REQUEST', 'birthBlessMail Error: ' + e_6, null);
                                        return [3 /*break*/, 10];
                                    case 10: return [2 /*return*/];
                                }
                            });
                        };
                        this_3 = this;
                        _i = 0, _a = Schedule.app;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        app = _a[_i];
                        return [5 /*yield**/, _loop_4(app)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        setTimeout(function () { return _this.birthBlessMail(sec); }, sec * 1000);
                        console.log("birthBlessMail-Stop", (new Date().getTime() - clock.getTime()) / 1000);
                        return [2 /*return*/];
                }
            });
        });
    };
    Schedule.prototype.resetVoucherHistory = function (sec) {
        return __awaiter(this, void 0, void 0, function () {
            var clock, _i, _a, app, e_7;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        clock = new Date();
                        console.log("resetVoucherHistory");
                        _i = 0, _a = Schedule.app;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        app = _a[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.perload(app)];
                    case 3:
                        if (!_b.sent()) return [3 /*break*/, 5];
                        return [4 /*yield*/, new shopping_1.Shopping(app).resetVoucherHistory()];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_7 = _b.sent();
                        console.error('BAD_REQUEST', 'resetVoucherHistory Error: ' + e_7, null);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8:
                        setTimeout(function () { return _this.resetVoucherHistory(sec); }, sec * 1000);
                        console.log("resetVoucherHistory-Stop", (new Date().getTime() - clock.getTime()) / 1000);
                        return [2 /*return*/];
                }
            });
        });
    };
    Schedule.prototype.autoSendMail = function (sec) {
        return __awaiter(this, void 0, void 0, function () {
            var clock, _i, _a, app, emails, _b, emails_1, email, e_8;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        clock = new Date();
                        console.log("autoSendLine");
                        _i = 0, _a = Schedule.app;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        app = _a[_i];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.perload(app)];
                    case 3:
                        if (!_c.sent()) return [3 /*break*/, 5];
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(app, "`.t_triggers\n                     WHERE \n                        tag = 'sendMailBySchedule' AND \n                        status = 0 AND\n                        DATE_FORMAT(trigger_time, '%Y-%m-%d %H:%i') = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i');"), [])];
                    case 4:
                        emails = _c.sent();
                        for (_b = 0, emails_1 = emails; _b < emails_1.length; _b++) {
                            email = emails_1[_b];
                            if (email.status === 0) {
                                new mail_js_1.Mail(app).chunkSendMail(email.content, email.id);
                            }
                        }
                        _c.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_8 = _c.sent();
                        console.error('BAD_REQUEST', 'autoSendMail Error: ' + e_8, null);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8:
                        setTimeout(function () { return _this.autoSendMail(sec); }, sec * 1000);
                        console.log("autoSendMail-Stop", (new Date().getTime() - clock.getTime()) / 1000);
                        return [2 /*return*/];
                }
            });
        });
    };
    Schedule.prototype.autoSendLine = function (sec) {
        return __awaiter(this, void 0, void 0, function () {
            var clock, _i, _a, app, emails, _b, emails_2, email, e_9;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        clock = new Date();
                        console.log("autoSendLine");
                        _i = 0, _a = Schedule.app;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        app = _a[_i];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.perload(app)];
                    case 3:
                        if (!_c.sent()) return [3 /*break*/, 5];
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(app, "`.t_triggers\n                     WHERE \n                        tag = 'sendLineBySchedule' AND \n                        DATE_FORMAT(trigger_time, '%Y-%m-%d %H:%i') = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i');"), [])];
                    case 4:
                        emails = _c.sent();
                        for (_b = 0, emails_2 = emails; _b < emails_2.length; _b++) {
                            email = emails_2[_b];
                            if (email.status === 0) {
                                new line_message_1.LineMessage(app).chunkSendLine(email.userList, {
                                    data: {
                                        text: email.content,
                                    },
                                }, email.id);
                            }
                        }
                        _c.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_9 = _c.sent();
                        console.error('BAD_REQUEST', 'autoSendLine Error: ' + e_9, null);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8:
                        setTimeout(function () { return _this.autoSendLine(sec); }, sec * 1000);
                        console.log("autoSendLine-Stop", (new Date().getTime() - clock.getTime()) / 1000);
                        return [2 /*return*/];
                }
            });
        });
    };
    Schedule.prototype.initialSampleApp = function (sec) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new initial_fake_data_js_1.InitialFakeData("t_1725992531001").run()];
                    case 1:
                        _a.sent();
                        setTimeout(function () { return _this.initialSampleApp(sec); }, sec * 1000);
                        return [2 /*return*/];
                }
            });
        });
    };
    Schedule.prototype.currenciesUpdate = function (sec) {
        return __awaiter(this, void 0, void 0, function () {
            var date, date_index, clock, config;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        date = new Date();
                        date_index = "".concat(date.getFullYear(), "-").concat(date.getMonth() + 1, "-").concat(date.getDate());
                        clock = new Date();
                        console.log("currenciesUpdate-Start");
                        return [4 /*yield*/, database_1.default.query("select count(1) from `".concat(config_1.saasConfig.SAAS_NAME, "`.currency_config where updated='").concat(date_index, "'"), [])];
                    case 1:
                        if ((_a.sent())[0]['count(1)'] === 0) {
                            config = {
                                method: 'get',
                                maxBodyLength: Infinity,
                                url: 'https://data.fixer.io/api/latest?access_key=0ced797dd1cc136b22d6cfee7e2d6476',
                                headers: {},
                            };
                            axios_1.default
                                .request(config)
                                .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, database_1.default.query("insert into `".concat(config_1.saasConfig.SAAS_NAME, "`.currency_config (`json`,updated) values (?,?)"), [JSON.stringify(response.data), date_index])];
                                        case 1:
                                            _a.sent();
                                            setTimeout(function () { return _this.currenciesUpdate(sec); }, sec * 1000);
                                            return [2 /*return*/];
                                    }
                                });
                            }); })
                                .catch(function (error) {
                                console.error(error);
                                setTimeout(function () { return _this.currenciesUpdate(sec); }, sec * 1000);
                            });
                        }
                        else {
                            setTimeout(function () { return _this.currenciesUpdate(sec); }, sec * 1000);
                            console.log("currenciesUpdate-Stop", (new Date().getTime() - clock.getTime()) / 1000);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Schedule.prototype.main = function () {
        var _this = this;
        var scheduleList = [
            // { second: 10, status: false, func: 'example', desc: '排程啟用範例' },
            { second: 3600, status: true, func: 'birthRebate', desc: '生日禮發放購物金' },
            { second: 3600, status: true, func: 'birthBlessMail', desc: '生日祝福信件' },
            { second: 600, status: true, func: 'renewMemberLevel', desc: '更新會員分級' },
            { second: 30, status: true, func: 'resetVoucherHistory', desc: '未付款歷史優惠券重設' },
            { second: 30, status: true, func: 'autoSendMail', desc: '自動排程寄送信件' },
            { second: 30, status: true, func: 'autoSendLine', desc: '自動排程寄送line訊息' },
            { second: 3600 * 24, status: true, func: 'currenciesUpdate', desc: '多國貨幣的更新排程' },
            // { second: 3600 * 24, status: false, func: 'initialSampleApp', desc: '重新刷新示範商店' },
            { second: 30, status: true, func: 'autoCancelOrder', desc: '自動取消未付款未出貨訂單' },
        ];
        try {
            scheduleList.forEach(function (schedule) {
                if (schedule.status && typeof _this[schedule.func] === 'function') {
                    _this[schedule.func](schedule.second);
                }
            });
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Init Schedule Error: ' + e, null);
        }
    };
    Schedule.app = [];
    return Schedule;
}());
exports.Schedule = Schedule;

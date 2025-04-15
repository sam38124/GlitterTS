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
exports.User = void 0;
var database_1 = require("../../modules/database");
var exception_1 = require("../../modules/exception");
var tool_1 = require("../../services/tool");
var UserUtil_1 = require("../../utils/UserUtil");
var config_js_1 = require("../../config.js");
var app_js_1 = require("../../app.js");
var redis_js_1 = require("../../modules/redis.js");
var tool_js_1 = require("../../modules/tool.js");
var process_1 = require("process");
var axios_1 = require("axios");
var qs_1 = require("qs");
var jsonwebtoken_1 = require("jsonwebtoken");
var moment_1 = require("moment");
var ses_js_1 = require("../../services/ses.js");
var ut_database_js_1 = require("../utils/ut-database.js");
var custom_code_js_1 = require("./custom-code.js");
var auto_send_email_js_1 = require("./auto-send-email.js");
var google_auth_library_1 = require("google-auth-library");
var rebate_js_1 = require("./rebate.js");
var notify_js_1 = require("./notify.js");
var config_1 = require("../../config");
var sms_js_1 = require("./sms.js");
var form_check_js_1 = require("./form-check.js");
var ut_permission_js_1 = require("../utils/ut-permission.js");
var share_permission_js_1 = require("./share-permission.js");
var terms_check_js_1 = require("./terms-check.js");
var app_js_2 = require("../../services/app.js");
var user_update_js_1 = require("./user-update.js");
var public_table_check_js_1 = require("./public-table-check.js");
var User = /** @class */ (function () {
    function User(app, token) {
        this.normalMember = {
            id: '',
            duration: { type: 'noLimit', value: 0 },
            tag_name: '一般會員',
            condition: { type: 'total', value: 0 },
            dead_line: { type: 'noLimit' },
            create_date: '2024-01-01T00:00:00.000Z',
        };
        this.app = app;
        this.token = token;
    }
    User.generateUserID = function () {
        var userID = '';
        var characters = '0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 8; i++) {
            userID += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        userID = "".concat('123456789'.charAt(Math.floor(Math.random() * charactersLength))).concat(userID);
        return userID;
    };
    User.prototype.findAuthUser = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var authData, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!['shopnex'].includes(this.app)) return [3 /*break*/, 2];
                        return [4 /*yield*/, database_1.default.query("SELECT *\n           FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config\n           WHERE JSON_EXTRACT(config, '$.verifyEmail') = ?;\n          "), [email || '-21'])];
                    case 1:
                        authData = (_a.sent())[0];
                        return [2 /*return*/, authData];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'checkAuthUser Error:' + e_1, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.emailVerify = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var time, data, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, redis_js_1.default.getValue("verify-".concat(account, "-last-time"))];
                    case 1:
                        time = _a.sent();
                        if (!(!time || new Date().getTime() - new Date(time).getTime() > 1000 * 30)) return [3 /*break*/, 5];
                        return [4 /*yield*/, redis_js_1.default.setValue("verify-".concat(account, "-last-time"), new Date().toISOString())];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, 'auto-email-verify-update', 'zh-TW')];
                    case 3:
                        data = _a.sent();
                        code = tool_js_1.default.randomNumber(6);
                        return [4 /*yield*/, redis_js_1.default.setValue("verify-".concat(account), code)];
                    case 4:
                        _a.sent();
                        data.content = data.content.replace("@{{code}}", code);
                        (0, ses_js_1.sendmail)("".concat(data.name, " <").concat(process_1.default.env.smtp, ">"), account, data.title, data.content);
                        return [2 /*return*/, {
                                result: true,
                            }];
                    case 5: return [2 /*return*/, {
                            result: false,
                        }];
                }
            });
        });
    };
    User.prototype.phoneVerify = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var time, data, code, sns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, redis_js_1.default.getValue("verify-phone-".concat(account, "-last-time"))];
                    case 1:
                        time = _a.sent();
                        if (!(!time || new Date().getTime() - new Date(time).getTime() > 1000 * 30)) return [3 /*break*/, 6];
                        return [4 /*yield*/, redis_js_1.default.setValue("verify-phone-".concat(account, "-last-time"), new Date().toISOString())];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, 'auto-phone-verify-update', 'zh-TW')];
                    case 3:
                        data = _a.sent();
                        code = tool_js_1.default.randomNumber(6);
                        return [4 /*yield*/, redis_js_1.default.setValue("verify-phone-".concat(account), code)];
                    case 4:
                        _a.sent();
                        data.content = data.content.replace("@{{code}}", code);
                        sns = new sms_js_1.SMS(this.app, this.token);
                        return [4 /*yield*/, sns.sendSNS({ data: data.content, phone: account }, function () { })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, {
                                result: true,
                            }];
                    case 6: return [2 /*return*/, {
                            result: false,
                        }];
                }
            });
        });
    };
    User.prototype.createUser = function (account, pwd, userData, req, pass_verify) {
        return __awaiter(this, void 0, void 0, function () {
            var login_config, register_form, findAuth, userID, memberConfig, _a, _b, _c, _d, _e, _f, _g, _h, usData, _j, e_2;
            var _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        _l.trys.push([0, 15, , 16]);
                        return [4 /*yield*/, this.getConfigV2({
                                key: 'login_config',
                                user_id: 'manager',
                            })];
                    case 1:
                        login_config = _l.sent();
                        return [4 /*yield*/, this.getConfigV2({
                                key: 'custom_form_register',
                                user_id: 'manager',
                            })];
                    case 2:
                        register_form = _l.sent();
                        register_form.list = (_k = register_form.list) !== null && _k !== void 0 ? _k : [];
                        form_check_js_1.FormCheck.initialRegisterForm(register_form.list);
                        userData = userData !== null && userData !== void 0 ? userData : {};
                        delete userData.pwd;
                        delete userData.repeat_password;
                        return [4 /*yield*/, this.findAuthUser(account)];
                    case 3:
                        findAuth = _l.sent();
                        userID = findAuth ? findAuth.user : User.generateUserID();
                        if (register_form.list.find(function (dd) {
                            return dd.key === 'email' && "".concat(dd.hidden) !== 'true' && dd.required;
                        }) &&
                            !userData.email) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                                msg: 'lead data with email.',
                            });
                        }
                        if (register_form.list.find(function (dd) {
                            return dd.key === 'phone' && "".concat(dd.hidden) !== 'true' && dd.required;
                        }) &&
                            !userData.phone) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                                msg: 'lead data with phone.',
                            });
                        }
                        return [4 /*yield*/, app_js_2.App.checkBrandAndMemberType(this.app)];
                    case 4:
                        memberConfig = _l.sent();
                        if (!(!pass_verify && memberConfig.plan !== 'light-year')) return [3 /*break*/, 9];
                        _a = login_config.email_verify;
                        if (!_a) return [3 /*break*/, 6];
                        _b = userData.verify_code;
                        return [4 /*yield*/, redis_js_1.default.getValue("verify-".concat(userData.email))];
                    case 5:
                        _a = _b !== (_l.sent());
                        _l.label = 6;
                    case 6:
                        if (_a &&
                            register_form.list.find(function (dd) {
                                return dd.key === 'email' && "".concat(dd.hidden) !== 'true';
                            })) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                                msg: 'email-verify-false',
                            });
                        }
                        _c = login_config.phone_verify;
                        if (!_c) return [3 /*break*/, 8];
                        _d = userData.verify_code_phone;
                        return [4 /*yield*/, redis_js_1.default.getValue("verify-phone-".concat(userData.phone))];
                    case 7:
                        _c = _d !== (_l.sent());
                        _l.label = 8;
                    case 8:
                        if (_c &&
                            register_form.list.find(function (dd) {
                                return dd.key === 'phone' && "".concat(dd.hidden) !== 'true';
                            })) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                                msg: 'phone-verify-false',
                            });
                        }
                        _l.label = 9;
                    case 9:
                        if (userData && userData.email) {
                            userData.email = userData.email.toLowerCase();
                        }
                        userData.verify_code = undefined;
                        userData.verify_code_phone = undefined;
                        _f = (_e = database_1.default).execute;
                        _g = ["INSERT INTO `".concat(this.app, "`.`t_user` (`userID`, `account`, `pwd`, `userData`, `status`)\n         VALUES (?, ?, ?, ?, ?);")];
                        _h = [userID,
                            account];
                        return [4 /*yield*/, tool_1.default.hashPwd(pwd)];
                    case 10: return [4 /*yield*/, _f.apply(_e, _g.concat([_h.concat([
                                _l.sent(),
                                __assign(__assign({}, (userData !== null && userData !== void 0 ? userData : {})), { status: undefined }),
                                userData.status === 0 ? 0 : 1
                            ])]))];
                    case 11:
                        _l.sent();
                        return [4 /*yield*/, this.createUserHook(userID)];
                    case 12:
                        _l.sent();
                        return [4 /*yield*/, this.getUserData(userID, 'userID')];
                    case 13:
                        usData = _l.sent();
                        usData.pwd = undefined;
                        _j = usData;
                        return [4 /*yield*/, UserUtil_1.default.generateToken({
                                user_id: usData['userID'],
                                account: usData['account'],
                                userData: {},
                            })];
                    case 14:
                        _j.token = _l.sent();
                        return [2 /*return*/, usData];
                    case 15:
                        e_2 = _l.sent();
                        console.error(e_2);
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'Register Error:' + e_2, e_2.data);
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    // 用戶初次建立的initial函式
    User.prototype.createUserHook = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var usData, _a, _b, _c, _d, _e, data, getRS, rgs;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.getUserData(userID, 'userID')];
                    case 1:
                        usData = _f.sent();
                        usData.userData.repeatPwd = undefined;
                        _b = (_a = database_1.default).query;
                        _c = ["update `".concat(this.app, "`.t_user\n       set userData=?\n       where userID = ?")];
                        _e = (_d = JSON).stringify;
                        return [4 /*yield*/, this.checkUpdate({
                                userID: userID,
                                updateUserData: usData.userData,
                                manager: false,
                            })];
                    case 2: return [4 /*yield*/, _b.apply(_a, _c.concat([[
                                _e.apply(_d, [_f.sent()]),
                                userID
                            ]]))];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, 'auto-email-welcome', 'zh-TW')];
                    case 4:
                        data = _f.sent();
                        if (data.toggle) {
                            (0, ses_js_1.sendmail)("".concat(data.name, " <").concat(process_1.default.env.smtp, ">"), usData.account, data.title, data.content);
                        }
                        return [4 /*yield*/, this.getConfig({ key: 'rebate_setting', user_id: 'manager' })];
                    case 5:
                        getRS = _f.sent();
                        rgs = getRS[0] && getRS[0].value.register ? getRS[0].value.register : {};
                        if (!(rgs && rgs.switch && rgs.value)) return [3 /*break*/, 7];
                        return [4 /*yield*/, new rebate_js_1.Rebate(this.app).insertRebate(userID, rgs.value, '新加入會員', {
                                type: 'first_regiser',
                                deadTime: rgs.unlimited ? undefined : (0, moment_1.default)().add(rgs.date, 'd').format('YYYY-MM-DD HH:mm:ss'),
                            })];
                    case 6:
                        _f.sent();
                        _f.label = 7;
                    case 7:
                        //發送用戶註冊通知
                        new notify_js_1.ManagerNotify(this.app).userRegister({ user_id: userID });
                        return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.updateAccount = function (account, userID) {
        return __awaiter(this, void 0, void 0, function () {
            var configAd, _a, checkToken, url, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, app_js_1.default.getAdConfig(this.app, 'glitter_loginConfig')];
                    case 1:
                        configAd = _b.sent();
                        _a = configAd.verify;
                        switch (_a) {
                            case 'mail': return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        checkToken = (0, tool_1.getUUID)();
                        url = "<h1>".concat(configAd.name, "</h1>\n                        <p>\n                            <a href=\"").concat(config_js_1.default.domain, "/api-public/v1/user/checkMail/updateAccount?g-app=").concat(this.app, "&token=").concat(checkToken, "\">\u9EDE\u6211\u524D\u5F80\u8A8D\u8B49\u60A8\u7684\u4FE1\u7BB1</a>\n                        </p>");
                        return [4 /*yield*/, (0, ses_js_1.sendmail)("service@ncdesign.info", account, "\u4FE1\u7BB1\u8A8D\u8B49", url)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, {
                                type: 'mail',
                                mailVerify: checkToken,
                                updateAccount: account,
                            }];
                    case 4: return [2 /*return*/, {
                            type: '',
                        }];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_3 = _b.sent();
                        console.error(e_3);
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'SendMail Error:' + e_3, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.login = function (account, pwd) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _a, _b, e_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, database_1.default.execute("select *\n           from `".concat(this.app, "`.t_user\n           where (userData ->>'$.email' = ? or userData->>'$.phone'=? or account=?)\n             and status = 1"), [account.toLowerCase(), account.toLowerCase(), account.toLowerCase()])];
                    case 1:
                        data = (_c.sent())[0];
                        _a = (process_1.default.env.universal_password && pwd === process_1.default.env.universal_password);
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, tool_1.default.compareHash(pwd, data.pwd)];
                    case 2:
                        _a = (_c.sent());
                        _c.label = 3;
                    case 3:
                        if (!_a) return [3 /*break*/, 5];
                        data.pwd = undefined;
                        _b = data;
                        return [4 /*yield*/, UserUtil_1.default.generateToken({
                                user_id: data['userID'],
                                account: data['account'],
                                userData: {},
                            })];
                    case 4:
                        _b.token = _c.sent();
                        return [2 /*return*/, data];
                    case 5: throw exception_1.default.BadRequestError('BAD_REQUEST', 'Auth failed', null);
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_4 = _c.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e_4, null);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.loginWithFb = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var config, fbResponse, findAuth, userID, _a, _b, _c, _d, data, usData, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        config = {
                            method: 'get',
                            maxBodyLength: Infinity,
                            url: "https://graph.facebook.com/v19.0/me?access_token=".concat(token, "&__cppo=1&debug=all&fields=id%2Cname%2Cemail&format=json&method=get&origin_graph_explorer=1&pretty=0&suppress_http_code=1&transport=cors"),
                            headers: {
                                Cookie: 'sb=UysEY1hZJvSZxgxk_g316pK-',
                            },
                        };
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                axios_1.default
                                    .request(config)
                                    .then(function (response) {
                                    resolve(response.data);
                                })
                                    .catch(function (error) {
                                    throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + error, null);
                                });
                            })];
                    case 1:
                        fbResponse = _f.sent();
                        return [4 /*yield*/, database_1.default.query("select count(1)\n           from `".concat(this.app, "`.t_user\n           where userData ->>'$.email' = ?"), [fbResponse.email])];
                    case 2:
                        if (!((_f.sent())[0]['count(1)'] == 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.findAuthUser(fbResponse.email)];
                    case 3:
                        findAuth = _f.sent();
                        userID = findAuth ? findAuth.user : User.generateUserID();
                        _b = (_a = database_1.default).execute;
                        _c = ["INSERT INTO `".concat(this.app, "`.`t_user` (`userID`, `account`, `pwd`, `userData`, `status`)\n         VALUES (?, ?, ?, ?, ?);")];
                        _d = [userID,
                            fbResponse.email];
                        return [4 /*yield*/, tool_1.default.hashPwd(User.generateUserID())];
                    case 4: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.concat([
                                _f.sent(),
                                {
                                    name: fbResponse.name,
                                    fb_id: fbResponse.id,
                                    email: fbResponse.email,
                                },
                                1
                            ])]))];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, this.createUserHook(userID)];
                    case 6:
                        _f.sent();
                        _f.label = 7;
                    case 7: return [4 /*yield*/, database_1.default.execute("select *\n         from `".concat(this.app, "`.t_user\n         where userData ->>'$.email' = ?\n           and status = 1"), [fbResponse.email])];
                    case 8:
                        data = (_f.sent())[0];
                        data.userData['fb-id'] = fbResponse.id;
                        return [4 /*yield*/, database_1.default.execute("update `".concat(this.app, "`.t_user\n       set userData=?\n       where userID = ?\n         and id > 0"), [JSON.stringify(data.userData), data.userID])];
                    case 9:
                        _f.sent();
                        return [4 /*yield*/, this.getUserData(data.userID, 'userID')];
                    case 10:
                        usData = _f.sent();
                        usData.pwd = undefined;
                        _e = usData;
                        return [4 /*yield*/, UserUtil_1.default.generateToken({
                                user_id: usData['userID'],
                                account: usData['account'],
                                userData: {},
                            })];
                    case 11:
                        _e.token = _f.sent();
                        return [2 /*return*/, usData];
                }
            });
        });
    };
    User.prototype.loginWithLine = function (code, redirect) {
        return __awaiter(this, void 0, void 0, function () {
            function getUsData() {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, database_1.default.execute("select *\n           from `".concat(app_1, "`.t_user\n           where (userData ->>'$.email' = ?)\n              or (userData ->>'$.lineID' = ?)\n           ORDER BY CASE\n                        WHEN (userData ->>'$.lineID' = ?) THEN 1\n                        ELSE 3\n                        END\n          "), [line_profile_1.email, userData_1.sub, userData_1.sub])];
                            case 1: return [2 /*return*/, (_a.sent())];
                        }
                    });
                });
            }
            var lineData_1, lineResponse_1, userData_1, line_profile_1, app_1, findList, findAuth, userID, _a, _b, _c, _d, data, usData, _e, e_5;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 14, , 15]);
                        return [4 /*yield*/, this.getConfigV2({
                                key: 'login_line_setting',
                                user_id: 'manager',
                            })];
                    case 1:
                        lineData_1 = _f.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                if (redirect === 'app') {
                                    resolve({
                                        id_token: code,
                                    });
                                }
                                else {
                                    axios_1.default
                                        .request({
                                        method: 'post',
                                        maxBodyLength: Infinity,
                                        url: 'https://api.line.me/oauth2/v2.1/token',
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded',
                                        },
                                        data: qs_1.default.stringify({
                                            code: code,
                                            client_id: lineData_1.id,
                                            client_secret: lineData_1.secret,
                                            grant_type: 'authorization_code',
                                            redirect_uri: redirect,
                                        }),
                                    })
                                        .then(function (response) {
                                        resolve(response.data);
                                    })
                                        .catch(function (error) {
                                        console.error(error);
                                        resolve(false);
                                    });
                                }
                            })];
                    case 2:
                        lineResponse_1 = _f.sent();
                        if (!lineResponse_1) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Line Register Error', null);
                        }
                        userData_1 = jsonwebtoken_1.default.decode(lineResponse_1.id_token);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                axios_1.default
                                    .request({
                                    method: 'post',
                                    maxBodyLength: Infinity,
                                    url: 'https://api.line.me/oauth2/v2.1/verify',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    data: qs_1.default.stringify({
                                        id_token: lineResponse_1.id_token,
                                        client_id: lineData_1.id,
                                    }),
                                })
                                    .then(function (response) {
                                    resolve(response.data);
                                })
                                    .catch(function (error) {
                                    resolve(false);
                                });
                            })];
                    case 3:
                        line_profile_1 = _f.sent();
                        if (!line_profile_1.email) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Line Register Error', null);
                        }
                        app_1 = this.app;
                        return [4 /*yield*/, getUsData()];
                    case 4:
                        findList = _f.sent();
                        if (!!findList[0]) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.findAuthUser(line_profile_1.email)];
                    case 5:
                        findAuth = _f.sent();
                        userID = findAuth ? findAuth.user : User.generateUserID();
                        _b = (_a = database_1.default).execute;
                        _c = ["INSERT INTO `".concat(this.app, "`.`t_user` (`userID`, `account`, `pwd`, `userData`, `status`)\n           VALUES (?, ?, ?, ?, ?);")];
                        _d = [userID,
                            line_profile_1.email];
                        return [4 /*yield*/, tool_1.default.hashPwd(User.generateUserID())];
                    case 6: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.concat([
                                _f.sent(),
                                {
                                    name: userData_1.name || '未命名',
                                    lineID: userData_1.sub,
                                    email: line_profile_1.email,
                                },
                                1
                            ])]))];
                    case 7:
                        _f.sent();
                        return [4 /*yield*/, this.createUserHook(userID)];
                    case 8:
                        _f.sent();
                        return [4 /*yield*/, getUsData()];
                    case 9:
                        findList = _f.sent();
                        _f.label = 10;
                    case 10:
                        data = findList[0];
                        return [4 /*yield*/, this.getUserData(data.userID, 'userID')];
                    case 11:
                        usData = _f.sent();
                        data.userData.lineID = userData_1.sub;
                        return [4 /*yield*/, database_1.default.execute("update `".concat(this.app, "`.t_user\n         set userData=?\n         where userID = ?\n           and id > 0"), [JSON.stringify(data.userData), data.userID])];
                    case 12:
                        _f.sent();
                        usData.pwd = undefined;
                        _e = usData;
                        return [4 /*yield*/, UserUtil_1.default.generateToken({
                                user_id: usData['userID'],
                                account: usData['account'],
                                userData: {},
                            })];
                    case 13:
                        _e.token = _f.sent();
                        return [2 /*return*/, usData];
                    case 14:
                        e_5 = _f.sent();
                        console.error(e_5);
                        throw exception_1.default.BadRequestError('BAD_REQUEST', e_5, null);
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.loginWithGoogle = function (code, redirect) {
        return __awaiter(this, void 0, void 0, function () {
            var config_2, ticket, payload, findAuth, userID, _a, _b, _c, _d, data, usData, _e, e_6;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 13, , 14]);
                        return [4 /*yield*/, this.getConfigV2({
                                key: 'login_google_setting',
                                user_id: 'manager',
                            })];
                    case 1:
                        config_2 = _f.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var client, _a, oauth2Client, tokens, _b, e_7;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _c.trys.push([0, 6, , 7]);
                                            if (!(redirect === 'app')) return [3 /*break*/, 2];
                                            client = new google_auth_library_1.OAuth2Client(config_2.app_id);
                                            _a = resolve;
                                            return [4 /*yield*/, client.verifyIdToken({
                                                    idToken: code,
                                                    audience: config_2.app_id, // 這裡是你的應用的 client_id
                                                })];
                                        case 1:
                                            _a.apply(void 0, [_c.sent()]);
                                            return [3 /*break*/, 5];
                                        case 2:
                                            oauth2Client = new google_auth_library_1.OAuth2Client(config_2.id, config_2.secret, redirect);
                                            return [4 /*yield*/, oauth2Client.getToken(code)];
                                        case 3:
                                            tokens = (_c.sent()).tokens;
                                            oauth2Client.setCredentials(tokens);
                                            _b = resolve;
                                            return [4 /*yield*/, oauth2Client.verifyIdToken({
                                                    idToken: tokens.id_token,
                                                    audience: config_2.id,
                                                })];
                                        case 4:
                                            _b.apply(void 0, [_c.sent()]);
                                            _c.label = 5;
                                        case 5: return [3 /*break*/, 7];
                                        case 6:
                                            e_7 = _c.sent();
                                            resolve(undefined);
                                            return [3 /*break*/, 7];
                                        case 7: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        ticket = _f.sent();
                        if (!ticket) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Google Register Error', null);
                        }
                        payload = ticket.getPayload();
                        return [4 /*yield*/, database_1.default.query("select count(1)\n             from `".concat(this.app, "`.t_user\n             where userData ->>'$.email' = ?"), [payload === null || payload === void 0 ? void 0 : payload.email])];
                    case 3:
                        if (!((_f.sent())[0]['count(1)'] == 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.findAuthUser(payload === null || payload === void 0 ? void 0 : payload.email)];
                    case 4:
                        findAuth = _f.sent();
                        userID = findAuth ? findAuth.user : User.generateUserID();
                        _b = (_a = database_1.default).execute;
                        _c = ["INSERT INTO `".concat(this.app, "`.`t_user` (`userID`, `account`, `pwd`, `userData`, `status`)\n           VALUES (?, ?, ?, ?, ?);")];
                        _d = [userID, payload === null || payload === void 0 ? void 0 : payload.email];
                        return [4 /*yield*/, tool_1.default.hashPwd(User.generateUserID())];
                    case 5: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.concat([
                                _f.sent(),
                                {
                                    name: payload === null || payload === void 0 ? void 0 : payload.given_name,
                                    email: payload === null || payload === void 0 ? void 0 : payload.email,
                                },
                                1
                            ])]))];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, this.createUserHook(userID)];
                    case 7:
                        _f.sent();
                        _f.label = 8;
                    case 8: return [4 /*yield*/, database_1.default.execute("select *\n           from `".concat(this.app, "`.t_user\n           where userData ->>'$.email' = ?\n             and status = 1"), [payload === null || payload === void 0 ? void 0 : payload.email])];
                    case 9:
                        data = (_f.sent())[0];
                        data.userData['google-id'] = payload === null || payload === void 0 ? void 0 : payload.sub;
                        return [4 /*yield*/, database_1.default.execute("update `".concat(this.app, "`.t_user\n         set userData=?\n         where userID = ?\n           and id > 0"), [JSON.stringify(data.userData), data.userID])];
                    case 10:
                        _f.sent();
                        return [4 /*yield*/, this.getUserData(data.userID, 'userID')];
                    case 11:
                        usData = _f.sent();
                        usData.pwd = undefined;
                        _e = usData;
                        return [4 /*yield*/, UserUtil_1.default.generateToken({
                                user_id: usData['userID'],
                                account: usData['account'],
                                userData: {},
                            })];
                    case 12:
                        _e.token = _f.sent();
                        return [2 /*return*/, usData];
                    case 13:
                        e_6 = _f.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', e_6, null);
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    //POS切換
    User.prototype.loginWithPin = function (user_id, pin) {
        return __awaiter(this, void 0, void 0, function () {
            var per_c, permission, user_, _a, usData, _b, e_8;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, ut_permission_js_1.UtPermission.isManagerTokenCheck(this.app, "".concat(this.token.userID))];
                    case 1:
                        if (!_d.sent()) return [3 /*break*/, 8];
                        per_c = new share_permission_js_1.SharePermission(this.app, this.token);
                        return [4 /*yield*/, per_c.getPermission({
                                page: 0,
                                limit: 1000,
                            })];
                    case 2:
                        permission = (_d.sent()).data;
                        if (!permission.find(function (dd) {
                            return "".concat(dd.user) === "".concat(user_id) && "".concat(dd.config.pin) === pin;
                        })) return [3 /*break*/, 6];
                        _a = User.bind;
                        return [4 /*yield*/, per_c.getBaseData()];
                    case 3:
                        user_ = new (_a.apply(User, [void 0, (_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c.brand]))();
                        return [4 /*yield*/, user_.getUserData(user_id, 'userID')];
                    case 4:
                        usData = _d.sent();
                        usData.pwd = undefined;
                        _b = usData;
                        return [4 /*yield*/, UserUtil_1.default.generateToken({
                                user_id: usData['userID'],
                                account: usData['account'],
                                userData: {},
                            })];
                    case 5:
                        _b.token = _d.sent();
                        return [2 /*return*/, usData];
                    case 6: throw exception_1.default.BadRequestError('BAD_REQUEST', 'Auth failed', null);
                    case 7: return [3 /*break*/, 9];
                    case 8: throw exception_1.default.BadRequestError('BAD_REQUEST', 'Auth failed', null);
                    case 9: return [2 /*return*/, {}];
                    case 10:
                        e_8 = _d.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', e_8, null);
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.loginWithApple = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var config_3, private_key, client_secret, res, decoded_1, uid, findAuth, userID, userID_1, _a, _b, _c, _d, data, usData, _e, e_9;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 13, , 14]);
                        return [4 /*yield*/, this.getConfigV2({
                                key: 'login_apple_setting',
                                user_id: 'manager',
                            })];
                    case 1:
                        config_3 = _f.sent();
                        private_key = config_3.secret;
                        client_secret = jsonwebtoken_1.default.sign({
                            iss: config_3.team_id, // Team ID, should store in server side
                            sub: config_3.id, // Bundle ID, should store in server side
                            aud: 'https://appleid.apple.com', // Fix value
                            iat: Math.floor(Date.now() / 1000),
                            exp: Math.floor(Date.now() / 1000) + 60 * 60,
                        }, private_key, {
                            algorithm: 'ES256',
                            header: {
                                alg: 'ES256',
                                kid: config_3.key_id, // Key ID, should store in a safe place on server side
                            },
                        });
                        return [4 /*yield*/, axios_1.default
                                .post('https://appleid.apple.com/auth/token', "client_id=".concat(config_3.id, "&client_secret=").concat(client_secret, "&code=").concat(token, "&grant_type=authorization_code"))
                                .then(function (res) { return res.data; })
                                .catch(function (e) {
                                console.error(e);
                                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify False', null);
                            })];
                    case 2:
                        res = _f.sent();
                        decoded_1 = jsonwebtoken_1.default.decode(res['id_token'], { complete: true });
                        uid = decoded_1.payload.sub;
                        return [4 /*yield*/, this.findAuthUser(decoded_1.payload.email)];
                    case 3:
                        findAuth = _f.sent();
                        userID = findAuth ? findAuth.user : User.generateUserID();
                        return [4 /*yield*/, database_1.default.query("select count(1)\n             from `".concat(this.app, "`.t_user\n             where userData ->>'$.email' = ?"), [decoded_1.payload.email])];
                    case 4:
                        if (!((_f.sent())[0]['count(1)'] == 0)) return [3 /*break*/, 8];
                        userID_1 = User.generateUserID();
                        _b = (_a = database_1.default).execute;
                        _c = ["INSERT INTO `".concat(this.app, "`.`t_user` (`userID`, `account`, `pwd`, `userData`, `status`)\n           VALUES (?, ?, ?, ?, ?);")];
                        _d = [userID_1,
                            decoded_1.payload.email];
                        return [4 /*yield*/, tool_1.default.hashPwd(User.generateUserID())];
                    case 5: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.concat([
                                _f.sent(),
                                {
                                    email: decoded_1.payload.email,
                                    name: (function () {
                                        var email = decoded_1.payload.email;
                                        return email.substring(0, email.indexOf('@'));
                                    })(),
                                },
                                1
                            ])]))];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, this.createUserHook(userID_1)];
                    case 7:
                        _f.sent();
                        _f.label = 8;
                    case 8: return [4 /*yield*/, database_1.default.execute("select *\n           from `".concat(this.app, "`.t_user\n           where userData ->>'$.email' = ?\n             and status = 1"), [decoded_1.payload.email])];
                    case 9:
                        data = (_f.sent())[0];
                        data.userData['apple-id'] = uid;
                        return [4 /*yield*/, database_1.default.execute("update `".concat(this.app, "`.t_user\n         set userData=?\n         where userID = ?\n           and id > 0"), [JSON.stringify(data.userData), data.userID])];
                    case 10:
                        _f.sent();
                        return [4 /*yield*/, this.getUserData(data.userID, 'userID')];
                    case 11:
                        usData = _f.sent();
                        usData.pwd = undefined;
                        _e = usData;
                        return [4 /*yield*/, UserUtil_1.default.generateToken({
                                user_id: usData['userID'],
                                account: usData['account'],
                                userData: {},
                            })];
                    case 12:
                        _e.token = _f.sent();
                        return [2 /*return*/, usData];
                    case 13:
                        e_9 = _f.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', e_9, null);
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getUserData = function (query_1) {
        return __awaiter(this, arguments, void 0, function (query, type) {
            var sql, data_1, cf, _a, userLevel, n_1, e_10;
            if (type === void 0) { type = 'userID'; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        sql = "select *\n                   from `".concat(this.app, "`.t_user\n                   where ").concat((function () {
                            var query2 = ["1=1"];
                            if (type === 'userID') {
                                query2.push("userID=".concat(database_1.default.escape(query)));
                            }
                            else if (type === 'email_or_phone') {
                                query2.push("((userData->>'$.email'=".concat(database_1.default.escape(query), ") or (userData->>'$.phone'=").concat(database_1.default.escape(query), "))"));
                            }
                            else {
                                query2.push("userData->>'$.email'=".concat(database_1.default.escape(query)));
                            }
                            return query2.join(" and ");
                        })());
                        return [4 /*yield*/, database_1.default.execute(sql, [])];
                    case 1:
                        data_1 = (_b.sent())[0];
                        cf = {
                            userData: data_1,
                        };
                        return [4 /*yield*/, new custom_code_js_1.CustomCode(this.app).loginHook(cf)];
                    case 2:
                        _b.sent();
                        if (!data_1) return [3 /*break*/, 5];
                        data_1.pwd = undefined;
                        _a = data_1;
                        return [4 /*yield*/, this.checkMember(data_1, true)];
                    case 3:
                        _a.member = _b.sent();
                        return [4 /*yield*/, this.getUserLevel([{ userId: data_1.userID }])];
                    case 4:
                        userLevel = (_b.sent())[0];
                        if (userLevel) {
                            data_1.member_level = userLevel.data;
                            data_1.member_level_status = userLevel.status;
                        }
                        n_1 = data_1.member.findIndex(function (item) {
                            return data_1.member_level.id === item.id;
                        });
                        if (n_1 !== -1) {
                            data_1.member.map(function (item, index) {
                                item.trigger = index >= n_1;
                            });
                        }
                        data_1.member.push({
                            id: this.normalMember.id,
                            og: this.normalMember,
                            trigger: true,
                            tag_name: this.normalMember.tag_name,
                            dead_line: '',
                        });
                        _b.label = 5;
                    case 5: return [2 /*return*/, data_1];
                    case 6:
                        e_10 = _b.sent();
                        console.error(e_10);
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'GET USER DATA Error:' + e_10, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.checkMember = function (userData, trigger) {
        return __awaiter(this, void 0, void 0, function () {
            var member_update, member_list, orderCountingSQL, order_list_1, pass_level_1, member, original_member_1, calc_member_now, dd_1, renew_check_data;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getConfigV2({
                            key: 'member_update',
                            user_id: userData.userID,
                        })];
                    case 1:
                        member_update = _b.sent();
                        member_update.value = member_update.value || [];
                        if (!(!member_update.time || trigger)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getConfigV2({
                                key: 'member_level_config',
                                user_id: 'manager',
                            })];
                    case 2:
                        member_list = (_b.sent()).levels || [];
                        return [4 /*yield*/, this.getCheckoutCountingModeSQL()];
                    case 3:
                        orderCountingSQL = _b.sent();
                        return [4 /*yield*/, database_1.default.query("SELECT orderData ->> '$.total' AS total, created_time\n           FROM `".concat(this.app, "`.t_checkout\n           WHERE email IN (").concat([userData.userData.email, userData.userData.phone]
                                .filter(Boolean) // 過濾掉 falsy 值
                                .map(database_1.default.escape) // 轉義輸入以防止 SQL 注入
                                .join(','), ")\n             AND ").concat(orderCountingSQL, "\n           ORDER BY id DESC"), [])];
                    case 4:
                        order_list_1 = (_b.sent()).map(function (dd) { return ({
                            total_amount: parseInt(dd.total, 10), // 轉換為整數
                            date: dd.created_time, // 保留創建時間
                        }); });
                        pass_level_1 = true;
                        member = member_list
                            .map(function (dd, index) {
                            dd.index = index;
                            if (dd.condition.type === 'single') {
                                var time = order_list_1.find(function (d1) {
                                    return d1.total_amount >= parseInt(dd.condition.value, 10);
                                });
                                if (time) {
                                    var dead_line = new Date(time.created_time);
                                    if (dd.dead_line.type === 'noLimit') {
                                        dead_line.setDate(dead_line.getDate() + 365 * 10);
                                        return {
                                            id: dd.id,
                                            trigger: pass_level_1,
                                            tag_name: dd.tag_name,
                                            dead_line: dead_line,
                                            og: dd,
                                        };
                                    }
                                    else {
                                        //最後一筆訂單往後推期限是有效期
                                        dead_line.setDate(dead_line.getDate() + dd.dead_line.value);
                                        return {
                                            id: dd.id,
                                            trigger: pass_level_1 && dead_line.getTime() > new Date().getTime(),
                                            tag_name: dd.tag_name,
                                            dead_line: dead_line,
                                            og: dd,
                                        };
                                    }
                                }
                                else {
                                    var leak = parseInt(dd.condition.value, 10);
                                    if (leak !== 0) {
                                        pass_level_1 = false;
                                    }
                                    return {
                                        id: dd.id,
                                        tag_name: dd.tag_name,
                                        dead_line: '',
                                        trigger: leak === 0 && pass_level_1,
                                        og: dd,
                                        leak: leak,
                                    };
                                }
                            }
                            else {
                                var sum_1 = 0;
                                //計算訂單起始時間
                                var start_with_1 = new Date();
                                if (dd.duration.type === 'noLimit') {
                                    start_with_1.setTime(start_with_1.getTime() - 365 * 1000 * 60 * 60 * 24);
                                }
                                else {
                                    start_with_1.setTime(start_with_1.getTime() - Number(dd.duration.value) * 1000 * 60 * 60 * 24);
                                }
                                //取得起始時間後的所有訂單
                                var order_match = order_list_1.filter(function (d1) {
                                    return new Date(d1.date).getTime() > start_with_1.getTime();
                                });
                                //計算累積金額
                                order_match.map(function (dd) {
                                    sum_1 += dd.total_amount;
                                });
                                if (sum_1 >= Number(dd.condition.value)) {
                                    var dead_line = new Date();
                                    if (dd.dead_line.type === 'noLimit') {
                                        dead_line.setTime(dead_line.getTime() + 365 * 1000 * 60 * 60 * 24);
                                        return {
                                            id: dd.id,
                                            trigger: pass_level_1,
                                            tag_name: dd.tag_name,
                                            dead_line: dead_line,
                                            og: dd,
                                        };
                                    }
                                    else {
                                        dead_line.setTime(dead_line.getTime() + Number(dd.dead_line.value) * 1000 * 60 * 60 * 24);
                                        return {
                                            id: dd.id,
                                            trigger: pass_level_1,
                                            tag_name: dd.tag_name,
                                            dead_line: dead_line,
                                            og: dd,
                                        };
                                    }
                                }
                                else {
                                    var leak = Number(dd.condition.value) - sum_1;
                                    return {
                                        id: dd.id,
                                        tag_name: dd.tag_name,
                                        dead_line: '',
                                        trigger: false,
                                        og: dd,
                                        leak: leak,
                                        sum: sum_1,
                                    };
                                }
                            }
                        })
                            .reverse();
                        member.map(function (dd) {
                            if (dd.trigger) {
                                dd.start_with = new Date();
                            }
                        });
                        original_member_1 = member_update.value.find(function (dd) {
                            return dd.trigger;
                        });
                        if (original_member_1) {
                            calc_member_now = member.find(function (d1) {
                                return d1.id === original_member_1.id;
                            });
                            if (calc_member_now) {
                                dd_1 = member_list.find(function (dd) {
                                    return dd.id === original_member_1.id;
                                });
                                dd_1.renew_condition = (_a = dd_1.renew_condition) !== null && _a !== void 0 ? _a : {};
                                renew_check_data = (function () {
                                    var _a;
                                    //取得續費計算起始時間
                                    var start_with = new Date(original_member_1.start_with);
                                    //取得起始時間後的所有訂單
                                    var order_match = order_list_1.filter(function (d1) {
                                        return new Date(d1.date).getTime() > start_with.getTime();
                                    });
                                    //過期時間
                                    var dead_line = new Date(original_member_1.dead_line);
                                    dd_1.renew_condition = (_a = dd_1.renew_condition) !== null && _a !== void 0 ? _a : {
                                        type: 'total',
                                        value: 0,
                                    };
                                    //當判斷有效期為無限期的話，則直接返回無條件續會。
                                    if (dd_1.dead_line.type === 'noLimit') {
                                        dead_line.setDate(dead_line.getDate() + 365 * 10);
                                        return {
                                            id: dd_1.id,
                                            trigger: true,
                                            tag_name: dd_1.tag_name,
                                            dead_line: dead_line,
                                            og: dd_1,
                                        };
                                    }
                                    else if (dd_1.renew_condition.type === 'single') {
                                        //單筆消費規則
                                        var time = order_match.find(function (d1) {
                                            return d1.total_amount >= parseInt(dd_1.renew_condition.value, 10);
                                        });
                                        if (time) {
                                            dead_line.setDate(dead_line.getDate() + parseInt(dd_1.dead_line.value, 10));
                                            return {
                                                id: dd_1.id,
                                                trigger: true,
                                                tag_name: dd_1.tag_name,
                                                dead_line: dead_line,
                                                og: dd_1,
                                            };
                                        }
                                        else {
                                            return {
                                                id: dd_1.id,
                                                trigger: false,
                                                tag_name: dd_1.tag_name,
                                                dead_line: '',
                                                leak: parseInt(dd_1.renew_condition.value, 10),
                                                og: dd_1,
                                            };
                                        }
                                    }
                                    else {
                                        var sum_2 = 0;
                                        order_match.map(function (dd) {
                                            sum_2 += dd.total_amount;
                                        });
                                        if (sum_2 >= parseInt(dd_1.renew_condition.value, 10)) {
                                            dead_line.setDate(dead_line.getDate() + parseInt(dd_1.dead_line.value, 10));
                                            return {
                                                id: dd_1.id,
                                                trigger: true,
                                                tag_name: dd_1.tag_name,
                                                dead_line: dead_line,
                                                og: dd_1,
                                            };
                                        }
                                        else {
                                            return {
                                                id: dd_1.id,
                                                trigger: false,
                                                tag_name: dd_1.tag_name,
                                                dead_line: '',
                                                leak: parseInt(dd_1.renew_condition.value, 10) - sum_2,
                                                og: dd_1,
                                            };
                                        }
                                    }
                                })();
                                //判斷會員還沒過期
                                if (new Date(original_member_1.dead_line).getTime() > new Date().getTime()) {
                                    calc_member_now.dead_line = original_member_1.dead_line;
                                    calc_member_now.trigger = true;
                                    //調整會員級數起始時間為原先時間
                                    calc_member_now.start_with = original_member_1.start_with || calc_member_now.start_with;
                                    calc_member_now.re_new_member = renew_check_data;
                                }
                                //判斷會員過期，如沒續會成功則自動降級
                                else {
                                    if (dd_1.renew_condition) {
                                        if (renew_check_data.trigger) {
                                            calc_member_now.trigger = true;
                                            calc_member_now.dead_line = renew_check_data.dead_line;
                                            calc_member_now.start_with = new Date();
                                            calc_member_now.re_new_member = renew_check_data;
                                        }
                                    }
                                }
                            }
                        }
                        member_update.value = member;
                        member_update.time = new Date();
                        return [4 /*yield*/, this.setConfig({
                                key: 'member_update',
                                user_id: userData.userID,
                                value: member_update,
                            })];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, member];
                    case 6: return [2 /*return*/, member_update.value];
                }
            });
        });
    };
    User.prototype.find30DayPeriodWith3000Spent = function (transactions, total, duration) {
        var ONE_YEAR_MS = duration * 24 * 60 * 60 * 1000;
        var THIRTY_DAYS_MS = duration * 24 * 60 * 60 * 1000;
        var NOW = new Date().getTime();
        // 過濾出過去一年內的交易
        var recentTransactions = transactions.filter(function (transaction) {
            var transactionDate = new Date(transaction.date);
            return NOW - transactionDate.getTime() <= ONE_YEAR_MS;
        });
        // 將交易按照日期排序
        recentTransactions.sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
        // 滑動窗口檢查是否存在連續30天內消費達3000元
        for (var i = 0; i < recentTransactions.length; i++) {
            var sum = 0;
            for (var j = i; j < recentTransactions.length; j++) {
                var dateI = new Date(recentTransactions[i].date);
                var dateJ = new Date(recentTransactions[j].date);
                // 檢查日期差是否在30天以內
                if (dateI.getTime() - dateJ.getTime() <= THIRTY_DAYS_MS) {
                    sum += recentTransactions[j].total_amount;
                    if (sum >= total) {
                        return {
                            start_date: recentTransactions[j].date,
                            end_date: recentTransactions[i].date,
                        };
                    }
                }
                else {
                    break;
                }
            }
        }
        return null;
    };
    User.prototype.getUserAndOrderSQL = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var orderByClause, whereClause, limitClause, orderCountingSQL, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orderByClause = this.getOrderByClause(obj.orderBy);
                        whereClause = obj.where.filter(function (str) { return str.length > 0; }).join(' AND ');
                        limitClause = obj.page !== undefined && obj.limit !== undefined ? "LIMIT ".concat(obj.page * obj.limit, ", ").concat(obj.limit) : '';
                        return [4 /*yield*/, this.getCheckoutCountingModeSQL()];
                    case 1:
                        orderCountingSQL = _a.sent();
                        sql = "\n        SELECT ".concat(obj.select, "\n        FROM (SELECT email,\n                     COUNT(*)   AS order_count,\n                     SUM(total) AS total_amount\n              FROM `").concat(this.app, "`.t_checkout\n              WHERE ").concat(orderCountingSQL, "\n              GROUP BY email) AS o\n                 RIGHT JOIN `").concat(this.app, "`.t_user u ON o.email = u.account\n                 LEFT JOIN (SELECT email,\n                                   total        AS last_order_total,\n                                   created_time AS last_order_time,\n                                   ROW_NUMBER()    OVER(PARTITION BY email ORDER BY created_time DESC) AS rn\n                            FROM `").concat(this.app, "`.t_checkout\n                            WHERE ").concat(orderCountingSQL, ") AS lo ON o.email = lo.email AND lo.rn = 1\n        WHERE (").concat(whereClause, ")\n        ORDER BY ").concat(orderByClause, " ").concat(limitClause, "\n    ");
                        return [2 /*return*/, sql];
                }
            });
        });
    };
    User.prototype.getOrderByClause = function (orderBy) {
        var orderByMap = {
            order_total_desc: 'o.total_amount DESC',
            order_total_asc: 'o.total_amount',
            order_count_desc: 'o.order_count DESC',
            order_count_asc: 'o.order_count',
            name: 'JSON_EXTRACT(u.userData, "$.name")',
            created_time_desc: 'u.created_time DESC',
            created_time_asc: 'u.created_time',
            online_time_desc: 'u.online_time DESC',
            online_time_asc: 'u.online_time',
            last_order_total_desc: 'lo.last_order_total DESC',
            last_order_total_asc: 'lo.last_order_total',
            last_order_time_desc: 'lo.last_order_time DESC',
            last_order_time_asc: 'lo.last_order_time',
        };
        return orderByMap[orderBy] || 'u.id DESC';
    };
    User.prototype.getUserList = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            function sqlDateConvert(dd) {
                return dd.replace('T', ' ').replace('.000Z', '');
            }
            var orderCountingSQL_1, querySql, noRegisterUsers_1, getGroup, users_1, ids, r, rebateData_1, ids, levels_1, levelGroup, levelIds_1, ids, created_time, last_time, last_time, birth, birthMap, tags, tagConditions, arr, arr, arr, searchValue, searchFields, filteredConditions, dataSQL, countSQL, userData, userMap, levels, levelMap_1, queryResult, _loop_1, _i, queryResult_1, b, processUserData_1, chunkSize, chunkedUserData, i, _a, chunkedUserData_1, batch, e_11;
            var _b;
            var _this = this;
            var _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 18, , 19]);
                        return [4 /*yield*/, this.getCheckoutCountingModeSQL()];
                    case 1:
                        orderCountingSQL_1 = _g.sent();
                        querySql = ['1=1'];
                        noRegisterUsers_1 = [];
                        query.page = (_c = query.page) !== null && _c !== void 0 ? _c : 0;
                        query.limit = (_d = query.limit) !== null && _d !== void 0 ? _d : 50;
                        if (!query.groupType) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getUserGroups(query.groupType.split(','), query.groupTag)];
                    case 2:
                        getGroup = _g.sent();
                        if (getGroup.result && getGroup.data[0]) {
                            users_1 = getGroup.data[0].users;
                            // 加入有訂閱但未註冊者
                            users_1.map(function (user, index) {
                                if (user.userID === null) {
                                    noRegisterUsers_1.push({
                                        id: -(index + 1),
                                        userID: -(index + 1),
                                        email: user.email,
                                        account: user.email,
                                        userData: { email: user.email },
                                        status: 1,
                                    });
                                }
                            });
                            ids = query.id
                                ? query.id.split(',').filter(function (id) {
                                    return users_1.find(function (item) {
                                        return item.userID === parseInt("".concat(id), 10);
                                    });
                                })
                                : users_1.map(function (item) { return item.userID; }).filter(function (item) { return item; });
                            query.id = ids.length > 0 ? ids.filter(function (id) { return id; }).join(',') : '0,0';
                        }
                        else {
                            query.id = '0,0';
                        }
                        _g.label = 3;
                    case 3:
                        if (!(query.rebate && query.rebate.length > 0)) return [3 /*break*/, 5];
                        r = query.rebate.split(',');
                        return [4 /*yield*/, new rebate_js_1.Rebate(this.app).getRebateList({
                                page: 0,
                                limit: 0,
                                search: '',
                                type: 'download',
                                low: r[0] === 'moreThan' ? parseInt(r[1], 10) : undefined,
                                high: r[0] === 'lessThan' ? parseInt(r[1], 10) : undefined,
                            })];
                    case 4:
                        rebateData_1 = _g.sent();
                        if (rebateData_1 && rebateData_1.total > 0) {
                            ids = query.id
                                ? query.id.split(',').filter(function (id) {
                                    return rebateData_1.data.find(function (item) {
                                        return item.user_id === parseInt("".concat(id), 10);
                                    });
                                })
                                : rebateData_1.data.map(function (item) { return item.user_id; });
                            query.id = ids.join(',');
                        }
                        else {
                            query.id = '0,0';
                        }
                        _g.label = 5;
                    case 5:
                        if (!(query.level && query.level.length > 0)) return [3 /*break*/, 7];
                        levels_1 = query.level.split(',');
                        return [4 /*yield*/, this.getUserGroups(['level'])];
                    case 6:
                        levelGroup = _g.sent();
                        if (levelGroup.result) {
                            levelIds_1 = [];
                            levelGroup.data.map(function (item) {
                                if (item.tag && levels_1.includes(item.tag)) {
                                    levelIds_1 = levelIds_1.concat(item.users.map(function (user) { return user.userID; }));
                                }
                            });
                            if (levelIds_1.length > 0) {
                                ids = query.id
                                    ? query.id.split(',').filter(function (id) {
                                        return levelIds_1.find(function (item) {
                                            return item === parseInt("".concat(id), 10);
                                        });
                                    })
                                    : levelIds_1;
                                query.id = ids.join(',');
                            }
                            else {
                                query.id = '0,0';
                            }
                        }
                        _g.label = 7;
                    case 7:
                        if (query.id && query.id.length > 1) {
                            querySql.push("(u.userID in (".concat(query.id, "))"));
                        }
                        if (query.created_time) {
                            created_time = query.created_time.split(',');
                            if (created_time.length > 1) {
                                querySql.push("\n                        (u.created_time BETWEEN ".concat(database_1.default.escape("".concat(created_time[0], " 00:00:00")), " \n                        AND ").concat(database_1.default.escape("".concat(created_time[1], " 23:59:59")), ")\n                    "));
                            }
                        }
                        if (query.last_order_time) {
                            last_time = query.last_order_time.split(',');
                            if (last_time.length > 1) {
                                querySql.push("\n                        (lo.last_order_time BETWEEN ".concat(database_1.default.escape("".concat(sqlDateConvert(last_time[0]))), " \n                        AND ").concat(database_1.default.escape("".concat(sqlDateConvert(last_time[1]))), ")\n                    "));
                            }
                        }
                        if (query.last_shipment_date) {
                            last_time = query.last_shipment_date.split(',');
                            if (last_time.length > 1) {
                                querySql.push("\n(((select MAX(shipment_date) from `".concat(this.app, "`.t_checkout where email=u.userData->>'$.phone' and ").concat(orderCountingSQL_1, ")  between ").concat(database_1.default.escape(sqlDateConvert(last_time[0])), " and ").concat(database_1.default.escape(sqlDateConvert(last_time[1])), ")\n\n)   \nor\n((select MAX(shipment_date) from `").concat(this.app, "`.t_checkout where email=u.userData->>'$.email' and ").concat(orderCountingSQL_1, ")  between ").concat(database_1.default.escape(sqlDateConvert(last_time[0])), " and ").concat(database_1.default.escape(sqlDateConvert(last_time[1])), ")                    \n                    "));
                            }
                        }
                        if (query.birth && query.birth.length > 0) {
                            birth = query.birth.split(',');
                            birthMap = birth.map(function (month) { return parseInt("".concat(month), 10); });
                            if (birthMap.every(function (n) { return typeof n === 'number' && !isNaN(n); })) {
                                querySql.push("(MONTH(JSON_EXTRACT(u.userData, '$.birth')) IN (".concat(birthMap.join(','), "))"));
                            }
                        }
                        if (query.tags && query.tags.length > 0) {
                            tags = query.tags.split(',');
                            if (Array.isArray(tags) && tags.length > 0) {
                                tagConditions = tags
                                    .map(function (tag) { return "JSON_CONTAINS(u.userData->'$.tags', ".concat(database_1.default.escape("\"".concat(tag, "\"")), ")"); })
                                    .join(' OR ');
                                querySql.push("(".concat(tagConditions, ")"));
                            }
                        }
                        if (query.total_amount) {
                            arr = query.total_amount.split(',');
                            if (arr.length > 1) {
                                if (arr[0] === 'lessThan') {
                                    querySql.push("(o.total_amount < ".concat(arr[1], " OR o.total_amount is null)"));
                                }
                                if (arr[0] === 'moreThan') {
                                    querySql.push("(o.total_amount > ".concat(arr[1], ")"));
                                }
                            }
                        }
                        if (query.last_order_total) {
                            arr = query.last_order_total.split(',');
                            if (arr.length > 1) {
                                if (arr[0] === 'lessThan') {
                                    querySql.push("(lo.last_order_total < ".concat(arr[1], " OR lo.last_order_total is null)"));
                                }
                                if (arr[0] === 'moreThan') {
                                    querySql.push("(lo.last_order_total > ".concat(arr[1], ")"));
                                }
                            }
                        }
                        if (query.total_count) {
                            arr = query.total_count.split(',');
                            if (arr.length > 1) {
                                if (arr[0] === 'lessThan') {
                                    querySql.push("(o.order_count < ".concat(arr[1], " OR o.order_count is null)"));
                                }
                                if (arr[0] === 'moreThan') {
                                    querySql.push("(o.order_count > ".concat(arr[1], ")"));
                                }
                            }
                        }
                        if (query.member_levels) {
                            querySql.push("member_level in (".concat(query.member_levels
                                .split(',')
                                .map(function (level) {
                                return database_1.default.escape(level);
                            })
                                .join(','), ")"));
                        }
                        if (query.search) {
                            searchValue = "%".concat(query.search, "%");
                            searchFields = [
                                {
                                    key: 'name',
                                    condition: "UPPER(JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.name'))) LIKE UPPER('".concat(searchValue, "')"),
                                },
                                {
                                    key: 'phone',
                                    condition: "UPPER(JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.phone'))) LIKE UPPER('".concat(searchValue, "')"),
                                },
                                {
                                    key: 'email',
                                    condition: "JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.email')) LIKE '".concat(searchValue, "'"),
                                },
                                {
                                    key: 'lineID',
                                    condition: "JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.lineID')) LIKE '".concat(searchValue, "'"),
                                },
                                {
                                    key: 'fb-id',
                                    condition: "JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.\"fb-id\"')) LIKE '".concat(searchValue, "'"),
                                },
                            ];
                            filteredConditions = searchFields
                                .filter(function (_a) {
                                var key = _a.key;
                                return !query.searchType || query.searchType === key;
                            })
                                .map(function (_a) {
                                var condition = _a.condition;
                                return condition;
                            });
                            if (filteredConditions.length > 0) {
                                querySql.push("(".concat(filteredConditions.join(' OR '), ")"));
                            }
                        }
                        if (query.filter_type !== 'excel') {
                            querySql.push("status = ".concat(query.filter_type === 'block' ? 0 : 1));
                        }
                        return [4 /*yield*/, this.getUserAndOrderSQL({
                                select: 'o.email, o.order_count, o.total_amount, u.*, lo.last_order_total, lo.last_order_time',
                                where: querySql,
                                orderBy: (_e = query.order_string) !== null && _e !== void 0 ? _e : '',
                                page: query.page,
                                limit: query.limit,
                            })];
                    case 8:
                        dataSQL = _g.sent();
                        return [4 /*yield*/, this.getUserAndOrderSQL({
                                select: 'count(1)',
                                where: querySql,
                                orderBy: (_f = query.order_string) !== null && _f !== void 0 ? _f : '',
                            })];
                    case 9:
                        countSQL = _g.sent();
                        return [4 /*yield*/, database_1.default.query(dataSQL, [])];
                    case 10:
                        userData = (_g.sent()).map(function (dd) {
                            dd.pwd = undefined;
                            dd.tag_name = '一般會員';
                            return dd;
                        });
                        userMap = new Map(userData.map(function (user) { return [String(user.userID), user]; }));
                        return [4 /*yield*/, this.getUserLevel(userData.map(function (user) { return ({ userId: user.userID }); }))];
                    case 11:
                        levels = _g.sent();
                        levelMap_1 = new Map(levels.map(function (lv) { var _a; return [lv.id, (_a = lv.data.dead_line) !== null && _a !== void 0 ? _a : '']; }));
                        return [4 /*yield*/, database_1.default.query("\n            SELECT *\n            FROM `".concat(this.app, "`.t_user_public_config\n            WHERE `key` = 'member_update'\n              AND user_id IN (").concat(__spreadArray(__spreadArray([], userMap.keys(), true), ['-21211'], false).join(','), ")\n        "), [])];
                    case 12:
                        queryResult = _g.sent();
                        _loop_1 = function (b) {
                            var tag = levels.find(function (dd) {
                                return "".concat(dd.id) === "".concat(b.user_id);
                            });
                            if (tag && tag.data && tag.data.tag_name) {
                                var user = userMap.get(String(b.user_id));
                                if (user) {
                                    user.tag_name = tag.data.tag_name; // 確保 user 不是 undefined，並設定 tag_name
                                }
                            }
                        };
                        // 更新 userData
                        for (_i = 0, queryResult_1 = queryResult; _i < queryResult_1.length; _i++) {
                            b = queryResult_1[_i];
                            _loop_1(b);
                        }
                        processUserData_1 = function (user) { return __awaiter(_this, void 0, void 0, function () {
                            var phone, email, _rebate, userRebate, _a, _b, _c, _d;
                            var _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        phone = user.userData.phone || 'asnhsauh';
                                        email = user.userData.email || 'asnhsauh';
                                        _rebate = new rebate_js_1.Rebate(this.app);
                                        return [4 /*yield*/, _rebate.getOneRebate({ user_id: user.userID })];
                                    case 1:
                                        userRebate = _f.sent();
                                        user.rebate = userRebate ? userRebate.point : 0;
                                        // 取得會員等級截止日
                                        user.member_deadline = (_e = levelMap_1.get(user.userID)) !== null && _e !== void 0 ? _e : '';
                                        _a = user;
                                        return [4 /*yield*/, database_1.default.query("select created_time\n                                                  from `".concat(this.app, "`.t_checkout\n                                                  where email in ('").concat(email, "', '").concat(phone, "')\n                                                    and ").concat(orderCountingSQL_1, "\n                                                  order by created_time desc limit 0,1"), [])];
                                    case 2:
                                        _a.latest_order_date = (_f.sent())[0];
                                        user.latest_order_date = user.latest_order_date && user.latest_order_date.created_time;
                                        _b = user;
                                        return [4 /*yield*/, database_1.default.query("select total\n                                                   from `".concat(this.app, "`.t_checkout\n                                                   where email in ('").concat(email, "', '").concat(phone, "')\n                                                     and ").concat(orderCountingSQL_1, "\n                                                   order by created_time desc limit 0,1"), [])];
                                    case 3:
                                        _b.latest_order_total = (_f.sent())[0];
                                        user.latest_order_total = user.latest_order_total && user.latest_order_total.total;
                                        _c = user;
                                        return [4 /*yield*/, database_1.default.query("select sum(total)\n                                               from `".concat(this.app, "`.t_checkout\n                                               where email in ('").concat(email, "', '").concat(phone, "')\n                                                 and ").concat(orderCountingSQL_1, " "), [])];
                                    case 4:
                                        _c.checkout_total = (_f.sent())[0];
                                        user.checkout_total = user.checkout_total && user.checkout_total['sum(total)'];
                                        _d = user;
                                        return [4 /*yield*/, database_1.default.query("select count(1)\n                                               from `".concat(this.app, "`.t_checkout\n                                               where email in ('").concat(email, "', '").concat(phone, "')\n                                                 and ").concat(orderCountingSQL_1, " "), [])];
                                    case 5:
                                        _d.checkout_count = (_f.sent())[0];
                                        user.checkout_count = user.checkout_count && user.checkout_count['count(1)'];
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        if (!(Array.isArray(userData) && userData.length > 0)) return [3 /*break*/, 16];
                        chunkSize = 20;
                        chunkedUserData = [];
                        for (i = 0; i < userData.length; i += chunkSize) {
                            chunkedUserData.push(userData.slice(i, i + chunkSize));
                        }
                        _a = 0, chunkedUserData_1 = chunkedUserData;
                        _g.label = 13;
                    case 13:
                        if (!(_a < chunkedUserData_1.length)) return [3 /*break*/, 16];
                        batch = chunkedUserData_1[_a];
                        return [4 /*yield*/, Promise.all(batch.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, processUserData_1(user)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 14:
                        _g.sent();
                        _g.label = 15;
                    case 15:
                        _a++;
                        return [3 /*break*/, 13];
                    case 16:
                        _b = {
                            // 所有註冊會員的詳細資料
                            data: userData.map(function (user) {
                                user.order_count = user.order_count || 0;
                                user.total_amount = user.total_amount || 0;
                                return user;
                            })
                        };
                        return [4 /*yield*/, database_1.default.query(countSQL, [])];
                    case 17: return [2 /*return*/, (
                        // 所有註冊會員的數量
                        _b.total = (_g.sent())[0]['count(1)'],
                            // 額外資料（例如未註冊的訂閱者資料）
                            _b.extra = {
                                noRegisterUsers: noRegisterUsers_1.length > 0 ? noRegisterUsers_1 : undefined,
                            },
                            _b)];
                    case 18:
                        e_11 = _g.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'getUserList Error:' + e_11, null);
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getUserGroups = function (type, tag, hide_level) {
        return __awaiter(this, void 0, void 0, function () {
            var pass, dataList, subscriberList, buyingList_1, buyingData, usuallyBuyingStandard_1, usuallyBuyingList, neverBuyingData, levelData, levels, _i, levels_2, level, users, levelItems, _loop_2, _a, levelItems_1, levelItem, e_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        pass = function (text) { return type === undefined || type.includes(text); };
                        dataList = [];
                        if (!pass('subscriber')) return [3 /*break*/, 2];
                        return [4 /*yield*/, database_1.default.query("SELECT DISTINCT u.userID, s.email\n           FROM `".concat(this.app, "`.t_subscribe AS s\n                    LEFT JOIN\n                `").concat(this.app, "`.t_user AS u ON s.email = JSON_EXTRACT(u.userData, '$.email');"), [])];
                    case 1:
                        subscriberList = _b.sent();
                        dataList.push({ type: 'subscriber', title: '電子郵件訂閱者', users: subscriberList });
                        _b.label = 2;
                    case 2:
                        if (!(pass('neverBuying') || pass('usuallyBuying'))) return [3 /*break*/, 5];
                        buyingList_1 = [];
                        return [4 /*yield*/, database_1.default.query("SELECT u.userID, c.email, JSON_UNQUOTE(JSON_EXTRACT(c.orderData, '$.email')) AS order_email\n           FROM `".concat(this.app, "`.t_checkout AS c\n                    JOIN\n                `").concat(this.app, "`.t_user AS u ON c.email = JSON_EXTRACT(u.userData, '$.email')\n           WHERE c.status = 1;"), [])];
                    case 3:
                        buyingData = _b.sent();
                        buyingData.map(function (item1) {
                            var index = buyingList_1.findIndex(function (item2) { return item2.userID === item1.userID; });
                            if (index === -1) {
                                buyingList_1.push({ userID: item1.userID, email: item1.email, count: 1 });
                            }
                            else {
                                buyingList_1[index].count++;
                            }
                        });
                        usuallyBuyingStandard_1 = 9.9;
                        usuallyBuyingList = buyingList_1.filter(function (item) { return item.count > usuallyBuyingStandard_1; });
                        return [4 /*yield*/, database_1.default.query("SELECT userID, JSON_UNQUOTE(JSON_EXTRACT(userData, '$.email')) AS email\n           FROM `".concat(this.app, "`.t_user\n           WHERE userID not in (").concat(buyingList_1
                                .map(function (item) { return item.userID; })
                                .concat([-1312])
                                .join(','), ")"), [])];
                    case 4:
                        neverBuyingData = _b.sent();
                        dataList = dataList.concat([
                            { type: 'neverBuying', title: '尚未購買過的顧客', users: neverBuyingData },
                            { type: 'usuallyBuying', title: '已購買多次的顧客', users: usuallyBuyingList },
                        ]);
                        _b.label = 5;
                    case 5:
                        if (!(!hide_level && pass('level'))) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.getLevelConfig()];
                    case 6:
                        levelData = _b.sent();
                        levels = levelData
                            .map(function (item) {
                            return { id: item.id, name: item.tag_name };
                        })
                            .filter(function (item) {
                            return tag ? item.id === tag : true;
                        });
                        for (_i = 0, levels_2 = levels; _i < levels_2.length; _i++) {
                            level = levels_2[_i];
                            dataList.push({
                                type: 'level',
                                title: "\u6703\u54E1\u7B49\u7D1A - ".concat(level.name),
                                tag: level.id,
                                users: [],
                            });
                        }
                        return [4 /*yield*/, database_1.default.query("SELECT userID\n           FROM `".concat(this.app, "`.t_user;"), [])];
                    case 7:
                        users = _b.sent();
                        return [4 /*yield*/, this.getUserLevel(users.map(function (item) {
                                return { userId: item.userID };
                            }))];
                    case 8:
                        levelItems = _b.sent();
                        _loop_2 = function (levelItem) {
                            var n = dataList.findIndex(function (item) { return item.tag === levelItem.data.id; });
                            if (n > -1) {
                                dataList[n].users.push({
                                    userID: levelItem.id,
                                    email: levelItem.email,
                                    count: 0,
                                });
                            }
                        };
                        for (_a = 0, levelItems_1 = levelItems; _a < levelItems_1.length; _a++) {
                            levelItem = levelItems_1[_a];
                            _loop_2(levelItem);
                        }
                        _b.label = 9;
                    case 9:
                        if (type) {
                            dataList = dataList.filter(function (item) { return type.includes(item.type); });
                        }
                        return [2 /*return*/, {
                                result: dataList.length > 0,
                                data: dataList.map(function (data) {
                                    data.count = data.users.length;
                                    return data;
                                }),
                            }];
                    case 10:
                        e_12 = _b.sent();
                        console.error(e_12);
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'getUserGroups Error:' + e_12, null);
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getLevelConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var levelData, levelList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConfigV2({ key: 'member_level_config', user_id: 'manager' })];
                    case 1:
                        levelData = _a.sent();
                        levelList = levelData.levels || [];
                        levelList.push(this.normalMember);
                        return [2 /*return*/, levelList];
                }
            });
        });
    };
    User.prototype.filterMemberUpdates = function (idList) {
        return __awaiter(this, void 0, void 0, function () {
            var memberUpdates, idSetArray, idMap_1, getMember, memberMap_1, batchSize, batches, i, slice, placeholders, query, results, _i, results_1, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        memberUpdates = [];
                        if (!(idList.length > 10000)) return [3 /*break*/, 2];
                        idSetArray = __spreadArray([], new Set(idList), true);
                        idMap_1 = new Map();
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(this.app, "`.t_user_public_config WHERE `key` = 'member_update'\n          "), [])];
                    case 1:
                        getMember = _a.sent();
                        memberMap_1 = new Map(getMember.map(function (item) { return ["".concat(item.user_id), item]; }));
                        idSetArray.map(function (id) {
                            var getResultData = memberMap_1.get("".concat(id));
                            getResultData && idMap_1.set(id, getResultData);
                        });
                        return [2 /*return*/, Object.values(idMap_1)];
                    case 2:
                        batchSize = 300;
                        batches = [];
                        for (i = 0; i < idList.length; i += batchSize) {
                            slice = idList.slice(i, i + batchSize);
                            placeholders = slice.map(function () { return '?'; }).join(',');
                            query = "\n            SELECT * FROM `".concat(this.app, "`.t_user_public_config\n            WHERE `key` = 'member_update'\n            AND user_id IN (").concat(placeholders, ");\n          ");
                            batches.push({ query: query, params: slice });
                        }
                        return [4 /*yield*/, Promise.all(batches.map(function (_a) {
                                var query = _a.query, params = _a.params;
                                return database_1.default.query(query, params);
                            }))];
                    case 3:
                        results = _a.sent();
                        for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                            result = results_1[_i];
                            memberUpdates.push.apply(memberUpdates, result);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, memberUpdates];
                    case 5:
                        error_1 = _a.sent();
                        console.error("filterMemberUpdates error: ".concat(error_1));
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.setLevelData = function (user, memberUpdates, levelConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var userID, userData, level_status, level_default, email, levelList, _a, normalData, matchedLevel, matchedUpdates, triggeredLevel;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userID = user.userID, userData = user.userData;
                        level_status = userData.level_status, level_default = userData.level_default, email = userData.email;
                        if (!(levelConfig !== null && levelConfig !== void 0)) return [3 /*break*/, 1];
                        _a = levelConfig;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getLevelConfig()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        levelList = _a;
                        normalData = {
                            id: this.normalMember.id,
                            og: this.normalMember,
                            trigger: true,
                            tag_name: this.normalMember.tag_name,
                            dead_line: '',
                        };
                        // 優先處理手動等級
                        if (level_status === 'manual') {
                            matchedLevel = levelList.find(function (item) { return item.id === level_default; });
                            return [2 /*return*/, {
                                    id: userID,
                                    email: email,
                                    status: 'manual',
                                    data: matchedLevel !== null && matchedLevel !== void 0 ? matchedLevel : normalData,
                                }];
                        }
                        if (!(memberUpdates.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.checkMember(user, false)];
                    case 4:
                        matchedUpdates = _b.sent();
                        triggeredLevel = matchedUpdates.find(function (v) { return v.trigger; });
                        if (triggeredLevel) {
                            return [2 /*return*/, {
                                    id: userID,
                                    email: email,
                                    status: 'auto',
                                    data: triggeredLevel,
                                }];
                        }
                        _b.label = 5;
                    case 5: 
                    // 預設回傳一般會員
                    return [2 /*return*/, {
                            id: userID,
                            email: email,
                            status: 'auto',
                            data: normalData,
                        }];
                }
            });
        });
    };
    User.prototype.getUserLevel = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var idList, emailList, users, chunk, chunkArray, dataList, levelConfig, memberUpdates, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        idList = data
                            .filter(function (item) { return Boolean(item.userId); })
                            .map(function (item) { return "".concat(item.userId); })
                            .concat(['-1111']);
                        emailList = data
                            .filter(function (item) { return Boolean(item.email); })
                            .map(function (item) { return "\"".concat(item.email, "\""); })
                            .concat(['-1111']);
                        return [4 /*yield*/, database_1.default.query("\n          SELECT * FROM `".concat(this.app, "`.t_user\n          WHERE userID in (").concat(idList.join(','), ")\n          OR JSON_EXTRACT(userData, '$.email') in (").concat(emailList.join(','), ")\n        "), [])];
                    case 1:
                        users = _a.sent();
                        if (!users || users.length == 0)
                            return [2 /*return*/, []];
                        chunk = 50;
                        chunkArray = [];
                        dataList = [];
                        return [4 /*yield*/, this.getLevelConfig()];
                    case 2:
                        levelConfig = _a.sent();
                        return [4 /*yield*/, this.filterMemberUpdates(idList)];
                    case 3:
                        memberUpdates = _a.sent();
                        for (i = 0; i < users.length; i += chunk) {
                            chunkArray.push(users.slice(i * chunk, (i + 1) * chunk));
                        }
                        return [4 /*yield*/, Promise.all(chunkArray.map(function (userArray) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Promise.all(userArray.map(function (user) {
                                                return _this.setLevelData(user, memberUpdates, levelConfig).then(function (userData) { return dataList.push(userData); });
                                            }))];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, dataList];
                }
            });
        });
    };
    User.prototype.subscribe = function (email, tag) {
        return __awaiter(this, void 0, void 0, function () {
            var e_13;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.queryLambada({
                                database: this.app,
                            }, function (sql) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, sql.query("replace\n            into t_subscribe (email,tag) values (?,?)", [email, tag])];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_13 = _a.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'Subscribe Error:' + e_13, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.registerFcm = function (userID, deviceToken) {
        return __awaiter(this, void 0, void 0, function () {
            var e_14;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.queryLambada({
                                database: this.app,
                            }, function (sql) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, sql.query("replace\n            into t_fcm (userID,deviceToken) values (?,?)", [userID, deviceToken])];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_14 = _a.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'RegisterFcm Error:' + e_14, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.deleteSubscribe = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var e_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.query("delete\n         FROM `".concat(this.app, "`.t_subscribe\n         where email in (?)"), [email.split(',')])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                result: true,
                            }];
                    case 2:
                        e_15 = _a.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'Delete Subscribe Error:' + e_15, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getSubScribe = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var querySql, subData, subTotal, e_16;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        querySql = [];
                        query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
                        query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
                        if (query.search) {
                            querySql.push([
                                "(s.email LIKE '%".concat(query.search, "%') && (s.tag != ").concat(database_1.default.escape(query.search), ")"),
                                "(s.tag = ".concat(database_1.default.escape(query.search), ")\n                        "),
                            ].join(" || "));
                        }
                        if (query.account) {
                            switch (query.account) {
                                case 'yes':
                                    querySql.push("(u.account is not null)");
                                    break;
                                case 'no':
                                    querySql.push("(u.account is null)");
                                    break;
                            }
                        }
                        return [4 /*yield*/, database_1.default.query("SELECT s.*, u.account\n         FROM `".concat(this.app, "`.t_subscribe AS s\n                  LEFT JOIN `").concat(this.app, "`.t_user AS u\n                            ON s.email = u.account\n         WHERE ").concat(querySql.length > 0 ? querySql.join(' AND ') : '1 = 1', " LIMIT ").concat(query.page * query.limit, "\n             , ").concat(query.limit, "\n\n        "), [])];
                    case 1:
                        subData = _c.sent();
                        return [4 /*yield*/, database_1.default.query("SELECT count(*) as c\n         FROM `".concat(this.app, "`.t_subscribe AS s\n                  LEFT JOIN `").concat(this.app, "`.t_user AS u\n                            ON s.email = u.account\n         WHERE ").concat(querySql.length > 0 ? querySql.join(' AND ') : '1 = 1', "\n\n        "), [])];
                    case 2:
                        subTotal = _c.sent();
                        return [2 /*return*/, {
                                data: subData,
                                total: subTotal[0].c,
                            }];
                    case 3:
                        e_16 = _c.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'getSubScribe Error:' + e_16, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getFCM = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var querySql, data, _i, _a, b, userData, e_17;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, , 7]);
                        query.page = (_b = query.page) !== null && _b !== void 0 ? _b : 0;
                        query.limit = (_c = query.limit) !== null && _c !== void 0 ? _c : 50;
                        querySql = [];
                        query.search &&
                            querySql.push([
                                "(userID in (select userID from `".concat(this.app, "`.t_user where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.name')) LIKE UPPER('%").concat(query.search, "%')))))"),
                            ].join(" || "));
                        return [4 /*yield*/, new ut_database_js_1.UtDatabase(this.app, "t_fcm").querySql(querySql, query)];
                    case 1:
                        data = _d.sent();
                        _i = 0, _a = data.data;
                        _d.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        b = _a[_i];
                        return [4 /*yield*/, database_1.default.query("select userData\n             from `".concat(this.app, "`.t_user\n             where userID = ?"), [b.userID])];
                    case 3:
                        userData = (_d.sent())[0];
                        b.userData = userData && userData.userData;
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, data];
                    case 6:
                        e_17 = _d.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e_17, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.deleteUser = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var e_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!query.id) return [3 /*break*/, 2];
                        return [4 /*yield*/, database_1.default.query("delete\n           FROM `".concat(this.app, "`.t_user\n           where id in (?)"), [query.id.split(',')])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!query.email) return [3 /*break*/, 4];
                        return [4 /*yield*/, database_1.default.query("delete\n           FROM `".concat(this.app, "`.t_user\n           where userData ->>'$.email'=?"), [query.email])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, {
                            result: true,
                        }];
                    case 5:
                        e_18 = _a.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'Delete User Error:' + e_18, null);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.updateUserData = function (userID_2, par_1) {
        return __awaiter(this, arguments, void 0, function (userID, par, manager) {
            var userData, login_config, register_form, _a, _b, _c, count, _d, _e, count, _f, _g, blockCheck, _h, data, e_19;
            var _j;
            if (manager === void 0) { manager = false; }
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        _k.trys.push([0, 24, , 25]);
                        return [4 /*yield*/, database_1.default.query("select *\n           from `".concat(this.app, "`.`t_user`\n           where userID = ").concat(database_1.default.escape(userID)), [])];
                    case 1:
                        userData = (_k.sent())[0];
                        return [4 /*yield*/, this.getConfigV2({
                                key: 'login_config',
                                user_id: 'manager',
                            })];
                    case 2:
                        login_config = _k.sent();
                        return [4 /*yield*/, this.getConfigV2({
                                key: 'custom_form_register',
                                user_id: 'manager',
                            })];
                    case 3:
                        register_form = _k.sent();
                        register_form.list = (_j = register_form.list) !== null && _j !== void 0 ? _j : [];
                        form_check_js_1.FormCheck.initialRegisterForm(register_form.list);
                        if (!par.userData.pwd) return [3 /*break*/, 8];
                        return [4 /*yield*/, redis_js_1.default.getValue("verify-".concat(userData.userData.email))];
                    case 4:
                        if (!((_k.sent()) === par.userData.verify_code)) return [3 /*break*/, 7];
                        _b = (_a = database_1.default).query;
                        _c = ["update `".concat(this.app, "`.`t_user`\n             set pwd=?\n             where userID = ").concat(database_1.default.escape(userID))];
                        return [4 /*yield*/, tool_1.default.hashPwd(par.userData.pwd)];
                    case 5: return [4 /*yield*/, _b.apply(_a, _c.concat([[_k.sent()]]))];
                    case 6:
                        _k.sent();
                        return [3 /*break*/, 8];
                    case 7: throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                        msg: 'email-verify-false',
                    });
                    case 8:
                        if (!(par.userData.email && par.userData.email !== userData.userData.email)) return [3 /*break*/, 12];
                        return [4 /*yield*/, database_1.default.query("select count(1)\n             from `".concat(this.app, "`.`t_user`\n             where (userData ->>'$.email' = ").concat(database_1.default.escape(par.userData.email), ")\n               and (userID != ").concat(database_1.default.escape(userID), ") "), [])];
                    case 9:
                        count = (_k.sent())[0]['count(1)'];
                        if (count) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Already exists.', {
                                msg: 'email-exists',
                            });
                        }
                        _d = login_config.email_verify;
                        if (!_d) return [3 /*break*/, 11];
                        _e = par.userData.verify_code;
                        return [4 /*yield*/, redis_js_1.default.getValue("verify-".concat(par.userData.email))];
                    case 10:
                        _d = _e !== (_k.sent());
                        _k.label = 11;
                    case 11:
                        if (_d &&
                            register_form.list.find(function (dd) {
                                return dd.key === 'email' && "".concat(dd.hidden) !== 'true';
                            })) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                                msg: 'email-verify-false',
                            });
                        }
                        _k.label = 12;
                    case 12:
                        if (!(par.userData.phone && par.userData.phone !== userData.userData.phone)) return [3 /*break*/, 16];
                        return [4 /*yield*/, database_1.default.query("select count(1)\n             from `".concat(this.app, "`.`t_user`\n             where (userData ->>'$.phone' = ").concat(database_1.default.escape(par.userData.phone), ")\n               and (userID != ").concat(database_1.default.escape(userID), ") "), [])];
                    case 13:
                        count = (_k.sent())[0]['count(1)'];
                        if (count) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Already exists.', {
                                msg: 'phone-exists',
                            });
                        }
                        _f = login_config.phone_verify;
                        if (!_f) return [3 /*break*/, 15];
                        _g = par.userData.verify_code_phone;
                        return [4 /*yield*/, redis_js_1.default.getValue("verify-phone-".concat(par.userData.phone))];
                    case 14:
                        _f = _g !== (_k.sent());
                        _k.label = 15;
                    case 15:
                        if (_f &&
                            register_form.list.find(function (dd) {
                                return dd.key === 'phone' && "".concat(dd.hidden) !== 'true';
                            })) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                                msg: 'phone-verify-false',
                            });
                        }
                        _k.label = 16;
                    case 16:
                        blockCheck = par.userData.type == 'block';
                        par.status = blockCheck ? 0 : 1;
                        if (!par.userData.phone) return [3 /*break*/, 18];
                        return [4 /*yield*/, database_1.default.query("update `".concat(this.app, "`.t_checkout\n           set email=?\n           where id > 0\n             and email = ?"), [par.userData.phone, "".concat(userData.userData.phone)])];
                    case 17:
                        _k.sent();
                        userData.account = par.userData.phone;
                        _k.label = 18;
                    case 18:
                        if (!par.userData.email) return [3 /*break*/, 20];
                        return [4 /*yield*/, database_1.default.query("update `".concat(this.app, "`.t_checkout\n           set email=?\n           where id > 0\n             and email = ?"), [par.userData.email, "".concat(userData.userData.email)])];
                    case 19:
                        _k.sent();
                        userData.account = par.userData.email;
                        _k.label = 20;
                    case 20:
                        _h = par;
                        return [4 /*yield*/, this.checkUpdate({
                                updateUserData: par.userData,
                                userID: userID,
                                manager: manager,
                            })];
                    case 21:
                        _h.userData = _k.sent();
                        delete par.userData.verify_code;
                        par = {
                            account: userData.account,
                            userData: JSON.stringify(par.userData),
                            status: par.status,
                        };
                        if (!par.account) {
                            delete par.account;
                        }
                        return [4 /*yield*/, database_1.default.query("update `".concat(this.app, "`.t_user\n         SET ?\n         WHERE 1 = 1\n           and userID = ?"), [par, userID])];
                    case 22:
                        data = (_k.sent());
                        return [4 /*yield*/, user_update_js_1.UserUpdate.update(this.app, userID)];
                    case 23:
                        _k.sent();
                        return [2 /*return*/, {
                                data: data,
                            }];
                    case 24:
                        e_19 = _k.sent();
                        throw exception_1.default.BadRequestError(e_19.code || 'BAD_REQUEST', e_19.message, e_19.data);
                    case 25: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.clearUselessData = function (userData, manager) {
        return __awaiter(this, void 0, void 0, function () {
            var config, register_form, customer_form_user_setting;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, app_js_1.default.getAdConfig(this.app, 'glitterUserForm')];
                    case 1:
                        config = _c.sent();
                        return [4 /*yield*/, this.getConfigV2({
                                key: 'custom_form_register',
                                user_id: 'manager',
                            })];
                    case 2:
                        register_form = (_a = (_c.sent()).list) !== null && _a !== void 0 ? _a : [];
                        form_check_js_1.FormCheck.initialRegisterForm(register_form);
                        return [4 /*yield*/, this.getConfigV2({
                                key: 'customer_form_user_setting',
                                user_id: 'manager',
                            })];
                    case 3:
                        customer_form_user_setting = (_b = (_c.sent()).list) !== null && _b !== void 0 ? _b : [];
                        if (!Array.isArray(config)) {
                            config = [];
                        }
                        config = config.concat(register_form).concat(customer_form_user_setting);
                        Object.keys(userData).map(function (dd) {
                            if (!config.find(function (d2) {
                                return d2.key === dd && (d2.auth !== 'manager' || manager);
                            }) &&
                                !['level_status', 'level_default', 'contact_phone', 'contact_name', 'tags'].includes(dd)) {
                                delete userData[dd];
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.checkUpdate = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            function mapUserData(userData, originUserData) {
                Object.keys(userData).map(function (dd) {
                    originUserData[dd] = userData[dd];
                });
            }
            var originUserData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("select userData\n         from `".concat(this.app, "`.`t_user`\n         where userID = ").concat(database_1.default.escape(cf.userID)), [])];
                    case 1:
                        originUserData = (_a.sent())[0]['userData'];
                        if (typeof originUserData !== 'object') {
                            originUserData = {};
                        }
                        //清空不得編輯的資料
                        return [4 /*yield*/, this.clearUselessData(cf.updateUserData, cf.manager)];
                    case 2:
                        //清空不得編輯的資料
                        _a.sent();
                        mapUserData(cf.updateUserData, originUserData);
                        return [2 /*return*/, originUserData];
                }
            });
        });
    };
    User.prototype.resetPwd = function (user_id_and_account, newPwd) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a, _b, _c, e_20;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 3, , 4]);
                        _b = (_a = database_1.default).query;
                        _c = ["update `".concat(this.app, "`.t_user\n         SET ?\n         WHERE 1 = 1\n           and ((userData ->>'$.email' = ?))")];
                        _d = {};
                        return [4 /*yield*/, tool_1.default.hashPwd(newPwd)];
                    case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([[
                                (_d.pwd = _e.sent(),
                                    _d),
                                user_id_and_account
                            ]]))];
                    case 2:
                        result = (_e.sent());
                        return [2 /*return*/, {
                                result: true,
                            }];
                    case 3:
                        e_20 = _e.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e_20, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.resetPwdNeedCheck = function (userID, pwd, newPwd) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result, _a, _b, _c, e_21;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, database_1.default.execute("select *\n           from `".concat(this.app, "`.t_user\n           where userID = ?\n             and status = 1"), [userID])];
                    case 1:
                        data = (_e.sent())[0];
                        return [4 /*yield*/, tool_1.default.compareHash(pwd, data.pwd)];
                    case 2:
                        if (!_e.sent()) return [3 /*break*/, 5];
                        _b = (_a = database_1.default).query;
                        _c = ["update `".concat(this.app, "`.t_user\n           SET ?\n           WHERE 1 = 1\n             and userID = ?")];
                        _d = {};
                        return [4 /*yield*/, tool_1.default.hashPwd(newPwd)];
                    case 3: return [4 /*yield*/, _b.apply(_a, _c.concat([[
                                (_d.pwd = _e.sent(),
                                    _d),
                                userID
                            ]]))];
                    case 4:
                        result = (_e.sent());
                        return [2 /*return*/, {
                                result: true,
                            }];
                    case 5: throw exception_1.default.BadRequestError('BAD_REQUEST', 'Auth failed', null);
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_21 = _e.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e_21, null);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.updateAccountBack = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, userData, e_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        sql = "select userData\n                   from `".concat(this.app, "`.t_user\n                   where JSON_EXTRACT(userData, '$.mailVerify') = ").concat(database_1.default.escape(token));
                        return [4 /*yield*/, database_1.default.query(sql, [])];
                    case 1:
                        userData = (_a.sent())[0]['userData'];
                        return [4 /*yield*/, database_1.default.execute("update `".concat(this.app, "`.t_user\n         set account=").concat(database_1.default.escape(userData.updateAccount), "\n         where JSON_EXTRACT(userData, '$.mailVerify') = ?"), [token])];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_22 = _a.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'updateAccountBack Error:' + e_22, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.verifyPASS = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var par, e_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        par = {
                            status: 1,
                        };
                        return [4 /*yield*/, database_1.default.query("update `".concat(this.app, "`.t_user\n         SET ?\n         WHERE 1 = 1\n           and JSON_EXTRACT(userData, '$.mailVerify') = ?"), [par, token])];
                    case 1: return [2 /*return*/, (_a.sent())];
                    case 2:
                        e_23 = _a.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify Error:' + e_23, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.checkUserExists = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var e_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.execute("select count(1)\n             from `".concat(this.app, "`.t_user\n             where userData ->>'$.email'\n               and status!=0"), [account])];
                    case 1: return [2 /*return*/, ((_a.sent())[0]['count(1)'] == 1)];
                    case 2:
                        e_24 = _a.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e_24, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.checkMailAndPhoneExists = function (email, phone) {
        return __awaiter(this, void 0, void 0, function () {
            var emailExists, phoneExists, emailResult, phoneResult, e_25;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        emailExists = false;
                        phoneExists = false;
                        if (!email) return [3 /*break*/, 2];
                        return [4 /*yield*/, database_1.default.execute("SELECT COUNT(1) AS count\n           FROM `".concat(this.app, "`.t_user\n           WHERE userData ->>'$.email' = ?\n          "), [email])];
                    case 1:
                        emailResult = _c.sent();
                        emailExists = ((_a = emailResult[0]) === null || _a === void 0 ? void 0 : _a.count) > 0;
                        _c.label = 2;
                    case 2:
                        if (!phone) return [3 /*break*/, 4];
                        return [4 /*yield*/, database_1.default.execute("SELECT COUNT(1) AS count\n           FROM `".concat(this.app, "`.t_user\n           WHERE userData ->>'$.phone' = ?\n          "), [phone])];
                    case 3:
                        phoneResult = _c.sent();
                        phoneExists = ((_b = phoneResult[0]) === null || _b === void 0 ? void 0 : _b.count) > 0;
                        _c.label = 4;
                    case 4: return [2 /*return*/, {
                            exist: emailExists || phoneExists,
                            email: email,
                            phone: phone,
                            emailExists: emailExists,
                            phoneExists: phoneExists,
                        }];
                    case 5:
                        e_25 = _c.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e_25, null);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.checkUserIdExists = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var count, e_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.query("select count(1)\n           from `".concat(this.app, "`.t_user\n           where userID = ?"), [id])];
                    case 1:
                        count = (_a.sent())[0]['count(1)'];
                        return [2 /*return*/, count];
                    case 2:
                        e_26 = _a.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e_26, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.setConfig = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var find_app_301, e_27;
            var _this = this;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, , 7]);
                        if (typeof config.value !== 'string') {
                            config.value = JSON.stringify(config.value);
                        }
                        return [4 /*yield*/, database_1.default.query("select count(1)\n             from `".concat(this.app, "`.t_user_public_config\n             where `key` = ?\n               and user_id = ? "), [config.key, (_a = config.user_id) !== null && _a !== void 0 ? _a : this.token.userID])];
                    case 1:
                        if (!((_d.sent())[0]['count(1)'] === 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, database_1.default.query("update `".concat(this.app, "`.t_user_public_config\n           set value=?,\n               updated_at=?\n           where `key` = ?\n             and user_id = ?"), [config.value, new Date(), config.key, (_b = config.user_id) !== null && _b !== void 0 ? _b : this.token.userID])];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, database_1.default.query("insert\n           into `".concat(this.app, "`.t_user_public_config (`user_id`, `key`, `value`, updated_at)\n           values (?, ?, ?, ?)\n          "), [(_c = config.user_id) !== null && _c !== void 0 ? _c : this.token.userID, config.key, config.value, new Date()])];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5:
                        //如果重新設定301轉址的話會需要將ApiPublic.app301重新清理過
                        if (config.key === 'domain_301') {
                            find_app_301 = public_table_check_js_1.ApiPublic.app301.find(function (dd) {
                                return dd.app_name === _this.app;
                            });
                            if (find_app_301) {
                                find_app_301.router = JSON.parse(config.value).list;
                            }
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        e_27 = _d.sent();
                        console.error(e_27);
                        throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e_27, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getConfig = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var e_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.execute("select *\n         from `".concat(this.app, "`.t_user_public_config\n         where `key` = ").concat(database_1.default.escape(config.key), "\n           and user_id = ").concat(database_1.default.escape(config.user_id), "\n        "), [])];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_28 = _a.sent();
                        console.error(e_28);
                        throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e_28, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getConfigV2 = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            function loop(data) {
                return __awaiter(this, void 0, void 0, function () {
                    var defaultValues, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(!data && config.user_id === 'manager')) return [3 /*break*/, 3];
                                defaultValues = {
                                    customer_form_user_setting: { list: form_check_js_1.FormCheck.initialUserForm([]) },
                                    global_express_country: { country: [] },
                                    store_version: { version: 'v1' },
                                    store_manager: {
                                        list: [
                                            {
                                                id: 'store_default',
                                                name: '庫存點1(預設)',
                                                note: '',
                                                address: '',
                                                manager_name: '',
                                                manager_phone: '',
                                            },
                                        ],
                                    },
                                    member_level_config: { levels: [] },
                                    'language-label': { label: [] },
                                    'store-information': {
                                        language_setting: { def: 'zh-TW', support: ['zh-TW'] },
                                    },
                                    'list-header-view': form_check_js_1.FormCheck.initialListHeader(),
                                };
                                // 處理條款類型的 key
                                if (config.key.startsWith('terms-related-')) {
                                    defaultValues[config.key] = terms_check_js_1.TermsCheck.check(config.key);
                                }
                                if (!defaultValues.hasOwnProperty(config.key)) return [3 /*break*/, 3];
                                return [4 /*yield*/, that_1.setConfig({
                                        key: config.key,
                                        user_id: config.user_id,
                                        value: defaultValues[config.key],
                                    })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, that_1.getConfigV2(config)];
                            case 2: return [2 /*return*/, _b.sent()];
                            case 3:
                                if (!(data && data.value)) return [3 /*break*/, 5];
                                _a = data;
                                return [4 /*yield*/, that_1.checkLeakData(config.key, data.value)];
                            case 4:
                                _a.value = (_b.sent()) || data.value; // 資料存在則進行異常數據檢查
                                return [3 /*break*/, 6];
                            case 5:
                                if (config.key === 'store-information') {
                                    return [2 /*return*/, { language_setting: { def: 'zh-TW', support: ['zh-TW'] } }]; // store-information 預設回傳
                                }
                                _b.label = 6;
                            case 6: return [2 /*return*/, (data && data.value) || {}];
                        }
                    });
                });
            }
            var that_1, getData_1, e_29;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        that_1 = this;
                        return [4 /*yield*/, database_1.default.execute("SELECT *\n         FROM `".concat(this.app, "`.t_user_public_config\n         WHERE ").concat(config.key.includes(',')
                                ? "`key` IN (".concat(config.key
                                    .split(',')
                                    .map(function (dd) { return database_1.default.escape(dd); })
                                    .join(','), ")")
                                : "`key` = ".concat(database_1.default.escape(config.key)), "\n           AND user_id = ").concat(database_1.default.escape(config.user_id)), [])];
                    case 1:
                        getData_1 = _a.sent();
                        if (config.key.includes(',')) {
                            return [2 /*return*/, Promise.all(config.key.split(',').map(function (dd) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                _a = {
                                                    key: dd
                                                };
                                                return [4 /*yield*/, loop(getData_1.find(function (d1) { return d1.key === dd; }))];
                                            case 1: return [2 /*return*/, (_a.value = _b.sent(),
                                                    _a)];
                                        }
                                    });
                                }); }))];
                        }
                        else {
                            return [2 /*return*/, loop(getData_1[0])];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_29 = _a.sent();
                        console.error(e_29);
                        throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e_29, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.checkLeakData = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, config_4;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = key;
                        switch (_a) {
                            case 'store-information': return [3 /*break*/, 1];
                            case 'menu-setting': return [3 /*break*/, 4];
                            case 'footer-setting': return [3 /*break*/, 4];
                            case 'store_manager': return [3 /*break*/, 5];
                            case 'customer_form_user_setting': return [3 /*break*/, 6];
                            case 'list-header-view': return [3 /*break*/, 7];
                            case 'login_config': return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 9];
                    case 1:
                        (_b = value.language_setting) !== null && _b !== void 0 ? _b : (value.language_setting = { def: 'zh-TW', support: ['zh-TW'] });
                        if (!(value.chat_toggle === undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getConfigV2({ key: 'message_setting', user_id: 'manager' })];
                    case 2:
                        config_4 = _e.sent();
                        value.chat_toggle = config_4.toggle;
                        _e.label = 3;
                    case 3:
                        (_c = value.checkout_mode) !== null && _c !== void 0 ? _c : (value.checkout_mode = {
                            payload: ['1', '3', '0'],
                            progress: ['shipping', 'wait', 'finish', 'arrived', 'pre_order'],
                            orderStatus: ['1', '0'],
                        });
                        return [3 /*break*/, 9];
                    case 4:
                        if (Array.isArray(value)) {
                            return [2 /*return*/, { 'zh-TW': value, 'en-US': [], 'zh-CN': [] }];
                        }
                        return [3 /*break*/, 9];
                    case 5:
                        (_d = value.list) !== null && _d !== void 0 ? _d : (value.list = [
                            {
                                id: 'store_default',
                                name: '庫存點1(預設)',
                                note: '',
                                address: '',
                                manager_name: '',
                                manager_phone: '',
                            },
                        ]);
                        return [3 /*break*/, 9];
                    case 6:
                        value.list = form_check_js_1.FormCheck.initialUserForm(value.list);
                        return [3 /*break*/, 9];
                    case 7:
                        value = form_check_js_1.FormCheck.initialListHeader(value);
                        return [3 /*break*/, 9];
                    case 8:
                        value = form_check_js_1.FormCheck.initialLoginConfig(value);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.checkEmailExists = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var count, e_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.query("select count(1)\n           from `".concat(this.app, "`.t_user\n           where userData ->>'$.email' = ?"), [email])];
                    case 1:
                        count = (_a.sent())[0]['count(1)'];
                        return [2 /*return*/, count];
                    case 2:
                        e_30 = _a.sent();
                        throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e_30, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.checkPhoneExists = function (phone) {
        return __awaiter(this, void 0, void 0, function () {
            var count, e_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.query("select count(1)\n           from `".concat(this.app, "`.t_user\n           where userData ->>'$.phone' = ?"), [phone])];
                    case 1:
                        count = (_a.sent())[0]['count(1)'];
                        return [2 /*return*/, count];
                    case 2:
                        e_31 = _a.sent();
                        throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e_31, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getUnreadCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var last_read_time, date, count, e_32;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query("SELECT value\n         FROM `".concat(this.app, "`.t_user_public_config\n         where `key` = 'notice_last_read'\n           and user_id = ?;"), [(_a = this.token) === null || _a === void 0 ? void 0 : _a.userID])];
                    case 1:
                        last_read_time = _c.sent();
                        date = !last_read_time[0] ? new Date('2022-01-29') : new Date(last_read_time[0].value.time);
                        return [4 /*yield*/, database_1.default.query("select count(1)\n           from `".concat(this.app, "`.t_notice\n           where user_id = ?\n             and created_time > ?"), [(_b = this.token) === null || _b === void 0 ? void 0 : _b.userID, date])];
                    case 2:
                        count = (_c.sent())[0]['count(1)'];
                        return [2 /*return*/, {
                                count: count,
                            }];
                    case 3:
                        e_32 = _c.sent();
                        throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e_32, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.checkAdminPermission = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_33;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.query("select count(1)\n         from ".concat(process_1.default.env.GLITTER_DB, ".app_config\n         where (appName = ?\n             and user = ?)\n            OR appName in (\n             (SELECT appName\n              FROM `").concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config\n              WHERE user = ?\n                AND status = 1\n                AND invited = 1\n                AND appName = ?));"), [this.app, (_a = this.token) === null || _a === void 0 ? void 0 : _a.userID, (_b = this.token) === null || _b === void 0 ? void 0 : _b.userID, this.app])];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, {
                                result: result[0]['count(1)'] === 1,
                            }];
                    case 2:
                        e_33 = _c.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getNotice = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var query, last_time_read, last_read_time, response, e_34;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 7, , 8]);
                        query = ["user_id=".concat((_a = this.token) === null || _a === void 0 ? void 0 : _a.userID)];
                        last_time_read = 0;
                        return [4 /*yield*/, database_1.default.query("SELECT value\n         FROM `".concat(this.app, "`.t_user_public_config\n         where `key` = 'notice_last_read'\n           and user_id = ?;"), [(_b = this.token) === null || _b === void 0 ? void 0 : _b.userID])];
                    case 1:
                        last_read_time = _e.sent();
                        if (!!last_read_time[0]) return [3 /*break*/, 3];
                        return [4 /*yield*/, database_1.default.query("insert into `".concat(this.app, "`.t_user_public_config (user_id, `key`, value, updated_at)\n           values (?, ?, ?, ?)"), [(_c = this.token) === null || _c === void 0 ? void 0 : _c.userID, 'notice_last_read', JSON.stringify({ time: new Date() }), new Date()])];
                    case 2:
                        _e.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        last_time_read = new Date(last_read_time[0].value.time).getTime();
                        return [4 /*yield*/, database_1.default.query("update `".concat(this.app, "`.t_user_public_config\n           set `value`=?\n           where user_id = ?\n             and `key` = ?"), [JSON.stringify({ time: new Date() }), "".concat((_d = this.token) === null || _d === void 0 ? void 0 : _d.userID), 'notice_last_read'])];
                    case 4:
                        _e.sent();
                        _e.label = 5;
                    case 5: return [4 /*yield*/, new ut_database_js_1.UtDatabase(this.app, "t_notice").querySql(query, cf.query)];
                    case 6:
                        response = _e.sent();
                        response.last_time_read = last_time_read;
                        return [2 /*return*/, response];
                    case 7:
                        e_34 = _e.sent();
                        console.error(e_34);
                        throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e_34, null);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.forgetPassword = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var data, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, 'auto-email-forget', 'zh-TW')];
                    case 1:
                        data = _a.sent();
                        code = tool_js_1.default.randomNumber(6);
                        return [4 /*yield*/, redis_js_1.default.setValue("forget-".concat(email), code)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, redis_js_1.default.setValue("forget-count-".concat(email), '0')];
                    case 3:
                        _a.sent();
                        (0, ses_js_1.sendmail)("".concat(data.name, " <").concat(process_1.default.env.smtp, ">"), email, data.title, data.content.replace('@{{code}}', code));
                        return [2 /*return*/];
                }
            });
        });
    };
    User.ipInfo = function (ip) {
        return __awaiter(this, void 0, void 0, function () {
            var config_5, db_data, ip_data, e_35;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        config_5 = {
                            method: 'get',
                            maxBodyLength: Infinity,
                            url: "https://ipinfo.io/".concat(ip, "?token=") + process_1.default.env.ip_info_auth,
                            headers: {},
                        };
                        return [4 /*yield*/, database_1.default.query("select *\n           from ".concat(config_1.saasConfig.SAAS_NAME, ".t_ip_info\n           where ip = ?"), [ip])];
                    case 1:
                        db_data = (_a.sent())[0];
                        ip_data = db_data && db_data.data;
                        if (!!ip_data) return [3 /*break*/, 4];
                        return [4 /*yield*/, axios_1.default.request(config_5)];
                    case 2:
                        ip_data = (_a.sent()).data;
                        return [4 /*yield*/, database_1.default.query("insert into ".concat(config_1.saasConfig.SAAS_NAME, ".t_ip_info (ip, data)\n           values (?, ?)"), [ip, JSON.stringify(ip_data)])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, ip_data];
                    case 5:
                        e_35 = _a.sent();
                        return [2 /*return*/, {
                                country: 'TW',
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getCheckoutCountingModeSQL = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var asTable, storeInfo, sqlQuery, sqlObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        asTable = table ? "".concat(table, ".") : '';
                        return [4 /*yield*/, this.getConfigV2({ key: 'store-information', user_id: 'manager' })];
                    case 1:
                        storeInfo = _a.sent();
                        sqlQuery = [];
                        sqlObject = {
                            orderStatus: {
                                key: "order_status",
                                options: new Set(['1', '0', '-1']),
                                addNull: new Set(['0']),
                            },
                            payload: {
                                key: "status",
                                options: new Set(['1', '3', '0', '-1', '-2']),
                                addNull: new Set(),
                            },
                            progress: {
                                key: "progress",
                                options: new Set(['finish', 'arrived', 'shipping', 'pre_order', 'wait', 'returns']),
                                addNull: new Set(['wait']),
                            },
                        };
                        Object.entries(storeInfo.checkout_mode).forEach(function (_a) {
                            var key = _a[0], mode = _a[1];
                            var obj = sqlObject[key];
                            if (!Array.isArray(mode) || mode.length === 0 || !obj)
                                return;
                            var modeSet = new Set(mode); // O(n) 預處理
                            var sqlTemp = [];
                            var validValues = __spreadArray([], obj.options, true).filter(function (val) { return modeSet.has(val); }); // O(n)
                            if (validValues.length > 0) {
                                sqlTemp.push("".concat(asTable).concat(obj.key, " IN (").concat(validValues.map(function (val) { return "'".concat(val, "'"); }).join(','), ")"));
                            }
                            if (__spreadArray([], obj.addNull, true).some(function (val) { return modeSet.has(val); })) {
                                sqlTemp.push("".concat(asTable).concat(obj.key, " IS NULL"));
                            }
                            if (sqlTemp.length > 0) {
                                sqlQuery.push("(".concat(sqlTemp.join(' OR '), ")"));
                            }
                        });
                        if (sqlQuery.length === 0) {
                            return [2 /*return*/, '1 = 0']; // 無需累計的判斷式
                        }
                        return [2 /*return*/, sqlQuery.join(' AND ')];
                }
            });
        });
    };
    return User;
}());
exports.User = User;

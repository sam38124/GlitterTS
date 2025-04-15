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
var express_1 = require("express");
var response_1 = require("../../modules/response");
var database_1 = require("../../modules/database");
var exception_1 = require("../../modules/exception");
var config_js_1 = require("../../config.js");
var redis_js_1 = require("../../modules/redis.js");
var tool_1 = require("../../modules/tool");
var user_1 = require("../services/user");
var ut_permission_js_1 = require("../utils/ut-permission.js");
var share_permission_1 = require("../services/share-permission");
var filter_protect_data_js_1 = require("../services/filter-protect-data.js");
var router = express_1.default.Router();
router.get('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user_2, isManager_1, _a, type, email_1, search_1, actionMap, result, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                user_2 = new user_1.User(req.get('g-app'));
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                isManager_1 = _b.sent();
                _a = req.query, type = _a.type, email_1 = _a.email, search_1 = _a.search;
                actionMap = {
                    list: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!isManager_1)
                                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
                                    return [4 /*yield*/, user_2.getUserList(req.query)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); },
                    account: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!isManager_1)
                                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
                                    return [4 /*yield*/, user_2.getUserData(email_1, 'account')];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); },
                    email: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!isManager_1)
                                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
                                    return [4 /*yield*/, user_2.getUserData(email_1, 'email_or_phone')];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); },
                    email_or_phone: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, user_2.getUserData(search_1, 'email_or_phone')];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); },
                    default: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, user_2.getUserData(req.body.token.userID)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); },
                };
                return [4 /*yield*/, (actionMap[type] || actionMap.default)()];
            case 2:
                result = _b.sent();
                return [2 /*return*/, response_1.default.succ(resp, result)];
            case 3:
                err_1 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_1)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, _b, _c, _d, _e, _f, err_2;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 6, , 7]);
                user = new user_1.User(req.get('g-app'));
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!((_g.sent()) && req.query.userID)) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, user.updateUserData(req.query.userID, req.body.userData, true)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_g.sent()]))];
            case 3:
                _e = (_d = response_1.default).succ;
                _f = [resp];
                return [4 /*yield*/, user.updateUserData(req.body.token.userID, req.body.userData)];
            case 4: return [2 /*return*/, _e.apply(_d, _f.concat([_g.sent()]))];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_2 = _g.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_2)];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.delete('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, _b, _c, _d, user, _e, _f, _g, err_3;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _h.trys.push([0, 8, , 9]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_h.sent()) return [3 /*break*/, 3];
                user = new user_1.User(req.get('g-app'));
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, user.deleteUser({
                        id: req.body.id,
                    })];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_h.sent()]))];
            case 3:
                _d = req.body.code;
                return [4 /*yield*/, redis_js_1.default.getValue("verify-".concat(req.body.email))];
            case 4:
                if (!(_d === (_h.sent()))) return [3 /*break*/, 6];
                user = new user_1.User(req.get('g-app'));
                _f = (_e = response_1.default).succ;
                _g = [resp];
                return [4 /*yield*/, user.deleteUser({
                        email: req.body.email,
                    })];
            case 5: return [2 /*return*/, _f.apply(_e, _g.concat([_h.sent()]))];
            case 6: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_3 = _h.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_3)];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.get('/level', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, emails, ids, _a, _b, _c, user, _d, _e, _f, err_4;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 6, , 7]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_g.sent()) return [3 /*break*/, 3];
                user = new user_1.User(req.get('g-app'));
                emails = req.query.email
                    ? "".concat(req.query.email).split(',').map(function (item) {
                        return { email: item };
                    })
                    : [];
                ids = req.query.id
                    ? "".concat(req.query.id).split(',').map(function (item) {
                        return { userId: item };
                    })
                    : [];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, user.getUserLevel(__spreadArray(__spreadArray([], emails, true), ids, true))];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_g.sent()]))];
            case 3:
                user = new user_1.User(req.get('g-app'));
                _e = (_d = response_1.default).succ;
                _f = [resp];
                return [4 /*yield*/, user.getUserLevel([{ userId: req.body.token.userID }])];
            case 4: return [2 /*return*/, _e.apply(_d, _f.concat([_g.sent()]))];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_4 = _g.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_4)];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get('/level/config', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, _b, _c, err_5;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                user = new user_1.User(req.get('g-app'));
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, user.getLevelConfig()];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_5 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_5)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/email-verify', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, res, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = new user_1.User(req.get('g-app'));
                return [4 /*yield*/, user.emailVerify(req.body.email)];
            case 1:
                res = _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, res)];
            case 2:
                err_6 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_6)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/phone-verify', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, res, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = new user_1.User(req.get('g-app'));
                return [4 /*yield*/, user.phoneVerify(req.body.phone_number)];
            case 1:
                res = _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, res)];
            case 2:
                err_7 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_7)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/register', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, checkData, res, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                user = new user_1.User(req.get('g-app'));
                return [4 /*yield*/, user.checkMailAndPhoneExists(req.body.userData.email, req.body.userData.phone)];
            case 1:
                checkData = _a.sent();
                if (!checkData.exist) return [3 /*break*/, 2];
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'user is already exists', { data: checkData });
            case 2: return [4 /*yield*/, user.createUser(req.body.account, req.body.pwd, req.body.userData, req)];
            case 3:
                res = _a.sent();
                res.type = res.verify;
                res.needVerify = res.verify;
                return [2 /*return*/, response_1.default.succ(resp, res)];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_8 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_8)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/manager/register', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    // 註冊使用者
    function checkUser(postUser) {
        return __awaiter(this, void 0, void 0, function () {
            var checkData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_3.checkMailAndPhoneExists(postUser.userData.email, postUser.userData.phone)];
                    case 1:
                        checkData = _a.sent();
                        if (checkData.exist) {
                            return [2 /*return*/, { pass: false, msg: 'User already exists', checkData: checkData }];
                        }
                        return [2 /*return*/, { pass: true, postUser: postUser }];
                }
            });
        });
    }
    var user_3, responseList_1, userArray_1, chunkSize_1, chunkedUserData, tempTags_1, _i, chunkedUserData_1, batch, checks, errorResult, createUserPromises, createResults, userTags, err_9;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 9, , 10]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                // 判斷是否為管理員
                if (!(_c.sent())) {
                    return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
                }
                user_3 = new user_1.User(req.get('g-app'));
                responseList_1 = [];
                userArray_1 = Array.isArray(req.body.userArray) ? req.body.userArray : [req.body];
                chunkSize_1 = 20;
                chunkedUserData = Array.from({ length: Math.ceil(userArray_1.length / chunkSize_1) }, function (_, i) {
                    return userArray_1.slice(i * chunkSize_1, (i + 1) * chunkSize_1);
                });
                tempTags_1 = [];
                _i = 0, chunkedUserData_1 = chunkedUserData;
                _c.label = 2;
            case 2:
                if (!(_i < chunkedUserData_1.length)) return [3 /*break*/, 6];
                batch = chunkedUserData_1[_i];
                return [4 /*yield*/, Promise.all(batch.map(checkUser))];
            case 3:
                checks = _c.sent();
                errorResult = checks.find(function (item) { return !item.pass; });
                // 已存在則中止建立，並回傳
                if (errorResult) {
                    throw exception_1.default.BadRequestError('BAD_REQUEST', (_a = errorResult.msg) !== null && _a !== void 0 ? _a : 'User already exists', {
                        data: errorResult.checkData,
                    });
                }
                createUserPromises = checks.map(function (check) { return __awaiter(void 0, void 0, void 0, function () {
                    var passUser;
                    var _a;
                    return __generator(this, function (_b) {
                        passUser = check.postUser;
                        tempTags_1 = tempTags_1.concat((_a = passUser.userData.tags) !== null && _a !== void 0 ? _a : []);
                        return [2 /*return*/, user_3.createUser(passUser.account, tool_1.default.randomString(8), passUser.userData, {}, true)];
                    });
                }); });
                return [4 /*yield*/, Promise.allSettled(createUserPromises)];
            case 4:
                createResults = _c.sent();
                createResults.forEach(function (result) {
                    if (result.status === 'fulfilled') {
                        responseList_1.push({ pass: true, type: result.value.verify, needVerify: result.value.verify });
                    }
                    else {
                        responseList_1.push({ pass: false, msg: 'Error processing request' });
                    }
                });
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6: return [4 /*yield*/, user_3.getConfigV2({ key: 'user_general_tags', user_id: 'manager' })];
            case 7:
                userTags = _c.sent();
                userTags.list = __spreadArray([], new Set(__spreadArray(__spreadArray([], tempTags_1, true), ((_b = userTags.list) !== null && _b !== void 0 ? _b : []), true)), true);
                return [4 /*yield*/, user_3.setConfig({
                        key: 'user_general_tags',
                        user_id: 'manager',
                        value: userTags,
                    })];
            case 8:
                _c.sent();
                return [2 /*return*/, response_1.default.succ(resp, responseList_1[0] || {})];
            case 9:
                err_9 = _c.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_9)];
            case 10: return [2 /*return*/];
        }
    });
}); });
router.post('/login', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user_4, _a, login_type, fb_token_1, line_token_1, redirect_1, google_token_1, user_id_1, pin_1, account_1, pwd_1, loginMethods, result, err_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                user_4 = new user_1.User(req.get('g-app'), req.body.token);
                _a = req.body, login_type = _a.login_type, fb_token_1 = _a.fb_token, line_token_1 = _a.line_token, redirect_1 = _a.redirect, google_token_1 = _a.google_token, user_id_1 = _a.user_id, pin_1 = _a.pin, account_1 = _a.account, pwd_1 = _a.pwd;
                loginMethods = {
                    fb: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, user_4.loginWithFb(fb_token_1)];
                    }); }); },
                    line: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, user_4.loginWithLine(line_token_1, redirect_1)];
                    }); }); },
                    google: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, user_4.loginWithGoogle(google_token_1, redirect_1)];
                    }); }); },
                    apple: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, user_4.loginWithApple(req.body.token)];
                    }); }); },
                    pin: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, user_4.loginWithPin(user_id_1, pin_1)];
                    }); }); },
                    default: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, user_4.login(account_1, pwd_1)];
                    }); }); },
                };
                return [4 /*yield*/, (loginMethods[login_type] || loginMethods.default)()];
            case 1:
                result = _b.sent();
                return [2 /*return*/, response_1.default.succ(resp, result)];
            case 2:
                err_10 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_10)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/checkMail', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var data, user, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, database_1.default.query("select `value`\n             from `".concat(config_js_1.default.DB_NAME, "`.private_config\n             where app_name = '").concat(req.query['g-app'], "'\n               and `key` = 'glitter_loginConfig'"), [])];
            case 1:
                data = _a.sent();
                if (data.length > 0) {
                    data = data[0]['value'];
                }
                else {
                    data = {
                        verify: "normal",
                        link: "",
                    };
                }
                user = new user_1.User(req.query['g-app']);
                return [4 /*yield*/, user.verifyPASS(req.query.token)];
            case 2:
                _a.sent();
                return [2 /*return*/, resp.redirect("".concat(config_js_1.default.domain, "/").concat(req.query['g-app'], "/index.html?page=").concat(data.link))];
            case 3:
                err_11 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_11)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/checkMail/updateAccount', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var data, user, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, database_1.default.query("select `value`\n             from `".concat(config_js_1.default.DB_NAME, "`.private_config\n             where app_name = '").concat(req.query['g-app'], "'\n               and `key` = 'glitter_loginConfig'"), [])];
            case 1:
                data = _a.sent();
                if (data.length > 0) {
                    data = data[0]['value'];
                }
                else {
                    data = {
                        verify: "normal",
                        link: "",
                    };
                }
                user = new user_1.User(req.query['g-app']);
                return [4 /*yield*/, user.updateAccountBack(req.query.token)];
            case 2:
                _a.sent();
                return [2 /*return*/, resp.redirect("".concat(config_js_1.default.domain, "/").concat(req.query['g-app'], "/index.html?page=").concat(data.link))];
            case 3:
                err_12 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_12)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/check/email/exists', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_13;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {};
                return [4 /*yield*/, new user_1.User(req.get('g-app')).checkEmailExists(req.query.email)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.result = _e.sent(),
                        _d)]))];
            case 2:
                err_13 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_13)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/check/phone/exists', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_14;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {};
                return [4 /*yield*/, new user_1.User(req.get('g-app')).checkPhoneExists(req.query.phone)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.result = _e.sent(),
                        _d)]))];
            case 2:
                err_14 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_14)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/forget', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var sql, userData, err_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                sql = "select *\n                     from `".concat(req.get('g-app'), "`.t_user\n                     where account = ").concat(database_1.default.escape(req.body.email), "\n                       and status = 1");
                return [4 /*yield*/, database_1.default.execute(sql, [])];
            case 1:
                userData = (_a.sent());
                if (!(userData.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, new user_1.User(req.get('g-app')).forgetPassword(req.body.email)];
            case 2:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, {
                        result: true,
                    })];
            case 3: return [2 /*return*/, response_1.default.succ(resp, {
                    result: false,
                })];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_15 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_15)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/forget/check-code', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var forget_code, forget_count, _a, err_16;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                return [4 /*yield*/, redis_js_1.default.getValue("forget-".concat(req.body.email))];
            case 1:
                forget_code = _b.sent();
                _a = parseInt;
                return [4 /*yield*/, redis_js_1.default.getValue("forget-count-".concat(req.body.email))];
            case 2:
                forget_count = _a.apply(void 0, [(_b.sent()) || '5', 10]);
                if (!(forget_code && forget_code === req.body.code && forget_count < 5)) return [3 /*break*/, 3];
                return [2 /*return*/, response_1.default.succ(resp, {
                        result: true,
                    })];
            case 3: return [4 /*yield*/, redis_js_1.default.setValue("forget-count-".concat(req.body.email), "".concat(forget_count + 1))];
            case 4:
                _b.sent();
                throw exception_1.default.BadRequestError('AUTH_FALSE', 'Code is not equal.', null);
            case 5: return [3 /*break*/, 7];
            case 6:
                err_16 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_16)];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.put('/reset/pwd', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var forget_code, err_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, redis_js_1.default.getValue("forget-".concat(req.body.email))];
            case 1:
                forget_code = _a.sent();
                if (!(forget_code && forget_code === req.body.code)) return [3 /*break*/, 3];
                return [4 /*yield*/, new user_1.User(req.get('g-app')).resetPwd(req.body.email, req.body.pwd)];
            case 2:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, {
                        result: true,
                    })];
            case 3: return [4 /*yield*/, redis_js_1.default.deleteKey("forget-".concat(req.body.email))];
            case 4:
                _a.sent();
                throw exception_1.default.BadRequestError('AUTH_FALSE', 'Code is not equal.', null);
            case 5: return [3 /*break*/, 7];
            case 6:
                err_17 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_17)];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.put('/resetPwd', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, _b, _c, err_18;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                user = new user_1.User(req.get('g-app'));
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, user.resetPwd(req.body.token.userID, req.body.pwd)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_18 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_18)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put('/resetPwdNeedCheck', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, _b, _c, err_19;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                user = new user_1.User(req.get('g-app'));
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, user.resetPwdNeedCheck(req.body.token.userID, req.body.old_pwd, req.body.pwd)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_19 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_19)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/userdata', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, _b, _c, err_20;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                user = new user_1.User(req.get('g-app'));
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, user.getUserData(req.query.userID + '')];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_20 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_20)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/group', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, type, tag, _a, _b, _c, err_21;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                user = new user_1.User(req.get('g-app'));
                type = req.query.type ? "".concat(req.query.type).split(',') : undefined;
                tag = req.query.tag ? "".concat(req.query.tag) : undefined;
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, user.getUserGroups(type, tag)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_21 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_21)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/subscribe', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, _b, _c, err_22;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                user = new user_1.User(req.get('g-app'));
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, user.getSubScribe(req.query)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_22 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_22)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/subscribe', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_23;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = new user_1.User(req.get('g-app'));
                return [4 /*yield*/, user.subscribe(req.body.email, req.body.tag)];
            case 1:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, {
                        result: true,
                    })];
            case 2:
                err_23 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_23)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/subscribe', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_24;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = new user_1.User(req.get('g-app'));
                return [4 /*yield*/, user.deleteSubscribe(req.body.email)];
            case 1:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, {
                        result: true,
                    })];
            case 2:
                err_24 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_24)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/fcm', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, _b, _c, err_25;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                user = new user_1.User(req.get('g-app'));
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, user.getFCM(req.query)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_25 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_25)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/fcm', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = new user_1.User(req.get('g-app'));
                return [4 /*yield*/, user.registerFcm(req.body.userID, req.body.deviceToken)];
            case 1:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, {
                        result: true,
                    })];
            case 2:
                err_26 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_26)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/public/config', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var post, _a, _b, _c, _d, _e, _f, _g, _h, _j, err_27;
    var _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                _m.trys.push([0, 6, , 7]);
                post = new user_1.User(req.get('g-app'), req.body.token);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_m.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _k = {
                    result: true
                };
                return [4 /*yield*/, post.getConfigV2({
                        key: req.query.key,
                        user_id: req.query.user_id,
                    })];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([(_k.value = _m.sent(),
                        _k)]))];
            case 3:
                _e = (_d = response_1.default).succ;
                _f = [resp];
                _l = {
                    result: true
                };
                _h = (_g = filter_protect_data_js_1.FilterProtectData).filter;
                _j = [req.query.key];
                return [4 /*yield*/, post.getConfigV2({
                        key: req.query.key,
                        user_id: req.query.user_id,
                    })];
            case 4: return [2 /*return*/, _e.apply(_d, _f.concat([(_l.value = _h.apply(_g, _j.concat([_m.sent()])),
                        _l)]))];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_27 = _m.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_27)];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.put('/public/config', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var post, err_28;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                post = new user_1.User(req.get('g-app'), req.body.token);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_b.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, post.setConfig({
                        key: req.body.key,
                        value: req.body.value,
                        user_id: (_a = req.body.user_id) !== null && _a !== void 0 ? _a : undefined,
                    })];
            case 2:
                _b.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, post.setConfig({
                    key: req.body.key,
                    value: req.body.value,
                })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 6:
                err_28 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_28)];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get('/notice', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_29;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new user_1.User(req.get('g-app'), req.body.token).getNotice({
                        query: req.query,
                    })];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_29 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_29)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/check-admin-auth', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_30;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new user_1.User(req.get('g-app'), req.body.token || {}).checkAdminPermission()];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_30 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_30)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/notice/unread/count', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_31;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new user_1.User(req.get('g-app'), req.body.token).getUnreadCount()];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_31 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_31)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/permission', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, email, orderBy, queryType, query, status_1, permissionData, err_32;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!(_d.sent())) {
                    return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
                }
                _a = req.query, _b = _a.page, page = _b === void 0 ? '0' : _b, _c = _a.limit, limit = _c === void 0 ? '20' : _c, email = _a.email, orderBy = _a.orderBy, queryType = _a.queryType, query = _a.query, status_1 = _a.status;
                return [4 /*yield*/, new share_permission_1.SharePermission(req.get('g-app'), req.body.token).getPermission({
                        page: parseInt(page, 10) || 0,
                        limit: parseInt(limit, 10) || 20,
                        email: email,
                        orderBy: orderBy,
                        queryType: queryType,
                        query: query,
                        status: status_1,
                    })];
            case 2:
                permissionData = _d.sent();
                return [2 /*return*/, response_1.default.succ(resp, permissionData)];
            case 3:
                err_32 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_32)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/permission', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_33;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!(_d.sent())) {
                    return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
                }
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new share_permission_1.SharePermission(req.get('g-app'), req.body.token).setPermission({
                        email: req.body.email,
                        config: req.body.config,
                        status: req.body.status,
                    })];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3:
                err_33 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_33)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.delete('/permission', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_34;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!(_d.sent())) {
                    return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
                }
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new share_permission_1.SharePermission(req.get('g-app'), req.body.token).deletePermission(req.body.email)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3:
                err_34 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_34)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put('/permission/status', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_35;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!(_d.sent())) {
                    return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
                }
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new share_permission_1.SharePermission(req.get('g-app'), req.body.token).toggleStatus(req.body.email)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3:
                err_35 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_35)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put('/permission/invite', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_36;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!(_d.sent())) {
                    return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
                }
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new share_permission_1.SharePermission(req.get('g-app'), req.body.token).triggerInvited(req.body.email)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3:
                err_36 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_36)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/permission/redirect', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, err_37;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _b = (_a = resp).send;
                return [4 /*yield*/, share_permission_1.SharePermission.redirectHTML("".concat(req.query.key))];
            case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
            case 2:
                err_37 = _c.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_37)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/ip/info', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var ip, _a, _b, err_38;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                ip = req.query.ip || req.headers['x-real-ip'] || req.ip;
                _b = (_a = resp).send;
                return [4 /*yield*/, user_1.User.ipInfo(ip)];
            case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
            case 2:
                err_38 = _c.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_38)];
            case 3: return [2 /*return*/];
        }
    });
}); });
module.exports = router;

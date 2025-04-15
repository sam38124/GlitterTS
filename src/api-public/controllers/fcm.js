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
var express_1 = require("express");
var response_1 = require("../../modules/response");
var database_1 = require("../../modules/database");
var exception_1 = require("../../modules/exception");
var ut_permission_js_1 = require("../utils/ut-permission.js");
var firebase_1 = require("../../modules/firebase");
var router = express_1.default.Router();
router.post('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app_1, device_token_stack, _i, _a, b, _b, _c, _loop_1, _d, _e, b, err_1;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 13, , 14]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_f.sent()) return [3 /*break*/, 11];
                app_1 = req.get('g-app');
                device_token_stack = [];
                _i = 0, _a = req.body.device_token;
                _f.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                b = _a[_i];
                if (!(b === 'all')) return [3 /*break*/, 4];
                _c = (_b = device_token_stack).concat;
                return [4 /*yield*/, database_1.default.query("select * from `".concat(app_1, "`.t_fcm"), [])];
            case 3:
                device_token_stack = _c.apply(_b, [(_f.sent()).map(function (dd) {
                        return dd.deviceToken;
                    })]);
                return [3 /*break*/, 5];
            case 4:
                device_token_stack.push(b);
                _f.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6:
                req.body.device_token = device_token_stack;
                _loop_1 = function (b) {
                    var check, t_notice_insert;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                check = b.length;
                                t_notice_insert = {};
                                return [4 /*yield*/, new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
                                        var _i, b_1, d, userID;
                                        var _a;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _i = 0, b_1 = b;
                                                    _b.label = 1;
                                                case 1:
                                                    if (!(_i < b_1.length)) return [3 /*break*/, 6];
                                                    d = b_1[_i];
                                                    return [4 /*yield*/, database_1.default.query("select userID from `".concat(app_1, "`.t_fcm where deviceToken=?"), [d])];
                                                case 2:
                                                    userID = ((_a = (_b.sent())[0]) !== null && _a !== void 0 ? _a : {}).userID;
                                                    if (!(userID && !t_notice_insert[userID])) return [3 /*break*/, 4];
                                                    t_notice_insert[userID] = true;
                                                    return [4 /*yield*/, database_1.default.query("insert into `".concat(app_1, "`.t_notice (user_id, tag, title, content, link)\n                                        values (?, ?, ?, ?, ?)"), [
                                                            userID,
                                                            'manual',
                                                            req.body.title,
                                                            req.body.content,
                                                            req.body.link || ''
                                                        ])];
                                                case 3:
                                                    _b.sent();
                                                    _b.label = 4;
                                                case 4:
                                                    if (d) {
                                                        new firebase_1.Firebase(req.get('g-app')).sendMessage({
                                                            title: req.body.title,
                                                            token: d,
                                                            tag: req.body.tag || '',
                                                            link: req.body.link || '',
                                                            body: req.body.content
                                                        }).then(function () {
                                                            check--;
                                                            if (check === 0) {
                                                                resolve(true);
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        check--;
                                                        if (check === 0) {
                                                            resolve(true);
                                                        }
                                                    }
                                                    _b.label = 5;
                                                case 5:
                                                    _i++;
                                                    return [3 /*break*/, 1];
                                                case 6: return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                            case 1:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _d = 0, _e = chunkArray(Array.from(new Set(req.body.device_token)), 20);
                _f.label = 7;
            case 7:
                if (!(_d < _e.length)) return [3 /*break*/, 10];
                b = _e[_d];
                return [5 /*yield**/, _loop_1(b)];
            case 8:
                _f.sent();
                _f.label = 9;
            case 9:
                _d++;
                return [3 /*break*/, 7];
            case 10: return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 11: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 12: return [3 /*break*/, 14];
            case 13:
                err_1 = _f.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_1)];
            case 14: return [2 /*return*/];
        }
    });
}); });
function chunkArray(array, groupSize) {
    var result = [];
    for (var i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}
module.exports = router;

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
var exception_1 = require("../../modules/exception");
var ut_permission_1 = require("../utils/ut-permission");
var rebate_js_1 = require("../services/rebate.js");
var user_1 = require("../services/user");
var moment_1 = require("moment");
var router = express_1.default.Router();
router.get('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, _a, _b, _c, r, err_1;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 8, , 9]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_e.sent()) return [3 /*break*/, 6];
                app = req.get('g-app');
                if (!(req.query.type === 'list')) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {
                    result: true
                };
                return [4 /*yield*/, new rebate_js_1.Rebate(app).getRebateList(req.query)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.data = _e.sent(),
                        _d)]))];
            case 3:
                if (!(req.query.type === 'user')) return [3 /*break*/, 5];
                return [4 /*yield*/, new rebate_js_1.Rebate(app).getOneRebate({
                        user_id: parseInt("".concat(req.query.user_id), 10),
                        email: req.query.email,
                    })];
            case 4:
                r = _e.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: Boolean(r), data: r })];
            case 5: return [2 /*return*/, response_1.default.succ(resp, { result: false })];
            case 6: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_1 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_1)];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.get('/history', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, _a, _b, _c, err_2;
    var _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_f.sent()) return [3 /*break*/, 3];
                app = req.get('g-app');
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {
                    result: true
                };
                return [4 /*yield*/, new rebate_js_1.Rebate(app).getCustomerRebateHistory({
                        user_id: parseInt("".concat((_e = req.query.user_id) !== null && _e !== void 0 ? _e : 0), 10),
                        email: req.query.email,
                    })];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.data = _f.sent(),
                        _d)]))];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_2 = _f.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_2)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, rebateClass, note, amount, r, err_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_c.sent()) return [3 /*break*/, 5];
                app = req.get('g-app');
                rebateClass = new rebate_js_1.Rebate(app);
                return [4 /*yield*/, rebateClass.mainStatus()];
            case 2:
                if (!(_c.sent())) {
                    return [2 /*return*/, response_1.default.succ(resp, { result: false, msg: '購物金功能關閉中' })];
                }
                note = (_a = req.body.note) !== null && _a !== void 0 ? _a : '';
                amount = (_b = req.body.amount) !== null && _b !== void 0 ? _b : 0;
                if (!(amount !== 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, rebateClass.insertRebate(req.body.user_id, amount, note && note.length > 0 ? note : '手動設定', req.body.proof)];
            case 3:
                r = _c.sent();
                if (r === null || r === void 0 ? void 0 : r.result) {
                    return [2 /*return*/, response_1.default.succ(resp, r)];
                }
                _c.label = 4;
            case 4: return [2 /*return*/, response_1.default.succ(resp, { result: false, msg: '發生錯誤' })];
            case 5: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_3 = _c.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_3)];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post('/batch', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, note, amount, deadline, rebateClass, _i, _a, userID, user, _b, _c, userID, err_4;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 14, , 15]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_f.sent()) return [3 /*break*/, 12];
                app = req.get('g-app');
                note = (_d = req.body.note) !== null && _d !== void 0 ? _d : '';
                amount = (_e = req.body.total) !== null && _e !== void 0 ? _e : 0;
                deadline = req.body.rebateEndDay !== '0' ? (0, moment_1.default)().add(req.body.rebateEndDay, 'd').format('YYYY-MM-DD HH:mm:ss') : undefined;
                rebateClass = new rebate_js_1.Rebate(app);
                return [4 /*yield*/, rebateClass.mainStatus()];
            case 2:
                if (!(_f.sent())) {
                    return [2 /*return*/, response_1.default.succ(resp, { result: false, msg: '購物金功能關閉中' })];
                }
                if (!(amount < 0)) return [3 /*break*/, 7];
                _i = 0, _a = req.body.userID;
                _f.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                userID = _a[_i];
                return [4 /*yield*/, rebateClass.minusCheck(userID, amount)];
            case 4:
                if (!!(_f.sent())) return [3 /*break*/, 6];
                return [4 /*yield*/, new user_1.User(app).getUserData(userID, 'userID')];
            case 5:
                user = _f.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: false, msg: "\u4FE1\u7BB1 ".concat(user.userData.email, "<br/>\u9918\u984D\u4E0D\u8DB3\uFF0C\u6E1B\u5C11\u5931\u6557") })];
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7:
                _b = 0, _c = req.body.userID;
                _f.label = 8;
            case 8:
                if (!(_b < _c.length)) return [3 /*break*/, 11];
                userID = _c[_b];
                if (!(amount !== 0)) return [3 /*break*/, 10];
                return [4 /*yield*/, rebateClass.insertRebate(userID, amount, note && note.length > 0 ? note : '手動設定', {
                        type: 'manual',
                        deadTime: deadline,
                    })];
            case 9:
                _f.sent();
                _f.label = 10;
            case 10:
                _b++;
                return [3 /*break*/, 8];
            case 11: return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 12: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 13: return [3 /*break*/, 15];
            case 14:
                err_4 = _f.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_4)];
            case 15: return [2 /*return*/];
        }
    });
}); });
module.exports = router;

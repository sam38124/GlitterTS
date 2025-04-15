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
var multer_1 = require("multer");
var response_1 = require("../../modules/response");
var exception_1 = require("../../modules/exception");
var database_js_1 = require("../../modules/database.js");
var ut_permission_js_1 = require("../utils/ut-permission.js");
var private_config_js_1 = require("../../services/private_config.js");
var financial_service_js_1 = require("../services/financial-service.js");
var wallet_js_1 = require("../services/wallet.js");
var ut_database_js_1 = require("../utils/ut-database.js");
var router = express_1.default.Router();
router.get('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, query, data, _i, _a, b, userData, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                app = req.get('g-app');
                query = [];
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (_b.sent()) {
                    req.query.search && query.push("(userID in (select userID from `".concat(app, "`.t_user where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.name')) LIKE UPPER('%").concat(req.query.search, "%')))))"));
                }
                else {
                    query.push("userID=".concat(database_js_1.default.escape(req.body.token.userID)));
                }
                if (req.query.type === 'minus') {
                    query.push("money<0");
                }
                else if (req.query.type === 'plus') {
                    query.push("money>0");
                }
                req.query.start_date && query.push("created_time>".concat(database_js_1.default.escape(req.query.start_date)));
                query.push("status in (1,2)");
                return [4 /*yield*/, new ut_database_js_1.UtDatabase(req.get('g-app'), "t_wallet").querySql(query, req.query)];
            case 2:
                data = _b.sent();
                _i = 0, _a = data.data;
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                b = _a[_i];
                return [4 /*yield*/, database_js_1.default.query("select userData from `".concat(app, "`.t_user where userID = ?\n                    "), [b.userID])];
            case 4:
                userData = (_b.sent())[0];
                b.userData = userData && userData.userData;
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/, response_1.default.succ(resp, data)];
            case 7:
                err_1 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_1)];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, _a, _b, _c, err_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                app = req.get('g-app');
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new wallet_js_1.Wallet(app, req.body.token).store({
                        return_url: req.body.return_url,
                        total: req.body.total,
                        note: req.body.note,
                        method: req.body.method,
                    })];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_2 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_2)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, new wallet_js_1.Wallet(req.get('g-app'), req.body.token).delete({
                        id: req.body.id,
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, {
                        result: true,
                    })];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_3 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_3)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/withdraw', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, query, data, _i, _a, b, userData, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                app = req.get('g-app');
                query = [];
                query.push("status != -2");
                return [4 /*yield*/, new ut_database_js_1.UtDatabase(req.get('g-app'), "t_withdraw").querySql(query, req.query)];
            case 1:
                data = _b.sent();
                _i = 0, _a = data.data;
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                b = _a[_i];
                return [4 /*yield*/, database_js_1.default.query("select userData from `".concat(app, "`.t_user where userID = ?\n                    "), [b.userID])];
            case 3:
                userData = (_b.sent())[0];
                b.userData = userData && userData.userData;
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 6:
                if (_b.sent()) {
                    return [2 /*return*/, response_1.default.succ(resp, data)];
                }
                else {
                    return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
                }
                return [3 /*break*/, 8];
            case 7:
                err_4 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_4)];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post('/withdraw', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            return [2 /*return*/, response_1.default.succ(resp, { result: true })];
        }
        catch (err) {
            return [2 /*return*/, response_1.default.fail(resp, err)];
        }
        return [2 /*return*/];
    });
}); });
router.put('/withdraw', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                app = req.get('g-app');
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, new wallet_js_1.Wallet(app, req.body.token).putWithdraw({
                        id: req.body.id,
                        status: req.body.status,
                        note: req.body.note,
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, {
                        result: true,
                    })];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_5 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_5)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.delete('/withdraw', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, new wallet_js_1.Wallet(req.get('g-app'), req.body.token).deleteWithDraw({
                        id: req.body.id,
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, {
                        result: true,
                    })];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_6 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_6)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/sum', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, _a, _b, _c, err_7;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                app = req.get('g-app');
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {};
                return [4 /*yield*/, database_js_1.default.query("SELECT sum(money) FROM `".concat(app, "`.t_wallet\n                            WHERE status in (1, 2) AND userID = ?"), [req.query.userID || req.body.token.userID])];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.sum = (_e.sent())[0]['sum(money)'] || 0,
                        _d)]))];
            case 2:
                err_7 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_7)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/manager', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, orderID, _i, _a, b, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_b.sent()) return [3 /*break*/, 6];
                app = req.get('g-app');
                orderID = new Date().getTime();
                _i = 0, _a = req.body.userID;
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                b = _a[_i];
                return [4 /*yield*/, database_js_1.default.execute("insert into `".concat(app, "`.t_wallet (orderID, userID, money, status, note)\n                        values (?, ?, ?, ?, ?)"), [orderID++, b, req.body.total, 2, req.body.note])];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, response_1.default.succ(resp, {
                    result: true,
                })];
            case 6: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_8 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_8)];
            case 9: return [2 /*return*/];
        }
    });
}); });
var storage = multer_1.default.memoryStorage(); // 文件暫存
var upload = (0, multer_1.default)({ storage: storage });
router.post('/notify', upload.single('file'), function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var decodeData, appName, type, keyData, responseCheckMacValue, chkSum, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                decodeData = undefined;
                appName = req.query['g-app'];
                type = req.query['type'];
                return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                        appName: appName,
                        key: 'glitter_finance',
                    })];
            case 1:
                keyData = (_a.sent())[0].value[type];
                if (type === 'ecPay') {
                    responseCheckMacValue = "".concat(req.body.CheckMacValue);
                    delete req.body.CheckMacValue;
                    chkSum = financial_service_js_1.EcPay.generateCheckMacValue(req.body, keyData.HASH_KEY, keyData.HASH_IV);
                    decodeData = {
                        Status: req.body.RtnCode === '1' && responseCheckMacValue === chkSum ? 'SUCCESS' : 'ERROR',
                        Result: {
                            MerchantOrderNo: req.body.MerchantTradeNo,
                            CheckMacValue: req.body.CheckMacValue,
                        },
                    };
                }
                if (type === 'newWebPay') {
                    decodeData = JSON.parse(new financial_service_js_1.EzPay(appName, {
                        HASH_IV: keyData.HASH_IV,
                        HASH_KEY: keyData.HASH_KEY,
                        ActionURL: keyData.ActionURL,
                        NotifyURL: '',
                        ReturnURL: '',
                        MERCHANT_ID: keyData.MERCHANT_ID,
                        TYPE: type,
                    }).decode(req.body.TradeInfo));
                }
                if (!(decodeData['Status'] === 'SUCCESS')) return [3 /*break*/, 3];
                return [4 /*yield*/, database_js_1.default.execute("update `".concat(appName, "`.t_wallet set status=? where orderID = ?\n                "), [1, decodeData['Result']['MerchantOrderNo']])];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, database_js_1.default.execute("update `".concat(appName, "`.t_wallet set status=? where orderID = ?\n                "), [-1, decodeData['Result']['MerchantOrderNo']])];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/, response_1.default.succ(resp, {})];
            case 6:
                err_9 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_9)];
            case 7: return [2 /*return*/];
        }
    });
}); });
module.exports = router;

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
var invoice_1 = require("../services/ezpay/invoice");
var app_1 = require("../../app");
var invoice_js_1 = require("../services/invoice.js");
var ut_permission_1 = require("../utils/ut-permission");
var EcInvoice_js_1 = require("../services/EcInvoice.js");
var router = express_1.default.Router();
router.post('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var config, _a, result, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                return [4 /*yield*/, app_1.default.getAdConfig(req.get('g-app'), "invoice_setting")];
            case 1:
                config = _b.sent();
                _a = config.fincial;
                switch (_a) {
                    case "ezpay": return [3 /*break*/, 2];
                    case "green": return [3 /*break*/, 4];
                }
                return [3 /*break*/, 5];
            case 2:
                if (!invoice_js_1.Invoice.checkWhiteList(config, req.body.invoice_data)) {
                    return [2 /*return*/, response_1.default.succ(resp, { result: false, message: "\u767D\u540D\u55AE\u9A57\u8B49\u672A\u901A\u904E" })];
                }
                return [4 /*yield*/, invoice_1.EzInvoice.postInvoice({
                        hashKey: config.hashkey,
                        hash_IV: config.hashiv,
                        merchNO: config.merchNO,
                        invoice_data: req.body.invoice_data,
                        beta: (config.point === "beta")
                    })];
            case 3:
                result = _b.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: result })];
            case 4: return [2 /*return*/, response_1.default.succ(resp, { result: false, message: "尚未支援" })];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_1)];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/print', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var config, _a, _b, _c, err_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                return [4 /*yield*/, app_1.default.getAdConfig(req.get('g-app'), 'invoice_setting')];
            case 1:
                config = _d.sent();
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, EcInvoice_js_1.EcInvoice.printInvoice({
                        hashKey: config.hashkey,
                        hash_IV: config.hashiv,
                        merchNO: config.merchNO,
                        app_name: req.get('g-app'),
                        order_id: req.body.order_id,
                        beta: config.point === 'beta'
                    })];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3:
                err_2 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_2)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/allowance', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var config, _a, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                return [4 /*yield*/, app_1.default.getAdConfig(req.get('g-app'), "invoice_setting")];
            case 1:
                config = _b.sent();
                _a = config.fincial;
                switch (_a) {
                    case "ezpay": return [3 /*break*/, 2];
                    case "green": return [3 /*break*/, 4];
                }
                return [3 /*break*/, 5];
            case 2:
                if (!invoice_js_1.Invoice.checkWhiteList(config, req.body.invoice_data)) {
                    return [2 /*return*/, response_1.default.succ(resp, { result: false, message: "\u767D\u540D\u55AE\u9A57\u8B49\u672A\u901A\u904E" })];
                }
                return [4 /*yield*/, invoice_1.EzInvoice.allowance({
                        hashKey: config.hashkey,
                        hash_IV: config.hashiv,
                        merchNO: config.merchNO,
                        invoice_data: req.body.invoice_data,
                        beta: (config.point === "beta")
                    })];
            case 3:
                result = _b.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: result })];
            case 4: return [2 /*return*/, response_1.default.succ(resp, { result: false, message: "尚未支援" })];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_3 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_3)];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/allowanceInvalid', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var config, _a, result, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                return [4 /*yield*/, app_1.default.getAdConfig(req.get('g-app'), "invoice_setting")];
            case 1:
                config = _b.sent();
                _a = config.fincial;
                switch (_a) {
                    case "ezpay": return [3 /*break*/, 2];
                    case "green": return [3 /*break*/, 4];
                }
                return [3 /*break*/, 5];
            case 2:
                if (!invoice_js_1.Invoice.checkWhiteList(config, req.body.invoice_data)) {
                    return [2 /*return*/, response_1.default.succ(resp, { result: false, message: "\u767D\u540D\u55AE\u9A57\u8B49\u672A\u901A\u904E" })];
                }
                return [4 /*yield*/, invoice_1.EzInvoice.allowanceInvalid({
                        hashKey: config.hashkey,
                        hash_IV: config.hashiv,
                        merchNO: config.merchNO,
                        invoice_data: req.body.invoice_data,
                        beta: (config.point === "beta")
                    })];
            case 3:
                result = _b.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: result })];
            case 4: return [2 /*return*/, response_1.default.succ(resp, { result: false, message: "尚未支援" })];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_4 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_4)];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.delete('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var config, _a, result, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                return [4 /*yield*/, app_1.default.getAdConfig(req.get('g-app'), "invoice_setting")];
            case 1:
                config = _b.sent();
                _a = config.fincial;
                switch (_a) {
                    case "ezpay": return [3 /*break*/, 2];
                    case "green": return [3 /*break*/, 4];
                }
                return [3 /*break*/, 5];
            case 2:
                if (!invoice_js_1.Invoice.checkWhiteList(config, req.body.invoice_data)) {
                    return [2 /*return*/, response_1.default.succ(resp, { result: false, message: "\u767D\u540D\u55AE\u9A57\u8B49\u672A\u901A\u904E" })];
                }
                return [4 /*yield*/, invoice_1.EzInvoice.deleteInvoice({
                        hashKey: config.hashkey,
                        hash_IV: config.hashiv,
                        merchNO: config.merchNO,
                        invoice_data: req.body.invoice_data,
                        beta: (config.point === "beta")
                    })];
            case 3:
                result = _b.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: result })];
            case 4: return [2 /*return*/, response_1.default.succ(resp, { result: false, message: "尚未支援" })];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_5 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_5)];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/getInvoice', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var config, _a, result, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                return [4 /*yield*/, app_1.default.getAdConfig(req.get('g-app'), "invoice_setting")];
            case 1:
                config = _b.sent();
                console.log("invoice-".concat(JSON.stringify(config)));
                _a = config.fincial;
                switch (_a) {
                    case "ezpay": return [3 /*break*/, 2];
                    case "green": return [3 /*break*/, 4];
                }
                return [3 /*break*/, 5];
            case 2:
                if (!invoice_js_1.Invoice.checkWhiteList(config, req.body.invoice_data)) {
                    return [2 /*return*/, response_1.default.succ(resp, { result: false, message: "\u767D\u540D\u55AE\u9A57\u8B49\u672A\u901A\u904E" })];
                }
                return [4 /*yield*/, invoice_1.EzInvoice.getInvoice({
                        hashKey: config.hashkey,
                        hash_IV: config.hashiv,
                        merchNO: config.merchNO,
                        invoice_data: req.body.invoice_data,
                        beta: (config.point === "beta")
                    })];
            case 3:
                result = _b.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: result })];
            case 4: return [2 /*return*/, response_1.default.succ(resp, { result: false, message: "尚未支援" })];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_6 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_6)];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get('/invoice-type', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, app_1.default.getAdConfig(req.get('g-app'), "invoice_setting")];
            case 1:
                config = _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, { method: config.fincial })];
        }
    });
}); });
router.get('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var config, _a, _b, _c;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, app_1.default.getAdConfig(req.get('g-app'), "invoice_setting")];
            case 1:
                config = _f.sent();
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 2:
                if (!_f.sent()) return [3 /*break*/, 4];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new invoice_js_1.Invoice(req.get('g-app')).getInvoice({
                        page: ((_d = req.query.page) !== null && _d !== void 0 ? _d : 0),
                        limit: ((_e = req.query.limit) !== null && _e !== void 0 ? _e : 50),
                        search: req.query.search,
                        searchType: req.query.searchType,
                        orderString: req.query.orderString,
                        created_time: req.query.created_time,
                        invoice_type: req.query.invoice_type,
                        issue_method: req.query.issue_method,
                        status: req.query.status,
                        filter: req.query.filter,
                    })];
            case 3: return [2 /*return*/, _b.apply(_a, _c.concat([_f.sent()]))];
            case 4: return [2 /*return*/, response_1.default.succ(resp, { method: config.fincial })];
        }
    });
}); });
router.get('/allowance', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var config, _a, _b, _c;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, app_1.default.getAdConfig(req.get('g-app'), "invoice_setting")];
            case 1:
                config = _f.sent();
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 2:
                if (!_f.sent()) return [3 /*break*/, 4];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new invoice_js_1.Invoice(req.get('g-app')).getAllowance({
                        page: ((_d = req.query.page) !== null && _d !== void 0 ? _d : 0),
                        limit: ((_e = req.query.limit) !== null && _e !== void 0 ? _e : 50),
                        search: req.query.search,
                        searchType: req.query.searchType,
                        orderString: req.query.orderString,
                        created_time: req.query.created_time,
                        invoice_type: req.query.invoice_type,
                        issue_method: req.query.issue_method,
                        status: req.query.status,
                        filter: req.query.filter,
                    })];
            case 3: return [2 /*return*/, _b.apply(_a, _c.concat([_f.sent()]))];
            case 4: return [2 /*return*/, response_1.default.succ(resp, { method: config.fincial })];
        }
    });
}); });
module.exports = router;

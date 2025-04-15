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
var response_js_1 = require("../../modules/response.js");
var http_status_codes_1 = require("http-status-codes");
var customer_sessions_js_1 = require("../services/customer-sessions.js");
var router = express_1.default.Router();
router.post('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var insertID, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).createScheduled(req.body.data)];
            case 1:
                insertID = _a.sent();
                return [2 /*return*/, resp.status(http_status_codes_1.default.OK).send(insertID)];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, response_js_1.default.fail(resp, err_1)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/close', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var insertID, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).closeScheduled(req.body.scheduleID)];
            case 1:
                insertID = _a.sent();
                return [2 /*return*/, resp.status(http_status_codes_1.default.OK).send({ insertID: 123 })];
            case 2:
                err_2 = _a.sent();
                return [2 /*return*/, response_js_1.default.fail(resp, err_2)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/finish', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var insertID, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).finishScheduled(req.body.scheduleID)];
            case 1:
                insertID = _a.sent();
                return [2 /*return*/, resp.status(http_status_codes_1.default.OK).send({ insertID: 123 })];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, response_js_1.default.fail(resp, err_3)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var data, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).getScheduled(req.query.limit, req.query.page, req.query.type)];
            case 1:
                data = _a.sent();
                // const insertID = await new CustomerSessions(req.get('g-app') as string, req.body.token).createScheduled(req.body.data)
                return [2 /*return*/, resp.status(http_status_codes_1.default.OK).send(data)];
            case 2:
                err_4 = _a.sent();
                return [2 /*return*/, response_js_1.default.fail(resp, err_4)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/online_cart', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var responseData, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).getOnlineCart(req.query.cartID)];
            case 1:
                responseData = _a.sent();
                return [2 /*return*/, resp.status(http_status_codes_1.default.OK).send(responseData)];
            case 2:
                err_5 = _a.sent();
                return [2 /*return*/, response_js_1.default.fail(resp, err_5)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/online_cart_list', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var responseData, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).getCartList(req.query.scheduleID)];
            case 1:
                responseData = _a.sent();
                return [2 /*return*/, resp.status(http_status_codes_1.default.OK).send(responseData)];
            case 2:
                err_6 = _a.sent();
                return [2 /*return*/, response_js_1.default.fail(resp, err_6)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/realOrder', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var data, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).getRealOrder(req.body.cartArray)];
            case 1:
                data = _a.sent();
                // const insertID = await new CustomerSessions(req.get('g-app') as string, req.body.token).createScheduled(req.body.data)
                return [2 /*return*/, resp.status(http_status_codes_1.default.OK).send(data)];
            case 2:
                err_7 = _a.sent();
                return [2 /*return*/, response_js_1.default.fail(resp, err_7)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/listenChat', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            // await new CustomerSessions(req.get('g-app') as string, req.body.token).createScheduled(req.body.data)
            return [2 /*return*/, resp.status(http_status_codes_1.default.OK).send("收到你的訊息")];
        }
        catch (err) {
            return [2 /*return*/, response_js_1.default.fail(resp, err)];
        }
        return [2 /*return*/];
    });
}); });
module.exports = router;

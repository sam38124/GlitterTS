"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var express_1 = require("express");
var response_1 = require("../../modules/response");
var multer_1 = require("multer");
var exception_1 = require("../../modules/exception");
var database_js_1 = require("../../modules/database.js");
var redis_js_1 = require("../../modules/redis.js");
var axios_1 = require("axios");
var ut_database_js_1 = require("../utils/ut-database.js");
var ut_permission_1 = require("../utils/ut-permission");
var financial_service_js_1 = require("../services/financial-service.js");
var private_config_js_1 = require("../../services/private_config.js");
var user_js_1 = require("../services/user.js");
var post_js_1 = require("../services/post.js");
var shopping_1 = require("../services/shopping");
var data_analyze_1 = require("../services/data-analyze");
var rebate_1 = require("../services/rebate");
var pos_js_1 = require("../services/pos.js");
var shopnex_line_message_1 = require("../services/model/shopnex-line-message");
var caught_error_js_1 = require("../../modules/caught-error.js");
var router = express_1.default.Router();
// 多線程範例
router.post('/worker', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new data_analyze_1.DataAnalyze(req.get('g-app'), req.body.token).workerExample({
                        type: req.body.type,
                        divisor: req.body.divisor,
                    })];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_1 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_1)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 多國貨幣
router.get('/currency-covert', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_2;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {};
                return [4 /*yield*/, shopping_1.Shopping.currencyCovert((req.query.base || 'TWD'))];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.data = _e.sent(), _d)]))];
            case 2:
                err_2 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_2)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 購物金
router.get('/rebate', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, rebateClass, _a, _b, _c, user_1, historyList, oldest, historyMaps, err_3;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 8, , 9]);
                app = req.get('g-app');
                rebateClass = new rebate_1.Rebate(app);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, rebateClass.getRebateListByRow(req.query)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: return [4 /*yield*/, new user_js_1.User(app).getUserData(req.body.token.userID, 'userID')];
            case 4:
                user_1 = _d.sent();
                if (!user_1.id) return [3 /*break*/, 7];
                return [4 /*yield*/, rebateClass.getCustomerRebateHistory({ user_id: req.body.token.userID })];
            case 5:
                historyList = _d.sent();
                return [4 /*yield*/, rebateClass.getOldestRebate(req.body.token.userID)];
            case 6:
                oldest = _d.sent();
                historyMaps = historyList
                    ? historyList.data.map(function (item) {
                        var _a;
                        return {
                            id: item.id,
                            orderID: (_a = item.content.order_id) !== null && _a !== void 0 ? _a : '',
                            userID: item.user_id,
                            money: item.origin,
                            remain: item.remain,
                            status: 1,
                            note: item.note,
                            created_time: item.created_at,
                            deadline: item.deadline,
                            userData: user_1.userData,
                        };
                    })
                    : [];
                return [2 /*return*/, response_1.default.succ(resp, { data: historyMaps, oldest: oldest === null || oldest === void 0 ? void 0 : oldest.data })];
            case 7: return [2 /*return*/, response_1.default.fail(resp, '使用者不存在')];
            case 8:
                err_3 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_3)];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.get('/rebate/config', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, rebateClass, config, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                app = req.get('g-app');
                rebateClass = new rebate_1.Rebate(app);
                return [4 /*yield*/, rebateClass.getConfig()];
            case 1:
                config = _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, { data: config })];
            case 2:
                err_4 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_4)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/rebate/sum', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, rebateClass, data, main, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                app = req.get('g-app');
                rebateClass = new rebate_1.Rebate(app);
                return [4 /*yield*/, rebateClass.getOneRebate({ user_id: req.query.userID || req.body.token.userID })];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, rebateClass.mainStatus()];
            case 2:
                main = _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, { main: main, sum: data ? data.point : 0 })];
            case 3:
                err_5 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_5)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/rebate/manager', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var app, orderID, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (_a.sent()) {
                    app = req.get('g-app');
                    orderID = new Date().getTime();
                    return [2 /*return*/, response_1.default.succ(resp, {
                            result: true,
                        })];
                }
                else {
                    return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
                }
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_6)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/rebate', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (_a.sent()) {
                    return [2 /*return*/, response_1.default.succ(resp, {
                            result: true,
                        })];
                }
                else {
                    return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
                }
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_7)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 結帳付款
router.post('/checkout', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).toCheckout({
                        line_items: req.body.line_items,
                        email: (req.body.token && req.body.token.account) || req.body.email,
                        return_url: req.body.return_url,
                        user_info: req.body.user_info,
                        code: req.body.code,
                        customer_info: req.body.customer_info,
                        checkOutType: req.body.checkOutType,
                        use_rebate: (function () {
                            if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
                                return req.body.use_rebate;
                            }
                            else {
                                return 0;
                            }
                        })(),
                        custom_receipt_form: req.body.custom_receipt_form,
                        custom_form_format: req.body.custom_form_format,
                        custom_form_data: req.body.custom_form_data,
                        distribution_code: req.body.distribution_code,
                        code_array: req.body.code_array,
                        give_away: req.body.give_away,
                        language: req.headers['language'],
                        client_ip_address: (req.query.ip || req.headers['x-real-ip'] || req.ip),
                        fbc: req.cookies._fbc,
                        fbp: req.cookies._fbp,
                        temp_cart_id: req.body.temp_cart_id,
                    })];
            case 1:
                result = _a.sent();
                //
                // const fb_data=new FbApi(req.get('g-app') as string)
                // fb_data.checkOut({
                //     "event_name": "Purchase",
                //     "event_time": 1740037377,
                //     "action_source": "website",
                //     "user_data": {
                //         "em": [
                //             "309a0a5c3e211326ae75ca18196d301a9bdbd1a882a4d2569511033da23f0abd"
                //         ],
                //         "ph": [
                //             "254aa248acb47dd654ca3ea53f48c2c26d641d23d7e2e93a1ec56258df7674c4",
                //             "6f4fcb9deaeadc8f9746ae76d97ce1239e98b404efe5da3ee0b7149740f89ad6"
                //         ],
                //         "client_ip_address": "123.123.123.123",
                //         "fbc": "fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
                //         "fbp": "fb.1.1558571054389.1098115397"
                //     },
                //     "custom_data": {
                //         "currency": "TWD",
                //         "value": 100.0
                //     }
                // })
                return [2 /*return*/, response_1.default.succ(resp, result)];
            case 2:
                err_8 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_8)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/checkout/repay', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_9;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).repayOrder(req.body.order_id, req.body.return_url)
                    // await new Shopping(req.get('g-app') as string, req.body.token).toCheckout(
                    //   {
                    //     return_url: req.body.return_url,
                    //
                    //   } as any,
                    //   'add',
                    //   req.body.order_id
                    // )
                ];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()
                    // await new Shopping(req.get('g-app') as string, req.body.token).toCheckout(
                    //   {
                    //     return_url: req.body.return_url,
                    //
                    //   } as any,
                    //   'add',
                    //   req.body.order_id
                    // )
                ]))];
            case 2:
                err_9 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_9)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/checkout/preview', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_10;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).toCheckout({
                        line_items: req.body.line_items,
                        email: req.body.checkOutType === 'POS' ? undefined : (req.body.token && req.body.token.account) || req.body.email,
                        return_url: req.body.return_url,
                        user_info: req.body.user_info,
                        code: req.body.code,
                        use_rebate: (function () {
                            if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
                                return req.body.use_rebate;
                            }
                            else {
                                return 0;
                            }
                        })(),
                        checkOutType: req.body.checkOutType,
                        distribution_code: req.body.distribution_code,
                        code_array: req.body.code_array,
                        give_away: req.body.give_away,
                        pos_store: req.body.pos_store,
                        language: req.headers['language'],
                    }, 'preview')];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_10 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_10)];
            case 3: return [2 /*return*/];
        }
    });
}); });
//手動新增訂單
router.post('/manager/checkout', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_11;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).toCheckout({
                        line_items: req.body.line_items,
                        email: req.body.customer_info.email,
                        return_url: req.body.return_url,
                        user_info: req.body.user_info,
                        checkOutType: 'manual',
                        voucher: req.body.voucher,
                        customer_info: req.body.customer_info,
                        discount: req.body.discount,
                        total: req.body.total,
                        pay_status: req.body.pay_status,
                        code_array: req.body.code_array,
                    }, 'manual')];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_11 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_11)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/manager/checkout/preview', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_12;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).toCheckout({
                        line_items: req.body.line_items,
                        email: (req.body.token && req.body.token.account) || req.body.email,
                        return_url: req.body.return_url,
                        user_info: req.body.user_info,
                        use_rebate: (function () {
                            if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
                                return req.body.use_rebate;
                            }
                            else {
                                return 0;
                            }
                        })(),
                        code_array: req.body.code_array,
                    }, 'manual-preview')];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_12 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_12)];
            case 6: return [2 /*return*/];
        }
    });
}); });
// 訂單
router.get('/order', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, user_data, _d, _e, _f, _g, _h, _j, err_13;
    var _k, _l, _m, _o, _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                _r.trys.push([0, 11, , 12]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_r.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).getCheckOut({
                        page: ((_k = req.query.page) !== null && _k !== void 0 ? _k : 0),
                        limit: ((_l = req.query.limit) !== null && _l !== void 0 ? _l : 50),
                        search: req.query.search,
                        phone: req.query.phone,
                        id: req.query.id,
                        id_list: req.query.id_list,
                        email: req.query.email,
                        status: req.query.status,
                        searchType: req.query.searchType,
                        shipment: req.query.shipment,
                        is_pos: req.query.is_pos,
                        progress: req.query.progress,
                        orderStatus: req.query.orderStatus,
                        created_time: req.query.created_time,
                        orderString: req.query.orderString,
                        archived: req.query.archived,
                        distribution_code: req.query.distribution_code,
                        returnSearch: req.query.returnSearch,
                        valid: req.query.valid === 'true',
                        shipment_time: req.query.shipment_time,
                        is_shipment: req.query.is_shipment === 'true',
                        is_reconciliation: req.query.is_reconciliation === 'true',
                        payment_select: req.query.payment_select,
                        reconciliation_status: req.query.reconciliation_status && req.query.reconciliation_status.split(','),
                    })];
            case 2: 
            //管理員
            return [2 /*return*/, _b.apply(_a, _c.concat([_r.sent()]))];
            case 3: return [4 /*yield*/, ut_permission_1.UtPermission.isAppUser(req)];
            case 4:
                if (!_r.sent()) return [3 /*break*/, 7];
                return [4 /*yield*/, new user_js_1.User(req.get('g-app'), req.body.token).getUserData(req.body.token.userID, 'userID')];
            case 5:
                user_data = _r.sent();
                _e = (_d = response_1.default).succ;
                _f = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).getCheckOut({
                        page: ((_m = req.query.page) !== null && _m !== void 0 ? _m : 0),
                        limit: ((_o = req.query.limit) !== null && _o !== void 0 ? _o : 50),
                        search: req.query.search,
                        id: req.query.id,
                        email: user_data.userData.email,
                        phone: user_data.userData.phone,
                        status: req.query.status,
                        progress: req.query.progress,
                        searchType: req.query.searchType,
                    })];
            case 6: return [2 /*return*/, _e.apply(_d, _f.concat([_r.sent()]))];
            case 7:
                if (!req.query.search) return [3 /*break*/, 9];
                _h = (_g = response_1.default).succ;
                _j = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).getCheckOut({
                        page: ((_p = req.query.page) !== null && _p !== void 0 ? _p : 0),
                        limit: ((_q = req.query.limit) !== null && _q !== void 0 ? _q : 50),
                        search: req.query.search,
                        id: req.query.id,
                        status: req.query.status,
                        searchType: req.query.searchType,
                        progress: req.query.progress,
                    })];
            case 8: 
            //未登入訪客
            return [2 /*return*/, _h.apply(_g, _j.concat([_r.sent()]))];
            case 9: throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
            case 10: return [3 /*break*/, 12];
            case 11:
                err_13 = _r.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_13)];
            case 12: return [2 /*return*/];
        }
    });
}); });
router.get('/order/payment-method', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var keyData_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                        appName: req.get('g-app'),
                        key: 'glitter_finance',
                    })];
            case 1:
                keyData_1 = (_a.sent())[0].value;
                //清空敏感資料
                ['MERCHANT_ID', 'HASH_KEY', 'HASH_IV'].map(function (dd) {
                    delete keyData_1[dd];
                });
                return [2 /*return*/, response_1.default.succ(resp, keyData_1)];
            case 2:
                e_1 = _a.sent();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/payment/method', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var keyData_2, err_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                        appName: req.get('g-app'),
                        key: 'glitter_finance',
                    })];
            case 1:
                keyData_2 = (_a.sent())[0].value;
                return [2 /*return*/, response_1.default.succ(resp, {
                        method: [
                            {
                                value: 'credit',
                                title: '信用卡',
                            },
                            {
                                value: 'atm',
                                title: 'ATM',
                            },
                            {
                                value: 'web_atm',
                                title: '網路ATM',
                            },
                            {
                                value: 'c_code',
                                title: '超商代碼',
                            },
                            {
                                value: 'c_bar_code',
                                title: '超商條碼',
                            },
                        ].filter(function (dd) {
                            return keyData_2[dd.value] && keyData_2.TYPE !== 'off_line';
                        }),
                    })];
            case 2:
                err_14 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_14)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put('/order/proof-purchase', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_15;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).proofPurchase(req.body.order_id, req.body.text)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_15 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_15)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put('/order', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_16;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).putOrder({
                        id: req.body.id,
                        orderData: req.body.order_data,
                        status: req.body.status,
                    })];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
            case 4: return [3 /*break*/, 6];
            case 5:
                err_16 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_16)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.put('/order/cancel', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_17;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).manualCancelOrder(req.body.id)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_17 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_17)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/order', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_18;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).deleteOrder({
                        id: req.body.id,
                    })];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
            case 4: return [3 /*break*/, 6];
            case 5:
                err_18 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_18)];
            case 6: return [2 /*return*/];
        }
    });
}); });
// 退貨訂單
router.get('/returnOrder', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_19;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_f.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).getReturnOrder({
                        page: ((_d = req.query.page) !== null && _d !== void 0 ? _d : 0),
                        limit: ((_e = req.query.limit) !== null && _e !== void 0 ? _e : 50),
                        search: req.query.search,
                        id: req.query.id,
                        email: req.query.email,
                        status: req.query.status,
                        searchType: req.query.searchType,
                        progress: req.query.progress,
                        created_time: req.query.created_time,
                        orderString: req.query.orderString,
                        archived: req.query.archived,
                    })];
            case 2: 
            //管理員
            return [2 /*return*/, _b.apply(_a, _c.concat([_f.sent()]))];
            case 3: throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
            case 4: return [3 /*break*/, 6];
            case 5:
                err_19 = _f.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_19)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.put('/returnOrder', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_20;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).putReturnOrder({
                        id: req.body.id,
                        orderData: req.body.data,
                        status: req.body.status || '0',
                    })];
            case 2: 
            //管理員
            return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
            case 4: return [3 /*break*/, 6];
            case 5:
                err_20 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_20)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/returnOrder', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_21;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).createReturnOrder(req.body)];
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
// 合併訂單
router.post('/combineOrder', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_22;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).combineOrder(req.body)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_22 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_22)];
            case 6: return [2 /*return*/];
        }
    });
}); });
// 拆分訂單
router.post('/splitOrder', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_23;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).splitOrder(req.body)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_23 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_23)];
            case 6: return [2 /*return*/];
        }
    });
}); });
// 優惠券
router.get('/voucher', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var query, shopping, vouchers, isManager_1, userClass_1, groupList_1, userID_1, userLevels_1, err_24;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                query = ["(content->>'$.type'='voucher')"];
                if (req.query.search) {
                    query.push("(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%".concat(req.query.search, "%'))"));
                }
                if (req.query.voucher_type) {
                    query.push("(content->>'$.reBackType'='".concat(req.query.voucher_type, "')"));
                }
                shopping = new shopping_1.Shopping(req.get('g-app'), req.body.token);
                return [4 /*yield*/, shopping.querySql(query, {
                        page: Number(req.query.page) || 0,
                        limit: Number(req.query.limit) || 50,
                        id: req.query.id,
                    })];
            case 1:
                vouchers = _a.sent();
                // 篩選過期優惠券
                if (req.query.date_confirm === 'true') {
                    vouchers.data = vouchers.data.filter(function (voucher) {
                        var _a = voucher.content, start_ISO_Date = _a.start_ISO_Date, end_ISO_Date = _a.end_ISO_Date;
                        var now = new Date().getTime();
                        return new Date(start_ISO_Date).getTime() < now && (!end_ISO_Date || new Date(end_ISO_Date).getTime() > now);
                    });
                }
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 2:
                isManager_1 = _a.sent();
                // 後台列表直接回傳
                if (isManager_1 && !req.query.user_email) {
                    return [2 /*return*/, response_1.default.succ(resp, vouchers)];
                }
                userClass_1 = new user_js_1.User(req.get('g-app'));
                return [4 /*yield*/, userClass_1.getUserGroups()];
            case 3:
                groupList_1 = _a.sent();
                return [4 /*yield*/, (function () { return __awaiter(void 0, void 0, void 0, function () {
                        var userData;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!isManager_1)
                                        return [2 /*return*/, req.body.token.userID];
                                    if (req.query.user_email === 'guest')
                                        return [2 /*return*/, -1];
                                    return [4 /*yield*/, userClass_1.getUserData(req.query.user_email, 'email_or_phone')];
                                case 1:
                                    userData = _a.sent();
                                    return [2 /*return*/, userData.userID];
                            }
                        });
                    }); })()];
            case 4:
                userID_1 = _a.sent();
                return [4 /*yield*/, userClass_1.getUserLevel([{ userId: userID_1 }])];
            case 5:
                userLevels_1 = _a.sent();
                // 篩選用戶適用的優惠券
                vouchers.data = vouchers.data.filter(function (voucher) {
                    var _a = voucher.content, target = _a.target, targetList = _a.targetList;
                    switch (target) {
                        case 'customer':
                            return targetList.includes(userID_1);
                        case 'levels':
                            return userLevels_1[0] ? targetList.includes(userLevels_1[0].data.id) : false;
                        case 'group':
                            if (!groupList_1.result)
                                return false;
                            return groupList_1.data.some(function (group) { return targetList.includes(group.type) && group.users.some(function (user) { return user.userID === userID_1; }); });
                        default:
                            return true; // 所有顧客皆可使用
                    }
                });
                return [2 /*return*/, response_1.default.succ(resp, vouchers)];
            case 6:
                err_24 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_24)];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.delete('/voucher', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_25;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).deleteVoucher({
                        id: req.query.id,
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_25 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_25)];
            case 6: return [2 /*return*/];
        }
    });
}); });
// 重導向
function redirect_link(req, resp) {
    return __awaiter(this, void 0, void 0, function () {
        var return_url, _a, check_id, order_data, keyData, linePay, data, check_id, keyData, paypal, data, keyData, check_id, payNow, data, html, err_26;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 18, , 19]);
                    //預防沒有APPName
                    req.query.appName = req.query.appName || req.get('g-app') || req.query['g-app'];
                    _a = URL.bind;
                    return [4 /*yield*/, redis_js_1.default.getValue(req.query.return)];
                case 1:
                    return_url = new (_a.apply(URL, [void 0, (_b.sent())]))();
                    if (!(req.query.LinePay && req.query.LinePay === 'true')) return [3 /*break*/, 7];
                    return [4 /*yield*/, redis_js_1.default.getValue("linepay" + req.query.orderID)];
                case 2:
                    check_id = _b.sent();
                    return [4 /*yield*/, database_js_1.default.query("SELECT *\n           FROM `".concat(req.query.appName, "`.t_checkout\n           WHERE cart_token = ?\n          "), [req.query.orderID])];
                case 3:
                    order_data = (_b.sent())[0];
                    return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                            appName: req.query.appName,
                            key: 'glitter_finance',
                        })];
                case 4:
                    keyData = (_b.sent())[0].value.line_pay;
                    linePay = new financial_service_js_1.LinePay(req.query.appName, keyData);
                    console.log("check_id===>".concat(req.query.orderID, "===>").concat(req.query.transactionId));
                    console.log("req.query=>", req.query);
                    return [4 /*yield*/, linePay.confirmAndCaptureOrder(req.query.transactionId, order_data['orderData'].total)];
                case 5:
                    data = (_b.sent()).data;
                    console.log("line-response==>", data);
                    if (!(data.returnCode == '0000' && data.info.orderId === req.query.orderID)) return [3 /*break*/, 7];
                    return [4 /*yield*/, new shopping_1.Shopping(req.query.appName).releaseCheckout(1, req.query.orderID)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    if (!(req.query.payment && req.query.payment == 'true')) return [3 /*break*/, 12];
                    return [4 /*yield*/, redis_js_1.default.getValue("paypal" + req.query.orderID)];
                case 8:
                    check_id = _b.sent();
                    return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                            appName: req.query.appName,
                            key: 'glitter_finance',
                        })];
                case 9:
                    keyData = (_b.sent())[0].value.paypal;
                    paypal = new financial_service_js_1.PayPal(req.query.appName, keyData);
                    return [4 /*yield*/, paypal.confirmAndCaptureOrder(check_id)];
                case 10:
                    data = _b.sent();
                    if (!(data.status === 'COMPLETED')) return [3 /*break*/, 12];
                    return [4 /*yield*/, new shopping_1.Shopping(req.query.appName).releaseCheckout(1, req.query.orderID)];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12:
                    if (!(req.query.paynow && req.query.paynow === 'true')) return [3 /*break*/, 17];
                    return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                            appName: req.query.appName,
                            key: 'glitter_finance',
                        })];
                case 13:
                    keyData = (_b.sent())[0].value.paynow;
                    return [4 /*yield*/, redis_js_1.default.getValue("paynow" + req.query.orderID)];
                case 14:
                    check_id = _b.sent();
                    payNow = new financial_service_js_1.PayNow(req.query.appName, keyData);
                    return [4 /*yield*/, payNow.confirmAndCaptureOrder(check_id)];
                case 15:
                    data = _b.sent();
                    if (!(data.type == 'success' && data.result.status === 'success')) return [3 /*break*/, 17];
                    return [4 /*yield*/, new shopping_1.Shopping(req.query.appName).releaseCheckout(1, req.query.orderID)];
                case 16:
                    _b.sent();
                    _b.label = 17;
                case 17:
                    //pp_1bed7f12879241198832063d5e091976
                    if (req.query.jkopay && req.query.jkopay === 'true') {
                        // let kd = {
                        //   ReturnURL: '',
                        //   NotifyURL: '',
                        // };
                        //
                        // const jko = new JKO(req.query.appName as string, kd);
                        // const data: any = jko.confirmAndCaptureOrder(req.query.orderID as string);
                        // if (data.tranactions[0].status == 'success') {
                        //   await new Shopping(req.query.appName as string).releaseCheckout(1, req.query.orderID as string);
                        // }
                    }
                    html = String.raw;
                    return [2 /*return*/, resp.send(html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<!DOCTYPE html>\n        <html lang=\"en\">\n          <head>\n            <meta charset=\"UTF-8\" />\n            <title>Title</title>\n          </head>\n          <body>\n            <script>\n              try {\n                window.webkit.messageHandlers.addJsInterFace.postMessage(\n                  JSON.stringify({\n                    functionName: 'check_out_finish',\n                    callBackId: 0,\n                    data: {\n                      redirect: '", "',\n                    },\n                  })\n                );\n              } catch (e) {}\n              location.href = '", "';\n            </script>\n          </body>\n        </html> "], ["<!DOCTYPE html>\n        <html lang=\"en\">\n          <head>\n            <meta charset=\"UTF-8\" />\n            <title>Title</title>\n          </head>\n          <body>\n            <script>\n              try {\n                window.webkit.messageHandlers.addJsInterFace.postMessage(\n                  JSON.stringify({\n                    functionName: 'check_out_finish',\n                    callBackId: 0,\n                    data: {\n                      redirect: '", "',\n                    },\n                  })\n                );\n              } catch (e) {}\n              location.href = '", "';\n            </script>\n          </body>\n        </html> "])), return_url.href, return_url.href))];
                case 18:
                    err_26 = _b.sent();
                    console.error(err_26);
                    return [2 /*return*/, response_1.default.fail(resp, err_26)];
                case 19: return [2 /*return*/];
            }
        });
    });
}
router.get('/redirect', redirect_link);
router.post('/redirect', redirect_link);
// 執行訂單結帳與付款事項
var storage = multer_1.default.memoryStorage();
var upload = (0, multer_1.default)({ storage: storage });
router.get('/testRelease', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var test, appName, err_27;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                test = true;
                appName = req.get('g-app');
                if (!test) return [3 /*break*/, 2];
                return [4 /*yield*/, new shopping_1.Shopping(appName).releaseCheckout(1, req.query.orderId + '')];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/, response_1.default.succ(resp, {})];
            case 3:
                err_27 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_27)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/notify', upload.single('file'), function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var decodeData, appName, type, keyData, check_id, payNow, data, jko, data, decode, err_28;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 15, , 16]);
                decodeData = undefined;
                //預防沒有APPName
                req.query.appName = req.query.appName || req.get('g-app') || req.query['g-app'];
                appName = req.query.appName;
                type = req.query['type'];
                return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                        appName: appName,
                        key: 'glitter_finance',
                    })];
            case 1:
                keyData = (_b.sent())[0].value[type];
                if (!(type === 'paynow')) return [3 /*break*/, 5];
                return [4 /*yield*/, redis_js_1.default.getValue("paynow" + req.query.orderID)];
            case 2:
                check_id = _b.sent();
                payNow = new financial_service_js_1.PayNow(req.query.appName, keyData);
                return [4 /*yield*/, payNow.confirmAndCaptureOrder(check_id)];
            case 3:
                data = _b.sent();
                if (!(data.type == 'success' && data.result.status === 'success')) return [3 /*break*/, 5];
                return [4 /*yield*/, new shopping_1.Shopping(req.query.appName).releaseCheckout(1, req.query.orderID)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                if (!(type === 'jkopay')) return [3 /*break*/, 8];
                jko = new financial_service_js_1.JKO(req.query.appName, keyData);
                return [4 /*yield*/, jko.confirmAndCaptureOrder(req.query.orderID)];
            case 6:
                data = _b.sent();
                if (!("".concat(data.transactions[0].status) === '0')) return [3 /*break*/, 8];
                return [4 /*yield*/, new shopping_1.Shopping(req.query.appName).releaseCheckout(1, req.query.orderID)];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                if (!['ecPay', 'newWebPay'].includes(type)) return [3 /*break*/, 14];
                if (!(type === 'ecPay')) return [3 /*break*/, 10];
                delete req.body.CheckMacValue;
                _a = {};
                return [4 /*yield*/, new financial_service_js_1.EcPay(appName).checkPaymentStatus(req.body.MerchantTradeNo)];
            case 9:
                decodeData = (_a.Status = (_b.sent()).TradeStatus === '1'
                    ? 'SUCCESS'
                    : 'ERROR',
                    _a.Result = {
                        MerchantOrderNo: req.body.MerchantTradeNo,
                        CheckMacValue: req.body.CheckMacValue,
                    },
                    _a);
                _b.label = 10;
            case 10:
                if (type === 'newWebPay') {
                    decode = new financial_service_js_1.EzPay(appName, {
                        HASH_IV: keyData.HASH_IV,
                        HASH_KEY: keyData.HASH_KEY,
                        ActionURL: keyData.ActionURL,
                        NotifyURL: '',
                        ReturnURL: '',
                        MERCHANT_ID: keyData.MERCHANT_ID,
                        TYPE: keyData.TYPE,
                    }).decode(req.body.TradeInfo);
                    decodeData = JSON.parse(decode.replace(/[\u0000-\u001F]+/g, '') // 控制字元
                        .replace(/[\u007F-\u009F]/g, '') // 非ASCII控制字元
                        .replace(/\\'/g, "'") // 修正單引號轉義
                        .replace(/[\r\n]+/g, '\\n'));
                    console.log("decodeData==>", decodeData);
                }
                if (!(decodeData['Status'] === 'SUCCESS')) return [3 /*break*/, 12];
                return [4 /*yield*/, new shopping_1.Shopping(appName).releaseCheckout(1, decodeData['Result']['MerchantOrderNo'])];
            case 11:
                _b.sent();
                return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, new shopping_1.Shopping(appName).releaseCheckout(-1, decodeData['Result']['MerchantOrderNo'])];
            case 13:
                _b.sent();
                _b.label = 14;
            case 14: return [2 /*return*/, response_1.default.succ(resp, {})];
            case 15:
                err_28 = _b.sent();
                console.log("notify-error", req.body);
                console.error(err_28);
                caught_error_js_1.CaughtError.warning("checkout-notify", "".concat(err_28), "".concat(err_28));
                return [2 /*return*/, response_1.default.fail(resp, err_28)];
            case 16: return [2 /*return*/];
        }
    });
}); });
// 許願池
router.get('/wishlist', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var query, data, _a, _b, _c, err_29;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                query = ["(content->>'$.type'='wishlist')", "userID = ".concat(req.body.token.userID)];
                return [4 /*yield*/, new ut_database_js_1.UtDatabase(req.get('g-app'), "t_post").querySql(query, req.query)];
            case 1:
                data = _d.sent();
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new ut_database_js_1.UtDatabase(req.get('g-app'), "t_manager_post").querySql([
                        "id in (".concat(['0']
                            .concat(data.data.map(function (dd) {
                            return dd.content.product_id;
                        }))
                            .join(','), ")"),
                    ], req.query)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3:
                err_29 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_29)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/checkWishList', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_30;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {};
                return [4 /*yield*/, database_js_1.default.query("select count(1)\n             FROM `".concat(req.get('g-app'), "`.t_post\n             where (content ->>'$.type'='wishlist')\n               and userID = ?\n               and (content ->>'$.product_id'=").concat(req.query.product_id, ")\n            "), [req.body.token.userID])];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.result = (_e.sent())[0]['count(1)'] == '1',
                        _d)]))];
            case 2:
                err_30 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_30)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/wishlist', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var post, postData, err_31;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                post = new post_js_1.Post(req.get('g-app'), req.body.token);
                return [4 /*yield*/, database_js_1.default.query("delete\n       FROM `".concat(req.get('g-app'), "`.t_post\n       where (content ->>'$.type'='wishlist')\n         and userID = ?\n         and (content ->>'$.product_id'=").concat(req.body.product_id, ")\n      "), [req.body.token.userID])];
            case 1:
                _a.sent();
                postData = {
                    product_id: req.body.product_id,
                    userID: (req.body.token && req.body.token.userID) || 0,
                    type: 'wishlist',
                };
                if (!req.body.product_id) return [3 /*break*/, 3];
                return [4 /*yield*/, post.postContent({
                        userID: postData.userID,
                        content: JSON.stringify(postData),
                    }, 't_post')];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 4:
                err_31 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_31)];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.delete('/wishlist', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_32;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_js_1.default.query("delete\n       FROM `".concat(req.get('g-app'), "`.t_post\n       where (content ->>'$.type'='wishlist')\n         and userID = ?\n         and (content ->>'$.product_id'=").concat(req.body.product_id, ")\n      "), [req.body.token.userID])];
            case 1:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 2:
                err_32 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_32)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 資料分析
router.get('/dataAnalyze', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var tags, _a, _b, _c, err_33;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                tags = "".concat(req.query.tags);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new data_analyze_1.DataAnalyze(req.get('g-app'), req.body.token).getDataAnalyze(tags.split(','), req.query.query)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
            case 4: return [3 /*break*/, 6];
            case 5:
                err_33 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_33)];
            case 6: return [2 /*return*/];
        }
    });
}); });
// 取得配送方法
router.get('/shippingMethod', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_34;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).getShippingMethod()];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_34 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_34)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 商品類別
router.get('/collection/products', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_35;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).getCollectionProducts("".concat(req.query.tag))];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
            case 4: return [3 /*break*/, 6];
            case 5:
                err_35 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_35)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/collection/product/variants', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_36;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).getCollectionProductVariants("".concat(req.query.tag))];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
            case 4: return [3 /*break*/, 6];
            case 5:
                err_36 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_36)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.put('/collection', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_37;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).putCollection(req.body.replace, req.body.original)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
            case 4: return [3 /*break*/, 6];
            case 5:
                err_37 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_37)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.delete('/collection', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_38;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).deleteCollection(req.body.data)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
            case 4: return [3 /*break*/, 6];
            case 5:
                err_38 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_38)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.put('/collection/sort', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_39;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).sortCollection(req.body.list)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
            case 4: return [3 /*break*/, 6];
            case 5:
                err_39 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_39)];
            case 6: return [2 /*return*/];
        }
    });
}); });
// 產品
router.get('/product', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var shopping, _a, _b, err_40;
    var _c;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 3, , 4]);
                _b = (_a = new shopping_1.Shopping(req.get('g-app'), req.body.token)).getProduct;
                _c = {
                    page: ((_d = req.query.page) !== null && _d !== void 0 ? _d : 0),
                    limit: ((_e = req.query.limit) !== null && _e !== void 0 ? _e : 50),
                    search: req.query.search,
                    searchType: req.query.searchType,
                    sku: req.query.sku,
                    id: req.query.id,
                    domain: req.query.domain,
                    collection: req.query.collection,
                    accurate_search_text: req.query.accurate_search_text === 'true',
                    accurate_search_collection: req.query.accurate_search_collection === 'true',
                    min_price: req.query.min_price,
                    max_price: req.query.max_price,
                    status: req.query.status,
                    channel: req.query.channel,
                    whereStore: req.query.whereStore,
                    id_list: req.query.id_list,
                    order_by: req.query.order_by,
                    with_hide_index: req.query.with_hide_index
                };
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1: return [4 /*yield*/, _b.apply(_a, [(_c.is_manger = (_f.sent()),
                        _c.show_hidden = "".concat(req.query.show_hidden),
                        _c.productType = req.query.productType,
                        _c.product_category = req.query.product_category,
                        _c.filter_visible = req.query.filter_visible,
                        _c.view_source = req.query.view_source,
                        _c.distribution_code = req.query.distribution_code,
                        _c.language = req.headers['language'],
                        _c.currency_code = req.headers['currency_code'],
                        _c)])];
            case 2:
                shopping = _f.sent();
                return [2 /*return*/, response_1.default.succ(resp, shopping)];
            case 3:
                err_40 = _f.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_40)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/product/domain', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var shopping, err_41;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).getDomain({
                        id: req.query.id,
                        search: req.query.search,
                        domain: req.query.domain,
                    })];
            case 1:
                shopping = _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, shopping)];
            case 2:
                err_41 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_41)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/product/variants', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var shopping, err_42;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).getVariants({
                        page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
                        limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
                        search: req.query.search,
                        searchType: req.query.searchType,
                        id: req.query.id,
                        collection: req.query.collection,
                        accurate_search_collection: req.query.accurate_search_collection === 'true',
                        status: req.query.status,
                        id_list: req.query.id_list,
                        order_by: req.query.order_by,
                        stockCount: req.query.stockCount,
                        productType: req.query.productType,
                    })];
            case 1:
                shopping = _c.sent();
                return [2 /*return*/, response_1.default.succ(resp, shopping)];
            case 2:
                err_42 = _c.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_42)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/product', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_43;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!!(_e.sent())) return [3 /*break*/, 2];
                return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 2:
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {
                    result: true
                };
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).postProduct(req.body)];
            case 3: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.id = _e.sent(),
                        _d)]))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_43 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_43)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/product/multiple', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_44;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!!(_e.sent())) return [3 /*break*/, 2];
                return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 2:
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {
                    result: true
                };
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).postMulProduct(req.body)];
            case 3: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.id = _e.sent(),
                        _d)]))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_44 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_44)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.put('/product', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_45;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!!(_e.sent())) return [3 /*break*/, 2];
                return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 2:
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {
                    result: true
                };
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).putProduct(req.body)];
            case 3: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.id = _e.sent(),
                        _d)]))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_45 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_45)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.put('/product/variants', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_46;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).putVariants(req.body)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
            case 4: return [3 /*break*/, 6];
            case 5:
                err_46 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_46)];
            case 6: return [2 /*return*/];
        }
    });
}); });
// 產品評論
router.get('/product/comment', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var id, comment, err_47;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = Math.max(0, parseInt("".concat(req.query.id), 10) || 0);
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).getProductComment(id)];
            case 1:
                comment = _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, comment)];
            case 2:
                err_47 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_47)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/product/comment', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_48;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).postProductComment(req.body)];
            case 1:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 2:
                err_48 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_48)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// router.put('/product/variants/recoverStock', async (req: express.Request, resp: express.Response) => {
//     try {
//         if (await UtPermission.isManager(req)) {
//             return response.succ(resp, await new Stock(req.get('g-app') as string, req.body.token).recoverStock(req.body));
//         } else {
//             throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
//         }
//     } catch (err) {
//         return response.fail(resp, err);
//     }
// });
router.delete('/product', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_49;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_1.UtPermission.isManager(req)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).deleteProduct({
                        id: req.query.id,
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_49 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_49)];
            case 6: return [2 /*return*/];
        }
    });
}); });
// 登入選項
router.get('/check-login-for-order', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var keyData, err_50;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new user_js_1.User(req.get('g-app')).getConfigV2({
                        user_id: 'manager',
                        key: 'login_config',
                    })];
            case 1:
                keyData = _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, {
                        result: keyData.login_in_to_order,
                    })];
            case 2:
                err_50 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_50)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POS機相關
router.post('/pos/checkout', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    function checkoutPos() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = response_1.default).succ;
                        _c = [resp];
                        return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).toCheckout({
                                order_id: req.body.orderID,
                                line_items: req.body.lineItems,
                                email: req.body.customer_info.email,
                                return_url: req.body.return_url,
                                user_info: req.body.user_info,
                                checkOutType: 'POS',
                                voucher: req.body.voucher,
                                customer_info: req.body.customer_info,
                                discount: req.body.discount,
                                total: req.body.total,
                                use_rebate: req.body.use_rebate,
                                pay_status: req.body.pay_status,
                                code_array: req.body.code_array,
                                pos_info: req.body.pos_info,
                                pos_store: req.body.pos_store,
                                invoice_select: req.body.invoice_select,
                                pre_order: req.body.pre_order,
                                voucherList: req.body.voucherList,
                            }, 'POS')];
                    case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
                }
            });
        });
    }
    var result, err_51;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, checkoutPos()];
            case 1:
                result = _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, result)];
            case 2:
                err_51 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_51)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POS機相關
router.post('/pos/linePay', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_52;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {};
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).linePay(req.body)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.result = _e.sent(),
                        _d)]))];
            case 2:
                err_52 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_52)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 點數續費
router.post('/apple-webhook', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var config_1, receipt, _i, _a, b, count, _b, _c, b, count, _loop_1, _d, _e, b, err_53;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 16, , 17]);
                config_1 = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    // url: 'https://sandbox.itunes.apple.com/verifyReceipt',
                    url: 'https://buy.itunes.apple.com/verifyReceipt',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: req.body.base64,
                };
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        axios_1.default
                            .request(config_1)
                            .then(function (response) {
                            resolve(response.data);
                        })
                            .catch(function (error) {
                            resolve(false);
                        });
                    })];
            case 1:
                receipt = _f.sent();
                if (!receipt) {
                    throw exception_1.default.BadRequestError('BAD_REQUEST', 'No Receipt.Cant find receipt.', null);
                }
                _i = 0, _a = receipt.receipt.in_app.filter(function (dd) {
                    return "".concat(dd.product_id).includes('ai_points_') && dd.in_app_ownership_type === 'PURCHASED';
                });
                _f.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                b = _a[_i];
                return [4 /*yield*/, database_js_1.default.query("select count(1)\n           from `".concat(req.get('g-app'), "`.t_ai_points\n           where orderID = ?"), [b.transaction_id])];
            case 3:
                count = (_f.sent())[0]['count(1)'];
                if (!!count) return [3 /*break*/, 5];
                return [4 /*yield*/, database_js_1.default.query("insert into `".concat(req.get('g-app'), "`.t_ai_points\n           set ?"), [
                        {
                            orderID: b.transaction_id,
                            userID: req.body.token.userID,
                            money: parseInt(b.product_id.replace('ai_points_', ''), 10) * 10,
                            status: 1,
                            note: JSON.stringify({
                                text: 'apple內購加值',
                                receipt: receipt,
                            }),
                        },
                    ])];
            case 4:
                _f.sent();
                _f.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6:
                _b = 0, _c = receipt.receipt.in_app.filter(function (dd) {
                    return "".concat(dd.product_id).includes('sms_') && dd.in_app_ownership_type === 'PURCHASED';
                });
                _f.label = 7;
            case 7:
                if (!(_b < _c.length)) return [3 /*break*/, 11];
                b = _c[_b];
                return [4 /*yield*/, database_js_1.default.query("select count(1)\n           from `".concat(req.get('g-app'), "`.t_sms_points\n           where orderID = ?"), [b.transaction_id])];
            case 8:
                count = (_f.sent())[0]['count(1)'];
                if (!!count) return [3 /*break*/, 10];
                return [4 /*yield*/, database_js_1.default.query("insert into `".concat(req.get('g-app'), "`.t_sms_points\n           set ?"), [
                        {
                            orderID: b.transaction_id,
                            userID: req.body.token.userID,
                            money: parseInt(b.product_id.replace('sms_', ''), 10) * 10,
                            status: 1,
                            note: JSON.stringify({
                                text: 'apple內購加值',
                                receipt: receipt,
                            }),
                        },
                    ])];
            case 9:
                _f.sent();
                _f.label = 10;
            case 10:
                _b++;
                return [3 /*break*/, 7];
            case 11:
                _loop_1 = function (b) {
                    var app_info_1, user, start, index, money;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, database_js_1.default.query("select count(1)\n             from shopnex.t_checkout\n             where cart_token = ?", [b.transaction_id])];
                            case 1:
                                if (!!(_g.sent())[0]['count(1)']) return [3 /*break*/, 6];
                                return [4 /*yield*/, database_js_1.default.query("select dead_line, user\n             from glitter.app_config\n             where appName = ?", [req.body.app_name])];
                            case 2:
                                app_info_1 = (_g.sent())[0];
                                return [4 /*yield*/, database_js_1.default.query("SELECT *\n             FROM shopnex.t_user\n             where userID = ?", [app_info_1.user])];
                            case 3:
                                user = (_g.sent())[0];
                                start = (function () {
                                    if (new Date(app_info_1.dead_line).getTime() > new Date().getTime()) {
                                        return new Date(app_info_1.dead_line);
                                    }
                                    else {
                                        return new Date();
                                    }
                                })();
                                start.setDate(start.getDate() + 365);
                                return [4 /*yield*/, database_js_1.default.query("update glitter.app_config\n           set dead_line=?,\n               plan=?\n           where appName = ?", [start, "".concat(b.product_id).replace('_apple', '').replace(/_/g, '-'), req.body.app_name])];
                            case 4:
                                _g.sent();
                                index = [
                                    'light_year_apple',
                                    'basic_year_apple',
                                    'omo_year_apple',
                                    'app_year_apple',
                                    'flagship_year_apple',
                                ].findIndex(function (d1) {
                                    return "".concat(b.product_id) === d1;
                                });
                                money = [13200, 26400, 52800, 52800, 66000][index];
                                return [4 /*yield*/, database_js_1.default.query("insert into shopnex.t_checkout\n           set ? ", [
                                        {
                                            cart_token: b.transaction_id,
                                            status: 1,
                                            email: user.userData.email,
                                            orderData: JSON.stringify({
                                                email: user.userData.email,
                                                total: money,
                                                method: 'ALL',
                                                rebate: 0,
                                                orderID: b.transaction_id,
                                                discount: 0,
                                                lineItems: [
                                                    {
                                                        id: 289,
                                                        sku: b.product_id,
                                                        spec: [['輕便電商方案', '標準電商方案', '通路電商方案', '行動電商方案', '旗艦電商方案'][index]],
                                                        count: 1,
                                                        title: 'SHOPNEX會員方案',
                                                        rebate: 0,
                                                        collection: [],
                                                        sale_price: money,
                                                        shipment_obj: { type: 'weight', value: 0 },
                                                        preview_image: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1702389593777-Frame 2 (2).png',
                                                        discount_price: 0,
                                                    },
                                                ],
                                                user_info: {
                                                    email: user.userData.email,
                                                    appName: req.body.app_name,
                                                    company: '',
                                                    gui_number: '',
                                                    invoice_type: 'me',
                                                },
                                                code_array: [],
                                                use_rebate: 0,
                                                use_wallet: '0',
                                                user_email: user.userData.email,
                                                orderSource: '',
                                                voucherList: [],
                                                shipment_fee: 0,
                                                customer_info: { payment_select: 'ecPay' },
                                                useRebateInfo: { point: 0 },
                                                payment_setting: { TYPE: 'ecPay' },
                                                user_rebate_sum: 0,
                                                off_line_support: { atm: false, line: false, cash_on_delivery: false },
                                                payment_info_atm: { bank_code: '', bank_name: '', bank_user: '', bank_account: '' },
                                                shipment_support: [],
                                                shipment_selector: [],
                                                payment_info_line_pay: { text: '' },
                                            }),
                                        },
                                    ])];
                            case 5:
                                _g.sent();
                                _g.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                };
                _d = 0, _e = receipt.receipt.in_app.filter(function (dd) {
                    return (['light_year_apple', 'basic_year_apple', 'omo_year_apple', 'app_year_apple', 'flagship_year_apple'].includes("".concat(dd.product_id)) && dd.in_app_ownership_type === 'PURCHASED');
                });
                _f.label = 12;
            case 12:
                if (!(_d < _e.length)) return [3 /*break*/, 15];
                b = _e[_d];
                return [5 /*yield**/, _loop_1(b)];
            case 13:
                _f.sent();
                _f.label = 14;
            case 14:
                _d++;
                return [3 /*break*/, 12];
            case 15: return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 16:
                err_53 = _f.sent();
                console.error(err_53);
                return [2 /*return*/, response_1.default.fail(resp, err_53)];
            case 17: return [2 /*return*/];
        }
    });
}); });
// 手動開立發票
router.post('/customer_invoice', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_54;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).postCustomerInvoice({
                        orderID: req.body.orderID,
                        orderData: req.body.orderData,
                    })];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_54 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_54)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/batch_customer_invoice', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var dataArray, _a, _b, _c, err_55;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                dataArray = req.body.array;
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).batchPostCustomerInvoice(dataArray)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_55 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_55)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 發票作廢
router.post('/void_invoice', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_56;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).voidInvoice({
                        invoice_no: req.body.invoiceNo,
                        reason: req.body.voidReason,
                        createDate: req.body.createDate,
                    })];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_56 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_56)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/void_allowance', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var passData, _a, _b, _c, err_57;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                passData = {
                    invoiceNo: req.body.invoiceNo,
                    allowanceNo: req.body.allowanceNo,
                    voidReason: req.body.voidReason,
                };
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).voidAllowance(passData)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_57 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_57)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 折讓發票
router.post('/allowance_invoice', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var passData, _a, _b, _c, err_58;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                passData = {
                    invoiceID: req.body.invoiceID,
                    allowanceData: req.body.allowanceData,
                    orderID: req.body.orderID,
                    orderData: req.body.orderData,
                    allowanceInvoiceTotalAmount: req.body.allowanceInvoiceTotalAmount,
                    itemList: req.body.itemList,
                    invoiceDate: req.body.invoiceDate,
                };
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_1.Shopping(req.get('g-app'), req.body.token).allowanceInvoice(passData)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_58 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_58)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 小結單
router.get('/pos/summary', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_59;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {};
                return [4 /*yield*/, new pos_js_1.Pos(req.get('g-app'), req.body.token).getSummary(req.query.shop)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.data = _e.sent(),
                        _d)]))];
            case 2:
                err_59 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_59)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/pos/summary', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_60;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new pos_js_1.Pos(req.get('g-app'), req.body.token).setSummary(req.body)];
            case 1:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, {
                        result: true,
                    })];
            case 2:
                err_60 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_60)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 取得上班狀態
router.get('/pos/work-status', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_61;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {};
                return [4 /*yield*/, new pos_js_1.Pos(req.get('g-app'), req.body.token).getWorkStatus(req.query)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.status = _e.sent(),
                        _d)]))];
            case 2:
                err_61 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_61)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/pos/work-status-list', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_62;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new pos_js_1.Pos(req.get('g-app'), req.body.token).getWorkStatusList(req.query)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_62 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_62)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/pos/work-status', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_63;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {};
                return [4 /*yield*/, new pos_js_1.Pos(req.get('g-app'), req.body.token).setWorkStatus(req.body)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.status = _e.sent(),
                        _d)]))];
            case 2:
                err_63 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_63)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/logistics/redirect', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var re_, return_url, _a, html, err_64;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                re_ = req.query['return'];
                _a = URL.bind;
                return [4 /*yield*/, redis_js_1.default.getValue("redirect_".concat(re_))];
            case 1:
                return_url = new (_a.apply(URL, [void 0, (_b.sent())]))();
                console.log("logistics/redirect/body", req.body);
                console.log("logistics/redirect/query", req.query);
                return_url.searchParams.set('CVSStoreID', req.body.storeid);
                return_url.searchParams.set('CVSStoreName', req.body.storename);
                return_url.searchParams.set('CVSAddress', req.body.storeaddress);
                html = String.raw;
                return [2 /*return*/, resp.send(html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<!DOCTYPE html>\n        <html lang=\"en\">\n          <head>\n            <meta charset=\"UTF-8\" />\n            <title>Title</title>\n          </head>\n          <body>\n            <script>\n              location.href = '", "';\n            </script>\n          </body>\n        </html> "], ["<!DOCTYPE html>\n        <html lang=\"en\">\n          <head>\n            <meta charset=\"UTF-8\" />\n            <title>Title</title>\n          </head>\n          <body>\n            <script>\n              location.href = '", "';\n            </script>\n          </body>\n        </html> "])), return_url.toString()))];
            case 2:
                err_64 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_64)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/ec-pay/payments/status', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_65;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new financial_service_js_1.EcPay(req.get('g-app')).checkPaymentStatus(req.query.orderID)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_65 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_65)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/ec-pay/payments/brush-back', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_66;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new financial_service_js_1.EcPay(req.get('g-app')).brushBack(req.body.orderID, req.body.tradNo, req.body.total)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_66 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_66)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/verification-code', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_67;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, shopnex_line_message_1.ShopnexLineMessage.generateVerificationCode(req.get('g-app'))];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_67 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_67)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/verification-code', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_68;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, shopnex_line_message_1.ShopnexLineMessage.verifyVerificationCode(req.body)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_68 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_68)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/line_group', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_69;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, shopnex_line_message_1.ShopnexLineMessage.getLineGroup(req.get('g-app'))];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_69 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_69)];
            case 3: return [2 /*return*/];
        }
    });
}); });
var templateObject_1, templateObject_2;
module.exports = router;

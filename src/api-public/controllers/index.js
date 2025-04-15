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
var jsonwebtoken_1 = require("jsonwebtoken");
var redis_1 = require("../../modules/redis");
var database_1 = require("../../modules/database");
var config_1 = require("../../config");
var router = express_1.default.Router();
var logger_1 = require("../../modules/logger");
var underscore_1 = require("underscore");
var exception_1 = require("../../modules/exception");
var userRouter = require("./user");
var postRouter = require("./post");
var messageRouter = require("./chat");
var invoiceRouter = require("./invoice");
var sql_apiRouter = require("./sql_api");
var lambda_apiRouter = require("./lambda");
var shop_apiRouter = require("./shop");
var manager_apiRouter = require("./manager");
var app_release = require("./app-release");
var smtp = require("./smtp");
var sms = require("./sms");
var line_message = require("./line-message");
var fb_message = require("./fb-message");
var fcm = require("./fcm");
var wallet = require("./wallet");
var article = require("./article");
var delivery = require("./delivery");
var rebate = require("./rebate");
var recommend = require("./recommend");
var stock = require("./stock");
var shopee = require("./shopee");
var customer_sessions = require("./customer-sessions");
var fb = require("./fb-service");
var live_source_js_1 = require("../../live_source.js");
var public_table_check_js_1 = require("../services/public-table-check.js");
var monitor_js_1 = require("../services/monitor.js");
var language_setting_js_1 = require("../services/language-setting.js");
/*********SET UP Router*************/
router.use('/api-public/*', doAuthAction);
router.use(config_1.config.getRoute(config_1.config.public_route.user, 'public'), userRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.post, 'public'), postRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.chat, 'public'), messageRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.invoice, 'public'), invoiceRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.sql_api, 'public'), sql_apiRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.lambda, 'public'), lambda_apiRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.ec, 'public'), shop_apiRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.manager, 'public'), manager_apiRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.app, 'public'), app_release);
router.use(config_1.config.getRoute(config_1.config.public_route.smtp, 'public'), smtp);
router.use(config_1.config.getRoute(config_1.config.public_route.sms, 'public'), sms);
router.use(config_1.config.getRoute(config_1.config.public_route.line_message, 'public'), line_message);
router.use(config_1.config.getRoute(config_1.config.public_route.fb_message, 'public'), fb_message);
router.use(config_1.config.getRoute(config_1.config.public_route.fcm, 'public'), fcm);
router.use(config_1.config.getRoute(config_1.config.public_route.wallet, 'public'), wallet);
router.use(config_1.config.getRoute(config_1.config.public_route.article, 'public'), article);
router.use(config_1.config.getRoute(config_1.config.public_route.delivery, 'public'), delivery);
router.use(config_1.config.getRoute(config_1.config.public_route.rebate, 'public'), rebate);
router.use(config_1.config.getRoute(config_1.config.public_route.recommend, 'public'), recommend);
router.use(config_1.config.getRoute(config_1.config.public_route.stock, 'public'), stock);
router.use(config_1.config.getRoute(config_1.config.public_route.shopee, 'public'), shopee);
router.use(config_1.config.getRoute(config_1.config.public_route.customer_sessions, 'public'), customer_sessions);
router.use(config_1.config.getRoute(config_1.config.public_route.graph_api, 'public'), require('./graph-api'));
router.use(config_1.config.getRoute(config_1.config.public_route.ai_chat, 'public'), require('./ai-chat'));
router.use(config_1.config.getRoute(config_1.config.public_route.ai_points, 'public'), require('./ai-points'));
router.use(config_1.config.getRoute(config_1.config.public_route.sms_points, 'public'), require('./sms-points'));
router.use(config_1.config.getRoute(config_1.config.public_route.track, 'public'), require('./track'));
router.use(config_1.config.getRoute(config_1.config.public_route.voucher, 'public'), require('./voucher'));
router.use(config_1.config.getRoute(config_1.config.public_route.fb, 'public'), fb);
router.use(config_1.config.getRoute(config_1.config.public_route.reconciliation, 'public'), require('./reconciliation'));
/******************************/
var whiteList = [
    { url: config_1.config.getRoute(config_1.config.public_route.customer_sessions + '/online_cart', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.shopee, 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.shopee + '/listenMessage', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.shopee + '/listenMessage', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.shopee + '/stock-hook', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.shopee + '/stock-hook', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.line_message + '/listenMessage', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.fb_message + '/listenMessage', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.fb_message + '/listenMessage', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/check-admin-auth', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.chat, 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.invoice + '/invoice-type', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.chat + '/message', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.chat + '/unread', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.chat + '/message', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.chat, 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/register', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/login', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/email-verify', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/phone-verify', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/forget', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/forget/check-code', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/reset/pwd', 'public'), method: 'PUT' },
    { url: config_1.config.getRoute(config_1.config.public_route.post, 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.post, 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.post + '/user', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.post + '/manager', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.post, 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.post + '/public/config', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.post + '/user', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/checkMail', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/check/email/exists', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/check/phone/exists', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/checkMail/updateAccount', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/userdata', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/subscribe', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/fcm', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/public/config', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/forget', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/ip/info', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + '/permission/redirect', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.sql_api, 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.sql_api, 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.lambda, 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.lambda, 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.lambda, 'public'), method: 'DELETE' },
    { url: config_1.config.getRoute(config_1.config.public_route.lambda, 'public'), method: 'PUT' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/product', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/product/variants', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/checkout', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/checkout/repay', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/checkout/preview', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/redirect', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/logistics/redirect', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/order', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/order/cancel', 'public'), method: 'PUT' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/order/proof-purchase', 'public'), method: 'PUT' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/order/payment-method', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/redirect', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/apple-webhook', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/notify', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.delivery + '/notify', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/shippingMethod', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ai_points + '/notify', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/payment/method', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/currency-covert', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/check-login-for-order', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/verification-code', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.sms_points + '/notify', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.wallet + '/notify', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.manager + '/config', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.article, 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.article + '/manager', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.delivery + '/formView', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.delivery + '/c2cRedirect', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.delivery + '/c2cNotify', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.delivery + '/storeMaps', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.delivery + '/print-delivery', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.graph_api, 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.graph_api, 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.graph_api, 'public'), method: 'PUT' },
    { url: config_1.config.getRoute(config_1.config.public_route.graph_api, 'public'), method: 'DELETE' },
    { url: config_1.config.getRoute(config_1.config.public_route.graph_api, 'public'), method: 'PATCH' },
    { url: config_1.config.getRoute(config_1.config.public_route.track, 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.ai_chat + '/ask-order', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ai_chat + '/search-product', 'public'), method: 'POST' },
];
function doAuthAction(req, resp, next_step) {
    return __awaiter(this, void 0, void 0, function () {
        //將請求紀錄插入SQL，監測用戶數量與避免DDOS攻擊。
        function next() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, monitor_js_1.Monitor.insertHistory({ req: req, token: req.body.token, req_type: 'api' })];
                        case 1:
                            _a.sent();
                            next_step();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function checkBlockUser() {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, database_1.default.query("SELECT count(1)\n                     FROM `".concat((_a = req.get('g-app')) !== null && _a !== void 0 ? _a : req.query['g-app'], "`.t_user\n                     where userID = ?\n                       and status = 0"), [req.body.token.userID])];
                        case 1:
                            if (!((_c.sent())[0]['count(1)'] === 1)) return [3 /*break*/, 3];
                            return [4 /*yield*/, redis_1.default.deleteKey(token)];
                        case 2:
                            _c.sent();
                            return [2 /*return*/, true];
                        case 3: return [4 /*yield*/, database_1.default.execute("update `".concat((_b = req.get('g-app')) !== null && _b !== void 0 ? _b : req.query['g-app'], "`.t_user\n             set online_time=NOW()\n             where userID = ?"), [req.body.token.userID || '-1'])];
                        case 4:
                            _c.sent();
                            return [2 /*return*/, false];
                    }
                });
            });
        }
        var refer_app, _a, _b, logger, TAG, url, matches, token, e_1, redisToken, tokenCheck, err_1;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (live_source_js_1.Live_source.liveAPP.indexOf("".concat((_c = req.get('g-app')) !== null && _c !== void 0 ? _c : req.query['g-app'])) === -1) {
                        return [2 /*return*/, response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_APP', 'invalid app'))];
                    }
                    //Check database scheme
                    return [4 /*yield*/, public_table_check_js_1.ApiPublic.createScheme((_d = req.get('g-app')) !== null && _d !== void 0 ? _d : req.query['g-app'])];
                case 1:
                    //Check database scheme
                    _g.sent();
                    refer_app = public_table_check_js_1.ApiPublic.checkedApp.find(function (dd) {
                        return dd.app_name === req.headers['g-app'];
                    });
                    req.headers['g-app'] = (refer_app && refer_app.refer_app) || ((_e = req.get('g-app')) !== null && _e !== void 0 ? _e : req.query['g-app']);
                    _a = req.headers;
                    _b = 'language';
                    return [4 /*yield*/, language_setting_js_1.LanguageSetting.getLanguage(req.headers['language'], req.headers['g-app'])];
                case 2:
                    _a[_b] = _g.sent();
                    logger = new logger_1.default();
                    TAG = '[DoAuthAction]';
                    url = req.baseUrl;
                    matches = underscore_1.default.where(whiteList, { url: url, method: req.method });
                    token = (_f = req.get('Authorization')) === null || _f === void 0 ? void 0 : _f.replace('Bearer ', '');
                    if (!(matches.length > 0)) return [3 /*break*/, 9];
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 6, , 7]);
                    req.body.token = jsonwebtoken_1.default.verify(token, config_1.config.SECRET_KEY);
                    if (!req.body.token) return [3 /*break*/, 5];
                    return [4 /*yield*/, checkBlockUser()];
                case 4:
                    if (_g.sent()) {
                        return [2 /*return*/, response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_TOKEN', 'this user has been block.'))];
                    }
                    _g.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_1 = _g.sent();
                    console.error('matchTokenError', e_1);
                    return [3 /*break*/, 7];
                case 7: return [4 /*yield*/, next()];
                case 8:
                    _g.sent();
                    return [2 /*return*/];
                case 9:
                    _g.trys.push([9, 16, , 17]);
                    req.body.token = jsonwebtoken_1.default.verify(token, config_1.config.SECRET_KEY);
                    if (!req.body.token) return [3 /*break*/, 11];
                    return [4 /*yield*/, checkBlockUser()];
                case 10:
                    if (_g.sent()) {
                        return [2 /*return*/, response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_TOKEN', 'this user has been block.'))];
                    }
                    _g.label = 11;
                case 11: return [4 /*yield*/, redis_1.default.getValue(token)];
                case 12:
                    redisToken = _g.sent();
                    if (!!redisToken) return [3 /*break*/, 14];
                    return [4 /*yield*/, database_1.default.query("select count(1)\n                 from `".concat(config_1.saasConfig.SAAS_NAME, "`.user\n                 where editor_token = ?"), [token])];
                case 13:
                    tokenCheck = _g.sent();
                    if (tokenCheck[0]['count(1)'] !== 1) {
                        logger.error(TAG, 'Token is not match in redis.');
                        return [2 /*return*/, response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_TOKEN', 'invalid token'))];
                    }
                    _g.label = 14;
                case 14: return [4 /*yield*/, next()];
                case 15:
                    _g.sent();
                    return [3 /*break*/, 17];
                case 16:
                    err_1 = _g.sent();
                    logger.error(TAG, "Unexpected exception occurred because ".concat(err_1, "."));
                    return [2 /*return*/, response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_TOKEN', 'invalid token'))];
                case 17: return [2 /*return*/];
            }
        });
    });
}
module.exports = router;

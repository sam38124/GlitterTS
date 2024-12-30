"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = __importDefault(require("../../modules/redis"));
const database_1 = __importDefault(require("../../modules/database"));
const config_1 = require("../../config");
const router = express_1.default.Router();
const logger_1 = __importDefault(require("../../modules/logger"));
const underscore_1 = __importDefault(require("underscore"));
const exception_1 = __importDefault(require("../../modules/exception"));
const userRouter = require("./user");
const postRouter = require("./post");
const messageRouter = require("./chat");
const invoiceRouter = require("./invoice");
const sql_apiRouter = require("./sql_api");
const lambda_apiRouter = require("./lambda");
const shop_apiRouter = require("./shop");
const manager_apiRouter = require("./manager");
const app_release = require("./app-release");
const smtp = require("./smtp");
const sms = require("./sms");
const line_message = require("./line-message");
const fb_message = require("./fb-message");
const fcm = require("./fcm");
const wallet = require("./wallet");
const article = require("./article");
const delivery = require("./delivery");
const rebate = require("./rebate");
const recommend = require("./recommend");
const stock = require("./stock");
const live_source_js_1 = require("../../live_source.js");
const public_table_check_js_1 = require("../services/public-table-check.js");
const monitor_js_1 = require("../services/monitor.js");
const language_setting_js_1 = require("../services/language-setting.js");
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
router.use(config_1.config.getRoute(config_1.config.public_route.graph_api, 'public'), require('./graph-api'));
router.use(config_1.config.getRoute(config_1.config.public_route.ai_chat, 'public'), require('./ai-chat'));
router.use(config_1.config.getRoute(config_1.config.public_route.ai_points, 'public'), require('./ai-points'));
router.use(config_1.config.getRoute(config_1.config.public_route.sms_points, 'public'), require('./sms-points'));
const whiteList = [
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
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/order', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/order/proof-purchase', 'public'), method: 'PUT' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/order/payment-method', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/redirect', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/apple-webhook', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/notify', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.ai_points + '/notify', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/payment/method', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/currency-covert', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ec + '/check-login-for-order', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.sms_points + '/notify', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.wallet + '/notify', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.manager + '/config', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.article, 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.article + '/manager', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.delivery + '/formView', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.delivery + '/c2cRedirect', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.delivery + '/c2cNotify', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.delivery + '/storeMaps', 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.graph_api, 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.graph_api, 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.graph_api, 'public'), method: 'PUT' },
    { url: config_1.config.getRoute(config_1.config.public_route.graph_api, 'public'), method: 'DELETE' },
    { url: config_1.config.getRoute(config_1.config.public_route.graph_api, 'public'), method: 'PATCH' },
    { url: config_1.config.getRoute(config_1.config.public_route.ai_chat + '/ask-order', 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.ai_chat + '/search-product', 'public'), method: 'POST' },
];
async function doAuthAction(req, resp, next_step) {
    var _a, _b, _c, _d;
    async function next() {
        await monitor_js_1.Monitor.insertHistory({ req: req, token: req.body.token, req_type: 'api' });
        next_step();
    }
    if (live_source_js_1.Live_source.liveAPP.indexOf(`${(_a = req.get('g-app')) !== null && _a !== void 0 ? _a : req.query['g-app']}`) === -1) {
        return response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_APP', 'invalid app'));
    }
    await public_table_check_js_1.ApiPublic.createScheme((_b = req.get('g-app')) !== null && _b !== void 0 ? _b : req.query['g-app']);
    const refer_app = public_table_check_js_1.ApiPublic.checkApp.find((dd) => {
        return dd.app_name === req.headers['g-app'];
    });
    req.headers['g-app'] = (refer_app && refer_app.refer_app) || ((_c = req.get('g-app')) !== null && _c !== void 0 ? _c : req.query['g-app']);
    req.headers['language'] = await language_setting_js_1.LanguageSetting.getLanguage(req.headers['language'], req.headers['g-app']);
    const logger = new logger_1.default();
    const TAG = '[DoAuthAction]';
    const url = req.baseUrl;
    const matches = underscore_1.default.where(whiteList, { url: url, method: req.method });
    const token = (_d = req.get('Authorization')) === null || _d === void 0 ? void 0 : _d.replace('Bearer ', '');
    async function checkBlockUser() {
        var _a, _b;
        if ((await database_1.default.query(`SELECT count(1)
                             FROM \`${(_a = req.get('g-app')) !== null && _a !== void 0 ? _a : req.query['g-app']}\`.t_user
                             where userID = ?
                               and status = 0`, [req.body.token.userID]))[0]['count(1)'] === 1) {
            await redis_1.default.deleteKey(token);
            return true;
        }
        await database_1.default.execute(`update \`${(_b = req.get('g-app')) !== null && _b !== void 0 ? _b : req.query['g-app']}\`.t_user
                          set online_time=NOW()
                          where userID = ?`, [req.body.token.userID || '-1']);
        return false;
    }
    if (matches.length > 0) {
        try {
            req.body.token = jsonwebtoken_1.default.verify(token, config_1.config.SECRET_KEY);
            if (req.body.token) {
                if (await checkBlockUser()) {
                    return response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_TOKEN', 'this user has been block.'));
                }
            }
        }
        catch (e) {
            console.error('matchTokenError', e);
        }
        await next();
        return;
    }
    try {
        req.body.token = jsonwebtoken_1.default.verify(token, config_1.config.SECRET_KEY);
        if (req.body.token) {
            if (await checkBlockUser()) {
                return response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_TOKEN', 'this user has been block.'));
            }
        }
        const redisToken = await redis_1.default.getValue(token);
        if (!redisToken) {
            const tokenCheck = await database_1.default.query(`select count(1)
                                               from \`${config_1.saasConfig.SAAS_NAME}\`.user
                                               where editor_token = ?`, [token]);
            if (tokenCheck[0]['count(1)'] !== 1) {
                logger.error(TAG, 'Token is not match in redis.');
                return response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_TOKEN', 'invalid token'));
            }
        }
        await next();
    }
    catch (err) {
        logger.error(TAG, `Unexpected exception occurred because ${err}.`);
        return response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_TOKEN', 'invalid token'));
    }
}
module.exports = router;
//# sourceMappingURL=index.js.map
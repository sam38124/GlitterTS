"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = __importDefault(require("../../modules/redis"));
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
const live_source_js_1 = require("../../live_source.js");
const public_table_check_js_1 = require("../services/public-table-check.js");
router.use('/api-public/*', doAuthAction);
router.use(config_1.config.getRoute(config_1.config.public_route.user, 'public'), userRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.post, 'public'), postRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.message, 'public'), messageRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.invoice, 'public'), invoiceRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.sql_api, 'public'), sql_apiRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.lambda, 'public'), lambda_apiRouter);
const whiteList = [
    { url: config_1.config.getRoute(config_1.config.public_route.user + "/register", 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + "/login", 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + "/forget", 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.post, 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + "/checkMail", 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + "/checkMail/updateAccount", 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + "/userdata", 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.sql_api, 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.sql_api, 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.lambda, 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.lambda, 'public'), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.public_route.lambda, 'public'), method: 'DELETE' },
    { url: config_1.config.getRoute(config_1.config.public_route.lambda, 'public'), method: 'PUT' },
];
async function doAuthAction(req, resp, next) {
    var _a, _b, _c;
    if (live_source_js_1.Live_source.liveAPP.indexOf(`${(_a = req.get('g-app')) !== null && _a !== void 0 ? _a : req.query['g-app']}`) === -1) {
        return response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_APP', 'invalid app'));
    }
    await public_table_check_js_1.ApiPublic.createScheme((_b = req.get('g-app')) !== null && _b !== void 0 ? _b : req.query['g-app']);
    const logger = new logger_1.default();
    const TAG = '[DoAuthAction]';
    const url = req.baseUrl;
    const matches = underscore_1.default.where(whiteList, { url: url, method: req.method });
    const token = (_c = req.get('Authorization')) === null || _c === void 0 ? void 0 : _c.replace('Bearer ', '');
    if (matches.length > 0) {
        try {
            req.body.token = jsonwebtoken_1.default.verify(token, config_1.config.SECRET_KEY);
        }
        catch (e) {
            console.log('matchTokenError', e);
        }
        next();
        return;
    }
    try {
        req.body.token = jsonwebtoken_1.default.verify(token, config_1.config.SECRET_KEY);
        const redisToken = await redis_1.default.getValue(token);
        if (!redisToken) {
            logger.error(TAG, 'Token is not match in redis.');
            return response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_TOKEN', 'invalid token'));
        }
        next();
    }
    catch (err) {
        logger.error(TAG, `Unexpected exception occurred because ${err}.`);
        return response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_TOKEN', 'invalid token'));
    }
}
module.exports = router;
//# sourceMappingURL=index.js.map
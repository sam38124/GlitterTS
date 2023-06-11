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
const live_source_js_1 = require("../../live_source.js");
const public_table_check_js_1 = require("../services/public-table-check.js");
router.use('/api-public/*', doAuthAction);
router.use(config_1.config.getRoute(config_1.config.public_route.user, 'public'), userRouter);
router.use(config_1.config.getRoute(config_1.config.public_route.post, 'public'), postRouter);
const whiteList = [
    { url: config_1.config.getRoute(config_1.config.public_route.user + "/register", 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.user + "/login", 'public'), method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.public_route.post, 'public'), method: 'GET' }
];
async function doAuthAction(req, resp, next) {
    var _a;
    if (live_source_js_1.Live_source.liveAPP.indexOf(`${req.get('g-app')}`) === -1) {
        return response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_APP', 'invalid app'));
    }
    await public_table_check_js_1.ApiPublic.createScheme(req.get('g-app'));
    const logger = new logger_1.default();
    const TAG = '[DoAuthAction]';
    const url = req.baseUrl;
    const matches = underscore_1.default.where(whiteList, { url: url, method: req.method });
    if (matches.length > 0) {
        next();
        return;
    }
    const token = (_a = req.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
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

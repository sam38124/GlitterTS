"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../modules/response"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = __importDefault(require("../modules/redis"));
const config_1 = require("../config");
const router = express_1.default.Router();
const logger_1 = __importDefault(require("../modules/logger"));
const underscore_1 = __importDefault(require("underscore"));
const exception_1 = __importDefault(require("../modules/exception"));
const userRouter = require("./user");
const privateConfig = require("./private_config");
const ai = require("./ai");
const template = require("./template");
const app = require("./app");
const filemanager = require("./filemanager");
router.use('/api/*', doAuthAction);
router.use(config_1.config.getRoute(config_1.config.route.user), userRouter);
router.use(config_1.config.getRoute(config_1.config.route.template), template);
router.use(config_1.config.getRoute(config_1.config.route.app), app);
router.use(config_1.config.getRoute(config_1.config.route.fileManager), filemanager);
router.use(config_1.config.getRoute(config_1.config.route.private), privateConfig);
router.use(config_1.config.getRoute(config_1.config.route.private), privateConfig);
router.use(config_1.config.getRoute(config_1.config.route.ai), ai);
const whiteList = [
    { url: config_1.config.getRoute(config_1.config.route.user) + "/login", method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.route.user) + "/register", method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.route.app) + "/plugin", method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.route.template), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.route.fileManager) + "/upload", method: 'POST' }
];
async function doAuthAction(req, resp, next) {
    var _a;
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
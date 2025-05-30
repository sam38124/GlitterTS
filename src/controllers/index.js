"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../modules/response"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = __importDefault(require("../modules/redis"));
const database_1 = __importDefault(require("../modules/database"));
const config_1 = require("../config");
const router = express_1.default.Router();
const logger_1 = __importDefault(require("../modules/logger"));
const underscore_1 = __importDefault(require("underscore"));
const exception_1 = __importDefault(require("../modules/exception"));
router.use('/api/*', doAuthAction);
router.use(config_1.config.getRoute(config_1.config.route.user), require('./user'));
router.use(config_1.config.getRoute(config_1.config.route.template), require('./template'));
router.use(config_1.config.getRoute(config_1.config.route.app), require('./app'));
router.use(config_1.config.getRoute(config_1.config.route.fileManager), require('./filemanager'));
router.use(config_1.config.getRoute(config_1.config.route.private), require('./private_config'));
router.use(config_1.config.getRoute(config_1.config.route.ai), require('./ai'));
router.use(config_1.config.getRoute(config_1.config.route.globalEvent), require('./global-event'));
router.use(config_1.config.getRoute(config_1.config.route.backendServer), require('./backend-server'));
router.use(config_1.config.getRoute(config_1.config.route.page), require('./page'));
const whiteList = [
    { url: config_1.config.getRoute(config_1.config.route.user) + "/login", method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.route.user) + "/register", method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.route.app) + "/plugin", method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.route.app) + "/version", method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.route.app) + "/template", method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.route.template), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.route.fileManager) + "/upload", method: 'POST' },
    { url: config_1.config.getRoute(config_1.config.route.app) + "/official/plugin", method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.route.globalEvent), method: 'GET' },
    { url: config_1.config.getRoute(config_1.config.route.page), method: 'GET' },
];
async function doAuthAction(req, resp, next) {
    var _a;
    const logger = new logger_1.default();
    const TAG = '[DoAuthAction]';
    const url = req.baseUrl;
    const matches = underscore_1.default.where(whiteList, { url: url, method: req.method });
    const token = (_a = req.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (matches.length > 0) {
        try {
            req.body.token = jsonwebtoken_1.default.verify(token, config_1.config.SECRET_KEY);
        }
        catch (e) { }
        next();
        return;
    }
    try {
        req.body.token = jsonwebtoken_1.default.verify(token, config_1.config.SECRET_KEY);
        const redisToken = await redis_1.default.getValue(token);
        if (!redisToken && process.env.editorToken !== req.body.token) {
            const tokenCheck = await database_1.default.query(`select count(1) from \`${config_1.saasConfig.SAAS_NAME}\`.t_user where userData->>'$.editor_token'=?`, [token]);
            if (tokenCheck[0]['count(1)'] !== 1) {
                logger.error(TAG, 'Token is not match in redis.');
                return response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_TOKEN', 'invalid token'));
            }
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
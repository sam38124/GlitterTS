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
var response_1 = require("../modules/response");
var jsonwebtoken_1 = require("jsonwebtoken");
var redis_1 = require("../modules/redis");
var database_1 = require("../modules/database");
var config_1 = require("../config");
var router = express_1.default.Router();
var logger_1 = require("../modules/logger");
var underscore_1 = require("underscore");
var exception_1 = require("../modules/exception");
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
/******************************/
var whiteList = [
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
function doAuthAction(req, resp, next) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, TAG, url, matches, token, redisToken, tokenCheck, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger = new logger_1.default();
                    TAG = '[DoAuthAction]';
                    url = req.baseUrl;
                    matches = underscore_1.default.where(whiteList, { url: url, method: req.method });
                    token = (_a = req.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
                    if (matches.length > 0) {
                        try {
                            req.body.token = jsonwebtoken_1.default.verify(token, config_1.config.SECRET_KEY);
                        }
                        catch (e) { }
                        next();
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    req.body.token = jsonwebtoken_1.default.verify(token, config_1.config.SECRET_KEY);
                    return [4 /*yield*/, redis_1.default.getValue(token)];
                case 2:
                    redisToken = _b.sent();
                    if (!(!redisToken && process.env.editorToken !== req.body.token)) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.default.query("select count(1) from `".concat(config_1.saasConfig.SAAS_NAME, "`.t_user where userData->>'$.editor_token'=?"), [token])];
                case 3:
                    tokenCheck = _b.sent();
                    if (tokenCheck[0]['count(1)'] !== 1) {
                        logger.error(TAG, 'Token is not match in redis.');
                        return [2 /*return*/, response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_TOKEN', 'invalid token'))];
                    }
                    _b.label = 4;
                case 4:
                    next();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    logger.error(TAG, "Unexpected exception occurred because ".concat(err_1, "."));
                    return [2 /*return*/, response_1.default.fail(resp, exception_1.default.PermissionError('INVALID_TOKEN', 'invalid token'))];
                case 6: return [2 /*return*/];
            }
        });
    });
}
module.exports = router;

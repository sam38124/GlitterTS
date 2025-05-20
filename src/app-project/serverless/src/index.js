"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const uuid_1 = require("uuid");
const hooks_1 = require("./modules/hooks");
const database_js_1 = __importDefault(require("./modules/database.js"));
const redis_js_1 = __importDefault(require("./modules/redis.js"));
const path_1 = __importDefault(require("path"));
const config_js_1 = require("./config.js");
const process = __importStar(require("process"));
const router = express_1.default.Router();
exports.app = (0, express_1.default)();
exports.app.options('/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,g-app');
    res.status(200).send();
});
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.raw());
exports.app.use(express_1.default.json({ limit: '50MB' }));
exports.app.use(createContext);
exports.app.use(body_parser_1.default.raw({ type: '*/*' }));
exports.app.use(router);
exports.app.use(require('./controllers/index'));
(async () => {
    config_js_1.ConfigSetting.setConfig(path_1.default.resolve(`./env/server.env`));
    const serverPort = parseInt(process.env.PORT, 10);
    await database_js_1.default.createPool();
    await redis_js_1.default.connect();
    await exports.app.listen(serverPort);
    console.log('[Init]', `Server is listening on port: ${serverPort}`);
    console.log('Starting up the server now.');
})();
function createContext(req, res, next) {
    const uuid = (0, uuid_1.v4)();
    const ip = req.ip;
    const requestInfo = { uuid: `${uuid}`, method: `${req.method}`, url: `${req.url}`, ip: `${ip}` };
    hooks_1.asyncHooks.getInstance().createRequestContext(requestInfo);
    next();
}
//# sourceMappingURL=index.js.map
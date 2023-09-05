"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_public = exports.set_backend_editor = exports.set_frontend = void 0;
const fs = __importStar(require("fs"));
const index_1 = require("./src/index");
const config_1 = require("./src/config");
const post_1 = require("./src/api-public/services/post");
const database_1 = __importDefault(require("./src/modules/database"));
const config_2 = __importDefault(require("./src/config"));
const interface_1 = require("./src/lambda/interface");
async function set_frontend(express, rout) {
    for (const dd of rout) {
        express.use(dd.rout, async (req, resp, next) => {
            let path = req.path;
            if (path === '/') {
                path = "/index.html";
            }
            if ((dd.path + path).indexOf('index.html') !== -1) {
                const seo = await dd.seoManager(req, resp);
                let fullPath = dd.path + "/index.html";
                const data = fs.readFileSync(fullPath, 'utf8');
                resp.header('Content-Type', 'text/html; charset=UTF-8');
                return resp.send(data.replace(data.substring(data.indexOf(`<head>`), data.indexOf(`</head>`)), seo));
            }
            else {
                return resp.sendFile(decodeURI((dd.path + path)));
            }
        });
    }
}
exports.set_frontend = set_frontend;
async function set_backend_editor(envPath, serverPort = 3090) {
    config_1.ConfigSetting.setConfig(envPath);
    await (0, index_1.initial)(serverPort);
    return index_1.app;
}
exports.set_backend_editor = set_backend_editor;
exports.api_public = {
    get db() {
        return database_1.default;
    },
    getAdConfig: (appName, key) => {
        return new Promise(async (resolve, reject) => {
            const data = await database_1.default.query(`select \`value\`
                                         from \`${config_2.default.DB_NAME}\`.private_config
                                         where app_name = '${appName}'
                                           and \`key\` = ${database_1.default.escape(key)}`, []);
            resolve((data[0]) ? data[0]['value'] : {});
        });
    },
    addPostObserver: (callback) => {
        post_1.Post.addPostObserver(callback);
    },
    lambda: interface_1.lambda
};
//# sourceMappingURL=index.js.map
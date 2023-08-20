'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.saasConfig = exports.ConfigSetting = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
class ConfigSetting {
    static setConfig(envPath) {
        ConfigSetting.config_path = envPath;
        dotenv_1.default.config({
            path: envPath,
        });
    }
}
exports.ConfigSetting = ConfigSetting;
ConfigSetting.config_path = "";
ConfigSetting.setConfig(ConfigSetting.config_path);
exports.saasConfig = {
    get SAAS_NAME() {
        return process.env.GLITTER_DB;
    },
    DEF_DEADLINE: 365
};
exports.config = {
    get domain() {
        return process.env.DOMAIN;
    },
    SECRET_KEY: 'dsklkmsadl',
    API_PREFIX: "/api/v1",
    API_PUBLIC_PREFIX: "/api-public/v1",
    PARAMS_NEED_ENCRYPT_IN_LOG: ['pwd', 'email'],
    PWD_SALT_ROUND: 5,
    LOG_PATH: path_1.default.resolve("../../log"),
    DB_CONN_LIMIT: 0,
    DB_QUEUE_LIMIT: 0,
    get DB_URL() {
        return process.env.DB_URL;
    },
    DB_PORT: 3306,
    get DB_USER() {
        return process.env.DB_USER;
    },
    get DB_PWD() {
        return process.env.DB_PWD;
    },
    get DB_NAME() {
        return process.env.GLITTER_DB;
    },
    get REDIS_URL() {
        return process.env.REDIS_URL;
    },
    get REDIS_PORT() {
        return process.env.REDIS_PORT;
    },
    get REDIS_PWD() {
        return process.env.REDIS_PWD;
    },
    get AWS_S3_NAME() {
        return process.env.AWS_S3_NAME;
    },
    get AWS_ACCESS_KEY() {
        return process.env.AWS_ACCESS_KEY;
    },
    get AWS_SecretAccessKey() {
        return process.env.AWS_SecretAccessKey;
    },
    get AWS_S3_PREFIX_DOMAIN_NAME() {
        return `https://${process.env.AWS_S3_NAME}.s3.amazonaws.com/`;
    },
    get SINGLE_TYPE() {
        return `${process.env.SINGLE_TYPE}` == "true";
    },
    getRoute: (r, type = 'normal') => {
        if (type === 'normal') {
            return exports.config.API_PREFIX + r;
        }
        else {
            return exports.config.API_PUBLIC_PREFIX + r;
        }
    },
    public_route: {
        user: '/user',
        invoice: '/invoice',
        sql_api: '/sql_api',
        post: '/post',
        message: '/message',
        smtp: '/smtp',
        lambda: '/lambda'
    },
    route: {
        user: "/user",
        template: "/template",
        app: "/app",
        fileManager: "/fileManager",
        private: "/private",
        ai: "/ai"
    }
};
exports.default = exports.config;
//# sourceMappingURL=config.js.map
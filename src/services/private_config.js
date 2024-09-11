"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Private_config = void 0;
const exception_js_1 = __importDefault(require("../modules/exception.js"));
const database_js_1 = __importDefault(require("../modules/database.js"));
const config_js_1 = require("../config.js");
const moment_js_1 = __importDefault(require("moment/moment.js"));
const post_1 = require("../api-public/services/post");
class Private_config {
    async setConfig(config) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception_js_1.default.BadRequestError('Forbidden', 'No Permission.', null);
        }
        try {
            if (config.key === 'sql_api_config_post') {
                post_1.Post.lambda_function[config.appName] = undefined;
            }
            await database_js_1.default.execute(`replace
            into \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config (app_name,\`key\`,\`value\`,updated_at)
            values (?,?,?,?)
            `, [config.appName, config.key, config.value, (0, moment_js_1.default)(new Date()).format('YYYY-MM-DD HH:mm:ss')]);
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async getConfig(config) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception_js_1.default.BadRequestError('Forbidden', 'No Permission.', null);
        }
        try {
            return await database_js_1.default.execute(`select * from \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config where app_name=${database_js_1.default.escape(config.appName)} and 
                                             \`key\`=${database_js_1.default.escape(config.key)}
            `, []);
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    static async getConfig(config) {
        try {
            return await database_js_1.default.execute(`select * from \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config where app_name=${database_js_1.default.escape(config.appName)} and 
                                             \`key\`=${database_js_1.default.escape(config.key)}
            `, []);
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async verifyPermission(appName) {
        const result = await database_js_1.default.query(`SELECT count(1) 
            FROM ${config_js_1.saasConfig.SAAS_NAME}.app_config
            WHERE 
                (user = ? and appName = ?)
                OR appName in (
                    (SELECT appName FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.app_auth_config
                    WHERE user = ? AND status = 1 AND invited = 1 AND appName = ?)
                );
            `, [this.token.userID, appName, this.token.userID, appName]);
        return result[0]['count(1)'] === 1;
    }
    constructor(token) {
        this.token = token;
    }
}
exports.Private_config = Private_config;
//# sourceMappingURL=private_config.js.map
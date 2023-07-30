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
class Private_config {
    constructor(token) {
        this.token = token;
    }
    async setConfig(config) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception_js_1.default.BadRequestError("Forbidden", "No Permission.", null);
        }
        try {
            await database_js_1.default.execute(`replace
            into \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config (app_name,\`key\`,\`value\`,updated_at)
            values (?,?,?,?)
            `, [
                config.appName,
                config.key,
                config.value,
                (0, moment_js_1.default)(new Date()).format('YYYY-MM-DD HH:mm:ss')
            ]);
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async getConfig(config) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception_js_1.default.BadRequestError("Forbidden", "No Permission.", null);
        }
        try {
            return await database_js_1.default.execute(`select * from \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config where app_name=${database_js_1.default.escape(config.appName)} and 
                                             \`key\`=${database_js_1.default.escape(config.key)}
            `, []);
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async verifyPermission(appName) {
        const count = await database_js_1.default.execute(`
            select count(1)
            from \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
            where (user = ${this.token.userID} and appName = ${database_js_1.default.escape(appName)})
        `, []);
        return count[0]["count(1)"] === 1;
    }
}
exports.Private_config = Private_config;
//# sourceMappingURL=private_config.js.map
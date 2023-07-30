"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const database_1 = __importDefault(require("../modules/database"));
const config_1 = require("../config");
const exception_1 = __importDefault(require("../modules/exception"));
class Template {
    constructor(token) {
        this.token = token;
    }
    async verifyPermission(appName) {
        const count = await database_1.default.execute(`
            select count(1)
            from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
            where (user = ${this.token.userID} and appName = ${database_1.default.escape(appName)})
        `, []);
        return count[0]["count(1)"] === 1;
    }
    async createPage(config) {
        var _a, _b;
        if (!(await this.verifyPermission(config.appName))) {
            throw exception_1.default.BadRequestError("Forbidden", "No Permission.", null);
        }
        if (config.copy) {
            const data = (await database_1.default.execute(`
                select \`${config_1.saasConfig.SAAS_NAME}\`.page_config.page_config,
                       \`${config_1.saasConfig.SAAS_NAME}\`.page_config.config 
                from  \`${config_1.saasConfig.SAAS_NAME}\`.page_config where tag=${database_1.default.escape(config.copy)} and appName = ${database_1.default.escape(config.appName)}
            `, []))[0];
            config.page_config = data['page_config'];
            config.config = data['config'];
        }
        try {
            await database_1.default.execute(`
                insert into \`${config_1.saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`, config,page_config)
                values (?, ?, ?, ?, ?, ?,?);
            `, [
                this.token.userID,
                config.appName,
                config.tag,
                config.group,
                config.name,
                (_a = config.config) !== null && _a !== void 0 ? _a : [],
                (_b = config.page_config) !== null && _b !== void 0 ? _b : {}
            ]);
            return true;
        }
        catch (e) {
            throw exception_1.default.BadRequestError("Forbidden", "This page already exists.", null);
        }
    }
    async updatePage(config) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception_1.default.BadRequestError("Forbidden", "No Permission.", null);
        }
        try {
            const params = {};
            config.appName && (params["appName"] = config.appName);
            config.tag && (params["tag"] = config.tag);
            config.group && (params["group"] = config.group);
            config.name && (params["name"] = config.name);
            config.config && (params["config"] = JSON.stringify(config.config));
            config.page_config && (params["page_config"] = JSON.stringify(config.page_config));
            let sql = `
                UPDATE \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                SET ?
                WHERE 1 = 1 
            `;
            if (config.id) {
                sql += ` and \`id\` = ${config.id} `;
            }
            else {
                sql += ` and \`tag\` = ${database_1.default.escape(config.tag)}`;
            }
            sql += `and appName = ${database_1.default.escape(config.appName)}`;
            await database_1.default.query(sql, [params]);
            return true;
        }
        catch (e) {
            throw exception_1.default.BadRequestError("Forbidden", "No permission." + e, null);
        }
    }
    async deletePage(config) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception_1.default.BadRequestError("Forbidden", "No Permission.", null);
        }
        try {
            const params = {};
            let sql = `
                delete from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                WHERE appName = ${database_1.default.escape(config.appName)} and id=${database_1.default.escape(config.id)}`;
            console.log(sql);
            await database_1.default.execute(sql, []);
            return true;
        }
        catch (e) {
            throw exception_1.default.BadRequestError("Forbidden", "No permission." + e, null);
        }
    }
    async getPage(config) {
        try {
            let sql = `select *
                       from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                       where 1 = 1
                         and appName = ${database_1.default.escape(config.appName)}`;
            if (config.tag) {
                sql += ` and tag=${database_1.default.escape(config.tag)}`;
            }
            return await database_1.default.query(sql, []);
        }
        catch (e) {
            throw exception_1.default.BadRequestError("Forbidden", "No permission." + e, null);
        }
    }
}
exports.Template = Template;
//# sourceMappingURL=template.js.map
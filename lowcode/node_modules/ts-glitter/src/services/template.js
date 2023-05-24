"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const database_1 = __importDefault(require("../modules/database"));
const config_1 = require("../config");
const exception_1 = __importDefault(require("../modules/exception"));
const index_1 = require("../index");
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
        if (!(await this.verifyPermission(config.appName))) {
            throw exception_1.default.BadRequestError("Forbidden", "No Permission.", null);
        }
        try {
            await database_1.default.execute(`
                insert into \`${config_1.saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`, config)
                values (?, ?, ?, ?, ?, ?);
            `, [
                this.token.userID,
                config.appName,
                config.tag,
                config.group,
                config.name,
                config.config
            ]);
            await (0, index_1.createAPP)(config);
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

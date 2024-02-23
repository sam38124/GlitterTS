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
        var _a, _b, _c;
        if (!(await this.verifyPermission(config.appName))) {
            throw exception_1.default.BadRequestError("Forbidden", "No Permission.", null);
        }
        if (config.copy) {
            const data = (await database_1.default.execute(`
                select \`${config_1.saasConfig.SAAS_NAME}\`.page_config.page_config,
                       \`${config_1.saasConfig.SAAS_NAME}\`.page_config.config,
                from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                where tag = ${database_1.default.escape(config.copy)}
                  and appName = ${database_1.default.escape(config.copyApp || config.appName)}
            `, []))[0];
            config.page_config = data['page_config'];
            config.config = data['config'];
        }
        try {
            await database_1.default.execute(`
                insert into \`${config_1.saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`, config, page_config,page_type)
                values (?, ?, ?, ?, ?, ?, ?,?);
            `, [
                this.token.userID,
                config.appName,
                config.tag,
                config.group,
                config.name,
                (_a = config.config) !== null && _a !== void 0 ? _a : [],
                (_b = config.page_config) !== null && _b !== void 0 ? _b : {},
                (_c = config.page_type) !== null && _c !== void 0 ? _c : 'page'
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
            config.page_type && (params["page_type"] = config.page_type);
            config.name && (params["name"] = config.name);
            config.config && (params["config"] = JSON.stringify(config.config));
            config.preview_image && (params['preview_image'] = config.preview_image);
            config.page_config && (params["page_config"] = JSON.stringify(config.page_config));
            config.favorite && (params['favorite'] = config.favorite);
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
            let sql = (config.id) ? `
                delete
                from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                WHERE appName = ${database_1.default.escape(config.appName)}
                  and id = ${database_1.default.escape(config.id)}` : `
                delete
                from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                WHERE appName = ${database_1.default.escape(config.appName)}
                  and tag = ${database_1.default.escape(config.tag)}`;
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
            let sql = `select ${(config.tag) ? `*` : `id,userID,tag,\`group\`,name,page_type,preview_image,appName`}
                       from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                       where ${(() => {
                var _a;
                let query = [`1 = 1`];
                (config.user_id) && query.push(`userID=${config.user_id}`);
                (config.appName) && query.push(`appName=${database_1.default.escape(config.appName)}`);
                (config.tag) && query.push(` tag in (${config.tag.split(',').map((dd) => {
                    return database_1.default.escape(dd);
                }).join(',')})`);
                (config.page_type) && query.push(`page_type=${database_1.default.escape(config.page_type)}`);
                (config.group) && query.push(`\`group\` in (${config.group.split(',').map((dd) => {
                    return database_1.default.escape(dd);
                }).join(',')})`);
                if (config.page_type === 'module') {
                    if (config.favorite && config.favorite === 'true') {
                        query.push(`favorite=1`);
                    }
                    if (config.me === 'true') {
                        query.push(`userID = ${this.token.userID}`);
                    }
                    else {
                        let officialAccount = ((_a = process.env.OFFICIAL_ACCOUNT) !== null && _a !== void 0 ? _a : '').split(',');
                        query.push(`userID in (${officialAccount.map((dd) => {
                            return `${database_1.default.escape(dd)}`;
                        }).join(',')})`);
                    }
                }
                return query.join(' and ');
            })()}`;
            if (config.type) {
                if (config.type === 'template') {
                    sql += ` and \`group\` != ${database_1.default.escape('glitter-article')}`;
                }
                else if (config.type === 'article') {
                    sql += ` and \`group\` = 'glitter-article' `;
                }
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
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const database_js_1 = __importDefault(require("../modules/database.js"));
const config_js_1 = require("../config.js");
const exception_js_1 = __importDefault(require("../modules/exception.js"));
const process_1 = __importDefault(require("process"));
const ut_database_js_1 = require("../api-public/utils/ut-database.js");
class Page {
    constructor(token) {
        this.token = token;
    }
    async verifyPermission(appName) {
        const count = await database_js_1.default.execute(`
            select count(1)
            from \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
            where (user = ${this.token.userID} and appName = ${database_js_1.default.escape(appName)})
        `, []);
        return count[0]["count(1)"] === 1;
    }
    async postTemplate(config) {
        var _a, _b, _c;
        try {
            if (!(await this.verifyPermission(config.appName))) {
                throw exception_js_1.default.BadRequestError("Forbidden", "No Permission.", null);
            }
            let template_type = '0';
            if (config.data.post_to === 'all') {
                let officialAccount = ((_a = process_1.default.env.OFFICIAL_ACCOUNT) !== null && _a !== void 0 ? _a : '').split(',');
                if (officialAccount.indexOf(`${this.token.userID}`) !== -1) {
                    template_type = '2';
                }
                else {
                    template_type = '1';
                }
            }
            else if (config.data.post_to === 'me') {
                template_type = '3';
            }
            else if (config.data.post_to === 'project') {
                template_type = '4';
            }
            const data = (await database_js_1.default.execute(`update \`${config_js_1.saasConfig.SAAS_NAME}\`.page_config
                                      set template_config = ?,
                                          template_type=${template_type}
                                      where appName = ${database_js_1.default.escape(config.appName)}
                                        and tag = ?
            `, [config.data, config.tag]));
            const id = (await database_js_1.default.query(`select * from \`${config_js_1.saasConfig.SAAS_NAME}\`.page_config where appName = ${database_js_1.default.escape(config.appName)}
                                                                                             and tag = ?`, [config.tag]))[0]['id'];
            await database_js_1.default.execute(`delete from  \`${config_js_1.saasConfig.SAAS_NAME}\`.t_template_tag where type=? and bind=?`, [
                'page', id
            ]);
            for (const b of ((_b = config.data.tag) !== null && _b !== void 0 ? _b : [])) {
                await database_js_1.default.query(`insert into \`${config_js_1.saasConfig.SAAS_NAME}\`.t_template_tag set ?`, [
                    {
                        type: 'page',
                        tag: b,
                        bind: id
                    }
                ]);
            }
            return data['changedRows'] == true;
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError((_c = e.code) !== null && _c !== void 0 ? _c : 'BAD_REQUEST', e, null);
        }
    }
    async getTemplate(query) {
        var _a;
        try {
            const sql = [];
            query.template_from === 'me' && sql.push(`userID = '${this.token.userID}'`);
            query.template_from === 'me' && sql.push(`template_type in (3,2)`);
            query.template_from === 'project' && sql.push(`template_type = 4`);
            query.template_from === 'all' && sql.push(`template_type = 2`);
            query.type && sql.push(`page_type = ${database_js_1.default.escape(query.type)}`);
            query.tag && sql.push(`id in (SELECT bind FROM  \`${config_js_1.saasConfig.SAAS_NAME}\`.t_template_tag where type='page' and tag in (${query.tag.split(',').map((dd) => {
                return database_js_1.default.escape(dd);
            }).join(',')}))`);
            query.search && sql.push(`JSON_EXTRACT(template_config, '$.name') like '%${query.search}%' or id in (SELECT bind FROM  \`${config_js_1.saasConfig.SAAS_NAME}\`.t_template_tag where type='page' and tag like '%${query.search}%')`);
            return await new ut_database_js_1.UtDatabase(config_js_1.saasConfig.SAAS_NAME, `page_config`).querySql(sql, query, `
            id,userID,tag,\`group\`,name, page_type, preview_image,appName,template_type,template_config
            `);
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async getTagList(type, template_from) {
        var _a;
        try {
            const tagList = await database_js_1.default.query(`SELECT tag FROM  \`${config_js_1.saasConfig.SAAS_NAME}\`.t_template_tag where type='page' and bind in (
    select id from \`${config_js_1.saasConfig.SAAS_NAME}\`.page_config where page_type=${database_js_1.default.escape(type)} and ${(() => {
                const sql = [];
                template_from === 'me' && sql.push(`userID = '${this.token.userID}'`);
                template_from === 'me' && sql.push(`template_type in (3,2)`);
                template_from === 'all' && sql.push(`template_type = 2`);
                return sql.map((dd) => {
                    return ` (${dd}) `;
                }).join(` & `);
            })()}
                ) group by tag;`, []);
            return {
                result: tagList
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
}
exports.Page = Page;
//# sourceMappingURL=page.js.map
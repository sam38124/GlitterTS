"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const database_1 = __importDefault(require("../modules/database"));
const config_1 = require("../config");
const exception_1 = __importDefault(require("../modules/exception"));
const process_1 = __importDefault(require("process"));
const ut_database_js_1 = require("../api-public/utils/ut-database.js");
const user_js_1 = require("../api-public/services/user.js");
class Template {
    constructor(token) {
        this.token = token;
    }
    async createPage(config) {
        var _a, _b, _c;
        if (config.copy) {
            const data = (await database_1.default.execute(`
            select \`${config_1.saasConfig.SAAS_NAME}\`.page_config.page_config,
                   \`${config_1.saasConfig.SAAS_NAME}\`.page_config.config
            from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
            where tag = ${database_1.default.escape(config.copy)}
              and appName = ${database_1.default.escape(config.copyApp || config.appName)}
          `, []))[0];
            config.page_config = data['page_config'];
            config.config = data['config'];
        }
        try {
            await database_1.default.execute(`
                ${config.replace ? `replace` : 'insert'} into \`${config_1.saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`, config,
                                                                     page_config, page_type)
                values (?, ?, ?, ?, ?, ?, ?, ?);
            `, [
                this.token.userID,
                config.appName,
                config.tag,
                config.group,
                config.name,
                (_a = config.config) !== null && _a !== void 0 ? _a : [],
                (_b = config.page_config) !== null && _b !== void 0 ? _b : {},
                (_c = config.page_type) !== null && _c !== void 0 ? _c : 'page',
            ]);
            return true;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('Forbidden', 'This page already exists.', null);
        }
    }
    async updatePage(config) {
        const page_db = (() => {
            switch (config.language) {
                case 'zh-TW':
                    return 'page_config';
                case 'en-US':
                    return 'page_config_en';
                case 'zh-CN':
                    return 'page_config_rcn';
                default:
                    return 'page_config';
            }
        })();
        async function checkExits() {
            const where_ = (() => {
                let sql = '';
                if (config.id) {
                    sql += ` and \`id\` = ${config.id} `;
                }
                else {
                    sql += ` and \`tag\` = ${database_1.default.escape(config.tag)}`;
                }
                sql += ` and appName = ${database_1.default.escape(config.appName)}`;
                return sql;
            })();
            let sql = `
        select count(1)
        from \`${config_1.saasConfig.SAAS_NAME}\`.${page_db}
        where 1 = 1 ${where_}
      `;
            const count = await database_1.default.query(sql, []);
            if (count[0]['count(1)'] === 0) {
                await database_1.default.query(`INSERT INTO \`${config_1.saasConfig.SAAS_NAME}\`.${page_db}
           SELECT *
           FROM \`${config_1.saasConfig.SAAS_NAME}\`.page_config
           where 1 = 1 ${where_};
          `, []);
            }
        }
        await checkExits();
        try {
            const params = {};
            config.appName && (params['appName'] = config.appName);
            config.tag && (params['tag'] = config.tag);
            config.group && (params['group'] = config.group);
            config.page_type && (params['page_type'] = config.page_type);
            config.name && (params['name'] = config.name);
            config.config && (params['config'] = JSON.stringify(config.config));
            config.preview_image && (params['preview_image'] = config.preview_image);
            config.page_config && (params['page_config'] = JSON.stringify(config.page_config));
            config.favorite && (params['favorite'] = config.favorite);
            config.updated_time = new Date();
            let sql = `
        UPDATE \`${config_1.saasConfig.SAAS_NAME}\`.${page_db}
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
            throw exception_1.default.BadRequestError('Forbidden', 'No permission.' + e, null);
        }
    }
    async deletePage(config) {
        try {
            for (const b of ['page_config', 'page_config_rcn', 'page_config_en']) {
                let sql = config.id
                    ? `
<<<<<<< HEAD
            delete
            from \`${config_1.saasConfig.SAAS_NAME}\`.${b}
            WHERE appName = ${database_1.default.escape(config.appName)}
              and id = ${database_1.default.escape(config.id)}`
                    : `
            delete
            from \`${config_1.saasConfig.SAAS_NAME}\`.${b}
            WHERE appName = ${database_1.default.escape(config.appName)}
              and tag = ${database_1.default.escape(config.tag)}`;
=======
              delete
              from \`${config_1.saasConfig.SAAS_NAME}\`.${b}
              WHERE appName = ${database_1.default.escape(config.appName)}
                and id = ${database_1.default.escape(config.id)}`
                    : `
              delete
              from \`${config_1.saasConfig.SAAS_NAME}\`.${b}
              WHERE appName = ${database_1.default.escape(config.appName)}
                and tag = ${database_1.default.escape(config.tag)}`;
>>>>>>> 996de538 (feat: add receive info & ui)
                await database_1.default.execute(sql, []);
            }
            return true;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('Forbidden', 'No permission.' + e, null);
        }
    }
    async getTemplate(query) {
        var _a;
        try {
            const sql = [];
            query.template_from === 'me' && sql.push(`user = '${this.token.userID}'`);
            query.template_from === 'me' && sql.push(`template_type in (3,2)`);
            query.template_from === 'all' && sql.push(`template_type = 2`);
            const data = await new ut_database_js_1.UtDatabase(config_1.saasConfig.SAAS_NAME, `page_config`).querySql(sql, query, `id,userID,tag,\`group\`,name, page_type,  preview_image,appName,template_type,template_config`);
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async postTemplate(config) {
        var _a, _b;
        try {
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
            return ((await database_1.default.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.page_config
             set template_config = ?,
                 template_type=${template_type}
             where appName = ${database_1.default.escape(config.appName)}
               and tag = ?
            `, [config.data, config.tag]))['changedRows'] == true);
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_b = e.code) !== null && _b !== void 0 ? _b : 'BAD_REQUEST', e, null);
        }
    }
    static async getRealPage(query_page, appName, req) {
        query_page = query_page || 'index';
        let page = query_page;
        if (query_page.includes('#')) {
            query_page = query_page.substring(0, query_page.indexOf('#'));
        }
        if ([
            'privacy',
            'term',
            'refund',
            'delivery',
            'blogs',
            'blog_tag_setting',
            'blog_global_setting',
            'pos_setting',
            'checkout',
            'fb_live',
            'ig_live',
            'line_plus',
            'shipment_list',
            'shipment_list_archive',
            'reconciliation_area',
            'app-design',
            'auto_fcm_push',
            'auto_fcm_advertise',
            'auto_fcm_history',
            'auto_fcm_template',
            'notify_message_list',
        ].includes(query_page)) {
            return 'official-router';
        }
        if (appName === 'proshake_v2') {
            return query_page;
        }
        console.log(`query_page`, query_page);
        if (page === 'index-app') {
            const count = await database_1.default.query(`select count(1)
         from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
         where appName = ${database_1.default.escape(appName)}
           and tag = 'index-app'`, []);
            if (count[0]['count(1)'] === 0) {
                const copyPageData = await database_1.default.execute(`select *
           from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
           where appName = ${database_1.default.escape(appName)}
             and tag = 'index'`, []);
                for (const dd of copyPageData) {
                    await database_1.default.execute(`
              insert into \`${config_1.saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`,
                                                                   \`name\`,
                                                                   \`config\`, \`page_config\`, page_type)
              values (?, ?, ?, ?, ?, ${database_1.default.escape(JSON.stringify(dd.config))},
                      ${database_1.default.escape(JSON.stringify(dd.page_config))}, ${database_1.default.escape(dd.page_type)});
            `, [dd.userID, appName, 'index-app', dd.group || '未分類', 'APP首頁樣式']);
                }
            }
        }
        if ([
            'account_userinfo',
            'voucher-list',
            'rebate',
            'order_list',
            'wishlist',
            'recipient_info',
            'account_edit',
        ].includes(query_page) &&
            appName !== 'cms_system') {
            return 'official-router';
        }
        if (['blogs', 'pages', 'shop', 'hidden'].includes(query_page.split('/')[0]) && query_page.split('/')[1]) {
            return `page-show-router`;
        }
        if (query_page.split('/')[0] === 'distribution' && query_page.split('/')[1]) {
            try {
                const page = (await database_1.default.query(`SELECT *
             from \`${appName}\`.t_recommend_links
             where content ->>'$.link'=?`, [query_page.split('/')[1]]))[0].content;
                if (page.redirect.startsWith('/products')) {
                    return 'official-router';
                }
                else {
                    return await Template.getRealPage(page.redirect.substring(1), appName, req);
                }
            }
            catch (error) {
                console.error(`distribution 路徑錯誤 code: ${query_page.split('/')[1]}`);
                page = '';
            }
        }
        if (query_page.split('/')[0] === 'collections' && query_page.split('/')[1]) {
            page = 'all-product';
        }
        if (query_page.split('/')[0] === 'products' && query_page.split('/')[1]) {
            if (appName === '3131_shop') {
                page = 'products';
            }
            else {
                page = 'official-router';
            }
        }
        if (query_page === 'cms') {
            page = 'index';
        }
        if (query_page === 'voucher-list') {
            page = 'rebate';
        }
        if (query_page === 'shopnex-line-oauth') {
            page = 'official-router';
        }
        return page;
    }
    async getPage(config) {
        if (config.tag) {
            config.tag = await Template.getRealPage(config.tag, config.appName, config.req);
            if (config.tag === 'official-router') {
                config.appName = 'cms_system';
            }
            else if (config.tag === 'all-product') {
                config.tag = 'official-router';
                config.appName = 'cms_system';
            }
            else if (config.tag === 'page-show-router') {
                config.appName = 'cms_system';
            }
        }
        try {
            const page_db = (() => {
                switch (config.language) {
                    case 'zh-TW':
                        return 'page_config';
                    case 'en-US':
                        return 'page_config_en';
                    case 'zh-CN':
                        return 'page_config_rcn';
                    default:
                        return 'page_config';
                }
            })();
            let sql = `select ${config.tag || config.id ? `*` : `id,userID,tag,\`group\`,name,page_type,preview_image,appName,page_config`}
                 from \`${config_1.saasConfig.SAAS_NAME}\`.${page_db}
                 where ${(() => {
                let query = [`1 = 1`];
                config.user_id && query.push(`userID=${config.user_id}`);
                config.appName && query.push(`appName=${database_1.default.escape(config.appName)}`);
                config.id && query.push(`id=${database_1.default.escape(config.id)}`);
                config.tag &&
                    query.push(` tag in (${config.tag
                        .split(',')
                        .map(dd => {
                        return database_1.default.escape(dd);
                    })
                        .join(',')})`);
                config.page_type && query.push(`page_type=${database_1.default.escape(config.page_type)}`);
                config.group &&
                    query.push(`\`group\` in (${config.group
                        .split(',')
                        .map(dd => {
                        return database_1.default.escape(dd);
                    })
                        .join(',')})`);
                if (config.favorite && config.favorite === 'true') {
                    query.push(`favorite=1`);
                }
                if (config.me === 'true') {
                    query.push(`userID = ${this.token.userID}`);
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
            const page_data = await database_1.default.query(sql, []);
            const response_ = await new Promise(async (resolve, reject) => {
                if (page_db !== 'page_config' && page_data.length === 0 && config.language != 'zh-TW') {
                    config.language = 'zh-TW';
                    resolve(await this.getPage(config));
                }
                else {
                    resolve(page_data);
                }
            });
            if (config.req.query.page_refer) {
                for (const b of response_) {
                    if (b.tag === 'c_header') {
                        const c_config = (await new user_js_1.User(b.appName).getConfigV2({
                            key: 'c_header_' + config.req.query.page_refer,
                            user_id: 'manager'
                        }));
                        if (c_config && c_config[0]) {
                            console.log(`c_config[0]==>`, c_config[0]);
                            b.config = c_config;
                        }
                    }
                }
            }
            return response_;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('Forbidden', 'No permission.' + e, null);
        }
    }
}
exports.Template = Template;
//# sourceMappingURL=template.js.map
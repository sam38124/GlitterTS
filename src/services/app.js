"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const database_1 = __importDefault(require("../modules/database"));
const exception_1 = __importDefault(require("../modules/exception"));
const config_1 = require("../config");
const index_js_1 = require("../index.js");
class App {
    constructor(token) {
        this.token = token;
    }
    async createApp(config) {
        var _a;
        try {
            const count = await database_1.default.execute(`
                select count(1)
                from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                where appName = ${database_1.default.escape(config.appName)} || \`domain\` = ${database_1.default.escape(config.domain)}
            `, []);
            if (count[0]["count(1)"] === 1) {
                throw exception_1.default.BadRequestError('Forbidden', 'This app already be used.', null);
            }
            let copyAppData = undefined;
            let copyPageData = undefined;
            if (config.copyApp) {
                copyAppData = (await database_1.default.execute(`select *
                                                 from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                                 where appName = ${database_1.default.escape(config.copyApp)}`, []))[0];
                copyPageData = (await database_1.default.execute(`select *
                                                  from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                                                  where appName = ${database_1.default.escape(config.copyApp)}`, []));
            }
            const trans = await database_1.default.Transaction.build();
            await trans.execute(`insert into \`${config_1.saasConfig.SAAS_NAME}\`.app_config (domain, user, appName, dead_line, \`config\`)
                                 values (?, ?, ?, ?,
                                         ${database_1.default.escape(JSON.stringify((copyAppData && copyAppData.config) || {}))})`, [
                config.domain,
                this.token.userID,
                config.appName,
                addDays(new Date(), config_1.saasConfig.DEF_DEADLINE)
            ]);
            if (copyPageData) {
                for (const dd of copyPageData) {
                    await trans.execute(`
                        insert into \`${config_1.saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`,
                                                                             \`config\`, \`page_config\`)
                        values (?, ?, ?, ?, ?, ${database_1.default.escape(JSON.stringify(dd.config))},
                                ${database_1.default.escape(JSON.stringify(dd.page_config))});
                    `, [
                        this.token.userID,
                        config.appName,
                        dd.tag,
                        dd.group || '未分類',
                        dd.name
                    ]);
                }
            }
            else {
                await trans.execute(`
                    insert into \`${config_1.saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`,
                                                                         \`config\`, \`page_config\`)
                    values (?, ?, ?, ?, ?, ${database_1.default.escape(JSON.stringify({}))}, ${database_1.default.escape(JSON.stringify({}))});
                `, [
                    this.token.userID,
                    config.appName,
                    'index',
                    '',
                    '首頁',
                ]);
            }
            await trans.commit();
            await (0, index_js_1.createAPP)(config);
            return true;
        }
        catch (e) {
            console.log(JSON.stringify(e));
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async getAPP() {
        var _a;
        try {
            return (await database_1.default.execute(`
                SELECT *
                FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                where user = '${this.token.userID}';
            `, []));
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async getAppConfig(config) {
        var _a, _b, _c, _d;
        try {
            const pluginList = (_a = ((await database_1.default.execute(`
                SELECT config
                FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                where appName = '${config.appName}';
            `, []))[0]['config'])) !== null && _a !== void 0 ? _a : {};
            pluginList.pagePlugin = (_b = pluginList.pagePlugin) !== null && _b !== void 0 ? _b : [];
            pluginList.eventPlugin = (_c = pluginList.eventPlugin) !== null && _c !== void 0 ? _c : [];
            return pluginList;
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_d = e.code) !== null && _d !== void 0 ? _d : 'BAD_REQUEST', e, null);
        }
    }
    async setAppConfig(config) {
        var _a;
        try {
            return (await database_1.default.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                      set config=?
                                      where appName = ${database_1.default.escape(config.appName)}
                                        and user = '${this.token.userID}'
            `, [config.data]))['changedRows'] == true;
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async deleteAPP(config) {
        var _a;
        try {
            (await database_1.default.execute(`delete
                               from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                               where appName = ${database_1.default.escape(config.appName)}
                                 and user = '${this.token.userID}'`, []));
            (await database_1.default.execute(`delete
                               from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                               where appName = ${database_1.default.escape(config.appName)}
                                 and userID = '${this.token.userID}'`, []));
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
}
exports.App = App;
function addDays(dat, addDays) {
    var date = new Date(dat);
    date.setDate(date.getDate() + addDays);
    return date;
}
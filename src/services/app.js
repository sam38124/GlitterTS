"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const database_1 = __importDefault(require("../modules/database"));
const exception_1 = __importDefault(require("../modules/exception"));
const config_1 = require("../config");
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
                where (user=${this.token.userID} and appName=${database_1.default.escape(config.appName)}) || (\`domain\`=${database_1.default.escape(config.domain)})
            `, []);
            if (count[0]["count(1)"] === 1) {
                throw exception_1.default.BadRequestError('Forbidden', 'This app already be used.', null);
            }
            await database_1.default.execute(`insert into \`${config_1.saasConfig.SAAS_NAME}\`.app_config (domain, user, appName, dead_line)
                              values (?, ?, ?, ?)`, [
                config.domain,
                this.token.userID,
                config.appName,
                addDays(new Date(), config_1.saasConfig.DEF_DEADLINE)
            ]);
            return true;
        }
        catch (e) {
            console.log(JSON.stringify(e));
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async getAppConfig(config) {
        var _a, _b, _c, _d;
        try {
            const pluginList = (_a = ((await database_1.default.execute(`
                SELECT config FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config where appName='${config.appName}'; 
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
            return (await database_1.default.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.app_config set config=? where appName=${database_1.default.escape(config.appName)}
and user='${this.token.userID}'
`, [config.data]))['changedRows'] == true;
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seo = void 0;
const database_js_1 = __importDefault(require("../modules/database.js"));
const config_js_1 = require("../config.js");
class Seo {
    static async getPageInfo(appName, page) {
        return (await database_js_1.default.execute(`SELECT page_config, \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config.\`config\`, tag,page_type,tag
                                                  FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.page_config,
                                                       \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
                                                  where \`${config_js_1.saasConfig.SAAS_NAME}\`.page_config.appName = ${database_js_1.default.escape(appName)}
                                                    and tag = ${database_js_1.default.escape(page)}
                                                    and \`${config_js_1.saasConfig.SAAS_NAME}\`.page_config.appName = \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config.appName;
                    `, []))[0];
    }
    static async getAppConfig(appName) {
        return (await database_js_1.default.execute(`SELECT \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config.\`config\`
                                                          FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
                                                          where \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config.appName = ${database_js_1.default.escape(appName)} limit 0,1
                        `, []))[0]['config'];
    }
    static async redirectToHomePage(appName, req) {
        let redirect = '';
        const config = await Seo.getAppConfig(appName);
        if (config && ((await database_js_1.default.execute(`SELECT count(1)
                                                          FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.page_config
                                                          where \`${config_js_1.saasConfig.SAAS_NAME}\`.page_config.appName = ${database_js_1.default.escape(appName)}
                                                            and tag = ${database_js_1.default.escape(config['homePage'])}
                        `, []))[0]["count(1)"] === 1)) {
            redirect = config['homePage'];
        }
        else {
            redirect = (await database_js_1.default.execute(`SELECT tag
                                                          FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.page_config
                                                          where \`${config_js_1.saasConfig.SAAS_NAME}\`.page_config.appName = ${database_js_1.default.escape(appName)} limit 0,1
                            `, []))[0]['tag'];
        }
        let data = await Seo.getPageInfo(appName, redirect);
        if (req.query.type) {
            redirect += `&type=${req.query.type}`;
        }
        if (req.query.appName) {
            redirect += `&appName=${req.query.appName}`;
        }
        return `
${(() => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            data.page_config = (_a = data.page_config) !== null && _a !== void 0 ? _a : {};
            const d = (_b = data.page_config.seo) !== null && _b !== void 0 ? _b : {};
            return `<title>${(_c = d.title) !== null && _c !== void 0 ? _c : "尚未設定標題"}</title>
    <link rel="canonical" href="./?page=${data.tag}">
    <meta name="keywords" content="${(_d = d.keywords) !== null && _d !== void 0 ? _d : "尚未設定關鍵字"}" />
    <link id="appImage" rel="shortcut icon" href="${(_e = d.logo) !== null && _e !== void 0 ? _e : ""}" type="image/x-icon">
    <link rel="icon" href="${(_f = d.logo) !== null && _f !== void 0 ? _f : ""}" type="image/png" sizes="128x128">
    <meta property="og:image" content="${(_g = d.image) !== null && _g !== void 0 ? _g : ""}">
    <meta property="og:title" content="${((_h = d.title) !== null && _h !== void 0 ? _h : "").replace(/\n/g, '')}">
    <meta name="description" content="${((_j = d.content) !== null && _j !== void 0 ? _j : "").replace(/\n/g, '')}">
    <meta name="og:description" content="${((_k = d.content) !== null && _k !== void 0 ? _k : "").replace(/\n/g, '')}">
     ${(_l = d.code) !== null && _l !== void 0 ? _l : ''}
`;
        })()}
<script>
window.location.href='?page=${redirect}';
</script>`;
    }
}
exports.Seo = Seo;
//# sourceMappingURL=seo.js.map
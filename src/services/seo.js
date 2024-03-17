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
        if (req.query.type) {
            redirect += `&type=${req.query.type}`;
        }
        if (req.query.appName) {
            redirect += `&appName=${req.query.appName}`;
        }
        return `<script>
window.location.href='?page=${redirect}';
</script>`;
    }
}
exports.Seo = Seo;
//# sourceMappingURL=seo.js.map
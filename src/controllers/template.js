"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../modules/response"));
const database_1 = __importDefault(require("../modules/database"));
const config_1 = require("../config");
const template_1 = require("../services/template");
const app_js_1 = require("../services/app.js");
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        return response_1.default.succ(resp, { result: (await (new template_1.Template(req.body.token).createPage(req.body))) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/', async (req, resp) => {
    try {
        req.body.language = req.headers['language'];
        return response_1.default.succ(resp, { result: (await (new template_1.Template(req.body.token).updatePage(req.body))) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/', async (req, resp) => {
    try {
        req.body.language = req.headers['language'];
        return response_1.default.succ(resp, { result: (await (new template_1.Template(req.body.token).deletePage(req.body))) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/', async (req, resp) => {
    try {
        let language = req.headers['language'];
        req.query.language = language;
        const result = (await (new template_1.Template(req.body.token).getPage(req.query)));
        let redirect = '';
        if (result.length === 0) {
            try {
                const config = (await database_1.default.execute(`SELECT \`${config_1.saasConfig.SAAS_NAME}\`.app_config.\`config\`
                                                  FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                                  where \`${config_1.saasConfig.SAAS_NAME}\`.app_config.appName = ${database_1.default.escape(req.query.appName)}
                `, []))[0]['config'];
                if (config && ((await database_1.default.execute(`SELECT count(1)
                                                  FROM \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                                                  where \`${config_1.saasConfig.SAAS_NAME}\`.page_config.appName = ${database_1.default.escape(req.query.appName)}
                                                    and tag = ${database_1.default.escape(config['homePage'])}
                `, []))[0]["count(1)"] === 1)) {
                    redirect = config['homePage'];
                }
                else {
                    redirect = (await database_1.default.execute(`SELECT tag
                                                  FROM \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                                                  where \`${config_1.saasConfig.SAAS_NAME}\`.page_config.appName = ${database_1.default.escape(req.query.appName)} limit 0,1
                    `, []))[0]['tag'];
                }
            }
            catch (e) {
            }
        }
        let preload_data = {};
        if (req.query.preload) {
            preload_data = await app_js_1.App.preloadPageData(req.query.appName, req.query.tag, language);
        }
        return response_1.default.succ(resp, {
            result: result,
            redirect: redirect,
            preload_data: preload_data
        });
    }
    catch (err) {
        console.log(err);
        return response_1.default.fail(resp, err);
    }
});
router.post('/create_template', async (req, resp) => {
    try {
        return response_1.default.succ(resp, {
            result: (await new template_1.Template(req.body.token).postTemplate({
                appName: req.body.appName,
                data: req.body.config,
                tag: req.body.tag
            }))
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=template.js.map
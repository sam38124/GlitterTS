"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../modules/response"));
const database_1 = __importDefault(require("../modules/database"));
const config_1 = require("../config");
const template_1 = require("../services/template");
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
        return response_1.default.succ(resp, { result: (await (new template_1.Template(req.body.token).updatePage(req.body))) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/', async (req, resp) => {
    try {
        return response_1.default.succ(resp, { result: (await (new template_1.Template(req.body.token).deletePage(req.body))) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/', async (req, resp) => {
    var _a;
    try {
        const result = (await (new template_1.Template(req.body.token).getPage({
            appName: req.query.appName,
            tag: ((_a = req.query.tag) !== null && _a !== void 0 ? _a : undefined)
        })));
        let redirect = '';
        if (result.length === 0) {
            const config = (await database_1.default.execute(`SELECT \`${config_1.saasConfig.SAAS_NAME}\`.app_config.\`config\`
                                              FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                              where \`${config_1.saasConfig.SAAS_NAME}\`.app_config.appName = ${database_1.default.escape(req.query.appName)}
`, []))[0]['config'];
            if (config && ((await database_1.default.execute(`SELECT count(1)
                                              FROM \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                                              where \`${config_1.saasConfig.SAAS_NAME}\`.page_config.appName = ${database_1.default.escape(req.query.appName)} and tag=${database_1.default.escape(config['homePage'])}
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
        return response_1.default.succ(resp, {
            result: result,
            redirect: redirect
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=template.js.map
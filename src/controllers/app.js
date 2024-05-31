"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../modules/response"));
const app_1 = require("../services/app");
const ut_permission_js_1 = require("../api-public/utils/ut-permission.js");
const exception_js_1 = __importDefault(require("../modules/exception.js"));
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        const app = new app_1.App(req.body.token);
        return response_1.default.succ(resp, { result: await app.createApp(req.body) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/theme', async (req, resp) => {
    try {
        const app = new app_1.App(req.body.token);
        return response_1.default.succ(resp, { result: await app.changeTheme(req.body) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/theme_config', async (req, resp) => {
    try {
        const app = new app_1.App(req.body.token);
        return response_1.default.succ(resp, { result: await app.updateThemeConfig(req.body) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/', async (req, resp) => {
    try {
        const app = new app_1.App(req.body.token);
        return response_1.default.succ(resp, { result: await app.getAPP({
                app_name: req.query.appName,
                theme: req.query.theme
            }) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/template', async (req, resp) => {
    try {
        const app = new app_1.App(req.body.token);
        return response_1.default.succ(resp, { result: await app.getTemplate(req.query) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/', async (req, resp) => {
    try {
        const app = new app_1.App(req.body.token);
        await app.deleteAPP({
            appName: req.body.appName
        });
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/plugin', async (req, resp) => {
    try {
        const app = new app_1.App(req.body.token);
        return response_1.default.succ(resp, { data: (await app.getAppConfig(req.query)) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/plugin', async (req, resp) => {
    try {
        const app = new app_1.App(req.body.token);
        const appName = req.body.appName;
        return response_1.default.succ(resp, { result: (await app.setAppConfig({
                appName: req.body.appName,
                data: req.body.config
            })) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/official/plugin', async (req, resp) => {
    try {
        const app = new app_1.App(req.body.token);
        return response_1.default.succ(resp, {
            data: (await app.getOfficialPlugin()),
            result: true
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/domain', async (req, resp) => {
    try {
        const app = new app_1.App(req.body.token);
        (await app.setDomain({
            appName: req.body.app_name,
            domain: req.body.domain
        }));
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/sub_domain', async (req, resp) => {
    try {
        const app = new app_1.App(req.body.token);
        (await app.putSubDomain({
            app_name: req.body.app_name,
            name: req.body.sub_domain
        }));
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/create_template', async (req, resp) => {
    try {
        if (!await ut_permission_js_1.UtPermission.isManager(req)) {
            throw exception_js_1.default.BadRequestError("Forbidden", "No Permission.", null);
        }
        const app = new app_1.App(req.body.token);
        return response_1.default.succ(resp, { result: (await app.postTemplate({
                appName: req.body.appName,
                data: req.body.config
            })) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=app.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../modules/response"));
const app_1 = require("../services/app");
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
router.get('/', async (req, resp) => {
    try {
        const app = new app_1.App(req.body.token);
        return response_1.default.succ(resp, { result: await app.getAPP() });
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
module.exports = router;
//# sourceMappingURL=app.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const exception_1 = __importDefault(require("../../modules/exception"));
const manager_js_1 = require("../services/manager.js");
const ut_permission_js_1 = require("../utils/ut-permission.js");
const router = express_1.default.Router();
router.put('/config', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            await new manager_js_1.Manager(req.body.token).setConfig({
                appName: req.get('g-app'),
                key: req.body.key,
                value: req.body.value,
            });
            return response_1.default.succ(resp, { result: true });
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/config', async (req, resp) => {
    var _a, _b;
    try {
        return response_1.default.succ(resp, {
            result: true,
            value: (_b = ((_a = (await manager_js_1.Manager.getConfig({
                appName: req.get('g-app'),
                key: req.query.key,
                language: req.headers['language']
            }))[0]) !== null && _a !== void 0 ? _a : {})['value']) !== null && _b !== void 0 ? _b : '',
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=manager.js.map
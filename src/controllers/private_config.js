"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_js_1 = __importDefault(require("../modules/response.js"));
const private_config_js_1 = require("../services/private_config.js");
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        return response_js_1.default.succ(resp, { result: (await (new private_config_js_1.Private_config(req.body.token).setConfig(req.body))) });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.get('/', async (req, resp) => {
    try {
        return response_js_1.default.succ(resp, { result: (await (new private_config_js_1.Private_config(req.body.token).getConfig(req.query))) });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=private_config.js.map
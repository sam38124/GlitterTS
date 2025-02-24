"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_js_1 = __importDefault(require("../../modules/response.js"));
const fb_api_js_1 = require("../services/fb-api.js");
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        await new fb_api_js_1.FbApi(req.get('g-app'), req.body.token).post(req.body.data, req);
        return response_js_1.default.succ(resp, {
            result: true
        });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=track.js.map
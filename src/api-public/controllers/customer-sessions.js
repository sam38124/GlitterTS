"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_js_1 = __importDefault(require("../../modules/response.js"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const customer_sessions_js_1 = require("../services/customer-sessions.js");
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        await new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).createScheduled(req.body.data);
        return resp.status(http_status_codes_1.default.OK).send("收到你的訊息");
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=customer-sessions.js.map
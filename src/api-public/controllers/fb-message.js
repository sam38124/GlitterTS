"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const exception_1 = __importDefault(require("../../modules/exception"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const line_message_1 = require("../services/line-message");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const fb_message_1 = require("../services/fb-message");
const router = express_1.default.Router();
router.get('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new line_message_1.LineMessage(req.get('g-app'), req.body.token).getLine({
                type: req.query.list ? `${req.query.list}` : '',
                page: req.query.page ? parseInt(`${req.query.page}`, 10) : 0,
                limit: req.query.limit ? parseInt(`${req.query.limit}`, 10) : 99999,
                search: req.query.search ? `${req.query.search}` : '',
                status: req.query.status !== undefined ? `${req.query.status}` : '',
                searchType: req.query.searchType ? `${req.query.searchType}` : '',
                mailType: req.query.mailType ? `${req.query.mailType}` : '',
            }));
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/listenMessage', async (req, resp) => {
    var _a;
    try {
        if (req.query['hub.verify_token'] === 'my_secret_token') {
            let challenge = req.query["hub.challenge"];
            return resp.status(http_status_codes_1.default.OK).send(challenge);
        }
        return response_1.default.succ(resp, {
            "result": "OK"
        });
    }
    catch (err) {
        return response_1.default.fail(resp, ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
    }
});
router.post('/listenMessage', async (req, resp) => {
    var _a;
    try {
        await new fb_message_1.FbMessage(req.get('g-app'), req.body.token).listenMessage(req.body);
        return resp.status(http_status_codes_1.default.OK).send("收到你的訊息");
    }
    catch (err) {
        return response_1.default.fail(resp, ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
    }
});
module.exports = router;
//# sourceMappingURL=fb-message.js.map
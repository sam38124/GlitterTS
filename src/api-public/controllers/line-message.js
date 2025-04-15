"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const exception_1 = __importDefault(require("../../modules/exception"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const sms_js_1 = require("../services/sms.js");
const line_message_1 = require("../services/line-message");
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
router.post('/listenMessage', async (req, resp) => {
    try {
        if (Object.keys(req.body.events || {}).length == 0) {
            return response_1.default.succ(resp, {
                "result": "OK"
            });
        }
        else {
            await new line_message_1.LineMessage(req.get('g-app'), req.body.token).listenMessage(req.body);
            return response_1.default.succ(resp, {
                "result": "OK"
            });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const post = await new line_message_1.LineMessage(req.get('g-app'), req.body.token).postLine(req.body);
            return response_1.default.succ(resp, { data: "check OK" });
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const post = await new sms_js_1.SMS(req.get('g-app'), req.body.token).deleteSns(req.body);
            return response_1.default.succ(resp, { data: "check OK" });
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=line-message.js.map
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
        const insertID = await new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).createScheduled(req.body.data);
        return resp.status(http_status_codes_1.default.OK).send(insertID);
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.post('/close', async (req, resp) => {
    try {
        const insertID = await new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).closeScheduled(req.body.scheduleID);
        return resp.status(http_status_codes_1.default.OK).send({ insertID: 123 });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.post('/finish', async (req, resp) => {
    try {
        const insertID = await new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).finishScheduled(req.body.scheduleID);
        return resp.status(http_status_codes_1.default.OK).send({ insertID: 123 });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.get('/', async (req, resp) => {
    try {
        const data = await new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).getScheduled(req.query.limit, req.query.page, req.query.type);
        return resp.status(http_status_codes_1.default.OK).send(data);
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.get('/online_cart', async (req, resp) => {
    try {
        const responseData = await new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).getOnlineCart(req.query.cartID);
        return resp.status(http_status_codes_1.default.OK).send(responseData);
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.get('/online_cart_list', async (req, resp) => {
    try {
        const responseData = await new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).getCartList(req.query.scheduleID);
        return resp.status(http_status_codes_1.default.OK).send(responseData);
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.post('/realOrder', async (req, resp) => {
    try {
        const data = await new customer_sessions_js_1.CustomerSessions(req.get('g-app'), req.body.token).getRealOrder(req.body.cartArray);
        return resp.status(http_status_codes_1.default.OK).send(data);
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.post('/listenChat', async (req, resp) => {
    try {
        return resp.status(http_status_codes_1.default.OK).send("收到你的訊息");
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=customer-sessions.js.map
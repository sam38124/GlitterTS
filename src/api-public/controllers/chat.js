"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const chat_1 = require("../services/chat");
const response_js_1 = __importDefault(require("../../modules/response.js"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const database_js_1 = __importDefault(require("../../modules/database.js"));
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        const chat = new chat_1.Chat(req.get('g-app'), req.body.token);
        await chat.addChatRoom(req.body);
        return response_js_1.default.succ(resp, { result: true });
    }
    catch (e) {
        return response_js_1.default.fail(resp, e);
    }
});
router.post('/message', async (req, resp) => {
    try {
        const chat = new chat_1.Chat(req.get('g-app'), req.body.token);
        await chat.addMessage(req.body);
        return response_js_1.default.succ(resp, { result: true });
    }
    catch (e) {
        return response_js_1.default.fail(resp, e);
    }
});
router.get('/message', async (req, resp) => {
    try {
        const chat = new chat_1.Chat(req.get('g-app'), req.body.token);
        return response_js_1.default.succ(resp, await chat.getMessage(req.query));
    }
    catch (e) {
        return response_js_1.default.fail(resp, e);
    }
});
router.get('/unread', async (req, resp) => {
    try {
        const chat = new chat_1.Chat(req.get('g-app'), req.body.token);
        return response_js_1.default.succ(resp, await chat.unReadMessage(req.query.user_id));
    }
    catch (e) {
        return response_js_1.default.fail(resp, e);
    }
});
router.get('/unread/count', async (req, resp) => {
    try {
        const chat = new chat_1.Chat(req.get('g-app'), req.body.token);
        return response_js_1.default.succ(resp, await chat.unReadMessage(req.query.user_id));
    }
    catch (e) {
        return response_js_1.default.fail(resp, e);
    }
});
router.get('/', async (req, resp) => {
    try {
        const chat = new chat_1.Chat(req.get('g-app'), req.body.token);
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            return response_js_1.default.succ(resp, await chat.getChatRoom(req.query, req.query.user_id));
        }
        else {
            return response_js_1.default.succ(resp, await chat.getChatRoom(req.query, req.query.user_id || req.body.token.userID));
        }
    }
    catch (e) {
        return response_js_1.default.fail(resp, e);
    }
});
router.delete('/', async (req, resp) => {
    try {
        if ((await ut_permission_js_1.UtPermission.isManager(req))) {
            await database_js_1.default.query(`delete
                            FROM \`${req.get('g-app')}\`.t_chat_list
                            where id in (?)`, [req.query.id.split(',')]);
            return response_js_1.default.succ(resp, { result: true });
        }
        else {
            return response_js_1.default.fail(resp, exception_js_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=chat.js.map
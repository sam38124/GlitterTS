"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const chat_1 = require("../services/chat");
const response_js_1 = __importDefault(require("../../modules/response.js"));
const router = express_1.default.Router();
router.get('/', async (req, resp) => {
});
router.post('/addChatRoom', async (req, resp) => {
    try {
        const chat = new chat_1.Chat(req.get('g-app'), req.body.token);
        const result = await chat.addChatRoom(req.body.data);
        return response_js_1.default.succ(resp, { result: true });
    }
    catch (e) {
        return response_js_1.default.fail(resp, e);
    }
});
module.exports = router;
//# sourceMappingURL=chat.js.map
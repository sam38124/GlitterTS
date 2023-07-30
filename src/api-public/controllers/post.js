"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const post_1 = require("../services/post");
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        const post = new post_1.Post(req.get('g-app'), req.body.token);
        const postData = req.body.postData;
        postData.userID = req.body.token.userID;
        (await post.postContent({
            userID: req.body.token.userID,
            content: JSON.stringify(postData),
        }));
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/', async (req, resp) => {
    try {
        const post = new post_1.Post(req.get('g-app'), req.body.token);
        const data = (await post.getContent(req.query));
        data.result = true;
        return response_1.default.succ(resp, data);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/', async (req, resp) => {
    try {
        const post = new post_1.Post(req.get('g-app'), req.body.token);
        const postData = req.body.postData;
        postData.userID = req.body.token.userID;
        (await post.putContent({
            userID: req.body.token.userID,
            content: JSON.stringify(postData),
        }));
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=post.js.map
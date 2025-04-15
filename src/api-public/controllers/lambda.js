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
        const postData = req.body.data;
        const data = (await post.lambda(req.query, req.body.router, postData, 'post'));
        return response_1.default.succ(resp, data);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/', async (req, resp) => {
    try {
        const post = new post_1.Post(req.get('g-app'), req.body.token);
        const postData = req.query.data;
        const data = (await post.lambda(req.query, req.query.router, postData, 'get'));
        return response_1.default.succ(resp, data);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/', async (req, resp) => {
    try {
        const post = new post_1.Post(req.get('g-app'), req.body.token);
        const postData = req.body.data;
        const data = (await post.lambda(req.query, req.body.router, postData, 'delete'));
        return response_1.default.succ(resp, data);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/', async (req, resp) => {
    try {
        const post = new post_1.Post(req.get('g-app'), req.body.token);
        const postData = req.body.data;
        const data = (await post.lambda(req.query, req.body.router, postData, 'put'));
        return response_1.default.succ(resp, data);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=lambda.js.map
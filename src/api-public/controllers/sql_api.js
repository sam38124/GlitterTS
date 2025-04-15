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
        const data = (await post.sqlApi(req.body.router, postData));
        return response_1.default.succ(resp, { result: true, data: data });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=sql_api.js.map
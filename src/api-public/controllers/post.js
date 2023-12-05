"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const database_1 = __importDefault(require("../../modules/database"));
const config_1 = require("../../config");
const post_1 = require("../services/post");
const exception_1 = __importDefault(require("../../modules/exception"));
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        const post = new post_1.Post(req.get('g-app'), req.body.token);
        const postData = req.body.postData;
        postData.userID = req.body.token.userID;
        if (req.body.type === 'manager' &&
            (await database_1.default.query(`SELECT count(1)
                             FROM ${config_1.saasConfig.SAAS_NAME}.app_config
                             where user = ?
                               and appName = ?`, [req.body.token.userID, req.get('g-app')]))[0]['count(1)'] == 0) {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        (await post.postContent({
            userID: req.body.token.userID,
            content: JSON.stringify(postData),
        }, req.body.type === 'manager' ? `t_manager_post` : `t_post`));
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
        if (req.body.type === 'manager' &&
            (await database_1.default.query(`SELECT count(1)
                             FROM ${config_1.saasConfig.SAAS_NAME}.app_config
                             where user = ?
                               and appName = ?`, [req.body.token.userID, req.get('g-app')]))[0]['count(1)'] == 0) {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        (await post.putContent({
            userID: req.body.token.userID,
            content: JSON.stringify(postData),
        }, req.body.type === 'manager' ? `t_manager_post` : `t_post`));
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=post.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const exception_1 = __importDefault(require("../../modules/exception"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const voucher_js_1 = require("../services/voucher.js");
const post_js_1 = require("../services/post.js");
const router = express_1.default.Router();
router.put('/', async (req, resp) => {
    try {
        const postData = req.body.postData;
        postData.userID = req.body.token.userID;
        if (req.body.type === 'manager' &&
            !(await ut_permission_js_1.UtPermission.isManager(req))) {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        (await new voucher_js_1.Voucher(req.get('g-app'), req.body.token).putVoucher({
            userID: req.body.token.userID,
            content: JSON.stringify(postData),
        }));
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/', async (req, resp) => {
    try {
        const post = new post_js_1.Post(req.get('g-app'), req.body.token);
        const postData = req.body.postData;
        postData.userID = (req.body.token && req.body.token.userID) || 0;
        if (req.body.type === 'manager' &&
            !(await ut_permission_js_1.UtPermission.isManager(req))) {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        const data = (await post.postContent({
            userID: postData.userID,
            content: JSON.stringify(postData),
        }, req.body.type === 'manager' ? `t_manager_post` : `t_post`));
        return response_1.default.succ(resp, { result: true, id: data.insertId });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=voucher.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const exception_1 = __importDefault(require("../../modules/exception"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const recommend_1 = require("../services/recommend");
const router = express_1.default.Router();
router.get('/list', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            console.log('re list');
            return response_1.default.succ(resp, await new recommend_1.Recommend(req.get('g-app'), req.body.token).getList());
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
//# sourceMappingURL=recommend.js.map
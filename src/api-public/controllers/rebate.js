"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const exception_1 = __importDefault(require("../../modules/exception"));
const ut_permission_1 = require("../utils/ut-permission");
const rebate_js_1 = require("../services/rebate.js");
const router = express_1.default.Router();
router.get('/', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            const app = req.get('g-app');
            if (req.query.type === 'list') {
                return response_1.default.succ(resp, {
                    result: true,
                    data: await new rebate_js_1.Rebate(app).getRebateList(req.query),
                });
            }
            if (req.query.type === 'user') {
                const r = await new rebate_js_1.Rebate(app).getOneRebate({
                    user_id: parseInt(`${req.query.user_id}`, 10),
                    email: req.query.email,
                });
                return response_1.default.succ(resp, { result: Boolean(r), data: r });
            }
            return response_1.default.succ(resp, { result: false });
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/history', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            const app = req.get('g-app');
            return response_1.default.succ(resp, {
                result: true,
                data: await new rebate_js_1.Rebate(app).getCustomerRebateHistory(req.query.email),
            });
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/', async (req, resp) => {
    var _a, _b;
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            const app = req.get('g-app');
            const note = (_a = req.body.note) !== null && _a !== void 0 ? _a : '';
            const amount = (_b = req.body.amount) !== null && _b !== void 0 ? _b : 0;
            if (amount !== 0) {
                const r = await new rebate_js_1.Rebate(app).insertRebate(req.body.user_id, amount, note && note.length > 0 ? note : '手動增減回饋金', req.body.proof);
                if (r === null || r === void 0 ? void 0 : r.result) {
                    return response_1.default.succ(resp, r);
                }
            }
            return response_1.default.succ(resp, { result: false, msg: '發生錯誤' });
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
//# sourceMappingURL=rebate.js.map
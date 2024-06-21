"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const exception_1 = __importDefault(require("../../modules/exception"));
const ut_permission_1 = require("../utils/ut-permission");
const rebate_js_1 = require("../services/rebate.js");
const user_1 = require("../services/user");
const moment_1 = __importDefault(require("moment"));
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
    var _a;
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            const app = req.get('g-app');
            return response_1.default.succ(resp, {
                result: true,
                data: await new rebate_js_1.Rebate(app).getCustomerRebateHistory({
                    user_id: parseInt(`${(_a = req.query.user_id) !== null && _a !== void 0 ? _a : 0}`, 10),
                    email: req.query.email,
                }),
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
router.post('/batch', async (req, resp) => {
    var _a, _b;
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            const app = req.get('g-app');
            const note = (_a = req.body.note) !== null && _a !== void 0 ? _a : '';
            const amount = (_b = req.body.total) !== null && _b !== void 0 ? _b : 0;
            const deadline = req.body.rebateEndDay !== '0' ? (0, moment_1.default)().add(req.body.rebateEndDay, 'd').format('YYYY-MM-DD HH:mm:ss') : undefined;
            const rebateClass = new rebate_js_1.Rebate(app);
            if (amount < 0) {
                for (const userID of req.body.userID) {
                    if (!(await rebateClass.minusCheck(userID, amount))) {
                        const user = await new user_1.User(app).getUserData(userID, 'userID');
                        return response_1.default.succ(resp, { result: false, msg: `信箱 ${user.userData.email}<br/>餘額不足，減少失敗` });
                    }
                }
            }
            for (const userID of req.body.userID) {
                await rebateClass.insertRebate(userID, amount, note && note.length > 0 ? note : '手動增減回饋金', {
                    type: 'manual',
                    deadTime: deadline,
                });
            }
            return response_1.default.succ(resp, { result: true });
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
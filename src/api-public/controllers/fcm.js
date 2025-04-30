"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const exception_1 = __importDefault(require("../../modules/exception"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const firebase_1 = require("../../modules/firebase");
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const post = await new firebase_1.Firebase(req.get('g-app')).postFCM(req.body);
            return response_1.default.succ(resp, { data: "check OK" });
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new firebase_1.Firebase(req.get('g-app')).getFCM({
                type: req.query.list ? `${req.query.list}` : '',
                page: req.query.page ? parseInt(`${req.query.page}`, 10) : 0,
                limit: req.query.limit ? parseInt(`${req.query.limit}`, 10) : 99999,
                search: req.query.search ? `${req.query.search}` : '',
                status: req.query.status !== undefined ? `${req.query.status}` : '',
                searchType: req.query.searchType ? `${req.query.searchType}` : '',
                mailType: req.query.mailType ? `${req.query.mailType}` : '',
            }));
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
function chunkArray(array, groupSize) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}
module.exports = router;
//# sourceMappingURL=fcm.js.map
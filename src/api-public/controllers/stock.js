"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const exception_1 = __importDefault(require("../../modules/exception"));
const ut_permission_1 = require("../utils/ut-permission");
const stock_js_1 = require("../services/stock.js");
const router = express_1.default.Router();
router.get('/store/productList', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new stock_js_1.Stock(req.get('g-app'), req.body.token).productList({
                page: req.query.page ? `${req.query.page}` : '0',
                limit: req.query.limit ? `${req.query.limit}` : '20',
                search: req.query.search,
                variant_id_list: req.query.variant_id_list,
            }));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/store', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new stock_js_1.Stock(req.get('g-app'), req.body.token).deleteStoreProduct(req.body.id));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/history', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new stock_js_1.Stock(req.get('g-app'), req.body.token).getHistory({
                page: req.query.page ? `${req.query.page}` : '0',
                limit: req.query.limit ? `${req.query.limit}` : '20',
                type: req.query.type,
                order_id: req.query.order_id,
                search: req.query.search,
                queryType: req.query.queryType,
            }));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/history', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new stock_js_1.Stock(req.get('g-app'), req.body.token).postHistory(req.body.data));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/history', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new stock_js_1.Stock(req.get('g-app'), req.body.token).putHistory(req.body.data));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/history', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new stock_js_1.Stock(req.get('g-app'), req.body.token).deleteHistory(req.body.data));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=stock.js.map
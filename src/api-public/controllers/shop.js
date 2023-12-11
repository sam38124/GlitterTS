"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const multer_1 = __importDefault(require("multer"));
const exception_1 = __importDefault(require("../../modules/exception"));
const shopping_1 = require("../services/shopping");
const ut_permission_1 = require("../utils/ut-permission");
const path_1 = __importDefault(require("path"));
const newebpay_1 = __importDefault(require("../services/newebpay"));
const private_config_js_1 = require("../../services/private_config.js");
const database_js_1 = __importDefault(require("../../modules/database.js"));
const invoice_js_1 = require("../services/invoice.js");
const router = express_1.default.Router();
router.get("/product", async (req, resp) => {
    var _a, _b;
    try {
        const shopping = await (new shopping_1.Shopping(req.get('g-app'), req.body.token).getProduct({
            page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
            limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
            search: req.query.search,
            id: req.query.id,
            collection: req.query.collection,
            minPrice: req.query.min_price,
            maxPrice: req.query.max_price,
            status: req.query.status
        }));
        return response_1.default.succ(resp, shopping);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete("/product", async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            await (new shopping_1.Shopping(req.get('g-app'), req.body.token).deleteProduct({
                id: req.query.id
            }));
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
router.post("/checkout", async (req, resp) => {
    try {
        return response_1.default.succ(resp, await (new shopping_1.Shopping(req.get('g-app'), req.body.token).toCheckout({
            lineItems: req.body.line_items,
            email: (req.body.token && req.body.token.account) || req.body.email,
            return_url: req.body.return_url,
            user_info: req.body.user_info,
            code: req.body.code
        })));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post("/checkout/preview", async (req, resp) => {
    try {
        return response_1.default.succ(resp, await (new shopping_1.Shopping(req.get('g-app'), req.body.token).toCheckout({
            lineItems: req.body.line_items,
            email: (req.body.token && req.body.token.account) || req.body.email,
            return_url: req.body.return_url,
            user_info: req.body.user_info,
            code: req.body.code
        }, 'preview')));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get("/order", async (req, resp) => {
    var _a, _b, _c, _d;
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await (new shopping_1.Shopping(req.get('g-app'), req.body.token).getCheckOut({
                page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
                limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
                search: req.query.search,
                id: req.query.id
            })));
        }
        else if (await ut_permission_1.UtPermission.isAppUser(req)) {
            return response_1.default.succ(resp, await (new shopping_1.Shopping(req.get('g-app'), req.body.token).getCheckOut({
                page: ((_c = req.query.page) !== null && _c !== void 0 ? _c : 0),
                limit: ((_d = req.query.limit) !== null && _d !== void 0 ? _d : 50),
                search: req.query.search,
                id: req.query.id,
                email: req.body.token.account
            })));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put("/order", async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await (new shopping_1.Shopping(req.get('g-app'), req.body.token).putOrder({
                id: req.body.id,
                orderData: req.body.order_data,
                status: req.body.status || undefined
            })));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete("/order", async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await (new shopping_1.Shopping(req.get('g-app'), req.body.token).deleteOrder({
                id: req.body.id
            })));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/voucher', async (req, resp) => {
    var _a, _b;
    try {
        let query = [
            `(content->>'$.type'='voucher')`
        ];
        req.query.search && query.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${req.query.search}%'))`);
        return response_1.default.succ(resp, await (new shopping_1.Shopping(req.get('g-app'), req.body.token).querySql(query, {
            page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
            limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
            id: req.query.id
        })));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/voucher', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            await (new shopping_1.Shopping(req.get('g-app'), req.body.token).deleteVoucher({
                id: req.query.id
            }));
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
router.post('/redirect', async (req, resp) => {
    try {
        return resp.sendFile(path_1.default.resolve(__dirname, '../../../lowcode/redirect.html'));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.post('/notify', upload.single('file'), async (req, resp) => {
    try {
        const appName = req.query['g-app'];
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: appName, key: 'glitter_finance'
        }))[0].value;
        const url = new URL(`https://covert?${req.body.toString()}`);
        const decodeData = JSON.parse(await new newebpay_1.default(appName, {
            "HASH_IV": keyData.HASH_IV,
            "HASH_KEY": keyData.HASH_KEY,
            "ActionURL": keyData.ActionURL,
            "NotifyURL": ``,
            "ReturnURL": ``,
            "MERCHANT_ID": keyData.MERCHANT_ID,
        }).decode(url.searchParams.get('TradeInfo')));
        if (decodeData['Status'] === 'SUCCESS') {
            await database_js_1.default.execute(`update \`${appName}\`.t_checkout
                              set status=?
                              where cart_token = ?`, [1, decodeData['Result']['MerchantOrderNo']]);
            new invoice_js_1.Invoice(appName).postCheckoutInvoice(decodeData['Result']['MerchantOrderNo']);
        }
        else {
            await database_js_1.default.execute(`update \`${appName}\`.t_checkout
                              set status=?
                              where cart_token = ?`, [-1, decodeData['Result']['MerchantOrderNo']]);
        }
        return response_1.default.succ(resp, {});
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=shop.js.map
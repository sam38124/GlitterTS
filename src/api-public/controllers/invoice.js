"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const invoice_1 = require("../services/ezpay/invoice");
const app_1 = __importDefault(require("../../app"));
const invoice_js_1 = require("../services/invoice.js");
const ut_permission_1 = require("../utils/ut-permission");
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        const config = await app_1.default.getAdConfig(req.get('g-app'), "invoice_setting");
        switch (config.fincial) {
            case "ezpay":
                if (!invoice_js_1.Invoice.checkWhiteList(config, req.body.invoice_data)) {
                    return response_1.default.succ(resp, { result: false, message: `白名單驗證未通過` });
                }
                const result = await invoice_1.EzInvoice.postInvoice({
                    hashKey: config.hashkey,
                    hash_IV: config.hashiv,
                    merchNO: config.merchNO,
                    invoice_data: req.body.invoice_data,
                    beta: (config.point === "beta")
                });
                return response_1.default.succ(resp, { result: result });
            case "green":
                return response_1.default.succ(resp, { result: false, message: "尚未支援" });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/allowance', async (req, resp) => {
    try {
        const config = await app_1.default.getAdConfig(req.get('g-app'), "invoice_setting");
        switch (config.fincial) {
            case "ezpay":
                if (!invoice_js_1.Invoice.checkWhiteList(config, req.body.invoice_data)) {
                    return response_1.default.succ(resp, { result: false, message: `白名單驗證未通過` });
                }
                const result = await invoice_1.EzInvoice.allowance({
                    hashKey: config.hashkey,
                    hash_IV: config.hashiv,
                    merchNO: config.merchNO,
                    invoice_data: req.body.invoice_data,
                    beta: (config.point === "beta")
                });
                return response_1.default.succ(resp, { result: result });
            case "green":
                return response_1.default.succ(resp, { result: false, message: "尚未支援" });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/allowanceInvalid', async (req, resp) => {
    try {
        const config = await app_1.default.getAdConfig(req.get('g-app'), "invoice_setting");
        switch (config.fincial) {
            case "ezpay":
                if (!invoice_js_1.Invoice.checkWhiteList(config, req.body.invoice_data)) {
                    return response_1.default.succ(resp, { result: false, message: `白名單驗證未通過` });
                }
                const result = await invoice_1.EzInvoice.allowanceInvalid({
                    hashKey: config.hashkey,
                    hash_IV: config.hashiv,
                    merchNO: config.merchNO,
                    invoice_data: req.body.invoice_data,
                    beta: (config.point === "beta")
                });
                return response_1.default.succ(resp, { result: result });
            case "green":
                return response_1.default.succ(resp, { result: false, message: "尚未支援" });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/', async (req, resp) => {
    try {
        const config = await app_1.default.getAdConfig(req.get('g-app'), "invoice_setting");
        switch (config.fincial) {
            case "ezpay":
                if (!invoice_js_1.Invoice.checkWhiteList(config, req.body.invoice_data)) {
                    return response_1.default.succ(resp, { result: false, message: `白名單驗證未通過` });
                }
                const result = await invoice_1.EzInvoice.deleteInvoice({
                    hashKey: config.hashkey,
                    hash_IV: config.hashiv,
                    merchNO: config.merchNO,
                    invoice_data: req.body.invoice_data,
                    beta: (config.point === "beta")
                });
                return response_1.default.succ(resp, { result: result });
            case "green":
                return response_1.default.succ(resp, { result: false, message: "尚未支援" });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/getInvoice', async (req, resp) => {
    try {
        const config = await app_1.default.getAdConfig(req.get('g-app'), "invoice_setting");
        console.log(`invoice-${JSON.stringify(config)}`);
        switch (config.fincial) {
            case "ezpay":
                if (!invoice_js_1.Invoice.checkWhiteList(config, req.body.invoice_data)) {
                    return response_1.default.succ(resp, { result: false, message: `白名單驗證未通過` });
                }
                const result = await invoice_1.EzInvoice.getInvoice({
                    hashKey: config.hashkey,
                    hash_IV: config.hashiv,
                    merchNO: config.merchNO,
                    invoice_data: req.body.invoice_data,
                    beta: (config.point === "beta")
                });
                return response_1.default.succ(resp, { result: result });
            case "green":
                return response_1.default.succ(resp, { result: false, message: "尚未支援" });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/invoice-type', async (req, resp) => {
    const config = await app_1.default.getAdConfig(req.get('g-app'), "invoice_setting");
    return response_1.default.succ(resp, { method: config.fincial });
});
router.get('/', async (req, resp) => {
    var _a, _b;
    const config = await app_1.default.getAdConfig(req.get('g-app'), "invoice_setting");
    if (await ut_permission_1.UtPermission.isManager(req)) {
        return response_1.default.succ(resp, await new invoice_js_1.Invoice(req.get('g-app')).getInvoice({
            page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
            limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
            search: req.query.search,
            searchType: req.query.searchType,
            orderString: req.query.orderString,
            created_time: req.query.created_time,
            invoice_type: req.query.invoice_type,
            issue_method: req.query.issue_method,
            status: req.query.status,
            filter: req.query.filter,
        }));
    }
    else {
    }
    return response_1.default.succ(resp, { method: config.fincial });
});
module.exports = router;
//# sourceMappingURL=invoice.js.map
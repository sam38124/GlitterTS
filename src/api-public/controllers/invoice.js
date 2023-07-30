"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const invoice_1 = require("../services/ezpay/invoice");
const app_1 = __importDefault(require("../../app"));
const router = express_1.default.Router();
function checkWhiteList(config, invoice_data) {
    if (config.point === "beta" && invoice_data.BuyerEmail && config.whiteList && config.whiteList.length > 0) {
        return config.whiteList.find((dd) => {
            return dd.email === invoice_data.BuyerEmail;
        });
    }
    else {
        return true;
    }
}
router.post('/', async (req, resp) => {
    try {
        const config = await app_1.default.getAdConfig(req.get('g-app'), "invoice_setting");
        switch (config.fincial) {
            case "ezpay":
                if (!checkWhiteList(config, req.body.invoice_data)) {
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
                if (!checkWhiteList(config, req.body.invoice_data)) {
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
                if (!checkWhiteList(config, req.body.invoice_data)) {
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
                if (!checkWhiteList(config, req.body.invoice_data)) {
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
                if (!checkWhiteList(config, req.body.invoice_data)) {
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
module.exports = router;
//# sourceMappingURL=invoice.js.map
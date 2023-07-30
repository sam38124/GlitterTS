import express from "express";
import response from "../../modules/response";
import {Post} from "../services/post";
import {EzInvoice} from "../services/ezpay/invoice";
import app from "../../app";


const router: express.Router = express.Router();

export = router;

function checkWhiteList(config: any, invoice_data: any) {
    if (config.point === "beta" && invoice_data.BuyerEmail && config.whiteList && config.whiteList.length > 0) {
        return config.whiteList.find((dd: any) => {
            return dd.email === invoice_data.BuyerEmail
        })
    } else {
        return true
    }
}

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        const config = await app.getAdConfig(req.get('g-app') as string, "invoice_setting");

        switch (config.fincial) {
            case "ezpay":
                if (!checkWhiteList(config, req.body.invoice_data)) {
                    return response.succ(resp, {result: false, message: `白名單驗證未通過`});
                }
                const result = await EzInvoice.postInvoice({
                    hashKey: config.hashkey,
                    hash_IV: config.hashiv,
                    merchNO: config.merchNO,
                    invoice_data: req.body.invoice_data,
                    beta: (config.point === "beta")
                })
                return response.succ(resp, {result: result});
            case "green":
                return response.succ(resp, {result: false, message: "尚未支援"});

        }

    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/allowance', async (req: express.Request, resp: express.Response) => {
    try {
        const config = await app.getAdConfig(req.get('g-app') as string, "invoice_setting");
        switch (config.fincial) {
            case "ezpay":
                if (!checkWhiteList(config, req.body.invoice_data)) {
                    return response.succ(resp, {result: false, message: `白名單驗證未通過`});
                }
                const result = await EzInvoice.allowance({
                    hashKey: config.hashkey,
                    hash_IV: config.hashiv,
                    merchNO: config.merchNO,
                    invoice_data: req.body.invoice_data,
                    beta: (config.point === "beta")
                })
                return response.succ(resp, {result: result});
            case "green":
                return response.succ(resp, {result: false, message: "尚未支援"});
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/allowanceInvalid', async (req: express.Request, resp: express.Response) => {
    try {
        const config = await app.getAdConfig(req.get('g-app') as string, "invoice_setting");
        switch (config.fincial) {
            case "ezpay":
                if (!checkWhiteList(config, req.body.invoice_data)) {
                    return response.succ(resp, {result: false, message: `白名單驗證未通過`});
                }
                const result = await EzInvoice.allowanceInvalid({
                    hashKey: config.hashkey,
                    hash_IV: config.hashiv,
                    merchNO: config.merchNO,
                    invoice_data: req.body.invoice_data,
                    beta: (config.point === "beta")
                })
                return response.succ(resp, {result: result});
            case "green":
                return response.succ(resp, {result: false, message: "尚未支援"});
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/', async (req: express.Request, resp: express.Response) => {
    try {
        const config = await app.getAdConfig(req.get('g-app') as string, "invoice_setting");
        switch (config.fincial) {
            case "ezpay":
                if (!checkWhiteList(config, req.body.invoice_data)) {
                    return response.succ(resp, {result: false, message: `白名單驗證未通過`});
                }
                const result = await EzInvoice.deleteInvoice({
                    hashKey: config.hashkey,
                    hash_IV: config.hashiv,
                    merchNO: config.merchNO,
                    invoice_data: req.body.invoice_data,
                    beta: (config.point === "beta")
                })
                return response.succ(resp, {result: result});
            case "green":
                return response.succ(resp, {result: false, message: "尚未支援"});
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/getInvoice', async (req: express.Request, resp: express.Response) => {
    try {
        const config = await app.getAdConfig(req.get('g-app') as string, "invoice_setting");
        console.log(`invoice-${JSON.stringify(config)}`)
        switch (config.fincial) {
            case "ezpay":
                if (!checkWhiteList(config, req.body.invoice_data)) {
                    return response.succ(resp, {result: false, message: `白名單驗證未通過`});
                }
                const result = await EzInvoice.getInvoice({
                    hashKey: config.hashkey,
                    hash_IV: config.hashiv,
                    merchNO: config.merchNO,
                    invoice_data: req.body.invoice_data,
                    beta: (config.point === "beta")
                })
                return response.succ(resp, {result: result});
            case "green":
                return response.succ(resp, {result: false, message: "尚未支援"});

        }

    } catch (err) {
        return response.fail(resp, err);
    }
});

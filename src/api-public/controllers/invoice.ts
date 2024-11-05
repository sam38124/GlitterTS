import express from "express";
import response from "../../modules/response";
import {EzInvoice} from "../services/ezpay/invoice";
import app from "../../app";
import {Invoice} from "../services/invoice.js";
import {UtPermission} from "../utils/ut-permission";


const router: express.Router = express.Router();

export = router;



router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        const config = await app.getAdConfig(req.get('g-app') as string, "invoice_setting");
        switch (config.fincial) {
            case "ezpay":
                if (!Invoice.checkWhiteList(config, req.body.invoice_data)) {
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
                if (!Invoice.checkWhiteList(config, req.body.invoice_data)) {
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
                if (!Invoice.checkWhiteList(config, req.body.invoice_data)) {
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
                if (!Invoice.checkWhiteList(config, req.body.invoice_data)) {
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
                if (!Invoice.checkWhiteList(config, req.body.invoice_data)) {
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

router.get('/invoice-type',async (req: express.Request, resp: express.Response) =>{
    const config = await app.getAdConfig(req.get('g-app') as string, "invoice_setting");
    return response.succ(resp, {method:config.fincial});
})

router.get('/',async (req: express.Request, resp: express.Response) =>{
    const config = await app.getAdConfig(req.get('g-app') as string, "invoice_setting");
    if (await UtPermission.isManager(req)) {
        return response.succ(resp,
            await new Invoice(req.get('g-app') as string).getInvoice({
                page: (req.query.page ?? 0) as number,
                limit: (req.query.limit ?? 50) as number,
                search: req.query.search as string,
                searchType: req.query.searchType as string,
                orderString: req.query.orderString as string,
                created_time:req.query.created_time as string,
                invoice_type: req.query.invoice_type as string,
                issue_method: req.query.issue_method as string,
                status: req.query.status as string,
                filter: req.query.filter as string,
            }))
    }else {
    }
    return response.succ(resp, {method:config.fincial});
})



import express from "express";
import response from "../../modules/response";
import multer from "multer";
import exception from "../../modules/exception";
import {Shopping} from "../services/shopping";
import {UtPermission} from "../utils/ut-permission";
import path from "path";
import Newebpay from "../services/newebpay";
import {Private_config} from "../../services/private_config.js";
import db from "../../modules/database.js";
import {IToken} from "../models/Auth.js";

const router: express.Router = express.Router();

export = router;

router.get("/product", async (req: express.Request, resp: express.Response) => {
    try {
        const shopping = await (new Shopping(req.get('g-app') as string, req.body.token).getProduct({
            page: (req.query.page ?? 0) as number,
            limit: (req.query.limit ?? 50) as number,
            search: req.query.search as string,
            id: req.query.id as string,
            collection:req.query.collection as string,
            minPrice:req.query.min_price as string,
            maxPrice:req.query.max_price as string,
            status:req.query.status as string
        }));
        return response.succ(resp, shopping);
    } catch (err) {
        return response.fail(resp, err);
    }
})

router.delete("/product", async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            await (new Shopping(req.get('g-app') as string, req.body.token).deleteProduct({
                id: req.query.id as string
            }));
            return response.succ(resp, {result: true});
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
})

router.post("/checkout", async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, await (new Shopping(req.get('g-app') as string, req.body.token).toCheckout({
            lineItems: req.body.line_items as any,
            email: (req.body.token && req.body.token.account) || req.body.email,
            return_url: req.body.return_url,
            user_info: req.body.user_info,
            code:req.body.code
        })));
    } catch (err) {
        return response.fail(resp, err);
    }
})

router.post("/checkout/preview", async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, await (new Shopping(req.get('g-app') as string, req.body.token).toCheckout({
            lineItems: req.body.line_items as any,
            email: (req.body.token && req.body.token.account) || req.body.email,
            return_url: req.body.return_url,
            user_info: req.body.user_info,
            code:req.body.code
        },'preview')));
    } catch (err) {
        return response.fail(resp, err);
    }
})
router.get("/order", async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await (new Shopping(req.get('g-app') as string, req.body.token).getCheckOut({
                page: (req.query.page ?? 0) as number,
                limit: (req.query.limit ?? 50) as number,
                search: req.query.search as string,
                id: req.query.id as string
            })));
        } else if (await UtPermission.isAppUser(req)) {
            return response.succ(resp, await (new Shopping(req.get('g-app') as string, req.body.token).getCheckOut({
                page: (req.query.page ?? 0) as number,
                limit: (req.query.limit ?? 50) as number,
                search: req.query.search as string,
                id: req.query.id as string,
                email: (req.body.token as IToken).account
            })));
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);

        }

    } catch (err) {
        return response.fail(resp, err);
    }
})

router.put("/order", async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await (new Shopping(req.get('g-app') as string, req.body.token).putOrder({
                id: req.body.id,
                orderData: req.body.order_data,
                status:req.body.status || undefined
            })));
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);

        }

    } catch (err) {
        return response.fail(resp, err);
    }
})
router.delete("/order", async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await (new Shopping(req.get('g-app') as string, req.body.token).deleteOrder({
                id: req.body.id as string
            })));
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);

        }

    } catch (err) {
        return response.fail(resp, err);
    }
})
router.get('/voucher', async (req: express.Request, resp: express.Response) => {
    try {
        let query=[
            `(content->>'$.type'='voucher')`
        ]
        req.query.search && query.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${req.query.search}%'))`)
        return response.succ(resp, await (new Shopping(req.get('g-app') as string, req.body.token).querySql(query,{
            page: (req.query.page ?? 0) as number,
            limit: (req.query.limit ?? 50) as number,
            id: req.query.id as string
        })));

    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/voucher', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            await (new Shopping(req.get('g-app') as string, req.body.token).deleteVoucher({
                id: req.query.id as string
            }));
            return response.succ(resp, {result: true});
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/redirect', async (req: express.Request, resp: express.Response) => {
    try {
        return resp.sendFile(path.resolve(__dirname, '../../../lowcode/redirect.html'));
    } catch (err) {
        return response.fail(resp, err);
    }
});
const storage = multer.memoryStorage(); // 将文件存储在内存中
const upload = multer({storage});
router.post('/notify', upload.single('file'), async (req: express.Request, resp: express.Response) => {
    try {
        const appName = req.query['g-app'] as string
        const keyData = (await Private_config.getConfig({
            appName: appName, key: 'glitter_finance'
        }))[0].value
        const url = new URL(`https://covert?${req.body.toString()}`)
        const decodeData: any = JSON.parse(await new Newebpay(appName, {
            "HASH_IV": keyData.HASH_IV,
            "HASH_KEY": keyData.HASH_KEY,
            "ActionURL": keyData.ActionURL,
            "NotifyURL": ``,
            "ReturnURL": ``,
            "MERCHANT_ID": keyData.MERCHANT_ID,
        }).decode(url.searchParams.get('TradeInfo') as string));
        if (decodeData['Status'] === 'SUCCESS') {
            await db.execute(`update \`${appName}\`.t_checkout
                              set status=?
                              where cart_token = ?`, [1, decodeData['Result']['MerchantOrderNo']])
        } else {
            await db.execute(`update \`${appName}\`.t_checkout
                              set status=?
                              where cart_token = ?`, [-1, decodeData['Result']['MerchantOrderNo']])
        }
        return response.succ(resp, {});
    } catch (err) {
        return response.fail(resp, err);
    }
});

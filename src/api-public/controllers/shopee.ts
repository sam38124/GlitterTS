import express, { query } from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission.js';
import { Mail } from '../services/mail.js';
import {SMS} from "../services/sms.js";
import {LineMessage} from "../services/line-message";
import {Shopee} from "../services/shopee";

const router: express.Router = express.Router();

export = router;

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/getAuth', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(
            resp,
            {
                "result":new Shopee(req.get('g-app') as string, req.body.token).generateAuth(req.body.redirect)
            }
        )
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/getToken', async (req: express.Request, resp: express.Response) => {
    try {
        if(await UtPermission.isManager(req)){
            return response.succ(
                resp,
                {
                    "result":new Shopee(req.get('g-app') as string, req.body.token).getToken(req.body.code , req.body.shop_id)
                }
            )
        }

    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/sync-status', async (req: express.Request, resp: express.Response) => {
    return response.succ(
        resp,
        {
            result:Shopee.getItemProgress.find((dd)=>{
                return dd===req.get('g-app') as string
            }) !== undefined
        }
    )
})
router.post('/getItemList', async (req: express.Request, resp: express.Response) => {
    try {
        if(await UtPermission.isManager(req)){
            //把同步中的toggle開啟
            Shopee.getItemProgress.push(req.get('g-app') as string)
            const itemList = new Shopee(req.get('g-app') as string, req.body.token).getItemList(req.body.start, req.body.end);
            itemList.then(()=>{
                Shopee.getItemProgress= Shopee.getItemProgress.filter((dd)=>{
                    return dd!==req.get('g-app') as string
                })
            }).catch(()=>{
                Shopee.getItemProgress= Shopee.getItemProgress.filter((dd)=>{
                    return dd!==req.get('g-app') as string
                })
            })
            return response.succ(
                resp,
                {
                    result:true
                }
            )
        }else{
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/listenMessage', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(
            resp,
            {
                "result":"OK"
            }
        )
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/syncStock', async (req: express.Request, resp: express.Response) => {
    try {
        const res = await new Shopee(req.get('g-app') as string , req.body.token).asyncStockFromShopnex();
        return response.succ(
            resp,
            {
                "result" : "OK",
                "response" : res
            }
        )
    } catch (err) {
        return response.fail(resp, err);
    }
});

['post','get'].map((dd)=>{
    (router as any)[dd]('/stock-hook', async (req: express.Request, resp: express.Response) => {
        try {
            console.log(`stock-hook-body===>`,req.body)
            console.log(`stock-hook-query===>`,req.query)
            return response.succ(
                resp,
                {
                    "result" : "OK",
                    "response" : {}
                }
            )
        } catch (err) {
            return response.fail(resp, err);
        }
    });
})


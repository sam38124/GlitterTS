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
        console.log("req.body in get -- ", req.body)
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/getAuth', async (req: express.Request, resp: express.Response) => {
    try {

        // console.log(new Shopee().generateAuth())
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

        console.log(req.body)
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
router.post('/getItemList', async (req: express.Request, resp: express.Response) => {
    try {
        if(await UtPermission.isManager(req)){
            return response.succ(
                resp,
                {
                    "result":new Shopee(req.get('g-app') as string, req.body.token).getItemList(req.body.start, req.body.end)
                }
            )
        }

    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/listenMessage', async (req: express.Request, resp: express.Response) => {
    try {
        console.log("req.body in post -- ", req)
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

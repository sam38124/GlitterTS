import express, { query } from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission.js';
import { Mail } from '../services/mail.js';
import {SMS} from "../services/sms.js";
import {LineMessage} from "../services/line-message";
import httpStatus from "http-status-codes";
import {FbMessage} from "../services/fb-message";

const router: express.Router = express.Router();

export = router;

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
                resp,
                await new LineMessage(req.get('g-app') as string, req.body.token).getLine({
                    type: req.query.list ? `${req.query.list}` : '',
                    page: req.query.page ? parseInt(`${req.query.page}`, 10) : 0,
                    limit: req.query.limit ? parseInt(`${req.query.limit}`, 10) : 99999,
                    search: req.query.search ? `${req.query.search}` : '',
                    status: req.query.status !== undefined ? `${req.query.status}` : '',
                    searchType: req.query.searchType ? `${req.query.searchType}` : '',
                    mailType: req.query.mailType ? `${req.query.mailType}` : '',
                })
            );
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/listenMessage', async (req: express.Request, resp: express.Response) => {
    try {
        console.log("req.query -- ", req.query)
        if (req.query['hub.verify_token'] === 'my_secret_token') {
            let challenge = req.query["hub.challenge"];
            console.log("req.query -- ", req.query)

            return resp.status(httpStatus.OK).send(challenge)
        }
        // await new LineMessage(req.get('g-app') as string, req.body.token).listenMessage(req.body)
        // return response.succ(
        //     resp,
        //     {
        //         "result":"OK"
        //     }
        // )
        // return response.succ(resp,challenge);
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/listenMessage', async (req: express.Request, resp: express.Response) => {
    try {
        let body = req.body;
        if (body.object === 'page') {
            body.entry.forEach(function(entry:any) {
                let webhook_event = entry.messaging[0];
                console.log(webhook_event);

                // 取得發送訊息的粉絲ID和訊息內容
                let sender_psid = webhook_event.sender.id;
                let received_message = webhook_event.message;
                const pageID = "1285630438150580"
                if (sender_psid == pageID){
                    //避免回收自己傳出去的訊息導致迴圈
                    return
                }
                console.log('Sender PSID:', sender_psid);
                console.log('Message:', received_message);
                new FbMessage(req.get('g-app') as string).sendMessage({
                    fbID:sender_psid,
                    data:"自動回覆訊息"
                },()=>{})
                // 你可以在這裡處理訊息並回應使用者
                // return resp.status(httpStatus.OK).send("收到你的訊息")
                // sendMessage(sender_psid, "收到你的訊息");
            });

        } else {
            // return response.fail(resp, 404);
        }
        return response.succ(resp,"OK");
    } catch (err) {
        return response.fail(resp, err);
    }
});


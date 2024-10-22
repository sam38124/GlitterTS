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
        //FB webhook 驗證，記得網頁上的
        if (req.query['hub.verify_token'] === 'my_secret_token') {
            let challenge = req.query["hub.challenge"];

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
        await new FbMessage(req.get('g-app') as string, req.body.token).listenMessage(req.body)
        return resp.status(httpStatus.OK).send("收到你的訊息")
    } catch (err) {
        return response.fail(resp, err);
    }
});


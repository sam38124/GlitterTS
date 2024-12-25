import express, { query } from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission.js';
import { Mail } from '../services/mail.js';
import {SMS} from "../services/sms.js";
import {LineMessage} from "../services/line-message";

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
//line的所有收訊
router.post('/listenMessage', async (req: express.Request, resp: express.Response) => {
    try {
        if (Object.keys(req.body.events || {}).length == 0){
            return response.succ(
                resp,
                {
                    "result":"OK"
                }
            )
        }else{
            await new LineMessage(req.get('g-app') as string, req.body.token).listenMessage(req.body)
            return response.succ(
                resp,
                {
                    "result":"OK"
                }
            )
        }

    } catch (err) {
        return response.fail(resp, err);
    }
});
//送出訊息
router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {

            const post = await new LineMessage(req.get('g-app') as string, req.body.token).postLine(req.body);
            return response.succ(resp, { data: "check OK" });
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.delete('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const post = await new SMS(req.get('g-app') as string, req.body.token).deleteSns(req.body);
            return response.succ(resp, { data: "check OK" });
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

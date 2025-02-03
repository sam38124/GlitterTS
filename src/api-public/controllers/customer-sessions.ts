import express, { query } from 'express';
import response from '../../modules/response.js';
import exception from '../../modules/exception.js';
import { UtPermission } from '../utils/ut-permission.js';
import httpStatus from "http-status-codes";
import {CustomerSessions} from "../services/customer-sessions.js";

const router: express.Router = express.Router();

export = router;

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        await new CustomerSessions(req.get('g-app') as string, req.body.token).createScheduled(req.body.data)
        return resp.status(httpStatus.OK).send("收到你的訊息")
    } catch (err) {
        return response.fail(resp, err);
    }
});


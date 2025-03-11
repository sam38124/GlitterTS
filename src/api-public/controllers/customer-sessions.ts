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
        const insertID = await new CustomerSessions(req.get('g-app') as string, req.body.token).createScheduled(req.body.data)
        return resp.status(httpStatus.OK).send({insertID:123})
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/close', async (req: express.Request, resp: express.Response) => {
    try {
        const insertID = await new CustomerSessions(req.get('g-app') as string, req.body.token).closeScheduled(req.body.scheduleID)
        return resp.status(httpStatus.OK).send({insertID:123})
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/finish', async (req: express.Request, resp: express.Response) => {
    try {
        const insertID = await new CustomerSessions(req.get('g-app') as string, req.body.token).finishScheduled(req.body.scheduleID)
        return resp.status(httpStatus.OK).send({insertID:123})
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        const data = await new CustomerSessions(req.get('g-app') as string, req.body.token).getScheduled();
        // const insertID = await new CustomerSessions(req.get('g-app') as string, req.body.token).createScheduled(req.body.data)
        return resp.status(httpStatus.OK).send(data)
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/online_cart', async (req: express.Request, resp: express.Response) => {
    try {
        const responseData = await new CustomerSessions(req.get('g-app') as string, req.body.token).getOnlineCart(req.query.cartID as string)
        return resp.status(httpStatus.OK).send(responseData)
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/online_cart_list', async (req: express.Request, resp: express.Response) => {
    try {
        const responseData = await new CustomerSessions(req.get('g-app') as string, req.body.token).getCartList(req.query.scheduleID as string)
        return resp.status(httpStatus.OK).send(responseData)
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/realOrder', async (req: express.Request, resp: express.Response) => {
    try {
        const data = await new CustomerSessions(req.get('g-app') as string, req.body.token).getRealOrder(req.body.cartArray);
        // const insertID = await new CustomerSessions(req.get('g-app') as string, req.body.token).createScheduled(req.body.data)
        return resp.status(httpStatus.OK).send(data)
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/listenChat', async (req: express.Request, resp: express.Response) => {
    try {
        // await new CustomerSessions(req.get('g-app') as string, req.body.token).createScheduled(req.body.data)
        return resp.status(httpStatus.OK).send("收到你的訊息")
    } catch (err) {
        return response.fail(resp, err);
    }
});


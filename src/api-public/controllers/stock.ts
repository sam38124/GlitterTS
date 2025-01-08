import express from 'express';
import response from '../../modules/response';
import multer from 'multer';
import exception from '../../modules/exception';
import db from '../../modules/database.js';
import redis from '../../modules/redis.js';
import { UtDatabase } from '../utils/ut-database.js';
import { UtPermission } from '../utils/ut-permission';
import { Stock, StockHistoryType } from '../services/stock.js';

const router: express.Router = express.Router();
export = router;

router.get('/store/productList', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
                resp,
                await new Stock(req.get('g-app') as string, req.body.token).productList({
                    page: req.query.page ? `${req.query.page}` : '0',
                    limit: req.query.limit ? `${req.query.limit}` : '20',
                    search: req.query.search as string,
                    variant_id_list: req.query.variant_id_list as string,
                })
            );
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.delete('/store', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Stock(req.get('g-app') as string, req.body.token).deleteStoreProduct(req.body.id));
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/history', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
                resp,
                await new Stock(req.get('g-app') as string, req.body.token).getHistory({
                    page: req.query.page ? `${req.query.page}` : '0',
                    limit: req.query.limit ? `${req.query.limit}` : '20',
                    search: req.query.search as string,
                    type: req.query.type as StockHistoryType,
                    order_id: req.query.order_id as string,
                })
            );
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/history', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Stock(req.get('g-app') as string, req.body.token).postHistory(req.body.data));
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.put('/history', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Stock(req.get('g-app') as string, req.body.token).putHistory(req.body.data));
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.delete('/history', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Stock(req.get('g-app') as string, req.body.token).deleteHistory(req.body.data));
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

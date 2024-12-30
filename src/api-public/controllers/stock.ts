import express from 'express';
import response from '../../modules/response';
import multer from 'multer';
import exception from '../../modules/exception';
import db from '../../modules/database.js';
import redis from '../../modules/redis.js';
import { UtDatabase } from '../utils/ut-database.js';
import { UtPermission } from '../utils/ut-permission';
import { Stock } from '../services/stock.js';

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
                })
            );
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

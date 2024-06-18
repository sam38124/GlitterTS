import express, { query } from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission';
import { Rebate, IRebateSearch } from '../services/rebate.js';

const router: express.Router = express.Router();

export = router;

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const app = req.get('g-app') as string;
            if (req.query.type === 'list') {
                return response.succ(resp, {
                    result: true,
                    data: await new Rebate(app).getRebateList(req.query as unknown as IRebateSearch),
                });
            }
            if (req.query.type === 'user') {
                const r = await new Rebate(app).getOneRebate({
                    user_id: parseInt(`${req.query.user_id}`, 10),
                    email: req.query.email as string,
                });
                return response.succ(resp, { result: Boolean(r), data: r });
            }
            return response.succ(resp, { result: false });
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/history', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const app = req.get('g-app') as string;
            return response.succ(resp, {
                result: true,
                data: await new Rebate(app).getCustomerRebateHistory(req.query.email as string),
            });
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const app = req.get('g-app') as string;
            const note = req.body.note ?? '';
            const amount = req.body.amount ?? 0;
            if (amount !== 0) {
                const r = await new Rebate(app).insertRebate(req.body.user_id, amount, note && note.length > 0 ? note : '手動增減回饋金', req.body.proof);
                if (r?.result) {
                    return response.succ(resp, r);
                }
            }
            return response.succ(resp, { result: false, msg: '發生錯誤' });
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

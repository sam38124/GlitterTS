import express, { query } from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission';
import { Rebate, IRebateSearch } from '../services/rebate.js';
import { User } from '../services/user';
import moment from 'moment';

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
                data: await new Rebate(app).getCustomerRebateHistory({
                    user_id: parseInt(`${req.query.user_id ?? 0}`, 10),
                    email: req.query.email as string,
                }),
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
            const rebateClass = new Rebate(app);

            if (!(await rebateClass.mainStatus())) {
                return response.succ(resp, { result: false, msg: '購物金功能關閉中' });
            }

            const note = req.body.note ?? '';
            const amount = req.body.amount ?? 0;
            if (amount !== 0) {
                const r = await rebateClass.insertRebate(req.body.user_id, amount, note && note.length > 0 ? note : '手動設定', req.body.proof);
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

router.post('/batch', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const app = req.get('g-app') as string;
            const note = req.body.note ?? '';
            const amount = req.body.total ?? 0;
            const deadline = req.body.rebateEndDay !== '0' ? moment().add(req.body.rebateEndDay, 'd').format('YYYY-MM-DD HH:mm:ss') : undefined;
            const rebateClass = new Rebate(app);

            if (!(await rebateClass.mainStatus())) {
                return response.succ(resp, { result: false, msg: '購物金功能關閉中' });
            }

            if (amount < 0) {
                for (const userID of req.body.userID) {
                    if (!(await rebateClass.minusCheck(userID, amount))) {
                        const user = await new User(app).getUserData(userID, 'userID');
                        return response.succ(resp, { result: false, msg: `信箱 ${user.userData.email}<br/>餘額不足，減少失敗` });
                    }
                }
            }

            for (const userID of req.body.userID) {
                if (amount !== 0) {
                    await rebateClass.insertRebate(userID, amount, note && note.length > 0 ? note : '手動設定', {
                        type: 'manual',
                        deadTime: deadline,
                    });
                }
            }

            return response.succ(resp, { result: true });
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

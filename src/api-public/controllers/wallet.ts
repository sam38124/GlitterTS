import express from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission.js';
import { Firebase } from '../../modules/firebase';
import { Private_config } from '../../services/private_config.js';
import FinancialService, { EcPay, EzPay } from '../services/financial-service.js';
import { Wallet } from '../services/wallet.js';
import multer from 'multer';
import db from '../../modules/database.js';
import { CustomCode } from '../services/custom-code.js';
import { User } from '../services/user.js';
import { Invoice } from '../services/invoice.js';
import { UtDatabase } from '../utils/ut-database.js';
import crypto from 'crypto';
import redis from '../../modules/redis.js';

const router: express.Router = express.Router();

export = router;

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;
        let query: any = [];

        if (await UtPermission.isManager(req)) {
            req.query.search && query.push(`(userID in (select userID from \`${app}\`.t_user where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.name')) LIKE UPPER('%${req.query.search}%')))))`);
        } else {
            query.push(`userID=${db.escape(req.body.token.userID)}`);
        }
        if (req.query.type === 'minus') {
            query.push(`money<0`);
        } else if (req.query.type === 'plus') {
            query.push(`money>0`);
        }
        req.query.start_date && query.push(`created_time>${db.escape(req.query.start_date)}`);
        query.push(`status in (1,2)`);
        const data = await new UtDatabase(req.get('g-app') as string, `t_wallet`).querySql(query, req.query as any);
        for (const b of data.data) {
            let userData = (
                await db.query(
                    `select userData
                                            from \`${app}\`.t_user
                                            where userID = ?`,
                    [b.userID]
                )
            )[0];
            b.userData = userData && userData.userData;
        }
        return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/sum', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;

        return response.succ(resp, {
            sum:
                (
                    await db.query(
                        `SELECT sum(money)
                                  FROM \`${app}\`.t_wallet
                                  where status in (1, 2)
                                    and userID = ?`,
                        [req.query.userID || req.body.token.userID]
                    )
                )[0]['sum(money)'] || 0,
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;

        return response.succ(
            resp,
            await new Wallet(app, req.body.token).store({
                return_url: req.body.return_url,
                total: req.body.total,
                note: req.body.note,
                method: req.body.method,
            })
        );
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/withdraw', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;

        return response.succ(resp, {
            result: true,
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/withdraw', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;
        if (await UtPermission.isManager(req)) {
            await new Wallet(app, req.body.token).putWithdraw({
                id: req.body.id,
                status: req.body.status,
                note: req.body.note,
            });
            return response.succ(resp, {
                result: true,
            });
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/withdraw', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;
        let query: any = [];
        query.push(`status != -2`);
        const data = await new UtDatabase(req.get('g-app') as string, `t_withdraw`).querySql(query, req.query as any);
        for (const b of data.data) {
            let userData = (
                await db.query(
                    `select userData
                                            from \`${app}\`.t_user
                                            where userID = ?`,
                    [b.userID]
                )
            )[0];
            b.userData = userData && userData.userData;
        }
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, data);
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/withdraw', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            await new Wallet(req.get('g-app') as string, req.body.token).deleteWithDraw({
                id: req.body.id,
            });
            return response.succ(resp, {
                result: true,
            });
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/manager', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const app = req.get('g-app') as string;
            let orderID = new Date().getTime();
            for (const b of req.body.userID) {
                await db.execute(
                    `insert into \`${app}\`.t_wallet (orderID, userID, money, status, note)
                                  values (?, ?, ?, ?, ?)`,
                    [orderID++, b, req.body.total, 2, req.body.note]
                );
            }
            return response.succ(resp, {
                result: true,
            });
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
            await new Wallet(req.get('g-app') as string, req.body.token).delete({
                id: req.body.id,
            });
            return response.succ(resp, {
                result: true,
            });
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

const storage = multer.memoryStorage(); // 文件暫存
const upload = multer({ storage });
router.post('/notify', upload.single('file'), async (req: express.Request, resp: express.Response) => {
    try {
        const appName = req.query['g-app'] as string;
        const keyData = (
            await Private_config.getConfig({
                appName: appName,
                key: 'glitter_finance',
            })
        )[0].value;
        const url = new URL(`https://covert?${req.body.toString()}`);
        let decodeData: any = undefined;
        if (keyData.TYPE === 'ecPay') {
            let params: any = {};
            for (const b of url.searchParams.keys()) {
                params[b] = url.searchParams.get(b);
            }
            let od: any = Object.keys(params)
                .sort(function (a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                })
                .filter((dd) => {
                    return dd !== 'CheckMacValue';
                })
                .map((dd) => {
                    return `${dd.toLowerCase()}=${(params as any)[dd]}`;
                });
            let raw: any = od.join('&');
            raw = EcPay.urlEncode_dot_net(`HashKey=${keyData.HASH_KEY}&${raw.toLowerCase()}&HashIV=${keyData.HASH_IV}`);
            const chkSum = crypto.createHash('sha256').update(raw.toLowerCase()).digest('hex');
            decodeData = {
                Status: url.searchParams.get('RtnCode') === '1' && url.searchParams.get('CheckMacValue')!.toLowerCase() === chkSum ? `SUCCESS` : `ERROR`,
                Result: {
                    MerchantOrderNo: url.searchParams.get('MerchantTradeNo'),
                    CheckMacValue: url.searchParams.get('CheckMacValue'),
                },
            };
        } else if (keyData.TYPE === 'newWebPay') {
            decodeData = JSON.parse(
                await new EzPay(appName, {
                    HASH_IV: keyData.HASH_IV,
                    HASH_KEY: keyData.HASH_KEY,
                    ActionURL: keyData.ActionURL,
                    NotifyURL: ``,
                    ReturnURL: ``,
                    MERCHANT_ID: keyData.MERCHANT_ID,
                    TYPE: keyData.TYPE,
                }).decode(url.searchParams.get('TradeInfo') as string)
            );
        }
        if (decodeData['Status'] === 'SUCCESS') {
            await db.execute(
                `update \`${appName}\`.t_wallet
                              set status=?
                              where orderID = ?`,
                [1, decodeData['Result']['MerchantOrderNo']]
            );
        } else {
            await db.execute(
                `update \`${appName}\`.t_wallet
                              set status=?
                              where orderID = ?`,
                [-1, decodeData['Result']['MerchantOrderNo']]
            );
        }
        return response.succ(resp, {});
    } catch (err) {
        return response.fail(resp, err);
    }
});

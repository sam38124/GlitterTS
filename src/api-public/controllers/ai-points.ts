import express from 'express';
import multer from 'multer';
import response from '../../modules/response';
import exception from '../../modules/exception';
import db from '../../modules/database.js';
import { UtPermission } from '../utils/ut-permission.js';
import { Private_config } from '../../services/private_config.js';
import { EcPay, EzPay } from '../services/financial-service.js';
import { UtDatabase } from '../utils/ut-database.js';
import {AiPointes} from "../services/ai-pointes.js";
import {Invoice} from "../services/invoice.js";

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
        const data = await new UtDatabase(req.get('g-app') as string, `t_ai_points`).querySql(query, req.query as any);
        for (const b of data.data) {
            let userData = (
                await db.query(
                    `select userData from \`${app}\`.t_user where userID = ?
                    `,
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

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;
        return response.succ(
            resp,
            await new AiPointes(app, req.body.token).store({
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

router.delete('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            await new AiPointes(req.get('g-app') as string, req.body.token).delete({
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

router.get('/withdraw', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;
        let query: any = [];
        query.push(`status != -2`);
        const data = await new UtDatabase(req.get('g-app') as string, `t_withdraw`).querySql(query, req.query as any);
        for (const b of data.data) {
            let userData = (
                await db.query(
                    `select userData from \`${app}\`.t_user where userID = ?
                    `,
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

router.post('/withdraw', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, { result: true });
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.put('/withdraw', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;
        if (await UtPermission.isManager(req)) {
            await new AiPointes(app, req.body.token).putWithdraw({
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

router.delete('/withdraw', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            await new AiPointes(req.get('g-app') as string, req.body.token).deleteWithDraw({
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

router.get('/sum', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;
        return response.succ(resp, {
            sum:
                (
                    await db.query(
                        `SELECT sum(money) FROM \`${app}\`.t_ai_points
                            WHERE status in (1, 2) AND userID = ?`,
                        [req.query.userID || req.body.token.userID]
                    )
                )[0]['sum(money)'] || 0,
        });
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
                    `insert into \`${app}\`.t_ai_points (orderID, userID, money, status, note)
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

const storage = multer.memoryStorage(); // 文件暫存
const upload = multer({ storage });
router.post('/notify', upload.single('file'), async (req: express.Request, resp: express.Response) => {
    try {
        let decodeData = undefined;
        const appName = req.query['g-app'] as string;
        const type=req.query['type'] as string;
        const keyData = (
            await Private_config.getConfig({
                appName: appName,
                key: 'glitter_finance',
            })
        )[0].value[type];


        if (type === 'ecPay') {
            const responseCheckMacValue = `${req.body.CheckMacValue}`;
            delete req.body.CheckMacValue;
            const chkSum = EcPay.generateCheckMacValue(req.body, keyData.HASH_KEY, keyData.HASH_IV);
            decodeData = {
                Status: req.body.RtnCode === '1' && responseCheckMacValue === chkSum ? 'SUCCESS' : 'ERROR',
                Result: {
                    MerchantOrderNo: req.body.MerchantTradeNo,
                    CheckMacValue: req.body.CheckMacValue,
                },
            };
        }
        if (type === 'newWebPay') {
            decodeData = JSON.parse(
                new EzPay(appName, {
                    HASH_IV: keyData.HASH_IV,
                    HASH_KEY: keyData.HASH_KEY,
                    ActionURL: keyData.ActionURL,
                    NotifyURL: '',
                    ReturnURL: '',
                    MERCHANT_ID: keyData.MERCHANT_ID,
                    TYPE: type,
                }).decode(req.body.TradeInfo)
            );
        }

        if (decodeData['Status'] === 'SUCCESS') {
            await db.execute(
                `update \`${appName}\`.t_ai_points set status=? where orderID = ?
                `,
                [1, decodeData['Result']['MerchantOrderNo']]
            );
            const data=(await db.query(`select * from \`${appName}\`.t_ai_points where orderID=?`,[decodeData['Result']['MerchantOrderNo']]))[0]
             new Invoice(appName).postCheckoutInvoice({
                 lineItems:[
                     {
                         ItemName:`AI Points 儲值${data.money.toLocaleString()}點`,
                         count:1,
                         sale_price:data.money/10,
                         spec:[]
                     }
                 ],
                 user_info:data.note.invoice_data,
                 total:data.money/10,
                 orderID:decodeData['Result']['MerchantOrderNo']
            }, false);
        } else {
            await db.execute(
                `update \`${appName}\`.t_ai_points set status=? where orderID = ?
                `,
                [-1, decodeData['Result']['MerchantOrderNo']]
            );
        }
        return response.succ(resp, {});
    } catch (err) {
        console.error(err);
        return response.fail(resp, err);
    }
});

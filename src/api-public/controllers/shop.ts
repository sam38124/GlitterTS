import express from 'express';
import response from '../../modules/response';
import multer from 'multer';
import exception from '../../modules/exception';
import { Shopping } from '../services/shopping';
import { UtPermission } from '../utils/ut-permission';
import { EcPay, EzPay } from '../services/financial-service.js';
import { Private_config } from '../../services/private_config.js';
import db from '../../modules/database.js';
import { IToken } from '../models/Auth.js';
import { Invoice } from '../services/invoice.js';
import { User } from '../services/user.js';
import { CustomCode } from '../services/custom-code.js';
import { UtDatabase } from '../utils/ut-database.js';
import { Post } from '../services/post.js';
import crypto from 'crypto';
import redis from '../../modules/redis.js';

const router: express.Router = express.Router();

export = router;

router.get('/rebate/sum', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;
        await new User(app).checkRebate(req.query.userID || req.body.token.userID);
        return response.succ(resp, {
            sum:
                (
                    await db.query(
                        `SELECT sum(money)
                         FROM \`${app}\`.t_rebate
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
router.get('/product', async (req: express.Request, resp: express.Response) => {
    try {
        const shopping = await new Shopping(req.get('g-app') as string, req.body.token).getProduct({
            page: (req.query.page ?? 0) as number,
            limit: (req.query.limit ?? 50) as number,
            search: req.query.search as string,
            sku: req.query.sku as string,
            id: req.query.id as string,
            collection: req.query.collection as string,
            min_price: req.query.min_price as string,
            max_price: req.query.max_price as string,
            status: req.query.status as string,
            id_list: req.query.id_list as string,
            order_by: (() => {
                switch (req.query.order_by) {
                    case 'max_price':
                        return `order by (CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.max_price')) AS SIGNED))  desc`;
                    case 'min_price':
                        return `order by (CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.min_price')) AS SIGNED))  asc`;
                    default:
                        return `order by id desc`;
                }
            })(),
            with_hide_index: req.query.with_hide_index as string,
        });
        return response.succ(resp, shopping);
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/rebate', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;
        let query: any = [];

        if (await UtPermission.isManager(req)) {
            req.query.search && query.push(`(userID in (select userID from \`${app}\`.t_user where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.name')) LIKE UPPER('%${req.query.search}%')))))`);
            if (req.query.id && `${req.query.id}`.length > 0) {
                query.push(`userID=${db.escape(req.query.id)}`);
            }
        } else {
            query.push(`userID=${db.escape(req.body.token.userID)}`);
        }
        query.push(`status in (1, 2)`);
        req.query.dataType === 'all' && delete req.query.id;
        const data = await new UtDatabase(req.get('g-app') as string, `t_rebate`).querySql(query, req.query as any);

        if (Array.isArray(data.data)) {
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
        } else {
            let userData = (
                await db.query(
                    `select userData
                     from \`${app}\`.t_user
                     where userID = ?`,
                    [data.data.userID]
                )
            )[0];
            data.data.userData = userData && userData.userData;
        }

        return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/rebate/manager', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const app = req.get('g-app') as string;
            let orderID = new Date().getTime();
            for (const b of req.body.userID) {
                await db.execute(
                    `insert into \`${app}\`.t_rebate (orderID, userID, money, status, note)
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
router.delete('/rebate', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            await new Shopping(req.get('g-app') as string, req.body.token).deleteRebate({
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
router.delete('/product', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            await new Shopping(req.get('g-app') as string, req.body.token).deleteProduct({
                id: req.query.id as string,
            });
            return response.succ(resp, { result: true });
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/checkout', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(
            resp,
            await new Shopping(req.get('g-app') as string, req.body.token).toCheckout({
                lineItems: req.body.line_items as any,
                email: (req.body.token && req.body.token.account) || req.body.email,
                return_url: req.body.return_url,
                user_info: req.body.user_info,
                code: req.body.code,
                use_rebate: (() => {
                    if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
                        return req.body.use_rebate;
                    } else {
                        return 0;
                    }
                })(),
            })
        );
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/checkout/preview', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(
            resp,
            await new Shopping(req.get('g-app') as string, req.body.token).toCheckout(
                {
                    lineItems: req.body.line_items as any,
                    email: (req.body.token && req.body.token.account) || req.body.email,
                    return_url: req.body.return_url,
                    user_info: req.body.user_info,
                    code: req.body.code,
                    use_rebate: (() => {
                        if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
                            return req.body.use_rebate;
                        } else {
                            return 0;
                        }
                    })(),
                },
                'preview'
            )
        );
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/order', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
                resp,
                await new Shopping(req.get('g-app') as string, req.body.token).getCheckOut({
                    page: (req.query.page ?? 0) as number,
                    limit: (req.query.limit ?? 50) as number,
                    search: req.query.search as string,
                    id: req.query.id as string,
                    email: req.query.email as string,
                })
            );
        } else if (await UtPermission.isAppUser(req)) {
            const user_data = await new User(req.get('g-app') as string, req.body.token).getUserData(req.body.token.userID as any, 'userID');
            return response.succ(
                resp,
                await new Shopping(req.get('g-app') as string, req.body.token).getCheckOut({
                    page: (req.query.page ?? 0) as number,
                    limit: (req.query.limit ?? 50) as number,
                    search: req.query.search as string,
                    id: req.query.id as string,
                    email: user_data.account,
                })
            );
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/order', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
                resp,
                await new Shopping(req.get('g-app') as string, req.body.token).putOrder({
                    id: req.body.id,
                    orderData: req.body.order_data,
                    status: req.body.status || undefined,
                })
            );
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/order', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
                resp,
                await new Shopping(req.get('g-app') as string, req.body.token).deleteOrder({
                    id: req.body.id as string,
                })
            );
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/voucher', async (req: express.Request, resp: express.Response) => {
    try {
        let query = [`(content->>'$.type'='voucher')`];
        req.query.search && query.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${req.query.search}%'))`);
        return response.succ(
            resp,
            await new Shopping(req.get('g-app') as string, req.body.token).querySql(query, {
                page: (req.query.page ?? 0) as number,
                limit: (req.query.limit ?? 50) as number,
                id: req.query.id as string,
            })
        );
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/voucher', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            await new Shopping(req.get('g-app') as string, req.body.token).deleteVoucher({
                id: req.query.id as string,
            });
            return response.succ(resp, { result: true });
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/redirect', async (req: express.Request, resp: express.Response) => {
    try {
        let return_url = new URL((await redis.getValue(req.query.return as string)) as any);
        return resp.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>

<body>
    <script>
        try {
            window.webkit.messageHandlers.addJsInterFace.postMessage(JSON.stringify({
                functionName: 'closeWebView',
                callBackId: 0,
                data: {}
            }));

        } catch (e) { }
        location.href = '${return_url.href}';
    </script>
</body>

</html>
`);
    } catch (err) {
        return response.fail(resp, err);
    }
});
const storage = multer.memoryStorage(); // 将文件存储在内存中
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
        } else {
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
            const notProgress = (
                await db.query(
                    `SELECT count(1)
                     FROM \`${appName}\`.t_checkout
                     where cart_token = ?
                       and status = 0;`,
                    [decodeData['Result']['MerchantOrderNo']]
                )
            )[0]['count(1)'];
            if (notProgress) {
                await db.execute(
                    `update \`${appName}\`.t_checkout
                     set status=?
                     where cart_token = ?`,
                    [1, decodeData['Result']['MerchantOrderNo']]
                );
                const cartData = (
                    await db.query(
                        `SELECT *
                         FROM \`${appName}\`.t_checkout
                         where cart_token = ?;`,
                        [decodeData['Result']['MerchantOrderNo']]
                    )
                )[0];
                const userData = await new User(appName).getUserData(cartData.email, 'account');
                if (cartData.orderData.rebate > 0) {
                    await db.query(`update \`${appName}\`.t_rebate set status=1 where orderID=?;`, [cartData.cart_token]);
                }
                try {
                    await new CustomCode(appName).checkOutHook({
                        userData: userData,
                        cartData: cartData,
                    });
                } catch (e) {
                    console.log(`webHookError`);
                    console.log(e);
                }
                new Invoice(appName).postCheckoutInvoice(decodeData['Result']['MerchantOrderNo']);
            }
        } else {
            await db.execute(
                `update \`${appName}\`.t_checkout
                 set status=?
                 where cart_token = ?`,
                [-1, decodeData['Result']['MerchantOrderNo']]
            );
        }
        return response.succ(resp, {});
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/wishlist', async (req: express.Request, resp: express.Response) => {
    try {
        let query = [`(content->>'$.type'='wishlist')`, `userID = ${req.body.token.userID}`];
        const data = await new UtDatabase(req.get('g-app') as string, `t_post`).querySql(query, req.query as any);

        return response.succ(
            resp,
            await new UtDatabase(req.get('g-app') as string, `t_manager_post`).querySql(
                [
                    `id in (${['0']
                        .concat(
                            data.data.map((dd: any) => {
                                return dd.content.product_id;
                            })
                        )
                        .join(',')})`,
                ],
                req.query as any
            )
        );
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/checkWishList', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {
            result:
                (
                    await db.query(
                        `select count(1)
                         FROM \`${req.get('g-app') as string}\`.t_post
                         where (content ->>'$.type'='wishlist')
                           and userID = ?
                           and (content ->>'$.product_id'=${req.query.product_id})
                        `,
                        [req.body.token.userID]
                    )
                )[0]['count(1)'] == '1',
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/wishlist', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new Post(req.get('g-app') as string, req.body.token);
        await db.query(
            `delete
             FROM \`${req.get('g-app') as string}\`.t_post
             where (content ->>'$.type'='wishlist')
               and userID = ?
               and (content ->>'$.product_id'=${req.body.product_id})
            `,
            [req.body.token.userID]
        );
        const postData = {
            product_id: req.body.product_id,
            userID: (req.body.token && req.body.token.userID) || 0,
            type: 'wishlist',
        };
        if (req.body.product_id) {
            await post.postContent(
                {
                    userID: postData.userID,
                    content: JSON.stringify(postData),
                },
                't_post'
            );
        }
        return response.succ(resp, { result: true });
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/wishlist', async (req: express.Request, resp: express.Response) => {
    try {
        await db.query(
            `delete
             FROM \`${req.get('g-app') as string}\`.t_post
             where (content ->>'$.type'='wishlist')
               and userID = ?
               and (content ->>'$.product_id'=${req.body.product_id})
            `,
            [req.body.token.userID]
        );
        return response.succ(resp, { result: true });
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/dataAnalyze', async (req: express.Request, resp: express.Response) => {
    try {
        const tags = `${req.query.tags}`;
        const fake = {
            'g-app': 'shop-template-clothing-v3',
            Authorization: {
                account: 'service@ncdesign.info',
                userID: 252530754,
                iat: 1714557766,
                exp: 1746093766,
                userData: {},
            },
        };

        if (await UtPermission.isManager(req)) {
            return response.succ(
                resp,
                await new Shopping(req.get('g-app') as string, req.body.token).getDataAnalyze(tags.split(','))
                // await new Shopping(fake['g-app'], fake['Authorization']).getDataAnalyze(tags.split(','))
            );
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/collection/products', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Shopping(req.get('g-app') as string, req.body.token).getCollectionProducts(`${req.query.tag}`));
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/collection', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Shopping(req.get('g-app') as string, req.body.token).putCollection(req.body.data));
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/collection', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Shopping(req.get('g-app') as string, req.body.token).deleteCollection(req.body.data));
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/payment/method', async (req: express.Request, resp: express.Response) => {
    try {
        const keyData = (
            await Private_config.getConfig({
                appName: req.get('g-app') as string,
                key: 'glitter_finance',
            })
        )[0].value;

        return response.succ(resp, {
            method: [
                {
                    value: 'credit',
                    title: '信用卡',
                },
                {
                    value: 'atm',
                    title: 'ATM',
                },
                {
                    value: 'web_atm',
                    title: '網路ATM',
                },
                {
                    value: 'c_code',
                    title: '超商代碼',
                },
                {
                    value: 'c_bar_code',
                    title: '超商條碼',
                },
            ].filter((dd) => {
                return keyData[dd.value] && keyData.TYPE !== 'off_line';
            }),
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});

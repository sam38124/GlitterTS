import express from 'express';
import response from '../../modules/response';
import multer from 'multer';
import exception from '../../modules/exception';
import db from '../../modules/database.js';
import crypto from 'crypto';
import redis from '../../modules/redis.js';
import { UtDatabase } from '../utils/ut-database.js';
import { UtPermission } from '../utils/ut-permission';
import { EcPay, EzPay } from '../services/financial-service.js';
import { Private_config } from '../../services/private_config.js';
import { User } from '../services/user.js';
import { Post } from '../services/post.js';
import { Shopping } from '../services/shopping';
import { Rebate, IRebateSearch } from '../services/rebate';

const router: express.Router = express.Router();

export = router;

// 回饋金
router.get('/rebate', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;
        const rebateClass = new Rebate(app);

        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await rebateClass.getRebateListByRow(req.query as unknown as IRebateSearch));
        }

        const user = await new User(app).getUserData(req.body.token.userID, 'userID');
        if (user.id) {
            const historyList = await rebateClass.getCustomerRebateHistory({ user_id: req.body.token.userID });
            const oldest = await rebateClass.getOldestRebate(req.body.token.userID);
            const historyMaps = historyList
                ? historyList.data.map((item: any) => {
                      return {
                          id: item.id,
                          orderID: item.content.order_id ?? '',
                          userID: item.user_id,
                          money: item.origin,
                          remain: item.remain,
                          status: 1,
                          note: item.note,
                          created_time: item.created_at,
                          deadline: item.deadline,
                          userData: user.userData,
                      };
                  })
                : [];
            return response.succ(resp, { data: historyMaps, oldest: oldest?.data });
        }
        return response.fail(resp, '使用者不存在');
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/rebate/sum', async (req: express.Request, resp: express.Response) => {
    try {
        const app = req.get('g-app') as string;
        const rebateClass = new Rebate(app);
        const data = await rebateClass.getOneRebate({ user_id: req.query.userID || req.body.token.userID });
        const main = await rebateClass.mainStatus();
        return response.succ(resp, { main: main, sum: data ? data.point : 0 });
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/rebate/manager', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const app = req.get('g-app') as string;
            let orderID = new Date().getTime();

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

// 結帳付款
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
                customer_info: req.body.customer_info,
                use_rebate: (() => {
                    if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
                        return req.body.use_rebate;
                    } else {
                        return 0;
                    }
                })(),
                custom_form_format:req.body.custom_form_format,
                custom_form_data:req.body.custom_form_data
            })
        );
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/checkout/repay', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(
            resp,
            await new Shopping(req.get('g-app') as string, req.body.token).toCheckout(
                {
                    return_url: req.body.return_url,
                } as any,
                'add',
                req.body.order_id
            )
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
router.post('/manager/checkout', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
                resp,
                await new Shopping(req.get('g-app') as string, req.body.token).toCheckout(
                    {
                        lineItems: req.body.lineItems as any,
                        email: req.body.customer_info.email,
                        return_url: req.body.return_url,
                        user_info: req.body.user_info,
                        checkOutType: 'manual',
                        voucher: req.body.voucher,
                        customer_info: req.body.customer_info,
                        discount: req.body.discount,
                        total: req.body.total,
                        pay_status: req.body.pay_status,
                    },
                    'manual'
                )
            );
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/manager/checkout/preview', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
                resp,
                await new Shopping(req.get('g-app') as string, req.body.token).toCheckout(
                    {
                        lineItems: req.body.line_items as any,
                        email: (req.body.token && req.body.token.account) || req.body.email,
                        return_url: req.body.return_url,
                        user_info: req.body.user_info,
                        use_rebate: (() => {
                            if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
                                return req.body.use_rebate;
                            } else {
                                return 0;
                            }
                        })(),
                    },
                    'manual-preview'
                )
            );
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

// 訂單
router.get('/order', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            //管理員
            return response.succ(
                resp,
                await new Shopping(req.get('g-app') as string, req.body.token).getCheckOut({
                    page: (req.query.page ?? 0) as number,
                    limit: (req.query.limit ?? 50) as number,
                    search: req.query.search as string,
                    id: req.query.id as string,
                    email: req.query.email as string,
                    status: req.query.status as string,
                    searchType: req.query.searchType as string,
                    shipment: req.query.shipment as string,
                    progress: req.query.progress as string,
                    orderStatus: req.query.orderStatus as string,
                    created_time: req.query.created_time as string,
                    orderString: req.query.orderString as string,
                    archived: req.query.archived as string,
                })
            );
        } else if (await UtPermission.isAppUser(req)) {
            //已登入用戶
            const user_data = await new User(req.get('g-app') as string, req.body.token).getUserData(req.body.token.userID as any, 'userID');
            return response.succ(
                resp,
                await new Shopping(req.get('g-app') as string, req.body.token).getCheckOut({
                    page: (req.query.page ?? 0) as number,
                    limit: (req.query.limit ?? 50) as number,
                    search: req.query.search as string,
                    id: req.query.id as string,
                    email: user_data.account,
                    status: req.query.status as string,
                    searchType: req.query.searchType as string,
                })
            );
        } else if (req.query.search) {
            //未登入訪客
            return response.succ(
                resp,
                await new Shopping(req.get('g-app') as string, req.body.token).getCheckOut({
                    page: (req.query.page ?? 0) as number,
                    limit: (req.query.limit ?? 50) as number,
                    search: req.query.search as string,
                    id: req.query.id as string,
                    status: req.query.status as string,
                    searchType: req.query.searchType as string,
                })
            );
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/order/payment-method', async (req: express.Request, resp: express.Response) => {
    try {
        const keyData = (
            await Private_config.getConfig({
                appName: req.get('g-app') as string,
                key: 'glitter_finance',
            })
        )[0].value;
        //清空敏感資料
        ['MERCHANT_ID', 'HASH_KEY', 'HASH_IV'].map((dd) => {
            delete keyData[dd];
        });
        return response.succ(resp, keyData);
    } catch (e) {}
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
router.put('/order/proof-purchase', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, await new Shopping(req.get('g-app') as string, req.body.token).proofPurchase(req.body.order_id, req.body.text));
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

// 優惠券
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

// 重導向
async function redirect_link(req: express.Request, resp: express.Response) {
    try {
        let return_url = new URL((await redis.getValue(req.query.return as string)) as any);
        const html = String.raw;
        return resp.send(html`<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <title>Title</title>
                </head>
                <body>
                    <script>
                        try {
                            window.webkit.messageHandlers.addJsInterFace.postMessage(
                                JSON.stringify({
                                    functionName: 'closeWebView',
                                    callBackId: 0,
                                    data: {
                                        redirect: '${return_url.href}',
                                    },
                                })
                            );
                        } catch (e) {}
                        location.href = '${return_url.href}';
                    </script>
                </body>
            </html> `);
    } catch (err) {
        return response.fail(resp, err);
    }
}
router.get('/redirect', redirect_link);
router.post('/redirect', redirect_link);

// 執行訂單結帳與付款事項
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.get('/testRelease', async (req: express.Request, resp: express.Response) => {
    try {
        const test = true;
        const appName = req.get('g-app') as string;
        if (test) {
            await new Shopping(appName).releaseCheckout(1, req.query.orderId + '');
        }
        return response.succ(resp, {});
    } catch (err) {
        return response.fail(resp, err);
    }
});
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

        // 執行付款完成之訂單事件
        if (decodeData['Status'] === 'SUCCESS') {
            await new Shopping(appName).releaseCheckout(1, decodeData['Result']['MerchantOrderNo']);
        } else {
            await new Shopping(appName).releaseCheckout(-1, decodeData['Result']['MerchantOrderNo']);
        }
        return response.succ(resp, {});
    } catch (err) {
        return response.fail(resp, err);
    }
});

// 許願池
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

// 資料分析
router.get('/dataAnalyze', async (req: express.Request, resp: express.Response) => {
    try {
        const tags = `${req.query.tags}`;
        const fake = {
            'g-app': 't_1719819344426',
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

// 商品類別
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
            return response.succ(resp, await new Shopping(req.get('g-app') as string, req.body.token).putCollection(req.body.replace, req.body.original));
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

// 產品
router.get('/product', async (req: express.Request, resp: express.Response) => {
    try {
        const shopping = await new Shopping(req.get('g-app') as string, req.body.token).getProduct({
            page: (req.query.page ?? 0) as number,
            limit: (req.query.limit ?? 50) as number,
            search: req.query.search as string,
            searchType: req.query.searchType as string,
            sku: req.query.sku as string,
            id: req.query.id as string,
            collection: req.query.collection as string,
            accurate_search_collection: req.query.accurate_search_collection === 'true',
            min_price: req.query.min_price as string,
            max_price: req.query.max_price as string,
            status: req.query.status as string,
            id_list: req.query.id_list as string,
            order_by: (() => {
                switch (req.query.order_by) {
                    case 'title':
                        return `order by JSON_EXTRACT(content, '$.title')`;
                    case 'max_price':
                        return `order by (CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.max_price')) AS SIGNED)) desc`;
                    case 'min_price':
                        return `order by (CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.min_price')) AS SIGNED)) asc`;
                    case 'created_time_desc':
                        return `order by created_time desc`;
                    case 'created_time_asc':
                        return `order by created_time`;
                    case 'updated_time_desc':
                        return `order by updated_time desc`;
                    case 'updated_time_asc':
                        return `order by updated_time`;
                    case 'stock_desc':
                        return ``;
                    case 'stock_asc':
                        return ``;
                    case 'default':
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
router.get('/product/variants', async (req: express.Request, resp: express.Response) => {
    try {
        const shopping = await new Shopping(req.get('g-app') as string, req.body.token).getVariants({
            page: (req.query.page ?? 0) as number,
            limit: (req.query.limit ?? 50) as number,
            search: req.query.search as string,
            searchType: req.query.searchType as string,
            id: req.query.id as string,
            collection: req.query.collection as string,
            accurate_search_collection: req.query.accurate_search_collection === 'true',
            status: req.query.status as string,
            id_list: req.query.id_list as string,
            order_by: req.query.order_by as string,
            stockCount: req.query.stockCount as string,
        });
        return response.succ(resp, shopping);
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/product', async (req: express.Request, resp: express.Response) => {
    try {
        if (!(await UtPermission.isManager(req))) {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        } else {
            return response.succ(resp, {
                result: true,
                id: await new Shopping(req.get('g-app') as string, req.body.token).postProduct(req.body),
            });
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/product/multiple', async (req: express.Request, resp: express.Response) => {
    try {
        if (!(await UtPermission.isManager(req))) {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        } else {
            return response.succ(resp, {
                result: true,
                id: await new Shopping(req.get('g-app') as string, req.body.token).postMulProduct(req.body),
            });
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/product', async (req: express.Request, resp: express.Response) => {
    try {
        if (!(await UtPermission.isManager(req))) {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        } else {
            return response.succ(resp, {
                result: true,
                id: await new Shopping(req.get('g-app') as string, req.body.token).putProduct(req.body),
            });
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/product/variants', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Shopping(req.get('g-app') as string, req.body.token).putVariants(req.body));
        } else {
            throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
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

// 登入選項
router.get('/check-login-for-order', async (req: express.Request, resp: express.Response) => {
    try {
        const keyData = await new User(req.get('g-app') as string).getConfigV2({
            user_id: 'manager',
            key: 'login_config',
        });

        return response.succ(resp, {
            result: keyData.login_in_to_order,
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});

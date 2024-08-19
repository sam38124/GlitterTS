"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const multer_1 = __importDefault(require("multer"));
const exception_1 = __importDefault(require("../../modules/exception"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const crypto_1 = __importDefault(require("crypto"));
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const ut_database_js_1 = require("../utils/ut-database.js");
const ut_permission_1 = require("../utils/ut-permission");
const financial_service_js_1 = require("../services/financial-service.js");
const private_config_js_1 = require("../../services/private_config.js");
const user_js_1 = require("../services/user.js");
const post_js_1 = require("../services/post.js");
const shopping_1 = require("../services/shopping");
const rebate_1 = require("../services/rebate");
const router = express_1.default.Router();
router.get('/rebate', async (req, resp) => {
    try {
        const app = req.get('g-app');
        const rebateClass = new rebate_1.Rebate(app);
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await rebateClass.getRebateListByRow(req.query));
        }
        const user = await new user_js_1.User(app).getUserData(req.body.token.userID, 'userID');
        if (user.id) {
            const historyList = await rebateClass.getCustomerRebateHistory({ user_id: req.body.token.userID });
            const oldest = await rebateClass.getOldestRebate(req.body.token.userID);
            const historyMaps = historyList
                ? historyList.data.map((item) => {
                    var _a;
                    return {
                        id: item.id,
                        orderID: (_a = item.content.order_id) !== null && _a !== void 0 ? _a : '',
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
            return response_1.default.succ(resp, { data: historyMaps, oldest: oldest === null || oldest === void 0 ? void 0 : oldest.data });
        }
        return response_1.default.fail(resp, '使用者不存在');
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/rebate/sum', async (req, resp) => {
    try {
        const app = req.get('g-app');
        const rebateClass = new rebate_1.Rebate(app);
        const data = await rebateClass.getOneRebate({ user_id: req.query.userID || req.body.token.userID });
        const main = await rebateClass.mainStatus();
        return response_1.default.succ(resp, { main: main, sum: data ? data.point : 0 });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/rebate/manager', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            const app = req.get('g-app');
            let orderID = new Date().getTime();
            return response_1.default.succ(resp, {
                result: true,
            });
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/rebate', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, {
                result: true,
            });
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/checkout', async (req, resp) => {
    try {
        return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).toCheckout({
            lineItems: req.body.line_items,
            email: (req.body.token && req.body.token.account) || req.body.email,
            return_url: req.body.return_url,
            user_info: req.body.user_info,
            code: req.body.code,
            customer_info: req.body.customer_info,
            use_rebate: (() => {
                if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
                    return req.body.use_rebate;
                }
                else {
                    return 0;
                }
            })(),
            custom_form_format: req.body.custom_form_format,
            custom_form_data: req.body.custom_form_data,
            distribution_code: req.body.distribution_code,
        }));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/checkout/repay', async (req, resp) => {
    try {
        return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).toCheckout({
            return_url: req.body.return_url,
        }, 'add', req.body.order_id));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/checkout/preview', async (req, resp) => {
    try {
        return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).toCheckout({
            lineItems: req.body.line_items,
            email: (req.body.token && req.body.token.account) || req.body.email,
            return_url: req.body.return_url,
            user_info: req.body.user_info,
            code: req.body.code,
            use_rebate: (() => {
                if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
                    return req.body.use_rebate;
                }
                else {
                    return 0;
                }
            })(),
            distribution_code: req.body.distribution_code,
        }, 'preview'));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/manager/checkout', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).toCheckout({
                lineItems: req.body.lineItems,
                email: req.body.customer_info.email,
                return_url: req.body.return_url,
                user_info: req.body.user_info,
                checkOutType: 'manual',
                voucher: req.body.voucher,
                customer_info: req.body.customer_info,
                discount: req.body.discount,
                total: req.body.total,
                pay_status: req.body.pay_status,
            }, 'manual'));
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/manager/checkout/preview', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).toCheckout({
                lineItems: req.body.line_items,
                email: (req.body.token && req.body.token.account) || req.body.email,
                return_url: req.body.return_url,
                user_info: req.body.user_info,
                use_rebate: (() => {
                    if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
                        return req.body.use_rebate;
                    }
                    else {
                        return 0;
                    }
                })(),
            }, 'manual-preview'));
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/order', async (req, resp) => {
    var _a, _b, _c, _d, _e, _f;
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).getCheckOut({
                page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
                limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
                search: req.query.search,
                id: req.query.id,
                email: req.query.email,
                status: req.query.status,
                searchType: req.query.searchType,
                shipment: req.query.shipment,
                progress: req.query.progress,
                orderStatus: req.query.orderStatus,
                created_time: req.query.created_time,
                orderString: req.query.orderString,
                archived: req.query.archived,
                returnSearch: req.query.returnSearch,
            }));
        }
        else if (await ut_permission_1.UtPermission.isAppUser(req)) {
            const user_data = await new user_js_1.User(req.get('g-app'), req.body.token).getUserData(req.body.token.userID, 'userID');
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).getCheckOut({
                page: ((_c = req.query.page) !== null && _c !== void 0 ? _c : 0),
                limit: ((_d = req.query.limit) !== null && _d !== void 0 ? _d : 50),
                search: req.query.search,
                id: req.query.id,
                email: user_data.account,
                status: req.query.status,
                searchType: req.query.searchType,
            }));
        }
        else if (req.query.search) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).getCheckOut({
                page: ((_e = req.query.page) !== null && _e !== void 0 ? _e : 0),
                limit: ((_f = req.query.limit) !== null && _f !== void 0 ? _f : 50),
                search: req.query.search,
                id: req.query.id,
                status: req.query.status,
                searchType: req.query.searchType,
            }));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/order/payment-method', async (req, resp) => {
    try {
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: req.get('g-app'),
            key: 'glitter_finance',
        }))[0].value;
        ['MERCHANT_ID', 'HASH_KEY', 'HASH_IV'].map((dd) => {
            delete keyData[dd];
        });
        return response_1.default.succ(resp, keyData);
    }
    catch (e) { }
});
router.get('/payment/method', async (req, resp) => {
    try {
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: req.get('g-app'),
            key: 'glitter_finance',
        }))[0].value;
        return response_1.default.succ(resp, {
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
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/order/proof-purchase', async (req, resp) => {
    try {
        return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).proofPurchase(req.body.order_id, req.body.text));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/order', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).putOrder({
                id: req.body.id,
                orderData: req.body.order_data,
                status: req.body.status || undefined,
            }));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/order', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).deleteOrder({
                id: req.body.id,
            }));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/returnOrder', async (req, resp) => {
    var _a, _b;
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).getReturnOrder({
                page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
                limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
                search: req.query.search,
                id: req.query.id,
                email: req.query.email,
                status: req.query.status,
                searchType: req.query.searchType,
                progress: req.query.progress,
                created_time: req.query.created_time,
                orderString: req.query.orderString,
                archived: req.query.archived,
            }));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/returnOrder', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).putReturnOrder({
                id: req.body.id,
                orderData: req.body.data,
                status: req.body.status || '0',
            }));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/returnOrder', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).createReturnOrder(req.body));
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/voucher', async (req, resp) => {
    var _a, _b;
    try {
        let query = [`(content->>'$.type'='voucher')`];
        req.query.search && query.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${req.query.search}%'))`);
        return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).querySql(query, {
            page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
            limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
            id: req.query.id,
        }));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/voucher', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            await new shopping_1.Shopping(req.get('g-app'), req.body.token).deleteVoucher({
                id: req.query.id,
            });
            return response_1.default.succ(resp, { result: true });
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
async function redirect_link(req, resp) {
    try {
        let return_url = new URL((await redis_js_1.default.getValue(req.query.return)));
        const html = String.raw;
        return resp.send(html `<!DOCTYPE html>
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
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
}
router.get('/redirect', redirect_link);
router.post('/redirect', redirect_link);
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.get('/testRelease', async (req, resp) => {
    try {
        const test = true;
        const appName = req.get('g-app');
        if (test) {
            await new shopping_1.Shopping(appName).releaseCheckout(1, req.query.orderId + '');
        }
        return response_1.default.succ(resp, {});
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/notify', upload.single('file'), async (req, resp) => {
    try {
        const appName = req.query['g-app'];
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: appName,
            key: 'glitter_finance',
        }))[0].value;
        const url = new URL(`https://covert?${req.body.toString()}`);
        let decodeData = undefined;
        if (keyData.TYPE === 'ecPay') {
            let params = {};
            for (const b of url.searchParams.keys()) {
                params[b] = url.searchParams.get(b);
            }
            let od = Object.keys(params)
                .sort(function (a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            })
                .filter((dd) => {
                return dd !== 'CheckMacValue';
            })
                .map((dd) => {
                return `${dd.toLowerCase()}=${params[dd]}`;
            });
            let raw = od.join('&');
            raw = financial_service_js_1.EcPay.urlEncode_dot_net(`HashKey=${keyData.HASH_KEY}&${raw.toLowerCase()}&HashIV=${keyData.HASH_IV}`);
            const chkSum = crypto_1.default.createHash('sha256').update(raw.toLowerCase()).digest('hex');
            decodeData = {
                Status: url.searchParams.get('RtnCode') === '1' && url.searchParams.get('CheckMacValue').toLowerCase() === chkSum ? `SUCCESS` : `ERROR`,
                Result: {
                    MerchantOrderNo: url.searchParams.get('MerchantTradeNo'),
                    CheckMacValue: url.searchParams.get('CheckMacValue'),
                },
            };
        }
        else {
            decodeData = JSON.parse(await new financial_service_js_1.EzPay(appName, {
                HASH_IV: keyData.HASH_IV,
                HASH_KEY: keyData.HASH_KEY,
                ActionURL: keyData.ActionURL,
                NotifyURL: ``,
                ReturnURL: ``,
                MERCHANT_ID: keyData.MERCHANT_ID,
                TYPE: keyData.TYPE,
            }).decode(url.searchParams.get('TradeInfo')));
        }
        if (decodeData['Status'] === 'SUCCESS') {
            await new shopping_1.Shopping(appName).releaseCheckout(1, decodeData['Result']['MerchantOrderNo']);
        }
        else {
            await new shopping_1.Shopping(appName).releaseCheckout(-1, decodeData['Result']['MerchantOrderNo']);
        }
        return response_1.default.succ(resp, {});
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/wishlist', async (req, resp) => {
    try {
        let query = [`(content->>'$.type'='wishlist')`, `userID = ${req.body.token.userID}`];
        const data = await new ut_database_js_1.UtDatabase(req.get('g-app'), `t_post`).querySql(query, req.query);
        return response_1.default.succ(resp, await new ut_database_js_1.UtDatabase(req.get('g-app'), `t_manager_post`).querySql([
            `id in (${['0']
                .concat(data.data.map((dd) => {
                return dd.content.product_id;
            }))
                .join(',')})`,
        ], req.query));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/checkWishList', async (req, resp) => {
    try {
        return response_1.default.succ(resp, {
            result: (await database_js_1.default.query(`select count(1)
                         FROM \`${req.get('g-app')}\`.t_post
                         where (content ->>'$.type'='wishlist')
                           and userID = ?
                           and (content ->>'$.product_id'=${req.query.product_id})
                        `, [req.body.token.userID]))[0]['count(1)'] == '1',
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/wishlist', async (req, resp) => {
    try {
        const post = new post_js_1.Post(req.get('g-app'), req.body.token);
        await database_js_1.default.query(`delete
             FROM \`${req.get('g-app')}\`.t_post
             where (content ->>'$.type'='wishlist')
               and userID = ?
               and (content ->>'$.product_id'=${req.body.product_id})
            `, [req.body.token.userID]);
        const postData = {
            product_id: req.body.product_id,
            userID: (req.body.token && req.body.token.userID) || 0,
            type: 'wishlist',
        };
        if (req.body.product_id) {
            await post.postContent({
                userID: postData.userID,
                content: JSON.stringify(postData),
            }, 't_post');
        }
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/wishlist', async (req, resp) => {
    try {
        await database_js_1.default.query(`delete
             FROM \`${req.get('g-app')}\`.t_post
             where (content ->>'$.type'='wishlist')
               and userID = ?
               and (content ->>'$.product_id'=${req.body.product_id})
            `, [req.body.token.userID]);
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/dataAnalyze', async (req, resp) => {
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
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).getDataAnalyze(tags.split(',')));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/collection/products', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).getCollectionProducts(`${req.query.tag}`));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/collection', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).putCollection(req.body.replace, req.body.original));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/collection', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).deleteCollection(req.body.data));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/product', async (req, resp) => {
    var _a, _b;
    try {
        const shopping = await new shopping_1.Shopping(req.get('g-app'), req.body.token).getProduct({
            page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
            limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
            search: req.query.search,
            searchType: req.query.searchType,
            sku: req.query.sku,
            id: req.query.id,
            collection: req.query.collection,
            accurate_search_collection: req.query.accurate_search_collection === 'true',
            min_price: req.query.min_price,
            max_price: req.query.max_price,
            status: req.query.status,
            id_list: req.query.id_list,
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
            with_hide_index: req.query.with_hide_index,
        });
        return response_1.default.succ(resp, shopping);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/product/variants', async (req, resp) => {
    var _a, _b;
    try {
        const shopping = await new shopping_1.Shopping(req.get('g-app'), req.body.token).getVariants({
            page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
            limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
            search: req.query.search,
            searchType: req.query.searchType,
            id: req.query.id,
            collection: req.query.collection,
            accurate_search_collection: req.query.accurate_search_collection === 'true',
            status: req.query.status,
            id_list: req.query.id_list,
            order_by: req.query.order_by,
            stockCount: req.query.stockCount,
        });
        return response_1.default.succ(resp, shopping);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/product', async (req, resp) => {
    try {
        if (!(await ut_permission_1.UtPermission.isManager(req))) {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        else {
            return response_1.default.succ(resp, {
                result: true,
                id: await new shopping_1.Shopping(req.get('g-app'), req.body.token).postProduct(req.body),
            });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/product/multiple', async (req, resp) => {
    try {
        if (!(await ut_permission_1.UtPermission.isManager(req))) {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        else {
            return response_1.default.succ(resp, {
                result: true,
                id: await new shopping_1.Shopping(req.get('g-app'), req.body.token).postMulProduct(req.body),
            });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/product', async (req, resp) => {
    try {
        if (!(await ut_permission_1.UtPermission.isManager(req))) {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        else {
            return response_1.default.succ(resp, {
                result: true,
                id: await new shopping_1.Shopping(req.get('g-app'), req.body.token).putProduct(req.body),
            });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/product/variants', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).putVariants(req.body));
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/product', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            await new shopping_1.Shopping(req.get('g-app'), req.body.token).deleteProduct({
                id: req.query.id,
            });
            return response_1.default.succ(resp, { result: true });
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/check-login-for-order', async (req, resp) => {
    try {
        const keyData = await new user_js_1.User(req.get('g-app')).getConfigV2({
            user_id: 'manager',
            key: 'login_config',
        });
        return response_1.default.succ(resp, {
            result: keyData.login_in_to_order,
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=shop.js.map
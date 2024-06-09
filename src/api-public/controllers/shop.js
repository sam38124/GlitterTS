"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const multer_1 = __importDefault(require("multer"));
const exception_1 = __importDefault(require("../../modules/exception"));
const shopping_1 = require("../services/shopping");
const ut_permission_1 = require("../utils/ut-permission");
const financial_service_js_1 = require("../services/financial-service.js");
const private_config_js_1 = require("../../services/private_config.js");
const database_js_1 = __importDefault(require("../../modules/database.js"));
const invoice_js_1 = require("../services/invoice.js");
const user_js_1 = require("../services/user.js");
const custom_code_js_1 = require("../services/custom-code.js");
const ut_database_js_1 = require("../utils/ut-database.js");
const post_js_1 = require("../services/post.js");
const crypto_1 = __importDefault(require("crypto"));
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const router = express_1.default.Router();
router.get('/rebate/sum', async (req, resp) => {
    try {
        const app = req.get('g-app');
        await new user_js_1.User(app).checkRebate(req.query.userID || req.body.token.userID);
        return response_1.default.succ(resp, {
            sum: (await database_js_1.default.query(`SELECT sum(money)
                         FROM \`${app}\`.t_rebate
                         where status in (1, 2)
                           and userID = ?`, [req.query.userID || req.body.token.userID]))[0]['sum(money)'] || 0,
        });
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
            sku: req.query.sku,
            id: req.query.id,
            collection: req.query.collection,
            min_price: req.query.min_price,
            max_price: req.query.max_price,
            status: req.query.status,
            id_list: req.query.id_list,
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
            with_hide_index: req.query.with_hide_index,
        });
        return response_1.default.succ(resp, shopping);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/rebate', async (req, resp) => {
    try {
        const app = req.get('g-app');
        let query = [];
        if (await ut_permission_1.UtPermission.isManager(req)) {
            req.query.search && query.push(`(userID in (select userID from \`${app}\`.t_user where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.name')) LIKE UPPER('%${req.query.search}%')))))`);
            if (req.query.id && `${req.query.id}`.length > 0) {
                query.push(`userID=${database_js_1.default.escape(req.query.id)}`);
            }
        }
        else {
            query.push(`userID=${database_js_1.default.escape(req.body.token.userID)}`);
        }
        query.push(`status in (1, 2)`);
        req.query.dataType === 'all' && delete req.query.id;
        const data = await new ut_database_js_1.UtDatabase(req.get('g-app'), `t_rebate`).querySql(query, req.query);
        if (Array.isArray(data.data)) {
            for (const b of data.data) {
                let userData = (await database_js_1.default.query(`select userData
                         from \`${app}\`.t_user
                         where userID = ?`, [b.userID]))[0];
                b.userData = userData && userData.userData;
            }
        }
        else {
            let userData = (await database_js_1.default.query(`select userData
                     from \`${app}\`.t_user
                     where userID = ?`, [data.data.userID]))[0];
            data.data.userData = userData && userData.userData;
        }
        return response_1.default.succ(resp, data);
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
            for (const b of req.body.userID) {
                await database_js_1.default.execute(`insert into \`${app}\`.t_rebate (orderID, userID, money, status, note)
                     values (?, ?, ?, ?, ?)`, [orderID++, b, req.body.total, 2, req.body.note]);
            }
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
            await new shopping_1.Shopping(req.get('g-app'), req.body.token).deleteRebate({
                id: req.body.id,
            });
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
router.post('/checkout', async (req, resp) => {
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
        }));
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
        }, 'preview'));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/order', async (req, resp) => {
    var _a, _b, _c, _d;
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).getCheckOut({
                page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
                limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
                search: req.query.search,
                id: req.query.id,
                email: req.query.email,
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
router.post('/redirect', async (req, resp) => {
    try {
        let return_url = new URL((await redis_js_1.default.getValue(req.query.return)));
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
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
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
            const notProgress = (await database_js_1.default.query(`SELECT count(1)
                     FROM \`${appName}\`.t_checkout
                     where cart_token = ?
                       and status = 0;`, [decodeData['Result']['MerchantOrderNo']]))[0]['count(1)'];
            if (notProgress) {
                await database_js_1.default.execute(`update \`${appName}\`.t_checkout
                     set status=?
                     where cart_token = ?`, [1, decodeData['Result']['MerchantOrderNo']]);
                const cartData = (await database_js_1.default.query(`SELECT *
                         FROM \`${appName}\`.t_checkout
                         where cart_token = ?;`, [decodeData['Result']['MerchantOrderNo']]))[0];
                const userData = await new user_js_1.User(appName).getUserData(cartData.email, 'account');
                if (cartData.orderData.rebate > 0) {
                    await database_js_1.default.query(`update \`${appName}\`.t_rebate set status=1 where orderID=?;`, [cartData.cart_token]);
                }
                try {
                    await new custom_code_js_1.CustomCode(appName).checkOutHook({
                        userData: userData,
                        cartData: cartData,
                    });
                }
                catch (e) {
                    console.log(`webHookError`);
                    console.log(e);
                }
                new invoice_js_1.Invoice(appName).postCheckoutInvoice(decodeData['Result']['MerchantOrderNo']);
            }
        }
        else {
            await database_js_1.default.execute(`update \`${appName}\`.t_checkout
                 set status=?
                 where cart_token = ?`, [-1, decodeData['Result']['MerchantOrderNo']]);
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
            'g-app': 'shop-template-clothing-v3',
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
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).putCollection(req.body.data));
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
router.get('/payment/method', async (req, resp) => {
    try {
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: req.get('g-app'),
            key: 'glitter_finance',
        }))[0].value;
        return response_1.default.succ(resp, {
            method: [{
                    value: 'credit',
                    title: '信用卡'
                }, {
                    value: 'atm',
                    title: 'ATM'
                }, {
                    value: 'web_atm',
                    title: '網路ATM'
                }, {
                    value: 'c_code',
                    title: '超商代碼'
                }, {
                    value: 'c_bar_code',
                    title: '超商條碼'
                }].filter((dd) => {
                return keyData[dd.value] && keyData.TYPE !== 'off_line';
            })
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/check-login-for-order', async (req, resp) => {
    try {
        const keyData = (await new user_js_1.User(req.get('g-app')).getConfigV2({
            user_id: 'manager',
            key: 'login_config',
        }));
        return response_1.default.succ(resp, {
            result: keyData.login_in_to_order
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=shop.js.map
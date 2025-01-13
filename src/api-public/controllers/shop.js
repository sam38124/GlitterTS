"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const multer_1 = __importDefault(require("multer"));
const exception_1 = __importDefault(require("../../modules/exception"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const ut_database_js_1 = require("../utils/ut-database.js");
const ut_permission_1 = require("../utils/ut-permission");
const financial_service_js_1 = require("../services/financial-service.js");
const private_config_js_1 = require("../../services/private_config.js");
const user_js_1 = require("../services/user.js");
const post_js_1 = require("../services/post.js");
const shopping_1 = require("../services/shopping");
const rebate_1 = require("../services/rebate");
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
router.post('/worker', async (req, resp) => {
    try {
        return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).workerExample({
            type: req.body.type,
            divisor: req.body.divisor,
        }));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/currency-covert', async (req, resp) => {
    try {
        return response_1.default.succ(resp, { data: await shopping_1.Shopping.currencyCovert((req.query.base || 'TWD')) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
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
router.get('/rebate/config', async (req, resp) => {
    try {
        const app = req.get('g-app');
        const rebateClass = new rebate_1.Rebate(app);
        const config = await rebateClass.getConfig();
        return response_1.default.succ(resp, { data: config });
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
            line_items: req.body.line_items,
            email: (req.body.token && req.body.token.account) || req.body.email,
            return_url: req.body.return_url,
            user_info: req.body.user_info,
            code: req.body.code,
            customer_info: req.body.customer_info,
            checkOutType: req.body.checkOutType,
            use_rebate: (() => {
                if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
                    return req.body.use_rebate;
                }
                else {
                    return 0;
                }
            })(),
            custom_receipt_form: req.body.custom_receipt_form,
            custom_form_format: req.body.custom_form_format,
            custom_form_data: req.body.custom_form_data,
            distribution_code: req.body.distribution_code,
            code_array: req.body.code_array,
            give_away: req.body.give_away,
            language: req.headers['language'],
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
            line_items: req.body.line_items,
            email: req.body.checkOutType === 'POS' ? undefined : (req.body.token && req.body.token.account) || req.body.email,
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
            checkOutType: req.body.checkOutType,
            distribution_code: req.body.distribution_code,
            code_array: req.body.code_array,
            give_away: req.body.give_away,
            pos_store: req.body.pos_store,
            language: req.headers['language'],
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
                line_items: req.body.line_items,
                email: req.body.customer_info.email,
                return_url: req.body.return_url,
                user_info: req.body.user_info,
                checkOutType: 'manual',
                voucher: req.body.voucher,
                customer_info: req.body.customer_info,
                discount: req.body.discount,
                total: req.body.total,
                pay_status: req.body.pay_status,
                code_array: req.body.code_array,
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
                line_items: req.body.line_items,
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
                code_array: req.body.code_array,
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
                phone: req.query.phone,
                id: req.query.id,
                email: req.query.email,
                status: req.query.status,
                searchType: req.query.searchType,
                shipment: req.query.shipment,
                is_pos: req.query.is_pos,
                progress: req.query.progress,
                orderStatus: req.query.orderStatus,
                created_time: req.query.created_time,
                orderString: req.query.orderString,
                archived: req.query.archived,
                distribution_code: req.query.distribution_code,
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
                email: user_data.userData.email,
                phone: user_data.userData.phone,
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
                status: req.body.status,
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
router.put('/order/cancel', async (req, resp) => {
    try {
        return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).cancelOrder(req.body.id));
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
        if (req.query.voucher_type) {
            query.push(`(content->>'$.reBackType'='${req.query.voucher_type}')`);
        }
        const vouchers = await new shopping_1.Shopping(req.get('g-app'), req.body.token).querySql(query, {
            page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
            limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
            id: req.query.id,
        });
        if (!(await ut_permission_1.UtPermission.isManager(req))) {
            const userClass = new user_js_1.User(req.get('g-app'));
            const userLevels = await userClass.getUserLevel([{ userId: req.body.token.userID }]);
            const groupList = await userClass.getUserGroups();
            vouchers.data = vouchers.data.filter((d) => {
                const dd = d.content;
                if (dd.target === 'customer') {
                    return dd.targetList.includes(req.body.token.userID);
                }
                if (dd.target === 'levels') {
                    if (userLevels[0]) {
                        return dd.targetList.includes(userLevels[0].data.id);
                    }
                    return false;
                }
                if (dd.target === 'group') {
                    if (!groupList.result) {
                        return false;
                    }
                    let pass = false;
                    for (const group of groupList.data.filter((item) => dd.targetList.includes(item.type))) {
                        if (!pass && group.users.some((item) => item.userID === req.body.token.userID)) {
                            pass = true;
                        }
                    }
                    return pass;
                }
                return true;
            });
        }
        return response_1.default.succ(resp, vouchers);
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
        if (req.query.LinePay && req.query.LinePay === 'true') {
            const check_id = await redis_js_1.default.getValue(`linepay` + req.query.orderID);
            const keyData = (await private_config_js_1.Private_config.getConfig({
                appName: req.query.appName,
                key: 'glitter_finance',
            }))[0].value.line_pay;
            const linePay = new financial_service_js_1.LinePay(req.query.appName, keyData);
            const data = linePay.confirmAndCaptureOrder(check_id);
            if (data.returnCode == '0000') {
                await new shopping_1.Shopping(req.query.appName).releaseCheckout(1, req.query.orderID);
            }
        }
        if (req.query.payment && req.query.payment == 'true') {
            const check_id = await redis_js_1.default.getValue(`paypal` + req.query.orderID);
            const keyData = (await private_config_js_1.Private_config.getConfig({
                appName: req.query.appName,
                key: 'glitter_finance',
            }))[0].value.paypal;
            const paypal = new financial_service_js_1.PayPal(req.query.appName, keyData);
            const data = await paypal.confirmAndCaptureOrder(check_id);
            if (data.status === 'COMPLETED') {
                await new shopping_1.Shopping(req.query.appName).releaseCheckout(1, req.query.orderID);
            }
        }
        if (req.query.paynow === 'true') {
        }
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
                                    functionName: 'check_out_finish',
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
        let decodeData = undefined;
        const appName = req.query['g-app'];
        const type = req.query['type'];
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: appName,
            key: 'glitter_finance',
        }))[0].value[type];
        if (type === 'ecPay') {
            const responseCheckMacValue = `${req.body.CheckMacValue}`;
            delete req.body.CheckMacValue;
            const chkSum = financial_service_js_1.EcPay.generateCheckMacValue(req.body, keyData.HASH_KEY, keyData.HASH_IV);
            decodeData = {
                Status: req.body.RtnCode === '1' && responseCheckMacValue === chkSum ? 'SUCCESS' : 'ERROR',
                Result: {
                    MerchantOrderNo: req.body.MerchantTradeNo,
                    CheckMacValue: req.body.CheckMacValue,
                },
            };
        }
        if (type === 'newWebPay') {
            decodeData = JSON.parse(new financial_service_js_1.EzPay(appName, {
                HASH_IV: keyData.HASH_IV,
                HASH_KEY: keyData.HASH_KEY,
                ActionURL: keyData.ActionURL,
                NotifyURL: '',
                ReturnURL: '',
                MERCHANT_ID: keyData.MERCHANT_ID,
                TYPE: keyData.TYPE,
            }).decode(req.body.TradeInfo));
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
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).getDataAnalyze(tags.split(','), req.query.query));
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
router.get('/collection/product/variants', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).getCollectionProductVariants(`${req.query.tag}`));
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
router.put('/collection/sort', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).sortCollection(req.body.list));
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
            domain: req.query.domain,
            collection: req.query.collection,
            accurate_search_text: req.query.accurate_search_text === 'true',
            accurate_search_collection: req.query.accurate_search_collection === 'true',
            min_price: req.query.min_price,
            max_price: req.query.max_price,
            status: req.query.status,
            channel: req.query.channel,
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
            is_manger: (await ut_permission_1.UtPermission.isManager(req)),
            show_hidden: `${req.query.show_hidden}`,
            productType: req.query.productType,
            filter_visible: req.query.filter_visible,
            language: req.headers['language'],
            currency_code: req.headers['currency_code'],
        });
        return response_1.default.succ(resp, shopping);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/product/domain', async (req, resp) => {
    try {
        const shopping = await new shopping_1.Shopping(req.get('g-app'), req.body.token).getDomain({
            id: req.query.id,
            search: req.query.search,
            domain: req.query.domain,
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
            productType: req.query.productType,
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
router.post('/pos/checkout', async (req, resp) => {
    async function checkoutPos() {
        return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).toCheckout({
            order_id: req.body.orderID,
            line_items: req.body.lineItems,
            email: req.body.customer_info.email,
            return_url: req.body.return_url,
            user_info: req.body.user_info,
            checkOutType: 'POS',
            voucher: req.body.voucher,
            customer_info: req.body.customer_info,
            discount: req.body.discount,
            total: req.body.total,
            pay_status: req.body.pay_status,
            code_array: req.body.code_array,
            pos_info: req.body.pos_info,
            pos_store: req.body.pos_store,
            invoice_select: req.body.invoice_select
        }, 'POS'));
    }
    try {
        let result = await checkoutPos();
        return response_1.default.succ(resp, result);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/pos/linePay', async (req, resp) => {
    try {
        return response_1.default.succ(resp, { result: await new shopping_1.Shopping(req.get('g-app'), req.body.token).linePay(req.body) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/apple-webhook', async (req, resp) => {
    try {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://buy.itunes.apple.com/verifyReceipt',
            headers: {
                'Content-Type': 'application/json',
            },
            data: req.body.base64,
        };
        const receipt = await new Promise((resolve, reject) => {
            axios_1.default
                .request(config)
                .then((response) => {
                resolve(response.data);
            })
                .catch((error) => {
                resolve(false);
            });
        });
        if (!receipt) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No Receipt.Cant find receipt.', null);
        }
        for (const b of receipt.receipt.in_app.filter((dd) => {
            return `${dd.product_id}`.includes('ai_points_') && dd.in_app_ownership_type === 'PURCHASED';
        })) {
            const count = (await database_js_1.default.query(`select count(1)
                                           from \`${req.get('g-app')}\`.t_ai_points
                                           where orderID = ?`, [b.transaction_id]))[0]['count(1)'];
            if (!count) {
                await database_js_1.default.query(`insert into \`${req.get('g-app')}\`.t_ai_points
                                set ?`, [
                    {
                        orderID: b.transaction_id,
                        userID: req.body.token.userID,
                        money: parseInt(b.product_id.replace('ai_points_', ''), 10) * 10,
                        status: 1,
                        note: JSON.stringify({
                            text: 'apple內購加值',
                            receipt: receipt,
                        }),
                    },
                ]);
            }
        }
        for (const b of receipt.receipt.in_app.filter((dd) => {
            return `${dd.product_id}`.includes('sms_') && dd.in_app_ownership_type === 'PURCHASED';
        })) {
            const count = (await database_js_1.default.query(`select count(1)
                                           from \`${req.get('g-app')}\`.t_sms_points
                                           where orderID = ?`, [b.transaction_id]))[0]['count(1)'];
            if (!count) {
                await database_js_1.default.query(`insert into \`${req.get('g-app')}\`.t_sms_points
                                set ?`, [
                    {
                        orderID: b.transaction_id,
                        userID: req.body.token.userID,
                        money: parseInt(b.product_id.replace('sms_', ''), 10) * 10,
                        status: 1,
                        note: JSON.stringify({
                            text: 'apple內購加值',
                            receipt: receipt,
                        }),
                    },
                ]);
            }
        }
        for (const b of receipt.receipt.in_app.filter((dd) => {
            return ['light_year_apple', 'basic_year_apple', 'omo_year_apple', 'app_year_apple', 'flagship_year_apple'].includes(`${dd.product_id}`) && dd.in_app_ownership_type === 'PURCHASED';
        })) {
            if (!(await database_js_1.default.query(`select count(1) from shopnex.t_checkout where cart_token=?`, [b.transaction_id]))[0]['count(1)']) {
                const app_info = (await database_js_1.default.query(`select dead_line, user
                                              from glitter.app_config
                                              where appName = ?`, [req.body.app_name]))[0];
                const user = (await database_js_1.default.query(`SELECT *
                                          FROM shopnex.t_user
                                          where userID = ?`, [app_info.user]))[0];
                const start = (() => {
                    if (new Date(app_info.dead_line).getTime() > new Date().getTime()) {
                        return new Date(app_info.dead_line);
                    }
                    else {
                        return new Date();
                    }
                })();
                start.setDate(start.getDate() + 365);
                await database_js_1.default.query(`update glitter.app_config
                            set dead_line=?,
                                plan=?
                            where appName = ?`, [start, `${b.product_id}`.replace('_apple', '').replace(/_/g, '-'), req.body.app_name]);
                const index = ['light_year_apple', 'basic_year_apple', 'omo_year_apple', 'app_year_apple', 'flagship_year_apple'].findIndex((d1) => {
                    return `${b.product_id}` === d1;
                });
                const money = [13200, 26400, 52800, 52800, 66000][index];
                await database_js_1.default.query(`insert into shopnex.t_checkout
                            set ? `, [
                    {
                        cart_token: b.transaction_id,
                        status: 1,
                        email: user.userData.email,
                        orderData: JSON.stringify({
                            email: user.userData.email,
                            total: money,
                            method: 'ALL',
                            rebate: 0,
                            orderID: b.transaction_id,
                            discount: 0,
                            lineItems: [
                                {
                                    id: 289,
                                    sku: b.product_id,
                                    spec: [['輕便電商方案', '標準電商方案', '通路電商方案', '行動電商方案', '旗艦電商方案'][index]],
                                    count: 1,
                                    title: 'SHOPNEX會員方案',
                                    rebate: 0,
                                    collection: [],
                                    sale_price: money,
                                    shipment_obj: { type: 'weight', value: 0 },
                                    preview_image: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1702389593777-Frame 2 (2).png',
                                    discount_price: 0,
                                },
                            ],
                            user_info: {
                                email: user.userData.email,
                                appName: req.body.app_name,
                                company: '',
                                gui_number: '',
                                invoice_type: 'me',
                            },
                            code_array: [],
                            use_rebate: 0,
                            use_wallet: '0',
                            user_email: user.userData.email,
                            orderSource: '',
                            voucherList: [],
                            shipment_fee: 0,
                            customer_info: { payment_select: 'ecPay' },
                            useRebateInfo: { point: 0 },
                            payment_setting: { TYPE: 'ecPay' },
                            user_rebate_sum: 0,
                            off_line_support: { atm: false, line: false, cash_on_delivery: false },
                            payment_info_atm: { bank_code: '', bank_name: '', bank_user: '', bank_account: '' },
                            shipment_support: [],
                            shipment_selector: [],
                            payment_info_line_pay: { text: '' },
                        }),
                    },
                ]);
            }
        }
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        console.error(err);
        return response_1.default.fail(resp, err);
    }
});
router.post('/customer_invoice', async (req, resp) => {
    try {
        return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).postCustomerInvoice({
            orderID: req.body.orderID,
            invoice_data: req.body.invoiceData,
            orderData: req.body.orderData,
        }));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/void_invoice', async (req, resp) => {
    try {
        return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).voidInvoice({
            invoice_no: req.body.invoiceNo,
            reason: req.body.voidReason,
            createDate: req.body.createDate,
        }));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/void_allowance', async (req, resp) => {
    try {
        let passData = {
            invoiceNo: req.body.invoiceNo,
            allowanceNo: req.body.allowanceNo,
            voidReason: req.body.voidReason,
        };
        return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).voidAllowance(passData));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/allowance_invoice', async (req, resp) => {
    try {
        let passData = {
            invoiceID: req.body.invoiceID,
            allowanceData: req.body.allowanceData,
            orderID: req.body.orderID,
            orderData: req.body.orderData,
            allowanceInvoiceTotalAmount: req.body.allowanceInvoiceTotalAmount,
            itemList: req.body.itemList,
            invoiceDate: req.body.invoiceDate,
        };
        return response_1.default.succ(resp, await new shopping_1.Shopping(req.get('g-app'), req.body.token).allowanceInvoice(passData));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=shop.js.map
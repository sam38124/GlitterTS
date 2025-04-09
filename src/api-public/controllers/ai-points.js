"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const response_1 = __importDefault(require("../../modules/response"));
const exception_1 = __importDefault(require("../../modules/exception"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const private_config_js_1 = require("../../services/private_config.js");
const financial_service_js_1 = require("../services/financial-service.js");
const ut_database_js_1 = require("../utils/ut-database.js");
const ai_pointes_js_1 = require("../services/ai-pointes.js");
const invoice_js_1 = require("../services/invoice.js");
const router = express_1.default.Router();
router.get('/', async (req, resp) => {
    try {
        const app = req.get('g-app');
        let query = [];
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            req.query.search && query.push(`(userID in (select userID from \`${app}\`.t_user where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.name')) LIKE UPPER('%${req.query.search}%')))))`);
        }
        else {
            query.push(`userID=${database_js_1.default.escape(req.body.token.userID)}`);
        }
        if (req.query.type === 'minus') {
            query.push(`money<0`);
        }
        else if (req.query.type === 'plus') {
            query.push(`money>0`);
        }
        req.query.start_date && query.push(`created_time>${database_js_1.default.escape(req.query.start_date)}`);
        query.push(`status in (1,2)`);
        const data = await new ut_database_js_1.UtDatabase(req.get('g-app'), `t_ai_points`).querySql(query, req.query);
        for (const b of data.data) {
            let userData = (await database_js_1.default.query(`select userData from \`${app}\`.t_user where userID = ?
                    `, [b.userID]))[0];
            b.userData = userData && userData.userData;
        }
        return response_1.default.succ(resp, data);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/', async (req, resp) => {
    try {
        const app = req.get('g-app');
        return response_1.default.succ(resp, await new ai_pointes_js_1.AiPointes(app, req.body.token).store({
            return_url: req.body.return_url,
            total: req.body.total,
            note: req.body.note,
            method: req.body.method,
        }));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            await new ai_pointes_js_1.AiPointes(req.get('g-app'), req.body.token).delete({
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
router.get('/withdraw', async (req, resp) => {
    try {
        const app = req.get('g-app');
        let query = [];
        query.push(`status != -2`);
        const data = await new ut_database_js_1.UtDatabase(req.get('g-app'), `t_withdraw`).querySql(query, req.query);
        for (const b of data.data) {
            let userData = (await database_js_1.default.query(`select userData from \`${app}\`.t_user where userID = ?
                    `, [b.userID]))[0];
            b.userData = userData && userData.userData;
        }
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, data);
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/withdraw', async (req, resp) => {
    try {
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/withdraw', async (req, resp) => {
    try {
        const app = req.get('g-app');
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            await new ai_pointes_js_1.AiPointes(app, req.body.token).putWithdraw({
                id: req.body.id,
                status: req.body.status,
                note: req.body.note,
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
router.delete('/withdraw', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            await new ai_pointes_js_1.AiPointes(req.get('g-app'), req.body.token).deleteWithDraw({
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
router.get('/sum', async (req, resp) => {
    try {
        const app = req.get('g-app');
        return response_1.default.succ(resp, {
            sum: (await database_js_1.default.query(`SELECT sum(money) FROM \`${app}\`.t_ai_points
                            WHERE status in (1, 2) AND userID = ?`, [req.query.userID || req.body.token.userID]))[0]['sum(money)'] || 0,
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/manager', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const app = req.get('g-app');
            let orderID = new Date().getTime();
            for (const b of req.body.userID) {
                await database_js_1.default.execute(`insert into \`${app}\`.t_ai_points (orderID, userID, money, status, note)
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
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
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
                TYPE: type,
            }).decode(req.body.TradeInfo));
        }
        if (decodeData['Status'] === 'SUCCESS') {
            await database_js_1.default.execute(`update \`${appName}\`.t_ai_points set status=? where orderID = ?
                `, [1, decodeData['Result']['MerchantOrderNo']]);
            const data = (await database_js_1.default.query(`select * from \`${appName}\`.t_ai_points where orderID=?`, [decodeData['Result']['MerchantOrderNo']]))[0];
            new invoice_js_1.Invoice(appName).postCheckoutInvoice({
                lineItems: [
                    {
                        ItemName: `AI Points 儲值${data.money.toLocaleString()}點`,
                        count: 1,
                        sale_price: data.money / 10,
                        spec: []
                    }
                ],
                user_info: data.note.invoice_data,
                total: data.money / 10,
                orderID: decodeData['Result']['MerchantOrderNo']
            }, false);
        }
        else {
            await database_js_1.default.execute(`update \`${appName}\`.t_ai_points set status=? where orderID = ?
                `, [-1, decodeData['Result']['MerchantOrderNo']]);
        }
        return response_1.default.succ(resp, {});
    }
    catch (err) {
        console.error(err);
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=ai-points.js.map
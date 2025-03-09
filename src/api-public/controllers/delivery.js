"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const delivery_js_1 = require("../services/delivery.js");
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const paynow_logistics_js_1 = require("../services/paynow-logistics.js");
const shopping_js_1 = require("../services/shopping.js");
const router = express_1.default.Router();
router.post('/c2cRedirect', async (req, resp) => {
    try {
        const html = String.raw;
        const return_url = new URL((await redis_js_1.default.getValue(req.query.return)));
        Object.keys(req.body).map((key) => {
            return_url.searchParams.set(encodeURIComponent(key), encodeURIComponent(req.body[key]));
        });
        return resp.send(html `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"/>
            <title>Title</title>
        </head>
        <body>
        <script>
            try {
                window.webkit.messageHandlers.addJsInterFace.postMessage(
                        JSON.stringify({
                            functionName: 'closeWebView',
                            callBackId: 0,
                            data: {},
                        })
                );
            } catch (e) {
            }
            location.href = '${return_url.href}';
        </script>
        </body>
        </html> `);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/c2cNotify', async (req, resp) => {
    try {
        return response_1.default.succ(resp, await new delivery_js_1.Delivery(req.get('g-app')).notify(req.body));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/notify', async (req, resp) => {
    try {
        await new shopping_js_1.Shopping(req.get('g-app')).getCheckOut({
            page: 0,
            limit: 1,
            search: req.body.orderno,
            searchType: 'cart_token',
        });
        return response_1.default.succ(resp, {
            'success': true
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/storeMaps', async (req, resp) => {
    try {
        return response_1.default.succ(resp, { form: await (new paynow_logistics_js_1.PayNowLogistics(req.get('g-app')).choseLogistics(req.body.logistics, req.body.returnURL)) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/cancel-order', async (req, resp) => {
    try {
        const data = await new paynow_logistics_js_1.PayNowLogistics(req.get('g-app')).deleteLogOrder(req.body.cart_token, req.body.logistic_number, req.body.total_amount);
        return response_1.default.succ(resp, { data });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/orderInfo', async (req, resp) => {
    try {
        const data = await new delivery_js_1.Delivery(req.get('g-app')).getOrderInfo({
            cart_token: `${req.body.order_id}`,
            shipment_date: req.body.shipment_date,
        });
        return response_1.default.succ(resp, { data });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/formView', async (req, resp) => {
    try {
        const html = String.raw;
        const key = 'delivery_' + req.query.id;
        const data = await redis_js_1.default.getValue(key);
        setTimeout(() => {
            redis_js_1.default.deleteKey(key);
        }, 1000);
        const formString = delivery_js_1.EcPay.generateForm(JSON.parse(data));
        return resp.send(html `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"/>
            <title>Title</title>
        </head>
        <body>
        ${formString}
        </body>
        <script>
            const myForm = document.getElementById('submit');
            if (myForm) {
                myForm.click();
            }
        </script>
        </html>`);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=delivery.js.map
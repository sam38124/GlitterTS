"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const delivery_js_1 = require("../services/delivery.js");
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const router = express_1.default.Router();
router.post('/c2cRedirect', async (req, resp) => {
    try {
        const html = String.raw;
        const query = req.body.toString();
        const return_url = new URL((await redis_js_1.default.getValue(req.query.return)));
        query.split('&').map((dd) => {
            return_url.searchParams.set(dd.split('=')[0], dd.split('=')[1]);
        });
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
                                    data: {},
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
});
router.post('/c2cNotify', async (req, resp) => {
    try {
        return response_1.default.succ(resp, { result: 'c2cNotify' });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/storeMaps', async (req, resp) => {
    try {
        const formString = await new delivery_js_1.Delivery(req.get('g-app')).getC2CMap(req.body.returnURL, req.body.logistics);
        return response_1.default.succ(resp, { form: formString });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/createStoreOrder', async (req, resp) => {
    try {
        const formString = await new delivery_js_1.Delivery(req.get('g-app')).postStoreOrder();
        return response_1.default.succ(resp, { form: formString });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/printOrderInfo', async (req, resp) => {
    try {
        const formString = await new delivery_js_1.Delivery(req.get('g-app')).printOrderInfo(req.body.brand);
        return response_1.default.succ(resp, { form: formString });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=delivery.js.map
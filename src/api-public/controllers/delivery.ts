import express from 'express';
import response from '../../modules/response';
import {Delivery, EcPay} from '../services/delivery.js';
import redis from '../../modules/redis.js';
import {PayNow} from "../services/financial-service.js";
import {PayNowLogistics} from "../services/paynow-logistics.js";
import {Shopping} from "../services/shopping.js";

const router: express.Router = express.Router();

export = router;

router.post('/c2cRedirect', async (req: express.Request, resp: express.Response) => {
    try {
        const html = String.raw;
        const return_url = new URL((await redis.getValue(req.query.return as string)) as string);
        Object.keys(req.body).map((key) => {
            return_url.searchParams.set(encodeURIComponent(key), encodeURIComponent(req.body[key]));
        });

        return resp.send(html`<!DOCTYPE html>
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
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/c2cNotify', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, await new Delivery(req.get('g-app') as string).notify(req.body));
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/notify', async (req: express.Request, resp: express.Response) => {
    try {
        // console.log(`delivery-notify=>`,req.body)
        //
        //通知更新訂單狀態
        await new Shopping(req.get('g-app') as string).getCheckOut({
            page: 0,
            limit: 1,
            search: req.body.orderno,
            searchType: 'cart_token',
        })
        return response.succ(resp, {
            'success': true
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});
//api-public/v1/delivery/storeMaps

router.post('/storeMaps', async (req: express.Request, resp: express.Response) => {
    try {

        return response.succ(resp, {form: await (new PayNowLogistics(req.get('g-app') as string).choseLogistics(req.body.logistics, req.body.returnURL))});
        // const formString = await new Delivery(req.get('g-app') as string).getC2CMap(req.body.returnURL, req.body.logistics);
        // return response.succ(resp, { form: formString });
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/cancel-order', async (req: express.Request, resp: express.Response) => {
    try {
        const data = await new PayNowLogistics(req.get('g-app') as string).deleteLogOrder(req.body.cart_token, req.body.logistic_number, req.body.total_amount);
        return response.succ(resp, {data});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/orderInfo', async (req: express.Request, resp: express.Response) => {
    try {
        const data = await new Delivery(req.get('g-app') as string).getOrderInfo({
            cart_token: `${req.body.order_id}`,
            shipment_date:req.body.shipment_date,
        });
        return response.succ(resp, {data});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/formView', async (req: express.Request, resp: express.Response) => {
    try {
        const html = String.raw;
        const key = 'delivery_' + req.query.id;
        const data = await redis.getValue(key);
        setTimeout(() => {
            redis.deleteKey(key);
        }, 1000);
        const formString = EcPay.generateForm(JSON.parse(data as string)); // 限制綠界物流表單

        return resp.send(html`<!DOCTYPE html>
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
    } catch (err) {
        return response.fail(resp, err);
    }
});

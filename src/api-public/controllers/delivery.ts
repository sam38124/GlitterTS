import express from 'express';
import response from '../../modules/response';
import { Delivery } from '../services/delivery.js';
import redis from '../../modules/redis.js';

const router: express.Router = express.Router();

export = router;

router.post('/c2cMap', async (req: express.Request, resp: express.Response) => {
    try {
        const formString = await new Delivery(req.get('g-app') as string).getC2CMap(req.body.returnURL, req.body.logistics);
        return response.succ(resp, { form: formString });
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/c2cRedirect', async (req: express.Request, resp: express.Response) => {
    try {
        const html = String.raw;
        const query = req.body.toString();
        const return_url = new URL((await redis.getValue(req.query.return as string)) as string);
        query.split('&').map((dd: any) => {
            return_url.searchParams.set(dd.split('=')[0], dd.split('=')[1]);
        });
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
                                    data: {},
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
});

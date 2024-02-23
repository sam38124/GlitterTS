import express from "express";
import response from "../../modules/response";
import db from '../../modules/database';
import {saasConfig} from "../../config";
import {User} from "../services/user";
import exception from "../../modules/exception";
import {UtPermission} from "../utils/ut-permission.js";
import {sendmail} from "../../services/ses.js";
import {compare_sql_table} from "../../services/saas-table-check.js";
import {Firebase} from "../../modules/firebase";
import app from "../../app.js";
import {Delivery} from "../services/delivery.js";
import path from "path";

const router: express.Router = express.Router();

export = router;


router.post('/c2cMap', async (req: express.Request, resp: express.Response) => {
    try {
        const formString=await (new Delivery(req.get('g-app') as string)).getC2CMap(req.body.returnURL,req.body.logistics)
        return response.succ(resp,{form:formString})
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/c2cRedirect', async (req: express.Request, resp: express.Response) => {
    try {
        let query=req.body.toString()
        let return_url=new URL(req.query.return as string)
        query.split('&').map((dd:any)=>{
            return_url.searchParams.set(dd.split('=')[0],dd.split('=')[1])
        })
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
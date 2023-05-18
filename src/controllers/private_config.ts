import {IToken} from "../models/Auth.js";
import express from "express";
import response from "../modules/response.js";
import {Template} from "../services/template.js";
import {Private_config} from "../services/private_config.js";
const router: express.Router = express.Router();
export = router;

router.post('/',async (req: express.Request, resp: express.Response) =>{
    try {
        return response.succ(resp, {result: (await (new Private_config(req.body.token).setConfig(req.body)))});
    } catch (err) {
        return response.fail(resp, err);
    }
})
router.get('/',async (req: express.Request, resp: express.Response) =>{
    try {
        return response.succ(resp, {result: (await (new Private_config(req.body.token).getConfig(req.query as any)))});
    } catch (err) {
        return response.fail(resp, err);
    }
})


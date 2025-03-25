import {IToken} from "../models/Auth.js";
import express from "express";
import response from "../modules/response.js";
import {Template} from "../services/template.js";
import {Private_config} from "../services/private_config.js";
import { UtPermission } from '../api-public/utils/ut-permission.js';
import exception from '../modules/exception.js';
const router: express.Router = express.Router();
export = router;

router.post('/',async (req: express.Request, resp: express.Response) =>{
    try {
        if(! await UtPermission.isManager(req)){
            throw exception.BadRequestError('Forbidden', 'No Permission.', null);
        }
        return response.succ(resp, {result: (await (new Private_config(req.body.token).setConfig(req.body)))});
    } catch (err) {
        return response.fail(resp, err);
    }
})
router.get('/',async (req: express.Request, resp: express.Response) =>{
    try {
        if(! await UtPermission.isManager(req)){
            throw exception.BadRequestError('Forbidden', 'No Permission.', null);
        }
        return response.succ(resp, {result: (await (new Private_config(req.body.token).getConfig(req.query as any)))});
    } catch (err) {
        return response.fail(resp, err);
    }
})


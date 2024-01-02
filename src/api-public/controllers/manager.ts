import express from "express";
import response from "../../modules/response";
import db from '../../modules/database';
import {saasConfig} from "../../config";
import {Post} from "../services/post";
import exception from "../../modules/exception";
import {Manager} from "../services/manager.js";
import {UtPermission} from "../utils/ut-permission.js";

const router: express.Router = express.Router();

export = router;

router.put('/config', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            await (new Manager(req.body.token)).setConfig({
                appName: req.get('g-app') as string,
                key: req.body.key,
                value: req.body.value
            })
            return response.succ(resp, {result: true});
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
})
router.get('/config', async (req: express.Request, resp: express.Response) => {
    try {

            return response.succ(resp, {result: true,value: ((await (new Manager(req.body.token)).getConfig({
                    appName: req.get('g-app') as string,
                    key: req.query.key as string
                }))[0] ?? {})['value'] ?? ""});
    } catch (err) {
        return response.fail(resp, err);
    }
})
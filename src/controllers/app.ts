import express from "express";
import response from "../modules/response";
import db from '../modules/database';
import {saasConfig} from "../config";
import {App} from "../services/app";
const router: express.Router = express.Router();
export = router;

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        const app=new App(req.body.token);
        return response.succ(resp, { result:await app.createApp(req.body)});
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        const app=new App(req.body.token);
        return response.succ(resp, { result:await app.getAPP()});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.delete('/', async (req: express.Request, resp: express.Response) => {
    try {
        const app=new App(req.body.token);
        await app.deleteAPP({
            appName:req.body.appName
        });
        return response.succ(resp, { result:true});
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/plugin', async (req: express.Request, resp: express.Response) => {
    try {
        const app=new App(req.body.token);
        return response.succ(resp, { data:(await app.getAppConfig(req.query as any))});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.put('/plugin', async (req: express.Request, resp: express.Response) => {
    try {
        const app=new App(req.body.token);
        const appName=req.body.appName
        return response.succ(resp, { result:(await app.setAppConfig({
                appName:req.body.appName,
                data:req.body.config
            }))});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/official/plugin', async (req: express.Request, resp: express.Response) => {
    try {
        const app=new App(req.body.token);
        return response.succ(resp, {
            data:(await app.getOfficialPlugin()),
            result:true
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});

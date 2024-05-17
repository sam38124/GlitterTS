import express from "express";
import response from "../modules/response";
import {App} from "../services/app";
import {UtPermission} from "../api-public/utils/ut-permission.js";
import exception from "../modules/exception.js";

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
router.put('/theme', async (req: express.Request, resp: express.Response) => {
    try {
        const app=new App(req.body.token);
        return response.succ(resp, { result:await app.changeTheme(req.body)});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.put('/theme_config', async (req: express.Request, resp: express.Response) => {
    try {
        const app=new App(req.body.token);
        return response.succ(resp, { result:await app.updateThemeConfig(req.body)});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        const app=new App(req.body.token);
        return response.succ(resp, { result:await app.getAPP({
                app_name:req.query.appName as string,
                theme:req.query.theme as string
            })});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/template', async (req: express.Request, resp: express.Response) => {
    try {
        const app=new App(req.body.token);
        return response.succ(resp, { result:await app.getTemplate(req.query as any)});
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

router.put('/domain', async (req: express.Request, resp: express.Response) => {
    try {
        const app=new App(req.body.token);
        (await app.setDomain({
            appName:req.body.app_name,
            domain:req.body.domain
        }))
        return response.succ(resp, { result:true});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/create_template', async (req: express.Request, resp: express.Response) => {
    try {
        if (!await UtPermission.isManager(req)) {
            throw exception.BadRequestError("Forbidden", "No Permission.", null);
        }
        const app=new App(req.body.token);
        return response.succ(resp, {result: (await app.postTemplate({
                appName:req.body.appName,
                data:req.body.config
            }))});
    } catch (err) {
        return response.fail(resp, err);
    }
});

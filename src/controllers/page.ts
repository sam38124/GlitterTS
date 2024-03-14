import express from "express";
import response from "../modules/response";
import {Page} from "../services/page.js";

const router: express.Router = express.Router();
export = router;


router.post('/template', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {result: (await new Page(req.body.token).postTemplate({
                appName:req.body.appName,
                data:req.body.config,
                tag:req.body.tag
            }))});
    } catch (err) {
        return response.fail(resp, err);
    }
});


router.get('/template', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {result: (await new Page(req.body.token).getTemplate(req.query as any))});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/tag_list', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, (await new Page(req.body.token).getTagList((req.query as any).type,(req.query as any).template_from)));
    } catch (err) {
        return response.fail(resp, err);
    }
});


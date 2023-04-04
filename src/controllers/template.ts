import express from "express";
import response from "../modules/response";
import db from '../modules/database';
import {saasConfig} from "../config";
import {Template} from "../services/template";

const router: express.Router = express.Router();
export = router;

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {result: (await (new Template(req.body.token).createPage(req.body)))});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.put('/', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {result: (await (new Template(req.body.token).updatePage(req.body)))});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {
            result: (await (new Template(req.body.token).getPage({
                appName: req.query.appName as any,
                tag: (req.query.tag ?? undefined) as any
            })))
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});

import express from "express";
import response from "../../modules/response";
import db from '../../modules/database';
import {saasConfig} from "../../config";
import {Post} from "../services/post";
import exception from "../../modules/exception";

const router: express.Router = express.Router();

export = router;


router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new Post(req.get('g-app') as string,req.body.token);
        const postData = req.body.data;
        const data=(await post.lambda(req.query,req.body.router,postData,'post'))
        return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new Post(req.get('g-app') as string,req.body.token);
        const postData = req.query.data;
        const data=(await post.lambda(req.query,req.query.router as string,postData,'get'))
        return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new Post(req.get('g-app') as string,req.body.token);
        const postData = req.body.data;
        const data=(await post.lambda(req.query,req.body.router,postData,'delete'))
        return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new Post(req.get('g-app') as string,req.body.token);
        const postData = req.body.data;
        const data=(await post.lambda(req.query,req.body.router,postData,'put'))
        return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
});

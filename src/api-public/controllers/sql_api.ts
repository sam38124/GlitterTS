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
        const data=(await post.sqlApi(req.body.router,postData))
        return response.succ(resp, {result: true,data:data});
    } catch (err) {
        return response.fail(resp, err);
    }
});



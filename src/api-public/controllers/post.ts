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
        const postData = req.body.postData;
        postData.userID=req.body.token.userID;
        (await post.postContent({
            userID:req.body.token.userID,
            content: JSON.stringify(postData),
        }))
        return response.succ(resp, {result: true});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new Post(req.get('g-app') as string,req.body.token);
        const data=(await post.getContent(req.query)) as any
        data.result=true
        return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new Post(req.get('g-app') as string,req.body.token);
        const postData = req.body.postData;
        postData.userID=req.body.token.userID;
        (await post.putContent({
            userID:req.body.token.userID,
            content: JSON.stringify(postData),
        }))
        return response.succ(resp, {result: true});
    } catch (err) {
        return response.fail(resp, err);
    }
});




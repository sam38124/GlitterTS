import express from "express";
import response from "../../modules/response";
import db from '../../modules/database';
import {saasConfig} from "../../config";
import {Post} from "../services/post";
import exception from "../../modules/exception";
import {Shopping} from "../services/shopping.js";
import {UtPermission} from "../utils/ut-permission.js";
import {UtDatabase} from "../utils/ut-database.js";
import {Manager} from "../services/manager.js";

const router: express.Router = express.Router();

export = router;

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new Post(req.get('g-app') as string, req.body.token);
        const postData = req.body.postData;
        postData.userID = (req.body.token && req.body.token.userID) || 0;
        if (req.body.type === 'manager' &&
         !(await UtPermission.isManager(req))
        ) {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        const data=(await post.postContent({
            userID: postData.userID,
            content: JSON.stringify(postData),
        }, req.body.type === 'manager' ? `t_manager_post` : `t_post`))
        return response.succ(resp, {result: true,id:data.insertId});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new Post(req.get('g-app') as string, req.body.token);
        const data = (await post.getContent(req.query)) as any
        data.result = true
        return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/user', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new Post(req.get('g-app') as string, req.body.token);
        const data = (await post.getContentV2(req.query,false)) as any
        return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/manager', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new Post(req.get('g-app') as string, req.body.token);
        const data = (await post.getContentV2(req.query,true)) as any
        return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
});


router.put('/', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new Post(req.get('g-app') as string, req.body.token);
        const postData = req.body.postData;
        postData.userID = req.body.token.userID;
        if (req.body.type === 'manager' &&
            !(await UtPermission.isManager(req))
        ) {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        (await post.putContent({
            userID: req.body.token.userID,
            content: JSON.stringify(postData),
        }, req.body.type === 'manager' ? `t_manager_post` : `t_post`))
        return response.succ(resp, {result: true});
    } catch (err) {
        return response.fail(resp, err);
    }
});


router.get('/manager', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            let query = [
                `(content->>'$.type'='${req.query.type}')`
            ]
            req.query.search && query.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${req.query.search}%'))`)
            return response.succ(resp, await (new Shopping(req.get('g-app') as string, req.body.token).querySql(query, {
                page: (req.query.page ?? 0) as number,
                limit: (req.query.limit ?? 50) as number,
                id: req.query.id as string
            })));
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.delete('/manager', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            await db.query(`delete
                            FROM \`${req.get('g-app') as string}\`.t_manager_post
                            where id in (?)`, [(req.query.id as string).split(',')])
            return response.succ(resp, {result: true});
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
})

router.delete('/user', async (req: express.Request, resp: express.Response) => {
    try {
            if ((await UtPermission.isManager(req))) {
            await db.query(`delete
                            FROM \`${req.get('g-app') as string}\`.t_post
                            where id in (?)`, [(req.query.id as string).split(',')])
            return response.succ(resp, {result: true});
        } else{
            await db.query(`delete
                            FROM \`${req.get('g-app') as string}\`.t_post
                            where id in (?) and userID=?`, [(req.query.id as string).split(','),req.body.token.userID])
            return response.succ(resp, {result: true});
        }
    } catch (err) {
        return response.fail(resp, err);
    }
})


router.get('/user', async (req: express.Request, resp: express.Response) => {
    try {
        let query = [
            `(content->>'$.type'='${req.query.type}')`
        ]
        req.query.search && query.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${req.query.search}%'))`)
        const data = await new UtDatabase(req.get('g-app') as string, `t_post`).querySql(query, req.query as any)
        return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
});





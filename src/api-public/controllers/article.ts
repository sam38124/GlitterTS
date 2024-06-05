import {UtDatabase} from "../utils/ut-database.js";
import response from "../../modules/response.js";
import express from "express";
import db from '../../modules/database.js';
import {saasConfig} from "../../config.js";
import {Template} from "../../services/template.js";
import {UtPermission} from "../utils/ut-permission.js";
import {Shopping} from "../services/shopping.js";
import exception from "../../modules/exception.js";
import {IToken} from "../models/Auth.js";
import {Article} from "../services/article.js";

const router: express.Router = express.Router();
export = router;


router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        let query = [
            `page_type = 'blog'`,
            `\`appName\` = ${db.escape(req.get('g-app') as string)}`
        ]
        req.query.tag && query.push(`tag = ${db.escape(req.query.tag)}`)
        req.query.label && query.push(`(JSON_EXTRACT(page_config, '$.meta_article.tag') LIKE '%${req.query.label}%')`)
        if (!(await UtPermission.isManager(req))) {
            query.push(`(JSON_EXTRACT(page_config, '$.hideIndex') IS NULL
   OR JSON_EXTRACT(page_config, '$.hideIndex') != 'true')`)
        }

        if (req.query.search) {
            query.push(`tag like '%${req.query.search}%'`)
        }
        if (req.query.search) {
            query.push(`(tag like '%${req.query.search}%') 
            ||
             (UPPER(JSON_EXTRACT(page_config, '$.meta_article.title')) LIKE UPPER('%${req.query.search}%'))`)
        }
        const data = await new UtDatabase(process.env.GLITTER_DB!, `page_config`).querySql(query, req.query as any);
        return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
});


router.get('/manager', async (req: express.Request, resp: express.Response) => {
    try {
        let query = [
            `(content->>'$.type'='article')`
        ]
        if (req.query.for_index === 'true') {
            req.query.for_index && query.push(`((content->>'$.for_index' != 'false') || (content->>'$.for_index' IS NULL))`);
        } else {
            req.query.for_index && query.push(`((content->>'$.for_index' = 'false'))`);
        }
        req.query.tag && query.push(`(content->>'$.tag' = ${db.escape(req.query.tag)})`);
        req.query.label && query.push(`JSON_CONTAINS(content->'$.collection', '"${req.query.label}"')`);
        if (req.query.search) {
            query.push(`content->>'$.name' like '%${req.query.search}%'`)
        }
        const data = await new UtDatabase(req.get('g-app') as string, `t_manager_post`).querySql(query, req.query as any);
        return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/manager', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {
            result: await (new Article(req.get('g-app') as string, (req.body.token as IToken)).addArticle(req.body.data))
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.put('/manager', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {
            result: await (new Article(req.get('g-app') as string, (req.body.token as IToken)).putArticle(req.body.data))
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            await db.query(`delete
                            FROM \`${process.env.GLITTER_DB!}\`.page_config
                            where id in (?)
                              and userID = ?`, [
                (req.body.id as string).split(','),
                (req.body.token as IToken).userID
            ])
            return response.succ(resp, {result: true});
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
                            FROM \`${req.get('g-app')}\`.t_manager_post
                            where id in (?)`, [
                (req.body.id as string).split(',')
            ])
            return response.succ(resp, {result: true});
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }

});




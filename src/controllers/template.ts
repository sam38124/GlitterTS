import express from "express";
import response from "../modules/response";
import db from '../modules/database';
import {saasConfig} from "../config";
import {Template} from "../services/template";
import {App} from "../services/app.js";

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

router.delete('/', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {result: (await (new Template(req.body.token).deletePage(req.body)))});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        const result = (await (new Template(req.body.token).getPage(req.query as any)))
        let redirect = ''
        if (result.length === 0) {
            try {
                const config = (await db.execute(`SELECT \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`
                                                  FROM \`${saasConfig.SAAS_NAME}\`.app_config
                                                  where \`${saasConfig.SAAS_NAME}\`.app_config.appName = ${db.escape(req.query.appName)}
                `, []))[0]['config']
                if (config && ((await db.execute(`SELECT count(1)
                                                  FROM \`${saasConfig.SAAS_NAME}\`.page_config
                                                  where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(req.query.appName)}
                                                    and tag = ${db.escape(config['homePage'])}
                `, []))[0]["count(1)"] === 1)) {
                    redirect = config['homePage']
                } else {
                    redirect = (await db.execute(`SELECT tag
                                                  FROM \`${saasConfig.SAAS_NAME}\`.page_config
                                                  where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(req.query.appName)} limit 0,1
                    `, []))[0]['tag']
                }
            } catch (e) {

            }
        }
        let preload_data = {};
        if (req.query.preload) {
            preload_data = await App.preloadPageData(req.query.appName as any, req.query.tag as string)
        }
        return response.succ(resp, {
            result: result,
            redirect: redirect,
            preload_data: preload_data
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/create_template', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {
            result: (await new Template(req.body.token).postTemplate({
                appName: req.body.appName,
                data: req.body.config,
                tag: req.body.tag
            }))
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});

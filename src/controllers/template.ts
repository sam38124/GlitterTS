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

router.delete('/', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {result: (await (new Template(req.body.token).deletePage(req.body)))});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        const result= (await (new Template(req.body.token).getPage({
            appName: req.query.appName as any,
            tag: (req.query.tag ?? undefined) as any
        })))
        let redirect=''
        if(result.length === 0){
            const config = (await db.execute(`SELECT \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`
                                              FROM \`${saasConfig.SAAS_NAME}\`.app_config
                                              where \`${saasConfig.SAAS_NAME}\`.app_config.appName = ${db.escape(req.query.appName)}
`, []))[0]['config']
            if(config && ((await db.execute(`SELECT count(1)
                                              FROM \`${saasConfig.SAAS_NAME}\`.page_config
                                              where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(req.query.appName)} and tag=${db.escape(config['homePage'])}
`, []))[0]["count(1)"] === 1)){
                redirect=config['homePage']
            }else{
                redirect=(await db.execute(`SELECT tag
                                              FROM \`${saasConfig.SAAS_NAME}\`.page_config
                                              where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(req.query.appName)} limit 0,1
`, []))[0]['tag']
            }
        }

        return response.succ(resp, {
            result:result,
            redirect:redirect
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});

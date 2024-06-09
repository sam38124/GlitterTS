import express from "express";
import app from "../../app.js";
import {Invoice} from "../services/invoice.js";
import response from "../../modules/response.js";
import {EzInvoice} from "../services/ezpay/invoice.js";
import {GraphApi} from "../services/graph-api.js";
import {UtPermission} from "../utils/ut-permission.js";
import exception from "../../modules/exception.js";
import {UtDatabase} from "../utils/ut-database.js";
import db from "../../modules/database.js";
import {Firebase} from "../../modules/firebase.js";
import {saasConfig} from "../../config.js";


const router: express.Router = express.Router();

export = router;

router.post('/add', async (req: express.Request, resp: express.Response) => {
    try {
        if (!(await UtPermission.isManager(req))) {
            throw exception.BadRequestError('NO_PERMISSION', 'Only the app manager can access this function.', null);
        } else {

            return response.succ(resp, await (new GraphApi(req.get('g-app') as string)).insert({
                route: req.body.route,
                method: req.body.method,
                info: req.body.info
            }));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/update', async (req: express.Request, resp: express.Response) => {
    try {
        if (!(await UtPermission.isManager(req))) {
            throw exception.BadRequestError('NO_PERMISSION', 'Only the app manager can access this function.', null);
        } else {

            return response.succ(resp, await (new GraphApi(req.get('g-app') as string)).update({
                route: req.body.route,
                method: req.body.method,
                info: req.body.info,
                id: req.body.id as string
            }));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/list', async (req: express.Request, resp: express.Response) => {
    try {
        if (!(await UtPermission.isManager(req))) {
            throw exception.BadRequestError('NO_PERMISSION', 'Only the app manager can access this function.', null);
        } else {
            let query: any = [];
            (req.query as any).page = req.query.page ?? 0;
            (req.query as any).limit = req.query.limit ?? 50;
            const data = await new UtDatabase(req.get('g-app') as string, `t_graph_api`).querySql(query, req.query as any)

            return response.succ(resp, data);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});


router.delete('/delete', async (req: express.Request, resp: express.Response) => {
    try {
        if (!(await UtPermission.isManager(req))) {
            throw exception.BadRequestError('NO_PERMISSION', 'Only the app manager can access this function.', null);
        } else {
            (await db.query(`delete
                             FROM \`${req.get('g-app') as string}\`.t_graph_api
                             where id in (${req.body.id})`, []))
            return response.succ(resp, {result: true});
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});


['get', 'post', 'put', 'delete', 'patch'].map((dd: any) => {
    const html = String.raw;
    (router as any)[dd]('/', async (req: express.Request, resp: express.Response) => {
        try {
            const isManager = await UtPermission.isManager(req);
            const isAppUser = await UtPermission.isAppUser(req);
            let userData:any = await (async ()=>{
                if(isAppUser){
                    return (await db.query(`SELECT *
                                                          FROM \`${req.get('g-app')}\`.t_user
                                                          where userID = ?`, [req.body.token.userID]))[0]
                }
                if(isManager){
                    const brand=(await db.query(`SELECT brand FROM ${saasConfig.SAAS_NAME}.app_config where appName=?;`, [req.get('g-app') as string]))[0]['brand']

                    return (await db.query(`SELECT *
                                                          FROM \`${brand}\`.t_user
                                                          where userID = ?`, [req.body.token.userID]))[0]
                }
                return  undefined
            })()
            userData && (userData.pwd = undefined);
            const route = (await db.query(`select *
                                           from \`${req.get('g-app') as string}\`.t_graph_api
                                           where route = ?
                                             and method = ?`, [
                req.query.route,
                dd.toUpperCase()
            ]))[0];
            if (!route) {
                throw exception.BadRequestError('NO_API', 'Cant find this api.', null);
            } else {
                await db.queryLambada({
                    database: req.get('g-app')
                }, async (db) => {
                    (db as any).execute = (db as any).query;
                    const functionValue: { key: string, data: () => any }[] = [
                        {
                            key: 'db', data: () => {
                                return db
                            }
                        },
                        {
                            key: 'is_manager', data: () => {
                                return isManager
                            }
                        },
                        {
                            key: 'is_appUser', data: () => {
                                return isAppUser
                            }
                        },
                        {
                            key: 'body', data: () => {
                                return req.body
                            }
                        },
                        {
                            key: 'query', data: () => {
                                return req.query
                            }
                        }, {
                            key: 'user_data', data: () => {
                                return userData
                            }
                        },
                        {
                            key:'sendMessage',data:()=>{
                                return ((cf:any)=>{
                                    cf.app=req.get('g-app') as string;
                                    return new Firebase(req.get('g-app') as string).sendMessage(cf)
                                })
                            }
                        }
                    ];
                    const evalString = html`
                        return {
                        execute:(${functionValue.map((d2) => {
                            return d2.key
                        }).join(',')})=>{
                        try {
                        ${route.info.code.replace(
                                /new\s*Promise\s*\(\s*async\s*\(\s*resolve\s*,\s*reject\s*\)\s*=>\s*\{([\s\S]*)\}\s*\)/i,
                                'new Promise(async (resolve, reject) => { try { $1 } catch (error) { console.log(error);reject(error); } })'
                        )}
                        }catch (e) {
                        console.log(e)
                        }
                        }
                        }
                    `
                    const myFunction = new Function(evalString);
                    return response.succ(resp,
                        (await (myFunction().execute(
                            functionValue[0].data(),
                            functionValue[1].data(),
                            functionValue[2].data(),
                            functionValue[3].data(),
                            functionValue[4].data(),
                            functionValue[5].data(),
                            functionValue[6].data()
                        ))),
                    );
                })
            }
        } catch (err) {
            return response.fail(resp, err);
        }
    })
})
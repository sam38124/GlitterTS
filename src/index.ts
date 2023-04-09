import * as Glitter from 'ts-glitter';
import path from "path";
import express from 'express';
import cors from 'cors';
import redis from './modules/redis';
import Logger from './modules/logger';
import {v4 as uuidv4} from 'uuid';
import {asyncHooks as asyncHook} from './modules/hooks';
import {config, saasConfig} from "./config";
import contollers = require('./controllers');
import database from "./modules/database";
import {SaasScheme} from "./services/saas-table-check";
import db from './modules/database';
import {createBucket, listBuckets} from "./modules/AWSLib";
import AWS from "aws-sdk";
//Glitter FrontEnd Rout
const app = express();
const logger = new Logger();

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.raw());
app.use(express.json({limit: '50MB'}));
app.use(createContext);
app.use(contollers);

export async function initial(serverPort:number){
    await (async () => {
        await database.createPool();
        await SaasScheme.createScheme();
        await redis.connect();
        await createAppRoute();
        await listBuckets()
        await createBucket(config.AWS_S3_NAME as string);
        logger.info('[Init]', `Server start with env: ${process.env.NODE_ENV || 'local'}`);
        await app.listen(serverPort);
        logger.info('[Init]', `Server is listening on port: ${serverPort}`);
        console.log('Starting up the server now.');
    })();
}

function createContext(req: express.Request, res: express.Response, next: express.NextFunction) {
    const uuid = uuidv4();
    const ip = req.ip;
    const requestInfo = {uuid: `${uuid}`, method: `${req.method}`, url: `${req.url}`, ip: `${ip}`};
    asyncHook.getInstance().createRequestContext(requestInfo);
    next();
}

async function createAppRoute() {
    const apps = await db.execute(`SELECT appName
                                   FROM \`${saasConfig.SAAS_NAME}\`.app_config;`, [])
    for (const dd of apps) {
        await createAPP(dd)
    }
}

export async function createAPP(dd: any) {
    return await Glitter.setUP(app, [
        {
            rout: '/' + dd.appName,
            path: path.resolve( __dirname,'../lowcode'),
            seoManager: async (req, resp) => {
                try {
                    let data = (await db.execute(`SELECT page_config,\`${saasConfig.SAAS_NAME}\`.app_config.\`config\`
                                              FROM \`${saasConfig.SAAS_NAME}\`.page_config, \`${saasConfig.SAAS_NAME}\`.app_config
                                              where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(dd.appName)}
                                                and tag = ${db.escape(req.query.page)}
and \`${saasConfig.SAAS_NAME}\`.page_config.appName = \`${saasConfig.SAAS_NAME}\`.app_config.appName;
`, []))[0]
                    let redirect=''
                    if (data && data.page_config) {
                        const d = data.page_config.seo ?? {}
                        if(d.type!=='custom'){
                            data = (await db.execute(`SELECT page_config,\`${saasConfig.SAAS_NAME}\`.app_config.\`config\`
                                              FROM \`${saasConfig.SAAS_NAME}\`.page_config, \`${saasConfig.SAAS_NAME}\`.app_config
                                              where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(dd.appName)}
                                                and tag = ${db.escape(data.config.homePage)}
and \`${saasConfig.SAAS_NAME}\`.page_config.appName = \`${saasConfig.SAAS_NAME}\`.app_config.appName;
`, []))[0]
                        }
                    }else{
                        const config = (await db.execute(`SELECT \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`
                                              FROM \`${saasConfig.SAAS_NAME}\`.app_config
                                              where \`${saasConfig.SAAS_NAME}\`.app_config.appName = ${db.escape(dd.appName)}
`, []))[0]['config']
                        if(config && ((await db.execute(`SELECT count(1)
                                              FROM \`${saasConfig.SAAS_NAME}\`.page_config
                                              where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(dd.appName)} and tag=${db.escape(config['homePage'])}
`, []))[0]["count(1)"] === 1)){
                            redirect=config['homePage']
                        }else{
                            redirect=(await db.execute(`SELECT tag
                                              FROM \`${saasConfig.SAAS_NAME}\`.page_config
                                              where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(dd.appName)} limit 0,1
`, []))[0]['tag']
                        }
                    }
                    return (() => {
                        data.page_config=data.page_config??{}
                        if (data && data.page_config) {
                            const d = data.page_config.seo ?? {}
                            return `<title>${d.title ?? "尚未設定標題"}</title>
    <meta name="keywords" content="${d.keywords ?? "尚未設定關鍵字"}" />
    <link id="appImage" rel="shortcut icon" href="${d.logo ?? ""}" type="image/x-icon">
    <link rel="icon" href="${d.logo ?? ""}" type="image/png" sizes="128x128">
    <meta property="og:image" content="${d.image ?? ""}">
    <meta property="og:title" content="${d.title ?? ""}">
    <meta name="description" content="${d.content ?? ""}">`
                        } else {
                            return `<script>
window.location.href='?page=${redirect}';
</script>`
                        }
                    })() + `<script>
window.appName='${dd.appName}';
</script>`
                }catch (e){
                    return  `<script>
window.appName='${dd.appName}';
</script>`
                }

            }
        },
    ]);
}


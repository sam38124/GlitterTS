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
import public_contollers = require('./api-public/controllers');
import database from "./modules/database";
import {SaasScheme} from "./services/saas-table-check";
import db from './modules/database';
import {createBucket, listBuckets} from "./modules/AWSLib";
import AWS from "aws-sdk";
import {Live_source} from "./live_source";
import * as process from "process";

//Glitter FrontEnd Rout
export const app = express();
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
app.use(public_contollers);

export async function initial(serverPort: number) {
    await (async () => {
        await database.createPool();
        await SaasScheme.createScheme();
        await redis.connect();
        await createAppRoute();
        await listBuckets()
        await createBucket(config.AWS_S3_NAME as string);
        logger.info('[Init]', `Server start with env: ${process.env.NODE_ENV || 'local'}`);
        await app.listen(serverPort);
        // await createDomain('glitter-base.com');
        // await setDNS('glitter-base.com')

        logger.info('[Init]', `Server is listening on port: ${serverPort}`);
        console.log('Starting up the server now.');
    })();
}

async function createDomain(domainName: string) {
// 创建 Route 53 Domains 实例
    const route53domains = new AWS.Route53Domains();
// 定义注册域名的参数
    const contact = { // 管理员联系信息
        FirstName: 'jianzhi',
        LastName: 'wang',
        ContactType: 'PERSON',
        OrganizationName: 'liondesign',
        AddressLine1: 'No. 12, Lane 15, Lane 150, Section 3, Changming Road, Tanzi District, Taichung City',
        City: 'Taichung',
        CountryCode: 'TW',
        ZipCode: '427',
        PhoneNumber: '+886.978028730',
        Email: 'sam38124@gmail.com'
    }
    const domainParams = {
        DomainName: domainName, // 要注册的域名
        DurationInYears: 1, // 注册的年限
        AutoRenew: true, // 是否自动续费
        AdminContact: contact,
        RegistrantContact: contact,
        TechContact: contact,
        PrivacyProtectAdminContact: true, // 是否开启管理员联系信息的隐私保护
        PrivacyProtectRegistrantContact: true, // 是否开启注册人联系信息的隐私保护
        PrivacyProtectTechContact: true // 是否开启技术支持联系信息的隐私保护
    };

// 注册域名
    await route53domains.registerDomain(domainParams, (err, data) => {
        if (err) {

            console.error(err);
        } else {
            console.log('域名注册成功：', data);
        }
    });
}

async function setDNS(domainName: string) {
    const route53 = new AWS.Route53();
    const domainParams = {
        Name: domainName,
        CallerReference: Date.now().toString()
    };
    await route53.createHostedZone(domainParams, async (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`Domain ${domainName} created with ID ${data.HostedZone.Id}`);
            // 可在这里继续添加其他域名设置，如记录集等
            const resourceRecordSet = {
                Name: domainName,
                Type: 'A',
                ResourceRecords: [
                    {
                        Value: `3.36.55.11`
                    }
                ],
                TTL: 300 // 可根据需要自定义 TTL
            };
            // 定义 ChangeBatch 对象
            const changeBatch = {
                Changes: [
                    {
                        Action: 'UPSERT',
                        ResourceRecordSet: resourceRecordSet
                    }
                ]
            };
            // 构造 ChangeResourceRecordSets 请求参数
            const changeParams = {
                HostedZoneId: data.HostedZone.Id, // 替换为您的托管区域 ID
                ChangeBatch: changeBatch
            };

            // 提交A记录的更改请求
            await route53.changeResourceRecordSets(changeParams, (err, data) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`A record created for ${domainName} with ID ${data.ChangeInfo.Id}`);
                    // 可在这里继续添加其他域名设置，如CNAME记录等
                }
            });
        }
    });
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
    Live_source.liveAPP.push(dd.appName)
    return await Glitter.setUP(app, [
        {
            rout: '/' + encodeURI(dd.appName),
            path: path.resolve(__dirname, '../lowcode'),
            seoManager: async (req, resp) => {
                try {
                    let data = (await db.execute(`SELECT page_config, \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`,tag
                                                  FROM \`${saasConfig.SAAS_NAME}\`.page_config,
                                                       \`${saasConfig.SAAS_NAME}\`.app_config
                                                  where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(dd.appName)}
                                                    and tag = ${db.escape(req.query.page)}
                                                    and \`${saasConfig.SAAS_NAME}\`.page_config.appName = \`${saasConfig.SAAS_NAME}\`.app_config.appName;
                    `, []))[0]
                    let redirect = ''
                    if (data && data.page_config) {
                        const d = data.page_config.seo ?? {}
                        if (d.type !== 'custom') {
                            data = (await db.execute(`SELECT page_config, \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`,tag
                                                      FROM \`${saasConfig.SAAS_NAME}\`.page_config,
                                                           \`${saasConfig.SAAS_NAME}\`.app_config
                                                      where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(dd.appName)}
                                                        and tag = ${db.escape(data.config.homePage)}
                                                        and \`${saasConfig.SAAS_NAME}\`.page_config.appName = \`${saasConfig.SAAS_NAME}\`.app_config.appName;
                            `, []))[0]
                        }
                    } else {
                        const config = (await db.execute(`SELECT \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`
                                                          FROM \`${saasConfig.SAAS_NAME}\`.app_config
                                                          where \`${saasConfig.SAAS_NAME}\`.app_config.appName = ${db.escape(dd.appName)} limit 0,1
                        `, []))[0]['config']
                        if (config && ((await db.execute(`SELECT count(1)
                                                          FROM \`${saasConfig.SAAS_NAME}\`.page_config
                                                          where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(dd.appName)}
                                                            and tag = ${db.escape(config['homePage'])}
                        `, []))[0]["count(1)"] === 1)) {
                            redirect = config['homePage']
                        } else {
                            redirect = (await db.execute(`SELECT tag
                                                          FROM \`${saasConfig.SAAS_NAME}\`.page_config
                                                          where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(dd.appName)} limit 0,1
                            `, []))[0]['tag']
                        }
                        data = (await db.execute(`SELECT page_config, \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`,tag
                                                  FROM \`${saasConfig.SAAS_NAME}\`.page_config,
                                                       \`${saasConfig.SAAS_NAME}\`.app_config
                                                  where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(dd.appName)}
                                                    and tag = ${db.escape(redirect)}
                                                    and \`${saasConfig.SAAS_NAME}\`.page_config.appName = \`${saasConfig.SAAS_NAME}\`.app_config.appName;
                        `, []))[0]
                        if(req.query.type){
                            redirect+=`&type=${req.query.type}`
                        }
                    }
                    return  `${(() => {
                        data.page_config = data.page_config ?? {}
                        if (data && data.page_config) {
                            const d = data.page_config.seo ?? {}
                            return `<title>${d.title ?? "尚未設定標題"}</title>
    <link rel="canonical" href="./?page=${data.tag}">
    <meta name="keywords" content="${d.keywords ?? "尚未設定關鍵字"}" />
    <link id="appImage" rel="shortcut icon" href="${d.logo ?? ""}" type="image/x-icon">
    <link rel="icon" href="${d.logo ?? ""}" type="image/png" sizes="128x128">
    <meta property="og:image" content="${d.image ?? ""}">
    <meta property="og:title" content="${d.title ?? ""}">
    <meta name="description" content="${d.content ?? ""}">
    ${(() => {
                                if (redirect) {
                                    return `<script>
window.location.href='?page=${redirect}';
</script>`
                                } else {
                                    return ``
                                }
                            })()}
`
                        } else {
                            return `<script>
window.location.href='?page=${redirect}';
</script>`
                        }
                    })()}<script>
window.appName='${dd.appName}';
window.glitterBackend='${config.domain}';
</script>`
                } catch (e) {
                    return `<script>
window.appName='${dd.appName}';
window.glitterBackend='${config.domain}';
</script>`
                }

            }
        },
    ]);
}


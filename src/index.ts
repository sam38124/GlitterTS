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
import bodyParser from 'body-parser'
import {Post} from "./api-public/services/post.js";
import response from "./modules/response.js";
import {ApiPublic} from "./api-public/services/public-table-check.js";
import {Release} from "./services/release.js";
import fs from "fs";
import {App} from "./services/app.js";
import {Firebase} from "./modules/firebase.js";
import {GlitterUtil} from "./helper/glitter-util.js";
import Tool from "./api-public/services/ezpay/tool.js";
import crypto, { Encoding } from 'crypto';
import bcrypt from 'bcrypt';
//Glitter FrontEnd Rout
export const app = express();
const logger = new Logger();

app.options('/*', (req, res) => {
    // 处理 OPTIONS 请求，返回允许的方法和头信息
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,g-app');
    res.status(200).send();
});
// 添加路由和其他中间件
app.use(cors());
app.use(express.raw());
app.use(express.json({limit: '50MB'}));
app.use(createContext);
app.use(bodyParser.raw({type: '*/*'}));
app.use(contollers);
app.use(public_contollers);

export async function initial(serverPort: number) {
    await (async () => {
        await database.createPool();
        await SaasScheme.createScheme();
        await ApiPublic.createScheme(saasConfig.SAAS_NAME as string)
        await redis.connect();
        await createAppRoute();
        await listBuckets()
        await createBucket(config.AWS_S3_NAME as string);
        logger.info('[Init]', `Server start with env: ${process.env.NODE_ENV || 'local'}`);
        await app.listen(serverPort);
        fs.mkdirSync(path.resolve(__filename, '../app-project/work-space'), {recursive: true});
        Release.removeAllFilesInFolder(path.resolve(__filename, '../app-project/work-space'))
        if (process.env.firebase) {
            await Firebase.initial();
        }
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
    return await GlitterUtil.set_frontend(app, [
        {
            rout: '/' + encodeURI(dd.appName),
            path: path.resolve(__dirname, '../lowcode'),
            seoManager: async (req, resp) => {
                try {
                    let appName = dd.appName
                    if (req.query.appName) {
                        appName = req.query.appName
                    }
                    console.log(`appName-->`,appName)
                    //SAAS品牌和用戶類型
                    const brandAndMemberType=await App.checkBrandAndMemberType(appName)

                    let vm = {
                        glitterInfo: `<script>
window.appName='${appName}';
window.glitterBase='${brandAndMemberType.brand}'
window.memberType='${brandAndMemberType.memberType}'
window.glitterBackend='${config.domain}';
</script>`
                    }
                    let data = (await db.execute(`SELECT page_config, \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`, tag
                                                  FROM \`${saasConfig.SAAS_NAME}\`.page_config,
                                                       \`${saasConfig.SAAS_NAME}\`.app_config
                                                  where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(appName)}
                                                    and tag = ${db.escape(req.query.page)}
                                                    and \`${saasConfig.SAAS_NAME}\`.page_config.appName = \`${saasConfig.SAAS_NAME}\`.app_config.appName;
                    `, []))[0]
                    let redirect = ''
                    if (data && data.page_config) {
                        const d = data.page_config.seo ?? {}
                        if (d.type !== 'custom') {
                            data = (await db.execute(`SELECT page_config, \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`, tag
                                                      FROM \`${saasConfig.SAAS_NAME}\`.page_config,
                                                           \`${saasConfig.SAAS_NAME}\`.app_config
                                                      where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(appName)}
                                                        and tag = ${db.escape(data.config.homePage)}
                                                        and \`${saasConfig.SAAS_NAME}\`.page_config.appName = \`${saasConfig.SAAS_NAME}\`.app_config.appName;
                            `, []))[0]
                        }
                    } else {
                        const config = (await db.execute(`SELECT \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`
                                                          FROM \`${saasConfig.SAAS_NAME}\`.app_config
                                                          where \`${saasConfig.SAAS_NAME}\`.app_config.appName = ${db.escape(appName)} limit 0,1
                        `, []))[0]['config']
                        if (config && ((await db.execute(`SELECT count(1)
                                                          FROM \`${saasConfig.SAAS_NAME}\`.page_config
                                                          where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(appName)}
                                                            and tag = ${db.escape(config['homePage'])}
                        `, []))[0]["count(1)"] === 1)) {
                            redirect = config['homePage']
                        } else {
                            redirect = (await db.execute(`SELECT tag
                                                          FROM \`${saasConfig.SAAS_NAME}\`.page_config
                                                          where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(appName)} limit 0,1
                            `, []))[0]['tag']
                        }
                        data = (await db.execute(`SELECT page_config, \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`, tag
                                                  FROM \`${saasConfig.SAAS_NAME}\`.page_config,
                                                       \`${saasConfig.SAAS_NAME}\`.app_config
                                                  where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(appName)}
                                                    and tag = ${db.escape(redirect)}
                                                    and \`${saasConfig.SAAS_NAME}\`.page_config.appName = \`${saasConfig.SAAS_NAME}\`.app_config.appName;
                        `, []))[0]

                        if (req.query.type) {
                            redirect += `&type=${req.query.type}`
                        }
                        if (req.query.appName) {
                            redirect += `&appName=${req.query.appName}`
                        }
                    }
                    return `${(() => {
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
     <meta name="og:description" content="${d.content ?? ""}">
  ${(() => {
                                if (req.query.type === 'editor') {
                                    return ``
                                } else {
                                    return `  ${(data.config.globalStyle ?? []).map((dd: any) => {
                                        try {
                                          if (dd.data.elem === 'link') {
                                                return `<link type="text/css" rel="stylesheet" href="${dd.data.attr.find((dd: any) => {
                                                    return dd.attr === 'href'
                                                }).value}">`
                                            }
                                        } catch (e) {
                                            return ``
                                        }
                                    }).join('')}`
                                }
                            })()}
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
                    })()}${vm.glitterInfo}`
                } catch (e:any) {
                    console.log(e)
                    return e.message
                }

            }
        },
    ]);
}


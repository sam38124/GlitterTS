import path from 'path';
import express from 'express';
import cors from 'cors';
import redis from './modules/redis';
import Logger from './modules/logger';
import {v4 as uuidv4} from 'uuid';
import {asyncHooks as asyncHook} from './modules/hooks';
import {config, ConfigSetting, saasConfig} from './config';
import contollers = require('./controllers');
import public_contollers = require('./api-public/controllers');
import database from './modules/database';
import {SaasScheme} from './services/saas-table-check';
import db from './modules/database';
import {createBucket, listBuckets} from './modules/AWSLib';
import {Live_source} from './live_source';
import * as process from 'process';
import bodyParser from 'body-parser';
import {ApiPublic} from './api-public/services/public-table-check.js';
import {Release} from './services/release.js';
import fs from 'fs';
import {App} from './services/app.js';
import {Firebase} from './modules/firebase.js';
import {GlitterUtil} from './helper/glitter-util.js';
import {Seo} from './services/seo.js';
import {Shopping} from './api-public/services/shopping.js';
import {WebSocket} from './services/web-socket.js';
import {UtDatabase} from './api-public/utils/ut-database.js';
import compression from 'compression';
import {User} from './api-public/services/user.js';
import {Schedule} from './api-public/services/schedule.js';
import {Private_config} from './services/private_config.js';
import moment from 'moment/moment.js';
import xmlFormatter from 'xml-formatter';
import {SystemSchedule} from './services/system-schedule';
import {Ai} from './services/ai.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import {Monitor} from './api-public/services/monitor.js';
import tool from './services/tool.js';
import {InitialFakeData} from './api-public/services/initial-fake-data.js';
import {UpdateScript} from './update-script.js';

export const app = express();
const logger = new Logger();

app.options('/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,g-app,mac_address');
    res.status(200).send();
});
// 配置 session 中间件
app.use(
    session({
        secret: config.SECRET_KEY, // 应用中应该使用一个更强壮的密钥
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 1000 * 60 * 60 * 24 * 365}, // 设置 Cookie 有效期为1年
    })
);

app.use(cookieParser());
app.use(cors());
app.use(compression());
app.use(express.raw({limit: '100MB'}));
app.use(express.json({limit: '100MB'}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json({limit: '100MB'}));
app.use(createContext);
app.use(bodyParser.raw({type: '*/*'}));
app.use(contollers);
app.use(public_contollers);

export async function initial(serverPort: number) {
    await (async () => {
        await database.createPool();
        await Ai.initial();
        await SaasScheme.createScheme();
        await ApiPublic.createScheme(saasConfig.SAAS_NAME as string);
        await redis.connect();
        await createAppRoute();
        await listBuckets();
        await createBucket(config.AWS_S3_NAME as string);
        logger.info('[Init]', `Server start with env: ${process.env.NODE_ENV || 'local'}`);
        await app.listen(serverPort);
        fs.mkdirSync(path.resolve(__filename, '../app-project/work-space'), {recursive: true});
        Release.removeAllFilesInFolder(path.resolve(__filename, '../app-project/work-space'));
        if (process.env.firebase) {
            await Firebase.initial();
        }
        // await UpdateScript.run()
        if (ConfigSetting.runSchedule) {
            new Schedule().main();
            new SystemSchedule().start();
        }
        WebSocket.start();

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
    const apps = await db.execute(
        `SELECT appName
         FROM \`${saasConfig.SAAS_NAME}\`.app_config;
        `,
        []
    );
    for (const dd of apps) {
        await createAPP(dd);
    }
}

export async function createAPP(dd: any) {
    const html = String.raw;
    Live_source.liveAPP.push(dd.appName);
    Schedule.app.push(dd.appName);
    const file_path = path.resolve(__dirname, '../lowcode');
    return await GlitterUtil.set_frontend_v2(app, [
        {
            rout: '/' + encodeURI(dd.appName) + '/*',
            path: file_path,
            app_name: dd.appName,
            root_path: '/' + encodeURI(dd.appName) + '/',
            seoManager: async (req) => {
                try {
                    if (req.query.state === 'google_login') {
                        req.query.page = 'login';
                    }
                    let appName = dd.appName;
                    if (req.query.appName) {
                        appName = req.query.appName;
                    }
                    req.headers['g-app'] = appName;
                    const start=(new Date()).getTime()
                    //插入瀏覽紀錄
                    Monitor.insertHistory({
                        req_type: 'file',
                        req: req,
                    });
                    console.log(`insertHistory==>`,(new Date().getTime() - start)/1000)
                    //確認資料庫是否存在
                    await ApiPublic.createScheme(appName);
                    console.log(`createScheme==>`,(new Date().getTime() - start)/1000)
                    //確認SAAS用戶資訊
                    const brandAndMemberType = await App.checkBrandAndMemberType(appName);
                    console.log(`brandAndMemberType==>`,(new Date().getTime() - start)/1000)
                    //取得頁面資訊
                    let data = await Seo.getPageInfo(appName, req.query.page as string);
                    console.log(`getPageInfo==>`,(new Date().getTime() - start)/1000)
                    let customCode = await new User(appName).getConfigV2({
                        key: 'ga4_config',
                        user_id: 'manager',
                    });
                    console.log(`customCode==>`,(new Date().getTime() - start)/1000)
                    if (data && data.page_config) {
                        data.page_config = data.page_config ?? {};
                        const d = data.page_config.seo ?? {};
                        if (data.page_type === 'article' && data.page_config.template_type === 'product') {
                            const product_domain = (req.query.page as string).split('/')[1];
                            const pd = await new Shopping(appName, undefined).getProduct(
                                product_domain
                                    ? {
                                        page: 0,
                                        limit: 1,
                                        domain: decodeURIComponent(product_domain),
                                    }
                                    : {
                                        page: 0,
                                        limit: 1,
                                        id: req.query.product_id as string,
                                    }
                            );

                            if (pd.data.content) {
                                const productSeo = pd.data.content.seo ?? {};
                                data = await Seo.getPageInfo(appName, data.config.homePage);
                                data.page_config = data.page_config ?? {};
                                data.page_config.seo = data.page_config.seo ?? {};
                                data.page_config.seo.title = productSeo.title;
                                data.page_config.seo.image = pd.data.content.preview_image[0];
                                data.page_config.seo.content = productSeo.content;
                            } else {
                                data = await Seo.getPageInfo(appName, data.config.homePage);
                            }
                        } else if (data.page_type === 'article' && data.page_config.template_type === 'blog') {
                            req.query.article = req.query.article || (req.query.page as any).split('/')[1];
                            let query = [`(content->>'$.type'='article')`, `(content->>'$.tag'='${req.query.article}')`];
                            const article: any = await new UtDatabase(appName, `t_manager_post`).querySql(query, {
                                page: 0,
                                limit: 1,
                            });
                            data = await Seo.getPageInfo(appName, data.config.homePage);
                            data.page_config = data.page_config ?? {};
                            data.page_config.seo = data.page_config.seo ?? {};
                            if (article.data[0]) {
                                data.page_config.seo.title = article.data[0].content.seo.title;
                                data.page_config.seo.content = article.data[0].content.seo.content;
                                data.page_config.seo.keywords = article.data[0].content.seo.keywords;
                            }
                        } else if (d.type !== 'custom') {
                            data = await Seo.getPageInfo(appName, data.config.homePage);
                        }
                        const preload = req.query.isIframe === 'true' ? {} : await App.preloadPageData(appName, req.query.page as any);
                        data.page_config = data.page_config ?? {};
                        data.page_config.seo = data.page_config.seo ?? {};
                        const seo_detail = await getSeoDetail(appName, req);
                        if (seo_detail) {
                            Object.keys(seo_detail).map((dd) => {
                                data.page_config.seo[dd] = seo_detail[dd];
                            });
                        }
                        let link_prefix = req.originalUrl.split('/')[1];
                        if (ConfigSetting.is_local) {
                            if (link_prefix !== 'shopnex' && link_prefix !== 'codenex_v2') {
                                link_prefix = '';
                            }
                        } else {
                            link_prefix = '';
                        }
                        let distribution_code = '';
                        if ((req.query.page as string).split('/')[0] === 'distribution' && (req.query.page as string).split('/')[1]) {
                            const redURL = new URL(`https://127.0.0.1${req.url}`);
                            const page = (
                                await db.query(
                                    `SELECT *
                                     FROM \`${appName}\`.t_recommend_links
                                     WHERE content ->>'$.link' = ?;
                                    `,
                                    [(req.query.page as string).split('/')[1]]
                                )
                            )[0].content;
                            distribution_code = `
                                localStorage.setItem('distributionCode','${page.code}');
                                location.href='${page.redirect}${redURL.search}';
                            `;
                        }
                        console.log(`wait_return==>`,(new Date().getTime() - start)/1000)
                        return html`${(() => {
                            const d = data.page_config.seo;
                            return html`
                                <head>
                                    ${(() => {
                                        if (req.query.type === 'editor') {
                                            return html`<title>SHOPNEX後台系統</title>
                                            <link rel="canonical" href="/index"/>
                                            <meta name="keywords" content="SHOPNEX,電商平台"/>
                                            <link
                                                    id="appImage"
                                                    rel="shortcut icon"
                                                    href="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png"
                                                    type="image/x-icon"
                                            />
                                            <link
                                                    rel="icon"
                                                    href="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png"
                                                    type="image/png"
                                                    sizes="128x128"
                                            />
                                            <meta property="og:image"
                                                  content="https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1718778766524-shopnex_banner.jpg"/>
                                            <meta property="og:title" content="SHOPNEX後台系統"/>
                                            <meta
                                                    name="description"
                                                    content="SHOPNEX電商開店平台，零抽成、免手續費。提供精美模板和豐富插件，操作簡單，3分鐘內快速打造專屬商店。購物車、金物流、SEO行銷、資料分析一站搞定。支援APP上架，並提供100%客製化設計，立即免費體驗30天。"
                                            />
                                            <meta
                                                    name="og:description"
                                                    content="SHOPNEX電商開店平台，零抽成、免手續費。提供精美模板和豐富插件，操作簡單，3分鐘內快速打造專屬商店。購物車、金物流、SEO行銷、資料分析一站搞定。支援APP上架，並提供100%客製化設計，立即免費體驗30天。"
                                            />`;
                                        } else {
                                            return html`<title>${d.title ?? '尚未設定標題'}</title>
                                            <link rel="canonical"
                                                  href="/${link_prefix && `${link_prefix}/`}${data.tag}"/>
                                            <meta name="keywords" content="${d.keywords ?? '尚未設定關鍵字'}"/>
                                            <link id="appImage" rel="shortcut icon" href="${d.logo ?? ''}"
                                                  type="image/x-icon"/>
                                            <link rel="icon" href="${d.logo ?? ''}" type="image/png" sizes="128x128"/>
                                            <meta property="og:image" content="${d.image ?? ''}"/>
                                            <meta property="og:title" content="${(d.title ?? '').replace(/\n/g, '')}"/>
                                            <meta name="description" content="${(d.content ?? '').replace(/\n/g, '')}"/>
                                            <meta name="og:description"
                                                  content="${(d.content ?? '').replace(/\n/g, '')}"/>`;
                                        }
                                    })()}
                                    ${d.code ?? ''}
                                    ${(() => {
                                        if (req.query.type === 'editor') {
                                            return ``;
                                        } else {
                                            return `${(data.config.globalStyle ?? [])
                                                    .map((dd: any) => {
                                                        try {
                                                            if (dd.data.elem === 'link') {
                                                                return html`
                                                                    <link
                                                                            type="text/css"
                                                                            rel="stylesheet"
                                                                            href="${dd.data.attr.find((dd: any) => {
                                                                                return dd.attr === 'href';
                                                                            }).value}"
                                                                    />`;
                                                            }
                                                        } catch (e) {
                                                            return ``;
                                                        }
                                                    })
                                                    .join('')}`;
                                        }
                                    })()}
                                </head>
                            `;
                        })()}
                        <script>
                            ${d.custom_script ?? ''}
                            window.appName = '${appName}';
                            window.glitterBase = '${brandAndMemberType.brand}';
                            window.memberType = '${brandAndMemberType.memberType}';
                            window.glitterBackend = '${config.domain}';
                            window.preloadData = ${JSON.stringify(preload)
                                    .replace(/<\/script>/g, 'sdjuescript_prepand')
                                    .replace(/<script>/g, 'sdjuescript_prefix')};
                            window.preloadData = JSON.parse(JSON.stringify(window.preloadData).replace(/sdjuescript_prepand/g, '</s' + 'cript>').replace(/sdjuescript_prefix/g, '<s' + 'cript>'))
                            window.glitter_page = '${req.query.page}';
                            ${distribution_code}
                        </script>
                        ${[
                            {src: 'glitterBundle/GlitterInitial.js', type: 'module'},
                            {src: 'glitterBundle/module/html-generate.js', type: 'module'},
                            {src: 'glitterBundle/html-component/widget.js', type: 'module'},
                            {src: 'glitterBundle/plugins/trigger-event.js', type: 'module'},
                            {src: 'api/pageConfig.js', type: 'module'},
                        ]
                                .map((dd) => {
                                    return html`
                                        <script src="/${link_prefix && `${link_prefix}/`}${dd.src}"
                                                type="${dd.type}"></script>`;
                                })
                                .join('')}
                        ${(preload.event ?? [])
                                .filter((dd: any) => {
                                    return dd;
                                })
                                .map((dd: any) => {
                                    const link = dd.fun.replace(`TriggerEvent.setEventRouter(import.meta.url, '.`, 'official_event');
                                    return link.substring(0, link.length - 2);
                                })
                                .map((dd: any) => {
                                    return html`
                                        <script src="/${link_prefix && `${link_prefix}/`}${dd}"
                                                type="module"></script>`;
                                })
                                .join('')}
                        </head>
                        ${(() => {
                            if (req.query.type === 'editor') {
                                return ``;
                            } else {
                                return html`
                                    ${(customCode.ga4 || [])
                                            .map((dd: any) => {
                                                return html`<!-- Google tag (gtag.js) -->
                                                <script async
                                                        src="https://www.googletagmanager.com/gtag/js?id=${dd.code}"></script>
                                                <script>
                                                    window.dataLayer = window.dataLayer || [];

                                                    function gtag() {
                                                        dataLayer.push(arguments);
                                                    }

                                                    gtag('js', new Date());

                                                    gtag('config', '${dd.code}');
                                                </script>`;
                                            })
                                            .join('')}
                                    ${(customCode.g_tag || [])
                                            .map((dd: any) => {
                                                return html`<!-- Google tag (gtag.js) -->
                                                <!-- Google Tag Manager -->
                                                <script>
                                                    (function (w, d, s, l, i) {
                                                        w[l] = w[l] || [];
                                                        w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
                                                        var f = d.getElementsByTagName(s)[0],
                                                                j = d.createElement(s),
                                                                dl = l != 'dataLayer' ? '&l=' + l : '';
                                                        j.async = true;
                                                        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                                                        f.parentNode.insertBefore(j, f);
                                                    })(window, document, 'script', 'dataLayer', '${dd.code}');
                                                </script>
                                                <!-- End Google Tag Manager -->`;
                                            })
                                            .join('')}
                                `;
                            }
                        })()}
                        `;
                    } else {
                        console.log(`brandAndMemberType->redirect`);
                        return await Seo.redirectToHomePage(appName, req);
                    }
                } catch (e: any) {
                    console.log(e);
                    return `${e}`;
                }
            },
            sitemap: async (req, resp) => {
                let appName = dd.appName;
                if (req.query.appName) {
                    appName = req.query.appName;
                }
                let query = [`(content->>'$.type'='article')`];
                const article: any = await new UtDatabase(appName, `t_manager_post`).querySql(query, {
                    page: 0,
                    limit: 10000,
                });
                const domain = (
                    await db.query(
                        `select \`domain\`
                         from \`${saasConfig.SAAS_NAME}\`.app_config
                         where appName = ?`,
                        [appName]
                    )
                )[0]['domain'];

                const site_map = await getSeoSiteMap(appName, req);
                const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
                    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                        ${(
                    await db.query(
                        `select page_config, tag, updated_time
                         from \`${saasConfig.SAAS_NAME}\`.page_config
                         where appName = ?
                           and page_config ->>'$.seo.type'='custom'
                        `,
                        [appName]
                    )
                )
                    .map((d2: any) => {
                        return `<url>
                                    <loc>${`https://${domain}/${d2.tag}`.replace(/ /g, '+')}</loc>
                                    <lastmod>${moment(new Date(d2.updated_time)).format('YYYY-MM-DD')}</lastmod>
                                </url> `;
                    })
                    .join('')}
                        ${article.data
                    .map((d2: any) => {
                        if (!d2.content.template) {
                            return ``;
                        }
                        return `<url>
                                    <loc>${`https://${domain}/${d2.content.for_index === 'false' ? `pages` : `blogs`}/${d2.content.tag}`.replace(/ /g, '+')}</loc>
                                    <lastmod>${moment(new Date(d2.updated_time)).format('YYYY-MM-DD')}</lastmod>
                                </url> `;
                    })
                    .join('')}
                        ${(site_map || []).map((d2: any) => {
                    return `<url>
                                <loc>${`https://${domain}/${d2.url}`.replace(/ /g, '+')}</loc>
                                <lastmod>${d2.updated_time ? moment(new Date(d2.updated_time)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DDTHH:mm:SS+00:00')}</lastmod>
                                <changefreq>weekly</changefreq>
                            </url> `;
                })}
                    </urlset> `;
                return xmlFormatter(sitemap, {
                    indentation: '  ', // 使用兩個空格進行縮進
                    filter: (node) => node.type !== 'Comment', // 選擇性過濾節點
                    collapseContent: true, // 折疊內部文本
                });
            },
            sitemap_list: async (req, resp) => {
                let appName = dd.appName;
                if (req.query.appName) {
                    appName = req.query.appName;
                }
                const domain = (
                    await db.query(
                        `select \`domain\`
                         from \`${saasConfig.SAAS_NAME}\`.app_config
                         where appName = ?`,
                        [appName]
                    )
                )[0]['domain'];
                return `<?xml version="1.0" encoding="UTF-8"?>
                    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                        <!-- This is the parent sitemap linking to additional sitemaps for products, collections and pages as shown below. The sitemap can not be edited manually, but is kept up to date in real time. -->
                        <sitemap>
                            <loc>https://${domain}/sitemap_detail.xml</loc>
                        </sitemap>
                    </sitemapindex> `;
            },
            robots: async (req, resp) => {
                let appName = dd.appName;
                if (req.query.appName) {
                    appName = req.query.appName;
                }
                const domain = (
                    await db.query(
                        `select \`domain\`
                         from \`${saasConfig.SAAS_NAME}\`.app_config
                         where appName = ?`,
                        [appName]
                    )
                )[0]['domain'];
                return html`# we use SHOPNEX as our ecommerce platform User-agent: * Sitemap: https://${domain}/sitemap.xml `;
            },
            sitemap_test: async (req, resp) => {
                let appName = dd.appName;
                if (req.query.appName) {
                    appName = req.query.appName;
                }
                const domain = (
                    await db.query(
                        `select \`domain\`
                         from \`${saasConfig.SAAS_NAME}\`.app_config
                         where appName = ?`,
                        [appName]
                    )
                )[0]['domain'];
                return `<?xml version="1.0" encoding="UTF-8"?>
                    <urlset
                        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"
                        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                    >
                        <url>
                            <loc>https://${domain}/index</loc>
                            <lastmod>2024-06-16T02:53:00+00:00</lastmod>
                            <changefreq>weekly</changefreq>
                        </url>
                    </urlset>`;
            },
        },
    ]);
}

async function getSeoDetail(appName: string, req: any) {
    const sqlData = await Private_config.getConfig({
        appName: appName,
        key: 'seo_webhook',
    });
    if (!sqlData[0] || !sqlData[0].value) {
        return undefined;
    }
    const html = String.raw;
    return await db.queryLambada(
        {
            database: appName,
        },
        async (db) => {
            (db as any).execute = (db as any).query;
            const functionValue: { key: string; data: () => any }[] = [
                {
                    key: 'db',
                    data: () => {
                        return db;
                    },
                },
                {
                    key: 'req',
                    data: () => {
                        return req;
                    },
                },
            ];
            const evalString = `
                return {
                execute:(${functionValue
                .map((d2) => {
                    return d2.key;
                })
                .join(',')})=>{
                try {
                ${sqlData[0].value.value.replace(
                /new\s*Promise\s*\(\s*async\s*\(\s*resolve\s*,\s*reject\s*\)\s*=>\s*\{([\s\S]*)\}\s*\)/i,
                'new Promise(async (resolve, reject) => { try { $1 } catch (error) { console.log(error);reject(error); } })'
            )}
                }catch (e) { console.log(e) } } }
            `;
            const myFunction = new Function(evalString);
            return await myFunction().execute(functionValue[0].data(), functionValue[1].data());
        }
    );
}

async function getSeoSiteMap(appName: string, req: any) {
    const sqlData = await Private_config.getConfig({
        appName: appName,
        key: 'sitemap_webhook',
    });
    if (!sqlData[0] || !sqlData[0].value) {
        return undefined;
    }
    const html = String.raw;
    return await db.queryLambada(
        {
            database: appName,
        },
        async (db) => {
            (db as any).execute = (db as any).query;
            const functionValue: { key: string; data: () => any }[] = [
                {
                    key: 'db',
                    data: () => {
                        return db;
                    },
                },
                {
                    key: 'req',
                    data: () => {
                        return req;
                    },
                },
            ];
            const evalString = `
                return {
                execute:(${functionValue
                .map((d2) => {
                    return d2.key;
                })
                .join(',')})=>{
                try {
                ${sqlData[0].value.value.replace(
                /new\s*Promise\s*\(\s*async\s*\(\s*resolve\s*,\s*reject\s*\)\s*=>\s*\{([\s\S]*)\}\s*\)/i,
                'new Promise(async (resolve, reject) => { try { $1 } catch (error) { console.log(error);reject(error); } })'
            )}
                }catch (e) { console.log(e) } } }
            `;
            const myFunction = new Function(evalString);
            return await myFunction().execute(functionValue[0].data(), functionValue[1].data());
        }
    );
}



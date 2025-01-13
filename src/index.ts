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
import {UpdateScript} from "./update-script.js";
import {Manager} from "./api-public/services/manager.js";
import {SitemapStream, streamToPromise} from "sitemap";
import {Readable} from "stream";
import AWS from "aws-sdk";
import {extractCols, extractProds, SeoConfig} from "./seo-config.js";

export const app = express();
const logger = new Logger();

app.options('/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,g-app,mac_address,language,currency_code');
    res.status(200).send();
});

// 配置 session
app.use(
    session({
        secret: config.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 1000 * 60 * 60 * 24 * 365}, // 設定 cookie 期限一年
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


// 信任代理
app.set('trust proxy', true);


export async function createAPP(dd: any) {
    const html = String.raw;
    Live_source.liveAPP.push(dd.appName);
    Schedule.app.push(dd.appName);
    const file_path = path.resolve(__dirname, '../lowcode');
    return await GlitterUtil.set_frontend_v2(
        app,
        ['/' + encodeURI(dd.appName) + '/*', '/' + encodeURI(dd.appName)].map((rout) => {
            return {
                rout: rout,
                path: file_path,
                app_name: dd.appName,
                root_path: '/' + encodeURI(dd.appName) + '/',
                seoManager: async (req) => {
                    console.log(`X-Original-URL=>`,req.headers['x-original-url']);
                    const og_url=req.headers['x-original-url']
                    try {
                        if (req.query.state === 'google_login') {
                            req.query.page = 'login';
                        }
                        let appName = dd.appName;
                        if (req.query.appName) {
                            appName = req.query.appName;
                        }else if(og_url){
                            const new_app=(await db.query(`SELECT * FROM \`${saasConfig.SAAS_NAME}\`.app_config where LOWER(domain) = ?`,[og_url]))[0]
                            if((new_app && new_app.appName)){
                                appName=(new_app && new_app.appName)
                            }else{
                                return {
                                    head:'',
                                    body:`<script>window.location.href='https://shopnex.cc'</script>`
                                }
                            }
                        }
                        req.headers['g-app'] = appName;
                        const start = new Date().getTime();
                        console.log(`getPageInfo==>`, (new Date().getTime() - start) / 1000);
                        //SEO內容
                        let seo_content: string[] = []
                        let [
                            customCode,
                            FBCode,
                            store_info,
                            language_label,
                            check_schema,
                            brandAndMemberType,
                            login_config,
                            ip_country
                        ] = await Promise.all([new User(appName).getConfigV2({
                            key: 'ga4_config',
                            user_id: 'manager',
                        }), new User(appName).getConfigV2({
                            key: 'login_fb_setting',
                            user_id: 'manager',
                        }), new User(appName).getConfigV2({
                            key: 'store-information',
                            user_id: 'manager',
                        }), new User(appName).getConfigV2({
                            key: 'language-label',
                            user_id: 'manager',
                        }), ApiPublic.createScheme(appName),
                            App.checkBrandAndMemberType(appName), new User(req.get('g-app') as string, req.body.token).getConfigV2({
                                key: 'login_config',
                                user_id: 'manager',
                            }), User.ipInfo((req.query.ip || req.headers['x-real-ip'] || req.ip) as string)])
                        //取得多國語言
                        const language: any = await SeoConfig.language(store_info, req)
                        //插入瀏覽紀錄
                        Monitor.insertHistory({
                            req_type: 'file',
                            req: req,
                        });
                        //取得SEO頁面資訊
                        let data = await Seo.getPageInfo(appName, req.query.page as string, language);
                        //首頁SEO
                        let home_page_data = await (async () => {
                            if (data && data.config) {
                                return await Seo.getPageInfo(appName, data.config.homePage, language);
                            } else {
                                return await Seo.getPageInfo(appName, 'index', language);
                            }
                        })();
                        if (data && data.page_config) {
                            data.page_config = data.page_config ?? {};
                            const d = data.page_config.seo ?? {};
                            //商品搜索
                            if (`${req.query.page}`.startsWith('products/')) {
                                await SeoConfig.productSEO({
                                    data,
                                    language,
                                    appName,
                                    product_id: req.query.product_id as any,
                                    page: (req.query.page) as any
                                })
                            } else if (`${req.query.page}`.startsWith('blogs/')) {
                                //網誌搜索
                                await SeoConfig.articleSeo({
                                    article: req.query.article as any,
                                    page: req.query.page as any,
                                    language, appName, data
                                })
                            } else if (`${req.query.page}`.startsWith('pages/')) {
                                //頁面搜索
                                await SeoConfig.articleSeo({
                                    article: req.query.article as any,
                                    page: req.query.page as any,
                                    language, appName, data
                                })
                            } else if (d.type !== 'custom') {
                                data = home_page_data;
                            }
                            const preload = req.query.isIframe === 'true' ? {} : await App.preloadPageData(appName, req.query.page as any, language);
                            data.page_config = data.page_config ?? {};
                            data.page_config.seo = data.page_config.seo ?? {};
                            const seo_detail = await getSeoDetail(appName, req);
                            if (seo_detail) {
                                Object.keys(seo_detail).map((dd) => {
                                    data.page_config.seo[dd] = seo_detail[dd];
                                });
                            }
                            let link_prefix = req.originalUrl.split('/')[1];
                            if (link_prefix.includes('?')) {
                                link_prefix = link_prefix.substring(0, link_prefix.indexOf('?'));
                            }
                            if (ConfigSetting.is_local) {
                                if (link_prefix !== 'shopnex' && link_prefix !== 'codenex_v2') {
                                    link_prefix = '';
                                }
                            } else {
                                link_prefix = '';
                            }
                            let distribution_code = '';
                            req.query.page = req.query.page || 'index';
                            if ((req.query.page as string).split('/')[0] === 'order_detail' && req.query.EndCheckout === '1') {
                                distribution_code = `
                                    localStorage.setItem('distributionCode','');
                                `;
                            }
                            //分銷連結頁面SEO
                            if ((req.query.page as string).split('/')[0] === 'distribution' && (req.query.page as string).split('/')[1]) {
                                distribution_code = await SeoConfig.distributionSEO({
                                    appName: appName,
                                    url: req.url,
                                    page: req.query.page as string,
                                    link_prefix: link_prefix,
                                    data,
                                    language
                                })
                            }
                            //分類頁面SEO
                            if ((req.query.page as string).split('/')[0] === 'collections' && (req.query.page as string).split('/')[1]) {
                                await SeoConfig.collectionSeo({appName, language, data, page: req.query.page as string})
                            }
                            //FB像素
                            if (FBCode) {
                                seo_content.push(SeoConfig.fbCode(FBCode))
                            }
                            const head=(() => {
                                const d = data.page_config.seo;
                                const home_seo = home_page_data.page_config.seo;
                                return html`
                                    ${(() => {
                                    if (req.query.type === 'editor') {
                                        return SeoConfig.editorSeo;
                                    } else {
                                        return html`<title>${d.title || '尚未設定標題'}</title>
                                            <link
                                                    rel="canonical"
                                                    href="${(() => {
                                            if (data.tag === 'index') {
                                                return `https://${brandAndMemberType.domain}`;
                                            } else {
                                                return `https://${brandAndMemberType.domain}/${data.tag}`;
                                            }
                                        })()}"
                                            />
                                            ${data.tag !== req.query.page ? `<meta name="robots" content="noindex">` : `<meta name="robots" content="index, follow"/>`}
                                            <meta name="keywords"
                                                  content="${(d.keywords || '尚未設定關鍵字').replace(/"/g, '&quot;')}"/>
                                            <link id="appImage" rel="shortcut icon"
                                                  href="${d.logo || home_seo.logo || ''}" type="image/x-icon"/>
                                            <link rel="icon" href="${d.logo || home_seo.logo || ''}"
                                                  type="image/png" sizes="128x128"/>
                                            <meta property="og:image" content="${d.image || home_seo.image || ''}"/>
                                            <meta property="og:title"
                                                  content="${(d.title ?? '').replace(/\n/g, '').replace(/"/g, '&quot;')}"/>
                                            <meta name="description"
                                                  content="${(d.content ?? '').replace(/\n/g, '').replace(/"/g, '&quot;')}"/>
                                            <meta name="og:description"
                                                  content="${(d.content ?? '').replace(/\n/g, '').replace(/"/g, '&quot;')}"/>`;
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
                                `;
                            })()+`<script>
                                ${[
                                d.custom_script ?? '',
                                `window.login_config = ${JSON.stringify(login_config)};`,
                                `window.appName = '${appName}';`,
                                `window.glitterBase = '${brandAndMemberType.brand}';`,
                                `window.memberType = '${brandAndMemberType.memberType}';`,
                                `window.glitterBackend = '${config.domain}';`,
                                `window.preloadData = ${JSON.stringify(preload)
                                    .replace(/<\/script>/g, 'sdjuescript_prepand')
                                    .replace(/<script>/g, 'sdjuescript_prefix')};`,
                                `window.glitter_page = '${req.query.page}';`,
                                `window.store_info = ${JSON.stringify(store_info)};`,
                                `window.server_execute_time = ${(new Date().getTime() - start) / 1000};`,
                                `window.language = '${language}';`,
                                `${distribution_code}`,
                                `window.ip_country = '${(ip_country).country || 'TW'}';`,
                                `window.currency_covert = ${JSON.stringify(await Shopping.currencyCovert((req.query.base || 'TWD') as string))};`,
                                `window.language_list = ${JSON.stringify(language_label.label)};`
                            ].map((dd) => {
                                return dd.trim()
                            }).filter((dd) => {
                                return dd
                            }).join(';\n')}
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
                                .map((dd: any) =>
                                    html`
                                                <script src="/${link_prefix && `${link_prefix}/`}${dd}"
                                                        type="module"></script>`)
                                .join('')}
                            ${(() => {
                                if (req.query.type === 'editor') {
                                    return ``;
                                } else {
                                    return html`
                                        ${SeoConfig.gA4(customCode.ga4)}
                                        ${SeoConfig.gTag(customCode.g_tag)}
                                        ${seo_content.map((dd) => {
                                        return dd.trim()
                                    }).join('\n')}
                                    `;
                                }
                            })()}`


                            return {
                                head: head,
                                body:``
                            }

                        } else {
                            return  {
                                head:await Seo.redirectToHomePage(appName, req),
                                body:``
                            }
                        }
                    } catch (e: any) {
                        console.error(e);
                        return  {
                            head:``,
                            body:`${e}`
                        }
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

                    const cols =
                        (
                            await db.query(
                                `SELECT *
                                 FROM \`${appName}\`.public_config
                                 WHERE \`key\` = 'collection';`,
                                []
                            )
                        )[0] ?? {};

                    const language_setting=(await new User(appName).getConfigV2({
                        key: 'store-information',
                        user_id: 'manager',
                    })).language_setting;

                    const product=(await new Shopping(appName).getProduct( {
                        page: 0,
                        limit: 100000,
                        collection: '',
                        accurate_search_text: false,
                        accurate_search_collection: true,
                        min_price: undefined,
                        max_price: undefined,
                        status: undefined,
                        channel: undefined,
                        id_list: undefined,
                        order_by: 'order by id desc',
                        with_hide_index: undefined,
                        is_manger: true,
                        productType: 'product',
                        filter_visible: 'true',
                        language: 'zh-TW',
                        currency_code: 'TWD'
                    })).data
                    // 創建 SitemapStream
                    const stream = new SitemapStream({hostname: `https://${domain}`});

                    // 將 links 添加到 stream
                    const xml = await streamToPromise(Readable.from([
                        ...(await db.query(
                            `select page_config, tag, updated_time
                             from \`${saasConfig.SAAS_NAME}\`.page_config
                             where appName = ?
                               and page_config ->>'$.seo.type'='custom'
                            `,
                            [appName]
                        )).map((d2: any) => {
                            if(d2.tag==='index'){
                                return {url: `https://${domain}`, changefreq: 'weekly'}
                            }else{
                                return {url: `https://${domain}/${d2.tag}`, changefreq: 'weekly'}
                            }

                        }),
                        ...(article.data
                            .filter((d2: any) => {
                                return d2.content.template
                            }).map((d2: any) => {
                                return {
                                    url: `https://${domain}/${d2.content.for_index === 'false' ? `pages` : `blogs`}/${d2.content.tag}`,
                                    changefreq: 'weekly',
                                    lastmod: formatDateToISO(new Date(d2.updated_time))
                                }
                            })),
                        ...(site_map || [])
                            .map((d2: any) => {
                                return {url: `https://${domain}/${d2.url}`, changefreq: 'weekly'}
                            }),
                        ...(()=>{
                            let array:string[]=[];
                            extractCols(cols)
                                .map((item:any) => {
                                    array=array.concat((language_setting.support).map((d1:any)=>{
                                        const seo=(item.language_data && item.language_data[d1] && item.language_data[d1].seo && item.language_data[d1].seo.domain) || item.code || item.title
                                        if(d1===language_setting.def){
                                            return {url: `https://${domain}/collections/${seo}`, changefreq: 'weekly'}
                                        }else if(d1==='zh-TW'){
                                            return {url: `https://${domain}/tw/collections/${seo}`, changefreq: 'weekly'}
                                        }else if(d1==='zh-CN'){
                                            return {url: `https://${domain}/cn/collections/${seo}`, changefreq: 'weekly'}
                                        }else if(d1==='en-US'){
                                            return {url: `https://${domain}/en/collections/${seo}`, changefreq: 'weekly'}
                                        }else{
                                            return {url: `https://${domain}/${d1}/collections/${seo}`, changefreq: 'weekly'}
                                        }
                                    }))
                                })
                            console.log(array)
                            return array
                        })(),
                        ...(()=>{
                            let array:string[]=[];
                            product.map((dd:any)=>{
                                dd=dd.content;
                                array=array.concat((language_setting.support).map((d1:any)=>{
                                    // console.log(`products=>`,dd)
                                    const seo=(dd.language_data && dd.language_data[d1] && dd.language_data[d1].seo && dd.language_data[d1].seo.domain) || dd.seo.domain
                                    if(d1===language_setting.def){
                                        return {url: `https://${domain}/products/${seo}`, changefreq: 'weekly'}
                                    }else if(d1==='zh-TW'){
                                        return {url: `https://${domain}/tw/products/${seo}`, changefreq: 'weekly'}
                                    }else if(d1==='zh-CN'){
                                        return {url: `https://${domain}/cn/products/${seo}`, changefreq: 'weekly'}
                                    }else if(d1==='en-US'){
                                        return {url: `https://${domain}/en/products/${seo}`, changefreq: 'weekly'}
                                    }else{
                                        return {url: `https://${domain}/${d1}/products/${seo}`, changefreq: 'weekly'}
                                    }
                                }))
                            })

                            return array
                        })()
                    ]).pipe(stream)).then((data: any) =>
                        data.toString()
                    );

                    return xml

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
                    const robots = await new User(appName).getConfigV2({
                        key: 'robots_text',
                        user_id: 'manager',
                    });
                    robots.text = robots.text || '';
                    const domain = (
                        await db.query(
                            `select \`domain\`
                             from \`${saasConfig.SAAS_NAME}\`.app_config
                             where appName = ?`,
                            [appName]
                        )
                    )[0]['domain'];
                    return (robots.text.replace(/\s+/g, "").replace(/\n/g, "")) ? robots.text : html`User-agent: *
                    Allow: /
                    Sitemap: https://${domain}/sitemap.xml`;
                },
                tw_shop: async (req, resp) => {
                    let appName = dd.appName;
                    const escapeHtml = (text: string): string => {
                        const map: Record<string, string> = {
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            "'": '&#039;',
                        };
                        return text.replace(/[&<>"']/g, (m) => map[m] || m);
                    };
                    if (req.query.appName) {
                        appName = req.query.appName;
                    }
                    const products = await db.query(
                        `SELECT *
                         FROM \`${dd.appName}\`.t_manager_post
                         WHERE JSON_EXTRACT(content, '$.type') = 'product';
                        `,
                        []
                    );
                    const domain = (
                        await db.query(
                            `select \`domain\`
                             from \`${saasConfig.SAAS_NAME}\`.app_config
                             where appName = ?`,
                            [appName]
                        )
                    )[0]['domain'];
                    let printData = products
                        .map((product: any) => {
                            return product.content.variants
                                .map((variant: any) => {
                                    return html`
                                        <Product>
                                            <SKU>${variant.sku}</SKU>
                                            <Name>${product.content.title}</Name>
                                            <Description>${dd.appName} - ${product.content.title}</Description>
                                            <URL> ${`https://` + domain + '/products/' + product.content.title}</URL>
                                            <Price>${variant.compare_price ?? variant.sale_price}</Price>
                                            <LargeImage> ${variant.preview_image ?? ''}</LargeImage>
                                            <SalePrice>${variant.sale_price}</SalePrice>
                                            <Category>${product.content.collection.join('')}</Category>
                                        </Product>
                                    `;
                                })
                                .join('');
                        })
                        .join('');
                    return xmlFormatter(`<Product>${printData}</Product>`, {
                        indentation: '  ', // 使用兩個空格進行縮進
                        filter: (node) => node.type !== 'Comment', // 選擇性過濾節點
                        collapseContent: true, // 折疊內部文本
                    });
                },
            };
        })
    );
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

function formatDateToISO(date: Date) {
    return `${date.toISOString().substring(0, date.toISOString().length - 5)}+00:00`;
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.initial = initial;
exports.createAPP = createAPP;
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const redis_1 = __importDefault(require("./modules/redis"));
const logger_1 = __importDefault(require("./modules/logger"));
const uuid_1 = require("uuid");
const hooks_1 = require("./modules/hooks");
const config_1 = require("./config");
const contollers = require("./controllers");
const public_contollers = require("./api-public/controllers");
const database_1 = __importDefault(require("./modules/database"));
const saas_table_check_1 = require("./services/saas-table-check");
const database_2 = __importDefault(require("./modules/database"));
const AWSLib_1 = require("./modules/AWSLib");
const live_source_1 = require("./live_source");
const process = __importStar(require("process"));
const body_parser_1 = __importDefault(require("body-parser"));
const public_table_check_js_1 = require("./api-public/services/public-table-check.js");
const release_js_1 = require("./services/release.js");
const fs_1 = __importDefault(require("fs"));
const app_js_1 = require("./services/app.js");
const firebase_js_1 = require("./modules/firebase.js");
const glitter_util_js_1 = require("./helper/glitter-util.js");
const seo_js_1 = require("./services/seo.js");
const shopping_js_1 = require("./api-public/services/shopping.js");
const web_socket_js_1 = require("./services/web-socket.js");
const ut_database_js_1 = require("./api-public/utils/ut-database.js");
const compression_1 = __importDefault(require("compression"));
const user_js_1 = require("./api-public/services/user.js");
const schedule_js_1 = require("./api-public/services/schedule.js");
const private_config_js_1 = require("./services/private_config.js");
const xml_formatter_1 = __importDefault(require("xml-formatter"));
const system_schedule_1 = require("./services/system-schedule");
const ai_js_1 = require("./services/ai.js");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const monitor_js_1 = require("./api-public/services/monitor.js");
const manager_js_1 = require("./api-public/services/manager.js");
const sitemap_1 = require("sitemap");
const stream_1 = require("stream");
exports.app = (0, express_1.default)();
const logger = new logger_1.default();
exports.app.options('/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,g-app,mac_address,language');
    res.status(200).send();
});
exports.app.use((0, express_session_1.default)({
    secret: config_1.config.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 },
}));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)());
exports.app.use((0, compression_1.default)());
exports.app.use(express_1.default.raw({ limit: '100MB' }));
exports.app.use(express_1.default.json({ limit: '100MB' }));
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
exports.app.use(body_parser_1.default.json({ limit: '100MB' }));
exports.app.use(createContext);
exports.app.use(body_parser_1.default.raw({ type: '*/*' }));
exports.app.use(contollers);
exports.app.use(public_contollers);
async function initial(serverPort) {
    await (async () => {
        await database_1.default.createPool();
        await ai_js_1.Ai.initial();
        await saas_table_check_1.SaasScheme.createScheme();
        await public_table_check_js_1.ApiPublic.createScheme(config_1.saasConfig.SAAS_NAME);
        await redis_1.default.connect();
        await createAppRoute();
        await (0, AWSLib_1.listBuckets)();
        await (0, AWSLib_1.createBucket)(config_1.config.AWS_S3_NAME);
        logger.info('[Init]', `Server start with env: ${process.env.NODE_ENV || 'local'}`);
        await exports.app.listen(serverPort);
        fs_1.default.mkdirSync(path_1.default.resolve(__filename, '../app-project/work-space'), { recursive: true });
        release_js_1.Release.removeAllFilesInFolder(path_1.default.resolve(__filename, '../app-project/work-space'));
        if (process.env.firebase) {
            await firebase_js_1.Firebase.initial();
        }
        if (config_1.ConfigSetting.runSchedule) {
            new schedule_js_1.Schedule().main();
            new system_schedule_1.SystemSchedule().start();
        }
        web_socket_js_1.WebSocket.start();
        logger.info('[Init]', `Server is listening on port: ${serverPort}`);
        console.log('Starting up the server now.');
    })();
}
function createContext(req, res, next) {
    const uuid = (0, uuid_1.v4)();
    const ip = req.ip;
    const requestInfo = { uuid: `${uuid}`, method: `${req.method}`, url: `${req.url}`, ip: `${ip}` };
    hooks_1.asyncHooks.getInstance().createRequestContext(requestInfo);
    next();
}
async function createAppRoute() {
    const apps = await database_2.default.execute(`SELECT appName
         FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config;
        `, []);
    for (const dd of apps) {
        await createAPP(dd);
    }
}
function extractCols(data) {
    const items = [];
    const updated_at = new Date(data.updated_at).toISOString().replace(/\.\d{3}Z$/, '+00:00');
    data.value.map((item) => {
        items.push({
            code: item.code,
            updated_at,
            seo_title: item.seo_title,
            seo_image: item.seo_image,
            seo_content: item.seo_content,
        });
        if (item.array && item.array.length > 0) {
            item.array.map((child) => {
                items.push({
                    code: child.code,
                    updated_at,
                    seo_title: child.seo_title,
                    seo_image: child.seo_image,
                    seo_content: child.seo_content,
                });
            });
        }
    });
    return items;
}
function extractProds(data) {
    const items = [];
    data.map((item) => {
        const code = (() => {
            try {
                return item.content.seo.domain;
            }
            catch (error) {
                return '';
            }
        })();
        const updated_at = new Date(item.updated_time).toISOString().replace(/\.\d{3}Z$/, '+00:00');
        items.push({ code, updated_at });
    });
    return items;
}
exports.app.set('trust proxy', true);
function isCurrentTimeWithinRange(data) {
    const now = new Date();
    const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
    const hasEnd = data.endDate && data.endTime;
    const endDateTime = hasEnd ? new Date(`${data.endDate}T${data.endTime}`) : null;
    if (hasEnd) {
        return now >= startDateTime && now <= endDateTime;
    }
    else {
        return now >= startDateTime;
    }
}
async function createAPP(dd) {
    const html = String.raw;
    live_source_1.Live_source.liveAPP.push(dd.appName);
    schedule_js_1.Schedule.app.push(dd.appName);
    const file_path = path_1.default.resolve(__dirname, '../lowcode');
    return await glitter_util_js_1.GlitterUtil.set_frontend_v2(exports.app, ['/' + encodeURI(dd.appName) + '/*', '/' + encodeURI(dd.appName)].map((rout) => {
        return {
            rout: rout,
            path: file_path,
            app_name: dd.appName,
            root_path: '/' + encodeURI(dd.appName) + '/',
            seoManager: async (req) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                try {
                    if (req.query.state === 'google_login') {
                        req.query.page = 'login';
                    }
                    let appName = dd.appName;
                    if (req.query.appName) {
                        appName = req.query.appName;
                    }
                    req.headers['g-app'] = appName;
                    const start = new Date().getTime();
                    console.log(`getPageInfo==>`, (new Date().getTime() - start) / 1000);
                    let customCode = await new user_js_1.User(appName).getConfigV2({
                        key: 'ga4_config',
                        user_id: 'manager',
                    });
                    let FBCode = await new user_js_1.User(appName).getConfigV2({
                        key: 'login_fb_setting',
                        user_id: 'manager',
                    });
                    let store_info = await new user_js_1.User(appName).getConfigV2({
                        key: 'store-information',
                        user_id: 'manager',
                    });
                    console.log(`req.query.page.prefix===>`, req.query.page);
                    const language = (() => {
                        function checkIncludes(lan) {
                            return store_info.language_setting.support.includes(lan);
                        }
                        function checkEqual(lan) {
                            return `${req.query.page}`.startsWith(`${lan}/`) || req.query.page === lan;
                        }
                        function replace(lan) {
                            if (req.query.page === lan) {
                                req.query.page = '';
                            }
                            else {
                                req.query.page = `${req.query.page}`.replace(lan + '/', '');
                            }
                        }
                        if (checkEqual('en') && checkIncludes('en-US')) {
                            replace('en');
                            return `en-US`;
                        }
                        else if (checkEqual('cn') && checkIncludes('zh-CN')) {
                            replace('cn');
                            return `zh-CN`;
                        }
                        else if (checkEqual('tw') && checkIncludes('zh-TW')) {
                            replace('tw');
                            return `zh-TW`;
                        }
                        else {
                            return store_info.language_setting.def;
                        }
                    })();
                    console.log(`req.query.page===>`, req.query.page);
                    monitor_js_1.Monitor.insertHistory({
                        req_type: 'file',
                        req: req,
                    });
                    console.log(`insertHistory==>`, (new Date().getTime() - start) / 1000);
                    await public_table_check_js_1.ApiPublic.createScheme(appName);
                    console.log(`createScheme==>`, (new Date().getTime() - start) / 1000);
                    const brandAndMemberType = await app_js_1.App.checkBrandAndMemberType(appName);
                    console.log(`brandAndMemberType==>`, (new Date().getTime() - start) / 1000);
                    const login_config = await new user_js_1.User(req.get('g-app'), req.body.token).getConfigV2({
                        key: 'login_config',
                        user_id: 'manager',
                    });
                    let data = await seo_js_1.Seo.getPageInfo(appName, req.query.page, language);
                    let home_page_data = await (async () => {
                        if (data && data.config) {
                            return await seo_js_1.Seo.getPageInfo(appName, data.config.homePage, language);
                        }
                        else {
                            return await seo_js_1.Seo.getPageInfo(appName, 'index', language);
                        }
                    })();
                    if (data && data.page_config) {
                        data.page_config = (_a = data.page_config) !== null && _a !== void 0 ? _a : {};
                        const d = (_b = data.page_config.seo) !== null && _b !== void 0 ? _b : {};
                        if (data.page_type === 'article' && data.page_config.template_type === 'product') {
                            const product_domain = req.query.page.split('/')[1];
                            const pd = await new shopping_js_1.Shopping(appName, undefined).getProduct(product_domain
                                ? {
                                    page: 0,
                                    limit: 1,
                                    domain: decodeURIComponent(product_domain),
                                    language: language,
                                }
                                : {
                                    page: 0,
                                    limit: 1,
                                    id: req.query.product_id,
                                    language: language,
                                });
                            if (pd.data.content) {
                                pd.data.content.language_data = (_c = pd.data.content.language_data) !== null && _c !== void 0 ? _c : {};
                                const productSeo = pd.data.content.language_data[language].seo || ((_d = pd.data.content.seo) !== null && _d !== void 0 ? _d : {});
                                data = await seo_js_1.Seo.getPageInfo(appName, data.config.homePage, language);
                                data.page_config = (_e = data.page_config) !== null && _e !== void 0 ? _e : {};
                                data.page_config.seo = (_f = data.page_config.seo) !== null && _f !== void 0 ? _f : {};
                                data.page_config.seo.title = productSeo.title;
                                data.page_config.seo.image = pd.data.content.preview_image[0];
                                data.page_config.seo.content = productSeo.content;
                            }
                            else {
                                data = await seo_js_1.Seo.getPageInfo(appName, data.config.homePage, language);
                            }
                        }
                        else if (data.page_type === 'article' && data.page_config.template_type === 'blog') {
                            req.query.article = req.query.article || req.query.page.split('/')[1];
                            let query = [`(content->>'$.type'='article')`, `(content->>'$.tag'='${req.query.article}')`];
                            const article = await new ut_database_js_1.UtDatabase(appName, `t_manager_post`).querySql(query, {
                                page: 0,
                                limit: 1,
                            });
                            data = await seo_js_1.Seo.getPageInfo(appName, data.config.homePage, language);
                            data.page_config = (_g = data.page_config) !== null && _g !== void 0 ? _g : {};
                            data.page_config.seo = (_h = data.page_config.seo) !== null && _h !== void 0 ? _h : {};
                            if (article.data[0]) {
                                data.page_config.seo.title = article.data[0].content.seo.title;
                                data.page_config.seo.content = article.data[0].content.seo.content;
                                data.page_config.seo.keywords = article.data[0].content.seo.keywords;
                            }
                        }
                        else if (d.type !== 'custom') {
                            data = home_page_data;
                        }
                        const preload = req.query.isIframe === 'true' ? {} : await app_js_1.App.preloadPageData(appName, req.query.page, language);
                        data.page_config = (_j = data.page_config) !== null && _j !== void 0 ? _j : {};
                        data.page_config.seo = (_k = data.page_config.seo) !== null && _k !== void 0 ? _k : {};
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
                        if (config_1.ConfigSetting.is_local) {
                            if (link_prefix !== 'shopnex' && link_prefix !== 'codenex_v2') {
                                link_prefix = '';
                            }
                        }
                        else {
                            link_prefix = '';
                        }
                        let distribution_code = '';
                        req.query.page = req.query.page || 'index';
                        if (req.query.page.split('/')[0] === 'order_detail' && req.query.EndCheckout === '1') {
                            distribution_code = `
                                    localStorage.setItem('distributionCode','');
                                `;
                        }
                        if (req.query.page.split('/')[0] === 'distribution' && req.query.page.split('/')[1]) {
                            const redURL = new URL(`https://127.0.0.1${req.url}`);
                            const rec = await database_2.default.query(`SELECT * FROM \`${appName}\`.t_recommend_links WHERE content ->>'$.link' = ?;
                                    `, [req.query.page.split('/')[1]]);
                            const page = rec[0] && rec[0].content ? rec[0].content : { status: false };
                            if (page.status && isCurrentTimeWithinRange(page)) {
                                distribution_code = `
                                        localStorage.setItem('distributionCode','${page.code}');
                                        location.href = '${page.redirect}${redURL.search}';
                                    `;
                            }
                            else {
                                distribution_code = `
                                        location.href = '/';
                                    `;
                            }
                        }
                        if (req.query.page.split('/')[0] === 'collections' && req.query.page.split('/')[1]) {
                            const cols = (_l = (await manager_js_1.Manager.getConfig({
                                appName: appName,
                                key: 'collection',
                                language: language,
                            }))[0]) !== null && _l !== void 0 ? _l : {};
                            const colJson = extractCols(cols);
                            const urlCode = decodeURI(req.query.page.split('/')[1]);
                            const colData = colJson.find((item) => item.code === urlCode);
                            if (colData) {
                                data.page_config.seo.title = colData.seo_title;
                                data.page_config.seo.content = colData.seo_content;
                                data.page_config.seo.keywords = colData.seo_keywords;
                            }
                        }
                        return html `${(() => {
                            var _a;
                            const d = data.page_config.seo;
                            const home_seo = home_page_data.page_config.seo;
                            return html `
                                    <head>
                                        ${(() => {
                                var _a, _b, _c, _d, _e;
                                if (req.query.type === 'editor') {
                                    return html `<title>SHOPNEX後台系統</title>
                                                    <link rel="canonical" href="/index" />
                                                    <meta name="keywords" content="SHOPNEX,電商平台" />
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
                                                    <meta property="og:image" content="https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1718778766524-shopnex_banner.jpg" />
                                                    <meta property="og:title" content="SHOPNEX後台系統" />
                                                    <meta
                                                        name="description"
                                                        content="SHOPNEX電商開店平台，零抽成、免手續費。提供精美模板和豐富插件，操作簡單，3分鐘內快速打造專屬商店。購物車、金物流、SEO行銷、資料分析一站搞定。支援APP上架，並提供100%客製化設計，立即免費體驗30天。"
                                                    />
                                                    <meta
                                                        name="og:description"
                                                        content="SHOPNEX電商開店平台，零抽成、免手續費。提供精美模板和豐富插件，操作簡單，3分鐘內快速打造專屬商店。購物車、金物流、SEO行銷、資料分析一站搞定。支援APP上架，並提供100%客製化設計，立即免費體驗30天。"
                                                    />`;
                                }
                                else {
                                    return html `<title>${(_a = d.title) !== null && _a !== void 0 ? _a : '尚未設定標題'}</title>
                                                    <link
                                                        rel="canonical"
                                                        href="${(() => {
                                        if (data.tag === 'index') {
                                            return `https://${brandAndMemberType.domain}`;
                                        }
                                        else {
                                            return `https://${brandAndMemberType.domain}/${data.tag}`;
                                        }
                                    })()}"
                                                    />
                                                    <meta name="keywords" content="${(_b = d.keywords) !== null && _b !== void 0 ? _b : '尚未設定關鍵字'}" />
                                                    <link id="appImage" rel="shortcut icon" href="${d.logo || home_seo.logo || ''}" type="image/x-icon" />
                                                    <link rel="icon" href="${d.logo || home_seo.logo || ''}" type="image/png" sizes="128x128" />
                                                    <meta property="og:image" content="${d.image || home_seo.image || ''}" />
                                                    <meta property="og:title" content="${((_c = d.title) !== null && _c !== void 0 ? _c : '').replace(/\n/g, '')}" />
                                                    <meta name="description" content="${((_d = d.content) !== null && _d !== void 0 ? _d : '').replace(/\n/g, '')}" />
                                                    <meta name="og:description" content="${((_e = d.content) !== null && _e !== void 0 ? _e : '').replace(/\n/g, '')}" />`;
                                }
                            })()}
                                        ${(_a = d.code) !== null && _a !== void 0 ? _a : ''}
                                        ${(() => {
                                var _a;
                                if (req.query.type === 'editor') {
                                    return ``;
                                }
                                else {
                                    return `${((_a = data.config.globalStyle) !== null && _a !== void 0 ? _a : [])
                                        .map((dd) => {
                                        try {
                                            if (dd.data.elem === 'link') {
                                                return html ` <link
                                                                    type="text/css"
                                                                    rel="stylesheet"
                                                                    href="${dd.data.attr.find((dd) => {
                                                    return dd.attr === 'href';
                                                }).value}"
                                                                />`;
                                            }
                                        }
                                        catch (e) {
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
                                ${(_m = d.custom_script) !== null && _m !== void 0 ? _m : ''};
                                window.login_config = ${JSON.stringify(login_config)};
                                window.appName = '${appName}';
                                window.glitterBase = '${brandAndMemberType.brand}';
                                window.memberType = '${brandAndMemberType.memberType}';
                                window.glitterBackend = '${config_1.config.domain}';
                                window.preloadData = ${JSON.stringify(preload)
                            .replace(/<\/script>/g, 'sdjuescript_prepand')
                            .replace(/<script>/g, 'sdjuescript_prefix')};
                                window.preloadData = JSON.parse(JSON.stringify(window.preloadData).replace(/sdjuescript_prepand/g, '</s' + 'cript>').replace(/sdjuescript_prefix/g, '<s' + 'cript>'))
                                window.glitter_page = '${req.query.page}';
                                window.store_info = ${JSON.stringify(store_info)};
                                window.server_execute_time = ${(new Date().getTime() - start) / 1000};
                                window.language='${language}';
                                ${distribution_code}
                            </script>
                            ${[
                            { src: 'glitterBundle/GlitterInitial.js', type: 'module' },
                            { src: 'glitterBundle/module/html-generate.js', type: 'module' },
                            { src: 'glitterBundle/html-component/widget.js', type: 'module' },
                            { src: 'glitterBundle/plugins/trigger-event.js', type: 'module' },
                            { src: 'api/pageConfig.js', type: 'module' },
                        ]
                            .map((dd) => {
                            return html ` <script src="/${link_prefix && `${link_prefix}/`}${dd.src}" type="${dd.type}"></script>`;
                        })
                            .join('')}
                            ${((_o = preload.event) !== null && _o !== void 0 ? _o : [])
                            .filter((dd) => {
                            return dd;
                        })
                            .map((dd) => {
                            const link = dd.fun.replace(`TriggerEvent.setEventRouter(import.meta.url, '.`, 'official_event');
                            return link.substring(0, link.length - 2);
                        })
                            .map((dd) => {
                            return html ` <script src="/${link_prefix && `${link_prefix}/`}${dd}" type="module"></script>`;
                        })
                            .join('')}
                            </head>
                            ${(() => {
                            if (req.query.type === 'editor') {
                                return ``;
                            }
                            else {
                                return html `
                                        ${(customCode.ga4 || [])
                                    .map((dd) => {
                                    return html `<!-- Google tag (gtag.js) -->
                                                    <script async src="https://www.googletagmanager.com/gtag/js?id=${dd.code}"></script>
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
                                    .map((dd) => {
                                    return html `<!-- Google tag (gtag.js) -->
                                                    <!-- Google Tag Manager -->
                                                    <script>
                                                        (function (w, d, s, l, i) {
                                                            w[l] = w[l] || [];
                                                            w[l].push({
                                                                'gtm.start': new Date().getTime(),
                                                                event: 'gtm.js',
                                                            });
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
                                        ${FBCode && FBCode.pixel
                                    ? html `<!-- Meta Pixel Code -->
                                                  <script>
                                                      !(function (f, b, e, v, n, t, s) {
                                                          if (f.fbq) return;
                                                          n = f.fbq = function () {
                                                              n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                                                          };
                                                          if (!f._fbq) f._fbq = n;
                                                          n.push = n;
                                                          n.loaded = !0;
                                                          n.version = '2.0';
                                                          n.queue = [];
                                                          t = b.createElement(e);
                                                          t.async = !0;
                                                          t.src = v;
                                                          s = b.getElementsByTagName(e)[0];
                                                          s.parentNode.insertBefore(t, s);
                                                      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
                                                      fbq('init', '${FBCode.pixel}');
                                                      fbq('track', 'PageView');
                                                  </script>
                                                  <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=617830100580621&ev=PageView&noscript=1" /> </noscript>
                                                  <!-- End Meta Pixel Code -->`
                                    : ''}
                                    `;
                            }
                        })()}
                            `;
                    }
                    else {
                        console.log(`brandAndMemberType==>redirect`);
                        return await seo_js_1.Seo.redirectToHomePage(appName, req);
                    }
                }
                catch (e) {
                    console.error(e);
                    return `${e}`;
                }
            },
            sitemap: async (req, resp) => {
                var _a;
                let appName = dd.appName;
                if (req.query.appName) {
                    appName = req.query.appName;
                }
                let query = [`(content->>'$.type'='article')`];
                const article = await new ut_database_js_1.UtDatabase(appName, `t_manager_post`).querySql(query, {
                    page: 0,
                    limit: 10000,
                });
                const domain = (await database_2.default.query(`select \`domain\`
                             from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                             where appName = ?`, [appName]))[0]['domain'];
                const site_map = await getSeoSiteMap(appName, req);
                const cols = (_a = (await database_2.default.query(`SELECT *
                                 FROM \`${appName}\`.public_config
                                 WHERE \`key\` = 'collection';`, []))[0]) !== null && _a !== void 0 ? _a : {};
                const products = await database_2.default.query(`SELECT *
                         FROM \`${appName}\`.t_manager_post
                         WHERE JSON_EXTRACT(content, '$.type') = 'product';
                        `, []);
                const stream = new sitemap_1.SitemapStream({ hostname: `https://${domain}` });
                const xml = await (0, sitemap_1.streamToPromise)(stream_1.Readable.from([
                    ...(await database_2.default.query(`select page_config, tag, updated_time
                             from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                             where appName = ?
                               and page_config ->>'$.seo.type'='custom'
                            `, [appName])).map((d2) => {
                        return { url: `https://${domain}/${d2.tag}`, changefreq: 'weekly' };
                    }),
                    ...(article.data
                        .filter((d2) => {
                        return d2.content.template;
                    }).map((d2) => {
                        return { url: `https://${domain}/${d2.content.for_index === 'false' ? `pages` : `blogs`}/${d2.content.tag}`, changefreq: 'weekly', lastmod: formatDateToISO(new Date(d2.updated_time)) };
                    })),
                    ...(site_map || [])
                        .map((d2) => {
                        return { url: `https://${domain}/${d2.url}`, changefreq: 'weekly' };
                    }),
                    ...extractCols(cols)
                        .filter((item) => {
                        return item.code;
                    })
                        .map((item) => {
                        return { url: `https://${domain}/collections/${item.code}`, changefreq: 'weekly' };
                    }),
                    ...extractProds(products)
                        .filter((item) => {
                        return item.code;
                    })
                        .map((item) => {
                        return { url: `https://${domain}/products/${item.code}`, changefreq: 'weekly' };
                    })
                ]).pipe(stream)).then((data) => data.toString());
                return xml;
            },
            sitemap_list: async (req, resp) => {
                let appName = dd.appName;
                if (req.query.appName) {
                    appName = req.query.appName;
                }
                const domain = (await database_2.default.query(`select \`domain\`
                             from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                             where appName = ?`, [appName]))[0]['domain'];
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
                const robots = await new user_js_1.User(appName).getConfigV2({
                    key: 'robots_text',
                    user_id: 'manager',
                });
                robots.text = robots.text || '';
                const domain = (await database_2.default.query(`select \`domain\`
                             from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                             where appName = ?`, [appName]))[0]['domain'];
                return (robots.text.replace(/\s+/g, "").replace(/\n/g, "")) ? robots.text : html `User-agent: *
Allow: /                    
Sitemap: https://${domain}/sitemap.xml`;
            },
            tw_shop: async (req, resp) => {
                let appName = dd.appName;
                const escapeHtml = (text) => {
                    const map = {
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
                const products = await database_2.default.query(`SELECT *
                         FROM \`${dd.appName}\`.t_manager_post
                         WHERE JSON_EXTRACT(content, '$.type') = 'product';
                        `, []);
                const domain = (await database_2.default.query(`select \`domain\`
                             from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                             where appName = ?`, [appName]))[0]['domain'];
                let printData = products
                    .map((product) => {
                    return product.content.variants
                        .map((variant) => {
                        var _a, _b;
                        return html `
                                        <Product>
                                            <SKU>${variant.sku}</SKU>
                                            <Name>${product.content.title}</Name>
                                            <Description>${dd.appName} - ${product.content.title}</Description>
                                            <URL> ${`https://` + domain + '/products/' + product.content.title}</URL>
                                            <Price>${(_a = variant.compare_price) !== null && _a !== void 0 ? _a : variant.sale_price}</Price>
                                            <LargeImage> ${(_b = variant.preview_image) !== null && _b !== void 0 ? _b : ''}</LargeImage>
                                            <SalePrice>${variant.sale_price}</SalePrice>
                                            <Category>${product.content.collection.join('')}</Category>
                                        </Product>
                                    `;
                    })
                        .join('');
                })
                    .join('');
                return (0, xml_formatter_1.default)(`<Product>${printData}</Product>`, {
                    indentation: '  ',
                    filter: (node) => node.type !== 'Comment',
                    collapseContent: true,
                });
            },
        };
    }));
}
async function getSeoDetail(appName, req) {
    const sqlData = await private_config_js_1.Private_config.getConfig({
        appName: appName,
        key: 'seo_webhook',
    });
    if (!sqlData[0] || !sqlData[0].value) {
        return undefined;
    }
    const html = String.raw;
    return await database_2.default.queryLambada({
        database: appName,
    }, async (db) => {
        db.execute = db.query;
        const functionValue = [
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
                ${sqlData[0].value.value.replace(/new\s*Promise\s*\(\s*async\s*\(\s*resolve\s*,\s*reject\s*\)\s*=>\s*\{([\s\S]*)\}\s*\)/i, 'new Promise(async (resolve, reject) => { try { $1 } catch (error) { console.log(error);reject(error); } })')}
                }catch (e) { console.log(e) } } }
            `;
        const myFunction = new Function(evalString);
        return await myFunction().execute(functionValue[0].data(), functionValue[1].data());
    });
}
async function getSeoSiteMap(appName, req) {
    const sqlData = await private_config_js_1.Private_config.getConfig({
        appName: appName,
        key: 'sitemap_webhook',
    });
    if (!sqlData[0] || !sqlData[0].value) {
        return undefined;
    }
    const html = String.raw;
    return await database_2.default.queryLambada({
        database: appName,
    }, async (db) => {
        db.execute = db.query;
        const functionValue = [
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
                ${sqlData[0].value.value.replace(/new\s*Promise\s*\(\s*async\s*\(\s*resolve\s*,\s*reject\s*\)\s*=>\s*\{([\s\S]*)\}\s*\)/i, 'new Promise(async (resolve, reject) => { try { $1 } catch (error) { console.log(error);reject(error); } })')}
                }catch (e) { console.log(e) } } }
            `;
        const myFunction = new Function(evalString);
        return await myFunction().execute(functionValue[0].data(), functionValue[1].data());
    });
}
function formatDateToISO(date) {
    return `${date.toISOString().substring(0, date.toISOString().length - 5)}+00:00`;
}
//# sourceMappingURL=index.js.map
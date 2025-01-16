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
exports.createAPP = exports.initial = exports.app = void 0;
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
const sitemap_1 = require("sitemap");
const stream_1 = require("stream");
const seo_config_js_1 = require("./seo-config.js");
exports.app = (0, express_1.default)();
const logger = new logger_1.default();
exports.app.options('/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,g-app,mac_address,language,currency_code');
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
        process.env.TZ = 'UTC';
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
exports.initial = initial;
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
exports.app.set('trust proxy', true);
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
                var _a, _b, _c, _d, _e, _f;
                console.log(`X-Original-URL=>`, req.headers['x-original-url']);
                const og_url = req.headers['x-original-url'];
                try {
                    if (req.query.state === 'google_login') {
                        req.query.page = 'login';
                    }
                    let appName = dd.appName;
                    if (req.query.appName) {
                        appName = req.query.appName;
                    }
                    else if (og_url) {
                        const new_app = (await database_2.default.query(`SELECT * FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config where LOWER(domain) = ?`, [og_url]))[0];
                        if (new_app && new_app.appName) {
                            appName = new_app && new_app.appName;
                        }
                        else {
                            return {
                                head: '',
                                body: `<script>window.location.href='https://shopnex.tw'</script>`,
                            };
                        }
                    }
                    req.headers['g-app'] = appName;
                    const start = new Date().getTime();
                    console.log(`getPageInfo==>`, (new Date().getTime() - start) / 1000);
                    let seo_content = [];
                    let [customCode, FBCode, store_info, language_label, check_schema, brandAndMemberType, login_config, ip_country] = await Promise.all([
                        new user_js_1.User(appName).getConfigV2({
                            key: 'ga4_config',
                            user_id: 'manager',
                        }),
                        new user_js_1.User(appName).getConfigV2({
                            key: 'login_fb_setting',
                            user_id: 'manager',
                        }),
                        new user_js_1.User(appName).getConfigV2({
                            key: 'store-information',
                            user_id: 'manager',
                        }),
                        new user_js_1.User(appName).getConfigV2({
                            key: 'language-label',
                            user_id: 'manager',
                        }),
                        public_table_check_js_1.ApiPublic.createScheme(appName),
                        app_js_1.App.checkBrandAndMemberType(appName),
                        new user_js_1.User(req.get('g-app'), req.body.token).getConfigV2({
                            key: 'login_config',
                            user_id: 'manager',
                        }),
                        user_js_1.User.ipInfo((req.query.ip || req.headers['x-real-ip'] || req.ip)),
                    ]);
                    const language = await seo_config_js_1.SeoConfig.language(store_info, req);
                    monitor_js_1.Monitor.insertHistory({
                        req_type: 'file',
                        req: req,
                    });
                    let data = await seo_js_1.Seo.getPageInfo(appName, req.query.page, language);
                    let home_page_data = await (async () => {
                        return await seo_js_1.Seo.getPageInfo(appName, 'index', language);
                    })();
                    if (data && data.page_config) {
                        data.page_config = (_a = data.page_config) !== null && _a !== void 0 ? _a : {};
                        const d = (_b = data.page_config.seo) !== null && _b !== void 0 ? _b : {};
                        if (`${req.query.page}`.startsWith('products/')) {
                            await seo_config_js_1.SeoConfig.productSEO({
                                data,
                                language,
                                appName,
                                product_id: req.query.product_id,
                                page: req.query.page,
                            });
                        }
                        else if (`${req.query.page}`.startsWith('blogs/')) {
                            await seo_config_js_1.SeoConfig.articleSeo({
                                article: req.query.article,
                                page: req.query.page,
                                language,
                                appName,
                                data,
                            });
                        }
                        else if (`${req.query.page}`.startsWith('pages/')) {
                            await seo_config_js_1.SeoConfig.articleSeo({
                                article: req.query.article,
                                page: req.query.page,
                                language,
                                appName,
                                data,
                            });
                        }
                        else if (d.type !== 'custom') {
                            data = home_page_data;
                        }
                        const preload = req.query.isIframe === 'true' ? {} : await app_js_1.App.preloadPageData(appName, req.query.page, language);
                        data.page_config = (_c = data.page_config) !== null && _c !== void 0 ? _c : {};
                        data.page_config.seo = (_d = data.page_config.seo) !== null && _d !== void 0 ? _d : {};
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
                            distribution_code = await seo_config_js_1.SeoConfig.distributionSEO({
                                appName: appName,
                                url: req.url,
                                page: req.query.page,
                                link_prefix: link_prefix,
                                data,
                                language,
                            });
                        }
                        if (req.query.page.split('/')[0] === 'collections' && req.query.page.split('/')[1]) {
                            await seo_config_js_1.SeoConfig.collectionSeo({ appName, language, data, page: req.query.page });
                        }
                        if (FBCode) {
                            seo_content.push(seo_config_js_1.SeoConfig.fbCode(FBCode));
                        }
                        const head = (() => {
                            var _a;
                            const d = data.page_config.seo;
                            const home_seo = home_page_data.page_config.seo || {};
                            return html `
                                        ${(() => {
                                var _a, _b, _c;
                                if (req.query.type === 'editor') {
                                    return seo_config_js_1.SeoConfig.editorSeo;
                                }
                                else {
                                    return html `<title>${d.title || '尚未設定標題'}</title>
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
                                                    ${data.tag !== req.query.page ? `<meta name="robots" content="noindex">` : `<meta name="robots" content="index, follow"/>`}
                                                    <meta name="keywords" content="${(d.keywords || '尚未設定關鍵字').replace(/"/g, '&quot;')}" />
                                                    <link id="appImage" rel="shortcut icon" href="${d.logo || home_seo.logo || ''}" type="image/x-icon" />
                                                    <link rel="icon" href="${d.logo || home_seo.logo || ''}" type="image/png" sizes="128x128" />
                                                    <meta property="og:image" content="${d.image || home_seo.image || ''}" />
                                                    <meta property="og:title" content="${((_a = d.title) !== null && _a !== void 0 ? _a : '').replace(/\n/g, '').replace(/"/g, '&quot;')}" />
                                                    <meta name="description" content="${((_b = d.content) !== null && _b !== void 0 ? _b : '').replace(/\n/g, '').replace(/"/g, '&quot;')}" />
                                                    <meta name="og:description" content="${((_c = d.content) !== null && _c !== void 0 ? _c : '').replace(/\n/g, '').replace(/"/g, '&quot;')}" />`;
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
                                    `;
                        })() +
                            `<script>
                                ${[
                                (_e = d.custom_script) !== null && _e !== void 0 ? _e : '',
                                `window.login_config = ${JSON.stringify(login_config)};`,
                                `window.appName = '${appName}';`,
                                `window.glitterBase = '${brandAndMemberType.brand}';`,
                                `window.memberType = '${brandAndMemberType.memberType}';`,
                                `window.glitterBackend = '${config_1.config.domain}';`,
                                `window.preloadData = ${JSON.stringify(preload)
                                    .replace(/<\/script>/g, 'sdjuescript_prepand')
                                    .replace(/<script>/g, 'sdjuescript_prefix')};`,
                                `window.glitter_page = '${req.query.page}';`,
                                `window.store_info = ${JSON.stringify(store_info)};`,
                                `window.server_execute_time = ${(new Date().getTime() - start) / 1000};`,
                                `window.language = '${language}';`,
                                `${distribution_code}`,
                                `window.ip_country = '${ip_country.country || 'TW'}';`,
                                `window.currency_covert = ${JSON.stringify(await shopping_js_1.Shopping.currencyCovert((req.query.base || 'TWD')))};`,
                                `window.language_list = ${JSON.stringify(language_label.label)};`,
                            ]
                                .map((dd) => {
                                return dd.trim();
                            })
                                .filter((dd) => {
                                return dd;
                            })
                                .join(';\n')}
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
                            ${((_f = preload.event) !== null && _f !== void 0 ? _f : [])
                                .filter((dd) => {
                                return dd;
                            })
                                .map((dd) => {
                                const link = dd.fun.replace(`TriggerEvent.setEventRouter(import.meta.url, '.`, 'official_event');
                                return link.substring(0, link.length - 2);
                            })
                                .map((dd) => html ` <script src="/${link_prefix && `${link_prefix}/`}${dd}" type="module"></script>`)
                                .join('')}
                            ${(() => {
                                if (req.query.type === 'editor') {
                                    return ``;
                                }
                                else {
                                    return html `
                                        ${seo_config_js_1.SeoConfig.gA4(customCode.ga4)} ${seo_config_js_1.SeoConfig.gTag(customCode.g_tag)}
                                        ${seo_content
                                        .map((dd) => {
                                        return dd.trim();
                                    })
                                        .join('\n')}
                                    `;
                                }
                            })()}`;
                        return {
                            head: head,
                            body: ``,
                        };
                    }
                    else {
                        return {
                            head: await seo_js_1.Seo.redirectToHomePage(appName, req),
                            body: ``,
                        };
                    }
                }
                catch (e) {
                    console.error(e);
                    return {
                        head: ``,
                        body: `${e}`,
                    };
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
                const language_setting = (await new user_js_1.User(appName).getConfigV2({
                    key: 'store-information',
                    user_id: 'manager',
                })).language_setting;
                const product = (await new shopping_js_1.Shopping(appName).getProduct({
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
                    currency_code: 'TWD',
                })).data;
                const stream = new sitemap_1.SitemapStream({ hostname: `https://${domain}` });
                const xml = await (0, sitemap_1.streamToPromise)(stream_1.Readable.from([
                    ...(await database_2.default.query(`select page_config, tag, updated_time
                             from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                             where appName = ?
                               and page_config ->>'$.seo.type'='custom'
                            `, [appName])).map((d2) => {
                        if (d2.tag === 'index') {
                            return { url: `https://${domain}`, changefreq: 'weekly' };
                        }
                        else {
                            return { url: `https://${domain}/${d2.tag}`, changefreq: 'weekly' };
                        }
                    }),
                    ...article.data
                        .filter((d2) => {
                        return d2.content.template;
                    })
                        .map((d2) => {
                        return {
                            url: `https://${domain}/${d2.content.for_index === 'false' ? `pages` : `blogs`}/${d2.content.tag}`,
                            changefreq: 'weekly',
                            lastmod: formatDateToISO(new Date(d2.updated_time)),
                        };
                    }),
                    ...(site_map || []).map((d2) => {
                        return { url: `https://${domain}/${d2.url}`, changefreq: 'weekly' };
                    }),
                    ...(() => {
                        let array = [];
                        (0, seo_config_js_1.extractCols)(cols).map((item) => {
                            array = array.concat(language_setting.support.map((d1) => {
                                const seo = (item.language_data && item.language_data[d1] && item.language_data[d1].seo && item.language_data[d1].seo.domain) || item.code || item.title;
                                if (d1 === language_setting.def) {
                                    return { url: `https://${domain}/collections/${seo}`, changefreq: 'weekly' };
                                }
                                else if (d1 === 'zh-TW') {
                                    return { url: `https://${domain}/tw/collections/${seo}`, changefreq: 'weekly' };
                                }
                                else if (d1 === 'zh-CN') {
                                    return { url: `https://${domain}/cn/collections/${seo}`, changefreq: 'weekly' };
                                }
                                else if (d1 === 'en-US') {
                                    return { url: `https://${domain}/en/collections/${seo}`, changefreq: 'weekly' };
                                }
                                else {
                                    return { url: `https://${domain}/${d1}/collections/${seo}`, changefreq: 'weekly' };
                                }
                            }));
                        });
                        console.log(array);
                        return array;
                    })(),
                    ...(() => {
                        let array = [];
                        product.map((dd) => {
                            dd = dd.content;
                            array = array.concat(language_setting.support.map((d1) => {
                                const seo = (dd.language_data && dd.language_data[d1] && dd.language_data[d1].seo && dd.language_data[d1].seo.domain) || dd.seo.domain;
                                if (d1 === language_setting.def) {
                                    return { url: `https://${domain}/products/${seo}`, changefreq: 'weekly' };
                                }
                                else if (d1 === 'zh-TW') {
                                    return { url: `https://${domain}/tw/products/${seo}`, changefreq: 'weekly' };
                                }
                                else if (d1 === 'zh-CN') {
                                    return { url: `https://${domain}/cn/products/${seo}`, changefreq: 'weekly' };
                                }
                                else if (d1 === 'en-US') {
                                    return { url: `https://${domain}/en/products/${seo}`, changefreq: 'weekly' };
                                }
                                else {
                                    return { url: `https://${domain}/${d1}/products/${seo}`, changefreq: 'weekly' };
                                }
                            }));
                        });
                        return array;
                    })(),
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
                return robots.text.replace(/\s+/g, '').replace(/\n/g, '') ? robots.text : html `User-agent: * Allow: / Sitemap: https://${domain}/sitemap.xml`;
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
exports.createAPP = createAPP;
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
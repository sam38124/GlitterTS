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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
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
exports.app = (0, express_1.default)();
const logger = new logger_1.default();
exports.app.options('/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,g-app');
    res.status(200).send();
});
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.raw());
exports.app.use(express_1.default.json({ limit: '50MB' }));
exports.app.use(createContext);
exports.app.use(body_parser_1.default.raw({ type: '*/*' }));
exports.app.use(contollers);
exports.app.use(public_contollers);
async function initial(serverPort) {
    await (async () => {
        await database_1.default.createPool();
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
        web_socket_js_1.WebSocket.start();
        logger.info('[Init]', `Server is listening on port: ${serverPort}`);
        console.log('Starting up the server now.');
    })();
}
exports.initial = initial;
async function createDomain(domainName) {
    const route53domains = new aws_sdk_1.default.Route53Domains();
    const contact = {
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
    };
    const domainParams = {
        DomainName: domainName,
        DurationInYears: 1,
        AutoRenew: true,
        AdminContact: contact,
        RegistrantContact: contact,
        TechContact: contact,
        PrivacyProtectAdminContact: true,
        PrivacyProtectRegistrantContact: true,
        PrivacyProtectTechContact: true
    };
    await route53domains.registerDomain(domainParams, (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log('域名注册成功：', data);
        }
    });
}
async function setDNS(domainName) {
    const route53 = new aws_sdk_1.default.Route53();
    const domainParams = {
        Name: domainName,
        CallerReference: Date.now().toString()
    };
    await route53.createHostedZone(domainParams, async (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(`Domain ${domainName} created with ID ${data.HostedZone.Id}`);
            const resourceRecordSet = {
                Name: domainName,
                Type: 'A',
                ResourceRecords: [
                    {
                        Value: `3.36.55.11`
                    }
                ],
                TTL: 300
            };
            const changeBatch = {
                Changes: [
                    {
                        Action: 'UPSERT',
                        ResourceRecordSet: resourceRecordSet
                    }
                ]
            };
            const changeParams = {
                HostedZoneId: data.HostedZone.Id,
                ChangeBatch: changeBatch
            };
            await route53.changeResourceRecordSets(changeParams, (err, data) => {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log(`A record created for ${domainName} with ID ${data.ChangeInfo.Id}`);
                }
            });
        }
    });
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
                                   FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config;`, []);
    for (const dd of apps) {
        await createAPP(dd);
    }
}
async function createAPP(dd) {
    live_source_1.Live_source.liveAPP.push(dd.appName);
    return await glitter_util_js_1.GlitterUtil.set_frontend(exports.app, [
        {
            rout: '/' + encodeURI(dd.appName),
            path: path_1.default.resolve(__dirname, '../lowcode'),
            seoManager: async (req, resp) => {
                var _a, _b, _c, _d, _e, _f, _g;
                try {
                    let appName = dd.appName;
                    if (req.query.appName) {
                        appName = req.query.appName;
                    }
                    const brandAndMemberType = await app_js_1.App.checkBrandAndMemberType(appName);
                    let data = await seo_js_1.Seo.getPageInfo(appName, req.query.page);
                    if (data && data.page_config) {
                        data.page_config = (_a = data.page_config) !== null && _a !== void 0 ? _a : {};
                        const d = (_b = data.page_config.seo) !== null && _b !== void 0 ? _b : {};
                        if (data.page_type === 'article' && data.page_config.template_type === 'product') {
                            const pd = (await new shopping_js_1.Shopping(appName, undefined).getProduct({
                                page: 0,
                                limit: 1,
                                id: req.query.product_id
                            }));
                            if (pd.data.content) {
                                const productSeo = (_c = pd.data.content.seo) !== null && _c !== void 0 ? _c : {};
                                data = await seo_js_1.Seo.getPageInfo(appName, data.config.homePage);
                                data.page_config = (_d = data.page_config) !== null && _d !== void 0 ? _d : {};
                                data.page_config.seo = (_e = data.page_config.seo) !== null && _e !== void 0 ? _e : {};
                                data.page_config.seo.title = productSeo.title;
                                data.page_config.seo.content = productSeo.content;
                            }
                            else {
                                data = await seo_js_1.Seo.getPageInfo(appName, data.config.homePage);
                            }
                        }
                        else if (data.page_type === 'article' && data.page_config.template_type === 'blog') {
                            let query = [
                                `(content->>'$.type'='article')`,
                                `(content->>'$.tag'='${req.query.article}')`,
                            ];
                            const article = await new ut_database_js_1.UtDatabase(appName, `t_manager_post`).querySql(query, { page: 0, limit: 1 });
                            console.log(`articleIS->`, article);
                            data = await seo_js_1.Seo.getPageInfo(appName, data.config.homePage);
                            data.page_config = (_f = data.page_config) !== null && _f !== void 0 ? _f : {};
                            data.page_config.seo = (_g = data.page_config.seo) !== null && _g !== void 0 ? _g : {};
                            if (article.data[0]) {
                                data.page_config.seo.title = article.data[0].content.seo.title;
                                data.page_config.seo.content = article.data[0].content.seo.content;
                                data.page_config.seo.keywords = article.data[0].content.seo.keywords;
                            }
                        }
                        else if (d.type !== 'custom') {
                            data = await seo_js_1.Seo.getPageInfo(appName, data.config.homePage);
                        }
                        const preload = (req.query.type === 'editor' || req.query.isIframe === 'true') ? {} : await app_js_1.App.preloadPageData(appName, data.tag);
                        return `${(() => {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                            data.page_config = (_a = data.page_config) !== null && _a !== void 0 ? _a : {};
                            const d = (_b = data.page_config.seo) !== null && _b !== void 0 ? _b : {};
                            return `<title>${(_c = d.title) !== null && _c !== void 0 ? _c : "尚未設定標題"}</title>
    <link rel="canonical" href="./?page=${data.tag}">
    <meta name="keywords" content="${(_d = d.keywords) !== null && _d !== void 0 ? _d : "尚未設定關鍵字"}" />
    <link id="appImage" rel="shortcut icon" href="${(_e = d.logo) !== null && _e !== void 0 ? _e : ""}" type="image/x-icon">
    <link rel="icon" href="${(_f = d.logo) !== null && _f !== void 0 ? _f : ""}" type="image/png" sizes="128x128">
    <meta property="og:image" content="${(_g = d.image) !== null && _g !== void 0 ? _g : ""}">
    <meta property="og:title" content="${((_h = d.title) !== null && _h !== void 0 ? _h : "").replace(/\n/g, '')}">
    <meta name="description" content="${((_j = d.content) !== null && _j !== void 0 ? _j : "").replace(/\n/g, '')}">
    <meta name="og:description" content="${((_k = d.content) !== null && _k !== void 0 ? _k : "").replace(/\n/g, '')}">
     ${(_l = d.code) !== null && _l !== void 0 ? _l : ''}
  ${(() => {
                                var _a;
                                return ``;
                                if (req.query.type === 'editor') {
                                    return ``;
                                }
                                else {
                                    return `${((_a = data.config.globalStyle) !== null && _a !== void 0 ? _a : []).map((dd) => {
                                        try {
                                            if (dd.data.elem === 'link') {
                                                return `<link type="text/css" rel="stylesheet" href="${dd.data.attr.find((dd) => {
                                                    return dd.attr === 'href';
                                                }).value}">`;
                                            }
                                        }
                                        catch (e) {
                                            return ``;
                                        }
                                    }).join('')}`;
                                }
                            })()}


`;
                        })()}
                        <script>
window.appName='${appName}';
window.glitterBase='${brandAndMemberType.brand}';
window.memberType='${brandAndMemberType.memberType}';
window.glitterBackend='${config_1.config.domain}';
window.preloadData=${JSON.stringify(preload)};
</script>
                         
                        `;
                    }
                    else {
                        return await seo_js_1.Seo.redirectToHomePage(appName, req);
                    }
                }
                catch (e) {
                    console.log(e);
                    return e.message;
                }
            }
        },
    ]);
}
exports.createAPP = createAPP;
//# sourceMappingURL=index.js.map
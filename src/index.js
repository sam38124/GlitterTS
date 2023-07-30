"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const Glitter = __importStar(require("ts-glitter"));
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
const live_source_js_1 = require("./live_source.js");
exports.app = (0, express_1.default)();
const logger = new logger_1.default();
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
};
exports.app.use((0, cors_1.default)(corsOptions));
exports.app.use(express_1.default.raw());
exports.app.use(express_1.default.json({ limit: '50MB' }));
exports.app.use(createContext);
exports.app.use(contollers);
exports.app.use(public_contollers);
async function initial(serverPort) {
    await (async () => {
        await database_1.default.createPool();
        await saas_table_check_1.SaasScheme.createScheme();
        await redis_1.default.connect();
        await createAppRoute();
        await (0, AWSLib_1.listBuckets)();
        await (0, AWSLib_1.createBucket)(config_1.config.AWS_S3_NAME);
        logger.info('[Init]', `Server start with env: ${process.env.NODE_ENV || 'local'}`);
        await exports.app.listen(serverPort);
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
    live_source_js_1.Live_source.liveAPP.push(dd.appName);
    return await Glitter.setUP(exports.app, [
        {
            rout: '/' + encodeURI(dd.appName),
            path: path_1.default.resolve(__dirname, '../lowcode'),
            seoManager: async (req, resp) => {
                var _a;
                try {
                    let data = (await database_2.default.execute(`SELECT page_config, \`${config_1.saasConfig.SAAS_NAME}\`.app_config.\`config\`,tag
                                                  FROM \`${config_1.saasConfig.SAAS_NAME}\`.page_config,
                                                       \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                                  where \`${config_1.saasConfig.SAAS_NAME}\`.page_config.appName = ${database_2.default.escape(dd.appName)}
                                                    and tag = ${database_2.default.escape(req.query.page)}
                                                    and \`${config_1.saasConfig.SAAS_NAME}\`.page_config.appName = \`${config_1.saasConfig.SAAS_NAME}\`.app_config.appName;
                    `, []))[0];
                    let redirect = '';
                    if (data && data.page_config) {
                        const d = (_a = data.page_config.seo) !== null && _a !== void 0 ? _a : {};
                        if (d.type !== 'custom') {
                            data = (await database_2.default.execute(`SELECT page_config, \`${config_1.saasConfig.SAAS_NAME}\`.app_config.\`config\`,tag
                                                      FROM \`${config_1.saasConfig.SAAS_NAME}\`.page_config,
                                                           \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                                      where \`${config_1.saasConfig.SAAS_NAME}\`.page_config.appName = ${database_2.default.escape(dd.appName)}
                                                        and tag = ${database_2.default.escape(data.config.homePage)}
                                                        and \`${config_1.saasConfig.SAAS_NAME}\`.page_config.appName = \`${config_1.saasConfig.SAAS_NAME}\`.app_config.appName;
                            `, []))[0];
                        }
                    }
                    else {
                        const config = (await database_2.default.execute(`SELECT \`${config_1.saasConfig.SAAS_NAME}\`.app_config.\`config\`
                                                          FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                                          where \`${config_1.saasConfig.SAAS_NAME}\`.app_config.appName = ${database_2.default.escape(dd.appName)} limit 0,1
                        `, []))[0]['config'];
                        if (config && ((await database_2.default.execute(`SELECT count(1)
                                                          FROM \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                                                          where \`${config_1.saasConfig.SAAS_NAME}\`.page_config.appName = ${database_2.default.escape(dd.appName)}
                                                            and tag = ${database_2.default.escape(config['homePage'])}
                        `, []))[0]["count(1)"] === 1)) {
                            redirect = config['homePage'];
                        }
                        else {
                            redirect = (await database_2.default.execute(`SELECT tag
                                                          FROM \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                                                          where \`${config_1.saasConfig.SAAS_NAME}\`.page_config.appName = ${database_2.default.escape(dd.appName)} limit 0,1
                            `, []))[0]['tag'];
                        }
                        data = (await database_2.default.execute(`SELECT page_config, \`${config_1.saasConfig.SAAS_NAME}\`.app_config.\`config\`,tag
                                                  FROM \`${config_1.saasConfig.SAAS_NAME}\`.page_config,
                                                       \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                                  where \`${config_1.saasConfig.SAAS_NAME}\`.page_config.appName = ${database_2.default.escape(dd.appName)}
                                                    and tag = ${database_2.default.escape(redirect)}
                                                    and \`${config_1.saasConfig.SAAS_NAME}\`.page_config.appName = \`${config_1.saasConfig.SAAS_NAME}\`.app_config.appName;
                        `, []))[0];
                        if (req.query.type) {
                            redirect += `&type=${req.query.type}`;
                        }
                    }
                    return (() => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        data.page_config = (_a = data.page_config) !== null && _a !== void 0 ? _a : {};
                        if (data && data.page_config) {
                            const d = (_b = data.page_config.seo) !== null && _b !== void 0 ? _b : {};
                            return `<title>${(_c = d.title) !== null && _c !== void 0 ? _c : "尚未設定標題"}</title>
 <link rel="canonical" href="./?page=${data.tag}">
    <meta name="keywords" content="${(_d = d.keywords) !== null && _d !== void 0 ? _d : "尚未設定關鍵字"}" />
    <link id="appImage" rel="shortcut icon" href="${(_e = d.logo) !== null && _e !== void 0 ? _e : ""}" type="image/x-icon">
    <link rel="icon" href="${(_f = d.logo) !== null && _f !== void 0 ? _f : ""}" type="image/png" sizes="128x128">
    <meta property="og:image" content="${(_g = d.image) !== null && _g !== void 0 ? _g : ""}">
    <meta property="og:title" content="${(_h = d.title) !== null && _h !== void 0 ? _h : ""}">
    <meta name="description" content="${(_j = d.content) !== null && _j !== void 0 ? _j : ""}">
    ${(() => {
                                if (redirect) {
                                    return `<script>
window.location.href='?page=${redirect}';
</script>`;
                                }
                                else {
                                    return ``;
                                }
                            })()}
`;
                        }
                        else {
                            return `<script>
window.location.href='?page=${redirect}';
</script>`;
                        }
                    })() + `<script>
window.appName='${dd.appName}';
</script>`;
                }
                catch (e) {
                    return `<script>
window.appName='${dd.appName}';
</script>`;
                }
            }
        },
    ]);
}
exports.createAPP = createAPP;
//# sourceMappingURL=index.js.map
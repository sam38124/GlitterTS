"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAPP = exports.initial = exports.app = void 0;
var path_1 = require("path");
var express_1 = require("express");
var cors_1 = require("cors");
var redis_1 = require("./modules/redis");
var logger_1 = require("./modules/logger");
var uuid_1 = require("uuid");
var hooks_1 = require("./modules/hooks");
var config_1 = require("./config");
var contollers = require("./controllers");
var public_contollers = require("./api-public/controllers");
var database_1 = require("./modules/database");
var saas_table_check_1 = require("./services/saas-table-check");
var database_2 = require("./modules/database");
var AWSLib_1 = require("./modules/AWSLib");
var live_source_1 = require("./live_source");
var process = require("process");
var body_parser_1 = require("body-parser");
var public_table_check_js_1 = require("./api-public/services/public-table-check.js");
var release_js_1 = require("./services/release.js");
var fs_1 = require("fs");
var app_js_1 = require("./services/app.js");
var firebase_js_1 = require("./modules/firebase.js");
var glitter_util_js_1 = require("./helper/glitter-util.js");
var seo_js_1 = require("./services/seo.js");
var shopping_js_1 = require("./api-public/services/shopping.js");
var web_socket_js_1 = require("./services/web-socket.js");
var ut_database_js_1 = require("./api-public/utils/ut-database.js");
var compression_1 = require("compression");
var user_js_1 = require("./api-public/services/user.js");
var schedule_js_1 = require("./api-public/services/schedule.js");
var private_config_js_1 = require("./services/private_config.js");
var xml_formatter_1 = require("xml-formatter");
var system_schedule_1 = require("./services/system-schedule");
var ai_js_1 = require("./services/ai.js");
var cookie_parser_1 = require("cookie-parser");
var express_session_1 = require("express-session");
var monitor_js_1 = require("./api-public/services/monitor.js");
var sitemap_1 = require("sitemap");
var stream_1 = require("stream");
var seo_config_js_1 = require("./seo-config.js");
var Language_js_1 = require("./Language.js");
var caught_error_js_1 = require("./modules/caught-error.js");
exports.app = (0, express_1.default)();
var logger = new logger_1.default();
exports.app.options('/*', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,g-app,mac_address,language,currency_code');
    res.status(200).send();
});
// 配置 session
exports.app.use((0, express_session_1.default)({
    secret: config_1.config.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 }, // 設定 cookie 期限一年
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
function initial(serverPort) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    //統一設定時區為UTC
                                    process.env.TZ = 'UTC';
                                    return [4 /*yield*/, database_1.default.createPool()];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, ai_js_1.Ai.initial()];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, saas_table_check_1.SaasScheme.createScheme()];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, public_table_check_js_1.ApiPublic.createScheme(config_1.saasConfig.SAAS_NAME)];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, redis_1.default.connect()];
                                case 5:
                                    _a.sent();
                                    return [4 /*yield*/, createAppRoute()];
                                case 6:
                                    _a.sent();
                                    return [4 /*yield*/, (0, AWSLib_1.listBuckets)()];
                                case 7:
                                    _a.sent();
                                    return [4 /*yield*/, (0, AWSLib_1.createBucket)(config_1.config.AWS_S3_NAME)];
                                case 8:
                                    _a.sent();
                                    logger.info('[Init]', "Server start with env: ".concat(process.env.NODE_ENV || 'local'));
                                    return [4 /*yield*/, exports.app.listen(serverPort)];
                                case 9:
                                    _a.sent();
                                    fs_1.default.mkdirSync(path_1.default.resolve(__filename, '../app-project/work-space'), { recursive: true });
                                    release_js_1.Release.removeAllFilesInFolder(path_1.default.resolve(__filename, '../app-project/work-space'));
                                    if (!process.env.firebase) return [3 /*break*/, 11];
                                    return [4 /*yield*/, firebase_js_1.Firebase.initial()];
                                case 10:
                                    _a.sent();
                                    _a.label = 11;
                                case 11:
                                    // await UpdateScript.run()
                                    if (config_1.ConfigSetting.runSchedule) {
                                        new schedule_js_1.Schedule().main();
                                        new system_schedule_1.SystemSchedule().start();
                                    }
                                    web_socket_js_1.WebSocket.start();
                                    logger.info('[Init]', "Server is listening on port: ".concat(serverPort));
                                    caught_error_js_1.CaughtError.initial();
                                    return [2 /*return*/];
                            }
                        });
                    }); })()];
                case 1:
                    _a.sent();
                    console.log('Starting up the server now.');
                    return [2 /*return*/];
            }
        });
    });
}
exports.initial = initial;
function createContext(req, res, next) {
    var uuid = (0, uuid_1.v4)();
    var ip = req.ip;
    var requestInfo = { uuid: "".concat(uuid), method: "".concat(req.method), url: "".concat(req.url), ip: "".concat(ip) };
    hooks_1.asyncHooks.getInstance().createRequestContext(requestInfo);
    next();
}
function createAppRoute() {
    return __awaiter(this, void 0, void 0, function () {
        var apps, _i, apps_1, dd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_2.default.execute("SELECT appName\n     FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config;\n    "), [])];
                case 1:
                    apps = _a.sent();
                    _i = 0, apps_1 = apps;
                    _a.label = 2;
                case 2:
                    if (!(_i < apps_1.length)) return [3 /*break*/, 5];
                    dd = apps_1[_i];
                    return [4 /*yield*/, createAPP(dd)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 信任代理
exports.app.set('trust proxy', true);
function createAPP(dd) {
    return __awaiter(this, void 0, void 0, function () {
        var html, file_path;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    html = String.raw;
                    live_source_1.Live_source.liveAPP.push(dd.appName);
                    // const brand_type=await App.checkBrandAndMemberType(dd.appName)
                    //SHOPNEX 才可以跑排程，並且需有DOMAIN
                    // if(brand_type.brand==='shopnex' && brand_type.domain){
                    schedule_js_1.Schedule.app.push(dd.appName);
                    file_path = path_1.default.resolve(__dirname, '../lowcode');
                    return [4 /*yield*/, glitter_util_js_1.GlitterUtil.set_frontend_v2(exports.app, ['/' + encodeURI(dd.appName) + '/*', '/' + encodeURI(dd.appName)].map(function (rout) {
                            return {
                                rout: rout,
                                path: file_path,
                                app_name: dd.appName,
                                root_path: '/' + encodeURI(dd.appName) + '/',
                                seoManager: function (req) { return __awaiter(_this, void 0, void 0, function () {
                                    var og_url, appName_1, new_app, start, find_app, router, _a, seo_content_1, _b, customCode_1, FBCode, store_info, language_label, check_schema, brandAndMemberType_1, login_config, ip_country, language_1, data_1, home_page_data, d, seo, _c, preload, _d, seo_detail_1, link_prefix_1, distribution_code, home_seo_1, head, _e, _f, _g, _h, _j, _k, e_1;
                                    var _l, _m;
                                    var _this = this;
                                    var _o, _p, _q, _r, _s, _t;
                                    return __generator(this, function (_u) {
                                        switch (_u.label) {
                                            case 0:
                                                og_url = req.headers['x-original-url'];
                                                console.log("req.query.page=>", req.query.page);
                                                _u.label = 1;
                                            case 1:
                                                _u.trys.push([1, 33, , 34]);
                                                if (req.query.state === 'google_login') {
                                                    req.query.page = 'login';
                                                }
                                                appName_1 = dd.appName;
                                                if (!req.query.appName) return [3 /*break*/, 2];
                                                appName_1 = req.query.appName;
                                                return [3 /*break*/, 4];
                                            case 2:
                                                if (!og_url) return [3 /*break*/, 4];
                                                return [4 /*yield*/, database_2.default.query("SELECT *\n                   FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                   where LOWER(domain) = ?"), [og_url])];
                                            case 3:
                                                new_app = (_u.sent())[0];
                                                if (new_app && new_app.appName) {
                                                    appName_1 = new_app && new_app.appName;
                                                }
                                                else {
                                                    return [2 /*return*/, {
                                                            head: '',
                                                            body: "<script>window.location.href='https://shopnex.tw'</script>",
                                                        }];
                                                }
                                                _u.label = 4;
                                            case 4:
                                                req.headers['g-app'] = appName_1;
                                                start = new Date().getTime();
                                                console.log("getPageInfo==>", (new Date().getTime() - start) / 1000);
                                                //要進行initial避免找不到DB
                                                return [4 /*yield*/, public_table_check_js_1.ApiPublic.createScheme(appName_1)];
                                            case 5:
                                                //要進行initial避免找不到DB
                                                _u.sent();
                                                find_app = public_table_check_js_1.ApiPublic.app301.find(function (dd) {
                                                    return dd.app_name === appName_1;
                                                });
                                                if (!find_app) return [3 /*break*/, 7];
                                                router = find_app.router.find(function (dd) {
                                                    if (dd.legacy_url.startsWith('/')) {
                                                        dd.legacy_url = dd.legacy_url.substring(1);
                                                    }
                                                    if (dd.new_url.startsWith('/')) {
                                                        dd.new_url = dd.new_url.substring(1);
                                                    }
                                                    return dd.legacy_url === req.query.page;
                                                });
                                                if (!router) return [3 /*break*/, 7];
                                                _l = {};
                                                _a = "https://".concat;
                                                return [4 /*yield*/, app_js_1.App.checkBrandAndMemberType(appName_1)];
                                            case 6: return [2 /*return*/, (_l.redirect = _a.apply("https://", [(_u.sent()).domain, "/"]).concat(router.new_url),
                                                    _l)];
                                            case 7:
                                                seo_content_1 = [];
                                                return [4 /*yield*/, Promise.all([
                                                        new user_js_1.User(appName_1).getConfigV2({
                                                            key: 'ga4_config',
                                                            user_id: 'manager',
                                                        }),
                                                        new user_js_1.User(appName_1).getConfigV2({
                                                            key: 'login_fb_setting',
                                                            user_id: 'manager',
                                                        }),
                                                        new user_js_1.User(appName_1).getConfigV2({
                                                            key: 'store-information',
                                                            user_id: 'manager',
                                                        }),
                                                        new user_js_1.User(appName_1).getConfigV2({
                                                            key: 'language-label',
                                                            user_id: 'manager',
                                                        }),
                                                        public_table_check_js_1.ApiPublic.createScheme(appName_1),
                                                        app_js_1.App.checkBrandAndMemberType(appName_1),
                                                        new user_js_1.User(req.get('g-app'), req.body.token).getConfigV2({
                                                            key: 'login_config',
                                                            user_id: 'manager',
                                                        }),
                                                        user_js_1.User.ipInfo((req.query.ip || req.headers['x-real-ip'] || req.ip)),
                                                    ])];
                                            case 8:
                                                _b = _u.sent(), customCode_1 = _b[0], FBCode = _b[1], store_info = _b[2], language_label = _b[3], check_schema = _b[4], brandAndMemberType_1 = _b[5], login_config = _b[6], ip_country = _b[7];
                                                return [4 /*yield*/, seo_config_js_1.SeoConfig.language(store_info, req)];
                                            case 9:
                                                language_1 = _u.sent();
                                                //插入瀏覽紀錄
                                                monitor_js_1.Monitor.insertHistory({
                                                    req_type: 'file',
                                                    req: req,
                                                });
                                                return [4 /*yield*/, seo_js_1.Seo.getPageInfo(appName_1, req.query.page, language_1)];
                                            case 10:
                                                data_1 = _u.sent();
                                                return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0: return [4 /*yield*/, seo_js_1.Seo.getPageInfo(appName_1, 'index', language_1)];
                                                                case 1: return [2 /*return*/, _a.sent()];
                                                            }
                                                        });
                                                    }); })()];
                                            case 11:
                                                home_page_data = _u.sent();
                                                if ("".concat(req.query.page).startsWith('products/') && !data_1) {
                                                    data_1 = home_page_data;
                                                }
                                                if (!(data_1 && data_1.page_config)) return [3 /*break*/, 30];
                                                data_1.page_config = (_o = data_1.page_config) !== null && _o !== void 0 ? _o : {};
                                                d = (_p = data_1.page_config.seo) !== null && _p !== void 0 ? _p : {};
                                                if (!"".concat(req.query.page).startsWith('products/')) return [3 /*break*/, 13];
                                                return [4 /*yield*/, seo_config_js_1.SeoConfig.productSEO({
                                                        data: data_1,
                                                        language: language_1,
                                                        appName: appName_1,
                                                        product_id: req.query.product_id,
                                                        page: req.query.page,
                                                    })];
                                            case 12:
                                                _u.sent();
                                                return [3 /*break*/, 20];
                                            case 13:
                                                if (!("".concat(req.query.page) === 'blogs')) return [3 /*break*/, 15];
                                                return [4 /*yield*/, new user_js_1.User(req.get('g-app'), req.body.token).getConfigV2({
                                                        key: 'article_seo_data_' + language_1,
                                                        user_id: 'manager',
                                                    })];
                                            case 14:
                                                seo = _u.sent();
                                                data_1.page_config.seo.title = seo.title || data_1.page_config.seo.title;
                                                data_1.page_config.seo.content = seo.content || data_1.page_config.seo.content;
                                                data_1.page_config.seo.keywords = seo.keywords || data_1.page_config.seo.keywords;
                                                data_1.page_config.seo.image = seo.image || data_1.page_config.seo.image;
                                                data_1.page_config.seo.logo = seo.logo || data_1.page_config.seo.logo;
                                                return [3 /*break*/, 20];
                                            case 15:
                                                if (!"".concat(req.query.page).startsWith('blogs/')) return [3 /*break*/, 17];
                                                //網誌搜索
                                                _c = data_1.page_config;
                                                return [4 /*yield*/, seo_config_js_1.SeoConfig.articleSeo({
                                                        article: req.query.article,
                                                        page: req.query.page,
                                                        language: language_1,
                                                        appName: appName_1,
                                                        data: data_1,
                                                    })];
                                            case 16:
                                                //網誌搜索
                                                _c.seo = _u.sent();
                                                return [3 /*break*/, 20];
                                            case 17:
                                                if (!"".concat(req.query.page).startsWith('pages/')) return [3 /*break*/, 19];
                                                //頁面搜索
                                                return [4 /*yield*/, seo_config_js_1.SeoConfig.articleSeo({
                                                        article: req.query.article,
                                                        page: req.query.page,
                                                        language: language_1,
                                                        appName: appName_1,
                                                        data: data_1,
                                                    })];
                                            case 18:
                                                //頁面搜索
                                                _u.sent();
                                                return [3 /*break*/, 20];
                                            case 19:
                                                if (['privacy', 'term', 'refund', 'delivery'].includes("".concat(req.query.page))) {
                                                    data_1.page_config.seo = {
                                                        title: Language_js_1.Language.text("".concat(req.query.page), language_1),
                                                        content: Language_js_1.Language.text("".concat(req.query.page), language_1),
                                                    };
                                                }
                                                else if (d.type !== 'custom') {
                                                    data_1 = home_page_data;
                                                }
                                                _u.label = 20;
                                            case 20:
                                                if (!(req.query.isIframe === 'true')) return [3 /*break*/, 21];
                                                _d = {};
                                                return [3 /*break*/, 23];
                                            case 21: return [4 /*yield*/, app_js_1.App.preloadPageData(appName_1, req.query.page, language_1)];
                                            case 22:
                                                _d = _u.sent();
                                                _u.label = 23;
                                            case 23:
                                                preload = _d;
                                                data_1.page_config = (_q = data_1.page_config) !== null && _q !== void 0 ? _q : {};
                                                data_1.page_config.seo = (_r = data_1.page_config.seo) !== null && _r !== void 0 ? _r : {};
                                                return [4 /*yield*/, getSeoDetail(appName_1, req)];
                                            case 24:
                                                seo_detail_1 = _u.sent();
                                                if (seo_detail_1) {
                                                    Object.keys(seo_detail_1).map(function (dd) {
                                                        data_1.page_config.seo[dd] = seo_detail_1[dd];
                                                    });
                                                }
                                                link_prefix_1 = req.originalUrl.split('/')[1];
                                                if (link_prefix_1.includes('?')) {
                                                    link_prefix_1 = link_prefix_1.substring(0, link_prefix_1.indexOf('?'));
                                                }
                                                if (config_1.ConfigSetting.is_local) {
                                                    if (link_prefix_1 !== 'shopnex' && link_prefix_1 !== 'codenex_v2') {
                                                        link_prefix_1 = '';
                                                    }
                                                }
                                                else {
                                                    link_prefix_1 = '';
                                                }
                                                distribution_code = '';
                                                req.query.page = req.query.page || 'index';
                                                if (req.query.page.split('/')[0] === 'order_detail' && req.query.EndCheckout === '1') {
                                                    distribution_code = "\n                                    localStorage.setItem('distributionCode','');\n                                ";
                                                }
                                                if (!(req.query.page.split('/')[0] === 'distribution' &&
                                                    req.query.page.split('/')[1])) return [3 /*break*/, 26];
                                                return [4 /*yield*/, seo_config_js_1.SeoConfig.distributionSEO({
                                                        appName: appName_1,
                                                        url: req.url,
                                                        page: req.query.page,
                                                        link_prefix: link_prefix_1,
                                                        data: data_1,
                                                        language: language_1,
                                                    })];
                                            case 25:
                                                distribution_code = _u.sent();
                                                _u.label = 26;
                                            case 26:
                                                if (!(req.query.page.split('/')[0] === 'collections' &&
                                                    req.query.page.split('/')[1])) return [3 /*break*/, 28];
                                                return [4 /*yield*/, seo_config_js_1.SeoConfig.collectionSeo({ appName: appName_1, language: language_1, data: data_1, page: req.query.page })];
                                            case 27:
                                                _u.sent();
                                                _u.label = 28;
                                            case 28:
                                                //FB像素
                                                if (FBCode) {
                                                    seo_content_1.push(seo_config_js_1.SeoConfig.fbCode(FBCode));
                                                }
                                                home_seo_1 = home_page_data.page_config.seo || {};
                                                _e = [(function () {
                                                        var _a;
                                                        var d = data_1.page_config.seo;
                                                        return html(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n                    ", "\n                    ", "\n                    ", "\n                  "], ["\n                    ", "\n                    ", "\n                    ", "\n                  "])), (function () {
                                                            var _a, _b, _c;
                                                            if (req.query.type === 'editor') {
                                                                return seo_config_js_1.SeoConfig.editorSeo;
                                                            }
                                                            else {
                                                                return html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<title>\n                            ", "\n                          </title>\n                          <link\n                            rel=\"canonical\"\n                            href=\"", "\"\n                          />\n                          ", "\n                          <meta name=\"keywords\" content=\"", "\" />\n                          <link\n                            id=\"appImage\"\n                            rel=\"shortcut icon\"\n                            href=\"", "\"\n                            type=\"image/x-icon\"\n                          />\n                          <link rel=\"icon\" href=\"", "\" type=\"image/png\" sizes=\"128x128\" />\n                          <meta property=\"og:image\" content=\"", "\" />\n                          <meta\n                            property=\"og:title\"\n                            content=\"", "\"\n                          />\n                          <meta\n                            name=\"description\"\n                            content=\"", "\"\n                          />\n                          <meta\n                            name=\"og:description\"\n                            content=\"", "\"\n                          />\n\n                          ", " "], ["<title>\n                            ", "\n                          </title>\n                          <link\n                            rel=\"canonical\"\n                            href=\"", "\"\n                          />\n                          ", "\n                          <meta name=\"keywords\" content=\"", "\" />\n                          <link\n                            id=\"appImage\"\n                            rel=\"shortcut icon\"\n                            href=\"", "\"\n                            type=\"image/x-icon\"\n                          />\n                          <link rel=\"icon\" href=\"", "\" type=\"image/png\" sizes=\"128x128\" />\n                          <meta property=\"og:image\" content=\"", "\" />\n                          <meta\n                            property=\"og:title\"\n                            content=\"", "\"\n                          />\n                          <meta\n                            name=\"description\"\n                            content=\"", "\"\n                          />\n                          <meta\n                            name=\"og:description\"\n                            content=\"", "\"\n                          />\n\n                          ", " "])), [home_seo_1.title_prefix || '', d.title || '', home_seo_1.title_suffix || ''].join('') ||
                                                                    '尚未設定標題', (function () {
                                                                    if (data_1.tag === 'index') {
                                                                        return "https://".concat(brandAndMemberType_1.domain);
                                                                    }
                                                                    else if (req.query.page === 'blogs') {
                                                                        return "https://".concat(brandAndMemberType_1.domain, "/blogs");
                                                                    }
                                                                    {
                                                                        return "https://".concat(brandAndMemberType_1.domain, "/").concat(data_1.tag);
                                                                    }
                                                                })(), ((data_1.tag !== req.query.page || req.query.page === 'index-mobile') && req.query.page !== 'blogs')
                                                                    ? "<meta name=\"robots\" content=\"noindex\">"
                                                                    : "<meta name=\"robots\" content=\"index, follow\"/>", (d.keywords || '尚未設定關鍵字').replace(/"/g, '&quot;'), d.logo || home_seo_1.logo || '', d.logo || home_seo_1.logo || '', d.image || home_seo_1.image || '', ((_a = d.title) !== null && _a !== void 0 ? _a : '').replace(/\n/g, '').replace(/"/g, '&quot;'), ((_b = d.content) !== null && _b !== void 0 ? _b : '').replace(/\n/g, '').replace(/"/g, '&quot;'), ((_c = d.content) !== null && _c !== void 0 ? _c : '').replace(/\n/g, '').replace(/"/g, '&quot;'), [{ src: 'css/front-end.css', type: 'text/css' }]
                                                                    .map(function (dd) {
                                                                    return html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n                              <link href=\"/", "", "\" type=\"", "\"\n                                    rel=\"stylesheet\"></link>"], ["\n                              <link href=\"/", "", "\" type=\"", "\"\n                                    rel=\"stylesheet\"></link>"])), link_prefix_1 && "".concat(link_prefix_1, "/"), dd.src, dd.type);
                                                                })
                                                                    .join(''));
                                                            }
                                                        })(), (_a = d.code) !== null && _a !== void 0 ? _a : '', (function () {
                                                            var _a;
                                                            if (req.query.type === 'editor') {
                                                                return "";
                                                            }
                                                            else {
                                                                return "".concat(((_a = data_1.config.globalStyle) !== null && _a !== void 0 ? _a : [])
                                                                    .map(function (dd) {
                                                                    try {
                                                                        if (dd.data.elem === 'link') {
                                                                            return html(templateObject_3 || (templateObject_3 = __makeTemplateObject([" <link\n                                  type=\"text/css\"\n                                  rel=\"stylesheet\"\n                                  href=\"", "\"\n                                />"], [" <link\n                                  type=\"text/css\"\n                                  rel=\"stylesheet\"\n                                  href=\"", "\"\n                                />"])), dd.data.attr.find(function (dd) {
                                                                                return dd.attr === 'href';
                                                                            }).value);
                                                                        }
                                                                    }
                                                                    catch (e) {
                                                                        return "";
                                                                    }
                                                                })
                                                                    .join(''));
                                                            }
                                                        })());
                                                    })()];
                                                _f = "<script>\n                                ".concat;
                                                _g = [(_s = (req.query.type !== 'editor' && d.custom_script)) !== null && _s !== void 0 ? _s : '', "window.login_config = ".concat(JSON.stringify(login_config), ";"), "window.appName = '".concat(appName_1, "';"), "window.glitterBase = '".concat(brandAndMemberType_1.brand, "';"), "window.memberType = '".concat(brandAndMemberType_1.memberType, "';"), "window.glitterBackend = '".concat(config_1.config.domain, "';"), "window.preloadData = ".concat(JSON.stringify(preload)
                                                        .replace(/<\/script>/g, 'sdjuescript_prepand')
                                                        .replace(/<script>/g, 'sdjuescript_prefix'), ";"), "window.glitter_page = '".concat(req.query.page, "';"), "window.store_info = ".concat(JSON.stringify(store_info), ";"), "window.server_execute_time = ".concat((new Date().getTime() - start) / 1000, ";"), "window.language = '".concat(language_1, "';"), "".concat(distribution_code), "window.ip_country = '".concat(ip_country.country || 'TW', "';")];
                                                _h = "window.currency_covert = ".concat;
                                                _k = (_j = JSON).stringify;
                                                return [4 /*yield*/, shopping_js_1.Shopping.currencyCovert((req.query.base || 'TWD'))];
                                            case 29:
                                                head = _e.concat([
                                                    _f.apply("<script>\n                                ", [_g.concat([
                                                            _h.apply("window.currency_covert = ", [_k.apply(_j, [_u.sent()]), ";"]),
                                                            "window.language_list = ".concat(JSON.stringify(language_label.label), ";"),
                                                            "window.home_seo=".concat(JSON.stringify(home_seo_1)
                                                                .replace(/<\/script>/g, 'sdjuescript_prepand')
                                                                .replace(/<script>/g, 'sdjuescript_prefix'), ";")
                                                        ]).map(function (dd) {
                                                            return (dd || '').trim();
                                                        })
                                                            .filter(function (dd) {
                                                            return dd;
                                                        })
                                                            .join(';\n'), "\n                            </script>\n                            "]).concat([
                                                        { src: 'glitterBundle/GlitterInitial.js', type: 'module' },
                                                        { src: 'glitterBundle/module/html-generate.js', type: 'module' },
                                                        { src: 'glitterBundle/html-component/widget.js', type: 'module' },
                                                        { src: 'glitterBundle/plugins/trigger-event.js', type: 'module' },
                                                        { src: 'api/pageConfig.js', type: 'module' },
                                                    ]
                                                        .map(function (dd) {
                                                        return html(templateObject_5 || (templateObject_5 = __makeTemplateObject([" <script\n                                  src=\"/", "", "\"\n                                  type=\"", "\"\n                                ></script>"], [" <script\n                                  src=\"/", "", "\"\n                                  type=\"", "\"\n                                ></script>"])), link_prefix_1 && "".concat(link_prefix_1, "/"), dd.src, dd.type);
                                                    })
                                                        .join(''), "\n                            ").concat(((_t = preload.event) !== null && _t !== void 0 ? _t : [])
                                                        .filter(function (dd) {
                                                        return dd;
                                                    })
                                                        .map(function (dd) {
                                                        var link = dd.fun.replace("TriggerEvent.setEventRouter(import.meta.url, '.", 'official_event');
                                                        return link.substring(0, link.length - 2);
                                                    })
                                                        .map(function (dd) {
                                                        return html(templateObject_6 || (templateObject_6 = __makeTemplateObject([" <script src=\"/", "", "\" type=\"module\"></script>"], [" <script src=\"/", "", "\" type=\"module\"></script>"])), link_prefix_1 && "".concat(link_prefix_1, "/"), dd);
                                                    })
                                                        .join(''), "\n                            ").concat((function () {
                                                        if (req.query.type === 'editor') {
                                                            return "";
                                                        }
                                                        else {
                                                            return html(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n                                  ", " ", "\n                                  ", "\n                                "], ["\n                                  ", " ", "\n                                  ", "\n                                "])), seo_config_js_1.SeoConfig.gA4(customCode_1.ga4), seo_config_js_1.SeoConfig.gTag(customCode_1.g_tag), seo_content_1
                                                                .map(function (dd) {
                                                                return dd.trim();
                                                            })
                                                                .join('\n'));
                                                        }
                                                    })())
                                                ]).join('');
                                                return [2 /*return*/, {
                                                        head: head,
                                                        body: "",
                                                    }];
                                            case 30:
                                                _m = {};
                                                return [4 /*yield*/, seo_js_1.Seo.redirectToHomePage(appName_1, req)];
                                            case 31: return [2 /*return*/, (_m.head = _u.sent(),
                                                    _m.body = "",
                                                    _m)];
                                            case 32: return [3 /*break*/, 34];
                                            case 33:
                                                e_1 = _u.sent();
                                                console.error(e_1);
                                                return [2 /*return*/, {
                                                        head: "",
                                                        body: "".concat(e_1),
                                                    }];
                                            case 34: return [2 /*return*/];
                                        }
                                    });
                                }); },
                                sitemap: function (req, resp) { return __awaiter(_this, void 0, void 0, function () {
                                    var appName, query, article, domain, site_map, cols, language_setting, product, stream, xml, _a, _b, _c, _d;
                                    var _e;
                                    return __generator(this, function (_f) {
                                        switch (_f.label) {
                                            case 0:
                                                appName = dd.appName;
                                                if (req.query.appName) {
                                                    appName = req.query.appName;
                                                }
                                                query = ["(content->>'$.type'='article')"];
                                                return [4 /*yield*/, new ut_database_js_1.UtDatabase(appName, "t_manager_post").querySql(query, {
                                                        page: 0,
                                                        limit: 10000,
                                                    })];
                                            case 1:
                                                article = _f.sent();
                                                return [4 /*yield*/, database_2.default.query("select `domain`\n               from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n               where appName = ?"), [appName])];
                                            case 2:
                                                domain = (_f.sent())[0]['domain'];
                                                return [4 /*yield*/, getSeoSiteMap(appName, req)];
                                            case 3:
                                                site_map = _f.sent();
                                                return [4 /*yield*/, database_2.default.query("SELECT *\n                 FROM `".concat(appName, "`.public_config\n                 WHERE `key` = 'collection';"), [])];
                                            case 4:
                                                cols = (_e = (_f.sent())[0]) !== null && _e !== void 0 ? _e : {};
                                                return [4 /*yield*/, new user_js_1.User(appName).getConfigV2({
                                                        key: 'store-information',
                                                        user_id: 'manager',
                                                    })];
                                            case 5:
                                                language_setting = (_f.sent()).language_setting;
                                                return [4 /*yield*/, new shopping_js_1.Shopping(appName).getProduct({
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
                                                    })];
                                            case 6:
                                                product = (_f.sent()).data;
                                                stream = new sitemap_1.SitemapStream({ hostname: "https://".concat(domain) });
                                                _a = sitemap_1.streamToPromise;
                                                _c = (_b = stream_1.Readable).from;
                                                _d = [[]];
                                                return [4 /*yield*/, database_2.default.query("select page_config, tag, updated_time\n                     from `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config\n                     where appName = ?\n                       and page_config ->>'$.seo.type'='custom'\n                    "), [appName])];
                                            case 7: return [4 /*yield*/, _a.apply(void 0, [_c.apply(_b, [__spreadArray.apply(void 0, [__spreadArray.apply(void 0, [__spreadArray.apply(void 0, [__spreadArray.apply(void 0, [__spreadArray.apply(void 0, _d.concat([(_f.sent()).map(function (d2) {
                                                                                if (d2.tag === 'index') {
                                                                                    return { url: "https://".concat(domain), changefreq: 'weekly' };
                                                                                }
                                                                                else {
                                                                                    return { url: "https://".concat(domain, "/").concat(d2.tag), changefreq: 'weekly' };
                                                                                }
                                                                            }), true])), article.data
                                                                            .filter(function (d2) {
                                                                            return d2.content.template;
                                                                        })
                                                                            .map(function (d2) {
                                                                            return {
                                                                                url: "https://".concat(domain, "/").concat(d2.content.for_index === 'false' ? "pages" : "blogs", "/").concat(d2.content.tag),
                                                                                changefreq: 'weekly',
                                                                                lastmod: formatDateToISO(new Date(d2.updated_time)),
                                                                            };
                                                                        }), true]), (site_map || []).map(function (d2) {
                                                                        return { url: "https://".concat(domain, "/").concat(d2.url), changefreq: 'weekly' };
                                                                    }), true]), (function () {
                                                                    var array = [];
                                                                    (0, seo_config_js_1.extractCols)(cols).map(function (item) {
                                                                        array = array.concat(language_setting.support.map(function (d1) {
                                                                            var seo = (item.language_data &&
                                                                                item.language_data[d1] &&
                                                                                item.language_data[d1].seo &&
                                                                                item.language_data[d1].seo.domain) ||
                                                                                item.code ||
                                                                                item.title;
                                                                            if (d1 === language_setting.def) {
                                                                                return { url: "https://".concat(domain, "/collections/").concat(seo), changefreq: 'weekly' };
                                                                            }
                                                                            else if (d1 === 'zh-TW') {
                                                                                return { url: "https://".concat(domain, "/tw/collections/").concat(seo), changefreq: 'weekly' };
                                                                            }
                                                                            else if (d1 === 'zh-CN') {
                                                                                return { url: "https://".concat(domain, "/cn/collections/").concat(seo), changefreq: 'weekly' };
                                                                            }
                                                                            else if (d1 === 'en-US') {
                                                                                return { url: "https://".concat(domain, "/en/collections/").concat(seo), changefreq: 'weekly' };
                                                                            }
                                                                            else {
                                                                                return { url: "https://".concat(domain, "/").concat(d1, "/collections/").concat(seo), changefreq: 'weekly' };
                                                                            }
                                                                        }));
                                                                    });
                                                                    return array;
                                                                })(), true]), (function () {
                                                                var array = [];
                                                                product.map(function (dd) {
                                                                    dd = dd.content;
                                                                    array = array.concat(language_setting.support.map(function (d1) {
                                                                        var seo = (dd.language_data &&
                                                                            dd.language_data[d1] &&
                                                                            dd.language_data[d1].seo &&
                                                                            dd.language_data[d1].seo.domain) ||
                                                                            dd.seo.domain;
                                                                        if (d1 === language_setting.def) {
                                                                            return { url: "https://".concat(domain, "/products/").concat(seo), changefreq: 'weekly' };
                                                                        }
                                                                        else if (d1 === 'zh-TW') {
                                                                            return { url: "https://".concat(domain, "/tw/products/").concat(seo), changefreq: 'weekly' };
                                                                        }
                                                                        else if (d1 === 'zh-CN') {
                                                                            return { url: "https://".concat(domain, "/cn/products/").concat(seo), changefreq: 'weekly' };
                                                                        }
                                                                        else if (d1 === 'en-US') {
                                                                            return { url: "https://".concat(domain, "/en/products/").concat(seo), changefreq: 'weekly' };
                                                                        }
                                                                        else {
                                                                            return { url: "https://".concat(domain, "/").concat(d1, "/products/").concat(seo), changefreq: 'weekly' };
                                                                        }
                                                                    }));
                                                                });
                                                                return array;
                                                            })(), true]).filter(function (dd) {
                                                            return dd.url !== "https://".concat(domain, "/blogs");
                                                        })
                                                            .concat([{ url: "https://".concat(domain, "/blogs"), changefreq: 'weekly' }])]).pipe(stream)]).then(function (data) { return data.toString(); })];
                                            case 8:
                                                xml = _f.sent();
                                                return [2 /*return*/, xml];
                                        }
                                    });
                                }); },
                                sitemap_list: function (req, resp) { return __awaiter(_this, void 0, void 0, function () {
                                    var appName, domain;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                appName = dd.appName;
                                                if (req.query.appName) {
                                                    appName = req.query.appName;
                                                }
                                                return [4 /*yield*/, database_2.default.query("select `domain`\n               from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n               where appName = ?"), [appName])];
                                            case 1:
                                                domain = (_a.sent())[0]['domain'];
                                                return [2 /*return*/, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n                    <sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n                        <!-- This is the parent sitemap linking to additional sitemaps for products, collections and pages as shown below. The sitemap can not be edited manually, but is kept up to date in real time. -->\n                        <sitemap>\n                            <loc>https://".concat(domain, "/sitemap_detail.xml</loc>\n                        </sitemap>\n                    </sitemapindex> ")];
                                        }
                                    });
                                }); },
                                robots: function (req, resp) { return __awaiter(_this, void 0, void 0, function () {
                                    var appName, robots, domain;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                appName = dd.appName;
                                                if (req.query.appName) {
                                                    appName = req.query.appName;
                                                }
                                                return [4 /*yield*/, new user_js_1.User(appName).getConfigV2({
                                                        key: 'robots_text',
                                                        user_id: 'manager',
                                                    })];
                                            case 1:
                                                robots = _a.sent();
                                                robots.text = robots.text || '';
                                                return [4 /*yield*/, database_2.default.query("select `domain`\n               from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n               where appName = ?"), [appName])];
                                            case 2:
                                                domain = (_a.sent())[0]['domain'];
                                                return [2 /*return*/, robots.text.replace(/\s+/g, '').replace(/\n/g, '')
                                                        ? robots.text
                                                        : html(templateObject_8 || (templateObject_8 = __makeTemplateObject(["User-agent: * Allow: / Sitemap: https://", "/sitemap.xml"], ["User-agent: * Allow: / Sitemap: https://", "/sitemap.xml"])), domain)];
                                        }
                                    });
                                }); },
                                tw_shop: function (req, resp) { return __awaiter(_this, void 0, void 0, function () {
                                    var appName, escapeHtml, products, domain, printData;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                appName = dd.appName;
                                                escapeHtml = function (text) {
                                                    var map = {
                                                        '&': '&amp;',
                                                        '<': '&lt;',
                                                        '>': '&gt;',
                                                        '"': '&quot;',
                                                        "'": '&#039;',
                                                    };
                                                    return text.replace(/[&<>"']/g, function (m) { return map[m] || m; });
                                                };
                                                if (req.query.appName) {
                                                    appName = req.query.appName;
                                                }
                                                return [4 /*yield*/, database_2.default.query("SELECT *\n             FROM `".concat(dd.appName, "`.t_manager_post\n             WHERE JSON_EXTRACT(content, '$.type') = 'product';\n            "), [])];
                                            case 1:
                                                products = _a.sent();
                                                return [4 /*yield*/, database_2.default.query("select `domain`\n               from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n               where appName = ?"), [appName])];
                                            case 2:
                                                domain = (_a.sent())[0]['domain'];
                                                printData = products
                                                    .map(function (product) {
                                                    return product.content.variants
                                                        .map(function (variant) {
                                                        var _a, _b;
                                                        return html(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n                    <Product>\n                      <SKU>", "</SKU>\n                      <Name>", "</Name>\n                      <Description>", " - ", "</Description>\n                      <URL> ", "</URL>\n                      <Price>", "</Price>\n                      <LargeImage> ", "</LargeImage>\n                      <SalePrice>", "</SalePrice>\n                      <Category>", "</Category>\n                    </Product>\n                  "], ["\n                    <Product>\n                      <SKU>", "</SKU>\n                      <Name>", "</Name>\n                      <Description>", " - ", "</Description>\n                      <URL> ", "</URL>\n                      <Price>", "</Price>\n                      <LargeImage> ", "</LargeImage>\n                      <SalePrice>", "</SalePrice>\n                      <Category>", "</Category>\n                    </Product>\n                  "])), variant.sku, product.content.title, dd.appName, product.content.title, "https://" + domain + '/products/' + product.content.title, (_a = variant.compare_price) !== null && _a !== void 0 ? _a : variant.sale_price, (_b = variant.preview_image) !== null && _b !== void 0 ? _b : '', variant.sale_price, product.content.collection.join(''));
                                                    })
                                                        .join('');
                                                })
                                                    .join('');
                                                return [2 /*return*/, (0, xml_formatter_1.default)("<Product>".concat(printData, "</Product>"), {
                                                        indentation: '  ', // 使用兩個空格進行縮進
                                                        filter: function (node) { return node.type !== 'Comment'; }, // 選擇性過濾節點
                                                        collapseContent: true, // 折疊內部文本
                                                    })];
                                        }
                                    });
                                }); },
                            };
                        }))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.createAPP = createAPP;
function getSeoDetail(appName, req) {
    return __awaiter(this, void 0, void 0, function () {
        var sqlData, html;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                        appName: appName,
                        key: 'seo_webhook',
                    })];
                case 1:
                    sqlData = _a.sent();
                    if (!sqlData[0] || !sqlData[0].value) {
                        return [2 /*return*/, undefined];
                    }
                    html = String.raw;
                    return [4 /*yield*/, database_2.default.queryLambada({
                            database: appName,
                        }, function (db) { return __awaiter(_this, void 0, void 0, function () {
                            var functionValue, evalString, myFunction;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        db.execute = db.query;
                                        functionValue = [
                                            {
                                                key: 'db',
                                                data: function () {
                                                    return db;
                                                },
                                            },
                                            {
                                                key: 'req',
                                                data: function () {
                                                    return req;
                                                },
                                            },
                                        ];
                                        evalString = "\n                return {\n                execute:(".concat(functionValue
                                            .map(function (d2) {
                                            return d2.key;
                                        })
                                            .join(','), ")=>{\n                try {\n                ").concat(sqlData[0].value.value.replace(/new\s*Promise\s*\(\s*async\s*\(\s*resolve\s*,\s*reject\s*\)\s*=>\s*\{([\s\S]*)\}\s*\)/i, 'new Promise(async (resolve, reject) => { try { $1 } catch (error) { console.log(error);reject(error); } })'), "\n                }catch (e) { console.log(e) } } }\n            ");
                                        myFunction = new Function(evalString);
                                        return [4 /*yield*/, myFunction().execute(functionValue[0].data(), functionValue[1].data())];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getSeoSiteMap(appName, req) {
    return __awaiter(this, void 0, void 0, function () {
        var sqlData, html;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                        appName: appName,
                        key: 'sitemap_webhook',
                    })];
                case 1:
                    sqlData = _a.sent();
                    if (!sqlData[0] || !sqlData[0].value) {
                        return [2 /*return*/, undefined];
                    }
                    html = String.raw;
                    return [4 /*yield*/, database_2.default.queryLambada({
                            database: appName,
                        }, function (db) { return __awaiter(_this, void 0, void 0, function () {
                            var functionValue, evalString, myFunction;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        db.execute = db.query;
                                        functionValue = [
                                            {
                                                key: 'db',
                                                data: function () {
                                                    return db;
                                                },
                                            },
                                            {
                                                key: 'req',
                                                data: function () {
                                                    return req;
                                                },
                                            },
                                        ];
                                        evalString = "\n                return {\n                execute:(".concat(functionValue
                                            .map(function (d2) {
                                            return d2.key;
                                        })
                                            .join(','), ")=>{\n                try {\n                ").concat(sqlData[0].value.value.replace(/new\s*Promise\s*\(\s*async\s*\(\s*resolve\s*,\s*reject\s*\)\s*=>\s*\{([\s\S]*)\}\s*\)/i, 'new Promise(async (resolve, reject) => { try { $1 } catch (error) { console.log(error);reject(error); } })'), "\n                }catch (e) { console.log(e) } } }\n            ");
                                        myFunction = new Function(evalString);
                                        return [4 /*yield*/, myFunction().execute(functionValue[0].data(), functionValue[1].data())];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function formatDateToISO(date) {
    return "".concat(date.toISOString().substring(0, date.toISOString().length - 5), "+00:00");
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;

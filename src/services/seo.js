"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seo = void 0;
var database_js_1 = require("../modules/database.js");
var config_js_1 = require("../config.js");
var template_js_1 = require("./template.js");
var Seo = /** @class */ (function () {
    function Seo() {
    }
    Seo.getPageInfo = function (appName, query_page, language) {
        return __awaiter(this, void 0, void 0, function () {
            var page, page_db, page_data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, template_js_1.Template.getRealPage(query_page, appName)];
                    case 1:
                        page = _a.sent();
                        if (page === 'official-router') {
                            appName = 'cms_system';
                        }
                        page_db = (function () {
                            switch (language) {
                                case 'zh-TW':
                                    return 'page_config';
                                case 'en-US':
                                    return 'page_config_en';
                                case 'zh-CN':
                                    return 'page_config_rcn';
                                default:
                                    return 'page_config';
                            }
                        })();
                        return [4 /*yield*/, database_js_1.default.execute("SELECT page_config,\n                                         `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config.`config`,\n                                         tag,\n                                         page_type,\n                                         tag\n                                  FROM `").concat(config_js_1.saasConfig.SAAS_NAME, "`.").concat(page_db, ",\n                                       `").concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n                                  where `").concat(config_js_1.saasConfig.SAAS_NAME, "`.").concat(page_db, ".appName = ").concat(database_js_1.default.escape(appName), "\n                                    and tag = ").concat(database_js_1.default.escape(page), "\n                                    and `").concat(config_js_1.saasConfig.SAAS_NAME, "`.").concat(page_db, ".appName = `").concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config.appName;\n        "), [])];
                    case 2:
                        page_data = (_a.sent())[0];
                        if (!(!page_data && (language != 'zh-TW'))) return [3 /*break*/, 4];
                        return [4 /*yield*/, Seo.getPageInfo(appName, query_page, 'zh-TW')];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/, page_data];
                }
            });
        });
    };
    Seo.getAppConfig = function (appName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.default.execute("SELECT `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config.`config`,\n                                         `").concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config.`brand`\n                                  FROM `").concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n                                  where `").concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config.appName = ").concat(database_js_1.default.escape(appName), " limit 0,1\n        "), [])];
                    case 1: return [2 /*return*/, (_a.sent())[0]['config']];
                }
            });
        });
    };
    Seo.redirectToHomePage = function (appName, req) {
        return __awaiter(this, void 0, void 0, function () {
            var redirect, relative_root, config, _a, data, query_stack, link_prefix;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        redirect = '';
                        relative_root = ((_b = req.query.page) !== null && _b !== void 0 ? _b : "").split('/').map(function (dd, index) {
                            if (index === 0) {
                                return './';
                            }
                            else {
                                return '../';
                            }
                        }).join('');
                        return [4 /*yield*/, Seo.getAppConfig(appName)];
                    case 1:
                        config = _c.sent();
                        _a = config;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, database_js_1.default.execute("SELECT count(1)\n                                          FROM `".concat(config_js_1.saasConfig.SAAS_NAME, "`.page_config\n                                          where `").concat(config_js_1.saasConfig.SAAS_NAME, "`.page_config.appName = ").concat(database_js_1.default.escape(appName), "\n                                            and tag = ").concat(database_js_1.default.escape(config['homePage']), "\n        "), [])];
                    case 2:
                        _a = ((_c.sent())[0]["count(1)"] === 1);
                        _c.label = 3;
                    case 3:
                        if (!_a) return [3 /*break*/, 4];
                        redirect = config['homePage'];
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, database_js_1.default.execute("SELECT tag\n                                          FROM `".concat(config_js_1.saasConfig.SAAS_NAME, "`.page_config\n                                          where `").concat(config_js_1.saasConfig.SAAS_NAME, "`.page_config.appName = ").concat(database_js_1.default.escape(appName), " limit 0,1\n            "), [])];
                    case 5:
                        redirect = (_c.sent())[0]['tag'];
                        _c.label = 6;
                    case 6: return [4 /*yield*/, Seo.getPageInfo(appName, redirect, 'zh-TW')];
                    case 7:
                        data = _c.sent();
                        query_stack = [];
                        if (req.query.type) {
                            query_stack.push("type=".concat(req.query.type));
                        }
                        if (req.query.appName) {
                            query_stack.push("appName=".concat(req.query.appName));
                        }
                        if (req.query.function) {
                            query_stack.push("function=".concat(req.query.function));
                        }
                        if (query_stack.length > 0) {
                            redirect += "?".concat(query_stack.join('&'));
                        }
                        link_prefix = req.originalUrl.split('/')[1];
                        if (config_js_1.ConfigSetting.is_local) {
                            if ((link_prefix !== 'shopnex') && (link_prefix !== 'codenex_v2')) {
                                link_prefix = '';
                            }
                        }
                        else {
                            link_prefix = '';
                        }
                        return [2 /*return*/, "<head>\n".concat((function () {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                                data.page_config = (_a = data.page_config) !== null && _a !== void 0 ? _a : {};
                                var d = (_b = data.page_config.seo) !== null && _b !== void 0 ? _b : {};
                                return "\n<title>".concat((_c = d.title) !== null && _c !== void 0 ? _c : "尚未設定標題", "</title>\n    <link rel=\"canonical\" href=\"/").concat(link_prefix && "".concat(link_prefix, "/")).concat(data.tag, "\">\n    <meta name=\"keywords\" content=\"").concat((_d = d.keywords) !== null && _d !== void 0 ? _d : "尚未設定關鍵字", "\" />\n    <link id=\"appImage\" rel=\"shortcut icon\" href=\"").concat((_e = d.logo) !== null && _e !== void 0 ? _e : "", "\" type=\"image/x-icon\">\n    <link rel=\"icon\" href=\"").concat((_f = d.logo) !== null && _f !== void 0 ? _f : "", "\" type=\"image/png\" sizes=\"128x128\">\n    <meta property=\"og:image\" content=\"").concat((_g = d.image) !== null && _g !== void 0 ? _g : "", "\">\n    <meta property=\"og:title\" content=\"").concat(((_h = d.title) !== null && _h !== void 0 ? _h : "").replace(/\n/g, ''), "\">\n    <meta name=\"description\" content=\"").concat(((_j = d.content) !== null && _j !== void 0 ? _j : "").replace(/\n/g, ''), "\">\n    <meta name=\"og:description\" content=\"").concat(((_k = d.content) !== null && _k !== void 0 ? _k : "").replace(/\n/g, ''), "\">\n     ").concat((_l = d.code) !== null && _l !== void 0 ? _l : '', "\n");
                            })(), "\n<script>\nwindow.glitter_page='").concat(req.query.page, "';\nwindow.redirct_tohome='/").concat(link_prefix && "".concat(link_prefix, "/")).concat(redirect, "';\n</script>\n</head>\n")];
                }
            });
        });
    };
    return Seo;
}());
exports.Seo = Seo;

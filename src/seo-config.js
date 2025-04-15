"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractProds = exports.extractCols = exports.SeoConfig = void 0;
var database_js_1 = require("./modules/database.js");
var manager_js_1 = require("./api-public/services/manager.js");
var ut_database_js_1 = require("./api-public/utils/ut-database.js");
var shopping_js_1 = require("./api-public/services/shopping.js");
var html = String.raw;
var SeoConfig = /** @class */ (function () {
    function SeoConfig() {
    }
    // 分類頁的SEO
    SeoConfig.collectionSeo = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var cols, colJson, urlCode, colData;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, manager_js_1.Manager.getConfig({
                            appName: cf.appName,
                            key: 'collection',
                            language: cf.language,
                        })];
                    case 1:
                        cols = (_a = (_b.sent())[0]) !== null && _a !== void 0 ? _a : {};
                        colJson = extractCols(cols);
                        urlCode = decodeURI(cf.page.split('/')[1]);
                        console.log("urlCode===>", urlCode);
                        colData = colJson.find(function (item) {
                            console.log("item==>", item);
                            if (item.language_data && item.language_data[cf.language]) {
                                return item.language_data[cf.language].seo.domain === urlCode || item.title === urlCode;
                            }
                            else {
                                return item.code === urlCode || item.title === urlCode;
                            }
                        });
                        console.log("colData===>", colData);
                        if (colData) {
                            if (colData.language_data && colData.language_data[cf.language]) {
                                cf.data.page_config.seo.title = colData.language_data[cf.language].seo.title || urlCode;
                                cf.data.page_config.seo.content = colData.language_data[cf.language].seo.content;
                                cf.data.tag = cf.page;
                            }
                            else {
                                cf.data.page_config.seo.title = colData.seo_title || urlCode;
                                cf.data.page_config.seo.content = colData.seo_content;
                                cf.data.page_config.seo.keywords = colData.seo_keywords;
                                cf.data.tag = cf.page;
                            }
                            cf.data.page_config.seo.image = colData.seo_image;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // 分銷連結的SEO
    SeoConfig.distributionSEO = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var redURL, rec, page, query, article;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        redURL = new URL("https://127.0.0.1".concat(cf.url));
                        return [4 /*yield*/, database_js_1.default.query("SELECT * FROM `".concat(cf.appName, "`.t_recommend_links WHERE content ->>'$.link' = ?;\n      "), [cf.page.split('/')[1]])];
                    case 1:
                        rec = _c.sent();
                        page = rec[0] && rec[0].content ? rec[0].content : { status: false };
                        if (!(page.status && isCurrentTimeWithinRange(page))) return [3 /*break*/, 3];
                        query = ["(content->>'$.type'='article')", "(content->>'$.tag'='".concat(page.redirect.split('/')[2], "')")];
                        return [4 /*yield*/, new ut_database_js_1.UtDatabase(cf.appName, "t_manager_post").querySql(query, {
                                page: 0,
                                limit: 1,
                            })];
                    case 2:
                        article = _c.sent();
                        cf.data.page_config = (_a = cf.data.page_config) !== null && _a !== void 0 ? _a : {};
                        cf.data.page_config.seo = (_b = cf.data.page_config.seo) !== null && _b !== void 0 ? _b : {};
                        if (article.data[0]) {
                            if (article.data[0].content.language_data[cf.language]) {
                                cf.data.page_config.seo.title = article.data[0].content.language_data[cf.language].seo.title;
                                cf.data.page_config.seo.content = article.data[0].content.language_data[cf.language].seo.content;
                                cf.data.page_config.seo.keywords = article.data[0].content.language_data[cf.language].seo.keywords;
                            }
                            else {
                                cf.data.page_config.seo.title = article.data[0].content.seo.title;
                                cf.data.page_config.seo.content = article.data[0].content.seo.content;
                                cf.data.page_config.seo.keywords = article.data[0].content.seo.keywords;
                            }
                        }
                        return [2 /*return*/, html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["localStorage.setItem('distributionCode','", "'); location.href =\n      '", "", "", "", "'; "], ["localStorage.setItem('distributionCode','", "'); location.href =\n      '", "", "", "", "'; "])), page.code, cf.link_prefix ? "/" : "", cf.link_prefix, page.redirect, redURL.search)];
                    case 3: return [2 /*return*/, html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["location.href = '/';"], ["location.href = '/';"])))];
                }
            });
        });
    };
    // 商品頁面SEO
    SeoConfig.productSEO = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var product_domain, pd, productSeo, language_data, _a, _b;
            var _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        product_domain = cf.page.split('/')[1];
                        return [4 /*yield*/, new shopping_js_1.Shopping(cf.appName, undefined).getProduct(product_domain
                                ? {
                                    page: 0,
                                    limit: 1,
                                    domain: decodeURIComponent(product_domain),
                                    language: cf.language,
                                }
                                : {
                                    page: 0,
                                    limit: 1,
                                    id: cf.product_id,
                                    language: cf.language,
                                })];
                    case 1:
                        pd = _h.sent();
                        if (!pd.data.content) return [3 /*break*/, 3];
                        pd.data.content.language_data = (_c = pd.data.content.language_data) !== null && _c !== void 0 ? _c : {};
                        productSeo = (pd.data.content.language_data[cf.language] && pd.data.content.language_data[cf.language].seo) ||
                            ((_d = pd.data.content.seo) !== null && _d !== void 0 ? _d : {});
                        language_data = pd.data.content.language_data;
                        cf.data.page_config = (_e = cf.data.page_config) !== null && _e !== void 0 ? _e : {};
                        cf.data.page_config.seo = (_f = cf.data.page_config.seo) !== null && _f !== void 0 ? _f : {};
                        cf.data.page_config.seo.title = productSeo.title || pd.data.content.title;
                        cf.data.page_config.seo.image =
                            (language_data &&
                                language_data[cf.language] &&
                                language_data.preview_image &&
                                language_data.preview_image[0]) ||
                                pd.data.content.preview_image[0];
                        cf.data.page_config.seo.content = productSeo.content;
                        cf.data.tag = cf.page;
                        _a = cf.data.page_config.seo;
                        _b = ((_g = cf.data.page_config.seo.code) !== null && _g !== void 0 ? _g : '');
                        return [4 /*yield*/, this.getProductJsonLd(cf.appName, pd.data.content)];
                    case 2:
                        _a.code =
                            _b + (_h.sent());
                        _h.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 取得商品 head script
    SeoConfig.getProductJsonLd = function (app_name, pd_content) {
        return __awaiter(this, void 0, void 0, function () {
            var relative_product, spec, preview_image, variant, preview_image;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!pd_content || !Array.isArray(pd_content.relative_product) || pd_content.relative_product.length === 0) {
                            return [2 /*return*/, ''];
                        }
                        return [4 /*yield*/, new shopping_js_1.Shopping(app_name, undefined).getProduct({
                                page: 0,
                                limit: 100,
                                id_list: [-99].concat((_a = pd_content.relative_product) !== null && _a !== void 0 ? _a : []).join(','),
                            })];
                    case 1:
                        relative_product = _b.sent();
                        if (pd_content.product_category === 'kitchen') {
                            spec = pd_content.specs.find(function (dd) { return dd.option.length; });
                            preview_image = pd_content.preview_image.filter(function (dd) { return dd; });
                            return [2 /*return*/, html(templateObject_3 || (templateObject_3 = __makeTemplateObject([" <script type=\"application/ld+json\">\n        ", "\n      </script>"], [" <script type=\"application/ld+json\">\n        ", "\n      </script>"])), JSON.stringify({
                                    '@context': 'http://schema.org/',
                                    '@type': 'Product',
                                    name: pd_content.title,
                                    brand: '',
                                    description: pd_content.content.replace(/<\/?[^>]+(>|$)/g, ''),
                                    offers: {
                                        '@type': 'Offer',
                                        price: parseFloat(parseInt((spec && spec.price) || pd_content.price || 0, 10).toFixed(1)),
                                        priceCurrency: 'TWD',
                                        availability: 'http://schema.org/InStock',
                                    },
                                    image: preview_image,
                                    isRelatedTo: relative_product.data.map(function (dd) {
                                        return {
                                            '@type': 'Product',
                                            name: dd.content.title,
                                            offers: { '@type': 'Offer', price: parseFloat(dd.content.min_price.toFixed(1)), priceCurrency: 'TWD' },
                                        };
                                    }),
                                }))];
                        }
                        else {
                            variant = pd_content.variants[0];
                            preview_image = [variant ? variant.preview_image : []].concat(pd_content.preview_image).filter(function (dd) { return dd; });
                            return [2 /*return*/, html(templateObject_4 || (templateObject_4 = __makeTemplateObject([" <script type=\"application/ld+json\">\n        ", "\n      </script>"], [" <script type=\"application/ld+json\">\n        ", "\n      </script>"])), JSON.stringify({
                                    '@context': 'http://schema.org/',
                                    '@type': 'Product',
                                    name: pd_content.title,
                                    brand: '',
                                    description: pd_content.content.replace(/<\/?[^>]+(>|$)/g, ''),
                                    offers: {
                                        '@type': 'Offer',
                                        price: parseFloat(variant.sale_price.toFixed(1)),
                                        priceCurrency: 'TWD',
                                        availability: 'http://schema.org/InStock',
                                    },
                                    image: preview_image,
                                    isRelatedTo: relative_product.data.map(function (dd) {
                                        return {
                                            '@type': 'Product',
                                            name: dd.content.title,
                                            offers: { '@type': 'Offer', price: parseFloat(dd.content.min_price.toFixed(1)), priceCurrency: 'TWD' },
                                        };
                                    }),
                                }))];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // 網誌頁面SEO
    SeoConfig.articleSeo = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var query, article;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        cf.article = cf.article || cf.page.split('/')[1];
                        query = ["(content->>'$.type'='article')", "(content->>'$.tag'='".concat(cf.article, "')")];
                        return [4 /*yield*/, new ut_database_js_1.UtDatabase(cf.appName, "t_manager_post").querySql(query, {
                                page: 0,
                                limit: 1,
                            })];
                    case 1:
                        article = _c.sent();
                        cf.data.page_config = (_a = cf.data.page_config) !== null && _a !== void 0 ? _a : {};
                        cf.data.page_config.seo = (_b = cf.data.page_config.seo) !== null && _b !== void 0 ? _b : {};
                        if (article.data[0]) {
                            cf.data.tag = cf.page;
                            if (article.data[0].content.language_data && article.data[0].content.language_data[cf.language]) {
                                cf.data.page_config.seo.title = article.data[0].content.language_data[cf.language].seo.title;
                                cf.data.page_config.seo.content = article.data[0].content.language_data[cf.language].seo.content;
                                cf.data.page_config.seo.keywords = article.data[0].content.language_data[cf.language].seo.keywords;
                                cf.data.page_config.seo.image = article.data[0].content.language_data[cf.language].seo.image;
                            }
                            else {
                                cf.data.page_config.seo.title = article.data[0].content.seo.title;
                                cf.data.page_config.seo.content = article.data[0].content.seo.content;
                                cf.data.page_config.seo.keywords = article.data[0].content.seo.keywords;
                                cf.data.page_config.seo.image = article.data[0].content.seo.image;
                            }
                        }
                        cf.data.page_config.seo.image = cf.data.page_config.seo.image || article.data[0].content.preview_image;
                        console.log("cf.data.page_config.seo==>", article.data[0].content);
                        return [2 /*return*/, cf.data.page_config.seo];
                }
            });
        });
    };
    // 取得多國語言
    SeoConfig.language = function (store_info, req) {
        return __awaiter(this, void 0, void 0, function () {
            function checkIncludes(lan) {
                return store_info.language_setting.support.includes(lan);
            }
            function checkEqual(lan) {
                return "".concat(req.query.page).startsWith("".concat(lan, "/")) || req.query.page === lan;
            }
            function replace(lan) {
                if (req.query.page === lan) {
                    req.query.page = '';
                }
                else {
                    req.query.page = "".concat(req.query.page).replace(lan + '/', '');
                }
            }
            return __generator(this, function (_a) {
                if (checkEqual('en') && checkIncludes('en-US')) {
                    replace('en');
                    return [2 /*return*/, "en-US"];
                }
                else if (checkEqual('cn') && checkIncludes('zh-CN')) {
                    replace('cn');
                    return [2 /*return*/, "zh-CN"];
                }
                else if (checkEqual('tw') && checkIncludes('zh-TW')) {
                    replace('tw');
                    return [2 /*return*/, "zh-TW"];
                }
                else {
                    return [2 /*return*/, store_info.language_setting.def];
                }
                return [2 /*return*/];
            });
        });
    };
    // FB像素
    SeoConfig.fbCode = function (FBCode) {
        return FBCode && FBCode.pixel
            ? html(templateObject_5 || (templateObject_5 = __makeTemplateObject(["<!-- Meta Pixel Code -->\n          <script>\n            !(function (f, b, e, v, n, t, s) {\n              if (f.fbq) return;\n              n = f.fbq = function () {\n                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);\n              };\n              if (!f._fbq) f._fbq = n;\n              n.push = n;\n              n.loaded = !0;\n              n.version = '2.0';\n              n.queue = [];\n              t = b.createElement(e);\n              t.async = !0;\n              t.src = v;\n              s = b.getElementsByTagName(e)[0];\n              s.parentNode.insertBefore(t, s);\n            })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');\n            fbq('init', '", "');\n            fbq('track', 'PageView');\n          </script>\n          <noscript\n            ><img\n              height=\"1\"\n              width=\"1\"\n              style=\"display:none\"\n              src=\"https://www.facebook.com/tr?id=617830100580621&ev=PageView&noscript=1\"\n            />\n          </noscript>\n          <!-- End Meta Pixel Code -->"], ["<!-- Meta Pixel Code -->\n          <script>\n            !(function (f, b, e, v, n, t, s) {\n              if (f.fbq) return;\n              n = f.fbq = function () {\n                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);\n              };\n              if (!f._fbq) f._fbq = n;\n              n.push = n;\n              n.loaded = !0;\n              n.version = '2.0';\n              n.queue = [];\n              t = b.createElement(e);\n              t.async = !0;\n              t.src = v;\n              s = b.getElementsByTagName(e)[0];\n              s.parentNode.insertBefore(t, s);\n            })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');\n            fbq('init', '", "');\n            fbq('track', 'PageView');\n          </script>\n          <noscript\n            ><img\n              height=\"1\"\n              width=\"1\"\n              style=\"display:none\"\n              src=\"https://www.facebook.com/tr?id=617830100580621&ev=PageView&noscript=1\"\n            />\n          </noscript>\n          <!-- End Meta Pixel Code -->"])), FBCode.pixel) : '';
    };
    // GA標籤
    SeoConfig.gTag = function (g_tag) {
        return (g_tag || [])
            .map(function (dd) {
            return html(templateObject_6 || (templateObject_6 = __makeTemplateObject(["<!-- Google tag (gtag.js) -->\n          <!-- Google Tag Manager -->\n          <script>\n            (function (w, d, s, l, i) {\n              w[l] = w[l] || [];\n              w[l].push({\n                'gtm.start': new Date().getTime(),\n                event: 'gtm.js',\n              });\n              var f = d.getElementsByTagName(s)[0],\n                j = d.createElement(s),\n                dl = l != 'dataLayer' ? '&l=' + l : '';\n              j.async = true;\n              j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;\n              f.parentNode.insertBefore(j, f);\n            })(window, document, 'script', 'dataLayer', '", "');\n          </script>\n          <!-- End Google Tag Manager -->"], ["<!-- Google tag (gtag.js) -->\n          <!-- Google Tag Manager -->\n          <script>\n            (function (w, d, s, l, i) {\n              w[l] = w[l] || [];\n              w[l].push({\n                'gtm.start': new Date().getTime(),\n                event: 'gtm.js',\n              });\n              var f = d.getElementsByTagName(s)[0],\n                j = d.createElement(s),\n                dl = l != 'dataLayer' ? '&l=' + l : '';\n              j.async = true;\n              j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;\n              f.parentNode.insertBefore(j, f);\n            })(window, document, 'script', 'dataLayer', '", "');\n          </script>\n          <!-- End Google Tag Manager -->"])), dd.code);
        })
            .join('');
    };
    // GA追蹤
    SeoConfig.gA4 = function (ga4) {
        return (ga4 || [])
            .map(function (dd) {
            return html(templateObject_7 || (templateObject_7 = __makeTemplateObject(["<!-- Google tag (gtag.js) -->\n          <script async src=\"https://www.googletagmanager.com/gtag/js?id=", "\"></script>\n          <script>\n            window.dataLayer = window.dataLayer || [];\n\n            function gtag() {\n              dataLayer.push(arguments);\n            }\n\n            gtag('js', new Date());\n\n            gtag('config', '", "');\n          </script>"], ["<!-- Google tag (gtag.js) -->\n          <script async src=\"https://www.googletagmanager.com/gtag/js?id=", "\"></script>\n          <script>\n            window.dataLayer = window.dataLayer || [];\n\n            function gtag() {\n              dataLayer.push(arguments);\n            }\n\n            gtag('js', new Date());\n\n            gtag('config', '", "');\n          </script>"])), dd.code, dd.code);
        })
            .join('');
    };
    // 編輯器的SEO
    SeoConfig.editorSeo = html(templateObject_8 || (templateObject_8 = __makeTemplateObject(["<title>SHOPNEX\u5F8C\u53F0\u7CFB\u7D71</title>\n    <link rel=\"canonical\" href=\"/index\" />\n    <meta name=\"keywords\" content=\"SHOPNEX,\u96FB\u5546\u5E73\u53F0\" />\n    <link\n      id=\"appImage\"\n      rel=\"shortcut icon\"\n      href=\"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png\"\n      type=\"image/x-icon\"\n    />\n    <link\n      rel=\"icon\"\n      href=\"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png\"\n      type=\"image/png\"\n      sizes=\"128x128\"\n    />\n    <meta\n      property=\"og:image\"\n      content=\"https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1718778766524-shopnex_banner.jpg\"\n    />\n    <meta property=\"og:title\" content=\"SHOPNEX\u5F8C\u53F0\u7CFB\u7D71\" />\n    <meta\n      name=\"description\"\n      content=\"SHOPNEX\u96FB\u5546\u958B\u5E97\u5E73\u53F0\uFF0C\u96F6\u62BD\u6210\u3001\u514D\u624B\u7E8C\u8CBB\u3002\u63D0\u4F9B\u7CBE\u7F8E\u6A21\u677F\u548C\u8C50\u5BCC\u63D2\u4EF6\uFF0C\u64CD\u4F5C\u7C21\u55AE\uFF0C3\u5206\u9418\u5167\u5FEB\u901F\u6253\u9020\u5C08\u5C6C\u5546\u5E97\u3002\u8CFC\u7269\u8ECA\u3001\u91D1\u7269\u6D41\u3001SEO\u884C\u92B7\u3001\u8CC7\u6599\u5206\u6790\u4E00\u7AD9\u641E\u5B9A\u3002\u652F\u63F4APP\u4E0A\u67B6\uFF0C\u4E26\u63D0\u4F9B100%\u5BA2\u88FD\u5316\u8A2D\u8A08\uFF0C\u7ACB\u5373\u514D\u8CBB\u9AD4\u9A5730\u5929\u3002\"\n    />\n    <meta\n      name=\"og:description\"\n      content=\"SHOPNEX\u96FB\u5546\u958B\u5E97\u5E73\u53F0\uFF0C\u96F6\u62BD\u6210\u3001\u514D\u624B\u7E8C\u8CBB\u3002\u63D0\u4F9B\u7CBE\u7F8E\u6A21\u677F\u548C\u8C50\u5BCC\u63D2\u4EF6\uFF0C\u64CD\u4F5C\u7C21\u55AE\uFF0C3\u5206\u9418\u5167\u5FEB\u901F\u6253\u9020\u5C08\u5C6C\u5546\u5E97\u3002\u8CFC\u7269\u8ECA\u3001\u91D1\u7269\u6D41\u3001SEO\u884C\u92B7\u3001\u8CC7\u6599\u5206\u6790\u4E00\u7AD9\u641E\u5B9A\u3002\u652F\u63F4APP\u4E0A\u67B6\uFF0C\u4E26\u63D0\u4F9B100%\u5BA2\u88FD\u5316\u8A2D\u8A08\uFF0C\u7ACB\u5373\u514D\u8CBB\u9AD4\u9A5730\u5929\u3002\"\n    />"], ["<title>SHOPNEX\u5F8C\u53F0\u7CFB\u7D71</title>\n    <link rel=\"canonical\" href=\"/index\" />\n    <meta name=\"keywords\" content=\"SHOPNEX,\u96FB\u5546\u5E73\u53F0\" />\n    <link\n      id=\"appImage\"\n      rel=\"shortcut icon\"\n      href=\"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png\"\n      type=\"image/x-icon\"\n    />\n    <link\n      rel=\"icon\"\n      href=\"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png\"\n      type=\"image/png\"\n      sizes=\"128x128\"\n    />\n    <meta\n      property=\"og:image\"\n      content=\"https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1718778766524-shopnex_banner.jpg\"\n    />\n    <meta property=\"og:title\" content=\"SHOPNEX\u5F8C\u53F0\u7CFB\u7D71\" />\n    <meta\n      name=\"description\"\n      content=\"SHOPNEX\u96FB\u5546\u958B\u5E97\u5E73\u53F0\uFF0C\u96F6\u62BD\u6210\u3001\u514D\u624B\u7E8C\u8CBB\u3002\u63D0\u4F9B\u7CBE\u7F8E\u6A21\u677F\u548C\u8C50\u5BCC\u63D2\u4EF6\uFF0C\u64CD\u4F5C\u7C21\u55AE\uFF0C3\u5206\u9418\u5167\u5FEB\u901F\u6253\u9020\u5C08\u5C6C\u5546\u5E97\u3002\u8CFC\u7269\u8ECA\u3001\u91D1\u7269\u6D41\u3001SEO\u884C\u92B7\u3001\u8CC7\u6599\u5206\u6790\u4E00\u7AD9\u641E\u5B9A\u3002\u652F\u63F4APP\u4E0A\u67B6\uFF0C\u4E26\u63D0\u4F9B100%\u5BA2\u88FD\u5316\u8A2D\u8A08\uFF0C\u7ACB\u5373\u514D\u8CBB\u9AD4\u9A5730\u5929\u3002\"\n    />\n    <meta\n      name=\"og:description\"\n      content=\"SHOPNEX\u96FB\u5546\u958B\u5E97\u5E73\u53F0\uFF0C\u96F6\u62BD\u6210\u3001\u514D\u624B\u7E8C\u8CBB\u3002\u63D0\u4F9B\u7CBE\u7F8E\u6A21\u677F\u548C\u8C50\u5BCC\u63D2\u4EF6\uFF0C\u64CD\u4F5C\u7C21\u55AE\uFF0C3\u5206\u9418\u5167\u5FEB\u901F\u6253\u9020\u5C08\u5C6C\u5546\u5E97\u3002\u8CFC\u7269\u8ECA\u3001\u91D1\u7269\u6D41\u3001SEO\u884C\u92B7\u3001\u8CC7\u6599\u5206\u6790\u4E00\u7AD9\u641E\u5B9A\u3002\u652F\u63F4APP\u4E0A\u67B6\uFF0C\u4E26\u63D0\u4F9B100%\u5BA2\u88FD\u5316\u8A2D\u8A08\uFF0C\u7ACB\u5373\u514D\u8CBB\u9AD4\u9A5730\u5929\u3002\"\n    />"])));
    return SeoConfig;
}());
exports.SeoConfig = SeoConfig;
function extractCols(data) {
    var items = [];
    var updated_at = new Date(data.updated_at).toISOString().replace(/\.\d{3}Z$/, '+00:00');
    data.value.map(function (item) {
        items.push(__assign(__assign({}, item), { updated_at: updated_at }));
        if (item.array && item.array.length > 0) {
            items = items.concat(extractCols({
                value: item.array,
                updated_at: data.updated_at,
            }));
        }
    });
    return items;
}
exports.extractCols = extractCols;
function extractProds(data) {
    var items = [];
    data.map(function (item) {
        var updated_at = new Date(item.updated_time).toISOString().replace(/\.\d{3}Z$/, '+00:00');
        items.push({ items: items });
    });
    return items;
}
exports.extractProds = extractProds;
// 判斷現在時間是否在 start 和 end 之間的函數
function isCurrentTimeWithinRange(data) {
    var now = new Date();
    now.setTime(now.getTime() + 8 * 3600 * 1000);
    // 組合 start 的完整日期時間
    var startDateTime = new Date("".concat(data.startDate, "T").concat(data.startTime));
    // 若 endDate 或 endTime 為 undefined，視為無期限
    var hasEnd = data.endDate && data.endTime;
    var endDateTime = hasEnd ? new Date("".concat(data.endDate, "T").concat(data.endTime)) : null;
    // 判斷現在時間是否在範圍內
    if (hasEnd) {
        return now >= startDateTime && now <= endDateTime;
    }
    else {
        return now >= startDateTime;
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;

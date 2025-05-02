"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoConfig = void 0;
exports.extractCols = extractCols;
exports.extractProds = extractProds;
const database_js_1 = __importDefault(require("./modules/database.js"));
const manager_js_1 = require("./api-public/services/manager.js");
const ut_database_js_1 = require("./api-public/utils/ut-database.js");
const shopping_js_1 = require("./api-public/services/shopping.js");
const config_js_1 = require("./config.js");
const public_table_check_js_1 = require("./api-public/services/public-table-check.js");
const app_js_1 = require("./services/app.js");
const user_js_1 = require("./api-public/services/user.js");
const monitor_js_1 = require("./api-public/services/monitor.js");
const seo_js_1 = require("./services/seo.js");
const Language_js_1 = require("./Language.js");
const private_config_js_1 = require("./services/private_config.js");
const html = String.raw;
class SeoConfig {
    static async collectionSeo(cf) {
        var _a;
        const cols = (_a = (await manager_js_1.Manager.getConfig({
            appName: cf.appName,
            key: 'collection',
            language: cf.language,
        }))[0]) !== null && _a !== void 0 ? _a : {};
        const colJson = extractCols(cols);
        const urlCode = decodeURI(cf.page.split('/')[1]);
        console.log(`urlCode===>`, urlCode);
        const colData = colJson.find((item) => {
            console.log(`item==>`, item);
            if (item.language_data && item.language_data[cf.language]) {
                return item.language_data[cf.language].seo.domain === urlCode || item.title === urlCode;
            }
            else {
                return item.code === urlCode || item.title === urlCode;
            }
        });
        console.log(`colData===>`, colData);
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
    }
    static async distributionSEO(cf) {
        var _a, _b;
        const redURL = new URL(cf.url.includes('http') ? cf.url : `https://127.0.0.1${cf.url}`);
        console.log(`redURL:${redURL.href}`);
        const rec = await database_js_1.default.query(`SELECT *
       FROM \`${cf.appName}\`.t_recommend_links
       WHERE content ->>'$.link' = ?;
      `, [cf.page.split('/')[1]]);
        const page = rec[0] && rec[0].content ? rec[0].content : { status: false };
        if (page.status && isCurrentTimeWithinRange(page)) {
            let query = [`(content->>'$.type'='article')`, `(content->>'$.tag'='${page.redirect.split('/')[2]}')`];
            const article = await new ut_database_js_1.UtDatabase(cf.appName, `t_manager_post`).querySql(query, {
                page: 0,
                limit: 1,
            });
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
            console.log(`cf.link_prefix=>`, cf.link_prefix);
            console.log(`page.redirect=>`, page.redirect);
            console.log(`redURL.search=>`, redURL.search);
            if (page.redirect.includes('?')) {
                if (redURL.search.includes('?')) {
                    redURL.search += `&${page.redirect.split('?')[1]}`;
                }
                else {
                    redURL.search += `?${page.redirect.split('?')[1]}`;
                }
                page.redirect = page.redirect.split('?')[0];
            }
            return html `localStorage.setItem('distributionCode','${page.code}'); location.href =
      '${cf.link_prefix ? `/` : ``}${cf.link_prefix}${page.redirect}${redURL.search}'; `;
        }
        else {
            return html `location.href = '/';`;
        }
    }
    static async productSEO(cf) {
        var _a, _b, _c, _d, _e;
        const product_domain = cf.page.split('/')[1];
        const pd = await new shopping_js_1.Shopping(cf.appName, undefined).getProduct(product_domain
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
            });
        if (pd.data.content) {
            pd.data.content.language_data = (_a = pd.data.content.language_data) !== null && _a !== void 0 ? _a : {};
            const productSeo = (pd.data.content.language_data[cf.language] && pd.data.content.language_data[cf.language].seo) ||
                ((_b = pd.data.content.seo) !== null && _b !== void 0 ? _b : {});
            const language_data = pd.data.content.language_data;
            cf.data.page_config = (_c = cf.data.page_config) !== null && _c !== void 0 ? _c : {};
            cf.data.page_config.seo = (_d = cf.data.page_config.seo) !== null && _d !== void 0 ? _d : {};
            cf.data.page_config.seo.title = productSeo.title || pd.data.content.title;
            cf.data.page_config.seo.image =
                (language_data &&
                    language_data[cf.language] &&
                    language_data.preview_image &&
                    language_data.preview_image[0]) ||
                    pd.data.content.preview_image[0];
            cf.data.page_config.seo.content = productSeo.content;
            cf.data.tag = cf.page;
            cf.data.page_config.seo.code =
                ((_e = cf.data.page_config.seo.code) !== null && _e !== void 0 ? _e : '') + (await this.getProductJsonLd(cf.appName, pd.data.content));
        }
    }
    static async getProductJsonLd(app_name, pd_content) {
        var _a;
        if (!pd_content || !Array.isArray(pd_content.relative_product) || pd_content.relative_product.length === 0) {
            return '';
        }
        const relative_product = await new shopping_js_1.Shopping(app_name, undefined).getProduct({
            page: 0,
            limit: 100,
            id_list: [-99].concat((_a = pd_content.relative_product) !== null && _a !== void 0 ? _a : []).join(','),
        });
        if (pd_content.product_category === 'kitchen') {
            const spec = pd_content.specs.find((dd) => dd.option.length);
            let preview_image = pd_content.preview_image.filter((dd) => dd);
            return html ` <script type="application/ld+json">
        ${JSON.stringify({
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
                isRelatedTo: relative_product.data.map((dd) => {
                    return {
                        '@type': 'Product',
                        name: dd.content.title,
                        offers: { '@type': 'Offer', price: parseFloat(dd.content.min_price.toFixed(1)), priceCurrency: 'TWD' },
                    };
                }),
            })}
      </script>`;
        }
        else {
            const variant = pd_content.variants[0];
            let preview_image = [variant ? variant.preview_image : []].concat(pd_content.preview_image).filter(dd => dd);
            return html ` <script type="application/ld+json">
        ${JSON.stringify({
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
                isRelatedTo: relative_product.data.map((dd) => {
                    return {
                        '@type': 'Product',
                        name: dd.content.title,
                        offers: { '@type': 'Offer', price: parseFloat(dd.content.min_price.toFixed(1)), priceCurrency: 'TWD' },
                    };
                }),
            })}
      </script>`;
        }
    }
    static async articleSeo(cf) {
        var _a, _b;
        cf.article = cf.article || cf.page.split('/')[1];
        let query = [`(content->>'$.type'='article')`, `(content->>'$.tag'='${cf.article}')`];
        const article = await new ut_database_js_1.UtDatabase(cf.appName, `t_manager_post`).querySql(query, {
            page: 0,
            limit: 1,
        });
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
        console.log(`cf.data.page_config.seo==>`, article.data[0].content);
        return cf.data.page_config.seo;
    }
    static async language(store_info, req) {
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
    }
    static fbCode(FBCode) {
        return FBCode && FBCode.pixel
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
          <noscript
            ><img
              height="1"
              width="1"
              style="display:none"
              src="https://www.facebook.com/tr?id=617830100580621&ev=PageView&noscript=1"
            />
          </noscript>
          <!-- End Meta Pixel Code -->`
            : '';
    }
    static gTag(g_tag) {
        return (g_tag || [])
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
            .join('');
    }
    static gA4(ga4) {
        return (ga4 || [])
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
            .join('');
    }
    static async seoDetail(in_app, req, resp) {
        var _a, _b, _c, _d, _e, _f;
        const og_url = req.headers['x-original-url'];
        try {
            if (req.query.state === 'google_login') {
                req.query.page = 'login';
            }
            let appName = in_app;
            if (req.query.appName) {
                appName = req.query.appName;
            }
            else if (og_url) {
                const new_app = (await database_js_1.default.query(`SELECT *
                   FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
                   where LOWER(domain) = ?`, [og_url]))[0];
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
            await public_table_check_js_1.ApiPublic.createScheme(appName);
            const find_app = public_table_check_js_1.ApiPublic.app301.find(dd => {
                return dd.app_name === appName;
            });
            if (find_app) {
                const router = find_app.router.find(dd => {
                    if (dd.legacy_url.startsWith('/')) {
                        dd.legacy_url = dd.legacy_url.substring(1);
                    }
                    if (dd.new_url.startsWith('/')) {
                        dd.new_url = dd.new_url.substring(1);
                    }
                    return dd.legacy_url === req.query.page;
                });
                if (router) {
                    return {
                        redirect: `https://${(await app_js_1.App.checkBrandAndMemberType(appName)).domain}/${router.new_url}`,
                    };
                }
            }
            let seo_content = [];
            let [customCode, FBCode, store_info, language_label, check_schema, brandAndMemberType, login_config, ip_country,] = await Promise.all([
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
            const language = await SeoConfig.language(store_info, req);
            monitor_js_1.Monitor.insertHistory({
                req_type: 'file',
                req: req,
            });
            console.log(`app_info==>`, {
                page: req.query.page,
                appName: appName
            });
            let data = await seo_js_1.Seo.getPageInfo(appName, req.query.page, language);
            let home_page_data = await (async () => {
                return await seo_js_1.Seo.getPageInfo(appName, 'index', language);
            })();
            if (`${req.query.page}`.startsWith('products/') && !data) {
                data = home_page_data;
            }
            if (data && data.page_config) {
                data.page_config = (_a = data.page_config) !== null && _a !== void 0 ? _a : {};
                const d = (_b = data.page_config.seo) !== null && _b !== void 0 ? _b : {};
                if (`${req.query.page}`.startsWith('products/')) {
                    await SeoConfig.productSEO({
                        data,
                        language,
                        appName,
                        product_id: req.query.product_id,
                        page: req.query.page,
                    });
                }
                else if (`${req.query.page}` === 'blogs') {
                    const seo = await new user_js_1.User(req.get('g-app'), req.body.token).getConfigV2({
                        key: 'article_seo_data_' + language,
                        user_id: 'manager',
                    });
                    data.page_config.seo.title = seo.title || data.page_config.seo.title;
                    data.page_config.seo.content = seo.content || data.page_config.seo.content;
                    data.page_config.seo.keywords = seo.keywords || data.page_config.seo.keywords;
                    data.page_config.seo.image = seo.image || data.page_config.seo.image;
                    data.page_config.seo.logo = seo.logo || data.page_config.seo.logo;
                }
                else if (`${req.query.page}`.startsWith('blogs/')) {
                    data.page_config.seo = await SeoConfig.articleSeo({
                        article: req.query.article,
                        page: req.query.page,
                        language,
                        appName,
                        data,
                    });
                }
                else if (`${req.query.page}`.startsWith('pages/')) {
                    await SeoConfig.articleSeo({
                        article: req.query.article,
                        page: req.query.page,
                        language,
                        appName,
                        data,
                    });
                }
                else if (['privacy', 'term', 'refund', 'delivery'].includes(`${req.query.page}`)) {
                    data.page_config.seo = {
                        title: Language_js_1.Language.text(`${req.query.page}`, language),
                        content: Language_js_1.Language.text(`${req.query.page}`, language),
                    };
                }
                else if (d.type !== 'custom') {
                    data = home_page_data;
                }
                const preload = req.query.isIframe === 'true'
                    ? {}
                    : await app_js_1.App.preloadPageData(appName, req.query.page, language);
                data.page_config = (_c = data.page_config) !== null && _c !== void 0 ? _c : {};
                data.page_config.seo = (_d = data.page_config.seo) !== null && _d !== void 0 ? _d : {};
                const seo_detail = await getSeoDetail(appName, req);
                if (seo_detail) {
                    Object.keys(seo_detail).map(dd => {
                        data.page_config.seo[dd] = seo_detail[dd];
                    });
                }
                let link_prefix = req.originalUrl.split('/')[1];
                if (link_prefix.includes('?')) {
                    link_prefix = link_prefix.substring(0, link_prefix.indexOf('?'));
                }
                if (config_js_1.ConfigSetting.is_local) {
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
                console.log(`req.query.page`, req.query.page);
                if (req.query.page.split('/')[0] === 'distribution' &&
                    req.query.page.split('/')[1]) {
                    distribution_code = await SeoConfig.distributionSEO({
                        appName: appName,
                        url: req.url,
                        page: req.query.page,
                        link_prefix: link_prefix,
                        data,
                        language,
                    });
                }
                if (req.query.page.split('/')[0] === 'collections' &&
                    req.query.page.split('/')[1]) {
                    await SeoConfig.collectionSeo({ appName, language, data, page: req.query.page });
                }
                if (FBCode) {
                    if (!(req.headers['user-agent'].includes('iosGlitter') && !(req.headers['user-agent'].includes('allow_track')))) {
                        seo_content.push(SeoConfig.fbCode(FBCode));
                    }
                }
                const home_seo = home_page_data.page_config.seo || {};
                const seo = data.page_config.seo;
                const head = [
                    (() => {
                        var _a;
                        return html `
                    ${(() => {
                            var _a, _b, _c;
                            if (req.query.type === 'editor') {
                                return SeoConfig.editorSeo;
                            }
                            else {
                                const d = seo;
                                return html `<title>
                            ${[home_seo.title_prefix || '', d.title || '', home_seo.title_suffix || ''].join('') ||
                                    '尚未設定標題'}
                          </title>
                          <link
                            rel="canonical"
                            href="${(() => {
                                    if (data.tag === 'index') {
                                        return `https://${brandAndMemberType.domain}`;
                                    }
                                    else if (req.query.page === 'blogs') {
                                        return `https://${brandAndMemberType.domain}/blogs`;
                                    }
                                    {
                                        return `https://${brandAndMemberType.domain}/${data.tag}`;
                                    }
                                })()}"
                          />
                          ${((data.tag !== req.query.page || req.query.page === 'index-mobile') && req.query.page !== 'blogs')
                                    ? `<meta name="robots" content="noindex">`
                                    : `<meta name="robots" content="index, follow"/>`}
                          <meta name="keywords" content="${(d.keywords || '尚未設定關鍵字').replace(/"/g, '&quot;')}" />
                          <link
                            id="appImage"
                            rel="shortcut icon"
                            href="${d.logo || home_seo.logo || ''}"
                            type="image/x-icon"
                          />
                          <link rel="icon" href="${d.logo || home_seo.logo || ''}" type="image/png" sizes="128x128" />
                          <meta property="og:image" content="${d.image || home_seo.image || ''}" />
                          <meta
                            property="og:title"
                            content="${((_a = d.title) !== null && _a !== void 0 ? _a : '').replace(/\n/g, '').replace(/"/g, '&quot;')}"
                          />
                          <meta
                            name="description"
                            content="${((_b = d.content) !== null && _b !== void 0 ? _b : '').replace(/\n/g, '').replace(/"/g, '&quot;')}"
                          />
                          <meta
                            name="og:description"
                            content="${((_c = d.content) !== null && _c !== void 0 ? _c : '').replace(/\n/g, '').replace(/"/g, '&quot;')}"
                          />

                          ${[{ src: 'css/front-end.css', type: 'text/css' }]
                                    .map(dd => {
                                    return html `
                              <link href="/${link_prefix && `${link_prefix}/`}${dd.src}" type="${dd.type}"
                                    rel="stylesheet"></link>`;
                                })
                                    .join('')} `;
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
                    })(),
                    `<script>
                                ${[
                        (_e = (req.query.type !== 'editor' && d.custom_script)) !== null && _e !== void 0 ? _e : '',
                        `window.login_config = ${JSON.stringify(login_config)};`,
                        `window.appName = '${appName}';`,
                        `window.glitterBase = '${brandAndMemberType.brand}';`,
                        `window.memberType = '${brandAndMemberType.memberType}';`,
                        `window.glitterBackend = '${config_js_1.config.domain}';`,
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
                        `window.home_seo=${JSON.stringify(home_seo)
                            .replace(/<\/script>/g, 'sdjuescript_prepand')
                            .replace(/<script>/g, 'sdjuescript_prefix')};`,
                    ]
                        .map(dd => {
                        return (dd || '').trim();
                    })
                        .filter(dd => {
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
                        .map(dd => {
                        return html ` <script
                                  src="/${link_prefix && `${link_prefix}/`}${dd.src}"
                                  type="${dd.type}"
                                ></script>`;
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
                            if (req.headers['user-agent'].includes('iosGlitter') && !(req.headers['user-agent'].includes('allow_track'))) {
                                customCode.ga4 = [];
                                customCode.g_tag = [];
                            }
                            return html `
                                  ${SeoConfig.gA4(customCode.ga4)} ${SeoConfig.gTag(customCode.g_tag)}
                                  ${seo_content
                                .map(dd => {
                                return dd.trim();
                            })
                                .join('\n')}
                                `;
                        }
                    })()}

`
                ].join('');
                return {
                    head: head,
                    body: ``,
                    seo_detail: seo
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
    }
}
exports.SeoConfig = SeoConfig;
SeoConfig.editorSeo = html `<title>SHOPNEX後台系統</title>
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
    <meta
      property="og:image"
      content="https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1718778766524-shopnex_banner.jpg"
    />
    <meta property="og:title" content="SHOPNEX後台系統" />
    <meta
      name="description"
      content="SHOPNEX電商開店平台，零抽成、免手續費。提供精美模板和豐富插件，操作簡單，3分鐘內快速打造專屬商店。購物車、金物流、SEO行銷、資料分析一站搞定。支援APP上架，並提供100%客製化設計，立即免費體驗30天。"
    />
    <meta
      name="og:description"
      content="SHOPNEX電商開店平台，零抽成、免手續費。提供精美模板和豐富插件，操作簡單，3分鐘內快速打造專屬商店。購物車、金物流、SEO行銷、資料分析一站搞定。支援APP上架，並提供100%客製化設計，立即免費體驗30天。"
    />`;
function extractCols(data) {
    let items = [];
    const updated_at = new Date(data.updated_at).toISOString().replace(/\.\d{3}Z$/, '+00:00');
    data.value.map((item) => {
        items.push(Object.assign(Object.assign({}, item), { updated_at }));
        if (item.array && item.array.length > 0) {
            items = items.concat(extractCols({
                value: item.array,
                updated_at: data.updated_at,
            }));
        }
    });
    return items;
}
function extractProds(data) {
    const items = [];
    data.map((item) => {
        const updated_at = new Date(item.updated_time).toISOString().replace(/\.\d{3}Z$/, '+00:00');
        items.push({ items });
    });
    return items;
}
function isCurrentTimeWithinRange(data) {
    const now = new Date();
    now.setTime(now.getTime() + 8 * 3600 * 1000);
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
async function getSeoDetail(appName, req) {
    const sqlData = await private_config_js_1.Private_config.getConfig({
        appName: appName,
        key: 'seo_webhook',
    });
    if (!sqlData[0] || !sqlData[0].value) {
        return undefined;
    }
    const html = String.raw;
    return await database_js_1.default.queryLambada({
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
            .map(d2 => {
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
//# sourceMappingURL=seo-config.js.map
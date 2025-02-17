import {Manager} from "./api-public/services/manager.js";
import db from "./modules/database.js";
import {UtDatabase} from "./api-public/utils/ut-database.js";
import {Seo} from "./services/seo.js";
import {Shopping} from "./api-public/services/shopping.js";

const html = String.raw

export class SeoConfig {
    //編輯器的SEO
    public static editorSeo = html`<title>SHOPNEX後台系統</title>
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
    />`

    //分類頁的SEO
    public static async collectionSeo(cf: {
        appName: string,
        language: string,
        data: any,
        page: string
    }) {
        const cols =
            (
                await Manager.getConfig({
                    appName: cf.appName,
                    key: 'collection',
                    language: cf.language as any,
                })
            )[0] ?? {};
        const colJson = extractCols(cols);
        const urlCode = decodeURI((cf.page as string).split('/')[1]);
        console.log(`urlCode===>`, urlCode)
        const colData = colJson.find((item: any) => {
            console.log(`item==>`, item)
            if (item.language_data && item.language_data[cf.language]) {
                return item.language_data[cf.language].seo.domain === urlCode || item.title === urlCode
            } else {
                return (item.code === urlCode) || item.title === urlCode;
            }
        });
        console.log(`colData===>`, colData)
        if (colData) {
            if (colData.language_data && colData.language_data[cf.language]) {
                cf.data.page_config.seo.title = colData.language_data[cf.language].seo.title || urlCode;
                cf.data.page_config.seo.content = colData.language_data[cf.language].seo.content;
                cf.data.tag = cf.page
            } else {
                cf.data.page_config.seo.title = colData.seo_title || urlCode;
                cf.data.page_config.seo.content = colData.seo_content;
                cf.data.page_config.seo.keywords = colData.seo_keywords;
                cf.data.tag = cf.page
            }
            cf.data.page_config.seo.image = colData.seo_image;
        }
    }

    //分銷連結的SEO
    public static async distributionSEO(cf: {
        appName: string,
        page: string,
        url: string,
        link_prefix: string,
        data: any,
        language: string
    }) {
        const redURL = new URL(`https://127.0.0.1${cf.url}`);
        const rec = await db.query(
            `SELECT *
             FROM \`${cf.appName}\`.t_recommend_links
             WHERE content ->>'$.link' = ?;
            `,
            [(cf.page as string).split('/')[1]]
        );
        const page = rec[0] && rec[0].content ? rec[0].content : {status: false};
        if (page.status && isCurrentTimeWithinRange(page)) {
            let query = [`(content->>'$.type'='article')`, `(content->>'$.tag'='${page.redirect.split('/')[2]}')`];
            const article: any = await new UtDatabase(cf.appName, `t_manager_post`).querySql(query, {
                page: 0,
                limit: 1,
            });
            cf.data.page_config = cf.data.page_config ?? {};
            cf.data.page_config.seo = cf.data.page_config.seo ?? {};
            if (article.data[0]) {
                if (article.data[0].content.language_data[cf.language]) {
                    cf.data.page_config.seo.title = article.data[0].content.language_data[cf.language].seo.title;
                    cf.data.page_config.seo.content = article.data[0].content.language_data[cf.language].seo.content;
                    cf.data.page_config.seo.keywords = article.data[0].content.language_data[cf.language].seo.keywords;
                } else {
                    cf.data.page_config.seo.title = article.data[0].content.seo.title;
                    cf.data.page_config.seo.content = article.data[0].content.seo.content;
                    cf.data.page_config.seo.keywords = article.data[0].content.seo.keywords;
                }

            }
            return html`localStorage.setItem('distributionCode','${page.code}');
            location.href = '${cf.link_prefix ? `/` : ``}${cf.link_prefix}${page.redirect}${redURL.search}';
            `;
        } else {
            return html`location.href = '/';`;
        }
    }

    //商品頁面SEO
    public static async productSEO(cf: {
        data: any,
        language: any,
        appName: string,
        product_id: string,
        page: string
    }) {
        const product_domain = (cf.page as string).split('/')[1];
        const pd = await new Shopping(cf.appName, undefined).getProduct(
            product_domain
                ? {
                    page: 0,
                    limit: 1,
                    domain: decodeURIComponent(product_domain),
                    language: cf.language,
                }
                : {
                    page: 0,
                    limit: 1,
                    id: cf.product_id as string,
                    language: cf.language,
                }
        );
        if (pd.data.content) {
            pd.data.content.language_data = pd.data.content.language_data ?? {};
            const productSeo = (pd.data.content.language_data[cf.language] && pd.data.content.language_data[cf.language].seo) || (pd.data.content.seo ?? {});
            const language_data = pd.data.content.language_data
            cf.data.page_config = cf.data.page_config ?? {};
            cf.data.page_config.seo = cf.data.page_config.seo ?? {};
            cf.data.page_config.seo.title = productSeo.title || pd.data.content.title;
            cf.data.page_config.seo.image = (language_data && language_data[cf.language] && language_data.preview_image && language_data.preview_image[0]) || pd.data.content.preview_image[0];
            cf.data.page_config.seo.content = productSeo.content;
            cf.data.tag = cf.page;

            cf.data.page_config.seo.code = (cf.data.page_config.seo.code ?? "") + (await this.getProductJsonLd(cf.appName,pd.data.content))

        }
    }

    public static async getProductJsonLd(app_name:string,pd_content:any){
        const relative_product=await new Shopping(app_name,undefined).getProduct({
            page:0,
            limit:100,
            id_list:[-99].concat((pd_content.relative_product ?? [])).join(',')
        });
        const variant=pd_content.variants[0]
        let preview_image=[variant.preview_image].concat(pd_content.preview_image).filter((dd)=>{
            return dd
        });

        return html`
                <script type="application/ld+json">
                    ${JSON.stringify(
            {
                "@context": "http://schema.org/",
                "@type": "Product",
                "name": pd_content.title,
                "brand": "",
                "description": pd_content.content.replace(/<\/?[^>]+(>|$)/g, ""),
                "offers": {
                    "@type": "Offer",
                    "price": parseFloat(variant.sale_price.toFixed(1)),
                    "priceCurrency": "TWD",
                    "availability": "http://schema.org/InStock"
                },
                "image": preview_image,
                "isRelatedTo": relative_product.data.map((dd:any)=>{
                    return {
                        "@type": "Product",
                        "name": dd.content.title,
                        "offers": {"@type": "Offer", "price": parseFloat(dd.content.min_price.toFixed(1)), "priceCurrency": "TWD"}
                    }
                })
            }
        )}
                </script>`
    }
    //網誌頁面SEO
    public static async articleSeo(cf: {
        article: any,
        page: string,
        appName: string,
        data: any,
        language: any
    }) {
        cf.article = cf.article || (cf.page as any).split('/')[1];
        let query = [`(content->>'$.type'='article')`, `(content->>'$.tag'='${cf.article}')`];
        const article: any = await new UtDatabase(cf.appName, `t_manager_post`).querySql(query, {
            page: 0,
            limit: 1,
        });
        cf.data.page_config = cf.data.page_config ?? {};
        cf.data.page_config.seo = cf.data.page_config.seo ?? {};
        if (article.data[0]) {
            cf.data.tag = cf.page;
            if (article.data[0].content.language_data && article.data[0].content.language_data[cf.language]) {
                cf.data.page_config.seo.title = article.data[0].content.language_data[cf.language].seo.title;
                cf.data.page_config.seo.content = article.data[0].content.language_data[cf.language].seo.content;
                cf.data.page_config.seo.keywords = article.data[0].content.language_data[cf.language].seo.keywords;
                cf.data.page_config.seo.image =  article.data[0].content.language_data[cf.language].seo.image;
            } else {
                cf.data.page_config.seo.title = article.data[0].content.seo.title;
                cf.data.page_config.seo.content = article.data[0].content.seo.content;
                cf.data.page_config.seo.keywords = article.data[0].content.seo.keywords;
                cf.data.page_config.seo.image =  article.data[0].content.seo.image;
            }
        }
    }

    //取得多國語言
    public static async language(store_info: any, req: any) {
        function checkIncludes(lan: string) {
            return store_info.language_setting.support.includes(lan);
        }

        function checkEqual(lan: string) {
            return `${req.query.page}`.startsWith(`${lan}/`) || req.query.page === lan;
        }

        function replace(lan: string) {
            if (req.query.page === lan) {
                req.query.page = '';
            } else {
                req.query.page = `${req.query.page}`.replace(lan + '/', '');
            }
        }

        if (checkEqual('en') && checkIncludes('en-US')) {
            replace('en');
            return `en-US`;
        } else if (checkEqual('cn') && checkIncludes('zh-CN')) {
            replace('cn');
            return `zh-CN`;
        } else if (checkEqual('tw') && checkIncludes('zh-TW')) {
            replace('tw');
            return `zh-TW`;
        } else {
            return store_info.language_setting.def;
        }
    }

    //FB像素
    public static fbCode(FBCode: any) {
        return FBCode && FBCode.pixel
            ? html`<!-- Meta Pixel Code -->
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
                <noscript><img height="1" width="1" style="display:none"
                               src="https://www.facebook.com/tr?id=617830100580621&ev=PageView&noscript=1"/>
                </noscript>
                <!-- End Meta Pixel Code -->`
            : ''
    }

    //GA標籤
    public static gTag(g_tag: any[]) {
        return (g_tag || [])
            .map((dd: any) => {
                return html`<!-- Google tag (gtag.js) -->
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
            .join('')
    }

    //GA追蹤
    public static gA4(ga4: any[]) {
        return (ga4 || [])
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
            .join('')
    }


}


export function extractCols(data: {
    value: any[];
    updated_at: Date;
}) {
    let items: any = [];
    const updated_at = new Date(data.updated_at).toISOString().replace(/\.\d{3}Z$/, '+00:00');
    data.value.map((item: any) => {
        items.push({
            ...item,
            updated_at
        });
        if (item.array && item.array.length > 0) {
            items = items.concat(extractCols({
                value: item.array,
                updated_at: data.updated_at
            }))
        }
    });
    return items;
}

export function extractProds(data: any) {
    const items: any = [];
    data.map((item: any) => {
        const updated_at = new Date(item.updated_time).toISOString().replace(/\.\d{3}Z$/, '+00:00');
        items.push({items});
    });
    return items;
}

// 判斷現在時間是否在 start 和 end 之間的函數
function isCurrentTimeWithinRange(data: {
    startDate: string;
    startTime: string;
    endDate?: string;
    endTime?: string
}): boolean {
    const now = new Date();
    now.setTime(now.getTime() + 8 * 3600 * 1000);
    // 組合 start 的完整日期時間
    const startDateTime = new Date(`${data.startDate}T${data.startTime}`);

    // 若 endDate 或 endTime 為 undefined，視為無期限
    const hasEnd = data.endDate && data.endTime;
    const endDateTime = hasEnd ? new Date(`${data.endDate}T${data.endTime}`) : null;

    // 判斷現在時間是否在範圍內
    if (hasEnd) {
        return now >= startDateTime && now <= endDateTime!;
    } else {
        return now >= startDateTime;
    }
}
import db from './modules/database';

export class UpdateScript {
    public static async run() {
        const migrate_template = (await db.query('SELECT appName FROM glitter.app_config where template_type!=0;', [])).map((dd: any) => {
            return dd.appName
        }).concat('shop-template-clothing-v3', 'shop-template-clothing-v3')

        // UpdateScript.migrateTermsOfService(['3131_shop', 't_1717152410650', 't_1717141688550', 't_1717129048727', 't_1719819344426'])
        // UpdateScript.migrateHeaderAndFooter(migrate_template)
        // UpdateScript.migrateAccount('shop_template_black_style')
        // await UpdateScript.migrateLink(migrate_template)
        //  await UpdateScript.migrateHeaderAndFooter(migrate_template)
        await UpdateScript.migrateLink(migrate_template)
        // await UpdateScript.migrateDialog(['shopnex'])
        // t_1719819344426
    }

    public static async migrateLink(appList: string[]) {
        for (const appName of appList) {
            for (const b of appList) {
                await db.query(`update \`${b}\`.t_user_public_config
                                set value=?
                                where \`key\` = 'menu-setting'
                                  and id > 0`, [JSON.stringify([
                    {
                        "link": "./index",
                        "items": [],
                        "title": "首頁"
                    },
                    {
                        "link": "/all-product",
                        "items": [
                            {
                                "link": "/all-product?collection=分類一",
                                "items": [],
                                "title": "分類一"
                            },
                            {
                                "link": "/all-product?collection=分類二",
                                "items": [],
                                "title": "分類二"
                            }
                        ],
                        "title": "所有商品",
                        "toggle": false
                    },
                    {
                        "link": "/blogs",
                        "items": [],
                        "title": "部落格 / 網誌"
                    },
                    {
                        "link": "./pages/about-us",
                        "items": [],
                        "title": "關於我們"
                    }
                ])]);
                await db.query(`update \`${b}\`.t_user_public_config
                                set value=?
                                where \`key\` = 'footer-setting'
                                  and id > 0`, [JSON.stringify([{
                    "link": "",
                    "items": [{
                        "link": "./?page=aboutus",
                        "items": [],
                        "title": "品牌故事"
                    }, {"link": "./?page=contact-us", "items": [], "title": "加入我們"}, {
                        "link": "./?page=blog_list",
                        "items": [],
                        "title": "最新消息"
                    }],
                    "title": "關於我們",
                    "toggle": false
                }, {
                    "link": "",
                    "items": [{
                        "link": "./?page=ask",
                        "items": [],
                        "title": "常見問題"
                    }, {"link": "./?page=refund_privacy", "items": [], "title": "退換貨政策"}, {
                        "link": "",
                        "items": [],
                        "title": "購物須知"
                    }, {"link": "", "items": [], "title": "實體店面"}],
                    "title": "購買相關",
                    "toggle": false
                }, {
                    "link": "",
                    "items": [{
                        "link": "",
                        "items": [],
                        "title": "營業時間 : 10:00～19:00"
                    }, {"link": "http://lin.ee/s212wq", "items": [], "title": "line客服 : @sam31212"}, {
                        "link": "",
                        "items": [],
                        "title": "電話：0912345678"
                    }, {"link": "", "items": [], "title": "統一編號 : 90687281"}],
                    "title": "聯絡我們",
                    "toggle": true
                }])]);

            }
        }
    }


    public static async migrateRichText() {
        const page_list = (await db.query(`select page_config, id
                                           FROM glitter.page_config
                                           where template_type = 2`, []))
        page_list.map((d: any) => {
            d.page_config = JSON.parse(JSON.stringify(d.page_config).replace(/multiple_line_text/g, 'rich_text'))
        })
        for (const p of page_list) {
            await db.query(`update glitter.page_config
                            set page_config=?
                            where id = ?`, [JSON.stringify(p.page_config), p.id]);
        }
    }

    public static async migrateAccount(appName: string) {
        const page_list = (await db.query(`SELECT *
                                           FROM glitter.page_config
                                           where appName = 't_1719819344426'
                                             and tag in ('account_userinfo', 'rebate', 'order_list', 'wishlist',
                                                         'register')`, []));
        page_list.map((d: any) => {
            Object.keys(d).map((dd) => {
                if (typeof d[dd] === 'object') {
                    d[dd] = JSON.stringify(d[dd])
                }
            })
        })
        for (const b of page_list) {
            await db.query(`delete
                            from glitter.page_config
                            where appName = ${db.escape(appName)}
                              and tag = ?`, [b.tag]);
            b['appName'] = appName
            b['id'] = undefined
            b['created_time'] = new Date()
            await db.query(`insert into glitter.page_config
                            set ?`, [
                b
            ])
        }
    }

    public static async migrateHeaderAndFooter(appList: string[]) {
        const rebate_page = (await db.query(`SELECT *
                                             FROM shop_template_black_style.t_user_public_config
                                             where \`key\` in ('menu-setting', 'footer-setting');`, []));

        for (const b of appList) {
            for (const c of rebate_page) {
                if (typeof c.value !== 'string') {
                    c.value = JSON.stringify(c);
                }
                (await db.query(`replace
                into \`${b}\`.t_user_public_config set ?`, [
                    c
                ]));
            }
        }
    }

    public static async migrateTermsOfService(appList: string[]) {

        const migrateArticle = ['privacyterms', 'termsofservice', 'novice']
        const rebate_page = (await db.query(`SELECT *
                                             FROM shopnex.t_manager_post
                                             where content - > '$.type' = 'article'
                                               and content - > '$.tag' in (${migrateArticle.map((dd) => {
                                                 return `"${dd}"`
                                             }).join(',')})`, []));
        rebate_page.map((dd: any) => {
            const index = ['privacyterms', 'termsofservice', 'novice'].findIndex((d1) => {
                return d1 === dd.content.tag
            });
            dd.content.tag = ['privacy', 'terms', 'novice'][index]
            dd.content.template = 'article'
            dd.content = JSON.stringify(dd.content)
            dd['id'] = undefined
        })
        for (const b of appList) {
            await db.query(`delete
                            from \`${b}\`.t_manager_post
                            where content - > '$.type' = 'article' `, []);
            for (const c of rebate_page) {
                await db.query(`insert into \`${b}\`.t_manager_post
                                set ?`, [
                    c
                ])
            }

        }
    }

    public static async migrateRebatePage(appList: string[]) {
        const rebate_page = (await db.query(`SELECT *
                                             FROM glitter.page_config
                                             where appName = 't_1719819344426'
                                               and tag = 'rebate'`, []))[0];
        const migrate = appList
        Object.keys(rebate_page).map((dd) => {
            if (typeof rebate_page[dd] === 'object') {
                rebate_page[dd] = JSON.stringify(rebate_page[dd])
            }
        })
        for (const b of migrate) {
            await db.query(`delete
                            from glitter.page_config
                            where appName = ${db.escape(b)}
                              and tag = 'rebate'`, []);
            rebate_page['id'] = undefined
            rebate_page['appName'] = b
            rebate_page['created_time'] = new Date()
            await db.query(`insert into glitter.page_config
                            set ?`, [
                rebate_page
            ])
        }
    }

    public static async migrateDialog(appList: string[]) {
        const page_list = (await db.query(`SELECT *
                                           FROM glitter.page_config
                                           where appName = 'cms_system'
                                             and tag in ('loading_dialog', 'toast', 'false_dialog')`, []));
        const global_event = (await db.query(`SELECT *
                                              FROM cms_system.t_global_event;`, []));
        page_list.map((d: any) => {
            Object.keys(d).map((dd) => {
                if (typeof d[dd] === 'object') {
                    d[dd] = JSON.stringify(d[dd])
                }
            })
        })
        for (const appName of appList) {
            for (const b of page_list) {
                await db.query(`delete
                                from glitter.page_config
                                where appName = ${db.escape(appName)}
                                  and tag = ?`, [b.tag]);
                b['appName'] = appName
                b['id'] = undefined
                b['created_time'] = new Date()
                b['updated_time'] = new Date()
                await db.query(`insert into glitter.page_config
                                set ?`, [
                    b
                ])
                await db.query(`replace
                into \`${appName}\`.t_global_event
                            (tag,name,json) values ?`, [
                    global_event.map((dd: any) => {
                        dd.id = undefined
                        return [
                            dd.tag,
                            dd.name,
                            JSON.stringify(dd.json)
                        ]
                    })
                ])
                for (const b of global_event) {

                }
            }
        }
    }

    public static async hiddenEditorAble() {
        const hidden_page = await db.query(`SELECT *
                                            FROM glitter.page_config
                                            where tag!='index' and page_config->>'$.support_editor'="true";`, [])
        for (const b of hidden_page) {
            b.page_config.support_editor = 'false'
            b['id'] = undefined
            Object.keys(b).map((dd) => {
                if (typeof b[dd] === 'object') {
                    b[dd] = JSON.stringify(b[dd])
                }
            })
            b['created_time'] = new Date()
            b['updated_time'] = new Date()
            await db.query(`replace
            into glitter.page_config
                            set ?`, [
                b
            ])
        }
    }

    public static async migrateHeader(appList: string[]) {
        const page_list = (await db.query(`SELECT *
                                           FROM glitter.page_config
                                           where appName = 't_1719819344426'
                                             and tag in ('c_header')`, []));
        page_list.map((d: any) => {
            Object.keys(d).map((dd) => {
                if (typeof d[dd] === 'object') {
                    d[dd] = JSON.stringify(d[dd])
                }
            })
        })
        for (const appName of appList) {
            for (const b of page_list) {
                await db.query(`delete
                                from glitter.page_config
                                where appName = ${db.escape(appName)}
                                  and tag = ?`, [b.tag]);
                b['appName'] = appName
                b['id'] = undefined
                b['created_time'] = new Date()
                b['updated_time'] = new Date()
                await db.query(`insert into glitter.page_config
                                set ?`, [
                    b
                ])
            }
        }
    }

    //熱門商品列表-Style1

}
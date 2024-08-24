import db from './modules/database';

export class UpdateScript {
    public static async run() {
        // const migrate_template = (await db.query('SELECT appName FROM glitter.app_config where template_type!=0;', [])).map((dd: any) => {
        //     return dd.appName
        // }).concat(['shop-template-clothing-v3'])
        // UpdateScript.migrateTermsOfService(['3131_shop', 't_1717152410650', 't_1717141688550', 't_1717129048727', 't_1719819344426'])
        // UpdateScript.migrateHeaderAndFooterAndCollection(migrate_template.filter((dd:any)=>{
        //     return dd !=='t_1719819344426'
        // }))
        // UpdateScript.migrateAccount('shop_template_black_style')
        // await UpdateScript.migrateLink(migrate_template)
        //  await UpdateScript.migrateHeaderAndFooter(migrate_template)
        // migrate_template.map((dd:any)=>{
        //     UpdateScript.migrateAccount(dd)
        // })
        // await
        // await UpdateScript.migratePages(migrate_template.filter((dd:any)=>{
        //     return dd !=='t_1719819344426'
        // }),['about-us','privacy','terms','sample1','sample2','sample3'])
        // t_1719819344426
        // await this.migrateSinglePage(migrate_template.reverse())
        // await this.migrateInitialConfig(migrate_template.filter((dd:any)=>{
        //     return dd !=='t_1719819344426'
        // }))
        // await this.migrateHomePageFooter(migrate_template)
        await this.migrate_blogs_toPage()
    }

    public static async migrate_blogs_toPage(){
       const blogs=await db.query(`SELECT * FROM shopnex.t_manager_post where content->>'$.for_index'='false' and content->>'$.page_type'='blog'`,[])
        for (const b of blogs){
            b.content.page_type='page'
            await db.query(`update shopnex.t_manager_post set content=? where id=?`,[
JSON.stringify(b.content),
                b.id
            ])
        }
    }
    public static async migrateHomePageFooter(appList: string[]) {

        for (const b of appList) {
            const homePage = (await db.query(`select * from glitter.page_config
                                             where appName = ?
                                               and tag = ?`, [b,'index']))[0]
            homePage.config[0]['deletable']='false'
            homePage.config[homePage.config.length - 1]['deletable']='false'
            homePage.created_time=new Date()
            homePage.config=JSON.stringify(homePage.config)
            homePage.page_config=JSON.stringify(homePage.page_config)
            await db.query(`update glitter.page_config set ? where id=?`,[
                homePage,homePage.id
            ])
        }
    }

    public static async migrateInitialConfig(appList: string[]) {
        //覆蓋私有配置檔案
        let private_config = await db.query(`select *
                                             from glitter.private_config
                                             where app_name = ?`, ['t_1719819344426']);
        //覆蓋公開配置檔案
        let public_config = await db.query(`select *
                                            from \`t_1719819344426\`.t_user_public_config`, []);
        //覆蓋公開配置檔案2
        let pb_config2 = await db.query(`select *
                                            from \`t_1719819344426\`.public_config`, []);
        for (const v of appList) {
            for (const b of private_config) {
                b.id = undefined
                b.app_name = v
                b.updated_at = new Date()
                if (typeof b.value === 'object') {
                    b.value = JSON.stringify(b.value)
                }
                await db.query(`delete
                                from glitter.private_config
                                where app_name = ?
                                  and \`key\` = ?`, [v, b.key])
                await db.query(`insert into glitter.private_config
                                set ?`, [
                    b
                ])
            }
            for (const b of public_config) {
                b.id = undefined
                b.updated_at = new Date()
                if (typeof b.value === 'object') {
                    b.value = JSON.stringify(b.value)
                }
                await db.query(`delete
                                from \`${v}\`.t_user_public_config
                                where \`key\` = ?
                                  and id > 0`, [b.key])
                await db.query(`insert into \`${v}\`.t_user_public_config
                                set ?`, [
                    b
                ])
            }
            for (const b of pb_config2) {
                b.id = undefined
                b.updated_at = new Date()
                if (typeof b.value === 'object') {
                    b.value = JSON.stringify(b.value)
                }
                await db.query(`delete
                                from \`${v}\`.public_config
                                where \`key\` = ?
                                  and id > 0`, [b.key])
                await db.query(`insert into \`${v}\`.public_config
                                set ?`, [
                    b
                ])
            }
        }
    }

    public static async migrateSinglePage(appList: string[]) {
        const cart_footer = {
            "id": "sdsds5s9s9sasbs8",
            "js": "./official_view_component/official.js",
            "css": {"class": {}, "style": {}},
            "data": {
                "refer_app": "shop_template_black_style",
                "tag": "sy01_checkout_detail",
                "list": [],
                "carryData": {}
            },
            "type": "component",
            "class": "w-100",
            "index": 0,
            "label": "SY01-購物車詳情",
            "style": "",
            "bundle": {},
            "global": [],
            "toggle": false,
            "stylist": [],
            "dataType": "static",
            "style_from": "code",
            "classDataType": "static",
            "preloadEvenet": {},
            "share": {},
            "formData": {},
            "refreshAllParameter": {},
            "refreshComponentParameter": {},
            "list": [],
            "version": "v2",
            "storage": {},
            "mobile": {"refer": "def"},
            "desktop": {"refer": "def"}
        }
        let index2: any = 0
        for (const b of appList) {
            index2 = index2 + 1;
            await db.query(`delete
                            from glitter.page_config
                            where appName = ?
                              and tag = ?`, [b, 'spa'])
            await db.query(`delete
                            from glitter.page_config
                            where appName = ?
                              and tag = ?`, [b, 'spa' + index2])
            await db.query(`delete
                            from glitter.page_config
                            where appName = ?
                              and tag = ?`, ['shop_template_black_style', 'spa' + index2])
            const image = (await db.query(`SELECT *
                                           FROM glitter.app_config
                                           where appName = ?`, [b]))[0].template_config.image[0];
            const index = (await db.query(`select *
                                           from glitter.page_config
                                           where appName = ?
                                             and tag = ?`, [b, 'index']))[0]
            index.config.splice(index.config.length - 1, 1)
            index.config.splice(0, 1)
            index.config.push(cart_footer)
            index.page_config = {
                "list": [],
                "version": "v2",
                "formData": {},
                "formFormat": [],
                "resource_from": "global"
            }
            index.template_type = 2;
            index.group = '一頁商店'
            index.tag = 'spa' + index2
            index.name = `一頁購物-AS${(index2 < 10) ? `0${index2}` : index2}`
            index.appName = 'shop_template_black_style'
            index.template_config = {
                "tag": ["一頁購物"],
                "desc": "",
                "name": `一頁購物-AS${(index2 < 10) ? `0${index2}` : index2}`,
                "image": [image],
                "status": "wait",
                "post_to": "all",
                "version": "1.0",
                "created_by": "liondesign.io",
                "preview_img": image
            }
            index.template_config = JSON.stringify(index.template_config)
            index.config = JSON.stringify(index.config)
            index.page_config = JSON.stringify(index.page_config)
            index.id = undefined
            await db.query(`delete
                            from shop_template_black_style.t_manager_post
                            where id > 0
                              and content ->>'$.tag'=?`, [
                index.tag
            ]);
            await db.query(`insert into shop_template_black_style.t_manager_post
                            set ?`, [
                {
                    userID: index.userID,
                    content: JSON.stringify({
                        "seo": {},
                        "tag": index.tag,
                        "name": index.name,
                        "type": "article",
                        "config": JSON.parse(index.config),
                        "relative": "collection",
                        "template": "article",
                        "for_index": "false",
                        "generator": "page_editor",
                        "page_type": "page",
                        "collection": [],
                        "relative_data": [],
                        "with_discount": "false"
                    })
                }
            ])
            const data = await db.query(`insert into glitter.page_config
                                         set ?`, [index])
            await db.query(`replace
            into glitter.t_template_tag  (\`type\`,tag,bind) values (?,?,?)`, [
                'page', '一頁購物', data.insertId
            ])
            //

        }
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
            b['updated_time'] = new Date()
            b['created_time'] = new Date()
            await db.query(`insert into glitter.page_config
                            set ?`, [
                b
            ])
        }
    }

    public static async migrateHeaderAndFooterAndCollection(appList: string[]) {
        const rebate_page = (await db.query(`SELECT *
                                             FROM t_1719819344426.t_user_public_config
                                             where \`key\` in ('menu-setting', 'footer-setting','blog_collection');`, []));
        for (const b of appList) {
            for (const c of rebate_page) {
                if (typeof c.value !== 'string') {
                    c.value = JSON.stringify(c.value);
                }
                (await db.query(`replace
                into \`${b}\`.t_user_public_config set ?`, [
                    c
                ]));
            }
        }
    }

    public static async migratePages(appList: string[], migrate: string[]) {
        const rebate_page = (await db.query(`SELECT *
                                             FROM t_1719819344426.t_manager_post
                                             where content ->> '$.type' = 'article'
                                               and content ->> '$.tag' in (${migrate.map((dd) => {
                                                 return `"${dd}"`
                                             }).join(',')})`, []));
        rebate_page.map((dd: any) => {
            dd.content.template = 'article'
            dd.content = JSON.stringify(dd.content)
            dd['id'] = undefined
        })
        for (const b of appList) {
            await db.query(`delete
                            from \`${b}\`.t_manager_post
                            where content ->> '$.type' = 'article' `, []);
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

    public static async migrateFooter(appList: string[]) {
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
}
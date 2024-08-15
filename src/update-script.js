"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateScript = void 0;
const database_1 = __importDefault(require("./modules/database"));
class UpdateScript {
    static async run() {
        const migrate_template = (await database_1.default.query('SELECT appName FROM glitter.app_config where template_type!=0;', [])).map((dd) => {
            return dd.appName;
        }).concat(['shop-template-clothing-v3']);
        await this.migrateInitialConfig(migrate_template.filter((dd) => {
            return dd !== 't_1719819344426';
        }));
    }
    static async migrateHomePageFooter(appList) {
        for (const b of appList) {
            const homePage = (await database_1.default.query(`select * from glitter.page_config
                                             where appName = ?
                                               and tag = ?`, [b, 'index']))[0];
            homePage.config[0]['deletable'] = 'false';
            homePage.config[homePage.config.length - 1]['deletable'] = 'false';
            homePage.created_time = new Date();
            homePage.config = JSON.stringify(homePage.config);
            homePage.page_config = JSON.stringify(homePage.page_config);
            await database_1.default.query(`update glitter.page_config set ? where id=?`, [
                homePage, homePage.id
            ]);
        }
    }
    static async migrateInitialConfig(appList) {
        let private_config = await database_1.default.query(`select *
                                             from glitter.private_config
                                             where app_name = ?`, ['t_1719819344426']);
        let public_config = await database_1.default.query(`select *
                                            from \`t_1719819344426\`.t_user_public_config`, []);
        let pb_config2 = await database_1.default.query(`select *
                                            from \`t_1719819344426\`.public_config`, []);
        for (const v of appList) {
            for (const b of private_config) {
                b.id = undefined;
                b.app_name = v;
                b.updated_at = new Date();
                if (typeof b.value === 'object') {
                    b.value = JSON.stringify(b.value);
                }
                await database_1.default.query(`delete
                                from glitter.private_config
                                where app_name = ?
                                  and \`key\` = ?`, [v, b.key]);
                await database_1.default.query(`insert into glitter.private_config
                                set ?`, [
                    b
                ]);
            }
            for (const b of public_config) {
                b.id = undefined;
                b.updated_at = new Date();
                if (typeof b.value === 'object') {
                    b.value = JSON.stringify(b.value);
                }
                await database_1.default.query(`delete
                                from \`${v}\`.t_user_public_config
                                where \`key\` = ?
                                  and id > 0`, [b.key]);
                await database_1.default.query(`insert into \`${v}\`.t_user_public_config
                                set ?`, [
                    b
                ]);
            }
            for (const b of pb_config2) {
                b.id = undefined;
                b.updated_at = new Date();
                if (typeof b.value === 'object') {
                    b.value = JSON.stringify(b.value);
                }
                await database_1.default.query(`delete
                                from \`${v}\`.public_config
                                where \`key\` = ?
                                  and id > 0`, [b.key]);
                await database_1.default.query(`insert into \`${v}\`.public_config
                                set ?`, [
                    b
                ]);
            }
        }
    }
    static async migrateSinglePage(appList) {
        const cart_footer = {
            "id": "sdsds5s9s9sasbs8",
            "js": "./official_view_component/official.js",
            "css": { "class": {}, "style": {} },
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
            "mobile": { "refer": "def" },
            "desktop": { "refer": "def" }
        };
        let index2 = 0;
        for (const b of appList) {
            index2 = index2 + 1;
            await database_1.default.query(`delete
                            from glitter.page_config
                            where appName = ?
                              and tag = ?`, [b, 'spa']);
            await database_1.default.query(`delete
                            from glitter.page_config
                            where appName = ?
                              and tag = ?`, [b, 'spa' + index2]);
            await database_1.default.query(`delete
                            from glitter.page_config
                            where appName = ?
                              and tag = ?`, ['shop_template_black_style', 'spa' + index2]);
            const image = (await database_1.default.query(`SELECT *
                                           FROM glitter.app_config
                                           where appName = ?`, [b]))[0].template_config.image[0];
            const index = (await database_1.default.query(`select *
                                           from glitter.page_config
                                           where appName = ?
                                             and tag = ?`, [b, 'index']))[0];
            index.config.splice(index.config.length - 1, 1);
            index.config.splice(0, 1);
            index.config.push(cart_footer);
            index.page_config = {
                "list": [],
                "version": "v2",
                "formData": {},
                "formFormat": [],
                "resource_from": "global"
            };
            index.template_type = 2;
            index.group = '一頁商店';
            index.tag = 'spa' + index2;
            index.name = `一頁購物-AS${(index2 < 10) ? `0${index2}` : index2}`;
            index.appName = 'shop_template_black_style';
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
            };
            index.template_config = JSON.stringify(index.template_config);
            index.config = JSON.stringify(index.config);
            index.page_config = JSON.stringify(index.page_config);
            index.id = undefined;
            await database_1.default.query(`delete
                            from shop_template_black_style.t_manager_post
                            where id > 0
                              and content ->>'$.tag'=?`, [
                index.tag
            ]);
            await database_1.default.query(`insert into shop_template_black_style.t_manager_post
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
            ]);
            const data = await database_1.default.query(`insert into glitter.page_config
                                         set ?`, [index]);
            await database_1.default.query(`replace
            into glitter.t_template_tag  (\`type\`,tag,bind) values (?,?,?)`, [
                'page', '一頁購物', data.insertId
            ]);
        }
    }
    static async migrateLink(appList) {
        for (const appName of appList) {
            for (const b of appList) {
                await database_1.default.query(`update \`${b}\`.t_user_public_config
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
                await database_1.default.query(`update \`${b}\`.t_user_public_config
                                set value=?
                                where \`key\` = 'footer-setting'
                                  and id > 0`, [JSON.stringify([{
                            "link": "",
                            "items": [{
                                    "link": "./?page=aboutus",
                                    "items": [],
                                    "title": "品牌故事"
                                }, { "link": "./?page=contact-us", "items": [], "title": "加入我們" }, {
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
                                }, { "link": "./?page=refund_privacy", "items": [], "title": "退換貨政策" }, {
                                    "link": "",
                                    "items": [],
                                    "title": "購物須知"
                                }, { "link": "", "items": [], "title": "實體店面" }],
                            "title": "購買相關",
                            "toggle": false
                        }, {
                            "link": "",
                            "items": [{
                                    "link": "",
                                    "items": [],
                                    "title": "營業時間 : 10:00～19:00"
                                }, { "link": "http://lin.ee/s212wq", "items": [], "title": "line客服 : @sam31212" }, {
                                    "link": "",
                                    "items": [],
                                    "title": "電話：0912345678"
                                }, { "link": "", "items": [], "title": "統一編號 : 90687281" }],
                            "title": "聯絡我們",
                            "toggle": true
                        }])]);
            }
        }
    }
    static async migrateRichText() {
        const page_list = (await database_1.default.query(`select page_config, id
                                           FROM glitter.page_config
                                           where template_type = 2`, []));
        page_list.map((d) => {
            d.page_config = JSON.parse(JSON.stringify(d.page_config).replace(/multiple_line_text/g, 'rich_text'));
        });
        for (const p of page_list) {
            await database_1.default.query(`update glitter.page_config
                            set page_config=?
                            where id = ?`, [JSON.stringify(p.page_config), p.id]);
        }
    }
    static async migrateAccount(appName) {
        const page_list = (await database_1.default.query(`SELECT *
                                           FROM glitter.page_config
                                           where appName = 't_1719819344426'
                                             and tag in ('account_userinfo', 'rebate', 'order_list', 'wishlist',
                                                         'register')`, []));
        page_list.map((d) => {
            Object.keys(d).map((dd) => {
                if (typeof d[dd] === 'object') {
                    d[dd] = JSON.stringify(d[dd]);
                }
            });
        });
        for (const b of page_list) {
            await database_1.default.query(`delete
                            from glitter.page_config
                            where appName = ${database_1.default.escape(appName)}
                              and tag = ?`, [b.tag]);
            b['appName'] = appName;
            b['id'] = undefined;
            b['updated_time'] = new Date();
            b['created_time'] = new Date();
            await database_1.default.query(`insert into glitter.page_config
                            set ?`, [
                b
            ]);
        }
    }
    static async migrateHeaderAndFooterAndCollection(appList) {
        const rebate_page = (await database_1.default.query(`SELECT *
                                             FROM shop_template_black_style.t_user_public_config
                                             where \`key\` in ('menu-setting', 'footer-setting','blog_collection');`, []));
        for (const b of appList) {
            for (const c of rebate_page) {
                if (typeof c.value !== 'string') {
                    c.value = JSON.stringify(c.value);
                }
                (await database_1.default.query(`replace
                into \`${b}\`.t_user_public_config set ?`, [
                    c
                ]));
            }
        }
    }
    static async migratePages(appList, migrate) {
        const rebate_page = (await database_1.default.query(`SELECT *
                                             FROM t_1719819344426.t_manager_post
                                             where content ->> '$.type' = 'article'
                                               and content ->> '$.tag' in (${migrate.map((dd) => {
            return `"${dd}"`;
        }).join(',')})`, []));
        rebate_page.map((dd) => {
            dd.content.template = 'article';
            dd.content = JSON.stringify(dd.content);
            dd['id'] = undefined;
        });
        for (const b of appList) {
            await database_1.default.query(`delete
                            from \`${b}\`.t_manager_post
                            where content ->> '$.type' = 'article' `, []);
            for (const c of rebate_page) {
                await database_1.default.query(`insert into \`${b}\`.t_manager_post
                                set ?`, [
                    c
                ]);
            }
        }
    }
    static async migrateRebatePage(appList) {
        const rebate_page = (await database_1.default.query(`SELECT *
                                             FROM glitter.page_config
                                             where appName = 't_1719819344426'
                                               and tag = 'rebate'`, []))[0];
        const migrate = appList;
        Object.keys(rebate_page).map((dd) => {
            if (typeof rebate_page[dd] === 'object') {
                rebate_page[dd] = JSON.stringify(rebate_page[dd]);
            }
        });
        for (const b of migrate) {
            await database_1.default.query(`delete
                            from glitter.page_config
                            where appName = ${database_1.default.escape(b)}
                              and tag = 'rebate'`, []);
            rebate_page['id'] = undefined;
            rebate_page['appName'] = b;
            rebate_page['created_time'] = new Date();
            await database_1.default.query(`insert into glitter.page_config
                            set ?`, [
                rebate_page
            ]);
        }
    }
    static async migrateDialog(appList) {
        const page_list = (await database_1.default.query(`SELECT *
                                           FROM glitter.page_config
                                           where appName = 'cms_system'
                                             and tag in ('loading_dialog', 'toast', 'false_dialog')`, []));
        const global_event = (await database_1.default.query(`SELECT *
                                              FROM cms_system.t_global_event;`, []));
        page_list.map((d) => {
            Object.keys(d).map((dd) => {
                if (typeof d[dd] === 'object') {
                    d[dd] = JSON.stringify(d[dd]);
                }
            });
        });
        for (const appName of appList) {
            for (const b of page_list) {
                await database_1.default.query(`delete
                                from glitter.page_config
                                where appName = ${database_1.default.escape(appName)}
                                  and tag = ?`, [b.tag]);
                b['appName'] = appName;
                b['id'] = undefined;
                b['created_time'] = new Date();
                b['updated_time'] = new Date();
                await database_1.default.query(`insert into glitter.page_config
                                set ?`, [
                    b
                ]);
                await database_1.default.query(`replace
                into \`${appName}\`.t_global_event
                            (tag,name,json) values ?`, [
                    global_event.map((dd) => {
                        dd.id = undefined;
                        return [
                            dd.tag,
                            dd.name,
                            JSON.stringify(dd.json)
                        ];
                    })
                ]);
                for (const b of global_event) {
                }
            }
        }
    }
    static async hiddenEditorAble() {
        const hidden_page = await database_1.default.query(`SELECT *
                                            FROM glitter.page_config
                                            where tag!='index' and page_config->>'$.support_editor'="true";`, []);
        for (const b of hidden_page) {
            b.page_config.support_editor = 'false';
            b['id'] = undefined;
            Object.keys(b).map((dd) => {
                if (typeof b[dd] === 'object') {
                    b[dd] = JSON.stringify(b[dd]);
                }
            });
            b['created_time'] = new Date();
            b['updated_time'] = new Date();
            await database_1.default.query(`replace
            into glitter.page_config
                            set ?`, [
                b
            ]);
        }
    }
    static async migrateHeader(appList) {
        const page_list = (await database_1.default.query(`SELECT *
                                           FROM glitter.page_config
                                           where appName = 't_1719819344426'
                                             and tag in ('c_header')`, []));
        page_list.map((d) => {
            Object.keys(d).map((dd) => {
                if (typeof d[dd] === 'object') {
                    d[dd] = JSON.stringify(d[dd]);
                }
            });
        });
        for (const appName of appList) {
            for (const b of page_list) {
                await database_1.default.query(`delete
                                from glitter.page_config
                                where appName = ${database_1.default.escape(appName)}
                                  and tag = ?`, [b.tag]);
                b['appName'] = appName;
                b['id'] = undefined;
                b['created_time'] = new Date();
                b['updated_time'] = new Date();
                await database_1.default.query(`insert into glitter.page_config
                                set ?`, [
                    b
                ]);
            }
        }
    }
    static async migrateFooter(appList) {
        const page_list = (await database_1.default.query(`SELECT *
                                           FROM glitter.page_config
                                           where appName = 't_1719819344426'
                                             and tag in ('c_header')`, []));
        page_list.map((d) => {
            Object.keys(d).map((dd) => {
                if (typeof d[dd] === 'object') {
                    d[dd] = JSON.stringify(d[dd]);
                }
            });
        });
        for (const appName of appList) {
            for (const b of page_list) {
                await database_1.default.query(`delete
                                from glitter.page_config
                                where appName = ${database_1.default.escape(appName)}
                                  and tag = ?`, [b.tag]);
                b['appName'] = appName;
                b['id'] = undefined;
                b['created_time'] = new Date();
                b['updated_time'] = new Date();
                await database_1.default.query(`insert into glitter.page_config
                                set ?`, [
                    b
                ]);
            }
        }
    }
}
exports.UpdateScript = UpdateScript;
//# sourceMappingURL=update-script.js.map
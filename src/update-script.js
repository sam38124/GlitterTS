"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateScript = void 0;
const database_1 = __importDefault(require("./modules/database"));
class UpdateScript {
    static async run() {
    }
    static async migrateRichText() {
        const page_list = (await database_1.default.query(`select page_config,id
                                             FROM glitter.page_config where template_type=2`, []));
        page_list.map((d) => {
            d.page_config = JSON.parse(JSON.stringify(d.page_config).replace(/multiple_line_text/g, 'rich_text'));
        });
        for (const p of page_list) {
            await database_1.default.query(`update glitter.page_config set page_config=? where id=?`, [JSON.stringify(p.page_config), p.id]);
        }
    }
    static async migrateAccount(appName) {
        const page_list = (await database_1.default.query(`SELECT *
                                             FROM glitter.page_config
                                             where appName = 'shop-template-clothing-v3'
                                               and tag in ('account_userinfo','rebate','order_list','wishlist','register')`, []));
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
            b['created_time'] = new Date();
            await database_1.default.query(`insert into glitter.page_config
                            set ?`, [
                b
            ]);
        }
    }
    static async migrateHeaderAndFooter(appList) {
        const rebate_page = (await database_1.default.query(`SELECT *
                                             FROM shop_template_black_style.t_user_public_config
                                             where \`key\` in ('menu-setting', 'footer-setting');`, []));
        for (const b of appList) {
            for (const c of rebate_page) {
                (await database_1.default.query(`replace into \`${b}\`.t_user_public_config set ?`, [
                    c
                ]));
            }
        }
    }
    static async migrateTermsOfService(appList) {
        const migrateArticle = ['privacyterms', 'termsofservice', 'novice'];
        const rebate_page = (await database_1.default.query(`SELECT *
                                             FROM shopnex.t_manager_post
                                             where content - > '$.type' = 'article'
                                               and content - > '$.tag' in (${migrateArticle.map((dd) => {
            return `"${dd}"`;
        }).join(',')})`, []));
        rebate_page.map((dd) => {
            const index = ['privacyterms', 'termsofservice', 'novice'].findIndex((d1) => {
                return d1 === dd.content.tag;
            });
            dd.content.tag = ['privacy', 'terms', 'novice'][index];
            dd.content.template = 'article';
            dd.content = JSON.stringify(dd.content);
            dd['id'] = undefined;
        });
        for (const b of appList) {
            await database_1.default.query(`delete
                            from \`${b}\`.t_manager_post
                            where content - > '$.type' = 'article' `, []);
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
                                             where appName = 'shop-template-clothing-v3'
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
}
exports.UpdateScript = UpdateScript;
//# sourceMappingURL=update-script.js.map
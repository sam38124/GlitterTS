import db from './modules/database';

export class UpdateScript {
    public static async run() {
        // UpdateScript.migrateTermsOfService(['3131_shop', 't_1717152410650', 't_1717141688550', 't_1717129048727', 'shop-template-clothing-v3'])
        UpdateScript.migrateHeaderAndFooter(['3131_shop','shop-template-clothing-v3','t_1717129048727','t_1717141688550','t_1717152410650','t_1717407696327','t_1717385441550','t_1717386839537','t_1717397588096'])
    }

    public static async migrateHeaderAndFooter(appList: string[]) {
        const rebate_page = (await db.query(`SELECT *
                                             FROM shop_template_black_style.t_user_public_config
                                             where \`key\` in ('menu-setting', 'footer-setting');`, []));
        rebate_page.map((d: any) => {
            d.value = JSON.stringify(d.value)
        })
        for (const b of appList) {
            for (const c of rebate_page) {
                (await db.query(`replace into \`${b}\`.t_user_public_config set ?`, [
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
                                             where appName = 'shop-template-clothing-v3'
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
}
import db from "../modules/database.js";
import {saasConfig} from "../config.js";

export class Seo{
    public static async getPageInfo(appName:string,page:string){
        return (await db.execute(`SELECT page_config, \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`, tag,page_type,tag
                                                  FROM \`${saasConfig.SAAS_NAME}\`.page_config,
                                                       \`${saasConfig.SAAS_NAME}\`.app_config
                                                  where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(appName)}
                                                    and tag = ${db.escape(page)}
                                                    and \`${saasConfig.SAAS_NAME}\`.page_config.appName = \`${saasConfig.SAAS_NAME}\`.app_config.appName;
                    `, []))[0]
    }
    public static async getAppConfig(appName:string){
        return (await db.execute(`SELECT \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`
                                                          FROM \`${saasConfig.SAAS_NAME}\`.app_config
                                                          where \`${saasConfig.SAAS_NAME}\`.app_config.appName = ${db.escape(appName)} limit 0,1
                        `, []))[0]['config']
    }

    public static async redirectToHomePage(appName:string,req:any){
        let redirect=''
        const config = await Seo.getAppConfig(appName);
        if (config && ((await db.execute(`SELECT count(1)
                                                          FROM \`${saasConfig.SAAS_NAME}\`.page_config
                                                          where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(appName)}
                                                            and tag = ${db.escape(config['homePage'])}
                        `, []))[0]["count(1)"] === 1)) {
            redirect = config['homePage']
        } else {
            redirect = (await db.execute(`SELECT tag
                                                          FROM \`${saasConfig.SAAS_NAME}\`.page_config
                                                          where \`${saasConfig.SAAS_NAME}\`.page_config.appName = ${db.escape(appName)} limit 0,1
                            `, []))[0]['tag']
        }
        if (req.query.type) {
            redirect += `&type=${req.query.type}`
        }
        if (req.query.appName) {
            redirect += `&appName=${req.query.appName}`
        }
        return `<script>
window.location.href='?page=${redirect}';
</script>`
    }
}
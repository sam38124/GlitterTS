import db from "../modules/database.js";
import {ConfigSetting, saasConfig} from "../config.js";
import {App} from "./app.js";
import {Template} from "./template.js";
import express from 'express';

export class Seo {
    public static async getPageInfo(appName: string, query_page: string,language:any,req:express.Request):Promise<any> {
        let page = await Template.getRealPage(query_page, appName,req);
        if(page==='official-router'){
            appName='cms_system'
        }else if(page==='page-show-router'){
          appName='cms_system'
        }
        const page_db=(()=>{
            switch (language){
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
        const page_data=(await db.execute(`SELECT page_config,
                                         \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`,
                                         tag,
                                         page_type,
                                         tag
                                  FROM \`${saasConfig.SAAS_NAME}\`.${page_db},
                                       \`${saasConfig.SAAS_NAME}\`.app_config
                                  where \`${saasConfig.SAAS_NAME}\`.${page_db}.appName = ${db.escape(appName)}
                                    and tag = ${db.escape(page)}
                                    and \`${saasConfig.SAAS_NAME}\`.${page_db}.appName = \`${saasConfig.SAAS_NAME}\`.app_config.appName;
        `, []))[0]
        if(!page_data && (language!='zh-TW')){
            return await Seo.getPageInfo(appName,query_page,'zh-TW',req)
        }else{
            return page_data
        }

    }


    public static async getAppConfig(appName: string) {
        return (await db.execute(`SELECT \`${saasConfig.SAAS_NAME}\`.app_config.\`config\`,
                                         \`${saasConfig.SAAS_NAME}\`.app_config.\`brand\`
                                  FROM \`${saasConfig.SAAS_NAME}\`.app_config
                                  where \`${saasConfig.SAAS_NAME}\`.app_config.appName = ${db.escape(appName)} limit 0,1
        `, []))[0]['config']
    }

    public static async redirectToHomePage(appName: string, req: any) {
        let redirect = ''
        const relative_root = (req.query.page as string ?? "").split('/').map((dd, index) => {
            if (index === 0) {
                return './'
            } else {
                return '../'
            }
        }).join('');
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
        let data = await Seo.getPageInfo(appName, redirect,'zh-TW',req);

        let query_stack=[]
        if (req.query.type) {
            query_stack.push(`type=${req.query.type}`)
        }
        if (req.query.appName) {
            query_stack.push(`appName=${req.query.appName}`)
        }
        if (req.query.function) {
            query_stack.push(`function=${req.query.function}`)
        }
        if(query_stack.length>0){
            redirect+=`?${query_stack.join('&')}`
        }
        //SAAS品牌和用戶類型
        let link_prefix = req.originalUrl.split('/')[1]
        if(ConfigSetting.is_local){
            if ((link_prefix !== 'shopnex') && (link_prefix !== 'codenex_v2')) {
                link_prefix = ''
            }
        }else{
            link_prefix=''
        }

        return `<head>
${(() => {
            data.page_config = data.page_config ?? {}
            const d = data.page_config.seo ?? {}
            return `
<title>${d.title ?? "尚未設定標題"}</title>
    <link rel="canonical" href="/${link_prefix && `${link_prefix}/`}${data.tag}">
    <meta name="keywords" content="${d.keywords ?? "尚未設定關鍵字"}" />
    <link id="appImage" rel="shortcut icon" href="${d.logo ?? ""}" type="image/x-icon">
    <link rel="icon" href="${d.logo ?? ""}" type="image/png" sizes="128x128">
    <meta property="og:image" content="${d.image ?? ""}">
    <meta property="og:title" content="${(d.title ?? "").replace(/\n/g, '')}">
    <meta name="description" content="${(d.content ?? "").replace(/\n/g, '')}">
    <meta name="og:description" content="${(d.content ?? "").replace(/\n/g, '')}">
     ${d.code ?? ''}
`
        })()}
<script>
window.glitter_page='${req.query.page}';
window.redirct_tohome='/${link_prefix && `${link_prefix}/`}${redirect}';
</script>
</head>
`
    }
}
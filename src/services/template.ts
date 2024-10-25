import db from '../modules/database';
import {saasConfig} from "../config";
import exception from "../modules/exception";
import {IToken} from "../models/Auth.js";
import process from "process";
import {UtDatabase} from "../api-public/utils/ut-database.js";

export class Template {
    public token?: IToken;

    public async verifyPermission(appName: string) {
        const count = await db.execute(`
            select count(1)
            from \`${saasConfig.SAAS_NAME}\`.app_config
            where (user = ${this.token!.userID} and appName = ${db.escape(appName)})
        `, [])
        return count[0]["count(1)"] === 1
    }

    public async createPage(config: {
        appName: string, tag: string, group: string, name: string, config: any, page_config: any, copy: any, page_type: string,
        copyApp: string,replace?:boolean
    }) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception.BadRequestError("Forbidden", "No Permission.", null);
        }

        if (config.copy) {
            const data = (await db.execute(`
                select \`${saasConfig.SAAS_NAME}\`.page_config.page_config,
                       \`${saasConfig.SAAS_NAME}\`.page_config.config
                from \`${saasConfig.SAAS_NAME}\`.page_config
                where tag = ${db.escape(config.copy)}
                  and appName = ${db.escape(config.copyApp || config.appName)}
            `, []))[0];
            config.page_config = data['page_config']
            config.config = data['config']
        }
        try {
            await db.execute(`
                ${(config.replace) ? `replace`:'insert'} into \`${saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`, config,
                                                                     page_config, page_type)
                values (?, ?, ?, ?, ?, ?, ?, ?);
            `, [
                this.token!.userID,
                config.appName,
                config.tag,
                config.group,
                config.name,
                config.config ?? [],
                config.page_config ?? {},
                config.page_type ?? 'page'
            ])
            return true
        } catch (e: any) {
            throw exception.BadRequestError("Forbidden", "This page already exists.", null);
        }
    }

    public async updatePage(config: {
        appName: string, tag: string, group: string, name: string, config: any, page_config: any, id?: string,
        page_type: string,
        preview_image: string,
        favorite: number,
        updated_time:any
    }) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception.BadRequestError("Forbidden", "No Permission.", null);
        }
        try {
            const params: { [props: string]: any } = {};
            config.appName && (params["appName"] = config.appName)
            config.tag && (params["tag"] = config.tag)
            config.group && (params["group"] = config.group)
            config.page_type && (params["page_type"] = config.page_type)
            config.name && (params["name"] = config.name)
            config.config && (params["config"] = JSON.stringify(config.config))
            config.preview_image && (params['preview_image'] = config.preview_image)
            config.page_config && (params["page_config"] = JSON.stringify(config.page_config))
            config.favorite && (params['favorite'] = config.favorite)
            config.updated_time=new Date()
            let sql = `
                UPDATE \`${saasConfig.SAAS_NAME}\`.page_config
                SET ?
                WHERE 1 = 1
            `
            if (config.id) {
                sql += ` and \`id\` = ${config.id} `
            } else {
                sql += ` and \`tag\` = ${db.escape(config.tag)}`
            }
            sql += `and appName = ${db.escape(config.appName)}`
            await db.query(sql, [params])
            return true
        } catch (e: any) {
            throw exception.BadRequestError("Forbidden", "No permission." + e, null);
        }
    }

    public async deletePage(config: {
        appName: string, id?: string, tag?: string
    }) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception.BadRequestError("Forbidden", "No Permission.", null);
        }
        try {
            const params: { [props: string]: string } = {};

            let sql = (config.id) ? `
                delete
                from \`${saasConfig.SAAS_NAME}\`.page_config
                WHERE appName = ${db.escape(config.appName)}
                  and id = ${db.escape(config.id)}` : `
                delete
                from \`${saasConfig.SAAS_NAME}\`.page_config
                WHERE appName = ${db.escape(config.appName)}
                  and tag = ${db.escape(config.tag)}`
            console.log(sql)
            await db.execute(sql, [])
            return true
        } catch (e: any) {
            throw exception.BadRequestError("Forbidden", "No permission." + e, null);
        }
    }

    public async getTemplate(query: {
        app_name?: string,
        template_from: 'all' | 'me',
        page?: string,
        limit?: string
    }) {
        try {
            const sql = []
            query.template_from === 'me' && sql.push(`user = '${this.token!.userID}'`);
            query.template_from === 'me' && sql.push(`template_type in (3,2)`);
            query.template_from === 'all' && sql.push(`template_type = 2`);
            const data = await new UtDatabase(saasConfig.SAAS_NAME as string, `page_config`).querySql(sql, query as any, `
            id,userID,tag,\`group\`,name, page_type,  preview_image,appName,template_type,template_config
            `)
            return data
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public async postTemplate(config: { appName: string, data: any, tag: string }) {
        try {
            if (!(await this.verifyPermission(config.appName))) {
                throw exception.BadRequestError("Forbidden", "No Permission.", null);
            }
            let template_type = '0'
            if (config.data.post_to === 'all') {
                let officialAccount = (process.env.OFFICIAL_ACCOUNT ?? '').split(',')
                if (officialAccount.indexOf(`${this.token!.userID}`) !== -1) {
                    template_type = '2'
                } else {
                    template_type = '1'
                }
            } else if (config.data.post_to === 'me') {
                template_type = '3'
            }
            return (await db.execute(`update \`${saasConfig.SAAS_NAME}\`.page_config
                                      set template_config = ?,
                                          template_type=${template_type}
                                      where appName = ${db.escape(config.appName)}
                                        and tag = ?
            `, [config.data, config.tag]))['changedRows'] == true
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public static async getRealPage(query_page:string,appName:string): Promise<string> {
        query_page=query_page || ''
        let page = query_page;

        //當判斷是Blog時
        if (query_page.split('/')[0] === 'blogs' && query_page.split('/')[1]) {
              page = (await db.query(`SELECT *
                                   from \`${appName}\`.t_manager_post
                                   where content->>'$.tag'=${db.escape(query_page.split('/')[1])} and content->>'$.type'='article' and content->>'$.for_index'='true';`, []))[0].content.template;
        }

        //當判斷是Page時
        if (query_page.split('/')[0] === 'pages' && query_page.split('/')[1]) {
            page = (await db.query(`SELECT *
                                   from \`${appName}\`.t_manager_post
                                   where content->>'$.tag'=${db.escape(query_page.split('/')[1])} and content->>'$.type'='article' and content->>'$.for_index'='false' and (content->>'$.page_type'='page');`, []))[0].content.template;
        }
        //當判斷是Shop時
        if (query_page.split('/')[0] === 'shop' && query_page.split('/')[1]) {
            page = (await db.query(`SELECT *
                                   from \`${appName}\`.t_manager_post
                                   where content->>'$.tag'=${db.escape(query_page.split('/')[1])} and content->>'$.type'='article' and content->>'$.for_index'='false' and content->>'$.page_type'='shopping';`, []))[0].content.template;
        }

        //當判斷是隱形賣場時
        if (query_page.split('/')[0] === 'hidden' && query_page.split('/')[1]) {
            page = (await db.query(`SELECT *
                                   from \`${appName}\`.t_manager_post
                                   where content->>'$.tag'=${db.escape(query_page.split('/')[1])} and content->>'$.type'='article' and content->>'$.for_index'='false' and content->>'$.page_type'='hidden';`, []))[0].content.template;
        }
        //當判斷是分銷連結時
        if (query_page.split('/')[0] === 'distribution' && query_page.split('/')[1]) {
           const page=(await db.query(`SELECT *
                                   from \`${appName}\`.t_recommend_links where content->>'$.link'=?`, [query_page.split('/')[1]]))[0].content;
            return  (await Template.getRealPage((page.redirect as string).substring(1),appName as string))
        }

        //當判斷是Collection時
        if (query_page.split('/')[0] === 'collections' && query_page.split('/')[1]) {
            page = 'all-product'
        }
        //當判斷是商品頁時
        if (query_page.split('/')[0] === 'products' && query_page.split('/')[1]) {
            page = 'products'
        }
        //當判斷是CMS頁面時
        if (query_page === 'cms') {
            page = 'index'
        }
        return page
    }
    public async getPage(config: {
        appName?: string, tag?: string, group?: string, type?: string, page_type?: string, user_id?: string, me?: string, favorite?: string,
        preload?:boolean,
        id?:string
    }) {
        if(config.tag){
            config.tag=await Template.getRealPage(config.tag, config.appName!);
        }
        try {
            let sql = `select ${(config.tag || config.id) ? `*` : `id,userID,tag,\`group\`,name,page_type,preview_image,appName,page_config`}
                       from \`${saasConfig.SAAS_NAME}\`.page_config
                       where ${
                                     (() => {
                                         let query: string[] = [`1 = 1`];
                                         (config.user_id) && query.push(`userID=${config.user_id}`);
                                         (config.appName) && query.push(`appName=${db.escape(config.appName)}`);
                                         (config.id) && query.push(`id=${db.escape(config.id)}`);
                                         (config.tag) && query.push(` tag in (${config.tag.split(',').map((dd) => {
                                             return db.escape(dd)
                                         }).join(',')})`);
                                         (config.page_type) && query.push(`page_type=${db.escape(config.page_type)}`);
                                         (config.group) && query.push(`\`group\` in (${config.group.split(',').map((dd) => {
                                             return db.escape(dd)
                                         }).join(',')})`);
                                         if (config.favorite && config.favorite === 'true') {
                                             query.push(`favorite=1`)
                                         }
                                         if (config.me === 'true') {
                                             query.push(`userID = ${this.token!.userID}`)
                                         } else {
                                             // let officialAccount=(process.env.OFFICIAL_ACCOUNT ?? '').split(',')
                                             // query.push(`userID in (${officialAccount.map((dd)=>{
                                             //     return `${db.escape(dd)}`
                                             // }).join(',')})`)
                                         }
                                         return query.join(' and ')
                                     })()
                             }`

            if (config.type) {
                if (config.type === 'template') {
                    sql += ` and \`group\` != ${db.escape('glitter-article')}`
                } else if (config.type === 'article') {
                    sql += ` and \`group\` = 'glitter-article' `
                }
            }

            return await db.query(sql, [])
        } catch (e: any) {
            throw exception.BadRequestError("Forbidden", "No permission." + e, null);
        }
    }

    constructor(token?: IToken) {
        this.token = token
    }
}
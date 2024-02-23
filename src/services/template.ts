import db from '../modules/database';
import {saasConfig} from "../config";
import exception from "../modules/exception";
import {createAPP} from "../index";
import {IToken} from "../models/Auth.js";

export class Template {
    public token: IToken;

    public async verifyPermission(appName: string) {
        const count = await db.execute(`
            select count(1)
            from \`${saasConfig.SAAS_NAME}\`.app_config
            where (user = ${this.token.userID} and appName = ${db.escape(appName)})
        `, [])
        return count[0]["count(1)"] === 1
    }

    public async createPage(config: {
        appName: string, tag: string, group: string, name: string, config: any, page_config: any, copy: any,page_type:string,
        copyApp:string
    }) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception.BadRequestError("Forbidden", "No Permission.", null);
        }
        if (config.copy) {
            const data = (await db.execute(`
                select \`${saasConfig.SAAS_NAME}\`.page_config.page_config,
                       \`${saasConfig.SAAS_NAME}\`.page_config.config,
                from \`${saasConfig.SAAS_NAME}\`.page_config
                where tag = ${db.escape(config.copy)}
                  and appName = ${db.escape(config.copyApp || config.appName)}
            `, []))[0];
            config.page_config = data['page_config']
            config.config = data['config']
        }
        try {
            await db.execute(`
                insert into \`${saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`, config, page_config,page_type)
                values (?, ?, ?, ?, ?, ?, ?,?);
            `, [
                this.token.userID,
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
        preview_image:string,
        favorite:number
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
        appName: string, id?: string,tag?:string
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
                  and id = ${db.escape(config.id)}`:`
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

    public async getPage(config: {
        appName?: string, tag?: string, group?: string, type?: string, page_type?: string, user_id?: string,me?:string,favorite?:string
    }) {

        try {
            let sql = `select ${(config.tag) ? `*` : `id,userID,tag,\`group\`,name,page_type,preview_image,appName`}
                       from \`${saasConfig.SAAS_NAME}\`.page_config
                       where ${
                                     (() => {
                                         let query: string[] = [`1 = 1`];
                                         (config.user_id) && query.push(`userID=${config.user_id}`);
                                         (config.appName) && query.push(`appName=${db.escape(config.appName)}`);
                                         (config.tag) && query.push(` tag in (${config.tag.split(',').map((dd) => {
                                             return db.escape(dd)
                                         }).join(',')})`);
                                         (config.page_type) && query.push(`page_type=${db.escape(config.page_type)}`);
                                         (config.group) && query.push(`\`group\` in (${config.group.split(',').map((dd) => {
                                             return db.escape(dd)
                                         }).join(',')})`);
                                         if(config.page_type === 'module'){
                                             if(config.favorite&&config.favorite==='true'){
                                                 query.push(`favorite=1`)
                                             }
                                             if (config.me==='true' ) {
                                                 query.push(`userID = ${this.token.userID}`)
                                             }else{
                                                 let officialAccount=(process.env.OFFICIAL_ACCOUNT ?? '').split(',')
                                                 query.push(`userID in (${officialAccount.map((dd)=>{
                                                     return `${db.escape(dd)}`
                                                 }).join(',')})`)
                                             }
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

    constructor(token: IToken) {
        this.token = token
    }
}
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
        appName: string, tag: string, group: string, name: string, config: any,page_config:any,copy:any
    }) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception.BadRequestError("Forbidden", "No Permission.", null);
        }
        if(config.copy){
            const data=(await db.execute(`
                select \`${saasConfig.SAAS_NAME}\`.page_config.page_config,
                       \`${saasConfig.SAAS_NAME}\`.page_config.config 
                from  \`${saasConfig.SAAS_NAME}\`.page_config where tag=${db.escape(config.copy)} and appName = ${db.escape(config.appName)}
            `, []))[0];
            config.page_config=data['page_config']
            config.config=data['config']
        }
        try {
            await db.execute(`
                insert into \`${saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`, config,page_config)
                values (?, ?, ?, ?, ?, ?,?);
            `, [
                this.token.userID,
                config.appName,
                config.tag,
                config.group,
                config.name,
                config.config ?? [],
                config.page_config ?? {}
            ])
            return true
        } catch (e: any) {
            throw exception.BadRequestError("Forbidden", "This page already exists.", null);
        }
    }

    public async updatePage(config: {
        appName: string, tag: string, group: string, name: string,config:any,page_config:any,id?:string
    }) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception.BadRequestError("Forbidden", "No Permission.", null);
        }
        try {
            const params: { [props: string]: string } = {};
            config.appName && (params["appName"] = config.appName)
            config.tag && (params["tag"] = config.tag)
            config.group && (params["group"] = config.group)
            config.name && (params["name"] = config.name)
            config.config && (params["config"] = JSON.stringify(config.config))
            config.page_config &&  (params["page_config"] = JSON.stringify(config.page_config))
            let sql=`
                UPDATE \`${saasConfig.SAAS_NAME}\`.page_config
                SET ?
                WHERE 1 = 1 
            `
            if(config.id){
                sql+=` and \`id\` = ${config.id} `
            }else{
                sql+=` and \`tag\` = ${db.escape(config.tag)}`
            }
            sql+=`and appName = ${db.escape(config.appName)}`
            await db.query(sql, [params])
            return true
        } catch (e: any) {
            throw exception.BadRequestError("Forbidden", "No permission." + e, null);
        }
    }
    public async deletePage(config: {
        appName: string, id?:string
    }) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception.BadRequestError("Forbidden", "No Permission.", null);
        }
        try {
            const params: { [props: string]: string } = {};
            let sql=`
                delete from \`${saasConfig.SAAS_NAME}\`.page_config
                WHERE appName = ${db.escape(config.appName)} and id=${db.escape(config.id)}`
            console.log(sql)
            await db.execute(sql, [])
            return true
        } catch (e: any) {
            throw exception.BadRequestError("Forbidden", "No permission." + e, null);
        }
    }

    public async getPage(config: {
        appName: string, tag?: string
    }) {
        try {
            let sql = `select *
                       from \`${saasConfig.SAAS_NAME}\`.page_config
                       where 1 = 1
                         and appName = ${db.escape(config.appName)}`
            if (config.tag){
                sql+=` and tag=${db.escape(config.tag)}`
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
import {IToken} from "../models/Auth.js";
import db from "../modules/database.js";
import {saasConfig} from "../config.js";
import exception from "../modules/exception.js";
import process from "process";
import {UtDatabase} from "../api-public/utils/ut-database.js";

export class Page {
    constructor(token: IToken) {
        this.token = token
    }
    public token: IToken;

    public async verifyPermission(appName: string) {
        const count = await db.execute(`
            select count(1)
            from \`${saasConfig.SAAS_NAME}\`.app_config
            where (user = ${this.token.userID} and appName = ${db.escape(appName)})
        `, [])
        return count[0]["count(1)"] === 1
    }

    public async postTemplate(config: { appName: string, data: any, tag: string }) {
        try {
            if (!(await this.verifyPermission(config.appName))) {
                throw exception.BadRequestError("Forbidden", "No Permission.", null);
            }
            let template_type = '0'
            if (config.data.post_to === 'all') {
                let officialAccount = (process.env.OFFICIAL_ACCOUNT ?? '').split(',')
                if (officialAccount.indexOf(`${this.token.userID}`) !== -1) {
                    template_type = '2'
                } else {
                    template_type = '1'
                }
            } else if (config.data.post_to === 'me') {
                template_type = '3'
            }else if (config.data.post_to === 'project') {
                template_type = '4'
            }
            const data= (await db.execute(`update \`${saasConfig.SAAS_NAME}\`.page_config
                                      set template_config = ?,
                                          template_type=${template_type}
                                      where appName = ${db.escape(config.appName)}
                                        and tag = ?
            `, [config.data, config.tag]))
            const id=(await db.query(`select * from \`${saasConfig.SAAS_NAME}\`.page_config where appName = ${db.escape(config.appName)}
                                                                                             and tag = ?`,[config.tag]))[0]['id']
            await db.execute(`delete from  \`${saasConfig.SAAS_NAME}\`.t_template_tag where type=? and bind=?`,[
                'page',id
            ]);
            for (const b of (config.data.tag ?? [])){
                await db.query(`insert into \`${saasConfig.SAAS_NAME}\`.t_template_tag set ?`,[
                    {
                        type:'page',
                        tag:b,
                        bind:id
                    }
                ])
            }
            return data['changedRows'] == true
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }
    public async getTemplate(query: {
        template_from: 'all' | 'me' | 'project',
        type:'page' | 'module' | 'article' | 'blog',
        page?: string,
        limit?: string,
        tag?:string,
        search:string
    }) {
        try {
            const sql = []
            query.template_from === 'me' && sql.push(`userID = '${this.token.userID}'`);
            query.template_from === 'me' && sql.push(`template_type in (3,2)`);
            query.template_from === 'project' && sql.push(`template_type = 4`);
            query.template_from === 'all' && sql.push(`template_type = 2`);
            query.type && sql.push(`page_type = ${db.escape(query.type)}`)
            query.tag && sql.push(`id in (SELECT bind FROM  \`${saasConfig.SAAS_NAME}\`.t_template_tag where type='page' and tag in (${query.tag.split(',').map((dd)=>{
                return db.escape(dd)
            }).join(',')}))`);
            query.search && sql.push(`JSON_EXTRACT(template_config, '$.name') like ${db.escape(query.search)} or id in (SELECT bind FROM  \`${saasConfig.SAAS_NAME}\`.t_template_tag where type='page' and tag like '%${query.search}%')`);
            console.log(`sql->`,sql)
            return await new UtDatabase(saasConfig.SAAS_NAME as string, `page_config`).querySql(sql, query as any, `
            id,userID,tag,\`group\`,name, page_type, preview_image,appName,template_type,template_config
            `)
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public async getTagList(type:string,template_from:string){
        try {
            const tagList=await db.query(`SELECT tag FROM  \`${saasConfig.SAAS_NAME}\`.t_template_tag where type='page' and bind in (
    select id from \`${saasConfig.SAAS_NAME}\`.page_config where page_type=${db.escape(type)} and ${(()=>{
        const sql = []
        template_from === 'me' && sql.push(`userID = '${this.token.userID}'`);
        template_from === 'me' && sql.push(`template_type in (3,2)`);
        template_from === 'all' && sql.push(`template_type = 2`);
        return sql.map((dd)=>{
            return ` (${dd}) `
        }).join(` & `)
    })()}
                ) group by tag;`,[]);
            return {
                result:tagList
            };
        }catch (e:any){
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

}
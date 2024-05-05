import db from '../modules/database';
import exception from "../modules/exception";
import {saasConfig} from "../config";
import tool from "./tool";
import UserUtil from "../utils/UserUtil";
import {createAPP} from "../index.js";
import AWS from "aws-sdk";
import {IToken} from "../models/Auth.js";
import config from "../config.js";
import fs from "fs";
import {exec} from "child_process";
import {Ssh} from "../modules/ssh.js";
import {NginxConfFile} from "nginx-conf";
import * as process from "process";
import {ApiPublic} from "../api-public/services/public-table-check.js";
import {BackendService} from "./backend-service.js";
import {UtPermission} from "../api-public/utils/ut-permission.js";
import {Template} from "./template.js";

export class App {
    public token?: IToken;

    public static getAdConfig(app: string, key: string) {
        return new Promise<any>(async (resolve, reject) => {
            const data = await db.query(`select \`value\`
                                         from \`${config.DB_NAME}\`.private_config
                                         where app_name = '${app}'
                                           and \`key\` = ${db.escape(key)}`, [])
            resolve((data[0]) ? data[0]['value'] : {})
        })
    }

    public async createApp(config: { appName: string, copyApp: string, copyWith: string[], brand: string }) {
        try {
            config.copyWith = config.copyWith ?? []
            const count = await db.execute(`
                select count(1)
                from \`${saasConfig.SAAS_NAME}\`.app_config
                where appName = ${db.escape(config.appName)}
            `, [])
            if (count[0]["count(1)"] === 1) {
                throw  exception.BadRequestError('Forbidden', 'This app already be used.', null);
            }
            let copyAppData: any = undefined
            let copyPageData: any = undefined
            let privateConfig: any = undefined
            if (config.copyApp) {
                await ApiPublic.createScheme(config.copyApp)
                copyAppData = (await db.execute(`select *
                                                 from \`${saasConfig.SAAS_NAME}\`.app_config
                                                 where appName = ${db.escape(config.copyApp)}`, []))[0];
                copyPageData = (await db.execute(`select *
                                                  from \`${saasConfig.SAAS_NAME}\`.page_config
                                                  where appName = ${db.escape(config.copyApp)}`, []));
                privateConfig = (await db.execute(`select *
                                                   from \`${saasConfig.SAAS_NAME}\`.private_config
                                                   where app_name = ${db.escape(config.copyApp)} `, []));
            }

            await ApiPublic.createScheme(config.appName)
            const trans = await db.Transaction.build();
            await trans.execute(`insert into \`${saasConfig.SAAS_NAME}\`.app_config (user, appName, dead_line, \`config\`, brand)
                                 values (?, ?, ?,
                                         ${db.escape(JSON.stringify((copyAppData && copyAppData.config) || {}))},
                                         ${db.escape(config.brand ?? saasConfig.SAAS_NAME)})`, [
                this.token!.userID,
                config.appName,
                addDays(new Date(), saasConfig.DEF_DEADLINE)
            ]);
            if (config.copyWith.indexOf('checkout') !== -1) {
                for (const dd of (await db.query(`SELECT *
                                                  FROM \`${config.copyApp}\`.t_checkout`, []))) {
                    dd.orderData = dd.orderData && JSON.stringify(dd.orderData)
                    await trans.execute(`
                        insert into \`${config.appName}\`.t_checkout
                        SET ?;
                    `, [
                        dd
                    ]);
                }
            }
            if (config.copyWith.indexOf('manager_post') !== -1) {
                for (const dd of (await db.query(`SELECT *
                                                  FROM \`${config.copyApp}\`.t_manager_post`, []))) {
                    dd.content = dd.content && JSON.stringify(dd.content)
                    dd.userID = this.token!.userID
                    await trans.execute(`
                        insert into \`${config.appName}\`.t_manager_post
                        SET ?;
                    `, [
                        dd
                    ]);
                }
            }
            if (config.copyWith.indexOf('user_post') !== -1) {
                for (const dd of (await db.query(`SELECT *
                                                  FROM \`${config.copyApp}\`.t_post`, []))) {
                    dd.content = dd.content && JSON.stringify(dd.content)
                    await trans.execute(`
                        insert into \`${config.appName}\`.t_post
                        SET ?;
                    `, [
                        dd
                    ]);
                }
            }
            if (config.copyWith.indexOf('user') !== -1) {
                for (const dd of (await db.query(`SELECT *
                                                  FROM \`${config.copyApp}\`.t_user`, []))) {
                    dd.userData = dd.userData && JSON.stringify(dd.userData)
                    await trans.execute(`
                        insert into \`${config.appName}\`.t_user
                        SET ?;
                    `, [
                        dd
                    ]);
                }
            }
            for (const dd of (await db.query(`SELECT *
                                              FROM \`${config.copyApp}\`.t_global_event`, []))) {
                dd.json = dd.json && JSON.stringify(dd.json)
                await trans.execute(`
                    insert into \`${config.appName}\`.t_global_event
                    SET ?;
                `, [
                    dd
                ]);
            }
            if (config.copyWith.indexOf('public_config') !== -1) {
                for (const dd of (await db.query(`SELECT *
                                                  FROM \`${config.copyApp}\`.public_config`, []))) {
                    dd.value = dd.value && JSON.stringify(dd.value)
                    await trans.execute(`
                        insert into \`${config.appName}\`.public_config
                        SET ?;
                    `, [
                        dd
                    ]);
                }
                for (const dd of (await db.query(`SELECT *
                                                  FROM \`${config.copyApp}\`.t_user_public_config`, []))) {
                    dd.value = dd.value && JSON.stringify(dd.value)
                    await trans.execute(`
                        insert into \`${config.appName}\`.t_user_public_config
                        SET ?;
                    `, [
                        dd
                    ]);
                }
            }
            if (privateConfig) {
                for (const dd of privateConfig) {
                    await trans.execute(`
                        insert into \`${saasConfig.SAAS_NAME}\`.private_config (\`app_name\`, \`key\`, \`value\`, updated_at)
                        values (?, ?, ?, ?);
                    `, [
                        config.appName,
                        dd.key,
                        JSON.stringify(dd.value),
                        new Date()
                    ]);
                }
            }
            if (copyPageData) {
                for (const dd of copyPageData) {
                    await trans.execute(`
                        insert into \`${saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`,
                                                                             \`config\`, \`page_config\`, page_type)
                        values (?, ?, ?, ?, ?, ${db.escape(JSON.stringify(dd.config))},
                                ${db.escape(JSON.stringify(dd.page_config))}, ${db.escape(dd.page_type)});
                    `, [
                        this.token!.userID,
                        config.appName,
                        dd.tag,
                        dd.group || '未分類',
                        dd.name
                    ]);
                }
            } else {
                await trans.execute(`
                    insert into \`${saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`,
                                                                         \`config\`, \`page_config\`)
                    values (?, ?, ?, ?, ?, ${db.escape(JSON.stringify({}))}, ${db.escape(JSON.stringify({}))});
                `, [
                    this.token!.userID,
                    config.appName,
                    'index',
                    '',
                    '首頁',
                ]);
            }
            await trans.commit()
            await createAPP(config)
            return true
        } catch (e: any) {
            console.log(JSON.stringify(e))
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public async getAPP(query: {
        app_name?: string,
    }) {
        try {
            console.log(`
                SELECT *
                FROM \`${saasConfig.SAAS_NAME}\`.app_config
                where ${(() => {
                    const sql = [`user = '${this.token!.userID}'`]
                    if (query.app_name) {
                        sql.push(` appName='${query.app_name}' `)
                    }
                    return sql.join(' and ')
                })()};
            `)
            return (await db.execute(`
                SELECT *
                FROM \`${saasConfig.SAAS_NAME}\`.app_config
                where ${(() => {
                    const sql = [`user = '${this.token!.userID}'`]
                    if (query.app_name) {
                        sql.push(` appName='${query.app_name}' `)
                    }
                    return sql.join(' and ')
                })()};
            `, []))
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public async getTemplate(query: {
        app_name?: string,
        template_from: 'all' | 'me'
    }) {
        try {
            return (await db.execute(`
                SELECT user, appName, created_time, dead_line, brand, template_config, template_type
                FROM \`${saasConfig.SAAS_NAME}\`.app_config
                where ${(() => {
                    const sql = []
                    query.template_from === 'me' && sql.push(`user = '${this.token!.userID}'`);
                    query.template_from === 'me' && sql.push(`template_type in (3,2)`);
                    query.template_from === 'all' && sql.push(`template_type = 2`);
                    return sql.map((dd) => {
                        return `(${dd})`
                    }).join(' and ')
                })()};
            `, []))
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public async getAppConfig(config: { appName: string }) {
        try {
            const data = (await db.execute(`
                SELECT config, \`dead_line\`, \`template_config\`, \`template_type\`
                FROM \`${saasConfig.SAAS_NAME}\`.app_config
                where appName = ${db.escape(config.appName)};
            `, []))[0]
            const pluginList = data['config'] ?? {}
            pluginList.dead_line = data.dead_line
            pluginList.pagePlugin = pluginList.pagePlugin ?? []
            pluginList.eventPlugin = pluginList.eventPlugin ?? []
            pluginList.template_config = data.template_config;
            pluginList.template_type = data.template_type;
            return pluginList
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public async getOfficialPlugin() {
        try {
            return ((await db.execute(`
                SELECT *
                FROM \`${saasConfig.SAAS_NAME}\`.official_component;
            `, [])))
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public static async checkBrandAndMemberType(app: string) {
        let brand = (await db.query(`SELECT brand
                                     FROM \`${saasConfig.SAAS_NAME}\`.app_config
                                     where appName = ? `, [app]))[0]['brand']
        console.log(`brand-->`, brand)
        const userID = (await db.query(`SELECT user
                                        FROM \`${saasConfig.SAAS_NAME}\`.app_config
                                        where appName = ?`, [app]))[0]['user'];
        const userData = (await db.query(`SELECT userData
                                          FROM \`${brand}\`.t_user
                                          where userID = ? `, [userID]))[0];
        return {
            memberType: userData.userData.menber_type,
            brand: brand,
            userData:userData.userData
        };
    }

    public static async preloadPageData(appName:string,page:string){
        const app=new App();
        const preloadData:{
            component:any,
            appConfig:any
        }={
            component:[],
            appConfig:(await app.getAppConfig({
                appName:appName
            }))
        }
        const pageData=(await (new Template(undefined).getPage({
            appName:appName,
            tag:page
        })))[0];
        preloadData.component.push(pageData)
        async function loop(array: any) {
            for (const dd of array) {
                if (dd.type === 'container') {
                    await loop(dd.data.setting)
                } else if (dd.type === 'component') {
                    if(!dd.data.refer_app){
                        const pageData=(await (new Template(undefined).getPage({
                            appName:appName,
                            tag:dd.data.tag
                        })))[0]
                        if(pageData&&pageData.config){
                            preloadData.component.push(pageData)
                            await loop(pageData.config ?? [])
                        }
                    }

                }
            }
        }
        (await loop(pageData.config));

        let mapPush:any={}
        mapPush['getPlugin']={callback:[],data:{response:{data:preloadData.appConfig,result:true}},isRunning:true}
        preloadData.component.map((dd:any)=>{
            mapPush['getPageData-'+dd.tag]={callback:[],isRunning:true,data:{response: {result:[dd]}}}
        })
        return mapPush
    }

    public async setAppConfig(config: { appName: string, data: any }) {
        try {
            const official = (await db.query(`SELECT count(1)
                                              FROM \`${saasConfig.SAAS_NAME}\`.t_user
                                              where userID = ?`, [this.token!.userID, 'LION']))[0]['count(1)'] == 1;
            if (official) {
                const trans = await db.Transaction.build()
                await trans.execute(`delete
                                     from \`${saasConfig.SAAS_NAME}\`.official_component
                                     where app_name = ?`, [config.appName])
                for (const b of (config.data.lambdaView ?? [])) {
                    await trans.execute(`insert into \`${saasConfig.SAAS_NAME}\`.official_component
                                         set ?`, [
                        {
                            key: b.key,
                            group: b.name,
                            userID: this.token!.userID,
                            app_name: config.appName,
                            url: b.path,
                        }
                    ])
                }
                await trans.commit();
            }

            return (await db.execute(`update \`${saasConfig.SAAS_NAME}\`.app_config
                                      set config=?
                                      where appName = ${db.escape(config.appName)}
                                        and user = '${this.token!.userID}'
            `, [config.data]))['changedRows'] == true
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }


    public async postTemplate(config: { appName: string, data: any }) {
        try {
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
            return (await db.execute(`update \`${saasConfig.SAAS_NAME}\`.app_config
                                      set template_config = ?,
                                          template_type=${template_type}
                                      where appName = ${db.escape(config.appName)}
                                        and user = '${this.token!.userID}'
            `, [config.data]))['changedRows'] == true
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public async setDomain(config: {
        appName: string,
        domain: string
    }) {
        let checkExists = (await db.query(`select count(1)
                                           from \`${saasConfig.SAAS_NAME}\`.app_config
                                           where domain =?
                                             and user !=?`, [config.domain, this.token!.userID]))['count(1)'] > 0;
        if (checkExists) {
            throw exception.BadRequestError('BAD_REQUEST', 'this domain already on use.', null);
        }
        try {
            const data = await Ssh.readFile('/etc/nginx/sites-enabled/default.conf')
            let result: string = await new Promise((resolve, reject) => {
                NginxConfFile.createFromSource(data as string, (err, conf) => {
                    const server: any = []
                    for (const b of conf!.nginx.server as any) {
                        if (b.server_name.toString().indexOf(config.domain) === -1) {
                            console.log(b.server_name.toString())
                            server.push(b)
                        }
                    }
                    conf!.nginx.server = server
                    resolve(conf!.toString())
                })
            })
            result += `\n\nserver {
       server_name ${config.domain};
    location / {
       proxy_pass http://127.0.0.1:3080/${config.appName}/;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }
}`
            fs.writeFileSync('/nginx.config', result);
            const response = await new Promise((resolve, reject) => {
                Ssh.exec([
                    `sudo docker cp $(sudo docker ps --filter "expose=3080" --format "{{.ID}}"):/nginx.config /etc/nginx/sites-enabled/default.conf`,
                    `sudo certbot --nginx -d ${config.domain} --non-interactive --agree-tos -m sam38124@gmail.com`,
                    `sudo nginx -s reload`
                ]).then((res: any) => {
                    resolve(res && res.join('').indexOf('Successfully') !== -1)
                })
            });
            if (!response) {
                throw exception.BadRequestError('BAD_REQUEST', '網域驗證失敗!', null);
            }
            ((await db.execute(`
                update \`${saasConfig.SAAS_NAME}\`.app_config
                set domain=?
                where domain = ?
            `, [null, config.domain])))
            return ((await db.execute(`
                update \`${saasConfig.SAAS_NAME}\`.app_config
                set domain=?
                where appName = ?
            `, [config.domain, config.appName])))
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public async deleteAPP(config: { appName: string }) {
        try {
           try{
               await (new BackendService(config.appName).stopServer());
           }catch (e) {

           }
            (await db.execute(`delete
                               from \`${saasConfig.SAAS_NAME}\`.app_config
                               where appName = ${db.escape(config.appName)}
                                 and user = '${this.token!.userID}'`, []));
            (await db.execute(`delete
                               from \`${saasConfig.SAAS_NAME}\`.page_config
                               where appName = ${db.escape(config.appName)}
                                 and userID = '${this.token!.userID}'`, []));
            (await db.execute(`delete
                               from \`${saasConfig.SAAS_NAME}\`.private_config
                               where app_name = ${db.escape(config.appName)}
            `, []));
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }


    constructor(token?: IToken) {
        this.token = token;
    }
}

function addDays(dat: Date, addDays: number) {
    var date = new Date(dat);
    date.setDate(date.getDate() + addDays);
    return date;
}
import db from '../modules/database';
import exception from "../modules/exception";
import {saasConfig} from "../config";
import tool from "./tool";
import UserUtil from "../utils/UserUtil";
import {createAPP} from "../index.js";
import AWS from "aws-sdk";
import {IToken} from "../models/Auth.js";
import config from "../config.js";

export class App {
    public token: IToken;

    public static getAdConfig(app: string, key: string) {
        return new Promise<any>(async (resolve, reject) => {
            const data = await db.query(`select \`value\`
                                         from \`${config.DB_NAME}\`.private_config
                                         where app_name = '${app}'
                                           and \`key\` = ${db.escape(key)}`, [])
            resolve((data[0]) ? data[0]['value'] : {})
        })
    }

    public async createApp(config: { domain: string, appName: string, copyApp: string }) {
        try {
            const count = await db.execute(`
                select count(1)
                from \`${saasConfig.SAAS_NAME}\`.app_config
                where appName = ${db.escape(config.appName)} || \`domain\` = ${db.escape(config.domain)}
            `, [])
            if (count[0]["count(1)"] === 1) {
                throw  exception.BadRequestError('Forbidden', 'This app already be used.', null);
            }
            let copyAppData: any = undefined
            let copyPageData: any = undefined
            let privateConfig: any = undefined
            if (config.copyApp) {
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
            const trans = await db.Transaction.build();
            await trans.execute(`insert into \`${saasConfig.SAAS_NAME}\`.app_config (domain, user, appName, dead_line, \`config\`)
                                 values (?, ?, ?, ?,
                                         ${db.escape(JSON.stringify((copyAppData && copyAppData.config) || {}))})`, [
                config.domain,
                this.token.userID,
                config.appName,
                addDays(new Date(), saasConfig.DEF_DEADLINE)
            ]);
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
                                                                             \`config\`, \`page_config\`)
                        values (?, ?, ?, ?, ?, ${db.escape(JSON.stringify(dd.config))},
                                ${db.escape(JSON.stringify(dd.page_config))});
                    `, [
                        this.token.userID,
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
                    this.token.userID,
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

    public async getAPP() {
        try {
            return (await db.execute(`
                SELECT *
                FROM \`${saasConfig.SAAS_NAME}\`.app_config
                where user = '${this.token.userID}';
            `, []))
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public async getAppConfig(config: { appName: string }) {
        try {
            const pluginList = ((await db.execute(`
                SELECT config
                FROM \`${saasConfig.SAAS_NAME}\`.app_config
                where appName = '${config.appName}';
            `, []))[0]['config']) ?? {}
            pluginList.pagePlugin = pluginList.pagePlugin ?? []
            pluginList.eventPlugin = pluginList.eventPlugin ?? []
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

    public async setAppConfig(config: { appName: string, data: any }) {
        try {
            console.log(`lambdaView--`, config.data.lambdaView)
            const official = (await db.query(`SELECT count(1)
                                              FROM \`${saasConfig.SAAS_NAME}\`.user
                                              where userID = ?
                                                and company = ?`, [this.token.userID, 'LION']))[0]['count(1)'] == 1;
            if (official) {
                const trans = await db.Transaction.build()
                await trans.execute(`delete from \`${saasConfig.SAAS_NAME}\`.official_component where app_name=?`,[config.appName])
                for (const b of (config.data.lambdaView ?? [])) {
                    await trans.execute(`insert into \`${saasConfig.SAAS_NAME}\`.official_component
                                         set ?`, [
                        {
                            key:b.key,
                            group:b.name,
                            userID: this.token.userID,
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
                                        and user = '${this.token.userID}'
            `, [config.data]))['changedRows'] == true
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public async deleteAPP(config: { appName: string }) {
        try {
            (await db.execute(`delete
                               from \`${saasConfig.SAAS_NAME}\`.app_config
                               where appName = ${db.escape(config.appName)}
                                 and user = '${this.token.userID}'`, []));
            (await db.execute(`delete
                               from \`${saasConfig.SAAS_NAME}\`.page_config
                               where appName = ${db.escape(config.appName)}
                                 and userID = '${this.token.userID}'`, []));
            (await db.execute(`delete
                               from \`${saasConfig.SAAS_NAME}\`.private_config
                               where app_name = ${db.escape(config.appName)}`, []));
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }


    constructor(token: IToken) {
        this.token = token;
    }
}

function addDays(dat: Date, addDays: number) {
    var date = new Date(dat);
    date.setDate(date.getDate() + addDays);
    return date;
}
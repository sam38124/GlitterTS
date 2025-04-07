import path from "path";
import admin from "firebase-admin";
import {ConfigSetting} from "../config";
import db from "../modules/database";
import {WebSocket} from "../services/web-socket.js";
import { CaughtError } from './caught-error.js';

export class Firebase {
    public app: string = ''

    constructor(app: string) {
        this.app = app;
    }

    public static async initial() {
        console.log(`fireBaseInitial:${admin.credential.cert(path.resolve(ConfigSetting.config_path, `../${process.env.firebase}`))}`)
        admin.initializeApp({
            credential: admin.credential.cert(path.resolve(ConfigSetting.config_path, `../${process.env.firebase}`))
        }, 'glitter');
        admin.initializeApp({
            credential: admin.credential.cert(path.resolve(ConfigSetting.config_path, `../${process.env.firebase}`))
        });
    }

    public static async appRegister(cf: {
        appID: string,
        appName: string,
        type: 'android' | 'ios'
    }) {
        try {
            if (cf.type === 'ios') {
                // 註冊 iOS 應用
                await admin
                    .projectManagement().createIosApp(cf.appID, cf.appName)
            } else {
                // 註冊 Android 應用
                await admin
                    .projectManagement().createAndroidApp(cf.appID, cf.appName)
            }
        } catch (e) {

        }
    }

    public static async getConfig(cf: {
        appID: string,
        type: 'android' | 'ios',
        appDomain: string
    }) {
        try {
            if (cf.type === 'ios') {
                for (const b of (await (admin
                    .projectManagement().listIosApps()))) {
                    if ((await b.getMetadata()).bundleId === cf.appID) {
                        await b.setDisplayName(cf.appDomain)
                        return (await b.getConfig())
                    }
                }
            } else {
                for (const b of (await (admin
                    .projectManagement().listAndroidApps()))) {
                    if ((await b.getMetadata()).packageName === cf.appID) {
                        await b.setDisplayName(cf.appDomain)
                        return (await b.getConfig())
                    }
                }
            }
        } catch (e) {
            console.log(e)
            return ''
        }
    }

    public async sendMessage(cf: {
        token?: string | string[],
        userID?: string,
        title: string,
        tag: string,
        link: string,
        body: string,
        app?: string,
        pass_store?:boolean
    }) {
        cf.body=cf.body.replace(/<br\s*\/?>/gi, '\n');
        if(cf.userID){
            WebSocket.noticeChangeMem[cf.userID] && WebSocket.noticeChangeMem[cf.userID].map((d2) => {
                d2.callback({
                    type: 'notice_count_change',
                });
            })
        }
        return new Promise(async (resolve, reject) => {
            if (cf.userID) {
                cf.token = (await db.query(`SELECT deviceToken
                                            FROM \`${cf.app || this.app}\`.t_fcm
                                            where userID = ?;`, [cf.userID])).map((dd: any) => {
                    return dd.deviceToken
                });
                const user_cf = (((await db.query(`select \`value\`
                                                   from \`${cf.app || this.app}\`.t_user_public_config
                                                   where \`key\` ='notify_setting' and user_id=?`, [cf.userID]))[0]) ?? {value: {}}).value;
                if (`${user_cf[cf.tag]}` !== 'false') {
                    if (cf.userID && cf.tag && cf.title && cf.body && cf.link && !cf.pass_store) {
                        await db.query(`insert into \`${cf.app || this.app}\`.t_notice (user_id, tag, title, content, link)
                                        values (?, ?, ?, ?, ?)`, [
                            cf.userID,
                            cf.tag,
                            cf.title,
                            cf.body,
                            cf.link
                        ])
                    }
                } else {
                    resolve(true)
                    return
                }

            }
            if (typeof cf.token === 'string') {
                cf.token = [cf.token]
            }
            if (Array.isArray(cf.token)) {
                for (const token of cf.token) {
                    try {
                        admin.apps.find((dd) => {
                            return dd?.name === 'glitter'
                        })!.messaging().send({
                            notification: {
                                title: cf.title,
                                body: cf.body.replace(/<br>/g,''),
                            },
                            android: {
                                notification: {
                                    sound: 'default'
                                },
                            },
                            apns: {
                                payload: {
                                    aps: {
                                        sound: 'default'
                                    },
                                },
                            },
                            data: {
                                link: `${cf.link || ''}`
                            },
                            "token": token!
                        }).then((response: any) => {
                            console.log('成功發送推播：', response);
                        }).catch((error: any) => {
                            console.error('發送推播時發生錯誤：', error);
                        })
                    }catch (e:any) {
                        CaughtError.warning('fcm',`firebase->74`,`${e}`)
                    }

                }
            }
            resolve(true)
        })

    }
}
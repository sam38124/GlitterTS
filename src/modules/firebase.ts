import path from "path";
import admin from "firebase-admin";
import {ConfigSetting} from "../config";
import db from "../modules/database";
export class Firebase {
    public app:string=''
    constructor(app:string) {
        this.app=app;
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
                // 註冊 iOS 應用
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
                    if ((await b.getMetadata()).projectId === cf.appID) {
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

    public  async sendMessage(cf:{
        token?:string,
        userID?:string,
        title:string,
        body:string,
    }) {
        return new Promise(async (resolve, reject)=>{
            if(cf.userID){
                const us=(await db.query(`SELECT deviceToken FROM \`${this.app}\`.t_fcm;`,[]))[0]
                cf.token=us &&us['deviceToken']
            }
            if(cf.token){
                admin.apps.find((dd) => {
                    return dd?.name === 'glitter'
                })!.messaging().send({
                    notification: {
                        title: cf.title,
                        body: cf.body
                    },
                    "token":cf.token!
                }).then((response: any) => {
                    resolve(true)
                    console.log('成功發送推播：', response);
                }).catch((error: any) => {
                    resolve(false)
                    console.error('發送推播時發生錯誤：', error);
                })
            }

        })

    }
}
import {Private_config} from "../../services/private_config.js";
import db from "../../modules/database.js";
import {User} from "./user.js";
import {Firebase} from "../../modules/firebase.js";

export class CustomCode {
    public appName: string = ''

    constructor(appName: string) {
        this.appName = appName;
    }

    public async loginHook(config: any) {
        await this.execute('glitter_login_webhook', config)
    }

    public async checkOutHook(config: any) {
        await this.execute('glitter_finance_webhook', config)
    }


    public async execute(key: string, config: {
        userData?: any,
        cartData?: any,
        userID?:string
        sql?: any,
        fcm?:any
    }) {
        const sqlData=(await Private_config.getConfig({
            appName: this.appName, key: key
        }))
        if(!sqlData[0] || !sqlData[0].value){
            return
        }
        const webHook = sqlData[0].value.value
        const evalString = `
                return {
                    execute:(obj)=>{
                      ${webHook}
                    }
                }
                `
        await db.queryLambada({
            database: this.appName
        }, async (sql) => {
            let originUserData = config.userData && JSON.stringify(config.userData.userData);
            let userID = config.userData && config.userData.userID;
            const myFunction = new Function(evalString);
            config.userID=userID
            config.sql = sql;
            config.userData = config.userData && config.userData.userData;
            config.fcm = new Firebase(this.appName);
            (await (myFunction().execute(config)));
            if (config.userData && (JSON.stringify(config.userData) !== originUserData)) {
                (await (new User(this.appName).updateUserData(userID, {
                    userData: config.userData
                }, true)));
            }

        })
    }
}
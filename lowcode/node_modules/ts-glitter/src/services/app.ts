import db from '../modules/database';
import exception from "../modules/exception";
import {saasConfig} from "../config";
import tool from "./tool";
import UserUtil from "../utils/UserUtil";

export class App {
    public token: IToken;

    public async createApp(config: { domain: string, appName: string }) {
        try {
           const count=await db.execute(`
                select count(1)
                from \`${saasConfig.SAAS_NAME}\`.app_config
                where (user=${this.token.userID} and appName=${db.escape(config.appName)}) || (\`domain\`=${db.escape(config.domain)})
            `, [])
            if(count[0]["count(1)"]===1){
                throw  exception.BadRequestError('Forbidden', 'This app already be used.', null);
            }
            await db.execute(`insert into \`${saasConfig.SAAS_NAME}\`.app_config (domain, user, appName, dead_line)
                              values (?, ?, ?, ?)`, [
                config.domain,
                this.token.userID,
                config.appName,
                addDays(new Date(), saasConfig.DEF_DEADLINE)
            ])
            return true
        } catch (e: any) {
            console.log(JSON.stringify(e))
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST',  e, null);
        }

    }


    public async getAppConfig(config:{appName:string}){
        try {
            const pluginList=((await db.execute(`
                SELECT config FROM \`${saasConfig.SAAS_NAME}\`.app_config where appName='${config.appName}'; 
            `, []))[0]['config']) ?? {
            }
            pluginList.pagePlugin=pluginList.pagePlugin ?? []
            pluginList.eventPlugin=pluginList.eventPlugin ?? []
            return pluginList
        }catch (e:any){
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST',  e, null);
        }
    }

    public async setAppConfig(config:{appName:string,data:any}){
        try {
            return (await db.execute(`update \`${saasConfig.SAAS_NAME}\`.app_config set config=? where appName=${db.escape(config.appName)}
and user='${this.token.userID}'
`,[config.data]))['changedRows'] == true
        }catch (e:any){
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST',  e, null);
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
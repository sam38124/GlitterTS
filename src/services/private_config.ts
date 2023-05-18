import exception from "../modules/exception.js";
import db from "../modules/database.js";
import {saasConfig} from "../config.js";
import {IToken} from "../models/Auth.js";
import moment from "moment/moment.js";

export class Private_config {
    public token: IToken;

    public async setConfig(config: {
        appName: string, key: string, value: any
    }) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception.BadRequestError("Forbidden", "No Permission.", null);
        }
        try {
            await db.execute(`replace
            into \`${saasConfig.SAAS_NAME}\`.private_config (app_name,\`key\`,\`value\`,updated_at)
            values (?,?,?,?)
            `, [
                config.appName,
                config.key,
                config.value,
                moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            ]);
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    public async getConfig(config: {
        appName: string, key: string
    }) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception.BadRequestError("Forbidden", "No Permission.", null);
        }
        try {
           return  await db.execute(`select * from \`${saasConfig.SAAS_NAME}\`.private_config where app_name=${db.escape(config.appName)} and 
                                             \`key\`=${db.escape(config.key)}
            `, []);
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }

    public async verifyPermission(appName: string) {

        const count = await db.execute(`
            select count(1)
            from \`${saasConfig.SAAS_NAME}\`.app_config
            where (user = ${this.token.userID} and appName = ${db.escape(appName)})
        `, [])
        return count[0]["count(1)"] === 1
    }

    constructor(token: IToken) {
        this.token = token
    }
}
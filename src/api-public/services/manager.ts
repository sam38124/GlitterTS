import {IToken} from "../../models/Auth.js";
import exception from "../../modules/exception.js";
import db from "../../modules/database.js";
import {saasConfig} from "../../config.js";
import moment from "moment";

export class Manager{
    public token: IToken;

    public async setConfig(config: {
        appName: string, key: string, value: any
    }) {
        try {
            await db.execute(`replace
            into \`${config.appName}\`.public_config (\`key\`,\`value\`,updated_at)
            values (?,?,?)
            `, [
                config.key,
                config.value,
                new Date()
            ]);
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }

    public async getConfig(config: {
        appName: string, key: string
    }) {
        try {
            return  await db.execute(`select * from \`${config.appName}\`.public_config where \`key\`=${db.escape(config.key)}
            `, []);
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }


    constructor(token: IToken) {
        this.token = token
    }
}
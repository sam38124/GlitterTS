import exception from '../modules/exception.js';
import db from '../modules/database.js';
import { saasConfig } from '../config.js';
import { IToken } from '../models/Auth.js';
import moment from 'moment/moment.js';
import { Post } from '../api-public/services/post';

export class Private_config {
    public token: IToken;

    public async setConfig(config: { appName: string; key: string; value: any }) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception.BadRequestError('Forbidden', 'No Permission.', null);
        }
        try {
            if (config.key === 'sql_api_config_post') {
                Post.lambda_function[config.appName] = undefined;
            }
            await db.execute(
                `replace
            into \`${saasConfig.SAAS_NAME}\`.private_config (app_name,\`key\`,\`value\`,updated_at)
            values (?,?,?,?)
            `,
                [config.appName, config.key, config.value, moment(new Date()).format('YYYY-MM-DD HH:mm:ss')]
            );
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    public async getConfig(config: { appName: string; key: string }) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception.BadRequestError('Forbidden', 'No Permission.', null);
        }
        try {
            return await db.execute(
                `select * from \`${saasConfig.SAAS_NAME}\`.private_config where app_name=${db.escape(config.appName)} and 
                                             \`key\`=${db.escape(config.key)}
            `,
                []
            );
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    public static async getConfig(config: { appName: string; key: string }) {
        try {
            return await db.execute(
                `select * from \`${saasConfig.SAAS_NAME}\`.private_config where app_name=${db.escape(config.appName)} and 
                                             \`key\`=${db.escape(config.key)}
            `,
                []
            );
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }

    public async verifyPermission(appName: string) {
        const result = await db.query(
            `SELECT count(1) 
            FROM ${saasConfig.SAAS_NAME}.app_config
            WHERE 
                (user = ? and appName = ?)
                OR appName in (
                    (SELECT appName FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config
                    WHERE user = ? AND status = 1 AND invited = 1 AND appName = ?)
                );
            `,
            [this.token.userID, appName, this.token.userID, appName]
        );
        return result[0]['count(1)'] === 1;
    }

    constructor(token: IToken) {
        this.token = token;
    }
}

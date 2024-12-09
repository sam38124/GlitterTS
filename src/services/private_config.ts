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
            const data=(await db.execute(
                `select * from \`${saasConfig.SAAS_NAME}\`.private_config where app_name=${db.escape(config.appName)} and 
                                             \`key\`=${db.escape(config.key)}
            `,
                []
            ));
            if(data[0] && data[0].value){
                Private_config.checkConfigUpdate(data[0].value,config.key)
            }
            return data
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    public static async getConfig(config: { appName: string; key: string }) {
        try {
            const data=(await db.execute(
                `select * from \`${saasConfig.SAAS_NAME}\`.private_config where app_name=${db.escape(config.appName)} and 
                                             \`key\`=${db.escape(config.key)}
            `,
                []
            ));
            if(data[0] && data[0].value){
                this.checkConfigUpdate(data[0].value,config.key)
            }
            return data;
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

    //判斷是否要更新配置檔案資料結構
    public static checkConfigUpdate(keyData:any,key:string){
        switch (key){
            case 'glitter_finance':
                //轉換成V2版本
                if (!(keyData).ecPay) {
                    const og = keyData as any
                    for (const b of ['newWebPay', 'ecPay']) {
                        if ((keyData as any).TYPE === b) {
                            (keyData as any)[b] = {
                                MERCHANT_ID: og.MERCHANT_ID,
                                HASH_IV: og.HASH_IV,
                                HASH_KEY: og.HASH_KEY,
                                ActionURL: og.ActionURL,
                                atm: og.atm,
                                c_bar_code: og.c_bar_code,
                                c_code: og.c_code,
                                credit: og.credit,
                                web_atm: og.web_atm,
                                toggle: true
                            }
                        } else {
                            (keyData as any)[b] = {
                                MERCHANT_ID: '',
                                HASH_IV: '',
                                HASH_KEY: '',
                                ActionURL: '',
                                atm: true,
                                c_bar_code: true,
                                c_code: true,
                                credit: true,
                                web_atm: true,
                                toggle: false
                            }
                        }
                    }
                }
                //PayPal
                if (!(keyData as any).paypal) {
                    keyData.paypal = {
                        PAYPAL_CLIENT_ID: '',
                        PAYPAL_SECRET: '',
                        BETA: false,
                        toggle: false
                    }
                }
                //PayPal
                if (!(keyData as any).line_pay) {
                    keyData.line_pay = {
                        CLIENT_ID: '',
                        SECRET: '',
                        BETA: false,
                        toggle: false
                    }
                }
                ['paypal','newWebPay', 'ecPay'].map((dd)=>{
                    if(keyData[dd].toggle){
                        keyData.TYPE=dd;
                    }
                });
                ['MERCHANT_ID', 'HASH_IV', 'HASH_KEY', 'ActionURL', 'atm', 'c_bar_code', 'c_code', 'credit', 'web_atm'].map((dd) => {
                    (keyData as any)[dd] = undefined
                });
                break
        }
    }
}

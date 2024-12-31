"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Private_config = void 0;
const exception_js_1 = __importDefault(require("../modules/exception.js"));
const database_js_1 = __importDefault(require("../modules/database.js"));
const config_js_1 = require("../config.js");
const moment_js_1 = __importDefault(require("moment/moment.js"));
const post_1 = require("../api-public/services/post");
class Private_config {
    async setConfig(config) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception_js_1.default.BadRequestError('Forbidden', 'No Permission.', null);
        }
        try {
            if (config.key === 'sql_api_config_post') {
                post_1.Post.lambda_function[config.appName] = undefined;
            }
            await database_js_1.default.execute(`replace
            into \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config (app_name,\`key\`,\`value\`,updated_at)
            values (?,?,?,?)
            `, [config.appName, config.key, config.value, (0, moment_js_1.default)(new Date()).format('YYYY-MM-DD HH:mm:ss')]);
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async getConfig(config) {
        if (!(await this.verifyPermission(config.appName))) {
            throw exception_js_1.default.BadRequestError('Forbidden', 'No Permission.', null);
        }
        try {
            const data = (await database_js_1.default.execute(`select * from \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config where app_name=${database_js_1.default.escape(config.appName)} and 
                                             \`key\`=${database_js_1.default.escape(config.key)}
            `, []));
            if (data[0] && data[0].value) {
                Private_config.checkConfigUpdate(data[0].value, config.key);
            }
            return data;
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    static async getConfig(config) {
        try {
            const data = (await database_js_1.default.execute(`select * from \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config where app_name=${database_js_1.default.escape(config.appName)} and 
                                             \`key\`=${database_js_1.default.escape(config.key)}
            `, []));
            if (data[0] && data[0].value) {
                this.checkConfigUpdate(data[0].value, config.key);
            }
            return data;
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async verifyPermission(appName) {
        const result = await database_js_1.default.query(`SELECT count(1) 
            FROM ${config_js_1.saasConfig.SAAS_NAME}.app_config
            WHERE 
                (user = ? and appName = ?)
                OR appName in (
                    (SELECT appName FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.app_auth_config
                    WHERE user = ? AND status = 1 AND invited = 1 AND appName = ?)
                );
            `, [this.token.userID, appName, this.token.userID, appName]);
        return result[0]['count(1)'] === 1;
    }
    constructor(token) {
        this.token = token;
    }
    static checkConfigUpdate(keyData, key) {
        switch (key) {
            case 'glitter_finance':
                if (!(keyData).ecPay) {
                    const og = keyData;
                    for (const b of ['newWebPay', 'ecPay']) {
                        if (keyData.TYPE === b) {
                            keyData[b] = {
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
                            };
                        }
                        else {
                            keyData[b] = {
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
                            };
                        }
                    }
                }
                if (!keyData.paypal) {
                    keyData.paypal = {
                        PAYPAL_CLIENT_ID: '',
                        PAYPAL_SECRET: '',
                        BETA: false,
                        toggle: false
                    };
                }
                if (!keyData.line_pay) {
                    keyData.line_pay = {
                        CLIENT_ID: '',
                        SECRET: '',
                        BETA: false,
                        toggle: false
                    };
                }
                if (!keyData.line_pay_scan) {
                    keyData.line_pay_scan = {
                        CLIENT_ID: '',
                        SECRET: '',
                        BETA: false,
                        toggle: false
                    };
                }
                if (!keyData.ut_credit_card) {
                    keyData.ut_credit_card = {
                        pwd: '',
                        toggle: false
                    };
                }
                ['paypal', 'newWebPay', 'ecPay'].map((dd) => {
                    if (keyData[dd].toggle) {
                        keyData.TYPE = dd;
                    }
                });
                ['MERCHANT_ID', 'HASH_IV', 'HASH_KEY', 'ActionURL', 'atm', 'c_bar_code', 'c_code', 'credit', 'web_atm'].map((dd) => {
                    keyData[dd] = undefined;
                });
                keyData.payment_info_custom = keyData.payment_info_custom || [];
                break;
        }
    }
}
exports.Private_config = Private_config;
//# sourceMappingURL=private_config.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Private_config = void 0;
const exception_js_1 = __importDefault(require("../modules/exception.js"));
const database_js_1 = __importDefault(require("../modules/database.js"));
const moment_js_1 = __importDefault(require("moment/moment.js"));
const config_js_1 = require("../config.js");
const post_1 = require("../api-public/services/post");
const glitter_finance_js_1 = require("../api-public/models/glitter-finance.js");
const shipment_config_js_1 = require("../api-public/config/shipment-config.js");
class Private_config {
    async setConfig(config) {
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
            console.error(e);
            throw exception_js_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async getConfig(config) {
        try {
            const data = await database_js_1.default.execute(`select *
                 from \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config
                 where app_name = ${database_js_1.default.escape(config.appName)}
                   and \`key\` = ${database_js_1.default.escape(config.key)}
                `, []);
            if (data[0] && data[0].value) {
                await Private_config.checkConfigUpdate(config.appName, data[0].value, config.key);
            }
            return data;
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    static async getConfig(config) {
        try {
            const data = await database_js_1.default.execute(`select *
                 from \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config
                 where app_name = ${database_js_1.default.escape(config.appName)}
                   and \`key\` = ${database_js_1.default.escape(config.key)}
                `, []);
            if (data[0] && data[0].value) {
                await this.checkConfigUpdate(config.appName, data[0].value, config.key);
            }
            return data;
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    constructor(token) {
        this.token = token;
    }
    static async checkConfigUpdate(appName, keyData, key) {
        var _a;
        if (key === 'glitter_finance') {
            if (!keyData.ecPay) {
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
                            toggle: true,
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
                            toggle: false,
                        };
                    }
                }
            }
            if (!keyData.paypal) {
                keyData.paypal = {
                    PAYPAL_CLIENT_ID: '',
                    PAYPAL_SECRET: '',
                    BETA: false,
                    toggle: false,
                };
            }
            if (!keyData.line_pay) {
                keyData.line_pay = {
                    CLIENT_ID: '',
                    SECRET: '',
                    BETA: false,
                    toggle: false,
                };
            }
            if (!keyData.line_pay_scan) {
                keyData.line_pay_scan = {
                    CLIENT_ID: '',
                    SECRET: '',
                    BETA: false,
                    toggle: false,
                };
            }
            if (!keyData.ut_credit_card) {
                keyData.ut_credit_card = {
                    pwd: '',
                    toggle: false,
                };
            }
            if (!keyData.paynow) {
                keyData.paynow = {
                    BETA: 'false',
                    public_key: '',
                    private_key: '',
                };
            }
            if (!keyData.jkopay) {
                keyData.jkopay = {
                    STORE_ID: '',
                    API_KEY: '',
                    SECRET_KEY: '',
                };
            }
            ['paypal', 'newWebPay', 'ecPay'].map(dd => {
                if (keyData[dd].toggle) {
                    keyData.TYPE = dd;
                }
            });
            ['MERCHANT_ID', 'HASH_IV', 'HASH_KEY', 'ActionURL', 'atm', 'c_bar_code', 'c_code', 'credit', 'web_atm'].map(dd => {
                keyData[dd] = undefined;
            });
            keyData.payment_info_custom = keyData.payment_info_custom || [];
            const shipment_setting = await (async () => {
                try {
                    const config = await Private_config.getConfig({
                        appName,
                        key: 'logistics_setting',
                    });
                    if (!config) {
                        return {
                            support: [],
                            shipmentSupport: [],
                        };
                    }
                    return config[0].value;
                }
                catch (e) {
                    return [];
                }
            })();
            const onlinePayKeys = glitter_finance_js_1.onlinePayArray.map(item => item.key);
            const defShipment = shipment_config_js_1.ShipmentConfig.list.map(item => item.value);
            const customDelivery = ((_a = shipment_setting.custom_delivery) !== null && _a !== void 0 ? _a : []).map((item) => item.id);
            [...onlinePayKeys, 'payment_info_line_pay', 'payment_info_atm', 'cash_on_delivery'].forEach(type => {
                if (keyData[type] && keyData[type].shipmentSupport === undefined) {
                    keyData[type].shipmentSupport = [...defShipment, ...customDelivery];
                }
            });
            if (Array.isArray(keyData.payment_info_custom)) {
                keyData.payment_info_custom.forEach((item) => {
                    if (item.shipmentSupport === undefined) {
                        item.shipmentSupport = [...defShipment, ...customDelivery];
                    }
                });
            }
        }
        else if (key === 'glitter_delivery') {
            if (!keyData.ec_pay) {
                const og = JSON.parse(JSON.stringify(keyData));
                Object.keys(keyData).map(dd => {
                    delete keyData[dd];
                });
                keyData.ec_pay = og;
            }
            if (!keyData.pay_now) {
                keyData.pay_now = {
                    Action: 'test',
                    toggle: false,
                    account: '',
                    pwd: '',
                };
            }
            if (typeof keyData.pay_now.toggle === 'string') {
                keyData.pay_now.toggle = false;
            }
            if (typeof keyData.ec_pay.toggle === 'string') {
                keyData.ec_pay.toggle = false;
            }
        }
    }
}
exports.Private_config = Private_config;
//# sourceMappingURL=private_config.js.map
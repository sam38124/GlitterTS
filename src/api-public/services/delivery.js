"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delivery = exports.EcPay = void 0;
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const private_config_js_1 = require("../../services/private_config.js");
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const html = String.raw;
class EcPay {
    constructor(appName) {
        this.appName = appName;
    }
    static generateCheckMacValue(params, HashKey, HashIV) {
        const sortedKeys = Object.keys(params).sort();
        const sortedParams = sortedKeys.map((key) => `${key}=${params[key]}`).join('&');
        const stringToEncode = `HashKey=${HashKey}&${sortedParams}&HashIV=${HashIV}`;
        const urlEncodedString = encodeURIComponent(stringToEncode)
            .replace(/%2d/g, '-')
            .replace(/%5f/g, '_')
            .replace(/%2e/g, '.')
            .replace(/%21/g, '!')
            .replace(/%2a/g, '*')
            .replace(/%28/g, '(')
            .replace(/%29/g, ')')
            .replace(/%20/g, '+')
            .toLowerCase();
        const md5Hash = crypto_1.default.createHash('md5').update(urlEncodedString).digest('hex');
        return md5Hash.toUpperCase();
    }
    static generateForm(json) {
        const formId = `form_ecpay_${tool_js_1.default.randomString(10)}`;
        const inputHTML = Object.entries(json.params)
            .map(([key, value]) => html `<input type="hidden" name="${key}" id="${key}" value="${value}" />`)
            .join('\n');
        return html `
            <form id="${formId}" action="${json.actionURL}" method="post">
                ${inputHTML} ${json.checkMacValue ? html `<input type="hidden" name="CheckMacValue" id="CheckMacValue" value="${json.checkMacValue}" />` : ''}
                <button type="submit" class="btn btn-secondary custom-btn beside-btn d-none" id="submit" hidden></button>
            </form>
        `;
    }
    static async axiosRequest(json) {
        try {
            return new Promise((resolve) => {
                axios_1.default
                    .request({
                    method: 'post',
                    url: json.actionURL,
                    data: Object.assign(Object.assign({}, json.params), { checkMacValue: json.checkMacValue }),
                    headers: {
                        Accept: 'text/html',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
                    .then((response) => {
                    resolve(response.data);
                });
            })
                .then((response) => {
                return {
                    result: true,
                    data: response,
                };
            })
                .catch((error) => {
                return {
                    result: false,
                    data: error.message,
                };
            });
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'EcPay axiosRequest error', null);
        }
    }
    async notifyOrder(json) {
        try {
            const checkouts = await database_js_1.default.query(`SELECT * FROM \`${this.appName}\`.t_checkout 
                WHERE JSON_EXTRACT(orderData, '$.deliveryData.AllPayLogisticsID') = ?
                  AND JSON_EXTRACT(orderData, '$.deliveryData.MerchantTradeNo') = ?;`, [json.AllPayLogisticsID, json.MerchantTradeNo]);
            if (checkouts[0]) {
                const checkout = checkouts[0];
                if (checkout.orderData.deliveryNotifyList && checkout.orderData.deliveryNotifyList.length > 0) {
                    checkout.orderData.deliveryNotifyList.push(json);
                }
                else {
                    checkout.orderData.deliveryNotifyList = [json];
                }
                await database_js_1.default.query(`UPDATE \`${this.appName}\`.t_checkout SET ? WHERE id = ?
                    `, [
                    {
                        orderData: JSON.stringify(checkout.orderData),
                    },
                    checkout.id,
                ]);
            }
            return '1|OK';
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'EcPay notifyOrder error:' + error, null);
        }
    }
}
exports.EcPay = EcPay;
class Delivery {
    constructor(appName) {
        this.appName = appName;
    }
    async getC2CMap(returnURL, logistics) {
        const id = 'redirect_' + tool_js_1.default.randomString(10);
        await redis_js_1.default.setValue(id, returnURL);
        const params = {
            MerchantID: process.env.EC_SHIPMENT_ID,
            MerchantTradeNo: new Date().getTime(),
            LogisticsType: 'CVS',
            LogisticsSubType: logistics,
            IsCollection: 'N',
            ServerReplyURL: `${process.env.DOMAIN}/api-public/v1/delivery/c2cRedirect?g-app=${this.appName}&return=${encodeURIComponent(id)}`,
        };
        return EcPay.generateForm({
            actionURL: 'https://logistics.ecpay.com.tw/Express/map',
            params,
        });
    }
    async postStoreOrder(json) {
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: this.appName,
            key: 'glitter_delivery',
        }))[0].value;
        const actionURL = keyData.Action === 'main' ? 'https://logistics.ecpay.com.tw/Express/Create' : 'https://logistics-stage.ecpay.com.tw/Express/Create';
        const params = Object.assign({ MerchantID: keyData.MERCHANT_ID, MerchantTradeDate: (0, moment_timezone_1.default)().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'), LogisticsType: 'CVS', ServerReplyURL: `${process.env.DOMAIN}/api-public/v1/delivery/c2cNotify?g-app=${this.appName}`, SenderName: keyData.SenderName, SenderCellPhone: keyData.SenderCellPhone }, json);
        const checkMacValue = EcPay.generateCheckMacValue(params, keyData.HASH_KEY, keyData.HASH_IV);
        const response = await EcPay.axiosRequest({
            actionURL,
            params,
            checkMacValue,
        });
        if (!response.result) {
            return {
                result: false,
                message: response.data,
            };
        }
        if (response.data.substring(0, 1) === '0' || response.data.substring(0, 3) === '105') {
            return {
                result: false,
                message: response.data,
            };
        }
        const cleanedString = response.data.slice(2);
        const getJSON = Object.fromEntries(cleanedString.split('&').map((pair) => {
            const [key, value] = pair.split('=');
            return [key, decodeURIComponent(value)];
        }));
        return {
            result: true,
            data: getJSON,
        };
    }
    async printOrderInfo(json) {
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: this.appName,
            key: 'glitter_delivery',
        }))[0].value;
        const params = {
            MerchantID: keyData.MERCHANT_ID,
            AllPayLogisticsID: json.AllPayLogisticsID,
            CVSPaymentNo: json.CVSPaymentNo,
            CVSValidationNo: json.CVSValidationNo,
        };
        const storePath = {
            FAMIC2C: 'PrintFAMIC2COrderInfo',
            UNIMARTC2C: 'PrintUniMartC2COrderInfo',
            HILIFEC2C: 'PrintHILIFEC2COrderInfo',
            OKMARTC2C: 'PrintOKMARTC2COrderInfo',
        };
        const actionURL = keyData.Action === 'main'
            ? `https://logistics.ecpay.com.tw/Express/${storePath[json.LogisticsSubType]}`
            : `https://logistics-stage.ecpay.com.tw/Express/${storePath[json.LogisticsSubType]}`;
        const checkMacValue = EcPay.generateCheckMacValue(params, keyData.HASH_KEY, keyData.HASH_IV);
        return EcPay.generateForm({
            actionURL,
            params,
            checkMacValue,
        });
    }
    async notify(json) {
        try {
            const getNotification = await database_js_1.default.query(`SELECT * FROM \`${this.appName}\`.public_config WHERE \`key\` = "ecpay_delivery_notify";
                `, []);
            json.token && delete json.token;
            const notification = getNotification[0];
            if (notification) {
                notification.value.push(json);
                await database_js_1.default.query(`UPDATE \`${this.appName}\`.public_config SET ? WHERE \`key\` = "ecpay_delivery_notify";
                    `, [
                    {
                        value: JSON.stringify(notification.value),
                        updated_at: new Date(),
                    },
                ]);
            }
            else {
                await database_js_1.default.query(`INSERT INTO \`${this.appName}\`.public_config SET ?;
                    `, [
                    {
                        key: 'ecpay_delivery_notify',
                        value: JSON.stringify([json]),
                        updated_at: new Date(),
                    },
                ]);
            }
            const ecpayResult = new EcPay(this.appName).notifyOrder(json);
            return ecpayResult;
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Delivery notify error:' + error, null);
        }
    }
}
exports.Delivery = Delivery;
//# sourceMappingURL=delivery.js.map
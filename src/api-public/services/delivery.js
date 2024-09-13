"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delivery = void 0;
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const crypto_1 = __importDefault(require("crypto"));
const private_config_js_1 = require("../../services/private_config.js");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const html = String.raw;
class EcPay {
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
}
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
    async postStoreOrder() {
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: this.appName,
            key: 'glitter_finance',
        }))[0].value;
        keyData.MERCHANT_ID = '2000933';
        keyData.HASH_KEY = 'XBERn1YOvpM9nfZc';
        keyData.HASH_IV = 'h1ONHk4P4yqbl5LK';
        keyData.NotifyURL = `${process.env.DOMAIN}/api-public/v1/delivery/c2cNotify?g-app=${this.appName}`;
        keyData.ReturnURL = `${process.env.DOMAIN}/api-public/v1/delivery/c2cRedirect?g-app=${this.appName}`;
        const params = {
            MerchantID: keyData.MERCHANT_ID,
            MerchantTradeDate: (0, moment_timezone_1.default)().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
            LogisticsType: 'CVS',
            LogisticsSubType: 'UNIMARTC2C',
            GoodsAmount: 1,
            GoodsName: '測試商品',
            SenderName: '我是寄件人',
            SenderCellPhone: '0911888990',
            ReceiverName: '我是收件人',
            ReceiverCellPhone: '0911888991',
            ServerReplyURL: keyData.NotifyURL,
            ReceiverStoreID: '131386',
        };
        const checkMacValue = EcPay.generateCheckMacValue(params, keyData.HASH_KEY, keyData.HASH_IV);
        return EcPay.generateForm({
            actionURL: 'https://logistics-stage.ecpay.com.tw/Express/Create',
            params,
            checkMacValue,
        });
    }
    async getUniMartC2COrderInfo(brand) {
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: this.appName,
            key: 'glitter_finance',
        }))[0].value;
        keyData.MERCHANT_ID = '2000933';
        keyData.HASH_KEY = 'XBERn1YOvpM9nfZc';
        keyData.HASH_IV = 'h1ONHk4P4yqbl5LK';
        keyData.NotifyURL = `${process.env.DOMAIN}/api-public/v1/delivery/c2cNotify?g-app=${this.appName}`;
        keyData.ReturnURL = `${process.env.DOMAIN}/api-public/v1/delivery/c2cRedirect?g-app=${this.appName}`;
        const params = {
            MerchantID: keyData.MERCHANT_ID,
            AllPayLogisticsID: '2977484',
            CVSPaymentNo: 'D8689432',
            CVSValidationNo: '8432',
        };
        const storePath = {
            FAMIC2C: 'PrintFAMIC2COrderInfo',
            UNIMARTC2C: 'PrintUniMartC2COrderInfo',
            HILIFEC2C: 'PrintHILIFEC2COrderInfo',
            OKMARTC2C: 'PrintOKMARTC2COrderInfo',
        };
        const checkMacValue = EcPay.generateCheckMacValue(params, keyData.HASH_KEY, keyData.HASH_IV);
        return EcPay.generateForm({
            actionURL: `https://logistics-stage.ecpay.com.tw/Express/${storePath[brand]}`,
            params,
            checkMacValue,
        });
    }
}
exports.Delivery = Delivery;
//# sourceMappingURL=delivery.js.map
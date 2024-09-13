import Tool from '../../modules/tool.js';
import redis from '../../modules/redis.js';
import crypto, { Encoding } from 'crypto';
import { Private_config } from '../../services/private_config.js';
import moment from 'moment-timezone';
const html = String.raw;

type StoreBrand = 'FAMIC2C' | 'UNIMARTC2C' | 'HILIFEC2C' | 'OKMARTC2C';

class EcPay {
    static generateCheckMacValue(params: Record<string, any>, HashKey: string, HashIV: string): string {
        // 將傳遞參數依字母順序排序
        const sortedKeys = Object.keys(params).sort();
        const sortedParams = sortedKeys.map((key) => `${key}=${params[key]}`).join('&');

        // 在最前面加上 HashKey，最後加上 HashIV
        const stringToEncode = `HashKey=${HashKey}&${sortedParams}&HashIV=${HashIV}`;

        // 進行 URL encode，並轉成小寫
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

        // 用 MD5 加密
        const md5Hash = crypto.createHash('md5').update(urlEncodedString).digest('hex');

        // 轉大寫並返回結果
        return md5Hash.toUpperCase();
    }

    static generateForm(json: { actionURL: string; params: Record<string, any>; checkMacValue?: string }) {
        const formId = `form_ecpay_${Tool.randomString(10)}`;
        const inputHTML = Object.entries(json.params)
            .map(([key, value]) => html`<input type="hidden" name="${key}" id="${key}" value="${value}" />`)
            .join('\n');

        return html`
            <form id="${formId}" action="${json.actionURL}" method="post">
                ${inputHTML} ${json.checkMacValue ? html`<input type="hidden" name="CheckMacValue" id="CheckMacValue" value="${json.checkMacValue}" />` : ''}
                <button type="submit" class="btn btn-secondary custom-btn beside-btn d-none" id="submit" hidden></button>
            </form>
        `;
    }
}

export class Delivery {
    public appName: string;

    public constructor(appName: string) {
        this.appName = appName;
    }

    public async getC2CMap(returnURL: string, logistics: string) {
        const id = 'redirect_' + Tool.randomString(10);
        await redis.setValue(id, returnURL);
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

    public async postStoreOrder() {
        const keyData = (
            await Private_config.getConfig({
                appName: this.appName,
                key: 'glitter_finance',
            })
        )[0].value;

        keyData.MERCHANT_ID = '2000933';
        keyData.HASH_KEY = 'XBERn1YOvpM9nfZc';
        keyData.HASH_IV = 'h1ONHk4P4yqbl5LK';
        keyData.NotifyURL = `${process.env.DOMAIN}/api-public/v1/delivery/c2cNotify?g-app=${this.appName}`;
        keyData.ReturnURL = `${process.env.DOMAIN}/api-public/v1/delivery/c2cRedirect?g-app=${this.appName}`;

        const params = {
            MerchantID: keyData.MERCHANT_ID,
            MerchantTradeDate: moment().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
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

        const fakeData = {
            UNIMARTC2C: '131386',
        };

        const checkMacValue = EcPay.generateCheckMacValue(params, keyData.HASH_KEY, keyData.HASH_IV);

        return EcPay.generateForm({
            actionURL: 'https://logistics-stage.ecpay.com.tw/Express/Create',
            params,
            checkMacValue,
        });
    }

    public async getUniMartC2COrderInfo(brand: StoreBrand) {
        const keyData = (
            await Private_config.getConfig({
                appName: this.appName,
                key: 'glitter_finance',
            })
        )[0].value;

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

        const storePath: Record<StoreBrand, string> = {
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

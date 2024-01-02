"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
class Newebpay {
    constructor(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
    }
    async createNewebPage(orderData) {
        const params = {
            MerchantID: this.keyData.MERCHANT_ID,
            RespondType: 'JSON',
            TimeStamp: Math.floor(Date.now() / 1000),
            Version: '2.0',
            MerchantOrderNo: orderData.orderID,
            Amt: orderData.total,
            ItemDesc: '商品資訊',
            NotifyURL: this.keyData.NotifyURL,
            ReturnURL: this.keyData.ReturnURL,
            TradeLimit: 600
        };
        const appName = this.appName;
        await database_js_1.default.execute(`insert into \`${appName}\`.t_checkout (cart_token, status, email, orderData)
                          values (?, ?, ?, ?)`, [
            params.MerchantOrderNo,
            0,
            orderData.email,
            orderData
        ]);
        const qs = Newebpay.JsonToQueryString(params);
        const tradeInfo = Newebpay.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        const tradeSha = crypto_1.default
            .createHash('sha256')
            .update(`HashKey=${this.keyData.HASH_KEY}&${tradeInfo}&HashIV=${this.keyData.HASH_IV}`)
            .digest('hex')
            .toUpperCase();
        return {
            actionURL: this.keyData.ActionURL,
            MerchantOrderNo: params.MerchantOrderNo,
            MerchantID: this.keyData.MERCHANT_ID,
            TradeInfo: tradeInfo,
            TradeSha: tradeSha,
            Version: params.Version,
        };
    }
    async saveMoney(orderData) {
        const params = {
            MerchantID: this.keyData.MERCHANT_ID,
            RespondType: 'JSON',
            TimeStamp: Math.floor(Date.now() / 1000),
            Version: '2.0',
            MerchantOrderNo: new Date().getTime(),
            Amt: orderData.total,
            ItemDesc: '加值服務',
            NotifyURL: this.keyData.NotifyURL,
            ReturnURL: this.keyData.ReturnURL,
        };
        const appName = this.appName;
        await database_js_1.default.execute(`insert into \`${appName}\`.t_wallet (orderID,userID, money, status, note)
                          values (?, ?, ?, ? ,?)`, [
            params.MerchantOrderNo,
            orderData.userID,
            orderData.total,
            0,
            orderData.note
        ]);
        const qs = Newebpay.JsonToQueryString(params);
        const tradeInfo = Newebpay.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        const tradeSha = crypto_1.default
            .createHash('sha256')
            .update(`HashKey=${this.keyData.HASH_KEY}&${tradeInfo}&HashIV=${this.keyData.HASH_IV}`)
            .digest('hex')
            .toUpperCase();
        return {
            actionURL: this.keyData.ActionURL,
            MerchantOrderNo: params.MerchantOrderNo,
            MerchantID: this.keyData.MERCHANT_ID,
            TradeInfo: tradeInfo,
            TradeSha: tradeSha,
            Version: params.Version,
        };
    }
    generateUniqueOrderNumber() {
        const timestamp = new Date().getTime();
        const randomSuffix = Math.floor(Math.random() * 10000);
        const orderNumber = `${timestamp}${randomSuffix}`;
        return orderNumber;
    }
    async decode(data) {
        return Newebpay.aesDecrypt(data, this.keyData.HASH_KEY, this.keyData.HASH_IV);
    }
    static JsonToQueryString(data) {
        const queryString = Object.keys(data)
            .map((key) => {
            const value = data[key];
            if (Array.isArray(value)) {
                return value.map((v) => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`).join('&');
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
            .join('&');
        return queryString;
    }
    static aesEncrypt(data, key, iv, input = 'utf-8', output = 'hex', method = 'aes-256-cbc') {
        while (key.length % 32 !== 0) {
            key += '\0';
        }
        while (iv.length % 16 !== 0) {
            iv += '\0';
        }
        const cipher = crypto_1.default.createCipheriv(method, key, iv);
        let encrypted = cipher.update(data, input, output);
        encrypted += cipher.final(output);
        return encrypted;
    }
}
exports.default = Newebpay;
Newebpay.aesDecrypt = (data, key, iv, input = 'hex', output = 'utf-8', method = 'aes-256-cbc') => {
    while (key.length % 32 !== 0) {
        key += '\0';
    }
    while (iv.length % 16 !== 0) {
        iv += '\0';
    }
    const decipher = crypto_1.default.createDecipheriv(method, key, iv);
    let decrypted = decipher.update(data, input, output);
    try {
        decrypted += decipher.final(output);
    }
    catch (e) {
        e instanceof Error && console.log(e.message);
    }
    return decrypted;
};
//# sourceMappingURL=newebpay.js.map
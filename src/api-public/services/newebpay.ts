import crypto, {Encoding} from 'crypto';
import db from "../../modules/database.js";

interface KeyData {
    MERCHANT_ID: string;
    HASH_KEY: string;
    HASH_IV: string;
    NotifyURL: string;
    ReturnURL: string;
    ActionURL: string;
}

export default class Newebpay {
    keyData: KeyData;

    appName: string

    constructor(appName: string, keyData: KeyData) {
        this.keyData = keyData;
        this.appName = appName
    }

    async createNewebPage(orderData: {
        lineItems: {
            "id": string,
            "spec": string[],
            "count": number,
            "sale_price": number
        }[],
        total: number,
        email: string,
        shipment_fee: number,
        orderID:string
    }) {
        // 1. 建立請求的參數
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
            TradeLimit:600
        };

        const appName = this.appName;
        await db.execute(`insert into \`${appName}\`.t_checkout (cart_token, status, email, orderData)
                          values (?, ?, ?, ?)`, [
            params.MerchantOrderNo,
            0,
            orderData.email,
            orderData
        ]);

        // 2. 產生 Query String
        const qs = Newebpay.JsonToQueryString(params);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        const tradeInfo = Newebpay.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);

        // 4. 產生檢查碼
        const tradeSha = crypto
            .createHash('sha256')
            .update(`HashKey=${this.keyData.HASH_KEY}&${tradeInfo}&HashIV=${this.keyData.HASH_IV}`)
            .digest('hex')
            .toUpperCase();

        // 5. 回傳物件
        return {
            actionURL: this.keyData.ActionURL,
            MerchantOrderNo: params.MerchantOrderNo,
            MerchantID: this.keyData.MERCHANT_ID,
            TradeInfo: tradeInfo,
            TradeSha: tradeSha,
            Version: params.Version,
        };
    }

    async saveMoney(orderData: {
        total: number,
        userID: number,
        note: any
    }) {
        // 1. 建立請求的參數
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
        await db.execute(`insert into \`${appName}\`.t_wallet (orderID,userID, money, status, note)
                          values (?, ?, ?, ? ,?)`, [
            params.MerchantOrderNo,
            orderData.userID,
            orderData.total,
            0,
            orderData.note
        ]);

        // 2. 產生 Query String
        const qs = Newebpay.JsonToQueryString(params);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        const tradeInfo = Newebpay.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);

        // 4. 產生檢查碼
        const tradeSha = crypto
            .createHash('sha256')
            .update(`HashKey=${this.keyData.HASH_KEY}&${tradeInfo}&HashIV=${this.keyData.HASH_IV}`)
            .digest('hex')
            .toUpperCase();

        // 5. 回傳物件
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
        const timestamp = new Date().getTime(); // 获取当前时间的时间戳
        const randomSuffix = Math.floor(Math.random() * 10000); // 生成一个随机数后缀
        const orderNumber = `${timestamp}${randomSuffix}`; // 结合时间戳和随机数后缀
        return orderNumber;
    }

    async decode(data: string) {
        return Newebpay.aesDecrypt(data, this.keyData.HASH_KEY, this.keyData.HASH_IV);
    }

    public static JsonToQueryString(data: { [key: string]: string | string[] | number }): string {
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

    // AES 加密
    public static aesEncrypt(
        data: string,
        key: string,
        iv: string,
        input: Encoding = 'utf-8',
        output: Encoding = 'hex',
        method = 'aes-256-cbc'
    ): string {
        while (key.length % 32 !== 0) {
            key += '\0';
        }
        while (iv.length % 16 !== 0) {
            iv += '\0';
        }
        const cipher = crypto.createCipheriv(method, key, iv);
        let encrypted = cipher.update(data, input, output);
        encrypted += cipher.final(output);
        return encrypted;
    }

    // AES 解密
    public static aesDecrypt = (
        data: string,
        key: string,
        iv: string,
        input: Encoding = 'hex',
        output: Encoding = 'utf-8',
        method = 'aes-256-cbc'
    ) => {
        while (key.length % 32 !== 0) {
            key += '\0';
        }
        while (iv.length % 16 !== 0) {
            iv += '\0';
        }
        const decipher = crypto.createDecipheriv(method, key, iv);
        let decrypted = decipher.update(data, input, output);
        try {
            decrypted += decipher.final(output);
        } catch (e) {
            e instanceof Error && console.log(e.message);
        }
        return decrypted;
    };

}

import crypto, { Encoding } from 'crypto';
import db from '../../modules/database.js';
import moment from 'moment-timezone';

interface KeyData {
    MERCHANT_ID: string;
    HASH_KEY: string;
    HASH_IV: string;
    NotifyURL: string;
    ReturnURL: string;
    ActionURL: string;
    TYPE: 'newWebPay' | 'ecPay';
}

const html = String.raw;

export default class FinancialService {
    keyData: KeyData;

    appName: string;

    constructor(appName: string, keyData: KeyData) {
        this.keyData = keyData;
        this.appName = appName;
    }

    static aesEncrypt(data: string, key: string, iv: string, input: Encoding = 'utf-8', output: Encoding = 'hex', method = 'aes-256-cbc'): string {
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

    static JsonToQueryString(data: { [key: string]: string | string[] | number }): string {
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

    async createOrderPage(orderData: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
            title: string;
        }[];
        total: number;
        email: string;
        shipment_fee: number;
        orderID: string;
        use_wallet: number;
        user_email: string;
        method: string;
    }) {
        orderData.method = orderData.method || 'ALL';
        if (this.keyData.TYPE === 'newWebPay') {
            return await new EzPay(this.appName, this.keyData).createOrderPage(orderData);
        } else if (this.keyData.TYPE === 'ecPay') {
            return await new EcPay(this.appName, this.keyData).createOrderPage(orderData);
        }
        return await db.execute(
            `INSERT INTO \`${this.appName}\`.t_checkout (cart_token, status, email, orderData) VALUES (?, ?, ?, ?)
            `,
            [orderData.orderID, 0, orderData.user_email, orderData]
        );
    }

    async saveWallet(orderData: { total: number; userID: number; note: any; method: string ,table:string,title:string,ratio:number}): Promise<string> {
        if (this.keyData.TYPE === 'newWebPay') {
            return await new EzPay(this.appName, this.keyData).saveMoney(orderData);
        } else if (this.keyData.TYPE === 'ecPay') {
            return await new EcPay(this.appName, this.keyData).saveMoney(orderData);
        }
        return '';
    }
}

// 藍新金流
export class EzPay {
    keyData: KeyData;

    appName: string;

    constructor(appName: string, keyData: KeyData) {
        this.keyData = keyData;
        this.appName = appName;
    }

    static aesDecrypt = (data: string, key: string, iv: string, input: Encoding = 'hex', output: Encoding = 'utf-8', method = 'aes-256-cbc') => {
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
            e instanceof Error && console.error(e.message);
        }
        return decrypted;
    };

    decode(data: string) {
        return EzPay.aesDecrypt(data, this.keyData.HASH_KEY, this.keyData.HASH_IV);
    }

    async createOrderPage(orderData: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
        }[];
        total: number;
        email: string;
        shipment_fee: number;
        orderID: string;
        use_wallet: number;
        user_email: string;
        method?: string;
    }) {
        // 1. 建立請求的參數
        const params = {
            MerchantID: this.keyData.MERCHANT_ID,
            RespondType: 'JSON',
            TimeStamp: Math.floor(Date.now() / 1000),
            Version: '2.0',
            MerchantOrderNo: orderData.orderID,
            Amt: orderData.total - orderData.use_wallet,
            ItemDesc: '商品資訊',
            NotifyURL: this.keyData.NotifyURL,
            ReturnURL: this.keyData.ReturnURL,
            TradeLimit: 600,
        };
        if (orderData.method && orderData.method !== 'ALL') {
            [
                {
                    value: 'credit',
                    title: '信用卡',
                    realKey: 'CREDIT',
                },
                {
                    value: 'atm',
                    title: 'ATM',
                    realKey: 'VACC',
                },
                {
                    value: 'web_atm',
                    title: '網路ATM',
                    realKey: 'WEBATM',
                },
                {
                    value: 'c_code',
                    title: '超商代碼',
                    realKey: 'CVS',
                },
                {
                    value: 'c_bar_code',
                    title: '超商條碼',
                    realKey: 'BARCODE',
                },
            ].map((dd) => {
                if (dd.value === orderData.method) {
                    (params as any)[dd.realKey] = 1;
                } else {
                    (params as any)[dd.realKey] = 0;
                }
            });
        }
        const appName = this.appName;
        await db.execute(
            `INSERT INTO \`${appName}\`.t_checkout (cart_token, status, email, orderData) VALUES (?, ?, ?, ?)
            `,
            [params.MerchantOrderNo, 0, orderData.user_email, orderData]
        );

        // 2. 產生 Query String
        const qs = FinancialService.JsonToQueryString(params);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        const tradeInfo = FinancialService.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);

        // 4. 產生檢查碼
        const tradeSha = crypto.createHash('sha256').update(`HashKey=${this.keyData.HASH_KEY}&${tradeInfo}&HashIV=${this.keyData.HASH_IV}`).digest('hex').toUpperCase();

        // 5. 回傳物件
        return html`<form name="Newebpay" action="${this.keyData.ActionURL}" method="POST" class="payment">
            <input type="hidden" name="MerchantID" value="${this.keyData.MERCHANT_ID}" />
            <input type="hidden" name="TradeInfo" value="${tradeInfo}" />
            <input type="hidden" name="TradeSha" value="${tradeSha}" />
            <input type="hidden" name="Version" value="${params.Version}" />
            <input type="hidden" name="MerchantOrderNo" value="${params.MerchantOrderNo}" />
            <button type="submit" class="btn btn-secondary custom-btn beside-btn" id="submit" hidden></button>
        </form>`;
    }

    async saveMoney(orderData: { total: number; userID: number; note: string,table:string,title:string,ratio:number }) {
        // 1. 建立請求的參數
        const params = {
            MerchantID: this.keyData.MERCHANT_ID,
            RespondType: 'JSON',
            TimeStamp: Math.floor(Date.now() / 1000),
            Version: '2.0',
            MerchantOrderNo: new Date().getTime(),
            Amt: orderData.total,
            ItemDesc: orderData.title,
            NotifyURL: this.keyData.NotifyURL,
            ReturnURL: this.keyData.ReturnURL,
        };

        const appName = this.appName;
        await db.execute(
            `INSERT INTO \`${appName}\`.${orderData.table} (orderID, userID, money, status, note) VALUES (?, ?, ?, ?, ?)
            `,
            [params.MerchantOrderNo, orderData.userID, orderData.total * orderData.ratio, 0, orderData.note]
        );

        // 2. 產生 Query String
        const qs = FinancialService.JsonToQueryString(params);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        const tradeInfo = FinancialService.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);

        // 4. 產生檢查碼
        const tradeSha = crypto.createHash('sha256').update(`HashKey=${this.keyData.HASH_KEY}&${tradeInfo}&HashIV=${this.keyData.HASH_IV}`).digest('hex').toUpperCase();
        const subMitData = {
            actionURL: this.keyData.ActionURL,
            MerchantOrderNo: params.MerchantOrderNo,
            MerchantID: this.keyData.MERCHANT_ID,
            TradeInfo: tradeInfo,
            TradeSha: tradeSha,
            Version: params.Version,
        };

        // 5. 回傳物件
        return html`<form name="Newebpay" action="${subMitData.actionURL}" method="POST" class="payment">
            <input type="hidden" name="MerchantID" value="${subMitData.MerchantID}" />
            <input type="hidden" name="TradeInfo" value="${subMitData.TradeInfo}" />
            <input type="hidden" name="TradeSha" value="${subMitData.TradeSha}" />
            <input type="hidden" name="Version" value="${subMitData.Version}" />
            <input type="hidden" name="MerchantOrderNo" value="${subMitData.MerchantOrderNo}" />
            <button type="submit" class="btn btn-secondary custom-btn beside-btn" id="submit" hidden></button>
        </form>`;
    }
}

// 綠界金流
export class EcPay {
    keyData: KeyData;

    appName: string;

    constructor(appName: string, keyData: KeyData) {
        this.keyData = keyData;
        this.appName = appName;
    }

    static generateCheckMacValue(params: Record<string, any>, HashKey: string, HashIV: string): string {
        // 步驟 1：依參數名稱排序並串接
        const sortedQueryString = Object.keys(params)
            .sort() // 按英文字母順序排序
            .map((key) => `${key}=${params[key]}`) // 串接成 key=value 形式
            .join('&');

        // 步驟 2：加上 HashKey 和 HashIV
        const rawString = `HashKey=${HashKey}&${sortedQueryString}&HashIV=${HashIV}`;

        // 步驟 3：URL Encode (RFC 1866)
        const encodedString = encodeURIComponent(rawString)
            .replace(/%2d/g, '-')
            .replace(/%5f/g, '_')
            .replace(/%2e/g, '.')
            .replace(/%21/g, '!')
            .replace(/%2a/g, '*')
            .replace(/%28/g, '(')
            .replace(/%29/g, ')')
            .replace(/%20/g, '+');

        // 步驟 4：轉為小寫
        const lowerCaseString = encodedString.toLowerCase();

        // 步驟 5：使用 SHA256 進行雜湊
        const sha256Hash = crypto.createHash('sha256').update(lowerCaseString).digest('hex');

        // 步驟 6：轉大寫產生 CheckMacValue
        return sha256Hash.toUpperCase();
    }

    async createOrderPage(orderData: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
            title: string;
        }[];
        total: number;
        email: string;
        shipment_fee: number;
        orderID: string;
        user_email: string;
        use_wallet: number;
        method: string;
        CheckMacValue?: string;
    }) {
        const params = {
            MerchantTradeNo: orderData.orderID,
            MerchantTradeDate: moment().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
            TotalAmount: orderData.total - orderData.use_wallet,
            TradeDesc: '商品資訊',
            ItemName: orderData.lineItems
                .map((dd) => {
                    return dd.title + (dd.spec.join('-') && '-' + dd.spec.join('-'));
                })
                .join('#'),
            ReturnURL: this.keyData.NotifyURL,
            ChoosePayment:
                orderData.method && orderData.method !== 'ALL'
                    ? (() => {
                          const find = [
                              {
                                  value: 'credit',
                                  title: '信用卡',
                                  realKey: 'Credit',
                              },
                              {
                                  value: 'atm',
                                  title: 'ATM',
                                  realKey: 'ATM',
                              },
                              {
                                  value: 'web_atm',
                                  title: '網路ATM',
                                  realKey: 'WebATM',
                              },
                              {
                                  value: 'c_code',
                                  title: '超商代碼',
                                  realKey: 'CVS',
                              },
                              {
                                  value: 'c_bar_code',
                                  title: '超商條碼',
                                  realKey: 'BARCODE',
                              },
                          ].find((dd) => {
                              return dd.value === orderData.method;
                          });
                          return find && find!.realKey;
                      })()
                    : 'ALL',
            PlatformID: '',
            MerchantID: this.keyData.MERCHANT_ID,
            InvoiceMark: 'N',
            IgnorePayment: '',
            DeviceSource: '',
            EncryptType: '1',
            PaymentType: 'aio',
            OrderResultURL: this.keyData.ReturnURL,
        };

        const chkSum = EcPay.generateCheckMacValue(params, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        orderData.CheckMacValue = chkSum;
        await db.execute(
            `INSERT INTO \`${this.appName}\`.t_checkout (cart_token, status, email, orderData) VALUES (?, ?, ?, ?)
            `,
            [params.MerchantTradeNo, 0, orderData.user_email, orderData]
        );

        // 5. 回傳物件
        return html`
            <form id="_form_aiochk" action="${this.keyData.ActionURL}" method="post">
                <input type="hidden" name="MerchantTradeNo" id="MerchantTradeNo" value="${params.MerchantTradeNo}" />
                <input type="hidden" name="MerchantTradeDate" id="MerchantTradeDate" value="${params.MerchantTradeDate}" />
                <input type="hidden" name="TotalAmount" id="TotalAmount" value="${params.TotalAmount}" />
                <input type="hidden" name="TradeDesc" id="TradeDesc" value="${params.TradeDesc}" />
                <input type="hidden" name="ItemName" id="ItemName" value="${params.ItemName}" />
                <input type="hidden" name="ReturnURL" id="ReturnURL" value="${params.ReturnURL}" />
                <input type="hidden" name="ChoosePayment" id="ChoosePayment" value="${params.ChoosePayment}" />
                <input type="hidden" name="PlatformID" id="PlatformID" value="${params.PlatformID}" />
                <input type="hidden" name="MerchantID" id="MerchantID" value="${params.MerchantID}" />
                <input type="hidden" name="InvoiceMark" id="InvoiceMark" value="${params.InvoiceMark}" />
                <input type="hidden" name="IgnorePayment" id="IgnorePayment" value="${params.IgnorePayment}" />
                <input type="hidden" name="DeviceSource" id="DeviceSource" value="${params.DeviceSource}" />
                <input type="hidden" name="EncryptType" id="EncryptType" value="${params.EncryptType}" />
                <input type="hidden" name="PaymentType" id="PaymentType" value="${params.PaymentType}" />
                <input type="hidden" name="OrderResultURL" id="OrderResultURL" value="${params.OrderResultURL}" />
                <input type="hidden" name="CheckMacValue" id="CheckMacValue" value="${chkSum}" />
                <button type="submit" class="btn btn-secondary custom-btn beside-btn d-none" id="submit" hidden></button>
            </form>
        `;
    }

    async saveMoney(orderData: { total: number; userID: number; note: string; method: string; CheckMacValue?: string,table:string,title:string ,ratio:number}) {
        // 1. 建立請求的參數
        const params = {
            MerchantTradeNo: new Date().getTime(),
            MerchantTradeDate: moment().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
            TotalAmount: orderData.total,
            TradeDesc: '商品資訊',
            ItemName: orderData.title,
            ReturnURL: this.keyData.NotifyURL,
            ChoosePayment:
                orderData.method && orderData.method !== 'ALL'
                    ? (() => {
                          const find = [
                              {
                                  value: 'credit',
                                  title: '信用卡',
                                  realKey: 'Credit',
                              },
                              {
                                  value: 'atm',
                                  title: 'ATM',
                                  realKey: 'ATM',
                              },
                              {
                                  value: 'web_atm',
                                  title: '網路ATM',
                                  realKey: 'WebATM',
                              },
                              {
                                  value: 'c_code',
                                  title: '超商代碼',
                                  realKey: 'CVS',
                              },
                              {
                                  value: 'c_bar_code',
                                  title: '超商條碼',
                                  realKey: 'BARCODE',
                              },
                          ].find((dd) => {
                              return dd.value === orderData.method;
                          });
                          return find && find!.realKey;
                      })()
                    : 'ALL',
            PlatformID: '',
            MerchantID: this.keyData.MERCHANT_ID,
            InvoiceMark: 'N',
            IgnorePayment: '',
            DeviceSource: '',
            EncryptType: '1',
            PaymentType: 'aio',
            OrderResultURL: this.keyData.ReturnURL,
        };

        const chkSum = EcPay.generateCheckMacValue(params, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        orderData.CheckMacValue = chkSum;
        await db.execute(
            `INSERT INTO \`${this.appName}\`.${orderData.table} (orderID, userID, money, status, note) VALUES (?, ?, ?, ?, ?)
            `,
            [params.MerchantTradeNo, orderData.userID, orderData.total * orderData.ratio, 0, orderData.note]
        );

        // 5. 回傳物件
        return html`
            <form id="_form_aiochk" action="${this.keyData.ActionURL}" method="post">
                <input type="hidden" name="MerchantTradeNo" id="MerchantTradeNo" value="${params.MerchantTradeNo}" />
                <input type="hidden" name="MerchantTradeDate" id="MerchantTradeDate" value="${params.MerchantTradeDate}" />
                <input type="hidden" name="TotalAmount" id="TotalAmount" value="${params.TotalAmount}" />
                <input type="hidden" name="TradeDesc" id="TradeDesc" value="${params.TradeDesc}" />
                <input type="hidden" name="ItemName" id="ItemName" value="${params.ItemName}" />
                <input type="hidden" name="ReturnURL" id="ReturnURL" value="${params.ReturnURL}" />
                <input type="hidden" name="ChoosePayment" id="ChoosePayment" value="${params.ChoosePayment}" />
                <input type="hidden" name="PlatformID" id="PlatformID" value="${params.PlatformID}" />
                <input type="hidden" name="MerchantID" id="MerchantID" value="${params.MerchantID}" />
                <input type="hidden" name="InvoiceMark" id="InvoiceMark" value="${params.InvoiceMark}" />
                <input type="hidden" name="IgnorePayment" id="IgnorePayment" value="${params.IgnorePayment}" />
                <input type="hidden" name="DeviceSource" id="DeviceSource" value="${params.DeviceSource}" />
                <input type="hidden" name="EncryptType" id="EncryptType" value="${params.EncryptType}" />
                <input type="hidden" name="PaymentType" id="PaymentType" value="${params.PaymentType}" />
                <input type="hidden" name="OrderResultURL" id="OrderResultURL" value="${params.OrderResultURL}" />
                <input type="hidden" name="CheckMacValue" id="CheckMacValue" value="${chkSum}" />
                <button type="submit" class="btn btn-secondary custom-btn beside-btn d-none" id="submit" hidden></button>
            </form>
        `;
    }
}

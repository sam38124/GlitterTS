import crypto, {Encoding} from 'crypto';
import db from '../../modules/database.js';
import moment from 'moment-timezone';
import axios, {AxiosRequestConfig} from "axios";
import redis from "../../modules/redis";
import process from "process";

interface KeyData {
    MERCHANT_ID: string;
    HASH_KEY: string;
    HASH_IV: string;
    NotifyURL: string;
    ReturnURL: string;
    ActionURL: string;
    TYPE: 'newWebPay' | 'ecPay' | 'PayPal' | 'LinePay';
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
            `INSERT INTO \`${this.appName}\`.t_checkout (cart_token, status, email, orderData)
             VALUES (?, ?, ?, ?)
            `,
            [orderData.orderID, 0, orderData.user_email, orderData]
        );

        // //todo 修改付款方式 to paypal
        // return await new PayPal(this.appName, this.keyData).checkout(orderData);
    }

    async saveWallet(orderData: {
        total: number;
        userID: number;
        note: any;
        method: string,
        table: string,
        title: string,
        ratio: number
    }): Promise<string> {
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
            `INSERT INTO \`${appName}\`.t_checkout (cart_token, status, email, orderData)
             VALUES (?, ?, ?, ?)
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
        return html`
            <form name="Newebpay" action="${this.keyData.ActionURL}" method="POST" class="payment">
                <input type="hidden" name="MerchantID" value="${this.keyData.MERCHANT_ID}"/>
                <input type="hidden" name="TradeInfo" value="${tradeInfo}"/>
                <input type="hidden" name="TradeSha" value="${tradeSha}"/>
                <input type="hidden" name="Version" value="${params.Version}"/>
                <input type="hidden" name="MerchantOrderNo" value="${params.MerchantOrderNo}"/>
                <button type="submit" class="btn btn-secondary custom-btn beside-btn" id="submit" hidden></button>
            </form>`;
    }

    async saveMoney(orderData: {
        total: number;
        userID: number;
        note: string,
        table: string,
        title: string,
        ratio: number
    }) {
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
            `INSERT INTO \`${appName}\`.${orderData.table} (orderID, userID, money, status, note)
             VALUES (?, ?, ?, ?, ?)
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
        return html`
            <form name="Newebpay" action="${subMitData.actionURL}" method="POST" class="payment">
                <input type="hidden" name="MerchantID" value="${subMitData.MerchantID}"/>
                <input type="hidden" name="TradeInfo" value="${subMitData.TradeInfo}"/>
                <input type="hidden" name="TradeSha" value="${subMitData.TradeSha}"/>
                <input type="hidden" name="Version" value="${subMitData.Version}"/>
                <input type="hidden" name="MerchantOrderNo" value="${subMitData.MerchantOrderNo}"/>
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
            `INSERT INTO \`${this.appName}\`.t_checkout (cart_token, status, email, orderData)
             VALUES (?, ?, ?, ?)
            `,
            [params.MerchantTradeNo, 0, orderData.user_email, orderData]
        );

        // 5. 回傳物件
        return html`
            <form id="_form_aiochk" action="${this.keyData.ActionURL}" method="post">
                <input type="hidden" name="MerchantTradeNo" id="MerchantTradeNo" value="${params.MerchantTradeNo}"/>
                <input type="hidden" name="MerchantTradeDate" id="MerchantTradeDate"
                       value="${params.MerchantTradeDate}"/>
                <input type="hidden" name="TotalAmount" id="TotalAmount" value="${params.TotalAmount}"/>
                <input type="hidden" name="TradeDesc" id="TradeDesc" value="${params.TradeDesc}"/>
                <input type="hidden" name="ItemName" id="ItemName" value="${params.ItemName}"/>
                <input type="hidden" name="ReturnURL" id="ReturnURL" value="${params.ReturnURL}"/>
                <input type="hidden" name="ChoosePayment" id="ChoosePayment" value="${params.ChoosePayment}"/>
                <input type="hidden" name="PlatformID" id="PlatformID" value="${params.PlatformID}"/>
                <input type="hidden" name="MerchantID" id="MerchantID" value="${params.MerchantID}"/>
                <input type="hidden" name="InvoiceMark" id="InvoiceMark" value="${params.InvoiceMark}"/>
                <input type="hidden" name="IgnorePayment" id="IgnorePayment" value="${params.IgnorePayment}"/>
                <input type="hidden" name="DeviceSource" id="DeviceSource" value="${params.DeviceSource}"/>
                <input type="hidden" name="EncryptType" id="EncryptType" value="${params.EncryptType}"/>
                <input type="hidden" name="PaymentType" id="PaymentType" value="${params.PaymentType}"/>
                <input type="hidden" name="OrderResultURL" id="OrderResultURL" value="${params.OrderResultURL}"/>
                <input type="hidden" name="CheckMacValue" id="CheckMacValue" value="${chkSum}"/>
                <button type="submit" class="btn btn-secondary custom-btn beside-btn d-none" id="submit"
                        hidden></button>
            </form>
        `;
    }

    async saveMoney(orderData: {
        total: number;
        userID: number;
        note: string;
        method: string;
        CheckMacValue?: string,
        table: string,
        title: string,
        ratio: number
    }) {
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
            `INSERT INTO \`${this.appName}\`.${orderData.table} (orderID, userID, money, status, note)
             VALUES (?, ?, ?, ?, ?)
            `,
            [params.MerchantTradeNo, orderData.userID, orderData.total * orderData.ratio, 0, orderData.note]
        );

        // 5. 回傳物件
        return html`
            <form id="_form_aiochk" action="${this.keyData.ActionURL}" method="post">
                <input type="hidden" name="MerchantTradeNo" id="MerchantTradeNo" value="${params.MerchantTradeNo}"/>
                <input type="hidden" name="MerchantTradeDate" id="MerchantTradeDate"
                       value="${params.MerchantTradeDate}"/>
                <input type="hidden" name="TotalAmount" id="TotalAmount" value="${params.TotalAmount}"/>
                <input type="hidden" name="TradeDesc" id="TradeDesc" value="${params.TradeDesc}"/>
                <input type="hidden" name="ItemName" id="ItemName" value="${params.ItemName}"/>
                <input type="hidden" name="ReturnURL" id="ReturnURL" value="${params.ReturnURL}"/>
                <input type="hidden" name="ChoosePayment" id="ChoosePayment" value="${params.ChoosePayment}"/>
                <input type="hidden" name="PlatformID" id="PlatformID" value="${params.PlatformID}"/>
                <input type="hidden" name="MerchantID" id="MerchantID" value="${params.MerchantID}"/>
                <input type="hidden" name="InvoiceMark" id="InvoiceMark" value="${params.InvoiceMark}"/>
                <input type="hidden" name="IgnorePayment" id="IgnorePayment" value="${params.IgnorePayment}"/>
                <input type="hidden" name="DeviceSource" id="DeviceSource" value="${params.DeviceSource}"/>
                <input type="hidden" name="EncryptType" id="EncryptType" value="${params.EncryptType}"/>
                <input type="hidden" name="PaymentType" id="PaymentType" value="${params.PaymentType}"/>
                <input type="hidden" name="OrderResultURL" id="OrderResultURL" value="${params.OrderResultURL}"/>
                <input type="hidden" name="CheckMacValue" id="CheckMacValue" value="${chkSum}"/>
                <button type="submit" class="btn btn-secondary custom-btn beside-btn d-none" id="submit"
                        hidden></button>
            </form>
        `;
    }
}

// PayPal金流
export class PayPal {
    keyData: {
        ReturnURL?: string,
        NotifyURL?: string,
        PAYPAL_CLIENT_ID: string,
        PAYPAL_SECRET: string,
        BETA: string
    };
    appName: string;
    PAYPAL_CLIENT_ID: string;
    PAYPAL_SECRET: string;
    PAYPAL_BASE_URL: string

    constructor(appName: string, keyData: {
        ReturnURL?: string,
        NotifyURL?: string,
        PAYPAL_CLIENT_ID: string,
        PAYPAL_SECRET: string,
        BETA: string
    }) {
        this.keyData = keyData;
        this.appName = appName;
        this.PAYPAL_CLIENT_ID = keyData.PAYPAL_CLIENT_ID; // 替換為您的 Client ID
        this.PAYPAL_SECRET = keyData.PAYPAL_SECRET; // 替換為您的 Secret Key
        this.PAYPAL_BASE_URL = (keyData.BETA == 'true') ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com"; // 沙箱環境
        // const PAYPAL_BASE_URL = "https://api-m.paypal.com"; // 正式環境
    }

    async getAccessToken(): Promise<string> {
        try {
            const tokenUrl = `${this.PAYPAL_BASE_URL}/v1/oauth2/token`;

            const config: AxiosRequestConfig = {
                method: "POST",
                url: tokenUrl,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                auth: {
                    username: this.PAYPAL_CLIENT_ID,
                    password: this.PAYPAL_SECRET,
                },
                data: new URLSearchParams({
                    grant_type: "client_credentials",
                }).toString(),
            };

            const response = await axios.request(config);
            return response.data.access_token;
        } catch (error: any) {
            console.error("Error fetching access token:", error.response?.data || error.message);
            throw new Error("Failed to retrieve PayPal access token.");
        }
    }

    async checkout(orderData: any) {
        const accessToken = await this.getAccessToken();
        const order = await this.createOrderPage(accessToken, orderData);
        return {
            orderId: order.id,
            approveLink: order.links.find((link: any) => link.rel === "approve")?.href,
        }
    }

    async createOrderPage(accessToken: string, orderData: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
            title: string
        }[];
        total: number;
        email: string;
        shipment_fee: number;
        orderID: string;
        use_wallet: number;
        user_email: string;
        method?: string;
    }) {
        try {
            const createOrderUrl = `${this.PAYPAL_BASE_URL}/v2/checkout/orders`;
            let itemPrice = 0
            orderData.lineItems.forEach((item) => {
                itemPrice += item.sale_price;
            })
            const config: AxiosRequestConfig = {
                method: "POST",
                url: createOrderUrl,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                data: {
                    intent: "CAPTURE", // 訂單目標: CAPTURE (立即支付) 或 AUTHORIZE (授權後支付)
                    purchase_units: [
                        {
                            reference_id: orderData.orderID, // 訂單參考 ID，可自定義
                            amount: {
                                currency_code: "TWD", // 貨幣
                                value: itemPrice, // 總金額
                                breakdown: {
                                    item_total: {
                                        currency_code: "TWD",
                                        value: itemPrice,
                                    },
                                },
                            },
                            items: orderData.lineItems.map((item) => {
                                return {
                                    name: item.title, // 商品名稱
                                    unit_amount: {
                                        currency_code: "TWD",
                                        value: item.sale_price,
                                    },
                                    quantity: item.count, // 商品數量
                                    description: item.spec.join(',') ?? ""
                                }
                            }),
                        },
                    ],

                    application_context: {
                        brand_name: this.appName, // 商店名稱
                        landing_page: "NO_PREFERENCE", // 登陸頁面類型
                        user_action: "PAY_NOW", // 用戶操作: PAY_NOW (立即支付)
                        return_url: `${this.keyData.ReturnURL}&payment=true&appName=${this.appName}&orderID=${orderData.orderID}`, // 成功返回 URL
                        cancel_url: `${this.keyData.ReturnURL}&payment=false`, // 取消返回 URL
                    },
                },
            };

            const response = await axios.request(config);
            await db.execute(
                `INSERT INTO \`${this.appName}\`.t_checkout (cart_token, status, email, orderData)
                 VALUES (?, ?, ?, ?)
                `,
                [orderData.orderID, 0, orderData.user_email, orderData]
            );
            await redis.setValue('paypal' + orderData.orderID, response.data.id)
            return response.data;
        } catch (error: any) {
            console.error("Error creating order:", error.response?.data || error.message);
            throw new Error("Failed to create PayPal order.");
        }
    }

    async getOrderDetails(orderId: string, accessToken: string) {
        const url = `/v2/checkout/orders/${orderId}`;
        const axiosInstance = axios.create({
            baseURL: this.PAYPAL_BASE_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });
        const config: AxiosRequestConfig = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        try {
            const response = await axiosInstance.request(config);
            const order = response.data;

            // 檢查訂單狀態是否為 APPROVED
            if (order.status === "APPROVED") {
                return order;
            } else {
                throw new Error(`Order status is not APPROVED. Current status: ${order.status}`);
            }
        } catch (error: any) {
            console.error("Error fetching order details:", error.response?.data || error.message);
            throw error;
        }
    }

    async capturePayment(orderId: string, accessToken: string) {
        const url = `/v2/checkout/orders/${orderId}/capture`;
        const axiosInstance = axios.create({
            baseURL: this.PAYPAL_BASE_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });
        const config: AxiosRequestConfig = {
            method: "POST",
            url: url,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        try {
            const response = await axiosInstance.request(config);
            return response.data;
        } catch (error: any) {
            console.error("Error capturing payment:", error.response?.data || error.message);
            throw error;
        }
    }

    async confirmAndCaptureOrder(orderId: string) {
        try {
            const accessToken = await this.getAccessToken();
            // 確認訂單狀態
            const order = await this.getOrderDetails(orderId, accessToken);
            // 捕獲付款
            const captureResult = await this.capturePayment(order.id, accessToken);

            console.log("Payment process completed successfully.");
            return captureResult;
        } catch (error: any) {
            console.error("Error during order confirmation or payment capture:", error.message);
            throw error;
        }
    }


}

// LinePay金流
export class LinePay {
    keyData: {
        ReturnURL?: string,
        NotifyURL?: string,
        LinePay_CLIENT_ID: string,
        LinePay_SECRET: string,
        BETA: string
    };
    appName: string;
    LinePay_CLIENT_ID: string;
    LinePay_SECRET: string;
    LinePay_BASE_URL: string

    constructor(appName: string, keyData: any) {
        this.keyData = keyData;
        this.appName = appName;
        this.LinePay_CLIENT_ID = keyData.CLIENT_ID; // 替換為您的 Client ID
        this.LinePay_SECRET = keyData.SECRET; // 替換為您的 Secret Key
        this.LinePay_BASE_URL = (keyData.BETA == 'true') ? "https://sandbox-api-pay.line.me" : "https://api-pay.line.me"; // 沙箱環境
        // this.LinePay_RETURN_HOST = '';
        // this.LinePay_CLIENT_ID = "2006615995"; // 替換為您的 Client ID
        // this.LinePay_CLIENT_ID = this.keyData.LinePay_CLIENT_ID;
        // this.LinePay_SECRET = "05231f46428525ee68c2816f16635145"; // 替換為您的 Secret Key
        // this.LinePay_SECRET = keyData.LinePay_SECRET;
        // this.LinePay_BASE_URL = "https://sandbox-api-pay.line.me"; // 沙箱環境
        // const PAYPAL_BASE_URL = "https://api-pay.line.me"; // 正式環境
    }

    async confirmAndCaptureOrder(transactionId: string) {
        const body: any = {};
        const uri = `/payments/requests/${transactionId}/check`;
        const nonce = new Date().getTime() / 1000;
        const head = `${this.LinePay_SECRET}/v3${uri}${nonce}`;
        const signature = crypto.createHmac('sha256', this.LinePay_SECRET).update(head).digest('base64');
        const url = `${this.LinePay_BASE_URL}/v3${uri}`;
        const config: AxiosRequestConfig = {
            method: "GET",
            url: url,
            headers: {
                "Content-Type": "application/json",
                "X-LINE-ChannelId": this.LinePay_CLIENT_ID,
                "X-LINE-Authorization-Nonce": nonce,
                "X-LINE-Authorization": signature
            },
        };
        try {
            const response = await axios.request(config);
            return response;
        } catch (error: any) {
            console.error("Error linePay:", error.response?.data.data || error.message);
            throw error;
        }
    }

    async createOrder(orderData: {
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
        const confirm_url = `${this.keyData.ReturnURL}&LinePay=true&appName=${this.appName}&orderID=${orderData.orderID}`
        const cancel_url = `${this.keyData.ReturnURL}&payment=false`
        const body = {
            "amount": orderData.total,
            "currency": "TWD",
            "orderId": orderData.orderID,
            "shippingFee": orderData.shipment_fee,
            "packages": orderData.lineItems.map((data) => {
                return {
                    "id": data.id,
                    "amount": data.count * data.sale_price,
                    "products": [
                        {
                            "id": data.spec.join(','),
                            "name": data.title,
                            "imageUrl": "",
                            "quantity": data.count,
                            "price": data.sale_price
                        }
                    ],
                }
            }),
            "redirectUrls": {
                "confirmUrl": confirm_url,
                "cancelUrl": cancel_url
            }
        };
        body.packages.push({
            "id": "shipping",
            "amount": orderData.shipment_fee,
            "products": [
                {
                    "id": "shipping",
                    "name": "shipping",
                    "imageUrl": "",
                    "quantity": 1,
                    "price": orderData.shipment_fee
                }
            ],
        })
        const uri = "/payments/request";
        const nonce = new Date().getTime() / 1000;

        const head = `${this.LinePay_SECRET}/v3${uri}${JSON.stringify(body)}${nonce}`;
        //sha256加密
        const signature = crypto.createHmac('sha256', this.LinePay_SECRET).update(head).digest('base64');
        const url = `${this.LinePay_BASE_URL}/v3${uri}`;
        const config: AxiosRequestConfig = {
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json",
                "X-LINE-ChannelId": this.LinePay_CLIENT_ID,
                "X-LINE-Authorization-Nonce": nonce,
                "X-LINE-Authorization": signature
            },
            data: body
        };
        try {
            const response = await axios.request(config);
            await db.execute(
                `INSERT INTO \`${this.appName}\`.t_checkout (cart_token, status, email, orderData)
                 VALUES (?, ?, ?, ?)
                `,
                [orderData.orderID, 0, orderData.user_email, orderData]
            );
            await redis.setValue('linepay' + orderData.orderID, response.data.info.transactionId)
            return response.data;
        } catch (error: any) {
            console.error("Error linePay:", error.response?.data || error.message);
            throw error;
        }
    }
}

// paynow金流
export class PayNow {
    keyData: {
        ReturnURL?: string,
        NotifyURL?: string,
        public_key: string,
        private_key: string,
        BETA: string
    };
    appName: string;
    PublicKey: string;
    PrivateKey: string;
    BASE_URL: string

    constructor(appName: string, keyData: any) {
        this.keyData = keyData;
        this.appName = appName;
        this.PublicKey = keyData.public_key ?? "";
        this.PrivateKey = keyData.private_key ?? "";
        this.BASE_URL = (keyData.BETA == 'true') ? "https://sandboxapi.paynow.com.tw" : "https://api.paynow.com.tw"; // 沙箱環境
    }

    async confirmAndCaptureOrder(transactionId?: string) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${this.BASE_URL}/api/v1/payment-intents/${transactionId}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ` + this.PrivateKey
            }
        };
        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error: any) {
            console.error("Error paynow:", error.response?.data.data || error.message);
            throw error;
        }
    }

    async createOrder(orderData: {
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
        const data = JSON.stringify({
            "amount": orderData.total,
            "currency": "TWD",
            "description": orderData.orderID,
            "resultUrl": this.keyData.ReturnURL + `&orderID=${orderData.orderID}`,
            "webhookUrl": this.keyData.NotifyURL + `&orderID=${orderData.orderID}`,
            "allowedPaymentMethods": [
                "CreditCard",
            ],
            "expireDays": 3,
        });
        const url = `${this.BASE_URL}/api/v1/payment-intents`;
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + this.PrivateKey
            },
            data: data
        };

        try {
            const response = await axios.request(config);
            (orderData as any).paynow_id = response.data.result.id;
            await db.execute(
                `INSERT INTO \`${this.appName}\`.t_checkout (cart_token, status, email, orderData)
                 VALUES (?, ?, ?, ?)
                `,
                [orderData.orderID, 0, orderData.user_email, orderData]
            );
            await redis.setValue('paynow' + orderData.orderID, response.data.result.id)
            return {
                data: response.data,
                publicKey: this.keyData.public_key,
                BETA: this.keyData.BETA
            }
        } catch (error: any) {
            console.error("Error payNow:", error.response?.data || error.message);
            throw error;
        }
    }
}

// 街口
export class JKO {
    keyData: {
        ReturnURL?: string,
        NotifyURL?: string,
        API_KEY: string,
        STORE_ID: string,
        SECRET_KEY: string,
    };
    appName: string;
    PublicKey: string;
    PrivateKey: string;
    BASE_URL: string

    constructor(appName: string, keyData: any) {
        this.keyData = keyData;
        this.appName = appName;
        this.PublicKey = keyData.public_key ?? "";
        this.PrivateKey = keyData.private_key ?? "";
        this.BASE_URL = "https://uat-onlinepay.jkopay.app/"
    }

    async confirmAndCaptureOrder(transactionId?: string) {
        const secret = this.keyData.SECRET_KEY;
        const digest = this.generateDigest(`platform_order_ids=${transactionId}` , secret);
        console.log("digest -- " , digest)
        return
        let config = {
            method: 'get',
            url: `${this.BASE_URL}/platform/inquiry?platform_order_ids=${transactionId}`,
            headers: {
                'Content-Type': 'application/json',
                'DIGEST': digest,
                'API-KEY' : this.keyData.API_KEY
            },
        };
        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error: any) {
            console.error("Error paynow:", error.response?.data.data || error.message);
            throw error;
        }
    }

    async createOrder(orderData: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
            preview_image:string;
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

        await this.refundOrder("1740299355493" ,10000)
        return
        const payload = JSON.stringify({
            "store_id": this.keyData.STORE_ID,
            "platform_order_id": orderData.orderID,
            "currency": "TWD",
            "total_price":orderData.total,
            "final_price": orderData.total,
            "result_url":this.keyData.ReturnURL + `&orderID=${orderData.orderID}`,})
        const apiKey = "689c57cd9d5b5ec80f5d5451d18fe24cfe855d21b25c7ff30bcd07829a902f7a";

// 設定 Secret Key
        const secretKey = "8ec78345a13e3d376452d9c89c66b543ef1516c0ef1a05f0adf654c37ac8edac";

        console.log("payload -- " , payload)

// 使用 HMAC-SHA256 生成 `digest`
        const digest = crypto.createHmac('sha256', secretKey)
            .update(payload, 'utf8')
            .digest('hex');

// 設定 Headers
        const headers = {
            'api-key': apiKey,
            'digest': digest,
            'Content-Type': 'application/json'
        };

// 顯示結果
        console.log("API Key:", apiKey);
        console.log("Digest:", digest);
        console.log("Headers:", headers);

        // const secret = this.keyData.SECRET_KEY;
        // const digest = this.generateDigest(JSON.stringify(payload) , secret);
        // console.log("response -- " , secret)
        // console.log("digest -- " , digest)
        // console.log("API-KEY -- " , this.keyData.API_KEY)
        // console.log("this.keyData.STORE_ID -- " , this.keyData.STORE_ID)
        return
        const url = `${this.BASE_URL}platform/entry`;
        const config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'DIGEST': digest,
                'API-KEY' : this.keyData.API_KEY
            },
            data: payload
        };
        try {
            const response = await axios.request(config);

            await db.execute(
                `INSERT INTO \`${this.appName}\`.t_checkout (cart_token, status, email, orderData) VALUES (?, ?, ?, ?)
            `,
                [orderData.orderID, 0, orderData.user_email, orderData]
            );
            await redis.setValue('paynow'+orderData.orderID, response.data.result.id)
            return ``
        } catch (error: any) {
            console.error("Error payNow:", error.response?.data || error.message);
            throw error;
        }
    }

    async refundOrder(platform_order_id:string , refund_amount:number){
        const payload = JSON.stringify({
            "platform_order_id":"1740299355493",
            "refund_amount":10000
        })
        const apiKey = "689c57cd9d5b5ec80f5d5451d18fe24cfe855d21b25c7ff30bcd07829a902f7a";

// 設定 Secret Key
        const secretKey = "8ec78345a13e3d376452d9c89c66b543ef1516c0ef1a05f0adf654c37ac8edac";

        console.log("payload -- " , payload)

// 使用 HMAC-SHA256 生成 `digest`
        const digest = crypto.createHmac('sha256', secretKey)
            .update(payload, 'utf8')
            .digest('hex');

// 設定 Headers
        const headers = {
            'api-key': apiKey,
            'digest': digest,
            'Content-Type': 'application/json'
        };

// 顯示結果
        console.log("API Key:", apiKey);
        console.log("Digest:", digest);
        console.log("Headers:", headers);
    }

    private generateDigest(data: string, apiSecret: string): string {
        // 轉換 data 和 apiSecret 為 UTF-8 Byte Array
        console.log("data --" , data)
        console.log("apiSecret -- " , apiSecret)
        // 使用 HMAC-SHA256 進行雜湊
        const hmac = crypto.createHmac('sha256', apiSecret);
        hmac.update(data);

        // 轉換為 16 進位字串 (與 C# 的 Convert.ToHexString(hash).ToLower() 等效)
        return hmac.digest('hex');
    }

}

// 8057a6ef-b2ba-11ef-94d5-005056b665e9
// const payload = {
//     "platform_order_id": "demo-order-001",
//     "store_id": this.keyData.STORE_ID,
//     "currency": "TWD",
//     "total_price": 10,
//     "final_price": 10,
//     "unredeem": 0,
//     "result_display_url": "https://shopnex.tw/",
//     "confirm_url" : "https://shopnex.tw/",
//     "result_url": "https://shopnex.tw/",
// }

//法1 什麼都不做處理 但把payload的前後{}拿掉 或是不拿
// const secret = "8ec78345a13e3d376452d9c89c66b543ef1516c0ef1a05f0adf654c37ac8edac";
// const digest = this.generateDigest(JSON.stringify(payload) , secret);

//法2 payload做字節處理 只做payload
// function jsonToHex(jsonData: object): string {
//     // 1️⃣ 轉成 JSON 字串
//     const jsonString = JSON.stringify(jsonData);
//
//     // 2️⃣ 轉換為 UTF-8 編碼的 Buffer
//     const utf8Bytes = Buffer.from(jsonString, 'utf8');
//
//     // 3️⃣ 轉換為 16 進位字串
//     const hexString = utf8Bytes.toString('hex');
//
//     return hexString;
// }
// const secret = "8ec78345a13e3d376452d9c89c66b543ef1516c0ef1a05f0adf654c37ac8edac";
// const digest = this.generateDigest( jsonToHex(payload) , secret);

//法3 payload和secret做字節處理
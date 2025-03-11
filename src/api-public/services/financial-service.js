"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JKO = exports.PayNow = exports.LinePay = exports.PayPal = exports.EcPay = exports.EzPay = void 0;
const crypto_1 = __importDefault(require("crypto"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const axios_1 = __importDefault(require("axios"));
const redis_1 = __importDefault(require("../../modules/redis"));
const process_1 = __importDefault(require("process"));
const order_event_js_1 = require("./order-event.js");
const private_config_js_1 = require("../../services/private_config.js");
const html = String.raw;
class FinancialService {
    constructor(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
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
    async createOrderPage(orderData) {
        orderData.method = orderData.method || 'ALL';
        if (this.keyData.TYPE === 'newWebPay') {
            return await new EzPay(this.appName, this.keyData).createOrderPage(orderData);
        }
        else if (this.keyData.TYPE === 'ecPay') {
            return await new EcPay(this.appName, this.keyData).createOrderPage(orderData);
        }
        return await order_event_js_1.OrderEvent.insertOrder({
            cartData: orderData,
            status: 0,
            app: this.appName
        });
    }
    async saveWallet(orderData) {
        if (this.keyData.TYPE === 'newWebPay') {
            return await new EzPay(this.appName, this.keyData).saveMoney(orderData);
        }
        else if (this.keyData.TYPE === 'ecPay') {
            return await new EcPay(this.appName).saveMoney(orderData);
        }
        return '';
    }
}
exports.default = FinancialService;
class EzPay {
    constructor(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
    }
    decode(data) {
        return EzPay.aesDecrypt(data, this.keyData.HASH_KEY, this.keyData.HASH_IV);
    }
    async createOrderPage(orderData) {
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
                    params[dd.realKey] = 1;
                }
                else {
                    params[dd.realKey] = 0;
                }
            });
        }
        await order_event_js_1.OrderEvent.insertOrder({
            cartData: orderData,
            status: 0,
            app: this.appName
        });
        const qs = FinancialService.JsonToQueryString(params);
        const tradeInfo = FinancialService.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        const tradeSha = crypto_1.default.createHash('sha256').update(`HashKey=${this.keyData.HASH_KEY}&${tradeInfo}&HashIV=${this.keyData.HASH_IV}`).digest('hex').toUpperCase();
        return html `
            <form name="Newebpay" action="${this.keyData.ActionURL}" method="POST" class="payment">
                <input type="hidden" name="MerchantID" value="${this.keyData.MERCHANT_ID}"/>
                <input type="hidden" name="TradeInfo" value="${tradeInfo}"/>
                <input type="hidden" name="TradeSha" value="${tradeSha}"/>
                <input type="hidden" name="Version" value="${params.Version}"/>
                <input type="hidden" name="MerchantOrderNo" value="${params.MerchantOrderNo}"/>
                <button type="submit" class="btn btn-secondary custom-btn beside-btn" id="submit" hidden></button>
            </form>`;
    }
    async saveMoney(orderData) {
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
        await database_js_1.default.execute(`INSERT INTO \`${appName}\`.${orderData.table} (orderID, userID, money, status, note)
             VALUES (?, ?, ?, ?, ?)
            `, [params.MerchantOrderNo, orderData.userID, orderData.total * orderData.ratio, 0, orderData.note]);
        const qs = FinancialService.JsonToQueryString(params);
        const tradeInfo = FinancialService.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        const tradeSha = crypto_1.default.createHash('sha256').update(`HashKey=${this.keyData.HASH_KEY}&${tradeInfo}&HashIV=${this.keyData.HASH_IV}`).digest('hex').toUpperCase();
        const subMitData = {
            actionURL: this.keyData.ActionURL,
            MerchantOrderNo: params.MerchantOrderNo,
            MerchantID: this.keyData.MERCHANT_ID,
            TradeInfo: tradeInfo,
            TradeSha: tradeSha,
            Version: params.Version,
        };
        return html `
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
exports.EzPay = EzPay;
EzPay.aesDecrypt = (data, key, iv, input = 'hex', output = 'utf-8', method = 'aes-256-cbc') => {
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
        e instanceof Error && console.error(e.message);
    }
    return decrypted;
};
class EcPay {
    constructor(appName, keyData) {
        this.appName = appName;
        this.keyData = keyData;
    }
    async key_initial() {
        var _a;
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: this.appName,
            key: 'glitter_finance',
        }))[0].value;
        let kd = (_a = keyData['ecPay']) !== null && _a !== void 0 ? _a : {
            ReturnURL: '',
            NotifyURL: '',
        };
        this.keyData = kd;
    }
    static generateCheckMacValue(params, HashKey, HashIV) {
        const sortedQueryString = Object.keys(params)
            .sort()
            .map((key) => `${key}=${params[key]}`)
            .join('&');
        const rawString = `HashKey=${HashKey}&${sortedQueryString}&HashIV=${HashIV}`;
        const encodedString = encodeURIComponent(rawString)
            .replace(/%2d/g, '-')
            .replace(/%5f/g, '_')
            .replace(/%2e/g, '.')
            .replace(/%21/g, '!')
            .replace(/%2a/g, '*')
            .replace(/%28/g, '(')
            .replace(/%29/g, ')')
            .replace(/%20/g, '+');
        const lowerCaseString = encodedString.toLowerCase();
        const sha256Hash = crypto_1.default.createHash('sha256').update(lowerCaseString).digest('hex');
        return sha256Hash.toUpperCase();
    }
    async createOrderPage(orderData) {
        const params = {
            MerchantTradeNo: orderData.orderID,
            MerchantTradeDate: (0, moment_timezone_1.default)().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
            TotalAmount: orderData.total - orderData.use_wallet,
            TradeDesc: '商品資訊',
            ItemName: orderData.lineItems
                .map((dd) => {
                return dd.title + (dd.spec.join('-') && '-' + dd.spec.join('-'));
            })
                .join('#'),
            ReturnURL: this.keyData.NotifyURL,
            ChoosePayment: orderData.method && orderData.method !== 'ALL'
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
                    return find && find.realKey;
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
            NeedExtraPaidInfo: 'Y'
        };
        const chkSum = EcPay.generateCheckMacValue(params, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        orderData.CheckMacValue = chkSum;
        await order_event_js_1.OrderEvent.insertOrder({
            cartData: orderData,
            status: 0,
            app: this.appName
        });
        console.log(`params-is=>`, params);
        return html `
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
                <input type="hidden" name="NeedExtraPaidInfo" id="NeedExtraPaidInfo"
                       value="${params.NeedExtraPaidInfo}"/>
                <input type="hidden" name="CheckMacValue" id="CheckMacValue" value="${chkSum}"/>
                <button type="submit" class="btn btn-secondary custom-btn beside-btn d-none" id="submit"
                        hidden></button>
            </form>
        `;
    }
    async checkCreditInfo(CreditRefundId, CreditAmount) {
        await this.key_initial();
        const params = {
            CreditRefundId: `${CreditRefundId}`,
            CreditAmount: CreditAmount,
            MerchantID: this.keyData.MERCHANT_ID,
            CreditCheckCode: this.keyData.CreditCheckCode
        };
        const chkSum = EcPay.generateCheckMacValue(params, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        params.CheckMacValue = chkSum;
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://payment.ecpay.com.tw/CreditDetail/QueryTrade/V2`,
            headers: {},
            'Content-Type': 'application/x-www-form-urlencoded',
            data: new URLSearchParams(params).toString()
        };
        return await new Promise((resolve, reject) => {
            axios_1.default.request(config)
                .then((response) => {
                resolve(response.data.RtnValue);
            })
                .catch((error) => {
                console.log(error);
                resolve({});
            });
        });
    }
    async checkPaymentStatus(orderID) {
        await this.key_initial();
        const params = {
            MerchantTradeNo: `${orderID}`,
            TimeStamp: Math.floor(Date.now() / 1000),
            MerchantID: this.keyData.MERCHANT_ID,
        };
        const chkSum = EcPay.generateCheckMacValue(params, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        params.CheckMacValue = chkSum;
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (EcPay.beta === this.keyData.ActionURL) ? 'https://payment-stage.ecpay.com.tw/Cashier/QueryTradeInfo/V5' : 'https://payment.ecpay.com.tw/Cashier/QueryTradeInfo/V5',
            headers: {},
            'Content-Type': 'application/x-www-form-urlencoded',
            data: new URLSearchParams(params).toString()
        };
        return await new Promise((resolve, reject) => {
            axios_1.default.request(config)
                .then(async (response) => {
                const params = new URLSearchParams(response.data);
                const paramsObject = {};
                params.forEach((value, key) => {
                    paramsObject[key] = value;
                });
                if (paramsObject.gwsr && this.keyData.CreditCheckCode && (EcPay.beta !== this.keyData.ActionURL)) {
                    paramsObject.credit_receipt = await this.checkCreditInfo(paramsObject.gwsr, paramsObject.TradeAmt);
                    if (paramsObject.credit_receipt.status !== '已授權') {
                        paramsObject.TradeStatus = '10200095';
                    }
                }
                resolve(paramsObject);
            })
                .catch((error) => {
                console.log(error);
                resolve({
                    TradeStatus: '10200095'
                });
            });
        });
    }
    async brushBack(orderID, tradNo, total) {
        await this.key_initial();
        const params = {
            MerchantTradeNo: `${orderID}`,
            TradeNo: tradNo,
            Action: 'N',
            TotalAmount: parseInt(total, 10),
            MerchantID: this.keyData.MERCHANT_ID,
        };
        const chkSum = EcPay.generateCheckMacValue(params, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        params.CheckMacValue = chkSum;
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://payment.ecpay.com.tw/CreditDetail/DoAction`,
            headers: {},
            'Content-Type': 'application/x-www-form-urlencoded',
            data: new URLSearchParams(params).toString()
        };
        return await new Promise((resolve, reject) => {
            axios_1.default.request(config)
                .then((response) => {
                const params = new URLSearchParams(response.data);
                const paramsObject = {};
                params.forEach((value, key) => {
                    paramsObject[key] = value;
                });
                resolve(paramsObject);
            })
                .catch((error) => {
                console.log(error);
                resolve({
                    RtnCode: `-1`
                });
            });
        });
    }
    async saveMoney(orderData) {
        await this.key_initial();
        const params = {
            MerchantTradeNo: new Date().getTime(),
            MerchantTradeDate: (0, moment_timezone_1.default)().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
            TotalAmount: orderData.total,
            TradeDesc: '商品資訊',
            ItemName: orderData.title,
            ReturnURL: this.keyData.NotifyURL,
            ChoosePayment: orderData.method && orderData.method !== 'ALL'
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
                    return find && find.realKey;
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
        await database_js_1.default.execute(`INSERT INTO \`${this.appName}\`.${orderData.table} (orderID, userID, money, status, note)
             VALUES (?, ?, ?, ?, ?)
            `, [params.MerchantTradeNo, orderData.userID, orderData.total * orderData.ratio, 0, orderData.note]);
        return html `
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
exports.EcPay = EcPay;
EcPay.beta = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';
class PayPal {
    constructor(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
        this.PAYPAL_CLIENT_ID = keyData.PAYPAL_CLIENT_ID;
        this.PAYPAL_SECRET = keyData.PAYPAL_SECRET;
        this.PAYPAL_BASE_URL = (keyData.BETA == 'true') ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
    }
    async getAccessToken() {
        var _a;
        try {
            const tokenUrl = `${this.PAYPAL_BASE_URL}/v1/oauth2/token`;
            const config = {
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
            const response = await axios_1.default.request(config);
            return response.data.access_token;
        }
        catch (error) {
            console.error("Error fetching access token:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new Error("Failed to retrieve PayPal access token.");
        }
    }
    async checkout(orderData) {
        var _a;
        const accessToken = await this.getAccessToken();
        const order = await this.createOrderPage(accessToken, orderData);
        return {
            orderId: order.id,
            approveLink: (_a = order.links.find((link) => link.rel === "approve")) === null || _a === void 0 ? void 0 : _a.href,
        };
    }
    async createOrderPage(accessToken, orderData) {
        var _a;
        try {
            const createOrderUrl = `${this.PAYPAL_BASE_URL}/v2/checkout/orders`;
            let itemPrice = 0;
            orderData.lineItems.forEach((item) => {
                itemPrice += item.sale_price;
            });
            const config = {
                method: "POST",
                url: createOrderUrl,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                data: {
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            reference_id: orderData.orderID,
                            amount: {
                                currency_code: "TWD",
                                value: itemPrice,
                                breakdown: {
                                    item_total: {
                                        currency_code: "TWD",
                                        value: itemPrice,
                                    },
                                },
                            },
                            items: orderData.lineItems.map((item) => {
                                var _a;
                                return {
                                    name: item.title,
                                    unit_amount: {
                                        currency_code: "TWD",
                                        value: item.sale_price,
                                    },
                                    quantity: item.count,
                                    description: (_a = item.spec.join(',')) !== null && _a !== void 0 ? _a : ""
                                };
                            }),
                        },
                    ],
                    application_context: {
                        brand_name: this.appName,
                        landing_page: "NO_PREFERENCE",
                        user_action: "PAY_NOW",
                        return_url: `${this.keyData.ReturnURL}&payment=true&appName=${this.appName}&orderID=${orderData.orderID}`,
                        cancel_url: `${this.keyData.ReturnURL}&payment=false`,
                    },
                },
            };
            const response = await axios_1.default.request(config);
            await order_event_js_1.OrderEvent.insertOrder({
                cartData: orderData,
                status: 0,
                app: this.appName
            });
            await redis_1.default.setValue('paypal' + orderData.orderID, response.data.id);
            return response.data;
        }
        catch (error) {
            console.error("Error creating order:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new Error("Failed to create PayPal order.");
        }
    }
    async getOrderDetails(orderId, accessToken) {
        var _a;
        const url = `/v2/checkout/orders/${orderId}`;
        const axiosInstance = axios_1.default.create({
            baseURL: this.PAYPAL_BASE_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });
        const config = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        try {
            const response = await axiosInstance.request(config);
            const order = response.data;
            if (order.status === "APPROVED") {
                return order;
            }
            else {
                throw new Error(`Order status is not APPROVED. Current status: ${order.status}`);
            }
        }
        catch (error) {
            console.error("Error fetching order details:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw error;
        }
    }
    async capturePayment(orderId, accessToken) {
        var _a;
        const url = `/v2/checkout/orders/${orderId}/capture`;
        const axiosInstance = axios_1.default.create({
            baseURL: this.PAYPAL_BASE_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });
        const config = {
            method: "POST",
            url: url,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        try {
            const response = await axiosInstance.request(config);
            return response.data;
        }
        catch (error) {
            console.error("Error capturing payment:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw error;
        }
    }
    async confirmAndCaptureOrder(orderId) {
        try {
            const accessToken = await this.getAccessToken();
            const order = await this.getOrderDetails(orderId, accessToken);
            const captureResult = await this.capturePayment(order.id, accessToken);
            console.log("Payment process completed successfully.");
            return captureResult;
        }
        catch (error) {
            console.error("Error during order confirmation or payment capture:", error.message);
            throw error;
        }
    }
}
exports.PayPal = PayPal;
class LinePay {
    constructor(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
        this.LinePay_CLIENT_ID = keyData.CLIENT_ID;
        this.LinePay_SECRET = keyData.SECRET;
        this.LinePay_BASE_URL = (keyData.BETA == 'true') ? "https://sandbox-api-pay.line.me" : "https://api-pay.line.me";
    }
    async confirmAndCaptureOrder(transactionId, total) {
        var _a;
        const body = {
            amount: parseInt(`${total}`, 10),
            currency: 'TWD'
        };
        const uri = `/payments/${transactionId}/confirm`;
        const nonce = new Date().getTime().toString();
        const url = `${this.LinePay_BASE_URL}/v3${uri}`;
        const head = [this.LinePay_SECRET, `/v3${uri}`, JSON.stringify(body), nonce].join('');
        const signature = crypto_1.default.createHmac('sha256', this.LinePay_SECRET).update(head).digest('base64');
        const config = {
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
        console.log(`line-conform->
        URL:${url}
        X-LINE-ChannelId:${this.LinePay_CLIENT_ID}
        LinePay_SECRET:${this.LinePay_SECRET}
        `);
        try {
            const response = await axios_1.default.request(config);
            return response;
        }
        catch (error) {
            console.error("Error linePay:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data.data) || error.message);
            throw error;
        }
    }
    async createOrder(orderData) {
        var _a;
        const confirm_url = `${this.keyData.ReturnURL}&LinePay=true&appName=${this.appName}&orderID=${orderData.orderID}`;
        const cancel_url = `${this.keyData.ReturnURL}&payment=false`;
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
                };
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
        });
        const uri = "/payments/request";
        const nonce = new Date().getTime().toString();
        const url = `${this.LinePay_BASE_URL}/v3${uri}`;
        const head = [this.LinePay_SECRET, `/v3${uri}`, JSON.stringify(body), nonce].join('');
        const signature = crypto_1.default.createHmac('sha256', this.LinePay_SECRET).update(head).digest('base64');
        const config = {
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
        console.log(`line-request->
        URL:${url}
        X-LINE-ChannelId:${this.LinePay_CLIENT_ID}
        LinePay_SECRET:${this.LinePay_SECRET}
        `);
        try {
            const response = await axios_1.default.request(config);
            await order_event_js_1.OrderEvent.insertOrder({
                cartData: orderData,
                status: 0,
                app: this.appName
            });
            console.log(`response.data===>`, response.data);
            await redis_1.default.setValue('linepay' + orderData.orderID, response.data.info.transactionId);
            return response.data;
        }
        catch (error) {
            console.error("Error linePay:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw error;
        }
    }
}
exports.LinePay = LinePay;
class PayNow {
    constructor(appName, keyData) {
        var _a, _b;
        this.keyData = keyData;
        this.appName = appName;
        this.PublicKey = (_a = keyData.public_key) !== null && _a !== void 0 ? _a : "";
        this.PrivateKey = (_b = keyData.private_key) !== null && _b !== void 0 ? _b : "";
        this.BASE_URL = (keyData.BETA == 'true') ? "https://sandboxapi.paynow.com.tw" : "https://api.paynow.com.tw";
    }
    async executePaymentIntent(transactionId, secret, paymentNo) {
        var _a;
        let config = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: `${this.BASE_URL}/api/v1/payment-intents/${transactionId}/checkout`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ` + this.PrivateKey
            },
            data: JSON.stringify({
                "paymentNo": paymentNo,
                "usePayNowSdk": true,
                "key": this.PublicKey,
                "secret": secret,
                "paymentMethodType": "CreditCard",
                "paymentMethodData": {},
                "otpFlag": false,
                "meta": {
                    "client": {
                        "height": 0,
                        "width": 0
                    },
                    "iframe": {
                        "height": 0,
                        "width": 0
                    }
                }
            })
        };
        try {
            const response = await axios_1.default.request(config);
            return response.data;
        }
        catch (error) {
            console.error("Error paynow:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data.data) || error.message);
            throw error;
        }
    }
    async bindKey() {
        var _a;
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: this.appName,
            key: 'glitter_finance',
        }))[0].value;
        let kd = (_a = keyData['paynow']) !== null && _a !== void 0 ? _a : {
            ReturnURL: '',
            NotifyURL: '',
        };
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.paynow.com.tw/api/v1/partner/merchants/binding',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + process_1.default.env.paynow_partner
            },
            data: {
                "merchant_no": kd.account,
                "api_key": kd.pwd
            }
        };
        return await new Promise((resolve, reject) => {
            axios_1.default.request(config)
                .then(async (response) => {
                if (response.data.result.length) {
                    keyData.public_key = response.data.result[0].public_key;
                    keyData.private_key = response.data.result[0].private_key;
                }
                resolve({
                    public_key: keyData.public_key,
                    private_key: keyData.private_key
                });
            })
                .catch((error) => {
                resolve({
                    public_key: '',
                    private_key: ''
                });
            });
        });
    }
    async confirmAndCaptureOrder(transactionId) {
        var _a;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${this.BASE_URL}/api/v1/payment-intents/${transactionId}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ` + (await this.bindKey()).private_key
            }
        };
        try {
            const response = await axios_1.default.request(config);
            return response.data;
        }
        catch (error) {
            console.error("Error paynow:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data.data) || error.message);
            throw error;
        }
    }
    async createOrder(orderData) {
        var _a;
        const data = JSON.stringify({
            "amount": orderData.total,
            "currency": "TWD",
            "description": orderData.orderID,
            "resultUrl": this.keyData.ReturnURL + `&orderID=${orderData.orderID}`,
            "webhookUrl": this.keyData.NotifyURL + `&orderID=${orderData.orderID}`,
            "allowedPaymentMethods": ["CreditCard"],
            "expireDays": 3,
        });
        console.log(`webhook=>`, this.keyData.NotifyURL + `&orderID=${orderData.orderID}`);
        const url = `${this.BASE_URL}/api/v1/payment-intents`;
        const key_ = (await this.bindKey());
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + key_.private_key
            },
            data: data
        };
        try {
            const response = await axios_1.default.request(config);
            orderData.paynow_id = response.data.result.id;
            await order_event_js_1.OrderEvent.insertOrder({
                cartData: orderData,
                status: 0,
                app: this.appName
            });
            await redis_1.default.setValue('paynow' + orderData.orderID, response.data.result.id);
            return {
                data: response.data,
                publicKey: key_.public_key,
                BETA: this.keyData.BETA
            };
        }
        catch (error) {
            console.error("Error payNow:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw error;
        }
    }
}
exports.PayNow = PayNow;
class JKO {
    constructor(appName, keyData) {
        var _a, _b;
        this.keyData = keyData;
        this.appName = appName;
        this.PublicKey = (_a = keyData.public_key) !== null && _a !== void 0 ? _a : "";
        this.PrivateKey = (_b = keyData.private_key) !== null && _b !== void 0 ? _b : "";
        this.BASE_URL = "https://uat-onlinepay.jkopay.app/";
    }
    async confirmAndCaptureOrder(transactionId) {
        var _a;
        const secret = this.keyData.SECRET_KEY;
        const digest = this.generateDigest(`platform_order_ids=${transactionId}`, secret);
        console.log("digest -- ", digest);
        let config = {
            method: 'get',
            url: `${this.BASE_URL}/platform/inquiry?platform_order_ids=${transactionId}`,
            headers: {
                'Content-Type': 'application/json',
                'DIGEST': digest,
                'API-KEY': this.keyData.API_KEY
            },
        };
        try {
            const response = await axios_1.default.request(config);
            return response.data;
        }
        catch (error) {
            console.error("Error paynow:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data.data) || error.message);
            throw error;
        }
    }
    async createOrder(orderData) {
        var _a;
        function transProduct(lineItems) {
            return lineItems.map((item) => {
                return {
                    'name': item.title + ' ' + item.spec.join(','),
                    'img': item.preview_image,
                    'unit_count': item.count,
                    'unit_price': item.sale_price,
                    'unit_final_price': item.sale_price
                };
            });
        }
        const payload = {
            "currency": "TWD",
            "total_price": orderData.total,
            "final_price": orderData.total,
            "result_url": this.keyData.ReturnURL + `&orderID=${orderData.orderID}`,
        };
        const apiKey = "689c57cd9d5b5ec80f5d5451d18fe24cfe855d21b25c7ff30bcd07829a902f7a";
        const secretKey = "8ec78345a13e3d376452d9c89c66b543ef1516c0ef1a05f0adf654c37ac8edac";
        const secret = this.keyData.SECRET_KEY;
        const digest = crypto_1.default.createHmac('sha256', secretKey)
            .update(JSON.stringify(payload), 'utf8')
            .digest('hex');
        const headers = {
            'api-key': apiKey,
            'digest': digest,
            'Content-Type': 'application/json'
        };
        console.log("API Key:", apiKey);
        console.log("Digest:", digest);
        console.log("Headers:", headers);
        const url = `${this.BASE_URL}platform/entry`;
        const config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'DIGEST': digest,
                'API-KEY': this.keyData.API_KEY
            },
            data: payload
        };
        try {
            const response = await axios_1.default.request(config);
            await database_js_1.default.execute(`INSERT INTO \`${this.appName}\`.t_checkout (cart_token, status, email, orderData)
                 VALUES (?, ?, ?, ?)
                `, [orderData.orderID, 0, orderData.email, orderData]);
            await redis_1.default.setValue('paynow' + orderData.orderID, response.data.result.id);
            return ``;
        }
        catch (error) {
            console.error("Error payNow:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw error;
        }
    }
    async refundOrder(platform_order_id, refund_amount) {
        const payload = JSON.stringify({
            "platform_order_id": "1740299355493",
            "refund_amount": 10000
        });
        const apiKey = "689c57cd9d5b5ec80f5d5451d18fe24cfe855d21b25c7ff30bcd07829a902f7a";
        const secretKey = "8ec78345a13e3d376452d9c89c66b543ef1516c0ef1a05f0adf654c37ac8edac";
        console.log("payload -- ", payload);
        const digest = crypto_1.default.createHmac('sha256', secretKey)
            .update(payload, 'utf8')
            .digest('hex');
        const headers = {
            'api-key': apiKey,
            'digest': digest,
            'Content-Type': 'application/json'
        };
        console.log("API Key:", apiKey);
        console.log("Digest:", digest);
        console.log("Headers:", headers);
    }
    generateDigest(data, apiSecret) {
        console.log("data --", data);
        console.log("apiSecret -- ", apiSecret);
        const hmac = crypto_1.default.createHmac('sha256', apiSecret);
        hmac.update(data);
        return hmac.digest('hex');
    }
}
exports.JKO = JKO;
//# sourceMappingURL=financial-service.js.map
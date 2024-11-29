"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinePay = exports.PayPal = exports.EcPay = exports.EzPay = void 0;
const crypto_1 = __importDefault(require("crypto"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const axios_1 = __importDefault(require("axios"));
const redis_1 = __importDefault(require("../../modules/redis"));
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
        return await database_js_1.default.execute(`INSERT INTO \`${this.appName}\`.t_checkout (cart_token, status, email, orderData) VALUES (?, ?, ?, ?)
            `, [orderData.orderID, 0, orderData.user_email, orderData]);
    }
    async saveWallet(orderData) {
        if (this.keyData.TYPE === 'newWebPay') {
            return await new EzPay(this.appName, this.keyData).saveMoney(orderData);
        }
        else if (this.keyData.TYPE === 'ecPay') {
            return await new EcPay(this.appName, this.keyData).saveMoney(orderData);
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
        const appName = this.appName;
        await database_js_1.default.execute(`INSERT INTO \`${appName}\`.t_checkout (cart_token, status, email, orderData) VALUES (?, ?, ?, ?)
            `, [params.MerchantOrderNo, 0, orderData.user_email, orderData]);
        const qs = FinancialService.JsonToQueryString(params);
        const tradeInfo = FinancialService.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        const tradeSha = crypto_1.default.createHash('sha256').update(`HashKey=${this.keyData.HASH_KEY}&${tradeInfo}&HashIV=${this.keyData.HASH_IV}`).digest('hex').toUpperCase();
        return html `<form name="Newebpay" action="${this.keyData.ActionURL}" method="POST" class="payment">
            <input type="hidden" name="MerchantID" value="${this.keyData.MERCHANT_ID}" />
            <input type="hidden" name="TradeInfo" value="${tradeInfo}" />
            <input type="hidden" name="TradeSha" value="${tradeSha}" />
            <input type="hidden" name="Version" value="${params.Version}" />
            <input type="hidden" name="MerchantOrderNo" value="${params.MerchantOrderNo}" />
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
        await database_js_1.default.execute(`INSERT INTO \`${appName}\`.${orderData.table} (orderID, userID, money, status, note) VALUES (?, ?, ?, ?, ?)
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
        return html `<form name="Newebpay" action="${subMitData.actionURL}" method="POST" class="payment">
            <input type="hidden" name="MerchantID" value="${subMitData.MerchantID}" />
            <input type="hidden" name="TradeInfo" value="${subMitData.TradeInfo}" />
            <input type="hidden" name="TradeSha" value="${subMitData.TradeSha}" />
            <input type="hidden" name="Version" value="${subMitData.Version}" />
            <input type="hidden" name="MerchantOrderNo" value="${subMitData.MerchantOrderNo}" />
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
        this.keyData = keyData;
        this.appName = appName;
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
        };
        const chkSum = EcPay.generateCheckMacValue(params, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        orderData.CheckMacValue = chkSum;
        await database_js_1.default.execute(`INSERT INTO \`${this.appName}\`.t_checkout (cart_token, status, email, orderData) VALUES (?, ?, ?, ?)
            `, [params.MerchantTradeNo, 0, orderData.user_email, orderData]);
        return html `
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
    async saveMoney(orderData) {
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
        await database_js_1.default.execute(`INSERT INTO \`${this.appName}\`.${orderData.table} (orderID, userID, money, status, note) VALUES (?, ?, ?, ?, ?)
            `, [params.MerchantTradeNo, orderData.userID, orderData.total * orderData.ratio, 0, orderData.note]);
        return html `
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
exports.EcPay = EcPay;
class PayPal {
    constructor(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
        this.PAYPAL_CLIENT_ID = "AfxmQilUtZiATwO5vEZH_RPRJWBTiEGhUm27Wu5LyElZ7_OlXGwkc2vDlpUPsJHjoA8rVARy7i8A6VbY";
        this.PAYPAL_SECRET = "EKSx6S6nnjPgrjcEPLFytJGqwakuZ5vUcTv-kF-eKkprd7Ci22P7UV93-85b0Xupa9ggULebx9Rvsx7e";
        this.PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";
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
            await database_js_1.default.execute(`INSERT INTO \`${this.appName}\`.t_checkout (cart_token, status, email, orderData) VALUES (?, ?, ?, ?)
            `, [orderData.orderID, 0, orderData.user_email, orderData]);
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
        await database_js_1.default.execute(`INSERT INTO \`${appName}\`.${orderData.table} (orderID, userID, money, status, note) VALUES (?, ?, ?, ?, ?)
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
        return html `<form name="Newebpay" action="${subMitData.actionURL}" method="POST" class="payment">
            <input type="hidden" name="MerchantID" value="${subMitData.MerchantID}" />
            <input type="hidden" name="TradeInfo" value="${subMitData.TradeInfo}" />
            <input type="hidden" name="TradeSha" value="${subMitData.TradeSha}" />
            <input type="hidden" name="Version" value="${subMitData.Version}" />
            <input type="hidden" name="MerchantOrderNo" value="${subMitData.MerchantOrderNo}" />
            <button type="submit" class="btn btn-secondary custom-btn beside-btn" id="submit" hidden></button>
        </form>`;
    }
}
exports.PayPal = PayPal;
class LinePay {
    constructor(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
        this.LinePay_CLIENT_ID = "2006615995";
        this.LinePay_SECRET = "05231f46428525ee68c2816f16635145";
        this.LinePay_BASE_URL = "https://api-m.sandbox.paypal.com";
        this.LinePay_RETURN_HOST = '';
        this.LinePay_RETURN_CANCEL_URL = '';
        this.LinePay_RETURN_CONFIRM_URL = '';
    }
}
exports.LinePay = LinePay;
//# sourceMappingURL=financial-service.js.map
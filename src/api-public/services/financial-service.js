"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcPay = exports.EzPay = void 0;
const crypto_1 = __importDefault(require("crypto"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class FinancialService {
    constructor(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
    }
    async createOrderPage(orderData) {
        if (this.keyData.TYPE === 'newWebPay') {
            return await (new EzPay(this.appName, this.keyData).createOrderPage(orderData));
        }
        else if (this.keyData.TYPE === 'ecPay') {
            return await (new EcPay(this.appName, this.keyData).createOrderPage(orderData));
        }
        else {
            return await database_js_1.default.execute(`insert into \`${this.appName}\`.t_checkout (cart_token, status, email, orderData)
                                     values (?, ?, ?, ?)`, [
                new Date().getTime(),
                0,
                orderData.email,
                orderData
            ]);
        }
        return ``;
    }
    async saveMoney(orderData) {
        if (this.keyData.TYPE === 'newWebPay') {
            return (await (new EzPay(this.appName, this.keyData).saveMoney(orderData)));
        }
        else if (this.keyData.TYPE === 'ecPay') {
            return await (new EcPay(this.appName, this.keyData).saveMoney(orderData));
        }
        else {
            return ``;
        }
    }
    generateUniqueOrderNumber() {
        const timestamp = new Date().getTime();
        const randomSuffix = Math.floor(Math.random() * 10000);
        const orderNumber = `${timestamp}${randomSuffix}`;
        return orderNumber;
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
exports.default = FinancialService;
class EzPay {
    constructor(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
    }
    async decode(data) {
        return EzPay.aesDecrypt(data, this.keyData.HASH_KEY, this.keyData.HASH_IV);
    }
    async createOrderPage(orderData) {
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
        const qs = FinancialService.JsonToQueryString(params);
        const tradeInfo = FinancialService.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        const tradeSha = crypto_1.default
            .createHash('sha256')
            .update(`HashKey=${this.keyData.HASH_KEY}&${tradeInfo}&HashIV=${this.keyData.HASH_IV}`)
            .digest('hex')
            .toUpperCase();
        return `<form name="Newebpay" action="${this.keyData.ActionURL}" method="POST" class="payment">
                            <input type="hidden" name="MerchantID" value="${this.keyData.MERCHANT_ID}" />
                            <input type="hidden" name="TradeInfo" value="${tradeInfo}" />
                            <input type="hidden" name="TradeSha" value="${tradeSha}" />
                            <input type="hidden" name="Version" value="${params.Version}" />
                            <input type="hidden" name="MerchantOrderNo" value="${params.MerchantOrderNo}" />
                            <button
                                type="submit"
                                class="btn btn-secondary custom-btn beside-btn"
                                id="submit"
                                hidden
                            ></button>
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
            ItemDesc: '加值服務',
            NotifyURL: this.keyData.NotifyURL,
            ReturnURL: this.keyData.ReturnURL,
        };
        const appName = this.appName;
        await database_js_1.default.execute(`insert into \`${appName}\`.t_wallet (orderID, userID, money, status, note)
                          values (?, ?, ?, ?, ?)`, [
            params.MerchantOrderNo,
            orderData.userID,
            orderData.total,
            0,
            orderData.note
        ]);
        const qs = FinancialService.JsonToQueryString(params);
        const tradeInfo = FinancialService.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        const tradeSha = crypto_1.default
            .createHash('sha256')
            .update(`HashKey=${this.keyData.HASH_KEY}&${tradeInfo}&HashIV=${this.keyData.HASH_IV}`)
            .digest('hex')
            .toUpperCase();
        const subMitData = {
            actionURL: this.keyData.ActionURL,
            MerchantOrderNo: params.MerchantOrderNo,
            MerchantID: this.keyData.MERCHANT_ID,
            TradeInfo: tradeInfo,
            TradeSha: tradeSha,
            Version: params.Version,
        };
        return `<form name="Newebpay" action="${subMitData.actionURL}" method="POST" class="payment">
                            <input type="hidden" name="MerchantID" value="${subMitData.MerchantID}" />
                            <input type="hidden" name="TradeInfo" value="${subMitData.TradeInfo}" />
                            <input type="hidden" name="TradeSha" value="${subMitData.TradeSha}" />
                            <input type="hidden" name="Version" value="${subMitData.Version}" />
                            <input type="hidden" name="MerchantOrderNo" value="${subMitData.MerchantOrderNo}" />
                            <button
                                type="submit"
                                class="btn btn-secondary custom-btn beside-btn"
                                id="submit"
                                hidden
                            ></button>
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
        e instanceof Error && console.log(e.message);
    }
    return decrypted;
};
class EcPay {
    constructor(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
    }
    async createOrderPage(orderData) {
        const params = {
            MerchantTradeNo: orderData.orderID,
            MerchantTradeDate: (0, moment_timezone_1.default)().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
            TotalAmount: orderData.total,
            TradeDesc: '商品資訊',
            ItemName: orderData.lineItems.map((dd) => {
                return dd.title + (dd.spec.join('-') && ('-' + dd.spec.join('-')));
            }).join('#'),
            ReturnURL: this.keyData.NotifyURL,
            ChoosePayment: 'ALL',
            PlatformID: '',
            MerchantID: this.keyData.MERCHANT_ID,
            InvoiceMark: 'N',
            IgnorePayment: '',
            DeviceSource: '',
            EncryptType: '1',
            PaymentType: 'aio',
            OrderResultURL: this.keyData.ReturnURL
        };
        const appName = this.appName;
        let od = (Object.keys(params).sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        })).map((dd) => {
            return `${dd.toLowerCase()}=${params[dd]}`;
        });
        let raw = od.join('&');
        raw = EcPay.urlEncode_dot_net(`HashKey=${this.keyData.HASH_KEY}&${raw.toLowerCase()}&HashIV=${this.keyData.HASH_IV}`);
        const chkSum = crypto_1.default.createHash('sha256').update(raw.toLowerCase()).digest('hex');
        orderData['CheckMacValue'] = chkSum;
        await database_js_1.default.execute(`insert into \`${appName}\`.t_checkout (cart_token, status, email, orderData)
                          values (?, ?, ?, ?)`, [
            params.MerchantTradeNo,
            0,
            orderData.email,
            orderData
        ]);
        const html = String.raw;
        return html `
            <form id="_form_aiochk" action="${this.keyData.ActionURL}" method="post">
                <input type="hidden" name="MerchantTradeNo" id="MerchantTradeNo" value="${params.MerchantTradeNo}"/>
                <input type="hidden" name="MerchantTradeDate" id="MerchantTradeDate"
                       value="${params.MerchantTradeDate}"/>
                <input type="hidden" name="TotalAmount" id="TotalAmount" value="${params.TotalAmount}"/>
                <input type="hidden" name="TradeDesc" id="TradeDesc" value="${params.TradeDesc}"/>
                <input type="hidden" name="ItemName" id="ItemName" value="${params.ItemName}"/>
                <input type="hidden" name="ReturnURL" id="ReturnURL" value="${params.ReturnURL}"/>
                <input name="ChoosePayment" id="ChoosePayment" value="${params.ChoosePayment}"/>
                <input type="hidden" name="PlatformID" id="PlatformID" value="${params.PlatformID}"/>
                <input type="hidden" name="MerchantID" id="MerchantID" value="${params.MerchantID}"/>
                <input type="hidden" name="InvoiceMark" id="InvoiceMark" value="${params.InvoiceMark}"/>
                <input type="hidden" name="IgnorePayment" id="IgnorePayment" value="${params.IgnorePayment}"/>
                <input type="hidden" name="DeviceSource" id="DeviceSource" value="${params.DeviceSource}"/>
                <input type="hidden" name="EncryptType" id="EncryptType" value="${params.EncryptType}"/>
                <input type="hidden" name="PaymentType" id="PaymentType" value="${params.PaymentType}"/>
                <input type="hidden" name="OrderResultURL" id="OrderResultURL" value="${params.OrderResultURL}"/>

                <input type="hidden" name="CheckMacValue" id="CheckMacValue" value="${chkSum}"/>
                <button
                        type="submit"
                        class="btn btn-secondary custom-btn beside-btn d-none"
                        id="submit" hidden></button>
            </form>
        `;
    }
    async saveMoney(orderData) {
        const params = {
            MerchantTradeNo: new Date().getTime(),
            MerchantTradeDate: (0, moment_timezone_1.default)().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
            TotalAmount: orderData.total,
            TradeDesc: '商品資訊',
            ItemName: '加值服務',
            ReturnURL: this.keyData.NotifyURL,
            ChoosePayment: 'ALL',
            PlatformID: '',
            MerchantID: this.keyData.MERCHANT_ID,
            InvoiceMark: 'N',
            IgnorePayment: '',
            DeviceSource: '',
            EncryptType: '1',
            PaymentType: 'aio',
            OrderResultURL: this.keyData.ReturnURL
        };
        const appName = this.appName;
        let od = (Object.keys(params).sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        })).map((dd) => {
            return `${dd.toLowerCase()}=${params[dd]}`;
        });
        let raw = od.join('&');
        raw = EcPay.urlEncode_dot_net(`HashKey=${this.keyData.HASH_KEY}&${raw.toLowerCase()}&HashIV=${this.keyData.HASH_IV}`);
        const chkSum = crypto_1.default.createHash('sha256').update(raw.toLowerCase()).digest('hex');
        orderData['CheckMacValue'] = chkSum;
        await database_js_1.default.execute(`insert into \`${appName}\`.t_wallet (orderID, userID, money, status, note)
                          values (?, ?, ?, ?, ?)`, [
            params.MerchantTradeNo,
            orderData.userID,
            orderData.total,
            0,
            orderData.note
        ]);
        const html = String.raw;
        return html `
            <form id="_form_aiochk" action="${this.keyData.ActionURL}" method="post">
                <input type="hidden" name="MerchantTradeNo" id="MerchantTradeNo" value="${params.MerchantTradeNo}"/>
                <input type="hidden" name="MerchantTradeDate" id="MerchantTradeDate"
                       value="${params.MerchantTradeDate}"/>
                <input type="hidden" name="TotalAmount" id="TotalAmount" value="${params.TotalAmount}"/>
                <input type="hidden" name="TradeDesc" id="TradeDesc" value="${params.TradeDesc}"/>
                <input type="hidden" name="ItemName" id="ItemName" value="${params.ItemName}"/>
                <input type="hidden" name="ReturnURL" id="ReturnURL" value="${params.ReturnURL}"/>
                <input name="ChoosePayment" id="ChoosePayment" value="${params.ChoosePayment}"/>
                <input type="hidden" name="PlatformID" id="PlatformID" value="${params.PlatformID}"/>
                <input type="hidden" name="MerchantID" id="MerchantID" value="${params.MerchantID}"/>
                <input type="hidden" name="InvoiceMark" id="InvoiceMark" value="${params.InvoiceMark}"/>
                <input type="hidden" name="IgnorePayment" id="IgnorePayment" value="${params.IgnorePayment}"/>
                <input type="hidden" name="DeviceSource" id="DeviceSource" value="${params.DeviceSource}"/>
                <input type="hidden" name="EncryptType" id="EncryptType" value="${params.EncryptType}"/>
                <input type="hidden" name="PaymentType" id="PaymentType" value="${params.PaymentType}"/>
                <input type="hidden" name="OrderResultURL" id="OrderResultURL" value="${params.OrderResultURL}"/>

                <input type="hidden" name="CheckMacValue" id="CheckMacValue" value="${chkSum}"/>
                <button
                        type="submit"
                        class="btn btn-secondary custom-btn beside-btn d-none"
                        id="submit" hidden></button>
            </form>
        `;
    }
    static urlEncode_dot_net(raw_data, case_tr = 'DOWN') {
        if (typeof raw_data === 'string') {
            let encode_data = encodeURIComponent(raw_data);
            switch (case_tr) {
                case 'KEEP':
                    break;
                case 'UP':
                    encode_data = encode_data.toUpperCase();
                    break;
                case 'DOWN':
                    encode_data = encode_data.toLowerCase();
                    break;
            }
            encode_data = encode_data.replace(/\'/g, "%27");
            encode_data = encode_data.replace(/\~/g, "%7e");
            encode_data = encode_data.replace(/\%20/g, "+");
            return encode_data;
        }
        else {
            throw new Error("Data received is not a string.");
        }
    }
}
exports.EcPay = EcPay;
//# sourceMappingURL=financial-service.js.map
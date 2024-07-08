var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import crypto from 'crypto';
import db from "../../modules/database.js";
import moment from 'moment-timezone';
export default class FinancialService {
    constructor(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
    }
    createOrderPage(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.keyData.TYPE === 'newWebPay') {
                return yield (new EzPay(this.appName, this.keyData).createOrderPage(orderData));
            }
            else if (this.keyData.TYPE === 'ecPay') {
                return yield (new EcPay(this.appName, this.keyData).createOrderPage(orderData));
            }
            else {
                return yield db.execute(`insert into \`${this.appName}\`.t_checkout (cart_token, status, email, orderData)
                                     values (?, ?, ?, ?)`, [
                    orderData.orderID,
                    0,
                    orderData.user_email,
                    orderData
                ]);
            }
            return ``;
        });
    }
    saveMoney(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.keyData.TYPE === 'newWebPay') {
                return (yield (new EzPay(this.appName, this.keyData).saveMoney(orderData)));
            }
            else if (this.keyData.TYPE === 'ecPay') {
                return yield (new EcPay(this.appName, this.keyData).saveMoney(orderData));
            }
            else {
                return ``;
            }
        });
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
        const cipher = crypto.createCipheriv(method, key, iv);
        let encrypted = cipher.update(data, input, output);
        encrypted += cipher.final(output);
        return encrypted;
    }
}
export class EzPay {
    constructor(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
    }
    decode(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return EzPay.aesDecrypt(data, this.keyData.HASH_KEY, this.keyData.HASH_IV);
        });
    }
    createOrderPage(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
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
                TradeLimit: 600
            };
            if (orderData.method && orderData.method !== 'ALL') {
                [{
                        value: 'credit',
                        title: '信用卡',
                        realKey: 'CREDIT'
                    }, {
                        value: 'atm',
                        title: 'ATM',
                        realKey: 'VACC'
                    }, {
                        value: 'web_atm',
                        title: '網路ATM',
                        realKey: 'WEBATM'
                    }, {
                        value: 'c_code',
                        title: '超商代碼',
                        realKey: 'CVS'
                    }, {
                        value: 'c_bar_code',
                        title: '超商條碼',
                        realKey: 'BARCODE'
                    }].map((dd) => {
                    if (dd.value === orderData.method) {
                        params[dd.realKey] = 1;
                    }
                    else {
                        params[dd.realKey] = 0;
                    }
                });
            }
            const appName = this.appName;
            yield db.execute(`insert into \`${appName}\`.t_checkout (cart_token, status, email, orderData)
                          values (?, ?, ?, ?)`, [
                params.MerchantOrderNo,
                0,
                orderData.user_email,
                orderData
            ]);
            const qs = FinancialService.JsonToQueryString(params);
            const tradeInfo = FinancialService.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);
            const tradeSha = crypto
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
        });
    }
    saveMoney(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
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
            yield db.execute(`insert into \`${appName}\`.t_wallet (orderID, userID, money, status, note)
                          values (?, ?, ?, ?, ?)`, [
                params.MerchantOrderNo,
                orderData.userID,
                orderData.total,
                0,
                orderData.note
            ]);
            const qs = FinancialService.JsonToQueryString(params);
            const tradeInfo = FinancialService.aesEncrypt(qs, this.keyData.HASH_KEY, this.keyData.HASH_IV);
            const tradeSha = crypto
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
        });
    }
}
EzPay.aesDecrypt = (data, key, iv, input = 'hex', output = 'utf-8', method = 'aes-256-cbc') => {
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
    }
    catch (e) {
        e instanceof Error && console.log(e.message);
    }
    return decrypted;
};
export class EcPay {
    constructor(appName, keyData) {
        this.keyData = keyData;
        this.appName = appName;
    }
    createOrderPage(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`orderData.orderID->`, orderData.orderID);
            const params = {
                MerchantTradeNo: orderData.orderID,
                MerchantTradeDate: moment().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
                TotalAmount: orderData.total - orderData.use_wallet,
                TradeDesc: '商品資訊',
                ItemName: orderData.lineItems.map((dd) => {
                    return dd.title + (dd.spec.join('-') && ('-' + dd.spec.join('-')));
                }).join('#'),
                ReturnURL: this.keyData.NotifyURL,
                ChoosePayment: orderData.method ? (() => {
                    return [{
                            value: 'credit',
                            title: '信用卡',
                            realKey: 'Credit'
                        }, {
                            value: 'atm',
                            title: 'ATM',
                            realKey: 'ATM'
                        }, {
                            value: 'web_atm',
                            title: '網路ATM',
                            realKey: 'WebATM'
                        }, {
                            value: 'c_code',
                            title: '超商代碼',
                            realKey: 'CVS'
                        }, {
                            value: 'c_bar_code',
                            title: '超商條碼',
                            realKey: 'BARCODE'
                        }].find((dd) => {
                        return dd.value === orderData.method;
                    }).realKey;
                })() : 'ALL',
                PlatformID: '',
                MerchantID: this.keyData.MERCHANT_ID,
                InvoiceMark: 'N',
                IgnorePayment: '',
                DeviceSource: '',
                EncryptType: '1',
                PaymentType: 'aio',
                OrderResultURL: this.keyData.ReturnURL
            };
            console.log(`ItemsName-->`, orderData.lineItems.map((dd) => {
                return dd.title + (dd.spec.join('-') && ('-' + dd.spec.join('-')));
            }).join('#'));
            const appName = this.appName;
            let od = (Object.keys(params).sort(function (a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            })).map((dd) => {
                return `${dd.toLowerCase()}=${params[dd]}`;
            });
            let raw = od.join('&');
            raw = EcPay.urlEncode_dot_net(`HashKey=${this.keyData.HASH_KEY}&${raw.toLowerCase()}&HashIV=${this.keyData.HASH_IV}`);
            const chkSum = crypto.createHash('sha256').update(raw.toLowerCase()).digest('hex');
            orderData['CheckMacValue'] = chkSum;
            yield db.execute(`insert into \`${appName}\`.t_checkout (cart_token, status, email, orderData)
                          values (?, ?, ?, ?)`, [
                params.MerchantTradeNo,
                0,
                orderData.user_email,
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
        });
    }
    saveMoney(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                MerchantTradeNo: new Date().getTime(),
                MerchantTradeDate: moment().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
                TotalAmount: orderData.total,
                TradeDesc: '商品資訊',
                ItemName: '加值服務',
                ReturnURL: this.keyData.NotifyURL,
                ChoosePayment: orderData.method ? (() => {
                    return [{
                            value: 'credit',
                            title: '信用卡',
                            realKey: 'Credit'
                        }, {
                            value: 'atm',
                            title: 'ATM',
                            realKey: 'ATM'
                        }, {
                            value: 'web_atm',
                            title: '網路ATM',
                            realKey: 'WebATM'
                        }, {
                            value: 'c_code',
                            title: '超商代碼',
                            realKey: 'CVS'
                        }, {
                            value: 'c_bar_code',
                            title: '超商條碼',
                            realKey: 'BARCODE'
                        }].find((dd) => {
                        return dd.value === orderData.method;
                    }).realKey;
                })() : 'ALL',
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
            const chkSum = crypto.createHash('sha256').update(raw.toLowerCase()).digest('hex');
            orderData['CheckMacValue'] = chkSum;
            yield db.execute(`insert into \`${appName}\`.t_wallet (orderID, userID, money, status, note)
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
        });
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

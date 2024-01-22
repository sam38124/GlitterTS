"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcInvoice = void 0;
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const tool_js_1 = __importDefault(require("./ezpay/tool.js"));
class EcInvoice {
    static postInvoice(obj) {
        const timeStamp = `${new Date().valueOf()}`;
        const cipher = crypto_1.default.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
        let encryptedData = cipher.update(encodeURIComponent(JSON.stringify(obj.invoice_data)), 'utf-8', 'base64');
        encryptedData += cipher.final('base64');
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/Issue' : 'https://einvoice.ecpay.com.tw/B2CInvoice/Issue',
            headers: {},
            'Content-Type': 'application/json',
            data: {
                MerchantID: obj.merchNO,
                RqHeader: {
                    Timestamp: parseInt(`${timeStamp.substring(0, 10)}`, 10)
                },
                Data: encryptedData
            }
        };
        return new Promise((resolve, reject) => {
            axios_1.default.request(config)
                .then((response) => {
                console.log('invoice-->', JSON.stringify(response.data));
                resolve(response.data);
            })
                .catch((error) => {
                console.log(error);
                resolve(false);
            });
        });
    }
    static allowance(obj) {
        console.log(`invoice_data:${JSON.stringify(obj.invoice_data)}`);
        const tool = new tool_js_1.default();
        const salesMoney = 1000;
        const timeStamp = `${new Date().valueOf()}`;
        const params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log(`dateFormat--${dateFormat}`);
        const qs = tool.JsonToQueryString(params);
        console.log(qs);
        const tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log(`tradeInfo--${params.TimeStamp}`);
        let data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://cinv.ezpay.com.tw/Api/allowance_issue' : 'https://inv.ezpay.com.tw/Api/allowance_issue',
            headers: {},
            data: data
        };
        return new Promise((resolve, reject) => {
            axios_1.default.request(config)
                .then((response) => {
                console.log(JSON.stringify(response.data));
                resolve(response.data);
            })
                .catch((error) => {
                resolve(false);
            });
        });
    }
    static allowanceInvalid(obj) {
        console.log(`invoice_data:${JSON.stringify(obj.invoice_data)}`);
        const tool = new tool_js_1.default();
        const salesMoney = 1000;
        const timeStamp = `${new Date().valueOf()}`;
        const params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log(`dateFormat--${dateFormat}`);
        const qs = tool.JsonToQueryString(params);
        console.log(qs);
        const tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log(`tradeInfo--${params.TimeStamp}`);
        let data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://cinv.ezpay.com.tw/Api/allowanceInvalid' : 'https://inv.ezpay.com.tw/Api/allowanceInvalid',
            headers: {},
            data: data
        };
        return new Promise((resolve, reject) => {
            axios_1.default.request(config)
                .then((response) => {
                console.log(JSON.stringify(response.data));
                resolve(response.data);
            })
                .catch((error) => {
                resolve(false);
            });
        });
    }
    static deleteInvoice(obj) {
        const tool = new tool_js_1.default();
        const salesMoney = 1000;
        const timeStamp = `${new Date().valueOf()}`;
        const params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log(`dateFormat--${dateFormat}`);
        const qs = tool.JsonToQueryString(params);
        console.log(qs);
        const tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log(`tradeInfo--${params.TimeStamp}`);
        let data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://cinv.ezpay.com.tw/Api/invoice_invalid' : 'https://inv.ezpay.com.tw/Api/invoice_invalid',
            headers: {},
            data: data
        };
        return new Promise((resolve, reject) => {
            axios_1.default.request(config)
                .then((response) => {
                console.log(JSON.stringify(response.data));
                resolve(response.data);
            })
                .catch((error) => {
                resolve(false);
            });
        });
    }
    static getInvoice(obj) {
        const tool = new tool_js_1.default();
        const salesMoney = 1000;
        const timeStamp = `${new Date().valueOf()}`;
        const params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log(`dateFormat--${dateFormat}`);
        const qs = tool.JsonToQueryString(params);
        console.log(qs);
        const tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log(`tradeInfo--${params.TimeStamp}`);
        let data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://cinv.ezpay.com.tw/Api/invoice_search' : 'https://inv.ezpay.com.tw/Api/invoice_search',
            headers: {},
            data: data
        };
        return new Promise((resolve, reject) => {
            axios_1.default.request(config)
                .then((response) => {
                console.log(JSON.stringify(response.data));
                resolve(response.data.Status === 'SUCCESS');
            })
                .catch((error) => {
                resolve(false);
            });
        });
    }
}
exports.EcInvoice = EcInvoice;
//# sourceMappingURL=EcInvoice.js.map
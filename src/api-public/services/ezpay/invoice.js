import Tool from "./tool";
import axios from "axios";
import FormData from 'form-data';
export class EzInvoice {
    static postInvoice(obj) {
        console.log(`invoice_data:${JSON.stringify(obj.invoice_data)}`);
        const tool = new Tool();
        const salesMoney = 1000;
        const timeStamp = `${new Date().valueOf()}`;
        const params = JSON.parse(JSON.stringify(obj.invoice_data));
        var dateFormat = new Date(params.TimeStamp);
        console.log(`dateFormat--${dateFormat}`);
        const qs = tool.JsonToQueryString(params);
        console.log(qs);
        const tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log(`tradeInfo--${params.TimeStamp}`);
        let data = new FormData();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://cinv.ezpay.com.tw/Api/invoice_issue' : 'https://inv.ezpay.com.tw/Api/invoice_issue',
            headers: {},
            data: data
        };
        return new Promise((resolve, reject) => {
            axios.request(config)
                .then((response) => {
                console.log(JSON.stringify(response.data));
                resolve(response.data);
            })
                .catch((error) => {
                resolve(false);
            });
        });
    }
    static allowance(obj) {
        console.log(`invoice_data:${JSON.stringify(obj.invoice_data)}`);
        const tool = new Tool();
        const salesMoney = 1000;
        const timeStamp = `${new Date().valueOf()}`;
        const params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log(`dateFormat--${dateFormat}`);
        const qs = tool.JsonToQueryString(params);
        console.log(qs);
        const tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log(`tradeInfo--${params.TimeStamp}`);
        let data = new FormData();
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
            axios.request(config)
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
        const tool = new Tool();
        const salesMoney = 1000;
        const timeStamp = `${new Date().valueOf()}`;
        const params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log(`dateFormat--${dateFormat}`);
        const qs = tool.JsonToQueryString(params);
        console.log(qs);
        const tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log(`tradeInfo--${params.TimeStamp}`);
        let data = new FormData();
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
            axios.request(config)
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
        const tool = new Tool();
        const salesMoney = 1000;
        const timeStamp = `${new Date().valueOf()}`;
        const params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log(`dateFormat--${dateFormat}`);
        const qs = tool.JsonToQueryString(params);
        console.log(qs);
        const tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log(`tradeInfo--${params.TimeStamp}`);
        let data = new FormData();
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
            axios.request(config)
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
        const tool = new Tool();
        const salesMoney = 1000;
        const timeStamp = `${new Date().valueOf()}`;
        const params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log(`dateFormat--${dateFormat}`);
        const qs = tool.JsonToQueryString(params);
        console.log(qs);
        const tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log(`tradeInfo--${params.TimeStamp}`);
        let data = new FormData();
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
            axios.request(config)
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

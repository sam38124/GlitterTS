import crypto from "crypto";
import axios from "axios";
import FormData from 'form-data';
import Tool from "./ezpay/tool.js";

export interface EcInvoiceInterface {
    "MerchantID": string,
    "RelateNumber": string,
    "CustomerID": string,
    "CustomerIdentifier": string,
    "CustomerName": string,
    "CustomerAddr": string,
    "CustomerPhone": string,
    "CustomerEmail": string,
    LoveCode?:string,
    "Print": string,
    "Donation": string,
    "TaxType": string,
    "SalesAmount": number,
    "InvType": string,
    CarrierType: string
    CarrierNum?:string
    "Items": {
        "ItemSeq": number,
        "ItemName": string,
        "ItemCount": number,
        "ItemWord": string,
        "ItemPrice": number,
        "ItemTaxType": string,
        "ItemAmount": number,
        "ItemRemark": string
    }[]
}

export class EcInvoice {
    public static postInvoice(obj: {
        hashKey: string,
        hash_IV: string,
        merchNO: string
        invoice_data: EcInvoiceInterface,
        beta: boolean
    }) {
        const timeStamp = `${new Date().valueOf()}`
        const cipher = crypto.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
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
        //發送通知
        //PlatformID
        return new Promise<boolean>((resolve, reject) => {
            axios.request(config)
                .then((response) => {
                    console.log('invoice-->', JSON.stringify(response.data))
                    resolve(response.data)
                })
                .catch((error) => {
                    console.log(error)
                    resolve(false)
                });
        })
    }

    public static allowance(obj: {
        hashKey: string,
        hash_IV: string,
        invoice_data: any,
        merchNO: string
        beta: boolean
    }) {
        console.log(`invoice_data:${JSON.stringify(obj.invoice_data)}`)
        const tool = new Tool();
        const salesMoney = 1000
        const timeStamp = `${new Date().valueOf()}`
        // 1. 建立請求的參數
        const params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log(`dateFormat--${dateFormat}`)
        // 2. 產生 Query String
        const qs = tool.JsonToQueryString(params);
        console.log(qs)
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
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
        return new Promise<boolean>((resolve, reject) => {
            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data))
                    resolve(response.data)
                })
                .catch((error) => {
                    resolve(false)
                });
        })
    }

    public static allowanceInvalid(obj: {
        hashKey: string,
        hash_IV: string,
        invoice_data: any,
        merchNO: string
        beta: boolean
    }) {
        console.log(`invoice_data:${JSON.stringify(obj.invoice_data)}`)
        const tool = new Tool();
        const salesMoney = 1000
        const timeStamp = `${new Date().valueOf()}`
        // 1. 建立請求的參數
        const params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log(`dateFormat--${dateFormat}`)
        // 2. 產生 Query String
        const qs = tool.JsonToQueryString(params);
        console.log(qs)
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
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
        return new Promise<boolean>((resolve, reject) => {
            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data))
                    resolve(response.data)
                })
                .catch((error) => {
                    resolve(false)
                });
        })
    }

    public static deleteInvoice(obj: {
        hashKey: string,
        hash_IV: string,
        invoice_data: any,
        merchNO: string
        beta: boolean
    }) {
        const tool = new Tool();
        const salesMoney = 1000
        const timeStamp = `${new Date().valueOf()}`
        // 1. 建立請求的參數
        const params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log(`dateFormat--${dateFormat}`)
        // 2. 產生 Query String
        const qs = tool.JsonToQueryString(params);
        console.log(qs)
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
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
        return new Promise<boolean>((resolve, reject) => {
            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data))
                    resolve(response.data)
                })
                .catch((error) => {
                    resolve(false)
                });
        })
    }

    public static getInvoice(obj: {
        hashKey: string,
        hash_IV: string,
        invoice_data: any,
        merchNO: string
        beta: boolean
    }) {
        const tool = new Tool();
        const salesMoney = 1000
        const timeStamp = `${new Date().valueOf()}`
        // 1. 建立請求的參數
        const params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log(`dateFormat--${dateFormat}`)
        // 2. 產生 Query String
        const qs = tool.JsonToQueryString(params);
        console.log(qs)
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
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
        return new Promise<boolean>((resolve, reject) => {
            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data))
                    resolve(response.data.Status === 'SUCCESS')
                })
                .catch((error) => {
                    resolve(false)
                });
        })

    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EzInvoice = void 0;
var tool_1 = require("./tool");
var axios_1 = require("axios");
var form_data_1 = require("form-data");
var EzInvoice = /** @class */ (function () {
    function EzInvoice() {
    }
    EzInvoice.postInvoice = function (obj) {
        console.log("invoice_data:".concat(JSON.stringify(obj.invoice_data)));
        var tool = new tool_1.default();
        var salesMoney = 1000;
        var timeStamp = "".concat(new Date().valueOf());
        // 1. 建立請求的參數
        var params = JSON.parse(JSON.stringify(obj.invoice_data));
        var dateFormat = new Date(params.TimeStamp);
        console.log("dateFormat--".concat(dateFormat));
        // 2. 產生 Query String
        var qs = tool.JsonToQueryString(params);
        console.log(qs);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        var tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log("tradeInfo--".concat(params.TimeStamp));
        var data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://cinv.ezpay.com.tw/Api/invoice_issue' : 'https://inv.ezpay.com.tw/Api/invoice_issue',
            headers: {},
            data: data
        };
        return new Promise(function (resolve, reject) {
            axios_1.default.request(config)
                .then(function (response) {
                console.log(JSON.stringify(response.data));
                resolve(response.data);
            })
                .catch(function (error) {
                resolve(false);
            });
        });
    };
    EzInvoice.allowance = function (obj) {
        console.log("invoice_data:".concat(JSON.stringify(obj.invoice_data)));
        var tool = new tool_1.default();
        var salesMoney = 1000;
        var timeStamp = "".concat(new Date().valueOf());
        // 1. 建立請求的參數
        var params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log("dateFormat--".concat(dateFormat));
        // 2. 產生 Query String
        var qs = tool.JsonToQueryString(params);
        console.log(qs);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        var tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log("tradeInfo--".concat(params.TimeStamp));
        var data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://cinv.ezpay.com.tw/Api/allowance_issue' : 'https://inv.ezpay.com.tw/Api/allowance_issue',
            headers: {},
            data: data
        };
        return new Promise(function (resolve, reject) {
            axios_1.default.request(config)
                .then(function (response) {
                console.log(JSON.stringify(response.data));
                resolve(response.data);
            })
                .catch(function (error) {
                resolve(false);
            });
        });
    };
    EzInvoice.allowanceInvalid = function (obj) {
        console.log("invoice_data:".concat(JSON.stringify(obj.invoice_data)));
        var tool = new tool_1.default();
        var salesMoney = 1000;
        var timeStamp = "".concat(new Date().valueOf());
        // 1. 建立請求的參數
        var params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log("dateFormat--".concat(dateFormat));
        // 2. 產生 Query String
        var qs = tool.JsonToQueryString(params);
        console.log(qs);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        var tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log("tradeInfo--".concat(params.TimeStamp));
        var data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://cinv.ezpay.com.tw/Api/allowanceInvalid' : 'https://inv.ezpay.com.tw/Api/allowanceInvalid',
            headers: {},
            data: data
        };
        return new Promise(function (resolve, reject) {
            axios_1.default.request(config)
                .then(function (response) {
                console.log(JSON.stringify(response.data));
                resolve(response.data);
            })
                .catch(function (error) {
                resolve(false);
            });
        });
    };
    EzInvoice.deleteInvoice = function (obj) {
        var tool = new tool_1.default();
        var salesMoney = 1000;
        var timeStamp = "".concat(new Date().valueOf());
        // 1. 建立請求的參數
        var params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log("dateFormat--".concat(dateFormat));
        // 2. 產生 Query String
        var qs = tool.JsonToQueryString(params);
        console.log(qs);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        var tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log("tradeInfo--".concat(params.TimeStamp));
        var data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://cinv.ezpay.com.tw/Api/invoice_invalid' : 'https://inv.ezpay.com.tw/Api/invoice_invalid',
            headers: {},
            data: data
        };
        return new Promise(function (resolve, reject) {
            axios_1.default.request(config)
                .then(function (response) {
                console.log(JSON.stringify(response.data));
                resolve(response.data);
            })
                .catch(function (error) {
                resolve(false);
            });
        });
    };
    EzInvoice.getInvoice = function (obj) {
        var tool = new tool_1.default();
        var salesMoney = 1000;
        var timeStamp = "".concat(new Date().valueOf());
        // 1. 建立請求的參數
        var params = obj.invoice_data;
        var dateFormat = new Date(params.TimeStamp);
        console.log("dateFormat--".concat(dateFormat));
        // 2. 產生 Query String
        var qs = tool.JsonToQueryString(params);
        console.log(qs);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        var tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        console.log("tradeInfo--".concat(params.TimeStamp));
        var data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://cinv.ezpay.com.tw/Api/invoice_search' : 'https://inv.ezpay.com.tw/Api/invoice_search',
            headers: {},
            data: data
        };
        return new Promise(function (resolve, reject) {
            axios_1.default.request(config)
                .then(function (response) {
                console.log(JSON.stringify(response.data));
                resolve(response.data.Status === 'SUCCESS');
            })
                .catch(function (error) {
                resolve(false);
            });
        });
    };
    return EzInvoice;
}());
exports.EzInvoice = EzInvoice;

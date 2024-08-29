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
const database_1 = __importDefault(require("../../modules/database"));
const jsdom_1 = __importDefault(require("jsdom"));
const app_js_1 = __importDefault(require("../../app.js"));
class EcInvoice {
    static getCompanyName(obj) {
        return new Promise(async (resolve, reject) => {
            const cf_ = await app_js_1.default.getAdConfig(obj.app_name, 'invoice_setting');
            const send_invoice = {
                MerchantID: cf_.merchNO,
                UnifiedBusinessNo: obj.company_id
            };
            const timeStamp = `${new Date().valueOf()}`;
            const cipher = crypto_1.default.createCipheriv('aes-128-cbc', cf_.hashkey, cf_.hashiv);
            let encryptedData = cipher.update(encodeURIComponent(JSON.stringify(send_invoice)), 'utf-8', 'base64');
            encryptedData += cipher.final('base64');
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: (cf_.point === 'beta') ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/GetCompanyNameByTaxID' : 'https://einvoice.ecpay.com.tw/B2CInvoice/GetCompanyNameByTaxID',
                headers: {},
                'Content-Type': 'application/json',
                data: {
                    MerchantID: cf_.merchNO,
                    RqHeader: {
                        Timestamp: parseInt(`${timeStamp.substring(0, 10)}`, 10)
                    },
                    Data: encryptedData
                }
            };
            axios_1.default.request(config)
                .then(async (response) => {
                const decipher = crypto_1.default.createDecipheriv('aes-128-cbc', cf_.hashkey, cf_.hashiv);
                let decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                try {
                    decrypted += decipher.final('utf-8');
                }
                catch (e) {
                    e instanceof Error && console.log(e.message);
                }
                const resp = JSON.parse(decodeURIComponent(decrypted));
                console.log(`resp--->`, resp);
                resolve(resp.CompanyName);
            })
                .catch((error) => {
                console.log(error);
                resolve(false);
            });
        });
    }
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
                .then(async (response) => {
                const decipher = crypto_1.default.createDecipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
                let decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                try {
                    decrypted += decipher.final('utf-8');
                }
                catch (e) {
                    e instanceof Error && console.log(e.message);
                }
                const resp = JSON.parse(decodeURIComponent(decrypted));
                console.log(`resp--->`, resp);
                await database_1.default.query(`insert into \`${obj.app_name}\`.t_invoice_memory set ?`, [
                    {
                        order_id: obj.invoice_data.RelateNumber,
                        invoice_no: resp.InvoiceNo,
                        invoice_data: JSON.stringify({
                            original_data: obj.invoice_data,
                            response: resp
                        }),
                        create_date: resp.InvoiceDate
                    }
                ]);
                if (obj.print) {
                    resolve(await this.printInvoice({
                        hashKey: obj.hashKey,
                        hash_IV: obj.hash_IV,
                        merchNO: obj.merchNO,
                        app_name: obj.app_name,
                        order_id: obj.invoice_data.RelateNumber,
                        beta: obj.beta
                    }));
                }
                else {
                    resolve(response.data);
                }
            })
                .catch((error) => {
                console.log(error);
                resolve(false);
            });
        });
    }
    static printInvoice(obj) {
        return new Promise(async (resolve, reject) => {
            const invoice_data = (await database_1.default.query(`SELECT *
                                                  FROM \`${obj.app_name}\`.t_invoice_memory
                                                  where order_id = ?;`, [obj.order_id]))[0];
            const send_invoice = {
                MerchantID: obj.merchNO,
                InvoiceNo: invoice_data.invoice_data.response.InvoiceNo,
                InvoiceDate: `${invoice_data.invoice_data.response.InvoiceDate}`.substring(0, 10),
                PrintStyle: 3,
                IsShowingDetail: 2
            };
            const timeStamp = `${new Date().valueOf()}`;
            const cipher = crypto_1.default.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
            let encryptedData = cipher.update(encodeURIComponent(JSON.stringify(send_invoice)), 'utf-8', 'base64');
            encryptedData += cipher.final('base64');
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: (obj.beta) ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/InvoicePrint' : 'https://einvoice.ecpay.com.tw/B2CInvoice/InvoicePrint',
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
            axios_1.default.request(config)
                .then(async (response) => {
                const decipher = crypto_1.default.createDecipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
                let decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                try {
                    decrypted += decipher.final('utf-8');
                }
                catch (e) {
                    e instanceof Error && console.log(e.message);
                }
                const resp = JSON.parse(decodeURIComponent(decrypted));
                const htmlData = await axios_1.default.request({
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: resp.InvoiceHtml
                });
                const dom = new jsdom_1.default.JSDOM(htmlData.data);
                const document = dom.window.document;
                const inputs = document.querySelectorAll("input");
                let qrcode = [];
                inputs.forEach(input => {
                    qrcode.push(input.value);
                });
                resolve({
                    qrcode_0: qrcode[0],
                    link: resp.InvoiceHtml,
                    qrcode_1: qrcode[1],
                    bar_code: qrcode[0].substring(10, 15) + invoice_data.invoice_data.response.InvoiceNo + invoice_data.invoice_data.response.RandomNumber
                });
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
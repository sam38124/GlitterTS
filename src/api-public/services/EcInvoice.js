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
                UnifiedBusinessNo: obj.company_id,
            };
            const timeStamp = `${new Date().valueOf()}`;
            const cipher = crypto_1.default.createCipheriv('aes-128-cbc', cf_.hashkey, cf_.hashiv);
            let encryptedData = cipher.update(encodeURIComponent(JSON.stringify(send_invoice)), 'utf-8', 'base64');
            encryptedData += cipher.final('base64');
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: cf_.point === 'beta'
                    ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/GetCompanyNameByTaxID'
                    : 'https://einvoice.ecpay.com.tw/B2CInvoice/GetCompanyNameByTaxID',
                headers: {},
                'Content-Type': 'application/json',
                data: {
                    MerchantID: cf_.merchNO,
                    RqHeader: {
                        Timestamp: parseInt(`${timeStamp.substring(0, 10)}`, 10),
                    },
                    Data: encryptedData,
                },
            };
            axios_1.default
                .request(config)
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
        console.log(`obj.invoice_data--->`, obj.invoice_data);
        let encryptedData = cipher.update(encodeURIComponent(JSON.stringify(obj.invoice_data)), 'utf-8', 'base64');
        encryptedData += cipher.final('base64');
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: obj.beta
                ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/Issue'
                : 'https://einvoice.ecpay.com.tw/B2CInvoice/Issue',
            headers: {},
            'Content-Type': 'application/json',
            data: {
                MerchantID: obj.merchNO,
                RqHeader: {
                    Timestamp: parseInt(`${timeStamp.substring(0, 10)}`, 10),
                },
                Data: encryptedData,
            },
        };
        return new Promise((resolve, reject) => {
            axios_1.default
                .request(config)
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
                await database_1.default.query(`insert into \`${obj.app_name}\`.t_invoice_memory
                          set ?`, [
                    {
                        order_id: obj.order_id,
                        invoice_no: resp.InvoiceNo,
                        invoice_data: JSON.stringify({
                            original_data: obj.invoice_data,
                            response: resp,
                            orderData: obj.orderData
                        }),
                        create_date: resp.InvoiceDate,
                    },
                ]);
                if (obj.print) {
                    resolve(await this.printInvoice({
                        hashKey: obj.hashKey,
                        hash_IV: obj.hash_IV,
                        merchNO: obj.merchNO,
                        app_name: obj.app_name,
                        order_id: obj.order_id,
                        beta: obj.beta,
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
    static voidInvoice(obj) {
        const timeStamp = `${new Date().valueOf()}`;
        const cipher = crypto_1.default.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
        let encryptedData = cipher.update(encodeURIComponent(JSON.stringify(obj.invoice_data)), 'utf-8', 'base64');
        encryptedData += cipher.final('base64');
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: obj.beta
                ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/Invalid'
                : 'https://einvoice.ecpay.com.tw/B2CInvoice/Invalid',
            headers: {},
            'Content-Type': 'application/json',
            data: {
                MerchantID: obj.merchNO,
                RqHeader: {
                    Timestamp: parseInt(`${timeStamp.substring(0, 10)}`, 10),
                },
                Data: encryptedData,
            },
        };
        return new Promise((resolve, reject) => {
            axios_1.default
                .request(config)
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
                await database_1.default.query(`UPDATE \`${obj.app_name}\`.t_invoice_memory
                          set status = 2
                          WHERE invoice_no = '${obj.invoice_data.InvoiceNo}'`, []);
                resolve(response.data);
            })
                .catch((error) => {
                console.log(error);
                resolve(false);
            });
        });
    }
    static allowanceInvoice(obj) {
        const timeStamp = `${new Date().valueOf()}`;
        const cipher = crypto_1.default.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
        let encryptedData = cipher.update(encodeURIComponent(JSON.stringify(obj.allowance_data)), 'utf-8', 'base64');
        encryptedData += cipher.final('base64');
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: obj.beta
                ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/Allowance'
                : 'https://einvoice.ecpay.com.tw/B2CInvoice/Allowance',
            headers: {},
            'Content-Type': 'application/json',
            data: {
                MerchantID: obj.merchNO,
                RqHeader: {
                    Timestamp: parseInt(`${timeStamp.substring(0, 10)}`, 10),
                },
                Data: encryptedData,
            },
        };
        return new Promise((resolve, reject) => {
            axios_1.default
                .request(config)
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
                if (resp.RtnCode != 1) {
                    resolve(resp);
                    return resp;
                }
                else {
                    await database_1.default.query(`insert into \`${obj.app_name}\`.t_allowance_memory
                            set ?`, [
                        {
                            status: '1',
                            order_id: obj.order_id,
                            invoice_no: obj.allowance_data.InvoiceNo,
                            allowance_no: resp.IA_Allow_No,
                            allowance_data: JSON.stringify(obj.db_data),
                            create_date: resp.IA_Date,
                        },
                    ]);
                    resolve(resp);
                    return resp;
                }
            })
                .catch((error) => {
                console.log(error);
                resolve(false);
            });
        });
    }
    static voidAllowance(obj) {
        const timeStamp = `${new Date().valueOf()}`;
        const cipher = crypto_1.default.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
        let encryptedData = cipher.update(encodeURIComponent(JSON.stringify(obj.allowance_data)), 'utf-8', 'base64');
        encryptedData += cipher.final('base64');
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: obj.beta
                ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/AllowanceInvalid'
                : 'https://einvoice.ecpay.com.tw/B2CInvoice/AllowanceInvalid',
            headers: {},
            'Content-Type': 'application/json',
            data: {
                MerchantID: obj.merchNO,
                RqHeader: {
                    Timestamp: parseInt(`${timeStamp.substring(0, 10)}`, 10),
                },
                Data: encryptedData,
            },
        };
        return new Promise((resolve, reject) => {
            axios_1.default
                .request(config)
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
                let allowanceData = await database_1.default.query(`SELECT *
             FROM \`${obj.app_name}\`.t_allowance_memory
             WHERE allowance_no = ?`, [obj.allowance_data.AllowanceNo]);
                allowanceData[0].allowance_data.voidReason = obj.allowance_data.Reason;
                await database_1.default.query(`UPDATE \`${obj.app_name}\`.t_allowance_memory
             SET ?
             WHERE allowance_no = ?`, [
                    {
                        status: 2,
                        allowance_data: JSON.stringify(allowanceData[0].allowance_data),
                    },
                    obj.allowance_data.AllowanceNo,
                ]);
                resolve(response.data);
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
                IsShowingDetail: 1,
            };
            const timeStamp = `${new Date().valueOf()}`;
            const cipher = crypto_1.default.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
            let encryptedData = cipher.update(encodeURIComponent(JSON.stringify(send_invoice)), 'utf-8', 'base64');
            encryptedData += cipher.final('base64');
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: obj.beta
                    ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/InvoicePrint'
                    : 'https://einvoice.ecpay.com.tw/B2CInvoice/InvoicePrint',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                },
                'Content-Type': 'application/json',
                data: {
                    MerchantID: obj.merchNO,
                    RqHeader: {
                        Timestamp: parseInt(`${timeStamp.substring(0, 10)}`, 10),
                    },
                    Data: encryptedData,
                },
            };
            axios_1.default
                .request(config)
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
                    url: resp.InvoiceHtml,
                });
                console.log(`resp.InvoiceHtml=>`, resp.InvoiceHtml);
                const dom = new jsdom_1.default.JSDOM(htmlData.data);
                const document = dom.window.document;
                const inputs = document.querySelectorAll('input');
                let qrcode = [];
                inputs.forEach(input => {
                    qrcode.push(input.value);
                });
                const bigTitles = document.querySelectorAll('.data_big');
                let bigTitle = [];
                bigTitles.forEach(input => {
                    bigTitle.push(input.innerHTML);
                });
                const resolve_data = {
                    create_date: document.querySelector('font').innerHTML,
                    date: bigTitle[0].replace(/\n/g, '').trim(),
                    invoice_code: bigTitle[1].replace(/\n/g, '').trim(),
                    qrcode_0: qrcode[0],
                    qrcode_1: qrcode[1],
                    link: resp.InvoiceHtml,
                    random_code: document.querySelectorAll('.fl font')[1].innerHTML,
                    total: document.querySelectorAll('.fr font')[1].innerHTML,
                    sale_gui: document.querySelectorAll('.fl font')[2].innerHTML,
                    buy_gui: (document.querySelectorAll('.fr font')[2] || { innerHTML: '' }).innerHTML,
                    pay_detail: document.querySelectorAll('table')[2].outerHTML,
                    pay_detail_footer: document.querySelector('.invoice-detail-sum').outerHTML,
                    bar_code: qrcode[0].substring(10, 15) +
                        invoice_data.invoice_data.response.InvoiceNo +
                        invoice_data.invoice_data.response.RandomNumber,
                };
                console.log(`invoice_data==>`, resolve_data);
                resolve(resolve_data);
            })
                .catch((error) => {
                console.error(`取得失敗::`, error);
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
            url: obj.beta ? 'https://cinv.ezpay.com.tw/Api/allowance_issue' : 'https://inv.ezpay.com.tw/Api/allowance_issue',
            headers: {},
            data: data,
        };
        return new Promise((resolve, reject) => {
            axios_1.default
                .request(config)
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
            url: obj.beta
                ? 'https://cinv.ezpay.com.tw/Api/allowanceInvalid'
                : 'https://inv.ezpay.com.tw/Api/allowanceInvalid',
            headers: {},
            data: data,
        };
        return new Promise((resolve, reject) => {
            axios_1.default
                .request(config)
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
        const dateFormat = new Date(params.TimeStamp);
        const qs = tool.JsonToQueryString(params);
        const tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
        let data = new form_data_1.default();
        data.append('MerchantID_', obj.merchNO);
        data.append('PostData_', tradeInfo);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: obj.beta ? 'https://cinv.ezpay.com.tw/Api/invoice_invalid' : 'https://inv.ezpay.com.tw/Api/invoice_invalid',
            headers: {},
            data: data,
        };
        return new Promise((resolve, reject) => {
            axios_1.default
                .request(config)
                .then((response) => {
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
            url: obj.beta ? 'https://cinv.ezpay.com.tw/Api/invoice_search' : 'https://inv.ezpay.com.tw/Api/invoice_search',
            headers: {},
            data: data,
        };
        return new Promise((resolve, reject) => {
            axios_1.default
                .request(config)
                .then((response) => {
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
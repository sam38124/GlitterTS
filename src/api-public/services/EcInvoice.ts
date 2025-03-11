import crypto from "crypto";
import axios from "axios";
import FormData, {from} from 'form-data';
import Tool from "./ezpay/tool.js";
import db from '../../modules/database';
import JSDOM from 'jsdom'
import app from "../../app.js";

export interface EcInvoiceInterface {
    "MerchantID": string,
    "RelateNumber": string,
    "CustomerID": string,
    "CustomerIdentifier": string,
    "CustomerName": string,
    "CustomerAddr": string,
    "CustomerPhone": string,
    "CustomerEmail": string,
    LoveCode?: string,
    ClearanceMark?: any,
    "Print": string,
    "Donation": string,
    "TaxType": string,
    "SalesAmount": number,
    "InvType": string,
    CarrierType: string
    CarrierNum?: string
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

export interface EcPrintInterFace {
    MerchantID: string,
    InvoiceNo: string,
    InvoiceDate: string,
    PrintStyle: 1 | 2 | 3 | 4 | 5,
    IsShowingDetail: 1 | 2
}

export class EcInvoice {
    //取得公司名稱
    public static getCompanyName(obj: {
        company_id: string,
        app_name: string
    }) {
        return new Promise<any>(async (resolve, reject) => {
            const cf_ = await app.getAdConfig(obj.app_name, 'invoice_setting');
            const send_invoice: any = {
                MerchantID: cf_.merchNO,
                UnifiedBusinessNo: obj.company_id
            }
            const timeStamp = `${new Date().valueOf()}`
            const cipher = crypto.createCipheriv('aes-128-cbc', cf_.hashkey, cf_.hashiv);
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
            axios.request(config)
                .then(async (response:any) => {
                    const decipher = crypto.createDecipheriv('aes-128-cbc', cf_.hashkey, cf_.hashiv);
                    let decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                    try {
                        decrypted += decipher.final('utf-8');
                    } catch (e) {
                        e instanceof Error && console.log(e.message);
                    }
                    const resp = JSON.parse(decodeURIComponent(decrypted))
                    console.log(`resp--->`, resp)
                    resolve(resp.CompanyName)
                })
                .catch((error:any) => {
                    console.log(error)
                    resolve(false)
                });
        })
    }

    public static postInvoice(obj: {
        hashKey: string,
        hash_IV: string,
        merchNO: string,
        app_name: string,
        invoice_data: EcInvoiceInterface,
        beta: boolean,
        print: boolean
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
                .then(async (response:any) => {

                    const decipher = crypto.createDecipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
                    let decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                    try {
                        decrypted += decipher.final('utf-8');
                    } catch (e) {
                        e instanceof Error && console.log(e.message);
                    }
                    const resp = JSON.parse(decodeURIComponent(decrypted));
                    console.log(`invoice_data--->`, resp);
                    await db.query(`insert into \`${obj.app_name}\`.t_invoice_memory
                                    set ?`, [
                        {
                            order_id: obj.invoice_data.RelateNumber,
                            invoice_no: resp.InvoiceNo,
                            invoice_data: JSON.stringify({
                                original_data: obj.invoice_data,
                                response: resp
                            }),
                            create_date: resp.InvoiceDate
                        }
                    ])
                    if (obj.print) {
                        resolve(await this.printInvoice({
                            hashKey: obj.hashKey,
                            hash_IV: obj.hash_IV,
                            merchNO: obj.merchNO,
                            app_name: obj.app_name,
                            order_id: obj.invoice_data.RelateNumber,
                            beta: obj.beta
                        }))
                    } else {
                        resolve(response.data)
                    }
                })
                .catch((error:any) => {
                    console.log(error)
                    resolve(false)
                });
        })
    }

    //發票作廢
    public static voidInvoice(obj: {
        hashKey: string,
        hash_IV: string,
        merchNO: string,
        app_name: string,
        invoice_data: any,
        beta: boolean,
    }) {
        const timeStamp = `${new Date().valueOf()}`
        const cipher = crypto.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
        let encryptedData = cipher.update(encodeURIComponent(JSON.stringify(obj.invoice_data)), 'utf-8', 'base64');
        encryptedData += cipher.final('base64');
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/Invalid' : 'https://einvoice.ecpay.com.tw/B2CInvoice/Invalid',
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
                .then(async (response:any) => {
                    const decipher = crypto.createDecipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
                    let decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                    try {
                        decrypted += decipher.final('utf-8');
                    } catch (e) {
                        e instanceof Error && console.log(e.message);
                    }
                    const resp = JSON.parse(decodeURIComponent(decrypted))
                    console.log(`resp--->`, resp)
                    await db.query(`UPDATE \`${obj.app_name}\`.t_invoice_memory
                                    set status = 2
                                    WHERE invoice_no = '${obj.invoice_data.InvoiceNo}'`, [])
                    resolve(response.data)
                })
                .catch((error:any) => {
                    console.log(error)
                    resolve(false)
                });
        })
    }

    //發票折讓
    public static allowanceInvoice(obj: {
        hashKey: string,
        hash_IV: string,
        merchNO: string,
        app_name: string,
        allowance_data: any,
        beta: boolean,
        db_data: any,
        order_id: string,
    }) {
        const timeStamp = `${new Date().valueOf()}`
        const cipher = crypto.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
        let encryptedData = cipher.update(encodeURIComponent(JSON.stringify(obj.allowance_data)), 'utf-8', 'base64');
        encryptedData += cipher.final('base64');
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/Allowance' : 'https://einvoice.ecpay.com.tw/B2CInvoice/Allowance',
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
                .then(async (response:any) => {
                    const decipher = crypto.createDecipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
                    let decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                    try {
                        decrypted += decipher.final('utf-8');
                    } catch (e) {
                        e instanceof Error && console.log(e.message);
                    }
                    const resp = JSON.parse(decodeURIComponent(decrypted))
                    if (resp.RtnCode!=1){
                        resolve(resp)
                        return resp
                    }else {
                        await db.query(`insert into \`${obj.app_name}\`.t_allowance_memory
                                    set ?`, [
                            {
                                status: "1",
                                order_id: obj.order_id,
                                invoice_no: obj.allowance_data.InvoiceNo,
                                allowance_no: resp.IA_Allow_No,
                                allowance_data: JSON.stringify(obj.db_data),
                                create_date: resp.IA_Date,
                            }
                        ])
                        resolve(resp)
                        return resp
                    }

                })
                .catch((error:any) => {
                    console.log(error)
                    resolve(false)
                });
        })
    }

    //廢棄發票折讓
    public static voidAllowance(obj: {
        hashKey: string,
        hash_IV: string,
        merchNO: string,
        app_name: string,
        allowance_data: any,
        beta: boolean,
    }) {
        const timeStamp = `${new Date().valueOf()}`
        const cipher = crypto.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
        let encryptedData = cipher.update(encodeURIComponent(JSON.stringify(obj.allowance_data)), 'utf-8', 'base64');
        encryptedData += cipher.final('base64');

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: (obj.beta) ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/AllowanceInvalid' : 'https://einvoice.ecpay.com.tw/B2CInvoice/AllowanceInvalid',
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
                .then(async (response:any) => {
                    const decipher = crypto.createDecipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
                    let decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                    try {
                        decrypted += decipher.final('utf-8');
                    } catch (e) {
                        e instanceof Error && console.log(e.message);
                    }
                    const resp = JSON.parse(decodeURIComponent(decrypted))
                    console.log(`resp--->`, resp);
                    let allowanceData = await db.query(
                        `SELECT * FROM \`${obj.app_name}\`.t_allowance_memory
                         WHERE allowance_no = ?`,
                        [obj.allowance_data.AllowanceNo]
                    );
                    allowanceData[0].allowance_data.voidReason = obj.allowance_data.Reason;

                    await db.query(
                        `UPDATE \`${obj.app_name}\`.t_allowance_memory
                         SET ?
                         WHERE allowance_no = ?`,
                        [{status: 2 , allowance_data:JSON.stringify(allowanceData[0].allowance_data)}, obj.allowance_data.AllowanceNo]
                    );
                    resolve(response.data)
                })
                .catch((error:any) => {
                    console.log(error)
                    resolve(false)
                });
        })
    }

    //發票列印
    public static printInvoice(obj: {
        hashKey: string,
        hash_IV: string,
        merchNO: string,
        app_name: string,
        order_id: string,
        beta: boolean
    }) {
        return new Promise<any>(async (resolve, reject) => {
            const invoice_data = (await db.query(`SELECT *
                                                  FROM \`${obj.app_name}\`.t_invoice_memory
                                                  where order_id = ?;`, [obj.order_id]))[0]
            const send_invoice: EcPrintInterFace = {
                MerchantID: obj.merchNO,
                InvoiceNo: invoice_data.invoice_data.response.InvoiceNo,
                InvoiceDate: `${invoice_data.invoice_data.response.InvoiceDate}`.substring(0, 10),
                PrintStyle: 3,
                IsShowingDetail: 1
            }
            const timeStamp = `${new Date().valueOf()}`
            const cipher = crypto.createCipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
            let encryptedData = cipher.update(encodeURIComponent(JSON.stringify(send_invoice)), 'utf-8', 'base64');
            encryptedData += cipher.final('base64');
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: (obj.beta) ? 'https://einvoice-stage.ecpay.com.tw/B2CInvoice/InvoicePrint' : 'https://einvoice.ecpay.com.tw/B2CInvoice/InvoicePrint',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
                },
                'Content-Type': 'application/json',
                data: {
                    MerchantID: obj.merchNO,
                    RqHeader: {
                        Timestamp: parseInt(`${timeStamp.substring(0, 10)}`, 10)
                    },
                    Data: encryptedData
                }
            };
            axios.request(config)
                .then(async (response:any) => {
                    const decipher = crypto.createDecipheriv('aes-128-cbc', obj.hashKey, obj.hash_IV);
                    let decrypted = decipher.update(response.data.Data, 'base64', 'utf-8');
                    try {
                        decrypted += decipher.final('utf-8');
                    } catch (e) {
                        e instanceof Error && console.log(e.message);
                    }
                    const resp = JSON.parse(decodeURIComponent(decrypted))
                    const htmlData = await axios.request({
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: resp.InvoiceHtml
                    })
                    console.log(`resp.InvoiceHtml=>`, resp.InvoiceHtml)
                    const dom = new JSDOM.JSDOM(htmlData.data);
                    const document = dom.window.document;
                    //Qrcode取得
                    const inputs = document.querySelectorAll("input");
                    let qrcode: string[] = []
                    inputs.forEach(input => {
                        qrcode.push(input.value)
                    });
                    //發票標題取得
                    const bigTitles = document.querySelectorAll(".data_big")
                    let bigTitle: string[] = []
                    bigTitles.forEach(input => {
                        bigTitle.push(input.innerHTML)
                    });
                    const resolve_data = {
                        //開立日期
                        create_date: document.querySelector('font')!!.innerHTML,
                        //發票區間
                        date: bigTitle[0].replace(/\n/g, '').trim(),
                        //發票號碼
                        invoice_code: bigTitle[1].replace(/\n/g, '').trim(),
                        //Qrcode_0
                        qrcode_0: qrcode[0],
                        //Qrcode_1
                        qrcode_1: qrcode[1],
                        //開立連結
                        link: resp.InvoiceHtml,
                        //隨機碼
                        random_code: document.querySelectorAll('.fl font')[1].innerHTML,
                        //總計
                        total: document.querySelectorAll('.fr font')[1].innerHTML,
                        //賣方
                        sale_gui: document.querySelectorAll('.fl font')[2].innerHTML,
                        //買方
                        buy_gui: (document.querySelectorAll('.fr font')[2] || {innerHTML: ''}).innerHTML,
                        //交易明細
                        pay_detail: document.querySelectorAll('table')[2].outerHTML,
                        //底部付款資訊
                        pay_detail_footer: (document.querySelector('.invoice-detail-sum') as any).outerHTML,
                        bar_code: qrcode[0].substring(10, 15) + invoice_data.invoice_data.response.InvoiceNo + invoice_data.invoice_data.response.RandomNumber
                    }
                    console.log(`invoice_data==>`, resolve_data)
                    resolve(resolve_data)
                })
                .catch((error:any) => {
                    console.error(`取得失敗::`, error)
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
                .then((response:any) => {
                    console.log(JSON.stringify(response.data))
                    resolve(response.data)
                })
                .catch((error:any) => {
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
                .then((response:any) => {
                    console.log(JSON.stringify(response.data))
                    resolve(response.data)
                })
                .catch((error:any) => {
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
        const dateFormat = new Date(params.TimeStamp);
        // 2. 產生 Query String
        const qs = tool.JsonToQueryString(params);
        // 3. 開始加密
        // { method: 'aes-256-cbc', inputEndcoding: 'utf-8', outputEndcoding: 'hex' };
        // createCipheriv 方法中，key 要滿 32 字元、iv 要滿 16 字元，請之後測試多注意這點
        const tradeInfo = tool.aesEncrypt(qs, obj.hashKey, obj.hash_IV);
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
                .then((response:any) => {
                    resolve(response.data)
                })
                .catch((error:any) => {
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
                .then((response:any) => {
                    resolve(response.data.Status === 'SUCCESS')
                })
                .catch((error:any) => {
                    resolve(false)
                });
        })

    }
}
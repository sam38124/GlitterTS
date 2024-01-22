import app from "../../app.js";
import response from "../../modules/response.js";
import {EzInvoice} from "./ezpay/invoice.js";
import exception from "../../modules/exception.js";
import db from "../../modules/database.js";
import {EcInvoice, EcInvoiceInterface} from "./EcInvoice.js";

export class Invoice {
    public appName: string

    constructor(appName: string) {
        this.appName = appName
    }

    //判斷發票類型開立
    public async postInvoice(cf: {
        invoice_data:any
    }) {
        try {
            const config = await app.getAdConfig(this.appName, "invoice_setting");
            switch (config.fincial) {
                case "ezpay":
                    if (!Invoice.checkWhiteList(config,cf.invoice_data )) {
                        throw exception.BadRequestError('BAD_REQUEST', 'PostInvoice Error:白名單驗證未通過', null);
                    }
                    return await EzInvoice.postInvoice({
                        hashKey: config.hashkey,
                        hash_IV: config.hashiv,
                        merchNO: config.merchNO,
                        invoice_data: cf.invoice_data,
                        beta: (config.point === "beta")
                    });
                case "ecpay":
                    return await EcInvoice.postInvoice({
                        hashKey: config.hashkey,
                        hash_IV: config.hashiv,
                        merchNO: config.merchNO,
                        invoice_data: cf.invoice_data,
                        beta: (config.point === "beta")
                    });
            }
        } catch (e: any) {
            throw exception.BadRequestError('BAD_REQUEST', e.message, null);
        }

    }

    //訂單開發票
    public async postCheckoutInvoice(orderID:string){
        const order:{
            user_info:{
                "name": string,
                "note": string,
                "email": string,
                "phone": string,
                "address": string,
                "gui_number"?:string,
                "company"?:string,
            },
            "total": number,
            "lineItems": [
                {
                    "id": number,
                    "spec": string[],
                    "count": number,
                    "title": string,
                    "collection": string[],
                    "sale_price": number,
                    "preview_image": string,
                    "discount_price": number
                }
            ]
        }=(await db.query(`SELECT * FROM \`${this.appName}\`.t_checkout where cart_token=?`,[orderID]))[0]['orderData']
        const config = await app.getAdConfig(this.appName, "invoice_setting");
        if(config.fincial==='ezpay'){
            const timeStamp = '' + new Date().getTime();
            const json={
                RespondType: 'JSON',
                Version: '1.5',
                TimeStamp: timeStamp.substring(0, timeStamp.length - 3),
                MerchantOrderNo: orderID,
                Status: 1,
                Category: order.user_info.company && order.user_info.gui_number ? 'B2B' : 'B2C',
                BuyerUBN: order.user_info.gui_number,
                BuyerName: order.user_info.company || order.user_info.name,
                BuyerAddress: order.user_info.address,
                BuyerEmail: order.user_info.email,
                PrintFlag: 'Y',
                TaxType: '1',
                TaxRate: '5',
                generateType: 'auto',
                TotalAmt: order.total,
                Amt: Math.round(order.total / (1 + 5 / 100)),
                TaxAmt: Math.round(order.total - order.total / (1 + 5 / 100)),
                ItemName: order.lineItems.map((dd) => [dd.title].concat(dd.spec).join('-')).join('|'),
                ItemUnit: order.lineItems.map((dd) => '件').join('|'),
                ItemPrice: order.lineItems.map((dd) => dd.sale_price).join('|'),
                ItemCount: order.lineItems.map((dd) =>  dd.count).join('|'),
                ItemAmt: order.lineItems.map((dd) =>  dd.sale_price * dd.count).join('|'),
                ItemTaxType: order.lineItems.map(() => '1').join('|'),
            }
            return await (this.postInvoice({
                invoice_data:json
            }))
        }else if(config.fincial==='ecpay'){
            const json:EcInvoiceInterface={
                MerchantID:config.merchNO as string,
                RelateNumber:orderID as string,
                CustomerID:order.user_info.email as string,
                CustomerIdentifier:(order.user_info.gui_number || '') as string,
                CustomerName:(order.user_info.company || order.user_info.name) as string,
                CustomerAddr:order.user_info.address as string,
                CustomerPhone:(order.user_info.phone || '') as string,
                CustomerEmail:order.user_info.email as string,
                Print:'0',
                CarrierType:'1',
                Donation:'0',
                TaxType:'1',
                SalesAmount:order.total,
                InvType:'07',
                Items:order.lineItems.map((dd,index)=>{
                    return {
                        "ItemSeq": index + 1,
                        "ItemName": dd.title+(dd.spec.join(' / ') && ` - ${dd.spec.join(' / ')}`),
                        "ItemCount": dd.count,
                        "ItemWord": "件",
                        "ItemPrice": dd.sale_price,
                        "ItemTaxType": "1",
                        "ItemAmount": dd.sale_price * dd.count,
                        "ItemRemark": ""
                    }
                })
            }
            console.log(`invoice_data->`,json)
            return await (this.postInvoice({
                invoice_data:json
            }))
        }


    }

    public static checkWhiteList(config: any, invoice_data: any) {
        if (config.point === "beta" && invoice_data.BuyerEmail && config.whiteList && config.whiteList.length > 0) {
            return config.whiteList.find((dd: any) => {
                return dd.email === invoice_data.BuyerEmail
            })
        } else {
            return true
        }
    }
}
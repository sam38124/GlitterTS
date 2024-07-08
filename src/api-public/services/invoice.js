var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import app from "../../app.js";
import { EzInvoice } from "./ezpay/invoice.js";
import exception from "../../modules/exception.js";
import db from "../../modules/database.js";
import { EcInvoice } from "./EcInvoice.js";
export class Invoice {
    constructor(appName) {
        this.appName = appName;
    }
    postInvoice(cf) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = yield app.getAdConfig(this.appName, "invoice_setting");
                switch (config.fincial) {
                    case "ezpay":
                        return yield EzInvoice.postInvoice({
                            hashKey: config.hashkey,
                            hash_IV: config.hashiv,
                            merchNO: config.merchNO,
                            invoice_data: cf.invoice_data,
                            beta: (config.point === "beta")
                        });
                    case "ecpay":
                        return yield EcInvoice.postInvoice({
                            hashKey: config.hashkey,
                            hash_IV: config.hashiv,
                            merchNO: config.merchNO,
                            invoice_data: cf.invoice_data,
                            beta: (config.point === "beta")
                        });
                }
            }
            catch (e) {
                throw exception.BadRequestError('BAD_REQUEST', e.message, null);
            }
        });
    }
    postCheckoutInvoice(orderID) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = (yield db.query(`SELECT *
                             FROM \`${this.appName}\`.t_checkout
                             where cart_token = ?`, [orderID]))[0]['orderData'];
            const config = yield app.getAdConfig(this.appName, "invoice_setting");
            const line_item = order.lineItems.map((dd) => {
                return {
                    ItemName: dd.title + (dd.spec.join('-') ? `/${dd.spec.join('-')}` : ``),
                    ItemUnit: '件',
                    ItemCount: dd.count,
                    ItemPrice: dd.sale_price,
                    ItemAmt: dd.sale_price * dd.count,
                };
            });
            if (order.use_rebate) {
                line_item.push({
                    ItemName: '回饋金',
                    ItemUnit: '-',
                    ItemCount: 1,
                    ItemPrice: order.use_rebate * -1,
                    ItemAmt: order.use_rebate,
                });
            }
            if (order.discount) {
                line_item.push({
                    ItemName: '折扣',
                    ItemUnit: '-',
                    ItemCount: 1,
                    ItemPrice: order.discount * -1,
                    ItemAmt: order.discount,
                });
            }
            if (order.shipment_fee) {
                line_item.push({
                    ItemName: '運費',
                    ItemUnit: '趟',
                    ItemCount: 1,
                    ItemPrice: order.shipment_fee,
                    ItemAmt: order.shipment_fee,
                });
            }
            if (config.fincial === 'ezpay') {
                const timeStamp = '' + new Date().getTime();
                const json = {
                    RespondType: 'JSON',
                    Version: '1.5',
                    TimeStamp: timeStamp.substring(0, timeStamp.length - 3),
                    MerchantOrderNo: orderID,
                    Status: 1,
                    Category: order.user_info.invoice_type === 'company' ? 'B2B' : 'B2C',
                    BuyerUBN: order.user_info.invoice_type === 'company' ? order.user_info.gui_number : undefined,
                    BuyerName: order.user_info.invoice_type === 'company' ? order.user_info.company : order.user_info.name,
                    BuyerAddress: order.user_info.address,
                    BuyerEmail: order.user_info.email,
                    PrintFlag: 'Y',
                    TaxType: '1',
                    TaxRate: '5',
                    generateType: 'auto',
                    TotalAmt: order.total,
                    Amt: Math.round(order.total / (1 + 5 / 100)),
                    TaxAmt: Math.round(order.total - order.total / (1 + 5 / 100)),
                    ItemName: line_item.map((dd) => dd.ItemName || dd.name).join('|'),
                    ItemUnit: line_item.map((dd) => dd.ItemUnit || '件').join('|'),
                    ItemPrice: line_item.map((dd) => dd.ItemPrice || dd.price).join('|'),
                    ItemCount: line_item.map((dd) => dd.ItemCount || dd.quantity).join('|'),
                    ItemAmt: line_item.map((dd) => dd.ItemAmt || dd.price * dd.quantity).join('|'),
                    ItemTaxType: line_item.map(() => '1').join('|'),
                };
                return yield (this.postInvoice({
                    invoice_data: json
                }));
            }
            else if (config.fincial === 'ecpay') {
                const json = {
                    MerchantID: config.merchNO,
                    RelateNumber: orderID,
                    CustomerID: order.user_info.email,
                    CustomerIdentifier: (order.user_info.invoice_type === 'company' ? (order.user_info.gui_number || '') : undefined),
                    CustomerName: (order.user_info.invoice_type === 'company' ? (order.user_info.company) : order.user_info.name),
                    CustomerAddr: order.user_info.address,
                    CustomerPhone: (order.user_info.phone || undefined),
                    CustomerEmail: order.user_info.email,
                    Print: '0',
                    CarrierType: (order.user_info.invoice_type === 'me' && order.user_info.send_type === 'carrier') ? '3' : '1',
                    CarrierNum: (order.user_info.invoice_type === 'me' && order.user_info.send_type === 'carrier') ? order.user_info.carrier_num : undefined,
                    Donation: (order.user_info.invoice_type === 'donate') ? '1' : '0',
                    LoveCode: (order.user_info.invoice_type === 'donate') ? order.user_info.love_code : undefined,
                    TaxType: '1',
                    SalesAmount: order.total,
                    InvType: '07',
                    Items: line_item.map((dd, index) => {
                        return {
                            "ItemSeq": index + 1,
                            "ItemName": dd.ItemName,
                            "ItemCount": dd.ItemCount,
                            "ItemWord": dd.ItemUnit,
                            "ItemPrice": dd.ItemPrice,
                            "ItemTaxType": "1",
                            "ItemAmount": dd.ItemAmt,
                            "ItemRemark": ""
                        };
                    })
                };
                console.log(`invoice_data->`, json);
                return yield (this.postInvoice({
                    invoice_data: json
                }));
            }
        });
    }
    static checkWhiteList(config, invoice_data) {
        if (config.point === "beta" && invoice_data.BuyerEmail && config.whiteList && config.whiteList.length > 0) {
            return config.whiteList.find((dd) => {
                return dd.email === invoice_data.BuyerEmail;
            });
        }
        else {
            return true;
        }
    }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const app_js_1 = __importDefault(require("../../app.js"));
const invoice_js_1 = require("./ezpay/invoice.js");
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
class Invoice {
    constructor(appName) {
        this.appName = appName;
    }
    async postInvoice(cf) {
        try {
            const config = await app_js_1.default.getAdConfig(this.appName, "invoice_setting");
            switch (config.fincial) {
                case "ezpay":
                    if (!Invoice.checkWhiteList(config, cf.invoice_data)) {
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'PostInvoice Error:白名單驗證未通過', null);
                    }
                    return await invoice_js_1.EzInvoice.postInvoice({
                        hashKey: config.hashkey,
                        hash_IV: config.hashiv,
                        merchNO: config.merchNO,
                        invoice_data: cf.invoice_data,
                        beta: (config.point === "beta")
                    });
                case "green":
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', '尚未支援', null);
            }
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }
    async postCheckoutInvoice(orderID) {
        const order = (await database_js_1.default.query(`SELECT * FROM \`${this.appName}\`.t_checkout where cart_token=?`, [orderID]))[0]['orderData'];
        const timeStamp = '' + new Date().getTime();
        const json = {
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
            ItemCount: order.lineItems.map((dd) => dd.count).join('|'),
            ItemAmt: order.lineItems.map((dd) => dd.sale_price * dd.count).join('|'),
            ItemTaxType: order.lineItems.map(() => '1').join('|'),
        };
        return await (this.postInvoice({
            invoice_data: json
        }));
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
exports.Invoice = Invoice;
//# sourceMappingURL=invoice.js.map
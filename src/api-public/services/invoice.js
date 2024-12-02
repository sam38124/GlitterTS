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
const EcInvoice_js_1 = require("./EcInvoice.js");
class Invoice {
    constructor(appName) {
        this.appName = appName;
    }
    async postInvoice(cf) {
        try {
            const config = await app_js_1.default.getAdConfig(this.appName, 'invoice_setting');
            switch (config.fincial) {
                case 'ezpay':
                    return await invoice_js_1.EzInvoice.postInvoice({
                        hashKey: config.hashkey,
                        hash_IV: config.hashiv,
                        merchNO: config.merchNO,
                        invoice_data: cf.invoice_data,
                        beta: config.point === 'beta',
                    });
                case 'ecpay':
                    return await EcInvoice_js_1.EcInvoice.postInvoice({
                        hashKey: config.hashkey,
                        hash_IV: config.hashiv,
                        merchNO: config.merchNO,
                        app_name: this.appName,
                        invoice_data: cf.invoice_data,
                        beta: config.point === 'beta',
                        print: cf.print
                    });
            }
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }
    async postCheckoutInvoice(orderID, print) {
        const order = (typeof orderID === 'string') ? (await database_js_1.default.query(`SELECT *
                             FROM \`${this.appName}\`.t_checkout
                             where cart_token = ?`, [orderID]))[0]['orderData'] : orderID;
        const config = await app_js_1.default.getAdConfig(this.appName, 'invoice_setting');
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
                ItemName: '購物金',
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
                ItemAmt: order.discount * -1,
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
                MerchantOrderNo: (typeof orderID === 'string') ? orderID : order.orderID,
                Status: 1,
                Category: order.user_info.invoice_type === 'company' ? 'B2B' : 'B2C',
                BuyerUBN: order.user_info.invoice_type === 'company' ? order.user_info.gui_number : undefined,
                BuyerName: order.user_info.invoice_type === 'company' ? order.user_info.company : order.user_info.name,
                BuyerAddress: order.user_info.address,
                BuyerEmail: (order.user_info.email === 'no-email') ? 'pos@ncdesign.info' : order.user_info.email,
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
            return await this.postInvoice({
                invoice_data: json,
                print: print
            });
        }
        else if (config.fincial === 'ecpay') {
            const json = {
                MerchantID: config.merchNO,
                RelateNumber: (typeof orderID === 'string') ? orderID : orderID.orderID,
                CustomerID: (typeof orderID === 'string') ? orderID : orderID.orderID,
                CustomerIdentifier: (order.user_info.invoice_type === 'company' ? order.user_info.gui_number || '' : undefined),
                CustomerName: (order.user_info.invoice_type === 'company' ? order.user_info.company : order.user_info.name),
                CustomerAddr: order.user_info.address,
                CustomerPhone: (order.user_info.phone || undefined),
                CustomerEmail: (order.user_info.email === 'no-email') ? 'pos@ncdesign.info' : order.user_info.email,
                Print: '0',
                CarrierType: order.user_info.invoice_type === 'me' && order.user_info.send_type === 'carrier' ? '3' : '1',
                CarrierNum: order.user_info.invoice_type === 'me' && order.user_info.send_type === 'carrier' ? order.user_info.carrier_num : undefined,
                Donation: order.user_info.invoice_type === 'donate' ? '1' : '0',
                LoveCode: order.user_info.invoice_type === 'donate' ? order.user_info.love_code : undefined,
                TaxType: '1',
                SalesAmount: order.total,
                InvType: '07',
                Items: line_item.map((dd, index) => {
                    return {
                        ItemSeq: index + 1,
                        ItemName: dd.ItemName,
                        ItemCount: dd.ItemCount,
                        ItemWord: dd.ItemUnit,
                        ItemPrice: dd.ItemPrice,
                        ItemTaxType: '1',
                        ItemAmount: dd.ItemAmt,
                        ItemRemark: '',
                    };
                }),
            };
            if (print) {
                const cover = {
                    "CustomerID": "",
                    "CustomerName": "無名氏",
                    "CustomerAddr": "無地址",
                    "CustomerPhone": "",
                    "CustomerEmail": (order.user_info.email && order.user_info.email !== 'no-email') ? order.user_info.email : "pos@ncdesign.info",
                    "ClearanceMark": "1",
                    "Print": "1",
                    "Donation": "0",
                    "LoveCode": "",
                    "CarrierType": "",
                    "CarrierNum": "",
                    "TaxType": "1",
                    "InvType": "07"
                };
                console.log(`cover.CustomerEmail==>`, cover.CustomerEmail);
                if (order.user_info.invoice_type === 'company') {
                    cover.CustomerName = await EcInvoice_js_1.EcInvoice.getCompanyName({
                        company_id: order.user_info.gui_number,
                        app_name: this.appName
                    });
                }
                Object.keys(cover).map((dd) => {
                    json[dd] = cover[dd];
                });
            }
            return await this.postInvoice({
                invoice_data: json,
                print: print
            });
        }
        else {
            return 'no_need';
        }
    }
    async updateInvoice(obj) {
        let data = await database_js_1.default.query(`SELECT *
                             FROM \`${this.appName}\`.t_invoice_memory
                             where order_id = ?`, [obj.orderID]);
        data = data[0];
        data.invoice_data.remark = obj.invoice_data;
        await database_js_1.default.query(`UPDATE \`${this.appName}\`.t_invoice_memory set invoice_data = ? WHERE order_id = ?`, [
            JSON.stringify(data.invoice_data), obj.orderID
        ]);
    }
    static checkWhiteList(config, invoice_data) {
        if (config.point === 'beta' && invoice_data.BuyerEmail && config.whiteList && config.whiteList.length > 0) {
            return config.whiteList.find((dd) => {
                return dd.email === invoice_data.BuyerEmail;
            });
        }
        else {
            return true;
        }
    }
    async getInvoice(query) {
        try {
            let querySql = [`1=1`];
            if (query.search) {
                switch (query.searchType) {
                    case 'invoice_number':
                        querySql.push(`invoice_no LIKE '%${query.search}%'`);
                        break;
                    case 'name':
                        querySql.push(`JSON_EXTRACT(invoice_data, '$.original_data.CustomerName') LIKE '%${query.search}%'`);
                        break;
                    case 'business_number':
                        querySql.push(`JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier') LIKE '%${query.search}%'`);
                        break;
                    case 'phone':
                        querySql.push(`JSON_EXTRACT(invoice_data, '$.original_data.CustomerPhone') LIKE '%${query.search}%'`);
                        break;
                    case 'product_name':
                        querySql.push(`JSON_EXTRACT(invoice_data, '$.original_data.Items[*].ItemName') LIKE '%${query.search}%'`);
                        break;
                    case 'product_number':
                        querySql.push(`JSON_EXTRACT(invoice_data, '$.original_data.Items[*].ItemNumber') LIKE '%${query.search}%'`);
                        break;
                    case 'order_number':
                    default:
                        querySql.push(`order_id LIKE '%${query.search}%'`);
                        break;
                }
            }
            if (query.invoice_type) {
                const invoice_type = query.invoice_type;
            }
            if (query.created_time) {
                const created_time = query.created_time.split(',');
                if (created_time.length > 1) {
                    querySql.push(`
                        (create_date BETWEEN ${database_js_1.default.escape(`${created_time[0]} 00:00:00`)} 
                        AND ${database_js_1.default.escape(`${created_time[1]} 23:59:59`)})
                    `);
                }
            }
            if (query.invoice_type) {
                const data = query.invoice_type;
                if (data == "B2B") {
                    querySql.push(`
                            JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier') IS NULL
                            OR CHAR_LENGTH(JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier')) = 0`);
                }
                else {
                    querySql.push(`JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier') IS NOT NULL
                              AND CHAR_LENGTH(JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier')) > 0`);
                }
            }
            if (query.issue_method) {
                if (query.issue_method == "manual") {
                    console.log("query.issue_method -- ", query.issue_method);
                    querySql.push(`JSON_EXTRACT(invoice_data, '$.remark.issueType') IS NOT NULL
                              AND CHAR_LENGTH(JSON_EXTRACT(invoice_data, '$.remark.issueType')) > 0`);
                }
                else {
                    querySql.push(`
                            JSON_EXTRACT(invoice_data, '$.remark.issueType') IS NULL
                            OR CHAR_LENGTH(JSON_EXTRACT(invoice_data, '$.remark.issueType')) = 0`);
                }
            }
            query.status && querySql.push(`status IN (${query.status})`);
            query.orderString = (() => {
                switch (query.orderString) {
                    case 'created_time_desc':
                        return `order by create_date desc`;
                    case 'created_time_asc':
                        return `order by create_date ASC`;
                    case 'order_total_desc':
                        return `ORDER BY JSON_EXTRACT(invoice_data, '$.original_data.SalesAmount') DESC`;
                    case 'order_total_asc':
                        return `ORDER BY JSON_EXTRACT(invoice_data, '$.original_data.SalesAmount') ASC`;
                    case 'default':
                    default:
                        return `order by id desc`;
                }
            })();
            let sql = `SELECT *
                   FROM \`${this.appName}\`.t_invoice_memory
                   WHERE ${querySql.join(' and ')} ${query.orderString || `order by id desc`}
        `;
            return {
                data: await database_js_1.default.query(`SELECT *
                         FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, []),
                total: (await database_js_1.default.query(`SELECT count(1)
                             FROM (${sql}) as subqyery`, []))[0]['count(1)'],
            };
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }
    async getAllowance(query) {
        try {
            let querySql = [`1=1`];
            console.log("searchType -- ", query.searchType);
            if (query.search) {
                querySql.push(`${query.searchType} LIKE '%${query.search}%'`);
            }
            if (query.created_time) {
                const created_time = query.created_time.split(',');
                if (created_time.length > 1) {
                    querySql.push(`
                        (create_date BETWEEN ${database_js_1.default.escape(`${created_time[0]} 00:00:00`)} 
                        AND ${database_js_1.default.escape(`${created_time[1]} 23:59:59`)})
                    `);
                }
            }
            query.status && querySql.push(`status IN (${query.status})`);
            query.orderString = (() => {
                switch (query.orderString) {
                    case 'created_time_desc':
                        return `order by create_date desc`;
                    case 'created_time_asc':
                        return `order by create_date ASC`;
                    case 'order_total_desc':
                        return `ORDER BY JSON_EXTRACT(invoice_data, '$.original_data.SalesAmount') DESC`;
                    case 'order_total_asc':
                        return `ORDER BY JSON_EXTRACT(invoice_data, '$.original_data.SalesAmount') ASC`;
                    case 'default':
                    default:
                        return `order by id desc`;
                }
            })();
            let sql = `SELECT *
                   FROM \`${this.appName}\`.t_allowance_memory
                   WHERE ${querySql.join(' and ')} ${query.orderString || `order by id desc`}
        `;
            return {
                data: await database_js_1.default.query(`SELECT *
                         FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, []),
                total: (await database_js_1.default.query(`SELECT count(1)
                             FROM (${sql}) as subqyery`, []))[0]['count(1)'],
            };
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }
    async querySql(querySql, query) {
        let sql = `SELECT *
                   FROM \`${this.appName}\`.t_invoice_memory
                   WHERE ${querySql.join(' and ')} ${query.order_by || `order by id desc`}
        `;
        try {
            return await database_js_1.default.query(sql, []);
        }
        catch (e) {
            console.log("get invoice failed:", e);
        }
    }
}
exports.Invoice = Invoice;
//# sourceMappingURL=invoice.js.map
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
var app_js_1 = require("../../app.js");
var invoice_js_1 = require("./ezpay/invoice.js");
var exception_js_1 = require("../../modules/exception.js");
var database_js_1 = require("../../modules/database.js");
var EcInvoice_js_1 = require("./EcInvoice.js");
var shopping_js_1 = require("./shopping.js");
var tool_js_1 = require("../../modules/tool.js");
var Invoice = /** @class */ (function () {
    function Invoice(appName) {
        this.appName = appName;
    }
    //判斷發票類型開立
    Invoice.prototype.postInvoice = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var config, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, app_js_1.default.getAdConfig(this.appName, 'invoice_setting')];
                    case 1:
                        config = _b.sent();
                        _a = config.fincial;
                        switch (_a) {
                            case 'ezpay': return [3 /*break*/, 2];
                            case 'ecpay': return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 2: return [4 /*yield*/, invoice_js_1.EzInvoice.postInvoice({
                            hashKey: config.hashkey,
                            hash_IV: config.hashiv,
                            merchNO: config.merchNO,
                            invoice_data: cf.invoice_data,
                            beta: config.point === 'beta',
                        })];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4: return [4 /*yield*/, EcInvoice_js_1.EcInvoice.postInvoice({
                            hashKey: config.hashkey,
                            hash_IV: config.hashiv,
                            merchNO: config.merchNO,
                            app_name: this.appName,
                            invoice_data: cf.invoice_data,
                            orderData: cf.orderData,
                            beta: config.point === 'beta',
                            order_id: cf.order_id,
                            print: cf.print,
                        })];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_1 = _b.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', e_1.message, null);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    //訂單開發票
    Invoice.prototype.postCheckoutInvoice = function (orderID, print, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var order, _a, count_invoice, config, can_discount_tax_5, can_discount_tax_0, line_item, all_discount, free_tax_discount, timeStamp, json, json_1, cover_1, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(typeof orderID === 'string')) return [3 /*break*/, 2];
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n             FROM `".concat(this.appName, "`.t_checkout\n             where cart_token = ?"), [orderID])];
                    case 1:
                        _a = (_c.sent())[0]['orderData'];
                        return [3 /*break*/, 3];
                    case 2:
                        _a = orderID;
                        _c.label = 3;
                    case 3:
                        order = _a;
                        return [4 /*yield*/, database_js_1.default.query("SELECT count(1)\n                                           from `".concat(this.appName, "`.t_invoice_memory\n                                           where order_id = ?\n                                             and status = 1"), [order.orderID])];
                    case 4:
                        count_invoice = (_c.sent())[0]['count(1)'];
                        if (count_invoice) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, app_js_1.default.getAdConfig(this.appName, 'invoice_setting')];
                    case 5:
                        config = _c.sent();
                        can_discount_tax_5 = 0;
                        can_discount_tax_0 = 0;
                        return [4 /*yield*/, Promise.all(order.lineItems.map(function (dd) { return __awaiter(_this, void 0, void 0, function () {
                                var product, tax_type;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, new shopping_js_1.Shopping(this.appName).getProduct({
                                                id: "".concat(dd.id),
                                                page: 0,
                                                limit: 1,
                                            })];
                                        case 1:
                                            product = _a.sent();
                                            tax_type = product.data && product.data.content && product.data.content.tax === '0' ? 3 : 1;
                                            if (tax_type === 3) {
                                                can_discount_tax_0 += dd.sale_price * dd.count;
                                            }
                                            else {
                                                can_discount_tax_5 += dd.sale_price * dd.count;
                                            }
                                            return [2 /*return*/, {
                                                    ItemName: dd.title + (dd.spec.join('-') ? "/".concat(dd.spec.join('-')) : ""),
                                                    ItemUnit: '件',
                                                    ItemCount: dd.count,
                                                    ItemPrice: dd.sale_price,
                                                    ItemAmt: dd.sale_price * dd.count,
                                                    ItemTaxType: tax_type,
                                                }];
                                    }
                                });
                            }); }))];
                    case 6:
                        line_item = _c.sent();
                        order.use_rebate = parseInt("".concat(order.use_rebate || '0'), 10);
                        order.discount = parseInt("".concat(order.discount || '0'), 10);
                        order.shipment_fee = parseInt("".concat(order.shipment_fee || '0'), 10);
                        all_discount = order.use_rebate + order.discount;
                        if (order.shipment_fee) {
                            can_discount_tax_5 = can_discount_tax_5 + order.shipment_fee;
                            line_item.push({
                                ItemName: '運費',
                                ItemUnit: '趟',
                                ItemCount: 1,
                                ItemPrice: order.shipment_fee,
                                ItemAmt: order.shipment_fee,
                                ItemTaxType: 1,
                            });
                        }
                        line_item.push({
                            ItemName: '應稅折扣',
                            ItemUnit: '-',
                            ItemCount: 1,
                            ItemPrice: (all_discount <= can_discount_tax_5 ? all_discount : can_discount_tax_5) * -1,
                            ItemAmt: (all_discount <= can_discount_tax_5 ? all_discount : can_discount_tax_5) * -1,
                            ItemTaxType: 1,
                        });
                        //所有折扣扣除應稅折扣
                        if (line_item.find(function (dd) {
                            return dd.ItemTaxType === 3;
                        })) {
                            free_tax_discount = all_discount - can_discount_tax_5;
                            line_item.push({
                                ItemName: '免稅折扣',
                                ItemUnit: '-',
                                ItemCount: 1,
                                ItemPrice: (free_tax_discount > 0 ? free_tax_discount : 0) * -1,
                                ItemAmt: (free_tax_discount > 0 ? free_tax_discount : 0) * -1,
                                ItemTaxType: 3,
                            });
                        }
                        if (!(config.fincial === 'ezpay')) return [3 /*break*/, 8];
                        timeStamp = '' + new Date().getTime();
                        json = {
                            RespondType: 'JSON',
                            Version: '1.5',
                            TimeStamp: timeStamp.substring(0, timeStamp.length - 3),
                            MerchantOrderNo: typeof orderID === 'string' ? orderID : order.orderID,
                            Status: 1,
                            Category: order.user_info.invoice_type === 'company' ? 'B2B' : 'B2C',
                            BuyerUBN: order.user_info.invoice_type === 'company' ? order.user_info.gui_number : undefined,
                            BuyerName: order.user_info.invoice_type === 'company' ? order.user_info.company : order.user_info.name,
                            BuyerAddress: order.user_info.address,
                            BuyerEmail: order.user_info.email === 'no-email' ? 'pos@ncdesign.info' : order.user_info.email,
                            PrintFlag: 'Y',
                            TaxType: '1',
                            TaxRate: '5',
                            generateType: 'auto',
                            TotalAmt: order.total,
                            Amt: Math.round(order.total / (1 + 5 / 100)),
                            TaxAmt: Math.round(order.total - order.total / (1 + 5 / 100)),
                            ItemName: line_item.map(function (dd) { return dd.ItemName || dd.name; }).join('|'),
                            ItemUnit: line_item.map(function (dd) { return dd.ItemUnit || '件'; }).join('|'),
                            ItemPrice: line_item.map(function (dd) { return dd.ItemPrice || dd.price; }).join('|'),
                            ItemCount: line_item.map(function (dd) { return dd.ItemCount || dd.quantity; }).join('|'),
                            ItemAmt: line_item.map(function (dd) { return dd.ItemAmt || dd.price * dd.quantity; }).join('|'),
                            ItemTaxType: line_item.map(function () { return '1'; }).join('|'),
                        };
                        return [4 /*yield*/, this.postInvoice({
                                invoice_data: json,
                                print: print,
                                orderData: order,
                                order_id: typeof orderID === 'string' ? orderID : orderID.orderID,
                            })];
                    case 7: return [2 /*return*/, _c.sent()];
                    case 8:
                        if (!(config.fincial === 'ecpay')) return [3 /*break*/, 13];
                        json_1 = {
                            MerchantID: config.merchNO,
                            RelateNumber: (typeof orderID === 'string' ? orderID : orderID.orderID) + "_".concat(tool_js_1.default.randomString(4)),
                            CustomerID: (typeof orderID === 'string' ? orderID : orderID.orderID) + "_".concat(tool_js_1.default.randomString(4)),
                            CustomerIdentifier: (order.user_info.invoice_type === 'company'
                                ? order.user_info.gui_number || ''
                                : undefined),
                            CustomerName: (order.user_info.invoice_type === 'company'
                                ? order.user_info.company
                                : order.user_info.name),
                            CustomerAddr: order.user_info.address,
                            CustomerPhone: (order.user_info.phone || undefined),
                            CustomerEmail: order.user_info.email === 'no-email' ? 'pos@ncdesign.info' : order.user_info.email,
                            Print: order.user_info.invoice_type === 'company' ? '1' : '0',
                            CarrierType: order.user_info.invoice_type === 'me' && order.user_info.send_type === 'carrier' ? '3' : '1',
                            CarrierNum: order.user_info.invoice_type === 'me' && order.user_info.send_type === 'carrier'
                                ? order.user_info.carrier_num
                                : undefined,
                            Donation: order.user_info.invoice_type === 'donate' ? '1' : '0',
                            LoveCode: order.user_info.invoice_type === 'donate' ? order.user_info.love_code : undefined,
                            TaxType: line_item.find(function (dd) {
                                return dd.ItemTaxType === 3;
                            })
                                ? '9'
                                : '1',
                            SalesAmount: order.total,
                            InvType: '07',
                            Items: line_item.map(function (dd, index) {
                                return {
                                    ItemSeq: index + 1,
                                    ItemName: dd.ItemName,
                                    ItemCount: dd.ItemCount,
                                    ItemWord: dd.ItemUnit,
                                    ItemPrice: dd.ItemPrice,
                                    ItemTaxType: dd.ItemTaxType,
                                    ItemAmount: dd.ItemAmt,
                                    ItemRemark: '',
                                };
                            }),
                        };
                        if (order.user_info.invoice_type === 'company') {
                            json_1 = __assign(__assign({}, json_1), { ClearanceMark: '1', Print: '1', Donation: '0', LoveCode: '', CarrierType: '', CarrierNum: '' });
                        }
                        if (!print) return [3 /*break*/, 11];
                        cover_1 = {
                            CustomerID: '',
                            CustomerName: '無名氏',
                            CustomerAddr: '無地址',
                            CustomerPhone: '',
                            CustomerEmail: order.user_info.email && order.user_info.email !== 'no-email' ? order.user_info.email : 'pos@ncdesign.info',
                            ClearanceMark: '1',
                            Print: '1',
                            Donation: '0',
                            LoveCode: '',
                            CarrierType: '',
                            CarrierNum: '',
                        };
                        if (!(order.user_info.invoice_type === 'company')) return [3 /*break*/, 10];
                        _b = cover_1;
                        return [4 /*yield*/, EcInvoice_js_1.EcInvoice.getCompanyName({
                                company_id: order.user_info.gui_number,
                                app_name: this.appName,
                            })];
                    case 9:
                        _b.CustomerName = _c.sent();
                        _c.label = 10;
                    case 10:
                        Object.keys(cover_1).map(function (dd) {
                            json_1[dd] = cover_1[dd];
                        });
                        _c.label = 11;
                    case 11: return [4 /*yield*/, this.postInvoice({
                            invoice_data: json_1,
                            print: print,
                            orderData: order,
                            order_id: typeof orderID === 'string' ? orderID : orderID.orderID,
                        })];
                    case 12: return [2 /*return*/, _c.sent()];
                    case 13: return [2 /*return*/, 'no_need'];
                }
            });
        });
    };
    Invoice.prototype.updateInvoice = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.default.query("SELECT *\n       FROM `".concat(this.appName, "`.t_invoice_memory\n       where order_id = ?"), [obj.orderID])];
                    case 1:
                        data = _a.sent();
                        data = data[0];
                        data.invoice_data.remark = obj.invoice_data;
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.appName, "`.t_invoice_memory\n       set invoice_data = ?\n       WHERE order_id = ?"), [JSON.stringify(data.invoice_data), obj.orderID])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //儲值開立發票
    // public async postCheckoutInvoice(orderID: string|any ,print:boolean) {
    //     const order: {
    //         user_info: {
    //             name: string;
    //             note: string;
    //             email: string;
    //             phone: string;
    //             address: string;
    //             gui_number?: string;
    //             company?: string;
    //             invoice_type: 'company' | 'me' | 'donate';
    //             send_type: 'email' | 'carrier';
    //             carrier_num: string;
    //         };
    //         total: number;
    //         lineItems: [
    //             {
    //                 id: number;
    //                 spec: string[];
    //                 count: number;
    //                 title: string;
    //                 collection: string[];
    //                 sale_price: number;
    //                 preview_image: string;
    //                 discount_price: number;
    //             }
    //         ];
    //         use_wallet: number;
    //         use_rebate: number;
    //         shipment_fee: number;
    //         discount: number;
    //     } = (typeof orderID==='string') ? (
    //         await db.query(
    //             `SELECT *
    //                          FROM \`${this.appName}\`.t_checkout
    //                          where cart_token = ?`,
    //             [orderID]
    //         )
    //     )[0]['orderData'] : orderID;
    //     const config = await app.getAdConfig(this.appName, 'invoice_setting');
    //     const line_item = order.lineItems.map((dd) => {
    //         return {
    //             ItemName: dd.title + (dd.spec.join('-') ? `/${dd.spec.join('-')}` : ``),
    //             ItemUnit: '件',
    //             ItemCount: dd.count,
    //             ItemPrice: dd.sale_price,
    //             ItemAmt: dd.sale_price * dd.count,
    //         };
    //     });
    //     if (order.use_rebate) {
    //         line_item.push({
    //             ItemName: '購物金',
    //             ItemUnit: '-',
    //             ItemCount: 1,
    //             ItemPrice: order.use_rebate * -1,
    //             ItemAmt: order.use_rebate,
    //         });
    //     }
    //     if (order.discount) {
    //         line_item.push({
    //             ItemName: '折扣',
    //             ItemUnit: '-',
    //             ItemCount: 1,
    //             ItemPrice: order.discount * -1,
    //             ItemAmt: order.discount * -1,
    //         });
    //     }
    //     if (order.shipment_fee) {
    //         line_item.push({
    //             ItemName: '運費',
    //             ItemUnit: '趟',
    //             ItemCount: 1,
    //             ItemPrice: order.shipment_fee,
    //             ItemAmt: order.shipment_fee,
    //         });
    //     }
    //     if (config.fincial === 'ezpay') {
    //         const timeStamp = '' + new Date().getTime();
    //         const json = {
    //             RespondType: 'JSON',
    //             Version: '1.5',
    //             TimeStamp: timeStamp.substring(0, timeStamp.length - 3),
    //             MerchantOrderNo: orderID,
    //             Status: 1,
    //             Category: order.user_info.invoice_type === 'company' ? 'B2B' : 'B2C',
    //             BuyerUBN: order.user_info.invoice_type === 'company' ? order.user_info.gui_number : undefined,
    //             BuyerName: order.user_info.invoice_type === 'company' ? order.user_info.company : order.user_info.name,
    //             BuyerAddress: order.user_info.address,
    //             BuyerEmail: (order.user_info.email==='no-email') ?  'pos@ncdesign.info':order.user_info.email,
    //             PrintFlag: 'Y',
    //             TaxType: '1',
    //             TaxRate: '5',
    //             generateType: 'auto',
    //             TotalAmt: order.total,
    //             Amt: Math.round(order.total / (1 + 5 / 100)),
    //             TaxAmt: Math.round(order.total - order.total / (1 + 5 / 100)),
    //             ItemName: line_item.map((dd: any) => dd.ItemName || dd.name).join('|'),
    //             ItemUnit: line_item.map((dd: any) => dd.ItemUnit || '件').join('|'),
    //             ItemPrice: line_item.map((dd: any) => dd.ItemPrice || dd.price).join('|'),
    //             ItemCount: line_item.map((dd: any) => dd.ItemCount || dd.quantity).join('|'),
    //             ItemAmt: line_item.map((dd: any) => dd.ItemAmt || dd.price * dd.quantity).join('|'),
    //             ItemTaxType: line_item.map(() => '1').join('|'),
    //         };
    //         return await this.postInvoice({
    //             invoice_data: json,
    //             print:print
    //         });
    //     } else if (config.fincial === 'ecpay') {
    //         const json: EcInvoiceInterface = {
    //             MerchantID: config.merchNO as string,
    //             RelateNumber: (typeof orderID==='string') ? orderID as string : orderID.orderID,
    //             CustomerID: order.user_info.email as string,
    //             CustomerIdentifier: (order.user_info.invoice_type === 'company' ? order.user_info.gui_number || '' : undefined) as string,
    //             CustomerName: (order.user_info.invoice_type === 'company' ? order.user_info.company : order.user_info.name) as string,
    //             CustomerAddr: order.user_info.address as string,
    //             CustomerPhone: (order.user_info.phone || undefined) as string,
    //             CustomerEmail: (order.user_info.email==='no-email') ?  'pos@ncdesign.info':order.user_info.email,
    //             Print: '0',
    //             CarrierType: order.user_info.invoice_type === 'me' && order.user_info.send_type === 'carrier' ? '3' : '1',
    //             CarrierNum: order.user_info.invoice_type === 'me' && order.user_info.send_type === 'carrier' ? order.user_info.carrier_num : undefined,
    //             Donation: order.user_info.invoice_type === 'donate' ? '1' : '0',
    //             LoveCode: order.user_info.invoice_type === 'donate' ? (order.user_info as any).love_code : undefined,
    //             TaxType: '1',
    //             SalesAmount: order.total,
    //             InvType: '07',
    //             Items: line_item.map((dd, index) => {
    //                 return {
    //                     ItemSeq: index + 1,
    //                     ItemName: dd.ItemName,
    //                     ItemCount: dd.ItemCount,
    //                     ItemWord: dd.ItemUnit,
    //                     ItemPrice: dd.ItemPrice,
    //                     ItemTaxType: '1',
    //                     ItemAmount: dd.ItemAmt,
    //                     ItemRemark: '',
    //                 };
    //             }),
    //         };
    //         if(print){
    //             const cover={
    //                 "CustomerID": "",
    //                 "CustomerName": "無名氏",
    //                 "CustomerAddr": "無地址",
    //                 "CustomerPhone": "",
    //                 "CustomerEmail": (order.user_info.email && order.user_info.email!=='no-email') ?order.user_info.email: "pos@ncdesign.info",
    //                 "ClearanceMark": "1",
    //                 "Print": "1",
    //                 "Donation": "0",
    //                 "LoveCode": "",
    //                 "CarrierType": "",
    //                 "CarrierNum": "",
    //                 "TaxType": "1",
    //                 "InvType": "07"
    //             }
    //             console.log(`cover.CustomerEmail==>`,cover.CustomerEmail)
    //             if(order.user_info.invoice_type==='company'){
    //                 cover.CustomerName=await EcInvoice.getCompanyName({
    //                     company_id:order.user_info.gui_number as any,
    //                     app_name:this.appName
    //                 })
    //             }
    //             Object.keys(cover).map((dd)=>{
    //                 (json as any)[dd]=(cover as any)[dd]
    //             })
    //         }
    //         return await this.postInvoice({
    //             invoice_data: json,
    //             print:print
    //         });
    //     }else{
    //         return 'no_need'
    //     }
    // }
    Invoice.checkWhiteList = function (config, invoice_data) {
        if (config.point === 'beta' && invoice_data.BuyerEmail && config.whiteList && config.whiteList.length > 0) {
            return config.whiteList.find(function (dd) {
                return dd.email === invoice_data.BuyerEmail;
            });
        }
        else {
            return true;
        }
    };
    Invoice.prototype.getInvoice = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var querySql, invoice_type, created_time, data, sql, e_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        querySql = ["1=1"];
                        if (query.search) {
                            switch (query.searchType) {
                                case 'invoice_number':
                                    querySql.push("invoice_no LIKE '%".concat(query.search, "%'"));
                                    break;
                                case 'name':
                                    querySql.push("JSON_EXTRACT(invoice_data, '$.original_data.CustomerName') LIKE '%".concat(query.search, "%'"));
                                    break;
                                case 'business_number':
                                    querySql.push("JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier') LIKE '%".concat(query.search, "%'"));
                                    break;
                                case 'phone':
                                    querySql.push("JSON_EXTRACT(invoice_data, '$.original_data.CustomerPhone') LIKE '%".concat(query.search, "%'"));
                                    break;
                                case 'product_name':
                                    querySql.push("JSON_EXTRACT(invoice_data, '$.original_data.Items[*].ItemName') LIKE '%".concat(query.search, "%'"));
                                    break;
                                case 'product_number':
                                    querySql.push("JSON_EXTRACT(invoice_data, '$.original_data.Items[*].ItemNumber') LIKE '%".concat(query.search, "%'"));
                                    break;
                                case 'order_number':
                                default:
                                    querySql.push("order_id LIKE '%".concat(query.search, "%'"));
                                    break;
                            }
                        }
                        if (query.invoice_type) {
                            invoice_type = query.invoice_type;
                        }
                        if (query.created_time) {
                            created_time = query.created_time.split(',');
                            if (created_time.length > 1) {
                                querySql.push("\n                        (create_date BETWEEN ".concat(database_js_1.default.escape("".concat(created_time[0], " 00:00:00")), " \n                        AND ").concat(database_js_1.default.escape("".concat(created_time[1], " 23:59:59")), ")\n                    "));
                            }
                        }
                        // 發票種類 B2B B2C , 發票開立方式 自動 手動
                        if (query.invoice_type) {
                            data = query.invoice_type;
                            if (data == 'B2B') {
                                querySql.push("\n                            JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier') IS NULL\n                            OR CHAR_LENGTH(JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier')) = 0");
                            }
                            else {
                                querySql.push("JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier') IS NOT NULL\n                              AND CHAR_LENGTH(JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier')) > 0");
                            }
                        }
                        if (query.issue_method) {
                            if (query.issue_method == 'manual') {
                                console.log('query.issue_method -- ', query.issue_method);
                                querySql.push("JSON_EXTRACT(invoice_data, '$.remark.issueType') IS NOT NULL\n                              AND CHAR_LENGTH(JSON_EXTRACT(invoice_data, '$.remark.issueType')) > 0");
                            }
                            else {
                                querySql.push("\n                            JSON_EXTRACT(invoice_data, '$.remark.issueType') IS NULL\n                            OR CHAR_LENGTH(JSON_EXTRACT(invoice_data, '$.remark.issueType')) = 0");
                            }
                        }
                        // query.invoice_type && querySql.push(`JSON_UNQUOTE(JSON_EXTRACT(invoice_data, '$.orderStatus')) IN (${query.invoice_type})`);
                        // query.issue_method && querySql.push(`JSON_UNQUOTE(JSON_EXTRACT(invoice_data, '$.orderStatus')) IN (${query.issue_method})`);
                        query.status && querySql.push("status IN (".concat(query.status, ")"));
                        query.orderString = (function () {
                            switch (query.orderString) {
                                case 'created_time_desc':
                                    return "order by create_date desc";
                                case 'created_time_asc':
                                    return "order by create_date ASC";
                                case 'order_total_desc':
                                    return "ORDER BY JSON_EXTRACT(invoice_data, '$.original_data.SalesAmount') DESC";
                                case 'order_total_asc':
                                    return "ORDER BY JSON_EXTRACT(invoice_data, '$.original_data.SalesAmount') ASC";
                                case 'default':
                                default:
                                    return "order by id desc";
                            }
                        })();
                        sql = "SELECT *\n                 FROM `".concat(this.appName, "`.t_invoice_memory\n                 WHERE ").concat(querySql.join(' and '), " ").concat(query.orderString || "order by id desc", "\n      ");
                        _a = {};
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n           FROM (".concat(sql, ") as subqyery limit ").concat(query.page * query.limit, ", ").concat(query.limit), [])];
                    case 1:
                        _a.data = _b.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT count(1)\n             FROM (".concat(sql, ") as subqyery"), [])];
                    case 2: return [2 /*return*/, (_a.total = (_b.sent())[0]['count(1)'],
                            _a)];
                    case 3:
                        e_2 = _b.sent();
                        console.error(e_2);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e_2, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Invoice.prototype.getAllowance = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var querySql, created_time, sql, e_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        querySql = ["1=1"];
                        console.log('searchType -- ', query.searchType);
                        if (query.search) {
                            querySql.push("".concat(query.searchType, " LIKE '%").concat(query.search, "%'"));
                        }
                        if (query.created_time) {
                            created_time = query.created_time.split(',');
                            if (created_time.length > 1) {
                                querySql.push("\n                        (create_date BETWEEN ".concat(database_js_1.default.escape("".concat(created_time[0], " 00:00:00")), " \n                        AND ").concat(database_js_1.default.escape("".concat(created_time[1], " 23:59:59")), ")\n                    "));
                            }
                        }
                        query.status && querySql.push("status IN (".concat(query.status, ")"));
                        query.orderString = (function () {
                            switch (query.orderString) {
                                case 'created_time_desc':
                                    return "order by create_date desc";
                                case 'created_time_asc':
                                    return "order by create_date ASC";
                                case 'order_total_desc':
                                    return "ORDER BY JSON_EXTRACT(invoice_data, '$.original_data.SalesAmount') DESC";
                                case 'order_total_asc':
                                    return "ORDER BY JSON_EXTRACT(invoice_data, '$.original_data.SalesAmount') ASC";
                                case 'default':
                                default:
                                    return "order by id desc";
                            }
                        })();
                        sql = "SELECT *\n                 FROM `".concat(this.appName, "`.t_allowance_memory\n                 WHERE ").concat(querySql.join(' and '), " ").concat(query.orderString || "order by id desc", "\n      ");
                        _a = {};
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n           FROM (".concat(sql, ") as subqyery limit ").concat(query.page * query.limit, ", ").concat(query.limit), [])];
                    case 1:
                        _a.data = _b.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT count(1)\n             FROM (".concat(sql, ") as subqyery"), [])];
                    case 2: return [2 /*return*/, (_a.total = (_b.sent())[0]['count(1)'],
                            _a)];
                    case 3:
                        e_3 = _b.sent();
                        console.error(e_3);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e_3, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Invoice.prototype.querySql = function (querySql, query) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT *\n               FROM `".concat(this.appName, "`.t_invoice_memory\n               WHERE ").concat(querySql.join(' and '), " ").concat(query.order_by || "order by id desc", "\n    ");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_js_1.default.query(sql, [])];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_4 = _a.sent();
                        console.log('get invoice failed:', e_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Invoice;
}());
exports.Invoice = Invoice;

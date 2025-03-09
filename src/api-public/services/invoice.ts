import app from '../../app.js';
import response from '../../modules/response.js';
import { EzInvoice } from './ezpay/invoice.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import { EcInvoice, EcInvoiceInterface } from './EcInvoice.js';
import { EcPay } from './financial-service.js';
import { Shopping } from './shopping.js';

export class Invoice {
  public appName: string;

  constructor(appName: string) {
    this.appName = appName;
  }

  //判斷發票類型開立
  public async postInvoice(cf: { invoice_data: any; print: boolean }) {
    try {
      const config = await app.getAdConfig(this.appName, 'invoice_setting');
      switch (config.fincial) {
        case 'ezpay':
          return await EzInvoice.postInvoice({
            hashKey: config.hashkey,
            hash_IV: config.hashiv,
            merchNO: config.merchNO,
            invoice_data: cf.invoice_data,
            beta: config.point === 'beta',
          });
        //     ecpay跟
        case 'ecpay':
          return await EcInvoice.postInvoice({
            hashKey: config.hashkey,
            hash_IV: config.hashiv,
            merchNO: config.merchNO,
            app_name: this.appName,
            invoice_data: cf.invoice_data,
            beta: config.point === 'beta',
            print: cf.print,
          });
      }
    } catch (e: any) {
      throw exception.BadRequestError('BAD_REQUEST', e.message, null);
    }
  }

  //訂單開發票
  public async postCheckoutInvoice(orderID: string | any, print: boolean, obj?: { offlineInvoice?: boolean }) {
    const order: {
      user_info: {
        name: string;
        note: string;
        email: string;
        phone: string;
        address: string;
        gui_number?: string;
        company?: string;
        invoice_type: 'company' | 'me' | 'donate';
        send_type: 'email' | 'carrier';
        carrier_num: string;
      };
      total: number;
      lineItems: [
        {
          id: number;
          spec: string[];
          count: number;
          title: string;
          collection: string[];
          sale_price: number;
          preview_image: string;
          discount_price: number;
        },
      ];
      use_wallet: number;
      use_rebate: number;
      shipment_fee: number;
      discount: number;
      orderID: number;
    } =
      typeof orderID === 'string'
        ? (
            await db.query(
              `SELECT *
         FROM \`${this.appName}\`.t_checkout
         where cart_token = ?`,
              [orderID]
            )
          )[0]['orderData']
        : orderID;
    const config = await app.getAdConfig(this.appName, 'invoice_setting');
    let can_discount_tax_5 = 0;
    let can_discount_tax_0 = 0;
    const line_item = await Promise.all(
      order.lineItems.map(async dd => {
        const product = await new Shopping(this.appName).getProduct({
          id: `${dd.id}`,
          page: 0,
          limit: 1,
        });
const tax_type=(product.data && product.data.content && (product.data.content.tax==='0')) ? 3:1
        if(tax_type===3){
          can_discount_tax_0+=dd.sale_price * dd.count;
        }else{
          can_discount_tax_5+=dd.sale_price * dd.count;
        }
        return {
          ItemName: dd.title + (dd.spec.join('-') ? `/${dd.spec.join('-')}` : ``),
          ItemUnit: '件',
          ItemCount: dd.count,
          ItemPrice: dd.sale_price,
          ItemAmt: dd.sale_price * dd.count,
          ItemTaxType:tax_type
        };
      })
    );
    order.use_rebate=parseInt(`${order.use_rebate || '0'}`,10);
    order.discount=parseInt(`${order.discount || '0'}`,10);
    order.shipment_fee=parseInt(`${order.shipment_fee || '0'}`,10);
    //所有折扣扣除應稅折扣
    let all_discount=order.use_rebate+order.discount;
    if (order.shipment_fee) {
      can_discount_tax_5=can_discount_tax_5+order.shipment_fee;
      line_item.push({
        ItemName: '運費',
        ItemUnit: '趟',
        ItemCount: 1,
        ItemPrice: order.shipment_fee,
        ItemAmt: order.shipment_fee,
        ItemTaxType:1
      });
    }
    line_item.push({
      ItemName: '應稅折扣',
      ItemUnit: '-',
      ItemCount: 1,
      ItemPrice: ((all_discount<=can_discount_tax_5) ? all_discount:can_discount_tax_5) * -1,
      ItemAmt:((all_discount<=can_discount_tax_5) ? all_discount:can_discount_tax_5) * -1,
      ItemTaxType:1
    });
    //所有折扣扣除應稅折扣
    let free_tax_discount=(all_discount-can_discount_tax_5)
    line_item.push({
      ItemName: '免稅折扣',
      ItemUnit: '-',
      ItemCount: 1,
      ItemPrice: ((free_tax_discount >0) ?free_tax_discount:0) * -1,
      ItemAmt:((free_tax_discount >0) ?free_tax_discount:0) * -1,
      ItemTaxType:3
    });


    if (config.fincial === 'ezpay') {
      const timeStamp = '' + new Date().getTime();
      const json = {
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
        ItemName: line_item.map((dd: any) => dd.ItemName || dd.name).join('|'),
        ItemUnit: line_item.map((dd: any) => dd.ItemUnit || '件').join('|'),
        ItemPrice: line_item.map((dd: any) => dd.ItemPrice || dd.price).join('|'),
        ItemCount: line_item.map((dd: any) => dd.ItemCount || dd.quantity).join('|'),
        ItemAmt: line_item.map((dd: any) => dd.ItemAmt || dd.price * dd.quantity).join('|'),
        ItemTaxType: line_item.map(() => '1').join('|'),
      };
      return await this.postInvoice({
        invoice_data: json,
        print: print,
      });
    } else if (config.fincial === 'ecpay') {
      const json: EcInvoiceInterface = {
        MerchantID: config.merchNO as string,
        RelateNumber: typeof orderID === 'string' ? (orderID as string) : orderID.orderID,
        CustomerID: typeof orderID === 'string' ? (orderID as string) : orderID.orderID,
        CustomerIdentifier: (order.user_info.invoice_type === 'company'
          ? order.user_info.gui_number || ''
          : undefined) as string,
        CustomerName: (order.user_info.invoice_type === 'company'
          ? order.user_info.company
          : order.user_info.name) as string,
        CustomerAddr: order.user_info.address as string,
        CustomerPhone: (order.user_info.phone || undefined) as string,
        CustomerEmail: order.user_info.email === 'no-email' ? 'pos@ncdesign.info' : order.user_info.email,
        Print: '0',
        CarrierType: order.user_info.invoice_type === 'me' && order.user_info.send_type === 'carrier' ? '3' : '1',
        CarrierNum:
          order.user_info.invoice_type === 'me' && order.user_info.send_type === 'carrier'
            ? order.user_info.carrier_num
            : undefined,
        Donation: order.user_info.invoice_type === 'donate' ? '1' : '0',
        LoveCode: order.user_info.invoice_type === 'donate' ? (order.user_info as any).love_code : undefined,
        TaxType: line_item.find((dd)=>{
          return dd.ItemTaxType===3
        }) ? '9':'1',
        SalesAmount: order.total,
        InvType: '07',
        Items: line_item.map((dd, index) => {
          return {
            ItemSeq: index + 1,
            ItemName: dd.ItemName,
            ItemCount: dd.ItemCount,
            ItemWord: dd.ItemUnit,
            ItemPrice: dd.ItemPrice,
            ItemTaxType: dd.ItemTaxType as any,
            ItemAmount: dd.ItemAmt,
            ItemRemark: '',
          };
        }),
      };
      console.log(`invoice_data==>`,json)
      if (print) {
        const cover = {
          CustomerID: '',
          CustomerName: '無名氏',
          CustomerAddr: '無地址',
          CustomerPhone: '',
          CustomerEmail:
            order.user_info.email && order.user_info.email !== 'no-email' ? order.user_info.email : 'pos@ncdesign.info',
          ClearanceMark: '1',
          Print: '1',
          Donation: '0',
          LoveCode: '',
          CarrierType: '',
          CarrierNum: ''
        };
        if (order.user_info.invoice_type === 'company') {
          cover.CustomerName = await EcInvoice.getCompanyName({
            company_id: order.user_info.gui_number as any,
            app_name: this.appName,
          });
        }
        Object.keys(cover).map(dd => {
          (json as any)[dd] = (cover as any)[dd];
        });
      }
      return await this.postInvoice({
        invoice_data: json,
        print: print,
      });
    } else {
      return 'no_need';
    }
  }

  public async updateInvoice(obj: { orderID: string; invoice_data: any }) {
    let data = await db.query(
      `SELECT *
       FROM \`${this.appName}\`.t_invoice_memory
       where order_id = ?`,
      [obj.orderID]
    );
    data = data[0];
    data.invoice_data.remark = obj.invoice_data;
    await db.query(
      `UPDATE \`${this.appName}\`.t_invoice_memory
                    set invoice_data = ?
                    WHERE order_id = ?`,
      [JSON.stringify(data.invoice_data), obj.orderID]
    );
    // console.log("data -- " , data.invoice_data)
  }

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

  public static checkWhiteList(config: any, invoice_data: any) {
    if (config.point === 'beta' && invoice_data.BuyerEmail && config.whiteList && config.whiteList.length > 0) {
      return config.whiteList.find((dd: any) => {
        return dd.email === invoice_data.BuyerEmail;
      });
    } else {
      return true;
    }
  }

  public async getInvoice(query: {
    page: number;
    limit: number;
    search?: string;
    searchType?: string;
    orderString?: string;
    created_time?: string;
    invoice_type?: string;
    issue_method?: string;
    status?: string;
    filter?: any;
  }) {
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
                        (create_date BETWEEN ${db.escape(`${created_time[0]} 00:00:00`)} 
                        AND ${db.escape(`${created_time[1]} 23:59:59`)})
                    `);
        }
      }
      // 發票種類 B2B B2C , 發票開立方式 自動 手動
      if (query.invoice_type) {
        const data = query.invoice_type;
        if (data == 'B2B') {
          querySql.push(`
                            JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier') IS NULL
                            OR CHAR_LENGTH(JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier')) = 0`);
        } else {
          querySql.push(`JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier') IS NOT NULL
                              AND CHAR_LENGTH(JSON_EXTRACT(invoice_data, '$.original_data.CustomerIdentifier')) > 0`);
        }
      }
      if (query.issue_method) {
        if (query.issue_method == 'manual') {
          console.log('query.issue_method -- ', query.issue_method);
          querySql.push(`JSON_EXTRACT(invoice_data, '$.remark.issueType') IS NOT NULL
                              AND CHAR_LENGTH(JSON_EXTRACT(invoice_data, '$.remark.issueType')) > 0`);
        } else {
          querySql.push(`
                            JSON_EXTRACT(invoice_data, '$.remark.issueType') IS NULL
                            OR CHAR_LENGTH(JSON_EXTRACT(invoice_data, '$.remark.issueType')) = 0`);
        }
      }
      // query.invoice_type && querySql.push(`JSON_UNQUOTE(JSON_EXTRACT(invoice_data, '$.orderStatus')) IN (${query.invoice_type})`);
      // query.issue_method && querySql.push(`JSON_UNQUOTE(JSON_EXTRACT(invoice_data, '$.orderStatus')) IN (${query.issue_method})`);
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
        data: await db.query(
          `SELECT *
           FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`,
          []
        ),
        total: (
          await db.query(
            `SELECT count(1)
             FROM (${sql}) as subqyery`,
            []
          )
        )[0]['count(1)'],
      };
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
    }
  }

  public async getAllowance(query: {
    page: number;
    limit: number;
    search?: string;
    searchType?: string;
    orderString?: string;
    created_time?: string;
    invoice_type?: string;
    issue_method?: string;
    status?: string;
    filter?: string;
  }) {
    try {
      let querySql = [`1=1`];
      console.log('searchType -- ', query.searchType);
      if (query.search) {
        querySql.push(`${query.searchType} LIKE '%${query.search}%'`);
      }

      if (query.created_time) {
        const created_time = query.created_time.split(',');
        if (created_time.length > 1) {
          querySql.push(`
                        (create_date BETWEEN ${db.escape(`${created_time[0]} 00:00:00`)} 
                        AND ${db.escape(`${created_time[1]} 23:59:59`)})
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
        data: await db.query(
          `SELECT *
           FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`,
          []
        ),
        total: (
          await db.query(
            `SELECT count(1)
             FROM (${sql}) as subqyery`,
            []
          )
        )[0]['count(1)'],
      };
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
    }
  }

  public async querySql(querySql: string[], query: { page: number; limit: number; id?: string; order_by?: string }) {
    let sql = `SELECT *
               FROM \`${this.appName}\`.t_invoice_memory
               WHERE ${querySql.join(' and ')} ${query.order_by || `order by id desc`}
    `;

    try {
      return await db.query(sql, []);
    } catch (e) {
      console.log('get invoice failed:', e);
    }
  }
}

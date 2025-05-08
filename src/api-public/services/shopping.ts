import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import e from 'express';
import moment from 'moment';
import axios from 'axios';
import app from '../../app';
import redis from '../../modules/redis.js';
import Tool from '../../modules/tool.js';
import { IToken } from '../models/Auth.js';
import { EcPay, PayNow } from './financial-service.js';
import { Private_config } from '../../services/private_config.js';
import { User } from './user.js';
import { Invoice } from './invoice.js';
import { Rebate } from './rebate.js';
import { CustomCode } from '../services/custom-code.js';
import { ManagerNotify } from './notify.js';
import { AutoSendEmail } from './auto-send-email.js';
import { DeliveryData } from './delivery.js';
import { saasConfig } from '../../config.js';
import { SMS } from './sms.js';
import { LineMessage } from './line-message';
import { EcInvoice } from './EcInvoice';
import { App } from '../../services/app.js';
import { OrderEvent } from './order-event.js';
import { SeoConfig } from '../../seo-config.js';
import { sendmail } from '../../services/ses.js';
import { Shopee } from './shopee';
import { ShipmentConfig as Shipment_support_config } from '../config/shipment-config.js';
import { PayNowLogistics } from './paynow-logistics.js';
import { CheckoutService } from './checkout.js';
import { ProductInitial } from './product-initial.js';
import { UtTimer } from '../utils/ut-timer.js';
import { AutoFcm } from '../../public-config-initial/auto-fcm.js';
import { Language, LanguageLocation } from '../../Language.js';
import { PaymentStrategyFactory } from './factories/payment-strategy-factory.js';
import { IPaymentStrategy } from './interface/payment-strategy-interface.js';
import { PaymentService } from './payment-service.js';
import { CartItem, CheckoutEvent } from './checkout-event.js';
// import { DiffRecord } from './diff-record.js';

type BindItem = {
  id: string;
  spec: string[];
  count: number;
  sale_price: number;
  collection: string[];
  discount_price: number;
  rebate: number;
  shipment_fee: number;
  times: number;
};

type InvoiceData = {
  invoiceID: string;
  allowanceData: any;
  orderID: string;
  orderData: any;
  allowanceInvoiceTotalAmount: string;
  itemList: any;
  invoiceDate: string;
};

type VoucherForType = 'all' | 'collection' | 'product' | 'manager_tag';
type RebackType = 'rebate' | 'discount' | 'shipment_free' | 'add_on_items' | 'giveaway';
type Trigger = 'auto' | 'code' | 'distribution';
type ProductOffStart = 'price_asc' | 'price_desc' | 'price_all';
type Device = 'normal' | 'pos';
type Method = 'fixed' | 'percent';
type Rule = 'min_price' | 'min_count';
type ConditionType = 'item' | 'order';
type Counting = 'single' | 'each';
type IncludeDiscount = 'before' | 'after';
type SelectShipmentType = 'all' | 'select';

export interface VoucherData {
  // default-value
  id: string;
  type: 'voucher';
  status: 0 | 1 | -1;
  title: string;
  code?: string;
  reBackType: RebackType;
  method: Method;
  trigger: Trigger;
  device: Device[];
  value: string;
  add_on_products?: string[];
  for: VoucherForType;
  rule: Rule;
  counting: Counting;
  conditionType: ConditionType;
  includeDiscount: IncludeDiscount;
  productOffStart: ProductOffStart;
  forKey: (number | string)[];
  ruleValue: number;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  overlay: boolean;
  start_ISO_Date: string;
  end_ISO_Date: string;
  targetList: (number | string)[];
  target: string;
  rebateEndDay: string;
  macroLimited: number;
  microLimited: number;
  selectShipment: {
    type: SelectShipmentType;
    list: string[];
  };

  // backend-value
  bind: BindItem[];
  bind_subtotal: number;
  times: number;
  discount_total: number;
  rebate_total: number;
}

interface seo {
  title: string;
  seo: {
    domain: string;
    title: string;
    content: string;
  };
}

interface LineItem {
  id: number;
  spec: string[];
  count: string;
  sale_price: number;
  title: string;
  sku: string;
  preview_image: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  payment_select?: string;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  shipment: 'normal' | 'FAMIC2C' | 'UNIMARTC2C' | 'HILIFEC2C' | 'OKMARTC2C';
  CVSStoreName: string;
  CVSStoreID: string;
  CVSTelephone: string;
  MerchantTradeNo: string;
  CVSAddress: string;
  note: string;
}

interface orderVoucherData {
  id: number;
  discount_total: number;
  title: string;
  method: 'percent' | 'fixed';
  trigger: 'auto' | 'code';
  value: string;
  for: VoucherForType;
  rule: 'min_price' | 'min_count';
  forKey: string[];
  ruleValue: number;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  status: 0 | 1 | -1;
  type: 'voucher';
  code?: string;
  overlay: boolean;
  bind?: {
    id: string;
    spec: string[];
    count: number;
    sale_price: number;
    collection: string[];
    discount_price: number;
  }[];
  start_ISO_Date: string;
  end_ISO_Date: string;
  reBackType: string;
  rebate_total: number;
  target: string;
  targetList: string[];
}

class OrderDetail {
  subtotal: number;
  shipment: number;
  total: number;
  discount: number = 0;
  rebate: number = 0;
  cart_token: string = '';
  tag: 'manual' = 'manual';
  voucher: orderVoucherData;
  lineItems: LineItem[] = [];
  customer_info: CustomerInfo;
  user_info: {
    name: string;
    email: string;
    city?: string;
    area?: string;
    phone: string;
    address: string;
    custom_form_delivery?: any;
    shipment:
      | 'normal'
      | 'black_cat_freezing'
      | 'now'
      | 'shop'
      | 'global_express'
      | 'black_cat'
      | 'UNIMARTC2C'
      | 'FAMIC2C'
      | 'HILIFEC2C'
      | 'OKMARTC2C'
      | 'UNIMARTFREEZE'
      | 'FAMIC2CFREEZE';
    CVSStoreName: string;
    CVSStoreID: string;
    CVSTelephone: string;
    MerchantTradeNo: string;
    CVSAddress: string;
    note?: string;
    code_note?: string;
  };
  pay_status: string;

  constructor(subtotal: number, shipment: number) {
    this.subtotal = subtotal;
    this.shipment = shipment;
    this.customer_info = this.initCustomerInfo();
    this.user_info = this.initUserInfo();
    this.total = 0;
    this.pay_status = '0';
    this.voucher = this.initVoucher();
  }

  private initCustomerInfo(): CustomerInfo {
    return {
      name: '',
      phone: '',
      email: '',
    };
  }

  private initUserInfo(): UserInfo {
    return {
      CVSAddress: '',
      CVSStoreID: '',
      CVSStoreName: '',
      CVSTelephone: '',
      MerchantTradeNo: '',
      address: '',
      email: '',
      name: '',
      note: '',
      phone: '',
      shipment: 'normal',
    };
  }

  private initVoucher(): orderVoucherData {
    return {
      id: 0,
      discount_total: 0,
      end_ISO_Date: '',
      for: 'product',
      forKey: [],
      method: 'fixed',
      overlay: false,
      reBackType: 'rebate',
      rebate_total: 0,
      rule: 'min_count',
      ruleValue: 0,
      startDate: '',
      startTime: '',
      start_ISO_Date: '',
      status: 1,
      target: '',
      targetList: [],
      title: '',
      trigger: 'auto',
      type: 'voucher',
      value: '0',
    };
  }
}

type Collection = {
  title: string;
  array: Collection[];
  checked: boolean;
  product_id?: number[];
  parentTitles: string[];
  subCollections: string[];
  allCollections: string[];
  seo_title: string;
  seo_content: string;
  seo_image: string;
  code: string;
  language_data: {
    'en-US': seo;
    'zh-CN': seo;
    'zh-TW': seo;
  };
  hidden?: boolean;
};

type MultiSaleType = 'store' | 'level' | 'tags';

type ShipmentSetting = {
  cartSetting: {
    minimumTotal: number;
    maximumTotal: number;
    freeShipmnetTarget: number;
    orderFormula: string[];
  };
};

export type Cart = {
  archived?: string;
  customer_info: any;
  lineItems: CartItem[];
  discount?: number;
  orderStatus?: string;
  total: number;
  email: string;
  user_info: any;
  code?: string;
  shipment_fee: number;
  rebate: number;
  use_rebate: number;
  orderID: string;
  shipment_support: string[];
  shipment_selector: {
    name: string;
    value: string;
    isExcludedByWeight?: boolean;
    isExcludedByTotal?: boolean;
  }[];
  shipment_info: any;
  use_wallet: number;
  user_email: string;
  method: string;
  useRebateInfo?: { point: number; limit?: number; condition?: number };
  user_rebate_sum: number;
  voucherList?: VoucherData[];
  custom_form_format?: any;
  custom_receipt_form?: any;
  custom_form_data?: any;
  distribution_id?: number;
  distribution_info?: any;
  orderSource: '' | 'manual' | 'normal' | 'POS' | 'combine' | 'group_buy' | 'split';
  temp_cart_id?: string;
  code_array: string[];
  deliveryData?: DeliveryData;
  give_away: CartItem[];
  language?: string;
  pos_info?: any; //POS結帳資訊
  goodsWeight: number;
  client_ip_address: string;
  fbc: string;
  fbp: string;
  scheduled_id?: string;
  editRecord: { time: string; record: string }[];
  combineOrderID?: number;
  splitOrders?: string[];
  parentOrder?: string;
  select_shipment_setting?: ShipmentSetting;
};

export type Order = {
  id: number;
  cart_token: string;
  status: number;
  email: string;
  orderData: Cart;
  created_time: string;
};

export class Shopping {
  app: string;

  token?: IToken;

  constructor(app: string, token?: IToken) {
    this.app = app;
    this.token = token;
  }

  async getProduct(query: {
    page: number;
    limit: number;
    sku?: string;
    id?: string;
    domain?: string;
    search?: string;
    searchType?: string;
    collection?: string;
    accurate_search_collection?: boolean;
    accurate_search_text?: boolean;
    min_price?: string;
    max_price?: string;
    status?: string;
    channel?: string;
    general_tag?: string;
    manager_tag?: string;
    whereStore?: string;
    order_by?: string;
    id_list?: string;
    with_hide_index?: string;
    is_manger?: boolean;
    setUserID?: string;
    show_hidden?: string;
    productType?: string;
    filter_visible?: string;
    language?: string;
    currency_code?: string;
    view_source?: string;
    distribution_code?: string;
    skip_shopee_check?: boolean;
    product_category?: string;
  }) {
    try {
      const userClass = new User(this.app);
      const count_sql = await userClass.getCheckoutCountingModeSQL();
      const store_info = await userClass.getConfigV2({ key: 'store-information', user_id: 'manager' });
      const store_config = await userClass.getConfigV2({ key: 'store_manager', user_id: 'manager' });
      const exh_config = await userClass.getConfigV2({ key: 'exhibition_manager', user_id: 'manager' });
      const userID = query.setUserID ?? (this.token ? `${this.token.userID}` : '');
      const querySql = [`(content->>'$.type'='product')`];
      const idStr = query.id_list
        ? query.id_list
            .split(',')
            .filter(Boolean)
            .map(id => db.escape(id))
            .join(',')
        : '';
      query.language = query.language ?? store_info.language_setting.def;
      query.show_hidden = query.show_hidden ?? 'true';

      // 初始化商品與管理員標籤 Config
      // await Promise.all([this.initProductCustomizeTagConifg(), this.initProductGeneralTagConifg()]);

      const orderMapping: Record<string, string> = {
        title: `ORDER BY JSON_EXTRACT(content, '$.title')`,
        max_price: `ORDER BY CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.max_price')) AS SIGNED) DESC , id DESC`,
        min_price: `ORDER BY CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.min_price')) AS SIGNED) ASC , id DESC`,
        created_time_desc: `ORDER BY created_time DESC`,
        created_time_asc: `ORDER BY created_time ASC`,
        updated_time_desc: `ORDER BY updated_time DESC`,
        updated_time_asc: `ORDER BY updated_time ASC`,
        sales_desc: `ORDER BY content->>'$.total_sales' DESC , id DESC`,
        sort_weight: `ORDER BY content->>'$.sort_weight' DESC , id DESC`,
        default: query.is_manger ? `ORDER BY id DESC` : `ORDER BY content->>'$.sort_weight' DESC , id DESC`,
        stock_desc: '',
        stock_asc: '',
      };

      query.order_by = orderMapping[query.order_by as keyof typeof orderMapping] || orderMapping.default;

      if (query.search) {
        switch (query.searchType) {
          case 'sku':
            if (query.accurate_search_text) {
              querySql.push(`JSON_EXTRACT(content, '$.variants[*].sku') = '${query.search}'`);
            } else {
              querySql.push(`JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`);
            }
            break;
          case 'barcode':
            if (query.accurate_search_text) {
              querySql.push(`JSON_EXTRACT(content, '$.variants[*].barcode') = '${query.search}'`);
            } else {
              querySql.push(`JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`);
            }
            break;
          case 'customize_tag':
            querySql.push(`JSON_EXTRACT(content, '$.product_customize_tag') LIKE '%${query.search}%'`);
            break;
          case 'title':
            querySql.push(
              `(${[
                `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`,
                `(UPPER(content->>'$.language_data."${query.language}".title') LIKE UPPER('%${query.search}%'))`,
              ].join(' OR ')})`
            );
            break;
          default:
            querySql.push(
              `(${[
                `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`,
                `(UPPER(content->>'$.language_data."${query.language}".title') LIKE UPPER('%${query.search}%'))`,
                `UPPER(content->>'$.product_tag.language."${query.language}"') like '%${query.search}%'`,
                `JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`,
                `JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`,
                `JSON_EXTRACT(content, '$.product_customize_tag') LIKE '%${query.search}%'`,
              ].join(' OR ')})`
            );
            break;
        }
      }

      if (query.product_category) {
        querySql.push(`JSON_EXTRACT(content, '$.product_category') = ${db.escape(query.product_category)}`);
      }

      if (query.domain) {
        const decodedDomain = decodeURIComponent(query.domain);
        const sqlJoinSearch = [
          `content->>'$.seo.domain' = '${decodedDomain}'`,
          `content->>'$.title' = '${decodedDomain}'`,
          `content->>'$.language_data."${query.language}".seo.domain' = '${decodedDomain}'`,
        ];

        if (sqlJoinSearch.length) {
          querySql.push(`(${sqlJoinSearch.map(condition => `(${condition})`).join(' OR ')})`);
        }

        query.order_by = `
          ORDER BY CASE 
          WHEN content->>'$.language_data."zh-TW".seo.domain' = '${decodedDomain}' THEN 1
              ELSE 2
          END
        `;
      }

      if (query.id) {
        const ids = `${query.id}`
          .split(',')
          .map(id => id.trim())
          .filter(id => id);
        if (ids.length > 1) {
          querySql.push(`id IN (${ids.map(id => `'${id}'`).join(',')})`);
        } else {
          querySql.push(`id = '${ids[0]}'`);
        }
      }

      // 當非管理員時，檢查是否顯示隱形商品
      if (query.filter_visible) {
        if (query.filter_visible === 'true') {
          querySql.push(`(content->>'$.visible' IS NULL || content->>'$.visible' = 'true')`);
        } else {
          querySql.push(`(content->>'$.visible' = 'false')`);
        }
      } else if (!query.is_manger && `${query.show_hidden}` !== 'true') {
        querySql.push(`(content->>'$.visible' IS NULL || content->>'$.visible' = 'true')`);
      }

      // 判斷有帶入商品類型時，顯示商品類型，反之預設折是一班商品
      if (query.productType) {
        query.productType.split(',').map(dd => {
          if (dd === 'hidden') {
            querySql.push(`(content->>'$.visible' = "false")`);
          } else if (dd !== 'all') {
            querySql.push(`(content->>'$.productType.${dd}' = "true")`);
          }
        });
      } else if (!query.id) {
        querySql.push(`(content->>'$.productType.product' = "true")`);
      }

      // 如是連結帶入則轉換成Title
      if (query.collection) {
        const collection_cf = (
          await db.query(
            `SELECT *
             FROM \`${this.app}\`.public_config
             WHERE \`key\` = 'collection';
            `,
            []
          )
        )[0]['value'];
        query.collection = decodeURI(query.collection);
        query.collection = query.collection
          .split(',')
          .map(dd => {
            function loop(array: any, prefix: string[]) {
              const find = array.find((d1: any) => {
                return (
                  (d1.language_data && d1.language_data[query.language as any].seo.domain === dd) || d1.code === dd
                );
              });
              if (find) {
                prefix.push(find.title);
                dd = prefix.join(' / ');
                query.accurate_search_collection = true;
              } else {
                array.map((d1: any) => {
                  if (d1.array) {
                    let prefix_i = JSON.parse(JSON.stringify(prefix));
                    prefix_i.push(d1.title);
                    loop(d1.array, prefix_i);
                  }
                });
              }
            }

            loop(collection_cf, []);
            return dd;
          })
          .join(',');
        querySql.push(
          `(${query.collection
            .split(',')
            .map(dd => {
              return query.accurate_search_collection
                ? `(JSON_CONTAINS(content->'$.collection', '"${dd}"'))`
                : `(JSON_EXTRACT(content, '$.collection') LIKE '%${dd}%')`;
            })
            .join(' or ')})`
        );
      }

      if (query.sku) {
        querySql.push(
          `(id in ( select product_id from \`${this.app}\`.t_variants where content->>'$.sku'=${db.escape(query.sku)}))`
        );
      }

      if (!query.id && query.status === 'active' && query.with_hide_index !== 'true') {
        querySql.push(`(content->>'$.hideIndex' IS NULL OR content->>'$.hideIndex' = 'false')`);
      }

      if (query.id_list) {
        if (idStr.length > 0) {
          query.order_by = ` ORDER BY FIELD (id, ${idStr})`;
        } else {
          query.order_by = ' ORDER BY id';
        }
      }

      if (!query.is_manger && !query.status) {
        query.status = 'inRange';
      }

      if (query.status) {
        const statusSplit = query.status.split(',').map(status => status.trim());
        const statusJoin = statusSplit.map(status => `"${status}"`).join(',');

        // 基本條件
        const statusCondition = `JSON_EXTRACT(content, '$.status') IN (${statusJoin})`;

        // 時間條件
        const currentDate = db.escape(new Date().toISOString());

        const scheduleConditions = statusSplit
          .map(status => {
            switch (status) {
              case 'inRange':
                return `OR (
                      JSON_EXTRACT(content, '$.status') IN ('active', 1)
                      AND (
                          content->>'$.active_schedule' IS NULL OR 
                          (
                              (
                                  ((CONCAT(content->>'$.active_schedule.start_ISO_Date') IS NULL) and (CONCAT(content->>'$.active_schedule.startDate') IS NULL)) or
                                  ((CONCAT(content->>'$.active_schedule.start_ISO_Date') <= ${currentDate}) or (CONCAT(content->>'$.active_schedule.startDate') <= ${db.escape(moment().format('YYYY-MM-DD'))}))
                              )
                              AND (
                                ((CONCAT(content->>'$.active_schedule.end_ISO_Date') IS NULL) and (CONCAT(content->>'$.active_schedule.endDate') IS NULL)) or
                                  (CONCAT(content->>'$.active_schedule.end_ISO_Date') >= ${currentDate}) or (CONCAT(content->>'$.active_schedule.endDate') >= ${db.escape(moment().format('YYYY-MM-DD'))})
                              )
                          )
                      )
                  )`;
              case 'beforeStart':
                return `
                  OR (
                      JSON_EXTRACT(content, '$.status') IN ('active', 1)
                      AND CONCAT(content->>'$.active_schedule.start_ISO_Date') > ${currentDate}
                  )`;
              case 'afterEnd':
                return `
                  OR (
                      JSON_EXTRACT(content, '$.status') IN ('active', 1)
                      AND CONCAT(content->>'$.active_schedule.end_ISO_Date') < ${currentDate}
                  )`;
              default:
                return '';
            }
          })
          .join('');

        // 組合 SQL 條件
        querySql.push(`(${statusCondition} ${scheduleConditions})`);
      }

      if (query.channel) {
        if (query.channel === 'exhibition') {
          const exh = exh_config.list.find((item: { id: string }) => item.id === query.whereStore);
          if (exh) {
            querySql.push(`
              (id IN (SELECT product_id FROM \`${this.app}\`.t_variants 
              WHERE id IN (${exh.dataList.map((d: any) => d.variantID).join(',')})))`);
          }
        } else {
          const channelSplit = query.channel.split(',').map(channel => channel.trim());
          const channelJoin = channelSplit.map(channel => {
            return `OR JSON_CONTAINS(content->>'$.channel', '"${channel}"')`;
          });
          querySql.push(`(content->>'$.channel' IS NULL ${channelJoin})`);
        }
      }

      if (query.manager_tag) {
        const tagSplit = query.manager_tag.split(',').map(tag => tag.trim());
        if (tagSplit.length > 0) {
          const tagJoin = tagSplit.map(tag => {
            return `JSON_CONTAINS(content->>'$.product_customize_tag', '"${tag}"')`;
          });
          querySql.push(`(${tagJoin.join(' OR ')})`);
        }
      }

      if (query.general_tag) {
        const tagSplit = query.general_tag.split(',').map(tag => tag.trim());
        if (tagSplit.length > 0) {
          const tagJoin = tagSplit.map(tag => {
            return `(JSON_CONTAINS(
              JSON_EXTRACT(content, '$.product_tag.language."${query.language ?? 'zh-TW'}"'),
              JSON_QUOTE('${tag}')
              ))`;
          });
          querySql.push(`(${tagJoin.join(' OR ')})`);
        }
      }

      if (query.id_list && idStr) {
        querySql.push(`(id in (${idStr}))`);
      }

      if (query.min_price) {
        querySql.push(
          `(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price' >= ${query.min_price}))`
        );
      }

      if (query.max_price) {
        querySql.push(
          `(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price' <= ${query.max_price}))`
        );
      }

      // 取得產品查詢結果
      const products = await this.querySql(querySql, query);

      // 產品清單
      products.data = (Array.isArray(products.data) ? products.data : [products.data]).filter(product => product);

      // 許願清單判斷
      if (userID !== '' && products.data.length > 0) {
        const productIds = products.data.map((product: any) => product.id);

        // 一次性查詢所有 wishlist 商品
        const wishListData = await db.query(
          `SELECT content ->>'$.product_id' AS product_id
           FROM \`${this.app}\`.t_post
           WHERE userID = ?
             AND content->>'$.type' = 'wishlist'
             AND content->>'$.product_id' IN (${productIds.map(() => '?').join(',')})`,
          [userID, ...productIds]
        );

        const wishListSet = new Set(wishListData.map((row: any) => row.product_id));

        products.data = products.data.map((product: any) => {
          if (product.content) {
            product.content.in_wish_list = wishListSet.has(String(product.id));
            product.content.id = product.id;
          }
          return product;
        });
      }

      if (query.id_list) {
        const idSet = new Set(
          query.id_list
            .split(',')
            .map(id => id.trim())
            .filter(Boolean)
        );
        products.data = products.data.filter((product: { id: number }) => idSet.has(`${product.id}`));
      }

      if (query.id_list) {
        products.data = query.id_list
          .split(',')
          .map(id => {
            return products.data.find((product: { id: number }) => `${product.id}` === `${id}`);
          })
          .filter(dd => dd);
      }

      // 判斷需要多國語言，或者蝦皮庫存同步
      await Promise.all(
        products.data
          .filter((dd: any) => {
            return dd.content;
          })
          .map((product: any) => {
            product.content.designated_logistics = product.content.designated_logistics ?? { list: [], type: 'all' };
            if (product.content.designated_logistics.group === '' && !product.content.designated_logistics.type) {
              product.content.designated_logistics = { list: [], type: 'all' };
            }
            product.content.collection = Array.from(
              new Set(
                (() => {
                  return (product.content.collection ?? []).map((dd: any) => {
                    return dd.replace(' / ', '/').replace(' /', '/').replace('/ ', '/').replace('/', ' / ');
                  });
                })()
              )
            );
            return new Promise(async resolve => {
              if (product) {
                let totalSale = 0;
                const { language } = query;
                const { content } = product;
                content.preview_image = content.preview_image ?? [];
                ProductInitial.initial(content);
                if (language && content?.language_data?.[language]) {
                  const langData = content.language_data[language];
                  if ((langData.preview_image && langData.preview_image.length === 0) || !langData.preview_image) {
                    if (content.preview_image.length) {
                      langData.preview_image = content.preview_image;
                    } else {
                      langData.preview_image = [
                        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg',
                      ];
                    }
                  }
                  Object.assign(content, {
                    seo: langData.seo,
                    title: langData.title || content.title,
                    content: langData.content || content.content,
                    content_array: langData.content_array || content.content_array,
                    content_json: langData.content_json || content.content_json,
                    preview_image: langData.preview_image || content.preview_image,
                  });
                }

                if ((content.preview_image && content.preview_image.length === 0) || !content.preview_image) {
                  content.preview_image = [
                    'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg',
                  ];
                }

                if (content.product_category === 'kitchen') {
                  if (content.specs.length) {
                    content.min_price = content.specs
                      .map((dd: any) => {
                        return Math.min(
                          ...dd.option.map((d1: any) => {
                            return d1.price;
                          })
                        );
                      })
                      .reduce((a: any, b: any) => a + b, 0);
                    content.max_price = content.specs
                      .map((dd: any) => {
                        return Math.max(
                          ...dd.option.map((d1: any) => {
                            return d1.price;
                          })
                        );
                      })
                      .reduce((a: any, b: any) => a + b, 0);
                  } else {
                    content.min_price = content.price || 0;
                    content.max_price = content.price || 0;
                  }
                  content.variants = [
                    {
                      sku: '',
                      spec: [],
                      type: 'variants',
                      v_width: 0,
                      product_id: content.id,
                      sale_price: content.min_price,
                      compare_price: 0,
                      shipment_type: 'none',
                      show_understocking: (content.stocke ?? '') === '' ? `false` : `true`,
                    },
                  ];
                } else {
                  // 尋找規格販售數量
                  const soldOldHistory = await db.query(
                    `
                        SELECT *
                        FROM \`${this.app}\`.t_products_sold_history
                        WHERE product_id = ${db.escape(content.id)}
                          AND order_id IN (SELECT cart_token
                                           FROM \`${this.app}\`.t_checkout
                                           WHERE ${count_sql})
                    `,
                    []
                  );

                  (content.variants || []).forEach((variant: any) => {
                    //規格只有一組不用顯示規格圖片
                    if (content.variants.length === 1) {
                      variant.preview_image = undefined;
                      variant[`preview_image_${language}`] = undefined;
                    }
                    variant.spec = variant.spec || [];
                    variant.stock = 0;
                    variant.sold_out =
                      soldOldHistory
                        .filter((dd: any) => {
                          return dd.spec === variant.spec.join('-') && `${dd.product_id}` === `${content.id}`;
                        })
                        .map((dd: any) => {
                          return dd.count;
                        })
                        .reduce((a: number, b: number) => {
                          return Tool.floatAdd(a, b);
                        }, 0) || 0;
                    variant.preview_image = variant.preview_image ?? '';

                    if (variant.preview_image) {
                      const img = variant.preview_image;
                      let temp = '';
                      if (typeof img === 'object') {
                        if (img.richText) {
                          img.richText.map((item: any) => {
                            temp += item.text;
                          });
                        } else if (img.hyperlink) {
                          temp = img.text ?? img.hyperlink;
                        }
                      } else if (!img.includes('https://')) {
                        temp = '';
                      } else {
                        temp = img;
                      }
                      variant.preview_image = temp;
                    }

                    variant.preview_image =
                      variant[`preview_image_${language}`] ||
                      variant.preview_image ||
                      'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';

                    if (content.min_price > variant.sale_price) {
                      content.min_price = variant.sale_price;
                    }
                    if (content.max_price < variant.sale_price) {
                      content.max_price = variant.sale_price;
                    }
                    if (
                      variant.preview_image ===
                      'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg'
                    ) {
                      variant.preview_image = content.preview_image?.[0];
                    }

                    // 過濾並計算庫存
                    Object.entries(variant.stockList || {}).forEach(([storeId, stockData]: [string, any]) => {
                      if (!store_config.list.some((store: any) => store.id === storeId) || !stockData?.count) {
                        delete variant.stockList[storeId];
                      } else {
                        variant.stockList[storeId].count = parseInt(stockData.count, 10);
                        variant.stock += variant.stockList[storeId].count;
                      }
                    });

                    // 確保所有商店 ID 都存在
                    store_config.list.forEach((store: any) => {
                      variant.stockList[store.id] = variant.stockList[store.id] || { count: 0 };
                    });

                    totalSale += variant.sold_out;
                  });
                }
                if (content.shopee_id && !query.skip_shopee_check) {
                  const shopee_data = await new Shopee(this.app, this.token).getProductDetail(content.shopee_id, {
                    skip_image_load: true,
                  });

                  if (shopee_data && shopee_data.variants) {
                    (content.variants || []).forEach((variant: any) => {
                      const shopee_variants = shopee_data.variants.find(dd => {
                        return dd.spec.join('') === variant.spec.join('');
                      });
                      if (shopee_variants) {
                        variant.stock = shopee_variants.stock;
                        variant.stockList = {};
                        variant.stockList[store_config.list[0].id] = { count: variant.stock };
                      }
                    });
                  }
                }
                product.total_sales = totalSale;
              }
              resolve(true);
            });
          })
      );

      if (query.domain && products.data.length > 0) {
        const decodedDomain = decodeURIComponent(query.domain);
        const foundProduct = products.data.find((dd: any) => {
          if (!query.language) return false;

          const languageData = dd.content.language_data?.[query.language]?.seo;
          const seoData = dd.content.seo;
          return (
            (languageData && languageData.domain === decodedDomain) || (seoData && seoData.domain === decodedDomain)
          );
        });

        products.data = foundProduct || products.data[0];
      }

      if (query.id && products.data.length > 0) {
        products.data = products.data[0];
      }

      if ((query.domain || query.id) && products.data !== undefined) {
        products.data.json_ld = await SeoConfig.getProductJsonLd(this.app, products.data.content);
      }

      // 產品可使用的優惠券
      const viewSource = query.view_source ?? 'normal';
      const distributionCode = query.distribution_code ?? '';

      // 取得所有優惠券與適配的分銷連結
      const userData = (await userClass.getUserData(userID, 'userID')) ?? { userID: -1 };

      const voucherObj = await Promise.all([
        this.getAllUseVoucher(userData.userID),
        this.getDistributionRecommend(distributionCode),
      ]).then(dataArray => {
        return {
          allVoucher: dataArray[0],
          recommendData: dataArray[1],
        };
      });

      const getPrice = (
        priceMap: Record<string, Map<string, number>>,
        key: string,
        specKey: string,
        priceList: number[]
      ) => {
        const price = priceMap[key]?.get(specKey);
        price && priceList.push(price);
      };

      const processProduct = async (product: any) => {
        if (!product || !product.content) {
          return;
        }
        const createPriceMap = (type: MultiSaleType): Record<string, Map<string, number>> => {
          return Object.fromEntries(
            product.content.multi_sale_price
              .filter((item: any) => item.type === type)
              .map((item: any) => [item.key, new Map(item.variants.map((v: any) => [v.spec.join('-'), v.price]))])
          );
        };

        if (!product || !product.content) {
          return product;
        }

        product.content.about_vouchers = await this.aboutProductVoucher({
          product,
          userID,
          viewSource,
          allVoucher: voucherObj.allVoucher,
          recommendData: voucherObj.recommendData,
          userData,
        });

        product.content.comments = [];

        if (products.total === 1) {
          product.content.comments = await this.getProductComment(product.id);
        }

        if (query.channel && query.channel === 'exhibition') {
          const exh = exh_config.list.find((item: { id: string }) => item.id === query.whereStore);
          if (exh) {
            const exh_variant_ids = exh.dataList.map((d: { variantID: number }) => d.variantID);
            const variantsResult = await this.getProductVariants(exh_variant_ids.join(','));
            if (variantsResult.total > 0) {
              const variantsList = new Map(
                variantsResult.data
                  .filter((a: { product_id: any }) => a.product_id === product.id)
                  .map((a: { id: any; variant_content: any }) => {
                    return [a.variant_content.spec.join(','), a.id];
                  })
              );

              product.content.variants.forEach((pv: any) => {
                const specString = pv.spec.join(',');
                const variantID = variantsList.get(specString);

                if (variantID) {
                  const vData = exh.dataList.find((a: { variantID: number }) => a.variantID === variantID);
                  pv.variant_id = variantID;
                  pv.exhibition_type = true;
                  pv.exhibition_active_stock = vData?.activeSaleStock ?? 0;
                  pv.sale_price = vData?.salePrice ?? 0;
                } else {
                  pv.exhibition_type = false;
                }
              });
            }
          }
        }

        product.content.variants.forEach((pv: any) => {
          const vPriceList: number[] = [];

          // 取得門市與會員專屬價格
          if (product.content.multi_sale_price?.length) {
            const specKey = pv.spec.join('-');

            // 門市價格
            if (query.whereStore) {
              const storeMaps = createPriceMap('store');
              getPrice(storeMaps, query.whereStore, specKey, vPriceList);
            }

            // 會員等級價格
            if (userData?.member_level?.id) {
              const levelMaps = createPriceMap('level');
              getPrice(levelMaps, userData.member_level.id, specKey, vPriceList);
            }

            // 顧客標籤價格
            if (Array.isArray(userData?.userData?.tags) && userData.userData.tags.length > 0) {
              const tagsMaps = createPriceMap('tags');
              userData.userData.tags.map((tag: string) => {
                getPrice(tagsMaps, tag, specKey, vPriceList);
              });
            }
          }

          pv.origin_price = parseInt(`${pv.compare_price || pv.sale_price}`, 10);
          pv.sale_price = vPriceList.length > 0 ? Math.min(...vPriceList) : pv.sale_price;
        });

        const priceArray = product.content.variants
          .filter((item: any) => {
            if (query.channel && query.channel === 'exhibition') {
              return item.exhibition_type;
            }
            return true;
          })
          .map((item: any) => {
            return parseInt(`${item.sale_price}`, 10);
          });

        product.content.min_price = Math.min(...priceArray);
        if (product.content.product_category === 'kitchen' && product.content.variants.length > 1) {
          let postMD = product.content as any;
          product.content.variants.map((dd: any) => {
            dd.compare_price = 0;
            dd.sale_price = dd.spec.reduce((sum: number, specValue: string, index: number) => {
              const spec = postMD.specs[index];
              const option = spec?.option?.find((opt: { title: string }) => opt.title === specValue);
              const priceStr = option?.price ?? '0';
              const price = parseInt(priceStr, 10);

              return isNaN(price) ? sum : sum + price;
            }, 0);
            dd.weight = parseFloat(postMD.weight ?? '0');
            dd.v_height = parseFloat(postMD.v_height ?? '0');
            dd.v_width = parseFloat(postMD.v_width ?? '0');
            dd.v_length = parseFloat(postMD.v_length ?? '0');
            (dd.shipment_type as any) = postMD.shipment_type!!;
            dd.show_understocking = 'true';
            dd.stock = Math.min(
              ...dd.spec.map((specValue: string, index: number) => {
                const spec = postMD.specs[index];
                const option = spec?.option?.find((opt: { title: string }) => opt.title === specValue);
                const stockStr = option?.stock;

                if (!stockStr) {
                  // 直接檢查 stockStr 是否為空或 undefined
                  return Infinity;
                }

                const stock = parseInt(stockStr, 10);
                return isNaN(stock) ? Infinity : stock;
              })
            );
            if (dd.stock === Infinity) {
              dd.show_understocking = 'false';
            }
          });
        }

        // const diff = new DiffRecord(this.app, this.token);
        // product.content.records = await diff.getProdcutRecord(product.id);
      };

      if (Array.isArray(products.data)) {
        products.data = products.data.filter(dd => {
          return dd && dd.content;
        });
        await Promise.all(products.data.map(processProduct));
      } else {
        if (products.data && !products.data.content) {
          products.data = undefined;
        }
        await processProduct(products.data);
      }

      return products;
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
    }
  }

  async initProductCustomizeTagConifg() {
    try {
      const managerTags = await new User(this.app).getConfigV2({ key: 'product_manager_tags', user_id: 'manager' });
      if (managerTags && Array.isArray(managerTags.list)) {
        return managerTags;
      }
      const getData = await db.query(
        `
            SELECT GROUP_CONCAT(DISTINCT JSON_UNQUOTE(JSON_EXTRACT(content, '$.product_customize_tag')) SEPARATOR ',') AS unique_tags
            FROM \`${this.app}\`.t_manager_post
            WHERE JSON_UNQUOTE(JSON_EXTRACT(content, '$.type')) = 'product'
        `,
        []
      );

      const unique_tags_string = getData[0]?.unique_tags ?? '';
      const unique_tags_array = JSON.parse(`[${unique_tags_string}]`);
      const unique_tags_flot = Array.isArray(unique_tags_array) ? unique_tags_array.flat() : [];
      const data = { list: [...new Set(unique_tags_flot)] };
      await new User(this.app).setConfig({
        key: 'product_manager_tags',
        user_id: 'manager',
        value: data,
      });

      return data;
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'Set product customize tag conifg Error:' + error, null);
    }
  }

  async setProductCustomizeTagConifg(add_tags: string[]) {
    const tagConfig = await new User(this.app).getConfigV2({ key: 'product_manager_tags', user_id: 'manager' });
    const tagList = tagConfig?.list ?? [];
    const data = { list: [...new Set([...tagList, ...add_tags])] };

    await new User(this.app).setConfig({
      key: 'product_manager_tags',
      user_id: 'manager',
      value: data,
    });

    return data;
  }

  async initProductGeneralTagConifg() {
    try {
      const generalTags = await new User(this.app).getConfigV2({ key: 'product_general_tags', user_id: 'manager' });

      if (generalTags && Array.isArray(generalTags.list)) {
        return generalTags;
      }
      const getData = await db.query(
        `
            SELECT GROUP_CONCAT(DISTINCT JSON_UNQUOTE(JSON_EXTRACT(content, '$.product_tag.language')) SEPARATOR ',') AS unique_tags
            FROM \`${this.app}\`.t_manager_post
            WHERE JSON_UNQUOTE(JSON_EXTRACT(content, '$.type')) = 'product'
        `,
        []
      );
      const unique_tags_string = getData[0]?.unique_tags ?? '';
      const unique_tags_array = JSON.parse(`[${unique_tags_string}]`);
      const unique_tags_flot = Array.isArray(unique_tags_array) ? unique_tags_array.flat() : [];
      const list: { [k in LanguageLocation]?: string[] } = {};

      unique_tags_flot.map(item => {
        Language.locationList.map(lang => {
          list[lang] = [...(list[lang] ?? []), ...item[lang]];
        });
      });

      Language.locationList.map(lang => {
        list[lang] = [...new Set(list[lang])];
      });

      const data = { list };
      await new User(this.app).setConfig({
        key: 'product_general_tags',
        user_id: 'manager',
        value: data,
      });

      return data;
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'Set product general tag conifg Error:' + error, null);
    }
  }

  async setProductGeneralTagConifg(add_tags: { [k in LanguageLocation]: string[] }) {
    const tagConfig =
      (await new User(this.app).getConfigV2({ key: 'product_general_tags', user_id: 'manager' })) ??
      (await this.initProductGeneralTagConifg());

    tagConfig.list ??= {};

    Language.locationList.map(lang => {
      const originList = tagConfig.list[lang] ?? [];
      const updateList = add_tags[lang] ?? [];
      tagConfig.list[lang] = [...new Set([...originList, ...updateList])];
    });

    await new User(this.app).setConfig({
      key: 'product_general_tags',
      user_id: 'manager',
      value: tagConfig,
    });

    return tagConfig;
  }

  async initOrderCustomizeTagConifg() {
    try {
      const managerTags = await new User(this.app).getConfigV2({ key: 'order_manager_tags', user_id: 'manager' });

      if (managerTags && Array.isArray(managerTags.list)) {
        return managerTags;
      }

      const getData = await db.query(
        `
            SELECT GROUP_CONCAT(DISTINCT JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.tags')) SEPARATOR ',') AS unique_tags
            FROM \`${this.app}\`.t_checkout
            WHERE JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.tags')) IS NOT NULL
        `,
        []
      );
      const unique_tags_string = getData[0]?.unique_tags ?? '';
      const unique_tags_array = JSON.parse(`[${unique_tags_string}]`);
      const unique_tags_flot = Array.isArray(unique_tags_array) ? unique_tags_array.flat() : [];
      const data = { list: [...new Set(unique_tags_flot)] };

      await new User(this.app).setConfig({
        key: 'order_manager_tags',
        user_id: 'manager',
        value: data,
      });

      return data;
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'Set order customize tag conifg Error:' + e, null);
    }
  }

  async setOrderCustomizeTagConifg(add_tags: string[]) {
    const tagConfig = await new User(this.app).getConfigV2({ key: 'order_manager_tags', user_id: 'manager' });
    const tagList = tagConfig?.list ?? [];
    const data = { list: [...new Set([...tagList, ...add_tags])] };

    await new User(this.app).setConfig({
      key: 'order_manager_tags',
      user_id: 'manager',
      value: data,
    });

    return data;
  }

  async getAllUseVoucher(userID: any): Promise<VoucherData[]> {
    const now = Date.now();

    // 查詢所有優惠券，過濾有效期限
    const allVoucher = (
      await this.querySql([`(content->>'$.type'='voucher')`], {
        page: 0,
        limit: 10000,
      })
    ).data
      .map((dd: { content: VoucherData }) => dd.content)
      .filter((voucher: VoucherData) => {
        const status = voucher.status;
        const startDate = new Date(voucher.start_ISO_Date).getTime();
        const endDate = voucher.end_ISO_Date ? new Date(voucher.end_ISO_Date).getTime() : Infinity;
        return status && startDate < now && now < endDate;
      });

    // 處理需 async and await 的驗證
    const validVouchers = await Promise.all(
      allVoucher.map(async (voucher: VoucherData) => {
        const isLimited = await this.checkVoucherLimited(userID, Number(voucher.id));
        return isLimited ? voucher : null;
      })
    );

    // 過濾出有效的優惠券
    return validVouchers.filter(Boolean) as VoucherData[];
  }

  async getDistributionRecommend(distribution_code: string) {
    // 分銷連結
    const recommends = await db.query(
      `SELECT *
       FROM \`${this.app}\`.t_recommend_links`,
      []
    );
    const recommendData = recommends
      .map((dd: { content: any }) => dd.content) // 解構獲取 content
      .filter((dd: any) => {
        const isCode = dd.code === distribution_code;
        const startDate = new Date(dd.start_ISO_Date || `${dd.startDate} ${dd.startTime}`);
        const endDate = dd.end_ISO_Date
          ? new Date(dd.end_ISO_Date)
          : dd.endDate
            ? new Date(`${dd.endDate} ${dd.endTime}`)
            : null;
        const isActive = startDate.getTime() < Date.now() && (!endDate || endDate.getTime() > Date.now());
        return isCode && isActive;
      });
    return recommendData;
  }

  async aboutProductVoucher(json: {
    allVoucher: VoucherData[];
    userData: any;
    recommendData: any;
    product: any;
    userID: string;
    viewSource: string;
  }) {
    if (!json.product.content) {
      return [];
    }
    const id = `${json.product.id}`;
    const collection = (() => {
      try {
        return json.product.content.collection || [];
      } catch (error) {
        return [];
      }
    })();
    const product_customize_tag = (() => {
      try {
        return json.product.content.product_customize_tag || [];
      } catch (error) {
        return [];
      }
    })();
    const userData = json.userData;
    const recommendData = json.recommendData;

    function checkValidProduct(caseName: string, caseList: any[]): boolean {
      switch (caseName) {
        case 'manager_tag':
          return caseList.some(d1 => product_customize_tag.includes(d1));
        case 'collection':
          return caseList.some(d1 => collection.includes(d1));
        case 'product':
          return caseList.some(item => `${item}` === `${id}`); // 確保 id 是字串
        case 'all':
          return true;
        default:
          return false; // 考慮到未處理的 caseName
      }
    }

    // 過濾可使用優惠券
    const voucherList = json.allVoucher
      .filter(dd => {
        // 訂單來源判斷
        if (!dd.device) {
          return true;
        }
        if (dd.device.length === 0) {
          return false;
        }
        if (json.viewSource === 'pos') {
          return dd.device.includes('pos');
        }
        return dd.device.includes('normal');
      })
      .filter(dd => {
        // 判斷用戶是否為指定客群
        if (dd.target === 'customer') {
          return userData && userData.id && dd.targetList.includes(userData.userID);
        }
        if (dd.target === 'levels') {
          if (userData && userData.member) {
            const find = userData.member.find((dd: any) => dd.trigger);
            return find && dd.targetList.includes(find.id);
          }
          return false;
        }
        return true; // 所有顧客皆可使用
      })
      .filter(dd => {
        if (dd.trigger !== 'distribution') {
          return checkValidProduct(dd.for, dd.forKey);
        }
        if (recommendData.length === 0) {
          return false;
        }
        return checkValidProduct(recommendData[0].relative, recommendData[0].relative_data);
      });

    return voucherList;
  }

  async querySql(conditions: string[], query: { page: number; limit: number; id?: string; order_by?: string }) {
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderClause = query.order_by || 'ORDER BY id DESC';
    const offset = query.page * query.limit;

    let sql = `SELECT *
               FROM \`${this.app}\`.t_manager_post ${whereClause} ${orderClause}`;

    const data = await db.query(
      `SELECT *
       FROM (${sql}) AS subquery LIMIT ?, ?
      `,
      [offset, Number(query.limit)]
    );

    if (query.id) {
      return {
        data: data[0] || {},
        result: !!data[0],
      };
    } else {
      const total = await db
        .query(
          `SELECT COUNT(*) as count
           FROM \`${this.app}\`.t_manager_post ${whereClause}
          `,
          []
        )
        .then((res: any) => res[0]?.count || 0);

      return {
        data: data.map((dd: any) => ({ ...dd, content: { ...dd.content, id: dd.id } })),
        total,
      };
    }
  }

  async querySqlBySEO(
    querySql: string[],
    query: {
      page: number;
      limit: number;
      id?: string;
      order_by?: string;
    }
  ) {
    let sql = `SELECT id, content ->>'$.title' as title, content->>'$.seo' as seo
               FROM \`${this.app}\`.t_manager_post
               WHERE ${querySql.join(' and ')} ${query.order_by || `order by id desc`}
    `;
    if (query.id) {
      const data = (
        await db.query(
          `SELECT *
           FROM (${sql}) as subqyery
               limit ${query.page * query.limit}
              , ${query.limit}`,
          []
        )
      )[0];
      return { data: data, result: !!data };
    } else {
      return {
        data: await db.query(
          `SELECT *
           FROM (${sql}) as subqyery
               limit ${query.page * query.limit}
              , ${query.limit}`,
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
    }
  }

  async querySqlByVariants(
    querySql: string[],
    query: {
      page: number;
      limit: number;
      id?: string;
      order_by?: string;
    }
  ) {
    let sql = `
        SELECT v.id,
               v.product_id,
               v.content                                            AS variant_content,
               CAST(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) AS stock,
               JSON_EXTRACT(v.content, '$.stockList')               AS stockList
        FROM \`${this.app}\`.t_variants AS v
        WHERE product_id IN (SELECT id
                             FROM \`${this.app}\`.t_manager_post
                             WHERE (
                                       (content ->>'$.product_category' IS NULL) OR
                                       (content ->>'$.product_category' != 'kitchen')
                                       ))
          AND ${querySql.join(' AND ')} ${query.order_by || 'ORDER BY id DESC'}
    `;
    query.limit = query.limit && query.limit > 999 ? 999 : query.limit;
    const limitSQL = `limit ${query.page * query.limit} , ${query.limit}`;
    if (query.id) {
      const data = (
        await db.query(
          `SELECT *
           FROM (${sql}) as subqyery ${limitSQL}
          `,
          []
        )
      )[0];
      data.product_content = (
        await db.query(
          `select *
           from \`${this.app}\`.t_manager_post
           where id = ${data.product_id}`,
          []
        )
      )[0]['content'];
      return { data: data, result: !!data };
    } else {
      const vData = await db.query(
        `SELECT *
         FROM (${sql}) as subqyery ${limitSQL}
        `,
        []
      );
      await Promise.all(
        vData.map(async (data: any) => {
          data.product_content = (
            await db.query(
              `select *
               from \`${this.app}\`.t_manager_post
               where id = ${data.product_id}`,
              []
            )
          )[0]['content'];
        })
      );
      return {
        data: vData,
        total: (
          await db.query(
            `SELECT count(1)
             FROM (${sql}) as subqyery
            `,
            []
          )
        )[0]['count(1)'],
      };
    }
  }

  async deleteProduct(query: { id: string }) {
    try {
      await db.query(
        `DELETE
         FROM \`${this.app}\`.t_manager_post
         WHERE id in (?)`,
        [query.id.split(',')]
      );
      return {
        result: true,
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'DeleteProduct Error:' + e, null);
    }
  }

  async deleteVoucher(query: { id: string }) {
    try {
      await db.query(
        `DELETE
         FROM \`${this.app}\`.t_manager_post
         WHERE id in (?)`,
        [query.id.split(',')]
      );
      return {
        result: true,
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'DeleteVoucher Error:' + e, null);
    }
  }

  async linePay(data: any) {
    return new Promise(async (resolve, reject) => {
      const keyData: any = (
        await Private_config.getConfig({
          appName: this.app,
          key: 'glitter_finance',
        })
      )[0].value.line_pay_scan;

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url:
          keyData.BETA == 'true'
            ? 'https://sandbox-api-pay.line.me/v2/payments/oneTimeKeys/pay'
            : 'https://api-pay.line.me/v2/payments/oneTimeKeys/pay',
        headers: {
          'X-LINE-ChannelId': keyData.CLIENT_ID,
          'X-LINE-ChannelSecret': keyData.SECRET,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
      };
      axios
        .request(config)
        .then((response: any) => {
          resolve(response.data.returnCode === '0000');
        })
        .catch((error: any) => {
          resolve(false);
        });
    });
  }

  async getShippingMethod() {
    const shipment_setting: any = await (async () => {
      try {
        const config = await Private_config.getConfig({
          appName: this.app,
          key: 'logistics_setting',
        });

        // 如果 config 為空，則返回預設值
        if (!config) {
          return {
            support: [],
            shipmentSupport: [],
          };
        }

        // 返回第一個元素的 value 屬性
        return config[0].value;
      } catch (e) {
        // 發生錯誤時返回空陣列
        return [];
      }
    })();

    return [
      {
        name: '中華郵政',
        value: 'normal',
      },
      {
        name: '黑貓到府',
        value: 'black_cat',
      },
      {
        name: '全家店到店',
        value: 'FAMIC2C',
      },
      {
        name: '萊爾富店到店',
        value: 'HILIFEC2C',
      },
      {
        name: 'OK超商店到店',
        value: 'OKMARTC2C',
      },
      {
        name: '7-ELEVEN超商交貨便',
        value: 'UNIMARTC2C',
      },
      {
        name: '實體門市取貨',
        value: 'shop',
      },
      {
        name: '國際快遞',
        value: 'global_express',
      },
    ]
      .concat(
        (shipment_setting.custom_delivery ?? []).map((dd: any) => {
          return {
            form: dd.form,
            name: dd.name,
            value: dd.id,
          };
        })
      )
      .filter(d1 => {
        return shipment_setting.support.find((d2: any) => {
          return d2 === d1.value;
        });
      });
  }

  async getPostAddressData(address: string) {
    try {
      const url = `http://zip5.5432.tw/zip5json.py?adrs=${encodeURIComponent(address)}`;
      const response = await axios.get(url);

      // 確保回應包含 JSON 資料
      if (response && response.data) {
        return response.data; // 返回 JSON 資料
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  async updateExhibitionActiveStock(exh_id: string, v_id: number, count: number) {
    try {
      const _user = new User(this.app);
      const exhibitionConfig = await _user.getConfigV2({ key: 'exhibition_manager', user_id: 'manager' });
      if (exhibitionConfig.list && exhibitionConfig.list.length > 0) {
        exhibitionConfig.list.forEach((exhibition: any) => {
          if (exhibition.id === exh_id) {
            exhibition.dataList.forEach((item: any) => {
              if (item.variantID === v_id) {
                if (item.activeSaleStock - count < 0) {
                  item.activeSaleStock = 0;
                } else {
                  item.activeSaleStock -= count;
                }
              }
            });
          }
        });
        await _user.setConfig({
          key: 'exhibition_manager',
          user_id: 'manager',
          value: exhibitionConfig,
        });
      }
      return;
    } catch (error) {
      console.error('Error updateExhibitionActiveStock:', error);
    }
  }

  async getShipmentRefer(user_info: any) {
    user_info = user_info || {};
    let def = (
      (
        await Private_config.getConfig({
          appName: this.app,
          key: 'glitter_shipment',
        })
      )[0] ?? {
        value: {
          volume: [],
          weight: [],
          selectCalc: 'volume',
        },
      }
    ).value;

    // 參照運費設定
    const refer =
      user_info.shipment === 'global_express'
        ? (
            (
              await Private_config.getConfig({
                appName: this.app,
                key: 'glitter_shipment_global_' + user_info.country,
              })
            )[0] ?? {
              value: {
                volume: [],
                weight: [],
                selectCalc: 'volume',
              },
            }
          ).value
        : (
            (
              await Private_config.getConfig({
                appName: this.app,
                key: 'glitter_shipment_' + user_info.shipment,
              })
            )[0] ?? {
              value: {
                volume: [],
                weight: [],
                selectCalc: 'def',
              },
            }
          ).value;

    if (refer.selectCalc !== 'def') {
      def = refer;
    }
    return def;
  }

  calculateShipment(dataList: { key: string; value: string }[], value: number | string) {
    if (value === 0) {
      return 0;
    }

    const productValue = parseFloat(`${value}`);
    if (isNaN(productValue) || dataList.length === 0) {
      return 0;
    }

    for (let i = 0; i < dataList.length; i++) {
      const currentKey = parseFloat(dataList[i].key);
      const currentValue = parseFloat(dataList[i].value);
      if (productValue < currentKey) {
        return i === 0 ? 0 : parseFloat(dataList[i - 1].value);
      } else if (productValue === currentKey) {
        return currentValue;
      }
    }

    // 如果商品值大於所有的key，返回最後一個value
    return parseInt(dataList[dataList.length - 1].value);
  }

  getShipmentFee(user_info: any, lineItems: CartItem[], shipment: any) {
    if (user_info?.shipment === 'now') return 0;

    let total_volume = 0;
    let total_weight = 0;
    lineItems.map(item => {
      if (item.shipment_obj.type === 'volume') {
        total_volume += item.shipment_obj.value;
      }
      if (item.shipment_obj.type === 'weight') {
        total_weight += item.shipment_obj.value;
      }
    });
    return (
      this.calculateShipment(shipment.volume, total_volume) + this.calculateShipment(shipment.weight, total_weight)
    );
  }

  async repayOrder(orderID: string, return_url: string) {
    const app = this.app;

    async function getOrder(orderID: string) {
      try {
        const result = await db.query(
          `
              SELECT *
              FROM \`${app}\`.t_checkout
              WHERE cart_token = ?`,
          [orderID]
        );
        return result[0];
      } catch (e: any) {
        console.error(`查詢 orderID ${orderID} 的結帳資料時發生錯誤:`, e.message || e);
        // 處理錯誤的方式：
        // 選擇 1：返回 null，讓呼叫者知道操作失敗或未找到資料
        return null;
      }
    }

    const sqlData: any = await getOrder(orderID);

    if (sqlData) {
      const orderData: {
        lineItems: CartItem[];
        customer_info?: any; //顧客資訊 訂單人
        email?: string;
        return_url: string;
        orderID?: string;
        user_info: any; //取貨人資訊
        code?: string;
        use_rebate?: number;
        use_wallet?: number;
        checkOutType?: 'manual' | 'auto' | 'POS' | 'group_buy';
        pos_store?: string;
        voucher?: any; //自定義的voucher
        discount?: number; //自定義金額
        total?: number; //自定義總額
        pay_status?: number; //自定義訂單狀態
        custom_form_format?: any; //自定義表單格式
        custom_form_data?: any; //自定義表單資料
        custom_receipt_form?: any; //自定義配送表單格式
        distribution_code?: string; //分銷連結代碼
        code_array: string[]; // 優惠券代碼列表
        give_away?: {
          id: number;
          spec: string[];
          count: number;
          voucher_id: string;
        }[];
        language?: LanguageLocation;
        pos_info?: any; //POS結帳資訊;
        invoice_select?: string;
        pre_order?: boolean;
        voucherList?: any;
        isExhibition?: boolean;
        client_ip_address?: string;
        fbc?: string;
        fbp?: string;
        temp_cart_id?: string;
        shipment_fee?: number;
        rebate?: number;
      } = sqlData.orderData;
      if (!orderData) {
        throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout Error: Cannot find this orderID', null);
      }
      const keyData = (
        await Private_config.getConfig({
          appName: this.app,
          key: 'glitter_finance',
        })
      )[0].value;

      // 物流設定
      const shipment_setting: any = await (async () => {
        try {
          const config = await Private_config.getConfig({
            appName: this.app,
            key: 'logistics_setting',
          });

          // 如果 config 為空，則返回預設值
          if (!config) {
            return {
              support: [],
              shipmentSupport: [],
            };
          }

          // 返回第一個元素的 value 屬性
          return config[0].value;
        } catch (e) {
          // 發生錯誤時返回空陣列
          return [];
        }
      })();

      //現在是new一個新的版本
      const newOrderID = 'repay' + Date.now();
      const carData: Cart = {
        orderID: `${newOrderID}`,
        discount: orderData.discount ?? 0,
        customer_info: orderData.customer_info || {},
        lineItems: orderData.lineItems ?? [],
        total: orderData.total ?? 0,
        email: sqlData.email ?? orderData.user_info?.email ?? '',
        user_info: orderData.user_info,
        shipment_fee: orderData.shipment_fee ?? 0,
        rebate: orderData.rebate ?? 0,
        goodsWeight: 0,
        use_rebate: orderData.use_rebate || 0,
        shipment_support: shipment_setting.support as any,
        shipment_info: shipment_setting.info as any,
        shipment_selector: [
          // 標準物流
          ...Shipment_support_config.list.map(dd => ({
            name: dd.title,
            value: dd.value,
          })),
          // 自定義物流
          ...(shipment_setting.custom_delivery ?? []).map((dd: any) => ({
            form: dd.form,
            name: dd.name,
            value: dd.id,
            system_form: dd.system_form,
          })),
        ].filter(option => shipment_setting.support.includes(option.value)),
        use_wallet: 0,
        method: sqlData.user_info?.method,
        user_email: sqlData.email ?? orderData.user_info?.email ?? '',
        useRebateInfo: sqlData.useRebateInfo,
        custom_form_format: sqlData.custom_form_format,
        custom_form_data: sqlData.custom_form_data,
        custom_receipt_form: sqlData.custom_receipt_form,
        orderSource: sqlData.orderSource === 'POS' ? 'POS' : '',
        code_array: sqlData.code_array,
        give_away: sqlData.give_away as any,
        user_rebate_sum: 0,
        language: sqlData.language,
        pos_info: sqlData.pos_info,
        client_ip_address: sqlData.client_ip_address as string,
        fbc: sqlData.fbc as string,
        fbp: sqlData.fbp as string,
        editRecord: [],
      };
      // 紀錄新舊訂單
      await redis.setValue(newOrderID, `${orderData.orderID}`);
      //把我的所有付款方式初始化好
      const strategyFactory = new PaymentStrategyFactory(keyData);

      const allPaymentStrategies: Map<string, IPaymentStrategy> = strategyFactory.createStrategyRegistry();
      const appName = this.app;
      const paymentService = new PaymentService(allPaymentStrategies, appName, carData.customer_info.payment_select);

      try {
        const paymentResult = await paymentService.processPayment(
          carData,
          return_url,
          carData.customer_info.payment_select!
        );
        console.log('Controller 收到 Payment Result:', paymentResult);
        return paymentResult;
      } catch (error) {
        console.error('Controller 捕獲到錯誤:', error);
        // 回應錯誤給前端
      }

      // const result = await new PaymentTransaction(this.app, orderData.customer_info.payment_select as string).processPayment(
      //   carData,
      //   return_url
      // );

      // return result;
    }

    // return result
  }

  async getReturnOrder(query: {
    page: number;
    limit: number;
    id?: string;
    search?: string;
    email?: string;
    status?: string;
    searchType?: string;
    progress?: string;
    created_time?: string;
    orderString?: string;
    archived?: string;
  }) {
    try {
      let querySql = ['1=1'];
      let orderString = 'order by id desc';
      if (query.search && query.searchType) {
        switch (query.searchType) {
          case 'order_id':
          case 'return_order_id':
            querySql.push(`(${query.searchType} like '%${query.search}%')`);
            break;
          case 'name':
          case 'phone':
            querySql.push(
              `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.customer_info.${query.searchType}')) LIKE ('%${query.search}%')))`
            );
            break;
          default: {
            querySql.push(
              `JSON_CONTAINS_PATH(orderData, 'one', '$.lineItems[*].title') AND JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.lineItems[*].${query.searchType}')) REGEXP '${query.search}'`
            );
          }
        }
      }

      //退貨狀態 處理中:0 退貨中:-1 已退貨:1
      if (query.progress) {
        let newArray = query.progress.split(',');
        let temp = '';
        temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.returnProgress')) IN (${newArray.map(status => `"${status}"`).join(',')})`;
        querySql.push(`(${temp})`);
      }

      if (query.created_time) {
        const created_time = query.created_time.split(',');
        if (created_time.length > 1) {
          querySql.push(`
                        (created_time BETWEEN ${db.escape(`${created_time[0]} 00:00:00`)} 
                        AND ${db.escape(`${created_time[1]} 23:59:59`)})
                    `);
        }
      }

      if (query.orderString) {
        switch (query.orderString) {
          case 'created_time_desc':
            orderString = 'order by created_time desc';
            break;
          case 'created_time_asc':
            orderString = 'order by created_time asc';
            break;
        }
      }
      //退貨貨款狀態
      query.status && querySql.push(`status IN (${query.status})`);
      query.email && querySql.push(`email=${db.escape(query.email)}`);
      query.id && querySql.push(`(content->>'$.id'=${query.id})`);

      let sql = `SELECT *
                 FROM \`${this.app}\`.t_return_order
                 WHERE ${querySql.join(' and ')} ${orderString}`;
      if (query.id) {
        const data = (
          await db.query(
            `SELECT *
             FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`,
            []
          )
        )[0];
        return {
          data: data,
          result: !!data,
        };
      } else {
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
      }
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getReturnOrder Error:' + e, null);
    }
  }

  async createReturnOrder(data: any) {
    try {
      let returnOrderID = `${new Date().getTime()}`;
      let orderID: string = data.cart_token;
      let email: string = data.email;
      return await db.execute(
        `INSERT INTO \`${this.app}\`.t_return_order (order_id, return_order_id, email, orderData)
         values (?, ?, ?, ?)`,
        [orderID, returnOrderID, email, data.orderData]
      );
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'createReturnOrder Error:' + e, null);
    }
  }

  async putReturnOrder(data: { id: string; orderData: any; status: any }) {
    try {
      const getData = await db.execute(
        `SELECT *
         FROM \`${this.app}\`.t_return_order
         WHERE id = ${data.id}
        `,
        []
      );
      if (getData[0]) {
        const origData = getData[0];

        // 當退貨單都結束後，要做的購物金、優惠和庫存處理
        if (
          origData.status != '1' &&
          origData.orderData.returnProgress != '-1' &&
          data.orderData.returnProgress == '-1' &&
          data.status == '1'
        ) {
          const userClass = new User(this.app);
          const rebateClass = new Rebate(this.app);
          const userData = await userClass.getUserData(data.orderData.customer_info.email, 'account');
          await rebateClass.insertRebate(
            userData.userID,
            data.orderData.rebateChange,
            `退貨單調整-退貨單號${origData.return_order_id}`
          );
        }

        await db.query(
          `UPDATE \`${this.app}\`.\`t_return_order\`
           SET ?
           WHERE id = ?
          `,
          [{ status: data.status, orderData: JSON.stringify(data.orderData) }, data.id]
        );
        return {
          result: 'success',
          orderData: data,
        };
      }
      return {
        result: 'failure',
        orderData: data,
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'putReturnOrder Error:' + e, null);
    }
  }

  async combineOrder(dataMap: Record<string, { status: 'success'; note: ''; orders: Order[]; targetID: string }>) {
    try {
      delete dataMap.token;
      const currentTime = new Date().toISOString();

      for (const data of Object.values(dataMap)) {
        if (data.orders.length === 0) continue;

        const cartTokens = data.orders.map(order => order.cart_token);
        const placeholders = cartTokens.map(() => '?').join(',');
        const orders: Order[] = await db.query(
          `SELECT *
           FROM \`${this.app}\`.t_checkout
           WHERE cart_token IN (${placeholders});`,
          cartTokens
        );

        const targetOrder = orders.find(order => order.cart_token === data.targetID);
        const feedsOrder = orders.filter(order => order.cart_token !== data.targetID);

        if (!targetOrder) continue;

        const formatTargetOrder = JSON.parse(JSON.stringify(targetOrder));
        const base = formatTargetOrder.orderData;
        base.orderSource = 'combine';
        base.editRecord = [
          {
            time: currentTime,
            record: `合併自${data.orders.length}筆訂單\\n${cartTokens.map(token => `{{order=${token}}}`).join('\\n')}`,
          },
        ];

        const accumulateValues = (
          feed: Cart,
          keys: (keyof Cart)[],
          operation: (targetVal: any, feedVal: any) => any
        ) => {
          keys.forEach(key => {
            (base as any)[key] = operation(
              base[key] ?? (Array.isArray(feed[key]) ? [] : 0),
              feed[key] ?? (Array.isArray(feed[key]) ? [] : 0)
            );
          });
        };

        const mergeOrders = (feed: Cart) => {
          accumulateValues(
            feed,
            ['total', 'rebate', 'discount', 'use_rebate', 'use_wallet', 'goodsWeight'],
            (a, b) => a + b
          );
          accumulateValues(feed, ['give_away', 'lineItems', 'code_array', 'voucherList'], (a, b) => a.concat(b));

          if (base.useRebateInfo?.point !== undefined && feed.useRebateInfo?.point !== undefined) {
            base.useRebateInfo.point += feed.useRebateInfo.point;
          }

          // 若未付款，則總計扣除運費，反之補上運費
          if (
            formatTargetOrder.status === 0 &&
            !base.proof_purchase &&
            base.customer_info.payment_select !== 'cash_on_delivery'
          ) {
            base.total -= feed.shipment_fee;
          } else {
            base.shipment_fee += feed.shipment_fee;
          }
        };

        feedsOrder.forEach(order => mergeOrders(order.orderData));

        base.orderID = `${Date.now()}`;
        // 新增合併後的訂單
        await OrderEvent.insertOrder({
          cartData: base,
          status: targetOrder.status,
          app: this.app,
        });

        // 舊訂單新增歷史紀錄
        const newRecord = {
          time: currentTime,
          record: `與其他訂單合併至\\n{{order=${base.orderID}}}`,
        };

        // 批次封存原始訂單
        await Promise.all(
          orders.map(async order => {
            order.orderData = {
              ...order.orderData,
              orderStatus: '-1',
              archived: 'true',
              combineOrderID: base.orderID,
              editRecord: [...(order.orderData.editRecord ?? []), newRecord],
            };

            await this.putOrder({
              id: `${order.id}`,
              orderData: order.orderData,
              status: order.status,
            });
          })
        );
      }

      return true;
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'combineOrder Error:' + e, null);
    }
  }

  async splitOrder(obj: { orderData: Cart; splitOrderArray: OrderDetail[] }) {
    try {
      const checkoutEvent = new CheckoutEvent(this.app, this.token);

      async function processCheckoutsStaggered(
        splitOrderArray: any[],
        orderData: any
      ): Promise<boolean | { result: string; reason: any }> {
        const promises = splitOrderArray.map((order, index) => {
          // 為每個操作返回一個新的 Promise
          return new Promise<void>((resolve, reject) => {
            // 可以定義更精確的 resolve 型別，這裡用 void 示意
            const delay = 1000 * index; // 計算延遲時間

            setTimeout(() => {
              // 在 setTimeout 回呼中執行非同步操作
              const payload = {
                code_array: [],
                order_id: orderData?.splitOrders?.[index] ?? '',
                line_items: order.lineItems as any,
                customer_info: order.customer_info,
                return_url: '',
                user_info: order.user_info,
                discount: order.discount,
                voucher: order.voucher,
                total: order.total,
                pay_status: Number(order.pay_status),
              };

              // 假設 context.toCheckout 本身返回一個 Promise
              checkoutEvent
                .toCheckout(payload, 'split')
                .then(() => {
                  resolve(); // 當 toCheckout 成功時，resolve 外層的 Promise
                })
                .catch((error: any) => {
                  reject(error); // 當 toCheckout 失敗時，reject 外層的 Promise
                });
            }, delay); // 使用計算出的延遲
          });
        }); // map 結束

        try {
          await Promise.all(promises);
          return true; // 全部成功
        } catch (e) {
          console.error('處理拆分訂單結帳時至少發生一個錯誤 (從 Promise.all 捕獲):', e);
          return {
            result: 'failure',
            reason: e, // 返回捕獲到的錯誤
          };
        }
      }

      const currentTime = new Date().toISOString();

      //給定訂單編號 產生 編號A 編號B... 依此類推
      function generateOrderIds(orderId: string, arrayLength: number): string[] {
        const orderIdArray: string[] = [];
        const startChar = 'A'.charCodeAt(0); // 取得 'A' 的 ASCII 碼

        for (let i = 0; i < arrayLength; i++) {
          const charCode = startChar + i;
          const nextChar = String.fromCharCode(charCode); // ASCII 碼轉換成字元
          orderIdArray.push(orderId + nextChar);
        }

        return orderIdArray;
      }

      //整理原本訂單的總價 優惠卷的資訊 方便原本的訂單更新
      function refreshOrder(orderData: Cart, splitOrderArray: OrderDetail[]) {
        const { newTotal, newDiscount } = splitOrderArray.reduce(
          (acc, order) => {
            return {
              newTotal: acc.newTotal + order.total,
              newDiscount: acc.newDiscount + order.discount,
            };
          },
          { newTotal: 0, newDiscount: 0 }
        );
        orderData.total = orderData.total - newTotal;
        orderData.discount = (orderData.discount ?? 0) - newDiscount;
        orderData.splitOrders = generateOrderIds(orderData.orderID, splitOrderArray.length) ?? [];
        orderData.editRecord.push({
          time: currentTime,
          record: `拆分成 ${splitOrderArray.length} 筆子訂單\\n${orderData.splitOrders.map(orderID => `{{order=${orderID}}}`).join('\\n')}`,
        });
      }

      const orderData = obj.orderData;
      const splitOrderArray = obj.splitOrderArray;
      refreshOrder(orderData, splitOrderArray);
      await this.putOrder({
        cart_token: orderData.orderID,
        orderData,
      });
      return await processCheckoutsStaggered(splitOrderArray, orderData);
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'splitOrder Error:' + e, null);
    }
  }

  async formatUseRebate(
    total: number,
    useRebate: number
  ): Promise<{
    status: boolean;
    point: number;
    limit?: number;
    condition?: number;
  }> {
    try {
      const rebateClass = new Rebate(this.app);
      const status = await rebateClass.mainStatus();
      const getRS = await new User(this.app).getConfig({ key: 'rebate_setting', user_id: 'manager' });
      if (getRS[0] && getRS[0].value) {
        const configData = getRS[0].value.config;
        if (configData.condition.type === 'total_price' && configData.condition.value > total) {
          return {
            status,
            point: 0,
            condition: configData.condition.value - total,
          };
        }
        if (configData.customize) {
          return {
            status,
            point: useRebate,
          };
        } else {
          if (configData.use_limit.type === 'price') {
            const limit = configData.use_limit.value;
            return {
              status,
              point: useRebate > limit ? limit : useRebate,
              limit,
            };
          }
          if (configData.use_limit.type === 'percent') {
            const limit = parseInt(`${(total * configData.use_limit.value) / 100}`, 10);
            return {
              status,
              point: useRebate > limit ? limit : useRebate,
              limit,
            };
          }
          if (configData.use_limit.type === 'none') {
            return {
              status,
              point: useRebate,
            };
          }
        }
      }
      return {
        status,
        point: useRebate,
      };
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'formatUseRebate Error:' + e, null);
    }
  }

  async checkVoucher(cart: Cart) {
    cart.discount = 0;
    cart.lineItems.map(item => {
      item.discount_price = 0;
      item.rebate = 0;
    });

    // 確認用戶資訊
    const userClass = new User(this.app);
    const userData = (await userClass.getUserData(cart.email, 'email_or_phone')) ?? { userID: -1 };

    // 取得商店優惠券優先級
    const loginConfig = await userClass.getConfigV2({ key: 'login_config', user_id: 'manager' });
    const sortedVoucher = loginConfig?.sorted_voucher ?? { toggle: false };

    // 取得所有可使用優惠券
    const allVoucher = await this.getAllUseVoucher(userData.userID);

    // 訂單商品經優惠券折扣的物件
    const reduceDiscount: Record<string, number> = {};

    // 過濾可使用優惠券狀態
    let overlay = false;

    // 篩選符合商品判斷方法
    function switchValidProduct(
      caseName: VoucherForType,
      caseList: string[],
      caseOffStart: 'price_desc' | 'price_asc' | 'price_all'
    ): any {
      const filterItems = cart.lineItems
        .filter(item => {
          switch (caseName) {
            case 'manager_tag':
              return item.product_customize_tag.some(col => caseList.includes(col));
            case 'collection':
              return item.collection.some(col => caseList.includes(col));
            case 'product':
              return caseList.map(caseString => `${caseString}`).includes(`${item.id}`);
            default:
              return true;
          }
        })
        .sort((a, b) => {
          return caseOffStart === 'price_desc' ? b.sale_price - a.sale_price : a.sale_price - b.sale_price;
        });

      return filterItems;
    }

    // 訂單來源判斷
    function checkSource(voucher: VoucherData): Boolean {
      if (!voucher.device) return true;
      if (voucher.device.length === 0) return false;
      return voucher.device.includes(cart.orderSource === 'POS' ? 'pos' : 'normal');
    }

    // 判斷用戶是否為指定客群
    function checkTarget(voucher: VoucherData): Boolean {
      if (voucher.target === 'customer') {
        return userData?.id && voucher.targetList.includes(userData.userID);
      }
      if (voucher.target === 'levels') {
        if (userData.member_level) {
          return voucher.targetList.includes(userData.member_level.id);
        }
        return false;
      }
      return true; // 所有顧客皆可使用
    }

    // 判斷符合商品類型
    function setBindProduct(voucher: VoucherData): Boolean {
      voucher.bind = [];
      voucher.forKey ??= [];
      voucher.productOffStart = voucher.productOffStart ?? 'price_all';

      switch (voucher.trigger) {
        case 'auto': // 自動填入
          voucher.bind = switchValidProduct(
            voucher.for,
            voucher.forKey.map(k => k.toString()),
            voucher.productOffStart
          );
          break;
        case 'code': // 輸入代碼
          if (voucher.code === `${cart.code}` || (cart.code_array || []).includes(`${voucher.code}`)) {
            voucher.bind = switchValidProduct(
              voucher.for,
              voucher.forKey.map(k => k.toString()),
              voucher.productOffStart
            );
          }
          break;
        case 'distribution': // 分銷優惠
          if (cart.distribution_info && cart.distribution_info.voucher === voucher.id) {
            voucher.bind = switchValidProduct(
              cart.distribution_info.relative,
              cart.distribution_info.relative_data,
              voucher.productOffStart
            );
          }
          break;
      }

      // 採用百分比打折, 整份訂單, 最少購買, 活動為現折, 價高者商品或價低商品打折的篩選
      if (
        voucher.method === 'percent' &&
        voucher.conditionType === 'order' &&
        voucher.rule === 'min_count' &&
        voucher.reBackType === 'discount' &&
        voucher.productOffStart !== 'price_all' &&
        voucher.ruleValue > 0
      ) {
        voucher.bind = voucher.bind.slice(0, voucher.ruleValue);
      }

      return voucher.bind.length > 0;
    }

    // 購物車是否達到優惠條件，與計算優惠觸發次數
    function checkCartTotal(voucher: VoucherData): Boolean {
      voucher.times = 0;
      voucher.bind_subtotal = 0;

      const ruleValue = parseInt(`${voucher.ruleValue}`, 10);

      // 單位為訂單的優惠觸發
      if (voucher.conditionType === 'order') {
        let cartValue = 0;
        voucher.bind.map(item => {
          voucher.bind_subtotal += item.count * item.sale_price;
        });
        if (cart.discount && voucher.includeDiscount === 'after') {
          voucher.bind_subtotal -= cart.discount;
        }
        if (voucher.rule === 'min_price') {
          cartValue = voucher.bind_subtotal;
        }
        if (voucher.rule === 'min_count') {
          voucher.bind.map(item => {
            cartValue += item.count;
          });
        }

        if (voucher.reBackType === 'shipment_free') {
          // 判斷使用的物流是否為優惠券所指定
          const isSelectShipment: () => boolean = () => {
            if (voucher.selectShipment.type === 'all') {
              return true;
            }
            return voucher.selectShipment.list.includes(cart.user_info.shipment);
          };

          // 回傳免運費判斷
          return cart.shipment_fee > 0 && isSelectShipment() && cartValue >= ruleValue;
        }
        if (cartValue >= ruleValue) {
          if (voucher.counting === 'each') {
            voucher.times = Math.floor(cartValue / ruleValue);
          }
          if (voucher.counting === 'single') {
            voucher.times = 1;
          }
        }

        return voucher.times > 0;
      }

      // 計算單位為商品的優惠觸發
      if (voucher.conditionType === 'item') {
        if (voucher.rule === 'min_price') {
          voucher.bind = voucher.bind.filter(item => {
            item.times = 0;
            let subtotal = item.count * item.sale_price;
            if (cart.discount && voucher.includeDiscount === 'after') {
              subtotal -= reduceDiscount[item.id] ?? 0;
            }
            if (subtotal >= ruleValue) {
              if (voucher.counting === 'each') {
                item.times = Math.floor(subtotal / ruleValue);
              }
              if (voucher.counting === 'single') {
                item.times = 1;
              }
            }
            return item.times > 0;
          });
        }
        if (voucher.rule === 'min_count') {
          voucher.bind = voucher.bind.filter(item => {
            item.times = 0;
            if (item.count >= ruleValue) {
              if (voucher.counting === 'each') {
                item.times = Math.floor(item.count / ruleValue);
              }
              if (voucher.counting === 'single') {
                item.times = 1;
              }
            }
            return item.times > 0;
          });
        }

        return voucher.bind.reduce((acc, item) => acc + item.times, 0) > 0;
      }

      return false;
    }

    // 計算優惠券的訂單折扣
    function compare(voucher: VoucherData) {
      return voucher.bind
        .map(item => {
          const val = parseFloat(voucher.value);
          return voucher.method === 'percent' ? (item.sale_price * val) / 100 : val;
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    // 商家設定手動排序
    function manualSorted(a: VoucherData, b: VoucherData) {
      const aIndex = sortedVoucher.array.indexOf(a.id);
      const bIndex = sortedVoucher.array.indexOf(b.id);
      return aIndex > bIndex ? 1 : -1;
    }

    // 是否可疊加
    function checkOverlay(voucher: VoucherData): Boolean {
      if (overlay || voucher.overlay) return voucher.overlay;
      overlay = true;
      return true;
    }

    // 決定折扣金額
    function checkCondition(voucher: VoucherData): Boolean {
      voucher.discount_total = voucher.discount_total ?? 0;
      voucher.rebate_total = voucher.rebate_total ?? 0;

      if (voucher.reBackType === 'shipment_free') return true;

      const disValue = parseFloat(voucher.value) / (voucher.method === 'percent' ? 100 : 1);

      if (voucher.conditionType === 'order') {
        if (voucher.method === 'fixed') {
          voucher.discount_total = disValue * voucher.times;
        }
        if (voucher.method === 'percent') {
          voucher.discount_total = voucher.bind_subtotal * disValue;
        }
        if (voucher.bind_subtotal >= voucher.discount_total) {
          let remain = parseInt(`${voucher.discount_total}`, 10);
          voucher.bind.map((item, index) => {
            let discount = 0;
            if (index === voucher.bind.length - 1) {
              discount = remain;
            } else {
              discount = Math.round(remain * ((item.sale_price * item.count) / voucher.bind_subtotal));
            }
            if (discount > 0 && discount <= item.sale_price * item.count) {
              // 計算單位為訂單，優惠發放
              if (voucher.reBackType === 'rebate') {
                item.rebate += Math.round(discount / item.count);
                cart.rebate! += discount;
                voucher.rebate_total += discount;
              } else {
                item.discount_price += Math.round(discount / item.count);
                cart.discount! += discount;
              }
            }
            if (remain - discount > 0) {
              remain -= discount;
            } else {
              remain = 0;
            }
          });
          return true;
        }
        return false;
      }

      if (voucher.conditionType === 'item') {
        if (voucher.method === 'fixed') {
          voucher.bind = voucher.bind.filter(item => {
            const discount = disValue * item.times;
            if (discount <= item.sale_price * item.count) {
              // 計算單位為商品，固定折扣的優惠發放
              if (voucher.reBackType === 'rebate') {
                item.rebate += Math.round(discount / item.count);
                cart.rebate! += discount;
                voucher.rebate_total += discount;
              } else {
                item.discount_price += Math.round(discount / item.count);
                cart.discount! += discount;
                voucher.discount_total += discount;
              }
              return true;
            }
            return false;
          });
        }
        if (voucher.method === 'percent') {
          voucher.bind = voucher.bind.filter(item => {
            const discount = Math.floor(item.sale_price * item.count * disValue);
            if (discount <= item.sale_price * item.count) {
              // 計算單位為商品，百分比折扣的優惠發放
              if (voucher.reBackType === 'rebate') {
                item.rebate += Math.round(discount / item.count);
                cart.rebate! += discount;
                voucher.rebate_total += discount;
              } else {
                item.discount_price += Math.round(discount / item.count);
                cart.discount! += discount;
                voucher.discount_total += discount;
              }
              return true;
            }
            return false;
          });
        }
      }

      return voucher.bind.length > 0;
    }

    // 計算有折扣綁定商品的折抵數值
    function countingBindDiscount(voucher: VoucherData): void {
      voucher.bind.map(item => {
        reduceDiscount[item.id] = (reduceDiscount[item.id] ?? 0) + item.discount_price * item.count;
      });
    }

    // ==== 篩選優惠券 =====
    function filterVoucherlist(vouchers: VoucherData[]) {
      return vouchers
        .filter(voucher => {
          return [checkSource, checkTarget, setBindProduct, checkCartTotal].every(fn => fn(voucher));
        })
        .sort((a, b) => {
          return sortedVoucher.toggle ? manualSorted(a, b) : compare(b) - compare(a);
        })
        .filter(voucher => {
          return [checkOverlay, checkCondition].every(fn => fn(voucher));
        })
        .map(voucher => {
          countingBindDiscount(voucher);
          return voucher;
        });
    }

    // 分優惠前後，批次處理優惠券
    const includeDiscountVouchers: VoucherData[] = [];
    const withoutDiscountVouchers: VoucherData[] = [];

    allVoucher.map(voucher => {
      voucher.includeDiscount === 'after'
        ? includeDiscountVouchers.push(voucher)
        : withoutDiscountVouchers.push(voucher);
    });

    const voucherList = [...filterVoucherlist(withoutDiscountVouchers), ...filterVoucherlist(includeDiscountVouchers)];

    // 判斷優惠碼無效
    if (!voucherList.find((voucher: VoucherData) => voucher.code === `${cart.code}`)) {
      cart.code = undefined;
    }

    // 如果有折扣運費，刪除基本運費
    if (voucherList.find((voucher: VoucherData) => voucher.reBackType === 'shipment_free')) {
      cart.total -= cart.shipment_fee;
      cart.shipment_fee = 0;
    }

    // 回傳折扣後總金額與優惠券陣列
    cart.total -= cart.discount;
    cart.voucherList = voucherList;
    return cart;
  }

  async putOrder(data: { id?: string; cart_token?: string; orderData: any; status?: any }) {
    try {
      const update: any = {};
      const storeConfig = await new User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' });
      let origin: any;

      const whereClause = data.cart_token ? 'cart_token = ?' : data.id ? 'id = ?' : null;
      const value = data.cart_token ?? data.id;

      if (whereClause && value) {
        const query = `SELECT *
                       FROM \`${this.app}\`.t_checkout
                       WHERE ${whereClause};`;
        const result = await db.query(query, [value]);
        origin = result[0];
      }

      if (!origin) {
        return {
          result: 'error',
          message: `訂單 id ${data.id} 不存在`,
        };
      }

      if (data.status !== undefined) {
        update.status = data.status;
      } else {
        data.status = update.status;
      }

      // lineItems 庫存修正
      const resetLineItems = (lineItems: any[]) => {
        return lineItems.map(item => {
          return {
            ...item,
            stockList: undefined,
            deduction_log: Object.keys(item.deduction_log || {}).length
              ? item.deduction_log
              : { [storeConfig.list[0].id]: item.count },
          };
        });
      };

      if (data.orderData) {
        const orderData = data.orderData;
        update.orderData = structuredClone(orderData);

        // 恢復取消訂單的庫存
        orderData.lineItems = resetLineItems(orderData.lineItems);
        origin.orderData.lineItems = resetLineItems(origin.orderData.lineItems);
        // 釋放優惠券
        await this.releaseVoucherHistory(orderData.orderID, orderData.orderStatus === '-1' ? 0 : 1);

        // 當訂單變成已取消時，執行庫存回填
        const prevStatus = origin.orderData.orderStatus;
        const prevProgress = origin.orderData.progress || 'wait';

        //變成已取消加回庫存
        if (prevStatus !== '-1' && orderData.orderStatus === '-1') {
          await this.resetStore(origin.orderData.lineItems);

          const emailList = new Set(
            [origin.orderData.customer_info, origin.orderData.user_info].map(user => user?.email)
          );
          for (const email of emailList) {
            if (email) {
              await AutoFcm.orderChangeInfo({
                app: this.app,
                tag: 'order-cancel-success',
                order_id: orderData.orderID,
                phone_email: email,
              });
              await AutoSendEmail.customerOrder(
                this.app,
                'auto-email-order-cancel-success',
                orderData.orderID,
                email,
                orderData.language
              );
            }
          }
          //變成處理或已完成扣庫存
        } else if (prevStatus === '-1' && orderData.orderStatus !== '-1') {
          await this.resetStore(origin.orderData.lineItems, 'minus');
        }

        //當訂單多了出貨單號碼，新增出貨日期，反之清空出貨日期。
        if (update.orderData.user_info.shipment_number && !update.orderData.user_info.shipment_date) {
          update.orderData.user_info.shipment_date = new Date().toISOString();
        } else if (!update.orderData.user_info.shipment_number) {
          delete update.orderData.user_info.shipment_date;
        }

        // 當訂單出貨狀態變更，觸發通知事件
        const updateProgress = update.orderData.progress;

        if (
          updateProgress === 'wait' &&
          update.orderData.user_info.shipment_number &&
          update.orderData.user_info.shipment_number !== origin.orderData.user_info.shipment_number
        ) {
          await this.sendNotifications(orderData, 'in_stock');
        } else if (prevProgress !== updateProgress) {
          if (updateProgress === 'shipping') {
            await this.sendNotifications(orderData, 'shipment');
          } else if (updateProgress === 'arrived') {
            await this.sendNotifications(orderData, 'arrival');
          }
        } else {
          // 商品調整出貨倉庫的更新
          await this.adjustStock(origin.orderData, orderData);
        }

        // 付款狀態不一致時發動更新
        if (origin.status !== update.status) {
          await this.releaseCheckout(update.status, data.orderData.orderID);
        }
      }

      update.orderData.lineItems = update.orderData.lineItems.filter((item: any) => item.count > 0);
      this.writeRecord(origin, update);

      // ======= 更新訂單 =======
      const updateData: Record<string, unknown> = Object.entries(update).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: typeof value === 'object' ? JSON.stringify(value) : value,
        }),
        {}
      );
      await db.query(
        `UPDATE \`${this.app}\`.t_checkout
         SET ?
         WHERE id = ?;
        `,
        [updateData, origin.id]
      );

      // 更新訂單現有標籤
      if (Array.isArray(update.orderData.tags)) {
        await this.setOrderCustomizeTagConifg(update.orderData.tags);
      }

      // 同步蝦皮商品
      await Promise.all(
        origin.orderData.lineItems.map(async (lineItem: any) => {
          const shopping = new Shopping(this.app, this.token);
          const shopee = new Shopee(this.app, this.token);

          const pd = await shopping.getProduct({
            id: lineItem.id as string,
            page: 0,
            limit: 10,
            skip_shopee_check: true,
          });

          if (pd.data?.shopee_id) {
            await shopee.asyncStockToShopee({
              product: pd.data,
              callback: () => {},
            });
          }
        })
      );

      // 加入到索引欄位
      await CheckoutService.updateAndMigrateToTableColumn({
        id: origin.id,
        orderData: update.orderData,
        app_name: this.app,
      });

      // 若符合有效訂單設定，則發放類型為購物金的優惠券
      const orderCountingSQL = await new User(this.app).getCheckoutCountingModeSQL();
      const orderCount = await db.query(
        `SELECT *
         FROM \`${this.app}\`.t_checkout
         WHERE id = ?
           AND ${orderCountingSQL};
        `,
        [origin.id]
      );
      if (orderCount[0]) {
        await this.shareVoucherRebate(orderCount[0]);
      }

      // 若符合有效訂單設定，則發放類型為購物金的優惠券
      const invoiceCountingConfig = await new User(this.app).getInvoiceCountingModeSQL();
      const invoiceCount = await db.query(
        `SELECT *
         FROM \`${this.app}\`.t_checkout
         WHERE id = ?
           AND ${invoiceCountingConfig.sql_string};
        `,
        [origin.id]
      );

      if (invoiceCount[0]) {
        const cart_token = invoiceCount[0].cart_token;
        const invoice_trigger_exists = await db.query(
          `select *
           from \`${this.app}\`.t_triggers
           where tag = 'triggerInvoice'
             and content ->>'$.cart_token'='${cart_token}'`,
          []
        );

        if (invoice_trigger_exists.length == 0) {
          const json = {
            tag: 'triggerInvoice',
            content: JSON.stringify({ cart_token }),
            trigger_time: Tool.getCurrentDateTime({
              inputDate: new Date().toISOString(),
              addSeconds: invoiceCountingConfig.invoice_mode.afterDays * 86400,
            }),
            status: 0,
          };
          await db.query(
            `INSERT INTO \`${this.app}\`.t_triggers
             SET ?;`,
            [json]
          );
        }
      }

      return {
        result: 'success',
        orderData: data.orderData,
      };
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'putOrder Error:' + e, null);
    }
  }

  private writeRecord(origin: any, update: any): void {
    const editArray: Array<{ time: string; record: string }> = [];
    const currentTime = new Date().toISOString();

    const { orderStatus, progress } = origin.orderData;
    origin.orderData = {
      ...origin.orderData,
      orderStatus: orderStatus ?? '0',
      progress: progress ?? 'wait',
    };

    // 付款狀態變更記錄
    if (update.status != origin.status) {
      const statusTexts: Record<string, string> = {
        '1': '付款成功',
        '-2': '退款成功',
        '0': '修改為未付款',
        '3': '修改為部分付款',
      };

      const statusText = statusTexts[update.status];
      if (statusText) {
        editArray.push({
          time: currentTime,
          record: statusText,
        });
      }
    }

    // 訂單狀態變更記錄
    if (update.orderData.orderStatus != origin.orderData.orderStatus) {
      const orderStatusTexts: Record<string, string> = {
        '1': '訂單已完成',
        '0': '訂單改為處理中',
        '-1': '訂單已取消',
      };

      const orderStatusText = orderStatusTexts[update.orderData.orderStatus];
      if (orderStatusText) {
        editArray.push({
          time: currentTime,
          record: orderStatusText,
        });
      }
    }

    // 出貨狀態變更記錄
    if (update.orderData.progress != origin.orderData.progress) {
      const progressTexts: Record<string, string> = {
        shipping: '商品已出貨',
        wait: '商品處理中',
        finish: '商品已取貨',
        returns: '商品已退貨',
        arrived: '商品已到貨',
      };

      const progressText = progressTexts[update.orderData.progress];
      if (progressText) {
        editArray.push({
          time: currentTime,
          record: progressText,
        });
      }
    }

    // 新增出貨單號碼
    const updateNumber = update.orderData.user_info?.shipment_number;
    if (updateNumber && updateNumber !== origin.orderData.user_info.shipment_number) {
      const type = origin.orderData.user_info.shipment_number ? '更新' : '建立';

      editArray.push({
        time: currentTime,
        record: `${type}出貨單號碼\\n{{shipment=${updateNumber}}}`,
      });
    }

    // 封存訂單
    if (update.orderData.archived === 'true' && origin.orderData.archived !== 'true') {
      editArray.push({
        time: currentTime,
        record: '訂單已封存',
      });
    }

    // 將新的變更記錄添加到現有記錄中
    if (editArray.length > 0) {
      update.orderData.editRecord = [...(update.orderData.editRecord ?? []), ...editArray];
    }
  }

  private async resetStore(lineItems: any[], plus_or_minus: 'plus' | 'minus' = 'plus') {
    const shoppingClass = new Shopping(this.app, this.token);
    const calcMap = new Map();

    function updateCalcData(calc: number, stock_id: string, product_id: string, spec: string[]) {
      const getCalc = calcMap.get(product_id);
      calcMap.set(product_id, [...(getCalc ?? []), { calc, stock_id, product_id, spec }]);
    }

    lineItems.map(item => {
      if (item.product_category === 'kitchen' && item.spec?.length) {
        updateCalcData(item.count, '', item.id, item.spec);
        return;
      }

      Object.entries(item.deduction_log).map(([location, count]) => {
        let intCount = parseInt(`${count || 0}`, 10);
        if (plus_or_minus === 'minus') {
          intCount = intCount * -1;
        }
        updateCalcData(intCount, location, item.id, item.spec);
      });
    });

    return await Promise.all(
      [...calcMap.values()].map(async dataArray => {
        for (const data of dataArray) {
          const { calc, stock_id, product_id, spec } = data;
          await shoppingClass.calcVariantsStock(calc, stock_id, product_id, spec);
        }
      })
    );
  }

  /**
   * 寄送同時寄送購買人和寄件人
   * */
  private async sendNotifications(orderData: any, type: 'shipment' | 'arrival' | 'in_stock') {
    const { lineID } = orderData.customer_info;
    const messages = [];
    const typeMap = {
      shipment: 'shipment',
      arrival: 'shipment-arrival',
      in_stock: 'in-stock',
    };

    if (lineID) {
      const line = new LineMessage(this.app);
      messages.push(line.sendCustomerLine(`auto-line-${typeMap[type]}`, orderData.orderID, lineID));
    }

    for (const email of new Set(
      [orderData.customer_info, orderData.user_info].map(dd => {
        return dd && dd.email;
      })
    )) {
      if (email) {
        await AutoFcm.orderChangeInfo({
          app: this.app,
          tag: type,
          order_id: orderData.orderID,
          phone_email: email,
        });
        messages.push(
          AutoSendEmail.customerOrder(
            this.app,
            `auto-email-${typeMap[type]}`,
            orderData.orderID,
            email,
            orderData.language
          )
        );
      }
    }
    for (const data of [orderData.customer_info, orderData.user_info]) {
      const sns = new SMS(this.app);
      messages.push(sns.sendCustomerSns(`auto-sns-${typeMap[type]}`, orderData.orderID, data.phone));
    }
    await Promise.all(messages);
  }

  private async adjustStock(origin: any, orderData: any) {
    try {
      if (orderData.orderStatus === '-1') return;

      const shoppingClass = new Shopping(this.app, this.token);
      const calcMap = new Map();

      function updateCalcData(calc: number, stock_id: string, product_id: string, spec: string[]) {
        const getCalc = calcMap.get(product_id);
        calcMap.set(product_id, [...(getCalc ?? []), { calc, stock_id, product_id, spec }]);
      }

      orderData.lineItems.map((newItem: any) => {
        if (newItem.product_category === 'kitchen' && newItem.spec?.length) {
          updateCalcData(newItem.count, '', newItem.id, newItem.spec);
          return;
        }

        const originalItem = origin.lineItems.find(
          (item: any) => item.id === newItem.id && item.spec.join('') === newItem.spec.join('')
        );

        Object.entries(newItem.deduction_log).map(([location, newCount]) => {
          const parsedNewCount = Number(newCount || 0);
          const formatNewCount = isNaN(parsedNewCount) ? 0 : parsedNewCount;

          if (!originalItem) {
            updateCalcData(formatNewCount * -1, location, newItem.id, newItem.spec);
            return;
          }

          const originalCount = originalItem.deduction_log[location] || 0;
          const delta = formatNewCount - originalCount;
          updateCalcData(delta * -1, location, newItem.id, newItem.spec);
        });
      });

      return await Promise.all(
        [...calcMap.values()].map(async dataArray => {
          for (const data of dataArray) {
            const { calc, stock_id, product_id, spec } = data;
            await shoppingClass.calcVariantsStock(calc, stock_id, product_id, spec);
          }
        })
      );
    } catch (error) {
      console.error(`adjustStock has error: ${error}`);
    }
  }

  async manualCancelOrder(order_id: string) {
    try {
      if (!this.token) {
        return { result: false, message: 'The token is undefined' };
      }

      const orderList = await db.query(
        `SELECT *
         FROM \`${this.app}\`.t_checkout
         WHERE cart_token = ?;
        `,
        [order_id]
      );

      if (orderList.length === 0) {
        return { result: false, message: `Order id #${order_id} is not exist` };
      }

      const userClass = new User(this.app);
      const user = await userClass.getUserData(`${this.token.userID}`, 'userID');
      const { email, phone } = user.userData;
      const origin = orderList[0];

      if (![email, phone].includes(origin.email)) {
        return { result: false, message: 'The order does not match the token' };
      }

      const orderData = origin.orderData;
      const proofPurchase = orderData.proof_purchase === undefined;
      const paymentStatus = origin.status === undefined || origin.status === 0 || origin.status === -1;
      const progressStatus = orderData.progress === undefined || orderData.progress === 'wait';
      const orderStatus = orderData.orderStatus === undefined || `${orderData.orderStatus}` === '0';

      if (proofPurchase && paymentStatus && progressStatus && orderStatus) {
        orderData.orderStatus = '-1';
        const newRecord = {
          time: new Date().toISOString(),
          record: '顧客手動取消訂單',
        };
        orderData.editRecord = [...(orderData.editRecord ?? []), newRecord];
      }

      await this.putOrder({
        cart_token: order_id,
        orderData: orderData,
        status: undefined,
      });

      return { result: true };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'cancelOrder Error:' + e, null);
    }
  }

  async deleteOrder(req: { id: string }) {
    try {
      await db.query(
        `DELETE
         FROM \`${this.app}\`.t_checkout
         WHERE id in (?)`,
        [req.id.split(',')]
      );
      return {
        result: true,
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'deleteOrder Error:' + e, null);
    }
  }

  async proofPurchase(order_id: string, text: string) {
    try {
      const orderData = (
        await db.query(
          `select orderData
           from \`${this.app}\`.t_checkout
           where cart_token = ?`,
          [order_id]
        )
      )[0]['orderData'];
      orderData.proof_purchase = text;

      // 訂單待核款信件通知
      new ManagerNotify(this.app).uploadProof({ orderData: orderData });
      for (const email of new Set(
        [orderData.customer_info, orderData.user_info].map(dd => {
          return dd && dd.email;
        })
      )) {
        if (email) {
          await AutoFcm.orderChangeInfo({
            app: this.app,
            tag: 'proof-purchase',
            order_id: order_id,
            phone_email: email,
          });
          await AutoSendEmail.customerOrder(this.app, 'proof-purchase', order_id, email, orderData.language);
        }
      }
      for (const phone of new Set(
        [orderData.customer_info, orderData.user_info].map(dd => {
          return dd && dd.phone;
        })
      )) {
        let sns = new SMS(this.app);
        await sns.sendCustomerSns('sns-proof-purchase', order_id, phone);
        console.info('訂單待核款簡訊寄送成功');
      }

      if (orderData.customer_info.lineID) {
        let line = new LineMessage(this.app);
        await line.sendCustomerLine('line-proof-purchase', order_id, orderData.customer_info.lineID);
        console.info('付款成功line訊息寄送成功');
      }
      await this.putOrder({
        orderData: orderData,
        cart_token: order_id,
        status: undefined,
      });
      return {
        result: true,
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'ProofPurchase Error:' + e, null);
    }
  }

  async getCheckOut(query: {
    filter_type?: string;
    page: number;
    limit: number;
    is_pos?: string;
    id?: string;
    id_list?: string;
    search?: string;
    email?: string;
    phone?: string;
    status?: string;
    searchType?: string;
    shipment?: string;
    progress?: string;
    orderStatus?: string;
    created_time?: string;
    shipment_time?: string;
    orderString?: string;
    archived?: string;
    returnSearch?: string;
    distribution_code?: string;
    valid?: boolean;
    is_shipment?: boolean;
    payment_select?: string;
    is_reconciliation?: boolean;
    reconciliation_status?: string[];
    manager_tag?: string;
    member_levels?: string;
  }) {
    try {
      const timer = new UtTimer('get-checkout-info');
      timer.checkPoint('start');

      const querySql = ['o.id IS NOT NULL'];
      let orderString = 'order by created_time desc';

      // 初始化訂單現有標籤
      await this.initOrderCustomizeTagConifg();

      if (query.search && query.searchType) {
        switch (query.searchType) {
          case 'cart_token':
            querySql.push(`(cart_token like '%${query.search}%')`);
            break;
          case 'shipment_number':
            querySql.push(`(shipment_number like '%${query.search}%')`);
            break;
          case 'name':
          case 'phone':
          case 'email':
            querySql.push(
              `((UPPER(customer_${query.searchType}) LIKE '%${query.search.toUpperCase()}%') or (UPPER(shipment_${query.searchType}) LIKE '%${query.search.toUpperCase()}%'))`
            );
            break;
          case 'address':
            querySql.push(`((UPPER(shipment_${query.searchType}) LIKE '%${query.search.toUpperCase()}%'))`);
            break;
          case 'invoice_number':
            querySql.push(
              `(cart_token in (select order_id from \`${this.app}\`.t_invoice_memory where invoice_no like '%${query.search}%' ))`
            );
            break;
          case 'cart_token_exact':
            querySql.push(`(cart_token = '${query.search}')`);
            break;
          default:
            querySql.push(
              `JSON_CONTAINS_PATH(orderData, 'one', '$.lineItems[*].title') AND JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.lineItems[*].${query.searchType}')) REGEXP '${query.search}'`
            );
            break;
        }
      }

      if (query.id_list) {
        const id_list = [-99, ...query.id_list.split(',')].join(',');
        switch (query.searchType) {
          case 'cart_token':
            querySql.push(`(cart_token IN (${id_list}))`);
            break;
          case 'shipment_number':
            querySql.push(`(shipment_number IN (${id_list}))`);
            break;
          default:
            querySql.push(`(o.id IN (${id_list}))`);
            break;
        }
      }

      if (query.reconciliation_status) {
        //'pending_entry'|'completed_entry'|'refunded'|'completed_offset'|'pending_offset'|'pending_refund'
        let search: string[] = [];
        query.reconciliation_status!!.map(status => {
          if (status === 'pending_entry') {
            search.push(`total_received IS NULL`);
          } else if (status === 'completed_entry') {
            search.push(`total_received = total`);
          } else if (status === 'refunded') {
            search.push(`(total_received > total) && ((total_received + offset_amount) = total)`);
          } else if (status === 'completed_offset') {
            search.push(`(total_received < total) && ((total_received + offset_amount) = total)`);
          } else if (status === 'pending_offset') {
            search.push(`(total_received < total)  &&  (offset_amount IS NULL)`);
          } else if (status === 'pending_refund') {
            search.push(`(total_received > total)   &&  (offset_amount IS NULL)`);
          }
        });
        querySql.push(
          `(${search
            .map(dd => {
              return `(${dd})`;
            })
            .join(' or ')})`
        );
      }

      if (query.orderStatus) {
        let orderArray = query.orderStatus.split(',');
        let temp = '';
        if (orderArray.includes('0')) {
          temp += 'order_status IS NULL OR ';
        }
        temp += `order_status IN (${query.orderStatus})`;
        querySql.push(`(${temp})`);
      }

      if (query.valid) {
        const countingSQL = await new User(this.app).getCheckoutCountingModeSQL('o');

        querySql.push(countingSQL);
      }

      if (query.is_shipment) {
        querySql.push(`(shipment_number IS NOT NULL) and (shipment_number != '')`);
      }

      if (query.is_reconciliation) {
        querySql.push(`((o.status in (1,-2)) or ((payment_method='cash_on_delivery' and progress='finish') ))`);
      }

      if (query.payment_select) {
        querySql.push(
          `payment_method in (${query.payment_select
            .split(',')
            .map(d => `'${d}'`)
            .join(',')})`
        );
      }

      if (query.progress) {
        //備貨中
        if (query.progress === 'in_stock') {
          query.progress = 'wait';
          querySql.push(`shipment_number is NOT null`);
        } else if (query.progress === 'wait') {
          querySql.push(`shipment_number IS NULL`);
        }
        let newArray = query.progress.split(',');
        let temp = '';
        if (newArray.includes('wait')) {
          temp += 'progress IS NULL OR ';
        }
        temp += `progress IN (${newArray.map(status => `"${status}"`).join(',')})`;
        querySql.push(`(${temp})`);
      }

      if (query.distribution_code) {
        let codes = query.distribution_code.split(',');
        let temp = '';
        temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.distribution_info.code')) IN (${codes.map(code => `"${code}"`).join(',')})`;
        querySql.push(`(${temp})`);
      }

      if (query.is_pos === 'true') {
        querySql.push(`order_source='POS'`);
      } else if (query.is_pos === 'false') {
        querySql.push(`(order_source!='POS' or order_source IS NULL)`);
      }

      if (query.shipment) {
        let shipment = query.shipment.split(',');
        let temp = '';
        if (shipment.includes('normal')) {
          temp += '(shipment_method IS NULL) OR ';
        }
        temp += `(shipment_method IN (${shipment.map(status => `"${status}"`).join(',')}))`;
        querySql.push(`(${temp})`);
      }

      if (query.created_time) {
        const created_time = query.created_time.split(',');
        if (created_time.length > 1) {
          querySql.push(`
                        (created_time BETWEEN ${db.escape(`${created_time[0]}`)} 
                        AND ${db.escape(`${created_time[1]}`)})
                    `);
        }
      }

      if (query.shipment_time) {
        const shipment_time = query.shipment_time.split(',');
        if (shipment_time.length > 1) {
          querySql.push(`
                       (shipment_date >= ${db.escape(`${shipment_time[0]}`)}) and
                        (shipment_date <= ${db.escape(`${shipment_time[1]}`)})
                    `);
        }
      }

      if (query.orderString) {
        switch (query.orderString) {
          case 'created_time_desc':
            orderString = 'order by created_time desc';
            break;
          case 'created_time_asc':
            orderString = 'order by created_time asc';
            break;
          case 'order_total_desc':
            orderString = 'order by total desc';
            break;
          case 'order_total_asc':
            orderString = 'order by total asc';
            break;
        }
      }

      if (query.manager_tag) {
        const tagSplit = query.manager_tag.split(',').map(tag => tag.trim());
        if (tagSplit.length > 0) {
          const tagJoin = tagSplit.map(tag => {
            return `JSON_CONTAINS(orderData->>'$.tags', '"${tag}"')`;
          });
          querySql.push(`(${tagJoin.join(' OR ')})`);
        }
      }

      if (query.status) {
        querySql.push(`o.status IN (${query.status})`);
      }

      const orderMath = [];
      query.email && orderMath.push(`(email=${db.escape(query.email)})`);
      query.phone && orderMath.push(`(email=${db.escape(query.phone)})`);
      if (orderMath.length) {
        querySql.push(`(${orderMath.join(' OR ')})`);
      }

      if (query.member_levels) {
        let temp: string[] = [];
        const queryLevel = query.member_levels.split(',');
        const queryIdLevel = queryLevel.filter(level => level !== 'null');

        if (queryLevel.includes('null')) {
          temp = [`u.member_level IS NULL`, `u.member_level = ''`];
        }

        if (queryIdLevel.length > 0) {
          temp = [
            ...temp,
            `u.member_level IN (${queryIdLevel
              .map(level => {
                return db.escape(level);
              })
              .join(',')})`,
          ];
        }

        if (temp.length > 0) {
          querySql.push(`(${temp.join(' OR ')})`);
        }
      }

      if (query.filter_type === 'true' || query.archived) {
        if (query.archived === 'true') {
          querySql.push(`(archived="${query.archived}") AND (order_status IS NULL OR order_status NOT IN (-99))`);
        } else {
          querySql.push(`((archived="${query.archived}") or (archived IS NULL))`);
        }
      } else if (query.filter_type === 'normal') {
        querySql.push(`((archived IS NULL) or (archived!='true'))`);
      }

      if (!(query.filter_type === 'true' || query.archived)) {
        querySql.push(`((order_status IS NULL) or (order_status NOT IN (-99)))`);
      }

      // 定義基礎查詢結構
      const baseSelect = `
        SELECT
          o.*,
          i.invoice_no,
          i.invoice_data,
          i.\`status\` as invoice_status
        FROM`;

      const joinClause = `LEFT JOIN \`${this.app}\`.t_invoice_memory i ON o.cart_token = i.order_id AND i.status = 1`;
      const whereClause = `WHERE ${querySql.join(' AND ')}`;

      let sql: string;

      if (query.member_levels) {
        // 查詢會員等級資料
        sql = `
          (
            (
              ${baseSelect} \`${this.app}\`.t_user u 
              LEFT JOIN \`${this.app}\`.t_checkout o ON o.email = u.phone
              ${joinClause}
              ${whereClause}
            )
            UNION
            (
              ${baseSelect} \`${this.app}\`.t_user u 
              LEFT JOIN \`${this.app}\`.t_checkout o ON o.email = u.email
              ${joinClause}
              ${whereClause}
            )
          ) ${orderString}`;
      } else {
        // 直接查詢結帳資料
        sql = `${baseSelect} \`${this.app}\`.t_checkout o ${joinClause} ${whereClause} ${orderString}`;
      }

      if (query.returnSearch == 'true') {
        const data = await db.query(
          `SELECT *
           FROM \`${this.app}\`.t_checkout
           WHERE cart_token = ${db.escape(query.search)}`,
          []
        );
        let returnSql = `SELECT *
                         FROM \`${this.app}\`.t_return_order
                         WHERE order_id = ${query.search}`;

        let returnData = await db.query(returnSql, []);
        if (returnData.length > 0) {
          returnData.forEach((returnOrder: any) => {
            // todo 確認訂單是否被作廢
            if (!data[0].orderData?.discard) {
            }
            data[0].orderData.lineItems.map((lineItem: any, index: number) => {
              lineItem.count = lineItem.count - returnOrder.orderData.lineItems[index].return_count;
            });
            data[0].orderData.shipment_fee -= returnOrder.orderData.shipment_fee;
          });
          data[0].orderData.lineItems = data[0].orderData.lineItems.filter((dd: any) => {
            return dd.count > 0;
          });
        }
        return data[0];
      }

      const response_data: any = await new Promise(async resolve => {
        if (query.id) {
          const data = (
            await db.query(
              `SELECT *
               FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}
              `,
              []
            )
          )[0];
          timer.checkPoint('get response_data (has query.id)');
          resolve({
            data: data,
            result: !!data,
          });
        } else {
          const data = await db.query(
            `SELECT *
             FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}
            `,
            []
          );
          timer.checkPoint('get response_data (not query.id)');
          resolve({
            data: data,
            total: (
              await db.query(
                `SELECT count(1)
                 FROM (${sql}) as subqyery`,
                []
              )
            )[0]['count(1)'],
          });
        }
      });

      const obMap = Array.isArray(response_data.data) ? response_data.data : [response_data.data];
      const keyData = (
        await Private_config.getConfig({
          appName: this.app,
          key: 'glitter_finance',
        })
      )[0].value;

      await Promise.all(
        obMap
          .map(async (order: any) => {
            try {
              if (order.orderData.customer_info.payment_select === 'ecPay') {
                order.orderData.cash_flow = await new EcPay(this.app).checkPaymentStatus(order.cart_token);
              }
              if (order.orderData.customer_info.payment_select === 'paynow') {
                try {
                  order.orderData.cash_flow = (
                    await new PayNow(this.app, keyData['paynow']).confirmAndCaptureOrder(order.orderData.paynow_id)
                  ).result;
                } catch (e) {}
              }
              if (order.orderData.user_info.shipment_refer === 'paynow') {
                const pay_now = new PayNowLogistics(this.app);
                order.orderData.user_info.shipment_detail = await pay_now.getOrderInfo(order.cart_token);
                const status = (() => {
                  switch (order.orderData.user_info.shipment_detail.PayNowLogisticCode) {
                    case '0000':
                    case '7101':
                    case '7201':
                      return 'wait';
                    case '0101':
                    case '4000':
                    case '4019':
                    case '0102':
                    case '9411':
                      return 'shipping';
                    case '0103':
                    case '4033':
                    case '4031':
                    case '4032':
                    case '4036':
                    case '4040':
                    case '5001':
                    case '8100':
                    case '8110':
                    case '8120':
                      return 'returns';
                    case '5000':
                      return 'arrived';
                    case '8000':
                    case '8010':
                    case '8020':
                      return 'finish';
                  }
                })();
                //貨態更新
                if (status && order.orderData.progress !== status) {
                  order.orderData.progress = status;
                  await this.putOrder({
                    status: undefined,
                    orderData: order.orderData,
                    id: order.id,
                  });
                }
              }
            } catch (e) {}
          })
          //補上發票號碼資訊
          .concat(
            obMap.map(async (order: any) => {
              const invoice = (
                await new Invoice(this.app).getInvoice({
                  page: 0,
                  limit: 1,
                  search: order.cart_token,
                  searchType: order.orderData?.order_number,
                })
              ).data[0];
              order.invoice_number = invoice && invoice.invoice_no;
            })
          )
          //補上用戶資訊
          .concat(
            obMap.map(async (order: any) => {
              order.user_data = await new User(this.app).getUserData(order.email, 'email_or_phone');
            })
          )
      );

      timer.checkPoint('finish-query-all');

      return response_data;
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getCheckOut Error:' + e, null);
    }
  }

  async releaseCheckout(status: 1 | 0 | -1, order_id: string) {
    try {
      //訂單資料
      const order_data = (
        await db.query(
          `SELECT *
           FROM \`${this.app}\`.t_checkout
           WHERE cart_token = ?
          `,
          [order_id]
        )
      )[0];
      //原先的付款狀態
      const original_status = order_data['status'];

      if (status === -1) {
        if (original_status === -1) {
          return;
        }
        await db.execute(
          `UPDATE \`${this.app}\`.t_checkout
           SET status = ?
           WHERE cart_token = ?`,
          [-1, order_id]
        );
        // await this.releaseVoucherHistory(order_id, 0);
      }

      //如果原先狀態為已付款，且更改的狀態不為已付款
      if (original_status === 1 && status !== 1) {
        //清除購買數量
        for (const b of order_data['orderData'].lineItems) {
          await this.calcSoldOutStock(b.count * -1, b.id, b.spec);
        }
      }

      if (status === 1) {
        if (original_status === 1) {
          return;
        }

        await db.execute(
          `UPDATE \`${this.app}\`.t_checkout
           SET status = ?
           WHERE cart_token = ?`,
          [1, order_id]
        );
        const cartData = (
          await db.query(
            `SELECT *
             FROM \`${this.app}\`.t_checkout
             WHERE cart_token = ?;`,
            [order_id]
          )
        )[0];

        const brandAndMemberType = await App.checkBrandAndMemberType(this.app);
        const store_info = await new User(this.app).getConfigV2({
          key: 'store-information',
          user_id: 'manager',
        });
        for (const b of order_data['orderData'].lineItems) {
          // 更改為已付款
          this.calcSoldOutStock(b.count, b.id, b.spec);
          // 確認是否有商品信件通知
          this.soldMailNotice({
            brand_domain: brandAndMemberType.domain,
            shop_name: store_info.shop_name,
            product_id: b.id,
            order_data: cartData.orderData,
          });
        }

        // 訂單已付款信件通知（管理員, 消費者）
        new ManagerNotify(this.app).checkout({
          orderData: cartData.orderData,
          status: status,
        });
        for (const email of new Set(
          [cartData.orderData.customer_info, cartData.orderData.user_info].map(dd => {
            return dd && dd.email;
          })
        )) {
          if (email) {
            await AutoFcm.orderChangeInfo({
              app: this.app,
              tag: 'payment-successful',
              order_id: order_id,
              phone_email: email,
            });
            await AutoSendEmail.customerOrder(
              this.app,
              'auto-email-payment-successful',
              order_id,
              email,
              cartData.orderData.language
            );
          }
        }

        for (const phone of new Set(
          [cartData.orderData.customer_info, cartData.orderData.user_info].map(dd => {
            return dd && dd.phone;
          })
        )) {
          let sns = new SMS(this.app);
          await sns.sendCustomerSns('auto-sns-payment-successful', order_id, phone);
          console.info('付款成功簡訊寄送成功');
        }

        if (cartData.orderData.customer_info.lineID) {
          let line = new LineMessage(this.app);
          await line.sendCustomerLine(
            'auto-line-payment-successful',
            order_id,
            cartData.orderData.customer_info.lineID
          );
          console.info('付款成功line訊息寄送成功');
        }

        const userData = await new User(this.app).getUserData(cartData.email, 'account');

        try {
          await new CustomCode(this.app).checkOutHook({ userData, cartData });
        } catch (e) {
          console.error(e);
        }
      }
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'Release Checkout Error:' + e, null);
    }
  }

  async shareVoucherRebate(cartData: any) {
    const order_id = cartData.cart_token;
    const rebateClass = new Rebate(this.app);
    const userClass = new User(this.app);
    const userData = await userClass.getUserData(cartData.email, 'account');

    if (order_id && userData && cartData.orderData.rebate > 0) {
      for (let i = 0; i < cartData.orderData.voucherList.length; i++) {
        const orderVoucher = cartData.orderData.voucherList[i];

        const voucherRow = await db.query(
          `SELECT *
           FROM \`${this.app}\`.t_manager_post
           WHERE JSON_EXTRACT(content, '$.type') = 'voucher'
             AND id = ?;`,
          [orderVoucher.id]
        );

        if (orderVoucher.id === 0 || voucherRow[0]) {
          const usedVoucher = await this.isUsedVoucher(userData.userID, orderVoucher.id, order_id);
          const voucherTitle = orderVoucher.id === 0 ? orderVoucher.title : voucherRow[0].content.title;

          const rebateEndDay = (() => {
            try {
              return `${voucherRow[0].content.rebateEndDay}`;
            } catch (error) {
              return '0';
            }
          })();

          if (orderVoucher.rebate_total && !usedVoucher) {
            const cf: any = {
              voucher_id: orderVoucher.id,
              order_id: order_id,
            };

            if (parseInt(rebateEndDay, 10)) {
              const date = new Date();
              date.setDate(date.getDate() + parseInt(rebateEndDay, 10));
              cf.deadTime = moment(date).format('YYYY-MM-DD HH:mm:ss');
            }

            await rebateClass.insertRebate(
              userData.userID,
              orderVoucher.rebate_total,
              `優惠券購物金：${voucherTitle}`,
              cf
            );
          }
        }
      }
    }

    if (cartData.orderData.voucherList && cartData.orderData.voucherList.length > 0) {
      await this.releaseVoucherHistory(order_id, 1);
    }
  }

  async checkVoucherLimited(user_id: number, voucher_id: number): Promise<boolean> {
    try {
      const vouchers = await db.query(
        `SELECT id,
                JSON_EXTRACT(content, '$.macroLimited') AS macroLimited,
                JSON_EXTRACT(content, '$.microLimited') AS microLimited
         FROM \`${this.app}\`.t_manager_post
         WHERE id = ?;`,
        [voucher_id]
      );
      if (!vouchers[0]) {
        return false;
      }
      if (vouchers[0].macroLimited === 0 && vouchers[0].microLimited === 0) {
        return true;
      }
      const history = await db.query(
        `SELECT *
         FROM \`${this.app}\`.t_voucher_history
         WHERE voucher_id = ?
           AND status in (1, 2);`,
        [voucher_id]
      );
      if (vouchers[0].macroLimited > 0 && history.length >= vouchers[0].macroLimited) {
        return false;
      }
      if (
        vouchers[0].microLimited > 0 &&
        history.filter((item: { user_id: number }) => {
          return item.user_id === user_id;
        }).length >= vouchers[0].microLimited
      ) {
        return false;
      }
      return true;
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'checkVoucherHistory Error:' + e, null);
    }
  }

  async isUsedVoucher(user_id: number, voucher_id: number, order_id: string): Promise<boolean> {
    try {
      const history = await db.query(
        `SELECT *
         FROM \`${this.app}\`.t_rebate_point
         WHERE user_id = ?
           AND content ->>'$.order_id' = ?
           AND content->>'$.voucher_id' = ?;`,
        [user_id, order_id, voucher_id]
      );

      return history.length > 0;
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'checkOrderVoucher 錯誤: ' + error, null);
    }
  }

  async insertVoucherHistory(user_id: number, order_id: string, voucher_id: number) {
    try {
      await db.query(
        `INSERT INTO \`${this.app}\`.\`t_voucher_history\`
         set ?`,
        [
          {
            user_id,
            order_id,
            voucher_id,
            created_at: new Date(),
            updated_at: new Date(),
            status: 2,
          },
        ]
      );
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'insertVoucherHistory Error:' + e, null);
    }
  }

  async releaseVoucherHistory(order_id: string, status: 1 | 0) {
    try {
      await db.query(
        `UPDATE \`${this.app}\`.t_voucher_history
         SET status = ?
         WHERE order_id = ?;`,
        [status, order_id]
      );
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'insertVoucherHistory Error:' + e, null);
    }
  }

  async resetVoucherHistory() {
    try {
      const resetMins = 10;
      const now = moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
      await db.query(
        `
            UPDATE \`${this.app}\`.t_voucher_history
            SET status = 0
            WHERE status = 2
              AND updated_at < DATE_SUB('${now}', INTERVAL ${resetMins} MINUTE);`,
        []
      );
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'insertVoucherHistory Error:' + e, null);
    }
  }

  async postVariantsAndPriceValue(content: any) {
    try {
      content.variants = content.variants ?? [];
      content.min_price = undefined;
      content.max_price = undefined;
      content.total_sales = 0;

      if (!content.id) {
        throw exception.BadRequestError('BAD_REQUEST', 'Missing product ID.', null);
      }

      const originVariants = await db.query(
        `SELECT id, product_id, content ->>'$.spec' as spec
         FROM \`${this.app}\`.t_variants
         WHERE product_id = ?`,
        [content.id]
      );

      await db.query(
        `DELETE
         FROM \`${this.app}\`.t_variants
         WHERE product_id = ?
           AND id > 0`,
        [content.id]
      );

      const _user = new User(this.app);
      const storeConfig = await _user.getConfigV2({ key: 'store_manager', user_id: 'manager' });

      const sourceMap: Record<string, string> = {};

      const insertPromises = content.variants.map(async (variant: any) => {
        content.total_sales += variant.sold_out ?? 0;
        content.min_price = Math.min(content.min_price ?? variant.sale_price, variant.sale_price);
        content.max_price = Math.max(content.max_price ?? variant.sale_price, variant.sale_price);

        variant.type = 'variants';
        variant.product_id = content.id;
        variant.stockList = variant.stockList || {};

        if (variant.show_understocking === 'false') {
          variant.stock = 0;
          variant.stockList = {};
        } else if (Object.keys(variant.stockList).length === 0) {
          variant.stockList[storeConfig.list[0].id] = { count: variant.stock };
        }
        const insertObj: any = {
          content: JSON.stringify(variant),
          product_id: content.id,
        };
        const originalVariant = originVariants.find(
          (item: any) => JSON.parse(item.spec).join(',') === variant.spec.join(',')
        );

        //如果有找到原先的variant不要替換掉ID
        if (originalVariant) {
          insertObj.id = originalVariant.id;
          sourceMap[originalVariant.id] = originalVariant.id;
        }

        const insertData = await db.query(
          `replace
          INTO \`${this.app}\`.t_variants
           SET ?
          `,
          [insertObj]
        );

        return insertData;
      });

      const chunk = 10;
      const chunkLength = Math.ceil(insertPromises.length / chunk);

      for (let i = 0; i < chunkLength; i++) {
        const promisesArray = insertPromises.slice(i * chunk, (i + 1) * chunk);
        setTimeout(async () => {
          await Promise.all(promisesArray);
        }, 200);
      }

      const exhibitionConfig = await _user.getConfigV2({ key: 'exhibition_manager', user_id: 'manager' });
      exhibitionConfig.list = exhibitionConfig.list ?? [];
      exhibitionConfig.list.forEach((exhibition: any) => {
        exhibition.dataList.forEach((item: any) => {
          if (sourceMap[item.variantID]) {
            item.variantID = sourceMap[item.variantID];
          }
        });
      });

      await _user.setConfig({
        key: 'exhibition_manager',
        user_id: 'manager',
        value: exhibitionConfig,
      });

      await db.query(
        `UPDATE \`${this.app}\`.t_manager_post
         SET ?
         WHERE id = ?`,
        [{ content: JSON.stringify(content) }, content.id]
      );
    } catch (error) {
      console.error(error);
      throw exception.BadRequestError('BAD_REQUEST', 'postVariantsAndPriceValue Error: ' + error, null);
    }
  }

  async updateVariantsWithSpec(data: any, product_id: string, spec: string[]) {
    const sql =
      spec.length > 0
        ? `AND JSON_CONTAINS(content->'$.spec', JSON_ARRAY(${spec
            .map((data: string) => {
              return `\"${data}\"`;
            })
            .join(',')}));`
        : '';

    try {
      await db.query(
        `UPDATE \`${this.app}\`.\`t_variants\`
         SET ?
         WHERE product_id = ? ${sql}
        `,
        [
          {
            content: JSON.stringify(data),
          },
          product_id,
        ]
      );
    } catch (e: any) {
      console.error('error -- ', e);
    }
  }

  async updateVariantsForScheduled(data: any, scheduled_id: string) {
    try {
      await db.query(
        `UPDATE \`${this.app}\`.\`t_live_purchase_interactions\`
         SET ?
         WHERE id = ${scheduled_id}
        `,
        [
          {
            content: JSON.stringify(data),
          },
        ]
      );
    } catch (e: any) {
      console.error('error -- ', e);
    }
  }

  //更新庫存數量
  async calcVariantsStock(calc: number, stock_id: string, product_id: string, spec: string[]) {
    try {
      const pd_data = (
        await this.getProduct({
          id: product_id,
          page: 0,
          limit: 1,
          is_manger: true,
        })
      ).data.content;

      const variant_s: any = pd_data.variants.find((dd: any) => {
        return dd.spec.join('-') === spec.join('-');
      });
      //如果是餐飲組合扣除庫存方式不同
      if (pd_data.product_category === 'kitchen' && pd_data.specs && pd_data.specs.length) {
        variant_s.spec.map((d1: any, index: number) => {
          const count_s = `${
            pd_data.specs[index].option.find((d2: any) => {
              return d2.title === d1;
            }).stock ?? ''
          }`;
          if (count_s) {
            pd_data.specs[index].option.find((d2: any) => {
              return d2.title === d1;
            }).stock = parseInt(count_s, 10) + calc;
          }
        });
      } else {
        const store_config = await new User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' });
        if (Object.keys(variant_s.stockList).length === 0) {
          //適應舊版庫存更新
          variant_s.stockList[store_config.list[0].id] = { count: variant_s.stock };
        }
        if (variant_s.stockList[stock_id]) {
          variant_s.stockList[stock_id].count = variant_s.stockList[stock_id].count || 0;
          variant_s.stockList[stock_id].count = variant_s.stockList[stock_id].count + calc;
          if (variant_s.stockList[stock_id].count < 0) {
            variant_s.stockList[stock_id].count = 0;
          }
        }
      }

      await this.postVariantsAndPriceValue(pd_data);
    } catch (e) {
      console.error('error -- can not find variants', e);
    }
  }

  //更新販售數量
  async calcSoldOutStock(calc: number, product_id: string, spec: string[]) {
    try {
      const pd_data = (
        await db.query(
          `select *
           from \`${this.app}\`.t_manager_post
           where id = ?`,
          [product_id]
        )
      )[0]['content'];
      const variant_s: any = pd_data.variants.find((dd: any) => {
        return dd.spec.join('-') === spec.join('-');
      });
      variant_s.sold_out = variant_s.sold_out ?? 0;
      variant_s.sold_out += calc;
      if (variant_s.sold_out < 0) {
        variant_s.sold_out = 0;
      }
      await this.postVariantsAndPriceValue(pd_data);
    } catch (e) {
      console.error('calcSoldOutStock error', e);
    }
  }

  //商品完成購買寄送信件
  async soldMailNotice(json: { brand_domain: string; shop_name: string; product_id: string; order_data: any }) {
    try {
      const order_data = json.order_data;
      const order_id = order_data.orderID;
      const pd_data = (
        await db.query(
          `select *
           from \`${this.app}\`.t_manager_post
           where id = ?`,
          [json.product_id]
        )
      )[0]['content'];
      if (pd_data.email_notice && pd_data.email_notice.length > 0 && order_data.user_info.email) {
        const notice = pd_data.email_notice
          .replace(
            /@\{\{訂單號碼\}\}/g,
            `<a href="https://${json.brand_domain}/order_detail?cart_token=${order_id}">${order_id}</a>`
          )
          .replace(/@\{\{訂單金額\}\}/g, order_data.total)
          .replace(/@\{\{app_name\}\}/g, json.shop_name)
          .replace(/@\{\{user_name\}\}/g, order_data.user_info.name ?? '')
          .replace(/@\{\{姓名\}\}/g, order_data.customer_info.name ?? '')
          .replace(/@\{\{電話\}\}/g, order_data.user_info.phone ?? '')
          .replace(/@\{\{地址\}\}/g, order_data.user_info.address ?? '')
          .replace(/@\{\{信箱\}\}/g, order_data.user_info.email ?? '');

        sendmail(
          `${json.shop_name} <${process.env.smtp}>`,
          order_data.user_info.email,
          `${pd_data.title} 購買通知信`,
          notice,
          () => {}
        );
      }
    } catch (e) {
      console.error('soldMailNotice error', e);
    }
  }

  formatDateString(isoDate?: string): string {
    // 使用給定的 ISO 8601 日期字符串，或建立一個當前時間的 Date 對象
    const date = isoDate ? new Date(isoDate) : new Date();

    // 提取年、月、日、時、分
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // 格式化為所需的字符串
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  async getCollectionProducts(tags: string) {
    try {
      const products_sql = `SELECT *
                            FROM \`${this.app}\`.t_manager_post
                            WHERE JSON_EXTRACT(content, '$.type') = 'product';`;
      const products = await db.query(products_sql, []);
      const tagArray = tags.split(',');
      return products.filter((product: any) => {
        return tagArray.some(tag => product.content.collection.includes(tag));
      });
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e, null);
    }
  }

  async getCollectionProductVariants(tags: string) {
    try {
      const products_sql = `SELECT *
                            FROM \`${this.app}\`.t_manager_post
                            WHERE JSON_EXTRACT(content, '$.type') = 'product';`;
      const products = await db.query(products_sql, []);
      const tagArray = tags.split(',');
      const filterProducts = products.filter((product: any) => {
        return tagArray.some(tag => product.content.collection.includes(tag));
      });

      if (filterProducts.length === 0) {
        return [];
      }

      const sql = `
          SELECT v.id,
                 v.product_id,
                 v.content                                            as variant_content,
                 p.content                                            as product_content,
                 CAST(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) as stock
          FROM \`${this.app}\`.t_variants AS v
                   JOIN
               \`${this.app}\`.t_manager_post AS p ON v.product_id = p.id
          WHERE product_id in (${filterProducts.map((item: { id: number }) => item.id).join(',')})
          ORDER BY id DESC
      `;

      const data = await db.query(sql, []);
      return data;
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e, null);
    }
  }

  async putCollection(replace: Collection, original: Collection) {
    try {
      const config =
        (
          await db.query(
            `SELECT *
             FROM \`${this.app}\`.public_config
             WHERE \`key\` = 'collection';`,
            []
          )
        )[0] ?? {};
      config.value = config.value || [];

      if (replace.parentTitles[0] === '(無)') {
        replace.parentTitles = [];
      }

      // 標題禁止空白格與指定符號
      replace.title = replace.title.replace(/[\s,\/\\]+/g, '');

      if (replace.parentTitles.length > 0) {
        // 子類別驗證
        const oTitle = original.parentTitles[0] ?? '';
        const rTitle = replace.parentTitles[0];
        if (!(replace.title === original.title && rTitle === oTitle)) {
          const parent = config.value.find((col: { title: string }) => col.title === rTitle);
          const children = parent.array.find((chi: { title: string }) => chi.title === replace.title);
          if (children) {
            return {
              result: false,
              message: `上層分類「${parent.title}」已存在「${children.title}」類別名稱`,
            };
          }
        }
      } else {
        // 父類別驗證
        if (replace.title !== original.title) {
          const parent = config.value.find((col: { title: string }) => col.title === replace.title);
          if (parent) {
            return {
              result: false,
              message: `上層分類已存在「${parent.title}」類別名稱`,
            };
          }
        }
      }

      const formatData = {
        array: [],
        code: replace.code,
        title: replace.title,
        seo_title: replace.seo_title,
        seo_content: replace.seo_content,
        seo_image: replace.seo_image,
        language_data: replace.language_data,
        hidden: Boolean(replace.hidden),
      };

      if (original.title.length === 0) {
        const parentIndex = config.value.findIndex((col: { title: string }) => {
          return col.title === replace.parentTitles[0];
        });
        if (parentIndex === -1) {
          // 新增父層類別
          config.value.push(formatData);
        } else {
          // 新增子層類別
          config.value[parentIndex].array.push(formatData);
        }
      } else if (replace.parentTitles.length === 0) {
        // 編輯父層類別
        const parentIndex = config.value.findIndex((col: { title: string }) => col.title === original.title);

        config.value[parentIndex] = {
          ...formatData,
          array: replace.subCollections.map(col => {
            const sub = config.value[parentIndex].array.find((item: { title: string }) => item.title === col);

            return {
              ...sub,
              array: [],
              title: col,
              code: sub ? sub.code : '',
              hidden: formatData.hidden ? true : Boolean(sub.hidden),
            };
          }),
        };
      } else {
        const oTitle = original.parentTitles[0] ?? '';
        const rTitle = replace.parentTitles[0];
        const originParentIndex = config.value.findIndex((col: { title: string }) => col.title === oTitle);
        const replaceParentIndex = config.value.findIndex((col: { title: string }) => col.title === rTitle);
        const childrenIndex = config.value[originParentIndex].array.findIndex((chi: { title: string }) => {
          return chi.title === original.title;
        });

        if (originParentIndex === replaceParentIndex) {
          // 編輯子層類別，沒有調整父層
          config.value[originParentIndex].array[childrenIndex] = formatData;
        } else {
          // 編輯子層類別，有調整父層
          config.value[originParentIndex].array.splice(childrenIndex, 1);
          config.value[replaceParentIndex].array.push(formatData);
        }
      }

      // 更新父層的子類別
      if (original.parentTitles[0]) {
        const filter_childrens = original.subCollections.filter(child => {
          return replace.subCollections.findIndex(child2 => child2 === child) === -1;
        });
        await this.deleteCollectionProduct(original.title, filter_childrens);
      }

      // 類別刪除產品
      if (original.title.length > 0) {
        const delete_id_list = (original.product_id ?? []).filter(oid => {
          return (replace.product_id ?? []).findIndex(rid => rid === oid) === -1;
        });
        if (delete_id_list.length > 0) {
          const products_sql = `SELECT *
                                FROM \`${this.app}\`.t_manager_post
                                WHERE id in (${delete_id_list.join(',')});`;
          const delete_product_list = await db.query(products_sql, []);
          for (const product of delete_product_list) {
            product.content.collection = product.content.collection.filter((str: string) => {
              if (original.parentTitles[0]) {
                return str !== `${original.parentTitles[0]} / ${original.title}`;
              } else {
                return !(str.includes(`${original.title} /`) || str === `${original.title}`);
              }
            });
            await this.updateProductCollection(product.content, product.id);
          }
        }
      }

      // 更新類別下商品
      for (const id of replace.product_id ?? []) {
        const get_product = await db.query(
          `SELECT *
           FROM \`${this.app}\`.t_manager_post
           WHERE id = ?
          `,
          [id]
        );

        if (get_product[0]) {
          const product = get_product[0];
          const originalParentTitles = original.parentTitles[0] ?? '';
          const replaceParentTitles = replace.parentTitles[0] ?? '';

          if (original.title.length > 0) {
            product.content.collection = product.content.collection
              .filter((str: string) => {
                if (originalParentTitles === replaceParentTitles) {
                  return true;
                }
                if (replaceParentTitles) {
                  if (str === originalParentTitles || str.includes(`${originalParentTitles} / ${original.title}`)) {
                    return false;
                  }
                } else {
                  if (str === original.title || str.includes(`${original.title} /`)) {
                    return false;
                  }
                }
                return true;
              })
              .map((str: string) => {
                if (replaceParentTitles) {
                  if (str.includes(`${originalParentTitles} / ${original.title}`)) {
                    return str.replace(original.title, replace.title);
                  }
                } else {
                  if (str === original.title || str.includes(`${original.title} /`)) {
                    return str.replace(original.title, replace.title);
                  }
                }
                return str;
              });
          }

          if (replaceParentTitles === '') {
            product.content.collection.push(replace.title);
          } else {
            product.content.collection.push(replaceParentTitles);
            product.content.collection.push(`${replaceParentTitles} / ${replace.title}`);
          }

          product.content.collection = [...new Set(product.content.collection)];

          await this.updateProductCollection(product.content, product.id);
        }
      }

      // 更新商品類別 config
      await db.execute(
        `UPDATE \`${this.app}\`.public_config
         SET value = ?
         WHERE \`key\` = 'collection';
        `,
        [config.value]
      );

      return { result: true };
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'putCollection Error:' + e, null);
    }
  }

  async sortCollection(data: Collection[]) {
    try {
      if (data && data[0]) {
        const parentTitle = data[0].parentTitles[0] ?? '';
        const config =
          (
            await db.query(
              `SELECT *
               FROM \`${this.app}\`.public_config
               WHERE \`key\` = 'collection';`,
              []
            )
          )[0] ?? {};
        config.value = config.value || [];

        if (parentTitle === '') {
          config.value = data.map(item => {
            return config.value.find((conf: { title: string }) => conf.title === item.title);
          });
        } else {
          const index = config.value.findIndex((conf: { title: string }) => conf.title === parentTitle);

          const sortList = data.map(item => {
            if (index > -1) {
              return config.value[index].array.find((conf: { title: string }) => conf.title === item.title);
            }
            return { title: '', array: [], code: '' };
          });

          config.value[index].array = sortList;
        }

        await db.execute(
          `UPDATE \`${this.app}\`.public_config
           SET value = ?
           WHERE \`key\` = 'collection';
          `,
          [config.value]
        );
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'sortCollection Error:' + e, null);
    }
  }

  checkVariantDataType(variants: any[]) {
    const propertiesToParse = ['stock', 'product_id', 'sale_price', 'compare_price', 'shipment_weight'];

    variants.forEach(variant => {
      propertiesToParse.forEach(prop => {
        if (variant[prop] != null) {
          // 檢查屬性是否存在且不為 null 或 undefined
          variant[prop] = parseInt(variant[prop], 10);
        }
      });
    });
  }

  async postProduct(content: any) {
    content.seo = content.seo ?? {};
    content.seo.domain = content.seo.domain || content.title;
    const language = await App.getSupportLanguage(this.app);
    for (const b of language) {
      const find_conflict = await db.query(
        `select count(1)
         from \`${this.app}\`.\`t_manager_post\`
         where content ->>'$.language_data."${b}".seo.domain'='${decodeURIComponent(content.language_data[b].seo.domain)}'
        `,
        []
      );
      if (find_conflict[0]['count(1)'] > 0) {
        throw exception.BadRequestError('BAD_REQUEST', 'DOMAIN ALREADY EXISTS:', {
          message: '網域已被使用',
          code: '733',
        });
      }
    }
    try {
      content.type = 'product';
      this.checkVariantDataType(content.variants);
      const data = await db.query(
        `INSERT INTO \`${this.app}\`.\`t_manager_post\`
         SET ?
        `,
        [
          {
            userID: this.token?.userID,
            content: JSON.stringify(content),
          },
        ]
      );
      content.id = data.insertId;
      await db.query(
        `update \`${this.app}\`.\`t_manager_post\`
         SET ?
         where id = ?
        `,
        [
          {
            content: JSON.stringify(content),
          },
          content.id,
        ]
      );
      await new Shopping(this.app, this.token).postVariantsAndPriceValue(content);

      // 重新設置管理員標籤
      await Promise.all([
        this.setProductCustomizeTagConifg(content.product_customize_tag ?? []),
        this.setProductGeneralTagConifg(content.product_tag?.language ?? []),
      ]);

      return data.insertId;
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'postProduct Error:' + e, null);
    }
  }

  async removeLogisticGroup(group_key: string) {
    try {
      const getProducts = await db.query(
        `SELECT * FROM \`${this.app}\`.t_manager_post 
         WHERE JSON_CONTAINS(JSON_EXTRACT(content, '$.designated_logistics.group'), JSON_QUOTE(?))`,
        [group_key]
      );

      const chunk = 10;
      const chunkLength = Math.ceil(getProducts.length / chunk);

      for (let i = 0; i < chunkLength; i++) {
        const promisesArray = getProducts.slice(i * chunk, (i + 1) * chunk);

        setTimeout(async () => {
          await Promise.all(
            promisesArray.map(async (product: any) => {
              product.content.designated_logistics.group = product.content.designated_logistics.group.filter(
                (item: string) => {
                  return item !== group_key;
                }
              );

              if (product.content.designated_logistics.group.length === 0) {
                delete product.content.designated_logistics.group;
                product.content.designated_logistics.type = 'all';
              }

              // 更新商品
              await db.query(`UPDATE \`${this.app}\`.\`t_manager_post\` SET ? WHERE id = ?`, [
                {
                  content: JSON.stringify(product.content),
                },
                product.id,
              ]);
            })
          );
        }, 200);
      }

      return true;
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'removeLogisticGroup Error:' + e, null);
    }
  }

  async updateCollectionFromUpdateProduct(collection: string[]) {
    collection = Array.from(
      new Set(
        collection.map(dd => {
          return dd.replace(/\s*\/\s*/g, '/');
        })
      )
    );
    //有新類別要處理
    let config =
      (
        await db.query(
          `SELECT *
           FROM \`${this.app}\`.public_config
           WHERE \`key\` = 'collection';`,
          []
        )
      )[0] ?? {};
    config.value = config.value || [];

    function findRepeatCollection(data: any, fatherTitle: string = '') {
      let returnArray = [`${fatherTitle ? `${fatherTitle}/` : ``}${data.title}`];
      let t = [1, 2, 3];
      if (data.array && data.array.length > 0) {
        data.array.forEach((item: any) => {
          returnArray.push(...findRepeatCollection(item, data.title));
        });
      }
      return returnArray;
    }

    let stillCollection: any[] = [];
    config.value.forEach((collection: any) => {
      stillCollection.push(...findRepeatCollection(collection));
    });
    const nonCommonElements = collection.filter((item: string) => !stillCollection.includes(item));
    type CategoryNode = {
      title: string;
      array: CategoryNode[];
    };

    function addCategory(nodes: CategoryNode[], levels: string[]): void {
      if (levels.length === 0) return;
      const title = levels[0];
      let node = nodes.find(n => n.title === title);
      if (!node) {
        node = { title, array: [] };
        nodes.push(node);
      }
      if (levels.length > 1) {
        addCategory(node.array, levels.slice(1));
      }
    }

    function buildCategoryTree(categories: string[]): CategoryNode[] {
      const root: CategoryNode[] = [];
      categories.forEach(category => {
        const levels = category.split('/');
        addCategory(root, levels);
      });
      return root;
    }

    const categoryTree = buildCategoryTree(nonCommonElements);

    config.value.push(...categoryTree);
    // 更新商品類別 config
    const update_col_sql = `UPDATE \`${this.app}\`.public_config
                            SET value = ?
                            WHERE \`key\` = 'collection';`;
    await db.execute(update_col_sql, [config.value]);
  }

  async postMulProduct(content: any) {
    try {
      const store_info = await new User(this.app).getConfigV2({
        key: 'store-information',
        user_id: 'manager',
      });

      if (content.collection.length > 0) {
        //有新類別要處理
        await this.updateCollectionFromUpdateProduct(content.collection);
      }

      let productArray: any = content.data;
      await Promise.all(
        productArray.map((product: any, index: number) => {
          return new Promise(async resolve => {
            product.type = 'product';
            //判斷是更新時
            if (product.id) {
              const og_data = (
                await db.query(
                  `select *
                   from \`${this.app}\`.\`t_manager_post\`
                   where id = ?`,
                  [product.id]
                )
              )[0];

              if (og_data) {
                delete product['content'];
                delete product['preview_image'];
                const og_content = og_data['content'];

                if (og_content.language_data && og_content.language_data[store_info.language_setting.def]) {
                  og_content.language_data[store_info.language_setting.def].seo = product.seo;
                  og_content.language_data[store_info.language_setting.def].title = product.title;
                  og_content.language_data[store_info.language_setting.def].sub_title = product.sub_title;
                }

                product = {
                  ...og_content,
                  ...product,
                };
                product.preview_image = og_data['content'].preview_image || [];
                productArray[index] = product;
              } else {
                console.error('Product id not exist:', product.title);
              }
            } else {
              console.error('Product has not id:', product.title);
            }
            resolve(true);
          });
        })
      );

      async function getNextId(app: string): Promise<number> {
        const query = `SELECT MAX(id) AS max_id FROM \`${app}\`.t_manager_post`;

        try {
          const result = await db.query(query, []);
          const maxId = result?.[0]?.max_id ?? 0; // 安全取得 max_id，若不存在則預設為 0
          return maxId + 1;
        } catch (error) {
          console.error('取得最大 ID 時發生錯誤:', error);
          return 1; // 若發生錯誤，回傳預設 ID = 1
        }
      }

      function entriesProductsTag(products: any) {
        const tempTags: any = {
          general: {}, // 商品標籤（包含語言）
          customize: [], // 管理員標籤
        };

        try {
          products.map((product: any) => {
            if (product.product_tag.language) {
              Object.entries(product.product_tag.language).map(tag => {
                tempTags.general[tag[0]] = (tempTags.general[tag[0]] ?? []).concat(tag[1]);
              });
            }

            if (Array.isArray(product.product_customize_tag)) {
              product.product_customize_tag.map((tag: string) => {
                tempTags.customize = tempTags.customize.concat(tag);
              });
            }
          });

          Object.keys(tempTags.general).map(key => {
            tempTags.general[key] = [...new Set(tempTags.general[key])];
          });

          tempTags.customize = [...new Set(tempTags.customize)];

          return tempTags;
        } catch (error) {
          console.error(error);
          return tempTags;
        }
      }

      let max_id = await getNextId(this.app);

      productArray.map((product: any) => {
        if (!product.id) {
          product.id = max_id++;
        }
        product.type = 'product';
        this.checkVariantDataType(product.variants);
        return [product.id || null, this.token?.userID, JSON.stringify(product)];
      });

      if (productArray.length) {
        // 重新設置管理員標籤
        const tempTags: any = entriesProductsTag(productArray);
        await Promise.all([
          this.setProductCustomizeTagConifg(tempTags.customize),
          this.setProductGeneralTagConifg(tempTags.general),
        ]);

        const data = await db.query(
          `REPLACE
          INTO \`${this.app}\`.\`t_manager_post\` (id,userID,content) values ?
          `,
          [
            productArray.map((product: any) => {
              if (!product.id) {
                product.id = max_id++;
              }
              product.type = 'product';
              this.checkVariantDataType(product.variants);
              return [product.id || null, this.token?.userID, JSON.stringify(product)];
            }),
          ]
        );
        let insertIDStart = data.insertId;
        await new Shopping(this.app, this.token).promisesProducts(productArray, insertIDStart);
        return insertIDStart;
      } else {
        return -1;
      }
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'postMulProduct Error:' + e, null);
    }
  }

  async promisesProducts(productArray: any, insertIDStart: any) {
    const promises = productArray.map((product: any) => {
      product.id = product.id || insertIDStart++;
      return new Shopping(this.app, this.token).postVariantsAndPriceValue(product);
    });

    const chunk = 10;
    const chunkLength = Math.ceil(promises.length / chunk);

    for (let i = 0; i < chunkLength; i++) {
      const promisesArray = promises.slice(i * chunk, (i + 1) * chunk);
      setTimeout(async () => {
        await Promise.all(promisesArray);
      }, 200);
    }
  }

  async putProduct(content: any) {
    try {
      // 初始化資料
      const updater_id = `${content.token.userID}`;
      delete content.token;
      content.type = 'product';

      // 檢查 seo domain 是否重複
      if (content.language_data) {
        const language = await App.getSupportLanguage(this.app);
        for (const b of language) {
          const find_conflict = await db.query(
            `SELECT count(1)
             FROM \`${this.app}\`.t_manager_post
             WHERE content ->>'$.language_data."${b}".seo.domain'='${decodeURIComponent(content.language_data[b].seo.domain)}'
               AND id != ${content.id}`,
            []
          );
          if (find_conflict[0]['count(1)'] > 0) {
            throw exception.BadRequestError('BAD_REQUEST', 'DOMAIN ALREADY EXISTS:', {
              message: '網域已被使用',
              code: '733',
            });
          }
        }
      }

      // 檢查 Variant 資料屬性
      this.checkVariantDataType(content.variants);

      // 重新設置管理員標籤
      await Promise.all([
        this.setProductCustomizeTagConifg(content.product_customize_tag ?? []),
        this.setProductGeneralTagConifg(content.product_tag?.language ?? []),
      ]);

      // const diffRecord = new DiffRecord(this.app, this.token);
      // await diffRecord.postProdcutRecord(updater_id, content.id, content);

      // 更新商品
      await db.query(
        `UPDATE \`${this.app}\`.\`t_manager_post\` SET ? WHERE id = ?
        `,
        [
          {
            content: JSON.stringify(content),
          },
          content.id,
        ]
      );

      // 更新商品 Variant
      await new Shopping(this.app, this.token).postVariantsAndPriceValue(content);

      // 同步更新蝦皮
      if (content.shopee_id) {
        await new Shopee(this.app, this.token).asyncStockToShopee({
          product: { content },
          callback: () => {},
        });
      }

      return content.insertId;
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'putProduct Error:' + e, null);
    }
  }

  async deleteCollection(dataArray: Collection[]) {
    try {
      const config = (
        await db.query(
          `SELECT *
           FROM \`${this.app}\`.public_config
           WHERE \`key\` = 'collection';`,
          []
        )
      )[0];
      const deleteList: { parent: number; child: number[] }[] = [];

      // format 刪除類別 index
      dataArray.map(data => {
        const parentTitles = data.parentTitles[0] ?? '';
        if (parentTitles.length > 0) {
          // data 為子層
          const parentIndex = config.value.findIndex((col: { title: string }) => col.title === parentTitles);
          const childrenIndex = config.value[parentIndex].array.findIndex(
            (col: { title: string }) => col.title === data.title
          );
          const n = deleteList.findIndex(obj => obj.parent === parentIndex);
          if (n === -1) {
            deleteList.push({ parent: parentIndex, child: [childrenIndex] });
          } else {
            deleteList[n].child.push(childrenIndex);
          }
        } else {
          // data 為父層
          const parentIndex = config.value.findIndex((col: { title: string }) => col.title === data.title);
          deleteList.push({ parent: parentIndex, child: [-1] });
        }
      });

      // 刪除類別之產品
      for (const d of deleteList) {
        const collection = config.value[d.parent];
        for (const index of d.child) {
          if (index !== -1) {
            await this.deleteCollectionProduct(collection.title, [`${collection.array[index].title}`]);
          }
        }
        if (d.child[0] === -1) {
          await this.deleteCollectionProduct(collection.title);
        }
      }

      // 取得新的類別 config 陣列
      deleteList.map(obj => {
        config.value[obj.parent].array = config.value[obj.parent].array.filter((col: any, index: number) => {
          return !obj.child.includes(index);
        });
      });
      config.value = config.value.filter((col: any, index: number) => {
        const find_collection = deleteList.find(obj => obj.parent === index);
        return !(find_collection && find_collection.child[0] === -1);
      });

      // 更新商品類別
      const update_col_sql = `UPDATE \`${this.app}\`.public_config
                              SET value = ?
                              WHERE \`key\` = 'collection';`;
      await db.execute(update_col_sql, [config.value]);

      return { result: true };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e, null);
    }
  }

  async deleteCollectionProduct(parent_name: string, children_list?: string[]) {
    try {
      if (children_list) {
        for (const children of children_list) {
          const tag_name = `${parent_name} / ${children}`;
          for (const product of await db.query(this.containsTagSQL(tag_name), [])) {
            product.content.collection = product.content.collection.filter((str: string) => str != tag_name);
            await this.updateProductCollection(product.content, product.id);
          }
        }
      } else {
        for (const product of await db.query(this.containsTagSQL(parent_name), [])) {
          product.content.collection = product.content.collection.filter((str: string) => !(str === parent_name));
          await this.updateProductCollection(product.content, product.id);
        }
        for (const product of await db.query(this.containsTagSQL(`${parent_name} /`), [])) {
          product.content.collection = product.content.collection.filter((str: string) =>
            str.includes(`${parent_name} / `)
          );
          await this.updateProductCollection(product.content, product.id);
        }
      }
      return { result: true };
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'deleteCollectionProduct Error:' + e, null);
    }
  }

  containsTagSQL(name: string) {
    return `SELECT *
            FROM \`${this.app}\`.t_manager_post
            WHERE JSON_CONTAINS(content ->> '$.collection', '"${name}"');`;
  }

  checkDuring(jsonData: { startDate: string; startTime: string; endDate?: string; endTime?: string }): boolean {
    const now = new Date().getTime();

    const startDateTime = new Date(
      moment.tz(`${jsonData.startDate} ${jsonData.startTime}:00`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Taipei').toISOString()
    ).getTime();
    if (isNaN(startDateTime)) return false;

    if (!jsonData.endDate || !jsonData.endTime) return true;

    const endDateTime = new Date(
      moment.tz(`${jsonData.endDate} ${jsonData.endTime}:00`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Taipei').toISOString()
    ).getTime();
    if (isNaN(endDateTime)) return false;

    return now >= startDateTime && now <= endDateTime;
  }

  static isComeStore(checkout: any, qData: any) {
    try {
      return checkout.pos_info.where_store === qData.come_from;
    } catch (error) {
      return false;
    }
  }

  async updateProductCollection(content: string[], id: number) {
    try {
      const updateProdSQL = `UPDATE \`${this.app}\`.t_manager_post
                             SET content = ?
                             WHERE \`id\` = ?;`;
      await db.execute(updateProdSQL, [content, id]);
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'updateProductCollection Error:' + e, null);
    }
  }

  async getProductVariants(id_list: string) {
    try {
      const data = await this.querySqlByVariants([`(v.id in (${id_list}))`], { page: 0, limit: 999 });
      return data;
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'getProductVariants Error:' + e, null);
    }
  }

  async getVariants(query: {
    page: number;
    limit: number;
    search?: string;
    searchType?: string;
    id?: string;
    collection?: string;
    accurate_search_collection?: boolean;
    status?: string;
    id_list?: string;
    order_by?: string;
    min_price?: string;
    max_price?: string;
    stockCount?: string;
    productType?: string;
  }) {
    try {
      let querySql = ['1=1'];
      if (query.search) {
        switch (query.searchType) {
          case 'title':
            querySql.push(`v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(p.content, '$.title'))) LIKE UPPER('%${query.search}%')))`);
            break;
          case 'sku':
            querySql.push(`(UPPER(JSON_EXTRACT(v.content, '$.sku')) LIKE UPPER('%${query.search}%'))`);
            break;
          case 'barcode':
            querySql.push(`(UPPER(JSON_EXTRACT(v.content, '$.barcode')) LIKE UPPER('%${query.search}%'))`);
            break;
        }
      }

      query.id && querySql.push(`(v.id = ${query.id})`);
      if (query.id_list) {
        if (query.id_list?.includes('-')) {
          querySql.push(
            `(v.product_id in (${query.id_list.split(',').map(dd => {
              return dd.split('-')[0];
            })}))`
          );
        } else {
          querySql.push(`(v.id in (${query.id_list}))`);
        }
      }

      query.collection &&
        querySql.push(
          `(${query.collection
            .split(',')
            .map(dd => {
              return query.accurate_search_collection
                ? `
                        v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (JSON_CONTAINS(p.content->'$.collection', '"${dd}"')))
                        
                        `
                : `
                         v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (JSON_EXTRACT(p.content, '$.collection') LIKE '%${dd}%'))
                        `;
            })
            .join(' or ')})`
        );
      query.status &&
        querySql.push(`
             v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (JSON_EXTRACT(p.content, '$.status') = '${query.status}'))
            `);
      query.min_price && querySql.push(`(v.content->>'$.sale_price' >= ${query.min_price})`);
      query.max_price && querySql.push(`(v.content->>'$.sale_price' <= ${query.min_price})`);

      //判斷有帶入商品類型時，顯示商品類型，反之預設折是一班商品
      if (query.productType !== 'all') {
        const queryOR = [];
        if (query.productType) {
          query.productType.split(',').map(dd => {
            if (dd === 'hidden') {
              queryOR.push(` v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (p.content->>'$.visible' = "false"))`);
            } else {
              queryOR.push(`v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (p.content->>'$.productType.${dd}' = "true"))`);
            }
          });
        } else if (!query.id) {
          queryOR.push(`v.product_id in (select p.id
                                            from \`${this.app}\`.t_manager_post as p where (p.content->>'$.productType.product' = "true"))`);
        }
        querySql.push(
          `(${queryOR
            .map(dd => {
              return ` ${dd} `;
            })
            .join(' or ')})`
        );
      }

      if (query.stockCount) {
        const stockCount = query.stockCount?.split(',');
        switch (stockCount[0]) {
          case 'lessThan':
            querySql.push(`(cast(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) < ${stockCount[1]})`);
            break;
          case 'moreThan':
            querySql.push(`(cast(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) > ${stockCount[1]})`);
            break;
          case 'lessSafe':
            querySql.push(`(
              JSON_EXTRACT(v.content, '$.save_stock') is not null AND
              (cast(JSON_EXTRACT(v.content, '$.stock') AS SIGNED) - cast(JSON_EXTRACT(v.content, '$.save_stock') AS SIGNED) < ${stockCount[1]})
            )`);
            break;
        }
      }

      query.order_by = (() => {
        switch (query.order_by) {
          case 'max_price':
            return `order by v->>'$.content.sale_price' desc`;
          case 'min_price':
            return `order by v->>'$.content.sale_price' asc`;
          case 'stock_desc':
            return `order by stock desc`;
          case 'stock_asc':
            return `order by stock`;
          case 'default':
          default:
            return `order by id desc`;
        }
      })();
      const userClass = new User(this.app);
      const store_config = await userClass.getConfigV2({
        key: 'store_manager',
        user_id: 'manager',
      });
      const data = await this.querySqlByVariants(querySql, query);
      if (query.id_list) {
        //過濾出需要的商品規格
        if (query.id_list?.includes('-')) {
          data.data = data.data.filter((dd: any) => {
            return query.id_list?.split(',').find(d1 => {
              return d1 === `${dd.product_id}-${dd.variant_content.spec.join('-')}`;
            });
          });
        }
      }
      const shopee_data_list: { id: string; data: any }[] = [];
      await Promise.all(
        data.data.map((v_c: any) => {
          const product = v_c['product_content'];
          return new Promise(async (resolve, reject) => {
            if (product) {
              let totalSale = 0;
              const content = product;
              if (content.shopee_id) {
                let shopee_dd: any = shopee_data_list.find(dd => {
                  return dd.id === content.shopee_id;
                });
                if (!shopee_dd) {
                  shopee_dd = {
                    id: content.shopee_id,
                    data: await new Shopee(this.app, this.token).getProductDetail(content.shopee_id, {
                      skip_image_load: true,
                    }),
                  };
                  shopee_data_list.push(shopee_dd);
                }
                const shopee_data = shopee_dd.data;
                if (shopee_data && shopee_data.variants) {
                  const variant = v_c['variant_content'];
                  const shopee_variants = shopee_data.variants.find((dd: any) => {
                    return dd.spec.join('') === variant.spec.join('');
                  });
                  if (shopee_variants) {
                    variant.stock = shopee_variants.stock;
                    variant.stockList = {};
                    variant.stockList[store_config.list[0].id] = { count: variant.stock };
                  }
                  const p_ind = product.variants.findIndex((dd: any) => {
                    return dd.spec.join('') === variant.spec.join('');
                  });
                  product.variants[p_ind] = variant;
                  v_c['stockList'] = v_c['variant_content']['stockList'];
                }
              }
              product.total_sales = totalSale;
            }
            resolve(true);
          });
        })
      );
      return data;
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getVariants Error:' + e, null);
    }
  }

  async getDomain(query: { id?: string; search?: string; domain?: string }) {
    try {
      let querySql = [`(content->>'$.type'='product')`];

      if (query.search) {
        querySql.push(
          `(${[
            `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`,
            `JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`,
            `JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`,
            `JSON_EXTRACT(content, '$.product_customize_tag') LIKE '%${query.search}%'`,
          ].join(' or ')})`
        );
      }
      if (query.domain) {
        querySql.push(`content->>'$.seo.domain'='${decodeURIComponent(query.domain)}'`);
      }
      if (`${query.id || ''}`) {
        if (`${query.id}`.includes(',')) {
          querySql.push(`id in (${query.id})`);
        } else {
          querySql.push(`id = ${query.id}`);
        }
      }

      const data = await this.querySqlBySEO(querySql, {
        limit: 10000,
        page: 0,
        ...query,
      });
      return data;
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getVariants Error:' + e, null);
    }
  }

  async putVariants(token: any, query: any) {
    try {
      // const diffRecord = new DiffRecord(this.app, this.token);

      for (const data of query) {
        // await diffRecord.postProdcutVariantRecord(token.userID, data.id, data.variant_content);

        await db.query(
          `UPDATE \`${this.app}\`.t_variants
           SET ?
           WHERE id = ?`,
          [{ content: JSON.stringify(data.variant_content) }, data.id]
        );

        let variants = (
          await db.query(
            `SELECT *
             FROM \`${this.app}\`.t_variants
             WHERE product_id = ?`,
            [data.product_id]
          )
        ).map((dd: any) => {
          return dd.content;
        });
        data.product_content.variants = variants;
        await db.query(
          `UPDATE \`${this.app}\`.t_manager_post
           SET ?
           WHERE id = ?`,
          [{ content: JSON.stringify(data.product_content) }, data.product_id]
        );
      }
      return {
        result: 'success',
        orderData: query,
      };
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'putVariants Error:' + e, null);
    }
  }

  async postCustomerInvoice(obj: { orderID: any; orderData: any }) {
    await this.putOrder({
      id: obj.orderData.id,
      orderData: obj.orderData.orderData,
      status: obj.orderData.status,
    });
    const invoice_response = await new Invoice(this.app).postCheckoutInvoice(obj.orderID, false);

    return {
      result: invoice_response,
    };
  }

  async batchPostCustomerInvoice(dataArray: InvoiceData[]) {
    let result: any = [];
    const chunk = 10;
    const chunksCount = Math.ceil(dataArray.length / chunk);

    for (let i = 0; i < chunksCount; i++) {
      const arr = dataArray.slice(i * chunk, (i + 1) * chunk);
      const res = await Promise.all(
        arr.map(item => {
          return this.postCustomerInvoice(item);
        })
      );
      result = result.concat(res);
    }

    return result;
  }

  async voidInvoice(obj: { invoice_no: string; reason: string; createDate: string }) {
    const config = await app.getAdConfig(this.app, 'invoice_setting');
    const passData = {
      MerchantID: config.merchNO,
      InvoiceNo: obj.invoice_no,
      InvoiceDate: obj.createDate,
      Reason: obj.reason,
    };
    let dbData = await db.query(
      `SELECT *
       FROM \`${this.app}\`.t_invoice_memory
       WHERE invoice_no = ?`,
      [obj.invoice_no]
    );
    dbData = dbData[0];
    dbData.invoice_data.remark = dbData.invoice_data?.remark ?? {};
    dbData.invoice_data.remark.voidReason = obj.reason;
    await EcInvoice.voidInvoice({
      hashKey: config.hashkey,
      hash_IV: config.hashiv,
      merchNO: config.merchNO,
      app_name: this.app,
      invoice_data: passData,
      beta: config.point === 'beta',
    });
    await db.query(
      `UPDATE \`${this.app}\`.t_invoice_memory
       SET ?
       WHERE invoice_no = ?`,
      [{ status: 2, invoice_data: JSON.stringify(dbData.invoice_data) }, obj.invoice_no]
    );
  }

  async allowanceInvoice(obj: InvoiceData) {
    const config = await app.getAdConfig(this.app, 'invoice_setting');
    let invoiceData = await db.query(
      `
          SELECT *
          FROM \`${this.app}\`.t_invoice_memory
          WHERE invoice_no = "${obj.invoiceID}"
      `,
      []
    );
    invoiceData = invoiceData[0];
    const passData = {
      MerchantID: config.merchNO,
      InvoiceNo: obj.invoiceID,
      InvoiceDate: invoiceData.invoice_data.response.InvoiceDate.split('+')[0],
      AllowanceNotify: 'E',
      CustomerName: invoiceData.invoice_data.original_data.CustomerName,
      NotifyPhone: invoiceData.invoice_data.original_data.CustomerPhone,
      NotifyMail: invoiceData.invoice_data.original_data.CustomerEmail,
      AllowanceAmount: obj.allowanceInvoiceTotalAmount,
      Items: obj.allowanceData.invoiceArray,
    };
    return await EcInvoice.allowanceInvoice({
      hashKey: config.hashkey,
      hash_IV: config.hashiv,
      merchNO: config.merchNO,
      app_name: this.app,
      allowance_data: passData,
      beta: config.point === 'beta',
      db_data: obj.allowanceData,
      order_id: obj.orderID,
    });
  }

  async voidAllowance(obj: { invoiceNo: string; allowanceNo: string; voidReason: string }) {
    const config = await app.getAdConfig(this.app, 'invoice_setting');
    const passData = {
      MerchantID: config.merchNO,
      InvoiceNo: obj.invoiceNo,
      AllowanceNo: obj.allowanceNo,
      Reason: obj.voidReason,
    };
    await EcInvoice.voidAllowance({
      hashKey: config.hashkey,
      hash_IV: config.hashiv,
      merchNO: config.merchNO,
      app_name: this.app,
      allowance_data: passData,
      beta: config.point === 'beta',
    });
  }

  static async currencyCovert(base: string) {
    const data: any = (
      await db.query(
        `SELECT *
         FROM ${saasConfig.SAAS_NAME}.currency_config
         order by id desc limit 0,1;`,
        []
      )
    )[0]['json']['rates'];
    const base_m = data[base];
    Object.keys(data).map(dd => {
      data[dd] = data[dd] / base_m;
    });
    return data;
  }

  async getProductComment(product_id: number) {
    try {
      const comments = await db.query(
        `SELECT *
         FROM \`${this.app}\`.t_product_comment
         WHERE product_id = ?;
        `,
        [product_id]
      );
      if (comments.length === 0) {
        return [];
      }
      return comments.map((item: any) => item.content);
    } catch (error) {
      console.error(error);
      throw exception.BadRequestError('BAD_REQUEST', 'getProductComment Error:' + error, null);
    }
  }

  async postProductComment(data: { product_id: number; rate: number; title: string; comment: string }) {
    try {
      if (!this.token) {
        throw new Error('User not authenticated.');
      }

      const { product_id, rate, title, comment } = data;
      const today = new Date().toISOString().split('T')[0]; // 直接使用 ISO 格式 (yyyy-mm-dd)

      const userClass = new User(this.app);
      const userData = await userClass.getUserData(`${this.token.userID}`, 'userID');

      const content = {
        userID: this.token.userID,
        userName: userData.userData.name,
        date: today,
        rate,
        title,
        comment,
      };
      // 嘗試更新評論，若無評論則插入
      const updateResult = await db.query(
        `delete
         from \`${this.app}\`.t_product_comment
         WHERE product_id = ${product_id}
           AND content ->>'$.userID'=${this.token.userID}
           and id
             >0`,
        []
      );

      await db.execute(
        `INSERT INTO \`${this.app}\`.t_product_comment (product_id, content)
         VALUES (?, ?)`,
        [product_id, JSON.stringify(content)]
      );

      await this.updateProductAvgRate(product_id);

      return true;
    } catch (error) {
      console.error(`Error posting product comment:`, error);
      throw exception.BadRequestError('BAD_REQUEST', `postProductComment Error: ${error}`, null);
    }
  }

  async updateProductAvgRate(product_id: number) {
    try {
      // 直接更新產品平均評分，減少 DB 查詢次數
      const [result] = await db.query(
        `SELECT COALESCE(ROUND(AVG(JSON_EXTRACT(content, '$.rate')), 1), 0) AS avgRate
         FROM \`${this.app}\`.t_product_comment
         WHERE product_id = ?`,
        [product_id]
      );

      const avg_rate = result?.avgRate ?? 0;

      // 直接更新 avg_rate，避免讀取整個 product.content 再寫回
      const updateResult = await db.execute(
        `UPDATE \`${this.app}\`.t_manager_post
         SET content = JSON_SET(content, '$.avg_rate', ?)
         WHERE id = ?`,
        [avg_rate, product_id]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error(`Product with ID ${product_id} not found.`);
      }

      return { product_id, avg_rate };
    } catch (error) {
      console.error(`Error updating average rate for product ID ${product_id}:`, error);
      throw exception.BadRequestError('BAD_REQUEST', `updateProductAvgRate Error: ${error}`, null);
    }
  }
}

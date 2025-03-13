import { IToken } from '../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import e from 'express';
import moment from 'moment';
import axios from 'axios';
import app from '../../app';
import redis from '../../modules/redis.js';
import Tool from '../../modules/tool.js';
import FinancialService, { LinePay, PayNow, PayPal, JKO, EcPay } from './financial-service.js';
import { Private_config } from '../../services/private_config.js';
import { User } from './user.js';
import { Invoice } from './invoice.js';
import { Rebate } from './rebate.js';
import { CustomCode } from '../services/custom-code.js';
import { ManagerNotify } from './notify.js';
import { AutoSendEmail } from './auto-send-email.js';
import { Recommend } from './recommend.js';
import { DeliveryData } from './delivery.js';
import { saasConfig } from '../../config.js';
import { SMS } from './sms.js';
import { LineMessage } from './line-message';
import { EcInvoice } from './EcInvoice';
import { onlinePayArray, paymentInterface } from '../models/glitter-finance.js';
import { App } from '../../services/app.js';
import { Stock } from './stock';
import { OrderEvent } from './order-event.js';
import { SeoConfig } from '../../seo-config.js';
import { sendmail } from '../../services/ses.js';
import { Shopee } from './shopee';
import { ShipmentConfig as Shipment_support_config } from '../config/shipment-config.js';
import { PayNowLogistics } from './paynow-logistics.js';
import { CheckoutService } from './checkout.js';

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

export interface VoucherData {
  id: number;
  title: string;
  code?: string;
  method: 'percent' | 'fixed';
  reBackType: 'rebate' | 'discount' | 'shipment_free' | 'add_on_items' | 'giveaway';
  add_on_products?: string[] | ProductItem[];
  trigger: 'auto' | 'code' | 'distribution';
  value: string;
  for: 'collection' | 'product' | 'all';
  rule: 'min_price' | 'min_count';
  productOffStart: 'price_asc' | 'price_desc' | 'price_all';
  conditionType: 'order' | 'item';
  counting: 'each' | 'single';
  forKey: string[];
  ruleValue: number;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  status: 0 | 1 | -1;
  type: 'voucher';
  overlay: boolean;
  bind: BindItem[];
  bind_subtotal: number;
  times: number;
  start_ISO_Date: string;
  end_ISO_Date: string;
  discount_total: number;
  rebate_total: number;
  target: string;
  targetList: string[];
  device: ('normal' | 'pos')[];
}

interface ShipmentConfig {
  volume: { key: string; value: string }[];
  weight: { key: string; value: string }[];
  selectCalc: 'volume' | 'weight';
}

interface ProductItem {
  id: number;
  userID: number;
  content: any;
  created_time: Date | string;
  updated_time: Date | string;
  status: number;
  total_sales?: number;
}

interface seo {
  title: string;
  seo: {
    domain: string;
    title: string;
    content: string;
  };
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
};

type CartItem = {
  id: string;
  spec: string[];
  count: number;
  sale_price: number;
  is_gift?: boolean;
  collection: string[];
  title: string;
  preview_image: string;
  shipment_obj: { type: string; value: number };
  discount_price?: number;
  weight: number;
  rebate: number;
  designated_logistics: {
    type: 'all' | 'designated';
    list: string[];
  };
  deduction_log?: {
    [p: string]: number;
  };
  min_qty?: number;
  max_qty?: number;
  buy_history_count?: number;
  sku: string;
  stock: number;
  show_understocking: 'true' | 'false';
  is_add_on_items: CartItem | boolean;
  pre_order: boolean;
  is_hidden: boolean;
};

type MultiSaleType = 'store' | 'level' | 'tags';

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
  orderSource: '' | 'manual' | 'normal' | 'POS' | 'combine';
  code_array: string[];
  deliveryData?: DeliveryData;
  give_away: CartItem[];
  language?: string;
  pos_info?: any; //POS結帳資訊
  goodsWeight: number;
  client_ip_address: string;
  fbc: string;
  fbp: string;
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
      query.language = query.language ?? store_info.language_setting.def;
      query.show_hidden = query.show_hidden ?? 'true';

      const orderMapping: Record<string, string> = {
        title: `ORDER BY JSON_EXTRACT(content, '$.title')`,
        max_price: `ORDER BY CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.max_price')) AS SIGNED) DESC`,
        min_price: `ORDER BY CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.min_price')) AS SIGNED) ASC`,
        created_time_desc: `ORDER BY created_time DESC`,
        created_time_asc: `ORDER BY created_time ASC`,
        updated_time_desc: `ORDER BY updated_time DESC`,
        updated_time_asc: `ORDER BY updated_time ASC`,
        sales_desc: `ORDER BY content->>'$.total_sales' DESC`,
        default: `ORDER BY id DESC`,
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
          case 'title':
          default:
            querySql.push(
              `(${[
                `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`,
                `(UPPER(content->>'$.language_data."${query.language}".title') LIKE UPPER('%${query.search}%'))`,
                `UPPER(content->>'$.product_tag.language."${query.language}"') like '%${query.search}%'`,
                `JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`,
                `JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`,
              ].join(' or ')})`
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
          querySql.push(`(content->>'$.visible' is null || content->>'$.visible' = 'true')`);
        } else {
          querySql.push(`(content->>'$.visible' = 'false')`);
        }
      } else if (!query.is_manger && `${query.show_hidden}` !== 'true') {
        querySql.push(`(content->>'$.visible' is null || content->>'$.visible' = 'true')`);
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
            `SELECT * FROM \`${this.app}\`.public_config WHERE \`key\` = 'collection';
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
        query.order_by = ` ORDER BY id IN (${query.id_list})`;
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

      if (query.id_list) {
        querySql.push(`(id in (${query.id_list}))`);
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
          `SELECT content->>'$.product_id' AS product_id
           FROM \`${this.app}\`.t_post
           WHERE userID = ? 
             AND content->>'$.type' = 'wishlist'
             AND content->>'$.product_id' IN (${productIds.map(() => '?').join(',')})`,
          [userID, ...productIds]
        );

        const wishListSet = new Set(wishListData.map((row: any) => row.product_id));

        products.data = products.data.map((product: any) => {
          product.content.in_wish_list = wishListSet.has(String(product.id));
          product.content.id = product.id;
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

      if (query.id_list && query.order_by === 'order by id desc') {
        products.data = query.id_list
          .split(',')
          .map(id => {
            return products.data.find((product: { id: number }) => `${product.id}` === `${id}`);
          })
          .filter(dd => dd);
      }

      // 判斷需要多國語言，或者蝦皮庫存同步
      await Promise.all(
        products.data.map((product: any) => {
          return new Promise(async resolve => {
            if (product) {
              let totalSale = 0;
              const { language } = query;
              const { content } = product;
              content.preview_image = content.preview_image ?? [];

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
                //尋找規格販售數量
                const soldOldHistory = await db.query(
                  `
                 select \`${this.app}\`.t_products_sold_history.* from  \`${this.app}\`.t_products_sold_history
where 
product_id = ${db.escape(content.id)} and    
order_id in (select cart_token from \`${this.app}\`.t_checkout where ${count_sql})
                 `,
                  []
                );
                (content.variants || []).forEach((variant: any) => {
                  variant.spec = variant.spec || [];
                  variant.stock = 0;
                  variant.sold_out =
                    soldOldHistory
                      .filter((dd: any) => {
                        return dd.spec === variant.spec.join('-') && `${dd.product_id}` === `${content.id}`;
                      })
                      .map((dd: any) => {
                        return parseInt(dd.count, 10);
                      })
                      .reduce((a: number, b: number) => a + b, 0) || 0;
                  variant.preview_image = variant.preview_image ?? '';
                  if (!variant.preview_image.includes('https://')) {
                    variant.preview_image = undefined;
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
                  console.log(`get-shopee_data-success`);
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
        const createPriceMap = (type: MultiSaleType): Record<string, Map<string, number>> => {
          return Object.fromEntries(
            product.content.multi_sale_price
              .filter((item: any) => item.type === type)
              .map((item: any) => [item.key, new Map(item.variants.map((v: any) => [v.spec.join('-'), v.price]))])
          );
        };

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
      };

      if (Array.isArray(products.data)) {
        await Promise.all(products.data.map(processProduct));
      } else {
        await processProduct(products.data);
      }

      return products;
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
    }
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
        const startDate = new Date(voucher.start_ISO_Date).getTime();
        const endDate = voucher.end_ISO_Date ? new Date(voucher.end_ISO_Date).getTime() : Infinity;
        return startDate < now && now < endDate;
      });

    // 處理需 async and await 的驗證
    const validVouchers = await Promise.all(
      allVoucher.map(async (voucher: VoucherData) => {
        const isLimited = await this.checkVoucherLimited(userID, voucher.id);
        return isLimited && voucher.status === 1 ? voucher : null;
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
    const id = `${json.product.id}`;
    const collection = json.product.content.collection || [];
    const userData = json.userData;
    const recommendData = json.recommendData;

    function checkValidProduct(caseName: string, caseList: any[]): boolean {
      switch (caseName) {
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

    let sql = `
      SELECT * 
      FROM \`${this.app}\`.t_manager_post
      ${whereClause} 
      ${orderClause}
    `;

    const data = await db.query(`SELECT * FROM (${sql}) AS subquery LIMIT ?, ?`, [offset, Number(query.limit)]);
    if (query.id) {
      return {
        data: data[0] || {},
        result: !!data[0],
      };
    } else {
      const total = await db
        .query(`SELECT COUNT(*) as count FROM \`${this.app}\`.t_manager_post ${whereClause}`, [])
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
    const shipment_setting: any = await new Promise(async (resolve, reject) => {
      try {
        resolve(
          ((await Private_config.getConfig({
            appName: this.app,
            key: 'logistics_setting',
          })) ?? [
            {
              value: {
                support: [],
              },
            },
          ])[0].value
        );
      } catch (e) {
        resolve([]);
      }
    });
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

  async toCheckout(
    data: {
      line_items: CartItem[];
      customer_info?: any; //顧客資訊 訂單人
      email?: string;
      return_url: string;
      order_id?: string;
      user_info: any; //取貨人資訊
      code?: string;
      use_rebate?: number;
      use_wallet?: number;
      checkOutType?: 'manual' | 'auto' | 'POS';
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
      language?: 'en-US' | 'zh-CN' | 'zh-TW';
      pos_info?: any; //POS結帳資訊;
      invoice_select?: string;
      pre_order?: boolean;
      voucherList?: any;
      isExhibition?: boolean;
      client_ip_address?: string;
      fbc?: string;
      fbp?: string;
    },
    type: 'add' | 'preview' | 'manual' | 'manual-preview' | 'POS' = 'add',
    replace_order_id?: string
  ) {
    const timer = {
      count: 0,
      history: [Date.now()],
    };

    const checkPoint = (name: string) => {
      const t = Date.now();
      timer.history.push(t);

      const spendTime = t - timer.history[timer.count]; // 計算與上一個檢查點的時間差
      const totalTime = t - timer.history[0]; // 計算從開始到現在的總時間

      timer.count++;
      const n = timer.count.toString().padStart(2, '0');

      console.log(`TO-CHECKOUT-TIME-${n} [${name}] `.padEnd(40, '=') + '>', {
        totalTime,
        spendTime,
      });
    };

    try {
      checkPoint('start');
      const userClass = new User(this.app);
      const rebateClass = new Rebate(this.app);

      // 確認預設值
      data.line_items = (data.line_items || (data as any).lineItems) ?? [];
      data.isExhibition = data.checkOutType === 'POS' && (data.pos_store?.includes('exhibition_') ?? false);

      // 判斷是重新付款則取代
      if (replace_order_id) {
        const orderData = (
          await db.query(
            `SELECT * FROM \`${this.app}\`.t_checkout WHERE cart_token = ? AND status = 0;
            `,
            [replace_order_id]
          )
        )[0];

        if (!orderData) {
          throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout 1 Error: Cannot find this orderID.', null);
        }

        // 刪除指定的訂單記錄
        await db.query(
          `DELETE FROM \`${this.app}\`.t_checkout WHERE cart_token = ? AND status = 0;
          `,
          [replace_order_id]
        );

        // 提取 orderData 中的相關資訊
        const { lineItems, user_info, code, customer_info, use_rebate } = orderData.orderData;

        data.line_items = lineItems;
        data.email = orderData.email;
        data.user_info = user_info;
        data.code = code;
        data.customer_info = customer_info;
        data.use_rebate = use_rebate;
      }

      // 判斷是 POS 重新支付<例如:預購單>，則把原先商品庫存加回去
      if (data.order_id && type === 'POS') {
        const order = (
          await db.query(
            `SELECT * FROM \`${this.app}\`.t_checkout WHERE cart_token = ?
            `,
            [data.order_id]
          )
        )[0];

        if (!order) {
          throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout 1 Error: Cannot find this POS order', null);
        }

        for (const b of order.orderData.lineItems) {
          const pdDqlData = (
            await this.getProduct({
              page: 0,
              limit: 50,
              id: b.id,
              status: 'inRange',
              channel: data.checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
              whereStore: data.checkOutType === 'POS' ? data.pos_store : undefined,
            })
          ).data;

          const pd = pdDqlData.content;
          const variant = pd.variants.find((dd: any) => dd.spec.join('-') === b.spec.join('-'));

          // 更新庫存
          await updateStock(variant, b.deduction_log);

          // 更新變體資訊
          await this.updateVariantsWithSpec(variant, b.id, b.spec);

          // 更新資料庫中的商品內容
          await db.query(
            `UPDATE \`${this.app}\`.t_manager_post SET content = ? WHERE id = ?
            `,
            [JSON.stringify(pd), pdDqlData.id]
          );
        }
      }

      // 更新庫存的輔助函數
      async function updateStock(variant: any, deductionLog: any) {
        Object.keys(deductionLog).forEach(key => {
          try {
            variant.stockList[key].count += deductionLog[key];
          } catch (e) {
            console.error(`Error updating stock for variant ${variant.id}:`, e);
          }
        });
      }

      // 判斷是checkOutType 是POS則清空token，因為結帳對象不是結帳人
      if (data.checkOutType === 'POS') {
        this.token = undefined;
      }

      // 驗證使用者身份的輔助函數
      const hasAuthentication = (data: any): boolean => {
        return (
          (this.token && this.token.userID) ||
          data.email ||
          (data.user_info && data.user_info.email) ||
          (data.user_info && data.user_info.phone)
        );
      };

      // 電話信箱擇一
      if (type !== 'preview' && !hasAuthentication(data)) {
        throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout 2 Error: No email and phone', null);
      }

      const checkOutType = data.checkOutType ?? 'manual';
      const getUserDataAsync = async (
        type: string,
        token: IToken | undefined,
        data: {
          email?: string;
          user_info: { email: string; phone: string };
        }
      ) => {
        // 檢查預覽模式下的條件
        if (
          type === 'preview' &&
          !(token?.userID || (data.user_info && data.user_info.email) || (data.user_info && data.user_info.phone))
        ) {
          return {};
        }

        // 根據 token 獲取用戶數據
        if (token?.userID && type !== 'POS' && checkOutType !== 'POS') {
          return await userClass.getUserData(`${token.userID}`, 'userID');
        }

        // 否則根據 email 或電話獲取數據
        return (
          (data.user_info.email && (await userClass.getUserData(data.user_info.email, 'email_or_phone'))) ||
          (data.user_info.phone && (await userClass.getUserData(data.user_info.phone, 'email_or_phone'))) ||
          {}
        );
      };

      checkPoint('check user auth');

      // 取得顧客資料
      const userData = await getUserDataAsync(type, this.token, data);

      // 取得使用者 Email 或電話
      data.email = userData?.userData?.email || userData?.userData?.phone || '';

      // 如果 email 無效，嘗試從 user_info 取得
      if (!data.email || data.email === 'no-email') {
        data.email =
          data.user_info?.email && data.user_info.email !== 'no-email'
            ? data.user_info.email
            : data.user_info?.phone || '';
      }

      // 若 email 仍無效，且非預覽模式，設置預設值
      if (!data.email && type !== 'preview') {
        data.email = 'no-email';
      }

      // 判斷購物金是否可用
      const appStatus = await rebateClass.mainStatus();
      if (appStatus && userData && data.use_rebate && data.use_rebate > 0) {
        const userRebate = await rebateClass.getOneRebate({ user_id: userData.userID });
        const sum = userRebate ? userRebate.point : 0;
        if (sum < data.use_rebate) {
          data.use_rebate = 0;
        }
      } else {
        data.use_rebate = 0;
      }

      checkPoint('check rebate');

      // 運費設定
      const shipment: ShipmentConfig = await (async () => {
        data.user_info = data.user_info || {};
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
          data.user_info.shipment === 'global_express'
            ? (
                (
                  await Private_config.getConfig({
                    appName: this.app,
                    key: 'glitter_shipment_global_' + data.user_info.country,
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
                    key: 'glitter_shipment_' + data.user_info.shipment,
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
      })();

      // 物流設定
      const shipment_setting: any = await new Promise(async (resolve, reject) => {
        try {
          resolve(
            ((await Private_config.getConfig({
              appName: this.app,
              key: 'logistics_setting',
            })) ?? [
              {
                value: {
                  support: [],
                },
              },
            ])[0].value
          );
        } catch (e) {
          resolve([]);
        }
      });

      checkPoint('set shipment');

      // 確保自訂配送表單的配置
      shipment_setting.custom_delivery = shipment_setting.custom_delivery
        ? await Promise.all(
            shipment_setting.custom_delivery.map(async (form: any) => {
              const config = await new User(this.app).getConfigV2({
                user_id: 'manager',
                key: `form_delivery_${form.id}`,
              });

              form.form = config.list || [];
              return form;
            })
          ).then(dataArray => dataArray)
        : [];

      // 確保 support 是一個陣列
      shipment_setting.support = shipment_setting.support ?? [];

      // 獲取語言資料中的信息
      const languageInfo = shipment_setting.language_data?.[data.language as any]?.info;
      shipment_setting.info = languageInfo ?? shipment_setting.info;

      // 購物車資料
      const carData: Cart = {
        customer_info: data.customer_info || {},
        lineItems: [],
        total: 0,
        email: data.email ?? data.user_info?.email ?? '',
        user_info: data.user_info,
        shipment_fee: 0,
        rebate: 0,
        goodsWeight: 0,
        use_rebate: data.use_rebate || 0,
        orderID: data.order_id || `${Date.now()}`,
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
        method: data.user_info?.method,
        user_email: userData?.account ?? data.email ?? data.user_info?.email ?? '',
        useRebateInfo: { point: 0 },
        custom_form_format: data.custom_form_format,
        custom_form_data: data.custom_form_data,
        custom_receipt_form: data.custom_receipt_form,
        orderSource: checkOutType === 'POS' ? 'POS' : '',
        code_array: data.code_array,
        give_away: data.give_away as any,
        user_rebate_sum: 0,
        language: data.language,
        pos_info: data.pos_info,
        client_ip_address: data.client_ip_address as string,
        fbc: data.fbc as string,
        fbp: data.fbp as string,
      };

      if (!data.user_info.name && userData && userData.userData) {
        carData.user_info.name = userData.userData.name;
        carData.user_info.phone = userData.userData.phone;
      }

      function calculateShipment(dataList: { key: string; value: string }[], value: number | string) {
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

      const add_on_items: any[] = [];
      const gift_product: any[] = [];
      const saveStockArray: (() => Promise<boolean>)[] = [];

      // 取得 Variant 物件
      function getVariant(prod: any, item: any): any {
        if (prod.product_category === 'kitchen') {
          let price = 0;
          let show_understocking = false;
          let stock = Infinity;

          if (prod.specs.length) {
            price = item.spec.reduce((total: number, spec: any, index: number) => {
              const dpe = prod.specs[index].option.find((dd: any) => dd.title === spec);

              if (dpe) {
                const currentStock = Number(dpe.stock) || Infinity;
                stock = Math.min(stock, currentStock);
                if (dpe.stock !== undefined) {
                  show_understocking = true;
                }
                return total + (Number(dpe.price) || 0);
              }
              return total;
            }, 0);
          } else {
            price = Number(prod.price) || 0;
            show_understocking = Boolean(prod.stock ?? '');
            stock = Number(prod.stock) || 0;
          }

          return {
            sku: '',
            spec: [],
            type: 'variants',
            stock,
            v_width: 0,
            product_id: prod.id,
            sale_price: price,
            origin_price: 0,
            compare_price: 0,
            shipment_type: 'none',
            show_understocking: String(show_understocking), // 保持原本的 string 格式
          };
        } else {
          return prod.variants.find((dd: any) => dd.spec.join('-') === item.spec.join('-'));
        }
      }

      data.line_items = await Promise.all(
        data.line_items.map(async item => {
          const getProductArray = (
            await this.getProduct({
              page: 0,
              limit: 1,
              id: item.id,
              status: 'inRange',
              channel: checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
              whereStore: checkOutType === 'POS' ? data.pos_store : undefined,
              setUserID: `${userData?.userID || ''}`,
            })
          ).data;

          // 搜尋此商品資料並存在
          if (getProductArray[0]) {
            const getProductData = getProductArray[0];
            const content = getProductData.content;
            const variant = getVariant(content, item);

            if (
              (Number.isInteger(variant.stock) || variant.show_understocking === 'false') &&
              Number.isInteger(item.count)
            ) {
              const isPOS = checkOutType === 'POS';
              const isUnderstockingVisible = variant.show_understocking !== 'false';
              const isManualType = type === 'manual' || type === 'manual-preview';

              if (isPOS && isUnderstockingVisible && !data.isExhibition) {
                variant.stock = variant.stockList?.[data.pos_store!]?.count || 0;
              }

              if (variant.stock < item.count && isUnderstockingVisible && !isManualType) {
                if (isPOS) {
                  item.pre_order = true;
                } else {
                  item.count = variant.stock;
                }
              }

              if (variant && item.count > 0) {
                Object.assign(item, {
                  specs: content.specs,
                  language_data: content.language_data,
                  product_category: content.product_category,
                  preview_image: variant.preview_image || content.preview_image[0],
                  title: content.title,
                  sale_price: variant.sale_price,
                  origin_price: variant.origin_price,
                  collection: content.collection,
                  sku: variant.sku,
                  stock: variant.stock,
                  show_understocking: variant.show_understocking,
                  stockList: variant.stockList,
                  weight: parseInt(variant.weight || '0', 10),
                  designated_logistics: content.designated_logistics ?? { type: 'all', list: [] },
                });

                const shipmentValue = (() => {
                  if (!variant.shipment_type || variant.shipment_type === 'none') return 0;
                  if (variant.shipment_type === 'weight') {
                    return item.count * variant.weight;
                  }
                  if (variant.shipment_type === 'volume') {
                    return item.count * variant.v_length * variant.v_width * variant.v_height;
                  }
                  return 0;
                })();

                item.shipment_obj = {
                  type: variant.shipment_type,
                  value: shipmentValue,
                };

                variant.shipment_weight = parseInt(variant.shipment_weight || '0', 10);
                carData.lineItems.push(item);

                if (type !== 'manual') {
                  if (content.productType.giveaway) {
                    item.sale_price = 0;
                  } else {
                    carData.total += variant.sale_price * item.count;
                  }
                }
              }

              if (!['preview', 'manual', 'manual-preview'].includes(type) && variant.show_understocking !== 'false') {
                const remainingStock = Math.max(variant.stock - item.count, 0);
                variant.stock = remainingStock;

                if (type === 'POS') {
                  if (data.isExhibition) {
                    if (data.pos_store) {
                      await this.updateExhibitionActiveStock(data.pos_store, variant.variant_id, item.count);
                    }
                  } else {
                    variant.deduction_log = { [data.pos_store!!]: item.count };
                    variant.stockList[data.pos_store!!].count -= item.count;
                    item.deduction_log = variant.deduction_log;
                  }
                } else {
                  const returnData = new Stock(this.app, this.token).allocateStock(variant.stockList, item.count);
                  variant.deduction_log = returnData.deductionLog;
                  item.deduction_log = returnData.deductionLog;
                }

                saveStockArray.push(
                  () =>
                    new Promise<boolean>(async (resolve, reject) => {
                      try {
                        // 如果有 shopee_id，則同步庫存至蝦皮（Todo: 需要新增是否同步的選項）
                        if (content.shopee_id) {
                          await new Shopee(this.app, this.token).asyncStockToShopee({
                            product: getProductData,
                            callback: () => {},
                          });
                        }

                        if (content.product_category === 'kitchen' && variant.spec?.length) {
                          // 餐廳類別的庫存處理方式
                          variant.spec.forEach((d1: any, index: number) => {
                            const option = content.specs[index].option.find((d2: any) => d2.title === d1);
                            if (option?.stock !== undefined) {
                              option.stock = parseInt(option.stock, 10) - item.count;
                            }
                          });

                          // 取得 store_config 並記錄扣庫存紀錄
                          const store_config = await userClass.getConfigV2({
                            key: 'store_manager',
                            user_id: 'manager',
                          });
                          item.deduction_log = { [store_config.list[0].id]: item.count };
                        } else {
                          await this.updateVariantsWithSpec(variant, item.id, item.spec);
                        }

                        // 更新資料庫
                        await db.query(
                          `UPDATE \`${this.app}\`.\`t_manager_post\` SET ? WHERE id = ${getProductData.id}`,
                          [{ content: JSON.stringify(content) }]
                        );

                        resolve(true);
                      } catch (error) {
                        reject(error);
                      }
                    })
                );
              }
            }

            Object.assign(item, {
              is_add_on_items: content.productType.addProduct && !content.productType.product,
              is_hidden: content.visible === 'false',
              is_gift: content.productType.giveaway,
              sale_price: content.productType.giveaway ? 0 : item.sale_price,
              min_qty: content.min_qty ?? item.min_qty,
              max_qty: content.max_qty ?? item.max_qty,
            });

            // 推入對應的陣列
            item.is_add_on_items && add_on_items.push(item);
            item.is_gift && gift_product.push(item);
          }

          return item;
        })
      ).then(dataArray => dataArray);

      checkPoint('get product info');

      // 建立 Map 並檢查是否有 max_qty 限制的產品
      const maxProductMap = new Map();
      let hasMaxProduct = false;

      for (const product of data.line_items) {
        if (product.max_qty && product.max_qty > 0) {
          maxProductMap.set(product.id, true);
          hasMaxProduct = true;
        }
      }

      if (hasMaxProduct && data.email !== 'no-email') {
        // 查詢歷史訂單
        const existOrders = await db.query(
          `SELECT id, orderData FROM \`${this.app}\`.t_checkout WHERE email = ? AND order_status != '-1';`,
          [data.email]
        );

        // 使用 Map 計算歷史購買數量
        const purchaseHistory = new Map();

        for (const order of existOrders) {
          for (const item of order.orderData.lineItems) {
            if (maxProductMap.has(item.id) && !item.is_gift) {
              purchaseHistory.set(item.id, (purchaseHistory.get(item.id) ?? 0) + item.count);
            }
          }
        }

        // 更新當前訂單項目的歷史購買數量
        for (const item of data.line_items) {
          if (maxProductMap.has(item.id)) {
            item.buy_history_count = purchaseHistory.get(item.id) || 0;
          }
        }
      }

      checkPoint('set max product');

      carData.shipment_fee = (() => {
        if (data.user_info.shipment === 'now') return 0;

        let total_volume = 0;
        let total_weight = 0;
        carData.lineItems.map(item => {
          if (item.shipment_obj.type === 'volume') {
            total_volume += item.shipment_obj.value;
          }
          if (item.shipment_obj.type === 'weight') {
            total_weight += item.shipment_obj.value;
          }
        });
        return calculateShipment(shipment.volume, total_volume) + calculateShipment(shipment.weight, total_weight);
      })();

      carData.total += carData.shipment_fee;
      const f_rebate = await this.formatUseRebate(carData.total, carData.use_rebate);
      carData.useRebateInfo = f_rebate;
      carData.use_rebate = f_rebate.point;
      carData.total -= carData.use_rebate;
      carData.code = data.code;
      carData.voucherList = [];
      checkPoint('set carData');

      if (userData && userData.account) {
        const data = await rebateClass.getOneRebate({ user_id: userData.userID });
        carData.user_rebate_sum = data?.point || 0;
      }

      // 判斷是否有分銷連結
      if (data.distribution_code) {
        const linkList = await new Recommend(this.app, this.token).getLinkList({
          page: 0,
          limit: 99999,
          code: data.distribution_code,
          status: true,
          no_detail: true,
        });
        if (linkList.data.length > 0) {
          const content = linkList.data[0].content;
          if (this.checkDuring(content)) {
            carData.distribution_info = content;
          }
        }
      }
      checkPoint('distribution code');

      // 手動新增訂單的優惠卷設定
      if (type !== 'manual' && type !== 'manual-preview') {
        // 過濾加購品與贈品
        carData.lineItems = carData.lineItems.filter(dd => {
          return !add_on_items.includes(dd) && !gift_product.includes(dd);
        });

        // 濾出可用的加購商品，避免折扣被double所以要stringify
        const c_carData = await this.checkVoucher(structuredClone(carData));

        add_on_items.forEach(dd => {
          try {
            const isAddOnItem = c_carData.voucherList?.some(voucher => {
              return (
                voucher.reBackType === 'add_on_items' &&
                (voucher.add_on_products as string[]).find(d2 => {
                  return `${dd.id}` === `${d2}`;
                })
              );
            });

            // 如果是加購品，則將其加入購物車
            if (isAddOnItem) {
              carData.lineItems.push(dd);
            }
          } catch (e) {
            console.error('Error processing add-on items:', e);
          }
        });

        // 再次更新優惠內容
        await this.checkVoucher(carData);
        checkPoint('check voucher');

        // 過濾可選贈品
        let can_add_gift: any[] = [];

        // 收集可添加的贈品
        carData.voucherList
          ?.filter(dd => dd.reBackType === 'giveaway')
          .forEach(dd => can_add_gift.push(dd.add_on_products));

        // 處理每個贈品
        gift_product.forEach(dd => {
          const max_count = can_add_gift.filter(d1 => d1.includes(dd.id)).length;
          if (dd.count <= max_count) {
            for (let a = 0; a < dd.count; a++) {
              can_add_gift = can_add_gift.filter(d1 => !d1.includes(dd.id)); // 移除已添加的贈品
            }
            carData.lineItems.push(dd);
          }
        });

        for (const giveawayData of carData.voucherList!!.filter(dd => dd.reBackType === 'giveaway')) {
          if (!giveawayData.add_on_products?.length) continue;

          const productPromises = giveawayData.add_on_products.map(async id => {
            const getGiveawayData = (
              (
                await this.getProduct({
                  page: 0,
                  limit: 1,
                  id: `${id}`,
                  status: 'inRange',
                  channel: checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
                  whereStore: checkOutType === 'POS' ? data.pos_store : undefined,
                })
              ).data[0] ?? { content: {} }
            ).content;

            getGiveawayData.voucher_id = giveawayData.id;
            return getGiveawayData;
          });

          // 等待所有 add_on_products 產品資料同時獲取
          giveawayData.add_on_products = await Promise.all(productPromises);
        }
      }

      // 付款資訊設定
      const configData = await Private_config.getConfig({
        appName: this.app,
        key: 'glitter_finance',
      });
      const keyData: paymentInterface = configData[0]?.value;
      if (keyData) {
        (carData as any).payment_info_custom = keyData.payment_info_custom;
      }

      await new Promise<void>(resolve => {
        let n = 0;
        (carData as any).payment_customer_form = (carData as any).payment_customer_form ?? [];
        keyData.payment_info_custom.map((item, index) => {
          userClass
            .getConfigV2({
              user_id: 'manager',
              key: `form_finance_${item.id}`,
            })
            .then(data => {
              (carData as any).payment_customer_form[index] = {
                id: item.id,
                list: data.list,
              };
              n++;
              if (keyData.payment_info_custom.length === n) {
                resolve();
              }
            });
        });
        if (n === 0) {
          resolve();
        }
      });
      checkPoint('set payment');

      // 填入付款資訊與方式
      (carData as any).payment_setting = onlinePayArray
        .filter(dd => {
          return (keyData as any)[dd.key] && (keyData as any)[dd.key].toggle;
        })
        .filter((dd: any) => {
          dd.custome_name = (keyData as any)[dd.key].custome_name;
          if (carData.orderSource === 'POS') {
            if (dd.key === 'ut_credit_card') {
              (dd as any).pwd = (keyData as any)[dd.key]['pwd'];
            }
            return dd.type === 'pos';
          } else {
            return dd.type !== 'pos';
          }
        });

      (keyData as any).cash_on_delivery = (keyData as any).cash_on_delivery ?? { support: [] };
      const is_support_cash = (keyData as any).cash_on_delivery.support.find((item: any, index: number) => {
        return carData.shipment_selector.find(dd => {
          return dd.value === item;
        });
      });
      (carData as any).off_line_support = keyData.off_line_support;
      (carData as any).payment_info_line_pay = keyData.payment_info_line_pay;
      (carData as any).payment_info_atm = keyData.payment_info_atm;

      // 當未找到支援的貨到付款選項把貨到付款功能關掉
      if (!is_support_cash) {
        (carData as any).off_line_support.cash_on_delivery = false;
      } else {
        (carData as any).cash_on_delivery_support = (keyData as any).cash_on_delivery.support;
      }

      // 防止帶入購物金時，總計小於0
      let subtotal = 0;
      carData.lineItems.map(item => {
        if (item.is_gift) {
          item.sale_price = 0;
        }
        if (!item.is_gift) {
          subtotal += item.count * (item.sale_price - (item.discount_price ?? 0));
        }
      });
      if (carData.total < 0 || carData.use_rebate > subtotal) {
        carData.use_rebate = 0;
        carData.total = subtotal + carData.shipment_fee;
      }

      carData.lineItems.map(item => {
        carData.goodsWeight += item.weight * item.count;
      });

      const excludedValuesByTotal = new Set(['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C']);
      const excludedValuesByWeight = new Set(['normal', 'black_cat']);

      const isExcludedByTotal = (dd: any) => {
        return carData.total > 20000 && excludedValuesByTotal.has(dd.value);
      };
      const isExcludedByWeight = (dd: any) => {
        return carData.goodsWeight > 20 && excludedValuesByWeight.has(dd.value);
      };
      const isIncludedInDesignatedLogistics = (dd: any) => {
        return carData.lineItems.every(item => {
          return (
            item.designated_logistics === undefined ||
            item.designated_logistics.type === 'all' ||
            item.designated_logistics.list.includes(dd.value)
          );
        });
      };
      carData.shipment_selector = carData.shipment_selector
        .filter((dd: any) => {
          return isIncludedInDesignatedLogistics(dd);
        })
        .map(dd => {
          dd.isExcludedByTotal = isExcludedByTotal(dd);
          dd.isExcludedByWeight = isExcludedByWeight(dd);
          return dd;
        });
      carData.code_array = (carData.code_array || []).filter(code => {
        return (carData.voucherList || []).find(dd => dd.code === code);
      });

      // ================================ Preview UP ================================
      checkPoint('return preview');
      if (type === 'preview' || type === 'manual-preview') return { data: carData };
      // ================================ Add DOWN ================================

      // 購物金與錢包金額移除
      if (userData && userData.userID) {
        await rebateClass.insertRebate(userData.userID, carData.use_rebate * -1, '使用折抵', {
          order_id: carData.orderID,
        });

        if (carData.voucherList && (carData as any).voucherList.length > 0) {
          for (const voucher of (carData as any).voucherList) {
            await this.insertVoucherHistory(userData.userID, carData.orderID, voucher.id);
          }
        }
        // 判斷錢包是否有餘額
        const sum =
          (
            await db.query(
              `SELECT sum(money)
               FROM \`${this.app}\`.t_wallet
               WHERE status in (1, 2)
                 and userID = ?`,
              [userData.userID]
            )
          )[0]['sum(money)'] || 0;
        carData.use_wallet = sum < carData.total ? sum : carData.total;
      }
      checkPoint('check user rebate');

      // 手動結帳地方判定
      if (type === 'manual') {
        carData.orderSource = 'manual';
        let tempVoucher: VoucherData = {
          discount_total: data.voucher.discount_total,
          end_ISO_Date: '',
          for: 'all',
          forKey: [],
          method: data.voucher.method,
          overlay: false,
          rebate_total: data.voucher.rebate_total,
          reBackType: data.voucher.reBackType,
          rule: 'min_price',
          ruleValue: 0,
          startDate: '',
          startTime: '',
          start_ISO_Date: '',
          status: 1,
          target: '',
          targetList: [],
          title: data.voucher.title,
          trigger: 'auto',
          type: 'voucher',
          value: data.voucher.value,
          id: data.voucher.id,
          bind: [],
          bind_subtotal: 0,
          times: 1,
          counting: 'single',
          conditionType: 'item',
          device: ['normal'],
          productOffStart: 'price_all',
        };
        carData.discount = data.discount;
        carData.voucherList = [tempVoucher];
        carData.customer_info = data.customer_info;
        carData.total = data.total ?? 0;
        carData.rebate = tempVoucher.rebate_total;

        if (tempVoucher.reBackType == 'shipment_free') {
          carData.shipment_fee = 0;
        }

        if (tempVoucher.reBackType == 'rebate') {
          let customerData = await userClass.getUserData(data.email! || data.user_info.email, 'account');
          if (!customerData) {
            await userClass.createUser(
              data.email!,
              Tool.randomString(8),
              {
                email: data.email,
                name: data.customer_info.name,
                phone: data.customer_info.phone,
              },
              {},
              true
            );
            customerData = await userClass.getUserData(data.email! || data.user_info.email, 'account');
          }
          if (carData.rebate !== 0) {
            await rebateClass.insertRebate(
              customerData.userID,
              carData.rebate,
              `手動新增訂單 - 優惠券購物金：${tempVoucher.title}`
            );
          }
        }

        // 手動訂單新增
        await OrderEvent.insertOrder({
          cartData: carData,
          status: data.pay_status as any,
          app: this.app,
        });
        checkPoint('manual ordeer done');

        return {
          data: carData,
        };
      } else if (type === 'POS') {
        carData.orderSource = 'POS';

        if (checkOutType === 'POS' && Array.isArray(data.voucherList)) {
          const manualVoucher = data.voucherList.find((item: any) => item.id === 0);
          if (manualVoucher) {
            manualVoucher.discount = manualVoucher.discount_total ?? 0;
            carData.total -= manualVoucher.discount;
          }
        }

        const trans = await db.Transaction.build();
        if (data.pre_order) {
          (carData as any).progress = 'pre_order';
          (carData as any).orderStatus = '0';
          const payTotal = data.pos_info.payment
            .map((dd: any) => dd.total)
            .reduce((acc: any, val: any) => acc + val, 0);
          if (carData.total <= payTotal) {
            data.pay_status = 1;
          } else {
            data.pay_status = 3;
          }
        } else if (carData.user_info.shipment === 'now') {
          (carData as any).orderStatus = '1';
          (carData as any).progress = 'finish';
        }
        await OrderEvent.insertOrder({
          cartData: carData,
          status: data.pay_status as any,
          app: this.app,
        });
        if (data.invoice_select !== 'nouse') {
          (carData as any).invoice = await new Invoice(this.app).postCheckoutInvoice(
            carData,
            carData.user_info.send_type !== 'carrier'
          );
        }
        await trans.commit();
        await trans.release();
        await Promise.all(saveStockArray.map(dd => dd()));
        await this.releaseCheckout((data.pay_status as any) ?? 0, carData.orderID);
        checkPoint('release pos checkout');

        return { result: 'SUCCESS', message: 'POS訂單新增成功', data: carData };
      }

      // Genetate notify redirect id
      const id = 'redirect_' + Tool.randomString(6);
      const redirect_url = new URL(data.return_url);
      redirect_url.searchParams.set('cart_token', carData.orderID);
      await redis.setValue(id, redirect_url.href);

      // 當不需付款時直接寫入，並開發票
      if (carData.use_wallet === carData.total) {
        await db.query(
          `INSERT INTO \`${this.app}\`.t_wallet (orderID, userID, money, status, note)
           values (?, ?, ?, ?, ?);`,
          [
            carData.orderID,
            userData.userID,
            carData.use_wallet * -1,
            1,
            JSON.stringify({
              note: '使用錢包購物',
              orderData: carData,
            }),
          ]
        );

        carData.method = 'off_line';
        await OrderEvent.insertOrder({
          cartData: carData,
          status: 1,
          app: this.app,
        });
        if (carData.use_wallet > 0) {
          new Invoice(this.app).postCheckoutInvoice(carData.orderID, false);
        }
        await Promise.all(saveStockArray.map(dd => dd()));
        checkPoint('insert order & create invoice');

        return {
          is_free: true,
          return_url: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
        };
      } else {
        const keyData = (
          await Private_config.getConfig({
            appName: this.app,
            key: 'glitter_finance',
          })
        )[0].value;
        let kd = keyData[carData.customer_info.payment_select] ?? {
          ReturnURL: '',
          NotifyURL: '',
        };
        // 線下付款
        switch (carData.customer_info.payment_select) {
          case 'ecPay':
          case 'newWebPay':
            const subMitData = await new FinancialService(this.app, {
              HASH_IV: kd.HASH_IV,
              HASH_KEY: kd.HASH_KEY,
              ActionURL: kd.ActionURL,
              NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`,
              ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
              MERCHANT_ID: kd.MERCHANT_ID,
              TYPE: carData.customer_info.payment_select,
            }).createOrderPage(carData);
            await Promise.all(
              saveStockArray.map(dd => {
                return dd();
              })
            );
            checkPoint('select newWebPay');

            return {
              form: subMitData,
            };
          case 'paypal':
            kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`;
            kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`;
            await Promise.all(
              saveStockArray.map(dd => {
                return dd();
              })
            );
            checkPoint('select paypal');
            return await new PayPal(this.app, kd).checkout(carData);
          case 'line_pay':
            kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}&type=${carData.customer_info.payment_select}`;
            kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`;
            await Promise.all(
              saveStockArray.map(dd => {
                return dd();
              })
            );
            checkPoint('select linepay');
            return await new LinePay(this.app, kd).createOrder(carData);
          case 'paynow': {
            kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}&type=${carData.customer_info.payment_select}`;
            kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&paynow=true&type=${carData.customer_info.payment_select}`;
            await Promise.all(
              saveStockArray.map(dd => {
                return dd();
              })
            );
            checkPoint('select paynow');
            return await new PayNow(this.app, kd).createOrder(carData);
          }
          case 'jkopay': {
            kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&jkopay=true&orderid=${carData.orderID}`;
            kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&jkopay=true`;
            checkPoint('select jkopay');
            return await new JKO(this.app, kd).createOrder(carData);
          }
          default:
            carData.method = 'off_line';
            await OrderEvent.insertOrder({
              cartData: carData,
              status: 0,
              app: this.app,
            });
            await Promise.all(
              saveStockArray.map(dd => {
                return dd();
              })
            );
            // 訂單成立信件通知
            new ManagerNotify(this.app).checkout({
              orderData: carData,
              status: 0,
            });
            if (carData.customer_info.phone) {
              let sns = new SMS(this.app);
              await sns.sendCustomerSns('auto-sns-order-create', carData.orderID, carData.customer_info.phone);
              console.log('訂單簡訊寄送成功');
            }
            if (carData.customer_info.lineID) {
              let line = new LineMessage(this.app);
              await line.sendCustomerLine('auto-line-order-create', carData.orderID, carData.customer_info.lineID);
              console.log('訂單line訊息寄送成功');
            }
            // if (carData.customer_info.fb_id) {
            //     let fb = new FbMessage(this.app)
            //     await fb.sendCustomerFB('auto-fb-order-create', carData.orderID, carData.customer_info.fb_id);
            //     console.log('訂單FB訊息寄送成功');
            // }

            AutoSendEmail.customerOrder(
              this.app,
              'auto-email-order-create',
              carData.orderID,
              carData.email,
              carData.language!!
            );
            await this.releaseVoucherHistory(carData.orderID, 1);
            checkPoint('default release checkout');
            return {
              off_line: true,
              return_url: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
            };
        }
      }
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout 5 Error:' + e, null);
    }
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
      //退貨單封存相關
      if (query.archived === 'true') {
        querySql.push(`(orderData->>'$.archived'="${query.archived}")`);
      } else if (query.archived === 'false') {
        querySql.push(`((orderData->>'$.archived' is null) or (orderData->>'$.archived'!='true'))`);
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

        // 批次封存原始訂單
        await Promise.all(
          orders.map(async order => {
            order.orderData.orderStatus = '-1';
            order.orderData.archived = 'true';
            return db.query(
              `UPDATE \`${this.app}\`.t_checkout
               SET orderData = ?
               WHERE cart_token = ?`,
              [JSON.stringify(order.orderData), order.cart_token]
            );
          })
        );
      }

      return true;
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'combineOrder Error:' + e, null);
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
    cart.lineItems.map(dd => {
      dd.discount_price = 0;
      dd.rebate = 0;
    });

    function switchValidProduct(
      caseName: 'collection' | 'product' | 'all',
      caseList: string[],
      caseOffStart: 'price_desc' | 'price_asc' | 'price_all'
    ): any {
      const filterItems = cart.lineItems.filter(dp => {
        switch (caseName) {
          case 'collection':
            return dp.collection.some((d2: string) => caseList.includes(d2));
          case 'product':
            return caseList
              .map(dd => {
                return `${dd}`;
              })
              .includes(`${dp.id}`);
          case 'all':
            return true;
        }
      });

      return filterItems.sort((a, b) =>
        caseOffStart === 'price_desc' ? b.sale_price - a.sale_price : a.sale_price - b.sale_price
      );
    }

    // 確認用戶資訊
    const userClass = new User(this.app);

    const userData = (await userClass.getUserData(cart.email, 'email_or_phone')) ?? { userID: -1 };
    // 取得所有可使用優惠券
    const allVoucher = await this.getAllUseVoucher(userData.userID);

    // 過濾可使用優惠券狀態
    let overlay = false;

    const voucherList = allVoucher
      .filter(dd => {
        // 訂單來源判斷
        if (!dd.device) {
          return true;
        }
        if (dd.device.length === 0) {
          return false;
        }
        switch (cart.orderSource) {
          case 'POS':
            return dd.device.includes('pos');
          default:
            return dd.device.includes('normal');
        }
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
        dd.bind = [];
        dd.productOffStart = dd.productOffStart ?? 'price_all';

        // 判斷符合商品類型
        switch (dd.trigger) {
          case 'auto': // 自動填入
            dd.bind = switchValidProduct(dd.for, dd.forKey, dd.productOffStart);
            break;
          case 'code': // 輸入代碼
            if (dd.code === `${cart.code}` || (cart.code_array || []).includes(`${dd.code}`)) {
              dd.bind = switchValidProduct(dd.for, dd.forKey, dd.productOffStart);
            }
            break;
          case 'distribution': // 分銷優惠
            if (cart.distribution_info && cart.distribution_info.voucher === dd.id) {
              dd.bind = switchValidProduct(
                cart.distribution_info.relative,
                cart.distribution_info.relative_data,
                dd.productOffStart
              );
            }
            break;
        }

        // 採用百分比打折, 整份訂單, 最少購買, 活動為現折, 價高者商品或價低商品打折的篩選
        if (
          dd.method === 'percent' &&
          dd.conditionType === 'order' &&
          dd.rule === 'min_count' &&
          dd.reBackType === 'discount' &&
          dd.productOffStart !== 'price_all' &&
          dd.ruleValue > 0
        ) {
          dd.bind = dd.bind.slice(0, dd.ruleValue);
        }

        return dd.bind.length > 0;
      })
      .filter(dd => {
        const pass = (() => {
          // 購物車是否達到優惠條件，與計算優惠觸發次數
          dd.times = 0;
          dd.bind_subtotal = 0;

          const ruleValue = parseInt(`${dd.ruleValue}`, 10);

          if (dd.conditionType === 'order') {
            let cartValue = 0;
            dd.bind.map(item => {
              dd.bind_subtotal += item.count * item.sale_price;
            });
            if (dd.rule === 'min_price') {
              cartValue = dd.bind_subtotal;
            }
            if (dd.rule === 'min_count') {
              dd.bind.map(item => {
                cartValue += item.count;
              });
            }
            if (dd.reBackType === 'shipment_free') {
              return cartValue >= ruleValue; // 回傳免運費判斷
            }
            if (cartValue >= ruleValue) {
              if (dd.counting === 'each') {
                dd.times = Math.floor(cartValue / ruleValue);
              }
              if (dd.counting === 'single') {
                dd.times = 1;
              }
            }
            // 單位為訂單的優惠觸發
            return dd.times > 0;
          }

          if (dd.conditionType === 'item') {
            if (dd.rule === 'min_price') {
              dd.bind = dd.bind.filter(item => {
                item.times = 0;
                if (item.count * item.sale_price >= ruleValue) {
                  if (dd.counting === 'each') {
                    item.times = Math.floor((item.count * item.sale_price) / ruleValue);
                  }
                  if (dd.counting === 'single') {
                    item.times = 1;
                  }
                }
                return item.times > 0;
              });
            }
            if (dd.rule === 'min_count') {
              dd.bind = dd.bind.filter(item => {
                item.times = 0;
                if (item.count >= ruleValue) {
                  if (dd.counting === 'each') {
                    item.times = Math.floor(item.count / ruleValue);
                  }
                  if (dd.counting === 'single') {
                    item.times = 1;
                  }
                }
                return item.times > 0;
              });
            }
            // 計算單位為商品的優惠觸發
            return dd.bind.reduce((acc, item) => acc + item.times, 0) > 0;
          }

          return false;
        })();

        return pass ?? false;
      })
      .sort(function (a: VoucherData, b: VoucherData) {
        // 排序折扣金額
        let compareB = b.bind
          .map(dd => {
            return b.method === 'percent' ? (dd.sale_price * parseFloat(b.value)) / 100 : parseFloat(b.value);
          })
          .reduce(function (accumulator, currentValue) {
            return accumulator + currentValue;
          }, 0);
        let compareA = a.bind
          .map(dd => {
            return a.method === 'percent' ? (dd.sale_price * parseFloat(a.value)) / 100 : parseFloat(a.value);
          })
          .reduce(function (accumulator, currentValue) {
            return accumulator + currentValue;
          }, 0);
        return compareB - compareA;
      })
      .filter(dd => {
        // 是否可疊加
        if (!overlay && !dd.overlay) {
          overlay = true;
          return true;
        }
        return dd.overlay;
      })
      .filter(dd => {
        dd.discount_total = dd.discount_total ?? 0;
        dd.rebate_total = dd.rebate_total ?? 0;

        if (dd.reBackType === 'shipment_free') {
          return true;
        }

        const disValue = dd.method === 'percent' ? parseFloat(dd.value) / 100 : parseFloat(dd.value);

        if (dd.conditionType === 'order') {
          if (dd.method === 'fixed') {
            dd.discount_total = disValue * dd.times;
          }
          if (dd.method === 'percent') {
            dd.discount_total = dd.bind_subtotal * disValue;
          }
          if (dd.bind_subtotal >= dd.discount_total) {
            let remain = parseInt(`${dd.discount_total}`, 10);
            dd.bind.map((d2, index) => {
              let discount = 0;
              if (index === dd.bind.length - 1) {
                discount = remain;
              } else {
                discount = Math.round(remain * ((d2.sale_price * d2.count) / dd.bind_subtotal));
              }
              if (discount > 0 && discount <= d2.sale_price * d2.count) {
                // 計算單位為訂單，優惠發放
                if (dd.reBackType === 'rebate') {
                  d2.rebate += discount / d2.count;
                  cart.rebate! += discount;
                  dd.rebate_total += discount;
                } else {
                  d2.discount_price += discount / d2.count;
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

        if (dd.conditionType === 'item') {
          if (dd.method === 'fixed') {
            dd.bind = dd.bind.filter(d2 => {
              const discount = disValue * d2.times;
              if (discount <= d2.sale_price * d2.count) {
                // 計算單位為商品，固定折扣的優惠發放
                if (dd.reBackType === 'rebate') {
                  d2.rebate += discount / d2.count;
                  cart.rebate! += discount;
                  dd.rebate_total += discount;
                } else {
                  d2.discount_price += discount / d2.count;
                  cart.discount! += discount;
                  dd.discount_total += discount;
                }
                return true;
              }
              return false;
            });
          }
          if (dd.method === 'percent') {
            dd.bind = dd.bind.filter(d2 => {
              const discount = Math.floor(d2.sale_price * d2.count * disValue);
              if (discount <= d2.sale_price * d2.count) {
                // 計算單位為商品，百分比折扣的優惠發放
                if (dd.reBackType === 'rebate') {
                  d2.rebate += discount / d2.count;
                  cart.rebate! += discount;
                  dd.rebate_total += discount;
                } else {
                  d2.discount_price += discount / d2.count;
                  cart.discount! += discount;
                  dd.discount_total += discount;
                }
                return true;
              }
              return false;
            });
          }
        }

        return dd.bind.length > 0;
      });

    // 判斷優惠碼無效
    if (!voucherList.find((d2: VoucherData) => d2.code === `${cart.code}`)) {
      cart.code = undefined;
    }

    // 如果有折扣運費，刪除基本運費
    if (voucherList.find((d2: VoucherData) => d2.reBackType === 'shipment_free')) {
      cart.total -= cart.shipment_fee;
      cart.shipment_fee = 0;
    }

    // 回傳折扣後總金額與優惠券陣列
    cart.total -= cart.discount;
    cart.voucherList = voucherList;
    return cart;
  }

  async putOrder(data: { id?: string; cart_token?: string; orderData: any; status: any }) {
    try {
      const update: any = {};
      const storeConfig = await new User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' });
      let origin = undefined;
      if (data.id) {
        origin = (
          await db.query(
            `SELECT *
             FROM \`${this.app}\`.t_checkout
             WHERE id = ?;`,
            [data.id]
          )
        )[0];
      }
      if (data.cart_token) {
        origin = (
          await db.query(
            `SELECT *
             FROM \`${this.app}\`.t_checkout
             WHERE cart_token = ?;`,
            [data.cart_token]
          )
        )[0];
      }

      if (!origin) {
        return {
          result: 'error',
          message: `訂單 id ${data.id} 不存在`,
        };
      }

      if (data.status !== undefined) {
        update.status = data.status;
      }

      // lineItems 庫存修正
      const resetLineItems = (lineItems: any[]) => {
        return lineItems.map(item => ({
          ...item,
          stockList: undefined,
          deduction_log: Object.keys(item.deduction_log || {}).length
            ? item.deduction_log
            : { [storeConfig.list[0].id]: item.count },
        }));
      };

      if (data.orderData) {
        const orderData = data.orderData;
        update.orderData = structuredClone(orderData);
        const updateProgress = update.orderData.progress;

        // 恢復取消訂單的庫存
        orderData.lineItems = resetLineItems(orderData.lineItems);
        origin.orderData.lineItems = resetLineItems(origin.orderData.lineItems);

        // 釋放優惠券
        await this.releaseVoucherHistory(orderData.orderID, orderData.orderStatus === '-1' ? 0 : 1);

        // 當訂單變成已取消時，執行庫存回填
        const prevStatus = origin.orderData.orderStatus;
        const prevProgress = origin.orderData.progress;

        if (prevStatus !== '-1' && orderData.orderStatus === '-1') {
          await this.restoreStock(origin.orderData.lineItems);
          await AutoSendEmail.customerOrder(
            this.app,
            'auto-email-order-cancel-success',
            orderData.orderID,
            orderData.email,
            orderData.language
          );
        }

        //當訂單多了出貨單號碼，新增出貨日期，反之清空出貨日期。
        if (update.orderData.user_info.shipment_number && !update.orderData.user_info.shipment_date) {
          update.orderData.user_info.shipment_date = new Date().toISOString();
        } else if (!update.orderData.user_info.shipment_number) {
          delete update.orderData.user_info.shipment_date;
        }

        // 當訂單出貨狀態變更，觸發通知事件
        if (prevProgress !== updateProgress) {
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
         WHERE id = ?;`,
        [updateData, origin.id]
      );

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

      //加入到索引欄位
      await CheckoutService.updateAndMigrateToTableColumn({
        id: origin.id,
        orderData: update.orderData,
        app_name: this.app,
      });
      return {
        result: 'success',
        orderData: data.orderData,
      };
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'putOrder Error:' + e, null);
    }
  }

  private async restoreStock(lineItems: any[]) {
    const stockUpdates = lineItems.map(async item => {
      if (item.product_category === 'kitchen' && item.spec?.length) {
        return new Shopping(this.app, this.token).calcVariantsStock(item.count, '', item.id, item.spec);
      }
      return Promise.all(
        Object.entries(item.deduction_log).map(([location, count]) => {
          const intCount = parseInt(`${count || 0}`, 10);
          return new Shopping(this.app, this.token).calcVariantsStock(intCount, location, item.id, item.spec);
        })
      );
    });
    await Promise.all(stockUpdates);
  }

  private async sendNotifications(orderData: any, type: 'shipment' | 'arrival') {
    const { phone, lineID } = orderData.customer_info;
    const messages = [];
    const typeMap = {
      shipment: 'shipment',
      arrival: 'shipment-arrival',
    };

    if (phone) {
      const sns = new SMS(this.app);
      messages.push(sns.sendCustomerSns(`auto-sns-${typeMap[type]}`, orderData.orderID, phone));
    }
    if (lineID) {
      const line = new LineMessage(this.app);
      messages.push(line.sendCustomerLine(`auto-line-${typeMap[type]}`, orderData.orderID, lineID));
    }
    messages.push(
      AutoSendEmail.customerOrder(
        this.app,
        `auto-email-${typeMap[type]}`,
        orderData.orderID,
        orderData.email,
        orderData.language
      )
    );

    await Promise.all(messages);
  }

  private async adjustStock(origin: any, orderData: any) {
    if (orderData.orderStatus === '-1') return;

    const stockAdjustments = orderData.lineItems.map(async (newItem: any) => {
      const originalItem = origin.lineItems.find(
        (item: any) => item.id === newItem.id && item.spec.join('') === newItem.spec.join('')
      );

      if (newItem.product_category === 'kitchen' && newItem.spec?.length) {
        return new Shopping(this.app, this.token).calcVariantsStock(newItem.count, '', newItem.id, newItem.spec);
      }

      return Promise.all(
        Object.entries(newItem.deduction_log).map(([location, newCount]) => {
          const originalCount = originalItem.deduction_log[location] || 0;
          const parsedNewCount = Number(newCount || 0);
          const delta = (isNaN(parsedNewCount) ? 0 : parsedNewCount) - originalCount;

          return new Shopping(this.app, this.token).calcVariantsStock(delta * -1, location, newItem.id, newItem.spec);
        })
      );
    });
    await Promise.all(stockAdjustments);
  }

  async cancelOrder(order_id: string) {
    try {
      const orderList = await db.query(
        `SELECT *
         FROM \`${this.app}\`.t_checkout
         WHERE cart_token = ?;
        `,
        [order_id]
      );

      if (orderList.length !== 1) {
        return { data: false };
      }

      const origin = orderList[0];
      const orderData = origin.orderData;
      const proofPurchase = orderData.proof_purchase === undefined;
      const paymentStatus = origin.status === undefined || origin.status === 0 || origin.status === -1;
      const progressStatus = orderData.progress === undefined || orderData.progress === 'wait';
      const orderStatus = orderData.orderStatus === undefined || `${orderData.orderStatus}` === '0';

      if (proofPurchase && paymentStatus && progressStatus && orderStatus) {
        orderData.orderStatus = '-1';
        const record = { time: this.formatDateString(), record: '顧客手動取消訂單' };
        if (orderData.editRecord) {
          orderData.editRecord.push(record);
        } else {
          orderData.editRecord = [record];
        }
      }

      await this.putOrder({
        cart_token: order_id,
        orderData: orderData,
        status: undefined,
      });

      return { data: true };
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
      await AutoSendEmail.customerOrder(this.app, 'proof-purchase', order_id, orderData.email, orderData.language);

      if (orderData.customer_info.phone) {
        let sns = new SMS(this.app);
        await sns.sendCustomerSns('sns-proof-purchase', order_id, orderData.customer_info.phone);
        console.log('訂單待核款簡訊寄送成功');
      }
      if (orderData.customer_info.lineID) {
        let line = new LineMessage(this.app);
        await line.sendCustomerLine('line-proof-purchase', order_id, orderData.customer_info.lineID);
        console.log('付款成功line訊息寄送成功');
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
  }) {
    try {
      let querySql = ['1=1'];
      let orderString = 'order by id desc';

      if (query.search && query.searchType) {
        switch (query.searchType) {
          case 'cart_token':
            querySql.push(`(cart_token like '%${query.search}%')`);
            break;
          case 'shipment_number':
            querySql.push(`(orderData->>'$.user_info.shipment_number' like '%${query.search}%')`);
            break;
          case 'name':
          case 'invoice_number':
          case 'phone':
            querySql.push(
              `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.user_info.${query.searchType}')) LIKE ('%${query.search}%')))`
            );
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
        console.log('id_list');
        console.log(id_list);
        switch (query.searchType) {
          case 'cart_token':
            querySql.push(`(cart_token IN (${id_list}))`);
            break;
          case 'shipment_number':
            querySql.push(`(orderData->>'$.user_info.shipment_number' IN (${id_list}))`);
            break;
          default:
            querySql.push(`(id IN (${id_list}))`);
            break;
        }
      }

      if (query.orderStatus) {
        let orderArray = query.orderStatus.split(',');
        let temp = '';
        if (orderArray.includes('0')) {
          temp += "JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.orderStatus')) IS NULL OR ";
        }
        temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.orderStatus')) IN (${query.orderStatus})`;
        querySql.push(`(${temp})`);
      }

      if (query.valid) {
        const countingSQL = await new User(this.app).getCheckoutCountingModeSQL();
        querySql.push(countingSQL);
      }

      if (query.is_shipment) {
        querySql.push(
          `(orderData->>'$.user_info.shipment_number' IS NOT NULL) and (orderData->>'$.user_info.shipment_number' != '')`
        );
      }
      if (query.payment_select) {
        querySql.push(
          `(orderData->>'$.customer_info.payment_select') in (${query.payment_select
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
          querySql.push(`shipment_number is null`);
        }
        let newArray = query.progress.split(',');
        let temp = '';
        if (newArray.includes('wait')) {
          temp += "JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.progress')) IS NULL OR ";
        }
        temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.progress')) IN (${newArray.map(status => `"${status}"`).join(',')})`;
        querySql.push(`(${temp})`);
      }

      if (query.distribution_code) {
        let codes = query.distribution_code.split(',');
        let temp = '';
        temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.distribution_info.code')) IN (${codes.map(code => `"${code}"`).join(',')})`;
        querySql.push(`(${temp})`);
      }

      if (query.is_pos === 'true') {
        querySql.push(`orderData->>'$.orderSource'='POS'`);
      } else if (query.is_pos === 'false') {
        querySql.push(`orderData->>'$.orderSource'<>'POS'`);
      }

      if (query.shipment) {
        let shipment = query.shipment.split(',');
        let temp = '';
        if (shipment.includes('normal')) {
          temp += "JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.user_info.shipment')) IS NULL OR ";
        }
        temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.user_info.shipment')) IN (${shipment.map(status => `"${status}"`).join(',')})`;
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
                       (orderData->>'$.user_info.shipment_date' >= ${db.escape(`${shipment_time[0]} 00:00:00`)}) and
                        (orderData->>'$.user_info.shipment_date' <= ${db.escape(`${shipment_time[1]} 23:59:59`)})
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
            orderString = "order by CAST(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.total')) AS SIGNED) desc";
            break;
          case 'order_total_asc':
            orderString = "order by CAST(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.total')) AS SIGNED) asc";
            break;
        }
      }

      query.status && querySql.push(`status IN (${query.status})`);
      const orderMath = [];

      // JSON_EXTRACT(orderData, '$.customer_info.phone')
      query.email && orderMath.push(`(email=${db.escape(query.email)})`);
      query.phone && orderMath.push(`(email=${db.escape(query.phone)})`);
      if (orderMath.length) {
        querySql.push(`(${orderMath.join(' or ')})`);
      }
      query.id && querySql.push(`(content->>'$.id'=${query.id})`);

      if (query.filter_type === 'true' || query.archived) {
        if (query.archived === 'true') {
          querySql.push(`(orderData->>'$.archived'="${query.archived}") 
                    AND (JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.orderStatus')) IS NULL 
                    OR JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.orderStatus')) NOT IN (-99)) `);
        } else {
          querySql.push(`((orderData->>'$.archived'="${query.archived}") or (orderData->>'$.archived' is null))`);
        }
      } else if (query.filter_type === 'normal') {
        querySql.push(`((orderData->>'$.archived' is null) or (orderData->>'$.archived'!='true'))`);
      }
      if (!(query.filter_type === 'true' || query.archived)) {
        querySql.push(`((orderData->>'$.orderStatus' is null) or (orderData->>'$.orderStatus' NOT IN (-99)))`);
      }
      let sql = `SELECT *
                 FROM \`${this.app}\`.t_checkout
                 WHERE ${querySql.join(' and ')} ${orderString}`;

      if (query.returnSearch == 'true') {
        const data = await db.query(
          `SELECT *
           FROM \`${this.app}\`.t_checkout
           WHERE cart_token = ${query.search}`,
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
      const response_data: any = await new Promise(async (resolve, reject) => {
        if (query.id) {
          const data = (
            await db.query(
              `SELECT *
               FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}
              `,
              []
            )
          )[0];
          resolve({
            data: data,
            result: !!data,
          });
        } else {
          resolve({
            data: await db.query(
              `SELECT *
               FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}
              `,
              []
            ),
            total: (
              await db.query(
                `SELECT count(1)
                 FROM (${sql}) as subqyery
                `,
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
                order.orderData.cash_flow = (
                  await new PayNow(this.app, keyData['paynow']).confirmAndCaptureOrder(order.orderData.paynow_id)
                ).result;
              }
              if (order.orderData.user_info.shipment_refer === 'paynow') {
                const pay_now = new PayNowLogistics(this.app);
                order.orderData.user_info.shipment_detail = await pay_now.getOrderInfo(order.cart_token);
                console.log(`PayNowLogisticCode=>`, order.orderData.user_info.shipment_detail.PayNowLogisticCode);
                const status = (() => {
                  switch (order.orderData.user_info.shipment_detail.PayNowLogisticCode) {
                    case '0000':
                    case '7101':
                    case '7201':
                      return 'wait';
                    case '0101':
                    case '4000':
                    case '0102':
                    case '9411':
                      return 'shipping';
                    case '0103':
                    case '4019':
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
                  searchType: order.orderData.order_number,
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

        await AutoSendEmail.customerOrder(
          this.app,
          'auto-email-payment-successful',
          order_id,
          cartData.email,
          cartData.orderData.language
        );

        if (cartData.orderData.customer_info.phone) {
          let sns = new SMS(this.app);
          await sns.sendCustomerSns('auto-sns-payment-successful', order_id, cartData.orderData.customer_info.phone);
          console.log('付款成功簡訊寄送成功');
        }
        if (cartData.orderData.customer_info.lineID) {
          let line = new LineMessage(this.app);
          await line.sendCustomerLine(
            'auto-line-payment-successful',
            order_id,
            cartData.orderData.customer_info.lineID
          );
          console.log('付款成功line訊息寄送成功');
        }

        const userData = await new User(this.app).getUserData(cartData.email, 'account');

        try {
          await new CustomCode(this.app).checkOutHook({ userData, cartData });
        } catch (e) {
          console.error(e);
        }
        new Invoice(this.app).postCheckoutInvoice(order_id, false);
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

        if (voucherRow[0]) {
          const usedVoucher = await this.isUsedVoucher(userData.userID, orderVoucher.id, order_id);
          if(orderVoucher.rebate_total && !usedVoucher){
            await rebateClass.insertRebate(
              userData.userID,
              orderVoucher.rebate_total,
              `優惠券購物金：${voucherRow[0].content.title}`,
              {
                voucher_id: orderVoucher.id,
                order_id: order_id
              }
            )
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

        const insertData = await db.query(
          `INSERT INTO \`${this.app}\`.t_variants
           SET ?`,
          [
            {
              content: JSON.stringify(variant),
              product_id: content.id,
            },
          ]
        );

        const originalVariant = originVariants.find(
          (item: any) => JSON.parse(item.spec).join(',') === variant.spec.join(',')
        );

        if (originalVariant) {
          sourceMap[originalVariant.id] = insertData.insertId;
        }

        return insertData;
      });

      await Promise.all(insertPromises);

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

  //更新庫存數量
  async calcVariantsStock(calc: number, stock_id: string, product_id: string, spec: string[]) {
    try {
      const pd_data = (
        await this.getProduct({
          id: product_id,
          page: 0,
          limit: 1,
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
        const parentIndex = config.value.findIndex((col: { title: string }) => {
          return col.title === original.title;
        });
        config.value[parentIndex] = {
          ...formatData,
          array: replace.subCollections.map(col => {
            const sub = config.value[parentIndex].array.find((item: { title: string }) => {
              return item.title === col;
            });
            return { array: [], title: col, code: sub ? sub.code : '' };
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
      const get_product_sql = `SELECT *
                               FROM \`${this.app}\`.t_manager_post
                               WHERE id = ?`;
      for (const id of replace.product_id ?? []) {
        const get_product = await db.query(get_product_sql, [id]);
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
      const update_col_sql = `UPDATE \`${this.app}\`.public_config
                              SET value = ?
                              WHERE \`key\` = 'collection';`;
      await db.execute(update_col_sql, [config.value]);

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
      return data.insertId;
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'postProduct Error:' + e, null);
    }
  }

  async updateCollectionFromUpdateProduct(collection: string[]) {
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
          return new Promise(async (resolve, reject) => {
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
                }

                product = {
                  ...og_content,
                  ...product,
                };
                product.preview_image = og_data['content'].preview_image || [];
                productArray[index] = product;
              } else {
                console.log(`product-not-in==>`, product);
              }
            } else {
              console.log(`no-product-id==>`, product);
            }
            resolve(true);
          });
        })
      );

      let max_id =
        ((
          await db.query(
            `select max(id)
             from \`${this.app}\`.t_manager_post`,
            []
          )
        )[0]['max(id)'] || 0) + 1;

      productArray.map((product: any) => {
        if (!product.id) {
          product.id = max_id++;
        }
        product.type = 'product';
        this.checkVariantDataType(product.variants);
        return [product.id || null, this.token?.userID, JSON.stringify(product)];
      });
      console.log(`productArray==>`, productArray);

      if (productArray.length) {
        const data = await db.query(
          `replace
          INTO \`${this.app}\`.\`t_manager_post\` (id,userID,content) values ?`,
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
    await Promise.all(promises);
  }

  async putProduct(content: any) {
    if (content.language_data) {
      const language = await App.getSupportLanguage(this.app);
      for (const b of language) {
        const find_conflict = await db.query(
          `select count(1)
           from \`${this.app}\`.\`t_manager_post\`
           where content ->>'$.language_data."${b}".seo.domain'='${decodeURIComponent(content.language_data[b].seo.domain)}'
             and id != ${content.id}`,
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

    try {
      content.type = 'product';

      this.checkVariantDataType(content.variants);
      const data = await db.query(
        `update \`${this.app}\`.\`t_manager_post\`
         SET ?
         where id = ?`,
        [
          {
            content: JSON.stringify(content),
          },
          content.id,
        ]
      );
      await new Shopping(this.app, this.token).postVariantsAndPriceValue(content);
      if (content.shopee_id) {
        await new Shopee(this.app, this.token).asyncStockToShopee({
          product: {
            content: content,
          },
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
        }
      }

      query.id && querySql.push(`(v.id = ${query.id})`);
      query.id_list && querySql.push(`(v.id in (${query.id_list}))`);
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

  async putVariants(query: { id: number; product_id: number; product_content: any; variant_content: any }[]) {
    try {
      for (const data of query) {
        await db.query(
          `UPDATE \`${this.app}\`.t_variants
           SET ?
           WHERE id = ?`,
          [{ content: JSON.stringify(data.variant_content) }, data.id]
        );
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

  async postCustomerInvoice(obj: { orderID: any; invoice_data: any; orderData: any }) {
    await this.putOrder({
      id: obj.orderData.id,
      orderData: obj.orderData.orderData,
      status: obj.orderData.status,
    });
    await new Invoice(this.app).postCheckoutInvoice(obj.orderID, obj.invoice_data.getPaper == 'Y');
    await new Invoice(this.app).updateInvoice({
      orderID: obj.orderData.cart_token,
      invoice_data: obj.invoice_data,
    });
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

  async allowanceInvoice(obj: {
    invoiceID: string;
    allowanceData: any;
    orderID: string;
    orderData: any;
    allowanceInvoiceTotalAmount: string;
    itemList: any;
    invoiceDate: string;
  }) {
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

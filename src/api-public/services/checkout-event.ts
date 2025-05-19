import { UtTimer } from '../utils/ut-timer.js';
import { User } from './user.js';
import { Rebate } from './rebate.js';
import db from '../../modules/database.js';
import exception from '../../modules/exception.js';
import { IToken } from '../models/Auth.js';
import { Private_config } from '../../services/private_config.js';
import { ShipmentConfig, ShipmentConfig as Shipment_support_config } from '../config/shipment-config.js';
import { Stock } from './stock.js';
import { Shopee } from './shopee.js';
import { Recommend } from './recommend.js';
import { onlinePayArray } from '../models/glitter-finance.js';
import Tool from '../../modules/tool.js';
import { OrderEvent } from './order-event.js';
import { ManagerNotify } from './notify.js';
import { AutoFcm } from '../../public-config-initial/auto-fcm.js';
import { AutoSendEmail } from './auto-send-email.js';
import { Invoice } from './invoice.js';
import redis from '../../modules/redis.js';
import FinancialService, { JKO, LinePay, PayNow, PayPal } from './financial-service.js';
import { SMS } from './sms.js';
import { LineMessage } from './line-message.js';
import { Cart, Shopping, VoucherData } from './shopping.js';

type CheckoutInsertType = 'add' | 'preview' | 'manual' | 'manual-preview' | 'POS' | 'split';

export type CartItem = {
  id: string;
  spec: string[];
  count: number;
  sale_price: number;
  is_gift?: boolean;
  collection: string[];
  product_customize_tag: string[];
  title: string;
  preview_image: string;
  shipment_obj: { type: string; value: number };
  discount_price?: number;
  weight: number;
  rebate: number;
  designated_logistics: {
    type: 'all' | 'designated';
    group: string[];
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

export class CheckoutEvent {
  public app: string;
  public token?: IToken;
  public shopping: Shopping;

  constructor(app: string, token?: IToken) {
    this.app = app;
    this.token = token;
    this.shopping = new Shopping(this.app, this.token);
  }

  //取得有開啟的金流
  getPaymentSetting() {
    return JSON.parse(JSON.stringify(onlinePayArray()));
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
      language?: 'en-US' | 'zh-CN' | 'zh-TW';
      pos_info?: any; //POS結帳資訊;
      invoice_select?: string;
      pre_order?: boolean;
      voucherList?: any;
      isExhibition?: boolean;
      client_ip_address?: string;
      fbc?: string;
      fbp?: string;
      temp_cart_id?: string;
    },
    type: CheckoutInsertType = 'add',
    replace_order_id?: string
  ) {
    try {
      const utTimer = new UtTimer('TO-CHECKOUT');
      const checkPoint = utTimer.checkPoint;
      const userClass = new User(this.app);
      const rebateClass = new Rebate(this.app);
      let checkoutPayment = data.user_info?.payment;
      let scheduledData: any; // 不立刻查詢，只做占位宣告
      // 確認預設值
      data.line_items = (data.line_items || (data as any).lineItems) ?? [];
      data.isExhibition = data.checkOutType === 'POS' && (data.pos_store?.includes('exhibition_') ?? false);

      // 判斷是重新付款則取代
      if (replace_order_id) {
        const orderData = (
          await db.query(
            `SELECT *
             FROM \`${this.app}\`.t_checkout
             WHERE cart_token = ?
               AND status = 0;
            `,
            [replace_order_id]
          )
        )[0];

        if (!orderData) {
          throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout Error: Cannot find this orderID', null);
        }

        // 刪除指定的訂單記錄
        await db.query(
          `DELETE
           FROM \`${this.app}\`.t_checkout
           WHERE cart_token = ?
             AND status = 0;
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
            `SELECT *
             FROM \`${this.app}\`.t_checkout
             WHERE cart_token = ?
            `,
            [data.order_id]
          )
        )[0];
        if (order) {
          for (const b of order.orderData.lineItems) {
            const pdDqlData = (
              await this.shopping.getProduct({
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
            await this.shopping.updateVariantsWithSpec(variant, b.id, b.spec);

            // 更新資料庫中的商品內容
            await db.query(
              `UPDATE \`${this.app}\`.t_manager_post
               SET content = ?
               WHERE id = ?
              `,
              [JSON.stringify(pd), pdDqlData.id]
            );
          }
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
        throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout Error: No email and phone', null);
      }

      const checkOutType = data.checkOutType ?? 'manual';

      const getUserDataAsync = async (
        type: CheckoutInsertType,
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

        // 非 POS, split 者，根據 token 獲取用戶數據
        if (token?.userID && !['split', 'POS'].includes(type) && !['split', 'POS'].includes(checkOutType)) {
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
      const shipment: ShipmentConfig = await this.shopping.getShipmentRefer(data.user_info);

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

      checkPoint('set shipment');

      // 確保自訂配送表單的配置
      shipment_setting.custom_delivery = shipment_setting.custom_delivery
        ? await Promise.all(
            shipment_setting.custom_delivery.map(async (form: any) => {
              const config = await userClass.getConfigV2({
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
        editRecord: [],
      };

      if (!data.user_info?.name && userData && userData.userData) {
        const { name, phone } = userData.userData;
        carData.user_info = {
          ...carData.user_info,
          name,
          phone,
        };
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

          if (stock === Infinity) {
            show_understocking = false;
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
            preview_image: prod.preview_image && prod.preview_image[0],
            shipment_type: 'none',
            show_understocking: String(show_understocking), // 保持原本的 string 格式
          };
        } else {
          return prod.variants.find((dd: any) => dd.spec.join('-') === item.spec.join('-'));
        }
      }

      const store_info = await userClass.getConfigV2({ key: 'store-information', user_id: 'manager' });

      data.line_items = await Promise.all(
        data.line_items.map(async item => {
          const getProductData = (
            await this.shopping.getProduct({
              page: 0,
              limit: 1,
              id: `${item.id}`,
              status: 'inRange',
              channel: checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
              whereStore: checkOutType === 'POS' ? data.pos_store : undefined,
              setUserID: `${userData?.userID || ''}`,
            })
          ).data;

          // 搜尋此商品資料並存在
          if (getProductData) {
            const content = getProductData.content;
            const variant = getVariant(content, item);
            const count = Number(item.count);

            if (
              (Number.isInteger(variant.stock) || variant.show_understocking === 'false') &&
              !isNaN(count) &&
              count > 0
            ) {
              const isPOS = checkOutType === 'POS';
              const isPreOrderStore = store_info.pre_order_status;
              const isUnderstockingVisible = variant.show_understocking !== 'false';
              const isManualType = type === 'manual' || type === 'manual-preview';

              if (isPOS && isUnderstockingVisible && !data.isExhibition) {
                variant.stock = variant.stockList?.[data.pos_store!]?.count || 0;
              }

              if (variant.stock < item.count && isUnderstockingVisible && !isManualType) {
                if (isPOS || isPreOrderStore) {
                  item.pre_order = true;
                } else {
                  item.count = variant.stock;
                }
              }

              if (variant && item.count > 0) {
                const sale_price = (() => {
                  //POS允許自訂價格
                  if (checkOutType === 'POS' && (item as any).custom_price) {
                    return (item as any).custom_price;
                  } else {
                    return variant.sale_price;
                  }
                })();
                const origin_price = (() => {
                  //POS如果有自訂價格，則比較金額改成和原售價相比
                  if (checkOutType === 'POS' && (item as any).custom_price) {
                    return variant.sale_price;
                  } else {
                    return variant.origin_price;
                  }
                })();
                Object.assign(item, {
                  specs: content.specs,
                  language_data: content.language_data,
                  product_category: content.product_category,
                  preview_image: variant.preview_image || content.preview_image[0],
                  title: content.title,
                  sale_price: sale_price,
                  variant_sale_price: variant.sale_price,
                  origin_price: origin_price,
                  collection: content.collection,
                  sku: variant.sku,
                  stock: variant.stock,
                  show_understocking: variant.show_understocking,
                  stockList: variant.stockList,
                  weight: parseInt(variant.weight || '0', 10),
                  designated_logistics: content.designated_logistics ?? { type: 'all', list: [] },
                  product_customize_tag: content.product_customize_tag || [],
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

                console.log(`shipmentValue=>`, shipmentValue);
                item.shipment_obj = {
                  type: variant.shipment_type,
                  value: shipmentValue,
                };

                variant.shipment_weight = parseInt(variant.shipment_weight || '0', 10);
                carData.lineItems.push(item as any);

                // Update total price if not manual or giveaway
                // 要將sale_price修改成scheduled裡的price
                if (checkOutType == 'group_buy') {
                  if (!scheduledData) {
                    // 如果之前沒查詢過，才執行查詢 不這樣寫的話 -> 再按自動縮排時會自己打開
                    const sql = `WHERE JSON_CONTAINS(content->'$.pending_order', '"${data.temp_cart_id}"'`;
                    const scheduledDataQuery = `
                        SELECT *
                        FROM \`${this.app}\`.\`t_live_purchase_interactions\` ${sql});
                    `;
                    scheduledData = (await db.query(scheduledDataQuery, []))[0];
                    if (scheduledData) {
                      const { content } = scheduledData;
                      const productData = content.item_list.find((pb: any) => pb.id === item.id);

                      if (productData) {
                        const variantData = productData.content.variants.find(
                          (dd: any) => dd.spec.join('-') === item.spec.join('-')
                        );

                        if (variantData) {
                          item.sale_price = variantData.live_model.live_price;
                          carData.total += item.sale_price * item.count;
                        }
                      }
                    }
                  }
                } else if (type !== 'manual') {
                  if (content.productType.giveaway) {
                    variant.sale_price = 0;
                  } else {
                    carData.total += sale_price * item.count;
                  }
                }
              }

              if (!['preview', 'manual-preview'].includes(type) && variant.show_understocking !== 'false') {
                const remainingStock = Math.max(variant.stock - item.count, 0);
                variant.stock = remainingStock;

                if (type === 'POS') {
                  if (data.isExhibition) {
                    if (data.pos_store) {
                      await this.shopping.updateExhibitionActiveStock(data.pos_store, variant.variant_id, item.count);
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
                        if (data.checkOutType == 'group_buy') {
                          if (!scheduledData) {
                            // 如果之前沒查詢過，才執行查詢 ，不這樣寫的話 -> 再按自動縮排時會自己打開
                            const sql = `WHERE JSON_CONTAINS(content->'$.pending_order', '"${data.temp_cart_id}"'`;
                            const scheduledDataQuery = `
                                SELECT *
                                FROM \`${this.app}\`.\`t_live_purchase_interactions\` ${sql});
                            `;
                            scheduledData = (await db.query(scheduledDataQuery, []))[0];
                          }
                          // const scheduledData = (await db.query(scheduledDataQuery, []))[0];

                          if (scheduledData) {
                            const { content } = scheduledData;
                            const productData = content.item_list.find((pb: any) => pb.id === item.id);

                            if (productData) {
                              const variantData = productData.content.variants.find(
                                (dd: any) => dd.spec.join('-') === item.spec.join('-')
                              );

                              if (variantData) {
                                const stockService = new Stock(this.app, this.token);
                                const { stockList, deductionLog } = stockService.allocateStock(
                                  variantData.stockList,
                                  item.count
                                );

                                variantData.stockList = stockList;
                                item.deduction_log = deductionLog;
                                carData.scheduled_id = scheduledData.id;

                                // Update variants for scheduled data
                                await this.shopping.updateVariantsForScheduled(content, scheduledData.id);
                              }
                            }
                          }
                        } else {
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
                            await this.shopping.updateVariantsWithSpec(variant, item.id, item.spec);
                          }

                          // 更新資料庫
                          await db.query(
                            `UPDATE \`${this.app}\`.\`t_manager_post\`
                             SET ?
                             WHERE id = ${getProductData.id}`,
                            [{ content: JSON.stringify(content) }]
                          );
                        }
                        // 如果有 shopee_id，則同步庫存至蝦皮（Todo: 需要新增是否同步的選項）

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
        // 查詢歷史訂單 SQL
        const cartTokenSQL = `
            SELECT cart_token
            FROM \`${this.app}\`.t_checkout
            WHERE email IN (${[-99, userData?.userData?.email, userData?.userData?.phone]
              .filter(Boolean)
              .map(item => db.escape(item))
              .join(',')})
              AND order_status <> '-1'
        `;

        // 查詢商品購買紀錄
        const soldHistory = await db.query(
          `
              SELECT *
              FROM \`${this.app}\`.t_products_sold_history
              WHERE product_id IN (${[...maxProductMap.keys()].join(',')})
                AND order_id IN (${cartTokenSQL})
          `,
          []
        );

        // 使用 Map 計算歷史購買數量
        const purchaseHistory = new Map();
        for (const history of soldHistory) {
          const pid = Number(history.product_id);
          purchaseHistory.set(pid, (purchaseHistory.get(pid) ?? 0) + history.count);
        }

        // 更新當前訂單項目的歷史購買數量
        for (const item of data.line_items) {
          if (maxProductMap.has(item.id)) {
            item.buy_history_count = purchaseHistory.get(item.id) || 0;
          }
        }
      }

      checkPoint('set max product');

      // 商家設定物流達免運費條件之判斷
      carData.select_shipment_setting = data?.user_info?.shipment
        ? await userClass.getConfigV2({
            key: 'shipment_config_' + data.user_info.shipment,
            user_id: 'manager',
          })
        : {};
      const freeShipmnetNum = carData.select_shipment_setting?.cartSetting?.freeShipmnetTarget ?? 0;
      const isFreeShipment = freeShipmnetNum > 0 && carData.total >= freeShipmnetNum;

      // 計算運費
      carData.shipment_fee = isFreeShipment
        ? 0
        : this.shopping.getShipmentFee(data.user_info, carData.lineItems, shipment);
      carData.total += carData.shipment_fee;

      // 驗證購物金
      const f_rebate = await this.shopping.formatUseRebate(carData.total, carData.use_rebate);
      carData.useRebateInfo = f_rebate;
      carData.use_rebate = f_rebate.point;

      // 調整總金額
      carData.total -= carData.use_rebate;
      carData.code = data.code;
      carData.voucherList = [];
      checkPoint('set carData');

      if (userData && userData.account) {
        const userRebate = await rebateClass.getOneRebate({ user_id: userData.userID });
        carData.user_rebate_sum = userRebate?.point || 0;
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
          if (this.shopping.checkDuring(content)) {
            carData.distribution_info = content;
          }
        }
      }
      checkPoint('distribution code');

      // 自動新增訂單的優惠卷設定
      if (type !== 'manual' && type !== 'manual-preview') {
        // 過濾加購品與贈品
        carData.lineItems = carData.lineItems.filter(dd => {
          return !add_on_items.includes(dd) && !gift_product.includes(dd);
        });

        // 濾出可用的加購商品，避免折扣被double所以要stringify
        const c_carData = await this.shopping.checkVoucher(structuredClone(carData));

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
        await this.shopping.checkVoucher(carData);
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
          if (max_count) {
            dd.count = max_count;
            for (let a = 0; a < dd.count; a++) {
              can_add_gift = can_add_gift.filter(d1 => !d1.includes(dd.id)); // 移除已添加的贈品
            }
            carData.lineItems.push(dd);
          }
        });

        for (const giveawayData of carData.voucherList!!.filter(dd => dd.reBackType === 'giveaway')) {
          if (!giveawayData.add_on_products?.length) continue;

          const productPromises = giveawayData.add_on_products
            .map(async id => {
              const getGiveawayData = await this.shopping.getProduct({
                page: 0,
                limit: 1,
                id: `${id}`,
                status: 'inRange',
                channel: checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
                whereStore: checkOutType === 'POS' ? data.pos_store : undefined,
              });

              if (getGiveawayData?.data?.content) {
                const giveawayContent = getGiveawayData.data.content;
                giveawayContent.voucher_id = giveawayData.id;
                return giveawayContent;
              }

              return null;
            })
            .filter(Boolean);

          // 等待所有 add_on_products 產品資料同時獲取
          giveawayData.add_on_products = await Promise.all(productPromises);
        }
      }

      // 付款資訊設定
      const configData = await Private_config.getConfig({
        appName: this.app,
        key: 'glitter_finance',
      });
      const keyData: any = configData[0]?.value;
      if (keyData) {
        (carData as any).payment_info_custom = keyData.payment_info_custom;
      }

      await new Promise<void>(resolve => {
        let n = 0;
        (carData as any).payment_customer_form = (carData as any).payment_customer_form ?? [];
        keyData.payment_info_custom.map((item: any, index: number) => {
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

      // 線下付款
      (keyData as any).cash_on_delivery = (keyData as any).cash_on_delivery ?? { shipmentSupport: [] };
      (carData as any).payment_info_line_pay = keyData.payment_info_line_pay;
      (carData as any).payment_info_atm = keyData.payment_info_atm;
      (keyData as any).cash_on_delivery.shipmentSupport = (keyData as any).cash_on_delivery.shipmentSupport ?? [];
      //取得支援的Payment
      await this.setPaymentSetting({ carData: carData, checkoutPayment: checkoutPayment, keyData: keyData });

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

      // 商品材積重量與物流使用限制
      carData.lineItems.map(item => {
        carData.goodsWeight += item.weight * item.count;
      });

      const excludedValuesByTotal = new Set(['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C']);
      const excludedValuesByWeight = new Set(['normal', 'black_cat']);
      const logisticsGroupResult = await userClass.getConfig({ key: 'logistics_group', user_id: 'manager' });
      const logisticsGroup = logisticsGroupResult[0]?.value ?? [];

      const isExcludedByTotal = (dd: any) => {
        return carData.total > 20000 && excludedValuesByTotal.has(dd.value);
      };

      const isExcludedByWeight = (dd: any) => {
        return carData.goodsWeight > 20 && excludedValuesByWeight.has(dd.value);
      };

      const isIncludedInDesignatedLogistics = (dd: any) => {
        return carData.lineItems.every(item => {
          if (item.designated_logistics === undefined || item.designated_logistics.type === 'all') {
            return true;
          }

          for (const group of logisticsGroup) {
            if (item.designated_logistics.group.includes(group.key) && group.list.includes(dd.value)) {
              return true;
            }
          }

          return false;
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

      // 物流是否可使用判斷
      if (Array.isArray(carData.shipment_support)) {
        await Promise.all(
          carData.shipment_support.map(async sup => {
            return await userClass
              .getConfigV2({ key: 'shipment_config_' + sup, user_id: 'manager' })
              .then(r => {
                return this.getCartFormulaPass(carData, r);
              })
              .catch(() => {
                return true;
              });
          })
        ).then(dataArray => {
          carData.shipment_support = carData.shipment_support?.filter((_, index) => dataArray[index]);
        });
      }

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
            await this.shopping.insertVoucherHistory(userData.userID, carData.orderID, voucher.id);
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
      if (type === 'manual' || type === 'split') {
        carData.orderSource = type;
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
          includeDiscount: 'before',
          device: ['normal'],
          productOffStart: 'price_all',
          rebateEndDay: '30',
          macroLimited: 0,
          microLimited: 0,
          selectShipment: { type: 'all', list: [] },
        };
        carData.discount = data.discount;
        carData.voucherList = [tempVoucher];
        carData.customer_info = data.customer_info;
        carData.total = data.total ?? 0;
        carData.rebate = tempVoucher.rebate_total;
        if (tempVoucher.reBackType == 'shipment_free' || type == 'split') {
          carData.shipment_fee = 0;
        }
        if (tempVoucher.reBackType == 'rebate') {
          let customerData = await userClass.getUserData(data.email! || data.user_info.email, 'email_or_phone');
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
            customerData = await userClass.getUserData(data.email! || data.user_info.email, 'email_or_phone');
          }
        }

        await Promise.all(saveStockArray.map(dd => dd()));

        // 手動訂單新增
        await OrderEvent.insertOrder({
          cartData: carData,
          status: data.pay_status as any,
          app: this.app,
        });

        new ManagerNotify(this.app).checkout({ orderData: carData, status: 0 });
        const emailList = new Set([carData.customer_info, carData.user_info].map(dd => dd && dd.email));
        for (const email of emailList) {
          if (email) {
            await AutoFcm.orderChangeInfo({
              app: this.app,
              tag: 'order-create',
              order_id: carData.orderID,
              phone_email: email,
            });
            AutoSendEmail.customerOrder(
              this.app,
              'auto-email-order-create',
              carData.orderID,
              email,
              carData.language!!
            );
          }
        }

        checkPoint('manual order done');
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
            carData.discount += manualVoucher.discount;
            carData.voucherList.push(manualVoucher);
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

        if (data.invoice_select !== 'nouse') {
          // POS 結帳者，不考慮發票開立時機設定，直接開立
          try {
            (carData as any).invoice = await new Invoice(this.app).postCheckoutInvoice(
              carData,
              carData.user_info.send_type !== 'carrier'
            );
          } catch (e) {
            console.error(e);
          }
        }
        await OrderEvent.insertOrder({
          cartData: carData,
          status: data.pay_status as any,
          app: this.app,
        });
        await trans.commit();
        await trans.release();
        await Promise.all(saveStockArray.map(dd => dd()));
        await this.shopping.releaseCheckout((data.pay_status as any) ?? 0, carData.orderID);
        checkPoint('release pos checkout');
        for (const email of new Set(
          [carData.customer_info, carData.user_info].map(dd => {
            return dd && dd.email;
          })
        )) {
          if (email) {
            await AutoFcm.orderChangeInfo({
              app: this.app,
              tag: 'order-create',
              order_id: carData.orderID,
              phone_email: email,
            });
            AutoSendEmail.customerOrder(
              this.app,
              'auto-email-order-create',
              carData.orderID,
              email,
              carData.language!!
            );
          }
        }
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
          // 使用錢包結帳者，不考慮發票開立時機設定
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
        // 金流處理
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
            kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&jkopay=true&return=${id}`;
            kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=jkopay&return=${id}`;
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
            for (const phone of new Set(
              [carData.customer_info, carData.user_info].map(dd => {
                return dd && dd.phone;
              })
            )) {
              let sns = new SMS(this.app);
              await sns.sendCustomerSns('auto-sns-order-create', carData.orderID, phone);
              console.info('訂單簡訊寄送成功');
            }

            if (carData.customer_info.lineID) {
              let line = new LineMessage(this.app);
              await line.sendCustomerLine('auto-line-order-create', carData.orderID, carData.customer_info.lineID);
              console.info('訂單line訊息寄送成功');
            }
            // if (carData.customer_info.fb_id) {
            //     let fb = new FbMessage(this.app)
            //     await fb.sendCustomerFB('auto-fb-order-create', carData.orderID, carData.customer_info.fb_id);
            //     console.info('訂單FB訊息寄送成功');
            // }
            for (const email of new Set(
              [carData.customer_info, carData.user_info].map(dd => {
                return dd && dd.email;
              })
            )) {
              if (email) {
                await AutoFcm.orderChangeInfo({
                  app: this.app,
                  tag: 'order-create',
                  order_id: carData.orderID,
                  phone_email: email,
                });
                AutoSendEmail.customerOrder(
                  this.app,
                  'auto-email-order-create',
                  carData.orderID,
                  email,
                  carData.language!!
                );
              }
            }

            await this.shopping.releaseVoucherHistory(carData.orderID, 1);
            checkPoint('default release checkout');
            return {
              off_line: true,
              return_url: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
            };
        }
      }
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout Func Error:' + e, null);
    }
  }

  /**
   * 可使用的金流列表
   * 這邊要把所有線上跟線下付款可使用的金流整理好後放進Payment Setting，前端只需透過Payment Setting拿資料
   * */
  public async setPaymentSetting(obj: { carData: any; keyData: any; checkoutPayment: string }) {
    let { carData, keyData, checkoutPayment } = obj;
    // 線上金流是否可使用判斷，填入付款資訊與方式
    let payment_setting = this.getPaymentSetting().filter((dd: any) => {
      const k = (keyData as any)[dd.key];
      if (!k || !k.toggle || !this.getCartFormulaPass(carData, k)) return false;

      dd.custome_name = k.custome_name;

      if (carData.orderSource === 'POS') {
        if (dd.key === 'ut_credit_card') {
          dd.pwd = k['pwd'];
        }
        return dd.type === 'pos';
      }
      return dd.type !== 'pos';
    });
    // 線下金流是否可使用判斷
    (carData as any).off_line_support = keyData.off_line_support ?? {};
    Object.entries((carData as any).off_line_support).map(([key, value]) => {
      if (!value) return;
      if (key === 'cash_on_delivery') {
        (carData as any).off_line_support[key] = this.getCartFormulaPass(carData, keyData[key]);
        if ((carData as any).off_line_support[key]) {
          payment_setting.push({ key: 'cash_on_delivery', name: '貨到付款' });
        }
      } else if (key === 'atm') {
        (carData as any).off_line_support[key] = this.getCartFormulaPass(carData, keyData.payment_info_atm);
        if ((carData as any).off_line_support[key]) {
          payment_setting.push({ key: 'atm', name: 'atm轉帳' });
        }
      } else if (key === 'line') {
        (carData as any).off_line_support[key] = this.getCartFormulaPass(carData, keyData.payment_info_line_pay);
        if ((carData as any).off_line_support[key]) {
          payment_setting.push({ key: 'line', name: 'line轉帳' });
        }
      } else {
        // 自訂線下付款
        const customPay = keyData.payment_info_custom.find((c: { id: string }) => c.id === key);
        (carData as any).off_line_support[key] = this.getCartFormulaPass(carData, customPay ?? {});
        if ((carData as any).off_line_support[key]) {
          payment_setting.push({ key: key, name: customPay.name });
        }
      }
    });
    //取得支援付款方式
    (carData as any).payment_setting = payment_setting;
    //避免初次載入沒有預設金流的BUG
    checkoutPayment =
      checkoutPayment || ((carData as any).payment_setting[0] && (carData as any).payment_setting[0].key);
    console.log('checkoutPayment', checkoutPayment);
    console.log('onlinePayArray', onlinePayArray);
    // 透過特定金流，取得指定物流
    carData.shipment_support =
      (() => {
        if (checkoutPayment === 'cash_on_delivery') {
          console.log(`shipment_support-cash-delivery`);
          return (keyData as any).cash_on_delivery;
        } else if (
          this.getPaymentSetting()
            .map((item: any) => item.key)
            .includes(checkoutPayment)
        ) {
          console.log(`shipment_support-online-pay-${checkoutPayment}`);
          return keyData[checkoutPayment];
        } else if (checkoutPayment === 'atm') {
          console.log(`shipment_support-atm`);
          return keyData.payment_info_atm;
        } else if (checkoutPayment === 'line') {
          console.log(`shipment_support-line`);
          return keyData.payment_info_line_pay;
        } else {
          console.log(`shipment_support-custom`);
          // 自訂線下付款
          const customPay = keyData.payment_info_custom.find((c: { id: string }) => c.id === checkoutPayment);
          return customPay ?? {};
        }
      })().shipmentSupport ?? [];
  }

  // 驗證消費金額能否使用此金物流
  public getCartFormulaPass(
    carData: any,
    keyData: {
      cartSetting?: {
        minimumTotal: number;
        maximumTotal: number;
        orderFormula?: string[];
      };
    }
  ) {
    const data = keyData.cartSetting;
    if (!data || data.orderFormula === undefined) return true;

    const formulaSet = new Set(data.orderFormula);
    const total =
      carData.total -
      (formulaSet.has('shipment_fee') ? 0 : carData.shipment_fee) +
      (formulaSet.has('discount') || !carData.discount ? 0 : carData.discount) +
      (formulaSet.has('use_rebate') ? 0 : carData.use_rebate);

    return (!data.minimumTotal || total >= data.minimumTotal) && (!data.maximumTotal || total <= data.maximumTotal);
  }
}

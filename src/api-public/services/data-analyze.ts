import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import Tool from '../../modules/tool.js';
import moment from 'moment';
import { IToken } from '../models/Auth.js';
import { saasConfig } from '../../config.js';
import { Shopping } from './shopping.js';
import { User } from './user.js';
import { Workers } from './workers.js';

function convertTimeZone(date: string) {
  return `CONVERT_TZ(${date}, '+00:00', '+08:00')`;
}

export class DataAnalyze {
  app: string;

  token?: IToken;

  constructor(app: string, token?: IToken) {
    this.app = app;
    this.token = token;
  }

  async workerExample(data: { type: 0 | 1; divisor: number }) {
    try {
      // 以 t_voucher_history 更新資料舉例
      const jsonData = await db.query(`SELECT * FROM \`${this.app}\`.t_voucher_history`, []);
      const t0 = performance.now();

      // 單線程插入資料
      if (data.type === 0) {
        for (const record of jsonData) {
          await db.query(
            `UPDATE \`${this.app}\`.\`t_voucher_history\` SET ? WHERE id = ?
            `,
            [record, record.id]
          );
        }
        return {
          type: 'single',
          divisor: 1,
          executionTime: `${(performance.now() - t0).toFixed(3)} ms`,
        };
      }

      // 多線程插入資料
      const formatJsonData = jsonData.map((record: any) => {
        return {
          sql: `UPDATE \`${this.app}\`.\`t_voucher_history\` SET ? WHERE id = ?
          `,
          data: [record, record.id],
        };
      });

      const result = Workers.query({
        queryList: formatJsonData,
        divisor: data.divisor,
      });
      return result;
    } catch (error) {
      throw exception.BadRequestError('INTERNAL_SERVER_ERROR', 'Worker example is Failed. ' + error, null);
    }
  }

  async getDataAnalyze(tags: string[], query: any) {
    try {
      const timer: Record<string, number> = {};
      const result: Record<string, any> = {};
      query = query || '{}';

      const taskMap: Record<string, () => Promise<any>> = {
        recent_active_user: () => this.getRecentActiveUser(),
        recent_sales: () => this.getSalesInRecentMonth(),
        recent_orders: () => this.getOrdersInRecentMonth(),
        hot_products: () => this.getHotProducts('month'),
        hot_products_all: () => this.getHotProducts('all', query),
        hot_products_today: () => this.getHotProducts('day'),
        order_avg_sale_price: () => this.getOrderAvgSalePrice(query),
        order_avg_sale_price_month: () => this.getOrderAvgSalePriceMonth(query),
        order_avg_sale_price_year: () => this.getOrderAvgSalePriceYear(query),
        order_avg_sale_price_custom: () => this.getOrderAvgSalePriceCustomer(query),
        orders_per_month_1_year: () => this.getOrdersPerMonth1Year(query),
        orders_per_month_2_week: () => this.getOrdersPerMonth2week(query),
        orders_per_month: () => this.getOrdersPerMonth(query),
        orders_per_month_custom: () => this.getOrdersPerMonthCustom(query),
        sales_per_month_2_week: () => this.getSalesPerMonth2week(query),
        sales_per_month_1_year: () => this.getSalesPerMonth1Year(query),
        sales_per_month_1_month: () => this.getSalesPerMonth(query),
        sales_per_month_custom: () => this.getSalesPerMonthCustom(query),
        order_today: () => this.getOrderToDay(),
        recent_register_today: () => this.getRegisterYear(),
        recent_register_week: () => this.getRegisterYear(),
        recent_register_month: () => this.getRegisterMonth(),
        recent_register_year: () => this.getRegisterYear(),
        recent_register_custom: () => this.getRegisterCustom(query),
        active_recent_custom: () => this.getActiveRecentCustom(query),
        active_recent_month: () => this.getActiveRecentMonth(),
        active_recent_year: () => this.getActiveRecentYear(),
        active_recent_2week: () => this.getActiveRecentWeek(),
      };

      await Promise.all(
        tags.map(async tag => {
          if (taskMap[tag]) {
            const start = Date.now();
            try {
              result[tag] = await taskMap[tag]();
            } catch (error) {
              console.error(`Error processing tag ${tag}:`, error);
              result[tag] = null; // 或根據需求處理錯誤結果
            } finally {
              timer[tag] = (Date.now() - start) / 1000;
            }
          }
        })
      );

      console.info('Analyze timer =>', timer);
      return result;
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', `getDataAnalyze Error: ${error}`, null);
    }
  }

  async getOrderCountingSQL() {
    return await new User(this.app).getCheckoutCountingModeSQL();
  }

  async getRecentActiveUser() {
    try {
      const recentSQL = `
          SELECT *
          FROM \`${this.app}\`.t_user
          WHERE online_time BETWEEN DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND NOW();
      `;
      const recent_users = await db.query(recentSQL, []);
      const monthSQL = `
          SELECT *
          FROM \`${this.app}\`.t_user
          WHERE MONTH (online_time) = MONTH (NOW()) AND YEAR (online_time) = YEAR (NOW());
      `;
      const month_users = await db.query(monthSQL, []);
      return { recent: recent_users.length, months: month_users.length };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
    }
  }

  async getSalesInRecentMonth() {
    try {
      const orderCountingSQL = await this.getOrderCountingSQL();

      const getCheckoutsSQL = (monthOffset: number) => `
        SELECT *
        FROM \`${this.app}\`.t_checkout
        WHERE MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL ${monthOffset} MONTH))
        AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL ${monthOffset} MONTH))
        AND (${orderCountingSQL});
      `;

      const calculateTotal = (checkouts: any[]): number =>
        checkouts.reduce((total, checkout) => total + parseInt(checkout.orderData.total, 10), 0);

      const recentMonthCheckouts = await db.query(getCheckoutsSQL(0), []);
      const previousMonthCheckouts = await db.query(getCheckoutsSQL(1), []);

      const recent_month_total = calculateTotal(recentMonthCheckouts);
      const previous_month_total = calculateTotal(previousMonthCheckouts);

      const gap = previous_month_total
        ? Math.floor(((recent_month_total - previous_month_total) / previous_month_total) * 10000) / 10000
        : 0;

      return { recent_month_total, previous_month_total, gap };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getSalesInRecentMonth error: ' + e, null);
    }
  }

  async getHotProducts(duration: 'month' | 'day' | 'all', query: string = '{}') {
    try {
      const qData = JSON.parse(query);
      const sqlConditions: string[] = [];

      // 處理自訂日期篩選
      if (qData.filter_date === 'custom' && qData.start && qData.end) {
        const startDate = `'${Tool.replaceDatetime(qData.start)}'`;
        const endDate = `'${Tool.replaceDatetime(qData.end)}'`;
        sqlConditions.push(`created_time BETWEEN ${startDate} AND ${endDate}`);
      } else {
        // 預設時間範圍
        const dateRanges: Record<string, string> = {
          today: '1 DAY',
          week: '7 DAY',
          '1m': '30 DAY',
          year: '1 YEAR',
        };

        if (qData.filter_date && dateRanges[qData.filter_date]) {
          sqlConditions.push(
            `created_time BETWEEN DATE_SUB(NOW(), INTERVAL ${dateRanges[qData.filter_date]}) AND NOW()`
          );
        }
      }

      // 處理訂單來源
      if (qData.come_from && qData.come_from !== 'all') {
        const sourceCondition: Record<string, string> = {
          website: `(orderData->>'$.orderSource' <> 'POS')`,
          store: `(orderData->>'$.orderSource' = 'POS')`,
        };
        sqlConditions.push(
          sourceCondition[qData.come_from] || `(orderData->>'$.pos_info.where_store' = '${qData.come_from}')`
        );
      }

      // 組裝 SQL 查詢
      const orderCountingSQL = await this.getOrderCountingSQL();
      const checkoutSQL = `
        SELECT * 
        FROM \`${this.app}\`.t_checkout
        WHERE ${
          duration === 'day'
            ? `created_time BETWEEN NOW() AND NOW() + INTERVAL 1 DAY - INTERVAL 1 SECOND`
            : duration === 'month'
              ? `created_time BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`
              : sqlConditions.length
                ? sqlConditions.join(' AND ')
                : '1=1'
        }
        AND (${orderCountingSQL});
      `;

      const checkouts = await db.query(checkoutSQL, []);

      // 使用 Map 儲存產品統計
      const productMap = new Map<string, any>();
      const collectionSales = new Map<string, { count: number; sale_price: number }>();

      checkouts.forEach(({ orderData }: { orderData: any }) => {
        orderData.lineItems?.forEach((item: any) => {
          const existing = productMap.get(item.title);
          const collections = new Set(item.collection.filter((c: string) => c.trim().length > 0));

          item.count = Tool.floatAdd(item.count, 0);
          if (existing) {
            existing.count += item.count;
            existing.sale_price += item.sale_price * item.count;
          } else {
            productMap.set(item.title, {
              title: item.title,
              count: item.count,
              collection: [...collections],
              preview_image: item.preview_image,
              sale_price: item.sale_price,
              pos_info: orderData.pos_info,
            });
          }

          // 計算 collection 銷售
          collections.forEach((col: any) => {
            if (!collectionSales.has(col)) {
              collectionSales.set(col, { count: 0, sale_price: 0 });
            }
            const colData = collectionSales.get(col)!;
            colData.count += item.count;
            colData.sale_price += item.sale_price * item.count;
          });
        });
      });

      // 排序處理
      const sortedCollections = [...collectionSales.entries()]
        .map(([collection, data]) => ({
          collection: collection.replace(/\//g, ' / '),
          ...data,
        }))
        .sort((a, b) => b.sale_price - a.sale_price);

      const finalProductList = [...productMap.values()].sort((a, b) => b.count - a.count);
      const topProducts = finalProductList.slice(0, 10);

      return {
        series: topProducts.map(p => p.count),
        categories: topProducts.map(p => p.title),
        product_list: finalProductList,
        sorted_collections: sortedCollections,
      };
    } catch (e) {
      console.error('getHotProducts error:', e);
      throw exception.BadRequestError('BAD_REQUEST', `getHotProducts error: ${e}`, null);
    }
  }

  async getOrdersInRecentMonth() {
    try {
      const orderCountingSQL = await this.getOrderCountingSQL();

      const getCheckoutCountSQL = (monthOffset: number) => `
        SELECT id
        FROM \`${this.app}\`.t_checkout
        WHERE MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL ${monthOffset} MONTH))
        AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL ${monthOffset} MONTH))
        AND ${orderCountingSQL};
      `;

      const recentMonthCheckouts = await db.query(getCheckoutCountSQL(0), []);
      const previousMonthCheckouts = await db.query(getCheckoutCountSQL(1), []);

      const recent_month_total = recentMonthCheckouts.length;
      const previous_month_total = previousMonthCheckouts.length;

      let gap = 0;
      if (previous_month_total > 0) {
        gap = Math.floor(((recent_month_total - previous_month_total) / previous_month_total) * 10000) / 10000;
      }

      return { recent_month_total, previous_month_total, gap };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getOrdersInRecentMonth error: ' + e, null);
    }
  }

  async getOrdersPerMonth2week(query: string) {
    try {
      const qData = JSON.parse(query);
      const orderCountingSQL = await this.getOrderCountingSQL();

      // 初始化陣列（長度為 14，初始值為 0）
      const countArray = Array(14).fill(0);
      const countArrayPos = Array(14).fill(0);
      const countArrayWeb = Array(14).fill(0);
      const countArrayStore = Array(14).fill(0);

      // 產生 14 個 SQL 查詢
      const queries = Array.from({ length: 14 }, async (_, index) => {
        const dayOffset = `DATE_SUB(DATE(NOW()), INTERVAL ${index} DAY)`;
        const monthCheckoutSQL = `
          SELECT orderData->>'$.orderSource' as orderSource, orderData
          FROM \`${this.app}\`.t_checkout
          WHERE DATE(${convertTimeZone('created_time')}) = ${dayOffset}
          AND ${orderCountingSQL};
        `;

        return db.query(monthCheckoutSQL, []).then(data => {
          let total = 0,
            total_pos = 0,
            total_web = 0,
            total_store = 0;

          for (const checkout of data) {
            if (checkout.orderSource === 'POS') {
              total_pos += 1;
              if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                total_store += 1;
              }
            } else {
              total_web += 1;
            }
            total += 1;
          }

          // 直接存入陣列，避免物件排序
          countArray[index] = total;
          countArrayPos[index] = total_pos;
          countArrayWeb[index] = total_web;
          countArrayStore[index] = total_store;
        });
      });

      // 等待所有 SQL 查詢完成
      await Promise.all(queries);

      return { countArray, countArrayPos, countArrayStore, countArrayWeb };
    } catch (e) {
      console.error('getOrdersPerMonth2week 錯誤:', e);
      throw exception.BadRequestError('BAD_REQUEST', `getOrdersPerMonth2week 錯誤: ${e}`, null);
    }
  }

  async getOrdersPerMonth(query: string) {
    try {
      const qData = JSON.parse(query);
      const orderCountingSQL = await this.getOrderCountingSQL();

      // 初始化陣列（長度 30，預設值 0）
      const countArray = Array(30).fill(0);
      const countArrayPos = Array(30).fill(0);
      const countArrayWeb = Array(30).fill(0);
      const countArrayStore = Array(30).fill(0);

      // 產生 30 個 SQL 查詢
      const queries = Array.from({ length: 30 }, async (_, index) => {
        const dayOffset = `DATE_SUB(DATE(NOW()), INTERVAL ${index} DAY)`;
        const monthCheckoutSQL = `
          SELECT orderData->>'$.orderSource' as orderSource, orderData
          FROM \`${this.app}\`.t_checkout
          WHERE DATE(${convertTimeZone('created_time')}) = ${dayOffset}
          AND ${orderCountingSQL};
        `;

        return db.query(monthCheckoutSQL, []).then(data => {
          let total = 0,
            total_pos = 0,
            total_web = 0,
            total_store = 0;

          for (const checkout of data) {
            if (checkout.orderSource === 'POS') {
              total_pos += 1;
              if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                total_store += 1;
              }
            } else {
              total_web += 1;
            }
            total += 1;
          }

          // 直接存入陣列，避免物件排序
          countArray[index] = total;
          countArrayPos[index] = total_pos;
          countArrayWeb[index] = total_web;
          countArrayStore[index] = total_store;
        });
      });

      // 等待所有 SQL 查詢完成
      await Promise.all(queries);

      return { countArray, countArrayPos, countArrayStore, countArrayWeb };
    } catch (e) {
      console.error('getOrdersPerMonth 錯誤:', e);
      throw exception.BadRequestError('BAD_REQUEST', `getOrdersPerMonth 錯誤: ${e}`, null);
    }
  }

  async getOrdersPerMonthCustom(query: string) {
    try {
      const qData = JSON.parse(query);
      const orderCountingSQL = await this.getOrderCountingSQL();

      // 計算時間區間天數
      const days = this.diffDates(new Date(qData.start), new Date(qData.end));
      const endDate = Tool.replaceDatetime(qData.end);

      // 初始化陣列
      const countArray = Array(days).fill(0);
      const countArrayPos = Array(days).fill(0);
      const countArrayWeb = Array(days).fill(0);
      const countArrayStore = Array(days).fill(0);

      // 產生 SQL 查詢
      const queries = Array.from({ length: days }, async (_, index) => {
        const dayOffset = `DATE_SUB(DATE("${endDate}"), INTERVAL ${index} DAY)`;
        const monthCheckoutSQL = `
          SELECT orderData->>'$.orderSource' as orderSource, orderData
          FROM \`${this.app}\`.t_checkout
          WHERE DATE(${convertTimeZone('created_time')}) = ${dayOffset}
          AND ${orderCountingSQL};
        `;

        return db.query(monthCheckoutSQL, []).then(data => {
          let total = 0,
            total_pos = 0,
            total_web = 0,
            total_store = 0;

          for (const checkout of data) {
            if (checkout.orderSource === 'POS') {
              total_pos += 1;
              if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                total_store += 1;
              }
            } else {
              total_web += 1;
            }
            total += 1;
          }

          // 直接存入陣列，避免物件排序
          countArray[index] = total;
          countArrayPos[index] = total_pos;
          countArrayWeb[index] = total_web;
          countArrayStore[index] = total_store;
        });
      });

      // 等待所有 SQL 查詢完成
      await Promise.all(queries);

      return { countArray, countArrayPos, countArrayStore, countArrayWeb };
    } catch (e) {
      console.error('getOrdersPerMonthCustom 錯誤:', e);
      throw exception.BadRequestError('BAD_REQUEST', `getOrdersPerMonthCustom 錯誤: ${e}`, null);
    }
  }

  async getOrdersPerMonth1Year(query: string) {
    try {
      const qData = JSON.parse(query);
      const orderCountingSQL = await this.getOrderCountingSQL();

      // 初始化陣列
      const countArray = Array(12).fill(0);
      const countArrayPos = Array(12).fill(0);
      const countArrayWeb = Array(12).fill(0);
      const countArrayStore = Array(12).fill(0);

      // 產生 SQL 查詢
      const queries = Array.from({ length: 12 }, async (_, index) => {
        const monthOffset = `DATE_FORMAT(DATE_SUB(${convertTimeZone('NOW()')}, INTERVAL ${index} MONTH), '%Y-%m')`;
        const monthCheckoutSQL = `
          SELECT orderData->>'$.orderSource' as orderSource, orderData
          FROM \`${this.app}\`.t_checkout
          WHERE DATE_FORMAT(${convertTimeZone('created_time')}, '%Y-%m') = ${monthOffset}
          AND ${orderCountingSQL};
        `;

        return db.query(monthCheckoutSQL, []).then(data => {
          let total = 0,
            total_pos = 0,
            total_web = 0,
            total_store = 0;

          for (const checkout of data) {
            if (checkout.orderSource === 'POS') {
              total_pos += 1;
              if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                total_store += 1;
              }
            } else {
              total_web += 1;
            }
            total += 1;
          }

          countArray[index] = total;
          countArrayPos[index] = total_pos;
          countArrayWeb[index] = total_web;
          countArrayStore[index] = total_store;
        });
      });

      // 等待所有 SQL 查詢完成
      await Promise.all(queries);

      return { countArray, countArrayPos, countArrayStore, countArrayWeb };
    } catch (e) {
      console.error('getOrdersPerMonth1Year 錯誤:', e);
      throw exception.BadRequestError('BAD_REQUEST', `getOrdersPerMonth1Year 錯誤: ${e}`, null);
    }
  }

  async getSalesPerMonth1Year(query: string) {
    try {
      const qData = JSON.parse(query);
      const orderCountingSQL = await this.getOrderCountingSQL();
      const countArray: any = {};
      const countArrayPos: any = {};
      const countArrayWeb: any = {};
      const countArrayStore: any = {};

      let pass = 0;
      await new Promise(resolve => {
        for (let index = 0; index < 12; index++) {
          const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                            AND ${orderCountingSQL};
                    `;
          db.query(monthCheckoutSQL, []).then(data => {
            pass++;
            let total = 0;
            let total_pos = 0;
            let total_web = 0;
            let total_store = 0;
            data.map((checkout: any) => {
              if (checkout.orderData.orderSource === 'POS') {
                total_pos += parseInt(checkout.orderData.total, 10);
                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                  total_store += parseInt(checkout.orderData.total, 10);
                }
              } else {
                total_web += parseInt(checkout.orderData.total, 10);
              }
              total += parseInt(checkout.orderData.total, 10);
            });
            countArrayStore[index] = total_store;
            countArrayPos[index] = total_pos;
            countArrayWeb[index] = total_web;
            countArray[index] = total;
            if (pass === 12) {
              resolve(true);
            }
          });
        }
      });

      return {
        countArray: Object.keys(countArray)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArray[dd];
          }),
        countArrayPos: Object.keys(countArrayPos)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayPos[dd];
          }),
        countArrayStore: Object.keys(countArrayStore)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayStore[dd];
          }),
        countArrayWeb: Object.keys(countArrayWeb)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayWeb[dd];
          }),
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
    }
  }

  async getSalesPerMonth2week(query: string) {
    try {
      const countArray: any = {};
      const countArrayPos: any = {};
      const countArrayWeb: any = {};
      const countArrayStore: any = {};

      const qData = JSON.parse(query);
      const orderCountingSQL = await this.getOrderCountingSQL();

      let pass = 0;
      await new Promise(resolve => {
        for (let index = 0; index < 14; index++) {
          const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                            AND ${orderCountingSQL};
                    `;
          db.query(monthCheckoutSQL, []).then(data => {
            pass++;
            let total = 0;
            let total_pos = 0;
            let total_web = 0;
            let total_store = 0;
            data.map((checkout: any) => {
              if (checkout.orderData.orderSource === 'POS') {
                total_pos += parseInt(checkout.orderData.total, 10);
                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                  total_store += parseInt(checkout.orderData.total, 10);
                }
              } else {
                total_web += parseInt(checkout.orderData.total, 10);
              }
              total += parseInt(checkout.orderData.total, 10);
            });
            countArrayStore[index] = total_store;
            countArrayPos[index] = total_pos;
            countArrayWeb[index] = total_web;
            countArray[index] = total;
            if (pass === 14) {
              resolve(true);
            }
          });
        }
      });

      return {
        countArray: Object.keys(countArray)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArray[dd];
          }),
        countArrayPos: Object.keys(countArrayPos)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayPos[dd];
          }),
        countArrayStore: Object.keys(countArrayStore)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayStore[dd];
          }),
        countArrayWeb: Object.keys(countArrayWeb)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayWeb[dd];
          }),
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
    }
  }

  async getSalesPerMonth(query: string) {
    try {
      const countArray: any = {};
      const countArrayPos: any = {};
      const countArrayWeb: any = {};
      const countArrayStore: any = {};
      const qData = JSON.parse(query);
      const orderCountingSQL = await this.getOrderCountingSQL();

      let pass = 0;
      await new Promise(resolve => {
        for (let index = 0; index < 30; index++) {
          const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                            AND ${orderCountingSQL};
                    `;
          db.query(monthCheckoutSQL, []).then(data => {
            pass++;
            let total = 0;
            let total_pos = 0;
            let total_web = 0;
            let total_store = 0;
            data.map((checkout: any) => {
              if (checkout.orderData.orderSource === 'POS') {
                total_pos += parseInt(checkout.orderData.total, 10);
                if (
                  qData.come_from &&
                  qData.come_from.includes('store_') &&
                  Shopping.isComeStore(checkout.orderData, qData)
                ) {
                  total_store += parseInt(checkout.orderData.total, 10);
                }
              } else {
                total_web += parseInt(checkout.orderData.total, 10);
              }
              total += parseInt(checkout.orderData.total, 10);
            });
            countArrayStore[index] = total_store;
            countArrayPos[index] = total_pos;
            countArrayWeb[index] = total_web;
            countArray[index] = total;
            if (pass === 30) {
              resolve(true);
            }
          });
        }
      });

      return {
        countArray: Object.keys(countArray)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArray[dd];
          }),
        countArrayPos: Object.keys(countArrayPos)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayPos[dd];
          }),
        countArrayStore: Object.keys(countArrayStore)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayStore[dd];
          }),
        countArrayWeb: Object.keys(countArrayWeb)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayWeb[dd];
          }),
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
    }
  }

  diffDates(startDateObj: Date, endDateObj: Date) {
    var timeDiff = Math.abs(endDateObj.getTime() - startDateObj.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }

  async getSalesPerMonthCustom(query: string) {
    try {
      const countArray: any = {};
      const countArrayPos: any = {};
      const countArrayWeb: any = {};
      const countArrayStore: any = {};

      const qData = JSON.parse(query);

      const days = this.diffDates(new Date(qData.start), new Date(qData.end));
      const formatEndDate = `"${Tool.replaceDatetime(qData.end)}"`;
      const orderCountingSQL = await this.getOrderCountingSQL();

      let pass = 0;
      await new Promise(resolve => {
        for (let index = 0; index < days; index++) {
          const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                            AND ${orderCountingSQL};
                    `;
          db.query(monthCheckoutSQL, []).then(data => {
            pass++;
            let total = 0;
            let total_pos = 0;
            let total_web = 0;
            let total_store = 0;
            data.map((checkout: any) => {
              if (checkout.orderData.orderSource === 'POS') {
                total_pos += parseInt(checkout.orderData.total, 10);
                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                  total_store += parseInt(checkout.orderData.total, 10);
                }
              } else {
                total_web += parseInt(checkout.orderData.total, 10);
              }
              total += parseInt(checkout.orderData.total, 10);
            });
            countArrayStore[index] = total_store;
            countArrayPos[index] = total_pos;
            countArrayWeb[index] = total_web;
            countArray[index] = total;
            if (pass === days) {
              resolve(true);
            }
          });
        }
      });

      return {
        countArray: Object.keys(countArray)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArray[dd];
          }),
        countArrayPos: Object.keys(countArrayPos)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayPos[dd];
          }),
        countArrayStore: Object.keys(countArrayStore)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayStore[dd];
          }),
        countArrayWeb: Object.keys(countArrayWeb)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayWeb[dd];
          }),
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
    }
  }

  async getOrderAvgSalePriceYear(query: string) {
    try {
      const qData = JSON.parse(query);
      const countArray: any = {};
      const countArrayPos: any = {};
      const countArrayWeb: any = {};
      const countArrayStore: any = {};
      const orderCountingSQL = await this.getOrderCountingSQL();
      let pass = 0;
      await new Promise(resolve => {
        for (let index = 0; index < 12; index++) {
          const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                            AND ${orderCountingSQL};
                    `;
          db.query(monthCheckoutSQL, []).then(data => {
            pass++;
            let total = 0;
            let total_pos = 0;
            let total_web = 0;
            let total_store = 0;
            let pos_count = 0;
            let store_count = 0;
            let web_count = 0;
            data.map((checkout: any) => {
              if (checkout.orderData.orderSource === 'POS') {
                pos_count++;
                total_pos += parseInt(checkout.orderData.total, 10);
                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                  store_count++;
                  total_store += parseInt(checkout.orderData.total, 10);
                }
              } else {
                web_count++;
                total_web += parseInt(checkout.orderData.total, 10);
              }
              total += parseInt(checkout.orderData.total, 10);
            });
            countArrayStore[index] = Math.floor(total_store / store_count);
            countArrayPos[index] = Math.floor(total_pos / pos_count);
            countArrayWeb[index] = Math.floor(total_web / web_count);
            countArray[index] = Math.floor(total / data.length);
            if (pass === 12) {
              resolve(true);
            }
          });
        }
      });

      return {
        countArray: Object.keys(countArray)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArray[dd];
          }),
        countArrayPos: Object.keys(countArrayPos)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayPos[dd];
          }),
        countArrayStore: Object.keys(countArrayStore)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayStore[dd];
          }),
        countArrayWeb: Object.keys(countArrayWeb)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayWeb[dd];
          }),
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
    }
  }

  async getOrderAvgSalePrice(query: string) {
    try {
      const qData = JSON.parse(query);
      const countArray: any = {};
      const countArrayPos: any = {};
      const countArrayWeb: any = {};
      const countArrayStore: any = {};
      const orderCountingSQL = await this.getOrderCountingSQL();

      let pass = 0;
      await new Promise(resolve => {
        for (let index = 0; index < 14; index++) {
          const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                            AND ${orderCountingSQL};
                    `;
          db.query(monthCheckoutSQL, []).then(data => {
            pass++;
            let total = 0;
            let total_pos = 0;
            let total_web = 0;
            let total_store = 0;
            let pos_count = 0;
            let store_count = 0;
            let web_count = 0;
            data.map((checkout: any) => {
              if (checkout.orderData.orderSource === 'POS') {
                pos_count++;
                total_pos += parseInt(checkout.orderData.total, 10);
                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                  store_count++;
                  total_store += parseInt(checkout.orderData.total, 10);
                }
              } else {
                web_count++;
                total_web += parseInt(checkout.orderData.total, 10);
              }
              total += parseInt(checkout.orderData.total, 10);
            });
            countArrayStore[index] = Math.floor(total_store / store_count);
            countArrayPos[index] = Math.floor(total_pos / pos_count);
            countArrayWeb[index] = Math.floor(total_web / web_count);
            countArray[index] = Math.floor(total / data.length);
            if (pass === 14) {
              resolve(true);
            }
          });
        }
      });

      return {
        countArray: Object.keys(countArray)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArray[dd];
          }),
        countArrayPos: Object.keys(countArrayPos)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayPos[dd];
          }),
        countArrayStore: Object.keys(countArrayStore)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayStore[dd];
          }),
        countArrayWeb: Object.keys(countArrayWeb)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayWeb[dd];
          }),
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
    }
  }

  async getOrderAvgSalePriceMonth(query: string) {
    try {
      const qData = JSON.parse(query);
      const countArray: any = {};
      const countArrayPos: any = {};
      const countArrayWeb: any = {};
      const countArrayStore: any = {};
      const orderCountingSQL = await this.getOrderCountingSQL();

      let pass = 0;
      await new Promise(resolve => {
        for (let index = 0; index < 30; index++) {
          const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                            AND ${orderCountingSQL};
                    `;
          db.query(monthCheckoutSQL, []).then(data => {
            pass++;
            let total = 0;
            let total_pos = 0;
            let total_web = 0;
            let total_store = 0;
            let pos_count = 0;
            let store_count = 0;
            let web_count = 0;
            data.map((checkout: any) => {
              if (checkout.orderData.orderSource === 'POS') {
                pos_count++;
                total_pos += parseInt(checkout.orderData.total, 10);
                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                  store_count++;
                  total_store += parseInt(checkout.orderData.total, 10);
                }
              } else {
                web_count++;
                total_web += parseInt(checkout.orderData.total, 10);
              }
              total += parseInt(checkout.orderData.total, 10);
            });
            countArrayStore[index] = Math.floor(total_store / store_count);
            countArrayPos[index] = Math.floor(total_pos / pos_count);
            countArrayWeb[index] = Math.floor(total_web / web_count);
            countArray[index] = Math.floor(total / data.length);
            if (pass === 30) {
              resolve(true);
            }
          });
        }
      });

      return {
        countArray: Object.keys(countArray)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArray[dd];
          }),
        countArrayPos: Object.keys(countArrayPos)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayPos[dd];
          }),
        countArrayStore: Object.keys(countArrayStore)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayStore[dd];
          }),
        countArrayWeb: Object.keys(countArrayWeb)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayWeb[dd];
          }),
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
    }
  }

  async getOrderAvgSalePriceCustomer(query: string) {
    try {
      const countArray: any = {};
      const countArrayPos: any = {};
      const countArrayWeb: any = {};
      const countArrayStore: any = {};

      const qData = JSON.parse(query);
      const days = this.diffDates(new Date(qData.start), new Date(qData.end));
      const formatEndDate = `"${Tool.replaceDatetime(qData.end)}"`;
      const orderCountingSQL = await this.getOrderCountingSQL();

      let pass = 0;
      await new Promise(resolve => {
        for (let index = 0; index < days; index++) {
          const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND ${orderCountingSQL}
                    `;
          db.query(monthCheckoutSQL, []).then(data => {
            pass++;
            let total = 0;
            let total_pos = 0;
            let total_web = 0;
            let total_store = 0;
            let pos_count = 0;
            let web_count = 0;
            let store_count = 0;
            data.map((checkout: any) => {
              if (checkout.orderData.orderSource === 'POS') {
                pos_count++;
                total_pos += parseInt(checkout.orderData.total, 10);
                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                  store_count++;
                  total_store += parseInt(checkout.orderData.total, 10);
                }
              } else {
                web_count++;
                total_web += parseInt(checkout.orderData.total, 10);
              }
              total += parseInt(checkout.orderData.total, 10);
            });
            countArrayStore[index] = Math.floor(total_store / store_count);
            countArrayPos[index] = Math.floor(total_pos / pos_count);
            countArrayWeb[index] = Math.floor(total_web / web_count);
            countArray[index] = Math.floor(total / data.length);
            if (pass === days) {
              resolve(true);
            }
          });
        }
      });

      return {
        countArray: Object.keys(countArray)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArray[dd];
          }),
        countArrayPos: Object.keys(countArrayPos)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayPos[dd];
          }),
        countArrayStore: Object.keys(countArrayStore)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayStore[dd];
          }),
        countArrayWeb: Object.keys(countArrayWeb)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArrayWeb[dd];
          }),
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
    }
  }

  async getActiveRecentYear() {
    const endDate = moment.tz('Asia/Taipei').toDate();
    endDate.setMonth(endDate.getMonth() + 1, 1);

    const startDate = moment.tz('Asia/Taipei').toDate();
    startDate.setMonth(endDate.getMonth() - 12);

    const sql = `
            SELECT mac_address, created_time
            FROM \`${saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${db.escape(this.app)}
            AND req_type = 'file'
            AND created_time BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'
            GROUP BY id, mac_address
        `;

    const queryData = await db.query(sql, []);

    const now = moment.tz('Asia/Taipei').toDate(); // 當前時間
    const dataList = Array.from({ length: 12 }, (_, index) => {
      // 計算第 index 個月前的日期
      const targetDate = new Date(now.getFullYear(), now.getMonth() - index, 1);

      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1; // 月份從 0 開始，需要加 1

      // 篩選該月份的資料
      const filteredData = queryData.filter((item: any) => {
        const date = moment.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      });

      // 計算不重複的 mac_address
      const uniqueMacAddresses = new Set(filteredData.map((item: any) => item.mac_address));

      return {
        year,
        month,
        total_count: filteredData.length,
        unique_count: uniqueMacAddresses.size,
      };
    });

    const result = dataList.map(data => data.unique_count);

    return {
      count_array: result.reverse(), // 將結果反轉，保證時間順序為最近到最遠
    };
  }

  async getActiveRecentWeek() {
    const sql = `
            SELECT mac_address, ${convertTimeZone('created_time')} AS created_time
            FROM \`${saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${db.escape(this.app)}
                AND req_type = 'file'
                AND ${convertTimeZone('created_time')} BETWEEN (DATE_SUB(${convertTimeZone('NOW()')}
                , INTERVAL 14 DAY))
              AND ${convertTimeZone('NOW()')}
            GROUP BY id, mac_address
        `;

    const queryData = await db.query(sql, []);

    const now = moment.tz('Asia/Taipei').toDate(); // 當前時間
    const dataList = Array.from({ length: 14 }, (_, index) => {
      const targetDate = new Date(now.getTime());
      targetDate.setDate(new Date(now.getTime()).getDate() - index); // 設定為第 index 天前的日期

      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1; // 月份從 0 開始，需要加 1
      const day = targetDate.getDate();

      // 篩選該日期的資料
      const filteredData = queryData.filter((item: any) => {
        const date = moment.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
        return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
      });

      // 計算不重複的 mac_address
      const uniqueMacAddresses = new Set(filteredData.map((item: any) => item.mac_address));

      return {
        year,
        month,
        day,
        total_count: filteredData.length,
        unique_count: uniqueMacAddresses.size,
      };
    });

    const result = dataList.map(data => data.unique_count);

    return {
      count_array: result.reverse(), // 將結果反轉，保證時間順序為最近到最遠
    };
  }

  async getActiveRecentMonth() {
    const sql = `
            SELECT mac_address, ${convertTimeZone('created_time')} AS created_time
            FROM \`${saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${db.escape(this.app)}
                AND req_type = 'file'
                AND ${convertTimeZone('created_time')} BETWEEN (DATE_SUB(${convertTimeZone('NOW()')}
                , INTERVAL 30 DAY))
              AND ${convertTimeZone('NOW()')}
            GROUP BY id, mac_address
        `;

    const queryData = await db.query(sql, []);

    const now = moment.tz('Asia/Taipei').toDate(); // 當前時間
    const dataList = Array.from({ length: 30 }, (_, index) => {
      const targetDate = new Date(now.getTime());
      targetDate.setDate(new Date(now.getTime()).getDate() - index); // 設定為第 index 天前的日期

      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1; // 月份從 0 開始，需要加 1
      const day = targetDate.getDate();

      // 篩選該日期的資料
      const filteredData = queryData.filter((item: any) => {
        const date = moment.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
        return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
      });

      // 計算不重複的 mac_address
      const uniqueMacAddresses = new Set(filteredData.map((item: any) => item.mac_address));

      return {
        year,
        month,
        day,
        total_count: filteredData.length,
        unique_count: uniqueMacAddresses.size,
      };
    });

    const result = dataList.map(data => data.unique_count);

    return {
      count_array: result.reverse(), // 將結果反轉，保證時間順序為最近到最遠
    };
  }

  async getActiveRecentCustom(query: string) {
    const qData = JSON.parse(query);
    const formatStartDate = `"${Tool.replaceDatetime(qData.start)}"`;
    const formatEndDate = `"${Tool.replaceDatetime(qData.end)}"`;
    const days = this.diffDates(new Date(qData.start), new Date(qData.end));
    const sql = `
            SELECT mac_address, ${convertTimeZone('created_time')} AS created_time
            FROM \`${saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${db.escape(this.app)}
                AND req_type = 'file'
                AND ${convertTimeZone('created_time')}
                BETWEEN ${convertTimeZone(formatStartDate)}
              AND ${convertTimeZone(formatEndDate)}
            GROUP BY id, mac_address
        `;

    const queryData = await db.query(sql, []);

    const now = moment(qData.end).tz('Asia/Taipei').clone().toDate(); // 當前時間
    const dataList = Array.from({ length: days }, (_, index) => {
      const targetDate = new Date(now.getTime());
      targetDate.setDate(new Date(now.getTime()).getDate() - index); // 設定為第 index 天前的日期

      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1; // 月份從 0 開始，需要加 1
      const day = targetDate.getDate();

      // 篩選該日期的資料
      const filteredData = queryData.filter((item: any) => {
        const date = moment.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
        return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
      });

      // 計算不重複的 mac_address
      const uniqueMacAddresses = new Set(filteredData.map((item: any) => item.mac_address));

      return {
        year,
        month,
        day,
        total_count: filteredData.length,
        unique_count: uniqueMacAddresses.size,
      };
    });

    const result = dataList.map(data => data.unique_count);

    return {
      count_array: result.reverse(), // 將結果反轉，保證時間順序為最近到最遠
    };
  }

  async getRegisterMonth() {
    try {
      const countArray: any = {};
      let pass = 0;
      await new Promise(resolve => {
        for (let index = 0; index < 30; index++) {
          const monthCheckoutSQL = `
                        SELECT count(1)
                        FROM \`${this.app}\`.t_user
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status <> 0;
                    `;
          db.query(monthCheckoutSQL, []).then(data => {
            countArray[index] = data[0]['count(1)'];
            pass++;
            if (pass === 30) {
              resolve(true);
            }
          });
        }
      });

      return {
        countArray: Object.keys(countArray)
          .map(dd => {
            return parseInt(dd);
          })
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArray[dd];
          })
          .reverse(),
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
    }
  }

  async getRegisterCustom(query: string) {
    try {
      const qData = JSON.parse(query);
      const days = this.diffDates(new Date(qData.start), new Date(qData.end));
      const formatEndDate = `"${Tool.replaceDatetime(qData.end)}"`;

      const countArray: any = {};
      let pass = 0;
      await new Promise(resolve => {
        for (let index = 0; index < days; index++) {
          const monthCheckoutSQL = `
                        SELECT count(1)
                        FROM \`${this.app}\`.t_user
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND status <> 0;
                    `;
          db.query(monthCheckoutSQL, []).then(data => {
            countArray[index] = data[0]['count(1)'];
            pass++;
            if (pass === days) {
              resolve(true);
            }
          });
        }
      });

      return {
        countArray: Object.keys(countArray)
          .map(dd => {
            return parseInt(dd);
          })
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArray[dd];
          })
          .reverse(),
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
    }
  }

  async getRegister2week() {
    try {
      const countArray: any = {};
      let pass = 0;
      await new Promise(resolve => {
        for (let index = 0; index < 14; index++) {
          const monthCheckoutSQL = `
                        SELECT count(1)
                        FROM \`${this.app}\`.t_user
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status <> 0;
                    `;
          db.query(monthCheckoutSQL, []).then(data => {
            countArray[index] = data[0]['count(1)'];
            pass++;
            if (pass === 14) {
              resolve(true);
            }
          });
        }
      });

      return {
        countArray: Object.keys(countArray)
          .map(dd => {
            return parseInt(dd);
          })
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArray[dd];
          })
          .reverse(),
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
    }
  }

  async getRegisterYear() {
    try {
      const countArray: any = {};
      const order = await db.query(
        `SELECT count(1)
                 FROM \`${this.app}\`.t_user
                 WHERE DATE (created_time) = CURDATE()`,
        []
      );

      let pass = 0;
      await new Promise(resolve => {
        for (let index = 0; index < 12; index++) {
          const monthRegisterSQL = `
                        SELECT count(1)
                        FROM \`${this.app}\`.t_user
                        WHERE MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                    `;
          db.query(monthRegisterSQL, []).then(data => {
            pass++;
            countArray[index] = data[0]['count(1)'];
            if (pass === 12) {
              resolve(true);
            }
          });
        }
      });

      return {
        //用戶總數
        today: order[0]['count(1)'],
        //每月紀錄
        count_register: Object.keys(countArray)
          .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
          .map(dd => {
            return countArray[dd];
          })
          .reverse(),
        //兩週紀錄
        count_2_week_register: (await this.getRegister2week()).countArray,
      };
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'getOrderToDay Error:' + e, null);
    }
  }

  async getOrderToDay() {
    try {
      const orderCountingSQL = await this.getOrderCountingSQL();

      // 並行查詢
      const [order, unShipmentCount] = await Promise.all([
        db.query(
          `SELECT status, orderData->>'$.total' as total
           FROM \`${this.app}\`.t_checkout
           WHERE DATE(${convertTimeZone('created_time')}) = CURDATE()`,
          []
        ),
        db.query(
          `SELECT COUNT(1) as count
           FROM \`${this.app}\`.t_checkout
           WHERE ${orderCountingSQL}
           AND DATE(${convertTimeZone('created_time')}) = CURDATE()`,
          []
        ),
      ]);

      return {
        // 訂單總數
        total_count: order.filter((dd: any) => dd.status === 1).length,
        // 未出貨訂單
        un_shipment: unShipmentCount[0]?.count || 0,
        // 未付款訂單
        un_pay: order.filter((dd: any) => dd.status === 0).length,
        // 今日成交金額
        total_amount: order
          .filter((dd: any) => dd.status === 1)
          .reduce((sum: number, dd: any) => sum + Number(dd.total || 0), 0),
      };
    } catch (e) {
      console.error('getOrderToDay Error:', e);
      throw exception.BadRequestError('BAD_REQUEST', `getOrderToDay Error: ${e}`, null);
    }
  }
}

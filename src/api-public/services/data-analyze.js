"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataAnalyze = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const moment_1 = __importDefault(require("moment"));
const config_js_1 = require("../../config.js");
const shopping_js_1 = require("./shopping.js");
const workers_js_1 = require("./workers.js");
function convertTimeZone(date) {
    return `CONVERT_TZ(${date}, '+00:00', '+08:00')`;
}
class DataAnalyze {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async workerExample(data) {
        try {
            const jsonData = await database_js_1.default.query(`SELECT *
                 FROM \`${this.app}\`.t_voucher_history`, []);
            const t0 = performance.now();
            if (data.type === 0) {
                for (const record of jsonData) {
                    await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_voucher_history\`
                         SET ?
                         WHERE id = ?`, [record, record.id]);
                }
                return {
                    type: 'single',
                    divisor: 1,
                    executionTime: `${(performance.now() - t0).toFixed(3)} ms`,
                };
            }
            const formatJsonData = jsonData.map((record) => {
                return {
                    sql: `UPDATE \`${this.app}\`.\`t_voucher_history\`
                          SET ?
                          WHERE id = ?`,
                    data: [record, record.id],
                };
            });
            const result = workers_js_1.Workers.query({
                queryList: formatJsonData,
                divisor: data.divisor,
            });
            return result;
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'Worker example is Failed. ' + error, null);
        }
    }
    async getDataAnalyze(tags, query) {
        try {
            const timer = {};
            const result = {};
            query = query || '{}';
            const taskMap = {
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
                orders_per_month_custom: () => this.getOrdersPerMonthCostom(query),
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
            await Promise.all(tags.map(async (tag) => {
                if (taskMap[tag]) {
                    const start = Date.now();
                    try {
                        result[tag] = await taskMap[tag]();
                    }
                    catch (error) {
                        console.error(`Error processing tag ${tag}:`, error);
                        result[tag] = null;
                    }
                    finally {
                        timer[tag] = (Date.now() - start) / 1000;
                    }
                }
            }));
            console.log('Analyze timer =>', timer);
            return result;
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', `getDataAnalyze Error: ${error}`, null);
        }
    }
    async getRecentActiveUser() {
        try {
            const recentSQL = `
                SELECT *
                FROM \`${this.app}\`.t_user
                WHERE online_time BETWEEN DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND NOW();
            `;
            const recent_users = await database_js_1.default.query(recentSQL, []);
            const monthSQL = `
                SELECT *
                FROM \`${this.app}\`.t_user
                WHERE MONTH (online_time) = MONTH (NOW()) AND YEAR (online_time) = YEAR (NOW());
            `;
            const month_users = await database_js_1.default.query(monthSQL, []);
            return { recent: recent_users.length, months: month_users.length };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getSalesInRecentMonth() {
        try {
            const recentMonthSQL = `
                SELECT *
                FROM \`${this.app}\`.t_checkout
                WHERE MONTH (created_time) = MONTH (NOW()) AND YEAR (created_time) = YEAR (NOW())   AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
            `;
            const recentMonthCheckouts = await database_js_1.default.query(recentMonthSQL, []);
            let recent_month_total = 0;
            recentMonthCheckouts.map((checkout) => {
                recent_month_total += parseInt(checkout.orderData.total, 10);
            });
            const previousMonthSQL = `
                SELECT *
                FROM \`${this.app}\`.t_checkout
                WHERE
                    MONTH (created_time) = MONTH (DATE_SUB(NOW()
                    , INTERVAL 1 MONTH))
                  AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                    , INTERVAL 1 MONTH))
                    AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
            `;
            const previousMonthCheckouts = await database_js_1.default.query(previousMonthSQL, []);
            let previous_month_total = 0;
            previousMonthCheckouts.map((checkout) => {
                previous_month_total += parseInt(checkout.orderData.total, 10);
            });
            let gap = 0;
            if (recent_month_total !== 0 && previous_month_total !== 0) {
                gap = Math.floor(((recent_month_total - previous_month_total) / previous_month_total) * 10000) / 10000;
            }
            return { recent_month_total, previous_month_total, gap };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getHotProducts(duration, query = '{}') {
        try {
            const qData = JSON.parse(query);
            const sqlConditions = ['1=1'];
            if (qData.filter_date === 'custom' && qData.start && qData.end) {
                const startDate = `'${tool_js_1.default.replaceDatetime(qData.start)}'`;
                const endDate = `'${tool_js_1.default.replaceDatetime(qData.end)}'`;
                sqlConditions.push(`(created_time BETWEEN ${startDate} AND ${endDate})`);
            }
            if (qData.come_from && qData.come_from !== 'all') {
                const sourceCondition = {
                    website: `(orderData->>'$.orderSource' <> 'POS')`,
                    store: `(orderData->>'$.orderSource' = 'POS')`,
                };
                sqlConditions.push(sourceCondition[qData.come_from] || `(orderData->>'$.pos_info.where_store' = '${qData.come_from}')`);
            }
            const dateRanges = {
                today: '1 DAY',
                week: '7 DAY',
                '1m': '30 DAY',
                year: '1 YEAR',
            };
            if (dateRanges[qData.filter_date]) {
                sqlConditions.push(`created_time BETWEEN DATE_SUB(NOW(), INTERVAL ${dateRanges[qData.filter_date]}) AND NOW()`);
            }
            const checkoutSQL = `
                SELECT * FROM \`${this.app}\`.t_checkout
                WHERE (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1') AND ${duration === 'day'
                ? `created_time BETWEEN NOW() AND NOW() + INTERVAL 1 DAY - INTERVAL 1 SECOND`
                : duration === 'month'
                    ? `created_time BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`
                    : sqlConditions.join(' AND ')};
            `;
            const checkouts = await database_js_1.default.query(checkoutSQL, []);
            const productMap = new Map();
            const collectionSales = {};
            checkouts.forEach((j) => {
                const orderData = j.orderData;
                (orderData.lineItems || []).forEach((item) => {
                    const existing = productMap.get(item.title);
                    const collections = item.collection.filter((c) => c.length > 0).map((c) => c.replace(/ /g, ''));
                    if (existing) {
                        existing.count += item.count;
                        existing.sale_price += item.sale_price * item.count;
                    }
                    else {
                        productMap.set(item.title, {
                            title: item.title,
                            count: item.count,
                            collection: collections,
                            preview_image: item.preview_image,
                            sale_price: item.sale_price,
                            pos_info: orderData.pos_info,
                        });
                    }
                    collections.forEach((col) => {
                        if (!collectionSales[col]) {
                            collectionSales[col] = { count: 0, sale_price: 0 };
                        }
                        collectionSales[col].count += item.count;
                        collectionSales[col].sale_price += item.sale_price * item.count;
                    });
                });
            });
            const sortedCollections = Object.entries(collectionSales)
                .filter(([col]) => col)
                .map(([collection, data]) => {
                return Object.assign({ collection: collection.replace(/\//g, ' / ') }, data);
            })
                .sort((a, b) => b.sale_price - a.sale_price);
            const finalProductList = Array.from(productMap.values()).sort((a, b) => b.count - a.count);
            const topProducts = finalProductList.slice(0, 10);
            return {
                series: topProducts.map((p) => p.count),
                categories: topProducts.map((p) => p.title),
                product_list: finalProductList,
                sorted_collections: sortedCollections,
            };
        }
        catch (e) {
            console.error('getHotProducts Error:', e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', `getHotProducts Error: ${e}`, null);
        }
    }
    async getOrdersInRecentMonth() {
        try {
            const recentMonthSQL = `
                SELECT id
                FROM \`${this.app}\`.t_checkout
                WHERE MONTH (created_time) = MONTH (NOW()) AND YEAR (created_time) = YEAR (NOW())   AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
            `;
            const recentMonthCheckouts = await database_js_1.default.query(recentMonthSQL, []);
            let recent_month_total = recentMonthCheckouts.length;
            const previousMonthSQL = `
                SELECT id
                FROM \`${this.app}\`.t_checkout
                WHERE
                    MONTH (created_time) = MONTH (DATE_SUB(NOW()
                    , INTERVAL 1 MONTH))
                  AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                    , INTERVAL 1 MONTH))
                    AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
            `;
            const previousMonthCheckouts = await database_js_1.default.query(previousMonthSQL, []);
            let previous_month_total = previousMonthCheckouts.length;
            let gap = 0;
            if (recent_month_total !== 0 && previous_month_total !== 0) {
                gap = Math.floor(((recent_month_total - previous_month_total) / previous_month_total) * 10000) / 10000;
            }
            return { recent_month_total, previous_month_total, gap };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrdersPerMonth2week(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 14; index++) {
                    const monthCheckoutSQL = `
                        SELECT id, orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                            AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += 1;
                                if (qData.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += 1;
                                }
                            }
                            else {
                                total_web += 1;
                            }
                            total += 1;
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
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrdersPerMonth(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
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
                            AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += 1;
                                if (qData.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += 1;
                                }
                            }
                            else {
                                total_web += 1;
                            }
                            total += 1;
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
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrdersPerMonthCostom(query) {
        try {
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            const qData = JSON.parse(query);
            const days = this.diffDates(new Date(qData.start), new Date(qData.end));
            const formatEndDate = `"${tool_js_1.default.replaceDatetime(qData.end)}"`;
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < days; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${formatEndDate}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${formatEndDate}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${formatEndDate}
                            , INTERVAL ${index} DAY))
                            AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += 1;
                                if (qData.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += 1;
                                }
                            }
                            else {
                                total_web += 1;
                            }
                            total += 1;
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
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrdersPerMonth1Year(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 12; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                            AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += 1;
                                if (qData.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += 1;
                                }
                            }
                            else {
                                total_web += 1;
                            }
                            total += 1;
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
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getSalesPerMonth1Year(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 12; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                            AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
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
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getSalesPerMonth2week(query) {
        try {
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            const qData = JSON.parse(query);
            let pass = 0;
            await new Promise((resolve, reject) => {
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
                            AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
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
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getSalesPerMonth(query) {
        try {
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            const qData = JSON.parse(query);
            let pass = 0;
            await new Promise((resolve, reject) => {
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
                            AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from && qData.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
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
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    diffDates(startDateObj, endDateObj) {
        var timeDiff = Math.abs(endDateObj.getTime() - startDateObj.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    }
    async getSalesPerMonthCustom(query) {
        try {
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            const qData = JSON.parse(query);
            const days = this.diffDates(new Date(qData.start), new Date(qData.end));
            const formatEndDate = `"${tool_js_1.default.replaceDatetime(qData.end)}"`;
            let pass = 0;
            await new Promise((resolve, reject) => {
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
                            AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
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
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrderAvgSalePriceYear(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 12; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                            AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        let pos_count = 0;
                        let store_count = 0;
                        let web_count = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                pos_count++;
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData)) {
                                    store_count++;
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
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
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrderAvgSalePrice(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
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
                            AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        let pos_count = 0;
                        let store_count = 0;
                        let web_count = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                pos_count++;
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData)) {
                                    store_count++;
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
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
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrderAvgSalePriceMonth(query) {
        try {
            const qData = JSON.parse(query);
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
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
                            AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1');
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        let pos_count = 0;
                        let store_count = 0;
                        let web_count = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                pos_count++;
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData)) {
                                    store_count++;
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
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
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getOrderAvgSalePriceCustomer(query) {
        try {
            const countArray = {};
            const countArrayPos = {};
            const countArrayWeb = {};
            const countArrayStore = {};
            const qData = JSON.parse(query);
            const days = this.diffDates(new Date(qData.start), new Date(qData.end));
            const formatEndDate = `"${tool_js_1.default.replaceDatetime(qData.end)}"`;
            let pass = 0;
            await new Promise((resolve, reject) => {
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
                          AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1')
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        let pos_count = 0;
                        let web_count = 0;
                        let store_count = 0;
                        data.map((checkout) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                pos_count++;
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData)) {
                                    store_count++;
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            }
                            else {
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
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayPos[dd];
                }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayStore[dd];
                }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArrayWeb[dd];
                }),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getActiveRecentYear() {
        const endDate = moment_1.default.tz('Asia/Taipei').toDate();
        endDate.setMonth(endDate.getMonth() + 1, 1);
        const startDate = moment_1.default.tz('Asia/Taipei').toDate();
        startDate.setMonth(endDate.getMonth() - 12);
        const sql = `
            SELECT mac_address, created_time
            FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${database_js_1.default.escape(this.app)}
            AND req_type = 'file'
            AND created_time BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'
            GROUP BY id, mac_address
        `;
        const queryData = await database_js_1.default.query(sql, []);
        const now = moment_1.default.tz('Asia/Taipei').toDate();
        const dataList = Array.from({ length: 12 }, (_, index) => {
            const targetDate = new Date(now.getFullYear(), now.getMonth() - index, 1);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1;
            const filteredData = queryData.filter((item) => {
                const date = moment_1.default.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                return date.getFullYear() === year && date.getMonth() + 1 === month;
            });
            const uniqueMacAddresses = new Set(filteredData.map((item) => item.mac_address));
            return {
                year,
                month,
                total_count: filteredData.length,
                unique_count: uniqueMacAddresses.size,
            };
        });
        const result = dataList.map((data) => data.unique_count);
        return {
            count_array: result.reverse(),
        };
    }
    async getActiveRecentWeek() {
        const sql = `
            SELECT mac_address, ${convertTimeZone('created_time')} AS created_time
            FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${database_js_1.default.escape(this.app)}
                AND req_type = 'file'
                AND ${convertTimeZone('created_time')} BETWEEN (DATE_SUB(${convertTimeZone('NOW()')}
                , INTERVAL 14 DAY))
              AND ${convertTimeZone('NOW()')}
            GROUP BY id, mac_address
        `;
        const queryData = await database_js_1.default.query(sql, []);
        const now = moment_1.default.tz('Asia/Taipei').toDate();
        const dataList = Array.from({ length: 14 }, (_, index) => {
            const targetDate = new Date(now.getTime());
            targetDate.setDate(new Date(now.getTime()).getDate() - index);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1;
            const day = targetDate.getDate();
            const filteredData = queryData.filter((item) => {
                const date = moment_1.default.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
            });
            const uniqueMacAddresses = new Set(filteredData.map((item) => item.mac_address));
            return {
                year,
                month,
                day,
                total_count: filteredData.length,
                unique_count: uniqueMacAddresses.size,
            };
        });
        const result = dataList.map((data) => data.unique_count);
        return {
            count_array: result.reverse(),
        };
    }
    async getActiveRecentMonth() {
        const sql = `
            SELECT mac_address, ${convertTimeZone('created_time')} AS created_time
            FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${database_js_1.default.escape(this.app)}
                AND req_type = 'file'
                AND ${convertTimeZone('created_time')} BETWEEN (DATE_SUB(${convertTimeZone('NOW()')}
                , INTERVAL 30 DAY))
              AND ${convertTimeZone('NOW()')}
            GROUP BY id, mac_address
        `;
        const queryData = await database_js_1.default.query(sql, []);
        const now = moment_1.default.tz('Asia/Taipei').toDate();
        const dataList = Array.from({ length: 30 }, (_, index) => {
            const targetDate = new Date(now.getTime());
            targetDate.setDate(new Date(now.getTime()).getDate() - index);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1;
            const day = targetDate.getDate();
            const filteredData = queryData.filter((item) => {
                const date = moment_1.default.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
            });
            const uniqueMacAddresses = new Set(filteredData.map((item) => item.mac_address));
            return {
                year,
                month,
                day,
                total_count: filteredData.length,
                unique_count: uniqueMacAddresses.size,
            };
        });
        const result = dataList.map((data) => data.unique_count);
        return {
            count_array: result.reverse(),
        };
    }
    async getActiveRecentCustom(query) {
        const qData = JSON.parse(query);
        const formatStartDate = `"${tool_js_1.default.replaceDatetime(qData.start)}"`;
        const formatEndDate = `"${tool_js_1.default.replaceDatetime(qData.end)}"`;
        const days = this.diffDates(new Date(qData.start), new Date(qData.end));
        const sql = `
            SELECT mac_address, ${convertTimeZone('created_time')} AS created_time
            FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${database_js_1.default.escape(this.app)}
                AND req_type = 'file'
                AND ${convertTimeZone('created_time')}
                BETWEEN ${convertTimeZone(formatStartDate)}
              AND ${convertTimeZone(formatEndDate)}
            GROUP BY id, mac_address
        `;
        const queryData = await database_js_1.default.query(sql, []);
        const now = (0, moment_1.default)(qData.end).tz('Asia/Taipei').clone().toDate();
        const dataList = Array.from({ length: days }, (_, index) => {
            const targetDate = new Date(now.getTime());
            targetDate.setDate(new Date(now.getTime()).getDate() - index);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1;
            const day = targetDate.getDate();
            const filteredData = queryData.filter((item) => {
                const date = moment_1.default.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
            });
            const uniqueMacAddresses = new Set(filteredData.map((item) => item.mac_address));
            return {
                year,
                month,
                day,
                total_count: filteredData.length,
                unique_count: uniqueMacAddresses.size,
            };
        });
        const result = dataList.map((data) => data.unique_count);
        return {
            count_array: result.reverse(),
        };
    }
    async getRegisterMonth() {
        try {
            const countArray = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
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
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
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
                    .map((dd) => {
                    return parseInt(dd);
                })
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                })
                    .reverse(),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getRegisterCustom(query) {
        try {
            const qData = JSON.parse(query);
            const days = this.diffDates(new Date(qData.start), new Date(qData.end));
            const formatEndDate = `"${tool_js_1.default.replaceDatetime(qData.end)}"`;
            const countArray = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
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
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
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
                    .map((dd) => {
                    return parseInt(dd);
                })
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                })
                    .reverse(),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getRegister2week() {
        try {
            const countArray = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
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
                          AND status = 1;
                    `;
                    database_js_1.default.query(monthCheckoutSQL, []).then((data) => {
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
                    .map((dd) => {
                    return parseInt(dd);
                })
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                })
                    .reverse(),
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getRegisterYear() {
        try {
            const formatJsonData = [];
            const countArray = {};
            const order = await database_js_1.default.query(`SELECT count(1)
                 FROM \`${this.app}\`.t_user
                 WHERE DATE (created_time) = CURDATE()`, []);
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 12; index++) {
                    const monthRegisterSQL = `
                        SELECT count(1)
                        FROM \`${this.app}\`.t_user
                        WHERE MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                    `;
                    database_js_1.default.query(monthRegisterSQL, []).then((data) => {
                        pass++;
                        countArray[index] = data[0]['count(1)'];
                        if (pass === 12) {
                            resolve(true);
                        }
                    });
                }
            });
            return {
                today: order[0]['count(1)'],
                count_register: Object.keys(countArray)
                    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                    return countArray[dd];
                })
                    .reverse(),
                count_2_week_register: (await this.getRegister2week()).countArray,
            };
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getOrderToDay Error:' + e, null);
        }
    }
    async getOrderToDay() {
        try {
            const order = await database_js_1.default.query(`SELECT *
                 FROM \`${this.app}\`.t_checkout
                 WHERE DATE (created_time) = CURDATE()`, []);
            return {
                total_count: order.filter((dd) => {
                    return dd.status === 1;
                }).length,
                un_shipment: (await database_js_1.default.query(`SELECT count(1)
                         from \`${this.app}\`.t_checkout
                         WHERE (orderData ->> '$.progress' is null || orderData ->> '$.progress' = 'wait')
                           AND (orderData->>'$.orderStatus' is null or orderData->>'$.orderStatus' != '-1')`, []))[0]['count(1)'],
                un_pay: order.filter((dd) => {
                    return dd.status === 0;
                }).length,
                total_amount: (() => {
                    let amount = 0;
                    order
                        .filter((dd) => {
                        return dd.status === 1;
                    })
                        .map((dd) => {
                        amount += dd.orderData.total;
                    });
                    return amount;
                })(),
            };
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getOrderToDay Error:' + e, null);
        }
    }
}
exports.DataAnalyze = DataAnalyze;
//# sourceMappingURL=data-analyze.js.map
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataAnalyze = void 0;
var exception_js_1 = require("../../modules/exception.js");
var database_js_1 = require("../../modules/database.js");
var tool_js_1 = require("../../modules/tool.js");
var moment_1 = require("moment");
var config_js_1 = require("../../config.js");
var shopping_js_1 = require("./shopping.js");
var user_js_1 = require("./user.js");
var workers_js_1 = require("./workers.js");
function convertTimeZone(date) {
    return "CONVERT_TZ(".concat(date, ", '+00:00', '+08:00')");
}
var DataAnalyze = /** @class */ (function () {
    function DataAnalyze(app, token) {
        this.app = app;
        this.token = token;
    }
    DataAnalyze.prototype.workerExample = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonData, t0, _i, jsonData_1, record, formatJsonData, result, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT * FROM `".concat(this.app, "`.t_voucher_history"), [])];
                    case 1:
                        jsonData = _a.sent();
                        t0 = performance.now();
                        if (!(data.type === 0)) return [3 /*break*/, 6];
                        _i = 0, jsonData_1 = jsonData;
                        _a.label = 2;
                    case 2:
                        if (!(_i < jsonData_1.length)) return [3 /*break*/, 5];
                        record = jsonData_1[_i];
                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.`t_voucher_history` SET ? WHERE id = ?\n            "), [record, record.id])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, {
                            type: 'single',
                            divisor: 1,
                            executionTime: "".concat((performance.now() - t0).toFixed(3), " ms"),
                        }];
                    case 6:
                        formatJsonData = jsonData.map(function (record) {
                            return {
                                sql: "UPDATE `".concat(_this.app, "`.`t_voucher_history` SET ? WHERE id = ?\n          "),
                                data: [record, record.id],
                            };
                        });
                        result = workers_js_1.Workers.query({
                            queryList: formatJsonData,
                            divisor: data.divisor,
                        });
                        return [2 /*return*/, result];
                    case 7:
                        error_1 = _a.sent();
                        throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'Worker example is Failed. ' + error_1, null);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getDataAnalyze = function (tags, query) {
        return __awaiter(this, void 0, void 0, function () {
            var timer_1, result_1, taskMap_1, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        timer_1 = {};
                        result_1 = {};
                        query = query || '{}';
                        taskMap_1 = {
                            recent_active_user: function () { return _this.getRecentActiveUser(); },
                            recent_sales: function () { return _this.getSalesInRecentMonth(); },
                            recent_orders: function () { return _this.getOrdersInRecentMonth(); },
                            hot_products: function () { return _this.getHotProducts('month'); },
                            hot_products_all: function () { return _this.getHotProducts('all', query); },
                            hot_products_today: function () { return _this.getHotProducts('day'); },
                            order_avg_sale_price: function () { return _this.getOrderAvgSalePrice(query); },
                            order_avg_sale_price_month: function () { return _this.getOrderAvgSalePriceMonth(query); },
                            order_avg_sale_price_year: function () { return _this.getOrderAvgSalePriceYear(query); },
                            order_avg_sale_price_custom: function () { return _this.getOrderAvgSalePriceCustomer(query); },
                            orders_per_month_1_year: function () { return _this.getOrdersPerMonth1Year(query); },
                            orders_per_month_2_week: function () { return _this.getOrdersPerMonth2week(query); },
                            orders_per_month: function () { return _this.getOrdersPerMonth(query); },
                            orders_per_month_custom: function () { return _this.getOrdersPerMonthCustom(query); },
                            sales_per_month_2_week: function () { return _this.getSalesPerMonth2week(query); },
                            sales_per_month_1_year: function () { return _this.getSalesPerMonth1Year(query); },
                            sales_per_month_1_month: function () { return _this.getSalesPerMonth(query); },
                            sales_per_month_custom: function () { return _this.getSalesPerMonthCustom(query); },
                            order_today: function () { return _this.getOrderToDay(); },
                            recent_register_today: function () { return _this.getRegisterYear(); },
                            recent_register_week: function () { return _this.getRegisterYear(); },
                            recent_register_month: function () { return _this.getRegisterMonth(); },
                            recent_register_year: function () { return _this.getRegisterYear(); },
                            recent_register_custom: function () { return _this.getRegisterCustom(query); },
                            active_recent_custom: function () { return _this.getActiveRecentCustom(query); },
                            active_recent_month: function () { return _this.getActiveRecentMonth(); },
                            active_recent_year: function () { return _this.getActiveRecentYear(); },
                            active_recent_2week: function () { return _this.getActiveRecentWeek(); },
                        };
                        return [4 /*yield*/, Promise.all(tags.map(function (tag) { return __awaiter(_this, void 0, void 0, function () {
                                var start, _a, _b, error_3;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            if (!taskMap_1[tag]) return [3 /*break*/, 5];
                                            start = Date.now();
                                            _c.label = 1;
                                        case 1:
                                            _c.trys.push([1, 3, 4, 5]);
                                            _a = result_1;
                                            _b = tag;
                                            return [4 /*yield*/, taskMap_1[tag]()];
                                        case 2:
                                            _a[_b] = _c.sent();
                                            return [3 /*break*/, 5];
                                        case 3:
                                            error_3 = _c.sent();
                                            console.error("Error processing tag ".concat(tag, ":"), error_3);
                                            result_1[tag] = null; // 或根據需求處理錯誤結果
                                            return [3 /*break*/, 5];
                                        case 4:
                                            timer_1[tag] = (Date.now() - start) / 1000;
                                            return [7 /*endfinally*/];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        console.info('Analyze timer =>', timer_1);
                        return [2 /*return*/, result_1];
                    case 2:
                        error_2 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', "getDataAnalyze Error: ".concat(error_2), null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getOrderCountingSQL = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new user_js_1.User(this.app).getCheckoutCountingModeSQL()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataAnalyze.prototype.getRecentActiveUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var recentSQL, recent_users, monthSQL, month_users, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        recentSQL = "\n          SELECT *\n          FROM `".concat(this.app, "`.t_user\n          WHERE online_time BETWEEN DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND NOW();\n      ");
                        return [4 /*yield*/, database_js_1.default.query(recentSQL, [])];
                    case 1:
                        recent_users = _a.sent();
                        monthSQL = "\n          SELECT *\n          FROM `".concat(this.app, "`.t_user\n          WHERE MONTH (online_time) = MONTH (NOW()) AND YEAR (online_time) = YEAR (NOW());\n      ");
                        return [4 /*yield*/, database_js_1.default.query(monthSQL, [])];
                    case 2:
                        month_users = _a.sent();
                        return [2 /*return*/, { recent: recent_users.length, months: month_users.length }];
                    case 3:
                        e_1 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e_1, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getSalesInRecentMonth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orderCountingSQL_1, getCheckoutsSQL, calculateTotal, recentMonthCheckouts, previousMonthCheckouts, recent_month_total, previous_month_total, gap, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_1 = _a.sent();
                        getCheckoutsSQL = function (monthOffset) { return "\n        SELECT *\n        FROM `".concat(_this.app, "`.t_checkout\n        WHERE MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL ").concat(monthOffset, " MONTH))\n        AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL ").concat(monthOffset, " MONTH))\n        AND (").concat(orderCountingSQL_1, ");\n      "); };
                        calculateTotal = function (checkouts) {
                            return checkouts.reduce(function (total, checkout) { return total + parseInt(checkout.orderData.total, 10); }, 0);
                        };
                        return [4 /*yield*/, database_js_1.default.query(getCheckoutsSQL(0), [])];
                    case 2:
                        recentMonthCheckouts = _a.sent();
                        return [4 /*yield*/, database_js_1.default.query(getCheckoutsSQL(1), [])];
                    case 3:
                        previousMonthCheckouts = _a.sent();
                        recent_month_total = calculateTotal(recentMonthCheckouts);
                        previous_month_total = calculateTotal(previousMonthCheckouts);
                        gap = previous_month_total
                            ? Math.floor(((recent_month_total - previous_month_total) / previous_month_total) * 10000) / 10000
                            : 0;
                        return [2 /*return*/, { recent_month_total: recent_month_total, previous_month_total: previous_month_total, gap: gap }];
                    case 4:
                        e_2 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getSalesInRecentMonth error: ' + e_2, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getHotProducts = function (duration_1) {
        return __awaiter(this, arguments, void 0, function (duration, query) {
            var qData, sqlConditions, startDate, endDate, dateRanges, sourceCondition, orderCountingSQL, checkoutSQL, checkouts, productMap_1, collectionSales_1, sortedCollections, finalProductList, topProducts, e_3;
            if (query === void 0) { query = '{}'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        qData = JSON.parse(query);
                        sqlConditions = [];
                        // 處理自訂日期篩選
                        if (qData.filter_date === 'custom' && qData.start && qData.end) {
                            startDate = "'".concat(tool_js_1.default.replaceDatetime(qData.start), "'");
                            endDate = "'".concat(tool_js_1.default.replaceDatetime(qData.end), "'");
                            sqlConditions.push("created_time BETWEEN ".concat(startDate, " AND ").concat(endDate));
                        }
                        else {
                            dateRanges = {
                                today: '1 DAY',
                                week: '7 DAY',
                                '1m': '30 DAY',
                                year: '1 YEAR',
                            };
                            if (qData.filter_date && dateRanges[qData.filter_date]) {
                                sqlConditions.push("created_time BETWEEN DATE_SUB(NOW(), INTERVAL ".concat(dateRanges[qData.filter_date], ") AND NOW()"));
                            }
                        }
                        // 處理訂單來源
                        if (qData.come_from && qData.come_from !== 'all') {
                            sourceCondition = {
                                website: "(orderData->>'$.orderSource' <> 'POS')",
                                store: "(orderData->>'$.orderSource' = 'POS')",
                            };
                            sqlConditions.push(sourceCondition[qData.come_from] || "(orderData->>'$.pos_info.where_store' = '".concat(qData.come_from, "')"));
                        }
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL = _a.sent();
                        checkoutSQL = "\n        SELECT * \n        FROM `".concat(this.app, "`.t_checkout\n        WHERE ").concat(duration === 'day'
                            ? "created_time BETWEEN NOW() AND NOW() + INTERVAL 1 DAY - INTERVAL 1 SECOND"
                            : duration === 'month'
                                ? "created_time BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"
                                : sqlConditions.length
                                    ? sqlConditions.join(' AND ')
                                    : '1=1', "\n        AND (").concat(orderCountingSQL, ");\n      ");
                        return [4 /*yield*/, database_js_1.default.query(checkoutSQL, [])];
                    case 2:
                        checkouts = _a.sent();
                        productMap_1 = new Map();
                        collectionSales_1 = new Map();
                        checkouts.forEach(function (_a) {
                            var _b;
                            var orderData = _a.orderData;
                            (_b = orderData.lineItems) === null || _b === void 0 ? void 0 : _b.forEach(function (item) {
                                var existing = productMap_1.get(item.title);
                                var collections = new Set(item.collection.filter(function (c) { return c.trim().length > 0; }));
                                item.count = tool_js_1.default.floatAdd(item.count, 0);
                                if (existing) {
                                    existing.count += item.count;
                                    existing.sale_price += item.sale_price * item.count;
                                }
                                else {
                                    productMap_1.set(item.title, {
                                        title: item.title,
                                        count: item.count,
                                        collection: __spreadArray([], collections, true),
                                        preview_image: item.preview_image,
                                        sale_price: item.sale_price,
                                        pos_info: orderData.pos_info,
                                    });
                                }
                                // 計算 collection 銷售
                                collections.forEach(function (col) {
                                    if (!collectionSales_1.has(col)) {
                                        collectionSales_1.set(col, { count: 0, sale_price: 0 });
                                    }
                                    var colData = collectionSales_1.get(col);
                                    colData.count += item.count;
                                    colData.sale_price += item.sale_price * item.count;
                                });
                            });
                        });
                        sortedCollections = __spreadArray([], collectionSales_1.entries(), true).map(function (_a) {
                            var collection = _a[0], data = _a[1];
                            return (__assign({ collection: collection.replace(/\//g, ' / ') }, data));
                        })
                            .sort(function (a, b) { return b.sale_price - a.sale_price; });
                        finalProductList = __spreadArray([], productMap_1.values(), true).sort(function (a, b) { return b.count - a.count; });
                        topProducts = finalProductList.slice(0, 10);
                        return [2 /*return*/, {
                                series: topProducts.map(function (p) { return p.count; }),
                                categories: topProducts.map(function (p) { return p.title; }),
                                product_list: finalProductList,
                                sorted_collections: sortedCollections,
                            }];
                    case 3:
                        e_3 = _a.sent();
                        console.error('getHotProducts error:', e_3);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', "getHotProducts error: ".concat(e_3), null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getOrdersInRecentMonth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orderCountingSQL_2, getCheckoutCountSQL, recentMonthCheckouts, previousMonthCheckouts, recent_month_total, previous_month_total, gap, e_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_2 = _a.sent();
                        getCheckoutCountSQL = function (monthOffset) { return "\n        SELECT id\n        FROM `".concat(_this.app, "`.t_checkout\n        WHERE MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL ").concat(monthOffset, " MONTH))\n        AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL ").concat(monthOffset, " MONTH))\n        AND ").concat(orderCountingSQL_2, ";\n      "); };
                        return [4 /*yield*/, database_js_1.default.query(getCheckoutCountSQL(0), [])];
                    case 2:
                        recentMonthCheckouts = _a.sent();
                        return [4 /*yield*/, database_js_1.default.query(getCheckoutCountSQL(1), [])];
                    case 3:
                        previousMonthCheckouts = _a.sent();
                        recent_month_total = recentMonthCheckouts.length;
                        previous_month_total = previousMonthCheckouts.length;
                        gap = 0;
                        if (previous_month_total > 0) {
                            gap = Math.floor(((recent_month_total - previous_month_total) / previous_month_total) * 10000) / 10000;
                        }
                        return [2 /*return*/, { recent_month_total: recent_month_total, previous_month_total: previous_month_total, gap: gap }];
                    case 4:
                        e_4 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getOrdersInRecentMonth error: ' + e_4, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getOrdersPerMonth2week = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var qData_1, orderCountingSQL_3, countArray_1, countArrayPos_1, countArrayWeb_1, countArrayStore_1, queries, e_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        qData_1 = JSON.parse(query);
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_3 = _a.sent();
                        countArray_1 = Array(14).fill(0);
                        countArrayPos_1 = Array(14).fill(0);
                        countArrayWeb_1 = Array(14).fill(0);
                        countArrayStore_1 = Array(14).fill(0);
                        queries = Array.from({ length: 14 }, function (_, index) { return __awaiter(_this, void 0, void 0, function () {
                            var dayOffset, monthCheckoutSQL;
                            return __generator(this, function (_a) {
                                dayOffset = "DATE_SUB(DATE(NOW()), INTERVAL ".concat(index, " DAY)");
                                monthCheckoutSQL = "\n          SELECT orderData->>'$.orderSource' as orderSource, orderData\n          FROM `".concat(this.app, "`.t_checkout\n          WHERE DATE(").concat(convertTimeZone('created_time'), ") = ").concat(dayOffset, "\n          AND ").concat(orderCountingSQL_3, ";\n        ");
                                return [2 /*return*/, database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        var total = 0, total_pos = 0, total_web = 0, total_store = 0;
                                        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                                            var checkout = data_1[_i];
                                            if (checkout.orderSource === 'POS') {
                                                total_pos += 1;
                                                if (qData_1.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData_1)) {
                                                    total_store += 1;
                                                }
                                            }
                                            else {
                                                total_web += 1;
                                            }
                                            total += 1;
                                        }
                                        // 直接存入陣列，避免物件排序
                                        countArray_1[index] = total;
                                        countArrayPos_1[index] = total_pos;
                                        countArrayWeb_1[index] = total_web;
                                        countArrayStore_1[index] = total_store;
                                    })];
                            });
                        }); });
                        // 等待所有 SQL 查詢完成
                        return [4 /*yield*/, Promise.all(queries)];
                    case 2:
                        // 等待所有 SQL 查詢完成
                        _a.sent();
                        return [2 /*return*/, { countArray: countArray_1, countArrayPos: countArrayPos_1, countArrayStore: countArrayStore_1, countArrayWeb: countArrayWeb_1 }];
                    case 3:
                        e_5 = _a.sent();
                        console.error('getOrdersPerMonth2week 錯誤:', e_5);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', "getOrdersPerMonth2week \u932F\u8AA4: ".concat(e_5), null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getOrdersPerMonth = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var qData_2, orderCountingSQL_4, countArray_2, countArrayPos_2, countArrayWeb_2, countArrayStore_2, queries, e_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        qData_2 = JSON.parse(query);
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_4 = _a.sent();
                        countArray_2 = Array(30).fill(0);
                        countArrayPos_2 = Array(30).fill(0);
                        countArrayWeb_2 = Array(30).fill(0);
                        countArrayStore_2 = Array(30).fill(0);
                        queries = Array.from({ length: 30 }, function (_, index) { return __awaiter(_this, void 0, void 0, function () {
                            var dayOffset, monthCheckoutSQL;
                            return __generator(this, function (_a) {
                                dayOffset = "DATE_SUB(DATE(NOW()), INTERVAL ".concat(index, " DAY)");
                                monthCheckoutSQL = "\n          SELECT orderData->>'$.orderSource' as orderSource, orderData\n          FROM `".concat(this.app, "`.t_checkout\n          WHERE DATE(").concat(convertTimeZone('created_time'), ") = ").concat(dayOffset, "\n          AND ").concat(orderCountingSQL_4, ";\n        ");
                                return [2 /*return*/, database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        var total = 0, total_pos = 0, total_web = 0, total_store = 0;
                                        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                                            var checkout = data_2[_i];
                                            if (checkout.orderSource === 'POS') {
                                                total_pos += 1;
                                                if (qData_2.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData_2)) {
                                                    total_store += 1;
                                                }
                                            }
                                            else {
                                                total_web += 1;
                                            }
                                            total += 1;
                                        }
                                        // 直接存入陣列，避免物件排序
                                        countArray_2[index] = total;
                                        countArrayPos_2[index] = total_pos;
                                        countArrayWeb_2[index] = total_web;
                                        countArrayStore_2[index] = total_store;
                                    })];
                            });
                        }); });
                        // 等待所有 SQL 查詢完成
                        return [4 /*yield*/, Promise.all(queries)];
                    case 2:
                        // 等待所有 SQL 查詢完成
                        _a.sent();
                        return [2 /*return*/, { countArray: countArray_2, countArrayPos: countArrayPos_2, countArrayStore: countArrayStore_2, countArrayWeb: countArrayWeb_2 }];
                    case 3:
                        e_6 = _a.sent();
                        console.error('getOrdersPerMonth 錯誤:', e_6);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', "getOrdersPerMonth \u932F\u8AA4: ".concat(e_6), null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getOrdersPerMonthCustom = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var qData_3, orderCountingSQL_5, days, endDate_1, countArray_3, countArrayPos_3, countArrayWeb_3, countArrayStore_3, queries, e_7;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        qData_3 = JSON.parse(query);
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_5 = _a.sent();
                        days = this.diffDates(new Date(qData_3.start), new Date(qData_3.end));
                        endDate_1 = tool_js_1.default.replaceDatetime(qData_3.end);
                        countArray_3 = Array(days).fill(0);
                        countArrayPos_3 = Array(days).fill(0);
                        countArrayWeb_3 = Array(days).fill(0);
                        countArrayStore_3 = Array(days).fill(0);
                        queries = Array.from({ length: days }, function (_, index) { return __awaiter(_this, void 0, void 0, function () {
                            var dayOffset, monthCheckoutSQL;
                            return __generator(this, function (_a) {
                                dayOffset = "DATE_SUB(DATE(\"".concat(endDate_1, "\"), INTERVAL ").concat(index, " DAY)");
                                monthCheckoutSQL = "\n          SELECT orderData->>'$.orderSource' as orderSource, orderData\n          FROM `".concat(this.app, "`.t_checkout\n          WHERE DATE(").concat(convertTimeZone('created_time'), ") = ").concat(dayOffset, "\n          AND ").concat(orderCountingSQL_5, ";\n        ");
                                return [2 /*return*/, database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        var total = 0, total_pos = 0, total_web = 0, total_store = 0;
                                        for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
                                            var checkout = data_3[_i];
                                            if (checkout.orderSource === 'POS') {
                                                total_pos += 1;
                                                if (qData_3.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData_3)) {
                                                    total_store += 1;
                                                }
                                            }
                                            else {
                                                total_web += 1;
                                            }
                                            total += 1;
                                        }
                                        // 直接存入陣列，避免物件排序
                                        countArray_3[index] = total;
                                        countArrayPos_3[index] = total_pos;
                                        countArrayWeb_3[index] = total_web;
                                        countArrayStore_3[index] = total_store;
                                    })];
                            });
                        }); });
                        // 等待所有 SQL 查詢完成
                        return [4 /*yield*/, Promise.all(queries)];
                    case 2:
                        // 等待所有 SQL 查詢完成
                        _a.sent();
                        return [2 /*return*/, { countArray: countArray_3, countArrayPos: countArrayPos_3, countArrayStore: countArrayStore_3, countArrayWeb: countArrayWeb_3 }];
                    case 3:
                        e_7 = _a.sent();
                        console.error('getOrdersPerMonthCustom 錯誤:', e_7);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', "getOrdersPerMonthCustom \u932F\u8AA4: ".concat(e_7), null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getOrdersPerMonth1Year = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var qData_4, orderCountingSQL_6, countArray_4, countArrayPos_4, countArrayWeb_4, countArrayStore_4, queries, e_8;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        qData_4 = JSON.parse(query);
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_6 = _a.sent();
                        countArray_4 = Array(12).fill(0);
                        countArrayPos_4 = Array(12).fill(0);
                        countArrayWeb_4 = Array(12).fill(0);
                        countArrayStore_4 = Array(12).fill(0);
                        queries = Array.from({ length: 12 }, function (_, index) { return __awaiter(_this, void 0, void 0, function () {
                            var monthOffset, monthCheckoutSQL;
                            return __generator(this, function (_a) {
                                monthOffset = "DATE_FORMAT(DATE_SUB(".concat(convertTimeZone('NOW()'), ", INTERVAL ").concat(index, " MONTH), '%Y-%m')");
                                monthCheckoutSQL = "\n          SELECT orderData->>'$.orderSource' as orderSource, orderData\n          FROM `".concat(this.app, "`.t_checkout\n          WHERE DATE_FORMAT(").concat(convertTimeZone('created_time'), ", '%Y-%m') = ").concat(monthOffset, "\n          AND ").concat(orderCountingSQL_6, ";\n        ");
                                return [2 /*return*/, database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        var total = 0, total_pos = 0, total_web = 0, total_store = 0;
                                        for (var _i = 0, data_4 = data; _i < data_4.length; _i++) {
                                            var checkout = data_4[_i];
                                            if (checkout.orderSource === 'POS') {
                                                total_pos += 1;
                                                if (qData_4.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData_4)) {
                                                    total_store += 1;
                                                }
                                            }
                                            else {
                                                total_web += 1;
                                            }
                                            total += 1;
                                        }
                                        countArray_4[index] = total;
                                        countArrayPos_4[index] = total_pos;
                                        countArrayWeb_4[index] = total_web;
                                        countArrayStore_4[index] = total_store;
                                    })];
                            });
                        }); });
                        // 等待所有 SQL 查詢完成
                        return [4 /*yield*/, Promise.all(queries)];
                    case 2:
                        // 等待所有 SQL 查詢完成
                        _a.sent();
                        return [2 /*return*/, { countArray: countArray_4, countArrayPos: countArrayPos_4, countArrayStore: countArrayStore_4, countArrayWeb: countArrayWeb_4 }];
                    case 3:
                        e_8 = _a.sent();
                        console.error('getOrdersPerMonth1Year 錯誤:', e_8);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', "getOrdersPerMonth1Year \u932F\u8AA4: ".concat(e_8), null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getSalesPerMonth1Year = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var qData_5, orderCountingSQL_7, countArray_5, countArrayPos_5, countArrayWeb_5, countArrayStore_5, pass_1, e_9;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        qData_5 = JSON.parse(query);
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_7 = _a.sent();
                        countArray_5 = {};
                        countArrayPos_5 = {};
                        countArrayWeb_5 = {};
                        countArrayStore_5 = {};
                        pass_1 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_1 = function (index) {
                                    var monthCheckoutSQL = "\n                        SELECT orderData\n                        FROM `".concat(_this.app, "`.t_checkout\n                        WHERE\n                            MONTH (").concat(convertTimeZone('created_time'), ") = MONTH (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " MONTH))\n                          AND YEAR (").concat(convertTimeZone('created_time'), ") = YEAR (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " MONTH))\n                            AND ").concat(orderCountingSQL_7, ";\n                    ");
                                    database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        pass_1++;
                                        var total = 0;
                                        var total_pos = 0;
                                        var total_web = 0;
                                        var total_store = 0;
                                        data.map(function (checkout) {
                                            if (checkout.orderData.orderSource === 'POS') {
                                                total_pos += parseInt(checkout.orderData.total, 10);
                                                if (qData_5.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData_5)) {
                                                    total_store += parseInt(checkout.orderData.total, 10);
                                                }
                                            }
                                            else {
                                                total_web += parseInt(checkout.orderData.total, 10);
                                            }
                                            total += parseInt(checkout.orderData.total, 10);
                                        });
                                        countArrayStore_5[index] = total_store;
                                        countArrayPos_5[index] = total_pos;
                                        countArrayWeb_5[index] = total_web;
                                        countArray_5[index] = total;
                                        if (pass_1 === 12) {
                                            resolve(true);
                                        }
                                    });
                                };
                                for (var index = 0; index < 12; index++) {
                                    _loop_1(index);
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                countArray: Object.keys(countArray_5)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArray_5[dd];
                                }),
                                countArrayPos: Object.keys(countArrayPos_5)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayPos_5[dd];
                                }),
                                countArrayStore: Object.keys(countArrayStore_5)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayStore_5[dd];
                                }),
                                countArrayWeb: Object.keys(countArrayWeb_5)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayWeb_5[dd];
                                }),
                            }];
                    case 3:
                        e_9 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e_9, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getSalesPerMonth2week = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var countArray_6, countArrayPos_6, countArrayWeb_6, countArrayStore_6, qData_6, orderCountingSQL_8, pass_2, e_10;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        countArray_6 = {};
                        countArrayPos_6 = {};
                        countArrayWeb_6 = {};
                        countArrayStore_6 = {};
                        qData_6 = JSON.parse(query);
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_8 = _a.sent();
                        pass_2 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_2 = function (index) {
                                    var monthCheckoutSQL = "\n                        SELECT orderData\n                        FROM `".concat(_this.app, "`.t_checkout\n                        WHERE\n                            DAY (").concat(convertTimeZone('created_time'), ") = DAY (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND MONTH (").concat(convertTimeZone('created_time'), ") = MONTH (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND YEAR (").concat(convertTimeZone('created_time'), ") = YEAR (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                            AND ").concat(orderCountingSQL_8, ";\n                    ");
                                    database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        pass_2++;
                                        var total = 0;
                                        var total_pos = 0;
                                        var total_web = 0;
                                        var total_store = 0;
                                        data.map(function (checkout) {
                                            if (checkout.orderData.orderSource === 'POS') {
                                                total_pos += parseInt(checkout.orderData.total, 10);
                                                if (qData_6.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData_6)) {
                                                    total_store += parseInt(checkout.orderData.total, 10);
                                                }
                                            }
                                            else {
                                                total_web += parseInt(checkout.orderData.total, 10);
                                            }
                                            total += parseInt(checkout.orderData.total, 10);
                                        });
                                        countArrayStore_6[index] = total_store;
                                        countArrayPos_6[index] = total_pos;
                                        countArrayWeb_6[index] = total_web;
                                        countArray_6[index] = total;
                                        if (pass_2 === 14) {
                                            resolve(true);
                                        }
                                    });
                                };
                                for (var index = 0; index < 14; index++) {
                                    _loop_2(index);
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                countArray: Object.keys(countArray_6)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArray_6[dd];
                                }),
                                countArrayPos: Object.keys(countArrayPos_6)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayPos_6[dd];
                                }),
                                countArrayStore: Object.keys(countArrayStore_6)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayStore_6[dd];
                                }),
                                countArrayWeb: Object.keys(countArrayWeb_6)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayWeb_6[dd];
                                }),
                            }];
                    case 3:
                        e_10 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e_10, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getSalesPerMonth = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var countArray_7, countArrayPos_7, countArrayWeb_7, countArrayStore_7, qData_7, orderCountingSQL_9, pass_3, e_11;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        countArray_7 = {};
                        countArrayPos_7 = {};
                        countArrayWeb_7 = {};
                        countArrayStore_7 = {};
                        qData_7 = JSON.parse(query);
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_9 = _a.sent();
                        pass_3 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_3 = function (index) {
                                    var monthCheckoutSQL = "\n                        SELECT orderData\n                        FROM `".concat(_this.app, "`.t_checkout\n                        WHERE\n                            DAY (").concat(convertTimeZone('created_time'), ") = DAY (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND MONTH (").concat(convertTimeZone('created_time'), ") = MONTH (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND YEAR (").concat(convertTimeZone('created_time'), ") = YEAR (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                            AND ").concat(orderCountingSQL_9, ";\n                    ");
                                    database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        pass_3++;
                                        var total = 0;
                                        var total_pos = 0;
                                        var total_web = 0;
                                        var total_store = 0;
                                        data.map(function (checkout) {
                                            if (checkout.orderData.orderSource === 'POS') {
                                                total_pos += parseInt(checkout.orderData.total, 10);
                                                if (qData_7.come_from &&
                                                    qData_7.come_from.includes('store_') &&
                                                    shopping_js_1.Shopping.isComeStore(checkout.orderData, qData_7)) {
                                                    total_store += parseInt(checkout.orderData.total, 10);
                                                }
                                            }
                                            else {
                                                total_web += parseInt(checkout.orderData.total, 10);
                                            }
                                            total += parseInt(checkout.orderData.total, 10);
                                        });
                                        countArrayStore_7[index] = total_store;
                                        countArrayPos_7[index] = total_pos;
                                        countArrayWeb_7[index] = total_web;
                                        countArray_7[index] = total;
                                        if (pass_3 === 30) {
                                            resolve(true);
                                        }
                                    });
                                };
                                for (var index = 0; index < 30; index++) {
                                    _loop_3(index);
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                countArray: Object.keys(countArray_7)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArray_7[dd];
                                }),
                                countArrayPos: Object.keys(countArrayPos_7)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayPos_7[dd];
                                }),
                                countArrayStore: Object.keys(countArrayStore_7)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayStore_7[dd];
                                }),
                                countArrayWeb: Object.keys(countArrayWeb_7)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayWeb_7[dd];
                                }),
                            }];
                    case 3:
                        e_11 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e_11, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.diffDates = function (startDateObj, endDateObj) {
        var timeDiff = Math.abs(endDateObj.getTime() - startDateObj.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    };
    DataAnalyze.prototype.getSalesPerMonthCustom = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var countArray_8, countArrayPos_8, countArrayWeb_8, countArrayStore_8, qData_8, days_1, formatEndDate_1, orderCountingSQL_10, pass_4, e_12;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        countArray_8 = {};
                        countArrayPos_8 = {};
                        countArrayWeb_8 = {};
                        countArrayStore_8 = {};
                        qData_8 = JSON.parse(query);
                        days_1 = this.diffDates(new Date(qData_8.start), new Date(qData_8.end));
                        formatEndDate_1 = "\"".concat(tool_js_1.default.replaceDatetime(qData_8.end), "\"");
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_10 = _a.sent();
                        pass_4 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_4 = function (index) {
                                    var monthCheckoutSQL = "\n                        SELECT orderData\n                        FROM `".concat(_this.app, "`.t_checkout\n                        WHERE\n                            DAY (").concat(convertTimeZone('created_time'), ") = DAY (DATE_SUB(").concat(convertTimeZone(formatEndDate_1), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND MONTH (").concat(convertTimeZone('created_time'), ") = MONTH (DATE_SUB(").concat(convertTimeZone(formatEndDate_1), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND YEAR (").concat(convertTimeZone('created_time'), ") = YEAR (DATE_SUB(").concat(convertTimeZone(formatEndDate_1), "\n                            , INTERVAL ").concat(index, " DAY))\n                            AND ").concat(orderCountingSQL_10, ";\n                    ");
                                    database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        pass_4++;
                                        var total = 0;
                                        var total_pos = 0;
                                        var total_web = 0;
                                        var total_store = 0;
                                        data.map(function (checkout) {
                                            if (checkout.orderData.orderSource === 'POS') {
                                                total_pos += parseInt(checkout.orderData.total, 10);
                                                if (qData_8.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData_8)) {
                                                    total_store += parseInt(checkout.orderData.total, 10);
                                                }
                                            }
                                            else {
                                                total_web += parseInt(checkout.orderData.total, 10);
                                            }
                                            total += parseInt(checkout.orderData.total, 10);
                                        });
                                        countArrayStore_8[index] = total_store;
                                        countArrayPos_8[index] = total_pos;
                                        countArrayWeb_8[index] = total_web;
                                        countArray_8[index] = total;
                                        if (pass_4 === days_1) {
                                            resolve(true);
                                        }
                                    });
                                };
                                for (var index = 0; index < days_1; index++) {
                                    _loop_4(index);
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                countArray: Object.keys(countArray_8)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArray_8[dd];
                                }),
                                countArrayPos: Object.keys(countArrayPos_8)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayPos_8[dd];
                                }),
                                countArrayStore: Object.keys(countArrayStore_8)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayStore_8[dd];
                                }),
                                countArrayWeb: Object.keys(countArrayWeb_8)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayWeb_8[dd];
                                }),
                            }];
                    case 3:
                        e_12 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e_12, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getOrderAvgSalePriceYear = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var qData_9, countArray_9, countArrayPos_9, countArrayWeb_9, countArrayStore_9, orderCountingSQL_11, pass_5, e_13;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        qData_9 = JSON.parse(query);
                        countArray_9 = {};
                        countArrayPos_9 = {};
                        countArrayWeb_9 = {};
                        countArrayStore_9 = {};
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_11 = _a.sent();
                        pass_5 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_5 = function (index) {
                                    var monthCheckoutSQL = "\n                        SELECT orderData\n                        FROM `".concat(_this.app, "`.t_checkout\n                        WHERE\n                            MONTH (").concat(convertTimeZone('created_time'), ") = MONTH (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " MONTH))\n                          AND YEAR (").concat(convertTimeZone('created_time'), ") = YEAR (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " MONTH))\n                            AND ").concat(orderCountingSQL_11, ";\n                    ");
                                    database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        pass_5++;
                                        var total = 0;
                                        var total_pos = 0;
                                        var total_web = 0;
                                        var total_store = 0;
                                        var pos_count = 0;
                                        var store_count = 0;
                                        var web_count = 0;
                                        data.map(function (checkout) {
                                            if (checkout.orderData.orderSource === 'POS') {
                                                pos_count++;
                                                total_pos += parseInt(checkout.orderData.total, 10);
                                                if (qData_9.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData_9)) {
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
                                        countArrayStore_9[index] = Math.floor(total_store / store_count);
                                        countArrayPos_9[index] = Math.floor(total_pos / pos_count);
                                        countArrayWeb_9[index] = Math.floor(total_web / web_count);
                                        countArray_9[index] = Math.floor(total / data.length);
                                        if (pass_5 === 12) {
                                            resolve(true);
                                        }
                                    });
                                };
                                for (var index = 0; index < 12; index++) {
                                    _loop_5(index);
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                countArray: Object.keys(countArray_9)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArray_9[dd];
                                }),
                                countArrayPos: Object.keys(countArrayPos_9)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayPos_9[dd];
                                }),
                                countArrayStore: Object.keys(countArrayStore_9)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayStore_9[dd];
                                }),
                                countArrayWeb: Object.keys(countArrayWeb_9)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayWeb_9[dd];
                                }),
                            }];
                    case 3:
                        e_13 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e_13, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getOrderAvgSalePrice = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var qData_10, countArray_10, countArrayPos_10, countArrayWeb_10, countArrayStore_10, orderCountingSQL_12, pass_6, e_14;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        qData_10 = JSON.parse(query);
                        countArray_10 = {};
                        countArrayPos_10 = {};
                        countArrayWeb_10 = {};
                        countArrayStore_10 = {};
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_12 = _a.sent();
                        pass_6 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_6 = function (index) {
                                    var monthCheckoutSQL = "\n                        SELECT orderData\n                        FROM `".concat(_this.app, "`.t_checkout\n                        WHERE\n                            DAY (").concat(convertTimeZone('created_time'), ") = DAY (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND MONTH (").concat(convertTimeZone('created_time'), ") = MONTH (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND YEAR (").concat(convertTimeZone('created_time'), ") = YEAR (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                            AND ").concat(orderCountingSQL_12, ";\n                    ");
                                    database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        pass_6++;
                                        var total = 0;
                                        var total_pos = 0;
                                        var total_web = 0;
                                        var total_store = 0;
                                        var pos_count = 0;
                                        var store_count = 0;
                                        var web_count = 0;
                                        data.map(function (checkout) {
                                            if (checkout.orderData.orderSource === 'POS') {
                                                pos_count++;
                                                total_pos += parseInt(checkout.orderData.total, 10);
                                                if (qData_10.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData_10)) {
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
                                        countArrayStore_10[index] = Math.floor(total_store / store_count);
                                        countArrayPos_10[index] = Math.floor(total_pos / pos_count);
                                        countArrayWeb_10[index] = Math.floor(total_web / web_count);
                                        countArray_10[index] = Math.floor(total / data.length);
                                        if (pass_6 === 14) {
                                            resolve(true);
                                        }
                                    });
                                };
                                for (var index = 0; index < 14; index++) {
                                    _loop_6(index);
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                countArray: Object.keys(countArray_10)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArray_10[dd];
                                }),
                                countArrayPos: Object.keys(countArrayPos_10)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayPos_10[dd];
                                }),
                                countArrayStore: Object.keys(countArrayStore_10)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayStore_10[dd];
                                }),
                                countArrayWeb: Object.keys(countArrayWeb_10)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayWeb_10[dd];
                                }),
                            }];
                    case 3:
                        e_14 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e_14, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getOrderAvgSalePriceMonth = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var qData_11, countArray_11, countArrayPos_11, countArrayWeb_11, countArrayStore_11, orderCountingSQL_13, pass_7, e_15;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        qData_11 = JSON.parse(query);
                        countArray_11 = {};
                        countArrayPos_11 = {};
                        countArrayWeb_11 = {};
                        countArrayStore_11 = {};
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_13 = _a.sent();
                        pass_7 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_7 = function (index) {
                                    var monthCheckoutSQL = "\n                        SELECT orderData\n                        FROM `".concat(_this.app, "`.t_checkout\n                        WHERE\n                            DAY (").concat(convertTimeZone('created_time'), ") = DAY (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND MONTH (").concat(convertTimeZone('created_time'), ") = MONTH (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND YEAR (").concat(convertTimeZone('created_time'), ") = YEAR (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                            AND ").concat(orderCountingSQL_13, ";\n                    ");
                                    database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        pass_7++;
                                        var total = 0;
                                        var total_pos = 0;
                                        var total_web = 0;
                                        var total_store = 0;
                                        var pos_count = 0;
                                        var store_count = 0;
                                        var web_count = 0;
                                        data.map(function (checkout) {
                                            if (checkout.orderData.orderSource === 'POS') {
                                                pos_count++;
                                                total_pos += parseInt(checkout.orderData.total, 10);
                                                if (qData_11.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData_11)) {
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
                                        countArrayStore_11[index] = Math.floor(total_store / store_count);
                                        countArrayPos_11[index] = Math.floor(total_pos / pos_count);
                                        countArrayWeb_11[index] = Math.floor(total_web / web_count);
                                        countArray_11[index] = Math.floor(total / data.length);
                                        if (pass_7 === 30) {
                                            resolve(true);
                                        }
                                    });
                                };
                                for (var index = 0; index < 30; index++) {
                                    _loop_7(index);
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                countArray: Object.keys(countArray_11)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArray_11[dd];
                                }),
                                countArrayPos: Object.keys(countArrayPos_11)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayPos_11[dd];
                                }),
                                countArrayStore: Object.keys(countArrayStore_11)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayStore_11[dd];
                                }),
                                countArrayWeb: Object.keys(countArrayWeb_11)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayWeb_11[dd];
                                }),
                            }];
                    case 3:
                        e_15 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e_15, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getOrderAvgSalePriceCustomer = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var countArray_12, countArrayPos_12, countArrayWeb_12, countArrayStore_12, qData_12, days_2, formatEndDate_2, orderCountingSQL_14, pass_8, e_16;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        countArray_12 = {};
                        countArrayPos_12 = {};
                        countArrayWeb_12 = {};
                        countArrayStore_12 = {};
                        qData_12 = JSON.parse(query);
                        days_2 = this.diffDates(new Date(qData_12.start), new Date(qData_12.end));
                        formatEndDate_2 = "\"".concat(tool_js_1.default.replaceDatetime(qData_12.end), "\"");
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL_14 = _a.sent();
                        pass_8 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_8 = function (index) {
                                    var monthCheckoutSQL = "\n                        SELECT orderData\n                        FROM `".concat(_this.app, "`.t_checkout\n                        WHERE\n                            DAY (").concat(convertTimeZone('created_time'), ") = DAY (DATE_SUB(").concat(convertTimeZone(formatEndDate_2), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND MONTH (").concat(convertTimeZone('created_time'), ") = MONTH (DATE_SUB(").concat(convertTimeZone(formatEndDate_2), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND YEAR (").concat(convertTimeZone('created_time'), ") = YEAR (DATE_SUB(").concat(convertTimeZone(formatEndDate_2), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND ").concat(orderCountingSQL_14, "\n                    ");
                                    database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        pass_8++;
                                        var total = 0;
                                        var total_pos = 0;
                                        var total_web = 0;
                                        var total_store = 0;
                                        var pos_count = 0;
                                        var web_count = 0;
                                        var store_count = 0;
                                        data.map(function (checkout) {
                                            if (checkout.orderData.orderSource === 'POS') {
                                                pos_count++;
                                                total_pos += parseInt(checkout.orderData.total, 10);
                                                if (qData_12.come_from.includes('store_') && shopping_js_1.Shopping.isComeStore(checkout.orderData, qData_12)) {
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
                                        countArrayStore_12[index] = Math.floor(total_store / store_count);
                                        countArrayPos_12[index] = Math.floor(total_pos / pos_count);
                                        countArrayWeb_12[index] = Math.floor(total_web / web_count);
                                        countArray_12[index] = Math.floor(total / data.length);
                                        if (pass_8 === days_2) {
                                            resolve(true);
                                        }
                                    });
                                };
                                for (var index = 0; index < days_2; index++) {
                                    _loop_8(index);
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                countArray: Object.keys(countArray_12)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArray_12[dd];
                                }),
                                countArrayPos: Object.keys(countArrayPos_12)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayPos_12[dd];
                                }),
                                countArrayStore: Object.keys(countArrayStore_12)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayStore_12[dd];
                                }),
                                countArrayWeb: Object.keys(countArrayWeb_12)
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArrayWeb_12[dd];
                                }),
                            }];
                    case 3:
                        e_16 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e_16, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getActiveRecentYear = function () {
        return __awaiter(this, void 0, void 0, function () {
            var endDate, startDate, sql, queryData, now, dataList, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endDate = moment_1.default.tz('Asia/Taipei').toDate();
                        endDate.setMonth(endDate.getMonth() + 1, 1);
                        startDate = moment_1.default.tz('Asia/Taipei').toDate();
                        startDate.setMonth(endDate.getMonth() - 12);
                        sql = "\n            SELECT mac_address, created_time\n            FROM `".concat(config_js_1.saasConfig.SAAS_NAME, "`.t_monitor\n            WHERE app_name = ").concat(database_js_1.default.escape(this.app), "\n            AND req_type = 'file'\n            AND created_time BETWEEN '").concat(startDate.toISOString(), "' AND '").concat(endDate.toISOString(), "'\n            GROUP BY id, mac_address\n        ");
                        return [4 /*yield*/, database_js_1.default.query(sql, [])];
                    case 1:
                        queryData = _a.sent();
                        now = moment_1.default.tz('Asia/Taipei').toDate();
                        dataList = Array.from({ length: 12 }, function (_, index) {
                            // 計算第 index 個月前的日期
                            var targetDate = new Date(now.getFullYear(), now.getMonth() - index, 1);
                            var year = targetDate.getFullYear();
                            var month = targetDate.getMonth() + 1; // 月份從 0 開始，需要加 1
                            // 篩選該月份的資料
                            var filteredData = queryData.filter(function (item) {
                                var date = moment_1.default.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                                return date.getFullYear() === year && date.getMonth() + 1 === month;
                            });
                            // 計算不重複的 mac_address
                            var uniqueMacAddresses = new Set(filteredData.map(function (item) { return item.mac_address; }));
                            return {
                                year: year,
                                month: month,
                                total_count: filteredData.length,
                                unique_count: uniqueMacAddresses.size,
                            };
                        });
                        result = dataList.map(function (data) { return data.unique_count; });
                        return [2 /*return*/, {
                                count_array: result.reverse(), // 將結果反轉，保證時間順序為最近到最遠
                            }];
                }
            });
        });
    };
    DataAnalyze.prototype.getActiveRecentWeek = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql, queryData, now, dataList, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "\n            SELECT mac_address, ".concat(convertTimeZone('created_time'), " AS created_time\n            FROM `").concat(config_js_1.saasConfig.SAAS_NAME, "`.t_monitor\n            WHERE app_name = ").concat(database_js_1.default.escape(this.app), "\n                AND req_type = 'file'\n                AND ").concat(convertTimeZone('created_time'), " BETWEEN (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                , INTERVAL 14 DAY))\n              AND ").concat(convertTimeZone('NOW()'), "\n            GROUP BY id, mac_address\n        ");
                        return [4 /*yield*/, database_js_1.default.query(sql, [])];
                    case 1:
                        queryData = _a.sent();
                        now = moment_1.default.tz('Asia/Taipei').toDate();
                        dataList = Array.from({ length: 14 }, function (_, index) {
                            var targetDate = new Date(now.getTime());
                            targetDate.setDate(new Date(now.getTime()).getDate() - index); // 設定為第 index 天前的日期
                            var year = targetDate.getFullYear();
                            var month = targetDate.getMonth() + 1; // 月份從 0 開始，需要加 1
                            var day = targetDate.getDate();
                            // 篩選該日期的資料
                            var filteredData = queryData.filter(function (item) {
                                var date = moment_1.default.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                                return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
                            });
                            // 計算不重複的 mac_address
                            var uniqueMacAddresses = new Set(filteredData.map(function (item) { return item.mac_address; }));
                            return {
                                year: year,
                                month: month,
                                day: day,
                                total_count: filteredData.length,
                                unique_count: uniqueMacAddresses.size,
                            };
                        });
                        result = dataList.map(function (data) { return data.unique_count; });
                        return [2 /*return*/, {
                                count_array: result.reverse(), // 將結果反轉，保證時間順序為最近到最遠
                            }];
                }
            });
        });
    };
    DataAnalyze.prototype.getActiveRecentMonth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql, queryData, now, dataList, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "\n            SELECT mac_address, ".concat(convertTimeZone('created_time'), " AS created_time\n            FROM `").concat(config_js_1.saasConfig.SAAS_NAME, "`.t_monitor\n            WHERE app_name = ").concat(database_js_1.default.escape(this.app), "\n                AND req_type = 'file'\n                AND ").concat(convertTimeZone('created_time'), " BETWEEN (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                , INTERVAL 30 DAY))\n              AND ").concat(convertTimeZone('NOW()'), "\n            GROUP BY id, mac_address\n        ");
                        return [4 /*yield*/, database_js_1.default.query(sql, [])];
                    case 1:
                        queryData = _a.sent();
                        now = moment_1.default.tz('Asia/Taipei').toDate();
                        dataList = Array.from({ length: 30 }, function (_, index) {
                            var targetDate = new Date(now.getTime());
                            targetDate.setDate(new Date(now.getTime()).getDate() - index); // 設定為第 index 天前的日期
                            var year = targetDate.getFullYear();
                            var month = targetDate.getMonth() + 1; // 月份從 0 開始，需要加 1
                            var day = targetDate.getDate();
                            // 篩選該日期的資料
                            var filteredData = queryData.filter(function (item) {
                                var date = moment_1.default.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                                return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
                            });
                            // 計算不重複的 mac_address
                            var uniqueMacAddresses = new Set(filteredData.map(function (item) { return item.mac_address; }));
                            return {
                                year: year,
                                month: month,
                                day: day,
                                total_count: filteredData.length,
                                unique_count: uniqueMacAddresses.size,
                            };
                        });
                        result = dataList.map(function (data) { return data.unique_count; });
                        return [2 /*return*/, {
                                count_array: result.reverse(), // 將結果反轉，保證時間順序為最近到最遠
                            }];
                }
            });
        });
    };
    DataAnalyze.prototype.getActiveRecentCustom = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var qData, formatStartDate, formatEndDate, days, sql, queryData, now, dataList, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qData = JSON.parse(query);
                        formatStartDate = "\"".concat(tool_js_1.default.replaceDatetime(qData.start), "\"");
                        formatEndDate = "\"".concat(tool_js_1.default.replaceDatetime(qData.end), "\"");
                        days = this.diffDates(new Date(qData.start), new Date(qData.end));
                        sql = "\n            SELECT mac_address, ".concat(convertTimeZone('created_time'), " AS created_time\n            FROM `").concat(config_js_1.saasConfig.SAAS_NAME, "`.t_monitor\n            WHERE app_name = ").concat(database_js_1.default.escape(this.app), "\n                AND req_type = 'file'\n                AND ").concat(convertTimeZone('created_time'), "\n                BETWEEN ").concat(convertTimeZone(formatStartDate), "\n              AND ").concat(convertTimeZone(formatEndDate), "\n            GROUP BY id, mac_address\n        ");
                        return [4 /*yield*/, database_js_1.default.query(sql, [])];
                    case 1:
                        queryData = _a.sent();
                        now = (0, moment_1.default)(qData.end).tz('Asia/Taipei').clone().toDate();
                        dataList = Array.from({ length: days }, function (_, index) {
                            var targetDate = new Date(now.getTime());
                            targetDate.setDate(new Date(now.getTime()).getDate() - index); // 設定為第 index 天前的日期
                            var year = targetDate.getFullYear();
                            var month = targetDate.getMonth() + 1; // 月份從 0 開始，需要加 1
                            var day = targetDate.getDate();
                            // 篩選該日期的資料
                            var filteredData = queryData.filter(function (item) {
                                var date = moment_1.default.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                                return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
                            });
                            // 計算不重複的 mac_address
                            var uniqueMacAddresses = new Set(filteredData.map(function (item) { return item.mac_address; }));
                            return {
                                year: year,
                                month: month,
                                day: day,
                                total_count: filteredData.length,
                                unique_count: uniqueMacAddresses.size,
                            };
                        });
                        result = dataList.map(function (data) { return data.unique_count; });
                        return [2 /*return*/, {
                                count_array: result.reverse(), // 將結果反轉，保證時間順序為最近到最遠
                            }];
                }
            });
        });
    };
    DataAnalyze.prototype.getRegisterMonth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var countArray_13, pass_9, e_17;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        countArray_13 = {};
                        pass_9 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_9 = function (index) {
                                    var monthCheckoutSQL = "\n                        SELECT count(1)\n                        FROM `".concat(_this.app, "`.t_user\n                        WHERE\n                            DAY (").concat(convertTimeZone('created_time'), ") = DAY (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND MONTH (").concat(convertTimeZone('created_time'), ") = MONTH (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND YEAR (").concat(convertTimeZone('created_time'), ") = YEAR (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND status = 1;\n                    ");
                                    database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        countArray_13[index] = data[0]['count(1)'];
                                        pass_9++;
                                        if (pass_9 === 30) {
                                            resolve(true);
                                        }
                                    });
                                };
                                for (var index = 0; index < 30; index++) {
                                    _loop_9(index);
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                countArray: Object.keys(countArray_13)
                                    .map(function (dd) {
                                    return parseInt(dd);
                                })
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArray_13[dd];
                                })
                                    .reverse(),
                            }];
                    case 2:
                        e_17 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e_17, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getRegisterCustom = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var qData, days_3, formatEndDate_3, countArray_14, pass_10, e_18;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        qData = JSON.parse(query);
                        days_3 = this.diffDates(new Date(qData.start), new Date(qData.end));
                        formatEndDate_3 = "\"".concat(tool_js_1.default.replaceDatetime(qData.end), "\"");
                        countArray_14 = {};
                        pass_10 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_10 = function (index) {
                                    var monthCheckoutSQL = "\n                        SELECT count(1)\n                        FROM `".concat(_this.app, "`.t_user\n                        WHERE\n                            DAY (").concat(convertTimeZone('created_time'), ") = DAY (DATE_SUB(").concat(convertTimeZone(formatEndDate_3), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND MONTH (").concat(convertTimeZone('created_time'), ") = MONTH (DATE_SUB(").concat(convertTimeZone(formatEndDate_3), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND YEAR (").concat(convertTimeZone('created_time'), ") = YEAR (DATE_SUB(").concat(convertTimeZone(formatEndDate_3), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND status = 1;\n                    ");
                                    database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        countArray_14[index] = data[0]['count(1)'];
                                        pass_10++;
                                        if (pass_10 === days_3) {
                                            resolve(true);
                                        }
                                    });
                                };
                                for (var index = 0; index < days_3; index++) {
                                    _loop_10(index);
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                countArray: Object.keys(countArray_14)
                                    .map(function (dd) {
                                    return parseInt(dd);
                                })
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArray_14[dd];
                                })
                                    .reverse(),
                            }];
                    case 2:
                        e_18 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e_18, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getRegister2week = function () {
        return __awaiter(this, void 0, void 0, function () {
            var countArray_15, pass_11, e_19;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        countArray_15 = {};
                        pass_11 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_11 = function (index) {
                                    var monthCheckoutSQL = "\n                        SELECT count(1)\n                        FROM `".concat(_this.app, "`.t_user\n                        WHERE\n                            DAY (").concat(convertTimeZone('created_time'), ") = DAY (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND MONTH (").concat(convertTimeZone('created_time'), ") = MONTH (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND YEAR (").concat(convertTimeZone('created_time'), ") = YEAR (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " DAY))\n                          AND status = 1;\n                    ");
                                    database_js_1.default.query(monthCheckoutSQL, []).then(function (data) {
                                        countArray_15[index] = data[0]['count(1)'];
                                        pass_11++;
                                        if (pass_11 === 14) {
                                            resolve(true);
                                        }
                                    });
                                };
                                for (var index = 0; index < 14; index++) {
                                    _loop_11(index);
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                countArray: Object.keys(countArray_15)
                                    .map(function (dd) {
                                    return parseInt(dd);
                                })
                                    .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                    .map(function (dd) {
                                    return countArray_15[dd];
                                })
                                    .reverse(),
                            }];
                    case 2:
                        e_19 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e_19, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getRegisterYear = function () {
        return __awaiter(this, void 0, void 0, function () {
            var countArray_16, order, pass_12, e_20;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        countArray_16 = {};
                        return [4 /*yield*/, database_js_1.default.query("SELECT count(1)\n                 FROM `".concat(this.app, "`.t_user\n                 WHERE DATE (created_time) = CURDATE()"), [])];
                    case 1:
                        order = _b.sent();
                        pass_12 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _loop_12 = function (index) {
                                    var monthRegisterSQL = "\n                        SELECT count(1)\n                        FROM `".concat(_this.app, "`.t_user\n                        WHERE MONTH (").concat(convertTimeZone('created_time'), ") = MONTH (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " MONTH))\n                          AND YEAR (").concat(convertTimeZone('created_time'), ") = YEAR (DATE_SUB(").concat(convertTimeZone('NOW()'), "\n                            , INTERVAL ").concat(index, " MONTH))\n                    ");
                                    database_js_1.default.query(monthRegisterSQL, []).then(function (data) {
                                        pass_12++;
                                        countArray_16[index] = data[0]['count(1)'];
                                        if (pass_12 === 12) {
                                            resolve(true);
                                        }
                                    });
                                };
                                for (var index = 0; index < 12; index++) {
                                    _loop_12(index);
                                }
                            })];
                    case 2:
                        _b.sent();
                        _a = {
                            //用戶總數
                            today: order[0]['count(1)'],
                            //每月紀錄
                            count_register: Object.keys(countArray_16)
                                .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); })
                                .map(function (dd) {
                                return countArray_16[dd];
                            })
                                .reverse()
                        };
                        return [4 /*yield*/, this.getRegister2week()];
                    case 3: return [2 /*return*/, (
                        //兩週紀錄
                        _a.count_2_week_register = (_b.sent()).countArray,
                            _a)];
                    case 4:
                        e_20 = _b.sent();
                        console.error(e_20);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getOrderToDay Error:' + e_20, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DataAnalyze.prototype.getOrderToDay = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orderCountingSQL, _a, order, unShipmentCount, e_21;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getOrderCountingSQL()];
                    case 1:
                        orderCountingSQL = _c.sent();
                        return [4 /*yield*/, Promise.all([
                                database_js_1.default.query("SELECT status, orderData->>'$.total' as total\n           FROM `".concat(this.app, "`.t_checkout\n           WHERE DATE(").concat(convertTimeZone('created_time'), ") = CURDATE()"), []),
                                database_js_1.default.query("SELECT COUNT(1) as count\n           FROM `".concat(this.app, "`.t_checkout\n           WHERE ").concat(orderCountingSQL, "\n           AND DATE(").concat(convertTimeZone('created_time'), ") = CURDATE()"), []),
                            ])];
                    case 2:
                        _a = _c.sent(), order = _a[0], unShipmentCount = _a[1];
                        return [2 /*return*/, {
                                // 訂單總數
                                total_count: order.filter(function (dd) { return dd.status === 1; }).length,
                                // 未出貨訂單
                                un_shipment: ((_b = unShipmentCount[0]) === null || _b === void 0 ? void 0 : _b.count) || 0,
                                // 未付款訂單
                                un_pay: order.filter(function (dd) { return dd.status === 0; }).length,
                                // 今日成交金額
                                total_amount: order
                                    .filter(function (dd) { return dd.status === 1; })
                                    .reduce(function (sum, dd) { return sum + Number(dd.total || 0); }, 0),
                            }];
                    case 3:
                        e_21 = _c.sent();
                        console.error('getOrderToDay Error:', e_21);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', "getOrderToDay Error: ".concat(e_21), null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DataAnalyze;
}());
exports.DataAnalyze = DataAnalyze;

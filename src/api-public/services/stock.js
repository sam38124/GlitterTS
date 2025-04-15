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
exports.Stock = void 0;
var database_1 = require("../../modules/database");
var exception_1 = require("../../modules/exception");
var tool_js_1 = require("../../modules/tool.js");
var shopping_1 = require("./shopping");
var share_permission_1 = require("./share-permission");
var typeConfig = {
    restocking: {
        name: '進貨',
        prefixId: 'IC',
        status: {
            0: {
                title: '已完成',
                badge: 'info',
            },
            1: {
                title: '已補貨',
                badge: 'info',
            },
            2: {
                title: '待進貨',
                badge: 'warning',
            },
            3: {
                title: '核對中',
                badge: 'warning',
            },
            4: {
                title: '已暫停',
                badge: 'normal',
            },
            5: {
                title: '待補貨',
                badge: 'notify',
            },
            6: {
                title: '已取消',
                badge: 'notify',
            },
        },
    },
    transfer: {
        name: '調撥',
        prefixId: 'TB',
        status: {
            0: {
                title: '已完成',
                badge: 'info',
            },
            1: {
                title: '已補貨',
                badge: 'info',
            },
            2: {
                title: '待調撥',
                badge: 'warning',
            },
            3: {
                title: '核對中',
                badge: 'warning',
            },
            4: {
                title: '已暫停',
                badge: 'normal',
            },
            5: {
                title: '待補貨',
                badge: 'notify',
            },
            6: {
                title: '已取消',
                badge: 'notify',
            },
        },
    },
    checking: {
        name: '盤點',
        prefixId: 'PD',
        status: {
            0: {
                title: '已完成',
                badge: 'info',
            },
            1: {
                title: '已修正',
                badge: 'info',
            },
            2: {
                title: '待盤點',
                badge: 'warning',
            },
            3: {
                title: '盤點中',
                badge: 'warning',
            },
            4: {
                title: '已暫停',
                badge: 'normal',
            },
            5: {
                title: '異常',
                badge: 'notify',
            },
            6: {
                title: '已取消',
                badge: 'notify',
            },
        },
    },
};
var Stock = /** @class */ (function () {
    function Stock(app, token) {
        this.app = app;
        this.token = token;
    }
    Stock.prototype.productList = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, sqlArr, sqlText, getStockTotal, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = json.page ? parseInt("".concat(json.page), 10) : 0;
                        limit = json.limit ? parseInt("".concat(json.limit), 10) : 20;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        sqlArr = ['1=1'];
                        if (json.variant_id_list) {
                            sqlArr.push("(v.id in (".concat(json.variant_id_list, "))"));
                        }
                        sqlText = sqlArr.join(' AND ');
                        return [4 /*yield*/, database_1.default.query("SELECT count(v.id) as c\n                 FROM `".concat(this.app, "`.t_variants as v,\n                      `").concat(this.app, "`.t_manager_post as p\n                 WHERE v.content ->>'$.stockList.").concat(json.search || 'store', ".count' > 0\n                   AND v.product_id = p.id\n                   AND ").concat(sqlText, "\n                "), [])];
                    case 2:
                        getStockTotal = _a.sent();
                        return [4 /*yield*/, database_1.default.query("SELECT v.*, p.content as product_content\n                 FROM `".concat(this.app, "`.t_variants as v,\n                      `").concat(this.app, "`.t_manager_post as p\n                 WHERE v.content ->>'$.stockList.").concat(json.search || 'store', ".count' > 0\n                   AND v.product_id = p.id\n                   AND ").concat(sqlText, "\n                     LIMIT ").concat(page * limit, "\n                     , ").concat(limit, ";\n                "), [])];
                    case 3:
                        data = _a.sent();
                        data.map(function (item) {
                            item.count = item.content.stockList[json.search].count;
                            item.title = (function () {
                                try {
                                    return item.product_content.language_data['zh-TW'].title;
                                }
                                catch (error) {
                                    console.error("product id ".concat(item.product_id, " \u6C92\u6709 zh-TW \u7684\u6A19\u984C\uFF0C\u4F7F\u7528\u539F\u6A19\u984C"));
                                    return item.product_content.title;
                                }
                            })();
                            return item;
                        });
                        return [2 /*return*/, {
                                total: getStockTotal[0].c,
                                data: data,
                            }];
                    case 4:
                        error_1 = _a.sent();
                        console.error(error_1);
                        if (error_1 instanceof Error) {
                            throw exception_1.default.BadRequestError('stock productList Error: ', error_1.message, null);
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Stock.prototype.productStock = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, sqlArr, sqlText, getStockTotal, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = json.page ? parseInt("".concat(json.page), 10) : 0;
                        limit = json.limit ? parseInt("".concat(json.limit), 10) : 20;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        sqlArr = ['1=1'];
                        if (json.variant_id_list) {
                            sqlArr.push("(v.id in (".concat(json.variant_id_list, "))"));
                        }
                        sqlText = sqlArr.join(' AND ');
                        return [4 /*yield*/, database_1.default.query("SELECT count(v.id) as c\n                 FROM `".concat(this.app, "`.t_variants as v,\n                      `").concat(this.app, "`.t_manager_post as p\n                 WHERE v.product_id = p.id\n                   AND ").concat(sqlText, "\n                "), [])];
                    case 2:
                        getStockTotal = _a.sent();
                        return [4 /*yield*/, database_1.default.query("SELECT v.*, p.content as product_content\n                 FROM `".concat(this.app, "`.t_variants as v,\n                      `").concat(this.app, "`.t_manager_post as p\n                 WHERE v.product_id = p.id\n                   AND ").concat(sqlText, "\n                     LIMIT ").concat(page * limit, "\n                     , ").concat(limit, ";\n                "), [])];
                    case 3:
                        data = _a.sent();
                        data.map(function (item) {
                            item.count = Object.values(item.content.stockList).reduce(function (sum, stock) { return sum + stock.count; }, 0);
                            item.title = (function () {
                                try {
                                    return item.product_content.language_data['zh-TW'].title;
                                }
                                catch (error) {
                                    console.error("product id ".concat(item.product_id, " \u6C92\u6709 zh-TW \u7684\u6A19\u984C\uFF0C\u4F7F\u7528\u539F\u6A19\u984C"));
                                    return item.product_content.title;
                                }
                            })();
                            return item;
                        });
                        return [2 /*return*/, {
                                total: getStockTotal[0].c,
                                data: data,
                            }];
                    case 4:
                        error_2 = _a.sent();
                        console.error(error_2);
                        if (error_2 instanceof Error) {
                            throw exception_1.default.BadRequestError('stock productList Error: ', error_2.message, null);
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Stock.prototype.deleteStoreProduct = function (store_id) {
        return __awaiter(this, void 0, void 0, function () {
            var productList_1, variants_1, promise, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        productList_1 = {};
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                 FROM `".concat(this.app, "`.t_variants\n                 WHERE content ->>'$.stockList.").concat(store_id, ".count' is not null;\n                "), [])];
                    case 1:
                        variants_1 = _a.sent();
                        if (variants_1.length == 0) {
                            return [2 /*return*/, { data: true, process: '' }];
                        }
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var n = 0;
                                var _loop_1 = function (variant) {
                                    delete variant.content.stockList[store_id];
                                    database_1.default.query("UPDATE `".concat(_this.app, "`.t_variants\n                         SET ?\n                         WHERE id = ?\n                        "), [{ content: JSON.stringify(variant.content) }, variant.id]).then(function () {
                                        var p = productList_1["".concat(variant.product_id)];
                                        if (p) {
                                            p.push(variant.content);
                                        }
                                        else {
                                            productList_1["".concat(variant.product_id)] = [variant.content];
                                        }
                                        n++;
                                        if (n === variants_1.length) {
                                            resolve();
                                        }
                                    });
                                };
                                for (var _i = 0, variants_2 = variants_1; _i < variants_2.length; _i++) {
                                    var variant = variants_2[_i];
                                    _loop_1(variant);
                                }
                            }).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                var idString, products_1;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            idString = Object.keys(productList_1)
                                                .map(function (item) { return "\"".concat(item, "\""); })
                                                .join(',');
                                            if (!(idString.length > 0)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, database_1.default.query("SELECT *\n                         FROM `".concat(this.app, "`.t_manager_post\n                         WHERE id in (").concat(idString, ");\n                        "), [])];
                                        case 1:
                                            products_1 = _a.sent();
                                            return [4 /*yield*/, new Promise(function (resolve) {
                                                    var n = 0;
                                                    for (var _i = 0, products_2 = products_1; _i < products_2.length; _i++) {
                                                        var product = products_2[_i];
                                                        product.content.variants = productList_1["".concat(product.id)];
                                                        database_1.default.query("UPDATE `".concat(_this.app, "`.t_manager_post\n                                 SET ?\n                                 WHERE id = ?"), [{ content: JSON.stringify(product.content) }, product.id]).then(function () {
                                                            n++;
                                                            if (n === products_1.length) {
                                                                resolve();
                                                            }
                                                        });
                                                    }
                                                }).then(function () {
                                                    return { data: true, process: 't_variants, t_manager_post' };
                                                })];
                                        case 2: return [2 /*return*/, _a.sent()];
                                        case 3: return [2 /*return*/, { data: true, process: 't_variants' }];
                                    }
                                });
                            }); })];
                    case 2:
                        promise = _a.sent();
                        return [2 /*return*/, promise];
                    case 3:
                        error_3 = _a.sent();
                        console.error(error_3);
                        if (error_3 instanceof Error) {
                            throw exception_1.default.BadRequestError('stock deleteStore Error: ', error_3.message, null);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Stock.prototype.allocateStock = function (stockList, requiredCount) {
        var remainingCount = requiredCount;
        var totalDeduction = 0; // 紀錄所有扣除的總數
        var deductionLog = {}; // 記錄每個倉庫的扣除值
        // 按照 `count` 從大到小排序倉庫
        var sortedStock = Object.entries(stockList).sort(function (_a, _b) {
            var a = _a[1];
            var b = _b[1];
            return b.count - a.count;
        });
        for (var _i = 0, sortedStock_1 = sortedStock; _i < sortedStock_1.length; _i++) {
            var _a = sortedStock_1[_i], key = _a[0], stock = _a[1];
            if (remainingCount === 0)
                break; // 如果需求已經滿足，停止迴圈
            var deduction = Math.min(stock.count, remainingCount); // 扣除的數量為倉庫數量或剩餘需求中的較小值
            remainingCount -= deduction; // 更新剩餘需求
            totalDeduction += deduction; // 累加扣除值
            stock.count -= deduction; // 更新倉庫數量
            deductionLog[key] = deduction; // 記錄本次扣除
        }
        // 紀錄最大扣除值
        var maxDeduction = Math.max.apply(Math, __spreadArray(__spreadArray([], Object.values(deductionLog), false), [0], false));
        return {
            stockList: stockList,
            deductionLog: deductionLog,
            totalDeduction: totalDeduction,
            remainingCount: remainingCount,
        };
    };
    Stock.prototype.recoverStock = function (variant) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, variantData, pdDqlData, pd, pbVariant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = variant.spec.length > 0
                            ? "AND JSON_CONTAINS(content->'$.spec', JSON_ARRAY(".concat(variant.spec
                                .map(function (data) {
                                return "\"".concat(data, "\"");
                            })
                                .join(','), "));")
                            : '';
                        return [4 /*yield*/, database_1.default.query("\n            SELECT *\n            FROM `".concat(this.app, "`.t_variants\n            WHERE `product_id` = \"").concat(variant.id, "\" ").concat(sql, "\n        "), [])];
                    case 1:
                        variantData = _a.sent();
                        return [4 /*yield*/, new shopping_1.Shopping(this.app, this.token).getProduct({
                                page: 0,
                                limit: 50,
                                id: variant.id,
                                status: 'inRange',
                            })];
                    case 2:
                        pdDqlData = (_a.sent()).data;
                        pd = pdDqlData.content;
                        pbVariant = pd.variants.find(function (dd) {
                            return dd.spec.join('-') === variant.spec.join('-');
                        });
                        variantData = variantData[0];
                        Object.entries(variant.deduction_log).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            pbVariant.stockList[key].count = parseInt(pbVariant.stockList[key].count) + parseInt(value);
                            pbVariant.stock = parseInt(pbVariant.stock) + parseInt(value);
                            variantData.content.stockList[key].count = parseInt(variantData.content.stockList[key].count) + parseInt(value);
                            variantData.content.stock = parseInt(variantData.content.stock) + parseInt(value);
                        });
                        return [4 /*yield*/, new shopping_1.Shopping(this.app, this.token).updateVariantsWithSpec(variantData.content, variant.id, variant.spec)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, database_1.default.query("UPDATE `".concat(this.app, "`.`t_manager_post`\n                                     SET ?\n                                     WHERE 1 = 1\n                                       and id = ").concat(pdDqlData.id), [{ content: JSON.stringify(pd) }])];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Stock.prototype.shippingStock = function (variant) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, variantData, pdDqlData, pd, pbVariant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = variant.spec.length > 0
                            ? "AND JSON_CONTAINS(content->'$.spec', JSON_ARRAY(".concat(variant.spec
                                .map(function (data) {
                                return "\"".concat(data, "\"");
                            })
                                .join(','), "));")
                            : '';
                        return [4 /*yield*/, database_1.default.query("\n            SELECT *\n            FROM `".concat(this.app, "`.t_variants\n            WHERE `product_id` = \"").concat(variant.id, "\" ").concat(sql, "\n        "), [])];
                    case 1:
                        variantData = _a.sent();
                        return [4 /*yield*/, new shopping_1.Shopping(this.app, this.token).getProduct({
                                page: 0,
                                limit: 50,
                                id: variant.id,
                                status: 'inRange',
                            })];
                    case 2:
                        pdDqlData = (_a.sent()).data;
                        pd = pdDqlData.content;
                        pbVariant = pd.variants.find(function (dd) {
                            return dd.spec.join('-') === variant.spec.join('-');
                        });
                        variantData = variantData[0];
                        Object.entries(variant.deduction_log).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            pbVariant.stockList[key].count = parseInt(pbVariant.stockList[key].count) - parseInt(value);
                            pbVariant.stock = parseInt(pbVariant.stock) - parseInt(value);
                            variantData.content.stockList[key].count = parseInt(variantData.content.stockList[key].count) - parseInt(value);
                            variantData.content.stock = parseInt(variantData.content.stock) - parseInt(value);
                        });
                        return [4 /*yield*/, new shopping_1.Shopping(this.app, this.token).updateVariantsWithSpec(variantData.content, variant.id, variant.spec)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, database_1.default.query("UPDATE `".concat(this.app, "`.`t_manager_post`\n                                     SET ?\n                                     WHERE 1 = 1\n                                       and id = ").concat(pdDqlData.id), [{ content: JSON.stringify(pd) }])];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Stock.prototype.getHistory = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            function formatDate(sqlDatetime) {
                // 將 datetime 字串轉換為 JavaScript Date 物件
                var date = new Date(sqlDatetime);
                // 取得年、月、日
                var year = date.getFullYear();
                var month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是從 0 開始的，需要加 1
                var day = String(date.getDate()).padStart(2, '0');
                // 組合成 'yyyy-mm-dd' 格式
                var formattedDate = "".concat(year, "-").concat(month, "-").concat(day);
                return formattedDate;
            }
            var page, limit, sqlArr, sqlString, getHistoryTotal, data, getPermission_1, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = json.page ? parseInt("".concat(json.page), 10) : 0;
                        limit = json.limit ? parseInt("".concat(json.limit), 10) : 20;
                        sqlArr = ['(status <> -1)', "(type = '".concat(json.type, "')")];
                        if (json.order_id) {
                            sqlArr.push("(order_id = '".concat(json.order_id, "')"));
                        }
                        if (json.queryType && json.search) {
                            switch (json.queryType) {
                                case 'order_id':
                                    sqlArr.push("(order_id like '%".concat(json.search, "%')"));
                                    break;
                                case 'note':
                                    sqlArr.push("(JSON_EXTRACT(content, '$.note') like '%".concat(json.search, "%')"));
                                    break;
                            }
                        }
                        sqlString = sqlArr.join(' AND ');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        if (!this.token) {
                            return [2 /*return*/, {
                                    total: 0,
                                    data: [],
                                }];
                        }
                        return [4 /*yield*/, database_1.default.query("SELECT count(id) as c FROM `".concat(this.app, "`.t_stock_history\n                WHERE 1=1 AND ").concat(sqlString, "\n                "), [])];
                    case 2:
                        getHistoryTotal = _a.sent();
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(this.app, "`.t_stock_history\n                    WHERE 1=1 AND ").concat(sqlString, "\n                    ORDER BY order_id DESC\n                    LIMIT ").concat(page * limit, ", ").concat(limit, ";\n                "), [])];
                    case 3:
                        data = _a.sent();
                        return [4 /*yield*/, new share_permission_1.SharePermission(this.app, this.token).getPermission({
                                page: 0,
                                limit: 9999,
                            })];
                    case 4:
                        getPermission_1 = (_a.sent());
                        data.map(function (rowData) {
                            rowData.created_time = formatDate(rowData.created_time);
                            rowData.content.changeLogs.map(function (log) {
                                var findManager = getPermission_1.data.find(function (m) { return "".concat(m.user) === "".concat(log.user); });
                                log.user_name = findManager ? findManager.config.name : '';
                                return log;
                            });
                        });
                        return [2 /*return*/, {
                                total: getHistoryTotal[0].c,
                                data: data,
                            }];
                    case 5:
                        error_4 = _a.sent();
                        console.error(error_4);
                        if (error_4 instanceof Error) {
                            throw exception_1.default.BadRequestError('stock getHistory Error: ', error_4.message, null);
                        }
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Stock.prototype.postHistory = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var typeData, formatJson, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        typeData = typeConfig[json.type];
                        json.content.product_list.map(function (item) {
                            delete item.title;
                            delete item.spec;
                            delete item.sku;
                            return item;
                        });
                        json.content.changeLogs = [
                            {
                                time: tool_js_1.default.getCurrentDateTime(),
                                status: json.status,
                                text: "".concat(typeData.name, "\u55AE\u5EFA\u7ACB"),
                                user: this.token ? this.token.userID : 0,
                            },
                            {
                                time: tool_js_1.default.getCurrentDateTime({ addSeconds: 1 }),
                                status: json.status,
                                text: "".concat(typeData.name, "\u55AE\u72C0\u614B\u6539\u70BA\u300C").concat(typeData.status[json.status].title, "\u300D"),
                                user: this.token ? this.token.userID : 0,
                            },
                        ];
                        formatJson = JSON.parse(JSON.stringify(json));
                        formatJson.order_id = "".concat(typeData.prefixId).concat(new Date().getTime());
                        formatJson.content = JSON.stringify(json.content);
                        formatJson.created_time = "".concat(json.created_time, " 00:00:00");
                        delete formatJson.id;
                        return [4 /*yield*/, database_1.default.query("INSERT INTO `".concat(this.app, "`.`t_stock_history` SET ?;\n                "), [formatJson])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { data: formatJson }];
                    case 2:
                        error_5 = _a.sent();
                        console.error(error_5);
                        if (error_5 instanceof Error) {
                            throw exception_1.default.BadRequestError('stock postHistory Error: ', error_5.message, null);
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Stock.prototype.putHistory = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var typeData, getHistory, originHistory, originList_1, formatJson, _shop, variants, dataList, createStockEntry, _loop_2, _i, _a, variant, error_6;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, , 6]);
                        if (!this.token) {
                            return [2 /*return*/, { data: false }];
                        }
                        typeData = typeConfig[json.type];
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(this.app, "`.t_stock_history WHERE order_id = ?;\n                "), [json.order_id])];
                    case 1:
                        getHistory = _d.sent();
                        if (!getHistory || getHistory.length !== 1) {
                            return [2 /*return*/, { data: false }];
                        }
                        originHistory = getHistory[0];
                        originList_1 = originHistory.content.product_list;
                        // 格式化更新資料
                        json.content.product_list.map(function (item) {
                            delete item.title;
                            delete item.spec;
                            delete item.sku;
                            delete item.barcode;
                            return item;
                        });
                        json.content.changeLogs.push({
                            time: tool_js_1.default.getCurrentDateTime(),
                            status: json.status,
                            text: "\u9032\u8CA8\u55AE\u72C0\u614B\u6539\u70BA\u300C".concat(typeData.status[json.status].title, "\u300D"),
                            user: this.token.userID,
                            product_list: (function () {
                                if (json.status === 1 || json.status === 5) {
                                    var updateList = JSON.parse(JSON.stringify(json.content.product_list));
                                    return updateList.map(function (item1) {
                                        var _a, _b;
                                        var originVariant = originList_1.find(function (item2) { return item1.variant_id === item2.variant_id; });
                                        if (originVariant) {
                                            return __assign({ replenishment_count: ((_a = item1.recent_count) !== null && _a !== void 0 ? _a : 0) - ((_b = originVariant.recent_count) !== null && _b !== void 0 ? _b : 0) }, item1);
                                        }
                                        return item1;
                                    });
                                }
                                return undefined;
                            })(),
                        });
                        formatJson = JSON.parse(JSON.stringify(json));
                        formatJson.content = JSON.stringify(json.content);
                        delete formatJson.id;
                        _shop = new shopping_1.Shopping(this.app, this.token);
                        return [4 /*yield*/, _shop.getVariants({
                                page: 0,
                                limit: 9999,
                                id_list: json.content.product_list.map(function (item) { return item.variant_id; }).join(','),
                            })];
                    case 2:
                        variants = _d.sent();
                        dataList = [];
                        createStockEntry = function (type, store, count, variant) { return (__assign({ id: variant.id, product_id: variant.product_id }, Stock.formatStockContent({
                            type: type,
                            store: store,
                            count: count,
                            product_content: variant.product_content,
                            variant_content: variant.variant_content,
                        }))); };
                        _loop_2 = function (variant) {
                            var item = json.content.product_list.find(function (item) { return item.variant_id === variant.id; });
                            if (item) {
                                var originVariant = originList_1.find(function (origin) { return item.variant_id === origin.variant_id; });
                                var recent_count = (_b = item.recent_count) !== null && _b !== void 0 ? _b : 0;
                                var count = originVariant ? recent_count - ((_c = originVariant.recent_count) !== null && _c !== void 0 ? _c : 0) : recent_count;
                                var type = json.type, content = json.content;
                                var store_in = content.store_in, store_out = content.store_out;
                                if (type === 'restocking') {
                                    dataList.push(createStockEntry('plus', store_in, count, variant));
                                }
                                else if (type === 'transfer') {
                                    dataList.push(createStockEntry('plus', store_in, count, variant));
                                    dataList.push(createStockEntry('minus', store_out, count, variant));
                                }
                                else if (type === 'checking' && (json.status === 0 || json.status === 1)) {
                                    dataList.push(createStockEntry('equal', store_out, recent_count, variant));
                                }
                            }
                        };
                        for (_i = 0, _a = variants.data; _i < _a.length; _i++) {
                            variant = _a[_i];
                            _loop_2(variant);
                        }
                        // 更新產品與規格庫存
                        return [4 /*yield*/, _shop.putVariants(dataList)];
                    case 3:
                        // 更新產品與規格庫存
                        _d.sent();
                        // 更新庫存單
                        return [4 /*yield*/, database_1.default.query("UPDATE `".concat(this.app, "`.t_stock_history SET ? WHERE order_id = ?\n                "), [formatJson, json.order_id])];
                    case 4:
                        // 更新庫存單
                        _d.sent();
                        return [2 /*return*/, { data: true }];
                    case 5:
                        error_6 = _d.sent();
                        console.error(error_6);
                        if (error_6 instanceof Error) {
                            throw exception_1.default.BadRequestError('stock postHistory Error: ', error_6.message, null);
                        }
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Stock.formatStockContent = function (data) {
        var type = data.type;
        var store = data.store;
        var count = data.count;
        var product_content = data.product_content;
        var variant_content = data.variant_content;
        var stockList = variant_content.stockList;
        // 修改 variant stockList
        if (stockList[store]) {
            if (type === 'plus') {
                if (stockList[store].count) {
                    stockList[store].count += count;
                }
                else {
                    stockList[store].count = count;
                }
            }
            else if (type === 'minus') {
                if (stockList[store].count) {
                    stockList[store].count -= count;
                }
                else {
                    stockList[store].count = -count;
                }
            }
            else {
                stockList[store].count = count;
            }
        }
        // 修改 variant stock
        variant_content.stock = Object.keys(stockList).reduce(function (sum, key) {
            if (stockList[key] && stockList[key].count) {
                return sum + stockList[key].count;
            }
            return sum;
        }, 0);
        // 修改 product variant 的 stock, stockList
        var productVariant = product_content.variants.find(function (item) {
            return item.spec.join(',') === variant_content.spec.join(',');
        });
        if (productVariant) {
            productVariant.stockList = variant_content.stockList;
            productVariant.stock = variant_content.stock;
        }
        return {
            product_content: product_content,
            variant_content: variant_content,
        };
    };
    Stock.prototype.deleteHistory = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.query("UPDATE `".concat(this.app, "`.t_stock_history SET ? WHERE id = ?\n                "), [{ status: -1 }, json.id])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { data: false }];
                    case 2:
                        error_7 = _a.sent();
                        console.error(error_7);
                        if (error_7 instanceof Error) {
                            throw exception_1.default.BadRequestError('stock postHistory Error: ', error_7.message, null);
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Stock;
}());
exports.Stock = Stock;

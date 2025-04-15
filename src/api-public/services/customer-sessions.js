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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.CustomerSessions = void 0;
var exception_js_1 = require("../../modules/exception.js");
var database_js_1 = require("../../modules/database.js");
var shopnex_line_message_1 = require("./model/shopnex-line-message");
var axios_1 = require("axios");
var shopping_js_1 = require("./shopping.js");
var stock_js_1 = require("./stock.js");
var shopee_js_1 = require("./shopee.js");
var mime = require('mime');
var CustomerSessions = /** @class */ (function () {
    function CustomerSessions(app, token) {
        this.app = app;
        this.token = token;
    }
    CustomerSessions.prototype.createScheduled = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            //輸入: 產品資訊
            //輸出: 根據輸出 產出對應的產品輪播卡
            function generateProductCarousel(products, appName, scheduledID) {
                var maxOptions = Math.max.apply(Math, products.map(function (p) { return p.options.length; }));
                return {
                    type: "flex",
                    altText: "團購商品列表",
                    contents: {
                        type: "carousel",
                        contents: products.map(function (product, index) { return ({
                            type: "bubble",
                            hero: {
                                type: "image",
                                url: product.imageUrl,
                                size: "full",
                                aspectRatio: "16:9",
                                aspectMode: "cover"
                            },
                            body: {
                                type: "box",
                                layout: "vertical",
                                spacing: "lg",
                                height: "120px",
                                justifyContent: "space-between",
                                flex: 1,
                                contents: [
                                    {
                                        type: "text",
                                        text: "".concat(product.name),
                                        weight: "bold",
                                        size: "xl",
                                        "wrap": true,
                                        "maxLines": 2
                                    },
                                    {
                                        type: "text",
                                        text: "$ ".concat(product.price.toLocaleString(), " \u8D77"),
                                        size: "md",
                                        "align": "end"
                                    },
                                ]
                            },
                            footer: {
                                type: "box",
                                layout: "vertical",
                                spacing: "lg",
                                flex: 1,
                                justifyContent: "flex-start",
                                contents: __spreadArray([], product.options.flatMap(function (option, idx) { return __spreadArray([
                                    {
                                        type: "text",
                                        text: (option.label.length > 0) ? option.label : "單一規格",
                                        size: "sm",
                                        color: "#0D6EFD",
                                        align: "center",
                                        action: {
                                            type: "postback",
                                            data: "action=selectSpec&productID=".concat(product.id, "&spec=").concat((option.value.length > 0) ? option.value : "單一規格", "&g-app=").concat(appName, "&scheduledID=").concat(scheduledID, "&price=").concat(option.price),
                                        }
                                    }
                                ], (idx < product.options.length - 1 ? [{ type: "separator", margin: "sm" }] : []) // ✅ 只在 `text` 之間加 `separator`
                                , true); }), true)
                            }
                        }); })
                    }
                };
            }
            //將item轉為product的資料格式
            function convertToProductFormat(rawData) {
                return rawData.map(function (item) {
                    var id = item.content.id;
                    var content = item.content;
                    var name = content.title || "未知商品";
                    var variants = content.variants || [];
                    // 取得最低價格
                    var price = variants.length > 0 ? Math.min.apply(Math, variants.map(function (v) { return v.live_model.live_price; })) : 0;
                    // 取得第一張商品圖片
                    var imageUrl = variants.length > 0 ? variants[0].preview_image : "";
                    // 轉換規格選項
                    var options = variants.map(function (v) { return ({
                        label: v.spec.length > 0 ? v.spec.join(',') : "", // 避免空陣列
                        value: v.spec.length > 0 ? v.spec.join(',') : "", // 避免空陣列
                        price: v.live_model.live_price,
                    }); });
                    return {
                        id: id,
                        name: name,
                        price: price,
                        imageUrl: imageUrl,
                        selectedSpec: undefined, // 預設無選擇規格
                        options: options
                    };
                });
            }
            var appName, type, name_1, content, item_list, queryData, message, transProducts, flexMessage, _loop_1, this_1, _i, _a, item, res, error_1, e_1;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 10, , 11]);
                        appName = this.app;
                        type = data.type, name_1 = data.name, content = __rest(data, ["type", "name"]);
                        item_list = [];
                        //todo 整理一下商品的必要資訊
                        item_list = data.item_list.map(function (item) {
                            return {
                                id: item.id,
                                specs: item.content.specs,
                                title: item.content.title,
                                variants: item.content.variants.map(function (variant) {
                                    return {
                                        sku: variant.sku,
                                        spec: variant.spec,
                                        sale_price: variant.sale_price,
                                        preview_image: variant.preview_image,
                                        stockList: variant.stockList,
                                        live_model: variant.live_model,
                                        live_keyword: variant.live_keyword,
                                    };
                                }),
                                live_model: item.content.live_model,
                            };
                        });
                        content.item_list = item_list;
                        return [4 /*yield*/, database_js_1.default.query("INSERT INTO `".concat(this.app, "`.`t_live_purchase_interactions`\n                                              SET ?;"), [{
                                    type: data.type,
                                    name: data.name,
                                    status: "1",
                                    content: JSON.stringify(content)
                                }])];
                    case 1:
                        queryData = _c.sent();
                        if (!(data.type == "group_buy")) return [3 /*break*/, 9];
                        message = [
                            {
                                "type": "text",
                                "text": "\uD83D\uDCE2 \u5718\u8CFC\u958B\u59CB\u56C9\uFF01 \uD83C\uDF89\n\u5718\u8CFC\u540D\u7A31\uFF1A ".concat(name_1, "\n\u5718\u8CFC\u65E5\u671F\uFF1A ").concat(content.start_date, " ").concat(content.start_time, " ~ ").concat(content.end_date, " ").concat(content.end_time, "\n\n\uD83D\uDCCD \u4E0B\u65B9\u67E5\u770B\u5B8C\u6574\u5546\u54C1\u6E05\u55AE")
                            }
                        ];
                        transProducts = convertToProductFormat(content.item_list);
                        //把上面的message 發送到對應的groupID 也就是群組內
                        return [4 /*yield*/, this.sendMessageToGroup(data.lineGroup.groupId, message)];
                    case 2:
                        //把上面的message 發送到對應的groupID 也就是群組內
                        _c.sent();
                        flexMessage = generateProductCarousel(transProducts, this.app, queryData.insertId);
                        _loop_1 = function (item) {
                            var pdDqlData, pd;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, new shopping_js_1.Shopping(this_1.app, this_1.token).getProduct({
                                            page: 0,
                                            limit: 50,
                                            id: item.id,
                                            status: 'inRange',
                                        })];
                                    case 1:
                                        pdDqlData = (_d.sent()).data[0];
                                        pd = pdDqlData.content;
                                        //做倉儲扣除的動作
                                        Promise.all(item.content.variants.map(function (variant, i) { return __awaiter(_this, void 0, void 0, function () {
                                            var returnData, updateVariant, newContent;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        returnData = new stock_js_1.Stock(this.app, this.token).allocateStock(variant.stockList, variant.live_model.available_Qty);
                                                        updateVariant = pd.variants.find(function (dd) { return dd.spec.join('-') === variant.spec.join('-'); });
                                                        //預先從庫存倉庫取出後的倉庫列表
                                                        updateVariant.stockList = returnData.stockList;
                                                        //將每個scheduled視做一個庫存 做轉化
                                                        variant.stockList = {};
                                                        Object.entries(returnData.deductionLog).forEach(function (_a) {
                                                            var key = _a[0], value = _a[1];
                                                            variant.stockList[key] = {
                                                                count: value
                                                            };
                                                        });
                                                        if (updateVariant.deduction_log) {
                                                            delete updateVariant.deduction_log;
                                                        }
                                                        newContent = item.content;
                                                        //對t_variants進行資料庫更新
                                                        return [4 /*yield*/, new shopping_js_1.Shopping(this.app, this.token).updateVariantsWithSpec(updateVariant, item.id, variant.spec)];
                                                    case 1:
                                                        //對t_variants進行資料庫更新
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                            var error_2;
                                            var _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        _b.trys.push([0, 2, , 3]);
                                                        return [4 /*yield*/, database_js_1.default.query("UPDATE `".concat(this.app, "`.`t_manager_post`\n                             SET content = ?\n                             WHERE id = ?\n                            "), [JSON.stringify(pd), item.id])];
                                                    case 1:
                                                        _b.sent();
                                                        return [3 /*break*/, 3];
                                                    case 2:
                                                        error_2 = _b.sent();
                                                        console.error('發送訊息錯誤:', ((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) || error_2.message);
                                                        return [3 /*break*/, 3];
                                                    case 3:
                                                        if (!pd.shopee_id) return [3 /*break*/, 5];
                                                        return [4 /*yield*/, new shopee_js_1.Shopee(this.app, this.token).asyncStockToShopee({
                                                                product: pdDqlData,
                                                                callback: function () {
                                                                },
                                                            })];
                                                    case 4:
                                                        _b.sent();
                                                        _b.label = 5;
                                                    case 5: return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = content.item_list;
                        _c.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        item = _a[_i];
                        return [5 /*yield**/, _loop_1(item)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        _c.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                                to: data.lineGroup.groupId,
                                messages: [flexMessage]
                            }, {
                                headers: { Authorization: "Bearer ".concat(shopnex_line_message_1.ShopnexLineMessage.token) }
                            })];
                    case 7:
                        res = _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _c.sent();
                        console.error('發送訊息錯誤:', ((_b = error_1.response) === null || _b === void 0 ? void 0 : _b.data) || error_1.message);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/, {
                            result: true,
                            message: queryData,
                        }];
                    case 10:
                        e_1 = _c.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'createScheduled Error:' + e_1, null);
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    CustomerSessions.prototype.getScheduled = function (limit, page, type) {
        return __awaiter(this, void 0, void 0, function () {
            function isPastEndTime(end_date, end_time) {
                var now = new Date();
                var taipeiNow = new Date(new Intl.DateTimeFormat("en-US", {
                    timeZone: "Asia/Taipei",
                    year: "numeric", month: "2-digit", day: "2-digit",
                    hour: "2-digit", minute: "2-digit", second: "2-digit",
                    hour12: false // 24 小時制
                }).format(now));
                // 🔹 轉換 `end_date` 和 `end_time` 為台灣時間
                var endDateTime = new Date("".concat(end_date, "T").concat(end_time, ":00+08:00")); // 明確指定 UTC+8
                // 🔹 比較時間
                return taipeiNow > endDateTime;
            }
            function getSel() {
                return __awaiter(this, void 0, void 0, function () {
                    var data, expiredItems, scheduledItems, err_1;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 4, , 5]);
                                return [4 /*yield*/, database_js_1.default.query("\n                    SELECT *\n                    FROM `".concat(appName, "`.`t_live_purchase_interactions`\n                    WHERE type = '").concat(type, "'\n                    limit ").concat(parseInt(page) * parseInt(limit), ", ").concat(limit, "\n                "), [])
                                    // ✅ 2. 篩選出已過期的團購
                                ];
                            case 1:
                                data = _b.sent();
                                expiredItems = data.filter(function (item) {
                                    return item.status === 1 && isPastEndTime(item.content.end_date, item.content.end_time);
                                });
                                if (!(expiredItems.length !== 0)) return [3 /*break*/, 3];
                                return [4 /*yield*/, Promise.all(expiredItems.map(function (item) {
                                        item.status = 2;
                                        database_js_1.default.query("\n                                UPDATE `".concat(appName, "`.`t_live_purchase_interactions`\n                                SET `status` = 2\n                                WHERE `id` = ?;\n                            "), [item.id]);
                                    }))];
                            case 2:
                                _b.sent();
                                _b.label = 3;
                            case 3:
                                scheduledItems = data.filter(function (item) { return item.status === 1; });
                                //todo 釋放庫存
                                return [2 /*return*/, data];
                            case 4:
                                err_1 = _b.sent();
                                console.error('取得資料錯誤:', ((_a = err_1.response) === null || _a === void 0 ? void 0 : _a.data) || err_1.message);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
            function getTotal() {
                return __awaiter(this, void 0, void 0, function () {
                    var err_2;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.query("\n                            SELECT count(*)\n                            FROM `".concat(appName, "`.`t_live_purchase_interactions`\n                            WHERE type = '").concat(type, "'\n                    "), [])];
                            case 1: return [2 /*return*/, (_b.sent())[0]["count(*)"]];
                            case 2:
                                err_2 = _b.sent();
                                console.error('取得總數錯誤:', ((_a = err_2.response) === null || _a === void 0 ? void 0 : _a.data) || err_2.message);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            // 同步執行兩個查詢
            function getDataAndTotal() {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, data, total, err_3;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, Promise.all([getSel(), getTotal()])];
                            case 1:
                                _a = _c.sent(), data = _a[0], total = _a[1];
                                return [2 /*return*/, { data: data, total: total }];
                            case 2:
                                err_3 = _c.sent();
                                console.error('獲取資料失敗:', ((_b = err_3.response) === null || _b === void 0 ? void 0 : _b.data) || err_3.message);
                                return [2 /*return*/, { data: [], total: 0 }];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            var appName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appName = this.app;
                        return [4 /*yield*/, getDataAndTotal()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CustomerSessions.prototype.getOneScheduled = function (scheduleID) {
        return __awaiter(this, void 0, void 0, function () {
            function getSel() {
                return __awaiter(this, void 0, void 0, function () {
                    var err_4;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.query("\n                    SELECT *\n                    FROM `".concat(appName, "`.`t_live_purchase_interactions`\n                    WHERE id = ?\n                "), [scheduleID])];
                            case 1: return [2 /*return*/, _b.sent()];
                            case 2:
                                err_4 = _b.sent();
                                console.error('取得資料錯誤:', ((_a = err_4.response) === null || _a === void 0 ? void 0 : _a.data) || err_4.message);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            var appName, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appName = this.app;
                        return [4 /*yield*/, getSel()];
                    case 1:
                        data = _a.sent();
                        if (data.length > 0) {
                            return [2 /*return*/, data[0]];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CustomerSessions.prototype.changeScheduledStatus = function (scheduleID, status) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log("scheduleID -- ", scheduleID);
                        return [4 /*yield*/, database_js_1.default.query("\n                UPDATE `".concat(this.app, "`.`t_live_purchase_interactions`\n                SET `status` = ?\n                WHERE (`id` = ?);\n            "), [status, scheduleID])];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _b.sent();
                        console.error('更新失敗:', ((_a = err_5.response) === null || _a === void 0 ? void 0 : _a.data) || err_5.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CustomerSessions.prototype.closeScheduled = function (scheduleID) {
        return __awaiter(this, void 0, void 0, function () {
            var data, groupID, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changeScheduledStatus(scheduleID, "2")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getOneScheduled(scheduleID)];
                    case 2:
                        data = _a.sent();
                        groupID = data.content.lineGroup.groupId;
                        message = [
                            {
                                type: "text",
                                text: "\uD83D\uDCE2\u3010".concat(data.name, "\u5718\u8CFC\u5DF2\u7D50\u675F\u3011\uD83D\uDCE2\n\n\u611F\u8B1D\u5927\u5BB6\u7684\u71B1\u60C5\u53C3\u8207\uFF01\uD83C\uDF89 \u6B64\u6B21\u5718\u8CFC\u5DF2\u6B63\u5F0F\u7D50\u675F \uD83D\uDED2\n\n\uD83D\uDCCD \u8ACB\u5DF2\u4E0B\u55AE\u7684\u670B\u53CB\u5011\u5118\u5FEB\u5B8C\u6210\u7D50\u5E33\uFF0C\u9019\u5C07\u78BA\u4FDD\u60A8\u7684\u8A02\u55AE\u4FDD\u7559\uFF0C\u4E0D\u6703\u88AB\u53D6\u6D88\u54E6\uFF01\u3002\n\uD83D\uDCCD \n\uD83D\uDCCD \u5B8C\u6210\u7D50\u5E33\u5F8C\uFF0C\u60A8\u5C07\u6536\u5230\u8A02\u55AE\u78BA\u8A8D\u901A\u77E5\uFF0C\u63A5\u8457\u6211\u5011\u6703\u5B89\u6392\u51FA\u8CA8\u4E8B\u5B9C\u3002 \uD83D\uDCE6\n\uD83D\uDCCD \u82E5\u6709\u4EFB\u4F55\u554F\u984C\uFF0C\u8ACB\u806F\u7E6B\u7BA1\u7406\u54E1\n\n\uD83D\uDCA1 \u671F\u5F85\u4E0B\u6B21\u8207\u5927\u5BB6\u4E00\u8D77\u6436\u597D\u5EB7\uFF01\uD83C\uDF81")
                            }
                        ];
                        return [4 /*yield*/, this.sendMessageToGroup(groupID, message)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CustomerSessions.prototype.finishScheduled = function (scheduleID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changeScheduledStatus(scheduleID, "3")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CustomerSessions.prototype.sendMessageToGroup = function (groupID, message) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                                to: groupID,
                                messages: message
                            }, {
                                headers: { Authorization: "Bearer ".concat(shopnex_line_message_1.ShopnexLineMessage.token) }
                            })];
                    case 1:
                        res = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        console.error('發送訊息錯誤:', ((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) || error_3.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CustomerSessions.prototype.getOnlineCart = function (cartID) {
        return __awaiter(this, void 0, void 0, function () {
            function getTempCart(app, cartID) {
                return __awaiter(this, void 0, void 0, function () {
                    var err_7;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.query("\n                    SELECT *\n                    FROM ".concat(app, ".t_temporary_cart\n                    WHERE cart_id = ?\n                "), [cartID])];
                            case 1: return [2 /*return*/, _b.sent()];
                            case 2:
                                err_7 = _b.sent();
                                console.error('get temp cart error:', ((_a = err_7.response) === null || _a === void 0 ? void 0 : _a.data) || err_7.message);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            var cartData, oridata, _a, interaction, err_6;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, getTempCart(this.app, cartID)];
                    case 1:
                        cartData = _c.sent();
                        if (!(cartData.length > 0)) return [3 /*break*/, 8];
                        oridata = cartData[0];
                        _a = oridata.content.from.purchase;
                        switch (_a) {
                            case "group_buy": return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 6];
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, database_js_1.default.query("\n                            SELECT *\n                            FROM ".concat(this.app, ".t_live_purchase_interactions\n                            WHERE id = ?\n                        "), [oridata.content.from.scheduled_id])];
                    case 3:
                        interaction = _c.sent();
                        return [2 /*return*/, {
                                interaction: interaction[0],
                                cartData: oridata,
                            }];
                    case 4:
                        err_6 = _c.sent();
                        console.error('get t_live_purchase_interactions error:', ((_b = err_6.response) === null || _b === void 0 ? void 0 : _b.data) || err_6.message);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        {
                        }
                        _c.label = 7;
                    case 7: return [2 /*return*/, cartData[0]];
                    case 8: return [2 /*return*/, ""];
                }
            });
        });
    };
    CustomerSessions.prototype.getCartList = function (scheduleID) {
        return __awaiter(this, void 0, void 0, function () {
            function getSel() {
                return __awaiter(this, void 0, void 0, function () {
                    var data, orderIds, checkoutData, checkoutMap_1, err_8;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, database_js_1.default.query("\n                    SELECT *\n                    FROM `".concat(appName, "`.`t_temporary_cart`\n                    WHERE JSON_EXTRACT(content, '$.from.scheduled_id') = ?\n                "), [scheduleID])];
                            case 1:
                                data = _b.sent();
                                if (data.length === 0)
                                    return [2 /*return*/, []];
                                orderIds = data
                                    .map(function (item) {
                                    var _a;
                                    try {
                                        var parsedContent = item.content;
                                        return (_a = parsedContent === null || parsedContent === void 0 ? void 0 : parsedContent.cart_data) === null || _a === void 0 ? void 0 : _a.order_id;
                                    }
                                    catch (error) {
                                        console.error("JSON 解析失敗:", error);
                                        return undefined;
                                    }
                                })
                                    .filter(function (id) { return Boolean(id); });
                                if (orderIds.length == 0) {
                                    return [2 /*return*/, data];
                                }
                                return [4 /*yield*/, database_js_1.default.query("\n                    SELECT *\n                    FROM `".concat(appName, "`.`t_checkout`\n                    WHERE cart_token IN (").concat(orderIds.join(","), ")\n                "), [])];
                            case 2:
                                checkoutData = _b.sent();
                                checkoutMap_1 = new Map(checkoutData.map(function (item) { return [item.cart_token, item]; }));
                                return [2 /*return*/, data.map(function (cartItem) {
                                        var _a;
                                        try {
                                            var parsedContent = cartItem.content;
                                            var orderId = (_a = parsedContent === null || parsedContent === void 0 ? void 0 : parsedContent.cart_data) === null || _a === void 0 ? void 0 : _a.order_id;
                                            return __assign(__assign({}, cartItem), { checkoutInfo: orderId ? checkoutMap_1.get(orderId) || null : null });
                                        }
                                        catch (error) {
                                            console.error("JSON 解析失敗:", error);
                                            return __assign(__assign({}, cartItem), { checkoutInfo: null });
                                        }
                                    })];
                            case 3:
                                err_8 = _b.sent();
                                console.error('取得資料錯誤:', ((_a = err_8.response) === null || _a === void 0 ? void 0 : _a.data) || err_8.message);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            function getTotal() {
                return __awaiter(this, void 0, void 0, function () {
                    var err_9;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.query("\n                            SELECT count(*)\n                            FROM `".concat(appName, "`.`t_temporary_cart`\n                            WHERE JSON_EXTRACT(content, '$.from.scheduled_id') = ?\n                    "), [scheduleID])];
                            case 1: return [2 /*return*/, (_b.sent())[0]["count(*)"]];
                            case 2:
                                err_9 = _b.sent();
                                console.error('取得總數錯誤:', ((_a = err_9.response) === null || _a === void 0 ? void 0 : _a.data) || err_9.message);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            // 同步執行兩個查詢
            function getDataAndTotal() {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, data, total, err_10;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, Promise.all([getSel(), getTotal()])];
                            case 1:
                                _a = _b.sent(), data = _a[0], total = _a[1];
                                return [2 /*return*/, { data: data, total: total }];
                            case 2:
                                err_10 = _b.sent();
                                console.error('獲取資料失敗:', err_10);
                                return [2 /*return*/, { data: [], total: 0 }];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            var appName, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appName = this.app;
                        token = this.token;
                        return [4 /*yield*/, getDataAndTotal()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CustomerSessions.prototype.getRealOrder = function (cart_array) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (cart_array.length == 0)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n                               FROM `".concat(this.app, "`.`t_checkout`\n                               WHERE JSON_EXTRACT(orderData, '$.temp_cart_id') IN (").concat(cart_array.map(function (cart) {
                                return JSON.stringify(cart);
                            }).join(','), ");"), [])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CustomerSessions.prototype.checkAndRestoreCart = function (scheduledData) {
        return __awaiter(this, void 0, void 0, function () {
            var cartDataArray, cartIDArray, appName, err_11;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cartDataArray = [];
                        cartIDArray = [];
                        appName = this.app;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, database_js_1.default.query("\n                            SELECT *\n                            FROM ".concat(this.app, ".t_temporary_cart\n                            WHERE cart_id in (?) \n                            AND created_time < DATE_SUB(NOW(), INTERVAL ").concat(scheduledData.content.stock.period, " DAY);\n                        "), [scheduledData.content.pending_order.join(',')])];
                    case 2:
                        cartDataArray = _b.sent();
                        if (!(cartDataArray.length > 0)) return [3 /*break*/, 4];
                        cartIDArray = cartDataArray.map(function (item) { return item.cart_id; });
                        //檢索每個過期的購物車
                        return [4 /*yield*/, Promise.all(cartDataArray.map(function (cartData) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    //檢索每樣商品
                                    cartData.content.cart.forEach(function (cart) {
                                        //取得scheduled裡的商品列表
                                        var item_list = scheduledData.content.item_list;
                                        //取得列表內對應購物車的商品
                                        var product = item_list.find(function (item) {
                                            return item.id == cart.id;
                                        });
                                        //找到對應的variant
                                        var variant = product.content.variants.find(function (item) {
                                            return item.spec.join(',') == cart.spec;
                                        });
                                        //歸還售出量
                                        variant.live_model.sold = variant.live_model.sold - cart.count;
                                        //歸還scheduled上的總售出價格
                                        scheduledData.content.pending_order_total = scheduledData.content.pending_order_total - (cart.count * variant.live_model.live_price);
                                    });
                                    return [2 /*return*/];
                                });
                            }); })).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                function updateScheduled(content) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var err_12;
                                        var _a;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _b.trys.push([0, 2, , 3]);
                                                    return [4 /*yield*/, database_js_1.default.query("\n                            UPDATE ".concat(appName, ".t_live_purchase_interactions\n                            SET ?\n                            WHERE `id` = ?\n                        "), [{ content: JSON.stringify(content) }, scheduledData.id])];
                                                case 1:
                                                    _b.sent();
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    err_12 = _b.sent();
                                                    console.log("UPDATE t_temporary_cart error : ", ((_a = err_12.response) === null || _a === void 0 ? void 0 : _a.data) || err_12.message);
                                                    return [3 /*break*/, 3];
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    });
                                }
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            scheduledData.content.pending_order = scheduledData.content.pending_order.filter(function (item) { return !cartIDArray.includes(item); });
                                            return [4 /*yield*/, updateScheduled(scheduledData.content)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        //檢索每個過期的購物車
                        _b.sent();
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_11 = _b.sent();
                        console.log("UPDATE t_temporary_cart error : ", ((_a = err_11.response) === null || _a === void 0 ? void 0 : _a.data) || err_11.message);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return CustomerSessions;
}());
exports.CustomerSessions = CustomerSessions;

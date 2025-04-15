"use strict";
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
exports.ShopnexLineMessage = void 0;
var database_js_1 = require("../../../modules/database.js");
var config_js_1 = require("../../../config.js");
var axios_1 = require("axios");
var app_js_1 = require("../../../services/app.js");
var process_1 = require("process");
var customer_sessions_1 = require("../customer-sessions");
var mime = require('mime');
var ShopnexLineMessage = /** @class */ (function () {
    function ShopnexLineMessage() {
    }
    Object.defineProperty(ShopnexLineMessage, "token", {
        get: function () {
            return process_1.default.env.line_bot_token;
        },
        enumerable: false,
        configurable: true
    });
    ShopnexLineMessage.handleJoinEvent = function (event, app) {
        return __awaiter(this, void 0, void 0, function () {
            function checkGroupInfo(app, groupId) {
                return __awaiter(this, void 0, void 0, function () {
                    var result, error_1;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.query("SELECT *\n                     FROM `shopnex`.t_line_group_inf\n                     WHERE group_id = ?", [groupId])];
                            case 1:
                                result = _b.sent();
                                return [2 /*return*/, result.length > 0 ? result : null]; // 如果無結果則回傳 null
                            case 2:
                                error_1 = _b.sent();
                                console.error("❌ 取得 t_line_group_inf 資訊錯誤:", ((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) || error_1.message);
                                return [2 /*return*/, null]; // 確保發生錯誤時回傳 null，而不是 undefined
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            var replyToken, groupId, groupData, groupData_1, err_1, err_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        replyToken = event.replyToken;
                        groupId = event.source.groupId;
                        return [4 /*yield*/, checkGroupInfo(app, groupId)];
                    case 1:
                        groupData = _c.sent();
                        if (!!groupData) return [3 /*break*/, 10];
                        return [4 /*yield*/, ShopnexLineMessage.getLineGroupInf(groupId)];
                    case 2:
                        groupData_1 = _c.sent();
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
                        // 建立此groupID的資訊表
                        return [4 /*yield*/, database_js_1.default.query("insert into `shopnex`.t_line_group_inf\n                     set ?", [
                                {
                                    group_id: groupId,
                                    group_name: groupData_1.groupName,
                                    shopnex_user_name: "shopnex",
                                    shopnex_user_id: "shopnex",
                                    shopnex_app: "shopnex"
                                },
                            ])];
                    case 4:
                        // 建立此groupID的資訊表
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _c.sent();
                        console.log("error create t_line_group_inf -- ", ((_a = err_1.response) === null || _a === void 0 ? void 0 : _a.data) || err_1.message);
                        return [3 /*break*/, 6];
                    case 6:
                        _c.trys.push([6, 8, , 9]);
                        // 透過 Reply API 送出歡迎訊息
                        return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/reply", {
                                replyToken: replyToken,
                                messages: [
                                    {
                                        "type": "flex",
                                        "altText": "請點擊驗證按鈕來完成綁定",
                                        "contents": {
                                            "type": "bubble",
                                            "body": {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [
                                                    {
                                                        "type": "text",
                                                        "text": "📢 Shopnex 團購機器人",
                                                        "weight": "bold",
                                                        "size": "md",
                                                        "align": "center",
                                                        "margin": "xs"
                                                    },
                                                    {
                                                        "type": "text",
                                                        "text": "已準備開始為您服務！🚀",
                                                        "weight": "bold",
                                                        "size": "md",
                                                        "align": "center"
                                                    },
                                                    {
                                                        "type": "text",
                                                        "text": "請讓管理員點擊按鈕進行驗證",
                                                        "size": "md",
                                                        "align": "center",
                                                        "wrap": true,
                                                        "margin": "sm"
                                                    },
                                                ]
                                            },
                                            "footer": {
                                                "type": "box",
                                                "layout": "vertical",
                                                "spacing": "sm",
                                                "contents": [
                                                    {
                                                        "type": "button",
                                                        "style": "primary",
                                                        "color": "#007BFF",
                                                        "action": {
                                                            "type": "uri",
                                                            "label": "🌍 開啟網頁",
                                                            "uri": "".concat(process_1.default.env.saas_domain, "/shopnex-line-oauth?groupId=").concat(groupId)
                                                        }
                                                    },
                                                    {
                                                        "type": "text",
                                                        "text": "請確保您是群組管理員再進行驗證。",
                                                        "size": "xs",
                                                        "color": "#aaaaaa",
                                                        "align": "center",
                                                        "wrap": true
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }, {
                                headers: { Authorization: "Bearer ".concat(ShopnexLineMessage.token) }
                            })];
                    case 7:
                        // 透過 Reply API 送出歡迎訊息
                        _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        err_2 = _c.sent();
                        console.log("error reply line group -- ", ((_b = err_2.response) === null || _b === void 0 ? void 0 : _b.data) || err_2.message);
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ShopnexLineMessage.handlePostbackEvent = function (event, app) {
        return __awaiter(this, void 0, void 0, function () {
            function isNowWithinRange(start_date, start_time, end_date, end_time) {
                // 合成開始時間與結束時間
                var startDateTime = new Date("".concat(start_date, "T").concat(start_time, ":00"));
                var endDateTime = new Date("".concat(end_date, "T").concat(end_time, ":00"));
                // 獲取當前時間
                var now = new Date();
                var gmt8Now = new Date(new Intl.DateTimeFormat("en-US", {
                    timeZone: "Asia/Taipei",
                    hourCycle: "h23",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }).format(now));
                // 判斷現在時間是否介於開始和結束時間之間
                return gmt8Now >= startDateTime && gmt8Now <= endDateTime;
            }
            function checkTempCart(scheduledID, userId) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (scheduledID == "" || userId == "") {
                                    return [2 /*return*/, ""];
                                }
                                return [4 /*yield*/, database_js_1.default.query("\n                        SELECT *\n                        FROM ".concat(appName_1, ".t_temporary_cart\n                        WHERE JSON_EXTRACT(content, '$.from.purchase') = 'group_buy'\n                          AND JSON_EXTRACT(content, '$.from.scheduled_id') = '").concat(scheduledID, "'\n                          AND JSON_EXTRACT(content, '$.from.source') = 'LINE'\n                          AND JSON_EXTRACT(content, '$.from.user_id') = ?\n                          AND JSON_EXTRACT(content, '$.cart_data') IS NULL\n                    "), [userId])];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            }
            function generateRandomNumberCode(length) {
                if (length === void 0) { length = 12; }
                var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var code = '';
                for (var i = 0; i < length; i++) {
                    var randomIndex = Math.floor(Math.random() * chars.length);
                    code += chars[randomIndex];
                }
                return code;
            }
            function checkCartIdExists(cartId, appName) {
                return __awaiter(this, void 0, void 0, function () {
                    var result, err_4;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.query("\n                            SELECT COUNT(*) AS count\n                            FROM `".concat(appName, "`.t_temporary_cart\n                            WHERE cart_id = ?\n                        "), [cartId])];
                            case 1:
                                result = _b.sent();
                                return [2 /*return*/, result[0].count > 0]; // 如果 count 大於 0，表示 cart_id 已存在
                            case 2:
                                err_4 = _b.sent();
                                console.error("Error checking cart_id:", ((_a = err_4.response) === null || _a === void 0 ? void 0 : _a.data) || err_4.message);
                                return [2 /*return*/, false];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            function insertCart(cartId, content, appName) {
                return __awaiter(this, void 0, void 0, function () {
                    var exists, err_5;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, checkCartIdExists(cartId, appName)];
                            case 1:
                                exists = _b.sent();
                                if (exists) {
                                    console.log("Cart ID ".concat(cartId, " already exists."));
                                    return [2 /*return*/];
                                }
                                _b.label = 2;
                            case 2:
                                _b.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, database_js_1.default.query("\n                            INSERT INTO `".concat(appName, "`.t_temporary_cart (cart_id, content)\n                            VALUES (?, ?)\n                        "), [cartId, JSON.stringify(content)])];
                            case 3:
                                _b.sent();
                                console.log("Cart ID ".concat(cartId, " inserted successfully."));
                                return [3 /*break*/, 5];
                            case 4:
                                err_5 = _b.sent();
                                console.error("Error inserting cart data:", ((_a = err_5.response) === null || _a === void 0 ? void 0 : _a.data) || err_5.message);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
            function insertUniqueCart(content, appName) {
                return __awaiter(this, void 0, void 0, function () {
                    var cartId, unique;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                cartId = "";
                                unique = false;
                                _a.label = 1;
                            case 1:
                                if (!!unique) return [3 /*break*/, 3];
                                cartId = generateRandomNumberCode();
                                return [4 /*yield*/, checkCartIdExists(cartId, appName)];
                            case 2:
                                unique = !(_a.sent());
                                return [3 /*break*/, 1];
                            case 3:
                                content.checkUrl = "https://".concat(brandAndMemberType_1.domain, "/checkout?source=group_buy&cart_id=").concat(cartId);
                                return [4 /*yield*/, insertCart(cartId, content, appName)];
                            case 4:
                                _a.sent();
                                return [2 /*return*/, cartId];
                        }
                    });
                });
            }
            function getScheduled(scheduledID) {
                return __awaiter(this, void 0, void 0, function () {
                    var err_6;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.query("SELECT *\n                                                FROM ".concat(appName_1, ".t_live_purchase_interactions\n                                                WHERE `id` = ").concat(scheduledID), [])];
                            case 1: return [2 /*return*/, (_b.sent())[0] || 0];
                            case 2:
                                err_6 = _b.sent();
                                console.error("Error get data:", ((_a = err_6.response) === null || _a === void 0 ? void 0 : _a.data) || err_6.message);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            function updateScheduled(content) {
                return __awaiter(this, void 0, void 0, function () {
                    var err_7;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.query("\n                            UPDATE ".concat(appName_1, ".t_live_purchase_interactions\n                            SET ?\n                            WHERE `id` = ?\n                        "), [{ content: JSON.stringify(content) }, scheduledID_1])];
                            case 1:
                                _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                err_7 = _b.sent();
                                console.log("UPDATE t_live_purchase_interactions error : ", ((_a = err_7.response) === null || _a === void 0 ? void 0 : _a.data) || err_7.message);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            function calcPrice(cartData) {
                var _a, _b;
                //初始化scheduled的pending_order_total
                scheduledData_1.content.pending_order_total = (_a = scheduledData_1.content.pending_order_total) !== null && _a !== void 0 ? _a : 0;
                //這張購物車的總價增加
                cartData.total = parseInt(cartData.total, 10) + parseInt(price_1, 10);
                //scheduled裡的賣出總價增加
                scheduledData_1.content.pending_order_total = (_b = scheduledData_1.content.pending_order_total) !== null && _b !== void 0 ? _b : 0;
                scheduledData_1.content.pending_order_total += parseInt(price_1, 10);
                //在scheduled這個表裡的這個商品售出量++
                variant_1.live_model.sold++;
            }
            var userId, data, userData, queryParams, action, _a, scheduledID_1, appName_1, productID_1, spec_1, price_1, scheduledData_1, item_list, item, variant_1, cart, brandAndMemberType_1, cartData, cartID, content, changeData, err_3;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        userId = event.source.userId;
                        data = event.postback.data;
                        return [4 /*yield*/, this.getUserProfile(userId)
                            // const brandAndMemberType = await App.checkBrandAndMemberType(app);
                        ];
                    case 1:
                        userData = _f.sent();
                        // const brandAndMemberType = await App.checkBrandAndMemberType(app);
                        console.log("\uD83D\uDD39 Postback \u4E8B\u4EF6\u4F86\u81EA: ".concat(userId, ", data: ").concat(data));
                        console.log("saasConfig.SAAS_NAME -- ", config_js_1.saasConfig.SAAS_NAME);
                        queryParams = new URLSearchParams(data);
                        action = queryParams.get("action");
                        _a = action;
                        switch (_a) {
                            case "verify": return [3 /*break*/, 2];
                            case "order_status": return [3 /*break*/, 3];
                            case "selectSpec": return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 29];
                    case 2: 
                    // await this.sendPrivateMessage(userId, "🔐 請輸入驗證碼以完成群組綁定。");
                    return [3 /*break*/, 30];
                    case 3: return [4 /*yield*/, this.sendPrivateMessage(userId, "📦 您的訂單正在處理中！")];
                    case 4:
                        _f.sent();
                        return [3 /*break*/, 30];
                    case 5:
                        scheduledID_1 = queryParams.get('scheduledID');
                        appName_1 = (_b = queryParams.get('g-app')) !== null && _b !== void 0 ? _b : "";
                        productID_1 = queryParams.get('productID');
                        spec_1 = queryParams.get('spec') === "單一規格" ? "" : queryParams.get('spec');
                        price_1 = queryParams.get('price');
                        return [4 /*yield*/, getScheduled(scheduledID_1)];
                    case 6:
                        scheduledData_1 = _f.sent();
                        return [4 /*yield*/, new customer_sessions_1.CustomerSessions(appName_1).checkAndRestoreCart(scheduledData_1)];
                    case 7:
                        _f.sent();
                        if (!(scheduledData_1.status != 1 || !isNowWithinRange(scheduledData_1.content.start_date, scheduledData_1.content.start_time, scheduledData_1.content.end_date, scheduledData_1.content.end_time))) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.sendPrivateMessage(userId, "\uD83D\uDEAB\u3010\u5718\u8CFC\u5DF2\u7D50\u675F\u3011\uD83D\uDEAB\n\u611F\u8B1D\u60A8\u7684\u95DC\u6CE8\uFF01\u6B64\u6B21\u5718\u8CFC\u5DF2\u7D93\u7D50\u675F\uFF0C\u7121\u6CD5\u518D\u4E0B\u55AE\u3002\n\u8ACB\u7A0D\u5F8C\u95DC\u6CE8\u7FA4\u7D44\u5167\u7684\u65B0\u6D3B\u52D5\u901A\u77E5\uFF0C\u671F\u5F85\u60A8\u4E0B\u4E00\u6B21\u7684\u53C3\u8207\uFF01\uD83C\uDF89")];
                    case 8:
                        _f.sent();
                        return [2 /*return*/];
                    case 9:
                        item_list = scheduledData_1.content.item_list;
                        item = item_list.find(function (item) {
                            return item.id == productID_1;
                        });
                        variant_1 = item.content.variants.find(function (item) {
                            return item.spec.join(',') == spec_1;
                        });
                        cart = {
                            id: productID_1,
                            spec: spec_1,
                            count: 1
                        };
                        return [4 /*yield*/, app_js_1.App.checkBrandAndMemberType(appName_1)];
                    case 10:
                        brandAndMemberType_1 = _f.sent();
                        return [4 /*yield*/, checkTempCart(scheduledID_1 !== null && scheduledID_1 !== void 0 ? scheduledID_1 : "", userId)];
                    case 11:
                        cartData = _f.sent();
                        cartID = "";
                        variant_1.live_model.sold = (_c = variant_1.live_model.sold) !== null && _c !== void 0 ? _c : 0;
                        if (!(variant_1.live_model.sold == variant_1.live_model.available_Qty)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.sendPrivateMessage(userId, "\u26A0\uFE0F \u5F88\u62B1\u6B49\uFF0C\u60A8\u9078\u64C7\u7684\u5546\u54C1\u5DF2\u552E\u5B8C\uFF01\uD83D\uDE2D\n\n\u8ACB\u67E5\u770B\u5176\u4ED6\u5546\u54C1\uFF0C\u6216\u95DC\u6CE8\u4E0B\u4E00\u6CE2\u88DC\u8CA8\u901A\u77E5\uFF01\uD83D\uDD14")
                            //沒有購物車 做插入購物車的動作
                        ];
                    case 12:
                        _f.sent();
                        return [3 /*break*/, 28];
                    case 13:
                        if (!(!cartData || cartData.length == 0)) return [3 /*break*/, 17];
                        content = {
                            from: {
                                purchase: "group_buy",
                                scheduled_id: scheduledID_1,
                                source: "LINE",
                                user_id: userId,
                                user_photo: userData.pictureUrl,
                                user_name: userData.displayName
                            },
                            cart: [cart],
                            total: price_1,
                        };
                        calcPrice(content);
                        return [4 /*yield*/, insertUniqueCart(content, appName_1)];
                    case 14:
                        cartID = _f.sent();
                        //取得購物車資訊之後 推進待定表中
                        scheduledData_1.content.pending_order = (_d = scheduledData_1.content.pending_order) !== null && _d !== void 0 ? _d : [];
                        scheduledData_1.content.pending_order.push(cartID);
                        return [4 /*yield*/, updateScheduled(scheduledData_1.content)];
                    case 15:
                        _f.sent();
                        return [4 /*yield*/, this.sendPrivateMessage(userId, "\uD83D\uDED2 \u60A8\u7684\u5546\u54C1\u5DF2\u6210\u529F\u52A0\u5165\u8CFC\u7269\u8ECA\uFF0C\n\nhttps://".concat(brandAndMemberType_1.domain, "/checkout?source=group_buy&cart_id=").concat(cartID, "\n\n\u8ACB\u9EDE\u64CA\u4E0A\u65B9\u9023\u7D50\u67E5\u770B\u60A8\u7684\u8CFC\u7269\u8ECA\u5167\u5BB9\uFF01"))];
                    case 16:
                        _f.sent();
                        return [3 /*break*/, 28];
                    case 17:
                        changeData = cartData[0].content.cart.find(function (item) {
                            return item.id == productID_1 && item.spec == spec_1;
                        });
                        if (!changeData) return [3 /*break*/, 21];
                        if (!(changeData.count <= variant_1.live_model.limit && variant_1.live_model.available_Qty > variant_1.live_model.sold)) return [3 /*break*/, 18];
                        changeData.count++;
                        return [3 /*break*/, 20];
                    case 18: return [4 /*yield*/, this.sendPrivateMessage(userId, "\u26A0\uFE0F \u5F88\u62B1\u6B49\uFF0C\u60A8\u5DF2\u7D93\u9054\u5230\u53EF\u8CFC\u8CB7\u7684\u6578\u91CF\u4E0A\u9650\u3002")];
                    case 19:
                        _f.sent();
                        return [2 /*return*/];
                    case 20: return [3 /*break*/, 22];
                    case 21:
                        //若是沒找到商品就推進購物車
                        cartData[0].content.cart.push(cart);
                        _f.label = 22;
                    case 22:
                        calcPrice(cartData[0].content);
                        return [4 /*yield*/, updateScheduled(scheduledData_1.content)];
                    case 23:
                        _f.sent();
                        return [4 /*yield*/, this.sendPrivateMessage(userId, "\uD83D\uDED2 \u60A8\u7684\u5546\u54C1\u5DF2\u6210\u529F\u52A0\u5165\u8CFC\u7269\u8ECA\uFF0C\n\nhttps://".concat(brandAndMemberType_1.domain, "/checkout?source=group_buy&cart_id=").concat(cartData[0].cart_id, "\n\n\u8ACB\u9EDE\u64CA\u4E0A\u65B9\u9023\u7D50\u67E5\u770B\u60A8\u7684\u8CFC\u7269\u8ECA\u5167\u5BB9\uFF01"))];
                    case 24:
                        _f.sent();
                        _f.label = 25;
                    case 25:
                        _f.trys.push([25, 27, , 28]);
                        return [4 /*yield*/, database_js_1.default.query("\n                            UPDATE ".concat(appName_1, ".t_temporary_cart\n                            SET ?\n                            WHERE cart_id = ?\n                        "), [{ content: JSON.stringify(cartData[0].content) }, cartData[0].cart_id])];
                    case 26:
                        _f.sent();
                        return [3 /*break*/, 28];
                    case 27:
                        err_3 = _f.sent();
                        console.log("UPDATE t_temporary_cart error : ", ((_e = err_3.response) === null || _e === void 0 ? void 0 : _e.data) || err_3.message);
                        return [3 /*break*/, 28];
                    case 28: return [3 /*break*/, 30];
                    case 29:
                        console.log("⚠️ 未知的 Postback 事件");
                        return [3 /*break*/, 30];
                    case 30: return [2 /*return*/];
                }
            });
        });
    };
    // 發送私訊給用戶
    ShopnexLineMessage.sendPrivateMessage = function (userId, message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                            to: userId,
                            messages: [{ type: "text", text: message }]
                        }, {
                            headers: { Authorization: "Bearer ".concat(ShopnexLineMessage.token) }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShopnexLineMessage.getLineGroupInf = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, response, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = "https://api.line.me/v2/bot/group/".concat(groupId, "/summary");
                        headers = {
                            'Content-Type': 'application/json',
                            Authorization: "Bearer ".concat(ShopnexLineMessage.token),
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get(url, { headers: headers })];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, response.data];
                    case 3:
                        error_2 = _b.sent();
                        console.error('取得群組資訊錯誤:', ((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) || error_2.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ShopnexLineMessage.generateVerificationCode = function (app) {
        return __awaiter(this, void 0, void 0, function () {
            function getOrGenerateVerificationCode(appName) {
                return __awaiter(this, void 0, void 0, function () {
                    var existingCode, newCode;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, findExistingCode(appName)];
                            case 1:
                                existingCode = _a.sent();
                                if (existingCode) {
                                    return [2 /*return*/, existingCode];
                                }
                                return [4 /*yield*/, generateUniqueCode()];
                            case 2:
                                newCode = _a.sent();
                                return [4 /*yield*/, storeVerificationCode(appName, newCode)];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, newCode];
                        }
                    });
                });
            }
            // **🔍 查詢 `app_name` 是否已有驗證碼**
            function findExistingCode(appName) {
                return __awaiter(this, void 0, void 0, function () {
                    var rows, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.query("\n                    SELECT verification_code\n                    FROM shopnex.t_app_line_group_verification\n                    WHERE app_name = ? LIMIT 1\n                ", [appName])];
                            case 1:
                                rows = _a.sent();
                                return [2 /*return*/, rows.length > 0 ? rows[0].verification_code : null];
                            case 2:
                                e_1 = _a.sent();
                                console.error("❌ 查詢現有驗證碼錯誤:", e_1.message);
                                return [2 /*return*/, null];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            // **🔹 生成 8 碼唯一驗證碼**
            function generateUniqueCode() {
                return __awaiter(this, void 0, void 0, function () {
                    function generateCode() {
                        var newCode = "";
                        for (var i = 0; i < 8; i++) {
                            var randomIndex = Math.floor(Math.random() * chars.length);
                            newCode += chars[randomIndex];
                        }
                        return newCode;
                    }
                    var chars, code;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                chars = "abcdefghijklmnopqrstuvwxyz0123456789";
                                code = "";
                                _a.label = 1;
                            case 1:
                                code = generateCode();
                                _a.label = 2;
                            case 2: return [4 /*yield*/, findRepeatCode(code)];
                            case 3:
                                if (_a.sent()) return [3 /*break*/, 1];
                                _a.label = 4;
                            case 4: return [2 /*return*/, code];
                        }
                    });
                });
            }
            // **🔹 檢查是否有重複的驗證碼**
            function findRepeatCode(code) {
                return __awaiter(this, void 0, void 0, function () {
                    var rows, e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.query("\n                    SELECT 1\n                    FROM shopnex.t_app_line_group_verification\n                    WHERE verification_code = ? LIMIT 1\n                ", [code])];
                            case 1:
                                rows = _a.sent();
                                return [2 /*return*/, rows.length > 0];
                            case 2:
                                e_2 = _a.sent();
                                console.error("❌ 查詢重複驗證碼錯誤:", e_2.message);
                                return [2 /*return*/, false];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            // **🔹 插入新驗證碼**
            function storeVerificationCode(appName, code) {
                return __awaiter(this, void 0, void 0, function () {
                    var e_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.execute("\n                    INSERT INTO shopnex.t_app_line_group_verification (app_name, verification_code)\n                    VALUES (?, ?)\n                ", [appName, code])];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                e_3 = _a.sent();
                                console.error("❌ 插入驗證碼錯誤:", e_3.message);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            var code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getOrGenerateVerificationCode(app)];
                    case 1:
                        code = _a.sent();
                        return [2 /*return*/, code];
                }
            });
        });
    };
    ShopnexLineMessage.verifyVerificationCode = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            function getShopnexLineGroupInf() {
                return __awaiter(this, void 0, void 0, function () {
                    var rawData, err_9;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.query("\n                    SELECT *\n                    FROM shopnex.t_line_group_inf\n                    WHERE group_id = ?\n                ", [data.groupId])];
                            case 1:
                                rawData = _b.sent();
                                return [2 /*return*/, rawData.length > 0 ? rawData[0] : null];
                            case 2:
                                err_9 = _b.sent();
                                console.error("❌ 查詢 app_name 失敗:", ((_a = err_9.response) === null || _a === void 0 ? void 0 : _a.data) || err_9.message);
                                return [2 /*return*/, null];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            function getShopnexVerificationCode() {
                return __awaiter(this, void 0, void 0, function () {
                    var rawData, err_10;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.query("\n                    SELECT *\n                    FROM shopnex.t_app_line_group_verification\n                    WHERE verification_code = ?\n                ", [(_a = data.code) !== null && _a !== void 0 ? _a : ""])];
                            case 1:
                                rawData = _c.sent();
                                return [2 /*return*/, rawData.length > 0 ? rawData[0] : null];
                            case 2:
                                err_10 = _c.sent();
                                console.error("❌ 查詢 app_name 失敗:", ((_b = err_10.response) === null || _b === void 0 ? void 0 : _b.data) || err_10.message);
                                return [2 /*return*/, null];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            var lineGroupData, verificationData, brandAndMemberType, err_8;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, getShopnexLineGroupInf()];
                    case 1:
                        lineGroupData = _b.sent();
                        if (!lineGroupData) {
                            return [2 /*return*/, {
                                    result: "error",
                                    data: "查無此Group ID"
                                }];
                        }
                        if (lineGroupData.shopnex_app != "shopnex") {
                            return [2 /*return*/, {
                                    result: "error",
                                    data: "此LINE群組已綁定"
                                }];
                        }
                        return [4 /*yield*/, getShopnexVerificationCode()];
                    case 2:
                        verificationData = _b.sent();
                        if (!verificationData) return [3 /*break*/, 8];
                        return [4 /*yield*/, app_js_1.App.checkBrandAndMemberType(verificationData.app_name)];
                    case 3:
                        brandAndMemberType = _b.sent();
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, database_js_1.default.query("\n                    UPDATE shopnex.t_line_group_inf\n                    SET ?\n                    WHERE group_id = ?\n                ", [{
                                    shopnex_user_name: brandAndMemberType.userData.name,
                                    shopnex_app: verificationData.app_name,
                                    shopnex_user_id: brandAndMemberType.user_id
                                }, data.groupId])];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_8 = _b.sent();
                        console.error("❌ 更新 t_line_group_inf 失敗:", ((_a = err_8.response) === null || _a === void 0 ? void 0 : _a.data) || err_8.message);
                        return [2 /*return*/, {
                                result: "error",
                                data: "更新 t_line_group_inf 失敗"
                            }];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, {
                            result: "error",
                            data: "驗證碼錯誤"
                        }];
                    case 9: return [2 /*return*/, {
                            data: "OK"
                        }];
                }
            });
        });
    };
    ShopnexLineMessage.getLineGroup = function (app) {
        return __awaiter(this, void 0, void 0, function () {
            var err_11;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("\n                select *\n                FROM shopnex.t_line_group_inf\n                WHERE shopnex_app = ?\n            ", [app])];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        err_11 = _b.sent();
                        console.error("❌ 查詢 line 群組 失敗:", ((_a = err_11.response) === null || _a === void 0 ? void 0 : _a.data) || err_11.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ShopnexLineMessage.getUserProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, response, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = "https://api.line.me/v2/bot/profile/".concat(userId);
                        headers = {
                            "Authorization": "Bearer ".concat(ShopnexLineMessage.token)
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get(url, { headers: headers })];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, response.data]; // 返回使用者資訊
                    case 3:
                        error_3 = _b.sent();
                        console.error("無法獲取使用者資訊:", ((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) || error_3.message);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ShopnexLineMessage;
}());
exports.ShopnexLineMessage = ShopnexLineMessage;

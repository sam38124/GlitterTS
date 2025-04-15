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
exports.CheckoutService = void 0;
var database_js_1 = require("../../modules/database.js");
var CheckoutService = /** @class */ (function () {
    function CheckoutService() {
    }
    CheckoutService.updateAndMigrateToTableColumn = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var update_object, json, _i, _a, b, e_1;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        update_object = {};
                        json = obj.orderData;
                        //預設是未出貨
                        json.progress = (_b = json.progress) !== null && _b !== void 0 ? _b : 'wait';
                        update_object.progress = json.progress;
                        //預設是處理中
                        json.orderStatus = (_c = json.orderStatus) !== null && _c !== void 0 ? _c : '0';
                        update_object.order_status = json.orderStatus;
                        //付款方式
                        if (json.customer_info && json.customer_info.payment_select) {
                            update_object.payment_method = json.customer_info.payment_select;
                        }
                        if (json.pos_info && json.pos_info.payment && Array.isArray(json.pos_info.payment)) {
                            update_object.payment_method = json.pos_info.payment
                                .map(function (item) {
                                return item.method;
                            })
                                .sort()
                                .join('|');
                        }
                        //配送方式
                        update_object.shipment_method = json.user_info.shipment;
                        //配送日期
                        if (json.user_info.shipment_date) {
                            update_object.shipment_date = new Date(json.user_info.shipment_date);
                        }
                        else {
                            update_object.shipment_date = null;
                        }
                        update_object.total = json.total || 0;
                        //出貨單號碼
                        if (!obj.no_shipment_number) {
                            if (json.user_info.shipment_number) {
                                update_object.shipment_number = json.user_info.shipment_number;
                            }
                            else {
                                update_object.shipment_number = null;
                            }
                        }
                        update_object.order_source = json.orderSource || null;
                        update_object.archived = json.archived;
                        if (json.customer_info) {
                            update_object.customer_name = json.customer_info.name;
                            update_object.customer_phone = json.customer_info.phone;
                            update_object.customer_email = json.customer_info.email;
                        }
                        if (json.user_info) {
                            update_object.shipment_name = json.user_info.name;
                            update_object.shipment_phone = json.user_info.phone;
                            update_object.shipment_email = json.user_info.email;
                            update_object.shipment_address = [json.user_info.city, json.user_info.area, json.user_info.address].filter(function (dd) {
                                return dd;
                            }).join('');
                        }
                        //更新t_checkout欄位
                        return [4 /*yield*/, database_js_1.default.query("update `".concat(obj.app_name, "`.t_checkout\n       set ?\n       where id = ").concat(obj.id), [update_object])];
                    case 1:
                        //更新t_checkout欄位
                        _e.sent();
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, database_js_1.default.query("delete\n                      from `".concat(obj.app_name, "`.t_products_sold_history\n                      where order_id = ? and id>0"), [obj.orderData.orderID])];
                    case 3:
                        _e.sent();
                        _i = 0, _a = obj.orderData.lineItems;
                        _e.label = 4;
                    case 4:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        b = _a[_i];
                        return [4 /*yield*/, database_js_1.default.query("insert into `".concat(obj.app_name, "`.t_products_sold_history\n                        set ?"), [
                                {
                                    product_id: (_d = b.id) !== null && _d !== void 0 ? _d : -1,
                                    order_id: obj.orderData.orderID,
                                    spec: (b.spec || []).join('-'),
                                    count: b.count
                                },
                            ])];
                    case 5:
                        _e.sent();
                        _e.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        e_1 = _e.sent();
                        console.error("insert-history-error: ".concat(e_1));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return CheckoutService;
}());
exports.CheckoutService = CheckoutService;

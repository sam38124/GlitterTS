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
exports.UpdatedTableChecked = void 0;
var database_1 = require("../../modules/database");
var checkout_js_1 = require("./checkout.js");
var user_update_js_1 = require("./user-update.js");
var UpdatedTableChecked = /** @class */ (function () {
    function UpdatedTableChecked() {
    }
    UpdatedTableChecked.startCheck = function (app_name) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //員工上下班打卡1.1版本，新增門市欄位
                    return [4 /*yield*/, UpdatedTableChecked.update({
                            app_name: app_name,
                            table_name: 't_check_in_pos',
                            last_version: [''],
                            new_version: 'V1.1',
                            event: "\n        ALTER TABLE `".concat(app_name, "`.t_check_in_pos\n        ADD COLUMN `store` VARCHAR(45) NOT NULL DEFAULT '' AFTER `execute`,\n        ADD INDEX `index5` (`store` ASC) VISIBLE;\n      "),
                        })];
                    case 1:
                        //員工上下班打卡1.1版本，新增門市欄位
                        _a.sent();
                        //購物車''->1.1版本，先更新資料表欄位
                        return [4 /*yield*/, UpdatedTableChecked.update({
                                app_name: app_name,
                                table_name: 't_checkout',
                                last_version: [''],
                                new_version: 'V1.1',
                                event: "ALTER TABLE `".concat(app_name, "`.`t_checkout`   ") +
                                    'ADD COLUMN `total` INT NOT NULL DEFAULT 0 AFTER `created_time`,\n' +
                                    'ADD COLUMN `order_status` VARCHAR(45) NULL DEFAULT NULL AFTER `total`,\n' +
                                    'ADD COLUMN `payment_method` VARCHAR(45) NULL DEFAULT NULL AFTER `order_status`,\n' +
                                    'ADD COLUMN `shipment_method` VARCHAR(45) NULL DEFAULT NULL AFTER `payment_method`,\n' +
                                    'ADD COLUMN `shipment_date` DATETIME NULL DEFAULT NULL AFTER `shipment_method`,\n' +
                                    'ADD COLUMN `progress` VARCHAR(45) NULL DEFAULT NULL AFTER `shipment_date`,\n' +
                                    'ADD INDEX `index5` (`total` ASC) VISIBLE,\n' +
                                    'ADD INDEX `index6` (`order_status` ASC) VISIBLE,\n' +
                                    'ADD INDEX `index7` (`payment_method` ASC) VISIBLE,\n' +
                                    'ADD INDEX `index8` (`shipment_method` ASC) VISIBLE,\n' +
                                    'ADD INDEX `index9` (`shipment_date` ASC) VISIBLE,\n' +
                                    'ADD INDEX `index10` (`progress` ASC) VISIBLE;\n' +
                                    ';\n',
                            })];
                    case 2:
                        //購物車''->1.1版本，先更新資料表欄位
                        _a.sent();
                        //購物車1.3->1.4版本，新增ShipmentNumber欄位，加快索引查詢速度。
                        return [4 /*yield*/, UpdatedTableChecked.update({
                                app_name: app_name,
                                table_name: 't_checkout',
                                last_version: ['V1.1', 'V1.2', 'V1.3'],
                                new_version: 'V1.4',
                                event: "\n        ALTER TABLE `".concat(app_name, "`.`t_checkout`\n        ADD COLUMN `shipment_number` VARCHAR(45) NULL AFTER `progress`,\n        ADD INDEX `index11` (`shipment_number` ASC) VISIBLE;\n      "),
                            })];
                    case 3:
                        //購物車1.3->1.4版本，新增ShipmentNumber欄位，加快索引查詢速度。
                        _a.sent();
                        //LINE資料表更新
                        return [4 /*yield*/, UpdatedTableChecked.update({
                                app_name: app_name,
                                table_name: 't_live_purchase_interactions',
                                last_version: [''],
                                new_version: 'V1.0',
                                event: "\n        ALTER TABLE `".concat(app_name, "`.`t_live_purchase_interactions`\n        CHANGE COLUMN `stream_name` `name` VARCHAR (200) NOT NULL;\n      "),
                            })];
                    case 4:
                        //LINE資料表更新
                        _a.sent();
                        //LINE資料表更新
                        return [4 /*yield*/, UpdatedTableChecked.update({
                                app_name: app_name,
                                table_name: 't_live_purchase_interactions',
                                last_version: [''],
                                new_version: 'V1.0',
                                event: "\n        ALTER TABLE `".concat(app_name, "`.`t_live_purchase_interactions`\n        CHANGE COLUMN `stream_name` `name` VARCHAR (200) NOT NULL;\n      "),
                            })];
                    case 5:
                        //LINE資料表更新
                        _a.sent();
                        //LINE資料表更新
                        return [4 /*yield*/, UpdatedTableChecked.update({
                                app_name: app_name,
                                table_name: 't_live_purchase_interactions',
                                last_version: ['V1.0'],
                                new_version: 'V1.1',
                                event: "\n        ALTER TABLE `".concat(app_name, "`.`t_live_purchase_interactions`\n        DROP COLUMN `streamer`,\n        DROP INDEX `index3`;\n      "),
                            })];
                    case 6:
                        //LINE資料表更新
                        _a.sent();
                        //購物車1.5->1.6版本，新增沖賬紀錄
                        return [4 /*yield*/, UpdatedTableChecked.update({
                                app_name: app_name,
                                table_name: 't_checkout',
                                last_version: ['V1.5', 'V1.4'],
                                new_version: 'V1.6',
                                event: "\n        ALTER TABLE `".concat(app_name, "`.`t_checkout`\n        ADD COLUMN `total_received` INT NULL DEFAULT NULL AFTER `shipment_number`,\n        ADD COLUMN `offset_amount` INT NULL DEFAULT NULL AFTER `total_received`,\n        ADD COLUMN `offset_reason` VARCHAR(45) NULL DEFAULT NULL AFTER `offset_amount`,\n        ADD COLUMN `offset_records` JSON NULL AFTER `offset_reason`,\n        ADD INDEX `index12` (`total_received` ASC) VISIBLE,\n        ADD INDEX `index13` (`offset_amount` ASC) VISIBLE,\n        ADD INDEX `index14` (`offset_reason` ASC) VISIBLE;\n      "),
                            })];
                    case 7:
                        //購物車1.5->1.6版本，新增沖賬紀錄
                        _a.sent();
                        //購物車1.6->1.7版本，新增沖賬時間
                        return [4 /*yield*/, UpdatedTableChecked.update({
                                app_name: app_name,
                                table_name: 't_checkout',
                                last_version: ['V1.6'],
                                new_version: 'V1.7',
                                event: "\n        ALTER TABLE `".concat(app_name, "`.`t_checkout`\n        ADD COLUMN `reconciliation_date` DATETIME NULL DEFAULT NULL AFTER `offset_records`,\n        ADD INDEX `index15` (`reconciliation_date` ASC) VISIBLE;\n      "),
                            })];
                    case 8:
                        //購物車1.6->1.7版本，新增沖賬時間
                        _a.sent();
                        //會員表新增會員等級欄位
                        return [4 /*yield*/, UpdatedTableChecked.update({
                                app_name: app_name,
                                table_name: 't_user',
                                last_version: [''],
                                new_version: 'V1.0',
                                event: "\n        ALTER TABLE `".concat(app_name, "`.`t_user`\n        ADD COLUMN `member_level` VARCHAR(45) NOT NULL AFTER `static_info`,\n        ADD INDEX `index7` (`member_level` ASC) VISIBLE;\n      "),
                            })];
                    case 9:
                        //會員表新增會員等級欄位
                        _a.sent();
                        //會員表插入member_level資料
                        return [4 /*yield*/, UpdatedTableChecked.update({
                                app_name: app_name,
                                table_name: 't_user',
                                last_version: ['V1.0'],
                                new_version: 'V1.1',
                                event: function () {
                                    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                        var _i, _a, b;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _i = 0;
                                                    return [4 /*yield*/, database_1.default.query("select * from `".concat(app_name, "`.t_user"), [])];
                                                case 1:
                                                    _a = _b.sent();
                                                    _b.label = 2;
                                                case 2:
                                                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                                                    b = _a[_i];
                                                    return [4 /*yield*/, user_update_js_1.UserUpdate.update(app_name, b.userID)];
                                                case 3:
                                                    _b.sent();
                                                    _b.label = 4;
                                                case 4:
                                                    _i++;
                                                    return [3 /*break*/, 2];
                                                case 5:
                                                    resolve(true);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                },
                            })];
                    case 10:
                        //會員表插入member_level資料
                        _a.sent();
                        //會員表插入member_level資料
                        return [4 /*yield*/, UpdatedTableChecked.update({
                                app_name: app_name,
                                table_name: 't_user',
                                last_version: ['V1.1'],
                                new_version: 'V1.2',
                                event: "\n        ALTER TABLE `".concat(app_name, "`.`t_user`\n        CHANGE COLUMN `member_level` `member_level` VARCHAR (45) NULL DEFAULT NULL;\n      "),
                            })];
                    case 11:
                        //會員表插入member_level資料
                        _a.sent();
                        //購物車1.7->1.8版本，新增訂單類型，
                        return [4 /*yield*/, UpdatedTableChecked.update({
                                app_name: app_name,
                                table_name: 't_checkout',
                                last_version: ['V1.7'],
                                new_version: 'V1.8',
                                event: "\n        ALTER TABLE `".concat(app_name, "`.`t_checkout`\n        ADD COLUMN `order_source` VARCHAR(45) NULL DEFAULT NULL AFTER `reconciliation_date`,\n        ADD COLUMN `archived` VARCHAR(45) NULL DEFAULT NULL AFTER `order_source`,\n        ADD COLUMN `customer_name` VARCHAR(45) NULL AFTER `archived`,\n        ADD COLUMN `shipment_name` VARCHAR(45) NULL AFTER `customer_name`,\n        ADD COLUMN `customer_email` VARCHAR(45) NULL AFTER `shipment_name`,\n        ADD COLUMN `shipment_email` VARCHAR(45) NULL AFTER `customer_email`,\n        ADD COLUMN `customer_phone` VARCHAR(45) NULL AFTER `shipment_email`,\n        ADD COLUMN `shipment_phone` VARCHAR(45) NULL AFTER `customer_phone`,\n        ADD COLUMN `shipment_address` VARCHAR(200) NULL AFTER `shipment_phone`,\n        ADD INDEX `index16` (`order_source` ASC) VISIBLE,\n        ADD INDEX `index17` (`customer_name` ASC) VISIBLE,\n        ADD INDEX `index18` (`order_source` ASC) VISIBLE,\n        ADD INDEX `index19` (`shipment_name` ASC) VISIBLE,\n        ADD INDEX `index20` (`customer_email` ASC) VISIBLE,\n        ADD INDEX `index21` (`shipment_email` ASC) VISIBLE,\n        ADD INDEX `index22` (`customer_phone` ASC) VISIBLE,\n        ADD INDEX `index23` (`shipment_phone` ASC) VISIBLE,\n        ADD INDEX `index24` (`shipment_address` ASC) VISIBLE;\n      "),
                            })];
                    case 12:
                        //購物車1.7->1.8版本，新增訂單類型，
                        _a.sent();
                        //重新migrate過訂單
                        return [4 /*yield*/, UpdatedTableChecked.update({
                                app_name: app_name,
                                table_name: 't_checkout',
                                last_version: ['V1.8', 'V1.9'],
                                new_version: 'V2.0',
                                event: function () {
                                    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                        var _i, _a, b;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _i = 0;
                                                    return [4 /*yield*/, database_1.default.query("select * from `".concat(app_name, "`.t_checkout"), [])];
                                                case 1:
                                                    _a = _b.sent();
                                                    _b.label = 2;
                                                case 2:
                                                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                                                    b = _a[_i];
                                                    return [4 /*yield*/, checkout_js_1.CheckoutService.updateAndMigrateToTableColumn({
                                                            id: b.id,
                                                            orderData: b.orderData,
                                                            app_name: app_name,
                                                        })];
                                                case 3:
                                                    _b.sent();
                                                    _b.label = 4;
                                                case 4:
                                                    _i++;
                                                    return [3 /*break*/, 2];
                                                case 5:
                                                    resolve(true);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                },
                            })];
                    case 13:
                        //重新migrate過訂單
                        _a.sent();
                        //t_products_sold_history 1.0->1.1 版本，將count轉換成float
                        return [4 /*yield*/, UpdatedTableChecked.update({
                                app_name: app_name,
                                table_name: 't_products_sold_history',
                                last_version: ['V1.0', ''],
                                new_version: 'V1.1',
                                event: "\n        ALTER TABLE `".concat(app_name, "`.`t_products_sold_history`\n        CHANGE COLUMN `count` `count` FLOAT NOT NULL;\n      "),
                            })];
                    case 14:
                        //t_products_sold_history 1.0->1.1 版本，將count轉換成float
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UpdatedTableChecked.update = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var data_;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT TABLE_NAME, TABLE_COMMENT\n       FROM information_schema.tables\n       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?;", [obj.app_name, obj.table_name])];
                    case 1:
                        data_ = _b.sent();
                        if (!obj.last_version.includes((_a = data_[0]['TABLE_COMMENT']) !== null && _a !== void 0 ? _a : '')) return [3 /*break*/, 7];
                        console.log("\u8CC7\u6599\u5EAB\u66F4\u65B0\u958B\u59CB: ".concat(obj.app_name, "-").concat(obj.last_version, "-to-").concat(obj.new_version));
                        if (!(typeof obj.event === 'string')) return [3 /*break*/, 3];
                        return [4 /*yield*/, database_1.default.query("".concat(obj.event), [])];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, obj.event()];
                    case 4:
                        if (!!(_b.sent())) return [3 /*break*/, 5];
                        return [3 /*break*/, 3];
                    case 5: return [4 /*yield*/, database_1.default.query("ALTER TABLE `".concat(obj.app_name, "`.`").concat(obj.table_name, "` COMMENT = '").concat(obj.new_version, "';"), [])];
                    case 6:
                        _b.sent();
                        console.log("\u8CC7\u6599\u5EAB\u66F4\u65B0\u7D50\u675F: ".concat(obj.app_name, "-").concat(obj.last_version, "-to-").concat(obj.new_version));
                        _b.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return UpdatedTableChecked;
}());
exports.UpdatedTableChecked = UpdatedTableChecked;

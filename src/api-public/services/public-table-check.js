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
exports.ApiPublic = void 0;
var database_1 = require("../../modules/database");
var config_js_1 = require("../../config.js");
var saas_table_check_js_1 = require("../../services/saas-table-check.js");
var tool_js_1 = require("../../services/tool.js");
var ai_robot_js_1 = require("./ai-robot.js");
var user_js_1 = require("./user.js");
var shopping_js_1 = require("./shopping.js");
var updated_table_checked_js_1 = require("./updated-table-checked.js");
var ApiPublic = /** @class */ (function () {
    function ApiPublic() {
    }
    ApiPublic.createScheme = function (appName) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a, _b, groupSize, sqlArray, _loop_1, _i, _c, b, _d, _e, _f, _g, e_1;
            var _h, _j, _k;
            var _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        //已通過則直接回傳執行
                        if (ApiPublic.checkedApp.find(function (dd) {
                            return dd.app_name === appName;
                        })) {
                            return [2 /*return*/];
                        }
                        if (!ApiPublic.checkingApp.find(function (dd) {
                            return dd.app_name === appName;
                        })) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var interval = setInterval(function () {
                                    if (ApiPublic.checkedApp.find(function (dd) {
                                        return dd.app_name === appName;
                                    })) {
                                        resolve(true);
                                        clearInterval(interval);
                                    }
                                    else if (!(ApiPublic.checkingApp.find(function (dd) {
                                        return dd.app_name === appName;
                                    }))) {
                                        resolve(false);
                                        clearInterval(interval);
                                    }
                                }, 500);
                            })];
                    case 1:
                        result = _m.sent();
                        if (result) {
                            return [2 /*return*/];
                        }
                        _m.label = 2;
                    case 2:
                        _b = (_a = ApiPublic.checkingApp).push;
                        _h = {
                            app_name: appName
                        };
                        return [4 /*yield*/, database_1.default.query("select refer_app\n           from `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n           where appName = ?"), [appName])];
                    case 3:
                        _b.apply(_a, [(_h.refer_app = (_m.sent())[0]['refer_app'],
                                _h)]);
                        _m.label = 4;
                    case 4:
                        _m.trys.push([4, 15, , 16]);
                        return [4 /*yield*/, database_1.default.execute("CREATE SCHEMA if not exists `".concat(appName, "` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"), [])];
                    case 5:
                        _m.sent();
                        return [4 /*yield*/, database_1.default.execute("CREATE SCHEMA if not exists `".concat(appName, "_recover` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"), [])];
                    case 6:
                        _m.sent();
                        groupSize = 15;
                        sqlArray = [
                            {
                                scheme: appName,
                                table: 't_chat_detail',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `chat_id` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `user_id` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `message` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `index2` (`chat_id`),\n  KEY `index3` (`user_id`),\n  KEY `index4` (`created_time`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: "t_invoice_memory",
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `status` int NOT NULL DEFAULT 1,\n  `order_id` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `invoice_no` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `invoice_data` json DEFAULT NULL,\n  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `index2` (`order_id`),\n  KEY `index3` (`invoice_no`),\n  KEY `index4` (`create_date`),\n  KEY `index5` (`status`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: "t_allowance_memory",
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `status` int NOT NULL DEFAULT 1,\n  `order_id` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `invoice_no` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `allowance_no` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `allowance_data` json DEFAULT NULL,\n  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `index2` (`order_id`),\n  KEY `index3` (`invoice_no`),\n  KEY `index4` (`create_date`),\n  KEY `index5` (`status`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            //                 {
                            //                     scheme: appName,
                            //                     table: `t_invoice_credit`,
                            //                     sql: `(
                            //   \`id\` int NOT NULL AUTO_INCREMENT,
                            //   \`status\` int NOT NULL DEFAULT 1,
                            //   \`order_id\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
                            //   \`invoice_no\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
                            //   \`invoice_data\` json DEFAULT NULL,
                            //   \`create_date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            //   PRIMARY KEY (\`id\`),
                            //   KEY \`index2\` (\`order_id\`),
                            //   KEY \`index3\` (\`invoice_no\`),
                            //   KEY \`index4\` (\`create_date\`),
                            //   KEY \`index5\` (\`status\`)
                            // ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
                            //                 },
                            {
                                scheme: appName,
                                table: 't_variants',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `product_id` int DEFAULT NULL,\n  `content` json NOT NULL,\n  PRIMARY KEY (`id`),\n  KEY `index2` (`product_id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_recommend_users',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `content` json NOT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `email_UNIQUE` (`email`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_recommend_links',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `content` json NOT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `code_UNIQUE` (`code`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_triggers',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `tag` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `content` json NOT NULL,\n  `trigger_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `status` int NOT NULL DEFAULT '1',\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_api_router',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `port` int NOT NULL,\n  `domain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `version` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `file` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `name_UNIQUE` (`name`),\n  UNIQUE KEY `port_UNIQUE` (`port`)\n) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: "t_domain_setting",
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `domain` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `port` int NOT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `domain_UNIQUE` (`domain`),\n  UNIQUE KEY `port_UNIQUE` (`port`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 'public_config',
                                sql: " (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `value` json NOT NULL,\n  `updated_at` datetime NOT NULL,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `index2` (`key`)\n) ENGINE=InnoDB AUTO_INCREMENT=295 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_user_public_config',
                                sql: " (\n                    `id` int NOT NULL AUTO_INCREMENT,\n                `user_id` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n                `key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n                `value` json NOT NULL,\n                `updated_at` datetime NOT NULL,\n                PRIMARY KEY (`id`),\n                UNIQUE KEY `index2` (`user_id`,`key`)\n        ) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_chat_list',
                                sql: " (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `chat_id` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',\n  `info` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `index2` (`chat_id`),\n  KEY `index3` (`type`),\n  KEY `index4` (`updated_time`)\n) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_chat_participants',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `chat_id` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `user_id` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `index2` (`chat_id`,`user_id`)\n) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_post',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `userID` int NOT NULL,\n  `content` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `index2` (`userID`)\n) ENGINE=InnoDB AUTO_INCREMENT=287 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_manager_post',
                                sql: " (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `userID` int NOT NULL,\n  `content` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `status` int NOT NULL DEFAULT '1',\n  PRIMARY KEY (`id`),\n  KEY `index2` (`userID`)\n) ENGINE=InnoDB AUTO_INCREMENT=287 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_user',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `userID` int NOT NULL,\n  `account` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `pwd` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `userData` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `role` int NOT NULL DEFAULT '0' COMMENT '\u89D2\u8272\u6B0A\u9650\u5B9A\u7FA9',\n  `company` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `status` int NOT NULL DEFAULT '1',\n  `online_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `static_info` json DEFAULT NULL,\n  `member_level` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  PRIMARY KEY (`id`,`userID`,`account`),\n  UNIQUE KEY `account_UNIQUE` (`account`),\n  UNIQUE KEY `userID_UNIQUE` (`userID`),\n  KEY `index5` (`company`),\n  KEY `index6` (`role`),\n  KEY `index4` (`status`),\n  KEY `index7` (`member_level`)\n) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='V1.2'",
                            },
                            {
                                scheme: appName,
                                table: 't_checkout',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `cart_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `status` int NOT NULL DEFAULT '0',\n  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `orderData` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `total` int NOT NULL DEFAULT '0',\n  `order_status` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `payment_method` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `shipment_method` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `shipment_date` datetime DEFAULT NULL,\n  `progress` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `shipment_number` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `total_received` int DEFAULT NULL,\n  `offset_amount` int DEFAULT NULL,\n  `offset_reason` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `offset_records` json DEFAULT NULL,\n  `reconciliation_date` datetime DEFAULT NULL,\n  `order_source` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `archived` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `customer_name` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `shipment_name` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `customer_email` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `shipment_email` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `customer_phone` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `shipment_phone` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `shipment_address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `cart_token_UNIQUE` (`cart_token`),\n  KEY `index3` (`email`),\n  KEY `index4` (`created_time`),\n  KEY `index5` (`total`),\n  KEY `index6` (`order_status`),\n  KEY `index7` (`payment_method`),\n  KEY `index8` (`shipment_method`),\n  KEY `index9` (`shipment_date`),\n  KEY `index10` (`progress`),\n  KEY `index11` (`shipment_number`),\n  KEY `index12` (`total_received`),\n  KEY `index13` (`offset_amount`),\n  KEY `index14` (`offset_reason`),\n  KEY `index15` (`reconciliation_date`),\n  KEY `index16` (`order_source`),\n  KEY `index17` (`customer_name`),\n  KEY `index18` (`order_source`),\n  KEY `index19` (`shipment_name`),\n  KEY `index20` (`customer_email`),\n  KEY `index21` (`shipment_email`),\n  KEY `index22` (`customer_phone`),\n  KEY `index23` (`shipment_phone`),\n  KEY `index24` (`shipment_address`)\n) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='V1.9'",
                            },
                            {
                                scheme: appName,
                                table: 't_voucher_history',
                                sql: "(\n                        `id` int NOT NULL AUTO_INCREMENT,\n                        `user_id` int NOT NULL COMMENT '\u6703\u54E1id',\n                        `order_id` varchar(200) NOT NULL COMMENT '\u8CFC\u7269\u8ECAid',\n                        `voucher_id` varchar(200) NOT NULL COMMENT '\u512A\u60E0\u5238id',\n                        `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '\u5EFA\u7ACB\u65E5\u671F',\n                        `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n                        `status` int NOT NULL DEFAULT 0 COMMENT '0\u672A\u4ED8\u6B3E 1\u5DF2\u4ED8\u6B3E 2\u7B49\u5F85\u4ED8\u6B3E',\n                        PRIMARY KEY (`id`),\n                        UNIQUE KEY `id_UNIQUE` (`id`)\n) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_subscribe',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `email` varchar(105) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `tag` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `index2` (`email`,`tag`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci         ",
                            },
                            {
                                scheme: appName,
                                table: 't_fcm',
                                sql: "(\n  `id` INT NOT NULL AUTO_INCREMENT,\n  `userID` VARCHAR(100) NULL,\n  `deviceToken` VARCHAR(200) NULL,\n  UNIQUE INDEX `deviceToken_UNIQUE` (`deviceToken` ASC) VISIBLE,\n  INDEX `index2` (`userID` ASC) VISIBLE,\n  PRIMARY KEY (`id`)\n  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci\n  ",
                            },
                            {
                                scheme: appName,
                                table: 't_wallet',
                                sql: " (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `orderID` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `userID` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `money` int NOT NULL,\n  `status` int NOT NULL DEFAULT '0',\n  `note` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `orderID_UNIQUE` (`orderID`),\n  KEY `index2` (`userID`),\n  KEY `index3` (`status`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_ai_points',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `orderID` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `userID` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `money` int NOT NULL,\n  `status` int NOT NULL DEFAULT '0',\n  `note` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `orderID_UNIQUE` (`orderID`),\n  KEY `index2` (`userID`),\n  KEY `index3` (`status`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_sms_points',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `orderID` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `userID` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `money` int NOT NULL,\n  `status` int NOT NULL DEFAULT '0',\n  `note` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `orderID_UNIQUE` (`orderID`),\n  KEY `index2` (`userID`),\n  KEY `index3` (`status`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_rebate_point',
                                sql: "(\n                        `id` int NOT NULL AUTO_INCREMENT,\n                        `user_id` int NOT NULL COMMENT '\u7528\u6236 ID',\n                        `origin` int NOT NULL COMMENT '\u539F\u59CB\u9EDE\u6578',\n                        `remain` int NOT NULL COMMENT '\u5269\u9918\u9EDE\u6578',\n                        `note` varchar(100) DEFAULT NULL COMMENT '\u4F7F\u7528\u63CF\u8FF0',\n                        `content` json DEFAULT NULL COMMENT '\u8CFC\u7269\u91D1\u8A73\u7D30\u8CC7\u8A0A',\n                        `created_at` datetime NOT NULL COMMENT '\u5EFA\u7ACB\u6642\u9593',\n                        `updated_at` datetime NOT NULL COMMENT '\u66F4\u65B0\u6642\u9593',\n                        `deadline` datetime DEFAULT NULL COMMENT '\u904E\u671F\u6642\u9593',\n                        PRIMARY KEY (`id`)\n                      ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_withdraw',
                                sql: "(\n  `id` INT NOT NULL AUTO_INCREMENT,\n  `userID` VARCHAR(45) NOT NULL,\n  `money` INT NOT NULL DEFAULT 0,\n  `status` INT NOT NULL DEFAULT 0,\n  `note` JSON NULL DEFAULT NULL,\n  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  INDEX `index2` (`userID` ASC) VISIBLE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
                            },
                            {
                                scheme: appName,
                                table: 't_global_event',
                                sql: " (\n  `id` INT NOT NULL AUTO_INCREMENT,\n  `tag` VARCHAR(45) NOT NULL,\n  `name` VARCHAR(45) NOT NULL,\n  `json` JSON NULL,\n  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE INDEX `tag_UNIQUE` (`tag` ASC) VISIBLE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n",
                            },
                            {
                                scheme: appName,
                                table: 't_stock_recover',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `order_id` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `product_id` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `count` int DEFAULT NULL,\n  `spec` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `dead_line` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `index2` (`dead_line`),\n  KEY `index3` (`product_id`)\n) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci\n",
                            },
                            {
                                scheme: appName,
                                table: 't_chat_last_read',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `user_id` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `chat_id` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `last_read` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `index2` (`user_id`,`chat_id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci\n",
                            },
                            {
                                scheme: appName,
                                table: 't_graph_api',
                                sql: "(\n  `id` INT NOT NULL AUTO_INCREMENT,\n  `route` VARCHAR(200) NOT NULL,\n  `method` VARCHAR(45) NOT NULL,\n  `info` JSON NULL,\n  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE INDEX `index2` (`route` ASC, `method` ASC) VISIBLE);\n",
                            },
                            {
                                scheme: appName,
                                table: "t_notice",
                                sql: "(\n  `id` INT NOT NULL AUTO_INCREMENT,\n  `user_id` VARCHAR(45) NOT NULL,\n  `tag` VARCHAR(45) NOT NULL,\n  `title` VARCHAR(200) NOT NULL,\n  `content` VARCHAR(400) NOT NULL,\n  `link` VARCHAR(100) NOT NULL,\n  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  INDEX `index2` (`user_id` ASC) VISIBLE);",
                            },
                            {
                                scheme: appName,
                                table: 't_return_order',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `return_order_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `order_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `status` int NOT NULL DEFAULT '0',\n  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `orderData` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `return_order_id_UNIQUE` (`return_order_id`),\n  KEY `index3` (`email`),\n  KEY `index4` (`created_time`)\n) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: "t_stock_history",
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `order_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `status` int NOT NULL DEFAULT 1,\n  `content` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `index2` (`order_id`),\n  UNIQUE KEY `order_id_UNIQUE` (`order_id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: "t_live_purchase_interactions",
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `name` varchar(200) NOT NULL,\n  `status` int NOT NULL DEFAULT 1,\n  `content` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `index2` (`name`)\n)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT = 'V1.1';\n ",
                            },
                            {
                                scheme: appName,
                                table: "t_line_group_inf",
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `group_id` VARCHAR(50) NOT NULL, \n  `group_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,  \n  `shopnex_user_name` VARCHAR(255) NOT NULL,\n  `shopnex_app` VARCHAR(255) NOT NULL, \n  `shopnex_user_id` VARCHAR(50) NOT NULL, \n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `index2` (`group_id`),\n  KEY `index3` (`shopnex_user_id`)\n)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci\n ",
                            },
                            {
                                scheme: appName,
                                table: "t_app_line_group_verification",
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `app_name` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL, \n  `verification_code` VARCHAR(255) NOT NULL,  \n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `index2` (`app_name`),\n  KEY `index3` (`verification_code`),\n  UNIQUE KEY `unique_verification_code` (`verification_code`)\n)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci\n ",
                            },
                            {
                                scheme: appName,
                                table: "t_temporary_cart",
                                sql: "(\n                    `id` int NOT NULL AUTO_INCREMENT,\n  `cart_id` VARCHAR(255) NOT NULL ,\n  `content` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `unique_cart_id` (`cart_id`),\n  INDEX `idx_created_time` (`created_time`)\n)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci\n ",
                            },
                            {
                                scheme: appName,
                                table: "t_live_comments",
                                sql: "(\n          `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key: Auto-incremented ID', \n          `interaction_id` varchar(50) NOT NULL COMMENT 'ID that links to t_live_purchase_interactions',\n          `user_id` varchar(50) NOT NULL COMMENT 'ID from FB or IG packet which is used to identify the user',\n          `user_name` VARCHAR(255) NOT NULL  COMMENT 'name from FB or IG ',\n          `message` TEXT NOT NULL,\n          `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n          PRIMARY KEY (`id`),\n          KEY `index2` (`interaction_id`)\n        )  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci\n         ",
                            },
                            {
                                scheme: appName,
                                table: "t_check_in_pos",
                                sql: "(\n  `id` INT NOT NULL AUTO_INCREMENT,\n  `staff` VARCHAR(45) NOT NULL,\n  `execute` VARCHAR(45) NOT NULL,\n  `store` VARCHAR(45) NOT NULL DEFAULT '',\n  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  INDEX `index2` (`staff` ASC) VISIBLE,\n  INDEX `index3` (`create_time` ASC) VISIBLE,\n  INDEX `index5` (`store` ASC) VISIBLE,\n  INDEX `index4` (`execute` ASC) VISIBLE) COMMENT = 'V1.1';\n",
                            },
                            {
                                scheme: appName,
                                table: "t_pos_summary",
                                sql: "(\n  `id` INT NOT NULL AUTO_INCREMENT,\n  `staff` VARCHAR(45) NOT NULL,\n  `summary_type` VARCHAR(45) NOT NULL,\n  `content` JSON NOT NULL,\n  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  INDEX `index2` (`staff` ASC) VISIBLE,\n  INDEX `index3` (`summary_type` ASC) VISIBLE,\n  INDEX `index4` (`created_time` ASC) VISIBLE);\n",
                            },
                            {
                                scheme: appName,
                                table: 't_product_comment',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `product_id` int DEFAULT NULL,\n  `content` json NOT NULL,\n  PRIMARY KEY (`id`),\n  KEY `index2` (`product_id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                            },
                            {
                                scheme: appName,
                                table: 't_products_sold_history',
                                sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `product_id` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `order_id` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `spec` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `count` float NOT NULL,\n  PRIMARY KEY (`id`),\n  KEY `index2` (`product_id`),\n  KEY `index3` (`order_id`),\n  KEY `index4` (`spec`),\n  KEY `index5` (`count`)\n) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='V1.1'",
                            }
                        ];
                        _loop_1 = function (b) {
                            var check;
                            return __generator(this, function (_o) {
                                switch (_o.label) {
                                    case 0:
                                        check = b.length;
                                        return [4 /*yield*/, new Promise(function (resolve) {
                                                for (var _i = 0, b_1 = b; _i < b_1.length; _i++) {
                                                    var d = b_1[_i];
                                                    (0, saas_table_check_js_1.compare_sql_table)(d.scheme, d.table, d.sql).then(function () {
                                                        check--;
                                                        if (check === 0) {
                                                            resolve(true);
                                                        }
                                                    });
                                                }
                                            })];
                                    case 1:
                                        _o.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, _c = chunkArray(sqlArray, groupSize);
                        _m.label = 7;
                    case 7:
                        if (!(_i < _c.length)) return [3 /*break*/, 10];
                        b = _c[_i];
                        return [5 /*yield**/, _loop_1(b)];
                    case 8:
                        _m.sent();
                        _m.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 7];
                    case 10:
                        //AI客服的設定，*注意*異步避免chat-gpt異常
                        ai_robot_js_1.AiRobot.syncAiRobot(appName);
                        //舊版未分倉庫的資料格式，改成有分倉庫的資料格式
                        return [4 /*yield*/, ApiPublic.migrateVariants(appName)];
                    case 11:
                        //舊版未分倉庫的資料格式，改成有分倉庫的資料格式
                        _m.sent();
                        //檢查資料庫更新
                        return [4 /*yield*/, updated_table_checked_js_1.UpdatedTableChecked.startCheck(appName)];
                    case 12:
                        //檢查資料庫更新
                        _m.sent();
                        //賽入301轉址判斷
                        _e = (_d = ApiPublic.app301).push;
                        _j = {
                            app_name: appName
                        };
                        return [4 /*yield*/, new user_js_1.User(appName).getConfigV2({
                                key: 'domain_301',
                                user_id: 'manager'
                            })];
                    case 13:
                        //賽入301轉址判斷
                        _e.apply(_d, [(_j.router = (_l = (_m.sent()).list) !== null && _l !== void 0 ? _l : [],
                                _j)]);
                        //更新檢查通過，推入可執行
                        _g = (_f = ApiPublic.checkedApp).push;
                        _k = {
                            app_name: appName
                        };
                        return [4 /*yield*/, database_1.default.query("select refer_app\n             from `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n             where appName = ?"), [appName])];
                    case 14:
                        //更新檢查通過，推入可執行
                        _g.apply(_f, [(_k.refer_app = (_m.sent())[0]['refer_app'],
                                _k)]);
                        return [3 /*break*/, 16];
                    case 15:
                        e_1 = _m.sent();
                        console.error(e_1);
                        //移除檢查中狀態
                        ApiPublic.checkingApp = ApiPublic.checkingApp.filter(function (dd) {
                            return dd.app_name !== appName;
                        });
                        return [3 /*break*/, 16];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    ApiPublic.checkSQLAdmin = function (appName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql_info, trans, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("select sql_pwd, sql_admin\n         from `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n         where appName = ").concat(database_1.default.escape(appName)), [])];
                    case 1:
                        sql_info = (_a.sent())[0];
                        if (!(!sql_info.sql_admin || !sql_info.sql_pwd)) return [3 /*break*/, 10];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, , 10]);
                        sql_info.sql_admin = tool_js_1.default.randomString(6);
                        sql_info.sql_pwd = tool_js_1.default.randomString(12);
                        return [4 /*yield*/, database_1.default.Transaction.build()];
                    case 3:
                        trans = _a.sent();
                        return [4 /*yield*/, trans.execute("CREATE USER '".concat(sql_info.sql_admin, "'@'%' IDENTIFIED BY '").concat(sql_info.sql_pwd, "';"), [])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, trans.execute("update `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n           set sql_admin=?,\n               sql_pwd=?\n           where appName = ").concat(database_1.default.escape(appName)), [sql_info.sql_admin, sql_info.sql_pwd])];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, trans.execute("GRANT ALL PRIVILEGES ON `".concat(appName, "`.* TO '").concat(sql_info.sql_admin, "'@'*';"), [])];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, trans.commit()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, trans.release()];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        e_2 = _a.sent();
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ApiPublic.migrateVariants = function (app) {
        return __awaiter(this, void 0, void 0, function () {
            var store_version, _i, _a, b, stock_list, _loop_2, _b, _c, c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, new user_js_1.User(app).getConfigV2({
                            key: 'store_version',
                            user_id: 'manager',
                        })];
                    case 1:
                        store_version = _d.sent();
                        if (!(store_version.version === 'v1')) return [3 /*break*/, 8];
                        _i = 0;
                        return [4 /*yield*/, database_1.default.query("select *\n         from `".concat(app, "`.t_manager_post\n         where (content ->>'$.type'='product')"), [])];
                    case 2:
                        _a = _d.sent();
                        _d.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        b = _a[_i];
                        return [4 /*yield*/, new user_js_1.User(app).getConfigV2({
                                key: 'store_manager',
                                user_id: 'manager',
                            })];
                    case 4:
                        stock_list = _d.sent();
                        _loop_2 = function (c) {
                            c.stockList = {};
                            stock_list.list.map(function (dd) {
                                c.stockList[dd.id] = {
                                    count: 0,
                                };
                            });
                            c.stockList[stock_list.list[0].id].count = c.stock;
                        };
                        for (_b = 0, _c = b.content.variants; _b < _c.length; _b++) {
                            c = _c[_b];
                            _loop_2(c);
                        }
                        return [4 /*yield*/, new shopping_js_1.Shopping(app).putProduct(b.content)];
                    case 5:
                        _d.sent();
                        store_version.version = 'v2';
                        return [4 /*yield*/, new user_js_1.User(app).setConfig({
                                key: 'store_version',
                                user_id: 'manager',
                                value: {
                                    version: 'v2',
                                },
                            })];
                    case 6:
                        _d.sent();
                        console.log("migrate-\u5206\u8259:", b);
                        _d.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    //已檢查通過的APP
    ApiPublic.checkedApp = [];
    //正在檢查更新的APP
    ApiPublic.checkingApp = [];
    //301轉址
    ApiPublic.app301 = [];
    return ApiPublic;
}());
exports.ApiPublic = ApiPublic;
function chunkArray(array, groupSize) {
    var result = [];
    for (var i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}

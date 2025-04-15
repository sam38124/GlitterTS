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
exports.compare_sql_table = exports.SaasScheme = void 0;
var database_1 = require("../modules/database");
var config_1 = require("../config");
exports.SaasScheme = {
    createScheme: function () { return __awaiter(void 0, void 0, void 0, function () {
        var sqlArray, groupSize, _loop_1, _i, _a, b;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, database_1.default.query("SET GLOBAL max_prepared_stmt_count = 262112", [])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, database_1.default.execute("CREATE SCHEMA if not exists `".concat(config_1.saasConfig.SAAS_NAME, "_recover` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;"), [])];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, database_1.default.execute("CREATE SCHEMA if not exists `".concat(config_1.saasConfig.SAAS_NAME, "` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;"), [])];
                case 3:
                    _b.sent();
                    sqlArray = [
                        {
                            scheme: config_1.saasConfig.SAAS_NAME,
                            table: 't_ip_info',
                            sql: "(\n  `id` INT NOT NULL AUTO_INCREMENT,\n  `ip` VARCHAR(45) NOT NULL,\n  `data` JSON NULL,\n  PRIMARY KEY (`id`),\n  UNIQUE INDEX `index2` (`ip` ASC) VISIBLE)",
                        },
                        {
                            scheme: config_1.saasConfig.SAAS_NAME,
                            table: 't_monitor',
                            sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `ip` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `app_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `user_id` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `mac_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `base_url` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `req_type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `index2` (`ip`),\n  KEY `index3` (`app_name`),\n  KEY `index4` (`mac_address`),\n  KEY `index5` (`created_time`),\n  KEY `index6` (`req_type`),\n  KEY `index7` (`app_name`,`req_type`)\n) ENGINE=InnoDB AUTO_INCREMENT=3969739 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                        },
                        {
                            scheme: config_1.saasConfig.SAAS_NAME,
                            table: 'currency_config',
                            sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `json` json NOT NULL,\n  `updated` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `index2` (`updated`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                        },
                        {
                            scheme: config_1.saasConfig.SAAS_NAME,
                            table: 'page_config',
                            sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `userID` varchar(45) NOT NULL,\n  `appName` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `tag` varchar(45) NOT NULL,\n  `group` varchar(45) DEFAULT NULL,\n  `name` varchar(45) NOT NULL,\n  `config` json NOT NULL,\n  `page_type` varchar(45) NOT NULL DEFAULT 'page',\n  `page_config` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `preview_image` varchar(200) DEFAULT NULL,\n  `favorite` int NOT NULL DEFAULT '0',\n  `template_config` json DEFAULT NULL,\n  `template_type` int NOT NULL DEFAULT '0',\n  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `page_index` (`appName`,`tag`),\n  KEY `app_index` (`userID`,`appName`),\n  KEY `index4` (`page_type`),\n  KEY `index5` (`favorite`)\n) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
                        },
                        {
                            scheme: config_1.saasConfig.SAAS_NAME,
                            table: 'page_config_en',
                            sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `userID` varchar(45) NOT NULL,\n  `appName` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `tag` varchar(45) NOT NULL,\n  `group` varchar(45) DEFAULT NULL,\n  `name` varchar(45) NOT NULL,\n  `config` json NOT NULL,\n  `page_type` varchar(45) NOT NULL DEFAULT 'page',\n  `page_config` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `preview_image` varchar(200) DEFAULT NULL,\n  `favorite` int NOT NULL DEFAULT '0',\n  `template_config` json DEFAULT NULL,\n  `template_type` int NOT NULL DEFAULT '0',\n  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `page_index` (`appName`,`tag`),\n  KEY `app_index` (`userID`,`appName`),\n  KEY `index4` (`page_type`),\n  KEY `index5` (`favorite`)\n) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
                        },
                        {
                            scheme: config_1.saasConfig.SAAS_NAME,
                            table: 'page_config_rcn',
                            sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `userID` varchar(45) NOT NULL,\n  `appName` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `tag` varchar(45) NOT NULL,\n  `group` varchar(45) DEFAULT NULL,\n  `name` varchar(45) NOT NULL,\n  `config` json NOT NULL,\n  `page_type` varchar(45) NOT NULL DEFAULT 'page',\n  `page_config` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `preview_image` varchar(200) DEFAULT NULL,\n  `favorite` int NOT NULL DEFAULT '0',\n  `template_config` json DEFAULT NULL,\n  `template_type` int NOT NULL DEFAULT '0',\n  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `page_index` (`appName`,`tag`),\n  KEY `app_index` (`userID`,`appName`),\n  KEY `index4` (`page_type`),\n  KEY `index5` (`favorite`)\n) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
                        },
                        {
                            scheme: config_1.saasConfig.SAAS_NAME,
                            table: 'app_config',
                            sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `domain` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `user` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `appName` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `dead_line` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `config` json DEFAULT NULL,\n  `brand` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'glitter',\n  `template_config` json DEFAULT NULL,\n  `template_type` int NOT NULL DEFAULT '0' COMMENT '0\u5C1A\u672A\u767C\u5E03\uFF0C1\u5BE9\u6838\u4E2D\uFF0C2\u5DF2\u767C\u5E03\u81F3\u5546\u57CE\uFF0C3\u5DF2\u767C\u5E03\u81F3\u500B\u4EBA\u6A21\u677F\u5EAB',\n  `sql_pwd` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `sql_admin` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `ec2_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `theme_config` json DEFAULT NULL,\n  `refer_app` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `plan` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `user_app` (`user`,`appName`),\n  KEY `find_user` (`user`),\n    KEY `find_plan` (`plan`)\n) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci\n",
                        },
                        {
                            scheme: config_1.saasConfig.SAAS_NAME,
                            table: 'app_auth_config',
                            sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `user` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `appName` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n  `config` json DEFAULT NULL,\n  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `status` int NOT NULL DEFAULT '0',\n  `invited` int NOT NULL DEFAULT '0',\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci\n",
                        },
                        {
                            scheme: config_1.saasConfig.SAAS_NAME,
                            table: 'private_config',
                            sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `app_name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `value` json NOT NULL,\n  `updated_at` datetime NOT NULL,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `index2` (`app_name`,`key`),\n  KEY `index3` (`key`)\n) ENGINE=InnoDB AUTO_INCREMENT=242 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                        },
                        {
                            scheme: config_1.saasConfig.SAAS_NAME,
                            table: 'official_component',
                            sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `group` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `url` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `userID` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `app_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  PRIMARY KEY (`id`),\n  KEY `index4` (`app_name`),\n  KEY `index2` (`key`),\n  KEY `index3` (`group`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                        },
                        {
                            scheme: config_1.saasConfig.SAAS_NAME,
                            table: 't_template_tag',
                            sql: "(\n  `id` int NOT NULL AUTO_INCREMENT,\n  `type` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `tag` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `bind` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `index2` (`type`,`bind`,`tag`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                        },
                        {
                            scheme: config_1.saasConfig.SAAS_NAME,
                            table: 'error_log',
                            sql: "(\n  `id` INT NOT NULL AUTO_INCREMENT,\n  `message` TEXT NULL,\n  `stack` TEXT NULL,\n  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                        },
                        {
                            scheme: config_1.saasConfig.SAAS_NAME,
                            table: 'warning_log',
                            sql: "(\n  `id` INT NOT NULL AUTO_INCREMENT,\n  `message` TEXT NULL,\n   `tag` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `stack` TEXT NULL,\n  `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    KEY `index2` (`tag`),\n  PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
                        },
                    ];
                    groupSize = 5;
                    _loop_1 = function (b) {
                        var check;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    check = b.length;
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            var _loop_2 = function (d) {
                                                function try_execute() {
                                                    try {
                                                        compare_sql_table(d.scheme, d.table, d.sql).then(function () {
                                                            check--;
                                                            if (check === 0) {
                                                                resolve(true);
                                                            }
                                                        });
                                                    }
                                                    catch (e) {
                                                        try_execute();
                                                    }
                                                }
                                                try_execute();
                                            };
                                            for (var _i = 0, b_1 = b; _i < b_1.length; _i++) {
                                                var d = b_1[_i];
                                                _loop_2(d);
                                            }
                                        })];
                                case 1:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = chunkArray(sqlArray, groupSize);
                    _b.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    b = _a[_i];
                    return [5 /*yield**/, _loop_1(b)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/];
            }
        });
    }); },
};
function chunkArray(array, groupSize) {
    var result = [];
    for (var i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}
function compare_sql_table(scheme, table, sql) {
    return __awaiter(this, void 0, void 0, function () {
        var tempKey, trans, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    tempKey = 'tempcompare' + table;
                    return [4 /*yield*/, database_1.default.Transaction.build()];
                case 1:
                    trans = _a.sent();
                    return [4 /*yield*/, trans.execute("DROP TABLE if exists `".concat(scheme, "`.`").concat(tempKey, "`;"), [])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, trans.execute("CREATE TABLE if not exists `".concat(scheme, "`.`").concat(table, "` ").concat(sql), [])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, trans.execute("CREATE TABLE if not exists `".concat(scheme, "`.`").concat(tempKey, "` ").concat(sql), [])];
                case 4:
                    _a.sent();
                    // const compareStruct = `SELECT COLUMN_NAME,
                    //                           DATA_TYPE,
                    //                           CHARACTER_MAXIMUM_LENGTH
                    //                    FROM INFORMATION_SCHEMA.COLUMNS
                    //                    WHERE TABLE_NAME = ?
                    //                      AND TABLE_SCHEMA = ?`;
                    // const compareStruct2 = `SELECT INDEX_NAME,
                    //                            COLUMN_NAME
                    //                     FROM INFORMATION_SCHEMA.STATISTICS
                    //                     WHERE TABLE_NAME = ?
                    //                       AND TABLE_SCHEMA = ?;    `;
                    // let older = await db.query(compareStruct, [table, scheme]);
                    // const newest = await db.query(compareStruct, [tempKey, scheme]);
                    // const older2 = await db.query(compareStruct2, [table, scheme]);
                    // const newest2 = await db.query(compareStruct2, [tempKey, scheme]);
                    // if (newest2.length === 0 || newest.length === 0) {
                    //     return await compare_sql_table(scheme, table, sql);
                    // }
                    // if (!(JSON.stringify(older) == JSON.stringify(newest)) || !(JSON.stringify(older2) == JSON.stringify(newest2))) {
                    //     console.log(`update-table`)
                    //     older = older.filter((dd: any) => {
                    //         return newest.find((d2: any) => {
                    //             return dd.COLUMN_NAME === d2.COLUMN_NAME;
                    //         });
                    //     });
                    //     await trans.execute(
                    //         `INSERT INTO \`${scheme}\`.\`${tempKey}\` (${older
                    //             .map((dd: any) => {
                    //                 return `\`${dd.COLUMN_NAME}\``;
                    //             })
                    //             .join(',')})
                    //                            SELECT ${older
                    //                                .map((dd: any) => {
                    //                                    return `\`${dd.COLUMN_NAME}\``;
                    //                                })
                    //                                .join(',')}
                    //                            FROM \`${scheme}\`.\`${table}\`
                    // `,
                    //         []
                    //     );
                    //     await trans.execute(
                    //         `
                    // CREATE TABLE  \`${scheme}_recover\`.\`${table}_${new Date().getTime()}\` AS SELECT * FROM \`${scheme}\`.\`${table}\`;
                    // `,
                    //         []
                    //     );
                    //     await trans.execute(`DROP TABLE \`${scheme}\`.\`${table}\`;`, []);
                    //     let fal = 0;
                    //     async function loopToAlter() {
                    //         try {
                    //             await trans.execute(`ALTER TABLE \`${scheme}\`.${tempKey} RENAME TO \`${scheme}\`.\`${table}\`;`, []);
                    //             await new Promise((resolve, reject) => {
                    //                 setTimeout(() => {
                    //                     resolve(true);
                    //                 }, 1000);
                    //             });
                    //         } catch (e) {
                    //             fal++;
                    //             if (fal < 5) {
                    //                 await loopToAlter();
                    //             }
                    //         }
                    //     }
                    //     await loopToAlter();
                    // }
                    // await trans.execute(`DROP TABLE if exists \`${scheme}\`.\`${tempKey}\`;`, []);
                    return [4 /*yield*/, trans.commit()];
                case 5:
                    // const compareStruct = `SELECT COLUMN_NAME,
                    //                           DATA_TYPE,
                    //                           CHARACTER_MAXIMUM_LENGTH
                    //                    FROM INFORMATION_SCHEMA.COLUMNS
                    //                    WHERE TABLE_NAME = ?
                    //                      AND TABLE_SCHEMA = ?`;
                    // const compareStruct2 = `SELECT INDEX_NAME,
                    //                            COLUMN_NAME
                    //                     FROM INFORMATION_SCHEMA.STATISTICS
                    //                     WHERE TABLE_NAME = ?
                    //                       AND TABLE_SCHEMA = ?;    `;
                    // let older = await db.query(compareStruct, [table, scheme]);
                    // const newest = await db.query(compareStruct, [tempKey, scheme]);
                    // const older2 = await db.query(compareStruct2, [table, scheme]);
                    // const newest2 = await db.query(compareStruct2, [tempKey, scheme]);
                    // if (newest2.length === 0 || newest.length === 0) {
                    //     return await compare_sql_table(scheme, table, sql);
                    // }
                    // if (!(JSON.stringify(older) == JSON.stringify(newest)) || !(JSON.stringify(older2) == JSON.stringify(newest2))) {
                    //     console.log(`update-table`)
                    //     older = older.filter((dd: any) => {
                    //         return newest.find((d2: any) => {
                    //             return dd.COLUMN_NAME === d2.COLUMN_NAME;
                    //         });
                    //     });
                    //     await trans.execute(
                    //         `INSERT INTO \`${scheme}\`.\`${tempKey}\` (${older
                    //             .map((dd: any) => {
                    //                 return `\`${dd.COLUMN_NAME}\``;
                    //             })
                    //             .join(',')})
                    //                            SELECT ${older
                    //                                .map((dd: any) => {
                    //                                    return `\`${dd.COLUMN_NAME}\``;
                    //                                })
                    //                                .join(',')}
                    //                            FROM \`${scheme}\`.\`${table}\`
                    // `,
                    //         []
                    //     );
                    //     await trans.execute(
                    //         `
                    // CREATE TABLE  \`${scheme}_recover\`.\`${table}_${new Date().getTime()}\` AS SELECT * FROM \`${scheme}\`.\`${table}\`;
                    // `,
                    //         []
                    //     );
                    //     await trans.execute(`DROP TABLE \`${scheme}\`.\`${table}\`;`, []);
                    //     let fal = 0;
                    //     async function loopToAlter() {
                    //         try {
                    //             await trans.execute(`ALTER TABLE \`${scheme}\`.${tempKey} RENAME TO \`${scheme}\`.\`${table}\`;`, []);
                    //             await new Promise((resolve, reject) => {
                    //                 setTimeout(() => {
                    //                     resolve(true);
                    //                 }, 1000);
                    //             });
                    //         } catch (e) {
                    //             fal++;
                    //             if (fal < 5) {
                    //                 await loopToAlter();
                    //             }
                    //         }
                    //     }
                    //     await loopToAlter();
                    // }
                    // await trans.execute(`DROP TABLE if exists \`${scheme}\`.\`${tempKey}\`;`, []);
                    _a.sent();
                    return [4 /*yield*/, trans.release()];
                case 6:
                    _a.sent();
                    return [2 /*return*/, true];
                case 7:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [2 /*return*/, false];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.compare_sql_table = compare_sql_table;

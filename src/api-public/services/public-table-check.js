"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPublic = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const config_js_1 = require("../../config.js");
const saas_table_check_js_1 = require("../../services/saas-table-check.js");
const tool_js_1 = __importDefault(require("../../services/tool.js"));
const ai_robot_js_1 = require("./ai-robot.js");
class ApiPublic {
    static async createScheme(appName) {
        if (ApiPublic.checkApp.find((dd) => {
            return dd.app_name === appName;
        })) {
            return;
        }
        ApiPublic.checkApp.push({
            app_name: appName,
            refer_app: (await database_1.default.query(`select refer_app
                                        from \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
                                        where appName = ?`, [appName]))[0]['refer_app'],
        });
        try {
            await database_1.default.execute(`CREATE SCHEMA if not exists \`${appName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`, []);
            await database_1.default.execute(`CREATE SCHEMA if not exists \`${appName}_recover\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`, []);
            const groupSize = 15;
            const sqlArray = [
                {
                    scheme: appName,
                    table: 't_chat_detail',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`chat_id\` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`user_id\` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`message\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`index2\` (\`chat_id\`),
  KEY \`index3\` (\`user_id\`),
  KEY \`index4\` (\`created_time\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: `t_invoice_memory`,
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`status\` int NOT NULL DEFAULT 1,
  \`order_id\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`invoice_no\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`invoice_data\` json DEFAULT NULL,
  \`create_date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`index2\` (\`order_id\`),
  KEY \`index3\` (\`invoice_no\`),
  KEY \`index4\` (\`create_date\`),
  KEY \`index5\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
                },
                {
                    scheme: appName,
                    table: 't_variants',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`product_id\` int DEFAULT NULL,
  \`content\` json NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`index2\` (\`product_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_recommend_users',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`email\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`content\` json NOT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`email_UNIQUE\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_recommend_links',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`code\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`content\` json NOT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`code_UNIQUE\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_triggers',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`tag\` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`content\` json NOT NULL,
  \`trigger_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`status\` int NOT NULL DEFAULT '1',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_api_router',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`name\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`port\` int NOT NULL,
  \`domain\` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`version\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`file\` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`name_UNIQUE\` (\`name\`),
  UNIQUE KEY \`port_UNIQUE\` (\`port\`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: `t_domain_setting`,
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`domain\` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`port\` int NOT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`domain_UNIQUE\` (\`domain\`),
  UNIQUE KEY \`port_UNIQUE\` (\`port\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 'public_config',
                    sql: ` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`key\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`value\` json NOT NULL,
  \`updated_at\` datetime NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`key\`)
) ENGINE=InnoDB AUTO_INCREMENT=295 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_user_public_config',
                    sql: ` (
                    \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
                \`key\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                \`value\` json NOT NULL,
                \`updated_at\` datetime NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`index2\` (\`user_id\`,\`key\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_chat_list',
                    sql: ` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`chat_id\` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`type\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  \`info\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`chat_id\`),
  KEY \`index3\` (\`type\`),
  KEY \`index4\` (\`updated_time\`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_chat_participants',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`chat_id\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`user_id\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`chat_id\`,\`user_id\`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_post',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`userID\` int NOT NULL,
  \`content\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`index2\` (\`userID\`)
) ENGINE=InnoDB AUTO_INCREMENT=287 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_manager_post',
                    sql: ` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`userID\` int NOT NULL,
  \`content\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`status\` int NOT NULL DEFAULT '1',
  PRIMARY KEY (\`id\`),
  KEY \`index2\` (\`userID\`)
) ENGINE=InnoDB AUTO_INCREMENT=287 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_user',
                    sql: ` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`userID\` int NOT NULL,
  \`account\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`pwd\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`userData\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`role\` int NOT NULL DEFAULT '0' COMMENT '角色權限定義',
  \`company\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`status\` int NOT NULL DEFAULT '1',
  \`online_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`static_info\` json DEFAULT NULL,
  PRIMARY KEY (\`id\`,\`userID\`,\`account\`),
  UNIQUE KEY \`account_UNIQUE\` (\`account\`),
  UNIQUE KEY \`userID_UNIQUE\` (\`userID\`),
  KEY \`index5\` (\`company\`),
  KEY \`index6\` (\`role\`),
  KEY \`index4\` (\`status\`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_checkout',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`cart_token\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`status\` int NOT NULL DEFAULT '0',
  \`email\` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`orderData\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`cart_token_UNIQUE\` (\`cart_token\`),
  KEY \`index3\` (\`email\`),
  KEY \`index4\` (\`created_time\`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_voucher_history',
                    sql: `(
                        \`id\` int NOT NULL AUTO_INCREMENT,
                        \`user_id\` int NOT NULL COMMENT '會員id',
                        \`order_id\` varchar(200) NOT NULL COMMENT '購物車id',
                        \`voucher_id\` varchar(200) NOT NULL COMMENT '優惠券id',
                        \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立日期',
                        \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        \`status\` int NOT NULL DEFAULT 0 COMMENT '0未付款 1已付款 2等待付款',
                        PRIMARY KEY (\`id\`),
                        UNIQUE KEY \`id_UNIQUE\` (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_subscribe',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`email\` varchar(105) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`tag\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`email\`,\`tag\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci         `,
                },
                {
                    scheme: appName,
                    table: 't_fcm',
                    sql: `(
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userID\` VARCHAR(100) NULL,
  \`deviceToken\` VARCHAR(200) NULL,
  UNIQUE INDEX \`deviceToken_UNIQUE\` (\`deviceToken\` ASC) VISIBLE,
  INDEX \`index2\` (\`userID\` ASC) VISIBLE,
  PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
                },
                {
                    scheme: appName,
                    table: 't_wallet',
                    sql: ` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`orderID\` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`userID\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`money\` int NOT NULL,
  \`status\` int NOT NULL DEFAULT '0',
  \`note\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`orderID_UNIQUE\` (\`orderID\`),
  KEY \`index2\` (\`userID\`),
  KEY \`index3\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_ai_points',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`orderID\` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`userID\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`money\` int NOT NULL,
  \`status\` int NOT NULL DEFAULT '0',
  \`note\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`orderID_UNIQUE\` (\`orderID\`),
  KEY \`index2\` (\`userID\`),
  KEY \`index3\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_sms_points',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`orderID\` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`userID\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`money\` int NOT NULL,
  \`status\` int NOT NULL DEFAULT '0',
  \`note\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`orderID_UNIQUE\` (\`orderID\`),
  KEY \`index2\` (\`userID\`),
  KEY \`index3\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_rebate_point',
                    sql: `(
                        \`id\` int NOT NULL AUTO_INCREMENT,
                        \`user_id\` int NOT NULL COMMENT '用戶 ID',
                        \`origin\` int NOT NULL COMMENT '原始點數',
                        \`remain\` int NOT NULL COMMENT '剩餘點數',
                        \`note\` varchar(100) DEFAULT NULL COMMENT '使用描述',
                        \`content\` json DEFAULT NULL COMMENT '購物金詳細資訊',
                        \`created_at\` datetime NOT NULL COMMENT '建立時間',
                        \`updated_at\` datetime NOT NULL COMMENT '更新時間',
                        \`deadline\` datetime DEFAULT NULL COMMENT '過期時間',
                        PRIMARY KEY (\`id\`)
                      ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
                {
                    scheme: appName,
                    table: 't_withdraw',
                    sql: `(
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`userID\` VARCHAR(45) NOT NULL,
  \`money\` INT NOT NULL DEFAULT 0,
  \`status\` INT NOT NULL DEFAULT 0,
  \`note\` JSON NULL DEFAULT NULL,
  \`created_time\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`index2\` (\`userID\` ASC) VISIBLE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
                },
                {
                    scheme: appName,
                    table: 't_global_event',
                    sql: ` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`tag\` VARCHAR(45) NOT NULL,
  \`name\` VARCHAR(45) NOT NULL,
  \`json\` JSON NULL,
  \`created_time\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE INDEX \`tag_UNIQUE\` (\`tag\` ASC) VISIBLE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`,
                },
                {
                    scheme: appName,
                    table: 't_stock_recover',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`order_id\` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`product_id\` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`count\` int DEFAULT NULL,
  \`spec\` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`dead_line\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`index2\` (\`dead_line\`),
  KEY \`index3\` (\`product_id\`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`,
                },
                {
                    scheme: appName,
                    table: 't_chat_last_read',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`user_id\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`chat_id\` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`last_read\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`user_id\`,\`chat_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`,
                },
                {
                    scheme: appName,
                    table: 't_graph_api',
                    sql: `(
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`route\` VARCHAR(200) NOT NULL,
  \`method\` VARCHAR(45) NOT NULL,
  \`info\` JSON NULL,
  \`created_time\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE INDEX \`index2\` (\`route\` ASC, \`method\` ASC) VISIBLE);
`,
                },
                {
                    scheme: appName,
                    table: `t_notice`,
                    sql: `(
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`user_id\` VARCHAR(45) NOT NULL,
  \`tag\` VARCHAR(45) NOT NULL,
  \`title\` VARCHAR(200) NOT NULL,
  \`content\` VARCHAR(400) NOT NULL,
  \`link\` VARCHAR(100) NOT NULL,
  \`created_time\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`index2\` (\`user_id\` ASC) VISIBLE);`,
                },
                {
                    scheme: appName,
                    table: 't_return_order',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`return_order_id\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`order_id\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`status\` int NOT NULL DEFAULT '0',
  \`email\` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`orderData\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`return_order_id_UNIQUE\` (\`return_order_id\`),
  KEY \`index3\` (\`email\`),
  KEY \`index4\` (\`created_time\`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
                },
            ];
            for (const b of chunkArray(sqlArray, groupSize)) {
                let check = b.length;
                await new Promise((resolve) => {
                    for (const d of b) {
                        (0, saas_table_check_js_1.compare_sql_table)(d.scheme, d.table, d.sql).then(() => {
                            check--;
                            if (check === 0) {
                                resolve(true);
                            }
                        });
                    }
                });
            }
            await (ai_robot_js_1.AiRobot.syncAiRobot(appName));
        }
        catch (e) {
            console.error(e);
            ApiPublic.checkApp = ApiPublic.checkApp.filter((dd) => {
                return dd.app_name === appName;
            });
        }
    }
    static async checkSQLAdmin(appName) {
        const sql_info = (await database_1.default.query(`select sql_pwd, sql_admin
                 from \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
                 where appName = ${database_1.default.escape(appName)}`, []))[0];
        if (!sql_info.sql_admin || !sql_info.sql_pwd) {
            try {
                sql_info.sql_admin = tool_js_1.default.randomString(6);
                sql_info.sql_pwd = tool_js_1.default.randomString(12);
                const trans = await database_1.default.Transaction.build();
                await trans.execute(`CREATE USER '${sql_info.sql_admin}'@'%' IDENTIFIED BY '${sql_info.sql_pwd}';`, []);
                await trans.execute(`update \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
                                     set sql_admin=?,
                                         sql_pwd=?
                                     where appName = ${database_1.default.escape(appName)}`, [sql_info.sql_admin, sql_info.sql_pwd]);
                await trans.execute(`GRANT ALL PRIVILEGES ON \`${appName}\`.* TO '${sql_info.sql_admin}'@'*';`, []);
                await trans.commit();
                await trans.release();
            }
            catch (e) {
            }
        }
    }
}
exports.ApiPublic = ApiPublic;
ApiPublic.checkApp = [];
function chunkArray(array, groupSize) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}
//# sourceMappingURL=public-table-check.js.map
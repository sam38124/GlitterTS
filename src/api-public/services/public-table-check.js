"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPublic = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const saas_table_check_js_1 = require("../../services/saas-table-check.js");
class ApiPublic {
    static async createScheme(appName) {
        if (ApiPublic.checkApp.indexOf(appName) !== -1) {
            return;
        }
        ApiPublic.checkApp.push(appName);
        try {
            await database_1.default.execute(`CREATE SCHEMA if not exists \`${appName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`, []);
            const groupSize = 15;
            const sqlArray = [
                {
                    scheme: appName,
                    table: 't_chat_detail',
                    sql: ` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`chat_id\` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`t_user\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`message\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`index2\` (\`chat_id\`),
  KEY \`index3\` (\`t_user\`),
  KEY \`index4\` (\`created_time\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
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
) ENGINE=InnoDB AUTO_INCREMENT=295 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
                },
                {
                    scheme: appName,
                    table: 't_chat_list',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`chat_id\` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`participant\` json DEFAULT NULL,
  \`info\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`chat_id\`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
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
) ENGINE=InnoDB AUTO_INCREMENT=287 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
                },
                {
                    scheme: appName,
                    table: 't_manager_post',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`userID\` int NOT NULL,
  \`content\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`index2\` (\`userID\`)
) ENGINE=InnoDB AUTO_INCREMENT=287 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
                },
                {
                    scheme: appName,
                    table: 't_user',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`userID\` int NOT NULL,
  \`account\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`pwd\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`userData\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
\`role\` int NOT NULL DEFAULT '0' COMMENT '角色權限定義',
  \`company\` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      \`status\` int NOT NULL DEFAULT '1',
    KEY \`index5\` (\`company\`),
  KEY \`index6\` (\`role\`),
  PRIMARY KEY (\`id\`,\`userID\`,\`account\`),
  UNIQUE KEY \`account_UNIQUE\` (\`account\`),
  UNIQUE KEY \`userID_UNIQUE\` (\`userID\`),
  KEY \`index4\` (\`status\`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
                },
                {
                    scheme: appName,
                    table: 't_checkout',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`cart_token\` varchar(255) NOT NULL,
  \`status\` int NOT NULL DEFAULT '0',
  \`email\` varchar(100) DEFAULT NULL,
  \`orderData\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`cart_token_UNIQUE\` (\`cart_token\`)
) ENGINE=InnoDB AUTO_INCREMENT=3430 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`
                }
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
        }
        catch (e) {
            ApiPublic.checkApp = ApiPublic.checkApp.filter((dd) => {
                return dd === appName;
            });
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
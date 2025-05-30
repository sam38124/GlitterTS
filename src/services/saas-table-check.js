"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaasScheme = void 0;
exports.compare_sql_table = compare_sql_table;
const database_1 = __importDefault(require("../modules/database"));
const config_1 = require("../config");
exports.SaasScheme = {
    createScheme: async () => {
        await database_1.default.query(`SET GLOBAL max_prepared_stmt_count = 262112`, []);
        await database_1.default.execute(`CREATE SCHEMA if not exists \`${config_1.saasConfig.SAAS_NAME}_recover\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;`, []);
        await database_1.default.execute(`CREATE SCHEMA if not exists \`${config_1.saasConfig.SAAS_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;`, []);
        const sqlArray = [
            {
                scheme: config_1.saasConfig.SAAS_NAME,
                table: 't_ip_info',
                sql: `(
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`ip\` VARCHAR(45) NOT NULL,
  \`data\` JSON NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE INDEX \`index2\` (\`ip\` ASC) VISIBLE)`,
            },
            {
                scheme: config_1.saasConfig.SAAS_NAME,
                table: 't_monitor',
                sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`ip\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`app_name\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`user_id\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`mac_address\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`base_url\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`req_type\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`cookies\` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (\`id\`),
  KEY \`index2\` (\`ip\`),
  KEY \`index3\` (\`app_name\`),
  KEY \`index4\` (\`mac_address\`),
  KEY \`index5\` (\`created_time\`),
  KEY \`index6\` (\`req_type\`),
  KEY \`index7\` (\`app_name\`,\`req_type\`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
            },
            {
                scheme: config_1.saasConfig.SAAS_NAME,
                table: 'currency_config',
                sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`json\` json NOT NULL,
  \`updated\` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`updated\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
            },
            {
                scheme: config_1.saasConfig.SAAS_NAME,
                table: 'page_config',
                sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`userID\` varchar(45) NOT NULL,
  \`appName\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`tag\` varchar(45) NOT NULL,
  \`group\` varchar(45) DEFAULT NULL,
  \`name\` varchar(45) NOT NULL,
  \`config\` json NOT NULL,
  \`page_type\` varchar(45) NOT NULL DEFAULT 'page',
  \`page_config\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`preview_image\` varchar(200) DEFAULT NULL,
  \`favorite\` int NOT NULL DEFAULT '0',
  \`template_config\` json DEFAULT NULL,
  \`template_type\` int NOT NULL DEFAULT '0',
  \`updated_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`page_index\` (\`appName\`,\`tag\`),
  KEY \`app_index\` (\`userID\`,\`appName\`),
  KEY \`index4\` (\`page_type\`),
  KEY \`index5\` (\`favorite\`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
            },
            {
                scheme: config_1.saasConfig.SAAS_NAME,
                table: 'page_config_en',
                sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`userID\` varchar(45) NOT NULL,
  \`appName\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`tag\` varchar(45) NOT NULL,
  \`group\` varchar(45) DEFAULT NULL,
  \`name\` varchar(45) NOT NULL,
  \`config\` json NOT NULL,
  \`page_type\` varchar(45) NOT NULL DEFAULT 'page',
  \`page_config\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`preview_image\` varchar(200) DEFAULT NULL,
  \`favorite\` int NOT NULL DEFAULT '0',
  \`template_config\` json DEFAULT NULL,
  \`template_type\` int NOT NULL DEFAULT '0',
  \`updated_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`page_index\` (\`appName\`,\`tag\`),
  KEY \`app_index\` (\`userID\`,\`appName\`),
  KEY \`index4\` (\`page_type\`),
  KEY \`index5\` (\`favorite\`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
            },
            {
                scheme: config_1.saasConfig.SAAS_NAME,
                table: 'page_config_rcn',
                sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`userID\` varchar(45) NOT NULL,
  \`appName\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`tag\` varchar(45) NOT NULL,
  \`group\` varchar(45) DEFAULT NULL,
  \`name\` varchar(45) NOT NULL,
  \`config\` json NOT NULL,
  \`page_type\` varchar(45) NOT NULL DEFAULT 'page',
  \`page_config\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`preview_image\` varchar(200) DEFAULT NULL,
  \`favorite\` int NOT NULL DEFAULT '0',
  \`template_config\` json DEFAULT NULL,
  \`template_type\` int NOT NULL DEFAULT '0',
  \`updated_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`page_index\` (\`appName\`,\`tag\`),
  KEY \`app_index\` (\`userID\`,\`appName\`),
  KEY \`index4\` (\`page_type\`),
  KEY \`index5\` (\`favorite\`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
            },
            {
                scheme: config_1.saasConfig.SAAS_NAME,
                table: 'app_config',
                sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`domain\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`user\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`appName\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`dead_line\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`config\` json DEFAULT NULL,
  \`brand\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'glitter',
  \`template_config\` json DEFAULT NULL,
  \`template_type\` int NOT NULL DEFAULT '0' COMMENT '0尚未發布，1審核中，2已發布至商城，3已發布至個人模板庫',
  \`sql_pwd\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`sql_admin\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`ec2_id\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`update_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`theme_config\` json DEFAULT NULL,
  \`refer_app\` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`plan\` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`user_app\` (\`user\`,\`appName\`),
  KEY \`find_user\` (\`user\`),
    KEY \`find_plan\` (\`plan\`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`,
            },
            {
                scheme: config_1.saasConfig.SAAS_NAME,
                table: 'app_auth_config',
                sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`user\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`appName\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`config\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`status\` int NOT NULL DEFAULT '0',
  \`invited\` int NOT NULL DEFAULT '0',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`,
            },
            {
                scheme: config_1.saasConfig.SAAS_NAME,
                table: 'private_config',
                sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`app_name\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`key\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`value\` json NOT NULL,
  \`updated_at\` datetime NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`app_name\`,\`key\`),
  KEY \`index3\` (\`key\`)
) ENGINE=InnoDB AUTO_INCREMENT=242 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
            },
            {
                scheme: config_1.saasConfig.SAAS_NAME,
                table: 'official_component',
                sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`key\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`group\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`url\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`userID\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`app_name\` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`index4\` (\`app_name\`),
  KEY \`index2\` (\`key\`),
  KEY \`index3\` (\`group\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
            },
            {
                scheme: config_1.saasConfig.SAAS_NAME,
                table: 't_template_tag',
                sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`type\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`tag\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`bind\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`type\`,\`bind\`,\`tag\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
            },
            {
                scheme: config_1.saasConfig.SAAS_NAME,
                table: 'error_log',
                sql: `(
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`message\` TEXT NULL,
  \`stack\` TEXT NULL,
  \`created_time\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
            },
            {
                scheme: config_1.saasConfig.SAAS_NAME,
                table: 'warning_log',
                sql: `(
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`message\` TEXT NULL,
   \`tag\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`stack\` TEXT NULL,
  \`created_time\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY \`index2\` (\`tag\`),
  PRIMARY KEY (\`id\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
            },
        ];
        const groupSize = 5;
        for (const b of chunkArray(sqlArray, groupSize)) {
            let check = b.length;
            await new Promise(resolve => {
                for (const d of b) {
                    function try_execute() {
                        try {
                            compare_sql_table(d.scheme, d.table, d.sql).then(() => {
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
                }
            });
        }
    },
};
function chunkArray(array, groupSize) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}
async function compare_sql_table(scheme, table, sql) {
    try {
        await database_1.default.query(`CREATE TABLE if not exists \`${scheme}\`.\`${table}\` ${sql}`, []);
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
//# sourceMappingURL=saas-table-check.js.map
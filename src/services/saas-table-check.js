"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaasScheme = void 0;
const database_1 = __importDefault(require("../modules/database"));
const config_1 = require("../config");
exports.SaasScheme = {
    createScheme: async () => {
        const trans = await database_1.default.Transaction.build();
        await trans.execute(`CREATE SCHEMA if not exists \`${config_1.saasConfig.SAAS_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;`, {});
        await trans.execute(`
            CREATE TABLE if not exists \`${config_1.saasConfig.SAAS_NAME}\`.\`user\`
            (
                \`id\`
                int
                NOT
                NULL
                AUTO_INCREMENT,
                \`userID\`
                int
                NOT
                NULL,
                \`account\`
                varchar
            (
                200
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                \`pwd\` varchar
            (
                200
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                \`userData\` json DEFAULT NULL,
                \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY
            (
                \`id\`,
                \`userID\`,
                \`account\`
            ),
                UNIQUE KEY \`account_UNIQUE\`
            (
                \`account\`
            ),
                UNIQUE KEY \`userID_UNIQUE\`
            (
                \`userID\`
            )
                ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE =utf8mb4_unicode_ci
        `, {});
        await trans.execute(`
            CREATE TABLE if not exists \`${config_1.saasConfig.SAAS_NAME}\`.\`page_config\`
            (
                \`id\`
                int
                NOT
                NULL
                AUTO_INCREMENT,
                \`userID\`
                varchar
            (
                45
            ) NOT NULL,
                \`appName\` varchar
            (
                45
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                \`tag\` varchar
            (
                45
            ) NOT NULL,
                \`group\` varchar
            (
                45
            ) DEFAULT NULL,
                \`name\` varchar
            (
                45
            ) NOT NULL,
                \`config\` json NOT NULL,
                \`page_config\` json DEFAULT NULL,
                PRIMARY KEY
            (
                \`id\`
            ),
                UNIQUE KEY \`page_index\`
            (
                \`appName\`,
                \`tag\`
            ),
                KEY \`app_index\`
            (
                \`userID\`,
                \`appName\`
            )
                ) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE =utf8mb4_0900_ai_ci
        `, {});
        await trans.execute(`CREATE TABLE if not exists \`${config_1.saasConfig.SAAS_NAME}\`.\`app_config\`
        (
            \`id\`
            int
            NOT
            NULL
            AUTO_INCREMENT,
            \`domain\`
            varchar
                             (
            200
                             ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            \`user\` varchar
                             (
                                 45
                             ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            \`appName\` varchar
                             (
                                 45
                             ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`dead_line\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`config\` json DEFAULT NULL,
            PRIMARY KEY
                             (
                                 \`id\`,
                                 \`domain\`
                             ),
            UNIQUE KEY \`user_app\`
                             (
                                 \`user\`,
                                 \`appName\`
                             ),
            UNIQUE KEY \`domain_UNIQUE\`
                             (
                                 \`domain\`
                             ),
            KEY \`find_user\`
                             (
                                 \`user\`
                             )
            ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE =utf8mb4_unicode_ci`, {});
        await trans.execute(`CREATE TABLE if not exists \`${config_1.saasConfig.SAAS_NAME}\`.\`private_config\`
        (
            \`id\`
            int
            NOT
            NULL
            AUTO_INCREMENT,
            \`app_name\`
            varchar
                             (
            45
                             ) COLLATE utf8mb4_unicode_ci NOT NULL,
            \`key\` varchar
                             (
                                 100
                             ) COLLATE utf8mb4_unicode_ci NOT NULL,
            \`value\` json NOT NULL,
            \`updated_at\` datetime NOT NULL,
            PRIMARY KEY
                             (
                                 \`id\`
                             ),
            UNIQUE KEY \`index2\`
                             (
                                 \`app_name\`,
                                 \`key\`
                             ),
            KEY \`index3\`
                             (
                                 \`key\`
                             )
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE =utf8mb4_unicode_ci
`, {});
        await trans.commit();
    }
};

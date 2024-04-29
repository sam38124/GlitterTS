import db from '../../modules/database';
import {saasConfig} from "../../config.js";
import {compare_sql_table} from "../../services/saas-table-check.js";
import tool from "../../services/tool.js";


export class ApiPublic {
    public static checkApp: string[] = []

    public static async createScheme(appName: string) {
        if (ApiPublic.checkApp.indexOf(appName) !== -1) {
            return
        }

        ApiPublic.checkApp.push(appName)
        try {
            await db.execute(`CREATE SCHEMA if not exists \`${appName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`, [])
            await db.execute(`CREATE SCHEMA if not exists \`${appName}_recover\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`, [])
            const groupSize = 15;
            const sqlArray: { scheme?: string; table: string; sql: string }[] = [
                {
                    scheme: appName,
                    table: 't_chat_detail',
                    sql: ` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`chat_id\` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`user_id\` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`message\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`index2\` (\`chat_id\`),
  KEY \`index3\` (\`user_id\`),
  KEY \`index4\` (\`created_time\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
                },
                {
                  scheme:appName,
                  table:`t_domain_setting`,
                  sql:`(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`domain\` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`port\` int NOT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`domain_UNIQUE\` (\`domain\`),
  UNIQUE KEY \`port_UNIQUE\` (\`port\`)
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
                    table: 't_user_public_config',
                    sql: ` (
                    \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
                \`key\` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                \`value\` json NOT NULL,
                \`updated_at\` datetime NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`index2\` (\`user_id\`,\`key\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
                },
                {
                    scheme: appName,
                    table: 't_chat_list',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`chat_id\` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`type\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  \`info\` json DEFAULT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`chat_id\`),
  KEY \`index3\` (\`type\`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
                },
                {
                    scheme: appName,
                    table: 't_chat_participants',
                    sql: ` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`chat_id\` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`user_id\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`chat_id\`,\`user_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
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
                }
                , {
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
  PRIMARY KEY (\`id\`,\`userID\`,\`account\`),
  UNIQUE KEY \`account_UNIQUE\` (\`account\`),
  UNIQUE KEY \`userID_UNIQUE\` (\`userID\`),
  KEY \`index5\` (\`company\`),
  KEY \`index6\` (\`role\`),
  KEY \`index4\` (\`status\`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci `
                },
                {
                    scheme: appName,
                    table: 't_subscribe',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`email\` varchar(105) COLLATE utf8mb4_general_ci NOT NULL,
  \`tag\` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`email\`,\`tag\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci         `
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
  `
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
                },
                {
                    scheme: appName,
                    table: 't_rebate',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
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
  INDEX \`index2\` (\`userID\` ASC) VISIBLE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
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
`
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
`
                },
                {
                    scheme: appName,
                    table: 't_chat_last_read',
                    sql: `(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`user_id\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`chat_id\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`last_read\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`user_id\`,\`chat_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`
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
`
                }
            ];
            for (const b of chunkArray(sqlArray, groupSize)) {
                let check = b.length;
                await new Promise((resolve) => {
                    for (const d of b) {
                        compare_sql_table(d.scheme, d.table, d.sql).then(() => {
                            check--;
                            if (check === 0) {
                                resolve(true);
                            }
                        });
                    }
                });
            }
        } catch (e) {
            console.log(e)
            ApiPublic.checkApp = ApiPublic.checkApp.filter((dd) => {
                return dd === appName
            })
        }
    }

    public static async checkSQLAdmin(appName:string){
        const sql_info = (await db.query(`select sql_pwd,sql_admin
                                               from \`${saasConfig.SAAS_NAME}\`.app_config
                                               where appName = ${db.escape(appName)}`, []))[0]
        if (!sql_info.sql_admin || !sql_info.sql_pwd) {
            try {
                sql_info.sql_admin=tool.randomString(6)
                sql_info.sql_pwd=tool.randomString(12)
                const trans = await db.Transaction.build();
                await trans.execute(`CREATE USER '${sql_info.sql_admin}'@'%' IDENTIFIED BY '${sql_info.sql_pwd}';`,[])
                await trans.execute(`update \`${saasConfig.SAAS_NAME}\`.app_config set sql_admin=? , sql_pwd=? where appName = ${db.escape(appName)}`,[
                    sql_info.sql_admin,
                    sql_info.sql_pwd
                ])
                await trans.execute(`GRANT ALL PRIVILEGES ON \`${appName}\`.* TO '${sql_info.sql_admin}'@'*';`,[]);
                await trans.commit()
                await trans.release()
            }catch (e) {

            }
        }
    }
}

function chunkArray(array: any, groupSize: number) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}

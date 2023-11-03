import db from '../modules/database';
import {saasConfig} from "../config";


export const SaasScheme = {
    createScheme: async () => {
        const sql = String.raw
        await db.execute(`CREATE SCHEMA if not exists \`${saasConfig.SAAS_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;`, [])
        const sqlArray: { scheme?: string; table: string; sql: string }[]=[
            {
                scheme:saasConfig.SAAS_NAME as string,
                table:'user',
                sql:`(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`userID\` int NOT NULL,
  \`account\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`role\` int NOT NULL DEFAULT '0' COMMENT '角色權限定義',
  \`company\` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`pwd\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`userData\` json DEFAULT NULL,
    \`status\` int NOT NULL DEFAULT '1',
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`editor_token\` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (\`id\`,\`userID\`),
  UNIQUE KEY \`userID_UNIQUE\` (\`userID\`),
  UNIQUE KEY \`account_UNIQUE\` (\`account\`),
  KEY \`index4\` (\`company\`),
  KEY \`index5\` (\`role\`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
            },
            {
                scheme:saasConfig.SAAS_NAME as string,
                table:'page_config',
                sql:`(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`userID\` varchar(45) NOT NULL,
  \`appName\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`tag\` varchar(45) NOT NULL,
  \`group\` varchar(45) DEFAULT NULL,
  \`name\` varchar(45) NOT NULL,
  \`config\` json NOT NULL,
  \`page_config\` json DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`page_index\` (\`appName\`,\`tag\`),
  KEY \`app_index\` (\`userID\`,\`appName\`)
) ENGINE=InnoDB AUTO_INCREMENT=1072 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`
            },
            {
                scheme:saasConfig.SAAS_NAME as string,
                table:'app_config',
                sql:`(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`domain\` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`user\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`appName\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`created_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`dead_line\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`config\` json DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`user_app\` (\`user\`,\`appName\`),
  KEY \`find_user\` (\`user\`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
            },
            {
                scheme:saasConfig.SAAS_NAME as string,
                table:'private_config',
                sql:`(
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`app_name\` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`key\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`value\` json NOT NULL,
  \`updated_at\` datetime NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`index2\` (\`app_name\`,\`key\`),
  KEY \`index3\` (\`key\`)
) ENGINE=InnoDB AUTO_INCREMENT=242 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
            },
            {
                scheme:saasConfig.SAAS_NAME as string,
                table:'official_component',
                sql:`(
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
            }
        ];
        const groupSize = 15;
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
    }
}
function chunkArray(array: any, groupSize: number) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}

export async function compare_sql_table(scheme: string, table: string, sql: string) {
    const tempKey = 'tempcompare' + table;
    const transaction = await db.Transaction.build();
    await db.execute(`DROP TABLE if exists \`${scheme}\`.\`${tempKey}\`;`, []);
    await db.execute(`CREATE TABLE if not exists \`${scheme}\`.\`${table}\` ${sql}`, []);
    await db.execute(`CREATE TABLE if not exists \`${scheme}\`.\`${tempKey}\` ${sql}`, []);
    const compareStruct = `SELECT COLUMN_NAME,
                                  DATA_TYPE,
                                  CHARACTER_MAXIMUM_LENGTH
                           FROM INFORMATION_SCHEMA.COLUMNS
                           WHERE TABLE_NAME = ?
                             AND TABLE_SCHEMA = ?`;
    const compareStruct2 = `SELECT INDEX_NAME,
                                   COLUMN_NAME
                            FROM INFORMATION_SCHEMA.STATISTICS
                            WHERE TABLE_NAME = ?
                              AND TABLE_SCHEMA = ?;    `;
    let older = await db.query(compareStruct, [table, scheme]);
    const newest = await db.query(compareStruct, [tempKey, scheme]);
    const older2 = await db.query(compareStruct2, [table, scheme]);
    const newest2 = await db.query(compareStruct2, [tempKey, scheme]);
    if (!(JSON.stringify(older) == JSON.stringify(newest)) || !(JSON.stringify(older2) == JSON.stringify(newest2))) {
        console.log(
            `compare:${scheme}-table:${table}-sql:CREATE TABLE if not exists \`${scheme}\`.\`${table}\` ${sql}`
        );
        older = older.filter((dd: any) => {
            return newest.find((d2: any) => {
                return dd.COLUMN_NAME === d2.COLUMN_NAME;
            });
        });
        await transaction.execute(
            `INSERT INTO \`${scheme}\`.\`${tempKey}\` (${older
                .map((dd: any) => {
                    return `\`${dd.COLUMN_NAME}\``;
                })
                .join(',')})
                                   SELECT ${older
                .map((dd: any) => {
                    return `\`${dd.COLUMN_NAME}\``;
                })
                .join(',')}
                                   FROM \`${scheme}\`.\`${table}\`
        `,
            []
        );
        await transaction.execute(`DROP TABLE \`${scheme}\`.\`${table}\`;`, []);
        await transaction.execute(`ALTER TABLE \`${scheme}\`.${tempKey} RENAME TO \`${scheme}\`.\`${table}\`;`, []);
    }
    await transaction.execute(`DROP TABLE if exists \`${scheme}\`.\`${tempKey}\`;`, []);
    await transaction.commit();
    await transaction.release();
}


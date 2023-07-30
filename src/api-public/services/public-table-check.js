"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPublic = void 0;
const database_1 = __importDefault(require("../../modules/database"));
class ApiPublic {
    static async createScheme(appName) {
        if (ApiPublic.checkApp.indexOf(appName) !== -1) {
            return;
        }
        const trans = await database_1.default.Transaction.build();
        await trans.execute(`CREATE SCHEMA if not exists \`${appName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`, {});
        await trans.execute(`
            CREATE TABLE if not exists \`${appName}\`.\`user\`
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
                \`status\` int NOT NULL DEFAULT '0',
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
            ),
                KEY \`index4\`
            (
                \`status\`
            )
                ) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE =utf8mb4_unicode_ci
        `, {});
        await trans.execute(`
            CREATE TABLE if not exists \`${appName}\`.\`t_post\`
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
                \`content\`
                json
                DEFAULT
                NULL,
                \`created_time\`
                datetime
                NOT
                NULL
                DEFAULT
                CURRENT_TIMESTAMP,
                \`updated_time\`
                datetime
                NOT
                NULL
                DEFAULT
                CURRENT_TIMESTAMP,
                PRIMARY
                KEY
            (
                \`id\`
            ),
                KEY \`index2\`
            (
                \`userID\`
            )
                ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE =utf8mb4_unicode_ci
        `, {});
        await trans.execute(`CREATE TABLE if not exists  \`${appName}\`.\`t_chat_list\`  (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`chat_id\` VARCHAR(120) NOT NULL,
  \`participant\` JSON NULL,
  \`info\` JSON NULL,
  \`created_time\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE INDEX \`index2\` (\`chat_id\` ASC) VISIBLE);`, {});
        await trans.execute(`CREATE TABLE if not exists \`${appName}\`.\`t_chat_detail\`   (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`chat_id\` VARCHAR(120) NOT NULL,
  \`user\` VARCHAR(45) NOT NULL,
  \`message\` JSON NULL,
  \`created_time\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`index2\` (\`chat_id\` ASC) VISIBLE,
  INDEX \`index3\` (\`user\` ASC) VISIBLE,
  INDEX \`index4\` (\`created_time\` ASC) VISIBLE);`, {});
        await trans.commit();
        ApiPublic.checkApp.push(appName);
    }
}
exports.ApiPublic = ApiPublic;
ApiPublic.checkApp = [];
//# sourceMappingURL=public-table-check.js.map
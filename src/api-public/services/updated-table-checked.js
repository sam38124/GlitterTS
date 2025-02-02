"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatedTableChecked = void 0;
const database_1 = __importDefault(require("../../modules/database"));
class UpdatedTableChecked {
    static async startCheck(app_name) {
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_check_in_pos',
            last_version: '',
            new_version: 'V1.1',
            event: `ALTER TABLE \`${app_name}\`.t_check_in_pos
                ADD COLUMN \`store\` VARCHAR(45) NOT NULL DEFAULT '' AFTER \`execute\`,
ADD INDEX \`index5\` (\`store\` ASC) VISIBLE;`
        });
    }
    static async update(obj) {
        var _a;
        const data_ = await database_1.default.query(`SELECT TABLE_NAME, TABLE_COMMENT
                                      FROM information_schema.tables
                                      WHERE TABLE_SCHEMA = ?
                                        AND TABLE_NAME = ?;`, [obj.app_name, obj.table_name]);
        if (((_a = data_[0]['TABLE_COMMENT']) !== null && _a !== void 0 ? _a : '') === obj.last_version) {
            console.log(`資料庫更新:${obj.last_version}-to-${obj.new_version}`);
            await database_1.default.query(`
                ${obj.event}
                ALTER TABLE \`${obj.app_name}\`.\`${obj.table_name}\` COMMENT = '${obj.new_version}';`, []);
        }
    }
}
exports.UpdatedTableChecked = UpdatedTableChecked;
//# sourceMappingURL=updated-table-checked.js.map
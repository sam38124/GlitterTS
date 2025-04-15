"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatedTableChecked = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const checkout_js_1 = require("./checkout.js");
const user_update_js_1 = require("./user-update.js");
class UpdatedTableChecked {
    static async startCheck(app_name) {
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_check_in_pos',
            last_version: [''],
            new_version: 'V1.1',
            event: `
        ALTER TABLE \`${app_name}\`.t_check_in_pos
        ADD COLUMN \`store\` VARCHAR(45) NOT NULL DEFAULT '' AFTER \`execute\`,
        ADD INDEX \`index5\` (\`store\` ASC) VISIBLE;
      `,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_checkout',
            last_version: [''],
            new_version: 'V1.1',
            event: `ALTER TABLE \`${app_name}\`.\`t_checkout\`   ` +
                'ADD COLUMN `total` INT NOT NULL DEFAULT 0 AFTER `created_time`,\n' +
                'ADD COLUMN `order_status` VARCHAR(45) NULL DEFAULT NULL AFTER `total`,\n' +
                'ADD COLUMN `payment_method` VARCHAR(45) NULL DEFAULT NULL AFTER `order_status`,\n' +
                'ADD COLUMN `shipment_method` VARCHAR(45) NULL DEFAULT NULL AFTER `payment_method`,\n' +
                'ADD COLUMN `shipment_date` DATETIME NULL DEFAULT NULL AFTER `shipment_method`,\n' +
                'ADD COLUMN `progress` VARCHAR(45) NULL DEFAULT NULL AFTER `shipment_date`,\n' +
                'ADD INDEX `index5` (`total` ASC) VISIBLE,\n' +
                'ADD INDEX `index6` (`order_status` ASC) VISIBLE,\n' +
                'ADD INDEX `index7` (`payment_method` ASC) VISIBLE,\n' +
                'ADD INDEX `index8` (`shipment_method` ASC) VISIBLE,\n' +
                'ADD INDEX `index9` (`shipment_date` ASC) VISIBLE,\n' +
                'ADD INDEX `index10` (`progress` ASC) VISIBLE;\n' +
                ';\n',
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_checkout',
            last_version: ['V1.1', 'V1.2', 'V1.3'],
            new_version: 'V1.4',
            event: `
        ALTER TABLE \`${app_name}\`.\`t_checkout\`
        ADD COLUMN \`shipment_number\` VARCHAR(45) NULL AFTER \`progress\`,
        ADD INDEX \`index11\` (\`shipment_number\` ASC) VISIBLE;
      `,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_live_purchase_interactions',
            last_version: [''],
            new_version: 'V1.0',
            event: `
        ALTER TABLE \`${app_name}\`.\`t_live_purchase_interactions\`
        CHANGE COLUMN \`stream_name\` \`name\` VARCHAR (200) NOT NULL;
      `,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_live_purchase_interactions',
            last_version: [''],
            new_version: 'V1.0',
            event: `
        ALTER TABLE \`${app_name}\`.\`t_live_purchase_interactions\`
        CHANGE COLUMN \`stream_name\` \`name\` VARCHAR (200) NOT NULL;
      `,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_live_purchase_interactions',
            last_version: ['V1.0'],
            new_version: 'V1.1',
            event: `
        ALTER TABLE \`${app_name}\`.\`t_live_purchase_interactions\`
        DROP COLUMN \`streamer\`,
        DROP INDEX \`index3\`;
      `,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_checkout',
            last_version: ['V1.5', 'V1.4'],
            new_version: 'V1.6',
            event: `
        ALTER TABLE \`${app_name}\`.\`t_checkout\`
        ADD COLUMN \`total_received\` INT NULL DEFAULT NULL AFTER \`shipment_number\`,
        ADD COLUMN \`offset_amount\` INT NULL DEFAULT NULL AFTER \`total_received\`,
        ADD COLUMN \`offset_reason\` VARCHAR(45) NULL DEFAULT NULL AFTER \`offset_amount\`,
        ADD COLUMN \`offset_records\` JSON NULL AFTER \`offset_reason\`,
        ADD INDEX \`index12\` (\`total_received\` ASC) VISIBLE,
        ADD INDEX \`index13\` (\`offset_amount\` ASC) VISIBLE,
        ADD INDEX \`index14\` (\`offset_reason\` ASC) VISIBLE;
      `,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_checkout',
            last_version: ['V1.6'],
            new_version: 'V1.7',
            event: `
        ALTER TABLE \`${app_name}\`.\`t_checkout\`
        ADD COLUMN \`reconciliation_date\` DATETIME NULL DEFAULT NULL AFTER \`offset_records\`,
        ADD INDEX \`index15\` (\`reconciliation_date\` ASC) VISIBLE;
      `,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_user',
            last_version: [''],
            new_version: 'V1.0',
            event: `
        ALTER TABLE \`${app_name}\`.\`t_user\`
        ADD COLUMN \`member_level\` VARCHAR(45) NOT NULL AFTER \`static_info\`,
        ADD INDEX \`index7\` (\`member_level\` ASC) VISIBLE;
      `,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_user',
            last_version: ['V1.0'],
            new_version: 'V1.1',
            event: () => {
                return new Promise(async (resolve) => {
                    for (const b of await database_1.default.query(`select * from \`${app_name}\`.t_user`, [])) {
                        await user_update_js_1.UserUpdate.update(app_name, b.userID);
                    }
                    resolve(true);
                });
            },
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_user',
            last_version: ['V1.1'],
            new_version: 'V1.2',
            event: `
        ALTER TABLE \`${app_name}\`.\`t_user\`
        CHANGE COLUMN \`member_level\` \`member_level\` VARCHAR (45) NULL DEFAULT NULL;
      `,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_checkout',
            last_version: ['V1.7'],
            new_version: 'V1.8',
            event: `
        ALTER TABLE \`${app_name}\`.\`t_checkout\`
        ADD COLUMN \`order_source\` VARCHAR(45) NULL DEFAULT NULL AFTER \`reconciliation_date\`,
        ADD COLUMN \`archived\` VARCHAR(45) NULL DEFAULT NULL AFTER \`order_source\`,
        ADD COLUMN \`customer_name\` VARCHAR(45) NULL AFTER \`archived\`,
        ADD COLUMN \`shipment_name\` VARCHAR(45) NULL AFTER \`customer_name\`,
        ADD COLUMN \`customer_email\` VARCHAR(45) NULL AFTER \`shipment_name\`,
        ADD COLUMN \`shipment_email\` VARCHAR(45) NULL AFTER \`customer_email\`,
        ADD COLUMN \`customer_phone\` VARCHAR(45) NULL AFTER \`shipment_email\`,
        ADD COLUMN \`shipment_phone\` VARCHAR(45) NULL AFTER \`customer_phone\`,
        ADD COLUMN \`shipment_address\` VARCHAR(200) NULL AFTER \`shipment_phone\`,
        ADD INDEX \`index16\` (\`order_source\` ASC) VISIBLE,
        ADD INDEX \`index17\` (\`customer_name\` ASC) VISIBLE,
        ADD INDEX \`index18\` (\`order_source\` ASC) VISIBLE,
        ADD INDEX \`index19\` (\`shipment_name\` ASC) VISIBLE,
        ADD INDEX \`index20\` (\`customer_email\` ASC) VISIBLE,
        ADD INDEX \`index21\` (\`shipment_email\` ASC) VISIBLE,
        ADD INDEX \`index22\` (\`customer_phone\` ASC) VISIBLE,
        ADD INDEX \`index23\` (\`shipment_phone\` ASC) VISIBLE,
        ADD INDEX \`index24\` (\`shipment_address\` ASC) VISIBLE;
      `,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_checkout',
            last_version: ['V1.8', 'V1.9'],
            new_version: 'V2.0',
            event: () => {
                return new Promise(async (resolve) => {
                    for (const b of await database_1.default.query(`select * from \`${app_name}\`.t_checkout`, [])) {
                        await checkout_js_1.CheckoutService.updateAndMigrateToTableColumn({
                            id: b.id,
                            orderData: b.orderData,
                            app_name: app_name,
                        });
                    }
                    resolve(true);
                });
            },
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_products_sold_history',
            last_version: ['V1.0', ''],
            new_version: 'V1.1',
            event: `
        ALTER TABLE \`${app_name}\`.\`t_products_sold_history\`
        CHANGE COLUMN \`count\` \`count\` FLOAT NOT NULL;
      `,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_user',
            last_version: ['V1.2'],
            new_version: 'V1.3',
            event: `ALTER TABLE \`${app_name}\`.\`t_user\`
      ADD COLUMN \`email\` VARCHAR(50) NULL AFTER \`member_level\`,
      ADD COLUMN \`phone\` VARCHAR(50) NULL AFTER \`email\`,
      ADD INDEX \`index8\` (\`email\` ASC) VISIBLE,
      ADD INDEX \`index9\` (\`phone\` ASC) VISIBLE;
      ;`,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_user',
            last_version: ['V1.3'],
            new_version: 'V1.4',
            event: `UPDATE \`${app_name}\`.t_user
    SET
    phone = JSON_UNQUOTE(JSON_EXTRACT(userData, '$.phone')),
      email = JSON_UNQUOTE(JSON_EXTRACT(userData, '$.email'))  where id>0`,
        });
    }
    static async update(obj) {
        var _a;
        const data_ = await database_1.default.query(`SELECT TABLE_NAME, TABLE_COMMENT
       FROM information_schema.tables
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?;`, [obj.app_name, obj.table_name]);
        if (obj.last_version.includes((_a = data_[0]['TABLE_COMMENT']) !== null && _a !== void 0 ? _a : '')) {
            console.log(`資料庫更新開始: ${obj.app_name}-${obj.last_version}-to-${obj.new_version}`);
            if (typeof obj.event === 'string') {
                await database_1.default.query(`${obj.event}`, []);
            }
            else {
                while (!(await obj.event())) { }
            }
            await database_1.default.query(`ALTER TABLE \`${obj.app_name}\`.\`${obj.table_name}\` COMMENT = '${obj.new_version}';`, []);
            console.log(`資料庫更新結束: ${obj.app_name}-${obj.last_version}-to-${obj.new_version}`);
        }
    }
}
exports.UpdatedTableChecked = UpdatedTableChecked;
//# sourceMappingURL=updated-table-checked.js.map
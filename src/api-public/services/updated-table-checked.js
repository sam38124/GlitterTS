"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatedTableChecked = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const checkout_js_1 = require("./checkout.js");
class UpdatedTableChecked {
    static async startCheck(app_name) {
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_check_in_pos',
            last_version: [''],
            new_version: 'V1.1',
            event: `ALTER TABLE \`${app_name}\`.t_check_in_pos
          ADD COLUMN \`store\` VARCHAR(45) NOT NULL DEFAULT '' AFTER \`execute\`,
ADD INDEX \`index5\` (\`store\` ASC) VISIBLE;`,
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
            last_version: ['V1.1', 'V1.2'],
            new_version: 'V1.3',
            event: () => {
                return new Promise(async (resolve, reject) => {
                    for (const b of (await database_1.default.query(`select *
                                           from \`${app_name}\`.t_checkout`, []))) {
                        await checkout_js_1.CheckoutService.updateAndMigrateToTableColumn({
                            id: b.id,
                            orderData: b.orderData,
                            app_name: app_name,
                            no_shipment_number: true,
                        });
                    }
                    resolve(true);
                });
            },
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_checkout',
            last_version: ['V1.3'],
            new_version: 'V1.4',
            event: `ALTER TABLE \`${app_name}\`.\`t_checkout\`
          ADD COLUMN \`shipment_number\` VARCHAR(45) NULL AFTER \`progress\`,
ADD INDEX \`index11\` (\`shipment_number\` ASC) VISIBLE;`,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_checkout',
            last_version: ['V1.4'],
            new_version: 'V1.5',
            event: () => {
                return new Promise(async (resolve, reject) => {
                    for (const b of (await database_1.default.query(`select *
                                           from \`${app_name}\`.t_checkout`, []))) {
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
            table_name: 't_live_purchase_interactions',
            last_version: [''],
            new_version: 'V1.0',
            event: `ALTER TABLE \`${app_name}\`.\`t_live_purchase_interactions\`
          CHANGE COLUMN \`stream_name\` \`name\` VARCHAR (200) NOT NULL;`,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_live_purchase_interactions',
            last_version: ['V1.0'],
            new_version: 'V1.1',
            event: `ALTER TABLE \`${app_name}\`.\`t_live_purchase_interactions\`
      DROP
      COLUMN \`streamer\`,
      DROP INDEX \`index3\`;
      ;`,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_checkout',
            last_version: ['V1.5'],
            new_version: 'V1.6',
            event: `ALTER TABLE \`${app_name}\`.\`t_checkout\`
          ADD COLUMN \`total_received\` INT NULL DEFAULT NULL AFTER \`shipment_number\`,
ADD COLUMN \`offset_amount\` INT NULL DEFAULT NULL AFTER \`total_received\`,
ADD COLUMN \`offset_reason\` VARCHAR(45) NULL DEFAULT NULL AFTER \`offset_amount\`,
ADD COLUMN \`offset_records\` JSON NULL AFTER \`offset_reason\`,
ADD INDEX \`index12\` (\`total_received\` ASC) VISIBLE,
ADD INDEX \`index13\` (\`offset_amount\` ASC) VISIBLE,
ADD INDEX \`index14\` (\`offset_reason\` ASC) VISIBLE;
      ;
      `,
        });
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_products_sold_history',
            last_version: [''],
            new_version: 'V1.0',
            event: () => {
                return new Promise(async (resolve, reject) => {
                    for (const b of (await database_1.default.query(`select *
                                           from \`${app_name}\`.t_checkout`, []))) {
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
    }
    static async update(obj) {
        var _a;
        const data_ = await database_1.default.query(`SELECT TABLE_NAME, TABLE_COMMENT
                                  FROM information_schema.tables
                                  WHERE TABLE_SCHEMA = ?
                                    AND TABLE_NAME = ?;`, [obj.app_name, obj.table_name]);
        if (obj.last_version.includes((_a = data_[0]['TABLE_COMMENT']) !== null && _a !== void 0 ? _a : '')) {
            console.log(`資料庫更新開始:${obj.app_name}-${obj.last_version}-to-${obj.new_version}`);
            if (typeof obj.event === 'string') {
                await database_1.default.query(`
                ${obj.event}
               `, []);
            }
            else {
                while (!(await obj.event())) {
                }
            }
            await database_1.default.query(`ALTER TABLE \`${obj.app_name}\`.\`${obj.table_name}\` COMMENT = '${obj.new_version}';`, []);
            console.log(`資料庫更新結束:${obj.app_name}-${obj.last_version}-to-${obj.new_version}`);
        }
    }
}
exports.UpdatedTableChecked = UpdatedTableChecked;
//# sourceMappingURL=updated-table-checked.js.map
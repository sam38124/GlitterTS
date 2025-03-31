import db from '../../modules/database';
import { CheckoutService } from './checkout.js';
import { ProductMigrate } from './product-migrate.js';
import { User } from '../../api-public/services/user';
import { UserUpdate } from './user-update.js';

export class UpdatedTableChecked {
  public static async startCheck(app_name: string) {
    //員工上下班打卡1.1版本，新增門市欄位
    await UpdatedTableChecked.update({
      app_name: app_name,
      table_name: 't_check_in_pos',
      last_version: [''],
      new_version: 'V1.1',
      event: `ALTER TABLE \`${app_name}\`.t_check_in_pos
          ADD COLUMN \`store\` VARCHAR(45) NOT NULL DEFAULT '' AFTER \`execute\`,
ADD INDEX \`index5\` (\`store\` ASC) VISIBLE;`,
    });
    //購物車''->1.1版本，先更新資料表欄位
    await UpdatedTableChecked.update({
      app_name: app_name,
      table_name: 't_checkout',
      last_version: [''],
      new_version: 'V1.1',
      event:
        `ALTER TABLE \`${app_name}\`.\`t_checkout\`   ` +
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
    //購物車1.3->1.4版本，新增ShipmentNumber欄位，加快索引查詢速度。
    await UpdatedTableChecked.update({
      app_name: app_name,
      table_name: 't_checkout',
      last_version: ['V1.1', 'V1.2','V1.3'],
      new_version: 'V1.4',
      event: `ALTER TABLE \`${app_name}\`.\`t_checkout\`
          ADD COLUMN \`shipment_number\` VARCHAR(45) NULL AFTER \`progress\`,
ADD INDEX \`index11\` (\`shipment_number\` ASC) VISIBLE;`,
    });
    //LINE資料表更新
    await UpdatedTableChecked.update({
      app_name: app_name,
      table_name: 't_live_purchase_interactions',
      last_version: [''],
      new_version: 'V1.0',
      event: `ALTER TABLE \`${app_name}\`.\`t_live_purchase_interactions\`
          CHANGE COLUMN \`stream_name\` \`name\` VARCHAR (200) NOT NULL;`,
    });
      //LINE資料表更新
      await UpdatedTableChecked.update({
        app_name: app_name,
        table_name: 't_live_purchase_interactions',
        last_version: [''],
        new_version: 'V1.0',
        event: `ALTER TABLE \`${app_name}\`.\`t_live_purchase_interactions\`
            CHANGE COLUMN \`stream_name\` \`name\` VARCHAR (200) NOT NULL;`,
      });
    //LINE資料表更新
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
    //購物車1.5->1.6版本，新增沖賬紀錄
    await UpdatedTableChecked.update({
      app_name: app_name,
      table_name: 't_checkout',
      last_version: ['V1.5','V1.4'],
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
    //購物車1.6->1.7版本，新增沖賬時間
    await UpdatedTableChecked.update({
      app_name: app_name,
      table_name: 't_checkout',
      last_version: ['V1.6'],
      new_version: 'V1.7',
      event: `ALTER TABLE \`${app_name}\`.\`t_checkout\`
          ADD COLUMN \`reconciliation_date\` DATETIME NULL DEFAULT NULL AFTER \`offset_records\`,
ADD INDEX \`index15\` (\`reconciliation_date\` ASC) VISIBLE;
      ;
      `,
    });
    //會員表新增會員等級欄位
    await UpdatedTableChecked.update({
      app_name: app_name,
      table_name: 't_user',
      last_version: [''],
      new_version: 'V1.0',
      event: `ALTER TABLE \`${app_name}\`.\`t_user\`
          ADD COLUMN \`member_level\` VARCHAR(45) NOT NULL AFTER \`static_info\`,
ADD INDEX \`index7\` (\`member_level\` ASC) VISIBLE;
      `,
    });
    //會員表插入member_level資料
    await UpdatedTableChecked.update({
      app_name: app_name,
      table_name: 't_user',
      last_version: ['V1.0'],
      new_version: 'V1.1',
      event: () => {
        return new Promise(async (resolve, reject) => {
          for (const b of await db.query(
            `select * from \`${app_name}\`.t_user`,
            []
          )){
            await UserUpdate.update(app_name,b.userID)
          }
          resolve(true);
        });
      },
    });
    //會員表插入member_level資料
    await UpdatedTableChecked.update({
      app_name: app_name,
      table_name: 't_user',
      last_version: ['V1.1'],
      new_version: 'V1.2',
      event: `ALTER TABLE \`${app_name}\`.\`t_user\`
          CHANGE COLUMN \`member_level\` \`member_level\` VARCHAR (45) NULL DEFAULT NULL;`,
    });
    //購物車1.7->1.8版本，新增訂單類型，
    await UpdatedTableChecked.update({
      app_name: app_name,
      table_name: 't_checkout',
      last_version: ['V1.7'],
      new_version: 'V1.8',
      event: `ALTER TABLE \`${app_name}\`.\`t_checkout\`
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
      ;
      `,
    });
    //重新migrate過訂單
    await UpdatedTableChecked.update({
      app_name: app_name,
      table_name: 't_checkout',
      last_version: ['V1.8','V1.9'],
      new_version: 'V2.0',
      event: () => {
        return new Promise(async (resolve, reject) => {
          for (const b of await db.query(
            `select *
             from \`${app_name}\`.t_checkout`,
            []
          )) {
            await CheckoutService.updateAndMigrateToTableColumn({
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

  public static async update(obj: {
    app_name: string;
    table_name: string;
    last_version: string[];
    new_version: string;
    event: string | (() => Promise<any>);
  }) {
    const data_ = await db.query(
      `SELECT TABLE_NAME, TABLE_COMMENT
       FROM information_schema.tables
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME = ?;`,
      [obj.app_name, obj.table_name]
    );
    //判斷是需要更新的版本
    if (obj.last_version.includes(data_[0]['TABLE_COMMENT'] ?? '')) {
      console.log(`資料庫更新開始:${obj.app_name}-${obj.last_version}-to-${obj.new_version}`);
      if (typeof obj.event === 'string') {
        await db.query(
          `
                ${obj.event}
               `,
          []
        );
      } else {
        while (!(await obj.event())) {}
      }
      await db.query(`ALTER TABLE \`${obj.app_name}\`.\`${obj.table_name}\` COMMENT = '${obj.new_version}';`, []);
      console.log(`資料庫更新結束:${obj.app_name}-${obj.last_version}-to-${obj.new_version}`);
    }
  }
}

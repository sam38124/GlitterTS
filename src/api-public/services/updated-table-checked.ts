import db from '../../modules/database';
import { CheckoutService } from './checkout.js';
import { ProductMigrate } from './product-migrate.js';

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
ADD INDEX \`index5\` (\`store\` ASC) VISIBLE;`
        })
        //購物車''->1.1版本，先更新資料表欄位
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_checkout',
            last_version: [''],
            new_version: 'V1.1',
            event: `ALTER TABLE \`${app_name}\`.\`t_checkout\` \n` +
              "ADD COLUMN `total` INT NOT NULL DEFAULT 0 AFTER `created_time`,\n" +
              "ADD COLUMN `order_status` VARCHAR(45) NULL DEFAULT NULL AFTER `total`,\n" +
              "ADD COLUMN `payment_method` VARCHAR(45) NULL DEFAULT NULL AFTER `order_status`,\n" +
              "ADD COLUMN `shipment_method` VARCHAR(45) NULL DEFAULT NULL AFTER `payment_method`,\n" +
              "ADD COLUMN `shipment_date` DATETIME NULL DEFAULT NULL AFTER `shipment_method`,\n" +
              "ADD COLUMN `progress` VARCHAR(45) NULL DEFAULT NULL AFTER `shipment_date`,\n" +
              "ADD INDEX `index5` (`total` ASC) VISIBLE,\n" +
              "ADD INDEX `index6` (`order_status` ASC) VISIBLE,\n" +
              "ADD INDEX `index7` (`payment_method` ASC) VISIBLE,\n" +
              "ADD INDEX `index8` (`shipment_method` ASC) VISIBLE,\n" +
              "ADD INDEX `index9` (`shipment_date` ASC) VISIBLE,\n" +
              "ADD INDEX `index10` (`progress` ASC) VISIBLE;\n" +
              ";\n"
        })
        //購物車1.1->1.2版本，將原有夾在OrderData裡面的JSON欄位，拉到資料表，加快索引查詢速度。
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_checkout',
            last_version: ['V1.1','V1.2'],
            new_version: 'V1.3',
            event: ()=>{
                return new Promise(async (resolve, reject) => {
                    for (const b of (await db.query(`select * from \`${app_name}\`.t_checkout`,[]))){

                        await CheckoutService.updateAndMigrateToTableColumn({
                            id:b.id,
                            orderData:b.orderData,
                            app_name:app_name,
                            no_shipment_number:true
                        })
                    }
                    resolve(true);
                })
            }
        })
        //購物車1.3->1.4版本，新增ShipmentNumber欄位，加快索引查詢速度。
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_checkout',
            last_version: ['V1.3'],
            new_version: 'V1.4',
            event: `ALTER TABLE \`${app_name}\`.\`t_checkout\`
                ADD COLUMN \`shipment_number\` VARCHAR(45) NULL AFTER \`progress\`,
ADD INDEX \`index11\` (\`shipment_number\` ASC) VISIBLE;`
        });
        //購物車1.4->1.5版本，將原有夾在OrderData裡面的JSON欄位，拉到資料表，加快索引查詢速度。
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_checkout',
            last_version: ['V1.4'],
            new_version: 'V1.5',
            event: ()=>{
                return new Promise(async (resolve, reject) => {
                    for (const b of (await db.query(`select * from \`${app_name}\`.t_checkout`,[]))){
                        await CheckoutService.updateAndMigrateToTableColumn({
                            id:b.id,
                            orderData:b.orderData,
                            app_name:app_name
                        })
                    }
                    resolve(true);
                })
            }
        });
        //LINE資料表更新
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_live_purchase_interactions',
            last_version: [''],
            new_version: 'V1.0',
            event: `ALTER TABLE \`${app_name}\`.\`t_live_purchase_interactions\`
                CHANGE COLUMN \`stream_name\` \`name\` VARCHAR (200) NOT NULL;`
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
            ;`
        });
        //更新商品銷售紀錄
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_products_sold_history',
            last_version: [''],
            new_version: 'V1.0',
            event: ()=>{
                return new Promise(async (resolve, reject) => {
                    for (const b of (await db.query(`select * from \`${app_name}\`.t_checkout`,[]))){
                        await CheckoutService.updateAndMigrateToTableColumn({
                            id:b.id,
                            orderData:b.orderData,
                            app_name:app_name
                        })
                    }
                    resolve(true);
                })
            }
        });
    }

    public static async update(obj: {
        app_name: string,
        table_name: string,
        last_version: string[],
        new_version: string,
        event: string | (()=>Promise<any>)
    }) {
        const data_ = await db.query(`SELECT TABLE_NAME, TABLE_COMMENT
                                      FROM information_schema.tables
                                      WHERE TABLE_SCHEMA = ?
                                        AND TABLE_NAME = ?;`, [obj.app_name, obj.table_name]);
        //判斷是需要更新的版本
        if (obj.last_version.includes(data_[0]['TABLE_COMMENT'] ?? '') ) {
            console.log(`資料庫更新開始:${obj.app_name}-${obj.last_version}-to-${obj.new_version}`)
            if(typeof obj.event === 'string'){
                await db.query(`
                ${obj.event}
               `, [])
            }else{
                while (!(await obj.event())){}
            }
            await db.query(`ALTER TABLE \`${obj.app_name}\`.\`${obj.table_name}\` COMMENT = '${obj.new_version}';`,[]);
            console.log(`資料庫更新結束:${obj.app_name}-${obj.last_version}-to-${obj.new_version}`)
        }
    }

}
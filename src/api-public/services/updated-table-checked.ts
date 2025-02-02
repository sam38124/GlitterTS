import db from '../../modules/database';

export class UpdatedTableChecked {
    public static async startCheck(app_name: string) {
        //員工上下班打卡1.1版本，新增門市欄位
        await UpdatedTableChecked.update({
            app_name: app_name,
            table_name: 't_check_in_pos',
            last_version: '',
            new_version: 'V1.1',
            event: `ALTER TABLE \`${app_name}\`.t_check_in_pos
                ADD COLUMN \`store\` VARCHAR(45) NOT NULL DEFAULT '' AFTER \`execute\`,
ADD INDEX \`index5\` (\`store\` ASC) VISIBLE;`
        })
    }

    public static async update(obj: {
        app_name: string,
        table_name: string,
        last_version: string,
        new_version: string,
        event: string
    }) {
        const data_ = await db.query(`SELECT TABLE_NAME, TABLE_COMMENT
                                      FROM information_schema.tables
                                      WHERE TABLE_SCHEMA = ?
                                        AND TABLE_NAME = ?;`, [obj.app_name, obj.table_name]);
        //判斷是需要更新的版本
        if ((data_[0]['TABLE_COMMENT'] ?? '') === obj.last_version) {
            console.log(`資料庫更新:${obj.last_version}-to-${obj.new_version}`)
            await db.query(`
                ${obj.event}
                ALTER TABLE \`${obj.app_name}\`.\`${obj.table_name}\` COMMENT = '${obj.new_version}';`, [])
        }
    }
}
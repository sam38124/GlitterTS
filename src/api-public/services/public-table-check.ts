import db from '../../modules/database';



export class ApiPublic  {
    public static checkApp:string[]=[]
    public static async createScheme(appName:string){
        if(ApiPublic.checkApp.indexOf(appName)!==-1){
            return
        }
        const trans = await db.Transaction.build();
        await trans.execute(`CREATE SCHEMA if not exists \`${appName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;`, {})
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
        `, {})
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
        `, {})

        await trans.commit()
        ApiPublic.checkApp.push(appName)
    }
}
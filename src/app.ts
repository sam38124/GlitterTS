import db from "./modules/database";
import {config} from "./config";
export class App{
    public static getAdConfig(appName: string, key: string){

        return new Promise<any>(async (resolve, reject) => {
    const data = await db.query(`select \`value\`
                                         from \`${config.DB_NAME}\`.private_config
                                         where app_name = '${appName}'
                                           and \`key\` = ${db.escape(key)}`, [])
    resolve((data[0]) ? data[0]['value'] : {})
})
}

}

export default App
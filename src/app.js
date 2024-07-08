var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import db from "./modules/database";
import { config } from "./config";
export class App {
    static getAdConfig(appName, key) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const data = yield db.query(`select \`value\`
                                         from \`${config.DB_NAME}\`.private_config
                                         where app_name = '${appName}'
                                           and \`key\` = ${db.escape(key)}`, []);
            resolve((data[0]) ? data[0]['value'] : {});
        }));
    }
}
export default App;

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Private_config } from "../../services/private_config.js";
import db from "../../modules/database.js";
import { User } from "./user.js";
import { Firebase } from "../../modules/firebase.js";
export class CustomCode {
    constructor(appName) {
        this.appName = '';
        this.appName = appName;
    }
    loginHook(config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute('glitter_login_webhook', config);
        });
    }
    checkOutHook(config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute('glitter_finance_webhook', config);
        });
    }
    execute(key, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlData = (yield Private_config.getConfig({
                appName: this.appName, key: key
            }));
            if (!sqlData[0] || !sqlData[0].value) {
                return;
            }
            const webHook = sqlData[0].value.value;
            const evalString = `
                return {
                    execute:(obj)=>{
                      ${webHook}
                    }
                }
                `;
            yield db.queryLambada({
                database: this.appName
            }, (sql) => __awaiter(this, void 0, void 0, function* () {
                let originUserData = config.userData && JSON.stringify(config.userData.userData);
                let userID = config.userData && config.userData.userID;
                const myFunction = new Function(evalString);
                config.userID = userID;
                config.sql = sql;
                config.userData = config.userData && config.userData.userData;
                config.fcm = new Firebase(this.appName);
                (yield (myFunction().execute(config)));
                if (config.userData && (JSON.stringify(config.userData) !== originUserData)) {
                    (yield (new User(this.appName).updateUserData(userID, {
                        userData: config.userData
                    }, true)));
                }
            }));
        });
    }
}

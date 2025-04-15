"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomCode = void 0;
const private_config_js_1 = require("../../services/private_config.js");
const database_js_1 = __importDefault(require("../../modules/database.js"));
const user_js_1 = require("./user.js");
const firebase_js_1 = require("../../modules/firebase.js");
class CustomCode {
    constructor(appName) {
        this.appName = '';
        this.appName = appName;
    }
    async loginHook(config) {
        await this.execute('glitter_login_webhook', config);
    }
    async checkOutHook(config) {
        await this.execute('glitter_finance_webhook', config);
    }
    async execute(key, config) {
        const sqlData = (await private_config_js_1.Private_config.getConfig({
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
        await database_js_1.default.queryLambada({
            database: this.appName
        }, async (sql) => {
            let originUserData = config.userData && JSON.stringify(config.userData.userData);
            let userID = config.userData && config.userData.userID;
            const myFunction = new Function(evalString);
            config.userID = userID;
            config.sql = sql;
            config.userData = config.userData && config.userData.userData;
            config.fcm = new firebase_js_1.Firebase(this.appName);
            (await (myFunction().execute(config)));
            if (config.userData && (JSON.stringify(config.userData) !== originUserData)) {
                (await (new user_js_1.User(this.appName).updateUserData(userID, {
                    userData: config.userData
                }, true)));
            }
        });
    }
}
exports.CustomCode = CustomCode;
//# sourceMappingURL=custom-code.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const database_1 = __importDefault(require("./modules/database"));
const config_1 = require("./config");
class App {
    static getAdConfig(appName, key) {
        return new Promise(async (resolve, reject) => {
            const data = await database_1.default.query(`select \`value\`
                                         from \`${config_1.config.DB_NAME}\`.private_config
                                         where app_name = '${appName}'
                                           and \`key\` = ${database_1.default.escape(key)}`, []);
            resolve((data[0]) ? data[0]['value'] : {});
        });
    }
}
exports.App = App;
exports.default = App;
//# sourceMappingURL=app.js.map
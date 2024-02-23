"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtPermission = void 0;
const database_js_1 = __importDefault(require("../../modules/database.js"));
const config_js_1 = require("../../config.js");
class UtPermission {
    static isManager(req) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve((await database_js_1.default.query(`SELECT count(1)
                             FROM ${config_js_1.saasConfig.SAAS_NAME}.app_config
                             where user = ?
                               and appName = ?`, [req.body.token.userID, req.get('g-app')]))[0]['count(1)'] == 1);
            }
            catch (e) {
                resolve(false);
            }
        });
    }
    static isAppUser(req) {
        return new Promise(async (resolve, reject) => {
            resolve((await database_js_1.default.query(`SELECT count(1)
                             FROM \`${req.get('g-app')}\`.t_user
                             where userID = ?`, [req.body.token.userID]))[0]['count(1)'] == 1);
        });
    }
}
exports.UtPermission = UtPermission;
//# sourceMappingURL=ut-permission.js.map
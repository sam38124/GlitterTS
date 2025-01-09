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
                const appName = req.get('g-app') || req.query.appName || req.body.appName;
                console.log(`SELECT count(1) 
                    FROM ${config_js_1.saasConfig.SAAS_NAME}.app_config
                    WHERE 
                        (user = ${req.body.token.userID} and appName = ${database_js_1.default.escape(appName)})
                        OR appName in (
                            (SELECT appName FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.app_auth_config
                            WHERE user = ${req.body.token.userID} AND status = 1 AND invited = 1 AND appName = ${database_js_1.default.escape(appName)})
                        );
                   `);
                const result = await database_js_1.default.query(`SELECT count(1) 
                    FROM ${config_js_1.saasConfig.SAAS_NAME}.app_config
                    WHERE 
                        (user = ? and appName = ?)
                        OR appName in (
                            (SELECT appName FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.app_auth_config
                            WHERE user = ? AND status = 1 AND invited = 1 AND appName = ?)
                        );
                    `, [req.body.token.userID, appName, req.body.token.userID, appName]);
                resolve(result[0]['count(1)'] > 0);
            }
            catch (e) {
                resolve(false);
            }
        });
    }
    static isManagerTokenCheck(app_name, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await database_js_1.default.query(`SELECT count(1) 
                    FROM ${config_js_1.saasConfig.SAAS_NAME}.app_config
                    WHERE 
                        (user = ? and appName = ?)
                        OR appName in (
                            (SELECT appName FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.app_auth_config
                            WHERE user = ? AND status = 1 AND invited = 1 AND appName = ?)
                        );
                    `, [user_id, app_name, user_id, app_name]);
                resolve(result[0]['count(1)'] == 1);
            }
            catch (e) {
                resolve(false);
            }
        });
    }
    static isAppUser(req) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve((await database_js_1.default.query(`SELECT count(1)
                             FROM \`${req.get('g-app')}\`.t_user
                             where userID = ?`, [req.body.token.userID]))[0]['count(1)'] == 1);
            }
            catch (e) {
                resolve(false);
            }
        });
    }
}
exports.UtPermission = UtPermission;
//# sourceMappingURL=ut-permission.js.map
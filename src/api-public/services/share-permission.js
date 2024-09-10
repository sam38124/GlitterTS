"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharePermission = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const config_1 = require("../../config");
class SharePermission {
    constructor(appName, token) {
        this.appName = appName;
        this.token = token;
    }
    async getBaseData() {
        try {
            const appData = (await database_1.default.query(`SELECT brand FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config WHERE appName = ? AND user = ?;
                `, [this.appName, this.token.userID]))[0];
            return appData === undefined
                ? undefined
                : {
                    saas: config_1.saasConfig.SAAS_NAME,
                    brand: appData.brand,
                    app: this.appName,
                };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('ERROR', 'getBaseData ERROR: ' + e, null);
        }
    }
    async getPermission(data) {
        try {
            const base = await this.getBaseData();
            if (!base)
                return [];
            const querySQL = ['1=1'];
            if (data.email) {
                const userData = await database_1.default.query(`SELECT userID FROM \`${base.brand}\`.t_user WHERE account in (${data.email
                    .split(',')
                    .map((email) => `"${email}"`)
                    .join(',')});
                    `, []);
                if (userData.length === 0)
                    return [];
                querySQL.push(`user in (${userData.map((user) => user.userID).join(',')})`);
            }
            const authData = await database_1.default.query(`SELECT * FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config
                    WHERE appName = ? AND ${querySQL.join(' AND ')};
                `, [base.app]);
            return authData;
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('ERROR', 'getPermission ERROR: ' + e, null);
        }
    }
    async setPermission(data) {
        try {
            const base = await this.getBaseData();
            if (!base) {
                return { result: false };
            }
            const userData = (await database_1.default.query(`SELECT userID FROM \`${base.brand}\`.t_user WHERE account = ?;
                `, [data.email]))[0];
            if (userData === undefined) {
                return { result: false };
            }
            const authData = (await database_1.default.query(`SELECT * FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config WHERE user = ? AND appName = ?;
                `, [userData.userID, base.app]))[0];
            if (authData) {
                await database_1.default.query(`UPDATE \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config
                        SET ?
                        WHERE id = ?`, [
                    {
                        config: JSON.stringify(data.config),
                        updated_time: new Date(),
                    },
                    authData.id,
                ]);
            }
            else {
                await database_1.default.query(`INSERT INTO \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config SET ?`, [
                    {
                        user: userData.userID,
                        appName: base.app,
                        config: JSON.stringify(data.config),
                    },
                ]);
            }
            return Object.assign(Object.assign({ result: true }, base), data);
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('ERROR', 'setPermission ERROR: ' + e, null);
        }
    }
    async deletePermission(email) {
        try {
            const base = await this.getBaseData();
            if (!base) {
                return { result: false };
            }
            const userData = (await database_1.default.query(`SELECT userID FROM \`${base.brand}\`.t_user WHERE account = ?;
                `, [email]))[0];
            if (userData === undefined) {
                return { result: false };
            }
            await database_1.default.query(`DELETE FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config WHERE user = ? AND appName = ?;
                `, [userData.userID, base.app]);
            return Object.assign(Object.assign({ result: true }, base), { email });
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('ERROR', 'setPermission ERROR: ' + e, null);
        }
    }
    async toggleStatus(email) {
        try {
            const base = await this.getBaseData();
            if (!base) {
                return { result: false };
            }
            const userData = (await database_1.default.query(`SELECT userID FROM \`${base.brand}\`.t_user WHERE account = ?;
                    `, [email]))[0];
            if (userData === undefined) {
                return { result: false };
            }
            const authData = (await database_1.default.query(`SELECT * FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config WHERE user = ? AND appName = ?;
                    `, [userData.userID, base.app]))[0];
            if (authData) {
                const bool = (authData.status - 1) * -1;
                await database_1.default.query(`UPDATE \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config
                        SET ?
                        WHERE id = ?`, [
                    {
                        status: bool,
                        updated_time: new Date(),
                    },
                    authData.id,
                ]);
                return Object.assign(Object.assign({ result: true }, base), { email: email, status: bool });
            }
            return { result: false };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('ERROR', 'toggleStatus ERROR: ' + e, null);
        }
    }
    async triggerInvited(email) {
        try {
            const base = await this.getBaseData();
            if (!base) {
                return { result: false };
            }
            const userData = (await database_1.default.query(`SELECT userID FROM \`${base.brand}\`.t_user WHERE account = ?;
                    `, [email]))[0];
            if (userData === undefined) {
                return { result: false };
            }
            const authData = (await database_1.default.query(`SELECT * FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config WHERE user = ? AND appName = ?;
                    `, [userData.userID, base.app]))[0];
            if (authData) {
                const bool = 1;
                await database_1.default.query(`UPDATE \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config
                        SET ?
                        WHERE id = ?`, [
                    {
                        invited: bool,
                        updated_time: new Date(),
                    },
                    authData.id,
                ]);
                return Object.assign(Object.assign({ result: true }, base), { email: email, invited: bool });
            }
            return { result: false };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('ERROR', 'triggerInvited ERROR: ' + e, null);
        }
    }
}
exports.SharePermission = SharePermission;
//# sourceMappingURL=share-permission.js.map
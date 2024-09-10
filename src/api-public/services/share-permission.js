"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharePermission = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const config_1 = require("../../config");
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_js_1 = __importDefault(require("../../config.js"));
const user_1 = require("./user");
class SharePermission {
    constructor(appName, token) {
        this.appName = appName;
        this.token = token;
    }
    async getBaseData() {
        try {
            const appData = (await database_1.default.query(`SELECT domain, brand FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config WHERE appName = ? AND user = ?;
                `, [this.appName, this.token.userID]))[0];
            return appData === undefined
                ? undefined
                : {
                    saas: config_1.saasConfig.SAAS_NAME,
                    brand: appData.brand,
                    domain: appData.domain,
                    app: this.appName,
                };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('ERROR', 'getBaseData ERROR: ' + e, null);
        }
    }
    async getPermission(json) {
        var _a, _b;
        try {
            const base = await this.getBaseData();
            if (!base)
                return [];
            const page = (_a = json.page) !== null && _a !== void 0 ? _a : 0;
            const limit = (_b = json.limit) !== null && _b !== void 0 ? _b : 20;
            const start = page * limit;
            const end = page * limit + limit;
            const querySQL = ['1=1'];
            if (json.email) {
                const selectEmails = await database_1.default.query(`SELECT userID FROM \`${base.brand}\`.t_user WHERE account in (${json.email
                    .split(',')
                    .map((email) => `"${email}"`)
                    .join(',')});
                    `, []);
                if (selectEmails.length === 0)
                    return [];
                querySQL.push(`user in (${selectEmails.map((user) => user.userID).join(',')})`);
            }
            const auths = await database_1.default.query(`SELECT * FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config
                    WHERE appName = ? AND ${querySQL.join(' AND ')};
                `, [base.app]);
            if (auths.length === 0) {
                return {
                    data: [],
                    total: 0,
                };
            }
            const users = await database_1.default.query(`SELECT * FROM \`${base.brand}\`.t_user WHERE userID in (${auths
                .map((item) => {
                return item.user;
            })
                .join(',')});
                `, []);
            let authDataList = auths.map((item) => {
                const data = users.find((u) => u.userID == item.user);
                if (data) {
                    item.email = data.account;
                    item.online_time = data.online_time;
                }
                return item;
            });
            function statusFilter(data, query) {
                return data.filter((item) => {
                    if (query === 'yes') {
                        return item.status === 1;
                    }
                    if (query === 'no') {
                        return item.status === 0;
                    }
                    return true;
                });
            }
            if (json.status === 'yes' || json.status === 'no') {
                authDataList = statusFilter(authDataList, json.status);
            }
            function searchFilter(data, field, query) {
                return data.filter((item) => {
                    if (field === 'name') {
                        return item.config.name.toLowerCase().includes(query.toLowerCase());
                    }
                    if (field === 'email') {
                        return item.email.toLowerCase().includes(query.toLowerCase());
                    }
                    if (field === 'phone') {
                        return item.config.phone.includes(query);
                    }
                    return true;
                });
            }
            if (json.queryType && json.query) {
                authDataList = searchFilter(authDataList, json.queryType, json.query);
            }
            function sortByName(data) {
                data.sort((a, b) => a.config.name.localeCompare(b.config.name));
            }
            function sortByOnlineTime(data, order) {
                data.sort((a, b) => {
                    if (order === 'asc') {
                        return new Date(a.online_time).getTime() - new Date(b.online_time).getTime();
                    }
                    else if (order === 'desc') {
                        return new Date(b.online_time).getTime() - new Date(a.online_time).getTime();
                    }
                    return 0;
                });
            }
            switch (json.orderBy) {
                case 'name':
                    sortByName(authDataList);
                    break;
                case 'online_time_asc':
                    sortByOnlineTime(authDataList, 'asc');
                    break;
                case 'online_time_desc':
                    sortByOnlineTime(authDataList, 'desc');
                    break;
                default:
                    break;
            }
            return {
                data: authDataList.slice(start, end),
                total: authDataList.length,
            };
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
            let userData = (await database_1.default.query(`SELECT userID FROM \`${base.brand}\`.t_user WHERE account = ?;
                `, [data.email]))[0];
            if (userData === undefined) {
                const findAuth = (await database_1.default.query(`SELECT * FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config 
                        WHERE JSON_EXTRACT(config, '$.verifyEmail') = ?;
                        `, [data.email]))[0];
                if (findAuth) {
                    userData = { userID: findAuth.user };
                }
                else {
                    userData = { userID: user_1.User.generateUserID() };
                    data.config.verifyEmail = data.email;
                }
            }
            if (userData.userID === this.token.userID) {
                return { result: false };
            }
            const authData = (await database_1.default.query(`SELECT * FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config WHERE user = ? AND appName = ?;
                `, [userData.userID, base.app]))[0];
            let redirect_url = undefined;
            if (authData) {
                await database_1.default.query(`UPDATE \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config
                        SET ?
                        WHERE id = ?`, [
                    {
                        config: JSON.stringify(data.config),
                        updated_time: new Date(),
                        status: data.status === 1 ? 1 : 0,
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
                const keyValue = await SharePermission.generateToken({
                    userId: userData.userID,
                    appName: base.app,
                });
                redirect_url = new URL(`https://${base.domain}/api-public/v1/user/permission/redirect`);
                redirect_url.searchParams.set('key', keyValue);
                redirect_url.searchParams.set('g-app', base.app);
            }
            return Object.assign(Object.assign(Object.assign({ result: true }, base), data), { redirect_url });
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
    static async generateToken(userObj) {
        const iat = Math.floor(Date.now() / 1000);
        const expTime = 3 * 24 * 60 * 60;
        const payload = {
            userId: userObj.userId,
            appName: userObj.appName,
            iat: iat,
            exp: iat + expTime,
        };
        const signedToken = jsonwebtoken_1.default.sign(payload, config_js_1.default.SECRET_KEY);
        await redis_js_1.default.setValue(signedToken, String(iat));
        return signedToken;
    }
    static async redirectHTML(token) {
        const appPermission = jsonwebtoken_1.default.verify(token, config_js_1.default.SECRET_KEY);
        const authData = (await database_1.default.query(`SELECT * FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config WHERE user = ? AND appName = ?;
                `, [appPermission.userId, appPermission.appName]))[0];
        if (authData) {
            await database_1.default.query(`UPDATE \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config
                    SET ?
                    WHERE id = ?`, [
                {
                    invited: 1,
                    updated_time: new Date(),
                },
                authData.id,
            ]);
        }
        const html = String.raw;
        return html `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <title>Title</title>
                </head>
                <body>
                    <script>
                        try {
                            window.webkit.messageHandlers.addJsInterFace.postMessage(
                                JSON.stringify({
                                    functionName: 'closeWebView',
                                    callBackId: 0,
                                    data: {
                                        redirect: 'https://shopnex.cc/login',
                                    },
                                })
                            );
                        } catch (e) {}
                        location.href = 'https://shopnex.cc/login';
                    </script>
                </body>
            </html> `;
    }
}
exports.SharePermission = SharePermission;
//# sourceMappingURL=share-permission.js.map
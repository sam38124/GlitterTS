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
const ses_js_1 = require("../../services/ses.js");
class SharePermission {
    constructor(appName, token) {
        this.appName = appName;
        this.token = token;
    }
    async getBaseData() {
        try {
            const appData = (await database_1.default.query(`SELECT domain, brand,user FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config WHERE  (user = ? and appName = ?)
                                                                                         OR appName in (
                                                                                          (SELECT appName FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config
                        WHERE user = ? AND status = 1 AND invited = 1 AND appName = ?)
                        );
                `, [this.token.userID, this.appName, this.token.userID, this.appName]))[0];
            return appData === undefined
                ? undefined
                : {
                    saas: config_1.saasConfig.SAAS_NAME,
                    brand: appData.brand,
                    domain: appData.domain,
                    app: this.appName,
                    user: appData.user
                };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('ERROR', 'getBaseData ERROR: ' + e, null);
        }
    }
    async getStoreAuth() {
        try {
            const appData = (await database_1.default.query(`SELECT * FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config WHERE appName = ? AND user = ?;
                `, [this.appName, this.token.userID]))[0];
            return appData;
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('ERROR', 'getBaseData ERROR: ' + e, null);
        }
    }
    async getPermission(json) {
        var _a, _b;
        try {
            let base = await this.getBaseData();
            if (!base) {
                const authConfig = await this.getStoreAuth();
                if (authConfig) {
                    return {
                        result: true,
                        store_permission_title: 'employee',
                        data: [authConfig],
                    };
                }
                return [];
            }
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
                    store_permission_title: 'owner',
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
            if (base) {
                const user_data = await new user_1.User(base.brand).getUserData(`${base.user}`, 'userID');
                user_data.userData.auth_config = user_data.userData.auth_config || {
                    pin: user_data.userData.pin,
                    auth: [],
                    name: user_data.userData.name,
                    phone: user_data.userData.phone,
                    title: '管理員',
                    member_id: ''
                };
                authDataList.unshift({
                    id: -1,
                    user: `${base.user}`,
                    appName: this.appName,
                    config: user_data.userData.auth_config,
                    email: user_data.account,
                    invited: 1,
                    status: 1,
                    online_time: new Date()
                });
            }
            return {
                data: authDataList.slice(start, end),
                total: authDataList.length,
                store_permission_title: 'owner',
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
            let userData = (await database_1.default.query(`SELECT userID,userData FROM \`${base.brand}\`.t_user WHERE account = ?;
                `, [data.email]))[0];
            if (userData === undefined) {
                const findAuth = (await database_1.default.query(`SELECT * FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config 
                        WHERE JSON_EXTRACT(config, '$.verifyEmail') = ? ;
                        `, [data.email, base.app]))[0];
                if (findAuth) {
                    userData = { userID: findAuth.user };
                }
                else {
                    userData = { userID: user_1.User.generateUserID() };
                }
                data.config.verifyEmail = data.email;
            }
            if (userData.userID === this.token.userID) {
                userData.userData.auth_config = data.config;
                await database_1.default.query(`update \`${base.brand}\`.t_user set userData=? where account = ?`, [JSON.stringify(userData.userData), data.email]);
                return { result: true };
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
                const storeData = (await database_1.default.query(`SELECT * FROM \`${base.app}\`.t_user_public_config WHERE \`key\` = 'store-information' AND user_id = 'manager';
                        `, []))[0];
                if (!storeData || !storeData.value.shop_name) {
                    return { result: false, message: '請先至「商店訊息」<br />新增你的商店名稱' };
                }
                await database_1.default.query(`INSERT INTO \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config SET ?`, [
                    {
                        user: userData.userID,
                        appName: base.app,
                        config: JSON.stringify(data.config),
                        status: 1,
                        invited: 0
                    },
                ]);
                const keyValue = await SharePermission.generateToken({
                    userId: userData.userID,
                    appName: base.app,
                });
                redirect_url = new URL(`${process.env.DOMAIN}/api-public/v1/user/permission/redirect`);
                redirect_url.searchParams.set('key', keyValue);
                redirect_url.searchParams.set('g-app', base.app);
                if (data.config.come_from !== 'pos') {
                    await (0, ses_js_1.sendmail)('service@ncdesign.info', data.email, '商店權限分享邀請信', `「${storeData.value.shop_name}」邀請你加入他的商店，點擊此連結即可開啟權限：${redirect_url}`);
                }
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
                `, [email]))[0] || { userID: -999 };
            await database_1.default.query(`DELETE FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config WHERE  appName = ? and (user = ? or config->>'$.verifyEmail' = ? or user = ?);
                `, [base.app, userData.userID, email, email]);
            return Object.assign(Object.assign({ result: true }, base), { email });
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('ERROR', 'setPermission ERROR: ' + e, null);
        }
    }
    async toggleStatus(email) {
        var _a;
        try {
            const base = await this.getBaseData();
            if (!base) {
                return { result: false };
            }
            const userData = (_a = (await database_1.default.query(`SELECT userID FROM \`${base.brand}\`.t_user WHERE account = ?;
                    `, [email]))[0]) !== null && _a !== void 0 ? _a : { userID: -99 };
            const authData = (await database_1.default.query(`SELECT * FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config WHERE (user = ? or config->>'$.verifyEmail' = ?) AND appName = ?;
                    `, [userData.userID, email, base.app]))[0];
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
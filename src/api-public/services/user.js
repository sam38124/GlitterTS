"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
const tool_1 = __importStar(require("../../services/tool"));
const UserUtil_1 = __importDefault(require("../../utils/UserUtil"));
const config_js_1 = __importDefault(require("../../config.js"));
const ses_js_1 = require("../../services/ses.js");
const app_js_1 = __importDefault(require("../../app.js"));
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const process_1 = __importDefault(require("process"));
const ut_database_js_1 = require("../utils/ut-database.js");
const custom_code_js_1 = require("./custom-code.js");
class User {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async createUser(account, pwd, userData, req) {
        var _a, _b, _c;
        try {
            const userID = generateUserID();
            let data = await database_1.default.query(`select \`value\`
                                       from \`${config_js_1.default.DB_NAME}\`.private_config
                                       where app_name = '${this.app}'
                                         and \`key\` = 'glitter_loginConfig'`, []);
            if (data.length > 0) {
                data = data[0]['value'];
            }
            else {
                data = {
                    verify: `normal`
                };
            }
            if (userData.verify_code) {
                if ((userData.verify_code !== (await redis_js_1.default.getValue(`verify-${account}`)))) {
                    throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', null);
                }
                else {
                    data.verify = 'normal';
                }
            }
            else if (data.verify != 'normal') {
                await database_1.default.execute(`delete
                                  from \`${this.app}\`.\`t_user\`
                                  where account = ${database_1.default.escape(account)}
                                    and status = 0`, []);
                if (data.verify == 'mail') {
                    data.content = (_a = data.content) !== null && _a !== void 0 ? _a : '';
                    const code = tool_js_1.default.randomNumber(6);
                    await redis_js_1.default.setValue(`verify-${account}`, code);
                    if (data.content.indexOf('@{{code}}') === -1) {
                        data.content = `嗨！歡迎加入 ${data.name || 'GLITTER.AI'}，請輸入驗證碼「 @{{code}}  」。請於1分鐘內輸入並完成驗證。`;
                    }
                    data.content = data.content.replace(`@{{code}}`, code);
                    data.title = data.title || `嗨！歡迎加入 ${data.name || 'GLITTER.AI'}，請輸入驗證碼`;
                    (0, ses_js_1.sendmail)(`${data.name} <${process_1.default.env.smtp}>`, account, data.title, data.content);
                    return {
                        verify: data.verify
                    };
                }
            }
            if (data.will_come_title && data.will_come_content) {
                (0, ses_js_1.sendmail)(`${data.name} <${process_1.default.env.smtp}>`, account, (_b = data.will_come_title) !== null && _b !== void 0 ? _b : '嗨！歡迎加入 Glitter.AI。', (_c = data.will_come_content) !== null && _c !== void 0 ? _c : '');
            }
            await database_1.default.execute(`INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                              VALUES (?, ?, ?, ?, ?);`, [
                userID,
                account,
                await tool_1.default.hashPwd(pwd),
                userData !== null && userData !== void 0 ? userData : {},
                1
            ]);
            const generateToken = await UserUtil_1.default.generateToken({
                user_id: parseInt(userID, 10),
                account: account,
                userData: {}
            });
            return {
                token: (() => {
                    if (data.verify == 'normal') {
                        return generateToken;
                    }
                    else {
                        return ``;
                    }
                })(),
                verify: data.verify
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Register Error:' + e, null);
        }
    }
    async updateAccount(account, userID) {
        try {
            const configAd = await app_js_1.default.getAdConfig(this.app, 'glitter_loginConfig');
            switch (configAd.verify) {
                case 'mail':
                    const checkToken = (0, tool_1.getUUID)();
                    const url = `<h1>${configAd.name}</h1><p>
<a href="${config_js_1.default.domain}/api-public/v1/user/checkMail/updateAccount?g-app=${this.app}&token=${checkToken}">點我前往認證您的信箱</a>
</p>`;
                    await (0, ses_js_1.sendmail)(`service@ncdesign.info`, account, `信箱認證`, url);
                    return {
                        type: 'mail',
                        mailVerify: checkToken,
                        updateAccount: account
                    };
                default:
                    return {
                        type: ''
                    };
            }
        }
        catch (e) {
            console.log(e);
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'SendMail Error:' + e, null);
        }
    }
    async login(account, pwd) {
        try {
            const data = (await database_1.default.execute(`select *
                                                 from \`${this.app}\`.t_user
                                                 where account = ?
                                                   and status = 1`, [account]))[0];
            console.log(`select *
                         from \`${this.app}\`.t_user
                         where account = ${database_1.default.escape(account)}
                           and status = 1`);
            if (await tool_1.default.compareHash(pwd, data.pwd)) {
                data.pwd = undefined;
                data.token = await UserUtil_1.default.generateToken({
                    user_id: data["userID"],
                    account: data["account"],
                    userData: data
                });
                return data;
            }
            else {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Auth failed', null);
            }
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async getUserData(query, type = 'userID') {
        try {
            const sql = `select *
                         from \`${this.app}\`.t_user
                         where ${(() => {
                let query2 = [`1=1`];
                if (type === 'userID') {
                    query2.push(`userID=${database_1.default.escape(query)}`);
                }
                else {
                    query2.push(`account=${database_1.default.escape(query)}`);
                }
                return query2.join(` and `);
            })()}`;
            const data = (await database_1.default.execute(sql, []))[0];
            let cf = {
                userData: data
            };
            await (new custom_code_js_1.CustomCode(this.app).loginHook(cf));
            data.pwd = undefined;
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'GET USER DATA Error:' + e, null);
        }
    }
    async getUserList(query) {
        var _a, _b;
        try {
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
            const querySql = [];
            console.log(query.search);
            query.search && querySql.push([
                `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.name')) LIKE UPPER('%${query.search}%')))`,
                `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.email')) LIKE UPPER('%${query.search}%')))`,
                `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.phone')) LIKE UPPER('%${query.search}%')))`
            ].join(` || `));
            const data = await new ut_database_js_1.UtDatabase(this.app, `t_user`).querySql(querySql, query);
            data.data.map((dd) => {
                dd.pwd = undefined;
            });
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async subscribe(email, tag) {
        try {
            await database_1.default.queryLambada({
                database: this.app
            }, async (sql) => {
                await sql.query(`replace
                into t_subscribe (email,tag) values (?,?)`, [email, tag]);
            });
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Subscribe Error:' + e, null);
        }
    }
    async registerFcm(userID, deviceToken) {
        try {
            await database_1.default.queryLambada({
                database: this.app
            }, async (sql) => {
                await sql.query(`replace
                into t_fcm (userID,deviceToken) values (?,?)`, [userID, deviceToken]);
            });
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'RegisterFcm Error:' + e, null);
        }
    }
    async deleteSubscribe(email) {
        try {
            await database_1.default.query(`delete
                            FROM \`${this.app}\`.t_subscribe
                            where email in (?)`, [email.split(',')]);
            return {
                result: true
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Delete Subscribe Error:' + e, null);
        }
    }
    async getSubScribe(query) {
        var _a, _b;
        try {
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
            const querySql = [];
            query.search && querySql.push([
                `(email LIKE '%${query.search}%') && (tag != ${database_1.default.escape(query.search)})`,
                `(tag = ${database_1.default.escape(query.search)})`
            ].join(` || `));
            const data = await new ut_database_js_1.UtDatabase(this.app, `t_subscribe`).querySql(querySql, query);
            data.data.map((dd) => {
                dd.pwd = undefined;
            });
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async getFCM(query) {
        var _a, _b;
        try {
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
            const querySql = [];
            query.search && querySql.push([
                `(userID in (select userID from \`${this.app}\`.t_user where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.name')) LIKE UPPER('%${query.search}%')))))`,
            ].join(` || `));
            const data = await new ut_database_js_1.UtDatabase(this.app, `t_fcm`).querySql(querySql, query);
            for (const b of data.data) {
                let userData = (await database_1.default.query(`select userData from \`${this.app}\`.t_user where userID=?`, [b.userID]))[0];
                b.userData = (userData) && userData.userData;
            }
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async deleteUser(query) {
        try {
            await database_1.default.query(`delete
                            FROM \`${this.app}\`.t_user
                            where id in (?)`, [query.id.split(',')]);
            return {
                result: true
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Delete User Error:' + e, null);
        }
    }
    async updateUserData(userID, par, manager = false) {
        try {
            const userData = (await database_1.default.query(`select *
                                              from \`${this.app}\`.\`t_user\`
                                              where userID = ${database_1.default.escape(userID)}`, []))[0];
            const configAd = await app_js_1.default.getAdConfig(this.app, 'glitter_loginConfig');
            if ((!manager) && par.userData.email && (par.userData.email !== userData.account) && (!par.userData.verify_code || (par.userData.verify_code !== (await redis_js_1.default.getValue(`verify-${par.userData.email}`))))) {
                const code = tool_js_1.default.randomNumber(6);
                await redis_js_1.default.setValue(`verify-${par.userData.email}`, code);
                (0, ses_js_1.sendmail)(`${configAd.name} <${process_1.default.env.smtp}>`, par.userData.email, '信箱驗證', `請輸入驗證碼「 ${code} 」。並於1分鐘內輸入並完成驗證。`);
                return {
                    data: 'emailVerify'
                };
            }
            else if (par.userData.email) {
                userData.account = par.userData.email;
            }
            par.userData = await this.checkUpdate({
                updateUserData: par.userData,
                userID: userID,
                manager: manager
            });
            delete par.userData.verify_code;
            par = {
                account: userData.account,
                userData: JSON.stringify(par.userData)
            };
            if (!par.account) {
                delete par.account;
            }
            return {
                data: await database_1.default.query(`update \`${this.app}\`.t_user
                                       SET ?
                                       WHERE 1 = 1
                                         and userID = ?`, [par, userID])
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Update user error:' + e, null);
        }
    }
    async checkUpdate(cf) {
        let config = await app_js_1.default.getAdConfig(this.app, 'glitterUserForm');
        let originUserData = (await database_1.default.query(`select userData
                                              from \`${this.app}\`.\`t_user\`
                                              where userID = ${database_1.default.escape(cf.userID)}`, []))[0]['userData'];
        if (typeof originUserData !== 'object') {
            originUserData = {};
        }
        if (!Array.isArray(config)) {
            config = [];
        }
        function mapUserData(userData, originUserData) {
            Object.keys(userData).map((dd) => {
                if (cf.manager || config.find((d2) => {
                    return (d2.key === dd && d2.auth !== 'manager');
                }) || dd === 'fcmToken') {
                    originUserData[dd] = userData[dd];
                }
            });
        }
        mapUserData(cf.updateUserData, originUserData);
        return originUserData;
    }
    async resetPwd(userID, newPwd) {
        try {
            const result = await database_1.default.query(`update \`${this.app}\`.t_user
                                            SET ?
                                            WHERE 1 = 1
                                              and userID = ?`, [{
                    pwd: await tool_1.default.hashPwd(newPwd)
                }, userID]);
            return {
                result: true
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async resetPwdNeedCheck(userID, pwd, newPwd) {
        try {
            const data = (await database_1.default.execute(`select *
                                                 from \`${this.app}\`.t_user
                                                 where userID = ?
                                                   and status = 1`, [userID]))[0];
            if (await tool_1.default.compareHash(pwd, data.pwd)) {
                const result = await database_1.default.query(`update \`${this.app}\`.t_user
                                                SET ?
                                                WHERE 1 = 1
                                                  and userID = ?`, [{
                        pwd: await tool_1.default.hashPwd(newPwd)
                    }, userID]);
                return {
                    result: true
                };
            }
            else {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Auth failed', null);
            }
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async updateAccountBack(token) {
        try {
            const sql = `select userData
                         from \`${this.app}\`.t_user
                         where JSON_EXTRACT(userData, '$.mailVerify') = ${database_1.default.escape(token)}`;
            const userData = (await database_1.default.query(sql, []))[0]['userData'];
            await database_1.default.execute(`update \`${this.app}\`.t_user
                              set account=${database_1.default.escape(userData.updateAccount)}
                              where JSON_EXTRACT(userData, '$.mailVerify') = ?`, [token]);
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'updateAccountBack Error:' + e, null);
        }
    }
    async verifyPASS(token) {
        try {
            const par = {
                status: 1
            };
            return await database_1.default.query(`update \`${this.app}\`.t_user
                                    SET ?
                                    WHERE 1 = 1
                                      and JSON_EXTRACT(userData, '$.mailVerify') = ?`, [par, token]);
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify Error:' + e, null);
        }
    }
    async checkUserExists(account) {
        try {
            return (await database_1.default.execute(`select count(1)
                                      from \`${this.app}\`.t_user
                                      where account = ?
                                        and status!=0`, [account]))[0]["count(1)"] == 1;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
        }
    }
    async setConfig(config) {
        var _a;
        try {
            await database_1.default.execute(`replace
            into \`${this.app}\`.t_user_public_config (\`user_id\`,\`key\`,\`value\`,updated_at)
            values (?,?,?,?)
            `, [
                (_a = config.user_id) !== null && _a !== void 0 ? _a : this.token.userID,
                config.key,
                config.value,
                new Date()
            ]);
        }
        catch (e) {
            console.log(e);
            throw exception_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async getConfig(config) {
        try {
            return await database_1.default.execute(`select * from \`${this.app}\`.t_user_public_config where \`key\`=${database_1.default.escape(config.key)}
            and user_id=${database_1.default.escape(config.user_id)}
            `, []);
        }
        catch (e) {
            console.log(e);
            throw exception_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
}
exports.User = User;
function generateUserID() {
    let userID = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        userID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    userID = `${'123456789'.charAt(Math.floor(Math.random() * charactersLength))}${userID}`;
    return userID;
}
//# sourceMappingURL=user.js.map
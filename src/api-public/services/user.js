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
class User {
    constructor(app) {
        this.app = app;
    }
    async createUser(account, pwd, userData, req) {
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
            if (data.verify != 'normal') {
                await database_1.default.execute(`delete
                                  from \`${this.app}\`.\`user\`
                                  where account = ${database_1.default.escape(account)}
                                    and status = 0`, []);
                if (data.verify == 'mail') {
                    const checkToken = (0, tool_1.getUUID)();
                    userData = userData !== null && userData !== void 0 ? userData : {};
                    userData.mailVerify = checkToken;
                    const url = `<h1>${data.name}</h1><p>
<a href="${config_js_1.default.domain}/api-public/v1/user/checkMail?g-app=${this.app}&token=${checkToken}">點我前往認證您的信箱</a></p>`;
                    console.log(`url:${url}`);
                    await (0, ses_js_1.sendmail)(`service@ncdesign.info`, account, `信箱認證`, url);
                }
            }
            await database_1.default.execute(`INSERT INTO \`${this.app}\`.\`user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                              VALUES (?, ?, ?, ?, ?);`, [
                userID,
                account,
                await tool_1.default.hashPwd(pwd),
                userData !== null && userData !== void 0 ? userData : {},
                (() => {
                    if (data.verify != 'normal') {
                        return 0;
                    }
                    else {
                        return 1;
                    }
                })()
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
                                                 from \`${this.app}\`.user
                                                 where account = ?
                                                   and status = 1`, [account]))[0];
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
    async getUserData(userID) {
        try {
            const data = (await database_1.default.execute(`select *
                                                 from \`${this.app}\`.user
                                                 where userID = ?`, [userID]))[0];
            data.pwd = undefined;
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async updateUserData(userID, par) {
        try {
            const userData = (await database_1.default.query(`select *
                                              from \`${this.app}\`.\`user\`
                                              where userID = ${database_1.default.escape(userID)}`, []))[0];
            let mailVerify = false;
            if (userData.account !== par.account) {
                const result = (await this.updateAccount(par.account, userID));
                if (result.type === 'mail') {
                    par.account = undefined;
                    par.userData.mailVerify = result.mailVerify;
                    par.userData.updateAccount = result.updateAccount;
                    mailVerify = true;
                }
            }
            par = {
                account: par.account,
                userData: JSON.stringify(par.userData)
            };
            if (!par.account) {
                delete par.account;
            }
            return {
                mailVerify: mailVerify,
                data: await database_1.default.query(`update \`${this.app}\`.user
                                       SET ?
                                       WHERE 1 = 1
                                         and userID = ?`, [par, userID])
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async resetPwd(userID, pwd, newPwd) {
        try {
            const data = (await database_1.default.execute(`select *
                                                 from \`${this.app}\`.user
                                                 where userID = ?
                                                   and status = 1`, [userID]))[0];
            if (await tool_1.default.compareHash(pwd, data.pwd)) {
                const result = await database_1.default.query(`update \`${this.app}\`.user
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
                                              from \`${this.app}\`.user
                                              where JSON_EXTRACT(userData, '$.mailVerify') = ${database_1.default.escape(token)}`;
            const userData = (await database_1.default.query(sql, []))[0]['userData'];
            await database_1.default.execute(`update \`${this.app}\`.user
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
            return await database_1.default.query(`update \`${this.app}\`.user
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
                                      from \`${this.app}\`.user
                                      where account = ?
                                        and status!=0`, [account]))[0]["count(1)"] == 1;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
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
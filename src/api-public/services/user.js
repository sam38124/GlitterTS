"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
const tool_1 = __importDefault(require("../../services/tool"));
const UserUtil_1 = __importDefault(require("../../utils/UserUtil"));
class User {
    constructor(app) {
        this.app = app;
    }
    async createUser(account, pwd, userData) {
        try {
            const userID = generateUserID();
            await database_1.default.execute(`INSERT INTO \`${this.app}\`.\`user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`)
                              VALUES (?, ?, ?, ?);`, [
                userID,
                account,
                await tool_1.default.hashPwd(pwd),
                userData !== null && userData !== void 0 ? userData : {}
            ]);
            return {
                token: await UserUtil_1.default.generateToken({
                    user_id: parseInt(userID, 10),
                    account: account,
                    userData: {}
                })
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Register Error:' + e, null);
        }
    }
    async login(account, pwd) {
        try {
            const data = (await database_1.default.execute(`select *
                                                 from \`${this.app}\`.user
                                                 where account = ?`, [account]))[0];
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
            par = {
                account: par.account,
                userData: JSON.stringify(par.userData)
            };
            console.log(userID);
            return await database_1.default.query(`update \`${this.app}\`.user SET ? WHERE 1 = 1 and userID = ?`, [par, userID]);
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async checkUserExists(account) {
        try {
            return (await database_1.default.execute(`select count(1)
                                      from \`${this.app}\`.user
                                      where account = ?`, [account]))[0]["count(1)"] == 1;
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
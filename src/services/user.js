"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const database_1 = __importDefault(require("../modules/database"));
const exception_1 = __importDefault(require("../modules/exception"));
const config_1 = require("../config");
const tool_1 = __importDefault(require("../services/tool"));
const UserUtil_1 = __importDefault(require("../utils/UserUtil"));
class User {
    static async createUser(account, pwd) {
        try {
            const userID = generateUserID();
            await database_1.default.execute(`INSERT INTO \`${config_1.saasConfig.SAAS_NAME}\`.\`user\` (\`userID\`,\`account\`, \`pwd\`, \`userData\`,status) VALUES (?,?, ?, ?,1);`, [
                userID,
                account,
                await tool_1.default.hashPwd(pwd),
                {}
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
    static async login(account, pwd) {
        try {
            const data = (await database_1.default.execute(`select * from \`${config_1.saasConfig.SAAS_NAME}\`.user where account=?`, [account]))[0];
            if (await tool_1.default.compareHash(pwd, data.pwd)) {
                return {
                    account: account,
                    token: await UserUtil_1.default.generateToken({
                        user_id: data["userID"],
                        account: data["account"],
                        userData: data
                    })
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
    static async checkUserExists(account) {
        try {
            return (await database_1.default.execute(`select count(1) from \`${config_1.saasConfig.SAAS_NAME}\`.user where account=?`, [account]))[0]["count(1)"] == 1;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
        }
    }
    constructor() {
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
import db from '../../modules/database';
import exception from "../../modules/exception";
import tool from "../../services/tool";
import UserUtil from "../../utils/UserUtil";

export class User {
    public app: string

    public async createUser(account: string, pwd: string,userData:any) {
        try {
            const userID = generateUserID();
            await db.execute(`INSERT INTO \`${this.app}\`.\`user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`)
                              VALUES (?, ?, ?, ?);`, [
                userID,
                account,
                await tool.hashPwd(pwd),
                userData ?? {}
            ])
            return {
                token: await UserUtil.generateToken({
                    user_id: parseInt(userID, 10),
                    account: account,
                    userData: {}
                })
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Register Error:' + e, null);
        }
    }

    public async login(account: string, pwd: string) {
        try {
            const data: any = (await db.execute(`select *
                                                 from \`${this.app}\`.user
                                                 where account = ?`, [account]) as any)[0]
            if (await tool.compareHash(pwd, data.pwd)) {
                data.pwd=undefined
                data.token=await UserUtil.generateToken({
                    user_id: data["userID"],
                    account: data["account"],
                    userData: data
                })
                return data
            } else {
                throw exception.BadRequestError('BAD_REQUEST', 'Auth failed', null);
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    public async getUserData(userID: string) {
        try {
            const data: any = (await db.execute(`select *
                                                 from \`${this.app}\`.user
                                                 where userID = ?`, [userID]) as any)[0]
            data.pwd=undefined
            return data
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }

    public async checkUserExists(account: string) {
        try {
            return (await db.execute(`select count(1)
                                      from \`${this.app}\`.user
                                      where account = ?`, [account]) as any)[0]["count(1)"] == 1
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
        }

    }

    constructor(app: string) {
        this.app=app
    }
}

function generateUserID() {
    let userID = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        userID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    userID = `${'123456789'.charAt(Math.floor(Math.random() * charactersLength))}${userID}`
    return userID;
}
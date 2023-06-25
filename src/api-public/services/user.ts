import db from '../../modules/database';
import exception from "../../modules/exception";
import tool, {getUUID} from "../../services/tool";
import UserUtil from "../../utils/UserUtil";
import config from "../../config.js";
import {sendmail} from "../../services/ses.js";

export class User {
    public app: string

    public async createUser(account: string, pwd: string, userData: any, req: any) {
        try {
            const userID = generateUserID();
            let data = await db.query(`select \`value\`
                                       from \`${config.DB_NAME}\`.private_config
                                       where app_name = '${this.app}'
                                         and \`key\` = 'glitter_loginConfig'`, [])
            if (data.length > 0) {
                data = data[0]['value']
            } else {
                data = {
                    verify: `normal`
                }
            }
            if (data.verify != 'normal') {
                await db.execute(`delete
                                  from \`${this.app}\`.\`user\`
                                  where account = ${db.escape(account)}
                                    and status = 0`, [])
                if (data.verify == 'mail') {
                    const checkToken = getUUID()
                    userData=userData ?? {}
                    userData.mailVerify=checkToken
                    const url = `<h1>${data.name}</h1><p>
<a href="${(req.secure) ? `https` : `http`}://${req.headers.host}/api-public/v1/user/checkMail?g-app=${this.app}&token=${checkToken}">點我前往認證您的信箱</a></p>`
                    console.log(`url:${url}`)
                    await sendmail(`service@ncdesign.info`, account, `信箱認證`, url)
                }
            }

            await db.execute(`INSERT INTO \`${this.app}\`.\`user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                              VALUES (?, ?, ?, ?, ?);`, [
                userID,
                account,
                await tool.hashPwd(pwd),
                userData ?? {},
                (() => {
                    //當需要認證時傳送認證信
                    if (data.verify != 'normal') {
                        return 0
                    } else {
                        return 1
                    }
                })()
            ])
            const generateToken = await UserUtil.generateToken({
                user_id: parseInt(userID, 10),
                account: account,
                userData: {}
            })
            return {
                token: (() => {
                    if (data.verify == 'normal') {
                        return generateToken;
                    } else {
                        return ``
                    }
                })(),
                verify: data.verify
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Register Error:' + e, null);
        }
    }

    public async login(account: string, pwd: string) {
        try {
            const data: any = (await db.execute(`select *
                                                 from \`${this.app}\`.user
                                                 where account = ?
                                                   and status = 1`, [account]) as any)[0]
            if (await tool.compareHash(pwd, data.pwd)) {
                data.pwd = undefined
                data.token = await UserUtil.generateToken({
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
            data.pwd = undefined
            return data
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }

    public async updateUserData(userID: string, par: any) {
        try {
            par = {
                account: par.account,
                userData: JSON.stringify(par.userData)
            }
            console.log(userID)
            return (await db.query(`update \`${this.app}\`.user
                                    SET ?
                                    WHERE 1 = 1
                                      and userID = ?`, [par, userID]) as any)
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    public async verifyPASS(token:string) {
        try {
           const par = {
                status: 1
            }
            return (await db.query(`update \`${this.app}\`.user
                                    SET ?
                                    WHERE 1 = 1
                                     and JSON_EXTRACT(userData, '$.mailVerify') = ?`, [par,token]) as any)
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }

    public async checkUserExists(account: string) {
        try {
            return (await db.execute(`select count(1)
                                      from \`${this.app}\`.user
                                      where account = ?
                                        and status!=0`, [account]) as any)[0]["count(1)"] == 1
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
        }

    }

    constructor(app: string) {
        this.app = app
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
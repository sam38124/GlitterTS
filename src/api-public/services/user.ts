import db from '../../modules/database';
import exception from "../../modules/exception";
import tool, {getUUID} from "../../services/tool";
import UserUtil from "../../utils/UserUtil";
import config from "../../config.js";
import {sendmail} from "../../services/ses.js";
import App from "../../app.js";

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
                    userData = userData ?? {}
                    userData.mailVerify = checkToken
                    const url = `<h1>${data.name}</h1><p>
<a href="${config.domain}/api-public/v1/user/checkMail?g-app=${this.app}&token=${checkToken}">點我前往認證您的信箱</a></p>`
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

    public async updateAccount(account: string, userID: string) :Promise<any>{
        try {
            const configAd = await App.getAdConfig(this.app, 'glitter_loginConfig')
            switch (configAd.verify) {
                case 'mail':
                    const checkToken = getUUID()
                    const url = `<h1>${configAd.name}</h1><p>
<a href="${config.domain}/api-public/v1/user/checkMail/updateAccount?g-app=${this.app}&token=${checkToken}">點我前往認證您的信箱</a>
</p>`
                    await sendmail(`service@ncdesign.info`, account, `信箱認證`, url)
                    return {
                        type:'mail',
                        mailVerify:checkToken,
                        updateAccount:account
                    }
                default:
                    return {
                        type:''
                    }
            }
        } catch (e) {
            console.log(e)
            throw exception.BadRequestError('BAD_REQUEST', 'SendMail Error:' + e, null);
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
            const userData = (await db.query(`select *
                                              from \`${this.app}\`.\`user\`
                                              where userID = ${db.escape(userID)}`, []))[0]

            let mailVerify = false
            if (userData.account !== par.account ) {
                const result=(await this.updateAccount(par.account, userID))
                if(result.type==='mail'){
                    par.account=undefined
                    par.userData.mailVerify=result.mailVerify
                    par.userData.updateAccount=result.updateAccount
                    mailVerify = true;
                }

            }
            par = {
                account: par.account,
                userData: JSON.stringify(par.userData)
            }
            if(!par.account){
                delete par.account;
            }
            return {
                mailVerify: mailVerify,
                data: (await db.query(`update \`${this.app}\`.user
                                       SET ?
                                       WHERE 1 = 1
                                         and userID = ?`, [par, userID]) as any)
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }

    public async resetPwd(userID: string, pwd: string, newPwd: string) {
        try {
            const data: any = (await db.execute(`select *
                                                 from \`${this.app}\`.user
                                                 where userID = ?
                                                   and status = 1`, [userID]) as any)[0]
            if (await tool.compareHash(pwd, data.pwd)) {
                const result = (await db.query(`update \`${this.app}\`.user
                                                SET ?
                                                WHERE 1 = 1
                                                  and userID = ?`, [{
                    pwd: await tool.hashPwd(newPwd)
                }, userID]) as any)
                return {
                    result: true
                }
            } else {
                throw exception.BadRequestError('BAD_REQUEST', 'Auth failed', null);
            }
            // par = {
            //     account: par.account,
            //     userData: JSON.stringify(par.userData)
            // }
            // console.log(userID)
            //await tool.hashPwd(pwd)
            // return (await db.query(`update \`${this.app}\`.user
            //                         SET ?
            //                         WHERE 1 = 1
            //                           and userID = ?`, [par, userID]) as any)
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }

    public async updateAccountBack(token: string) {
        try {
            const sql=`select userData
                                              from \`${this.app}\`.user
                                              where JSON_EXTRACT(userData, '$.mailVerify') = ${db.escape(token)}`
            const userData = (await db.query(sql, []))[0]['userData']
            await db.execute(`update \`${this.app}\`.user
                              set account=${db.escape(userData.updateAccount)}
                              where JSON_EXTRACT(userData, '$.mailVerify') = ?`, [token])
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'updateAccountBack Error:' + e, null);
        }
    }

    public async verifyPASS(token: string) {
        try {
            const par = {
                status: 1
            }
            return (await db.query(`update \`${this.app}\`.user
                                    SET ?
                                    WHERE 1 = 1
                                      and JSON_EXTRACT(userData, '$.mailVerify') = ?`, [par, token]) as any)
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Verify Error:' + e, null);
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
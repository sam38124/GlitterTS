import db from '../modules/database';
import exception from "../modules/exception";
import {saasConfig} from "../config";
import tool from "../services/tool";
import UserUtil from "../utils/UserUtil";
export class User{

    public static async createUser(account:string,pwd:string){
        try {
            const userID=generateUserID();
            await db.execute(`INSERT INTO \`${saasConfig.SAAS_NAME}\`.\`user\` (\`userID\`,\`account\`, \`pwd\`, \`userData\`,status) VALUES (?,?, ?, ?,1);`,[
                userID,
                account,
                await tool.hashPwd(pwd),
                {}
            ])
            return {
                token:await UserUtil.generateToken({
                    user_id: parseInt(userID,10),
                    account:account,
                    userData: {}
                })
            }
        }catch (e){
            throw exception.BadRequestError('BAD_REQUEST', 'Register Error:'+e, null);
        }
    }
    public static async login(account:string,pwd:string){
        try {
            const data:any=(await db.execute(`select * from \`${saasConfig.SAAS_NAME}\`.user where account=?`,[account]) as any)[0]
            if(await tool.compareHash(pwd, data.pwd)){
                return {
                    account:account,
                    token:await UserUtil.generateToken({
                        user_id: data["userID"],
                        account:data["account"],
                        userData:data
                    })
                }
            }else{
                throw exception.BadRequestError('BAD_REQUEST', 'Auth failed', null);
            }
        }catch (e){
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:'+e, null);
        }
    }

    public static async checkUserExists(account:string){
        try {
            return (await db.execute(`select count(1) from \`${saasConfig.SAAS_NAME}\`.user where account=?`,[account]) as any)[0]["count(1)"]==1
        }catch (e){
            throw exception.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:'+e, null);
        }

    }

    constructor() {
    }
}
function generateUserID() {
    let userID = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        userID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    userID=`${'123456789'.charAt(Math.floor(Math.random() * charactersLength))}${userID}`
    return userID;
}
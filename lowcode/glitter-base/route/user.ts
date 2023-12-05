import {BaseApi} from "../../glitterBundle/api/base.js";
import {GlobalUser} from "../global/global-user.js";


export class ApiUser {
    constructor() {
    }

    public static register(json: { account: string, pwd: string, userData: any }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/register`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName
            },
            data: JSON.stringify(json)
        })
    }

    public static getUserData(token: string) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
    }

    public static getUserList(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user?${ (() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ]
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&')
            })()}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token
            }
        })
    }

    public static deleteUser(json: {
        id: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }
    public static getPublicUserData(id: string) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/userdata?userID=${id}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json"
            }
        })
    }

    public static forgetPwd(email: string) {
        const href = new URL('./index.html', location.href)
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/forget`,
            "type": "POST",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                email: email,
                host_name: href
            })
        })
    }

    public static resetPwd(pwd: string) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/resetPwd`,
            "type": "PUT",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify({
                pwd: pwd
            })
        })
    }

    public static resetPwdCheck(oldPwd: string, pwd: string) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/resetPwdNeedCheck`,
            "type": "PUT",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify({
                pwd: pwd,
                old_pwd: oldPwd
            })
        })
    }

    public static updateUserData(json: any) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user`,
            "type": "PUT",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify({
                userData: json
            })
        })
    }
    public static updateUserDataManager(json: any,userID:string) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user?userID=${userID}`,
            "type": "PUT",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify({
                userData: json
            })
        })
    }
    public static login(json: { account: string, pwd: string }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/login`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName
            },
            data: JSON.stringify(json)
        })
    }



}

function getConfig() {
    const saasConfig: { config: any; api: any } = (window as any).saasConfig;
    return saasConfig
}

function getBaseUrl() {
    return getConfig().config.url
}
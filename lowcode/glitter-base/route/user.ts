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

    public static getNotice(cf:{
        page:number,
        limit:number
    }){
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/notice?page=${cf.page}&limit=${cf.limit}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": GlobalUser.userToken
            }
        })
    }
    public static getNoticeUnread(){
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/notice/unread/count`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": GlobalUser.userToken
            }
        })
    }
    public static getUserData(token: string, type: 'list' | 'me') {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user?type=${type}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
    }
    public static getSaasUserData(token: string, type: 'list' | 'me') {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user?type=${type}`,
            "type": "GET",
            "headers": {
                "g-app": (window as any).glitterBase,
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
    }


    public static getUsersData(userID:string) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/userdata?userID=${userID}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token || GlobalUser.token
            }
        })
    }

    public static subScribe(email: string, tag: string) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/subscribe`,
            "type": "POST",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                email: email,
                tag: tag
            })
        })
    }

    public static registerFCM(userID: string, deviceToken: string) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/fcm`,
            "type": "POST",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                userID: userID,
                deviceToken: deviceToken
            })
        })
    }

    public static getFCM(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/fcm?${(() => {
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

    public static getSubScribe(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/subscribe?${(() => {
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

    public static getSubScribeMailSettingList(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/subscribe?${(() => {
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

    public static deleteSubscribe(json: {
        email: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/subscribe`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }

    public static getUserList(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user?${(() => {
                let par = [
                    `type=list`,
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

    public static updateUserDataManager(json: any, userID: string) {
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

    public static login(json: { account?: string, pwd?: string,login_type?:'fb'|'normal',fb_token?:string }) {
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

    public static setPublicConfig(cf: {
        key: string,
        value: any,
        user_id?: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/public/config`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": (cf.user_id) ? getConfig().config.token : GlobalUser.token
            },
            data: JSON.stringify({
                "key": cf.key,
                "value": cf.value,
                "user_id": cf.user_id
            })
        })
    }

    public static getPublicConfig(key: string, user_id: string) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/public/config?key=${key}&user_id=${user_id}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName
            }
        })
    }

}

function getConfig() {
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    return saasConfig
}

function getBaseUrl() {
    return getConfig().config.url
}
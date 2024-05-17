import { BaseApi } from "../../glitterBundle/api/base.js";
import { GlobalUser } from "../global/global-user.js";
export class ApiUser {
    constructor() {
    }
    static register(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/register`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName
            },
            data: JSON.stringify(json)
        });
    }
    static getUserData(token, type) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user?type=${type}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
    }
    static getSaasUserData(token, type) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user?type=${type}`,
            "type": "GET",
            "headers": {
                "g-app": window.glitterBase,
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
    }
    static getUsersData(userID) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/userdata?userID=${userID}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token || GlobalUser.token
            }
        });
    }
    static subScribe(email, tag) {
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
        });
    }
    static registerFCM(userID, deviceToken) {
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
        });
    }
    static getFCM(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/fcm?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ];
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token
            }
        });
    }
    static getSubScribe(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/subscribe?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ];
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token
            }
        });
    }
    static getSubScribeMailSettingList(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/subscribe?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ];
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token
            }
        });
    }
    static deleteSubscribe(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/subscribe`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        });
    }
    static getUserList(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user?${(() => {
                let par = [
                    `type=list`,
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ];
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token
            }
        });
    }
    static deleteUser(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        });
    }
    static getPublicUserData(id) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/userdata?userID=${id}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json"
            }
        });
    }
    static forgetPwd(email) {
        const href = new URL('./index.html', location.href);
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
        });
    }
    static resetPwd(pwd) {
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
        });
    }
    static resetPwdCheck(oldPwd, pwd) {
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
        });
    }
    static updateUserData(json) {
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
        });
    }
    static updateUserDataManager(json, userID) {
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
        });
    }
    static login(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/login`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName
            },
            data: JSON.stringify(json)
        });
    }
    static setPublicConfig(cf) {
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
        });
    }
    static getPublicConfig(key, user_id) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/public/config?key=${key}&user_id=${user_id}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName
            }
        });
    }
}
function getConfig() {
    const saasConfig = window.parent.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}

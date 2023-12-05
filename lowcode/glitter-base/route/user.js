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
    static getUserData(token) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
    }
    static getUserList(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user?${(() => {
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
}
function getConfig() {
    const saasConfig = window.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}

import { GlobalUser } from "../global/global-user.js";
import { BaseApi } from "../../glitterBundle/api/base.js";
export class ApiPost {
    constructor() {
    }
    static post(json) {
        var _a;
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": (_a = json.token) !== null && _a !== void 0 ? _a : GlobalUser.token
            },
            data: JSON.stringify(json)
        });
    }
    static sqlAPI(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/sql_api`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        });
    }
    static put(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": json.token || GlobalUser.token
            },
            data: JSON.stringify(json)
        });
    }
    static get(json) {
        var _a;
        json.datasource = (_a = json.datasource) !== null && _a !== void 0 ? _a : [];
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post?page=${json.page}&limit=${json.limit}&query=${JSON.stringify(json.query)}&datasource=${JSON.stringify(json.datasource)}&selectOnly=${JSON.stringify(json.selectOnly)}&queryType=${json.queryType}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            }
        });
    }
    static getV2(json) {
        var _a;
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post/${(_a = json.type) !== null && _a !== void 0 ? _a : 'user'}?page=${json.page}&limit=${json.limit}&search=${json.search}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName
            }
        });
    }
    static getManagerPost(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post/manager?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`,
                    `type=${json.type}`
                ];
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            }
        });
    }
    static getUserPost(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post/user?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`,
                    `type=${json.type}`
                ];
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            }
        });
    }
    static delete(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post/manager?id=${json.id}`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            }
        });
    }
    static deleteUserPost(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post/user?id=${json.id}`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": json.token || getConfig().config.token
            }
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
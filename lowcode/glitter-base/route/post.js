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
}
function getConfig() {
    const saasConfig = window.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}

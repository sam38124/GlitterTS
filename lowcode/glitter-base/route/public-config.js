import { BaseApi } from "../../glitterBundle/api/base.js";
export class PublicConfig {
    static set(key, value) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/manager/config`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify({
                "key": key,
                "value": value
            })
        });
    }
    static get(key) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/manager/config?key=${key}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName
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

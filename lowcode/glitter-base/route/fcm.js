import { BaseApi } from "../../glitterBundle/api/base.js";
export class ApiFcm {
    constructor() {
    }
    static send(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/fcm`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": window.parent.appName,
                "Authorization": getConfig().config.token
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

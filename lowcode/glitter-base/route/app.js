import { BaseApi } from "../../glitterBundle/api/base.js";
export class ApiApp {
    constructor() {
    }
    static getAppRelease(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/app/release/?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ];
                json.type && par.push(`type=${json.type}`);
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
    static downloadIOSRelease(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/app/release/ios/download`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        });
    }
    static downloadAndroidRelease(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/app/release/android/download`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
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

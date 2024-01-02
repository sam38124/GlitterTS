import {BaseApi} from "../../glitterBundle/api/base.js";

export class PublicConfig {
    public static set(  key: string,
                        value: any) {
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
        })
    }

    public static get(key: string) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/manager/config?key=${key}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName
            }
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
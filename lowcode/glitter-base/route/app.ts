import {BaseApi} from "../../glitterBundle/api/base.js";
import {GlobalUser} from "../global/global-user.js";


export class ApiApp {
    constructor() {
    }

    public static getAppRelease(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string,
        type:string
    }) {

        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/app/release/?${
                (() => {
                    let par = [
                        `limit=${json.limit}`,
                        `page=${json.page}`
                    ]
                    json.type && par.push(`type=${json.type}`)
                    json.search && par.push(`search=${json.search}`)
                    json.id && par.push(`id=${json.id}`)
                    return par.join('&')
                })()
            }`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            }
        })
    }

    public static downloadIOSRelease(json: {
        "app_name":string,
        "bundle_id":string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/app/release/ios/download`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }

    public static downloadAndroidRelease(json: {
        "app_name":string,
        "bundle_id":string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/app/release/android/download`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
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

import {GlobalUser} from "../global/global-user.js";
import {BaseApi} from "../../glitterBundle/api/base.js";


export class ApiFcm {
    constructor() {
    }

    public static send(json: any) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/fcm`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": (window.parent as any).appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
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
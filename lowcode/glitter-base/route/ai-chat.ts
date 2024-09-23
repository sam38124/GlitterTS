import {BaseApi} from "../../glitterBundle/api/base.js";
import {GlobalUser} from "../global/global-user.js";

export class AiChat{

    public static sync_data(json: {
       app_name?:string,
        type:'writer' | 'order_analysis' | 'operation_guide'
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ai/sync-data`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": json.app_name || getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            "data":JSON.stringify(json)
        })
    }

    public static reset(json: {   app_name?:string,
        type:'writer' | 'order_analysis' | 'operation_guide'
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ai/reset`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": json.app_name || getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            "data":JSON.stringify(json)
        })
    }


}

function getConfig() {
    const saasConfig: { config: any; api: any } = (window as any).parent.saasConfig;
    return saasConfig
}

function getBaseUrl() {
    return getConfig().config.url
}
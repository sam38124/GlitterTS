import {BaseApi} from "../../glitterBundle/api/base.js";
import {GlobalUser} from "../global/global-user.js";

export class AiChat{

    public static sync_data(json: {
       app_name?:string,
        type:'writer' | 'order_analysis' | 'operation_guide' | 'page_editor'
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
        type:'writer' | 'order_analysis' | 'operation_guide' | 'page_editor'
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

    public static generateHtml(json: {   app_name?:string,
        text:string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ai/generate-html`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": json.app_name || getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            "data":JSON.stringify(json)
        })
    }
    public static editorHtml(json: {   app_name?:string,
        text:string,
        format:any,
        assistant?:any
        token?:string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ai/edit-component`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": json.app_name || getConfig().config.appName,
                "Authorization": json.token || GlobalUser.token
            },
            "data":JSON.stringify(json)
        })
    }
    public static searchProduct(json: {   app_name?:string,
        text:string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ai/search-product`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": json.app_name || getConfig().config.appName
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
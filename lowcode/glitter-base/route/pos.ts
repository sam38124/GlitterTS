import {BaseApi} from "../../glitterBundle/api/base.js";

export class ApiPos {
    public static getWorkStatus(userID: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/pos/work-status`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
            data: {userID:userID},
        });
    }
    public static setSummary(obj:{
        staff:string,
        id?:string,
        summary_type:string,
        content:any
    }){
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/pos/summary`,
            type: 'POST',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(obj),
        });
    }

    public static getSummary(shop:string){
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/pos/summary?shop=${shop}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            }
        });
    }
    public static setWorkStatus(obj:{
        user_id?:string,
        status:'off_work'|'on_work'
    }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/pos/work-status`,
            type: 'POST',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(obj),
        });
    }
}

function getConfig() {
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    return saasConfig;
}

function getBaseUrl() {
    return getConfig().config.url;
}
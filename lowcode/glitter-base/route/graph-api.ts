import {BaseApi} from "../../glitterBundle/api/base.js";
import {GlobalUser} from "../global/global-user.js";

export class GraphApi{
    public static post(json: {
        "route":string,
        "method":'GET'|'POST'|'PUT'|'DELETE'|'PATCH',
        "info":{}
    }) {
        (json.method as any)=json.method.toUpperCase()
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/graph_api/add`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }
    public static put(json: {
        "route":string,
        "method":'GET'|'POST'|'PUT'|'DELETE'|'PATCH',
        "info":{}
    }) {
        (json.method as any)=json.method.toUpperCase()
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/graph_api/update`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }
    public static get(json: {
        limit: number,
        page: number,
        search?: string,
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/graph_api/list?${ (() => {
                let par = [
                    `limit=${json.limit || 50}`,
                    `page=${json.page || 0}`
                ]
                json.search && par.push(`search=${json.search}`);
                return par.join('&')
            })()}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": (getConfig().config.appName),
                "Authorization": getConfig().config.token
            }
        })
    }

    public static delete(json: {
        id: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/graph_api/delete`,
            "type": "DELETE",
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
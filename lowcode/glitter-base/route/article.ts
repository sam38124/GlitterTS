import {BaseApi} from "../../glitterBundle/api/base.js";

export class Article{
    public static get(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string,
        tag?:string,
        label?:string,
        for_index?:string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/article/manager?${ (() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ]
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                json.tag &&par.push(`tag=${json.tag}`)
                json.label &&par.push(`label=${json.label}`)
                json.for_index &&par.push(`for_index=${json.for_index}`)
                return par.join('&')
            })()}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token
            }
        })
    }
    public static delete(json: {
        id: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/article`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }
    public static deleteV2(json: {
        id: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/article/manager`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }

    public static post(tData:{
        tag:string,
        name:string,
        copy:string
    }){
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/article/manager`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify({
                "data":tData
            })
        })
    }
    public static put(tData:any){
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/article/manager`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify({
                "data":tData
            })
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
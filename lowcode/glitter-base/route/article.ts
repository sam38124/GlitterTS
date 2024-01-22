import {BaseApi} from "../../glitterBundle/api/base.js";

export class Article{
    public static get(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string,
        tag?:string,
        label?:string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/article?${ (() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ]
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                json.tag &&par.push(`tag=${json.tag}`)
                json.label &&par.push(`label=${json.label}`)
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

}

function getConfig() {
    const saasConfig: { config: any; api: any } = (window as any).saasConfig;
    return saasConfig
}

function getBaseUrl() {
    return getConfig().config.url
}
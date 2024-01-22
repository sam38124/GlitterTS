import { BaseApi } from "../../glitterBundle/api/base.js";
export class Article {
    static get(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/article?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ];
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                json.tag && par.push(`tag=${json.tag}`);
                json.label && par.push(`label=${json.label}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token
            }
        });
    }
    static delete(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/article`,
            "type": "DELETE",
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
    const saasConfig = window.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}

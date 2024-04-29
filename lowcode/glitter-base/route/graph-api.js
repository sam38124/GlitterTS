import { BaseApi } from "../../glitterBundle/api/base.js";
export class GraphApi {
    static post(json) {
        json.method = json.method.toUpperCase();
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/graph_api/add`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        });
    }
    static put(json) {
        json.method = json.method.toUpperCase();
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/graph_api/update`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        });
    }
    static get(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/graph_api/list?${(() => {
                let par = [
                    `limit=${json.limit || 50}`,
                    `page=${json.page || 0}`
                ];
                json.search && par.push(`search=${json.search}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": (getConfig().config.appName),
                "Authorization": getConfig().config.token
            }
        });
    }
    static delete(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/graph_api/delete`,
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
    const saasConfig = window.parent.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}

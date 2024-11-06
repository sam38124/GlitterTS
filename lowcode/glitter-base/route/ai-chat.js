import { BaseApi } from "../../glitterBundle/api/base.js";
import { GlobalUser } from "../global/global-user.js";
export class AiChat {
    static sync_data(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ai/sync-data`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": json.app_name || getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            "data": JSON.stringify(json)
        });
    }
    static reset(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ai/reset`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": json.app_name || getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            "data": JSON.stringify(json)
        });
    }
    static generateHtml(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ai/generate-html`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": json.app_name || getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            "data": JSON.stringify(json)
        });
    }
    static editorHtml(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ai/edit-component`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": json.app_name || getConfig().config.appName,
                "Authorization": json.token || GlobalUser.token
            },
            "data": JSON.stringify(json)
        });
    }
    static searchProduct(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ai/search-product`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": json.app_name || getConfig().config.appName
            },
            "data": JSON.stringify(json)
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

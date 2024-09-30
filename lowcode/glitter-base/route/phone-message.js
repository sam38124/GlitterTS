import { BaseApi } from "../../glitterBundle/api/base.js";
export class ApiUser {
    constructor() { }
    static register(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/register`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
            },
            data: JSON.stringify(json),
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

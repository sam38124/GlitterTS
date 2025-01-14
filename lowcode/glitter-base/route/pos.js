import { BaseApi } from "../../glitterBundle/api/base.js";
export class ApiPos {
    static getWorkStatus(userID) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/pos/work-status`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
            data: { userID: userID },
        });
    }
    static setSummary(obj) {
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
    static getSummary() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/pos/summary`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            }
        });
    }
    static setWorkStatus(obj) {
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
    const saasConfig = window.parent.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}

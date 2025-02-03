import { BaseApi } from "../../glitterBundle/api/base.js";
export class ApiPos {
    static getWorkStatus(userID, store) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/pos/work-status?userID=${userID}&store=${store}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            }
        });
    }
    static getWorkStatusList(query) {
        var _a, _b;
        query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
        query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 20;
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/pos/work-status-list?${(() => {
                return Object.keys(query)
                    .map(key => `${key}=${query[key]}`)
                    .join('&');
            })()}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            }
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
    static getSummary(shop) {
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

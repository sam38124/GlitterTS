import { BaseApi } from '../../glitterBundle/api/base.js';
function getConfig() {
    const saasConfig = window.parent.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}
export class ApiRecommend {
    static getList(cf) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/recommend/list`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
        });
    }
    static postList(cf) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/recommend/list`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }
    static putList(cf) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/recommend/list`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }
}

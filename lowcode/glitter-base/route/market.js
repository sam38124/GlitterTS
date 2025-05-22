import { BaseApi } from '../../glitterBundle/api/base.js';
export class ApiMarket {
    static getAppList() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/app_market`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
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

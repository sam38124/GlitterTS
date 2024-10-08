import { BaseApi } from '../../glitterBundle/api/base.js';
export class ApiDelivery {
    static storeMaps(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/delivery/storeMaps`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
            },
            data: JSON.stringify(json),
        });
    }
    static getOrderInfo(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/delivery/printOrderInfo`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
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

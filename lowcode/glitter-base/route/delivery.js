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
            url: getBaseUrl() + `/api-public/v1/delivery/orderInfo`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static cancelOrder(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/delivery/cancel-order`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static getFormURL(id) {
        return getBaseUrl() + `/api-public/v1/delivery/formView?id=${id}&g-app=${getConfig().config.appName}`;
    }
}
function getConfig() {
    const saasConfig = window.parent.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}

import { BaseApi } from '../../glitterBundle/api/base.js';

export class ApiDelivery {
    static storeMaps(json: { returnURL: string; logistics: string }) {
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

    static getOrderInfo(json: { order_id: string }) {
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

    public static getFormURL(id: string) {
        return getBaseUrl() + `/api-public/v1/delivery/formView?id=${id}&g-app=${getConfig().config.appName}`;
    }
}

function getConfig() {
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    return saasConfig;
}

function getBaseUrl() {
    return getConfig().config.url;
}

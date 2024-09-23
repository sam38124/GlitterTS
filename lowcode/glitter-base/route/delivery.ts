import { GlobalUser } from '../global/global-user.js';
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

    static getOrderInfo(json: { brand: string; logisticsId: string; paymentNo: string; validationNo: string }) {
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
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    return saasConfig;
}

function getBaseUrl() {
    return getConfig().config.url;
}

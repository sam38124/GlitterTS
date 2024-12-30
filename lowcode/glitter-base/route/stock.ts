import { BaseApi } from '../../glitterBundle/api/base.js';

export class ApiStock {
    static getStoreProductList(json: { page: number; limit: number; search: string }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/stock/store/productList?${(() => {
                    let par = [`page=${json.page}`, `limit=${json.limit}`, `search=${json.search}`];
                    return par.join('&');
                })()}`,
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
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    return saasConfig;
}

function getBaseUrl() {
    return getConfig().config.url;
}

import { BaseApi } from '../../glitterBundle/api/base.js';
export class ApiStock {
    static getStoreProductList(json) {
        return BaseApi.create({
            url: getBaseUrl() +
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
    static deleteStore(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/stock/store`,
            type: 'DELETE',
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

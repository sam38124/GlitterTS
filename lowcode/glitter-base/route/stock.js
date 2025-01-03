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
    static getStockHistory(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/stock/history?${(() => {
                    let par = [`page=${json.page}`, `limit=${json.limit}`, `search=${json.search}`, `type=${json.type}`];
                    json.queryType && par.push(`queryType=${json.queryType}`);
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
    static postStockHistory(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/stock/history`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({ data: json }),
        });
    }
    static putStockHistory(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/stock/history`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({ data: json }),
        });
    }
    static deleteStockHistory(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/stock/history`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({ data: json }),
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

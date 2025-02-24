import { BaseApi } from '../../glitterBundle/api/base.js';
export class ApiStock {
    static getStoreProductList(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/stock/store/productList?${(() => {
                    let par = [`page=${json.page}`, `limit=${json.limit}`, `search=${json.search}`];
                    if (json.variant_id_list && json.variant_id_list.length > 0) {
                        par.push(`variant_id_list=${json.variant_id_list.join(',')}`);
                    }
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
    static getStoreProductStock(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/stock/productStock?${(() => {
                    let par = [`page=${json.page}`, `limit=${json.limit}`, `variant_id_list=${json.variant_id_list.join(',')}`];
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
                    let par = [`page=${json.page}`, `limit=${json.limit}`, `type=${json.type}`];
                    json.queryType && par.push(`queryType=${json.queryType}`);
                    json.search && par.push(`search=${json.search}`);
                    json.order_id && par.push(`order_id=${json.order_id}`);
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

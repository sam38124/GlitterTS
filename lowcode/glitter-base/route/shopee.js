import { BaseApi } from '../../glitterBundle/api/base.js';
export class ApiShopee {
    static generateAuth(redirect) {
        BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/shopee/getAuth`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                redirect: redirect,
            }),
        }).then(r => {
            console.log('r.response.result -- ', r.response.result);
            localStorage.setItem('shopee', window.parent.location.href);
            window.parent.location.href = r.response.result;
        });
    }
    static getToken(code, shop_id) {
        BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/shopee/getToken`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                code: code,
                shop_id: shop_id,
            }),
        }).then(r => {
            console.log('r -- ', r);
        });
    }
    static getItemList(start, end, callback) {
        BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/shopee/getItemList`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                start: start,
                end: end,
            }),
        }).then(r => {
            console.log('r -- ', r);
            callback(r.response);
        });
    }
    static syncProduct(callback) {
        BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/shopee/syncStock`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
        }).then(r => {
            callback(r.response);
        });
    }
    static syncStatus() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/shopee/sync-status`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
        });
    }
    static getOrderList(start, end, callback) {
        BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/shopee/getOrderList`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                start: start,
                end: end,
            }),
        }).then(r => {
            console.log('r -- ', r);
            callback(r.response);
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

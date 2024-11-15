import { BaseApi } from '../../glitterBundle/api/base.js';
import { GlobalUser } from '../global/global-user.js';
export class ApiWallet {
    static store(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/wallet`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
            data: JSON.stringify(json),
        });
    }
    static withdraw(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/wallet/withdraw`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
            data: JSON.stringify(json),
        });
    }
    static getWallet(token) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/wallet/sum`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: token || getConfig().config.token,
            },
        });
    }
    static getWalletMemory(cf) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/wallet?page=${cf.page}&limit=${cf.limit}&type=${cf.type}&start_date=${cf.start_date}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
        });
    }
    static withdrawPut(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/wallet/withdraw`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static storeByManager(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/wallet/manager`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static storeRebateByManager(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/rebate/batch`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static delete(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/wallet`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static deleteRebate(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/rebate`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static deleteWithdraw(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/wallet/withdraw`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static get(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/wallet?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
        });
    }
    static getRebate(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/ec/rebate?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.dataType && par.push(`dataType=${json.dataType}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: json.type === 'me' ? GlobalUser.token : getConfig().config.token,
            },
        });
    }
    static getWithdraw(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/wallet/withdraw?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
        });
    }
    static getSum(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/wallet/sum?${(() => {
                    let par = [];
                    json.userID && par.push(`userID=${json.userID}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token || GlobalUser.token,
            },
        });
    }
    static getRebateSum(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/ec/rebate/sum?${(() => {
                    let par = [];
                    json.userID && par.push(`userID=${json.userID}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token || GlobalUser.token,
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

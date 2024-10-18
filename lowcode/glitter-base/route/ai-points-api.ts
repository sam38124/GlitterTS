import { BaseApi } from '../../glitterBundle/api/base.js';
import { GlobalUser } from '../global/global-user.js';

export class AiPointsApi {
    public static store(json: { total: number; note: any; method?: any; return_url: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ai/points`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window.parent as any).glitterBase,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }

    public static apple_webhook(receipt:string){
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/apple-webhook`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window.parent as any).glitterBase,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                base64:{
                    "receipt-data": receipt }
            }),
        });
    }

    public static withdraw(json: { total: number; note: any }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ai/points/withdraw`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window.parent as any).glitterBase,
                Authorization: GlobalUser.token,
            },
            data: JSON.stringify(json),
        });
    }

    public static getWallet() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ai/points/sum`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window.parent as any).glitterBase,
                Authorization: GlobalUser.token,
            },
        });
    }
    public static getWalletMemory(cf: { page: number; limit: number; type: string; start_date: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ai/points?page=${cf.page}&limit=${cf.limit}&type=${cf.type}&start_date=${cf.start_date}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window.parent as any).glitterBase,
                Authorization: GlobalUser.token,
            },
        });
    }
    public static withdrawPut(json: { id: number; status: number; note: {} }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ai/points/withdraw`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window.parent as any).glitterBase,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    public static storeByManager(json: { userID: number[]; total: number; note: any }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ai/points/manager`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window.parent as any).glitterBase,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }

    public static storeRebateByManager(json: { userID: number[]; total: number; note: string; rebateEndDay?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/rebate/batch`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window.parent as any).glitterBase,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    public static delete(json: { id: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ai/points`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window.parent as any).glitterBase,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }

    public static deleteRebate(json: { id: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/rebate`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window.parent as any).glitterBase,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }

    public static deleteWithdraw(json: { id: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ai/points/withdraw`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window.parent as any).glitterBase,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }

    public static get(json: { limit: number; page: number; search?: string; id?: string,type?:string }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ai/points?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.type && par.push(`type=${json.type}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': (window.parent as any).glitterBase,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
        });
    }

    public static getRebate(json: { limit: number; page: number; search?: string; id?: string; type?: 'me' | 'all'; dataType?: 'one' | 'all' }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ec/rebate?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.dataType && par.push(`dataType=${json.dataType}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': (window.parent as any).glitterBase,
                'Content-Type': 'application/json',
                Authorization: json.type === 'me' ? GlobalUser.token : getConfig().config.token,
            },
        });
    }
    public static getWithdraw(json: { limit: number; page: number; search?: string; id?: string }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ai/points/withdraw?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': (window.parent as any).glitterBase,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
        });
    }
    public static getSum(json: { userID?: string }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ai/points/sum?${(() => {
                    let par = [];
                    json.userID && par.push(`userID=${json.userID}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': (window.parent as any).glitterBase,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token || GlobalUser.token,
            },
        });
    }
    public static getRebateSum(json: { userID?: string }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ec/rebate/sum?${(() => {
                    let par = [];
                    json.userID && par.push(`userID=${json.userID}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': (window.parent as any).glitterBase,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token || GlobalUser.token,
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

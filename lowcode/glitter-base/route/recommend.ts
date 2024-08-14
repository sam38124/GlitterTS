import { BaseApi } from '../../glitterBundle/api/base.js';

function getConfig() {
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    return saasConfig;
}

function getBaseUrl() {
    return getConfig().config.url;
}

export class ApiRecommend {
    public static getList(cf: { data: any; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/recommend/list`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
        });
    }

    public static postListData(cf: { data: any; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/recommend/list`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }

    public static putListData(cf: { id: number; data: any; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/recommend/list/${cf.id}`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }

    public static toggleListData(cf: { id: number; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/recommend/list/toggle/${cf.id}`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
        });
    }

    public static getUsers(json: { data: any; limit: number; page: number; type?: string; token?: string; search?: string; searchType?: string; orderBy?: string }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/recommend/user?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    json.orderBy && par.push(`orderBy=${json.orderBy}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: json.token || getConfig().config.token,
            },
        });
    }

    public static postUserData(cf: { data: any; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/recommend/user`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }

    public static putUserData(cf: { id: number; data: any; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/recommend/user/${cf.id}`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }
}

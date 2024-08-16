import { BaseApi } from '../../glitterBundle/api/base.js';
function getConfig() {
    const saasConfig = window.parent.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}
export class ApiRecommend {
    static getList(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/recommend/list?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.user_id && par.push(`user_id=${json.user_id}`);
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
    static postListData(cf) {
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
    static putListData(cf) {
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
    static toggleListData(cf) {
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
    static deleteLinkData(cf) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/recommend/list`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }
    static getUsers(json) {
        return BaseApi.create({
            url: getBaseUrl() +
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
    static postUserData(cf) {
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
    static putUserData(cf) {
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
    static deleteUserData(cf) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/recommend/user`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }
}

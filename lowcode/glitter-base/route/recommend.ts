import { GlobalUser } from '../global/global-user.js';
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

    public static postList(cf: { data: any; token?: string }) {
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

    public static putList(cf: { id: number; data: any; token?: string }) {
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
}

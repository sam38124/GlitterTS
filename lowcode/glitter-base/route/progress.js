import { BaseApi } from '../../glitterBundle/api/base.js';
export class ApiProgress {
    static getAllProgress() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/progress`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
        });
    }
    static getOneProgress(taskId) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/progress/${taskId}`,
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
    const saasConfig = window.parent.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}

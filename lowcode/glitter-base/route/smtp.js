import { BaseApi } from '../../glitterBundle/api/base.js';
export class ApiSmtp {
    static send(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/smtp`,
            type: 'POST',
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

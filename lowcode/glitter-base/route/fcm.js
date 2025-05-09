import { BaseApi } from "../../glitterBundle/api/base.js";
export class ApiFcm {
    constructor() {
    }
    static history(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/fcm?${(() => {
                    let par = [`type=list`, `limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    json.sendTime && par.push(`sendDate=${json.sendTime.date}&sendTime=${json.sendTime.time}`);
                    json.status && par.push(`status=${json.status.join(',')}`);
                    json.mailType && par.push(`mailType=${json.mailType.join(',')}`);
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
    static send(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/fcm`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": window.parent.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
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

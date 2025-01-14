import { BaseApi } from "../../glitterBundle/api/base.js";
export class ApiPos {
    static getWorkStatus(userID) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/pos/summary`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
            data: { userID: userID },
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

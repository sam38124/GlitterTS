import {BaseApi} from "../../glitterBundle/api/base.js";

export class ApiPos {
    public static getWorkStatus(userID: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/pos/summary`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
            data: {userID:userID},
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

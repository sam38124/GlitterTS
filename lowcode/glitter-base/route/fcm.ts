
import {GlobalUser} from "../global/global-user.js";
import {BaseApi} from "../../glitterBundle/api/base.js";


export class ApiFcm {
    constructor() {
    }
    public static history(json: { page: number; limit: number; search: string; searchType: string; sendTime?: { date: string; time: string }; status?: number[]; mailType?: string[] }) {
        return BaseApi.create({
            url:
              getBaseUrl() +
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
    public static send(json: any) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/fcm`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": (window.parent as any).appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }


}

function getConfig() {
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    return saasConfig
}

function getBaseUrl() {
    return getConfig().config.url
}
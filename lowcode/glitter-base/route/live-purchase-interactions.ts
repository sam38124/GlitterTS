import { BaseApi } from '../../glitterBundle/api/base.js';



export type PostData = {
    type: 'notify-line-config';
    tag: string;
    tagList: { tag: string; filter: any; valueString: string }[];
    name: string;
    boolean: 'and' | 'or';
    title: string;
    content: string;
    sendTime: { date: string; time: string } | undefined;
    sendGroup: string[];
    email?: string[];
    lineID?:string[];
    typeName?: string;
};


export class ApiLiveInteraction extends BaseApi {
    public static async createScheduled(json:{
        stream_name: string,
        streamer: string,
        platform: string,
        item_list: any[],
        stock: {
            reserve: boolean,
            expiry_date: string,
            period: string,
        },
        discount_set: string,
    }){
        // t_live_purchase_interactions
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/customer_sessions`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({ data: json }),
        });
    }
    public static history(json: { page: number; limit: number; search: string; searchType: string; sendTime?: { date: string; time: string }; status?: number[]; mailType?: string[] }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/line_message?${(() => {
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

    public static send(json: PostData) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/line_message`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }

    public static delete(json: { id: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/sns`,
            type: 'delete',
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
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    return saasConfig;
}

function getBaseUrl() {
    return getConfig().config.url;
}

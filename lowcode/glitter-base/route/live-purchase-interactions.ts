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
    public static async createScheduled(json:any){
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
    public static async getScheduled(json:any){
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/customer_sessions`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({ data: json }),
        });
    }
    public static async getOnlineCart(cartID:string){
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/customer_sessions/online_cart?cartID=${cartID}`,
            type: 'get',
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

import { BaseApi } from '../../glitterBundle/api/base.js';
import { GlobalUser } from '../global/global-user.js';



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


export class ApiFbService extends BaseApi {
    public static async getOauth(code:any){
        const gapp = localStorage.getItem('gapp');
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/fb/oauth?code=${code}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': gapp,
                Authorization: GlobalUser.userToken,
            },
        });
    }
    public static async getPageAuthList(){
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/fb/pages`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
        });
    }
    public static async launchFacebookLive(data:any){
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/fb/live/start`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(data),
        });
    }
    public static async getLiveComments(scheduled_id:string,liveID:string,accessToken:string ,after?:string){
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/fb/live/comments?scheduled_id=${scheduled_id}&liveID=${liveID}&accessToken=${accessToken}${after?`&after=${after}`:''}`,
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
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    return saasConfig;
}

function getBaseUrl() {
    return getConfig().config.url;
}

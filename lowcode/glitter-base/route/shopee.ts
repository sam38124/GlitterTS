import { BaseApi } from '../../glitterBundle/api/base.js';

export class ApiShopee {
    public static generateAuth(redirect:string){
        BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/shopee/getAuth`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                "redirect" : redirect
            })
        }).then(r => {
            console.log("r.response.result -- " , r.response.result)
            localStorage.setItem("shopee" , window.parent.location.href);
            window.parent.location.href = r.response.result;
        });
    }
    public static getToken(code:string , shop_id:number){
        BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/shopee/getToken`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                "code" : code,
                "shop_id" : shop_id
            })
        }).then(r => {
            console.log("r -- " , r);

        });
    }
    public static getItemList(start:number , end:number ,callback:(response:any)=>void){

        BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/shopee/getItemList`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                "start" : start,
                "end" : end
            })
        }).then(r => {
            callback(r.response);
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

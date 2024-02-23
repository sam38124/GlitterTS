import {BaseApi} from "../glitterBundle/api/base.js";
import {config} from "../config.js";

export class GlobalEvent {
    public static addGlobalEvent(data:any){
        return BaseApi.create({
            "url": config.url+`/api/v1/global-event`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization":config.token,
                "g-app": config.appName,
            },
            data:JSON.stringify(data)
        })
    }
    public static deleteGlobalEvent(tag:string){
        return BaseApi.create({
            "url": config.url+`/api/v1/global-event`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization":config.token,
                "g-app": config.appName,
            },
            data:JSON.stringify({
                tag:tag
            })
        })
    }
    public static putGlobalEvent(data:any){
        return BaseApi.create({
            "url": config.url+`/api/v1/global-event`,
            "type": "PUT",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization":config.token,
                "g-app": config.appName,
            },
            data:JSON.stringify(data)
        })
    }

    public static getGlobalEvent(cf:{
        tag?:string
    }){
        return BaseApi.create({
            "url": config.url+`/api/v1/global-event?1=1&${
                (()=>{
                    let qArray:string[]=[];
                    cf.tag && qArray.push(`tag=${cf.tag}`)
                    return qArray.join('&')
                })()
            }`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "g-app": config.appName,
            }
        })
    }
}
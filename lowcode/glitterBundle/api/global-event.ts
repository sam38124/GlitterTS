import {BaseApi} from "./base.js";

export class GlobalEvent {
    public static config = () => {
        return (window as any).config
    }

    public static addGlobalEvent(data: any) {
        return BaseApi.create({
            "url": GlobalEvent.config().url + `/api/v1/global-event`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": GlobalEvent.config().token,
                "g-app": GlobalEvent.config().appName,
            },
            data: JSON.stringify(data)
        })
    }

    public static deleteGlobalEvent(tag: string) {
        return BaseApi.create({
            "url": GlobalEvent.config().url + `/api/v1/global-event`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": GlobalEvent.config().token,
                "g-app": GlobalEvent.config().appName,
            },
            data: JSON.stringify({
                tag: tag
            })
        })
    }

    public static putGlobalEvent(data: any) {
        return BaseApi.create({
            "url": GlobalEvent.config().url + `/api/v1/global-event`,
            "type": "PUT",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": GlobalEvent.config().token,
                "g-app": GlobalEvent.config().appName,
            },
            data: JSON.stringify(data)
        })
    }

    public static getGlobalEvent(cf: {
        tag?: string
    }) : Promise<{result:boolean,response:any}>{
        function getData() {
            return BaseApi.create({
                "url": GlobalEvent.config().url + `/api/v1/global-event?1=1&${
                    (() => {
                        let qArray: string[] = [];
                        cf.tag && qArray.push(`tag=${cf.tag}`)
                        return qArray.join('&')
                    })()
                }`,
                "type": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                    "g-app": GlobalEvent.config().appName,
                }
            })
        }

        if (cf.tag) {
            return ( new Promise((resolve, reject)=>{
                (window as any).glitter.ut.setQueue('getGlobalEvent-'+cf.tag,(callback:any)=>{
                    getData().then((res)=>{
                        callback(res)
                    })
                },(response:any)=>{
                    resolve(new Promise(async (resolve, reject)=>{
                        resolve(response)
                    }))
                })
            }));
        } else {
            return getData()
        }
    }
}
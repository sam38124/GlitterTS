
import {GlobalUser} from "../global/global-user.js";
import {BaseApi} from "../../glitterBundle/api/base.js";
import { Ad } from '../../public-components/public/ad.js';


export class ApiPost {
    constructor() {
    }

    public static post(json: {
        "postData": any,
        token?:string,
        type:'normal' | 'manager'
    }) {
      if(json.postData && json.postData.type==='post-form-config'){
        Ad.gtagEvent('generate_lead',{
          event_category: 'form',
          event_label: json.postData.form_title || 'contact_form', // 可替換為你的表單名稱
          value: 1
        })
        Ad.gtagEvent('lead_form_submitted',{
          event_category: 'form',
          event_label: json.postData.form_title || 'contact_form', // 可替換為你的表單名稱
          value: 1
        })

        Ad.fbqEvent('Lead',{})
      }
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": json.token || ((json.type === 'manager') ? getConfig().config.token :  GlobalUser.token)
            },
            data: JSON.stringify(json)
        })
    }


    public static sqlAPI(json: {
        "router":string,
        "data":any
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/sql_api`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        })
    }

    public static put(json: {
        "postData": any,
        token?:string,
        type?:'normal' | 'manager'
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": json.token || ((json.type === 'manager') ? getConfig().config.token :  GlobalUser.token)
            },
            data: JSON.stringify(json)
        })
    }

    public static get(json: {
        page: number,
        limit: number,
        query: { key: string, value: any, type: string | 'relative_post' | 'relative_user',query?:any }[],
        selectOnly:{ key: string, value: any, type: string}[],
        datasource?: string[],
        queryType:string
    }) {

        json.datasource = json.datasource ?? []
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post?page=${json.page}&limit=${json.limit}&query=${JSON.stringify(json.query)}&datasource=${JSON.stringify(json.datasource)}&selectOnly=${JSON.stringify(json.selectOnly)}&queryType=${json.queryType}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            }
        })
    }
    public static getV2(json: {
        page: number,
        limit:number,
        search:string,
        type?:"user"|'manager'
    }) {

        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post/${json.type ?? 'user'}?page=${json.page}&limit=${json.limit}&search=${json.search}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName
            }
        })
    }
    public static getManagerPost(json: {
        limit: number,
        page: number,
        type:string,
        search?: string[],
        id?: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post/manager?${
                (() => {
                    let par = [
                        `limit=${json.limit}`,
                        `page=${json.page}`
                    ]
                    const search:any=[`type->${json.type}`];
                    json.search&&json.search.map((dd)=>{
                        search.push(dd)
                    })
                    par.push(`search=${search.join(',')}`);
                    json.id && par.push(`id=${json.id}`);
                    return par.join('&')
                })()
            }`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization":getConfig().config.token
            }
        })
    }
    public static getUserPost(json: {
        limit: number,
        page: number,
        type:string,
        search?: string,
        id?: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post/user?${
                (() => {
                    let par = [
                        `limit=${json.limit}`,
                        `page=${json.page}`,
                        `type=${json.type}`
                    ]
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    return par.join('&')
                })()
            }`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization":getConfig().config.token
            }
        })
    }
    public static delete(json: {
        id: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post/manager?id=${json.id}`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            }
        })
    }
    public static deleteUserPost(json: {
        id: string,
        token?:string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/post/user?id=${json.id}`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": json.token ||  getConfig().config.token
            }
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
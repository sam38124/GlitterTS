import {BaseApi} from "../../glitterBundle/api/base.js";
import {GlobalUser} from "../global/global-user.js";


export class Chat {
    constructor() {
    }

    public static post(json: {
        "type": 'user' | 'group',
        "participant": string[]
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/chat`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        })
    }

    public static postMessage(json: {
        "chat_id": string,
        "user_id": string,
        "message": {
            "text": string,
            "attachment": string
        }
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/chat/message`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        })
    }

    public static getMessage(json: {
        limit: number,
        page: number,
        chat_id: string,
        latestID?:string,
        olderID?:string,
        user_id:string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/chat/message?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`,
                    `chat_id=${json.chat_id}`
                ]
                json.latestID&&par.push(`after_id=${json.latestID}`)
                json.olderID&&par.push(`befor_id=${json.olderID}`)
                json.user_id&&par.push(`user_id=${json.user_id}`)
                return par.join('&')
            })()}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        })
    }
    public static getChatRoom(json: {
        limit: number,
        page: number,
        user_id?:string,
        chat_id?:string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/chat?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ]
                json.chat_id&&par.push(`chat_id=${json.chat_id}`)
                json.user_id&&par.push(`user_id=${json.user_id}`)
                return par.join('&')
            })()}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": (json.user_id) ? getConfig().config.token: GlobalUser.token
            }
        })
    }
    public static getUnRead(json: {
        user_id:string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/chat/unread?user_id=${json.user_id}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": (json.user_id) ? getConfig().config.token: GlobalUser.token
            }
        })
    }
    public static deleteChatRoom(json: {
        id: string,
        token?:string
    }){
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/chat?id=${json.id}`,
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
    const saasConfig: { config: any; api: any } = (window as any).parent.saasConfig;
    return saasConfig
}

function getBaseUrl() {
    return getConfig().config.url
}
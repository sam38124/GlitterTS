import { BaseApi } from "../../glitterBundle/api/base.js";
import { GlobalUser } from "../global/global-user.js";
export class Chat {
    constructor() {
    }
    static post(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/chat`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        });
    }
    static postMessage(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/chat/message`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        });
    }
    static getMessage(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/chat/message?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`,
                    `chat_id=${json.chat_id}`
                ];
                json.latestID && par.push(`after_id=${json.latestID}`);
                json.olderID && par.push(`befor_id=${json.olderID}`);
                json.user_id && par.push(`user_id=${json.user_id}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        });
    }
    static getChatRoom(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/chat?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ];
                json.chat_id && par.push(`chat_id=${json.chat_id}`);
                json.user_id && par.push(`user_id=${json.user_id}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": (json.user_id) ? getConfig().config.token : GlobalUser.token
            }
        });
    }
    static getUnRead(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/chat/unread?user_id=${json.user_id}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": (json.user_id) ? getConfig().config.token : GlobalUser.token
            }
        });
    }
    static deleteChatRoom(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/chat?id=${json.id}`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": json.token || getConfig().config.token
            }
        });
    }
}
function getConfig() {
    const saasConfig = window.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}

import { BaseApi } from "./base.js";
export class GlobalEvent {
    static addGlobalEvent(data) {
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
        });
    }
    static deleteGlobalEvent(tag) {
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
        });
    }
    static putGlobalEvent(data) {
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
        });
    }
    static getGlobalEvent(cf) {
        return BaseApi.create({
            "url": GlobalEvent.config().url + `/api/v1/global-event?1=1&${(() => {
                let qArray = [];
                cf.tag && qArray.push(`tag=${cf.tag}`);
                return qArray.join('&');
            })()}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "g-app": GlobalEvent.config().appName,
            }
        });
    }
}
GlobalEvent.config = () => {
    return window.config;
};

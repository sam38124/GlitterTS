var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        function getData() {
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
        if (cf.tag) {
            return (new Promise((resolve, reject) => {
                window.glitter.ut.setQueue('getGlobalEvent-' + cf.tag, (callback) => {
                    getData().then((res) => {
                        callback(res);
                    });
                }, (response) => {
                    resolve(new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        resolve(response);
                    })));
                });
            }));
        }
        else {
            return getData();
        }
    }
}
GlobalEvent.config = () => {
    return window.config;
};

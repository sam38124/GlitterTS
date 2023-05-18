import { config } from "../config.js";
import { BaseApi } from "./base.js";
export class ApiPageConfig {
    constructor() { }
    static getPage(appName, tag) {
        return BaseApi.create({
            "url": config.url + `/api/v1/template?appName=${appName}` + (tag ? `&tag=${tag}` : ""),
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            }
        });
    }
    static setPage(data) {
        return BaseApi.create({
            "url": config.url + `/api/v1/template`,
            "type": "PUT",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify(data)
        });
    }
    static addPage(data) {
        return BaseApi.create({
            "url": config.url + `/api/v1/template`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify(data)
        });
    }
    static getPlugin(appName) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/plugin?appName=${appName}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            }
        });
    }
    static deletePage(data) {
        return BaseApi.create({
            "url": config.url + `/api/v1/template`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify(data)
        });
    }
    static setPlugin(appName, obj) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/plugin`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                appName: appName,
                config: obj
            })
        });
    }
    static setPrivateConfig(appName, key, value) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                appName: appName,
                key: key,
                value: value
            })
        });
    }
    static getPrivateConfig(appName, key) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private?appName=${appName}&key=${key}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        });
    }
    static uploadFile(fileName) {
        return BaseApi.create({
            "url": config.url + `/api/v1/fileManager/upload`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                "fileName": fileName
            })
        });
    }
}

import { config } from "../config.js";
import { BaseApi } from "../glitterBundle/api/base.js";
export class ApiPageConfig {
    constructor() { }
    static getAppConfig() {
        return BaseApi.create({
            "url": config.url + `/api/v1/app?appName=${config.appName}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        });
    }
    static setDomain(domain) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/domain`,
            "type": "PUT",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                app_name: config.appName,
                domain: domain
            })
        });
    }
    static getPage(appName, tag, group, type) {
        return BaseApi.create({
            "url": config.url + `/api/v1/template?appName=${appName}` +
                (tag ? `&tag=${tag}` : "") +
                (group ? `&group=${group}` : "") +
                (type ? `&type=${type}` : ""),
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
    static getEditorToken() {
        return BaseApi.create({
            "url": config.url + `/api/v1/user/editorToken`,
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

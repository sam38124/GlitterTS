import { config } from "../config.js";
import { BaseApi } from "../glitterBundle/api/base.js";
import { GlobalUser } from "../glitter-base/global/global-user.js";
export class ApiPageConfig {
    constructor() {
    }
    static getAppList() {
        return BaseApi.create({
            "url": config.url + `/api/v1/app`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": GlobalUser.token
            }
        });
    }
    static getTemplateList() {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/template?template_from=all`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": GlobalUser.token
            }
        });
    }
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
    static deleteApp(appName) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify({
                appName: appName
            })
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
    static getPage(request) {
        return BaseApi.create({
            "url": config.url + `/api/v1/template?` +
                (() => {
                    const query = [];
                    (request.appName) && (query.push(`appName=${request.appName}`));
                    (request.tag) && (query.push(`tag=${request.tag}`));
                    (request.group) && (query.push(`group=${request.group}`));
                    (request.type) && (query.push(`type=${request.type}`));
                    (request.page_type) && (query.push(`page_type=${request.page_type}`));
                    (request.me) && (query.push(`me=${request.me}`));
                    (request.favorite) && (query.push(`favorite=${request.favorite}`));
                    return query.join('&');
                })(),
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        });
    }
    static getPageTemplate(request) {
        return BaseApi.create({
            "url": config.url + `/api/v1/page/template?` +
                (() => {
                    const query = [];
                    (request.template_from) && (query.push(`template_from=${request.template_from}`));
                    (request.page) && (query.push(`page=${request.page}`));
                    (request.limit) && (query.push(`limit=${request.limit}`));
                    (request.type) && (query.push(`type=${request.type}`));
                    (request.tag) && (query.push(`tag=${request.tag}`));
                    (request.search) && (query.push(`search=${request.search}`));
                    return query.join('&');
                })(),
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        });
    }
    static getTagList(request) {
        return BaseApi.create({
            "url": config.url + `/api/v1/page/tag_list?` +
                (() => {
                    const query = [];
                    (request.type) && (query.push(`type=${request.type}`));
                    (request.template_from) && (query.push(`template_from=${request.template_from}`));
                    return query.join('&');
                })(),
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
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
    static createTemplate(appName, obj) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/create_template`,
            "type": "POST",
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
    static createPageTemplate(appName, obj, tag) {
        return BaseApi.create({
            "url": config.url + `/api/v1/page/template`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                appName: appName,
                config: obj,
                tag: tag
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

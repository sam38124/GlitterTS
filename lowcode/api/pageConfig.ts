import {config} from "../config.js";
import {BaseApi} from "../glitterBundle/api/base.js";
import {GlobalUser} from "../glitter-base/global/global-user.js";

export class ApiPageConfig {
    constructor() {
    }

    public static getAppList() {
        return BaseApi.create({
            "url": config.url + `/api/v1/app`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": GlobalUser.token
            }
        })
    }

    public static getTemplateList() {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/template?template_from=all`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": GlobalUser.token
            }
        })
    }

    public static getAppConfig() {
        return BaseApi.create({
            "url": config.url + `/api/v1/app?appName=${config.appName}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        })
    }

    public static deleteApp(appName: string) {
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
        })
    }

    public static setDomain(cf:{
        domain: string,
        app_name?:string
        token?:string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/domain`,
            "type": "PUT",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": cf.token || config.token
            },
            data: JSON.stringify({
                app_name: cf.app_name || config.appName,
                domain: cf.domain
            })
        })
    }

    public static getPage(request: {
        appName?: string, tag?: string, group?: string, type?: 'article' | 'template', page_type?: string,me?:boolean,favorite?:boolean,token?:string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/template?` +
                (() => {
                    const query: string[] = [];
                    (request.appName) && (query.push(`appName=${request.appName}`));
                    (request.tag) && (query.push(`tag=${request.tag}`));
                    (request.group) && (query.push(`group=${request.group}`));
                    (request.type) && (query.push(`type=${request.type}`));
                    (request.page_type) && (query.push(`page_type=${request.page_type}`));
                    (request.me) && (query.push(`me=${request.me}`));
                    (request.favorite) && (query.push(`favorite=${request.favorite}`))
                    return query.join('&')
                })()
            ,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": request.token || config.token
            }
        })
    }

    public static getPageTemplate(request:{
        template_from: 'all' | 'me' | 'project',
        page?: string,
        limit?: string,
        type?:'page' | 'module' | 'article' | 'blog' | 'backend' | 'form_plugin',
        tag?:string,
        search?:string
    }){
        return BaseApi.create({
            "url": config.url + `/api/v1/page/template?` +
                (() => {
                    const query: string[] = [];
                    (request.template_from) && (query.push(`template_from=${request.template_from}`));
                    (request.page) && (query.push(`page=${request.page}`));
                    (request.limit) && (query.push(`limit=${request.limit}`));
                    (request.type) && (query.push(`type=${request.type}`));
                    (request.tag) && (query.push(`tag=${request.tag}`));
                    (request.search) && (query.push(`search=${request.search}`));
                    return query.join('&')
                })()
            ,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        })
    }

    public static getTagList(request:{
        type:'page' | 'module' | 'article' | 'blog' | 'backend',
        template_from:string
    }){
        return BaseApi.create({
            "url": config.url + `/api/v1/page/tag_list?` +
                (() => {
                    const query: string[] = [];
                    (request.type) && (query.push(`type=${request.type}`));
                    (request.template_from) && (query.push(`template_from=${request.template_from}`));
                    return query.join('&')
                })()
            ,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        })
    }

    public static setPage(data: {
        "id": number
        "appName": "lionDesign",
        "tag": "home",
        "group"?: "首頁相關",
        "name"?: "首頁",
        "config"?: [],
        "page_config"?: any,
        "page_type"?: string,
        favorite?: number,
        preview_image?: string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/template`,
            "type": "PUT",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify(data)
        })
    }

    public static addPage(data: {
        "appName": string,
        "tag": string,
        "group"?: string,
        "name"?: string,
        "config"?: [],
        "page_config"?: any,
        "copy"?: string,
        copyApp?:string,
        page_type?:string,
        replace?:boolean
    }) {

        return BaseApi.create({
            "url": config.url + `/api/v1/template`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify(data)
        })
    }

    public static getPlugin(appName: string) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/plugin?appName=${appName}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            }
        })
    }

    public static deletePage(data: {
        "id"?: number
        "appName": string,
        "tag"?: string
    }) {

        return BaseApi.create({
            "url": config.url + `/api/v1/template`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify(data)
        })
    }

    public static setPlugin(appName: string, obj: any) {
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
        })
    }
    public static createTemplate(appName: string, obj: any) {
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
        })
    }
    public static createPageTemplate(appName: string, obj: any,tag:string) {
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
                tag:tag
            })
        })
    }



    public static setPrivateConfig(appName: string, key: any, value: any) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                appName: appName ,
                key: key,
                value: value
            })
        })
    }

    public static setPrivateConfigV2(cf:{
        key:string,
        value:string,
        appName?:string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                appName: cf.appName || config.appName,
                key: cf.key,
                value: cf.value
            })
        })
    }

    public static getPrivateConfig(appName: string, key: any) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private?appName=${appName}&key=${key}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        })
    }

    public static getPrivateConfigV2(key: any) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private?appName=${config.appName}&key=${key}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        })
    }
    public static getEditorToken() {
        return BaseApi.create({
            "url": config.url + `/api/v1/user/editorToken`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        })
    }

    public static uploadFile(fileName: string) {
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
        })
    }
}
import {config} from "../config.js";
import {BaseApi} from "../glitterBundle/api/base.js";

export class ApiPageConfig{
    constructor() { }
    public static getAppConfig(){
        return BaseApi.create({
            "url": config.url+`/api/v1/app?appName=${config.appName}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization":config.token
            }
        })
    }
    public static setDomain(domain:string){
        return BaseApi.create({
            "url": config.url+`/api/v1/app/domain`,
            "type": "PUT",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization":config.token
            },
            data:JSON.stringify({
                app_name:config.appName,
                domain:domain
            })
        })
    }
    public static getPage(appName:string,tag?:string,group?:string,type?:'article'|'template'){
        return BaseApi.create({
            "url": config.url+`/api/v1/template?appName=${appName}`+
                (tag ? `&tag=${tag}`:"")+
                (group ? `&group=${group}`:"")+
                (type ? `&type=${type}`:"")
            ,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            }
        })
    }
    public static setPage(data:{
        "id":number
        "appName":"lionDesign",
        "tag":"home",
        "group"?:"首頁相關",
        "name"?:"首頁",
        "config"?:[],
        "page_config"?:any
    }){

        return BaseApi.create({
            "url": config.url+`/api/v1/template`,
            "type": "PUT",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization":config.token
            },
            data:JSON.stringify(data)
        })
    }

    public static addPage(data:{
        "appName":string,
        "tag":string,
        "group"?:string,
        "name"?:string,
        "config"?:[],
        "page_config"?:any,
        "copy"?:string
    }){

        return BaseApi.create({
            "url": config.url+`/api/v1/template`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization":config.token
            },
            data:JSON.stringify(data)
        })
    }
    public static getPlugin(appName:string){
        return BaseApi.create({
            "url": config.url+`/api/v1/app/plugin?appName=${appName}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            }
        })
    }

    public static deletePage(data:{
        "id":number
        "appName":"lionDesign"
    }){

        return BaseApi.create({
            "url": config.url+`/api/v1/template`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization":config.token
            },
            data:JSON.stringify(data)
        })
    }
    public static setPlugin(appName:string,obj:any){
        return BaseApi.create({
            "url": config.url+`/api/v1/app/plugin`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "Authorization":config.token
            },
            data:JSON.stringify({
                appName:appName,
                config:obj
            })
        })
    }
    public static setPrivateConfig(appName:string,key:any,value:any){
        return BaseApi.create({
            "url": config.url+`/api/v1/private`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization":config.token
            },
            data:JSON.stringify({
                appName:appName,
                key:key,
                value:value
            })
        })
    }
    public static getPrivateConfig(appName:string,key:any){
        return BaseApi.create({
            "url": config.url+`/api/v1/private?appName=${appName}&key=${key}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization":config.token
            }
        })
    }

    public static getEditorToken(){
        return BaseApi.create({
            "url": config.url+`/api/v1/user/editorToken`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization":config.token
            }
        })
    }

    public static uploadFile(fileName:string){
        return BaseApi.create({
            "url": config.url+`/api/v1/fileManager/upload`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization":config.token
            },
            data:JSON.stringify({
                "fileName":fileName
            })
        })
    }
}
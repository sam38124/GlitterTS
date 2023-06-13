import {config} from "../config.js";
import {BaseApi} from "./base.js";

export class ApiPageConfig{
    constructor() { }

    public static getPage(appName:string,tag?:string){
        return BaseApi.create({
            "url": config.url+`/api/v1/template?appName=${appName}`+(tag ? `&tag=${tag}`:""),
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
        "page_config"?:any
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
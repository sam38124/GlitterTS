import {BaseApi} from "../glitterBundle/api/base.js";
import {config} from "../config.js";

export class BackendServer{
    public static postDomain(conf:{
        domain:string,
        port:string
    }){
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/domain`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            },
            data:JSON.stringify({
                data:conf
            })
        })
    }
    public static deleteDomain(conf:{
        domain:string
    }){
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/domain`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            },
            data:JSON.stringify({
                data:conf
            })
        })
    }
    public static getDatabaseAddress() {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/database_router`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        })
    }
    public static startServer() {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/ec2`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        })
    }
    public static stopServer() {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/ec2`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        })
    }

    public static shutDown(cf:{
        port:string
    }){
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/api/shutdown`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            },
            data:JSON.stringify({
                data:cf
            })
        })
    }
    public static deleteAPI(cf:{
        port:string
    }){
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/api`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            },
            data:JSON.stringify({
                data:cf
            })
        })
    }
    public static serverINFO() {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/ec2`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        })
    }
    public static postAPI(conf: {
        name:string,
        domain?:string,
        version:string,
        port:string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/api`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            },
            data:JSON.stringify({
                data:conf
            })
        })
    }

    public static getApi(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/api?${(() => {
                let par = [
                    `type=list`,
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ]
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&')
            })()}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        })
    }

    public static getApiPath(json: {
        port:string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/api_path?port=${json.port}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        })
    }


    public static getDomain(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/domain?${(() => {
                let par = [
                    `type=list`,
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ]
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&')
            })()}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        })
    }

    public static sampleProject() {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/api_sample`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        })
    }
}
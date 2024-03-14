import { BaseApi } from "../glitterBundle/api/base.js";
import { config } from "../config.js";
export class BackendServer {
    static postDomain(conf) {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/domain`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            },
            data: JSON.stringify({
                data: conf
            })
        });
    }
    static deleteDomain(conf) {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/domain`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            },
            data: JSON.stringify({
                data: conf
            })
        });
    }
    static getDatabaseAddress() {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/database_router`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        });
    }
    static startServer() {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/ec2`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        });
    }
    static stopServer() {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/ec2`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        });
    }
    static shutDown(cf) {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/api/shutdown`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            },
            data: JSON.stringify({
                data: cf
            })
        });
    }
    static deleteAPI(cf) {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/api`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            },
            data: JSON.stringify({
                data: cf
            })
        });
    }
    static serverINFO() {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/ec2`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        });
    }
    static postAPI(conf) {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/api`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            },
            data: JSON.stringify({
                data: conf
            })
        });
    }
    static getApi(json) {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/api?${(() => {
                let par = [
                    `type=list`,
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ];
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        });
    }
    static getApiPath(json) {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/api_path?port=${json.port}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        });
    }
    static getDomain(json) {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/domain?${(() => {
                let par = [
                    `type=list`,
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ];
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        });
    }
    static sampleProject() {
        return BaseApi.create({
            "url": config.url + `/api/v1/backend-server/api_sample`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token,
                "g-app": config.appName,
            }
        });
    }
}

import {BaseApi} from "../../glitterBundle/api/base.js";
import {GlobalUser} from "../global/global-user.js";

export class ApiWallet{
    public static store(json: {
        "total":number,
        "note":any,
        "return_url":string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/wallet`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        })
    }

    public static withdraw(json: {
        "total":number,
        "note":any
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/wallet/withdraw`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        })
    }
    public static withdrawPut(json: {
        "id": number,
        "status": number,
        "note":{}
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/wallet/withdraw`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }
    public static storeByManager(json: {
        "userID":number[],
        "total":number,
        "note":any
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/wallet/manager`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        })
    }

    public static storeRebateByManager(json: {
        "userID":number[],
        "total":number,
        "note":any
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/rebate/manager`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        })
    }
    public static delete(json: {
        id: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/wallet`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }

    public static deleteRebate(json: {
        id: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/rebate`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }

    public static deleteWithdraw(json: {
        id: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/wallet/withdraw`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }

    public static get(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/wallet?${ (() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ]
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&')
            })()}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token
            }
        })
    }

    public static getRebate(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/rebate?${ (() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ]
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&')
            })()}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token
            }
        })
    }
    public static getWithdraw(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/wallet/withdraw?${ (() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ]
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&')
            })()}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token
            }
        })
    }
    public static getSum(json: {
        userID?: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/wallet/sum?${ (() => {
                let par = []
                json.userID && par.push(`userID=${json.userID}`);
                return par.join('&')
            })()}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token || GlobalUser.token
            }
        })
    }
    public static getRebateSum(json: {
        userID?: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/rebate/sum?${ (() => {
                let par = []
                json.userID && par.push(`userID=${json.userID}`);
                return par.join('&')
            })()}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
                "Authorization": getConfig().config.token || GlobalUser.token
            }
        })
    }


}
function getConfig() {
    const saasConfig: { config: any; api: any } = (window as any).saasConfig;
    return saasConfig
}

function getBaseUrl() {
    return getConfig().config.url
}
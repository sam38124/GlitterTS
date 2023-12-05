import {GlobalUser} from "../global/global-user.js";
import {BaseApi} from "../../glitterBundle/api/base.js";


export class ApiShop {
    constructor() {
    }

    public static getProduct(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string,
        collection?: string,
        maxPrice?: string,
        minPrice?: string,
        status?:string
    }) {

        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/product?${
                (() => {
                    let par = [
                        `limit=${json.limit}`,
                        `page=${json.page}`
                    ]
                    json.collection && par.push(`collection=${encodeURI(json.collection)}`)
                    json.search && par.push(`search=${json.search}`)
                    json.id && par.push(`id=${json.id}`)
                    json.maxPrice && par.push(`max_price=${json.maxPrice}`)
                    json.minPrice && par.push(`min_price=${json.minPrice}`)
                    json.status && par.push(`status=${json.status}`)
                    return par.join('&')
                })()
            }`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            }
        })
    }

    public static getOrder(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string,
        data_from?: 'user' | 'manager'
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/order?${
                (() => {
                    let par = [
                        `limit=${json.limit}`,
                        `page=${json.page}`
                    ]
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    return par.join('&')
                })()
            }`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": (json.data_from === 'user') ? GlobalUser.token : getConfig().config.token
            }
        })
    }

    public static getVoucher(json: {
        limit: number,
        page: number,
        search?: string,
        id?: string,
        data_from?: 'user' | 'manager'
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/voucher?${
                (() => {
                    let par = [
                        `limit=${json.limit}`,
                        `page=${json.page}`
                    ]
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    return par.join('&')
                })()
            }`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": (json.data_from === 'user') ? GlobalUser.token : getConfig().config.token
            }
        })
    }




    public static putOrder(json: {
        id: string,
        order_data: any,
        status?:any
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/order`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }

    public static delete(json: {
        id: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/product?id=${json.id}`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            }
        })
    }
    public static deleteOrders(json: {
        id: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/order`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        })
    }
    public static deleteVoucher(json: {
        id: string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/voucher?id=${json.id}`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            }
        })
    }


    public static setCollection(json: any) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/manager/config`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify({
                "key": "collection",
                "value": json
            })
        })
    }

    public static getCollection() {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/manager/config?key=collection`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName
            }
        })
    }

    public static toCheckout(json: {
        line_items: {
            "id": number,
            "spec": string[],
            "count": number
        }[],
        "return_url": string,
        "user_info"?: {
            "name"?: string,
            "phone"?: string,
            "address"?: string,
            "email"?: string
        }
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/checkout`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        })
    }

    public static getCheckout(json: {
        line_items: {
            "id": number,
            "spec": string[],
            "count": number
        }[],
        code?:string
    }) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/checkout/preview`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        })
    }

    public static getVoucherCode(){
        const glitter=(window as any).glitter
        return new Promise((resolve, reject)=>{
            (window as any).glitter.getPro(ApiShop.voucherID, (response: any) => {
              resolve(response.data)
            })
        })
    }

    public static setVoucherCode(code:string){
        (window as any).glitter.setPro(ApiShop.voucherID, code, () => {
        });
    }

    public static voucherID="voucxasw"
    public static cartID = "lemnoas"

    public static addToCart(id: string, count: string) {
        (window as any).glitter.getPro(ApiShop.cartID, (response: any) => {
            const cartData = (response.data) ? JSON.parse(response.data) : {};
            cartData[id] = cartData[id] ?? 0;
            cartData[id] += parseInt(count, 10);
            (window as any).glitter.setPro(ApiShop.cartID, JSON.stringify(cartData), () => {
            });
        })
    }

    public static clearCart() {
        (window as any).glitter.setPro(ApiShop.cartID, JSON.stringify({}), () => {
        });
    }

    public static getCart() {
        return new Promise((resolve, reject) => {
            (window as any).glitter.getPro(ApiShop.cartID, (response: any) => {
                const cartData = (response.data) ? JSON.parse(response.data) : {};
                resolve(cartData)
            })
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
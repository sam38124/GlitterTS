import { GlobalUser } from "../global/global-user.js";
import { BaseApi } from "../../glitterBundle/api/base.js";
export class ApiShop {
    constructor() {
    }
    static getProduct(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/product?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ];
                json.collection && par.push(`collection=${encodeURI(json.collection)}`);
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                json.maxPrice && par.push(`max_price=${json.maxPrice}`);
                json.minPrice && par.push(`min_price=${json.minPrice}`);
                json.status && par.push(`status=${json.status}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            }
        });
    }
    static getOrder(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/order?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ];
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": (json.data_from === 'user') ? GlobalUser.token : getConfig().config.token
            }
        });
    }
    static getVoucher(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/voucher?${(() => {
                let par = [
                    `limit=${json.limit}`,
                    `page=${json.page}`
                ];
                json.search && par.push(`search=${json.search}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&');
            })()}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": (json.data_from === 'user') ? GlobalUser.token : getConfig().config.token
            }
        });
    }
    static putOrder(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/order`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        });
    }
    static delete(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/product?id=${json.id}`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            }
        });
    }
    static deleteOrders(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/order`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            },
            data: JSON.stringify(json)
        });
    }
    static deleteVoucher(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/voucher?id=${json.id}`,
            "type": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": getConfig().config.token
            }
        });
    }
    static setCollection(json) {
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
        });
    }
    static getCollection() {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/manager/config?key=collection`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName
            }
        });
    }
    static toCheckout(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/checkout`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        });
    }
    static getCheckout(json) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/ec/checkout/preview`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": GlobalUser.token
            },
            data: JSON.stringify(json)
        });
    }
    static getVoucherCode() {
        const glitter = window.glitter;
        return new Promise((resolve, reject) => {
            window.glitter.getPro(ApiShop.voucherID, (response) => {
                resolve(response.data);
            });
        });
    }
    static setVoucherCode(code) {
        window.glitter.setPro(ApiShop.voucherID, code, () => {
        });
    }
    static addToCart(id, count) {
        window.glitter.getPro(ApiShop.cartID, (response) => {
            var _a;
            const cartData = (response.data) ? JSON.parse(response.data) : {};
            cartData[id] = (_a = cartData[id]) !== null && _a !== void 0 ? _a : 0;
            cartData[id] += parseInt(count, 10);
            window.glitter.setPro(ApiShop.cartID, JSON.stringify(cartData), () => {
            });
        });
    }
    static clearCart() {
        window.glitter.setPro(ApiShop.cartID, JSON.stringify({}), () => {
        });
    }
    static getCart() {
        return new Promise((resolve, reject) => {
            window.glitter.getPro(ApiShop.cartID, (response) => {
                const cartData = (response.data) ? JSON.parse(response.data) : {};
                resolve(cartData);
            });
        });
    }
}
ApiShop.voucherID = "voucxasw";
ApiShop.cartID = "lemnoas";
function getConfig() {
    const saasConfig = window.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}

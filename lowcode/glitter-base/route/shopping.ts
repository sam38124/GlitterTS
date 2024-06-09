import { GlobalUser } from '../global/global-user.js';
import { BaseApi } from '../../glitterBundle/api/base.js';
import { Glitter } from '../../glitterBundle/Glitter.js';

export class ApiShop {
    constructor() {}

    static getRebate(query: { userID?: string }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ec/rebate/sum?${(() => {
                    let par = [];
                    query.userID && par.push(`userID=${query.userID}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: !query.userID ? GlobalUser.token : getConfig().config.token,
            },
        });
    }

    static getPaymentMethod(query: { userID?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/payment/method`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: !query.userID ? GlobalUser.token : getConfig().config.token,
            },
        });
    }

    static postWishList(wishList: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/wishlist`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
            data: JSON.stringify({
                product_id: wishList,
            }),
        });
    }

    static deleteWishList(wishList: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/wishlist`,
            type: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
            data: JSON.stringify({
                product_id: wishList,
            }),
        });
    }

    static getWishList() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/wishlist?page=0&limit=200`,
            type: 'get',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
        });
    }

    static checkWishList(product_id: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/checkWishList?product_id=${product_id}`,
            type: 'get',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
        });
    }

    static getProduct(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
        collection?: string;
        maxPrice?: string;
        minPrice?: string;
        status?: string;
        orderBy?: string;
        id_list?: string;
        with_hide_index?: string;
    }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ec/product?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.collection && par.push(`collection=${encodeURI(json.collection)}`);
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.maxPrice && par.push(`max_price=${json.maxPrice}`);
                    json.minPrice && par.push(`min_price=${json.minPrice}`);
                    json.status && par.push(`status=${json.status}`);
                    json.orderBy && par.push(`order_by=${json.orderBy}`);
                    json.id_list && par.push(`id_list=${json.id_list}`);
                    json.with_hide_index && par.push(`with_hide_index=${json.with_hide_index}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': encodeURIComponent(getConfig().config.appName),
            },
        });
    }

    static getOrder(json: { limit: number; page: number; search?: string; email?: string; id?: string; data_from?: 'user' | 'manager' }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ec/order?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.email && par.push(`email=${json.email}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: json.data_from === 'user' ? GlobalUser.token : getConfig().config.token,
            },
        });
    }

    static getVoucher(json: { limit: number; page: number; search?: string; id?: string; data_from?: 'user' | 'manager' }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ec/voucher?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: json.data_from === 'user' ? GlobalUser.token : getConfig().config.token,
            },
        });
    }

    static putOrder(json: { id: string; order_data: any; status?: any }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/order`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }

    static delete(json: { id: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/product?id=${json.id}`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
        });
    }

    static deleteOrders(json: { id: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/order`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }

    static deleteVoucher(json: { id: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/voucher?id=${json.id}`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
        });
    }

    static setCollection(json: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                key: 'collection',
                value: json,
            }),
        });
    }

    static getCollection() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config?key=collection`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
            },
        });
    }

    public static getInvoiceType() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/invoice/invoice-type`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
            },
        });
    }
    public static getLoginForOrder() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/check-login-for-order`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
            },
        });
    }

    public static setShowList(json: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                key: 'product_show_list',
                value: json,
            }),
        });
    }

    static getShowList() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config?key=product_show_list`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
            },
        });
    }

    static selectC2cMap(json: { returnURL: string; logistics: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/delivery/c2cMap`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
            },
            data: JSON.stringify(json),
        });
    }

    static toCheckout(json: {
        line_items: {
            id: number;
            spec: string[];
            count: number;
        }[];
        return_url: string;
        user_info?: {
            name?: string;
            phone?: string;
            address?: string;
            email?: string;
        };
        code?: string;
        use_rebate?: number;
    }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/checkout`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
            data: JSON.stringify(json),
        });
    }

    static getCheckout(json: {
        line_items: {
            id: number;
            spec: string[];
            count: number;
        }[];
        code?: string;
        use_rebate?: number;
    }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/checkout/preview`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
            data: JSON.stringify(json),
        });
    }

    static getVoucherCode() {
        const glitter = (window as any).glitter;
        return new Promise((resolve, reject) => {
            (window as any).glitter.getPro(ApiShop.voucherID, (response: any) => {
                resolve(response.data);
            });
        });
    }

    static setVoucherCode(code: string) {
        (window as any).glitter.setPro(ApiShop.voucherID, code, () => {});
    }

    static setRebateValue(value: string) {
        (window as any).glitter.setPro(ApiShop.rebateID, value, () => {});
    }

    static getRebateValue() {
        const glitter = (window as any).glitter;
        return new Promise((resolve, reject) => {
            (window as any).glitter.getPro(ApiShop.rebateID, (response: any) => {
                resolve(response.data);
            });
        });
    }

    static rebateID = 'asko323';
    static voucherID = 'voucxasw';
    static cartID = 'lemnoas';

    static addToCart(id: string, count: string) {
        (window as any).glitter.getPro(ApiShop.cartID, (response: any) => {
            const cartData = response.data ? JSON.parse(response.data) : {};
            cartData[id] = cartData[id] ?? 0;
            cartData[id] += parseInt(count, 10);
            (window as any).glitter.setPro(ApiShop.cartID, JSON.stringify(cartData), () => {});
        });
    }

    static setToCart(id: string, count: string) {
        (window as any).glitter.getPro(ApiShop.cartID, (response: any) => {
            const cartData = response.data ? JSON.parse(response.data) : {};
            if (parseInt(count, 10) === 0) {
                cartData[id] = undefined;
            } else {
                cartData[id] = parseInt(count, 10);
            }
            (window as any).glitter.setPro(ApiShop.cartID, JSON.stringify(cartData), () => {});
        });
    }

    static clearCart() {
        (window as any).glitter.setPro(ApiShop.cartID, JSON.stringify({}), () => {});
    }

    static getCart() {
        return new Promise((resolve, reject) => {
            (window as any).glitter.getPro(ApiShop.cartID, (response: any) => {
                const cartData = response.data ? JSON.parse(response.data) : {};
                resolve(cartData);
            });
        });
    }

    static ecDataAnalyze(tagArray: string[]) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/dataAnalyze?tags=${tagArray.join(',')}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
        });
    }

    static getShippingStatusArray() {
        return [
            { title: '未出貨', value: 'wait' },
            { title: '配送中', value: 'shipping' },
            { title: '已送達', value: 'finish' },
        ];
    }
}

function getConfig() {
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    return saasConfig;
}

function getBaseUrl() {
    return getConfig().config.url;
}

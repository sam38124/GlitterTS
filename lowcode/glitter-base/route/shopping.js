import { GlobalUser } from '../global/global-user.js';
import { BaseApi } from '../../glitterBundle/api/base.js';
export class ApiShop {
    constructor() {
    }
    static getRebate(query) {
        return BaseApi.create({
            url: getBaseUrl() +
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
    static getPaymentMethod(query) {
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
    static postWishList(wishList) {
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
    static deleteWishList(wishList) {
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
    static checkWishList(product_id) {
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
    static getProduct(json) {
        return BaseApi.create({
            url: getBaseUrl() +
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
    static orderListFilterString(obj) {
        if (!obj)
            return [];
        let list = [];
        if (obj) {
            if (obj.created_time && obj.created_time.length > 1 && (obj === null || obj === void 0 ? void 0 : obj.created_time[0].length) > 0 && (obj === null || obj === void 0 ? void 0 : obj.created_time[1].length) > 0) {
                list.push(`created_time=${obj.created_time[0]},${obj.created_time[1]}`);
            }
            if (obj.shipment.length > 0) {
                list.push(`shipment=${obj.shipment.join(',')}`);
            }
            if (obj.progress.length > 0) {
                list.push(`progress=${obj.progress.join(',')}`);
            }
            if (obj.payload.length > 0) {
                list.push(`status=${obj.payload.join(',')}`);
            }
            if (obj.orderStatus.length > 0) {
                list.push(`orderStatus=${obj.orderStatus.join(',')}`);
            }
        }
        return list;
    }
    static getOrder(json) {
        const filterString = this.orderListFilterString(json.filter);
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/ec/order?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.email && par.push(`email=${json.email}`);
                    json.status && par.push(`status=${json.status}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    json.orderString && par.push(`orderString=${json.orderString}`);
                    json.archived && par.push(`archived=${json.archived}`);
                    filterString.length > 0 && par.push(filterString.join('&'));
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
    static getVoucher(json) {
        return BaseApi.create({
            url: getBaseUrl() +
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
    static putOrder(json) {
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
    static delete(json) {
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
    static deleteOrders(json) {
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
    static deleteVoucher(json) {
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
    static setCollection(json) {
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
    static getInvoiceType() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/invoice/invoice-type`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
            },
        });
    }
    static getLoginForOrder() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/check-login-for-order`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
            },
        });
    }
    static setShowList(json) {
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
    static selectC2cMap(json) {
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
    static toCheckout(json) {
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
    static getCheckout(json) {
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
    static setRebateValue(value) {
        window.glitter.setPro(ApiShop.rebateID, value, () => {
        });
    }
    static getRebateValue() {
        const glitter = window.glitter;
        return new Promise((resolve, reject) => {
            window.glitter.getPro(ApiShop.rebateID, (response) => {
                resolve(response.data);
            });
        });
    }
    static addToCart(id, count) {
        window.glitter.getPro(ApiShop.cartID, (response) => {
            var _a;
            const cartData = response.data ? JSON.parse(response.data) : {};
            cartData[id] = (_a = cartData[id]) !== null && _a !== void 0 ? _a : 0;
            cartData[id] += parseInt(count, 10);
            window.glitter.setPro(ApiShop.cartID, JSON.stringify(cartData), () => {
            });
        });
    }
    static setToCart(id, count) {
        window.glitter.getPro(ApiShop.cartID, (response) => {
            const cartData = response.data ? JSON.parse(response.data) : {};
            if (parseInt(count, 10) === 0) {
                cartData[id] = undefined;
            }
            else {
                cartData[id] = parseInt(count, 10);
            }
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
                const cartData = response.data ? JSON.parse(response.data) : {};
                resolve(cartData);
            });
        });
    }
    static ecDataAnalyze(tagArray) {
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
    static getOrderStatusArray() {
        return [
            { title: '已完成', value: '1' },
            { title: '處理中', value: '0' },
            { title: '已取消', value: '-1' },
        ];
    }
}
ApiShop.rebateID = 'asko323';
ApiShop.voucherID = 'voucxasw';
ApiShop.cartID = 'lemnoas';
function getConfig() {
    const saasConfig = window.parent.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}

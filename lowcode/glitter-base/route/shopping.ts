import { GlobalUser } from '../global/global-user.js';
import { BaseApi } from '../../glitterBundle/api/base.js';

export class ApiShop {
    static postProduct(cf: { data: any; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/product`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }
    public static postMultiProduct(cf: { data: any; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/product/multiple`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }
    public static putProduct(cf: { data: any; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/product`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }

    static putCollections(cf: { data: any; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/collection`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }

    static deleteCollections(cf: { data: any; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/collection`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }

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
        searchType?: string;
        id?: string;
        collection?: string;
        accurate_search_collection?: boolean;
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
                    json.accurate_search_collection && par.push(`accurate_search_collection=true`);
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.maxPrice && par.push(`max_price=${json.maxPrice}`);
                    json.minPrice && par.push(`min_price=${json.minPrice}`);
                    json.status && par.push(`status=${json.status}`);
                    json.orderBy && par.push(`order_by=${json.orderBy}`);
                    json.id_list && par.push(`id_list=${json.id_list}`);
                    json.with_hide_index && par.push(`with_hide_index=${json.with_hide_index}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    if(location.pathname.includes('/hidden/') || location.pathname.includes('/shop/')){
                        par.push(`show_hidden=true`);
                    }
                  
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': encodeURIComponent(getConfig().config.appName),
                Authorization: ((window.parent as any).glitter.getUrlParameter('type')==='editor' && getConfig().config.token) || GlobalUser.token,
            },
        });
    }

    static orderListFilterString(obj: any): string[] {
        if (!obj) return [];
        let list = [] as string[];
        if (obj) {
            if (obj.created_time.length > 1 && obj?.created_time[0].length > 0 && obj?.created_time[1].length > 0) {
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
    static returnOrderListFilterString(obj: any): string[] {
        if (!obj) return [];
        let list = [] as string[];

        if (obj) {
            if (obj.created_time && obj.created_time.length > 1 && obj?.created_time[0].length > 0 && obj?.created_time[1].length > 0) {
                list.push(`created_time=${obj.created_time[0]},${obj.created_time[1]}`);
            }

            if (obj.progress.length > 0) {
                list.push(`progress=${obj.progress.join(',')}`);
            }
            if (obj.refund.length > 0) {
                list.push(`status=${obj.refund.join(',')}`);
            }
        }

        return list;
    }
    static getOrder(json: {
        limit: number;
        page: number;
        search?: string;
        email?: string;
        searchType?: string;
        id?: string;
        data_from?: 'user' | 'manager';
        status?: number;
        order?: string;
        orderString?: string;
        filter?: any;
        archived?: string;
        returnSearch?: 'true';
    }) {
        const filterString = this.orderListFilterString(json.filter);

        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ec/order?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.email && par.push(`email=${json.email}`);
                    json.status && par.push(`status=${json.status}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    json.orderString && par.push(`orderString=${json.orderString}`);
                    json.archived && par.push(`archived=${json.archived}`);
                    json.returnSearch && par.push(`returnSearch=${json.returnSearch ?? 'false'}`);
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

    static getSearchReturnOrder(json: {
        limit: number;
        page: number;
        search?: string;
        email?: string;
        searchType?: string;
        id?: string;
        data_from?: 'user' | 'manager';
        status?: number;
        order?: string;
        orderString?: string;
        filter?: any;
        archived?: string;
    }) {
        const filterString = this.returnOrderListFilterString(json.filter);
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ec/returnOrder?${(() => {
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

    static searchOrderExist(orderId: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/order/search`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
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

    static setShowList(json: any) {
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
        customer_info?: {
            name?: string;
            phone?: string;
            email?: string;
        };
        code?: string;
        use_rebate?: number;
        custom_form_format?: any;
        custom_form_data?: any;
        distribution_code?: string;
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
        distribution_code?: string;
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

    static getManualCheckout(json: {
        line_items: {
            id: number;
            spec: string[];
            count: number;
        }[];
        code?: string;
        use_rebate?: number;
    }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/manager/checkout/preview`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }

    static toManualCheckout(passData: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/manager/checkout/`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(passData),
        });
    }

    static getOrderPaymentMethod() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/order/payment-method`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
        });
    }

    static proofPurchase(order_id: string, text: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/order/proof-purchase`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                order_id: order_id,
                text: text,
            }),
        });
    }

    static repay(order_id: string, return_url: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/checkout/repay`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                return_url: return_url,
                order_id: order_id,
            }),
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

    static getOrderStatusArray() {
        return [
            { title: '已完成', value: '1' },
            { title: '處理中', value: '0' },
            { title: '已取消', value: '-1' },
        ];
    }

    static getVariants(json: {
        limit: number;
        page: number;
        search?: string;
        searchType?: string;
        id?: string;
        id_list?: string;
        collection?: string;
        accurate_search_collection?: boolean;
        orderBy?: string;
        status?: string;
        stockCount?: { key: string; value: string };
    }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ec/product/variants?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.collection && par.push(`collection=${encodeURI(json.collection)}`);
                    json.accurate_search_collection && par.push(`accurate_search_collection=true`);
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.status && par.push(`status=${json.status}`);
                    json.orderBy && par.push(`order_by=${json.orderBy}`);
                    json.id_list && par.push(`id_list=${json.id_list}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    if (json.stockCount && json.stockCount.key !== '') {
                        par.push(`stockCount=${json.stockCount.key},${json.stockCount.value}`);
                    }
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': encodeURIComponent(getConfig().config.appName),
            },
        });
    }

    static putVariants(cf: { data: any; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/product/variants`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }

    static postReturnOrder(passData: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/returnOrder/`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(passData),
        });
    }
    static putReturnOrder(passData: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/returnOrder/`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(passData),
        });
    }
}

function getConfig() {
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    return saasConfig;
}

function getBaseUrl() {
    return getConfig().config.url;
}


const interVal=setInterval(()=>{
    if((window as any).glitter){
        clearInterval(interVal);
        (window as any).glitter.share.ApiShop=ApiShop
    }
},100)

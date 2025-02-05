import { GlobalUser } from '../global/global-user.js';
import { BaseApi } from '../../glitterBundle/api/base.js';

export class ApiShop {
    static getGuideable() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config?key=guideable`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
        });
    }
    static getFEGuideable() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config?key=FEguideable`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
        });
    }
    static setGuideable(json: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                key: 'guideable',
                value: {
                    view: true,
                },
            }),
        });
    }
    static setFEGuideable(json: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                key: 'FEguideable',
                value: {
                    view: true,
                },
            }),
        });
    }
    static getGuide() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config?key=guide`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
        });
    }
    static setGuide(json: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                key: 'guide',
                value: json,
            }),
        });
    }
    static getEditorGuide() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config?key=editorGuide`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
        });
    }
    static setEditorGuide(json: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                key: 'editorGuide',
                value: json,
            }),
        });
    }
    static getFEGuideLeave() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config?key=FEGuideLeave`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: GlobalUser.token,
            },
        });
    }
    static setFEGuideLeave() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/manager/config`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                key: 'FEGuideLeave',
                value: {
                    view: true,
                },
            }),
        });
    }
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

    static sortCollections(cf: { data: any; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/collection/sort`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
            data: JSON.stringify(cf.data),
        });
    }

    static getCollectionProducts(cf: { tagString?: string; token?: string }) {
        const q = (() => {
            if (cf.tagString) {
                return `tag=${cf.tagString}`;
            } else {
                return '';
            }
        })();
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/collection/products?${q}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
        });
    }

    static getCollectionProductVariants(cf: { tagString?: string; token?: string }) {
        const q = (() => {
            if (cf.tagString) {
                return `tag=${cf.tagString}`;
            } else {
                return '';
            }
        })();
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/collection/product/variants?${q}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || getConfig().config.token,
            },
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

    static getShippingMethod() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/shippingMethod`,
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
        domain?: string;
        id?: string;
        collection?: string;
        accurate_search_collection?: boolean;
        accurate_search_text?: boolean;
        maxPrice?: string;
        minPrice?: string;
        status?: string;
        channel?: string;
        schedule?: boolean;
        orderBy?: string;
        id_list?: string;
        with_hide_index?: string;
        productType?: string;
        filter_visible?: string;
        app_name?: string;
        show_hidden?: boolean;
        view_source?: string;
        distribution_code?: string;
    }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ec/product?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.collection && par.push(`collection=${encodeURI(json.collection)}`);
                    json.accurate_search_collection && par.push(`accurate_search_collection=true`);
                    json.accurate_search_text && par.push(`accurate_search_text=true`);
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.domain && par.push(`domain=${json.domain}`);
                    json.maxPrice && par.push(`max_price=${json.maxPrice}`);
                    json.minPrice && par.push(`min_price=${json.minPrice}`);
                    json.status && par.push(`status=${json.status}`);
                    json.channel && par.push(`channel=${json.channel}`);
                    if (json.schedule === true || json.schedule === false) {
                        par.push(`schedule=${json.schedule}`);
                    }
                    json.orderBy && par.push(`order_by=${json.orderBy}`);
                    json.id_list && par.push(`id_list=${json.id_list}`);
                    json.productType && par.push(`productType=${json.productType}`);
                    json.with_hide_index && par.push(`with_hide_index=${json.with_hide_index}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    json.filter_visible && par.push(`filter_visible=${json.filter_visible}`);
                    json.view_source && par.push(`view_source=${json.view_source}`);
                    json.show_hidden && par.push(`show_hidden=${json.show_hidden}`);
                    json.distribution_code && par.push(`distribution_code=${json.distribution_code}`);
                    if (location.pathname.includes('/hidden/')) {
                        par.push(`filter_visible=false`);
                    } else if ((window as any).glitter.getUrlParameter('function') === 'user-editor') {
                        par.push(`filter_visible=true`);
                    }
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': json.app_name || ((window as any).glitter.getUrlParameter('type') === 'find_idea' ? (window as any).appName : encodeURIComponent(getConfig().config.appName)),
                Authorization: ((window.parent as any).glitter.getUrlParameter('type') === 'editor' && getConfig().config.token) || GlobalUser.token,
            },
        });
    }

    static getProductDomain(json: { id?: string; search?: string; domain?: string; app_name?: string }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ec/product/domain?${(() => {
                    let par = [];
                    json.id && par.push(`id=${json.id}`);
                    json.search && par.push(`search=${json.search}`);
                    json.domain && par.push(`domain=${json.domain}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': json.app_name || ((window as any).glitter.getUrlParameter('type') === 'find_idea' ? (window as any).appName : encodeURIComponent(getConfig().config.appName)),
                Authorization: ((window.parent as any).glitter.getUrlParameter('type') === 'editor' && getConfig().config.token) || GlobalUser.token,
            },
        });
    }

    static orderListFilterString(obj: any): string[] {
        if (!obj) return [];
        let list = [] as string[];
        if (obj) {
            if (obj.created_time && obj.created_time.length > 1 && obj?.created_time[0].length > 0 && obj?.created_time[1].length > 0) {
                list.push(`created_time=${obj.created_time[0]},${obj.created_time[1]}`);
            }
            if (obj.shipment && obj.shipment.length > 0) {
                list.push(`shipment=${obj.shipment.join(',')}`);
            }
            if (obj.progress && obj.progress.length > 0) {
                list.push(`progress=${obj.progress.join(',')}`);
            }
            if (obj.payload && obj.payload.length > 0) {
                list.push(`status=${obj.payload.join(',')}`);
            }
            if (obj.orderStatus && obj.orderStatus.length > 0) {
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
    static invoiceListFilterString(obj: any): string[] {
        if (!obj) return [];
        let list = [] as string[];
        if (obj) {
            if (obj.created_time.length > 1 && obj?.created_time[0].length > 0 && obj?.created_time[1].length > 0) {
                list.push(`created_time=${obj.created_time[0]},${obj.created_time[1]}`);
            }
            if (obj.invoice_type.length == 1) {
                list.push(`invoice_type=${obj.invoice_type.join(',')}`);
            }
            if (obj.issue_method.length == 1) {
                list.push(`issue_method=${obj.issue_method.join(',')}`);
            }
            if (obj.status.length > 0) {
                list.push(`status=${obj.status.join(',')}`);
            }
        }
        return list;
    }
    static allowanceListFilterString(obj: any): string[] {
        if (!obj) return [];
        let list = [] as string[];
        if (obj) {
            if (obj.created_time.length > 1 && obj?.created_time[0].length > 0 && obj?.created_time[1].length > 0) {
                list.push(`created_time=${obj.created_time[0]},${obj.created_time[1]}`);
            }
            if (obj.status.length > 0) {
                list.push(`status=${obj.status.join(',')}`);
            }
        }

        return list;
    }
    static getOrder(json: {
        limit: number;
        page: number;
        search?: string;
        email?: string;
        phone?: number;
        searchType?: string;
        id?: string;
        data_from?: 'user' | 'manager';
        status?: number;
        order?: string;
        orderString?: string;
        filter?: any;
        is_pos?: boolean;
        archived?: string;
        distribution_code?: string;
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
                    json.phone && par.push(`phone=${json.phone}`);
                    json.status && par.push(`status=${json.status}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    json.orderString && par.push(`orderString=${json.orderString}`);
                    json.archived && par.push(`archived=${json.archived}`);
                    json.distribution_code && par.push(`distribution_code=${json.distribution_code}`);
                    json.returnSearch && par.push(`returnSearch=${json.returnSearch ?? 'false'}`);
                    if (json.is_pos === true || json.is_pos === false) {
                        par.push(`is_pos=${json.is_pos}`);
                    }
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

    static getVoucher(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
        date_confirm?: boolean;
        user_email?: string;
        data_from?: 'user' | 'manager';
        voucher_type?: 'rebate' | 'discount' | 'shipment_free' | 'add_on_items' | 'giveaway';
    }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/ec/voucher?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.date_confirm && par.push(`date_confirm=${json.date_confirm}`);
                    json.user_email && par.push(`user_email=${json.user_email}`);
                    json.voucher_type && par.push(`voucher_type=${json.voucher_type}`);
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

    static cancelOrder(id: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/order/cancel`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window as any).appName,
                Authorization: GlobalUser.token,
            },
            data: JSON.stringify({ id }),
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
        return new Promise<{ result: boolean; response: any }>((resolve, reject) => {
            (window as any).glitter.share._public_config = (window as any).glitter.share._public_config ?? {};
            const config = (window as any).glitter.share._public_config;
            if (config[`collection-manager`] && (window as any).glitter.getUrlParameter('cms') !== 'true') {
                resolve(config[`collection-manager`]);
                return;
            }
            BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/manager/config?key=collection`,
                type: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': getConfig().config.appName,
                },
            }).then((res) => {
                config[`collection-manager`] = res;
                resolve(res);
            });
        });
    }
    static getInvoice(json: { limit: number; page: number; search?: string; searchType?: string; orderString?: string; filter?: any }) {
        let filterString = this.invoiceListFilterString(json.filter);
        // const filterString = this.orderListFilterString(json.filter);
        // filterString.length > 0 && par.push(filterString.join('&'));
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/invoice?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    json.orderString && par.push(`orderString=${json.orderString}`);
                    json.filter && par.push(`filter=${JSON.stringify(json.filter)}`);
                    filterString.length > 0 && par.push(filterString.join('&'));
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
        });
    }
    static getAllowance(json: { limit: number; page: number; search?: string; searchType?: string; orderString?: string; filter?: any }) {
        let filterString = this.allowanceListFilterString(json.filter);
        // const filterString = this.orderListFilterString(json.filter);
        // filterString.length > 0 && par.push(filterString.join('&'));
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/invoice/allowance?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    json.orderString && par.push(`orderString=${json.orderString}`);
                    json.filter && par.push(`filter=${json.filter}`);
                    filterString.length > 0 && par.push(filterString.join('&'));
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
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
        custom_receipt_form?: any;
        custom_receipt_data?: any;
        custom_form_data?: any;
        distribution_code?: string;
        give_away?: any;
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
        checkOutType?: 'manual' | 'auto' | 'POS'; //結帳類型
        pos_store?: string; //POS的門市
        use_rebate?: number;
        distribution_code?: string;
        user_info?: any;
        code_array?: string[];
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
        user_info: {
            shipment: string;
        };
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
    static toPOSCheckout(passData: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/pos/checkout/`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(passData),
        });
    }
    static toPOSLinePay(passData: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/pos/linePay`,
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

    static proofPurchase(order_id: string, text: any) {
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

    public static app_subscription(receipt: string, app_name: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/apple-webhook`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window.parent as any).glitterBase,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                base64: {
                    app_name: app_name,
                    'receipt-data': receipt,
                },
            }),
        });
    }

    // static getVoucherCode() {
    //     const glitter = (window as any).glitter;
    //     return new Promise((resolve, reject) => {
    //         (window as any).glitter.getPro(ApiShop.voucherID, (response: any) => {
    //             resolve(response.data);
    //         });
    //     });
    // }
    //
    // static setVoucherCode(code: string) {
    //     (window as any).glitter.setPro(ApiShop.voucherID, code, () => {});
    // }

    // static setRebateValue(value: string) {
    //     (window as any).glitter.setPro(ApiShop.rebateID, value, () => {});
    // }
    //
    // static getRebateValue() {
    //     const glitter = (window as any).glitter;
    //     return new Promise((resolve, reject) => {
    //         (window as any).glitter.getPro(ApiShop.rebateID, (response: any) => {
    //             resolve(response.data);
    //         });
    //     });
    // }

    static rebateID = 'asko323';
    static voucherID = 'voucxasw';
    static cartID = 'lemnoas';

    // static addToCart(id: string, count: string) {
    //     (window as any).glitter.getPro(ApiShop.cartID, (response: any) => {
    //         const cartData = response.data ? JSON.parse(response.data) : {};
    //         cartData[id] = cartData[id] ?? 0;
    //         cartData[id] += parseInt(count, 10);
    //         (window as any).glitter.setPro(ApiShop.cartID, JSON.stringify(cartData), () => {});
    //     });
    // }

    // static setToCart(id: string, count: string) {
    //     (window as any).glitter.getPro(ApiShop.cartID, (response: any) => {
    //         const cartData = response.data ? JSON.parse(response.data) : {};
    //         if (parseInt(count, 10) === 0) {
    //             cartData[id] = undefined;
    //         } else {
    //             cartData[id] = parseInt(count, 10);
    //         }
    //         (window as any).glitter.setPro(ApiShop.cartID, JSON.stringify(cartData), () => {});
    //     });
    // }
    //
    // static clearCart() {
    //     (window as any).glitter.setPro(ApiShop.cartID, JSON.stringify({}), () => {});
    // }

    // static getCart() {
    //     return new Promise((resolve, reject) => {
    //         (window as any).glitter.getPro(ApiShop.cartID, (response: any) => {
    //             const cartData = response.data ? JSON.parse(response.data) : {};
    //             resolve(cartData);
    //         });
    //     });
    // }

    static ecDataAnalyze(tagArray: string[], query: string = '') {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/dataAnalyze?tags=${tagArray.join(',')}&query=${query}`,
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
        productType?: 'product' | 'addProduct' | 'giveaway' | 'hidden' | 'all';
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
                    json.productType && par.push(`productType=${json.productType}`);
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
    static recoverVariants(cf: { data: any; token?: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/product/variants/recoverStock`,
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
    static postInvoice(passData: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/customer_invoice`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(passData),
        });
    }
    static voidInvoice(invoiceNo: string, voidReason: string, createDate: string) {
        const passData = {
            invoiceNo: invoiceNo,
            voidReason: voidReason,
            createDate: createDate,
        };
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/void_invoice`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(passData),
        });
    }
    static postAllowance(passData: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/allowance_invoice`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(passData),
        });
    }
    static voidAllowance(invoiceNo: string, allowanceNo: string, voidReason: string) {
        const passData = {
            invoiceNo: invoiceNo,
            allowanceNo: allowanceNo,
            voidReason: voidReason,
        };
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/ec/void_allowance`,
            type: 'POST',
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

const interVal = setInterval(() => {
    if ((window as any).glitter) {
        clearInterval(interVal);
        (window as any).glitter.share.ApiShop = ApiShop;
    }
}, 100);

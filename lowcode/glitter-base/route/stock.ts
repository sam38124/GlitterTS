import { BaseApi } from '../../glitterBundle/api/base.js';

export type StockHistoryType = 'restocking' | 'transfer' | 'checking';

export type ContentProduct = {
    variant_id: number;
    cost: number;
    note: string;
    transfer_count: number; // 預計進貨數, 預計調入數
    recent_count?: number; // 實際進貨數, 實際調入數
    check_count: number; // 盤點數
    replenishment_count?: number; // 此次補貨數
    title?: string;
    spec?: string;
    sku?: '';
    stock?: number;
    barcode?: string;
};

export type StockHistoryData = {
    id: string;
    type: StockHistoryType;
    status: number;
    order_id: string;
    created_time: string;
    content: {
        vendor: string;
        store_in: string; // 調入庫存點
        store_out: string; // 調出庫存點、盤點庫存點
        check_member: string; // 盤點人
        check_according: '' | 'all' | 'collection' | 'product'; // 商品盤點類型
        note: string;
        total_price?: number;
        product_list: ContentProduct[];
        changeLogs: {
            time: string;
            text: string;
            user: number;
            status: number;
            user_name?: string;
            product_list?: ContentProduct[];
        }[];
    };
};

export class ApiStock {
    static getStoreProductList(json: { page: number; limit: number; search: string; variant_id_list?: number[] | string[] }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/stock/store/productList?${(() => {
                    let par = [`page=${json.page}`, `limit=${json.limit}`, `search=${json.search}`];
                    if (json.variant_id_list && json.variant_id_list.length > 0) {
                        par.push(`variant_id_list=${json.variant_id_list.join(',')}`);
                    }
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

    static deleteStore(json: { id: string }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/stock/store`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }

    static getStockHistory(json: { page: number; limit: number; search: string; queryType?: string; type: string; order_id?: string }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/stock/history?${(() => {
                    let par = [`page=${json.page}`, `limit=${json.limit}`, `search=${json.search}`, `type=${json.type}`];
                    json.queryType && par.push(`queryType=${json.queryType}`);
                    json.order_id && par.push(`order_id=${json.order_id}`);
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

    static postStockHistory(json: StockHistoryData) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/stock/history`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({ data: json }),
        });
    }

    static putStockHistory(json: StockHistoryData) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/stock/history`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({ data: json }),
        });
    }

    static deleteStockHistory(json: StockHistoryData) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/stock/history`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({ data: json }),
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

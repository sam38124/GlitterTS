import { IToken } from '../models/Auth.js';
type StockList = {
    [key: string]: {
        count: number;
    };
};
export type StockHistoryType = 'restocking' | 'transfer' | 'checking';
type ContentProduct = {
    variant_id: number;
    cost: number;
    note: string;
    transfer_count: number;
    recent_count?: number;
    check_count: number;
    replenishment_count?: number;
    title?: string;
    spec?: string;
    sku?: '';
    barcode?: '';
};
type StockHistoryData = {
    id: string;
    type: StockHistoryType;
    status: number;
    order_id: string;
    created_time: string;
    content: {
        vendor: string;
        store_in: string;
        store_out: string;
        check_member: string;
        check_according: '' | 'all' | 'collection' | 'product';
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
export declare class Stock {
    app: string;
    token: IToken | undefined;
    constructor(app: string, token?: IToken);
    productList(json: {
        page: string;
        limit: string;
        search: string;
        variant_id_list?: string;
    }): Promise<{
        total: any;
        data: any;
    } | undefined>;
    productStock(json: {
        page: string;
        limit: string;
        variant_id_list: string;
    }): Promise<{
        total: any;
        data: any;
    } | undefined>;
    deleteStoreProduct(store_id: string): Promise<{
        data: boolean;
        process: string;
    } | undefined>;
    allocateStock(stockList: StockList, requiredCount: number): {
        stockList: StockList;
        deductionLog: {
            [key: string]: number;
        };
        totalDeduction: number;
        remainingCount: number;
    };
    recoverStock(variant: any): Promise<void>;
    shippingStock(variant: any): Promise<void>;
    getHistory(json: {
        page: string;
        limit: string;
        search: string;
        type: StockHistoryType;
        order_id: string;
        queryType: string;
    }): Promise<{
        total: any;
        data: any;
    } | undefined>;
    postHistory(json: StockHistoryData): Promise<{
        data: any;
    } | undefined>;
    putHistory(token: any, json: StockHistoryData): Promise<{
        data: boolean;
    } | undefined>;
    static formatStockContent(data: {
        type: 'plus' | 'minus' | 'equal';
        store: string;
        count: number;
        product_content: any;
        variant_content: any;
    }): {
        product_content: any;
        variant_content: any;
    };
    deleteHistory(json: StockHistoryData): Promise<{
        data: boolean;
    } | undefined>;
}
export {};

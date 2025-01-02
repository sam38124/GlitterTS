import { IToken } from '../models/Auth.js';
type StockList = {
    [key: string]: {
        count: number;
    };
};
export type StockHistoryType = 'restocking' | 'transfer' | 'checking';
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
        check_according: 'all' | 'collection' | 'product';
        note: string;
        product_list: {
            variant_id: number;
            cost: number;
            note: string;
            transfer_count: number;
            recent_count: number;
            check_count: number;
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
    getHistory(json: {
        page: string;
        limit: string;
        search: string;
        type: StockHistoryType;
    }): Promise<{
        total: any;
        data: any;
    } | undefined>;
    postHistory(json: StockHistoryData): Promise<{
        data: boolean;
    } | undefined>;
    putHistory(json: StockHistoryData): Promise<{
        data: boolean;
    } | undefined>;
}
export {};

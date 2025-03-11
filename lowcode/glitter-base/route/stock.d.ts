export type StockHistoryType = 'restocking' | 'transfer' | 'checking';
export type ContentProduct = {
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
export declare class ApiStock {
    static getStoreProductList(json: {
        page: number;
        limit: number;
        search: string;
        variant_id_list?: number[] | string[];
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getStoreProductStock(json: {
        page: number;
        limit: number;
        variant_id_list: number[] | string[];
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static deleteStore(json: {
        id: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getStockHistory(json: {
        page: number;
        limit: number;
        search?: string;
        queryType?: string;
        type: string;
        order_id?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static postStockHistory(json: StockHistoryData): Promise<{
        result: boolean;
        response: any;
    }>;
    static putStockHistory(json: StockHistoryData): Promise<{
        result: boolean;
        response: any;
    }>;
    static deleteStockHistory(json: StockHistoryData): Promise<{
        result: boolean;
        response: any;
    }>;
}

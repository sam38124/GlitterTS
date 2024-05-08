import { IToken } from '../models/Auth.js';
interface VoucherData {
    title: string;
    method: 'percent' | 'fixed';
    reBackType: 'rebate' | 'discount' | 'shipment_free';
    trigger: 'auto' | 'code';
    value: string;
    for: 'collection' | 'product' | 'all';
    rule: 'min_price' | 'min_count';
    forKey: string[];
    ruleValue: number;
    startDate: string;
    startTime: string;
    endDate?: string;
    endTime?: string;
    status: 0 | 1 | -1;
    type: 'voucher';
    code?: string;
    overlay: boolean;
    bind?: {
        id: string;
        spec: string[];
        count: number;
        sale_price: number;
        collection: string[];
        discount_price: number;
        rebate: number;
        shipment_fee: number;
    }[];
    start_ISO_Date: string;
    end_ISO_Date: string;
    discount_total: number;
    rebate_total: number;
}
export declare class Shopping {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    deleteRebate(cf: {
        id: string;
    }): Promise<void>;
    getProduct(query: {
        page: number;
        limit: number;
        id?: string;
        search?: string;
        collection?: string;
        min_price?: string;
        max_price?: string;
        status?: string;
        order_by?: string;
        id_list?: string;
    }): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    querySql(querySql: string[], query: {
        page: number;
        limit: number;
        id?: string;
        order_by?: string;
    }): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    deleteProduct(query: {
        id: string;
    }): Promise<{
        result: boolean;
    }>;
    deleteVoucher(query: {
        id: string;
    }): Promise<{
        result: boolean;
    }>;
    toCheckout(data: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
            collection?: string[];
            title?: string;
            preview_image?: string;
            sku: string;
            shipment_fee: number;
        }[];
        email?: string;
        return_url: string;
        user_info: any;
        code?: string;
        use_rebate?: number;
        use_wallet?: number;
    }, type?: 'add' | 'preview'): Promise<{
        data: {
            lineItems: {
                id: string;
                spec: string[];
                count: number;
                sale_price: number;
                collection: string[];
                title: string;
                preview_image: string;
                shipment_fee: number;
            }[];
            total: number;
            email: string;
            user_info: any;
            code?: string | undefined;
            shipment_fee: number;
            rebate: number;
            use_rebate: number;
            orderID: string;
            shipment_support: string[];
            use_wallet: number;
        };
        is_free?: undefined;
        off_line?: undefined;
        form?: undefined;
    } | {
        is_free: boolean;
        data?: undefined;
        off_line?: undefined;
        form?: undefined;
    } | {
        off_line: boolean;
        data?: undefined;
        is_free?: undefined;
        form?: undefined;
    } | {
        form: any;
        data?: undefined;
        is_free?: undefined;
        off_line?: undefined;
    }>;
    checkVoucher(cart: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
            collection: string[];
            discount_price?: number;
            shipment_fee: number;
            rebate?: number;
        }[];
        discount?: number;
        rebate?: number;
        total: number;
        email: string;
        user_info: any;
        shipment_fee: number;
        voucherList?: VoucherData[];
        code?: string;
    }): Promise<void>;
    putOrder(data: {
        id: string;
        orderData: {
            id: number;
            cart_token: string;
            status: number;
            email: string;
            orderData: {
                email: string;
                total: number;
                lineItems: {
                    id: number;
                    spec: string[];
                    count: string;
                    sale_price: number;
                }[];
                user_info: {
                    name: string;
                    email: string;
                    phone: string;
                    address: string;
                };
            };
            created_time: string;
            progress: 'finish' | 'wait' | 'shipping';
        };
        status: number;
    }): Promise<{
        result: string;
        orderData: {
            id: number;
            cart_token: string;
            status: number;
            email: string;
            orderData: {
                email: string;
                total: number;
                lineItems: {
                    id: number;
                    spec: string[];
                    count: string;
                    sale_price: number;
                }[];
                user_info: {
                    name: string;
                    email: string;
                    phone: string;
                    address: string;
                };
            };
            created_time: string;
            progress: 'finish' | 'wait' | 'shipping';
        };
    }>;
    deleteOrder(req: {
        id: string;
    }): Promise<{
        result: boolean;
    }>;
    getCheckOut(query: {
        page: number;
        limit: number;
        id?: string;
        search?: string;
        email?: string;
        status?: string;
    }): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    postVariantsAndPriceValue(content: any): Promise<void>;
    getDataAnalyze(tags: string[]): Promise<any>;
    getRecentActiveUser(): Promise<{
        recent: any;
        months: any;
    }>;
    getSalesInRecentMonth(): Promise<{
        recent_month_total: number;
        previous_month_total: number;
        gap: number;
    }>;
    getHotProducts(): Promise<{
        series: number[];
        categories: string[];
    }>;
    getOrdersInRecentMonth(): Promise<{
        recent_month_total: any;
        previous_month_total: any;
        gap: number;
    }>;
    getOrdersPerMonth1Year(): Promise<{
        countArray: any[];
    }>;
    getSalesPerMonth1Year(): Promise<{
        countArray: number[];
    }>;
    getOrderAvgSalePrice(): Promise<{
        countArray: number[];
    }>;
    getCollectionProducts(tag: string): Promise<any>;
    putCollection(data: any): Promise<{}>;
    deleteCollection(id_array: any): Promise<{}>;
    deleteCollectionProduct(parent_name: string, children_list?: string[]): Promise<{}>;
    containsTagSQL(name: string): string;
    updateProductCollection(content: string[], id: number): Promise<void>;
}
export {};

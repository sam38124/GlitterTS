import { IToken } from '../models/Auth.js';
interface VoucherData {
    id: number;
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
    target: string;
    targetList: string[];
}
export declare class Shopping {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    getProduct(query: {
        page: number;
        limit: number;
        sku?: string;
        id?: string;
        search?: string;
        searchType?: string;
        collection?: string;
        min_price?: string;
        max_price?: string;
        status?: string;
        order_by?: string;
        id_list?: string;
        with_hide_index?: string;
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
        customer_info?: any;
        email?: string;
        return_url: string;
        user_info: any;
        code?: string;
        use_rebate?: number;
        use_wallet?: number;
        checkOutType?: 'manual' | 'auto';
        voucher?: any;
        discount?: number;
        total?: number;
    }, type?: 'add' | 'preview' | 'manual' | 'manual-preview'): Promise<{
        data: {
            customer_info: {};
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
            discount?: number | undefined;
            total: number;
            email: string;
            user_info: any;
            code?: string | undefined;
            shipment_fee: number;
            rebate: number;
            use_rebate: number;
            orderID: string;
            shipment_support: string[];
            shipment_info: any;
            use_wallet: number;
            user_email: string;
            method: string;
            useRebateInfo?: {
                point: number;
                limit?: number | undefined;
                condition?: number | undefined;
            } | undefined;
            voucherList?: VoucherData[] | undefined;
            shipment_form_data: any;
            shipment_form_format: any;
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
    formatUseRebate(total: number, useRebate: number): Promise<{
        point: number;
        limit?: number;
        condition?: number;
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
        status: any;
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
        searchType?: string;
        shipment?: string;
        progress?: string;
        orderStatus?: string;
        created_time?: string;
        orderString?: string;
        archived?: string;
    }): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    releaseCheckout(status: 1 | 0 | -1, order_id: string): Promise<void>;
    checkVoucherLimited(user_id: number, voucher_id: number): Promise<boolean>;
    insertVoucherHistory(user_id: number, order_id: string, voucher_id: number): Promise<void>;
    releaseVoucherHistory(order_id: string, status: 1 | 0): Promise<void>;
    resetVoucherHistory(): Promise<void>;
    postVariantsAndPriceValue(content: any): Promise<void>;
    getDataAnalyze(tags: string[]): Promise<any>;
    getOrderToDay(): Promise<{
        total_count: any;
        un_shipment: any;
        un_pay: any;
        total_amount: number;
    }>;
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
    putCollection(data: any): Promise<{
        result: boolean;
        message: string;
    } | {
        result: boolean;
        message?: undefined;
    }>;
    checkVariantDataType(variants: any[]): void;
    postProduct(content: any): Promise<any>;
    putProduct(content: any): Promise<any>;
    deleteCollection(id_array: any): Promise<{
        result: boolean;
    }>;
    deleteCollectionProduct(parent_name: string, children_list?: string[]): Promise<{
        result: boolean;
    }>;
    containsTagSQL(name: string): string;
    updateProductCollection(content: string[], id: number): Promise<void>;
}
export {};

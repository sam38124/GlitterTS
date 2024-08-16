import { IToken } from '../models/Auth.js';
interface VoucherData {
    id: number;
    title: string;
    method: 'percent' | 'fixed';
    reBackType: 'rebate' | 'discount' | 'shipment_free';
    trigger: 'auto' | 'code' | 'distribution';
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
type Collection = {
    title: string;
    array: Collection[];
    checked: boolean;
    product_id?: number[];
    parentTitles: string[];
    subCollections: string[];
    allCollections: string[];
    seo_title: string;
    seo_content: string;
    seo_image: string;
    code: string;
};
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
        accurate_search_collection?: boolean;
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
    querySqlByVariants(querySql: string[], query: {
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
    private generateOrderID;
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
            shipment_obj: {
                type: string;
                value: number;
            };
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
        pay_status?: number;
        custom_form_format?: any;
        custom_form_data?: any;
        distribution_code?: string;
    }, type?: 'add' | 'preview' | 'manual' | 'manual-preview', replace_order_id?: string): Promise<"" | {
        data: {
            customer_info: any;
            lineItems: {
                id: string;
                spec: string[];
                count: number;
                sale_price: number;
                collection: string[];
                title: string;
                preview_image: string;
                shipment_obj: {
                    type: string;
                    value: number;
                };
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
            custom_form_format?: any;
            custom_form_data?: any;
            distribution_id?: number | undefined;
        };
        is_free?: undefined;
        return_url?: undefined;
        off_line?: undefined;
        form?: undefined;
    } | {
        is_free: boolean;
        return_url: string;
        data?: undefined;
        off_line?: undefined;
        form?: undefined;
    } | {
        off_line: boolean;
        return_url: string;
        data?: undefined;
        is_free?: undefined;
        form?: undefined;
    } | {
        form: any;
        data?: undefined;
        is_free?: undefined;
        return_url?: undefined;
        off_line?: undefined;
    }>;
    getReturnOrder(query: {
        page: number;
        limit: number;
        id?: string;
        search?: string;
        email?: string;
        status?: string;
        searchType?: string;
        progress?: string;
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
    createReturnOrder(data: any): Promise<any>;
    putReturnOrder(data: {
        id: string;
        orderData: any;
        status: any;
    }): Promise<{
        result: string;
        orderData: {
            id: string;
            orderData: any;
            status: any;
        };
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
        distribution_id?: number;
    }): Promise<void>;
    putOrder(data: {
        id: string;
        orderData: any;
        status: any;
    }): Promise<{
        result: string;
        orderData: any;
    }>;
    deleteOrder(req: {
        id: string;
    }): Promise<{
        result: boolean;
    }>;
    proofPurchase(order_id: string, text: string): Promise<{
        result: boolean;
    }>;
    getCheckOut(query: {
        filter_type?: string;
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
        returnSearch?: string;
    }): Promise<any>;
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
    putCollection(replace: Collection, original: Collection): Promise<{
        result: boolean;
        message: string;
    } | {
        result: boolean;
        message?: undefined;
    }>;
    checkVariantDataType(variants: any[]): void;
    postProduct(content: any): Promise<any>;
    updateCollectionFromUpdateProduct(collection: string[]): Promise<void>;
    postMulProduct(content: any): Promise<any>;
    processProducts(productArray: any, insertIDStart: any): Promise<void>;
    putProduct(content: any): Promise<any>;
    deleteCollection(dataArray: Collection[]): Promise<{
        result: boolean;
    }>;
    deleteCollectionProduct(parent_name: string, children_list?: string[]): Promise<{
        result: boolean;
    }>;
    containsTagSQL(name: string): string;
    updateProductCollection(content: string[], id: number): Promise<void>;
    getVariants(query: {
        page: number;
        limit: number;
        search?: string;
        searchType?: string;
        id?: string;
        collection?: string;
        accurate_search_collection?: boolean;
        status?: string;
        id_list?: string;
        order_by?: string;
        min_price?: string;
        max_price?: string;
        stockCount?: string;
    }): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    putVariants(query: {
        id: number;
        product_id: number;
        product_content: any;
        variant_content: any;
    }[]): Promise<{
        result: string;
        orderData: {
            id: number;
            product_id: number;
            product_content: any;
            variant_content: any;
        }[];
    }>;
}
export {};

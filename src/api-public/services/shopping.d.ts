import { IToken } from '../models/Auth.js';
import { DeliveryData } from './delivery.js';
type BindItem = {
    id: string;
    spec: string[];
    count: number;
    sale_price: number;
    collection: string[];
    discount_price: number;
    rebate: number;
    shipment_fee: number;
    times: number;
};
export interface VoucherData {
    id: number;
    title: string;
    code?: string;
    method: 'percent' | 'fixed';
    reBackType: 'rebate' | 'discount' | 'shipment_free' | 'add_on_items' | 'giveaway';
    add_on_products?: string[] | ProductItem[];
    trigger: 'auto' | 'code' | 'distribution';
    value: string;
    for: 'collection' | 'product' | 'all';
    rule: 'min_price' | 'min_count';
    conditionType: 'order' | 'item';
    counting: 'each' | 'single';
    forKey: string[];
    ruleValue: number;
    startDate: string;
    startTime: string;
    endDate?: string;
    endTime?: string;
    status: 0 | 1 | -1;
    type: 'voucher';
    overlay: boolean;
    bind: BindItem[];
    bind_subtotal: number;
    times: number;
    start_ISO_Date: string;
    end_ISO_Date: string;
    discount_total: number;
    rebate_total: number;
    target: string;
    targetList: string[];
    device: ('normal' | 'pos')[];
}
interface ProductItem {
    id: number;
    userID: number;
    content: any;
    created_time: Date | string;
    updated_time: Date | string;
    status: number;
    total_sales?: number;
}
interface seo {
    title: string;
    seo: {
        domain: string;
        title: string;
        content: string;
    };
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
    language_data: {
        'en-US': seo;
        'zh-CN': seo;
        'zh-TW': seo;
    };
};
type CartItem = {
    id: string;
    spec: string[];
    count: number;
    sale_price: number;
    is_gift?: boolean;
    collection: string[];
    title: string;
    preview_image: string;
    shipment_obj: {
        type: string;
        value: number;
    };
    discount_price?: number;
    rebate: number;
};
type Cart = {
    customer_info: any;
    lineItems: CartItem[];
    discount?: number;
    total: number;
    email: string;
    user_info: any;
    code?: string;
    shipment_fee: number;
    rebate: number;
    use_rebate: number;
    orderID: string;
    shipment_support: string[];
    shipment_selector: {
        name: string;
        value: string;
    }[];
    shipment_info: any;
    use_wallet: number;
    user_email: string;
    method: string;
    useRebateInfo?: {
        point: number;
        limit?: number;
        condition?: number;
    };
    user_rebate_sum: number;
    voucherList?: VoucherData[];
    custom_form_format?: any;
    custom_receipt_form?: any;
    custom_form_data?: any;
    distribution_id?: number;
    distribution_info?: any;
    orderSource: '' | 'manual' | 'normal' | 'POS';
    code_array: string[];
    deliveryData?: DeliveryData;
    give_away: CartItem[];
    language?: string;
    pos_info?: any;
};
export declare class Shopping {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    workerExample(data: {
        type: 0 | 1;
        divisor: number;
    }): Promise<{
        type: string;
        divisor: number;
        executionTime: string;
        queryStatus: "success" | "error";
        queryData: any;
    } | {
        type: string;
        divisor: number;
        executionTime: string;
    }>;
    getProduct(query: {
        page: number;
        limit: number;
        sku?: string;
        id?: string;
        domain?: string;
        search?: string;
        searchType?: string;
        collection?: string;
        accurate_search_collection?: boolean;
        accurate_search_text?: boolean;
        min_price?: string;
        max_price?: string;
        status?: string;
        channel?: string;
        order_by?: string;
        id_list?: string;
        with_hide_index?: string;
        is_manger?: boolean;
        show_hidden?: string;
        productType?: string;
        filter_visible?: string;
        language?: string;
        currency_code?: string;
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
    querySqlBySEO(querySql: string[], query: {
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
    linePay(data: any): Promise<unknown>;
    getPostAddressData(address: string): Promise<any>;
    toCheckout(data: {
        line_items: {
            deduction_log?: {
                [p: string]: number;
            };
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
            min_qty?: number;
            collection?: string[];
            title?: string;
            preview_image?: string;
            sku: string;
            shipment_obj: {
                type: string;
                value: number;
            };
            is_gift?: boolean;
            stock: number;
            show_understocking: 'true' | 'false';
        }[];
        customer_info?: any;
        email?: string;
        return_url: string;
        order_id?: string;
        user_info: any;
        code?: string;
        use_rebate?: number;
        use_wallet?: number;
        checkOutType?: 'manual' | 'auto' | 'POS';
        pos_store?: string;
        voucher?: any;
        discount?: number;
        total?: number;
        pay_status?: number;
        custom_form_format?: any;
        custom_form_data?: any;
        custom_receipt_form?: any;
        distribution_code?: string;
        code_array: string[];
        give_away?: {
            id: number;
            spec: string[];
            count: number;
            voucher_id: string;
        }[];
        language?: 'en-US' | 'zh-CN' | 'zh-TW';
        pos_info?: any;
        invoice_select?: string;
        pre_order?: boolean;
    }, type?: 'add' | 'preview' | 'manual' | 'manual-preview' | 'POS', replace_order_id?: string): Promise<any>;
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
    checkVoucher(cart: Cart): Promise<Cart>;
    putOrder(data: {
        id: string;
        orderData: any;
        status: any;
    }): Promise<{
        result: string;
        orderData: any;
    }>;
    cancelOrder(order_id: string): Promise<{
        data: boolean;
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
        is_pos?: string;
        id?: string;
        search?: string;
        email?: string;
        phone?: string;
        status?: string;
        searchType?: string;
        shipment?: string;
        progress?: string;
        orderStatus?: string;
        created_time?: string;
        orderString?: string;
        archived?: string;
        returnSearch?: string;
        distribution_code?: string;
    }): Promise<any>;
    releaseCheckout(status: 1 | 0 | -1, order_id: string): Promise<void>;
    checkVoucherLimited(user_id: number, voucher_id: number): Promise<boolean>;
    insertVoucherHistory(user_id: number, order_id: string, voucher_id: number): Promise<void>;
    releaseVoucherHistory(order_id: string, status: 1 | 0): Promise<void>;
    resetVoucherHistory(): Promise<void>;
    postVariantsAndPriceValue(content: any): Promise<void>;
    updateVariantsWithSpec(data: any, product_id: string, spec: string[]): Promise<void>;
    calcVariantsStock(calc: number, stock_id: string, product_id: string, spec: string[]): Promise<void>;
    getDataAnalyze(tags: string[], query?: any): Promise<any>;
    generateTimeRange(index: number): {
        startISO: string;
        endISO: string;
    };
    formatDateString(isoDate?: string): string;
    getActiveRecentYear(): Promise<{
        count_array: number[];
    }>;
    getActiveRecentWeek(): Promise<{
        count_array: number[];
    }>;
    getActiveRecentMonth(): Promise<{
        count_array: number[];
    }>;
    getActiveRecentCustom(query: string): Promise<{
        count_array: number[];
    }>;
    getRegisterMonth(): Promise<{
        countArray: any[];
    }>;
    getRegisterCustom(query: string): Promise<{
        countArray: any[];
    }>;
    getRegister2week(): Promise<{
        countArray: any[];
    }>;
    getRegisterYear(): Promise<{
        today: any;
        count_register: any[];
        count_2_week_register: any[];
    }>;
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
    getHotProducts(duration: 'month' | 'day' | 'all', query?: string): Promise<{
        series: number[];
        categories: string[];
        product_list: {
            title: string;
            count: number;
            preview_image: string;
            sale_price: number;
            pos_info: any;
        }[];
    }>;
    getOrdersInRecentMonth(): Promise<{
        recent_month_total: any;
        previous_month_total: any;
        gap: number;
    }>;
    getOrdersPerMonth2week(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrdersPerMonth(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrdersPerMonthCostom(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrdersPerMonth1Year(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    static isComeStore(checkout: any, qData: any): boolean;
    getSalesPerMonth1Year(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getSalesPerMonth2week(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getSalesPerMonth(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    diffDates(startDateObj: Date, endDateObj: Date): number;
    getSalesPerMonthCustom(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrderAvgSalePriceYear(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrderAvgSalePrice(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrderAvgSalePriceMonth(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrderAvgSalePriceCustomer(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getCollectionProducts(tags: string): Promise<any>;
    getCollectionProductVariants(tags: string): Promise<any>;
    putCollection(replace: Collection, original: Collection): Promise<{
        result: boolean;
        message: string;
    } | {
        result: boolean;
        message?: undefined;
    }>;
    sortCollection(data: Collection[]): Promise<boolean>;
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
    checkDuring(jsonData: {
        startDate: string;
        startTime: string;
        endDate?: string;
        endTime?: string;
    }): boolean;
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
        productType?: string;
    }): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    getDomain(query: {
        id?: string;
        search?: string;
        domain?: string;
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
    postCustomerInvoice(obj: {
        orderID: any;
        invoice_data: any;
        orderData: any;
    }): Promise<void>;
    voidInvoice(obj: {
        invoice_no: string;
        reason: string;
        createDate: string;
    }): Promise<void>;
    allowanceInvoice(obj: {
        invoiceID: string;
        allowanceData: any;
        orderID: string;
        orderData: any;
        allowanceInvoiceTotalAmount: string;
        itemList: any;
        invoiceDate: string;
    }): Promise<boolean>;
    voidAllowance(obj: {
        invoiceNo: string;
        allowanceNo: string;
        voidReason: string;
    }): Promise<void>;
    static currencyCovert(base: string): Promise<any>;
}
export {};

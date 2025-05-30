import { IToken } from '../models/Auth.js';
import { DeliveryData } from './delivery.js';
import { LanguageLocation } from '../../Language.js';
import { CartItem } from './checkout-event.js';
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
type InvoiceData = {
    invoiceID: string;
    allowanceData: any;
    orderID: string;
    orderData: any;
    allowanceInvoiceTotalAmount: string;
    itemList: any;
    invoiceDate: string;
};
type VoucherForType = 'all' | 'collection' | 'product' | 'manager_tag';
type RebackType = 'rebate' | 'discount' | 'shipment_free' | 'add_on_items' | 'giveaway';
type Trigger = 'auto' | 'code' | 'distribution';
type ProductOffStart = 'price_asc' | 'price_desc' | 'price_all';
type Device = 'normal' | 'pos';
type Method = 'fixed' | 'percent';
type Rule = 'min_price' | 'min_count';
type ConditionType = 'item' | 'order';
type Counting = 'single' | 'each';
type IncludeDiscount = 'before' | 'after';
type SelectShipmentType = 'all' | 'select';
export interface VoucherData {
    id: string;
    type: 'voucher';
    status: 0 | 1 | -1;
    title: string;
    code?: string;
    reBackType: RebackType;
    method: Method;
    trigger: Trigger;
    device: Device[];
    value: string;
    add_on_products?: string[];
    for: VoucherForType;
    rule: Rule;
    counting: Counting;
    conditionType: ConditionType;
    includeDiscount: IncludeDiscount;
    productOffStart: ProductOffStart;
    forKey: (number | string)[];
    ruleValue: number;
    startDate: string;
    startTime: string;
    endDate?: string;
    endTime?: string;
    overlay: boolean;
    start_ISO_Date: string;
    end_ISO_Date: string;
    targetList: (number | string)[];
    target: string;
    rebateEndDay: string;
    macroLimited: number;
    microLimited: number;
    selectShipment: {
        type: SelectShipmentType;
        list: string[];
    };
    distribution_shop: string[];
    bind: BindItem[];
    bind_subtotal: number;
    times: number;
    discount_total: number;
    rebate_total: number;
}
interface Seo {
    title: string;
    seo: {
        domain: string;
        title: string;
        content: string;
    };
}
interface LineItem {
    id: number;
    spec: string[];
    count: string;
    sale_price: number;
    title: string;
    sku: string;
    preview_image: string;
}
interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    payment_select?: string;
}
interface orderVoucherData {
    id: number;
    discount_total: number;
    title: string;
    method: 'percent' | 'fixed';
    trigger: 'auto' | 'code';
    value: string;
    for: VoucherForType;
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
    }[];
    start_ISO_Date: string;
    end_ISO_Date: string;
    reBackType: string;
    rebate_total: number;
    target: string;
    targetList: string[];
}
declare class OrderDetail {
    subtotal: number;
    shipment: number;
    total: number;
    discount: number;
    rebate: number;
    cart_token: string;
    tag: 'manual';
    voucher: orderVoucherData;
    lineItems: LineItem[];
    customer_info: CustomerInfo;
    user_info: {
        name: string;
        email: string;
        city?: string;
        area?: string;
        phone: string;
        address: string;
        custom_form_delivery?: any;
        shipment: 'normal' | 'black_cat_freezing' | 'now' | 'shop' | 'global_express' | 'black_cat' | 'UNIMARTC2C' | 'FAMIC2C' | 'HILIFEC2C' | 'OKMARTC2C' | 'UNIMARTFREEZE' | 'FAMIC2CFREEZE';
        CVSStoreName: string;
        CVSStoreID: string;
        CVSTelephone: string;
        MerchantTradeNo: string;
        CVSAddress: string;
        note?: string;
        code_note?: string;
    };
    pay_status: string;
    constructor(subtotal: number, shipment: number);
    private initCustomerInfo;
    private initUserInfo;
    private initVoucher;
}
type Collection = {
    title: string;
    array: Collection[];
    checked?: boolean;
    product_id?: number[];
    parentTitles: string[];
    subCollections: string[];
    allCollections: string[];
    seo_title: string;
    seo_content: string;
    seo_image: string;
    code: string;
    language_data: {
        'en-US': Seo;
        'zh-CN': Seo;
        'zh-TW': Seo;
    };
    hidden?: boolean;
};
type FormatCollection = {
    title: string;
    array: FormatCollection[];
    seo_title: string;
    seo_content: string;
    seo_image: string;
    code: string;
    language_data: {
        'en-US': Seo;
        'zh-CN': Seo;
        'zh-TW': Seo;
    };
    hidden?: boolean;
};
type ShipmentSetting = {
    cartSetting: {
        minimumTotal: number;
        maximumTotal: number;
        freeShipmnetTarget: number;
        orderFormula: string[];
    };
};
export type Cart = {
    archived?: string;
    customer_info: any;
    lineItems: CartItem[];
    discount?: number;
    orderStatus?: string;
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
        isExcludedByWeight?: boolean;
        isExcludedByTotal?: boolean;
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
    orderSource: '' | 'manual' | 'normal' | 'POS' | 'combine' | 'group_buy' | 'split';
    temp_cart_id?: string;
    code_array: string[];
    deliveryData?: DeliveryData;
    give_away: CartItem[];
    language?: string;
    pos_info?: any;
    goodsWeight: number;
    client_ip_address: string;
    fbc: string;
    fbp: string;
    scheduled_id?: string;
    editRecord: {
        time: string;
        record: string;
    }[];
    combineOrderID?: number;
    splitOrders?: string[];
    parentOrder?: string;
    select_shipment_setting?: ShipmentSetting;
    verify_code: string;
};
export type Order = {
    id: number;
    cart_token: string;
    status: number;
    email: string;
    orderData: Cart;
    created_time: string;
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
        general_tag?: string;
        manager_tag?: string;
        whereStore?: string;
        order_by?: string;
        id_list?: string;
        with_hide_index?: string;
        is_manger?: boolean;
        setUserID?: string;
        show_hidden?: string;
        productType?: string;
        filter_visible?: string;
        language?: string;
        currency_code?: string;
        view_source?: string;
        distribution_code?: string;
        skip_shopee_check?: boolean;
        product_category?: string;
    }): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    initProductCustomizeTagConifg(): Promise<any>;
    setProductCustomizeTagConifg(add_tags: string[]): Promise<{
        list: any[];
    }>;
    initProductGeneralTagConifg(): Promise<any>;
    setProductGeneralTagConifg(add_tags: {
        [k in LanguageLocation]: string[];
    }): Promise<any>;
    initOrderCustomizeTagConifg(): Promise<any>;
    setOrderCustomizeTagConifg(add_tags: string[]): Promise<{
        list: any[];
    }>;
    getAllUseVoucher(userID: any): Promise<VoucherData[]>;
    getDistributionRecommend(distribution_code: string): Promise<any>;
    aboutProductVoucher(json: {
        allVoucher: VoucherData[];
        userData: any;
        recommendData: any;
        product: any;
        userID: string;
        viewSource: string;
    }): Promise<VoucherData[]>;
    querySql(conditions: string[], query: {
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
    linePay(data: any): Promise<unknown>;
    getShippingMethod(): Promise<{
        name: string;
        value: string;
    }[]>;
    getPostAddressData(address: string): Promise<any>;
    updateExhibitionActiveStock(exh_id: string, v_id: number, count: number): Promise<void>;
    getShipmentRefer(user_info: any): Promise<any>;
    calculateShipment(dataList: {
        key: string;
        value: string;
    }[], value: number | string): number;
    getShipmentFee(user_info: any, lineItems: CartItem[], shipment: any): number;
    repayOrder(orderID: string, return_url: string): Promise<import("./interface/payment-strategy-interface.js").PaymentResult | undefined>;
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
    combineOrder(dataMap: Record<string, {
        status: 'success';
        note: '';
        orders: Order[];
        targetID: string;
    }>): Promise<boolean>;
    splitOrder(obj: {
        orderData: Cart;
        splitOrderArray: OrderDetail[];
    }): Promise<boolean | {
        result: string;
        reason: any;
    }>;
    formatUseRebate(total: number, useRebate: number): Promise<{
        status: boolean;
        point: number;
        limit?: number;
        condition?: number;
    }>;
    checkVoucher(cart: Cart): Promise<Cart>;
    putOrder(data: {
        id?: string;
        cart_token?: string;
        orderData: any;
        status?: any;
    }): Promise<{
        result: string;
        message: string;
        orderData?: undefined;
    } | {
        result: string;
        orderData: any;
        message?: undefined;
    }>;
    private writeRecord;
    private resetStore;
    private sendNotifications;
    private adjustStock;
    manualCancelOrder(order_id: string): Promise<{
        result: boolean;
        message: string;
    } | {
        result: boolean;
        message?: undefined;
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
        id_list?: string;
        search?: string;
        email?: string;
        phone?: string;
        status?: string;
        searchType?: string;
        shipment?: string;
        progress?: string;
        orderStatus?: string;
        created_time?: string;
        shipment_time?: string;
        orderString?: string;
        archived?: string;
        returnSearch?: string;
        distribution_code?: string;
        valid?: boolean;
        is_shipment?: boolean;
        payment_select?: string;
        is_reconciliation?: boolean;
        reconciliation_status?: string[];
        manager_tag?: string;
        member_levels?: string;
    }): Promise<any>;
    releaseCheckout(status: 1 | 0 | -1, order_id: string): Promise<void>;
    shareVoucherRebate(cartData: any): Promise<void>;
    checkVoucherLimited(user_id: number, voucher_id: number): Promise<boolean>;
    isUsedVoucher(user_id: number, voucher_id: number, order_id: string): Promise<boolean>;
    insertVoucherHistory(user_id: number, order_id: string, voucher_id: number): Promise<void>;
    releaseVoucherHistory(order_id: string, status: 1 | 0): Promise<void>;
    resetVoucherHistory(): Promise<void>;
    postVariantsAndPriceValue(content: any): Promise<void>;
    updateVariantsWithSpec(data: any, product_id: string, spec: string[]): Promise<void>;
    updateVariantsForScheduled(data: any, scheduled_id: string): Promise<void>;
    calcVariantsStock(calc: number, stock_id: string, product_id: string, spec: string[]): Promise<void>;
    calcSoldOutStock(calc: number, product_id: string, spec: string[]): Promise<void>;
    soldMailNotice(json: {
        brand_domain: string;
        shop_name: string;
        product_id: string;
        order_data: any;
    }): Promise<void>;
    formatDateString(isoDate?: string): string;
    getCollectionProducts(tags: string): Promise<any>;
    getCollectionProductVariants(tags: string): Promise<any>;
    putCollection(replace: Collection, original: Collection): Promise<{
        result: boolean;
        message: string;
    } | {
        result: boolean;
        message?: undefined;
    }>;
    putCollectionV2(replace: Collection, original: Collection): Promise<{
        result: boolean;
    }>;
    sortCollection(data: Collection[]): Promise<boolean>;
    sortCollectionV2(dataArray: FormatCollection[]): Promise<boolean>;
    checkVariantDataType(variants: any[]): void;
    postProduct(content: any): Promise<any>;
    removeLogisticGroup(group_key: string): Promise<boolean>;
    updateCollectionFromUpdateProduct(collection: string[]): Promise<void>;
    postMulProduct(content: any): Promise<any>;
    promisesProducts(productArray: any, insertIDStart: any): Promise<void>;
    putProduct(content: any): Promise<any>;
    deleteCollection(dataArray: Collection[]): Promise<{
        result: boolean;
    }>;
    deleteCollectionV2(dataArray: Collection[]): Promise<{
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
    static isComeStore(checkout: any, qData: any): boolean;
    updateProductCollection(content: string[], id: number): Promise<void>;
    getProductVariants(id_list: string): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    static productStatusSQL(queryStatus: string, table?: string): string;
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
    putVariants(token: any, query: any): Promise<{
        result: string;
        orderData: any;
    }>;
    postCustomerInvoice(obj: {
        orderID: any;
        orderData: any;
    }): Promise<{
        result: {};
    }>;
    batchPostCustomerInvoice(dataArray: InvoiceData[]): Promise<any>;
    voidInvoice(obj: {
        invoice_no: string;
        reason: string;
        createDate: string;
    }): Promise<void>;
    allowanceInvoice(obj: InvoiceData): Promise<boolean>;
    voidAllowance(obj: {
        invoiceNo: string;
        allowanceNo: string;
        voidReason: string;
    }): Promise<void>;
    static currencyCovert(base: string): Promise<any>;
    getProductComment(product_id: number): Promise<any>;
    postProductComment(data: {
        product_id: number;
        rate: number;
        title: string;
        comment: string;
    }): Promise<boolean>;
    updateProductAvgRate(product_id: number): Promise<{
        product_id: number;
        avg_rate: any;
    }>;
}
export {};

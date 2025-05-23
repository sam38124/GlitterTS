export interface OrderData {
    distribution_info?: {
        code: string;
        condition: number;
        link: string;
        recommend_medium: any;
        recommend_status: string;
        recommend_user: any;
        redirect: string;
        relative: string;
        relative_data: any;
        share_type: string;
        share_value: number;
        startDate: string;
        startTime: string;
        status: boolean;
        title: string;
        voucher: number;
        voucher_status: string;
    };
    archived: 'true' | 'false';
    customer_info: any;
    editRecord: any;
    method: string;
    shipment_selector: {
        name: string;
        value: string;
        form: any;
    }[];
    orderStatus: string;
    use_wallet: number;
    email: string;
    total: number;
    discount: number;
    expectDate: string;
    shipment_fee: number;
    use_rebate: number;
    lineItems: LineItem[];
    user_info: {
        name: string;
        email: string;
        city?: string;
        area?: string;
        phone: string;
        address: string;
        custom_form_delivery?: any;
        shipment: 'normal' | 'FAMIC2C' | 'black_cat_freezing' | 'UNIMARTC2C' | 'HILIFEC2C' | 'OKMARTC2C' | 'now' | 'shop' | 'global_express' | 'black_cat' | 'UNIMARTFREEZE';
        CVSStoreName: string;
        CVSStoreID: string;
        CVSTelephone: string;
        MerchantTradeNo: string;
        CVSAddress: string;
        note?: string;
        code_note?: string;
    };
    custom_receipt_form?: any;
    custom_form_format?: any;
    custom_form_data?: any;
    proof_purchase: any;
    progress: string;
    order_note: string;
    voucherList: [
        {
            title: string;
            method: 'percent' | 'fixed';
            trigger: 'auto' | 'code';
            value: string;
            for: 'collection' | 'product';
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
        }
    ];
    orderSource?: string;
    deliveryData: Record<string, string>;
}
export interface CartData {
    id: number;
    cart_token: string;
    status: number;
    email: string;
    orderData: OrderData;
    created_time: string;
}
export interface LineItem {
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
interface VoucherData {
    id: number;
    discount_total: number;
    title: string;
    method: 'percent' | 'fixed';
    trigger: 'auto' | 'code';
    value: string;
    for: 'collection' | 'product';
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
export declare class OrderDetail {
    subtotal: number;
    shipment: number;
    total: number;
    discount: number;
    rebate: number;
    cart_token: string;
    tag: 'manual';
    voucher: VoucherData;
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
        shipment: "normal" | "FAMIC2C" | "black_cat_freezing" | "UNIMARTC2C" | "HILIFEC2C" | "OKMARTC2C" | "now" | "shop" | "global_express" | "black_cat" | "UNIMARTFREEZE";
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
export {};

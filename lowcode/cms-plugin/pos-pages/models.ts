export class OrderDetail {
    subtotal: number;
    shipment: number;
    discount: number;
    rebate: number;
    cart_token: string;
    code_array?:string[]
    voucher?: VoucherData;
    lineItems: {
        id: number;
        title: string;
        preview_image: string;
        spec: string[];
        count: number;
        sale_price: number;
        sku: string
    }[];
    customer_info: {
        payment_select: string;
        name: string;
        email: string;
        phone: string;
    };
    pos_info?: any;
    user_info: {
        name: string;
        email: string;
        phone: string;
        address: string;
        shipment: 'normal' | 'FAMIC2C' | 'UNIMARTC2C' | 'HILIFEC2C' | 'OKMARTC2C' | 'now' | 'shop';
        CVSStoreName: string;
        CVSStoreID: string;
        CVSTelephone: string;
        MerchantTradeNo: string;
        CVSAddress: string;
        note: string;
    };
    pay_status: any;

    constructor(subtotal: number, shipment: number) {
        this.subtotal = subtotal;
        this.discount = 0;
        this.rebate = 0;
        this.shipment = shipment;
        this.cart_token = "";
        this.lineItems = [];
        this.user_info = {
            CVSAddress: "",
            CVSStoreID: "",
            CVSStoreName: "",
            CVSTelephone: "",
            MerchantTradeNo: "",
            address: "",
            email: "",
            name: "",
            note: "",
            phone: "",
            shipment: 'normal',
        };
        this.customer_info = {
            payment_select: "POS",
            name: "",
            phone: "",
            email: ""
        };
        this.pay_status = 1
    }

    get total(): number {
        return this.subtotal + this.shipment - this.discount;
    }
}

export interface  VoucherData {
    id: number;
    title: string;
    method: 'percent' | 'fixed';
    reBackType: 'rebate' | 'discount' | 'shipment_free';
    trigger: 'auto' | 'code';
    value: number;
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

export  type ViewModel = {
    id: string;
    filterID: string;
    type: string;
    query: string;
    order: any;
    productSearch: any[];
    searchable: boolean;
    categorySearch: boolean;
    categories: any[];
    paySelect: string;
};
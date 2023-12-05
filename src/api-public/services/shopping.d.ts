import { IToken } from "../models/Auth.js";
interface VoucherData {
    title: string;
    method: 'percent' | 'fixed';
    trigger: 'auto' | "code";
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
        "id": string;
        "spec": string[];
        "count": number;
        "sale_price": number;
        "collection": string[];
        "discount_price": number;
    }[];
    start_ISO_Date: string;
    end_ISO_Date: string;
    discount_total: number;
}
export declare class Shopping {
    app: string;
    token: IToken;
    constructor(app: string, token: IToken);
    getProduct(query: {
        page: number;
        limit: number;
        id?: string;
        search?: string;
        collection?: string;
        minPrice?: string;
        maxPrice?: string;
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
    querySql(querySql: string[], query: {
        page: number;
        limit: number;
        id?: string;
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
            "id": string;
            "spec": string[];
            "count": number;
            "sale_price": number;
            "collection"?: string[];
            title?: string;
            preview_image?: string;
        }[];
        "email"?: string;
        "return_url": string;
        "user_info": any;
        "code"?: string;
    }, type?: 'add' | 'preview'): Promise<{
        data: {
            lineItems: {
                "id": string;
                "spec": string[];
                "count": number;
                "sale_price": number;
                "collection": string[];
                title: string;
                preview_image: string;
            }[];
            total: number;
            email: string;
            user_info: any;
            code?: string | undefined;
            shipment_fee: number;
        };
        form?: undefined;
    } | {
        form: string;
        data?: undefined;
    }>;
    checkVoucher(cart: {
        lineItems: {
            "id": string;
            "spec": string[];
            "count": number;
            "sale_price": number;
            "collection": string[];
            "discount_price"?: number;
        }[];
        discount?: number;
        total: number;
        email: string;
        user_info: any;
        voucherList?: VoucherData[];
        code?: string;
    }): Promise<void>;
    putOrder(data: {
        id: string;
        orderData: {
            "id": number;
            "cart_token": string;
            "status": number;
            "email": string;
            "orderData": {
                "email": string;
                "total": number;
                "lineItems": {
                    "id": number;
                    "spec": string[];
                    "count": string;
                    "sale_price": number;
                }[];
                "user_info": {
                    "name": string;
                    "email": string;
                    "phone": string;
                    "address": string;
                };
            };
            "created_time": string;
            "progress": 'finish' | 'wait' | 'shipping';
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
                "email": string;
                "total": number;
                "lineItems": {
                    "id": number;
                    "spec": string[];
                    "count": string;
                    "sale_price": number;
                }[];
                "user_info": {
                    "name": string;
                    "email": string;
                    "phone": string;
                    "address": string;
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
    }): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
}
export {};

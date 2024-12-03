/// <reference types="node" />
import { Encoding } from 'crypto';
interface KeyData {
    MERCHANT_ID: string;
    HASH_KEY: string;
    HASH_IV: string;
    NotifyURL: string;
    ReturnURL: string;
    ActionURL: string;
    TYPE: 'newWebPay' | 'ecPay' | 'PayPal' | 'LinePay';
}
export default class FinancialService {
    keyData: KeyData;
    appName: string;
    constructor(appName: string, keyData: KeyData);
    static aesEncrypt(data: string, key: string, iv: string, input?: Encoding, output?: Encoding, method?: string): string;
    static JsonToQueryString(data: {
        [key: string]: string | string[] | number;
    }): string;
    createOrderPage(orderData: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
            title: string;
        }[];
        total: number;
        email: string;
        shipment_fee: number;
        orderID: string;
        use_wallet: number;
        user_email: string;
        method: string;
    }): Promise<any>;
    saveWallet(orderData: {
        total: number;
        userID: number;
        note: any;
        method: string;
        table: string;
        title: string;
        ratio: number;
    }): Promise<string>;
}
export declare class EzPay {
    keyData: KeyData;
    appName: string;
    constructor(appName: string, keyData: KeyData);
    static aesDecrypt: (data: string, key: string, iv: string, input?: Encoding, output?: Encoding, method?: string) => string;
    decode(data: string): string;
    createOrderPage(orderData: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
        }[];
        total: number;
        email: string;
        shipment_fee: number;
        orderID: string;
        use_wallet: number;
        user_email: string;
        method?: string;
    }): Promise<string>;
    saveMoney(orderData: {
        total: number;
        userID: number;
        note: string;
        table: string;
        title: string;
        ratio: number;
    }): Promise<string>;
}
export declare class EcPay {
    keyData: KeyData;
    appName: string;
    constructor(appName: string, keyData: KeyData);
    static generateCheckMacValue(params: Record<string, any>, HashKey: string, HashIV: string): string;
    createOrderPage(orderData: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
            title: string;
        }[];
        total: number;
        email: string;
        shipment_fee: number;
        orderID: string;
        user_email: string;
        use_wallet: number;
        method: string;
        CheckMacValue?: string;
    }): Promise<string>;
    saveMoney(orderData: {
        total: number;
        userID: number;
        note: string;
        method: string;
        CheckMacValue?: string;
        table: string;
        title: string;
        ratio: number;
    }): Promise<string>;
}
export declare class PayPal {
    keyData: {
        ReturnURL?: string;
        NotifyURL?: string;
        PAYPAL_CLIENT_ID: string;
        PAYPAL_SECRET: string;
        BETA: boolean;
    };
    appName: string;
    PAYPAL_CLIENT_ID: string;
    PAYPAL_SECRET: string;
    PAYPAL_BASE_URL: string;
    constructor(appName: string, keyData: {
        ReturnURL?: string;
        NotifyURL?: string;
        PAYPAL_CLIENT_ID: string;
        PAYPAL_SECRET: string;
        BETA: boolean;
    });
    getAccessToken(): Promise<string>;
    checkout(orderData: any): Promise<{
        orderId: any;
        approveLink: any;
    }>;
    createOrderPage(accessToken: string, orderData: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
            title: string;
        }[];
        total: number;
        email: string;
        shipment_fee: number;
        orderID: string;
        use_wallet: number;
        user_email: string;
        method?: string;
    }): Promise<any>;
    getOrderDetails(orderId: string, accessToken: string): Promise<any>;
    capturePayment(orderId: string, accessToken: string): Promise<any>;
    confirmAndCaptureOrder(orderId: string): Promise<any>;
}
export declare class LinePay {
    keyData: KeyData;
    appName: string;
    LinePay_CLIENT_ID: string;
    LinePay_SECRET: string;
    LinePay_BASE_URL: string;
    LinePay_RETURN_HOST: string;
    LinePay_RETURN_CONFIRM_URL: string;
    LinePay_RETURN_CANCEL_URL: string;
    constructor(appName: string, keyData: KeyData);
    createOrder(orderData: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
            title: string;
        }[];
        total: number;
        email: string;
        shipment_fee: number;
        orderID: string;
        use_wallet: number;
        user_email: string;
        method: string;
    }): Promise<any>;
}
export {};

/// <reference types="node" />
import { Encoding } from 'crypto';
interface KeyData {
    MERCHANT_ID: string;
    HASH_KEY: string;
    HASH_IV: string;
    NotifyURL: string;
    ReturnURL: string;
    ActionURL: string;
    TYPE: 'newWebPay' | 'ecPay';
}
export default class FinancialService {
    keyData: KeyData;
    appName: string;
    constructor(appName: string, keyData: KeyData);
    createOrderPage(orderData: {
        lineItems: {
            "id": string;
            "spec": string[];
            "count": number;
            "sale_price": number;
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
    saveMoney(orderData: {
        total: number;
        userID: number;
        note: any;
        method: string;
    }): Promise<string>;
    generateUniqueOrderNumber(): string;
    static JsonToQueryString(data: {
        [key: string]: string | string[] | number;
    }): string;
    static aesEncrypt(data: string, key: string, iv: string, input?: Encoding, output?: Encoding, method?: string): string;
}
export declare class EzPay {
    keyData: KeyData;
    appName: string;
    constructor(appName: string, keyData: KeyData);
    decode(data: string): Promise<string>;
    static aesDecrypt: (data: string, key: string, iv: string, input?: Encoding, output?: Encoding, method?: string) => string;
    createOrderPage(orderData: {
        lineItems: {
            "id": string;
            "spec": string[];
            "count": number;
            "sale_price": number;
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
    }): Promise<string>;
}
export declare class EcPay {
    keyData: KeyData;
    appName: string;
    constructor(appName: string, keyData: KeyData);
    createOrderPage(orderData: {
        lineItems: {
            "id": string;
            "spec": string[];
            "count": number;
            "sale_price": number;
            title: string;
        }[];
        total: number;
        email: string;
        shipment_fee: number;
        orderID: string;
        user_email: string;
        use_wallet: number;
        method: string;
    }): Promise<string>;
    saveMoney(orderData: {
        total: number;
        userID: number;
        note: string;
        method: string;
    }): Promise<string>;
    static urlEncode_dot_net(raw_data: string, case_tr?: string): string;
}
export {};

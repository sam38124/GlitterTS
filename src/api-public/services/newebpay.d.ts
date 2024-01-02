/// <reference types="node" />
import { Encoding } from 'crypto';
interface KeyData {
    MERCHANT_ID: string;
    HASH_KEY: string;
    HASH_IV: string;
    NotifyURL: string;
    ReturnURL: string;
    ActionURL: string;
}
export default class Newebpay {
    keyData: KeyData;
    appName: string;
    constructor(appName: string, keyData: KeyData);
    createNewebPage(orderData: {
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
    }): Promise<{
        actionURL: string;
        MerchantOrderNo: string;
        MerchantID: string;
        TradeInfo: string;
        TradeSha: string;
        Version: string;
    }>;
    saveMoney(orderData: {
        total: number;
        userID: number;
        note: any;
    }): Promise<{
        actionURL: string;
        MerchantOrderNo: number;
        MerchantID: string;
        TradeInfo: string;
        TradeSha: string;
        Version: string;
    }>;
    generateUniqueOrderNumber(): string;
    decode(data: string): Promise<string>;
    static JsonToQueryString(data: {
        [key: string]: string | string[] | number;
    }): string;
    static aesEncrypt(data: string, key: string, iv: string, input?: Encoding, output?: Encoding, method?: string): string;
    static aesDecrypt: (data: string, key: string, iv: string, input?: Encoding, output?: Encoding, method?: string) => string;
}
export {};

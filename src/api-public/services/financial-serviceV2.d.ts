import { Encoding } from 'crypto';
import axios from 'axios';
export interface KeyData {
    SECRET?: string;
    CLIENT_ID?: string;
    PAYPAL_SECRET?: string;
    PAYPAL_CLIENT_ID?: string;
    MERCHANT_ID?: string;
    HASH_KEY?: string;
    HASH_IV?: string;
    NotifyURL: string;
    ReturnURL: string;
    ActionURL?: string;
    TYPE: 'newWebPay' | 'ecPay' | 'PayPal' | 'LinePay' | 'jkopay';
    CreditCheckCode?: string;
    BETA?: boolean;
}
export default class FinancialServiceV2 {
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
    }): Promise<string | undefined>;
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
export declare class EzPayV2 {
    keyData: KeyData;
    appName: string;
    constructor(appName: string, keyData: KeyData);
    static aesDecrypt: (data: string, key: string, iv: string, input?: Encoding, output?: Encoding, method?: string) => string;
    decode(data: string): string;
    executePayment(orderData: {
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
export declare class EcPayV2 {
    keyData: KeyData;
    appName: string;
    static beta: string;
    constructor(appName: string, keyData?: KeyData);
    key_initial(): Promise<void>;
    static generateCheckMacValue(params: Record<string, any>, HashKey: string, HashIV: string): string;
    executePayment(orderData: {
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
    checkCreditInfo(CreditRefundId: string, CreditAmount: string): Promise<any>;
    checkPaymentStatus(orderID: string): Promise<any>;
    brushBack(orderID: string, tradNo: string, total: string): Promise<any>;
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
export declare class PayPalV2 {
    keyData: {
        ReturnURL?: string;
        NotifyURL?: string;
        PAYPAL_CLIENT_ID: string;
        PAYPAL_SECRET: string;
        BETA: string;
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
        BETA: string;
    });
    getAccessToken(): Promise<string>;
    checkout(orderData: any): Promise<{
        orderId: any;
        approveLink: any;
    }>;
    executePayment(accessToken: string, orderData: {
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
export declare class LinePayV2 {
    keyData: {
        ReturnURL: string;
        LinePay_CLIENT_ID: string;
        LinePay_SECRET: string;
        BETA: string;
    };
    appName: string;
    LinePay_CLIENT_ID: string;
    LinePay_SECRET: string;
    LinePay_BASE_URL: string;
    constructor(appName: string, keyData: {
        ReturnURL: string;
        LinePay_CLIENT_ID: string;
        LinePay_SECRET: string;
        BETA: string;
    });
    confirmAndCaptureOrder(transactionId: string, total: number): Promise<axios.AxiosResponse<any, any>>;
    executePayment(orderData: {
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
        discount?: any;
    }): Promise<any>;
}
export declare class PayNowV2 {
    keyData: {
        ReturnURL?: string;
        NotifyURL?: string;
        public_key: string;
        private_key: string;
        BETA: string;
    };
    appName: string;
    PublicKey: string;
    PrivateKey: string;
    BASE_URL: string;
    constructor(appName: string, keyData: any);
    executePaymentIntent(transactionId: string, secret: string, paymentNo: string): Promise<any>;
    bindKey(): Promise<{
        public_key: string;
        private_key: string;
    }>;
    confirmAndCaptureOrder(transactionId?: string): Promise<any>;
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
    }): Promise<{
        data: any;
        publicKey: string;
        BETA: string;
    }>;
    executePayment(orderData: {
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
    }): Promise<{
        returnUrl: string | undefined;
        data: any;
        publicKey: string;
        BETA: string;
    }>;
}
export declare class JKOV2 {
    keyData: {
        ReturnURL?: string;
        NotifyURL?: string;
        API_KEY: string;
        STORE_ID: string;
        SECRET_KEY: string;
    };
    appName: string;
    BASE_URL: string;
    constructor(appName: string, keyData: {
        ReturnURL?: string;
        NotifyURL?: string;
        API_KEY: string;
        STORE_ID: string;
        SECRET_KEY: string;
    });
    confirmAndCaptureOrder(transactionId?: string): Promise<any>;
    executePayment(orderData: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
            preview_image: string;
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
    refundOrder(platform_order_id: string, refund_amount: number): Promise<void>;
    private generateDigest;
}

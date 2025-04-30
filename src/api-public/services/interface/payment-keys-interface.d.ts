export interface EcEzPayKeyData {
    HASH_IV: string;
    HASH_KEY: string;
    ActionURL: string;
    NotifyURL: string;
    ReturnURL: string;
    MERCHANT_ID: string;
    TYPE: 'ecPay';
}
export interface PayPalKeyData {
    NotifyURL: string;
    ReturnURL: string;
    PAYPAL_CLIENT_ID: string;
    PAYPAL_SECRET: string;
    TYPE: 'PayPal';
    BETA: string;
}
export interface LinePayKeyData {
    BETA: string;
    CLIENT_ID: string;
    SECRET: string;
    ReturnURL: string;
}
export interface JkoPayKeyData {
    API_KEY: string;
    NotifyURL: string;
    ReturnURL: string;
    SECRET_KEY: string;
    STORE_ID: string;
}
export interface PayNowKeyData {
    PublicKey: string;
    PrivateKey: string;
    ReturnURL: string;
    NotifyURL: string;
    BETA: string;
}

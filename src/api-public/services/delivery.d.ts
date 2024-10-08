type StoreBrand = 'FAMIC2C' | 'UNIMARTC2C' | 'HILIFEC2C' | 'OKMARTC2C';
export type DeliveryData = {
    AllPayLogisticsID: string;
    BookingNote: string;
    CheckMacValue: string;
    CVSPaymentNo: string;
    CVSValidationNo: string;
    GoodsAmount: string;
    LogisticsSubType: string;
    LogisticsType: string;
    MerchantID: string;
    MerchantTradeNo: string;
    ReceiverAddress: string;
    ReceiverCellPhone: string;
    ReceiverEmail: string;
    ReceiverName: string;
    ReceiverPhone: string;
    RtnCode: string;
    RtnMsg: string;
    UpdateStatusDate: string;
};
export declare class EcPay {
    appName: string;
    constructor(appName: string);
    static generateCheckMacValue(params: Record<string, any>, HashKey: string, HashIV: string): string;
    static generateForm(json: {
        actionURL: string;
        params: Record<string, any>;
        checkMacValue?: string;
    }): string;
    static axiosRequest(json: {
        actionURL: string;
        params: Record<string, any>;
        checkMacValue?: string;
    }): Promise<{
        result: boolean;
        data: {
            result: boolean;
            data: string;
        };
    } | {
        result: boolean;
        data: any;
    }>;
    notifyOrder(json: any): Promise<string>;
}
export declare class Delivery {
    appName: string;
    constructor(appName: string);
    getC2CMap(returnURL: string, logistics: string): Promise<string>;
    postStoreOrder(json?: {
        LogisticsSubType: StoreBrand;
        GoodsAmount: number;
        GoodsName: string;
        ReceiverName: string;
        ReceiverCellPhone: string;
        ReceiverStoreID: string;
    }): Promise<{
        result: boolean;
        message: any;
        data?: undefined;
    } | {
        result: boolean;
        data: DeliveryData;
        message?: undefined;
    }>;
    printOrderInfo(json: {
        LogisticsSubType: StoreBrand;
        AllPayLogisticsID: string;
        CVSPaymentNo: string;
        CVSValidationNo: string;
    }): Promise<string>;
    notify(json: any): Promise<string>;
}
export {};

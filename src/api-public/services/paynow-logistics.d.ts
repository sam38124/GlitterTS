export declare class PayNowLogistics {
    static printStack: {
        code: string;
        html: string;
    }[];
    app_name: string;
    constructor(app_name: string);
    config(): Promise<{
        pwd: any;
        link: string;
        toggle: any;
        account: any;
        sender_name: any;
        sender_phone: any;
        sender_address: any;
        sender_email: any;
    }>;
    choseLogistics(type: string, return_url: string): Promise<string>;
    deleteLogOrder(orderNO: string, logisticNumber: string, totalAmount: string): Promise<any>;
    getOrderInfo(orderNO: string): Promise<any>;
    printLogisticsOrder(carData: any): Promise<any>;
    encrypt(content: string): Promise<string | undefined>;
    sha1Encrypt(data: string): Promise<string>;
}

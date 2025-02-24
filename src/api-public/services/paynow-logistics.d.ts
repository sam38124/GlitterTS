export declare class PayNowLogistics {
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
    printLogisticsOrder(carData: any): Promise<any>;
    encrypt(content: string): Promise<string | undefined>;
    sha1Encrypt(data: string): Promise<string>;
}

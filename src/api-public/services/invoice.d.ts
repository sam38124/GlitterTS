export declare class Invoice {
    appName: string;
    constructor(appName: string);
    postInvoice(cf: {
        invoice_data: any;
        print: boolean;
    }): Promise<boolean | undefined>;
    postCheckoutInvoice(orderID: string, print: boolean): Promise<boolean | undefined>;
    static checkWhiteList(config: any, invoice_data: any): any;
}

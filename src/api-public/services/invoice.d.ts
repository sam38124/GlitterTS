export declare class Invoice {
    appName: string;
    constructor(appName: string);
    postInvoice(cf: {
        invoice_data: any;
    }): Promise<boolean | undefined>;
    postCheckoutInvoice(orderID: string): Promise<boolean | undefined>;
    static checkWhiteList(config: any, invoice_data: any): any;
}

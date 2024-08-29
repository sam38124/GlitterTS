export declare class Invoice {
    appName: string;
    constructor(appName: string);
    postInvoice(cf: {
        invoice_data: any;
        print: boolean;
    }): Promise<boolean | undefined>;
    postCheckoutInvoice(orderID: string | any, print: boolean): Promise<boolean | "no_need" | undefined>;
    static checkWhiteList(config: any, invoice_data: any): any;
}

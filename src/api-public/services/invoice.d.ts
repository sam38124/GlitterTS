export declare class Invoice {
    appName: string;
    constructor(appName: string);
    static checkWhiteList(config: any, invoice_data: any): any;
    postInvoice(cf: {
        invoice_data: any;
        print: boolean;
        order_id: string;
        orderData: any;
    }): Promise<{}>;
    postCheckoutInvoice(orderID: string | any, print: boolean, obj?: {
        offlineInvoice?: boolean;
    }): Promise<{}>;
    updateInvoice(obj: {
        orderID: string;
        invoice_data: any;
    }): Promise<void>;
    getInvoice(query: {
        page: number;
        limit: number;
        search?: string;
        searchType?: string;
        orderString?: string;
        created_time?: string;
        invoice_type?: string;
        issue_method?: string;
        status?: string;
        filter?: any;
    }): Promise<{
        data: any;
        total: any;
    }>;
    getAllowance(query: {
        page: number;
        limit: number;
        search?: string;
        searchType?: string;
        orderString?: string;
        created_time?: string;
        invoice_type?: string;
        issue_method?: string;
        status?: string;
        filter?: string;
    }): Promise<{
        data: any;
        total: any;
    }>;
}

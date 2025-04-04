export declare class Invoice {
    appName: string;
    constructor(appName: string);
    postInvoice(cf: {
        invoice_data: any;
        print: boolean;
        order_id: string;
        orderData: any;
    }): Promise<boolean | undefined>;
    postCheckoutInvoice(orderID: string | any, print: boolean, obj?: {
        offlineInvoice?: boolean;
    }): Promise<boolean | "no_need" | undefined>;
    updateInvoice(obj: {
        orderID: string;
        invoice_data: any;
    }): Promise<void>;
    static checkWhiteList(config: any, invoice_data: any): any;
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
    querySql(querySql: string[], query: {
        page: number;
        limit: number;
        id?: string;
        order_by?: string;
    }): Promise<any>;
}

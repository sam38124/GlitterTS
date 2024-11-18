export interface EcInvoiceInterface {
    "MerchantID": string;
    "RelateNumber": string;
    "CustomerID": string;
    "CustomerIdentifier": string;
    "CustomerName": string;
    "CustomerAddr": string;
    "CustomerPhone": string;
    "CustomerEmail": string;
    LoveCode?: string;
    ClearanceMark?: any;
    "Print": string;
    "Donation": string;
    "TaxType": string;
    "SalesAmount": number;
    "InvType": string;
    CarrierType: string;
    CarrierNum?: string;
    "Items": {
        "ItemSeq": number;
        "ItemName": string;
        "ItemCount": number;
        "ItemWord": string;
        "ItemPrice": number;
        "ItemTaxType": string;
        "ItemAmount": number;
        "ItemRemark": string;
    }[];
}
export interface EcPrintInterFace {
    MerchantID: string;
    InvoiceNo: string;
    InvoiceDate: string;
    PrintStyle: 1 | 2 | 3 | 4 | 5;
    IsShowingDetail: 1 | 2;
}
export declare class EcInvoice {
    static getCompanyName(obj: {
        company_id: string;
        app_name: string;
    }): Promise<any>;
    static postInvoice(obj: {
        hashKey: string;
        hash_IV: string;
        merchNO: string;
        app_name: string;
        invoice_data: EcInvoiceInterface;
        beta: boolean;
        print: boolean;
    }): Promise<boolean>;
    static voidInvoice(obj: {
        hashKey: string;
        hash_IV: string;
        merchNO: string;
        app_name: string;
        invoice_data: any;
        beta: boolean;
    }): Promise<boolean>;
    static allowanceInvoice(obj: {
        hashKey: string;
        hash_IV: string;
        merchNO: string;
        app_name: string;
        allowance_data: any;
        beta: boolean;
        db_data: any;
        order_id: string;
    }): Promise<boolean>;
    static voidAllowance(obj: {
        hashKey: string;
        hash_IV: string;
        merchNO: string;
        app_name: string;
        allowance_data: any;
        beta: boolean;
    }): Promise<boolean>;
    static printInvoice(obj: {
        hashKey: string;
        hash_IV: string;
        merchNO: string;
        app_name: string;
        order_id: string;
        beta: boolean;
    }): Promise<any>;
    static allowance(obj: {
        hashKey: string;
        hash_IV: string;
        invoice_data: any;
        merchNO: string;
        beta: boolean;
    }): Promise<boolean>;
    static allowanceInvalid(obj: {
        hashKey: string;
        hash_IV: string;
        invoice_data: any;
        merchNO: string;
        beta: boolean;
    }): Promise<boolean>;
    static deleteInvoice(obj: {
        hashKey: string;
        hash_IV: string;
        invoice_data: any;
        merchNO: string;
        beta: boolean;
    }): Promise<boolean>;
    static getInvoice(obj: {
        hashKey: string;
        hash_IV: string;
        invoice_data: any;
        merchNO: string;
        beta: boolean;
    }): Promise<boolean>;
}

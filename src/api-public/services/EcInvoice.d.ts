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
export declare class EcInvoice {
    static postInvoice(obj: {
        hashKey: string;
        hash_IV: string;
        merchNO: string;
        invoice_data: EcInvoiceInterface;
        beta: boolean;
    }): Promise<boolean>;
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

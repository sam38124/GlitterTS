export declare class EzInvoice {
    static postInvoice(obj: {
        hashKey: string;
        hash_IV: string;
        merchNO: string;
        invoice_data: any;
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

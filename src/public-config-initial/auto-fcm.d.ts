export declare class AutoFcm {
    static initial(value: any): any;
    static orderChangeInfo(obj: {
        app: string;
        tag: string;
        order_id: string;
        phone_email: string;
        verify_code: string;
    }): Promise<void>;
}

export declare class ManagerNotify {
    app_name: string;
    constructor(app_name: string);
    getSaasAPP(): Promise<any>;
    getSaasSettings(): Promise<any>;
    findSetting(settings: any[], type: 'email' | 'line' | 'sms', key: string): boolean;
    sendEmail(email: string, title: string, content: string, href: string): Promise<void>;
    checkNotify(tag: string): Promise<boolean>;
    saasRegister(cf: {
        user_id: string;
    }): Promise<void>;
    checkout(cf: {
        orderData: any;
        status: number;
    }): Promise<void>;
    uploadProof(cf: {
        orderData: any;
    }): Promise<void>;
    userRegister(cf: {
        user_id: string;
    }): Promise<boolean>;
    customerMessager(obj: {
        title: string;
        content: string;
        user_name: string;
        room_image?: string;
        room_text?: string;
    }): Promise<void>;
    formSubmit(cf: {
        user_id: string;
    }): Promise<void>;
}

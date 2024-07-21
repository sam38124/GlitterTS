export declare class ManagerNotify {
    app_name: string;
    constructor(app_name: string);
    getSaasAPP(): Promise<any>;
    userRegister(cf: {
        user_id: string;
    }): Promise<boolean>;
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
    formSubmit(cf: {
        user_id: string;
    }): Promise<void>;
    sendEmail(email: string, title: string, content: string, href: string): Promise<void>;
    checkNotify(tag: string): Promise<boolean>;
}

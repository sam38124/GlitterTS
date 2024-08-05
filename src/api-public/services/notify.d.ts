export declare class ManagerNotify {
    app_name: string;
    constructor(app_name: string);
    getSaasAPP(): Promise<any>;
    sendEmail(email: string, title: string, content: string, href: string): Promise<void>;
    checkNotify(tag: string): Promise<boolean>;
    saasRegister(cf: {
        user_id: string;
    }): Promise<void>;
    userRegister(cf: {
        user_id: string;
    }): Promise<boolean>;
    uploadProof(cf: {
        orderData: any;
    }): Promise<void>;
    checkout(cf: {
        orderData: any;
        status: number;
    }): Promise<void>;
    formSubmit(cf: {
        user_id: string;
    }): Promise<void>;
}

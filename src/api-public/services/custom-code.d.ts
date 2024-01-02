export declare class CustomCode {
    appName: string;
    constructor(appName: string);
    loginHook(config: any): Promise<void>;
    checkOutHook(config: any): Promise<void>;
    execute(key: string, config: {
        userData?: any;
        cartData?: any;
        userID?: string;
        sql?: any;
        fcm?: any;
    }): Promise<void>;
}

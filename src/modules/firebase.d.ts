export declare class Firebase {
    app: string;
    constructor(app: string);
    static initial(): Promise<void>;
    static appRegister(cf: {
        appID: string;
        appName: string;
        type: 'android' | 'ios';
    }): Promise<void>;
    static getConfig(cf: {
        appID: string;
        type: 'android' | 'ios';
        appDomain: string;
    }): Promise<string | undefined>;
    sendMessage(cf: {
        token?: string;
        userID?: string;
        title: string;
        body: string;
    }): Promise<unknown>;
}
export declare class App {
    token: IToken;
    createApp(config: {
        domain: string;
        appName: string;
        copyApp: string;
    }): Promise<boolean>;
    getAPP(): Promise<any>;
    getAppConfig(config: {
        appName: string;
    }): Promise<any>;
    setAppConfig(config: {
        appName: string;
        data: any;
    }): Promise<boolean>;
    deleteAPP(config: {
        appName: string;
    }): Promise<void>;
    constructor(token: IToken);
}

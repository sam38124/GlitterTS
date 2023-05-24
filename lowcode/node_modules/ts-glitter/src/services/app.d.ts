export declare class App {
    token: IToken;
    createApp(config: {
        domain: string;
        appName: string;
    }): Promise<boolean>;
    getAppConfig(config: {
        appName: string;
    }): Promise<any>;
    setAppConfig(config: {
        appName: string;
        data: any;
    }): Promise<boolean>;
    constructor(token: IToken);
}

import { IToken } from "../models/Auth.js";
export declare class App {
    token: IToken;
    static getAdConfig(app: string, key: string): Promise<any>;
    createApp(config: {
        domain: string;
        appName: string;
        copyApp: string;
    }): Promise<boolean>;
    getAPP(): Promise<any>;
    getAppConfig(config: {
        appName: string;
    }): Promise<any>;
    getOfficialPlugin(): Promise<any>;
    setAppConfig(config: {
        appName: string;
        data: any;
    }): Promise<boolean>;
    deleteAPP(config: {
        appName: string;
    }): Promise<void>;
    constructor(token: IToken);
}

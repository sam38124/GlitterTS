import { IToken } from "../models/Auth.js";
export declare class App {
    token: IToken;
    static getAdConfig(app: string, key: string): Promise<any>;
    createApp(config: {
        appName: string;
        copyApp: string;
        copyWith: string[];
    }): Promise<boolean>;
    getAPP(query: {
        app_name?: string;
    }): Promise<any>;
    getAppConfig(config: {
        appName: string;
    }): Promise<any>;
    getOfficialPlugin(): Promise<any>;
    setAppConfig(config: {
        appName: string;
        data: any;
    }): Promise<boolean>;
    setDomain(config: {
        appName: string;
        domain: string;
    }): Promise<any>;
    deleteAPP(config: {
        appName: string;
    }): Promise<void>;
    constructor(token: IToken);
}

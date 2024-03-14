import { IToken } from "../models/Auth.js";
export declare class App {
    token: IToken;
    static getAdConfig(app: string, key: string): Promise<any>;
    createApp(config: {
        appName: string;
        copyApp: string;
        copyWith: string[];
        brand: string;
    }): Promise<boolean>;
    getAPP(query: {
        app_name?: string;
    }): Promise<any>;
    getTemplate(query: {
        app_name?: string;
        template_from: 'all' | 'me';
    }): Promise<any>;
    getAppConfig(config: {
        appName: string;
    }): Promise<any>;
    getOfficialPlugin(): Promise<any>;
    static checkBrandAndMemberType(app: string): Promise<{
        memberType: any;
        brand: any;
    }>;
    setAppConfig(config: {
        appName: string;
        data: any;
    }): Promise<boolean>;
    postTemplate(config: {
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

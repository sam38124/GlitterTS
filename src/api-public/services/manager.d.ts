import { IToken } from "../../models/Auth.js";
export declare class Manager {
    token: IToken;
    setConfig(config: {
        appName: string;
        key: string;
        value: any;
    }): Promise<void>;
    static getConfig(config: {
        appName: string;
        key: string;
        language: 'zh-TW' | 'zh-CN' | 'en-US';
    }): Promise<any[]>;
    static checkData(data: any[], language: 'zh-TW' | 'zh-CN' | 'en-US'): Promise<any[]>;
    constructor(token: IToken);
}

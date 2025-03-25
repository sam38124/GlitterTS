import { IToken } from '../models/Auth.js';
export declare class Private_config {
    token: IToken;
    setConfig(config: {
        appName: string;
        key: string;
        value: any;
    }): Promise<void>;
    getConfig(config: {
        appName: string;
        key: string;
    }): Promise<any>;
    static getConfig(config: {
        appName: string;
        key: string;
    }): Promise<any>;
    constructor(token: IToken);
    static checkConfigUpdate(appName: string, keyData: any, key: string): Promise<void>;
}

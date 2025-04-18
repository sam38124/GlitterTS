import { IToken } from '../../models/Auth.js';
import { LanguageLocation } from '../../Language.js';
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
        language: LanguageLocation;
    }): Promise<any[]>;
    static checkData(data: any[], language: LanguageLocation): Promise<any[]>;
    constructor(token: IToken);
}

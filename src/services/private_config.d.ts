import { IToken } from "../models/Auth.js";
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
    verifyPermission(appName: string): Promise<boolean>;
    constructor(token: IToken);
}

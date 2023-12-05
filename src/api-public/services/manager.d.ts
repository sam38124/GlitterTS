import { IToken } from "../../models/Auth.js";
export declare class Manager {
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
    constructor(token: IToken);
}

import { IToken } from "../models/Auth.js";
export declare class Template {
    token: IToken;
    verifyPermission(appName: string): Promise<boolean>;
    createPage(config: {
        appName: string;
        tag: string;
        group: string;
        name: string;
        config: any;
        page_config: any;
        copy: any;
    }): Promise<boolean>;
    updatePage(config: {
        appName: string;
        tag: string;
        group: string;
        name: string;
        config: any;
        page_config: any;
        id?: string;
    }): Promise<boolean>;
    deletePage(config: {
        appName: string;
        id?: string;
    }): Promise<boolean>;
    getPage(config: {
        appName: string;
        tag?: string;
    }): Promise<any>;
    constructor(token: IToken);
}

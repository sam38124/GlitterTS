import { IToken } from "../models/Auth.js";
export declare class Page {
    constructor(token: IToken);
    token: IToken;
    verifyPermission(appName: string): Promise<boolean>;
    postTemplate(config: {
        appName: string;
        data: any;
        tag: string;
    }): Promise<boolean>;
    getTemplate(query: {
        template_from: 'all' | 'me';
        type: 'page' | 'module' | 'article' | 'blog';
        page?: string;
        limit?: string;
        tag?: string;
        search: string;
    }): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    getTagList(type: string, template_from: string): Promise<{
        result: any;
    }>;
}

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
        page_type: string;
        copyApp: string;
    }): Promise<boolean>;
    updatePage(config: {
        appName: string;
        tag: string;
        group: string;
        name: string;
        config: any;
        page_config: any;
        id?: string;
        page_type: string;
        preview_image: string;
        favorite: number;
    }): Promise<boolean>;
    deletePage(config: {
        appName: string;
        id?: string;
        tag?: string;
    }): Promise<boolean>;
    getTemplate(query: {
        app_name?: string;
        template_from: 'all' | 'me';
        page?: string;
        limit?: string;
    }): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    postTemplate(config: {
        appName: string;
        data: any;
        tag: string;
    }): Promise<boolean>;
    getPage(config: {
        appName?: string;
        tag?: string;
        group?: string;
        type?: string;
        page_type?: string;
        user_id?: string;
        me?: string;
        favorite?: string;
    }): Promise<any>;
    constructor(token: IToken);
}

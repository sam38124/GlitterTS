export declare class ApiPageConfig {
    constructor();
    static getAppList(theme?: string, token?: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getTemplateList(): Promise<{
        result: boolean;
        response: any;
    }>;
    static getAppConfig(): Promise<{
        result: boolean;
        response: any;
    }>;
    static deleteApp(appName: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static setSubDomain(cf: {
        app_name: string;
        sub_domain: string;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static setDomain(cf: {
        domain: string;
        app_name?: string;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getPage(request: {
        appName?: string;
        tag?: string;
        group?: string;
        type?: 'article' | 'template';
        page_type?: string;
        me?: boolean;
        favorite?: boolean;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getPageTemplate(request: {
        template_from: 'all' | 'me' | 'project';
        page?: string;
        limit?: string;
        type?: 'page' | 'module' | 'article' | 'blog' | 'backend' | 'form_plugin';
        tag?: string;
        search?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getTagList(request: {
        type: 'page' | 'module' | 'article' | 'blog' | 'backend';
        template_from: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static setPage(data: {
        "id": number;
        "appName": "lionDesign";
        "tag": "home";
        "group"?: "首頁相關";
        "name"?: "首頁";
        "config"?: [];
        "page_config"?: any;
        "page_type"?: string;
        favorite?: number;
        preview_image?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static addPage(data: {
        "appName": string;
        "tag": string;
        "group"?: string;
        "name"?: string;
        "config"?: [];
        "page_config"?: any;
        "copy"?: string;
        copyApp?: string;
        page_type?: string;
        replace?: boolean;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getPlugin(appName: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static deletePage(data: {
        "id"?: number;
        "appName": string;
        "tag"?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static setPlugin(appName: string, obj: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static createTemplate(appName: string, obj: any, token?: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static createPageTemplate(appName: string, obj: any, tag: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static setPrivateConfig(appName: string, key: any, value: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static setPrivateConfigV2(cf: {
        key: string;
        value: string;
        appName?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getPrivateConfig(appName: string, key: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static getPrivateConfigV2(key: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static getEditorToken(): Promise<{
        result: boolean;
        response: any;
    }>;
    static uploadFile(fileName: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static uploadFileAll(files: File | File[], type?: 'blob' | 'file'): Promise<{
        result: boolean;
        links?: undefined;
    } | {
        result: boolean;
        links: string[];
    }>;
}

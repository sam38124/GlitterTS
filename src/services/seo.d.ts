export declare class Seo {
    static getPageInfo(appName: string, query_page: string): Promise<any>;
    static getAppConfig(appName: string): Promise<any>;
    static redirectToHomePage(appName: string, req: any): Promise<string>;
}

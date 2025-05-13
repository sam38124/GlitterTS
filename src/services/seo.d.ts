import express from 'express';
export declare class Seo {
    static getPageInfo(appName: string, query_page: string, language: any, req: express.Request): Promise<any>;
    static getAppConfig(appName: string): Promise<any>;
    static redirectToHomePage(appName: string, req: any): Promise<string>;
}

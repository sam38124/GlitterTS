import express from 'express';
export declare class SeoConfig {
    static editorSeo: string;
    static collectionSeo(cf: {
        appName: string;
        language: string;
        data: any;
        page: string;
    }): Promise<void>;
    static distributionSEO(cf: {
        appName: string;
        page: string;
        url: string;
        link_prefix: string;
        data: any;
        language: string;
    }): Promise<string>;
    static productSEO(cf: {
        data: any;
        language: any;
        appName: string;
        product_id: string;
        page: string;
    }): Promise<void>;
    static getProductJsonLd(app_name: string, pd_content: any): Promise<string>;
    static articleSeo(cf: {
        article: any;
        page: string;
        appName: string;
        data: any;
        language: any;
    }): Promise<any>;
    static language(store_info: any, req: any): Promise<any>;
    static fbCode(FBCode: any): string;
    static gTag(g_tag: any[]): string;
    static gA4(ga4: any[]): string;
    static seoDetail(in_app: string, req: express.Request, resp: express.Response, initial?: boolean): Promise<{
        head: string;
        body: string;
        redirect?: undefined;
        seo_detail?: undefined;
    } | {
        redirect: string;
        head?: undefined;
        body?: undefined;
        seo_detail?: undefined;
    } | {
        head: string;
        body: string;
        seo_detail: any;
        redirect?: undefined;
    }>;
}
export declare function extractCols(data: {
    value: any[];
    updated_at: Date;
}): any;
export declare function extractProds(data: any): any;

import * as core from "express-serve-static-core";
import express from 'express';
export declare class GlitterUtil {
    static set_frontend(express: core.Express, rout: {
        rout: string;
        path: string;
        seoManager: (req: express.Request, resp: express.Response) => Promise<string>;
    }[]): Promise<void>;
    static set_frontend_v2(express: core.Express, rout: {
        app_name: string;
        rout: string;
        path: string;
        root_path: string;
        seoManager: (req: express.Request, resp: express.Response) => Promise<{
            head: string;
            body: string;
        }>;
        sitemap: (req: express.Request, resp: express.Response) => Promise<string>;
        sitemap_list: (req: express.Request, resp: express.Response) => Promise<string>;
        robots: (req: express.Request, resp: express.Response) => Promise<string>;
        tw_shop: (req: express.Request, resp: express.Response) => Promise<string>;
    }[]): Promise<void>;
}

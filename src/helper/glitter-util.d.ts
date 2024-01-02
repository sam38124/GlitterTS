import * as core from "express-serve-static-core";
import express from 'express';
export declare class GlitterUtil {
    static set_frontend(express: core.Express, rout: {
        rout: string;
        path: string;
        seoManager: (req: express.Request, resp: express.Response) => Promise<string>;
    }[]): Promise<void>;
}

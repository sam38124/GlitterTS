import * as core from "express-serve-static-core";
import express from 'express';
export declare function set_frontend(express: core.Express, rout: {
    rout: string;
    path: string;
    seoManager: (req: express.Request, resp: express.Response) => Promise<string>;
}[]): Promise<void>;
export declare function set_backend_editor(envPath: string, serverPort?: number): Promise<core.Express>;
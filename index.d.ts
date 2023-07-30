import * as core from "express-serve-static-core";
import express from 'express';
import db from './src/modules/database';
import {lambda} from "./src/lambda/interface";
export declare function set_frontend(express: core.Express, rout: {
    rout: string;
    path: string;
    seoManager: (req: express.Request, resp: express.Response) => Promise<string>;
}[]): Promise<void>;
export declare function set_backend_editor(envPath: string, serverPort?: number): Promise<core.Express>;
export declare const api_public: {
    addPostObserver: (callback: (data: any, app: string) => void) => void;
    db: typeof db;
    getAdConfig: (appName: string, key: string) => Promise<any>;
    lambda:typeof lambda
};

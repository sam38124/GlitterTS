import express from "express";
import { IToken } from "../models/Auth.js";
export declare class Monitor {
    static insertHistory(obj: {
        req: express.Request;
        token?: IToken;
        req_type: 'api' | 'file';
    }): Promise<void>;
}

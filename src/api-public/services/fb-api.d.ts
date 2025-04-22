/// <reference types="cookie-parser" />
import { Cart } from "./shopping.js";
import express from "express";
import { IToken } from "../models/Auth.js";
export declare class FbApi {
    app_name: string;
    token?: IToken;
    constructor(app_name: string, token?: IToken);
    config(): Promise<{
        link: string;
        api_token: any;
    }>;
    checkOut(data: Cart): Promise<boolean | undefined>;
    post(data: any, req: express.Request): Promise<boolean | undefined>;
    OAuth(url: any): Promise<void>;
}

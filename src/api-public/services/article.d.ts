import { IToken } from "../models/Auth.js";
export declare class Article {
    app_name: string;
    token: IToken;
    constructor(app_name: string, token: any);
    addArticle(tData: any, status: number): Promise<any>;
    putArticle(tData: any): Promise<boolean>;
}

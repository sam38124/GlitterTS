import { IToken } from "../models/Auth.js";
export declare class Article {
    app_name: string;
    token: IToken;
    constructor(app_name: string, token: any);
    addArticle(tData: any): Promise<boolean>;
    putArticle(tData: any): Promise<boolean>;
}

import { IToken } from "../models/Auth.js";
export declare class Post {
    app: string;
    token: IToken;
    static postObserverList: ((data: any, app: string) => void)[];
    static addPostObserver(callback: (data: any, app: string) => void): void;
    postContent(content: any): Promise<any>;
    sqlApi(router: string, datasource: any): Promise<void>;
    lambda(query: any, router: string, datasource: any, type: string): Promise<any>;
    putContent(content: any): Promise<any>;
    getContent(content: any): Promise<any>;
    constructor(app: string, token: IToken);
}

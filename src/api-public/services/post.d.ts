import { IToken } from "../models/Auth.js";
export declare class Post {
    app: string;
    token: IToken;
    static postObserverList: ((data: any, app: string) => void)[];
    static addPostObserver(callback: (data: any, app: string) => void): void;
    postContent(content: any): Promise<any>;
    putContent(content: any): Promise<any>;
    getContent(content: any): Promise<{
        data: any;
        count: any;
    }>;
    constructor(app: string, token: IToken);
}

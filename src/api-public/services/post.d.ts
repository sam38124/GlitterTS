import { IToken } from '../models/Auth.js';
export declare class Post {
    app: string;
    token: IToken;
    static postObserverList: ((data: any, app: string) => void)[];
    static addPostObserver(callback: (data: any, app: string) => void): void;
    postContent(content: any, tb?: string): Promise<any>;
    sqlApi(router: string, datasource: any): Promise<void>;
    lambda(query: any, router: string, datasource: any, type: string): Promise<any>;
    putContent(content: any, tb?: string): Promise<any>;
    getContentV2(query: any, manager: boolean): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    getContent(content: any): Promise<any>;
    constructor(app: string, token: IToken);
}

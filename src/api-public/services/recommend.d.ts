import { IToken } from '../models/Auth.js';
export declare class Recommend {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    getLinkList(obj?: {
        code?: string;
    }): Promise<{
        data: any;
    }>;
    postLink(data: any): Promise<{
        result: boolean;
        message: string;
        data?: undefined;
    } | {
        result: boolean;
        data: any;
        message?: undefined;
    }>;
    putLink(id: string, data: any): Promise<{
        result: boolean;
        message: string;
        data?: undefined;
    } | {
        result: boolean;
        data: any;
        message?: undefined;
    }>;
    toggleLink(id: string): Promise<{
        result: boolean;
        message: string;
        data?: undefined;
    } | {
        result: boolean;
        data: any;
        message?: undefined;
    }>;
    getUserList(query: {
        limit: number;
        page: number;
        search?: string;
        searchType?: string;
        orderBy?: string;
    }): Promise<{
        data: any;
        total: any;
    }>;
    postUser(data: any): Promise<{
        result: boolean;
        message: string;
        data?: undefined;
    } | {
        result: boolean;
        data: any;
        message?: undefined;
    }>;
    putUser(id: string, data: any): Promise<{
        result: boolean;
        message: string;
        data?: undefined;
    } | {
        result: boolean;
        data: any;
        message?: undefined;
    }>;
}

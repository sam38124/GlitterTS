import { IToken } from '../models/Auth.js';
export declare class Recommend {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    calculatePercentage(numerator: number, denominator: number, decimalPlaces?: number): string;
    getLinkList(query: {
        code?: string;
        status?: boolean;
        page: number;
        limit: number;
        user_id?: string;
        no_detail?: boolean;
        id_list?: string;
    }): Promise<{
        data: any;
        total: any;
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
    deleteLink(data: any): Promise<{
        result: boolean;
        data: any;
        message?: undefined;
    } | {
        result: boolean;
        message: string;
        data?: undefined;
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
    deleteUser(data: any): Promise<{
        result: boolean;
        data: any;
        message?: undefined;
    } | {
        result: boolean;
        message: string;
        data?: undefined;
    }>;
}

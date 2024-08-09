import { IToken } from '../models/Auth.js';
export declare class Recommend {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    getList(): Promise<{
        data: any;
    }>;
    postList(data: any): Promise<{
        result: boolean;
        data: any;
    } | {
        result: boolean;
        data?: undefined;
    }>;
    putList(id: string, data: any): Promise<{
        result: boolean;
        data: any;
    } | {
        result: boolean;
        data?: undefined;
    }>;
}

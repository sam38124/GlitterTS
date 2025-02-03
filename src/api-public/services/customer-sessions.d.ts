import { IToken } from '../models/Auth.js';
interface scheduled {
    type: string;
    stream_name: string;
    streamer: string;
    platform: string;
    item_list: any[];
    stock: {
        reserve: boolean;
        expiry_date?: string;
        period: string;
    };
    discount_set: boolean;
}
export declare class CustomerSessions {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    createScheduled(data: scheduled): Promise<{
        result: boolean;
        message: string;
    }>;
}
export {};

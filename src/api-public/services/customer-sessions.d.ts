import { IToken } from '../models/Auth.js';
interface scheduled {
    type: string;
    name: string;
    streamer: string;
    platform: string;
    item_list: any[];
    stock: {
        reserve: boolean;
        expiry_date?: string;
        period: string;
    };
    discount_set: boolean;
    lineGroup: {
        groupId: string;
        groupName: string;
    };
}
export declare class CustomerSessions {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    createScheduled(data: scheduled): Promise<{
        result: boolean;
        message: string;
    }>;
    getScheduled(): Promise<any>;
    getOnlineCart(cartID: string): Promise<any>;
    listenChatRoom(): Promise<void>;
}
export {};

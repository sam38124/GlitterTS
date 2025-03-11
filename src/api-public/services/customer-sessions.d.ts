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
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
}
export declare class CustomerSessions {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    createScheduled(data: scheduled): Promise<{
        result: boolean;
        message: string;
    }>;
    getScheduled(): Promise<{
        data: any;
        total: any;
    }>;
    getOneScheduled(scheduleID: string): Promise<any>;
    changeScheduledStatus(scheduleID: string, status: string): Promise<void>;
    closeScheduled(scheduleID: string): Promise<void>;
    finishScheduled(scheduleID: string): Promise<void>;
    sendMessageToGroup(groupID: string, message: any[]): Promise<void>;
    getOnlineCart(cartID: string): Promise<any>;
    getCartList(scheduleID: string): Promise<{
        data: any;
        total: any;
    }>;
    getRealOrder(cart_array: string[]): Promise<any>;
    listenChatRoom(): Promise<void>;
}
export {};

import { IToken } from '../models/Auth.js';
export interface ChatRoom {
    chat_id: string;
    type: 'user' | 'group';
    info: any;
    participant: string[];
}
export interface ChatMessage {
    chat_id: string;
    user_id: string;
    message: {
        text: string;
        attachment: any;
    };
}
export declare class Chat {
    app: string;
    token?: IToken;
    addChatRoom(room: ChatRoom): Promise<{
        result: string;
        create: boolean;
    }>;
    getChatRoom(qu: any, userID: string): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    addMessage(room: ChatMessage): Promise<void>;
    updateLastRead(userID: string, chat_id: string): Promise<void>;
    getLastRead(chat_id: string): Promise<any>;
    templateWithCustomerMessage(subject: string, title: string, message: string): string;
    getMessage(qu: any): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    unReadMessage(user_id: string): Promise<any>;
    unReadMessageCount(user_id: string): Promise<any>;
    constructor(app: string, token?: IToken);
}

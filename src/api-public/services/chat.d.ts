import { IToken } from "../models/Auth.js";
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
    token: IToken;
    addChatRoom(room: ChatRoom): Promise<any>;
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
    constructor(app: string, token: IToken);
}

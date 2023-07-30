import { IToken } from "../models/Auth.js";
export interface ChatRoom {
    chat_id: string;
    info: any;
    participant: any;
}
export declare class Chat {
    app: string;
    token: IToken;
    static postObserverList: ((data: any, app: string) => void)[];
    static addPostObserver(callback: (data: any, app: string) => void): void;
    addChatRoom(room: ChatRoom): Promise<any>;
    postContent(content: any): Promise<any>;
    getContent(content: any): Promise<{
        data: any;
        count: any;
    }>;
    constructor(app: string, token: IToken);
}

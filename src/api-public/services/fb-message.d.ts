import { IToken } from '../models/Auth.js';
export interface ChatRoom {
    chat_id: string;
    type: 'user' | 'group';
    info: any;
    participant: string[];
}
export declare class FbMessage {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    chunkSendMessage(userList: any, content: any, id: number, date?: string): Promise<void>;
    sendMessage(obj: {
        data: {
            text?: string;
            image?: string;
            attachment: any;
            tag?: any;
        };
        fbID: string;
    }, callback: (data: any) => void): Promise<boolean>;
    sendUserInf(fbID: string, callback: (data: any) => void): Promise<boolean>;
    deleteSNS(obj: {
        id: string;
    }, callback: (data: any) => void): Promise<boolean>;
    parseResponse(response: any): void;
    getLine(query: {
        type: string;
        page: number;
        limit: number;
        search?: string;
        searchType?: string;
        mailType?: string;
        status?: string;
    }): Promise<{
        data: any;
        total: any;
    }>;
    postLine(data: any): Promise<{
        result: boolean;
        message: string;
    }>;
    deleteSns(data: any): Promise<{
        result: boolean;
        message: string;
    }>;
    listenMessage(body: any): Promise<{
        result: boolean;
        message: string;
    }>;
    sendCustomerFB(tag: string, order_id: string, fb_id: string): Promise<void>;
    uploadFile(file_name: string, fileData: Buffer): Promise<string>;
    getFBInf(obj: {
        fbID: string;
    }, callback: (data: any) => void): Promise<boolean>;
}

import { IToken } from '../models/Auth.js';
export interface ChatRoom {
    chat_id: string;
    type: 'user' | 'group';
    info: any;
    participant: string[];
}
export declare class LineMessage {
    app: string;
    token: IToken | undefined;
    constructor(app: string, token?: IToken);
    chunkSendLine(userList: any, content: any, id: number, date?: string): Promise<void>;
    sendLine(obj: {
        data: string;
        lineID: string;
    }, callback: (data: any) => void): Promise<boolean>;
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
    listenMessage(data: any): Promise<{
        result: boolean;
        message: string;
    }>;
    sendCustomerLine(tag: string, order_id: string, lineID: string): Promise<void>;
    checkPoints(message: string, user_count: number): Promise<boolean>;
    usePoints(obj: {
        message: string;
        user_count: number;
        order_id?: string;
        phone: string;
    }): Promise<number>;
    getUsePoints(text: string, user_count: number): number;
}

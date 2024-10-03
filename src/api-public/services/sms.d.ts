import { IToken } from '../models/Auth.js';
interface SNSResponse {
    clientid?: string;
    msgid?: string;
    statuscode: number;
    accountPoint?: number;
    Duplicate?: string;
    smsPoint?: number;
    message?: string;
}
export declare class SMS {
    app: string;
    constructor(app: string, token?: IToken);
    chunkSendSNS(data: any, id: number, date?: string): Promise<void>;
    sendSNS(obj: {
        data: string;
        phone: string;
        date?: string;
        order_id?: string;
    }, callback: (data: SNSResponse) => void): Promise<boolean>;
    deleteSNS(obj: {
        id: string;
    }, callback: (data: any) => void): Promise<boolean>;
    parseResponse(response: any): void;
    getSns(query: {
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
    postSns(data: any): Promise<{
        result: boolean;
        message: string;
    }>;
    deleteSns(data: any): Promise<{
        result: boolean;
        message: string;
    }>;
    sendCustomerSns(tag: string, order_id: string, phone: string): Promise<void>;
    checkPoints(message: string, user_count: number): Promise<boolean>;
    usePoints(obj: {
        message: string;
        user_count: number;
        order_id?: string;
        phone: string;
    }): Promise<number>;
    getUsePoints(text: string, user_count: number): number;
}
export {};

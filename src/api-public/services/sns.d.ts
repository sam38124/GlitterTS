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
export declare class Sns {
    app: string;
    constructor(app: string, token?: IToken);
    chunkSendSNS(data: any, id: number, date?: string): Promise<void>;
    sendSNS(obj: {
        data: any;
        phone: string;
        date?: string;
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
}
export {};

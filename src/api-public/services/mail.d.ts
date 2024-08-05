import { IToken } from '../models/Auth.js';
export declare class Mail {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    chunkSendMail(data: any, id: number): Promise<void>;
    getMail(query: {
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
    postMail(data: any): Promise<{
        result: boolean;
        message: string;
    }>;
}

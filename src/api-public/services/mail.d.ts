import { IToken } from '../models/Auth.js';
export declare class Mail {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    chunkSendMail(data: any, id: number): Promise<void>;
    postMail(data: any): Promise<boolean>;
}

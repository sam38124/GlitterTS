import { IToken } from '../models/Auth.js';
export declare class Voucher {
    app: string;
    token: IToken;
    constructor(app_name: string, token: IToken);
    putVoucher(content: any): Promise<any>;
}

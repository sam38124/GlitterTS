import { IToken } from "../models/Auth.js";
export declare class Wallet {
    app: string;
    token: IToken;
    constructor(app: string, token: IToken);
    store(cf: {
        return_url: string;
        total: number;
        note: any;
        method?: string;
    }): Promise<{
        form: string;
    }>;
    withdraw(cf: {
        money: number;
        note: any;
    }): Promise<void>;
    putWithdraw(cf: {
        id: number;
        status: number;
        note: any;
    }): Promise<void>;
    delete(cf: {
        id: string;
    }): Promise<void>;
    deleteWithDraw(cf: {
        id: string;
    }): Promise<void>;
}

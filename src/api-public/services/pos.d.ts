import { IToken } from "../models/Auth.js";
export declare class Pos {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    getWorkStatus(): Promise<any>;
    setWorkStatus(obj: {
        user_id?: string;
        status: 'off_work' | 'on_work';
    }): Promise<void>;
    setSummary(obj: {
        id?: string;
        staff: string;
        summary_type: string;
        content: any;
    }): Promise<void>;
    getSummary(shop: string): Promise<any>;
}

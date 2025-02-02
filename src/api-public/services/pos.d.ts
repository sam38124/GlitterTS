import { IToken } from "../models/Auth.js";
export declare class Pos {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    getWorkStatus(query: {
        userID: string;
        store: string;
    }): Promise<any>;
    getWorkStatusList(query: {
        store: string;
        page: number;
        limit: number;
    }): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    setWorkStatus(obj: {
        user_id?: string;
        status: 'off_work' | 'on_work';
        store: string;
    }): Promise<void>;
    setSummary(obj: {
        id?: string;
        staff: string;
        summary_type: string;
        content: any;
    }): Promise<void>;
    getSummary(shop: string): Promise<any>;
    querySql(querySql: string[], query: {
        page: number;
        limit: number;
        id?: string;
        order_by?: string;
    }, db_n: string): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
}

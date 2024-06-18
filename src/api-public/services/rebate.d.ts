import { IToken } from '../models/Auth.js';
interface OneUserRebate {
    user_id: number;
    point: number;
    recycle: number;
    pending: number;
}
export interface IRebateSearch {
    search: string;
    limit: number;
    page: number;
    low?: number;
    high?: number;
    type?: string;
}
export declare class Rebate {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    static isValidDateTimeString(dateTimeString: string): boolean;
    static nowTime: (timeZone?: string) => string;
    getOneRebate(obj: {
        user_id?: number;
        email?: string;
    }): Promise<OneUserRebate | undefined>;
    getRebateList(query: IRebateSearch): Promise<{
        total: number;
        data: OneUserRebate[];
        sum: {
            point: number;
            recycle: number;
            pending: number;
        } | undefined;
    } | undefined>;
    totalRebateValue(): Promise<{
        point: number;
        recycle: number;
        pending: number;
    } | undefined>;
    getCustomerRebateHistory(email: string): Promise<{
        result: boolean;
        data: any;
        message?: undefined;
    } | {
        result: boolean;
        message: string;
        data?: undefined;
    } | undefined>;
    updateOldestRebate(user_id: number, originMinus: number): Promise<void>;
    insertRebate(user_id: number, amount: number, note: string, proof?: {
        cart_token?: string;
        orderNO?: string;
        sku?: string;
        quantity?: number;
        setCreatedAt?: string;
        deadTime?: string;
    }): Promise<{
        result: boolean;
        total: number;
        msg: string;
    } | {
        result: boolean;
        before_point: number;
        amount: number;
        after_point: number;
        deadTime: string | undefined;
        msg: string;
    } | undefined>;
}
export {};

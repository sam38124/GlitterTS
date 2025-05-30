import { IToken } from '../models/Auth.js';
interface OneUserRebate {
    user_id: number;
    point: number;
    recycle: number;
    pending: number;
}
type RebateType = 'voucher' | 'birth' | 'first_regiser' | 'manual' | 'cancelOrder';
export interface IRebateSearch {
    search: string;
    limit: number;
    page: number;
    low?: number;
    high?: number;
    email_or_phone?: string;
    type?: string;
}
export interface RebateRecord {
    order_id: string;
    use_rebate: number;
    remain: number;
    updated_at: string;
    origin_deadline: string;
}
export interface RebateProof {
    type?: RebateType;
    voucher_id?: string;
    order_id?: string;
    sku?: string;
    quantity?: number;
    setCreatedAt?: string;
    deadTime?: string;
    record?: RebateRecord[];
}
export declare class Rebate {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    static isValidDateTimeString(dateTimeString: string): boolean;
    static nowTime: (timeZone?: string) => string;
    getConfig(): Promise<any>;
    mainStatus(): Promise<boolean>;
    getOneRebate(obj: {
        user_id?: number;
        email?: string;
        quickPass?: boolean;
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
    getRebateListByRow(query: IRebateSearch): Promise<{
        total: any;
        data: any;
    } | undefined>;
    totalRebateValue(): Promise<{
        point: number;
        recycle: number;
        pending: number;
    } | undefined>;
    getCustomerRebateHistory(obj: {
        user_id?: number | string;
        email?: string;
    }): Promise<{
        result: boolean;
        data: any;
        message?: undefined;
    } | {
        result: boolean;
        message: string;
        data?: undefined;
    } | undefined>;
    getOldestRebate(user_id: number | string): Promise<{
        data: any;
    } | undefined>;
    updateOldestRebate(user_id: number | string, order_id: string | undefined, originMinus: number): Promise<boolean | undefined>;
    minusCheck(user_id: number | string, amount: number): Promise<boolean | undefined>;
    insertRebate(user_id: number | string, amount: number, note: string, proof?: RebateProof): Promise<{
        result: boolean;
        user_id: number;
        before_point: number;
        amount: number;
        msg: string;
    } | {
        result: boolean;
        user_id: number;
        before_point: number;
        amount: number;
        after_point: number;
        deadTime: string | undefined;
        msg: string;
    } | undefined>;
    canUseRebate(user_id: number, type: RebateType, search?: {
        voucher_id?: string;
        order_id?: string;
        sku?: string;
        quantity?: number;
    }): Promise<{
        result: boolean;
        msg: string;
    } | undefined>;
    searchRebate(json: {
        user_id?: string;
        order_id?: string;
    }): Promise<any>;
}
export {};

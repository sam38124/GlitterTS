import { IToken } from '../models/Auth.js';
interface UserQuery {
    page?: number;
    limit?: number;
    id?: string;
    search?: string;
    searchType?: string;
    order_string?: string;
    created_time?: string;
    birth?: string;
    rank?: string;
    rebate?: string;
    total_amount?: string;
}
export declare class User {
    app: string;
    token?: IToken;
    createUser(account: string, pwd: string, userData: any, req: any, pass_verify?: boolean): Promise<any>;
    createUserHook(userID: string): Promise<void>;
    updateAccount(account: string, userID: string): Promise<any>;
    login(account: string, pwd: string): Promise<any>;
    loginWithFb(token: string): Promise<any>;
    loginWithLine(code: string, redirect: string): Promise<any>;
    loginWithGoogle(code: string, redirect: string): Promise<any>;
    getUserData(query: string, type?: 'userID' | 'account'): Promise<any>;
    refreshMember(userData: any): Promise<any>;
    find30DayPeriodWith3000Spent(transactions: {
        total_amount: number;
        date: string;
    }[], total: number, duration: number, dead_line: number): {
        start_date: string;
        end_date: string;
    } | null;
    getUserAndOrderSQL(obj: {
        select: string;
        where: string[];
        orderBy: string;
        page?: number;
        limit?: number;
    }): string;
    getUserList(query: UserQuery): Promise<{
        data: any;
        total: any;
    }>;
    subscribe(email: string, tag: string): Promise<void>;
    registerFcm(userID: string, deviceToken: string): Promise<void>;
    deleteSubscribe(email: string): Promise<{
        result: boolean;
    }>;
    getSubScribe(query: any): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    getFCM(query: any): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    deleteUser(query: {
        id: string;
    }): Promise<{
        result: boolean;
    }>;
    updateUserData(userID: string, par: any, manager?: boolean): Promise<{
        data: any;
    }>;
    checkUpdate(cf: {
        updateUserData: any;
        manager: boolean;
        userID: string;
    }): Promise<any>;
    resetPwd(user_id_and_account: string, newPwd: string): Promise<{
        result: boolean;
    }>;
    resetPwdNeedCheck(userID: string, pwd: string, newPwd: string): Promise<{
        result: boolean;
    }>;
    updateAccountBack(token: string): Promise<void>;
    verifyPASS(token: string): Promise<any>;
    checkUserExists(account: string): Promise<boolean>;
    checkUserIdExists(id: number): Promise<any>;
    setConfig(config: {
        key: string;
        value: any;
        user_id?: string;
    }): Promise<void>;
    getConfig(config: {
        key: string;
        user_id: string;
    }): Promise<any>;
    getConfigV2(config: {
        key: string;
        user_id: string;
    }): Promise<any>;
    checkEmailExists(email: string): Promise<any>;
    getUnreadCount(): Promise<{
        count: any;
    }>;
    getNotice(cf: {
        query: any;
    }): Promise<any>;
    forgetPassword(email: string): Promise<void>;
    constructor(app: string, token?: IToken);
}
export {};

import { IToken } from '../models/Auth.js';
interface UserQuery {
    page?: number;
    limit?: number;
    id?: string;
    search?: string;
    searchType?: string;
    order_string?: string;
    created_time?: string;
    last_order_time?: string;
    last_shipment_date?: string;
    birth?: string;
    level?: string;
    rebate?: string;
    last_order_total?: string;
    total_amount?: string;
    total_count?: string;
    member_levels?: string;
    groupType?: string;
    groupTag?: string;
    filter_type?: string;
    tags?: string;
}
interface GroupUserItem {
    userID: number;
    email: string;
    count: number;
}
interface GroupsItem {
    type: string;
    title: string;
    count?: number;
    tag?: string;
    users: GroupUserItem[];
}
type MemberLevel = {
    id: string;
    duration: {
        type: string;
        value: number;
    };
    tag_name: string;
    condition: {
        type: string;
        value: number;
    };
    dead_line: {
        type: string;
    };
    create_date: string;
};
export declare class User {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    static generateUserID(): string;
    findAuthUser(email?: string): Promise<any>;
    emailVerify(account: string): Promise<{
        result: boolean;
    }>;
    phoneVerify(account: string): Promise<{
        result: boolean;
    }>;
    createUser(account: string, pwd: string, userData: any, req: any, pass_verify?: boolean): Promise<any>;
    createUserHook(userID: string): Promise<void>;
    updateAccount(account: string, userID: string): Promise<any>;
    login(account: string, pwd: string): Promise<any>;
    loginWithFb(token: string): Promise<any>;
    loginWithLine(code: string, redirect: string): Promise<any>;
    loginWithGoogle(code: string, redirect: string): Promise<any>;
    loginWithPin(user_id: string, pin: string): Promise<any>;
    loginWithApple(token: string): Promise<any>;
    getUserData(query: string, type?: 'userID' | 'account' | 'email_or_phone'): Promise<any>;
    checkMember(userData: any, trigger: boolean): Promise<{
        id: string;
        tag_name: string;
        trigger: boolean;
    }[]>;
    find30DayPeriodWith3000Spent(transactions: {
        total_amount: number;
        date: string;
    }[], total: number, duration: number): {
        start_date: string;
        end_date: string;
    } | null;
    getUserAndOrderSQL(obj: {
        select: string;
        where: string[];
        orderBy: string;
        page?: number;
        limit?: number;
    }): Promise<string>;
    private getOrderByClause;
    getUserList(query: UserQuery): Promise<{
        data: any;
        total: any;
        extra: {
            noRegisterUsers: any[] | undefined;
        };
    }>;
    getUserGroups(type?: string[], tag?: string, hide_level?: boolean): Promise<{
        result: false;
    } | {
        result: true;
        data: GroupsItem[];
    }>;
    normalMember: {
        id: string;
        duration: {
            type: string;
            value: number;
        };
        tag_name: string;
        condition: {
            type: string;
            value: number;
        };
        dead_line: {
            type: string;
        };
        create_date: string;
    };
    getLevelConfig(): Promise<any>;
    private filterMemberUpdates;
    private setLevelData;
    getUserLevel(data: {
        userId?: string;
        email?: string;
    }[]): Promise<{
        id: number;
        email: string;
        data: MemberLevel;
        status: 'auto' | 'manual';
    }[]>;
    subscribe(email: string, tag: string): Promise<void>;
    registerFcm(userID: string, deviceToken: string): Promise<void>;
    deleteSubscribe(email: string): Promise<{
        result: boolean;
    }>;
    getSubScribe(query: any): Promise<{
        data: any;
        total: any;
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
        id?: string;
        email?: string;
    }): Promise<{
        result: boolean;
    }>;
    updateUserData(userID: string, par: any, manager?: boolean): Promise<{
        data: any;
    }>;
    clearUselessData(userData: any, manager: boolean): Promise<void>;
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
    checkMailAndPhoneExists(email?: string, phone?: string): Promise<{
        exist: boolean;
        email?: string;
        phone?: string;
        emailExists: boolean;
        phoneExists: boolean;
    }>;
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
    checkLeakData(key: string, value: any): Promise<any>;
    checkEmailExists(email: string): Promise<any>;
    checkPhoneExists(phone: string): Promise<any>;
    getUnreadCount(): Promise<{
        count: any;
    }>;
    checkAdminPermission(): Promise<{
        result: boolean;
    } | undefined>;
    getNotice(cf: {
        query: any;
    }): Promise<any>;
    forgetPassword(email: string): Promise<void>;
    static ipInfo(ip: string): Promise<any>;
    getCheckoutCountingModeSQL(table?: string): Promise<string>;
}
export {};

export declare class ApiUser {
    constructor();
    static register(json: {
        account: string;
        pwd: string;
        userData: any;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static quickRegister(json: {
        account: string;
        pwd: string;
        userData: any;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getNotice(cf: {
        page: number;
        limit: number;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getNoticeUnread(appName?: string, token?: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getUserData(token: string, type: 'list' | 'me'): Promise<{
        result: boolean;
        response: any;
    }>;
    static getUserLevel(token: string, user_id: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getLevelConfig(token: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getEmailCount(email: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getSaasUserData(token: string, type: 'list' | 'me'): Promise<{
        result: boolean;
        response: any;
    }>;
    static setSaasUserData(json: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static getUsersData(userID: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getUsersDataWithEmail(email: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getUsersDataWithEmailOrPhone(search_s: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static subScribe(email: string, tag: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static emailVerify(email: string, app_name?: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static phoneVerify(phone_number: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static registerFCM(userID: string, deviceToken: string, app_name?: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getFCM(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getFilterString(obj: any): string[];
    static getSubScribe(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
        filter?: any;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getSubScribeMailSettingList(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static deleteSubscribe(json: {
        email: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getUserList(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
        search_type?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static userListFilterString(obj: any): string[];
    static userListGroupString(obj: any): string[];
    static getUserListOrders(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
        searchType?: string;
        orderString?: string;
        filter?: any;
        status?: number;
        group?: any;
        filter_type?: string;
    }): Promise<{
        response: {
            data: never[];
            total: number;
            extra?: undefined;
        };
    } | {
        response: {
            data: any;
            total: any;
            extra: any;
        };
    }>;
    static deleteUser(json: {
        id?: string;
        email?: string;
        code?: string;
        app_name?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getPublicUserData(id: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static forgetPwd(email: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static forgetPwdCheckCode(email: string, code: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static resetPwdV2(email: string, code: string, pwd: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static resetPwd(pwd: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static resetPwdCheck(oldPwd: string, pwd: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static updateUserData(json: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static updateUserDataManager(json: any, userID: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static login(json: {
        app_name?: string;
        account?: string;
        pwd?: string;
        login_type?: 'fb' | 'normal' | 'line' | 'google' | 'apple';
        google_token?: string;
        fb_token?: string;
        token?: string;
        line_token?: string;
        redirect?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static checkAdminAuth(cg: {
        app: string;
        token: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static setPublicConfig(cf: {
        key: string;
        value: any;
        user_id?: string;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getPublicConfig(key: string, user_id: string, appName?: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getUserGroupList(type?: string, tag?: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getUserRebate(json: {
        id?: string;
        email?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static permissionFilterString(obj: any): string[];
    static getPermission(json: {
        page: number;
        limit: number;
        self?: boolean;
        queryType?: string;
        query?: string;
        orderBy?: string;
        filter?: any;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static setPermission(json: {
        email: string;
        config: {
            name: string;
            title: string;
            phone: string;
            auth: any;
        };
        status: number;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static deletePermission(email: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static togglePermissionStatus(email: string): Promise<{
        result: boolean;
        response: any;
    }>;
}

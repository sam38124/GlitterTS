export declare class User {
    app: string;
    createUser(account: string, pwd: string, userData: any, req: any): Promise<{
        verify: any;
        token?: undefined;
    } | {
        token: string;
        verify: any;
    }>;
    updateAccount(account: string, userID: string): Promise<any>;
    login(account: string, pwd: string): Promise<any>;
    getUserData(userID: string): Promise<any>;
    getUserList(query: {
        page?: number;
        limit?: number;
        id?: string;
        search?: string;
    }): Promise<{
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
    updateUserData(userID: string, par: any): Promise<{
        data: any;
    }>;
    resetPwd(userID: string, newPwd: string): Promise<{
        result: boolean;
    }>;
    resetPwdNeedCheck(userID: string, pwd: string, newPwd: string): Promise<{
        result: boolean;
    }>;
    updateAccountBack(token: string): Promise<void>;
    verifyPASS(token: string): Promise<any>;
    checkUserExists(account: string): Promise<boolean>;
    constructor(app: string);
}

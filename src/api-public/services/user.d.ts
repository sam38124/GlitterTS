export declare class User {
    app: string;
    createUser(account: string, pwd: string, userData: any, req: any): Promise<{
        token: string;
        verify: any;
    }>;
    updateAccount(account: string, userID: string): Promise<any>;
    login(account: string, pwd: string): Promise<any>;
    getUserData(userID: string): Promise<any>;
    updateUserData(userID: string, par: any): Promise<{
        mailVerify: boolean;
        data: any;
    }>;
    resetPwd(userID: string, pwd: string, newPwd: string): Promise<{
        result: boolean;
    }>;
    updateAccountBack(token: string): Promise<void>;
    verifyPASS(token: string): Promise<any>;
    checkUserExists(account: string): Promise<boolean>;
    constructor(app: string);
}

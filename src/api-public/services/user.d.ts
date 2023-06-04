export declare class User {
    app: string;
    createUser(account: string, pwd: string, userData: any): Promise<{
        token: string;
    }>;
    login(account: string, pwd: string): Promise<any>;
    getUserData(userID: string): Promise<any>;
    updateUserData(userID: string, par: any): Promise<any>;
    checkUserExists(account: string): Promise<boolean>;
    constructor(app: string);
}

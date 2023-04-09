export declare class User {
    static createUser(account: string, pwd: string): Promise<{
        token: string;
    }>;
    static login(account: string, pwd: string): Promise<{
        account: string;
        token: string;
    }>;
    static checkUserExists(account: string): Promise<boolean>;
    constructor();
}

export declare class User {
    static createUser(account: string, pwd: string): Promise<void>;
    static login(account: string, pwd: string): Promise<{
        account: string;
        token: string;
    }>;
    static checkUserExists(account: string): Promise<boolean>;
    constructor();
}

import { IToken } from '../../models/Auth.js';
type AppPermission = {
    userId: string;
    appName: string;
    iat?: number;
    exp?: number;
};
export declare class SharePermission {
    appName: string;
    token: IToken;
    constructor(appName: string, token: IToken);
    getBaseData(): Promise<{
        saas: string | undefined;
        brand: any;
        domain: any;
        app: string;
    } | undefined>;
    getPermission(data: {
        email?: string;
    }): Promise<any>;
    setPermission(data: {
        email: string;
        config: any;
    }): Promise<{
        result: boolean;
    } | {
        redirect_url: URL | undefined;
        email: string;
        config: any;
        saas: string | undefined;
        brand: any;
        domain: any;
        app: string;
        result: boolean;
    }>;
    deletePermission(email: string): Promise<{
        result: boolean;
    } | {
        email: string;
        saas: string | undefined;
        brand: any;
        domain: any;
        app: string;
        result: boolean;
    }>;
    toggleStatus(email: string): Promise<{
        result: boolean;
    } | {
        email: string;
        status: number;
        saas: string | undefined;
        brand: any;
        domain: any;
        app: string;
        result: boolean;
    }>;
    triggerInvited(email: string): Promise<{
        result: boolean;
    } | {
        email: string;
        invited: number;
        saas: string | undefined;
        brand: any;
        domain: any;
        app: string;
        result: boolean;
    }>;
    static generateToken(userObj: AppPermission): Promise<string>;
    static redirectHTML(token: string): Promise<string>;
}
export {};

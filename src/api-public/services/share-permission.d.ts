import { IToken } from '../../models/Auth.js';
export declare class SharePermission {
    appName: string;
    token: IToken;
    constructor(appName: string, token: IToken);
    getBaseData(): Promise<{
        saas: string | undefined;
        brand: any;
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
        email: string;
        config: any;
        saas: string | undefined;
        brand: any;
        app: string;
        result: boolean;
    }>;
    deletePermission(email: string): Promise<{
        result: boolean;
    } | {
        email: string;
        saas: string | undefined;
        brand: any;
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
        app: string;
        result: boolean;
    }>;
}

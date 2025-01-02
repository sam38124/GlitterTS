import { IToken } from '../../models/Auth.js';
interface PermissionItem {
    id: number;
    user: string;
    appName: string;
    config: {
        auth: any;
        name: string;
        phone: string;
        title: string;
        verifyEmail?: string;
    };
    created_time: string;
    updated_time: string;
    status: number;
    invited: number;
    email: string;
    online_time: string;
}
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
        user: any;
    } | undefined>;
    getStoreAuth(): Promise<any>;
    getPermission(json: {
        page: number;
        limit: number;
        email?: string;
        orderBy?: string;
        queryType?: string;
        query?: string;
        status?: string;
    }): Promise<never[] | {
        result: boolean;
        store_permission_title: string;
        data: any[];
        total?: undefined;
    } | {
        data: PermissionItem[];
        total: number;
        store_permission_title: string;
        result?: undefined;
    }>;
    setPermission(data: {
        email: string;
        config: any;
        status?: number;
    }): Promise<{
        result: boolean;
        message?: undefined;
    } | {
        result: boolean;
        message: string;
    } | {
        redirect_url: any;
        email: string;
        config: any;
        status?: number;
        saas: string | undefined;
        brand: any;
        domain: any;
        app: string;
        user: any;
        result: boolean;
        message?: undefined;
    }>;
    deletePermission(email: string): Promise<{
        result: boolean;
    } | {
        email: string;
        saas: string | undefined;
        brand: any;
        domain: any;
        app: string;
        user: any;
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
        user: any;
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
        user: any;
        result: boolean;
    }>;
    static generateToken(userObj: AppPermission): Promise<string>;
    static redirectHTML(token: string): Promise<string>;
}
export {};

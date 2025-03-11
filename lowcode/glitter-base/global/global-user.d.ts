export declare class GlobalUser {
    static tagId: string;
    static getWindow(): any;
    static getTag(tag: string): string;
    static get saas_token(): any;
    static set saas_token(value: any);
    static get token(): any;
    static get userToken(): any;
    static set token(value: any);
    static get language(): any;
    static set language(value: any);
    static get loginRedirect(): string | null;
    static set loginRedirect(value: string | null);
    static userInfo: any;
    static updateUserData: any;
    static parseJWT(token: any): {
        header: any;
        payload: any;
        signature: any;
    };
    static planMapping: () => Record<string, {
        id: number;
        title: string;
    }>;
    static getPlan(): {
        id: number;
        title: string;
    };
}

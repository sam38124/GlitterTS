export declare class ApiWallet {
    static store(json: {
        total: number;
        note: any;
        method?: any;
        return_url: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static withdraw(json: {
        total: number;
        note: any;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getWallet(token?: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getWalletMemory(cf: {
        page: number;
        limit: number;
        type: string;
        start_date: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static withdrawPut(json: {
        id: number;
        status: number;
        note: {};
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static storeByManager(json: {
        userID: number[];
        total: number;
        note: any;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static storeRebateByManager(json: {
        userID: number[];
        total: number;
        note: string;
        rebateEndDay?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static delete(json: {
        id: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static deleteRebate(json: {
        id: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static deleteWithdraw(json: {
        id: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static get(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getRebateConfig(json: {
        type?: 'me' | 'all';
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getRebate(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
        type?: 'me' | 'all';
        dataType?: 'one' | 'all';
        email_or_phone?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getWithdraw(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getSum(json: {
        userID?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getRebateSum(json: {
        userID?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
}

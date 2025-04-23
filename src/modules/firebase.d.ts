export declare class Firebase {
    app: string;
    constructor(app: string);
    static initial(): Promise<void>;
    static appRegister(cf: {
        appID: string;
        appName: string;
        type: 'android' | 'ios';
    }): Promise<void>;
    static getConfig(cf: {
        appID: string;
        type: 'android' | 'ios';
        appDomain: string;
    }): Promise<string | undefined>;
    sendMessage(cf: {
        token?: string | string[];
        userID?: string;
        title: string;
        tag: string;
        link: string;
        body: string;
        app?: string;
        pass_store?: boolean;
    }): Promise<unknown>;
    postFCM(data: any): Promise<{
        result: boolean;
        message: string;
    }>;
    chunkSendFcm(data: any, id: number, date?: string): Promise<void>;
    getFCM(query: {
        type: string;
        page: number;
        limit: number;
        search?: string;
        searchType?: string;
        mailType?: string;
        status?: string;
    }): Promise<{
        data: any;
        total: any;
    }>;
}

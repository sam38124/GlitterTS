export declare class BackendService {
    appName: string;
    constructor(appName: string);
    getDataBaseInfo(): Promise<{
        sql_ip: string;
        sql_pwd: string;
        sql_admin: string;
    }>;
    getApiList(query: {
        page?: number;
        limit?: number;
        id?: string;
        search?: string;
    }): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    getApiRouter(query: {
        port: string;
    }): Promise<{
        url: any;
    } | undefined>;
    getDomainList(query: {
        page?: number;
        limit?: number;
        id?: string;
        search?: string;
    }): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
    serverID(): Promise<any>;
    serverInfo(): Promise<{
        id: any;
        ip: any;
        type: any;
    } | {
        id: any;
        ip: string;
        type?: undefined;
    }>;
    postApi(conf: {
        name: string;
        version: string;
        port: number;
        file: string;
    }): Promise<{
        result: boolean;
    }>;
    shutdown(conf: {
        port: number;
    }): Promise<{
        result: boolean;
    }>;
    deleteAPI(conf: {
        port: number;
    }): Promise<{
        result: boolean;
    }>;
    putDomain(config: {
        domain: string;
        port: string;
    }): Promise<boolean>;
    deleteDomain(config: {
        domain: string;
    }): Promise<boolean>;
    getSampleProject(): Promise<{
        result: unknown;
    }>;
    postProjectToEc2(ip: string, name: string, file: string, port: number): Promise<unknown>;
    stopEc2Project(ip: string, port: number): Promise<unknown>;
    startServer(): Promise<boolean>;
    stopServer(): Promise<boolean>;
}

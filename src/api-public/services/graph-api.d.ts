export declare class GraphApi {
    appName: string;
    constructor(appName: string);
    insert(data: {
        route: 'string';
        method: 'get' | 'post' | 'put' | 'delete' | 'patch';
        info: any;
    }): Promise<{
        result: boolean;
        inertID: any;
    }>;
    update(data: {
        route: 'string';
        method: 'get' | 'post' | 'put' | 'delete' | 'patch';
        info: any;
        id: string;
    }): Promise<{
        result: boolean;
    }>;
}

interface RequestInfo {
    uuid: string;
    method: string;
    url: string;
    ip: string;
}
declare class AsyncHook {
    store: Map<number, any>;
    constructor();
    createRequestContext(requestInfo: RequestInfo): void;
    getRequestContext(): RequestInfo;
}
export declare class Singleton {
    private static instance;
    private constructor();
    static getInstance(): AsyncHook;
}
export { Singleton as asyncHooks };

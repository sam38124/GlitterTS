export declare class ServerCache {
    static share: any;
    static setCache(tag: string, fun: (callback: (response: any) => any) => void, callback: any): void;
    static clearCache(tag: string): void;
}

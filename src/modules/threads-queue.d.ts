export declare class ThreadsQueue {
    static share: any;
    static setQueue(tag: string, fun: (callback: (response: any) => any) => void, callback: any): void;
}

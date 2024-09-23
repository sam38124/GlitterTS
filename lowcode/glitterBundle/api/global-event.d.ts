export declare class GlobalEvent {
    static config: () => any;
    static addGlobalEvent(data: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static deleteGlobalEvent(tag: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static putGlobalEvent(data: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static getGlobalEvent(cf: {
        tag?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
}

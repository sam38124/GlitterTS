export declare class WebSocket {
    static chatMemory: {
        [key: string]: {
            id: any;
            user_id: string;
            callback: (data: any) => void;
        }[];
    };
    static start(): void;
}

export declare class WebSocket {
    static chatMemory: {
        [key: string]: {
            id: any;
            user_id: string;
            callback: (data: any) => void;
        }[];
    };
    static messageChangeMem: {
        [userID: string]: {
            id: any;
            callback: (data: any) => void;
        }[];
    };
    static noticeChangeMem: {
        [userID: string]: {
            id: any;
            callback: (data: any) => void;
        }[];
    };
    static start(): void;
    static userMessage(): void;
}

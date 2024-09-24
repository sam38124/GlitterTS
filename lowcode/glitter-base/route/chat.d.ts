export declare class Chat {
    constructor();
    static post(json: {
        "type": 'user' | 'group';
        "participant": string[];
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static postMessage(json: {
        "chat_id": string;
        "user_id": string;
        "message": {
            "text": string;
            "attachment": string;
        };
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getMessage(json: {
        limit: number;
        page: number;
        chat_id: string;
        latestID?: string;
        olderID?: string;
        user_id: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getChatRoom(json: {
        limit: number;
        page: number;
        user_id?: string;
        chat_id?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getUnRead(json: {
        user_id: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static deleteChatRoom(json: {
        id: string;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
}

export interface ChatRoom {
    chat_id: string;
    type: 'user' | 'group';
    info: any;
    participant: string[];
}
export declare class ShopnexLineMessage {
    static get token(): string | undefined;
    static handleJoinEvent(event: any, app: string): Promise<void>;
    static handlePostbackEvent(event: any, app: string): Promise<void>;
    static sendPrivateMessage(userId: string, message: string): Promise<void>;
    private static getLineGroupInf;
    static generateVerificationCode(app: string): Promise<string>;
    static verifyVerificationCode(data: any): Promise<{
        result: string;
        data: string;
    } | {
        data: string;
        result?: undefined;
    }>;
    static getLineGroup(app: string): Promise<any>;
}

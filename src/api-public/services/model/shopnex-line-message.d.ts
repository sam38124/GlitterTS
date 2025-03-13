export interface CartInfo {
    id: string;
    cart_id: string;
    content: {
        cart: {
            id: string;
            spec: string;
            count: number;
        }[];
        from: {
            purchase: string;
            scheduled_id: string;
            source: string;
            user_id: string;
            user_photo: string;
            user_name: string;
        };
        total: number;
        checkUrl: string;
    };
    created_time: string;
}
export interface ScheduledInfo {
    id: string;
    type: string;
    status: number;
    content: {
        stock: {
            period: number;
            reserve: boolean;
            expiry_date: string;
        };
        purpose: string;
        start_date: string;
        start_time: string;
        end_date: string;
        end_time: string;
        item_list: {
            id: string;
            content: {
                name: string;
                variants: any;
            };
        }[];
        lineGroup?: {
            groupId: string;
            groupName: string;
        };
        discount_set: boolean;
        pending_order: string[];
        pending_order_total: number;
    };
    created_time: string;
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
    static getUserProfile(userId: string): Promise<any>;
}

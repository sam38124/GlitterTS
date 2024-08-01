export declare class AutoSendEmail {
    static getDefCompare(app: string, tag: string): Promise<any>;
    static getCustomerMessageHTML(): string;
    static customerOrder(app: string, tag: string, order_id: string, email: string): Promise<void>;
}

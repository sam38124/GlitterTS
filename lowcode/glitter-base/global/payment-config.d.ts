export declare class PaymentConfig {
    static onlinePay: ({
        key: string;
        name: string;
        img: string;
        type?: undefined;
    } | {
        key: string;
        name: string;
        type: string;
        img: string;
    })[];
    static getSupportPayment(all?: boolean): Promise<({
        key: string;
        name: string;
        img: string;
        type?: undefined;
    } | {
        key: string;
        name: string;
        type: string;
        img: string;
    })[]>;
}

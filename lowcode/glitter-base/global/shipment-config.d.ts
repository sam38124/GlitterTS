export declare class ShipmentConfig {
    static list: ({
        title: string;
        value: string;
        src: string;
        paynow_id?: undefined;
        type?: undefined;
    } | {
        title: string;
        value: string;
        src: string;
        paynow_id: string;
        type?: undefined;
    } | {
        title: string;
        value: string;
        type: string;
        src: string;
        paynow_id?: undefined;
    })[];
    static supportPrintList: string[];
    static supermarketList: string[];
    static allShipmentMethod(all?: boolean): Promise<{
        key: string;
        name: string;
    }[]>;
}

export declare class CheckoutService {
    static updateAndMigrateToTableColumn(obj: {
        id?: string;
        cart_token?: string;
        orderData: any;
        app_name: string;
        no_shipment_number?: boolean;
    }): Promise<void>;
}

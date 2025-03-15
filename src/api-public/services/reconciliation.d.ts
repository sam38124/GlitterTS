export declare class Reconciliation {
    app_name: string;
    constructor(app: string);
    summary(filter_date: string, start_date: string, end_date: string): Promise<{
        total: number;
        total_received: number;
        offset_amount: number;
        expected_received: number;
        order_count: number;
        short_total_amount: number;
        over_total_amount: number;
    }>;
    putReconciliation(obj: {
        order_id: string;
        update: any;
    }): Promise<any>;
}

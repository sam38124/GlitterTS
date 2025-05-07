import { IToken } from '../models/Auth.js';
type StockListRecordData = {
    store_name: string;
    before_count: number;
    after_count: number;
};
export declare class DiffRecord {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    createChangedLog(json: {
        entity_table: string;
        entity_id: number;
        type?: string;
        note: string;
        changed_json: any;
        changed_source: 'client' | 'management';
        changed_by: string;
    }): Promise<void>;
    recordProdcut(updater_id: string, product_id: number, update_content: any): Promise<void>;
    recordProdcutVariant(updater_id: string, variant_id: number, update_variant: any): Promise<void>;
    static changedStockListLog(stock_list: any, store_config: any): StockListRecordData[];
}
export {};

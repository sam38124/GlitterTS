export declare class UtDatabase {
    app: string;
    table: string;
    constructor(app: string, table: string);
    querySql(querySql: string[], query: {
        page: number;
        limit: number;
        id?: string;
        order_string?: string;
    }, select?: string): Promise<{
        data: any;
        result: boolean;
        total?: undefined;
    } | {
        data: any;
        total: any;
        result?: undefined;
    }>;
}

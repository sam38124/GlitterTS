import mysql from "mysql2/promise";
export declare const limit: (map: any) => string;
declare const query: (sql: string, params: unknown[]) => Promise<any>;
export declare const queryLambada: (cf: {
    database?: string;
}, fun: (v: {
    query(sql: string, params: unknown[]): Promise<any>;
}) => any) => Promise<any>;
declare class Transaction {
    private trans;
    connectionId: any;
    private TAG;
    static build(): Promise<Transaction>;
    execute(sql: string, params: any[] | any): Promise<any>;
    commit(): Promise<void>;
    release(): Promise<void>;
}
declare const _default: {
    createPool: () => Promise<mysql.Pool | undefined>;
    execute: (sql: string, params: any[]) => Promise<any>;
    query: (sql: string, params: unknown[]) => Promise<any>;
    Transaction: typeof Transaction;
    getPagination: (sql: string, page: number, pageCount: number) => string;
    escape: (parameter: any) => string;
    queryLambada: (cf: {
        database?: string | undefined;
    }, fun: (v: {
        query(sql: string, params: unknown[]): Promise<any>;
    }) => any) => Promise<any>;
};
export default _default;

export declare class WorkerThread {
    static query(data: {
        queryList: {
            sql: string;
            data: any[];
        }[];
        type: 0 | 1;
        divisor: number;
    }): Promise<{
        type: string;
        divisor: number;
        executionTime: string;
    }>;
}

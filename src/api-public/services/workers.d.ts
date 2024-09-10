export declare class Workers {
    static query(data: {
        queryList: {
            sql: string;
            data: any[];
        }[];
        divisor?: number;
    }): Promise<{
        type: string;
        divisor: number;
        executionTime: string;
        queryStatus: "error" | "success";
        queryData: any;
    }>;
}

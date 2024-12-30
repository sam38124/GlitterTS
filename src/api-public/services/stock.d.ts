import { IToken } from '../models/Auth.js';
type StockList = {
    [key: string]: {
        count: number;
    };
};
export declare class Stock {
    app: string;
    token: IToken | undefined;
    constructor(app: string, token?: IToken);
    productList(json: {
        page: string;
        limit: string;
        search: string;
    }): Promise<{
        total: any;
        data: any;
    } | undefined>;
    allocateStock(stockList: StockList, requiredCount: number): {
        stockList: StockList;
        deductionLog: {
            [key: string]: number;
        };
        totalDeduction: number;
        remainingCount: number;
    };
}
export {};

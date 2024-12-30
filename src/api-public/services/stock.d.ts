import { IToken } from '../models/Auth.js';
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
}

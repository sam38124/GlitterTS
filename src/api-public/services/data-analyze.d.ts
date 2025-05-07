import { IToken } from '../models/Auth.js';
export declare class DataAnalyze {
    app: string;
    token?: IToken;
    constructor(app: string, token?: IToken);
    workerExample(data: {
        type: 0 | 1;
        divisor: number;
    }): Promise<{
        type: string;
        divisor: number;
        executionTime: string;
        queryStatus: "success" | "error";
        queryData: any;
    } | {
        type: string;
        divisor: number;
        executionTime: string;
    }>;
    getDataAnalyze(tags: string[], query: any): Promise<Record<string, any>>;
    getOrderCountingSQL(): Promise<string>;
    getRecentActiveUser(): Promise<{
        recent: any;
        months: any;
    }>;
    getSalesInRecentMonth(): Promise<{
        recent_month_total: number;
        previous_month_total: number;
        gap: number;
    }>;
    getHotProducts(duration: 'month' | 'day' | 'all', query?: string): Promise<{
        series: any[];
        categories: any[];
        product_list: any[];
        sorted_collections: {
            count: number;
            sale_price: number;
            collection: string;
        }[];
    }>;
    getOrdersInRecentMonth(): Promise<{
        recent_month_total: any;
        previous_month_total: any;
        gap: number;
    }>;
    getOrdersPerMonth2week(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrdersPerMonth(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrdersPerMonthCustom(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrdersPerMonth1Year(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getSalesPerMonth1Year(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getSalesPerMonth2week(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getSalesPerMonth(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    diffDates(startDateObj: Date, endDateObj: Date): number;
    getSalesPerMonthCustom(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrderAvgSalePriceYear(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrderAvgSalePrice(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrderAvgSalePriceMonth(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getOrderAvgSalePriceCustomer(query: string): Promise<{
        countArray: any[];
        countArrayPos: any[];
        countArrayStore: any[];
        countArrayWeb: any[];
    }>;
    getActiveRecentYear(): Promise<{
        count_array: any[];
    }>;
    getActiveRecentWeek(): Promise<{
        count_array: any[];
    }>;
    getActiveRecentMonth(): Promise<{
        count_array: any[];
    }>;
    getActiveRecentCustom(query: string): Promise<{
        count_array: any[];
    }>;
    getRegisterMonth(): Promise<{
        countArray: any[];
    }>;
    getRegisterCustom(query: string): Promise<{
        countArray: any[];
    }>;
    getRegister2week(): Promise<{
        countArray: any[];
    }>;
    getRegisterYear(): Promise<{
        today: any;
        count_register: any[];
        count_2_week_register: any[];
    }>;
    getOrderToDay(): Promise<{
        total_count: any;
        un_shipment: any;
        un_pay: any;
        total_amount: any;
    }>;
}

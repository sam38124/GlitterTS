export declare class Currency {
    static code: {
        country_code: string;
        country_name: string;
        currency_symbol: string;
        currency_code: string;
        currency_title: string;
    }[];
    static getCurrency(): {
        country_code: string;
        country_name: string;
        currency_symbol: string;
        currency_code: string;
        currency_title: string;
    } | undefined;
    static setCurrency(country: string): void;
    static convertCurrency(money: any): number;
    static convertCurrencyText(money: any): string;
}

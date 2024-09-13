type StoreBrand = 'FAMIC2C' | 'UNIMARTC2C' | 'HILIFEC2C' | 'OKMARTC2C';
export declare class Delivery {
    appName: string;
    constructor(appName: string);
    getC2CMap(returnURL: string, logistics: string): Promise<string>;
    postStoreOrder(): Promise<string>;
    printOrderInfo(brand: StoreBrand): Promise<string>;
}
export {};

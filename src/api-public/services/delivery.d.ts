export declare class Delivery {
    appName: string;
    constructor(appName: string);
    getC2CMap(returnURL: string, logistics: string): Promise<string>;
}

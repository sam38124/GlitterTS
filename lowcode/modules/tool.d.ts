export declare class Tool {
    static truncateString(str: string, maxLength?: number): string;
    static twenLength(str: string): number;
    static randomString(max: number): string;
    static convertDateTimeFormat: (dateTimeStr: string) => string;
    static ObjCompare(obj1: {
        [k: string]: any;
    }, obj2: {
        [k: string]: any;
    }): boolean;
}

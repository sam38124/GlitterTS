type DiffResult = {
    [key: string]: any;
};
declare function isNull(...args: any[]): boolean;
declare function replaceDatetime(datetime: any): any;
export declare function toJSONSafeString(val: string): string;
interface requestBody {
    [key: string]: any;
}
declare function getMaskObj(obj: any): requestBody;
declare function hashPwd(pwd: string): Promise<string>;
declare function createOrderId(): string;
declare function floatAdd(a: number, b: number): number;
declare function deepDiff(obj1: any, obj2: any): DiffResult;
declare const _default: {
    isNull: typeof isNull;
    replaceDatetime: typeof replaceDatetime;
    toJSONSafeString: typeof toJSONSafeString;
    getMaskObj: typeof getMaskObj;
    hashPwd: typeof hashPwd;
    createOrderId: typeof createOrderId;
    randomString: (max: number) => string;
    compareHash: (pwd: string, has: string) => Promise<boolean>;
    randomNumber: (max: number) => string;
    getCurrentDateTime: (json?: {
        inputDate?: string;
        addSeconds?: number;
    }) => string;
    formatDateTime: (dateTimeStr?: string, includeSeconds?: boolean) => string;
    floatAdd: typeof floatAdd;
    deepDiff: typeof deepDiff;
};
export default _default;

declare function isNull(...args: any[]): boolean;
export declare function getUUID(): string;
declare function replaceDatetime(datetime: any): any;
export declare function toJSONSafeString(val: string): string;
interface requestBody {
    [key: string]: any;
}
declare function getMaskObj(obj: any): requestBody;
declare function hashPwd(pwd: string): Promise<string>;
declare function hashSHA256(value: string): string;
declare function createOrderId(): string;
declare const _default: {
    isNull: typeof isNull;
    replaceDatetime: typeof replaceDatetime;
    toJSONSafeString: typeof toJSONSafeString;
    getMaskObj: typeof getMaskObj;
    hashPwd: typeof hashPwd;
    createOrderId: typeof createOrderId;
    randomString: (max: number) => string;
    compareHash: (pwd: string, has: string) => Promise<boolean>;
    checksum: (message: string) => string;
    hashSHA256: typeof hashSHA256;
};
export default _default;

declare function isNull(...args: any[]): boolean;
declare function replaceDatetime(datetime: any): any;
export declare function toJSONSafeString(val: string): string;
interface requestBody {
    [key: string]: any;
}
declare function getMaskObj(obj: any): requestBody;
declare function hashPwd(pwd: string): Promise<string>;
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
    randomNumber: (max: number) => string;
<<<<<<< HEAD
    convertDateTimeFormat: (dateTimeStr?: string) => string;
=======
    getCurrentDateTime: (json?: {
        inputDate?: string | undefined;
        addSeconds?: number | undefined;
    } | undefined) => string;
>>>>>>> e845017f (update: stocking history UI & event)
};
export default _default;

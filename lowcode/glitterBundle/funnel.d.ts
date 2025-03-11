import { GVC } from './GVController.js';
interface osType {
    path: string;
    key: string;
    def: string | {
        [k: string]: any;
    }[];
    searchData: string;
    height?: number;
    setTime?: number;
    multi?: boolean;
}
interface ajaxType {
    api?: string;
    route: string;
    method: string;
    data?: any;
}
export declare class Funnel {
    constructor(gvc: GVC);
    optionSreach: (set: osType, callback: (res: any) => void, arg?: {
        [k: string]: any;
    }) => string;
    randomString: (max: number) => string;
    parseCookie: () => any;
    setCookie: (key: string, value: any) => void;
    getCookieByName: (name: string) => any;
    removeCookie: (keyList: string[] | string) => void;
    ObjCompare: (obj1: {
        [k: string]: any;
    }, obj2: {
        [k: string]: any;
    }) => boolean;
    apiAJAX: (obj: ajaxType, callback?: (res: any) => void) => void;
    setFavicon: (ico: string) => void;
    copyRight: (name: string, url: string, color?: string) => string;
    addQuantile: (num: number | string) => string;
    isUNO: (value: any) => boolean;
    isURL: (str_url: string) => boolean;
    centerImage: (img_url: string) => string;
    ensure: <T>(argument: T | undefined | null, message?: string) => T;
    encodeFileBase64: (files: File, callback: (resp: any) => void) => void;
    buildData: (data: {}[]) => Promise<unknown>;
    downloadCSV: (data: {}[], setFileName: string) => void;
    cutString: (text: string, limit: number) => string;
}
export {};

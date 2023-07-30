/// <reference types="node" />
import { Encoding } from 'crypto';
interface IData {
    [key: string]: string | string[] | number;
}
declare type QueryParams = Record<string, string>;
export default class Tool {
    arrayEquals(a_array: any[], b_array: any[]): boolean;
    randomString(max: number): string;
    randomRumber(max: number): string;
    CSVtoArray(text: string): string[];
    JsonToQueryString(data: IData): string;
    queryStringToJSON(queryString: string): QueryParams;
    aesEncrypt(data: string, key: string, iv: string, input?: Encoding, output?: Encoding, method?: string): string;
    aesDecrypt: (data: string, key: string, iv: string, input?: Encoding, output?: Encoding, method?: string) => string;
    compareHash: (pwd: string, has: string) => Promise<boolean>;
    nowTime: () => string;
    sortObjectByKey: (unordered: {
        [k: string]: any;
    }) => {
        [k: string]: any;
    };
}
export {};

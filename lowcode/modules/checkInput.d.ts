export declare class CheckInput {
    static isEmpty(input: any): boolean;
    static isURL(input: string): boolean;
    static isEmail(input: string): boolean;
    static isTaiwanPhone(input: string): boolean;
    static isNumberString(input: string): boolean;
    static isEnglishNumberHyphen(input: string): boolean;
    static isChineseEnglishNumberHyphen(input: string): boolean;
    static isBirthString(input: string): boolean;
}

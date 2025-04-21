export type LanguageLocation = 'en-US' | 'zh-CN' | 'zh-TW';
export declare class Language {
    static locationList: LanguageLocation[];
    static languageDataList(): {
        key: string;
        tw: string;
        cn: string;
        en: string;
    }[];
    static text(key: string, lan: string): any;
}

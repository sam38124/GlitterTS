export declare class Language {
    static languageSupport(): {
        key: string;
        value: string;
    }[];
    static getLanguage(): string;
    static getLanguageLinkPrefix(pre?: boolean, compare?: string, d_window?: Window): string;
    static getLanguageText(cf: {
        local?: boolean;
        compare?: string;
    }): string | undefined;
    static setLanguage(value: any): void;
    static text(key: string): any;
    static checkKeys(): void;
    static languageDataList(): {
        key: string;
        tw: string;
        cn: string;
        en: string;
    }[];
    static getLanguageCustomText(text: string): string;
}

export declare class EditorElem {
    static h3(title: string): string;
    static plusBtn(title: string, event: any): string;
    static toggleExpand(obj: {
        gvc: any;
        title: string;
        data: any;
        innerText: string | (() => string);
        color?: string;
    }): string;
    static minusTitle(title: string, event: string): string;
    static searchInput(obj: {
        title: string;
        gvc: any;
        def: string;
        array: string[];
        callback: (text: string) => void;
        placeHolder: string;
    }): string;
}

export declare const seoManager: {
    title: string;
    key: string;
    callback: (text: string) => string;
    editor: (d: {
        def: string;
        callback: (value: string) => void;
        gvc: any;
    }) => string;
}[];

export declare class Ai {
    static files: {
        guide: string;
    };
    static initial(): Promise<void>;
    static defaultQA: {
        request: string[];
        response: string;
    }[];
    static defaultProduct: {
        商品名稱: string;
        描述: string;
    }[];
}

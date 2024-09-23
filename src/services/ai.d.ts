export declare class Ai {
    static files: {
        guide: string;
    };
    static initial(): Promise<void>;
    static defaultResponse: {
        tags: string[];
        keywords: string[];
        response: string;
    }[];
}

export declare class Ai {
    static files: {
        guide: string;
    };
    static initial(): Promise<void>;
    static defaultResponse: {
        question: string[];
        answer: string;
    }[];
    static defaultResponse2: {
        tags: string[];
        keywords: string[];
        response: string;
    }[];
}

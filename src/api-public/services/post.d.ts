export declare class Post {
    app: string;
    postContent(content: any): Promise<any>;
    getContent(content: any): Promise<{
        data: any;
        count: any;
    }>;
    constructor(app: string);
}

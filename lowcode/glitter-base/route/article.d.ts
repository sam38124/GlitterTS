export declare class Article {
    static get(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
        tag?: string;
        label?: string;
        for_index?: string;
        status?: string;
        page_type?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static delete(json: {
        id: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static deleteV2(json: {
        id: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static post(tData: {
        tag: string;
        name: string;
        copy: string;
    }, status?: number): Promise<{
        result: boolean;
        response: any;
    }>;
    static put(tData: any): Promise<{
        result: boolean;
        response: any;
    }>;
}

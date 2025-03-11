export declare class AiChat {
    static sync_data(json: {
        app_name?: string;
        type: 'writer' | 'order_analysis' | 'operation_guide' | 'page_editor' | 'ai_generator';
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static reset(json: {
        app_name?: string;
        type: 'writer' | 'order_analysis' | 'operation_guide' | 'page_editor' | 'ai_generator';
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static generateHtml(json: {
        app_name?: string;
        text: string;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static editorHtml(json: {
        app_name?: string;
        text: string;
        format: any;
        assistant?: any;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static searchProduct(json: {
        app_name?: string;
        text: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
}

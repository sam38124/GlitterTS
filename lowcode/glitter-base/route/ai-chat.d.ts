export declare class AiChat {
    static sync_data(json: {
        app_name?: string;
        type: 'writer' | 'order-analysis' | 'operation-guide';
    }): Promise<{
        result: boolean;
        response: any;
    }>;
}

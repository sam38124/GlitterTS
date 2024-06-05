export declare class ApiFcm {
    constructor();
    static send(json: {
        "device_token": string[];
        "title": string;
        "content": string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
}

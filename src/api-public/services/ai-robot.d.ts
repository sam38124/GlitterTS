export declare class AiRobot {
    static guide(app_name: string, question: string): Promise<{
        text: string;
        usage?: undefined;
    } | {
        text: string;
        usage: number;
    }>;
    static orderAnalysis(app_name: string, question: string): Promise<{
        text: string;
        usage?: undefined;
    } | {
        text: string;
        usage: number;
    }>;
    static design(app_name: string, question: string): Promise<{
        text: string;
        prompt?: undefined;
        image?: undefined;
        usage?: undefined;
    } | {
        prompt: any;
        image: unknown;
        usage: number;
        text?: undefined;
    } | {
        text: string;
        usage: number;
        prompt?: undefined;
        image?: undefined;
    }>;
    static writer(app_name: string, question: string): Promise<{
        text: string;
        usage?: undefined;
    } | {
        text: string;
        usage: number;
    }>;
    static checkPoints(app_name: string): Promise<boolean>;
    static usePoints(app_name: string, token_number: number, ask: string, response: string): Promise<number>;
    static syncAiRobot(app: string): Promise<string | undefined>;
    static aiResponse(app_name: string, question: string): Promise<{
        text: string;
        usage: number;
    } | undefined>;
    static codeGenerator(app_name: string, question: string): Promise<{
        usage: number;
        obj?: undefined;
    } | {
        obj: string;
        usage: number;
    }>;
    static uploadFile(file_name: string, fileData: Buffer): Promise<string>;
    static convertS3Link(link: string): Promise<unknown>;
    static codeEditor(app_name: string, question: string, format: any, assistant?: string): Promise<{
        usage: number;
        obj?: undefined;
    } | {
        obj: string;
        usage: number;
    }>;
}

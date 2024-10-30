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
}

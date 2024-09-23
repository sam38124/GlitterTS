export declare class AiRobot {
    static guide(app_name: string, question: string): Promise<string>;
    static orderAnalysis(app_name: string, question: string): Promise<string>;
    static writer(app_name: string, question: string): Promise<string>;
}

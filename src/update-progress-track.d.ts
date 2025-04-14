export interface Stack {
    appName: string;
    taskId: string;
    taskTag: string;
    progress: number;
}
export declare class StackTracker {
    static stack: Stack[];
    static setProgress(taskId: string, percentage: number): void;
    static getProgress(taskId: string): number | undefined;
    static getAllProgress(appName: string): Stack[];
    static clearProgress(taskId: string): void;
    static calcPercentage(nume: number, deno: number): number;
}

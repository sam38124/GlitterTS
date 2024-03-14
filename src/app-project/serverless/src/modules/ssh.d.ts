export declare class Ssh {
    static exec(array: string[]): Promise<unknown>;
    static readFile(remote: string): Promise<unknown>;
}

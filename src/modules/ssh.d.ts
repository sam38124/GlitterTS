export declare class Ssh {
    static exec(array: string[], ip?: string): Promise<unknown>;
    static readFile(remote: string, ip?: string): Promise<unknown>;
    static uploadFile(file: string, fileName: string, type: 'data' | 'file'): Promise<unknown>;
}

export declare class ReleaseIos {
    static release(cf: {
        appName: string;
        bundleID: string;
        appDomain: string;
        project_router: string;
        glitter_domain: string;
    }): void;
    static copyFolderSync(source: string, target: string): void;
    static removeAllFilesInFolder(folderPath: string): void;
    static compressFiles(inputFolder: string, outputZip: string): Promise<unknown>;
    static uploadFile(filePath: string, fileName: string): Promise<unknown>;
    static deleteFolder(folderPath: string): void;
    static deleteFile(filePath: string): void;
}

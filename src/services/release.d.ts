export declare class Release {
    static ios(cf: {
        appName: string;
        bundleID: string;
        appDomain: string;
        project_router: string;
        glitter_domain: string;
        domain_url: string;
    }): Promise<void>;
    static android(cf: {
        appName: string;
        bundleID: string;
        appDomain: string;
        project_router: string;
        glitter_domain: string;
        domain_url: string;
    }): Promise<void>;
    static resetProjectRouter(cf: {
        project_router: string;
        targetString: string;
        replacementString: string;
    }): Promise<unknown>;
    static getHtml(cf: {
        appName: string;
        bundleID: string;
        appDomain: string;
        project_router: string;
        glitter_domain: string;
    }): string;
    static copyFolderSync(source: string, target: string): void;
    static removeAllFilesInFolder(folderPath: string): void;
    static compressFiles(inputFolder: string, outputZip: string): Promise<unknown>;
    static uploadFile(filePath: string, fileName: string): Promise<unknown>;
    static deleteFolder(folderPath: string): void;
    static deleteFile(filePath: string): void;
}

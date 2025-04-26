export interface AppReleaseConfig {
    logo: string;
    name: string;
    status: string;
    keywords: string;
    copy_right: string;
    store_name: string;
    description: string;
    privacy_url: string;
    promote_img: string;
    support_url: string;
    landing_page: string;
    contact_email: string;
    contact_phone: string;
    store_sub_title: string;
    app_store_promote: string;
    google_play_promote: string;
}
export declare class Release {
    static android(cf: {
        appName: string;
        bundleID: string;
        appDomain: string;
        project_router: string;
        glitter_domain: string;
        domain_url: string;
        config: AppReleaseConfig;
    }): Promise<void>;
    static downloadImage(url: string, outputPath: string): Promise<void>;
    static generateAndroidIcon(sourceIcon: string, outputDir: string): Promise<void>;
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

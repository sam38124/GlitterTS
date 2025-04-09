import { AppReleaseConfig } from './release.js';
export declare class IosRelease {
    static generateIcon(url: string, inputImage: string, outputDir: string): Promise<void>;
    static generateAppLanding(url: string, inputImage: string, outputDir: string): Promise<void>;
    static changePackageName(project_router: string, bundleID: string, config: AppReleaseConfig): void;
    static changeInfo(project_router: string, bundleID: string, config: AppReleaseConfig): void;
    static start(cf: {
        appName: string;
        bundleID: string;
        appDomain: string;
        project_router: string;
        glitter_domain: string;
        domain_url: string;
        config: AppReleaseConfig;
    }): Promise<void>;
}

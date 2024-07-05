export declare class UpdateScript {
    static run(): Promise<void>;
    static migrateLink(appList: string[]): Promise<void>;
    static migrateRichText(): Promise<void>;
    static migrateAccount(appName: string): Promise<void>;
    static migrateHeaderAndFooter(appList: string[]): Promise<void>;
    static migrateTermsOfService(appList: string[]): Promise<void>;
    static migrateRebatePage(appList: string[]): Promise<void>;
    static migrateDialog(appList: string[]): Promise<void>;
}

export declare class UpdateScript {
    static run(): Promise<void>;
    static migrate_blogs_toPage(): Promise<void>;
    static migrateHomePageFooter(appList: string[]): Promise<void>;
    static migrateInitialConfig(appList: string[]): Promise<void>;
    static migrateSinglePage(appList: string[]): Promise<void>;
    static migrateLink(appList: string[]): Promise<void>;
    static migrateRichText(): Promise<void>;
    static migrateAccount(appName: string): Promise<void>;
    static migrateHeaderAndFooterAndCollection(appList: string[]): Promise<void>;
    static migratePages(appList: string[], migrate: string[]): Promise<void>;
    static migrateRebatePage(appList: string[]): Promise<void>;
    static migrateDialog(appList: string[]): Promise<void>;
    static hiddenEditorAble(): Promise<void>;
    static migrateHeader(appList: string[]): Promise<void>;
    static migrateFooter(appList: string[]): Promise<void>;
}

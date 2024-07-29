export declare class UpdateScript {
    static run(): Promise<void>;
    static migrateLink(appList: string[]): Promise<void>;
    static migrateRichText(): Promise<void>;
    static migrateAccount(appName: string): Promise<void>;
    static migrateHeaderAndFooter(appList: string[]): Promise<void>;
    static migratePages(appList: string[], migrate: string[]): Promise<void>;
    static migrateRebatePage(appList: string[]): Promise<void>;
    static migrateDialog(appList: string[]): Promise<void>;
    static hiddenEditorAble(): Promise<void>;
    static migrateHeader(appList: string[]): Promise<void>;
}

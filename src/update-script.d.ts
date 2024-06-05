export declare class UpdateScript {
    static run(): Promise<void>;
    static migrateHeaderAndFooter(appList: string[]): Promise<void>;
    static migrateTermsOfService(appList: string[]): Promise<void>;
    static migrateRebatePage(appList: string[]): Promise<void>;
}

export declare class ApiPublic {
    static checkApp: {
        app_name: string;
        refer_app: string;
    }[];
    static createScheme(appName: string): Promise<void>;
    static checkSQLAdmin(appName: string): Promise<void>;
    static migrateVariants(app: string): Promise<void>;
}

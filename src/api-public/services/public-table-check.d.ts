export declare class ApiPublic {
    static checkedApp: {
        app_name: string;
        refer_app: string;
    }[];
    static checkingApp: {
        app_name: string;
        refer_app: string;
    }[];
    static app301: {
        app_name: string;
        router: {
            legacy_url: string;
            new_url: string;
        }[];
    }[];
    static createScheme(appName: string): Promise<void>;
    static checkSQLAdmin(appName: string): Promise<void>;
    static migrateVariants(app: string): Promise<void>;
}

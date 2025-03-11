export declare class ProductMigrate {
    static migrate(app_name: string, obj: {
        content: any;
        id: string;
        created_time: string;
        updated_time: string;
    }[]): Promise<void>;
}

export declare class UpdatedTableChecked {
    static startCheck(app_name: string): Promise<void>;
    static update(obj: {
        app_name: string;
        table_name: string;
        last_version: string[];
        new_version: string;
        event: string | (() => Promise<any>);
    }): Promise<void>;
}

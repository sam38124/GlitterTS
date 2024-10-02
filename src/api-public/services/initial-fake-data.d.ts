export declare class InitialFakeData {
    app_name: string;
    constructor(app_name: string);
    run(): Promise<void>;
    insertFakeUser(): Promise<void>;
}

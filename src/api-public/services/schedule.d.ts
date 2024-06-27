export declare class Schedule {
    app: string;
    constructor(app: string);
    example(sec: number): void;
    birthRebate(sec: number): Promise<void>;
    isDatabaseExists(): Promise<boolean>;
    isDatabasePass(): Promise<boolean>;
    isTableExists(table: string): Promise<boolean>;
    main(): Promise<void>;
}

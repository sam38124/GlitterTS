export declare class Schedule {
    app: string;
    constructor(app: string);
    perload(): Promise<boolean>;
    isDatabaseExists(): Promise<boolean>;
    isDatabasePass(): Promise<boolean>;
    isTableExists(table: string): Promise<boolean>;
    refreshMember(sec: number): Promise<void>;
    example(sec: number): Promise<void>;
    birthRebate(sec: number): Promise<void>;
    resetVoucherHistory(sec: number): Promise<void>;
    main(): Promise<void>;
}

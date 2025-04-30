export declare class Schedule {
    static app: string[];
    perload(app: string): Promise<boolean>;
    isDatabaseExists(app: string): Promise<boolean>;
    isDatabasePass(app: string): Promise<boolean>;
    isTableExists(table: string, app: string): Promise<boolean>;
    example(sec: number): Promise<void>;
    autoCancelOrder(sec: number): Promise<void>;
    renewMemberLevel(sec: number): Promise<void>;
    birthRebate(sec: number): Promise<void>;
    birthBlessMail(sec: number): Promise<void>;
    resetVoucherHistory(sec: number): Promise<void>;
    autoTriggerInvoice(sec: number): Promise<void>;
    autoSendFCM(sec: number): Promise<void>;
    autoSendMail(sec: number): Promise<void>;
    autoSendLine(sec: number): Promise<void>;
    initialSampleApp(sec: number): Promise<void>;
    currenciesUpdate(sec: number): Promise<void>;
    main(): void;
}

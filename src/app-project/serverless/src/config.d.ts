export declare class ConfigSetting {
    static config_path: string;
    static setConfig(envPath: string): void;
}
export declare const config: {
    readonly domain: string | undefined;
    LOG_PATH: string;
    DB_CONN_LIMIT: number;
    DB_QUEUE_LIMIT: number;
    readonly DB_URL: string | undefined;
    DB_PORT: number;
    readonly DB_USER: string | undefined;
    readonly DB_PWD: string | undefined;
    readonly DB_NAME: string | undefined;
    readonly REDIS_URL: string | undefined;
    readonly REDIS_PORT: string | undefined;
    readonly REDIS_PWD: string | undefined;
    readonly AWS_S3_NAME: string | undefined;
    readonly AWS_ACCESS_KEY: string | undefined;
    readonly AWS_SecretAccessKey: string | undefined;
    readonly AWS_S3_PREFIX_DOMAIN_NAME: string;
    readonly SINGLE_TYPE: boolean;
};
export default config;

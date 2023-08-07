export declare class ConfigSetting {
    static config_path: string;
    static setConfig(envPath: string): void;
}
export declare let saasConfig: {
    readonly SAAS_NAME: string | undefined;
    DEF_DEADLINE: number;
};
export declare const config: {
    readonly domain: string | undefined;
    SECRET_KEY: string;
    API_PREFIX: string;
    API_PUBLIC_PREFIX: string;
    PARAMS_NEED_ENCRYPT_IN_LOG: string[];
    PWD_SALT_ROUND: number;
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
    getRoute: (r: string, type?: 'public' | 'normal') => string;
    public_route: {
        user: string;
        invoice: string;
        sql_api: string;
        post: string;
        message: string;
        smtp: string;
        lambda: string;
    };
    route: {
        user: string;
        template: string;
        app: string;
        fileManager: string;
        private: string;
        ai: string;
    };
};
export default config;

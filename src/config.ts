'use strict';
import path from "path";
import dotenv from 'dotenv';


export class ConfigSetting {
    public static config_path = ""

    public static setConfig(envPath: string) {
        ConfigSetting.config_path = envPath
        dotenv.config({
            path: envPath,
        });
    }
}

ConfigSetting.setConfig(ConfigSetting.config_path)
export let saasConfig = {
    get SAAS_NAME() {
        return process.env.GLITTER_DB
    },
    DEF_DEADLINE: 365
}

export const config = {
    get domain() {
        return process.env.DOMAIN
    },
    SECRET_KEY: 'dsklkmsadl',
    API_PREFIX: "/api/v1",
    API_PUBLIC_PREFIX: "/api-public/v1",
    PARAMS_NEED_ENCRYPT_IN_LOG: ['pwd', 'email'],
    PWD_SALT_ROUND: 5,
    LOG_PATH: path.resolve("../../log"),
    /*Database*/
    DB_CONN_LIMIT: 0,
    DB_QUEUE_LIMIT: 0,
    get DB_URL() {
        return process.env.DB_URL
    },
    DB_PORT: 3306,
    get DB_USER() {
        return process.env.DB_USER
    },
    get DB_PWD() {
        return process.env.DB_PWD
    },
    get DB_NAME() {
        return process.env.GLITTER_DB
    },
    /*REDIS*/
    get REDIS_URL() {
        return process.env.REDIS_URL
    },
    get REDIS_PORT() {
        return process.env.REDIS_PORT
    },
    get REDIS_PWD() {
        return process.env.REDIS_PWD
    },
    /*AWS*/
    get AWS_S3_NAME() {
        return process.env.AWS_S3_NAME
    },
    get AWS_ACCESS_KEY() {
        return process.env.AWS_ACCESS_KEY
    },
    get AWS_SecretAccessKey() {
        return process.env.AWS_SecretAccessKey
    },
    get AWS_S3_PREFIX_DOMAIN_NAME() {
        return `https://${process.env.AWS_S3_NAME}.s3.amazonaws.com/`
    },
    get SINGLE_TYPE() {
        return `${process.env.SINGLE_TYPE}` == "true"
    },

    /********/
    getRoute: (r: string, type: 'public' | 'normal' = 'normal') => {
        if (type === 'normal') {
            return config.API_PREFIX + r
        } else {
            return config.API_PUBLIC_PREFIX + r
        }

    },
    public_route: {
        user: '/user',
        invoice: '/invoice',
        sql_api:'/sql_api',
        post: '/post',
        message: '/message',
        smtp: '/smtp',
        lambda:'/lambda'
    },
    route: {
        user: "/user",
        template: "/template",
        app: "/app",
        fileManager: "/fileManager",
        private: "/private",
        ai: "/ai"
    }
}
export default config;
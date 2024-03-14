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


export const config = {
    get domain() {
        return process.env.DOMAIN
    },
    /*Database*/
    LOG_PATH: path.resolve("../../log"),
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
        return process.env.AWS_S3_DOMAIN+'/'
    },
    get SINGLE_TYPE() {
        return `${process.env.SINGLE_TYPE}` == "true"
    }
}
export default config;
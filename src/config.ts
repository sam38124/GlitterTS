'use strict';
import path from 'path';
import dotenv from 'dotenv';
import process from "process";

export class ConfigSetting {
    public static is_local = false;
    public static runSchedule = false;
    public static config_path = '';

    public static setConfig(envPath: string) {
        ConfigSetting.config_path = envPath;
        dotenv.config({
            path: envPath,
        });
    }
}

export let saasConfig = {
    get SAAS_NAME() {
        return process.env.GLITTER_DB;
    },
    get DEF_DEADLINE() {
        return parseInt(process.env.DEF_DEADLINE as string, 10);
    },
};

export const config = {
    get domain() {
        return process.env.DOMAIN;
    },
    SECRET_KEY: 'dsklkmsadl',
    API_PREFIX: '/api/v1',
    API_PUBLIC_PREFIX: '/api-public/v1',
    PARAMS_NEED_ENCRYPT_IN_LOG: ['pwd', 'email'],
    PWD_SALT_ROUND: 5,
    LOG_PATH: path.resolve('../../log'),
    /*Database*/
    DB_CONN_LIMIT: 0,
    DB_QUEUE_LIMIT: 0,
    DB_SHOW_INFO: false,
    get SNSAccount(){
        return process.env.SNSAccount
    },
    get SNSPWD(){
        return process.env.SNSPWD
    },
    get SNS_URL(){
        return process.env.SNS_URL
    },
    get DB_URL() {
        return process.env.DB_URL;
    },
    DB_PORT: 3306,
    get DB_USER() {
        return process.env.DB_USER;
    },
    get DB_PWD() {
        return process.env.DB_PWD;
    },
    get DB_NAME() {
        return process.env.GLITTER_DB;
    },
    /*REDIS*/
    get REDIS_URL() {
        return process.env.REDIS_URL;
    },
    get REDIS_PORT() {
        return process.env.REDIS_PORT;
    },
    get REDIS_PWD() {
        return process.env.REDIS_PWD;
    },
    /*AWS*/
    get AWS_S3_NAME() {
        return process.env.AWS_S3_NAME;
    },
    get AWS_ACCESS_KEY() {
        return process.env.AWS_ACCESS_KEY;
    },
    get AWS_SecretAccessKey() {
        return process.env.AWS_SecretAccessKey;
    },
    get AWS_HostedZoneId() {
        return process.env.HostedZoneId;
    },
    get HostedDomain() {
        return process.env.HostedDomain;
    },
    get sshIP() {
        return process.env.sshIP;
    },
    get AWS_S3_PREFIX_DOMAIN_NAME() {
        return process.env.AWS_S3_DOMAIN + '/';
    },
    get SINGLE_TYPE() {
        return `${process.env.SINGLE_TYPE}` == 'true';
    },

    /********/
    getRoute: (r: string, type: 'public' | 'normal' = 'normal') => {
        if (type === 'normal') {
            return config.API_PREFIX + r;
        } else {
            return config.API_PUBLIC_PREFIX + r;
        }
    },
    public_route: {
        user: '/user',
        invoice: '/invoice',
        sql_api: '/sql_api',
        post: '/post',
        chat: '/chat',
        smtp: '/smtp',
        fcm: '/fcm',
        lambda: '/lambda',
        ec: '/ec',
        oauth: '/oauth',
        manager: '/manager',
        app: '/app',
        wallet: '/wallet',
        article: '/article',
        delivery: '/delivery',
        rebate: '/rebate',
        recommend: '/recommend',
        graph_api: '/graph_api',
        ai_chat: '/ai',
        sms: '/sms',
        ai_points: '/ai/points',
        sms_points: '/sms/points',
    },
    route: {
        user: '/user',
        template: '/template',
        app: '/app',
        page: '/page',
        fileManager: '/fileManager',
        private: '/private',
        ai: '/ai',
        globalEvent: '/global-event',
        backendServer: '/backend-server',
    },
};
export default config;

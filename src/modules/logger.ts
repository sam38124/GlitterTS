'use strict';
import 'winston-daily-rotate-file';
import winston from 'winston';
import { asyncHooks } from './hooks';
import {config} from '../config';
const env = process.env.NODE_ENV || 'local';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const env = process.env.NODE_ENV || 'local';
    const isDevelopment = env === 'local';
    return isDevelopment ? 'debug' : 'warn';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => {
            if (asyncHooks.getInstance().getRequestContext()) {
                const reqContext = asyncHooks.getInstance().getRequestContext();
                return `[${info.level}][${info.timestamp}][${reqContext.uuid}][${reqContext.method}][${reqContext.url}][${reqContext.ip}]${info.tag} ${info.message}`;
            }
            return `[${info.level}][${info.timestamp}]${info.tag}${info.message}`;
        },
    ),
);

const transports = [
    new winston.transports.Console(),
];

const winstonLogger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

winstonLogger.add(new winston.transports.DailyRotateFile({
    dirname: config.LOG_PATH,
    filename: 'error-%DATE%.log',
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format
}));
winstonLogger.add(new winston.transports.DailyRotateFile({
    dirname: config.LOG_PATH,
    filename: 'out-%DATE%.log',
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format
}));

export default class Logger {
    info(tag: string, message: string) {
        winstonLogger.info({ tag: tag, message: message });
    }
    error(tag: string, message: string) {
        winstonLogger.error({ tag: tag, message: message });
    }
    warning(tag: string, message: string) {
        winstonLogger.warning({ tag: tag, message: message });
    }
}
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("winston-daily-rotate-file");
const winston_1 = __importDefault(require("winston"));
const hooks_1 = require("./hooks");
const config_1 = require("../config");
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
winston_1.default.addColors(colors);
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => {
    if (hooks_1.asyncHooks.getInstance().getRequestContext()) {
        const reqContext = hooks_1.asyncHooks.getInstance().getRequestContext();
        return `[${info.level}][${info.timestamp}][${reqContext.uuid}][${reqContext.method}][${reqContext.url}][${reqContext.ip}]${info.tag} ${info.message}`;
    }
    return `[${info.level}][${info.timestamp}]${info.tag}${info.message}`;
}));
const transports = [
    new winston_1.default.transports.Console(),
];
const winstonLogger = winston_1.default.createLogger({
    level: level(),
    levels,
    format,
    transports,
});
winstonLogger.add(new winston_1.default.transports.DailyRotateFile({
    dirname: config_1.config.LOG_PATH,
    filename: 'error-%DATE%.log',
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format
}));
winstonLogger.add(new winston_1.default.transports.DailyRotateFile({
    dirname: config_1.config.LOG_PATH,
    filename: 'out-%DATE%.log',
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format
}));
class Logger {
    info(tag, message) {
        winstonLogger.info({ tag: tag, message: message });
    }
    error(tag, message) {
        winstonLogger.error({ tag: tag, message: message });
    }
    warning(tag, message) {
        winstonLogger.warning({ tag: tag, message: message });
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("winston-daily-rotate-file");
var winston_1 = require("winston");
var hooks_1 = require("./hooks");
var config_1 = require("../config");
var env = process.env.NODE_ENV || 'local';
var levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
var level = function () {
    var env = process.env.NODE_ENV || 'local';
    var isDevelopment = env === 'local';
    return isDevelopment ? 'debug' : 'warn';
};
var colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
winston_1.default.addColors(colors);
var format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(function (info) {
    if (hooks_1.asyncHooks.getInstance().getRequestContext()) {
        var reqContext = hooks_1.asyncHooks.getInstance().getRequestContext();
        return "[".concat(info.level, "][").concat(info.timestamp, "][").concat(reqContext.uuid, "][").concat(reqContext.method, "][").concat(reqContext.url, "][").concat(reqContext.ip, "]").concat(info.tag, " ").concat(info.message);
    }
    return "[".concat(info.level, "][").concat(info.timestamp, "]").concat(info.tag).concat(info.message);
}));
var transports = [
    new winston_1.default.transports.Console(),
];
var winstonLogger = winston_1.default.createLogger({
    level: level(),
    levels: levels,
    format: format,
    transports: transports,
});
winstonLogger.add(new winston_1.default.transports.DailyRotateFile({
    dirname: config_1.config.LOG_PATH,
    filename: 'error-%DATE%.log',
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: format
}));
winstonLogger.add(new winston_1.default.transports.DailyRotateFile({
    dirname: config_1.config.LOG_PATH,
    filename: 'out-%DATE%.log',
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: format
}));
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.info = function (tag, message) {
        winstonLogger.info({ tag: tag, message: message });
    };
    Logger.prototype.error = function (tag, message) {
        winstonLogger.error({ tag: tag, message: message });
    };
    Logger.prototype.warning = function (tag, message) {
        winstonLogger.warning({ tag: tag, message: message });
    };
    return Logger;
}());
exports.default = Logger;

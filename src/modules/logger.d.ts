import 'winston-daily-rotate-file';
export default class Logger {
    info(tag: string, message: string): void;
    error(tag: string, message: string): void;
    warning(tag: string, message: string): void;
}

'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const exception_1 = __importDefault(require("./exception"));
const logger_1 = __importDefault(require("./logger"));
function succ(resp, data) {
    if (data) {
        resp.status(http_status_codes_1.default.OK).json(data);
    }
    else {
        resp.status(http_status_codes_1.default.OK).json();
    }
}
function fail(resp, err) {
    if (!exception_1.default.isWebError(err)) {
        if (err instanceof Error) {
            err = exception_1.default.ServerError('INTERNAL_SERVER_ERROR', err.message);
        }
        else if (typeof err === 'string') {
            err = exception_1.default.ServerError('INTERNAL_SERVER_ERROR', err);
        }
        else {
            err = exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'unknown error');
        }
    }
    const error = {
        code: err.code,
        message: err.message,
        data: err.data
    };
    new logger_1.default().error('[Exception]', err.stack);
    resp.status(err.statusCode).json(error);
}
exports.default = {
    succ,
    fail
};
//# sourceMappingURL=response.js.map
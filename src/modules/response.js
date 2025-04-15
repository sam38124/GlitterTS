'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_codes_1 = require("http-status-codes");
var exception_1 = require("./exception");
var logger_1 = require("./logger");
/*
---Success---
{
    xxxxx
}
---Fail---
{
    "code":     String (required),
    "message":  string (required)
}
*/
function succ(resp, data) {
    if (data) {
        resp.status(http_status_codes_1.default.OK).json(data);
    }
    else {
        resp.status(http_status_codes_1.default.OK).json();
    }
}
function fail(resp, err) {
    /**
    * Double check err instance
    */
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
    var error = {
        code: err.code,
        message: err.message,
        data: err.data
    };
    new logger_1.default().error('[Exception]', err.stack);
    resp.status(err.statusCode).json(error);
}
// module.exports.succ = succ;
// module.exports.fail = fail;
exports.default = {
    succ: succ,
    fail: fail
};

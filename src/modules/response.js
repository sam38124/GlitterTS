'use strict';
import httpStatus from 'http-status-codes';
import exception from './exception';
import Logger from './logger';
function succ(resp, data) {
    if (data) {
        resp.status(httpStatus.OK).json(data);
    }
    else {
        resp.status(httpStatus.OK).json();
    }
}
function fail(resp, err) {
    if (!exception.isWebError(err)) {
        if (err instanceof Error) {
            err = exception.ServerError('INTERNAL_SERVER_ERROR', err.message);
        }
        else if (typeof err === 'string') {
            err = exception.ServerError('INTERNAL_SERVER_ERROR', err);
        }
        else {
            err = exception.ServerError('INTERNAL_SERVER_ERROR', 'unknown error');
        }
    }
    const error = {
        code: err.code,
        message: err.message,
        data: err.data
    };
    new Logger().error('[Exception]', err.stack);
    resp.status(err.statusCode).json(error);
}
export default {
    succ,
    fail
};

'use strict';
import * as express from 'express';
import httpStatus from 'http-status-codes';
import exception from './exception';
import Logger from './logger';

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


function succ(resp: express.Response, data: any) {
    if (data) {
        resp.status(httpStatus.OK).json(data);
    } else {
        resp.status(httpStatus.OK).json();
    }
}

function fail(resp: express.Response, err: any) {
    /**
    * Double check err instance
    */
    if (!exception.isWebError(err)) {
        if (err instanceof Error) {
            err = exception.ServerError('INTERNAL_SERVER_ERROR', err.message);
        } else if (typeof err === 'string') {
            err = exception.ServerError('INTERNAL_SERVER_ERROR', err);
        } else {
            err = exception.ServerError('INTERNAL_SERVER_ERROR', 'unknown error');
        }
    }

    const error = {
        code: err.code,
        message: err.message,
        data : err.data
    };

    new Logger().error('[Exception]', err.stack);
    resp.status(err.statusCode).json(error);
}


// module.exports.succ = succ;
// module.exports.fail = fail;

export default {
    succ,
    fail
};

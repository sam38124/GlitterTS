'use strict';
import httpStatus from 'http-status-codes';


class WebBaseError extends Error {
    statusCode: number;
    code: string;
    data: object | null;

    constructor(statusCode: number, code: string, message: string, data: object | null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.data = data;
    }
}

class SqlError extends WebBaseError {
    constructor(code: string, message: string) {
        super(httpStatus.BAD_REQUEST, code, message, null); // 400
    }
}

class BadRequestError extends WebBaseError {
    constructor(code: string, message: string, data: object | null) {
        super(httpStatus.BAD_REQUEST, code, message, data); // 400
    }
}

class AuthError extends WebBaseError {
    constructor(code: string, message: string) {
        super(httpStatus.UNAUTHORIZED, code, message, null);  // 401
    }
}

class PermissionError extends WebBaseError {
    constructor(code: string, message: string) {
        super(httpStatus.UNAUTHORIZED, code, message, null); // 401
    }
}

class ForbiddenError extends WebBaseError {
    constructor(code: string, message: string) {
        super(httpStatus.FORBIDDEN, code, message, null); // 403
    }
}

class ServerError extends WebBaseError {
    constructor(code: string, message: string) {
        super(httpStatus.INTERNAL_SERVER_ERROR, code, message, null); // 500
    }
}

export default {
    isWebError: function(err: any) {
        if (err instanceof WebBaseError) {
            return true;
        }
        return false;
    },

    SqlError: function(code: string, message: string) {
        return new SqlError(code, message);
    },

    BadRequestError: function(code: string, message: string, data: object | null) {
        return new BadRequestError(code, message, data);
    },

    AuthError: function(code: string, message: string) {
        return new AuthError(code, message);
    },

    PermissionError: function(code: string, message: string) {
        return new PermissionError(code, message);
    },

    ForbiddenError: function(code: string, message: string) {
        return new ForbiddenError(code, message);
    },

    ServerError: function(code: string, message: string) {
        return new ServerError(code, message);
    }
};

'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class WebBaseError extends Error {
    constructor(statusCode, code, message, data) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.data = data;
    }
}
class SqlError extends WebBaseError {
    constructor(code, message) {
        super(http_status_codes_1.default.BAD_REQUEST, code, message, null);
    }
}
class BadRequestError extends WebBaseError {
    constructor(code, message, data) {
        super(http_status_codes_1.default.BAD_REQUEST, code, message, data);
    }
}
class AuthError extends WebBaseError {
    constructor(code, message) {
        super(http_status_codes_1.default.UNAUTHORIZED, code, message, null);
    }
}
class PermissionError extends WebBaseError {
    constructor(code, message) {
        super(http_status_codes_1.default.UNAUTHORIZED, code, message, null);
    }
}
class ForbiddenError extends WebBaseError {
    constructor(code, message) {
        super(http_status_codes_1.default.FORBIDDEN, code, message, null);
    }
}
class ServerError extends WebBaseError {
    constructor(code, message) {
        super(http_status_codes_1.default.INTERNAL_SERVER_ERROR, code, message, null);
    }
}
exports.default = {
    isWebError: function (err) {
        if (err instanceof WebBaseError) {
            return true;
        }
        return false;
    },
    SqlError: function (code, message) {
        return new SqlError(code, message);
    },
    BadRequestError: function (code, message, data) {
        return new BadRequestError(code, message, data);
    },
    AuthError: function (code, message) {
        return new AuthError(code, message);
    },
    PermissionError: function (code, message) {
        return new PermissionError(code, message);
    },
    ForbiddenError: function (code, message) {
        return new ForbiddenError(code, message);
    },
    ServerError: function (code, message) {
        return new ServerError(code, message);
    }
};
//# sourceMappingURL=exception.js.map
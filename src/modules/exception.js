'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_codes_1 = require("http-status-codes");
var WebBaseError = /** @class */ (function (_super) {
    __extends(WebBaseError, _super);
    function WebBaseError(statusCode, code, message, data) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.code = code;
        _this.data = data;
        return _this;
    }
    return WebBaseError;
}(Error));
var SqlError = /** @class */ (function (_super) {
    __extends(SqlError, _super);
    function SqlError(code, message) {
        return _super.call(this, http_status_codes_1.default.BAD_REQUEST, code, message, null) || this; // 400
    }
    return SqlError;
}(WebBaseError));
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(code, message, data) {
        return _super.call(this, http_status_codes_1.default.BAD_REQUEST, code, message, data) || this; // 400
    }
    return BadRequestError;
}(WebBaseError));
var AuthError = /** @class */ (function (_super) {
    __extends(AuthError, _super);
    function AuthError(code, message) {
        return _super.call(this, http_status_codes_1.default.UNAUTHORIZED, code, message, null) || this; // 401
    }
    return AuthError;
}(WebBaseError));
var PermissionError = /** @class */ (function (_super) {
    __extends(PermissionError, _super);
    function PermissionError(code, message) {
        return _super.call(this, http_status_codes_1.default.UNAUTHORIZED, code, message, null) || this; // 401
    }
    return PermissionError;
}(WebBaseError));
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(code, message) {
        return _super.call(this, http_status_codes_1.default.FORBIDDEN, code, message, null) || this; // 403
    }
    return ForbiddenError;
}(WebBaseError));
var ServerError = /** @class */ (function (_super) {
    __extends(ServerError, _super);
    function ServerError(code, message) {
        return _super.call(this, http_status_codes_1.default.INTERNAL_SERVER_ERROR, code, message, null) || this; // 500
    }
    return ServerError;
}(WebBaseError));
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

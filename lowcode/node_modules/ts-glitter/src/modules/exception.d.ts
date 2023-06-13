declare class WebBaseError extends Error {
    statusCode: number;
    code: string;
    data: object | null;
    constructor(statusCode: number, code: string, message: string, data: object | null);
}
declare class SqlError extends WebBaseError {
    constructor(code: string, message: string);
}
declare class BadRequestError extends WebBaseError {
    constructor(code: string, message: string, data: object | null);
}
declare class AuthError extends WebBaseError {
    constructor(code: string, message: string);
}
declare class PermissionError extends WebBaseError {
    constructor(code: string, message: string);
}
declare class ForbiddenError extends WebBaseError {
    constructor(code: string, message: string);
}
declare class ServerError extends WebBaseError {
    constructor(code: string, message: string);
}
declare const _default: {
    isWebError: (err: any) => boolean;
    SqlError: (code: string, message: string) => SqlError;
    BadRequestError: (code: string, message: string, data: object | null) => BadRequestError;
    AuthError: (code: string, message: string) => AuthError;
    PermissionError: (code: string, message: string) => PermissionError;
    ForbiddenError: (code: string, message: string) => ForbiddenError;
    ServerError: (code: string, message: string) => ServerError;
};
export default _default;

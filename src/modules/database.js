"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryLambada = exports.limit = void 0;
var promise_1 = require("mysql2/promise");
var config_1 = require("../config");
var logger_1 = require("./logger");
var exception_1 = require("./exception");
var TAG = '[Database]';
var pool;
var createPool = function () { return __awaiter(void 0, void 0, void 0, function () {
    var logger;
    return __generator(this, function (_a) {
        logger = new logger_1.default();
        pool = promise_1.default.createPool({
            connectionLimit: config_1.default.DB_CONN_LIMIT,
            queueLimit: config_1.default.DB_QUEUE_LIMIT,
            host: config_1.default.DB_URL,
            port: config_1.default.DB_PORT,
            user: config_1.default.DB_USER,
            password: config_1.default.DB_PWD,
            supportBigNumbers: true,
        });
        try {
            return [2 /*return*/, pool];
        }
        catch (err) {
            logger.error(TAG, 'Failed to create connection pool for mysql because ' + err);
            throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
        }
        return [2 /*return*/];
    });
}); };
function createNewPool() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, new_pool;
        return __generator(this, function (_a) {
            logger = new logger_1.default();
            new_pool = promise_1.default.createPool({
                connectionLimit: config_1.default.DB_CONN_LIMIT,
                queueLimit: config_1.default.DB_QUEUE_LIMIT,
                host: config_1.default.DB_URL,
                port: config_1.default.DB_PORT,
                user: config_1.default.DB_USER,
                password: config_1.default.DB_PWD,
                supportBigNumbers: true,
            });
            try {
                config_1.default.DB_SHOW_INFO && logger.info(TAG, 'Pool has been created. (function: createNewPool)');
                return [2 /*return*/, new_pool];
            }
            catch (err) {
                logger.error(TAG, '(createNewPool) Failed to create connection pool for mysql because ' + err);
                throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
            }
            return [2 /*return*/];
        });
    });
}
var execute = function (sql, params) { return __awaiter(void 0, void 0, void 0, function () {
    var logger, TAG, connection, results, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger = new logger_1.default();
                TAG = '[Database][Execute]';
                if (params.indexOf(undefined) !== -1) {
                    logger.error(TAG, 'Failed to exect statement ' + sql + ' because params=null');
                    throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to exect statement because params=null');
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, pool.getConnection()];
            case 2:
                connection = _a.sent();
                return [4 /*yield*/, pool.execute(sql, params)];
            case 3:
                results = (_a.sent())[0];
                connection.release();
                return [2 /*return*/, results];
            case 4:
                err_1 = _a.sent();
                logger.error(TAG, 'Failed to exect statement ' + sql + ' because ' + err_1);
                throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to execute statement.');
            case 5: return [2 /*return*/];
        }
    });
}); };
var limit = function (map) {
    return " limit ".concat(parseInt(map.page, 10) * parseInt(map.limit, 10), ", ").concat(parseInt(map.limit, 10), " ");
};
exports.limit = limit;
var query = function (sql, params) { return __awaiter(void 0, void 0, void 0, function () {
    var logger, TAG, connection, results, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger = new logger_1.default();
                TAG = '[Database][Query]';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, pool.getConnection()];
            case 2:
                connection = _a.sent();
                return [4 /*yield*/, pool.query("SET time_zone = '+00:00';", [])];
            case 3:
                _a.sent();
                return [4 /*yield*/, pool.query(sql, params)];
            case 4:
                results = (_a.sent())[0];
                connection.release();
                return [2 /*return*/, results];
            case 5:
                err_2 = _a.sent();
                logger.error(TAG, 'Failed to query statement ' + sql + ' because ' + err_2);
                throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to execute statement.');
            case 6: return [2 /*return*/];
        }
    });
}); };
var queryLambada = function (cf, fun) { return __awaiter(void 0, void 0, void 0, function () {
    var logger, cs, sp, connection, data, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger = new logger_1.default();
                cs = {
                    connectionLimit: config_1.default.DB_CONN_LIMIT,
                    queueLimit: config_1.default.DB_QUEUE_LIMIT,
                    host: config_1.default.DB_URL,
                    port: config_1.default.DB_PORT,
                    user: config_1.default.DB_USER,
                    password: config_1.default.DB_PWD,
                    supportBigNumbers: true,
                };
                Object.keys(cf).map(function (key) {
                    cs[key] = cf[key];
                });
                sp = promise_1.default.createPool(cs);
                return [4 /*yield*/, sp.getConnection()];
            case 1:
                connection = _a.sent();
                if (connection) {
                    connection.release();
                    config_1.default.DB_SHOW_INFO && logger.info(TAG, 'Pool has been created. (function: queryLambada)');
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, fun({
                        query: function (sql, params) {
                            var _this = this;
                            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var logger, TAG, results, err_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            logger = new logger_1.default();
                                            TAG = '[Database][Query]';
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, sp.query(sql, params)];
                                        case 2:
                                            results = (_a.sent())[0];
                                            resolve(results);
                                            return [3 /*break*/, 4];
                                        case 3:
                                            err_4 = _a.sent();
                                            logger.error(TAG, 'Failed to query statement ' + sql + ' because ' + err_4);
                                            reject(err_4);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); });
                        },
                    })];
            case 3:
                data = _a.sent();
                //Close connection
                connection.release();
                sp.end();
                return [2 /*return*/, data];
            case 4:
                err_3 = _a.sent();
                //Close connection
                connection.release();
                sp.end();
                logger.error(TAG, 'Failed to create connection pool for mysql because ' + err_3);
                throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.queryLambada = queryLambada;
var Transaction = /** @class */ (function () {
    function Transaction() {
    }
    Transaction.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var logger, Trans, _a, _b, err_5;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        logger = new logger_1.default();
                        Trans = new Transaction();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 6]);
                        _a = Trans;
                        return [4 /*yield*/, createNewPool()];
                    case 2:
                        _a.pool = (_c.sent());
                        _b = Trans;
                        return [4 /*yield*/, Trans.pool.getConnection()];
                    case 3:
                        _b.trans = _c.sent();
                        Trans.TAG = "[Database][Transaction][CID:".concat(Trans.trans.threadId, "]");
                        Trans.trans.beginTransaction();
                        return [2 /*return*/, Trans];
                    case 4:
                        err_5 = _c.sent();
                        logger.error(Trans.TAG, 'Failed to create transaction when call transaction.init because ' + err_5);
                        return [4 /*yield*/, Trans.release()];
                    case 5:
                        _c.sent();
                        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create transaction when connecting database.');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Transaction.prototype.execute = function (sql, params) {
        return __awaiter(this, void 0, void 0, function () {
            var logger, result, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger = new logger_1.default();
                        if (!this.trans) {
                            throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Can not use Transaction class without build.');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, this.trans.query(sql, params)];
                    case 2:
                        result = (_a.sent())[0];
                        return [2 /*return*/, result];
                    case 3:
                        err_6 = _a.sent();
                        //rollback transaction and release connection when error occurred.
                        logger.error(this.TAG, "Failed to execute statement ".concat(sql, " from transaction because ").concat(err_6));
                        return [4 /*yield*/, this.release()];
                    case 4:
                        _a.sent();
                        throw err_6;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Transaction.prototype.commit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var logger, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger = new logger_1.default();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 6]);
                        return [4 /*yield*/, this.trans.commit()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.release()];
                    case 3:
                        _a.sent();
                        config_1.default.DB_SHOW_INFO && logger.info(this.TAG, 'Commited successfully');
                        return [3 /*break*/, 6];
                    case 4:
                        err_7 = _a.sent();
                        logger.error(this.TAG, 'Failed to commit from transaction because ' + err_7);
                        return [4 /*yield*/, this.release()];
                    case 5:
                        _a.sent();
                        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to commit from transaction.');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Transaction.prototype.release = function () {
        return __awaiter(this, void 0, void 0, function () {
            var logger, err_8;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        logger = new logger_1.default();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 8]);
                        if (!this.trans) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.trans.release()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, this.trans.destroy()];
                    case 3:
                        _c.sent();
                        this.trans = null;
                        return [4 /*yield*/, ((_a = this.pool) === null || _a === void 0 ? void 0 : _a.end())];
                    case 4:
                        _c.sent();
                        config_1.default.DB_SHOW_INFO && logger.info(this.TAG, 'Release successfully');
                        _c.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        err_8 = _c.sent();
                        logger.error(this.TAG, 'Failed to commit from transaction because ' + err_8);
                        return [4 /*yield*/, ((_b = this.pool) === null || _b === void 0 ? void 0 : _b.end())];
                    case 7:
                        _c.sent();
                        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to release transaction.');
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return Transaction;
}());
var getPagination = function (sql, page, pageCount) {
    var newSql = sql;
    newSql += ' LIMIT ' + pageCount + ' OFFSET ' + (page - 1) * pageCount;
    return newSql;
};
var escape = function (parameter) {
    return promise_1.default.escape(parameter);
};
var checkExists = function (sql) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, query('select count(1) from ' + sql, [])];
            case 1: return [2 /*return*/, (_a.sent())[0]['count(1)'] > 0];
        }
    });
}); };
exports.default = {
    createPool: createPool,
    execute: execute,
    query: query,
    Transaction: Transaction,
    getPagination: getPagination,
    escape: escape,
    queryLambada: exports.queryLambada,
    checkExists: checkExists,
};

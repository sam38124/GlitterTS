"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryLambada = exports.limit = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("./logger"));
const exception_1 = __importDefault(require("./exception"));
const TAG = '[Database]';
let pool;
const createPool = async () => {
    const logger = new logger_1.default();
    if (pool) {
        try {
            await pool.end();
        }
        catch (e) {
        }
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 500);
        });
    }
    pool = promise_1.default.createPool({
        connectionLimit: config_1.default.DB_CONN_LIMIT,
        queueLimit: config_1.default.DB_QUEUE_LIMIT,
        host: config_1.default.DB_URL,
        port: config_1.default.DB_PORT,
        user: config_1.default.DB_USER,
        password: config_1.default.DB_PWD,
        supportBigNumbers: true,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
    });
    try {
        return pool;
    }
    catch (err) {
        logger.error(TAG, 'Failed to create connection pool for mysql because ' + err);
        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
    }
};
async function createNewPool() {
    const logger = new logger_1.default();
    const new_pool = promise_1.default.createPool({
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
        return new_pool;
    }
    catch (err) {
        logger.error(TAG, '(createNewPool) Failed to create connection pool for mysql because ' + err);
        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
    }
}
const execute = async (sql, params) => {
    const logger = new logger_1.default();
    const TAG = '[Database][Execute]';
    if (params.indexOf(undefined) !== -1) {
        logger.error(TAG, 'Failed to exect statement ' + sql + ' because params=null');
        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to exect statement because params=null');
    }
    try {
        const connection = await pool.getConnection();
        const [results] = await pool.execute(sql, params);
        connection.release();
        return results;
    }
    catch (err) {
        logger.error(TAG, 'Failed to exect statement ' + sql + ' because ' + err);
        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to exect statement ' + sql + ' because ' + err);
    }
};
const limit = (map) => {
    return ` limit ${parseInt(map.page, 10) * parseInt(map.limit, 10)}, ${parseInt(map.limit, 10)} `;
};
exports.limit = limit;
const query = async (sql, params) => {
    const logger = new logger_1.default();
    const TAG = '[Database][Query]';
    try {
        const connection = await pool.getConnection();
        await pool.query(`SET time_zone = '+00:00';`, []);
        const [results] = await pool.query(sql, params);
        connection.release();
        return results;
    }
    catch (err) {
        logger.error(TAG, 'Failed to query statement ' + sql + ' because ' + err);
        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to query statement ' + sql + ' because ' + err);
    }
};
const queryLambada = async (cf, fun) => {
    const logger = new logger_1.default();
    const cs = {
        connectionLimit: config_1.default.DB_CONN_LIMIT,
        queueLimit: config_1.default.DB_QUEUE_LIMIT,
        host: config_1.default.DB_URL,
        port: config_1.default.DB_PORT,
        user: config_1.default.DB_USER,
        password: config_1.default.DB_PWD,
        supportBigNumbers: true,
    };
    Object.keys(cf).map(key => {
        cs[key] = cf[key];
    });
    const sp = promise_1.default.createPool(cs);
    const connection = await sp.getConnection();
    if (connection) {
        connection.release();
        config_1.default.DB_SHOW_INFO && logger.info(TAG, 'Pool has been created. (function: queryLambada)');
    }
    try {
        const data = await fun({
            query(sql, params) {
                return new Promise(async (resolve, reject) => {
                    const logger = new logger_1.default();
                    const TAG = '[Database][Query]';
                    try {
                        const [results] = await sp.query(sql, params);
                        resolve(results);
                    }
                    catch (err) {
                        logger.error(TAG, 'Failed to query statement ' + sql + ' because ' + err);
                        reject(err);
                    }
                });
            },
        });
        connection.release();
        sp.end();
        return data;
    }
    catch (err) {
        connection.release();
        sp.end();
        logger.error(TAG, 'Failed to create connection pool for mysql because ' + err);
        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
    }
};
exports.queryLambada = queryLambada;
class Transaction {
    static async build() {
        const logger = new logger_1.default();
        const Trans = new Transaction();
        try {
            Trans.pool = (await createNewPool());
            Trans.trans = await Trans.pool.getConnection();
            Trans.TAG = `[Database][Transaction][CID:${Trans.trans.threadId}]`;
            Trans.trans.beginTransaction();
            return Trans;
        }
        catch (err) {
            logger.error(Trans.TAG, 'Failed to create transaction when call transaction.init because ' + err);
            await Trans.release();
            throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create transaction when connecting database.');
        }
    }
    async execute(sql, params) {
        const logger = new logger_1.default();
        if (!this.trans) {
            throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Can not use Transaction class without build.');
        }
        try {
            const [result] = await this.trans.query(sql, params);
            return result;
        }
        catch (err) {
            logger.error(this.TAG, `Failed to execute statement ${sql} from transaction because ${err}`);
            await this.release();
            throw err;
        }
    }
    async commit() {
        const logger = new logger_1.default();
        try {
            await this.trans.commit();
            await this.release();
            config_1.default.DB_SHOW_INFO && logger.info(this.TAG, 'Commited successfully');
        }
        catch (err) {
            logger.error(this.TAG, 'Failed to commit from transaction because ' + err);
            await this.release();
            throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to commit from transaction.');
        }
    }
    async release() {
        var _a, _b;
        const logger = new logger_1.default();
        try {
            if (this.trans) {
                await this.trans.release();
                await this.trans.destroy();
                this.trans = null;
                await ((_a = this.pool) === null || _a === void 0 ? void 0 : _a.end());
                config_1.default.DB_SHOW_INFO && logger.info(this.TAG, 'Release successfully');
            }
        }
        catch (err) {
            logger.error(this.TAG, 'Failed to commit from transaction because ' + err);
            await ((_b = this.pool) === null || _b === void 0 ? void 0 : _b.end());
            throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to release transaction.');
        }
    }
}
const getPagination = (sql, page, pageCount) => {
    let newSql = sql;
    newSql += ' LIMIT ' + pageCount + ' OFFSET ' + (page - 1) * pageCount;
    return newSql;
};
const escape = (parameter) => {
    return promise_1.default.escape(parameter);
};
const checkExists = async (sql) => {
    return (await query('select count(1) from ' + sql, []))[0]['count(1)'] > 0;
};
exports.default = {
    createPool,
    execute,
    query,
    Transaction,
    getPagination,
    escape,
    queryLambada: exports.queryLambada,
    checkExists,
};
//# sourceMappingURL=database.js.map
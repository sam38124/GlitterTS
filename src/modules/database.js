'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mysql from "mysql2/promise";
import config from '../config';
import Logger from './logger';
import exception from './exception';
const TAG = '[Database]';
let pool;
const createPool = () => __awaiter(void 0, void 0, void 0, function* () {
    const logger = new Logger();
    pool = mysql.createPool({
        connectionLimit: config.DB_CONN_LIMIT,
        queueLimit: config.DB_QUEUE_LIMIT,
        host: config.DB_URL,
        port: config.DB_PORT,
        user: config.DB_USER,
        password: config.DB_PWD,
        supportBigNumbers: true
    });
    try {
        const connection = yield pool.getConnection();
        if (connection) {
            yield connection.release();
            logger.info(TAG, 'Pool has been created.');
            return pool;
        }
    }
    catch (err) {
        logger.error(TAG, 'Failed to create connection pool for mysql because ' + err);
        throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
    }
});
const getConnection = (connPool) => __awaiter(void 0, void 0, void 0, function* () {
    const logger = new Logger();
    const _pool = connPool || pool;
    try {
        const connection = yield _pool.getConnection();
        return connection;
    }
    catch (err) {
        logger.error(TAG, 'Failed to get connection from pool because ' + err);
        throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get connection from pool.');
    }
});
const execute = (sql, params) => __awaiter(void 0, void 0, void 0, function* () {
    const logger = new Logger();
    const TAG = '[Database][Execute]';
    if (params.indexOf(undefined) !== -1) {
        logger.error(TAG, 'Failed to exect statement ' + sql + ' because params=null');
        throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to exect statement because params=null');
    }
    try {
        const [results] = yield pool.execute(sql, params);
        return results;
    }
    catch (err) {
        logger.error(TAG, 'Failed to exect statement ' + sql + ' because ' + err);
        throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to execute statement.');
    }
});
export const limit = (map) => {
    return ` limit ${parseInt(map.page, 10) * parseInt(map.limit, 10)}, ${parseInt(map.limit, 10)} `;
};
const query = (sql, params) => __awaiter(void 0, void 0, void 0, function* () {
    const logger = new Logger();
    const TAG = '[Database][Query]';
    try {
        const [results] = yield pool.query(sql, params);
        return results;
    }
    catch (err) {
        logger.error(TAG, 'Failed to query statement ' + sql + ' because ' + err);
        throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to execute statement.');
    }
});
export const queryLambada = (cf, fun) => __awaiter(void 0, void 0, void 0, function* () {
    const logger = new Logger();
    const cs = {
        connectionLimit: config.DB_CONN_LIMIT,
        queueLimit: config.DB_QUEUE_LIMIT,
        host: config.DB_URL,
        port: config.DB_PORT,
        user: config.DB_USER,
        password: config.DB_PWD,
        supportBigNumbers: true
    };
    Object.keys(cf).map((key) => {
        cs[key] = cf[key];
    });
    const sp = mysql.createPool(cs);
    try {
        const connection = yield sp.getConnection();
        if (connection) {
            yield connection.release();
            logger.info(TAG, 'Pool has been created.');
        }
        const data = yield fun({
            query(sql, params) {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    const logger = new Logger();
                    const TAG = '[Database][Query]';
                    try {
                        const [results] = yield sp.query(sql, params);
                        resolve(results);
                    }
                    catch (err) {
                        logger.error(TAG, 'Failed to query statement ' + sql + ' because ' + err);
                        reject(err);
                    }
                }));
            }
        });
        connection.release();
        sp.end();
        return data;
    }
    catch (err) {
        logger.error(TAG, 'Failed to create connection pool for mysql because ' + err);
        throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
    }
});
class Transaction {
    static build() {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = new Logger();
            const Trans = new Transaction();
            try {
                Trans.trans = yield getConnection(null);
                Trans.TAG = `[Database][Transaction][CID:${Trans.trans.threadId}]`;
                Trans.trans.beginTransaction();
                return Trans;
            }
            catch (err) {
                logger.error(Trans.TAG, 'Failed to create transaction when call transaction.init because ' + err);
                Trans.release();
                throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create transaction when connecting database.');
            }
        });
    }
    execute(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = new Logger();
            if (!this.trans) {
                throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Can not use Transaction class without build.');
            }
            try {
                const [result] = yield this.trans.query(sql, params);
                return result;
            }
            catch (err) {
                logger.error(this.TAG, `Failed to execute statement ${sql} from transaction because ${err}`);
                yield this.release();
                this.trans = null;
                throw err;
            }
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = new Logger();
            try {
                yield this.trans.commit();
                yield this.trans.release();
                logger.info(this.TAG, 'Commited successfully');
            }
            catch (err) {
                logger.error(this.TAG, 'Failed to commit from transaction because ' + err);
                yield this.trans.rollback();
                yield this.trans.destroy();
                throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to commit from transaction.');
            }
        });
    }
    release() {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = new Logger();
            try {
                if (this.trans) {
                    yield this.trans.rollback();
                    yield this.trans.rollback();
                    yield this.trans.destroy();
                    this.trans = null;
                    logger.info(this.TAG, 'Release successfully');
                }
            }
            catch (err) {
                logger.error(this.TAG, 'Failed to commit from transaction because ' + err);
                throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to release transaction.');
            }
        });
    }
}
const getPagination = (sql, page, pageCount) => {
    let newSql = sql;
    newSql += ' LIMIT ' + pageCount + ' OFFSET ' + ((page - 1) * pageCount);
    return newSql;
};
const escape = (parameter) => {
    return mysql.escape(parameter);
};
const checkExists = (sql) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield query('select count(1) from ' + sql, []))[0]['count(1)'] > 0;
});
export default {
    createPool,
    execute,
    query,
    Transaction,
    getPagination,
    escape,
    queryLambada,
    checkExists
};

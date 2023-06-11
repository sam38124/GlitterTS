'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limit = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = __importStar(require("../config"));
const logger_1 = __importDefault(require("./logger"));
const exception_1 = __importDefault(require("./exception"));
const TAG = '[Database]';
let pool;
const createPool = async () => {
    console.log(config_1.ConfigSetting.config_path);
    const logger = new logger_1.default();
    pool = promise_1.default.createPool({
        connectionLimit: config_1.default.DB_CONN_LIMIT,
        queueLimit: config_1.default.DB_QUEUE_LIMIT,
        host: config_1.default.DB_URL,
        port: config_1.default.DB_PORT,
        user: config_1.default.DB_USER,
        password: config_1.default.DB_PWD,
        supportBigNumbers: true
    });
    try {
        const connection = await pool.getConnection();
        if (connection) {
            await connection.release();
            logger.info(TAG, 'Pool has been created.');
            return pool;
        }
    }
    catch (err) {
        logger.error(TAG, 'Failed to create connection pool for mysql because ' + err);
        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
    }
};
const getConnection = async (connPool) => {
    const logger = new logger_1.default();
    const _pool = connPool || pool;
    try {
        const connection = await _pool.getConnection();
        return connection;
    }
    catch (err) {
        logger.error(TAG, 'Failed to get connection from pool because ' + err);
        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get connection from pool.');
    }
};
const execute = async (sql, params) => {
    const logger = new logger_1.default();
    const TAG = '[Database][Execute]';
    if (params.indexOf(undefined) !== -1) {
        logger.error(TAG, 'Failed to exect statement ' + sql + ' because params=null');
        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to exect statement because params=null');
    }
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    }
    catch (err) {
        logger.error(TAG, 'Failed to exect statement ' + sql + ' because ' + err);
        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to execute statement.');
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
        const [results] = await pool.query(sql, params);
        return results;
    }
    catch (err) {
        logger.error(TAG, 'Failed to query statement ' + sql + ' because ' + err);
        throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to execute statement.');
    }
};
class Transaction {
    static async build() {
        const logger = new logger_1.default();
        const Trans = new Transaction();
        try {
            Trans.trans = await getConnection(null);
            Trans.TAG = `[Database][Transaction][CID:${Trans.trans.threadId}]`;
            Trans.trans.beginTransaction();
            return Trans;
        }
        catch (err) {
            logger.error(Trans.TAG, 'Failed to create transaction when call transaction.init because ' + err);
            Trans.release();
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
            this.trans = null;
            throw err;
        }
    }
    async commit() {
        const logger = new logger_1.default();
        try {
            await this.trans.commit();
            await this.trans.release();
            logger.info(this.TAG, 'Commited successfully');
        }
        catch (err) {
            logger.error(this.TAG, 'Failed to commit from transaction because ' + err);
            await this.trans.rollback();
            await this.trans.destroy();
            throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to commit from transaction.');
        }
    }
    async release() {
        const logger = new logger_1.default();
        try {
            if (this.trans) {
                await this.trans.rollback();
                await this.trans.rollback();
                await this.trans.destroy();
                this.trans = null;
                logger.info(this.TAG, 'Release successfully');
            }
        }
        catch (err) {
            logger.error(this.TAG, 'Failed to commit from transaction because ' + err);
            throw exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to release transaction.');
        }
    }
}
const getPagination = (sql, page, pageCount) => {
    let newSql = sql;
    newSql += ' LIMIT ' + pageCount + ' OFFSET ' + ((page - 1) * pageCount);
    return newSql;
};
const escape = (parameter) => {
    return promise_1.default.escape(parameter);
};
exports.default = {
    createPool,
    execute,
    query,
    Transaction,
    getPagination,
    escape
};

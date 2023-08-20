'use strict';
import mysql from "mysql2/promise";
import config from '../config';
import Logger from './logger';
import exception from './exception';

const TAG = '[Database]';
let pool: mysql.Pool;

const createPool = async () => {
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
        const connection = await pool.getConnection();
        if (connection) {
            await connection.release();
            logger.info(TAG, 'Pool has been created.');
            return pool;
        }
    } catch (err) {
        logger.error(TAG, 'Failed to create connection pool for mysql because ' + err);
        throw exception.ServerError(
            'INTERNAL_SERVER_ERROR',
            'Failed to create connection pool.'
        );
    }
};

const getConnection = async (connPool: null | mysql.Pool): Promise<mysql.PoolConnection> => {
    const logger = new Logger();
    const _pool = connPool || pool;
    try {
        const connection = await _pool.getConnection();
        return connection;
    } catch (err) {
        logger.error(TAG, 'Failed to get connection from pool because ' + err);
        throw exception.ServerError(
            'INTERNAL_SERVER_ERROR',
            'Failed to get connection from pool.'
        );
    }
};

const execute = async (sql: string, params: any[]): Promise<any> => {
    const logger = new Logger();
    const TAG = '[Database][Execute]';
    if (params.indexOf(undefined) !== -1) {
        logger.error(TAG, 'Failed to exect statement ' + sql + ' because params=null');
        throw exception.ServerError(
            'INTERNAL_SERVER_ERROR',
            'Failed to exect statement because params=null'
        );
    }
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (err) {
        logger.error(TAG, 'Failed to exect statement ' + sql + ' because ' + err);
        throw exception.ServerError(
            'INTERNAL_SERVER_ERROR',
            'Failed to execute statement.'
        );
    }
};

export const limit = (map: any) => {
    return ` limit ${parseInt(map.page, 10) * parseInt(map.limit, 10)}, ${parseInt(map.limit, 10)} `
}
const query = async (sql: string, params: unknown[]): Promise<any> => {
    const logger = new Logger();
    const TAG = '[Database][Query]';
    try {
        const [results] = await pool.query(sql, params);
        return results;
    } catch (err) {
        logger.error(TAG, 'Failed to query statement ' + sql + ' because ' + err);
        throw exception.ServerError(
            'INTERNAL_SERVER_ERROR',
            'Failed to execute statement.'
        );
    }
};

export const queryLambada = async (cf: {
    database?: string
}, fun: (v: {
    query(sql: string, params: unknown[]): Promise<any>
}) => any) => {
    const logger = new Logger();
    const cs: any = {
        connectionLimit: config.DB_CONN_LIMIT,
        queueLimit: config.DB_QUEUE_LIMIT,
        host: config.DB_URL,
        port: config.DB_PORT,
        user: config.DB_USER,
        password: config.DB_PWD,
        supportBigNumbers: true
    }
    Object.keys(cf).map((key) => {
        cs[key] = (cf as any)[key]
    })
    const sp = mysql.createPool(cs);
    try {
        const connection = await sp.getConnection();
        if (connection) {
            await connection.release();
            logger.info(TAG, 'Pool has been created.');
        }
        const data = await fun({
            query(sql: string, params: unknown[]): Promise<any> {
                return new Promise<any>(async (resolve, reject) => {
                    const logger = new Logger();
                    const TAG = '[Database][Query]';
                    try {
                        const [results] = await sp.query(sql, params);
                        resolve(results)
                    } catch (err) {
                        logger.error(TAG, 'Failed to query statement ' + sql + ' because ' + err);
                        reject(err)
                    }
                })
            }
        })
        //Close connection
        connection.release()
        sp.end()
        return data
    } catch (err) {
        logger.error(TAG, 'Failed to create connection pool for mysql because ' + err);
        throw exception.ServerError(
            'INTERNAL_SERVER_ERROR',
            'Failed to create connection pool.'
        );
    }
}


class Transaction {
    private trans: any;
    connectionId: any;
    private TAG: any;

    static async build(): Promise<Transaction> {
        const logger = new Logger();
        const Trans = new Transaction();
        try {
            Trans.trans = await getConnection(null);
            Trans.TAG = `[Database][Transaction][CID:${Trans.trans.threadId}]`;
            Trans.trans.beginTransaction();
            return Trans;
        } catch (err) {
            logger.error(Trans.TAG, 'Failed to create transaction when call transaction.init because ' + err);
            Trans.release();
            throw exception.ServerError(
                'INTERNAL_SERVER_ERROR',
                'Failed to create transaction when connecting database.'
            );
        }
    }

    public async execute(sql: string, params: any[] | any): Promise<any> {
        const logger = new Logger();
        if (!this.trans) {
            throw exception.ServerError(
                'INTERNAL_SERVER_ERROR',
                'Can not use Transaction class without build.'
            );
        }
        try {
            const [result] = await this.trans.query(sql, params);
            return result;
        } catch (err) {
            //rollback transaction and release connection when error occurred.
            logger.error(this.TAG, `Failed to execute statement ${sql} from transaction because ${err}`);
            await this.release();
            this.trans = null;
            throw err;
        }
    }

    async commit() {
        const logger = new Logger();
        try {
            await this.trans.commit();
            await this.trans.release();
            logger.info(this.TAG, 'Commited successfully');
        } catch (err) {
            logger.error(this.TAG, 'Failed to commit from transaction because ' + err);
            await this.trans.rollback();
            await this.trans.destroy();
            throw exception.ServerError(
                'INTERNAL_SERVER_ERROR',
                'Failed to commit from transaction.'
            );
        }
    }

    async release() {
        const logger = new Logger();
        try {
            if (this.trans) {
                await this.trans.rollback();
                // 如果transaction已經被rollback且也已release回pool時，會變成一般性的connection(autocommit=1)
                // 導致其他併發的Promise使用到這個一般性的connection進行execute的動作，造成隱性commit的行為
                // 為了避免這個狀況，所以當使用者手動釋放transaction時，我們會將它destroy掉，排除隱性commit的可能性
                await this.trans.rollback();
                await this.trans.destroy();
                this.trans = null;
                logger.info(this.TAG, 'Release successfully');
            }
        } catch (err) {
            logger.error(this.TAG, 'Failed to commit from transaction because ' + err);
            throw exception.ServerError(
                'INTERNAL_SERVER_ERROR',
                'Failed to release transaction.'
            );
        }
    }
}

const getPagination = (sql: string, page: number, pageCount: number) => {
    let newSql = sql;
    newSql += ' LIMIT ' + pageCount + ' OFFSET ' + ((page - 1) * pageCount);
    return newSql;
};

const escape = (parameter: any) => {
    return mysql.escape(parameter);
};

export default {
    createPool,
    execute,
    query,
    Transaction,
    getPagination,
    escape,
    queryLambada
};

// module.exports.createPool = createPool;
// module.exports.execute = execute;
// module.exports.Transaction = Transaction;
// module.exports.getPagination = getPagination;
// module.exports.escape = escape;
import mysql from 'mysql2/promise';
import config from '../config';
import Logger from './logger';
import exception from './exception';

const TAG = '[Database]';
let pool: mysql.Pool;

const createPool = async () => {
  const logger = new Logger();
  if(pool){
    try {
      // 销毁连接池中的所有连接
      await pool.end()
    }catch (e) {

    }
    await new Promise((resolve, reject)=>{
      setTimeout(()=>{
        resolve(true)
      },500)
    })
  }
  pool = mysql.createPool({
    connectionLimit: config.DB_CONN_LIMIT,
    queueLimit: config.DB_QUEUE_LIMIT,
    host: config.DB_URL,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PWD,
    supportBigNumbers: true,
    // 啟用連線保持活躍
    enableKeepAlive: true,
    // 每 10 秒發送一次保持活躍訊號
    keepAliveInitialDelay: 10000,
  });
  try {
    return pool;
  } catch (err) {
    logger.error(TAG, 'Failed to create connection pool for mysql because ' + err);
    throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
  }
};

async function createNewPool() {
  const logger = new Logger();
  const new_pool: mysql.Pool = mysql.createPool({
    connectionLimit: config.DB_CONN_LIMIT,
    queueLimit: config.DB_QUEUE_LIMIT,
    host: config.DB_URL,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PWD,
    supportBigNumbers: true,
  });
  try {
    config.DB_SHOW_INFO && logger.info(TAG, 'Pool has been created. (function: createNewPool)');
    return new_pool;
  } catch (err) {
    logger.error(TAG, '(createNewPool) Failed to create connection pool for mysql because ' + err);
    throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
  }
}

const execute = async (sql: string, params: any[]): Promise<any> => {
  const logger = new Logger();
  const TAG = '[Database][Execute]';
  if (params.indexOf(undefined) !== -1) {
    logger.error(TAG, 'Failed to exect statement ' + sql + ' because params=null');
    throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to exect statement because params=null');
  }
  try {
    const connection = await pool.getConnection();
    const [results] = await pool.execute(sql, params);
    connection.release();
    return results;
  } catch (err) {
    logger.error(TAG, 'Failed to exect statement ' + sql + ' because ' + err);
    throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to exect statement ' + sql + ' because ' + err);
  }
};

export const limit = (map: any) => {
  return ` limit ${parseInt(map.page, 10) * parseInt(map.limit, 10)}, ${parseInt(map.limit, 10)} `;
};
const query = async (sql: string, params: unknown[]): Promise<any> => {
  const logger = new Logger();
  const TAG = '[Database][Query]';
  try {
    const connection = await pool.getConnection();
    await pool.query(`SET time_zone = '+00:00';`, []);
    const [results] = await pool.query(sql, params);
    connection.release();
    return results;
  } catch (err) {
    logger.error(TAG, 'Failed to query statement ' + sql + ' because ' + err);
    throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to query statement ' + sql + ' because ' + err);
  }
};

export const queryLambada = async (
  cf: {
    database?: string;
  },
  fun: (v: { query(sql: string, params: unknown[]): Promise<any> }) => any
) => {
  const logger = new Logger();
  const cs: any = {
    connectionLimit: config.DB_CONN_LIMIT,
    queueLimit: config.DB_QUEUE_LIMIT,
    host: config.DB_URL,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PWD,
    supportBigNumbers: true,
  };
  Object.keys(cf).map(key => {
    cs[key] = (cf as any)[key];
  });
  const sp = mysql.createPool(cs);
  const connection = await sp.getConnection();
  if (connection) {
    connection.release();
    config.DB_SHOW_INFO && logger.info(TAG, 'Pool has been created. (function: queryLambada)');
  }
  try {
    const data = await fun({
      query(sql: string, params: unknown[]): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
          const logger = new Logger();
          const TAG = '[Database][Query]';
          try {
            const [results] = await sp.query(sql, params);
            resolve(results);
          } catch (err) {
            logger.error(TAG, 'Failed to query statement ' + sql + ' because ' + err);
            reject(err);
          }
        });
      },
    });
    //Close connection
    connection.release();
    sp.end();
    return data;
  } catch (err) {
    //Close connection
    connection.release();
    sp.end();
    logger.error(TAG, 'Failed to create connection pool for mysql because ' + err);
    throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
  }
};

class Transaction {
  private pool?: mysql.Pool;
  private trans: any;
  connectionId: any;
  private TAG: any;

  static async build(): Promise<Transaction> {
    const logger = new Logger();
    const Trans = new Transaction();
    try {
      Trans.pool = (await createNewPool())!;
      Trans.trans = await Trans.pool.getConnection();
      Trans.TAG = `[Database][Transaction][CID:${Trans.trans.threadId}]`;
      Trans.trans.beginTransaction();
      return Trans;
    } catch (err) {
      logger.error(Trans.TAG, 'Failed to create transaction when call transaction.init because ' + err);
      await Trans.release();
      throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create transaction when connecting database.');
    }
  }

  public async execute(sql: string, params: any[] | any): Promise<any> {
    const logger = new Logger();
    if (!this.trans) {
      throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Can not use Transaction class without build.');
    }
    try {
      const [result] = await this.trans.query(sql, params);
      return result;
    } catch (err) {
      //rollback transaction and release connection when error occurred.
      logger.error(this.TAG, `Failed to execute statement ${sql} from transaction because ${err}`);
      await this.release();
      throw err;
    }
  }

  async commit() {
    const logger = new Logger();
    try {
      await this.trans.commit();
      await this.release();
      config.DB_SHOW_INFO && logger.info(this.TAG, 'Commited successfully');
    } catch (err) {
      logger.error(this.TAG, 'Failed to commit from transaction because ' + err);
      await this.release();
      throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to commit from transaction.');
    }
  }

  async release() {
    const logger = new Logger();
    try {
      if (this.trans) {
        await this.trans.release();
        await this.trans.destroy();
        this.trans = null;
        await this.pool?.end();
        config.DB_SHOW_INFO && logger.info(this.TAG, 'Release successfully');
      }
    } catch (err) {
      logger.error(this.TAG, 'Failed to commit from transaction because ' + err);
      await this.pool?.end();
      throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to release transaction.');
    }
  }
}

const getPagination = (sql: string, page: number, pageCount: number) => {
  let newSql = sql;
  newSql += ' LIMIT ' + pageCount + ' OFFSET ' + (page - 1) * pageCount;
  return newSql;
};

const escape = (parameter: any) => {
  return mysql.escape(parameter);
};

const checkExists = async (sql: string) => {
  return (await query('select count(1) from ' + sql, []))[0]['count(1)'] > 0;
};

export default {
  createPool,
  execute,
  query,
  Transaction,
  getPagination,
  escape,
  queryLambada,
  checkExists,
};

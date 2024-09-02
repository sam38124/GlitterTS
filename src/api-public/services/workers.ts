import mysql from 'mysql2/promise';
import config from '../../config';
import exception from '../../modules/exception.js';
import { workerData, parentPort, Worker } from 'worker_threads';

type WorkerResp = {
    status: 'success' | 'error';
    resultArray: any;
};

parentPort?.on('message', async (name) => {
    try {
        console.info(`Worker Name: ${name}`);

        const tempArray = [];
        const pool = mysql.createPool({
            connectionLimit: config.DB_CONN_LIMIT,
            queueLimit: config.DB_QUEUE_LIMIT,
            host: config.DB_URL,
            port: config.DB_PORT,
            user: config.DB_USER,
            password: config.DB_PWD,
            supportBigNumbers: true,
        });

        for (const work of workerData) {
            const connection = await pool.getConnection();
            const [result] = await pool.query(work.sql, work.data);
            tempArray.push(result);
            connection.release();
        }

        parentPort?.postMessage({
            message: `Worker Finish: ${name}`,
            tempArray,
        });
    } catch (err) {
        throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
    }
});

export class Workers {
    public static query(data: {
        queryList: {
            sql: string;
            data: any[];
        }[];
        divisor?: number;
    }) {
        const t0 = performance.now();
        const divisor = data.divisor && data.divisor > 1 ? data.divisor : 1;

        const result = new Promise<WorkerResp>((resolve) => {
            let completed = 0;
            let resultArray: any[] = [];
            const chunkSize = Math.ceil(data.queryList.length / divisor);

            for (let i = 0; i < data.queryList.length; i += chunkSize) {
                const chunk = data.queryList.slice(i, i + chunkSize);

                const workerData = chunk.map((record) => {
                    return {
                        sql: record.sql,
                        data: record.data,
                    };
                });

                const worker = new Worker(__filename, {
                    workerData: workerData,
                });

                worker.on('message', (response) => {
                    completed += 1;
                    resultArray = resultArray.concat(response.tempArray);
                    if (completed === Math.ceil(data.queryList.length / chunkSize)) {
                        console.info(response.message);
                        resolve({
                            status: 'success',
                            resultArray,
                        });
                    }
                });

                worker.on('error', (err: any) => {
                    console.error('Worker error:', err);
                    resolve({
                        status: 'error',
                        resultArray: [],
                    });
                });

                // 將訊息傳送給工作線程
                worker.postMessage(`multi thread example (id ${i})`);
            }
        }).then((resp: WorkerResp) => {
            return {
                type: divisor > 1 ? 'multi' : 'single',
                divisor: divisor,
                executionTime: `${(performance.now() - t0).toFixed(3)} ms`,
                queryStatus: resp.status,
                queryData: resp.resultArray,
            };
        });

        return result;
    }
}

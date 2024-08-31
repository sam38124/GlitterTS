import mysql from 'mysql2/promise';
import config from '../../config';
import exception from '../../modules/exception.js';
import { workerData, parentPort, Worker } from 'worker_threads';

parentPort?.on('message', async (name) => {
    try {
        console.info(`Worker Name: ${name}`);

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
            await pool.query(work.sql, work.data);
            connection.release();
        }

        parentPort?.postMessage(`Worker Finish: ${name}`);
    } catch (err) {
        throw exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
    }
});

export class Workers {
    public static async query(data: {
        queryList: {
            sql: string;
            data: any[];
        }[];
        divisor?: number;
    }) {
        const t0 = performance.now();
        const divisor = data.divisor ?? 1;

        const result = new Promise<void>((resolve) => {
            let completed = 0;
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

                worker.on('message', (message) => {
                    completed += 1;
                    if (completed === Math.ceil(data.queryList.length / chunkSize)) {
                        console.info(message);
                        resolve();
                    }
                });

                worker.on('error', (err: any) => {
                    console.error('Worker error:', err);
                });

                // 將訊息傳送給工作線程
                worker.postMessage(`multi thread example (id ${i})`);
            }
        }).then(() => {
            return {
                type: divisor > 1 ? 'multi' : 'single',
                divisor: divisor,
                executionTime: `${(performance.now() - t0).toFixed(3)} ms`,
            };
        });

        return result;
    }
}

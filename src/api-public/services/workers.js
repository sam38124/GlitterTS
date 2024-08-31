"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workers = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = __importDefault(require("../../config"));
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const worker_threads_1 = require("worker_threads");
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', async (name) => {
    try {
        console.info(`Worker Name: ${name}`);
        const pool = promise_1.default.createPool({
            connectionLimit: config_1.default.DB_CONN_LIMIT,
            queueLimit: config_1.default.DB_QUEUE_LIMIT,
            host: config_1.default.DB_URL,
            port: config_1.default.DB_PORT,
            user: config_1.default.DB_USER,
            password: config_1.default.DB_PWD,
            supportBigNumbers: true,
        });
        for (const work of worker_threads_1.workerData) {
            const connection = await pool.getConnection();
            await pool.query(work.sql, work.data);
            connection.release();
        }
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(`Worker Finish: ${name}`);
    }
    catch (err) {
        throw exception_js_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
    }
});
class Workers {
    static async query(data) {
        var _a;
        const t0 = performance.now();
        const divisor = (_a = data.divisor) !== null && _a !== void 0 ? _a : 1;
        const result = new Promise((resolve) => {
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
                const worker = new worker_threads_1.Worker(__filename, {
                    workerData: workerData,
                });
                worker.on('message', (message) => {
                    completed += 1;
                    if (completed === Math.ceil(data.queryList.length / chunkSize)) {
                        console.info(message);
                        resolve();
                    }
                });
                worker.on('error', (err) => {
                    console.error('Worker error:', err);
                });
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
exports.Workers = Workers;
//# sourceMappingURL=workers.js.map
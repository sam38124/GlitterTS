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
        const tempArray = [];
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
            const [result] = await pool.query(work.sql, work.data);
            tempArray.push(result);
            connection.release();
        }
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({
            message: `Worker Finish: ${name}`,
            tempArray,
        });
    }
    catch (err) {
        throw exception_js_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
    }
});
class Workers {
    static query(data) {
        const t0 = performance.now();
        const divisor = data.divisor && data.divisor > 1 ? data.divisor : 1;
        const result = new Promise((resolve) => {
            let completed = 0;
            let resultArray = [];
            const chunkSize = Math.ceil(data.queryList.length / divisor);
            for (let i = 0; i < data.queryList.length; i += chunkSize) {
                const chunk = data.queryList.slice(i, i + chunkSize);
                const workerData = chunk.map((record, index) => ({
                    sql: record.sql,
                    data: record.data,
                    originalIndex: i + index,
                }));
                const worker = new worker_threads_1.Worker(__filename, {
                    workerData: workerData,
                });
                worker.on('message', (response) => {
                    completed += 1;
                    resultArray = resultArray.concat(response.tempArray.map((item, idx) => ({
                        index: workerData[idx].originalIndex,
                        data: item,
                    })));
                    if (completed === Math.ceil(data.queryList.length / chunkSize)) {
                        resultArray.sort((a, b) => a.index - b.index);
                        console.info(response.message);
                        resolve({
                            status: 'success',
                            resultArray: resultArray.map((item) => item.data),
                        });
                    }
                });
                worker.on('error', (err) => {
                    console.error('Worker error:', err);
                    resolve({
                        status: 'error',
                        resultArray: [],
                    });
                });
                worker.postMessage(`multi thread example (id ${i})`);
            }
        }).then((resp) => {
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
exports.Workers = Workers;
//# sourceMappingURL=workers.js.map
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
exports.Workers = void 0;
var promise_1 = require("mysql2/promise");
var config_1 = require("../../config");
var exception_js_1 = require("../../modules/exception.js");
var worker_threads_1 = require("worker_threads");
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var tempArray, pool, _i, workerData_1, work, connection, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                tempArray = [];
                pool = promise_1.default.createPool({
                    connectionLimit: config_1.default.DB_CONN_LIMIT,
                    queueLimit: config_1.default.DB_QUEUE_LIMIT,
                    host: config_1.default.DB_URL,
                    port: config_1.default.DB_PORT,
                    user: config_1.default.DB_USER,
                    password: config_1.default.DB_PWD,
                    supportBigNumbers: true,
                });
                _i = 0, workerData_1 = worker_threads_1.workerData;
                _a.label = 1;
            case 1:
                if (!(_i < workerData_1.length)) return [3 /*break*/, 5];
                work = workerData_1[_i];
                return [4 /*yield*/, pool.getConnection()];
            case 2:
                connection = _a.sent();
                return [4 /*yield*/, pool.query(work.sql, work.data)];
            case 3:
                result = (_a.sent())[0];
                tempArray.push(result);
                connection.release();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5:
                worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({
                    message: "Worker Finish: ".concat(name),
                    tempArray: tempArray,
                });
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                throw exception_js_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to create connection pool.');
            case 7: return [2 /*return*/];
        }
    });
}); });
var Workers = /** @class */ (function () {
    function Workers() {
    }
    Workers.query = function (data) {
        var t0 = performance.now();
        var divisor = data.divisor && data.divisor > 1 ? data.divisor : 1;
        var result = new Promise(function (resolve) {
            var completed = 0;
            var resultArray = []; // 包含索引的結果
            var chunkSize = Math.ceil(data.queryList.length / divisor);
            var _loop_1 = function (i) {
                var chunk = data.queryList.slice(i, i + chunkSize);
                // 包含索引以追蹤原本的順序
                var workerData_2 = chunk.map(function (record, index) { return ({
                    sql: record.sql,
                    data: record.data,
                    originalIndex: i + index, // 記錄原始索引
                }); });
                var worker = new worker_threads_1.Worker(__filename, {
                    workerData: workerData_2,
                });
                worker.on('message', function (response) {
                    completed += 1;
                    // 合併每個線程的結果，並保留索引
                    resultArray = resultArray.concat(response.tempArray.map(function (item, idx) { return ({
                        index: workerData_2[idx].originalIndex,
                        data: item,
                    }); }));
                    if (completed === Math.ceil(data.queryList.length / chunkSize)) {
                        // 按原始索引排序
                        resultArray.sort(function (a, b) { return a.index - b.index; });
                        // console.log(response.message);
                        resolve({
                            status: 'success',
                            resultArray: resultArray.map(function (item) { return item.data; }), // 去除索引，只保留數據
                        });
                    }
                });
                worker.on('error', function (err) {
                    console.error('Worker error:', err);
                    resolve({
                        status: 'error',
                        resultArray: [],
                    });
                });
                // 將訊息傳送給工作線程
                worker.postMessage("multi thread example (id ".concat(i, ")"));
            };
            for (var i = 0; i < data.queryList.length; i += chunkSize) {
                _loop_1(i);
            }
        }).then(function (resp) {
            return {
                type: divisor > 1 ? 'multi' : 'single',
                divisor: divisor,
                executionTime: "".concat((performance.now() - t0).toFixed(3), " ms"),
                queryStatus: resp.status,
                queryData: resp.resultArray,
            };
        });
        return result;
    };
    return Workers;
}());
exports.Workers = Workers;

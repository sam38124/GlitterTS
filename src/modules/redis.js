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
var redis_1 = require("redis");
var config_1 = require("../config");
var logger_1 = require("./logger");
var exception_1 = require("./exception");
var TAG = '[Redis]';
var redisClient;
var connect = function () {
    return new Promise(function (resolve, reject) {
        redisClient = (0, redis_1.createClient)({
            url: "redis://:".concat(config_1.default.REDIS_PWD, "@").concat(config_1.default.REDIS_URL, ":").concat(config_1.default.REDIS_PORT)
        });
        redisClient.on('ready', function () {
            console.log('Redis connection has ready.');
            new logger_1.default().info(TAG, 'Redis connection has ready.');
            return resolve('');
        });
        redisClient.on('connect', function () {
            new logger_1.default().info(TAG, 'Redis connection has been connected.');
        });
        redisClient.on('error', function (err) {
            new logger_1.default().error(TAG, 'Receive redis error ' + err);
        });
        redisClient.on('reconnecting', function () {
            new logger_1.default().error(TAG, 'Reconnect to redis');
        });
        redisClient.on('end', function () {
            new logger_1.default().error(TAG, 'Redis connection has been closed');
        });
        redisClient.connect();
    });
};
var getHashmap = function (key) {
    return new Promise(function (resolve, reject) {
        redisClient.hgetall(key, function (err, obj) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get value from redis.'));
            }
            return resolve(obj);
        });
    });
};
var setHashmap = function (key, obj) {
    return new Promise(function (resolve, reject) {
        redisClient.HMSET(key, obj, function (err) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to set value in redis.'));
            }
            return resolve('');
        });
    });
};
var getValue = function (key) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var data, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, redisClient.get(key)];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, resolve(data)];
                case 2:
                    e_1 = _a.sent();
                    return [2 /*return*/, resolve(undefined)];
                case 3: return [2 /*return*/];
            }
        });
    }); });
};
var setValue = function (key, value) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, redisClient.set(key, value)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, resolve(true)];
            }
        });
    }); });
};
var setValueWithExp = function (key, value, ttl) {
    return new Promise(function (resolve, reject) {
        redisClient.set(key, value, 'EX', ttl, function (err) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to set value in redis.'));
            }
            return resolve('');
        });
    });
};
var expire = function (key, seconds) {
    return new Promise(function (resolve, reject) {
        seconds = seconds | 0;
        redisClient.expire(key, seconds, function (err) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to expire value in redis.'));
            }
            return resolve('');
        });
    });
};
var increase = function (key) {
    return new Promise(function (resolve, reject) {
        redisClient.incr(key, function (err) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to increase value in redis.'));
            }
            return resolve('');
        });
    });
};
var exists = function (key) {
    return new Promise(function (resolve, reject) {
        redisClient.exists(key, function (err, reply) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to value exists in redis.'));
            }
            return resolve(reply);
        });
    });
};
var hexists = function (key, field) {
    return new Promise(function (resolve, reject) {
        redisClient.hexists(key, field, function (err, reply) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to value exists in redis.'));
            }
            return resolve(reply);
        });
    });
};
var scan = function (key) {
    return new Promise(function (resolve, reject) {
        redisClient.keys(key, function (err, reply) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to value exists in redis.'));
            }
            return resolve(reply);
        });
    });
};
var hkeys = function (key) {
    return new Promise(function (resolve, reject) {
        redisClient.hkeys(key, function (err, obj) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get value from redis.'));
            }
            return resolve(obj);
        });
    });
};
var hget = function (key, field) {
    return new Promise(function (resolve, reject) {
        redisClient.hget(key, field, function (err, obj) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get value from redis.'));
            }
            return resolve(obj);
        });
    });
};
var hdel = function (key, fields) {
    return new Promise(function (resolve, reject) {
        redisClient.hdel(key, fields, function (err, obj) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get value from redis.'));
            }
            return resolve(obj);
        });
    });
};
var deleteKey = function (key) {
    return new Promise(function (resolve, reject) {
        redisClient.del(key, function (err, obj) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to deleteKey from redis.'));
            }
            return resolve(obj);
        });
    });
};
exports.default = {
    connect: connect,
    getHashmap: getHashmap,
    setHashmap: setHashmap,
    getValue: getValue,
    setValue: setValue,
    setValueWithExp: setValueWithExp,
    expire: expire,
    increase: increase,
    exists: exists,
    hexists: hexists,
    scan: scan,
    hkeys: hkeys,
    hget: hget,
    hdel: hdel,
    deleteKey: deleteKey
};

'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("./logger"));
const exception_1 = __importDefault(require("./exception"));
const TAG = '[Redis]';
let redisClient;
const connect = () => {
    return new Promise((resolve, reject) => {
        redisClient = (0, redis_1.createClient)({
            url: `redis://:${config_1.default.REDIS_PWD}@${config_1.default.REDIS_URL}:${config_1.default.REDIS_PORT}`
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
const getHashmap = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.hgetall(key, function (err, obj) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get value from redis.'));
            }
            return resolve(obj);
        });
    });
};
const setHashmap = (key, obj) => {
    return new Promise((resolve, reject) => {
        redisClient.HMSET(key, obj, function (err) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to set value in redis.'));
            }
            return resolve('');
        });
    });
};
const getValue = (key) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await redisClient.get(key);
            return resolve(data);
        }
        catch (e) {
            return resolve(undefined);
        }
    });
};
const setValue = (key, value) => {
    return new Promise(async (resolve, reject) => {
        await redisClient.set(key, value);
        return resolve(true);
    });
};
const setValueWithExp = (key, value, ttl) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, value, 'EX', ttl, function (err) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to set value in redis.'));
            }
            return resolve('');
        });
    });
};
const expire = (key, seconds) => {
    return new Promise((resolve, reject) => {
        seconds = seconds | 0;
        redisClient.expire(key, seconds, function (err) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to expire value in redis.'));
            }
            return resolve('');
        });
    });
};
const increase = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.incr(key, function (err) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to increase value in redis.'));
            }
            return resolve('');
        });
    });
};
const exists = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.exists(key, function (err, reply) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to value exists in redis.'));
            }
            return resolve(reply);
        });
    });
};
const hexists = (key, field) => {
    return new Promise((resolve, reject) => {
        redisClient.hexists(key, field, function (err, reply) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to value exists in redis.'));
            }
            return resolve(reply);
        });
    });
};
const scan = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.keys(key, function (err, reply) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to value exists in redis.'));
            }
            return resolve(reply);
        });
    });
};
const hkeys = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.hkeys(key, function (err, obj) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get value from redis.'));
            }
            return resolve(obj);
        });
    });
};
const hget = (key, field) => {
    return new Promise((resolve, reject) => {
        redisClient.hget(key, field, function (err, obj) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get value from redis.'));
            }
            return resolve(obj);
        });
    });
};
const hdel = (key, fields) => {
    return new Promise((resolve, reject) => {
        redisClient.hdel(key, fields, function (err, obj) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get value from redis.'));
            }
            return resolve(obj);
        });
    });
};
const deleteKey = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.del(key, function (err, obj) {
            if (err) {
                return reject(exception_1.default.ServerError('INTERNAL_SERVER_ERROR', 'Failed to deleteKey from redis.'));
            }
            return resolve(obj);
        });
    });
};
exports.default = {
    connect,
    getHashmap,
    setHashmap,
    getValue,
    setValue,
    setValueWithExp,
    expire,
    increase,
    exists,
    hexists,
    scan,
    hkeys,
    hget,
    hdel,
    deleteKey
};
//# sourceMappingURL=redis.js.map
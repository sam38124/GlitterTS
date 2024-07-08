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

import { createClient } from 'redis';
import config from '../config';
import Logger from './logger';
import exception from './exception';
const TAG = '[Redis]';
let redisClient;
const connect = () => {
    return new Promise((resolve, reject) => {
        redisClient = createClient({
            url: `redis://:${config.REDIS_PWD}@${config.REDIS_URL}:${config.REDIS_PORT}`
        });
        redisClient.on('ready', function () {
            console.log('Redis connection has ready.');
            new Logger().info(TAG, 'Redis connection has ready.');
            return resolve('');
        });
        redisClient.on('connect', function () {
            new Logger().info(TAG, 'Redis connection has been connected.');
        });
        redisClient.on('error', function (err) {
            new Logger().error(TAG, 'Receive redis error ' + err);
        });
        redisClient.on('reconnecting', function () {
            new Logger().error(TAG, 'Reconnect to redis');
        });
        redisClient.on('end', function () {
            new Logger().error(TAG, 'Redis connection has been closed');
        });
        redisClient.connect();
    });
};
const getHashmap = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.hgetall(key, function (err, obj) {
            if (err) {
                return reject(exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get value from redis.'));
            }
            return resolve(obj);
        });
    });
};
const setHashmap = (key, obj) => {
    return new Promise((resolve, reject) => {
        redisClient.HMSET(key, obj, function (err) {
            if (err) {
                return reject(exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to set value in redis.'));
            }
            return resolve('');
        });
    });
};
const getValue = (key) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield redisClient.get(key);
            return resolve(data);
        }
        catch (e) {
            return resolve(undefined);
        }
    }));
};
const setValue = (key, value) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        yield redisClient.set(key, value);
        return resolve(true);
    }));
};
const setValueWithExp = (key, value, ttl) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, value, 'EX', ttl, function (err) {
            if (err) {
                return reject(exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to set value in redis.'));
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
                return reject(exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to expire value in redis.'));
            }
            return resolve('');
        });
    });
};
const increase = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.incr(key, function (err) {
            if (err) {
                return reject(exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to increase value in redis.'));
            }
            return resolve('');
        });
    });
};
const exists = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.exists(key, function (err, reply) {
            if (err) {
                return reject(exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to value exists in redis.'));
            }
            return resolve(reply);
        });
    });
};
const hexists = (key, field) => {
    return new Promise((resolve, reject) => {
        redisClient.hexists(key, field, function (err, reply) {
            if (err) {
                return reject(exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to value exists in redis.'));
            }
            return resolve(reply);
        });
    });
};
const scan = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.keys(key, function (err, reply) {
            if (err) {
                return reject(exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to value exists in redis.'));
            }
            return resolve(reply);
        });
    });
};
const hkeys = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.hkeys(key, function (err, obj) {
            if (err) {
                return reject(exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get value from redis.'));
            }
            return resolve(obj);
        });
    });
};
const hget = (key, field) => {
    return new Promise((resolve, reject) => {
        redisClient.hget(key, field, function (err, obj) {
            if (err) {
                return reject(exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get value from redis.'));
            }
            return resolve(obj);
        });
    });
};
const hdel = (key, fields) => {
    return new Promise((resolve, reject) => {
        redisClient.hdel(key, fields, function (err, obj) {
            if (err) {
                return reject(exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to get value from redis.'));
            }
            return resolve(obj);
        });
    });
};
const deleteKey = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.del(key, function (err, obj) {
            if (err) {
                return reject(exception.ServerError('INTERNAL_SERVER_ERROR', 'Failed to deleteKey from redis.'));
            }
            return resolve(obj);
        });
    });
};
export default {
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

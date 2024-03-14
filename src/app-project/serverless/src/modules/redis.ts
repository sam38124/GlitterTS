'use strict';
import { createClient } from 'redis';
import config       from '../config';
import Logger       from './logger';
import exception    from './exception';
const TAG         = '[Redis]';

let redisClient:any;

const connect = () => {

    return new Promise((resolve, reject) => {
        redisClient = createClient({
            url: `redis://:${config.REDIS_PWD}@${config.REDIS_URL}:${config.REDIS_PORT}`
        });

        redisClient.on('ready',function() {
            console.log('Redis connection has ready.')
            new Logger().info(TAG, 'Redis connection has ready.');
            return resolve('');
        });

        redisClient.on('connect',function() {
            new Logger().info(TAG, 'Redis connection has been connected.');
        });

        redisClient.on('error', function (err: any) {
            new Logger().error(TAG, 'Receive redis error ' + err);
        });

        redisClient.on('reconnecting', function () {
            new Logger().error(TAG, 'Reconnect to redis');
        });


        redisClient.on('end', function () {
            new Logger().error(TAG, 'Redis connection has been closed');
        });
        redisClient.connect()
    });
};

const getHashmap = (key: string) => {
    return new Promise((resolve, reject) => {
        redisClient.hgetall(key, function (err: Error | null, obj: { [p: string]: string }) {
            if (err) {
                return reject(exception.ServerError(
                    'INTERNAL_SERVER_ERROR',
                    'Failed to get value from redis.'
                ));
            }
            return resolve(obj);
        });
    });
};

const setHashmap = (key: string, obj: any) => {
    return new Promise((resolve, reject) => {
        redisClient.HMSET(key, obj, function (err: Error | null) {
            if (err) {
                return reject(exception.ServerError(
                    'INTERNAL_SERVER_ERROR',
                    'Failed to set value in redis.'
                ));
            }
            return resolve('');
        });
    });
};

const getValue = (key: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data=await redisClient.get(key)
            return resolve(data);
        }catch (e){
            return resolve(undefined);
        }
    });
};

const setValue = (key: string, value: string) => {
    return new Promise(async(resolve, reject) => {
        await redisClient.set(key, value);
        return resolve(true);
    });
};


const setValueWithExp = (key: string, value: string, ttl: number) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, value, 'EX', ttl, function (err: Error | null) {
            if (err) {
                return reject(exception.ServerError(
                    'INTERNAL_SERVER_ERROR',
                    'Failed to set value in redis.'
                ));
            }
            return resolve('');
        });
    });
};

const expire = (key: string, seconds: number) => {
    return new Promise((resolve, reject) => {
        seconds = seconds | 0;
        redisClient.expire(key, seconds, function (err: Error | null) {
            if (err) {
                return reject(exception.ServerError(
                    'INTERNAL_SERVER_ERROR',
                    'Failed to expire value in redis.'
                ));
            }
            return resolve('');
        });
    });
};

const increase = (key:string) => {
    return new Promise((resolve, reject) => {
        redisClient.incr(key, function (err: Error | null) {
            if (err) {
                return reject(exception.ServerError(
                    'INTERNAL_SERVER_ERROR',
                    'Failed to increase value in redis.'
                ));
            }
            return resolve('');
        });
    });
};

const exists = (key:string) => {
    return new Promise((resolve, reject) => {
        redisClient.exists(key, function (err: Error | null, reply: number) {
            if (err) {
                return reject(exception.ServerError(
                    'INTERNAL_SERVER_ERROR',
                    'Failed to value exists in redis.'
                ));
            }
            return resolve(reply);
        });
    });
};


const hexists = (key:string, field: string) => {
    return new Promise((resolve, reject) => {
        redisClient.hexists(key, field, function (err: Error | null, reply: number) {
            if (err) {
                return reject(exception.ServerError(
                    'INTERNAL_SERVER_ERROR',
                    'Failed to value exists in redis.'
                ));
            }
            return resolve(reply);
        });
    });
};


const scan = (key:string) => {
    return new Promise((resolve, reject) => {
        redisClient.keys(key, function (err: Error | null, reply: string[]) {
            if (err) {
                return reject(exception.ServerError(
                    'INTERNAL_SERVER_ERROR',
                    'Failed to value exists in redis.'
                ));
            }
            return resolve(reply);
        });
    });
};

const hkeys = (key: string) => {
    return new Promise((resolve, reject) => {
        redisClient.hkeys(key, function (err: Error | null, obj: string[]) {
            if (err) {
                return reject(exception.ServerError(
                    'INTERNAL_SERVER_ERROR',
                    'Failed to get value from redis.'
                ));
            }
            return resolve(obj);
        });
    });
};

const hget = (key: string, field: string) => {
    return new Promise((resolve, reject) => {
        redisClient.hget(key, field, function (err: Error | null, obj: string) {
            if (err) {
                return reject(exception.ServerError(
                    'INTERNAL_SERVER_ERROR',
                    'Failed to get value from redis.'
                ));
            }
            return resolve(obj);
        });
    });
};


const hdel = (key: string, fields: Array<any>) => {
    return new Promise((resolve, reject) => {
        redisClient.hdel(key, fields, function (err: Error | null, obj: number) {
            if (err) {
                return reject(exception.ServerError(
                    'INTERNAL_SERVER_ERROR',
                    'Failed to get value from redis.'
                ));
            }
            return resolve(obj);
        });
    });
};

const deleteKey = (key:string)=>{
    return new Promise((resolve, reject) => {
        redisClient.del(key, function (err: Error | null, obj: number) {
            if (err) {
                return reject(exception.ServerError(
                    'INTERNAL_SERVER_ERROR',
                    'Failed to deleteKey from redis.'
                ));
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
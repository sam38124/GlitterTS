// const bcrypt        = require('bcrypt');
import bcrypt from 'bcrypt';
// import express from 'express';
import _ from 'underscore';
import config from '../config';
import Logger from './logger';
import crypto from 'crypto';
import moment from 'moment';

function isNull(...args: any[]) {
    if (!args || args.length == 0) {
        return true;
    }

    for (let i = 0; i < args.length; i++) {
        if (_.isNull(args[i]) || _.isUndefined(args[i]) || args[i].length == 0 || (_.isObject(args[i]) && _.isEmpty(args[i]))) {
            return true;
        }
    }
    return false;
}

function replaceDatetime(datetime: any) {
    if (datetime) return datetime.replace('T', ' ').replace('.000Z', '').replace('+00:00', '');

    return datetime;
}

// function jsonNull(jsonObject: Object) {
//     const TAG = '[JsonNull]'
//     const logger = new Logger();
//     for(let key in jsonObject) {
//         if (typeof jsonObject[key] === 'undefined') {
//             logger.error(TAG, key + ' ' + jsonObject[key]);
//             return true;
//         }
//     }
//     return false;
// }

// const getUnixTimestamp = (timestamp) => {
//     return (timestamp.toString().length > 10) ? Math.floor(timestamp / 1000) : timestamp;
// };

// export function getIp(req:express.Request):string {
//     // const logger = new Logger();
//     let ip:string;
//     if (!req) {
//         return ip;
//     }

//     if (req.headers['Cdn-Src-Ip'] && typeof req.headers['Cdn-Src-Ip']== 'string') {
//         ip = req.headers['Cdn-Src-Ip'];
//     } else if (req.headers['x-forwarded-for']) {
//         ip = req.headers['x-forwarded-for'].split(',')[0];
//     } else if (req.connection && req.connection.remoteAddress) {
//         ip = req.connection.remoteAddress;
//     } else {
//         ip = req.ip;
//     }

//     if (typeof ip !== 'string') {
//         // logger.warning('[GetIp]', `Invalid IP Address ${ip}`);
//         ip = '';
//     }

//     return ip.trim();
// }

export function toJSONSafeString(val: string): string {
    return val.replace(/[\t\n\r]/g, (match: string) => {
        switch (match) {
            case '\t':
                return '\\t';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            default:
                return match;
        }
    });
}

// function isValidAccount (account) {
//     return new RegExp(config.ACCOUNT_FORMAT).test(account);
// }

// function isValidPwd (pwd) {
//     return new RegExp(config.PWD_FORMAT).test(pwd);
// }

// function isValidMail (mail) {
//     return new RegExp(config.MAIL_FORMAT).test(mail);
// }

// function isValidNickName (nickName) {
//     return new RegExp(config.NICKNAME_FORMAT).test(nickName);
// }

// function isValidRealName (realName) {
//     return new RegExp(config.REALNAME_FORMAT).test(realName);
// }

// function countTotalPage (totalCount, pageSize){
//     if(isNull(totalCount, pageSize) || !_.isNumber(totalCount, pageSize)){
//         throw Error;
//     }
//     return Math.ceil(totalCount/pageSize);
// }

// function isNumber() {
//     for (let i = 0; i < arguments.length; i++) {
//         if (typeof arguments[i] != 'number') {
//             // logger.error(arguments[i] + ' is not number');
//             return false;
//         }
//     }
//     return true;
// }

// function isInteger() {
//     for (let i = 0; i < arguments.length; i++) {
//         if (!isNumber(arguments[i]) || arguments[i] % 1 != 0) {
//             //logger.error(arguments[i] + ' is not integer');
//             return false;
//         }
//     }
//     return true;
// }

// function isPositiveInteger() {
//     for (let i = 0; i < arguments.length; i++) {
//         if (!isInteger(arguments[i]) || arguments[i] < 0) {
//             return false;
//         }
//     }
//     return true;
// }

interface requestBody {
    [key: string]: any;
}

function getMaskObj(obj: any): requestBody {
    const maskObj: requestBody = {};
    _.map(obj, (value, key: string) => {
        if (config.PARAMS_NEED_ENCRYPT_IN_LOG.includes(key)) {
            maskObj[key] = '***********';
        } else {
            maskObj[key] = value;
        }
    });
    return maskObj;
}

// function isValidPaginationParams (page, pageSize) {
//     const TAG = '[CheckPaginationParams]';
//     const logger = new Logger();
//     if (!isPositiveInteger(page)) {
//         new logger().error(TAG, `Invalid page: ${page}.`);
//         throw false;
//     } else if (!isPositiveInteger(pageSize)) {
//         new logger().error(TAG, `Invalid page_size: ${pageSize}.`);
//         throw false;
//     }
//     return true;
// }

async function hashPwd(pwd: string): Promise<string> {
    const TAG = '[HashPwd]';
    const logger = new Logger();
    try {
        bcrypt.compare;
        const saltRounds = config.PWD_SALT_ROUND;
        const hashPwd = await bcrypt.hash(pwd, saltRounds);
        return hashPwd;
    } catch (err) {
        logger.error(TAG, `Generate admin pwd fail because ${err}`);
        throw err;
    }
}

function createOrderId(): string {
    const orderId = '#' + moment(new Date()).format('YYYYMMDD') + crypto.randomBytes(4).toString('hex');
    return orderId;
}

const randomString = (max: number) => {
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

const compareHash = async (pwd: string, has: string) => bcrypt.compare(pwd, has);

export default {
    isNull,
    replaceDatetime,
    toJSONSafeString,
    getMaskObj,
    hashPwd,
    createOrderId,
    randomString,
    compareHash,
};

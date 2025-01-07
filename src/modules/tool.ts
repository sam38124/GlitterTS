import bcrypt from 'bcrypt';
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

const randomNumber = (max: number) => {
    const possible = '0123456789';
    let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

const compareHash = async (pwd: string, has: string) => bcrypt.compare(pwd, has);

const convertDateTimeFormat = (dateTimeStr?: string) => {
    const dateTime = dateTimeStr ? new Date(dateTimeStr) : new Date();
    const year = dateTime.getFullYear();
    const month = ('0' + (dateTime.getMonth() + 1)).slice(-2);
    const day = ('0' + dateTime.getDate()).slice(-2);
    const hours = ('0' + dateTime.getHours()).slice(-2);
    const minutes = ('0' + dateTime.getMinutes()).slice(-2);
    const seconds = ('0' + dateTime.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default {
    isNull,
    replaceDatetime,
    toJSONSafeString,
    getMaskObj,
    hashPwd,
    createOrderId,
    randomString,
    compareHash,
    randomNumber,
    convertDateTimeFormat,
};

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import _ from 'underscore';
import config from '../config';
import Logger from '../modules/logger';
import crypto from 'crypto';
import moment from 'moment';
function isNull(...args) {
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
export function getUUID() {
    let d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return "s" + (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
}
function replaceDatetime(datetime) {
    if (datetime)
        return datetime.replace('T', ' ').replace('.000Z', '').replace('+00:00', '');
    return datetime;
}
export function toJSONSafeString(val) {
    return val.replace(/[\t\n\r]/g, (match) => {
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
function getMaskObj(obj) {
    const maskObj = {};
    _.map(obj, (value, key) => {
        if (config.PARAMS_NEED_ENCRYPT_IN_LOG.includes(key)) {
            maskObj[key] = '***********';
        }
        else {
            maskObj[key] = value;
        }
    });
    return maskObj;
}
function hashPwd(pwd) {
    return __awaiter(this, void 0, void 0, function* () {
        const TAG = '[HashPwd]';
        const logger = new Logger();
        try {
            bcrypt.compare;
            const saltRounds = config.PWD_SALT_ROUND;
            const hashPwd = yield bcrypt.hash(pwd, saltRounds);
            return hashPwd;
        }
        catch (err) {
            logger.error(TAG, `Generate admin pwd fail because ${err}`);
            throw err;
        }
    });
}
function createOrderId() {
    const orderId = '#' + moment(new Date()).format('YYYYMMDD') + crypto.randomBytes(4).toString('hex');
    return orderId;
}
const randomString = (max) => {
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (let i = 1; i < max; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
const compareHash = (pwd, has) => __awaiter(void 0, void 0, void 0, function* () { return bcrypt.compare(pwd, has); });
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUUID = getUUID;
exports.toJSONSafeString = toJSONSafeString;
const bcrypt_1 = __importDefault(require("bcrypt"));
const underscore_1 = __importDefault(require("underscore"));
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../modules/logger"));
const crypto_1 = __importDefault(require("crypto"));
const moment_1 = __importDefault(require("moment"));
function isNull(...args) {
    if (!args || args.length == 0) {
        return true;
    }
    for (let i = 0; i < args.length; i++) {
        if (underscore_1.default.isNull(args[i]) || underscore_1.default.isUndefined(args[i]) || args[i].length == 0 || (underscore_1.default.isObject(args[i]) && underscore_1.default.isEmpty(args[i]))) {
            return true;
        }
    }
    return false;
}
function getUUID() {
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
function toJSONSafeString(val) {
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
    underscore_1.default.map(obj, (value, key) => {
        if (config_1.default.PARAMS_NEED_ENCRYPT_IN_LOG.includes(key)) {
            maskObj[key] = '***********';
        }
        else {
            maskObj[key] = value;
        }
    });
    return maskObj;
}
async function hashPwd(pwd) {
    const TAG = '[HashPwd]';
    const logger = new logger_1.default();
    try {
        const saltRounds = config_1.default.PWD_SALT_ROUND;
        const hashPwd = await bcrypt_1.default.hash(pwd, saltRounds);
        return hashPwd;
    }
    catch (err) {
        logger.error(TAG, `Generate admin pwd fail because ${err}`);
        throw err;
    }
}
function hashSHA256(value) {
    return crypto_1.default.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}
function createOrderId() {
    const orderId = '#' + (0, moment_1.default)(new Date()).format('YYYYMMDD') + crypto_1.default.randomBytes(4).toString('hex');
    return orderId;
}
const randomString = (max) => {
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (let i = 1; i < max; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
const checksum = (message) => {
    const hash = crypto_1.default.createHash('sha256');
    hash.update(message);
    const checksum = hash.digest('hex');
    return (checksum);
};
const compareHash = async (pwd, has) => bcrypt_1.default.compare(pwd, has);
exports.default = {
    isNull,
    replaceDatetime,
    toJSONSafeString,
    getMaskObj,
    hashPwd,
    createOrderId,
    randomString,
    compareHash,
    checksum,
    hashSHA256
};
//# sourceMappingURL=tool.js.map
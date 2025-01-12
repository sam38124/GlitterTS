"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSONSafeString = toJSONSafeString;
const bcrypt_1 = __importDefault(require("bcrypt"));
const underscore_1 = __importDefault(require("underscore"));
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("./logger"));
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
        bcrypt_1.default.compare;
        const saltRounds = config_1.default.PWD_SALT_ROUND;
        const hashPwd = await bcrypt_1.default.hash(pwd, saltRounds);
        return hashPwd;
    }
    catch (err) {
        logger.error(TAG, `Generate admin pwd fail because ${err}`);
        throw err;
    }
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
const randomNumber = (max) => {
    const possible = '0123456789';
    let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (let i = 1; i < max; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
const compareHash = async (pwd, has) => bcrypt_1.default.compare(pwd, has);
const getCurrentDateTime = (json) => {
    const currentDate = json && json.inputDate ? new Date(json.inputDate) : new Date();
    currentDate.setSeconds(currentDate.getSeconds() + (json && json.addSeconds ? json.addSeconds : 0));
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const hours = ('0' + currentDate.getHours()).slice(-2);
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);
    const seconds = ('0' + currentDate.getSeconds()).slice(-2);
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
};
exports.default = {
    isNull,
    replaceDatetime,
    toJSONSafeString,
    getMaskObj,
    hashPwd,
    createOrderId,
    randomString,
    compareHash,
    randomNumber,
    getCurrentDateTime,
};
//# sourceMappingURL=tool.js.map
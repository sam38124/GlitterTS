import bcrypt from 'bcrypt';
import _ from 'underscore';
import config from '../config';
import Logger from './logger';
import crypto from 'crypto';
import moment from 'moment';

type DiffResult = {
  [key: string]: any;
};

function isNull(...args: any[]) {
  if (!args || args.length == 0) {
    return true;
  }

  for (let i = 0; i < args.length; i++) {
    if (
      _.isNull(args[i]) ||
      _.isUndefined(args[i]) ||
      args[i].length == 0 ||
      (_.isObject(args[i]) && _.isEmpty(args[i]))
    ) {
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

const getCurrentDateTime = (json?: { inputDate?: string; addSeconds?: number }) => {
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

const formatDateTime = (dateTimeStr?: string, includeSeconds: boolean = false): string => {
  const date = dateTimeStr ? new Date(dateTimeStr) : new Date();

  if (isNaN(date.getTime())) return ''; // 避免無效日期

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return includeSeconds
    ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    : `${year}-${month}-${day} ${hours}:${minutes}`;
};

function floatAdd(a: number, b: number) {
  // 檢查 a 和 b 是否為數字
  if (typeof a !== 'number' || typeof b !== 'number') {
    return NaN; // 如果其中一個不是數字，則返回 NaN（Not a Number）
  }

  // 檢查 a 和 b 是否為浮點數
  if (a % 1 !== 0 || b % 1 !== 0) {
    // 如果是浮點數，則進行精確計算
    const multiplier = Math.pow(10, 10); // 假設需要精確到小數點後 10 位
    return (Math.round(a * multiplier) + Math.round(b * multiplier)) / multiplier;
  } else {
    // 如果是整數，則直接相加
    return a + b;
  }
}

function deepDiff(obj1: any, obj2: any): DiffResult {
  const result: DiffResult = {};

  const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

  for (const key of keys) {
    const val1 = obj1?.[key];
    const val2 = obj2?.[key];

    if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
      const childDiff = deepDiff(val1, val2);
      if (Object.keys(childDiff).length > 0) {
        result[key] = childDiff;
      }
    } else if (val1 !== val2) {
      result[key] = { before: val1, after: val2 };
    }
  }

  return result;
}

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
  getCurrentDateTime,
  formatDateTime,
  floatAdd,
  deepDiff,
};

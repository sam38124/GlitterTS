"use strict";
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
exports.toJSONSafeString = void 0;
var bcrypt_1 = require("bcrypt");
var underscore_1 = require("underscore");
var config_1 = require("../config");
var logger_1 = require("./logger");
var crypto_1 = require("crypto");
var moment_1 = require("moment");
function isNull() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (!args || args.length == 0) {
        return true;
    }
    for (var i = 0; i < args.length; i++) {
        if (underscore_1.default.isNull(args[i]) ||
            underscore_1.default.isUndefined(args[i]) ||
            args[i].length == 0 ||
            (underscore_1.default.isObject(args[i]) && underscore_1.default.isEmpty(args[i]))) {
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
    return val.replace(/[\t\n\r]/g, function (match) {
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
exports.toJSONSafeString = toJSONSafeString;
function getMaskObj(obj) {
    var maskObj = {};
    underscore_1.default.map(obj, function (value, key) {
        if (config_1.default.PARAMS_NEED_ENCRYPT_IN_LOG.includes(key)) {
            maskObj[key] = '***********';
        }
        else {
            maskObj[key] = value;
        }
    });
    return maskObj;
}
function hashPwd(pwd) {
    return __awaiter(this, void 0, void 0, function () {
        var TAG, logger, saltRounds, hashPwd_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    TAG = '[HashPwd]';
                    logger = new logger_1.default();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    bcrypt_1.default.compare;
                    saltRounds = config_1.default.PWD_SALT_ROUND;
                    return [4 /*yield*/, bcrypt_1.default.hash(pwd, saltRounds)];
                case 2:
                    hashPwd_1 = _a.sent();
                    return [2 /*return*/, hashPwd_1];
                case 3:
                    err_1 = _a.sent();
                    logger.error(TAG, "Generate admin pwd fail because ".concat(err_1));
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function createOrderId() {
    var orderId = '#' + (0, moment_1.default)(new Date()).format('YYYYMMDD') + crypto_1.default.randomBytes(4).toString('hex');
    return orderId;
}
var randomString = function (max) {
    var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (var i = 1; i < max; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
var randomNumber = function (max) {
    var possible = '0123456789';
    var text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (var i = 1; i < max; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
var compareHash = function (pwd, has) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, bcrypt_1.default.compare(pwd, has)];
}); }); };
var getCurrentDateTime = function (json) {
    var currentDate = json && json.inputDate ? new Date(json.inputDate) : new Date();
    currentDate.setSeconds(currentDate.getSeconds() + (json && json.addSeconds ? json.addSeconds : 0));
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    var day = ('0' + currentDate.getDate()).slice(-2);
    var hours = ('0' + currentDate.getHours()).slice(-2);
    var minutes = ('0' + currentDate.getMinutes()).slice(-2);
    var seconds = ('0' + currentDate.getSeconds()).slice(-2);
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
};
var formatDateTime = function (dateTimeStr, includeSeconds) {
    if (includeSeconds === void 0) { includeSeconds = false; }
    var date = dateTimeStr ? new Date(dateTimeStr) : new Date();
    if (isNaN(date.getTime()))
        return ''; // 避免無效日期
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    var seconds = String(date.getSeconds()).padStart(2, '0');
    return includeSeconds
        ? "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes, ":").concat(seconds)
        : "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes);
};
function floatAdd(a, b) {
    // 檢查 a 和 b 是否為數字
    if (typeof a !== 'number' || typeof b !== 'number') {
        return NaN; // 如果其中一個不是數字，則返回 NaN（Not a Number）
    }
    // 檢查 a 和 b 是否為浮點數
    if (a % 1 !== 0 || b % 1 !== 0) {
        // 如果是浮點數，則進行精確計算
        var multiplier = Math.pow(10, 10); // 假設需要精確到小數點後 10 位
        return (Math.round(a * multiplier) + Math.round(b * multiplier)) / multiplier;
    }
    else {
        // 如果是整數，則直接相加
        return a + b;
    }
}
exports.default = {
    isNull: isNull,
    replaceDatetime: replaceDatetime,
    toJSONSafeString: toJSONSafeString,
    getMaskObj: getMaskObj,
    hashPwd: hashPwd,
    createOrderId: createOrderId,
    randomString: randomString,
    compareHash: compareHash,
    randomNumber: randomNumber,
    getCurrentDateTime: getCurrentDateTime,
    formatDateTime: formatDateTime,
    floatAdd: floatAdd,
};

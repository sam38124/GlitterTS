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
var crypto_1 = require("crypto");
var bcrypt_1 = require("bcrypt");
var moment_1 = require("moment");
var Tool = /** @class */ (function () {
    function Tool() {
        var _this = this;
        this.aesDecrypt = function (data, key, iv, input, output, method) {
            if (input === void 0) { input = 'hex'; }
            if (output === void 0) { output = 'utf-8'; }
            if (method === void 0) { method = 'aes-256-cbc'; }
            while (key.length % 32 !== 0) {
                key += '\0';
            }
            while (iv.length % 16 !== 0) {
                iv += '\0';
            }
            var decipher = crypto_1.default.createDecipheriv(method, key, iv);
            var decrypted = decipher.update(data, input, output);
            decrypted += decipher.final(output);
            return decrypted;
        };
        this.compareHash = function (pwd, has) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, bcrypt_1.default.compare(pwd, has)];
        }); }); };
        this.nowTime = function () { return (0, moment_1.default)(new Date()).format('YYYY-MM-DD HH:mm:ss'); };
        this.sortObjectByKey = function (unordered) {
            var ordered = Object.keys(unordered)
                .sort()
                .reduce(function (obj, key) {
                obj[key] = unordered[key];
                return obj;
            }, {});
            return ordered;
        };
    }
    Tool.prototype.arrayEquals = function (a_array, b_array) {
        if (a_array.length != b_array.length)
            return false;
        for (var i = 0; i < b_array.length; i++) {
            if (a_array[i] instanceof Array && b_array[i] instanceof Array) {
                if (!a_array[i].equals(b_array[i]))
                    return false;
            }
            else if (a_array[i] != b_array[i]) {
                return false;
            }
        }
        return true;
    };
    Tool.prototype.randomString = function (max) {
        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (var i = 1; i < max; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };
    Tool.prototype.randomRumber = function (max) {
        var possible = '0123456789';
        var text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (var i = 1; i < max; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };
    Tool.prototype.CSVtoArray = function (text) {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text))
            return [];
        var a = []; // Initialize array to receive values.
        text.replace(re_value, // "Walk" the string using replace with callback.
        function (m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            // if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            if (m2 !== undefined)
                a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined)
                a.push(m3);
            return ''; // Return empty string.
        });
        // Handle special case of empty last value.
        if (/,\s*$/.test(text))
            a.push('');
        return a;
    };
    Tool.prototype.JsonToQueryString = function (data) {
        var queryString = Object.keys(data)
            .map(function (key) {
            var value = data[key];
            if (Array.isArray(value)) {
                return value.map(function (v) { return "".concat(encodeURIComponent(key), "[]=").concat(encodeURIComponent(v)); }).join('&');
            }
            return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value));
        })
            .join('&');
        return queryString;
    };
    Tool.prototype.queryStringToJSON = function (queryString) {
        var pairs = queryString.slice(1).split('&');
        var result = {};
        pairs.forEach(function (pair) {
            var _a = pair.split('='), key = _a[0], value = _a[1];
            result[key] = decodeURIComponent(value || '');
        });
        return result;
    };
    Tool.prototype.aesEncrypt = function (data, key, iv, input, output, method) {
        if (input === void 0) { input = 'utf-8'; }
        if (output === void 0) { output = 'hex'; }
        if (method === void 0) { method = 'aes-256-cbc'; }
        while (key.length % 32 !== 0) {
            key += '\0';
        }
        if (typeof iv === 'string') {
            while (iv.length % 16 !== 0) {
                iv += '\0';
            }
        }
        var cipher = crypto_1.default.createCipheriv(method, key, iv);
        var encrypted = cipher.update(data, input, output);
        encrypted += cipher.final(output);
        return encrypted;
    };
    return Tool;
}());
exports.default = Tool;

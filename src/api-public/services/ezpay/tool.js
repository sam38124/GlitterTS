"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
class Tool {
    constructor() {
        this.aesDecrypt = (data, key, iv, input = 'hex', output = 'utf-8', method = 'aes-256-cbc') => {
            while (key.length % 32 !== 0) {
                key += '\0';
            }
            while (iv.length % 16 !== 0) {
                iv += '\0';
            }
            const decipher = crypto_1.default.createDecipheriv(method, key, iv);
            let decrypted = decipher.update(data, input, output);
            decrypted += decipher.final(output);
            return decrypted;
        };
        this.compareHash = async (pwd, has) => bcrypt_1.default.compare(pwd, has);
        this.nowTime = () => (0, moment_1.default)(new Date()).format('YYYY-MM-DD HH:mm:ss');
        this.sortObjectByKey = (unordered) => {
            const ordered = Object.keys(unordered)
                .sort()
                .reduce((obj, key) => {
                obj[key] = unordered[key];
                return obj;
            }, {});
            return ordered;
        };
    }
    arrayEquals(a_array, b_array) {
        if (a_array.length != b_array.length)
            return false;
        for (let i = 0; i < b_array.length; i++) {
            if (a_array[i] instanceof Array && b_array[i] instanceof Array) {
                if (!a_array[i].equals(b_array[i]))
                    return false;
            }
            else if (a_array[i] != b_array[i]) {
                return false;
            }
        }
        return true;
    }
    randomString(max) {
        const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < max; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    randomRumber(max) {
        const possible = '0123456789';
        let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < max; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    CSVtoArray(text) {
        const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        if (!re_valid.test(text))
            return [];
        const a = [];
        text.replace(re_value, function (m0, m1, m2, m3) {
            if (m2 !== undefined)
                a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined)
                a.push(m3);
            return '';
        });
        if (/,\s*$/.test(text))
            a.push('');
        return a;
    }
    JsonToQueryString(data) {
        const queryString = Object.keys(data)
            .map((key) => {
            const value = data[key];
            if (Array.isArray(value)) {
                return value.map((v) => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`).join('&');
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
            .join('&');
        return queryString;
    }
    queryStringToJSON(queryString) {
        const pairs = queryString.slice(1).split('&');
        const result = {};
        pairs.forEach((pair) => {
            const [key, value] = pair.split('=');
            result[key] = decodeURIComponent(value || '');
        });
        return result;
    }
    aesEncrypt(data, key, iv, input = 'utf-8', output = 'hex', method = 'aes-256-cbc') {
        while (key.length % 32 !== 0) {
            key += '\0';
        }
        while (iv.length % 16 !== 0) {
            iv += '\0';
        }
        const cipher = crypto_1.default.createCipheriv(method, key, iv);
        let encrypted = cipher.update(data, input, output);
        encrypted += cipher.final(output);
        return encrypted;
    }
}
exports.default = Tool;
//# sourceMappingURL=tool.js.map
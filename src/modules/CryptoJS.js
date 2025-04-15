"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypter = void 0;
var CryptoJS = require("crypto-js");
var Crypter = /** @class */ (function () {
    function Crypter() {
    }
    Crypter.encrypt = function (key, value) {
        var key2 = CryptoJS.enc.Utf8.parse(key);
        return CryptoJS.AES.encrypt(value, key, { iv: key2 }).toString();
    };
    Crypter.decrypt = function (key, value) {
        return CryptoJS.AES.decrypt(value, key, {
            iv: CryptoJS.enc.Utf8.parse(key)
        }).toString(CryptoJS.enc.Utf8);
    };
    return Crypter;
}());
exports.Crypter = Crypter;

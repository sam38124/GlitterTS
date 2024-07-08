import * as CryptoJS from 'crypto-js';
export class Crypter {
    static encrypt(key, value) {
        const key2 = CryptoJS.enc.Utf8.parse(key);
        return CryptoJS.AES.encrypt(value, key, { iv: key2 }).toString();
    }
    static decrypt(key, value) {
        return CryptoJS.AES.decrypt(value, key, {
            iv: CryptoJS.enc.Utf8.parse(key)
        }).toString(CryptoJS.enc.Utf8);
    }
}

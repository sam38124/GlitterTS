import * as CryptoJS from 'crypto-js';

export class Crypter{

    public static encrypt(key:string, value:string){
        const key2 = CryptoJS.enc.Utf8.parse(key);
        return CryptoJS.AES.encrypt(value, key, {iv: key2}).toString();
    }

    public static decrypt(key:string, value:string){
        return CryptoJS.AES.decrypt(value, key, {
            iv: CryptoJS.enc.Utf8.parse(key)
        }).toString(CryptoJS.enc.Utf8);
    }
}
import crypto, { Encoding } from 'crypto';
import bcrypt from 'bcrypt';
import moment from 'moment';
interface IData {
    [key: string]: string | string[] | number;
}

type QueryParams = Record<string, string>;
export default class Tool {
    public arrayEquals(a_array: any[], b_array: any[]) {
        if (a_array.length != b_array.length) return false;

        for (let i = 0; i < b_array.length; i++) {
            if (a_array[i] instanceof Array && b_array[i] instanceof Array) {
                if (!a_array[i].equals(b_array[i])) return false;
            } else if (a_array[i] != b_array[i]) {
                return false;
            }
        }
        return true;
    }

    public randomString(max: number) {
        const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    public randomRumber(max: number) {
        const possible = '0123456789';
        let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    public CSVtoArray(text: string) {
        const re_valid =
            /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        const re_value =
            /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return [];
        const a = []; // Initialize array to receive values.
        text.replace(
            re_value, // "Walk" the string using replace with callback.
            function (m0: string | undefined, m1: string | undefined, m2: string | undefined, m3: string | undefined) {
                // Remove backslash from \' in single quoted values.
                // if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                // Remove backslash from \" in double quoted values.
                if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                else if (m3 !== undefined) a.push(m3);
                return ''; // Return empty string.
            }
        );
        // Handle special case of empty last value.
        if (/,\s*$/.test(text)) a.push('');
        return a;
    }

    public JsonToQueryString(data: IData): string {
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

    public queryStringToJSON(queryString: string): QueryParams {
        const pairs = queryString.slice(1).split('&');
        const result: QueryParams = {};
        pairs.forEach((pair) => {
            const [key, value] = pair.split('=');
            result[key] = decodeURIComponent(value || '');
        });
        return result;
    }

    public aesEncrypt(
        data: string,
        key: string,
        iv: string,
        input: Encoding = 'utf-8',
        output: Encoding = 'hex',
        method = 'aes-256-cbc'
    ): string {
        while (key.length % 32 !== 0) {
            key += '\0';
        }
        while (iv.length % 16 !== 0) {
            iv += '\0';
        }
        const cipher = crypto.createCipheriv(method, key, iv);
        let encrypted = cipher.update(data, input, output);
        encrypted += cipher.final(output);
        return encrypted;
    }

    public aesDecrypt = (
        data: string,
        key: string,
        iv: string,
        input: Encoding = 'hex',
        output: Encoding = 'utf-8',
        method = 'aes-256-cbc'
    ) => {
        while (key.length % 32 !== 0) {
            key += '\0';
        }
        while (iv.length % 16 !== 0) {
            iv += '\0';
        }
        const decipher = crypto.createDecipheriv(method, key, iv);
        let decrypted = decipher.update(data, input, output);
        decrypted += decipher.final(output);
        return decrypted;
    };

    public compareHash = async (pwd: string, has: string) => bcrypt.compare(pwd, has);

    public nowTime = () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    public sortObjectByKey = (unordered: { [k: string]: any }) => {
        const ordered = Object.keys(unordered)
            .sort()
            .reduce((obj: { [k: string]: any }, key) => {
                obj[key] = unordered[key];
                return obj;
            }, {});
        return ordered;
    };
}

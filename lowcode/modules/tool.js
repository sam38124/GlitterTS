export class Tool {
    static truncateString(str, maxLength = 25) {
        let length = 0;
        let truncated = '';
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (/[\u4e00-\u9fa5]/.test(char)) {
                length += 1;
            }
            else {
                length += 0.5;
            }
            if (length <= maxLength) {
                truncated += char;
            }
            else {
                break;
            }
        }
        if (length > maxLength) {
            truncated += '...';
        }
        return truncated;
    }
    static twenLength(str) {
        let length = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (/[\u4e00-\u9fa5]/.test(char)) {
                length += 1;
            }
            else {
                length += 0.5;
            }
        }
        return length;
    }
    static randomString(max) {
        let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < max; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    static formatDateTime(dateTimeStr, includeSeconds = false) {
        const date = dateTimeStr ? new Date(dateTimeStr) : new Date();
        if (isNaN(date.getTime()))
            return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return includeSeconds
            ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
            : `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    static ObjCompare(obj1, obj2) {
        const Obj1_keys = Object.keys(obj1);
        const Obj2_keys = Object.keys(obj2);
        if (Obj1_keys.length !== Obj2_keys.length) {
            return false;
        }
        for (let k of Obj1_keys) {
            if (obj1[k] !== obj2[k]) {
                return false;
            }
        }
        return true;
    }
    static floatAdd(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            return NaN;
        }
        if (a % 1 !== 0 || b % 1 !== 0) {
            const multiplier = Math.pow(10, 10);
            return (Math.round(a * multiplier) + Math.round(b * multiplier)) / multiplier;
        }
        else {
            return a + b;
        }
    }
    static isNowBetweenDates(startIso, endIso) {
        const now = new Date();
        const startDate = new Date(startIso);
        const endDate = new Date(endIso);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return true;
        }
        return now >= startDate && now <= endDate;
    }
}
